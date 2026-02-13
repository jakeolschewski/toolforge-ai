// Affiliate Tracking API
// Tracks clicks, conversions, and calculates performance metrics

import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { affiliateManager, type AffiliateProgram } from '@/lib/affiliate-manager';
import type { ApiResponse } from '@/types';

export const dynamic = 'force-dynamic';

interface TrackClickRequest {
  toolId: string;
  program: AffiliateProgram;
  trackingId: string;
  metadata?: Record<string, any>;
}

interface TrackConversionRequest {
  trackingId: string;
  revenue: number;
  commissionRate?: number;
  orderId?: string;
  productId?: string;
  metadata?: Record<string, any>;
}

// Track affiliate click
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type');

    if (!contentType?.includes('application/json')) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Content-Type must be application/json' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { action } = body;

    if (action === 'click') {
      return handleClickTracking(request, body as TrackClickRequest);
    } else if (action === 'conversion') {
      return handleConversionTracking(request, body as TrackConversionRequest);
    } else if (action === 'performance') {
      return handlePerformanceQuery(request, body);
    } else {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Invalid action. Use "click", "conversion", or "performance"' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Affiliate tracking error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle click tracking
async function handleClickTracking(
  request: NextRequest,
  body: TrackClickRequest
): Promise<NextResponse> {
  const { toolId, program, trackingId, metadata } = body;

  if (!toolId || !program || !trackingId) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Missing required fields: toolId, program, trackingId' },
      { status: 400 }
    );
  }

  try {
    // Get request metadata
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const referrer = request.headers.get('referer') || 'direct';

    // Hash IP for privacy
    const ipHash = await hashString(ip);

    // Track click using affiliate manager
    await affiliateManager.trackClick(toolId, program, trackingId, {
      ...metadata,
      ip_hash: ipHash,
      user_agent: userAgent,
      referrer,
    });

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: 'Click tracked successfully',
        data: { trackingId },
      },
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch (error) {
    console.error('Click tracking error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to track click' },
      { status: 500 }
    );
  }
}

// Handle conversion tracking
async function handleConversionTracking(
  request: NextRequest,
  body: TrackConversionRequest
): Promise<NextResponse> {
  const { trackingId, revenue, commissionRate, orderId, productId, metadata } = body;

  if (!trackingId || revenue === undefined) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Missing required fields: trackingId, revenue' },
      { status: 400 }
    );
  }

  try {
    // Record conversion
    await affiliateManager.recordConversion(trackingId, revenue, commissionRate);

    // Additional conversion data
    if (orderId || productId || metadata) {
      await supabaseAdmin.from('affiliate_conversions').update({
        order_id: orderId,
        product_id: productId,
        metadata,
      }).eq('tracking_id', trackingId);
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: 'Conversion recorded successfully',
        data: {
          trackingId,
          revenue,
          commission: revenue * (commissionRate || 0),
        },
      },
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch (error) {
    console.error('Conversion tracking error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to record conversion' },
      { status: 500 }
    );
  }
}

// Handle performance metrics query
async function handlePerformanceQuery(
  request: NextRequest,
  body: { toolId?: string; program?: AffiliateProgram; days?: number }
): Promise<NextResponse> {
  const { toolId, program, days = 30 } = body;

  try {
    if (toolId) {
      // Get performance for specific tool
      const metrics = await affiliateManager.getPerformanceMetrics(toolId);

      return NextResponse.json<ApiResponse>({
        success: true,
        data: metrics,
      });
    } else if (program) {
      // Get EPC for specific program
      const epc = await affiliateManager.getEPC(program, days);

      return NextResponse.json<ApiResponse>({
        success: true,
        data: { program, epc, days },
      });
    } else {
      // Get overall performance
      const { data: allPerformance } = await supabaseAdmin
        .from('affiliate_performance')
        .select('*')
        .order('epc', { ascending: false })
        .limit(100);

      return NextResponse.json<ApiResponse>({
        success: true,
        data: allPerformance || [],
      });
    }
  } catch (error) {
    console.error('Performance query error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to fetch performance data' },
      { status: 500 }
    );
  }
}

