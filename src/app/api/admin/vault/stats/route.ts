// Admin Vault API - Dashboard Stats

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import type { ApiResponse } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(_request: NextRequest) {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59).toISOString();

    // Run all queries in parallel
    const [
      workflowsResult,
      purchasesResult,
      purchasesThisMonthResult,
      purchasesLastMonthResult,
      membershipsResult,
      downloadsResult,
      downloadsThisMonthResult,
      avgPriceResult,
    ] = await Promise.all([
      // Total workflows by status
      supabaseAdmin.from('vault_workflows').select('status'),

      // All completed purchases for total revenue
      supabaseAdmin
        .from('vault_purchases')
        .select('amount, purchased_at')
        .eq('payment_status', 'completed'),

      // Purchases this month
      supabaseAdmin
        .from('vault_purchases')
        .select('amount')
        .eq('payment_status', 'completed')
        .gte('purchased_at', startOfMonth),

      // Purchases last month
      supabaseAdmin
        .from('vault_purchases')
        .select('amount')
        .eq('payment_status', 'completed')
        .gte('purchased_at', startOfLastMonth)
        .lte('purchased_at', endOfLastMonth),

      // All memberships
      supabaseAdmin.from('vault_memberships').select('status'),

      // Total downloads
      supabaseAdmin.from('vault_download_logs').select('id', { count: 'exact', head: true }),

      // Downloads this month
      supabaseAdmin
        .from('vault_download_logs')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', startOfMonth),

      // Average workflow price
      supabaseAdmin
        .from('vault_workflows')
        .select('price')
        .eq('pricing_type', 'premium')
        .eq('status', 'published'),
    ]);

    const workflows = workflowsResult.data || [];
    const purchases = purchasesResult.data || [];
    const purchasesThisMonth = purchasesThisMonthResult.data || [];
    const purchasesLastMonth = purchasesLastMonthResult.data || [];
    const memberships = membershipsResult.data || [];
    const premiumWorkflows = avgPriceResult.data || [];

    const totalRevenue = purchases.reduce((sum, p) => sum + (p.amount || 0), 0);
    const revenueThisMonth = purchasesThisMonth.reduce((sum, p) => sum + (p.amount || 0), 0);
    const revenueLastMonth = purchasesLastMonth.reduce((sum, p) => sum + (p.amount || 0), 0);

    const avgPrice = premiumWorkflows.length > 0
      ? premiumWorkflows.reduce((sum, w) => sum + (w.price || 0), 0) / premiumWorkflows.length
      : 0;

    const stats = {
      total_revenue: totalRevenue,
      revenue_this_month: revenueThisMonth,
      revenue_last_month: revenueLastMonth,
      total_workflows: workflows.length,
      published_workflows: workflows.filter(w => w.status === 'published').length,
      draft_workflows: workflows.filter(w => w.status === 'draft').length,
      total_purchases: purchases.length,
      purchases_this_month: purchasesThisMonth.length,
      total_members: memberships.length,
      active_members: memberships.filter(m => m.status === 'active').length,
      total_downloads: downloadsResult.count || 0,
      downloads_this_month: downloadsThisMonthResult.count || 0,
      avg_workflow_price: Math.round(avgPrice * 100) / 100,
    };

    return NextResponse.json<ApiResponse>({
      success: true,
      data: stats,
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to load vault stats',
      },
      { status: 500 }
    );
  }
}
