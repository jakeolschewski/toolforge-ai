// Blog API - List and Create Blog Posts

import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import type { ApiResponse, PaginatedResponse, BlogPost } from '@/types';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

// GET /api/blog - Fetch blog posts with filtering and pagination
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const page = parseInt(searchParams.get('page') || '1');
  const limit = Math.min(parseInt(searchParams.get('limit') || '12'), 100);
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const tag = searchParams.get('tag');
  const status = searchParams.get('status') || 'published';

  const offset = (page - 1) * limit;

  try {
    let query = supabase
      .from('blog_posts')
      .select('*', { count: 'exact' })
      .eq('status', status);

    // Filters
    if (category) {
      query = query.eq('category', category);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%,excerpt.ilike.%${search}%`);
    }

    if (tag) {
      query = query.contains('tags', [tag]);
    }

    // Sort by published date or created date
    query = query.order('published_at', { ascending: false, nullsFirst: false });

    // Pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    const response: PaginatedResponse<BlogPost> = {
      data: (data || []) as BlogPost[],
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
        error: error instanceof Error ? error.message : 'Failed to fetch blog posts',
      },
      { status: 500 }
    );
  }
}

// POST /api/blog - Create a new blog post (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Calculate read time (rough estimate: 200 words per minute)
    const wordCount = body.content?.split(/\s+/).length || 0;
    const readTime = Math.ceil(wordCount / 200);

    // Generate slug if not provided
    const slug = body.slug || body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const postData = {
      slug,
      title: body.title,
      content: body.content,
      excerpt: body.excerpt,
      author: body.author || 'ToolForge Team',
      featured_image: body.featured_image,
      category: body.category,
      tags: body.tags || [],
      status: body.status || 'draft',
      seo_title: body.seo_title,
      seo_description: body.seo_description,
      keywords: body.keywords || [],
      read_time: readTime,
      published_at: body.status === 'published' ? new Date().toISOString() : null,
    };

    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .insert([postData])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: data,
        message: 'Blog post created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create blog post',
      },
      { status: 500 }
    );
  }
}
