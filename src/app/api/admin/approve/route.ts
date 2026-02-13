// Admin API - Approve and Auto-generate Content for Scraped Tools

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { approveScrapedSource } from '@/lib/auto-approve';
import type { ApiResponse, ScrapedSource } from '@/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function verifyAdmin(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return true;
  return authHeader === `Bearer ${adminPassword}`;
}

// GET - Fetch pending scraped sources
export async function GET(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '20');

  try {
    const { data, error } = await supabaseAdmin
      .from('scraped_sources')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        pending: data,
        count: data?.length || 0,
      },
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: error instanceof Error ? error.message : 'Failed to fetch pending' },
      { status: 500 }
    );
  }
}

// POST - Approve and convert scraped source to full tool + review
export async function POST(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { sourceId, autoGenerate = true } = body;

    if (!sourceId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Source ID required' },
        { status: 400 }
      );
    }

    // Fetch the scraped source
    const { data: source, error: fetchError } = await supabaseAdmin
      .from('scraped_sources')
      .select('*')
      .eq('id', sourceId)
      .single();

    if (fetchError || !source) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Source not found' },
        { status: 404 }
      );
    }

    // Use shared approval function
    const result = await approveScrapedSource(source as ScrapedSource, {
      autoGenerate,
      status: autoGenerate ? 'published' : 'draft',
    });

    if (result.alreadyExists) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Tool already exists',
        data: { existingTool: result.tool },
      });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        tool: result.tool,
        review: result.review,
      },
      message: 'Tool approved and published successfully',
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: error instanceof Error ? error.message : 'Failed to approve tool' },
      { status: 500 }
    );
  }
}

// DELETE - Ignore a scraped source
export async function DELETE(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Source ID required' },
      { status: 400 }
    );
  }

  try {
    const { error } = await supabaseAdmin
      .from('scraped_sources')
      .update({ status: 'ignored' })
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Source ignored',
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: error instanceof Error ? error.message : 'Failed to ignore source' },
      { status: 500 }
    );
  }
}
