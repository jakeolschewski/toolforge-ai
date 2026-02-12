// Click Tracking API - Track affiliate link clicks

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { hashIP, getClientIP } from '@/utils/helpers';
import type { ApiResponse } from '@/types';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { toolId } = body;

    if (!toolId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Tool ID required' },
        { status: 400 }
      );
    }

    // Get request metadata
    const ip = getClientIP(request);
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const referrer = request.headers.get('referer') || 'direct';

    // Log click (fire and forget for performance)
    Promise.all([
      // Insert click log
      supabase.from('click_logs').insert({
        tool_id: toolId,
        ip_hash: hashIP(ip),
        user_agent: userAgent,
        referrer,
        created_at: new Date().toISOString(),
      }),

      // Increment tool click count
      supabase.rpc('increment_tool_clicks', { tool_id: toolId }),
    ]).catch(console.error);

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: 'Click tracked',
      },
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch (error) {
    // Don't fail the request even if tracking fails
    console.error('Click tracking error:', error);

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Processed',
    });
  }
}

// Helper SQL function to add to Supabase (run in SQL editor):
/*
CREATE OR REPLACE FUNCTION increment_tool_clicks(tool_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE tools
  SET clicks = clicks + 1
  WHERE id = tool_id;
END;
$$ LANGUAGE plpgsql;
*/
