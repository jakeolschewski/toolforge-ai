// Owner Revenue API

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import type { ApiResponse, FinancialSummary, RevenueByTool, MonthlyRevenueTrend } from '@/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Verify owner authentication
function verifyOwnerAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return false;

  const token = authHeader.replace('Bearer ', '');
  return token === process.env.OWNER_PASSWORD;
}

// GET - Get revenue data with various analytics
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    if (!verifyOwnerAuth(request)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const view = searchParams.get('view') || 'summary';

    switch (view) {
      case 'summary':
        return await getFinancialSummary();
      case 'by-tool':
        return await getRevenueByTool();
      case 'trends':
        return await getRevenueTrends();
      case 'by-source':
        return await getRevenueBySource();
      default:
        return await getFinancialSummary();
    }
  } catch (error) {
    console.error('[OWNER REVENUE] Error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: error instanceof Error ? error.message : 'Failed to fetch revenue data' },
      { status: 500 }
    );
  }
}

async function getFinancialSummary() {
  const { data, error } = await supabaseAdmin
    .from('financial_summary')
    .select('*')
    .single();

  if (error) throw error;

  return NextResponse.json<ApiResponse<FinancialSummary>>({
    success: true,
    data: data as FinancialSummary,
  });
}

async function getRevenueByTool() {
  const { data, error } = await supabaseAdmin
    .from('revenue_by_tool')
    .select('*')
    .order('total_revenue', { ascending: false })
    .limit(50);

  if (error) throw error;

  return NextResponse.json<ApiResponse<RevenueByTool[]>>({
    success: true,
    data: data as RevenueByTool[],
  });
}

async function getRevenueTrends() {
  const { data, error } = await supabaseAdmin
    .from('monthly_revenue_trend')
    .select('*')
    .order('month', { ascending: false })
    .limit(12);

  if (error) throw error;

  return NextResponse.json<ApiResponse<MonthlyRevenueTrend[]>>({
    success: true,
    data: data as MonthlyRevenueTrend[],
  });
}

async function getRevenueBySource() {
  const { data, error } = await supabaseAdmin
    .from('revenue_logs')
    .select('source, amount, conversions, clicks')
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Aggregate by source
  const aggregated = data.reduce((acc: any, item: any) => {
    if (!acc[item.source]) {
      acc[item.source] = {
        source: item.source,
        total_revenue: 0,
        total_conversions: 0,
        total_clicks: 0,
        count: 0,
      };
    }
    acc[item.source].total_revenue += parseFloat(item.amount) || 0;
    acc[item.source].total_conversions += item.conversions || 0;
    acc[item.source].total_clicks += item.clicks || 0;
    acc[item.source].count += 1;
    return acc;
  }, {});

  const result = Object.values(aggregated);

  return NextResponse.json<ApiResponse>({
    success: true,
    data: result,
  });
}
