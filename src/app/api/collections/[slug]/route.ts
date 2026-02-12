// Collections API - Single Collection Operations

import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import type { ApiResponse, Collection } from '@/types';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

// GET /api/collections/[slug] - Fetch single collection with tools data
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { data: collection, error: collError } = await supabase
      .from('collections')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (collError) throw collError;

    if (!collection) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Collection not found',
        },
        { status: 404 }
      );
    }

    // Fetch the tools in this collection
    const { data: tools, error: toolsError } = await supabase
      .from('tools')
      .select('*')
      .in('id', collection.tool_ids)
      .eq('status', 'published');

    if (toolsError) throw toolsError;

    // Increment view count
    supabaseAdmin
      .from('collections')
      .update({ views: (collection.views || 0) + 1 })
      .eq('id', collection.id)
      .then(() => {}, console.error);

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: {
          ...collection,
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
        error: error instanceof Error ? error.message : 'Failed to fetch collection',
      },
      { status: 500 }
    );
  }
}

// PUT /api/collections/[slug] - Update collection (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const body = await request.json();
    const { slug } = await params;

    const updateData: Partial<Collection> = { ...body };
    delete updateData.id;
    delete updateData.created_at;
    delete updateData.views;

    const { data, error } = await supabaseAdmin
      .from('collections')
      .update(updateData)
      .eq('slug', slug)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json<ApiResponse>({
      success: true,
      data: data,
      message: 'Collection updated successfully',
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update collection',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/collections/[slug] - Delete collection (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { error } = await supabaseAdmin
      .from('collections')
      .delete()
      .eq('slug', slug);

    if (error) throw error;

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Collection deleted successfully',
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete collection',
      },
      { status: 500 }
    );
  }
}
