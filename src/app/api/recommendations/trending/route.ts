// Trending Tools API - Get most viewed tools this week

import { NextRequest, NextResponse } from 'next/server';
import { getTrendingTools } from '@/lib/recommendations';
import type { ApiResponse } from '@/types';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const CACHE_DURATION = 60 * 15; // Cache for 15 minutes

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    const trending = await getTrendingTools(limit);

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: {
          trending,
          count: trending.length,
          lastUpdated: new Date().toISOString()
        }
      },
      {
        headers: {
          'Cache-Control': `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${CACHE_DURATION * 2}`
        }
      }
    );
  } catch (error) {
    console.error('Trending tools API error:', error);

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: 'Failed to fetch trending tools'
      },
      { status: 500 }
    );
  }
}
