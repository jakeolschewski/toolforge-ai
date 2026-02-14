// Workflow Vault API - Generate Secure Download Links

import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { supabaseAdmin } from '@/lib/supabase';
import { isOwnerToken } from '@/lib/owner-auth';
import type { ApiResponse } from '@/types';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const isOwner = isOwnerToken(token);

    let userId = 'owner';

    if (!isOwner) {
      const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

      if (authError || !user) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: 'Invalid authentication token' },
          { status: 401 }
        );
      }
      userId = user.id;
    }

    const body = await request.json();
    const { workflow_id } = body;

    if (!workflow_id) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Missing workflow_id' },
        { status: 400 }
      );
    }

    // Fetch workflow details
    const { data: workflow, error: workflowError } = await supabaseAdmin
      .from('vault_workflows')
      .select('*')
      .eq('id', workflow_id)
      .eq('status', 'published')
      .single();

    if (workflowError || !workflow) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Workflow not found' },
        { status: 404 }
      );
    }

    // Owner bypass — full access to everything
    let hasAccess = isOwner;

    if (!hasAccess) {
      if (workflow.pricing_type === 'free') {
        hasAccess = true;
      } else if (workflow.pricing_type === 'premium') {
        const { data: purchase } = await supabaseAdmin
          .from('vault_purchases')
          .select('id')
          .eq('user_id', userId)
          .eq('workflow_id', workflow_id)
          .eq('payment_status', 'completed')
          .eq('access_granted', true)
          .single();

        hasAccess = !!purchase;
      } else if (workflow.pricing_type === 'members_only') {
        const { data: membership } = await supabaseAdmin
          .from('vault_memberships')
          .select('id')
          .eq('user_id', userId)
          .eq('status', 'active')
          .single();

        if (membership) {
          hasAccess = true;
        } else {
          const { data: purchase } = await supabaseAdmin
            .from('vault_purchases')
            .select('id')
            .eq('user_id', userId)
            .eq('workflow_id', workflow_id)
            .eq('payment_status', 'completed')
            .eq('access_granted', true)
            .single();

          hasAccess = !!purchase;
        }
      }
    }

    if (!hasAccess) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Access denied - Purchase required' },
        { status: 403 }
      );
    }

    // Generate secure download token
    const downloadToken = generateDownloadToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // Token valid for 24 hours

    // Store download token
    const { error: tokenError } = await supabaseAdmin
      .from('vault_download_tokens')
      .insert({
        token: downloadToken,
        workflow_id,
        user_id: userId,
        expires_at: expiresAt.toISOString(),
        downloads_remaining: 5, // Allow 5 downloads with this token
      });

    if (tokenError) throw tokenError;

    // Log the download
    await supabaseAdmin.from('vault_download_logs').insert({
      workflow_id,
      user_id: userId,
      download_token: downloadToken,
    });

    // Generate download URL
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const downloadUrl = `${baseUrl}/api/vault/download/${downloadToken}`;

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        download_url: downloadUrl,
        expires_at: expiresAt.toISOString(),
        downloads_remaining: 5,
        workflow: {
          id: workflow.id,
          slug: workflow.slug,
          title: workflow.title,
          file_type: workflow.file_type,
          file_size: workflow.file_size,
        },
      },
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate download link',
      },
      { status: 500 }
    );
  }
}

// GET endpoint to actually download the file
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const token = pathParts[pathParts.length - 1];

    if (!token) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Invalid download token' },
        { status: 400 }
      );
    }

    // Verify token
    const { data: tokenData, error: tokenError } = await supabaseAdmin
      .from('vault_download_tokens')
      .select('*')
      .eq('token', token)
      .single();

    if (tokenError || !tokenData) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Invalid or expired download token' },
        { status: 403 }
      );
    }

    // Check expiration
    if (new Date(tokenData.expires_at) < new Date()) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Download token has expired' },
        { status: 403 }
      );
    }

    // Check downloads remaining
    if (tokenData.downloads_remaining <= 0) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Download limit exceeded for this token' },
        { status: 403 }
      );
    }

    // Get workflow file URL
    const { data: workflow, error: workflowError } = await supabaseAdmin
      .from('vault_workflows')
      .select('file_url, title, file_type')
      .eq('id', tokenData.workflow_id)
      .single();

    if (workflowError || !workflow) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Workflow not found' },
        { status: 404 }
      );
    }

    // Decrement downloads remaining
    await supabaseAdmin
      .from('vault_download_tokens')
      .update({ downloads_remaining: tokenData.downloads_remaining - 1 })
      .eq('token', token);

    // Redirect to file URL or return file content
    // For Supabase Storage, you might generate a signed URL here
    return NextResponse.redirect(workflow.file_url);
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Download failed',
      },
      { status: 500 }
    );
  }
}

function generateDownloadToken(): string {
  return randomBytes(32).toString('hex');
}