// GET endpoint for performance analytics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const toolId = searchParams.get('toolId');
    const program = searchParams.get('program') as AffiliateProgram | null;
    const days = parseInt(searchParams.get('days') || '30');

    if (toolId) {
      const metrics = await affiliateManager.getPerformanceMetrics(toolId);
      return NextResponse.json<ApiResponse>({
        success: true,
        data: metrics,
      });
    }

    if (program) {
      const epc = await affiliateManager.getEPC(program, days);
      return NextResponse.json<ApiResponse>({
        success: true,
        data: { program, epc, days },
      });
    }

    // Get top performing tools
    const { data: topTools } = await supabaseAdmin
      .from('affiliate_performance')
      .select('*')
      .order('epc', { ascending: false })
      .limit(20);

    return NextResponse.json<ApiResponse>({
      success: true,
      data: topTools || [],
    });
  } catch (error) {
    console.error('Performance query error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to fetch performance data' },
      { status: 500 }
    );
  }
}

// Hash string for privacy (IP addresses)
async function hashString(str: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Fallback for environments without crypto.subtle
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(16);
}

/*
 * Database Functions Required (Add to Supabase SQL Editor):
 *
 * -- Increment affiliate clicks
 * CREATE OR REPLACE FUNCTION increment_affiliate_clicks(
 *   p_tool_id UUID,
 *   p_program TEXT
 * )
 * RETURNS VOID AS $$
 * BEGIN
 *   INSERT INTO affiliate_performance (tool_id, program, clicks, conversions, revenue, epc, conversion_rate, avg_commission)
 *   VALUES (p_tool_id, p_program, 1, 0, 0, 0, 0, 0)
 *   ON CONFLICT (tool_id, program)
 *   DO UPDATE SET
 *     clicks = affiliate_performance.clicks + 1,
 *     updated_at = NOW();
 * END;
 * $$ LANGUAGE plpgsql;
 *
 * -- Record affiliate conversion
 * CREATE OR REPLACE FUNCTION record_affiliate_conversion(
 *   p_tool_id UUID,
 *   p_program TEXT,
 *   p_revenue DECIMAL
 * )
 * RETURNS VOID AS $$
 * DECLARE
 *   v_clicks INTEGER;
 *   v_conversions INTEGER;
 *   v_total_revenue DECIMAL;
 * BEGIN
 *   -- Get current stats
 *   SELECT clicks, conversions, revenue
 *   INTO v_clicks, v_conversions, v_total_revenue
 *   FROM affiliate_performance
 *   WHERE tool_id = p_tool_id AND program = p_program;
 *
 *   -- Update performance
 *   UPDATE affiliate_performance
 *   SET
 *     conversions = conversions + 1,
 *     revenue = revenue + p_revenue,
 *     epc = (revenue + p_revenue) / NULLIF(clicks, 0),
 *     conversion_rate = ((conversions + 1)::DECIMAL / NULLIF(clicks, 0)) * 100,
 *     avg_commission = (revenue + p_revenue) / NULLIF(conversions + 1, 0),
 *     last_conversion = NOW(),
 *     updated_at = NOW()
 *   WHERE tool_id = p_tool_id AND program = p_program;
 * END;
 * $$ LANGUAGE plpgsql;
 *
 * -- Calculate program EPC
 * CREATE OR REPLACE FUNCTION calculate_program_epc(
 *   p_program TEXT,
 *   p_days INTEGER DEFAULT 30
 * )
 * RETURNS DECIMAL AS $$
 * DECLARE
 *   v_epc DECIMAL;
 * BEGIN
 *   SELECT
 *     COALESCE(SUM(revenue) / NULLIF(SUM(clicks), 0), 0)
 *   INTO v_epc
 *   FROM affiliate_performance
 *   WHERE program = p_program
 *     AND updated_at >= NOW() - (p_days || ' days')::INTERVAL;
 *
 *   RETURN v_epc;
 * END;
 * $$ LANGUAGE plpgsql;
 */
