// Recommendations API - Personalized tool recommendations

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import {
  getPersonalizedRecommendations,
  getSimilarTools,
  getHybridRecommendations,
  type UserBrowsingHistory
} from '@/lib/recommendations';
import type { ApiResponse } from '@/types';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

// Cache recommendations for 5 minutes
const CACHE_DURATION = 60 * 5;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const toolId = searchParams.get('toolId');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _userId = searchParams.get('userId'); // Optional for logged-in users
    const limit = parseInt(searchParams.get('limit') || '6');
    const type = searchParams.get('type') || 'hybrid'; // hybrid, similar, personalized

    // Get user browsing history from cookies
    const historyHeader = request.cookies.get('toolforge_history');
    let userHistory: UserBrowsingHistory | undefined;

    if (historyHeader) {
      try {
        userHistory = JSON.parse(historyHeader.value);
      } catch (error) {
        console.error('Failed to parse user history:', error);
      }
    }

    let recommendations;

    if (type === 'personalized' && userHistory) {
      // Personalized recommendations based on browsing history
      recommendations = await getPersonalizedRecommendations(userHistory, limit);
    } else if (type === 'similar' && toolId) {
      // Content-based similar tools
      const { data: tool } = await supabase
        .from('tools')
        .select('*')
        .eq('id', toolId)
        .single();

      if (!tool) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: 'Tool not found' },
          { status: 404 }
        );
      }

      recommendations = await getSimilarTools(tool, limit);
    } else if (type === 'hybrid' && toolId) {
      // Hybrid recommendations (best results)
      const { data: tool } = await supabase
        .from('tools')
        .select('*')
        .eq('id', toolId)
        .single();

      if (!tool) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: 'Tool not found' },
          { status: 404 }
        );
      }

      recommendations = await getHybridRecommendations(tool, userHistory, limit);
    } else {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Invalid parameters' },
        { status: 400 }
      );
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: {
          recommendations,
          count: recommendations.length,
          type
        }
      },
      {
        headers: {
          'Cache-Control': `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${CACHE_DURATION * 2}`
        }
      }
    );
  } catch (error) {
    console.error('Recommendations API error:', error);

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: 'Failed to generate recommendations'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { toolId, action, metadata } = body;

    if (!toolId || !action) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Tool ID and action required' },
        { status: 400 }
      );
    }

    // Track recommendation interaction
    if (action === 'click') {
      await supabase.from('recommendation_clicks').insert({
        recommended_tool_id: toolId,
        source_tool_id: metadata?.sourceToolId,
        recommendation_type: metadata?.type || 'unknown',
        created_at: new Date().toISOString()
      });
    } else if (action === 'impression') {
      await supabase.from('recommendation_impressions').insert({
        tool_id: toolId,
        recommendation_type: metadata?.type || 'unknown',
        created_at: new Date().toISOString()
      });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Interaction tracked'
    });
  } catch (error) {
    console.error('Recommendation tracking error:', error);

    return NextResponse.json<ApiResponse>({
      success: false,
      message: 'Tracking failed'
    });
  }
}
