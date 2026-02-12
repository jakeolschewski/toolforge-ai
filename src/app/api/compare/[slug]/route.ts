// Comparison API - Single Comparison Operations

import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import type { ApiResponse, Comparison } from '@/types';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

// GET /api/compare/[slug] - Fetch single comparison with tools data
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { data: comparison, error: compError } = await supabase
      .from('comparisons')
      .select('*')
      .eq('slug', params.slug)
      .eq('status', 'published')
      .single();

    if (compError) throw compError;

    if (!comparison) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Comparison not found',
        },
        { status: 404 }
      );
    }

    // Fetch the tools being compared
    const { data: tools, error: toolsError } = await supabase
      .from('tools')
      .select('*')
      .in('id', comparison.tool_ids);

    if (toolsError) throw toolsError;

    // Increment view count
    await supabaseAdmin
      .from('comparisons')
      .update({ views: (comparison.views || 0) + 1 })
      .eq('id', comparison.id);

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: {
          ...comparison,
          tools: tools || [],
        },
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=3600',
        },
      }
    );
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch comparison',
      },
      { status: 500 }
    );
  }
}

// PUT /api/compare/[slug] - Update comparison (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const body = await request.json();

    const updateData: Partial<Comparison> = { ...body };
    delete updateData.id;
    delete updateData.created_at;
    delete updateData.views;

    const { data, error } = await supabaseAdmin
      .from('comparisons')
      .update(updateData)
      .eq('slug', params.slug)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json<ApiResponse>({
      success: true,
      data: data,
      message: 'Comparison updated successfully',
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update comparison',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/compare/[slug] - Delete comparison (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { error } = await supabaseAdmin
      .from('comparisons')
      .delete()
      .eq('slug', params.slug);

    if (error) throw error;

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Comparison deleted successfully',
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete comparison',
      },
      { status: 500 }
    );
  }
}
