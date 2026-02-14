// User Tool Submission API
// Allows users to suggest new tools for the platform

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { sanitizeText } from '@/utils/helpers';
import { categorizeTool } from '@/utils/ai-categorizer';
import { sendEmail } from '@/lib/email';
import type { ApiResponse } from '@/types';
import { z } from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Validation schema for tool submission
const toolSubmissionSchema = z.object({
  toolName: z.string().min(2, 'Tool name must be at least 2 characters').max(200),
  toolUrl: z.string().url('Invalid URL'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000),
  category: z.string().optional(),
  submitterName: z.string().min(2).max(100).optional(),
  submitterEmail: z.string().email('Invalid email').optional(),
  reason: z.string().max(500).optional(),
});

type ToolSubmission = z.infer<typeof toolSubmissionSchema>;

/**
 * POST - Submit a new tool suggestion
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = toolSubmissionSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: validationResult.error.errors[0].message,
        },
        { status: 400 }
      );
    }

    const data: ToolSubmission = validationResult.data;

    // Check for duplicates
    const { data: existingByName } = await supabaseAdmin
      .from('scraped_sources')
      .select('id, status')
      .eq('tool_name', data.toolName)
      .maybeSingle();

    if (existingByName) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'This tool has already been submitted',
        },
        { status: 409 }
      );
    }

    const { data: existingByUrl } = await supabaseAdmin
      .from('scraped_sources')
      .select('id, status')
      .eq('tool_url', data.toolUrl)
      .maybeSingle();

    if (existingByUrl) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'This tool URL has already been submitted',
        },
        { status: 409 }
      );
    }

    // Check if already exists as a published tool
    const { data: existingTool } = await supabaseAdmin
      .from('tools')
      .select('id')
      .eq('website_url', data.toolUrl)
      .maybeSingle();

    if (existingTool) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'This tool is already in our database',
        },
        { status: 409 }
      );
    }

    // Auto-categorize if no category provided
    const category = data.category || categorizeTool({
      tool_name: data.toolName,
      tool_url: data.toolUrl,
      description: data.description,
    });

    // Save to database
    const { data: newSubmission, error } = await supabaseAdmin
      .from('scraped_sources')
      .insert({
        source_url: 'user-submission',
        tool_name: sanitizeText(data.toolName),
        tool_url: data.toolUrl,
        description: sanitizeText(data.description),
        category,
        raw_data: JSON.stringify({
          submitterName: data.submitterName,
          submitterEmail: data.submitterEmail,
          reason: data.reason,
          submittedAt: new Date().toISOString(),
          ip: request.headers.get('x-forwarded-for') || 'unknown',
        }),
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;

    // Send notification email to admin
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      try {
        await sendEmail({
          to: adminEmail,
          subject: `New Tool Submission: ${data.toolName}`,
          html: `
            <h2>New Tool Submitted by User</h2>
            <p><strong>Tool Name:</strong> ${data.toolName}</p>
            <p><strong>URL:</strong> <a href="${data.toolUrl}">${data.toolUrl}</a></p>
            <p><strong>Description:</strong> ${data.description}</p>
            <p><strong>Category:</strong> ${category}</p>
            ${data.submitterName ? `<p><strong>Submitted by:</strong> ${data.submitterName}</p>` : ''}
            ${data.submitterEmail ? `<p><strong>Email:</strong> ${data.submitterEmail}</p>` : ''}
            ${data.reason ? `<p><strong>Reason:</strong> ${data.reason}</p>` : ''}
            <p><a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://toolforge.ai'}/admin/drafts">Review in Admin Dashboard</a></p>
          `,
        });
      } catch (emailError) {
        console.error('Failed to send submission notification:', emailError);
      }
    }

    // Send confirmation email to submitter if provided
    if (data.submitterEmail) {
      try {
        await sendEmail({
          to: data.submitterEmail,
          subject: 'Thank you for your tool submission',
          html: `
            <h2>Thank you for submitting ${data.toolName}!</h2>
            <p>We've received your tool submission and our team will review it shortly.</p>
            <p>If approved, ${data.toolName} will be added to our directory and you'll help other users discover this great tool.</p>
            <p><strong>Submitted Details:</strong></p>
            <ul>
              <li>Tool: ${data.toolName}</li>
              <li>URL: <a href="${data.toolUrl}">${data.toolUrl}</a></li>
              <li>Category: ${category}</li>
            </ul>
            <p>Best regards,<br>The ToolForge AI Team</p>
          `,
        });
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
      }
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        id: newSubmission.id,
        message: 'Tool submitted successfully! Our team will review it shortly.',
      },
    });
  } catch (error) {
    console.error('Tool submission error:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to submit tool',
      },
      { status: 500 }
    );
  }
}

/**
 * GET - Get submission statistics (optional, for transparency)
 */
export async function GET(_request: NextRequest) {
  try {
    const { count: pendingCount } = await supabaseAdmin
      .from('scraped_sources')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')
      .eq('source_url', 'user-submission');

    const { count: processedCount } = await supabaseAdmin
      .from('scraped_sources')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'processed')
      .eq('source_url', 'user-submission');

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        pending: pendingCount || 0,
        processed: processedCount || 0,
        message: 'User submissions are reviewed within 24-48 hours',
      },
    });
  } catch {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: 'Failed to fetch statistics',
      },
      { status: 500 }
    );
  }
}
