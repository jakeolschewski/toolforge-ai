// Public API - Fetch Tools

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { ApiResponse, PaginatedResponse, Tool } from '@/types';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const page = parseInt(searchParams.get('page') || '1');
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
  const category = searchParams.get('category');
  const pricing = searchParams.get('pricing');
  const search = searchParams.get('search');
  const featured = searchParams.get('featured');
  const sortBy = searchParams.get('sortBy') || 'newest';

  const offset = (page - 1) * limit;

  try {
    let query = supabase
      .from('tools')
      .select('*', { count: 'exact' })
      .eq('status', 'published');

    // Filters
    if (category) {
      query = query.eq('category', category);
    }

    if (pricing) {
      query = query.eq('pricing_model', pricing);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,tags.cs.{${search}}`);
    }

    if (featured === 'true') {
      query = query.eq('is_featured', true);
    }

    // Sorting
    switch (sortBy) {
      case 'rating':
        query = query.order('rating', { ascending: false });
        break;
      case 'popular':
        query = query.order('views', { ascending: false });
        break;
      case 'name':
        query = query.order('name', { ascending: true });
        break;
      case 'newest':
      default:
        query = query.order('created_at', { ascending: false });
    }

    // Pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    const response: PaginatedResponse<Tool> = {
      data: (data || []) as Tool[],
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
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch tools',
      },
      { status: 500 }
    );
  }
}
