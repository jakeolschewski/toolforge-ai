// Collections API - List and Create Collections

import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import type { ApiResponse, PaginatedResponse, Collection } from '@/types';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

// GET /api/collections - Fetch collections
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const page = parseInt(searchParams.get('page') || '1');
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
  const status = searchParams.get('status') || 'published';

  const offset = (page - 1) * limit;

  try {
    let query = supabase
      .from('collections')
      .select('*', { count: 'exact' })
      .eq('status', status);

    // Sort by order index, then by views
    query = query.order('order_index', { ascending: true })
      .order('views', { ascending: false });

    // Pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    const response: PaginatedResponse<Collection> = {
      data: (data || []) as Collection[],
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
        error: error instanceof Error ? error.message : 'Failed to fetch collections',
      },
      { status: 500 }
    );
  }
}

// POST /api/collections - Create a new collection (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Generate slug if not provided
    const slug = body.slug || body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const collectionData = {
      slug,
      name: body.name,
      description: body.description,
      tool_ids: body.tool_ids || [],
      icon: body.icon,
      color: body.color,
      featured_image: body.featured_image,
      seo_title: body.seo_title,
      seo_description: body.seo_description,
      keywords: body.keywords || [],
      order_index: body.order_index || 0,
      status: body.status || 'published',
    };

    const { data, error } = await supabaseAdmin
      .from('collections')
      .insert([collectionData])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: data,
        message: 'Collection created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create collection',
      },
      { status: 500 }
    );
  }
}
