// Recommendation Metrics API - Track recommendation performance

import { NextRequest, NextResponse } from 'next/server';
import { getRecommendationMetrics } from '@/lib/recommendations';
import type { ApiResponse } from '@/types';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');

    // Validate admin access (add your auth check here)
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const metrics = await getRecommendationMetrics(days);

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        metrics,
        period: `Last ${days} days`,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Recommendation metrics API error:', error);

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: 'Failed to fetch recommendation metrics'
      },
      { status: 500 }
    );
  }
}
