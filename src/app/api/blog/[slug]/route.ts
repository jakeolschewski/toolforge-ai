// Blog API - Single Post Operations

import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import type { ApiResponse, BlogPost } from '@/types';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

// GET /api/blog/[slug] - Fetch single blog post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error) throw error;

    if (!data) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Blog post not found',
        },
        { status: 404 }
      );
    }

    // Increment view count
    supabaseAdmin
      .from('blog_posts')
      .update({ views: (data.views || 0) + 1 })
      .eq('id', data.id)
      .then(() => {}, console.error);

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: data as BlogPost,
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
        error: error instanceof Error ? error.message : 'Failed to fetch blog post',
      },
      { status: 500 }
    );
  }
}

// PUT /api/blog/[slug] - Update blog post (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const body = await request.json();
    const { slug } = await params;

    // Calculate read time if content changed
    let readTime = body.read_time;
    if (body.content) {
      const wordCount = body.content.split(/\s+/).length;
      readTime = Math.ceil(wordCount / 200);
    }

    const updateData: Partial<BlogPost> = {
      ...body,
      read_time: readTime,
    };

    // Set published_at if status changes to published
    if (body.status === 'published' && !body.published_at) {
      updateData.published_at = new Date().toISOString();
    }

    delete updateData.id;
    delete updateData.created_at;
    delete updateData.views;

    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .update(updateData)
      .eq('slug', slug)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json<ApiResponse>({
      success: true,
      data: data,
      message: 'Blog post updated successfully',
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update blog post',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/blog/[slug] - Delete blog post (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { error } = await supabaseAdmin
      .from('blog_posts')
      .delete()
      .eq('slug', slug);

    if (error) throw error;

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Blog post deleted successfully',
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete blog post',
      },
      { status: 500 }
    );
  }
}
