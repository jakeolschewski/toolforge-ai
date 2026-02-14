// Advanced Search API with Fuzzy Matching

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { searchTools, generateSuggestions, searchCache, createCacheKey } from '@/lib/search';
import type { ApiResponse, PaginatedResponse, Tool } from '@/types';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const query = searchParams.get('q') || searchParams.get('query') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
  const category = searchParams.get('category');
  const pricing = searchParams.get('pricing');
  const sortBy = searchParams.get('sortBy') || 'relevance';
  const featured = searchParams.get('featured');
  const suggestions = searchParams.get('suggestions') === 'true';

  try {
    // Check cache for non-paginated searches
    const cacheKey = createCacheKey({ query, category: category || undefined, pricing: pricing || undefined, sortBy });
    let allTools: Tool[] | null = null;

    if (page === 1 && !suggestions) {
      allTools = searchCache.get(cacheKey);
    }

    // If not in cache, fetch from database
    if (!allTools) {
      let dbQuery = supabase
        .from('tools')
        .select('*')
        .eq('status', 'published');

      // Apply filters
      if (category) {
        dbQuery = dbQuery.eq('category', category);
      }

      if (pricing) {
        dbQuery = dbQuery.eq('pricing_model', pricing);
      }

      if (featured === 'true') {
        dbQuery = dbQuery.eq('is_featured', true);
      }

      const { data, error } = await dbQuery;

      if (error) throw error;

      allTools = (data || []) as Tool[];

      // Apply fuzzy search if query exists
      if (query && query.trim().length > 0) {
        allTools = searchTools(allTools, query, 0.1);
      } else {
        // Apply sorting for non-search queries
        switch (sortBy) {
          case 'rating':
            allTools.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            break;
          case 'popular':
            allTools.sort((a, b) => b.views - a.views);
            break;
          case 'name':
            allTools.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case 'newest':
            allTools.sort((a, b) =>
              new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
            break;
          case 'price':
            allTools.sort((a, b) => {
              const priceA = parseFloat(a.starting_price?.replace(/[^0-9.]/g, '') || '0');
              const priceB = parseFloat(b.starting_price?.replace(/[^0-9.]/g, '') || '0');
              return priceA - priceB;
            });
            break;
        }
      }

      // Cache results
      if (page === 1 && !suggestions) {
        searchCache.set(cacheKey, allTools);
      }
    }

    // Return suggestions if requested
    if (suggestions) {
      const suggestionList = generateSuggestions(allTools, query, 10);
      return NextResponse.json<ApiResponse>(
        {
          success: true,
          data: suggestionList,
        },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
          },
        }
      );
    }

    // Paginate results
    const total = allTools.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedTools = allTools.slice(offset, offset + limit);

    const response: PaginatedResponse<Tool> = {
      data: paginatedTools,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: response,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Search failed',
      },
      { status: 500 }
    );
  }
}

// POST endpoint for tracking search analytics
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, results_count, clicked_tool_id } = body;

    // Track search analytics in database
    // You can create a search_analytics table for this
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _analyticsData = {
      query: query || '',
      results_count: results_count || 0,
      clicked_tool_id: clicked_tool_id || null,
      timestamp: new Date().toISOString(),
      user_agent: request.headers.get('user-agent') || '',
      ip_hash: hashIP(request.headers.get('x-forwarded-for') || ''),
    };

    // Store in database (optional - requires search_analytics table)
    // await supabase.from('search_analytics').insert(analyticsData);

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Search analytics tracked',
    });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: 'Failed to track analytics',
      },
      { status: 500 }
    );
  }
}

// Simple IP hashing for privacy
function hashIP(ip: string): string {
  if (!ip) return '';

  let hash = 0;
  for (let i = 0; i < ip.length; i++) {
    const char = ip.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(16);
}
