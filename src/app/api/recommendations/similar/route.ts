// Similar Tools API - Content-based recommendations

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getSimilarTools } from '@/lib/recommendations';
import type { ApiResponse } from '@/types';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const CACHE_DURATION = 60 * 10; // Cache for 10 minutes

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const toolId = searchParams.get('toolId');
    const limit = parseInt(searchParams.get('limit') || '6');

    if (!toolId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Tool ID required' },
        { status: 400 }
      );
    }

    // Fetch the tool
    const { data: tool, error } = await supabase
      .from('tools')
      .select('*')
      .eq('id', toolId)
      .eq('status', 'published')
      .single();

    if (error || !tool) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Tool not found' },
        { status: 404 }
      );
    }

    // Get similar tools
    const recommendations = await getSimilarTools(tool, limit);

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: {
          recommendations,
          count: recommendations.length,
          basedOn: {
            id: tool.id,
            name: tool.name,
            category: tool.category
          }
        }
      },
      {
        headers: {
          'Cache-Control': `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${CACHE_DURATION * 2}`
        }
      }
    );
  } catch (error) {
    console.error('Similar tools API error:', error);

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: 'Failed to fetch similar tools'
      },
      { status: 500 }
    );
  }
}
