// Comparison API - List and Create Comparisons

import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import type { ApiResponse, PaginatedResponse, Comparison } from '@/types';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

// GET /api/compare - Fetch comparisons
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const page = parseInt(searchParams.get('page') || '1');
  const limit = Math.min(parseInt(searchParams.get('limit') || '12'), 100);
  const toolId = searchParams.get('tool_id');
  const status = searchParams.get('status') || 'published';

  const offset = (page - 1) * limit;

  try {
    let query = supabase
      .from('comparisons')
      .select('*', { count: 'exact' })
      .eq('status', status);

    // Filter by tool ID if provided
    if (toolId) {
      query = query.contains('tool_ids', [toolId]);
    }

    // Sort by most viewed
    query = query.order('views', { ascending: false });

    // Pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    const response: PaginatedResponse<Comparison> = {
      data: (data || []) as Comparison[],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    };

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: response,
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
        error: error instanceof Error ? error.message : 'Failed to fetch comparisons',
      },
      { status: 500 }
    );
  }
}

// POST /api/compare - Create a new comparison (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate tool_ids
    if (!body.tool_ids || !Array.isArray(body.tool_ids) || body.tool_ids.length < 2) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'At least 2 tools are required for comparison',
        },
        { status: 400 }
      );
    }

    // Generate slug if not provided
    const slug = body.slug || body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const comparisonData = {
      slug,
      title: body.title,
      description: body.description,
      tool_ids: body.tool_ids,
      comparison_data: body.comparison_data || {},
      winner_tool_id: body.winner_tool_id,
      seo_title: body.seo_title,
      seo_description: body.seo_description,
      keywords: body.keywords || [],
      status: body.status || 'published',
    };

    const { data, error } = await supabaseAdmin
      .from('comparisons')
      .insert([comparisonData])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: data,
        message: 'Comparison created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create comparison',
      },
      { status: 500 }
    );
  }
}
