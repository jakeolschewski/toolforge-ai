// Admin Vault API - Analytics

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import type { ApiResponse } from '@/types';

export const dynamic = 'force-dynamic';

function getDateFilter(range: string): string | null {
  const now = new Date();
  switch (range) {
    case '7days':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    case '30days':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
    case '90days':
      return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();
    default:
      return null; // 'all' — no filter
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '30days';
    const dateFilter = getDateFilter(range);

    // Build purchase query with optional date filter
    let purchaseQuery = supabaseAdmin
      .from('vault_purchases')
      .select(`
        *,
        vault_workflows ( id, title, slug )
      `)
      .eq('payment_status', 'completed');

    if (dateFilter) {
      purchaseQuery = purchaseQuery.gte('purchased_at', dateFilter);
    }

    // Run all queries in parallel
    const [purchasesResult, workflowsResult, allCustomersResult, monthlyCustomersResult] = await Promise.all([
      purchaseQuery,

      // Top workflows by downloads
      supabaseAdmin
        .from('vault_workflows')
        .select('id, title, downloads, favorites, rating')
        .eq('status', 'published')
        .order('downloads', { ascending: false })
        .limit(20),

      // Total unique customers (all time)
      supabaseAdmin
        .from('vault_purchases')
        .select('user_id')
        .eq('payment_status', 'completed'),

      // New customers this month
      supabaseAdmin
        .from('vault_purchases')
        .select('user_id, purchased_at')
        .eq('payment_status', 'completed')
        .gte('purchased_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
    ]);

    const purchases = purchasesResult.data || [];
    const workflows = workflowsResult.data || [];
    const allCustomerPurchases = allCustomersResult.data || [];
    const monthlyPurchases = monthlyCustomersResult.data || [];

    // Revenue by workflow
    const revenueMap = new Map<string, { workflow_id: string; workflow_title: string; revenue: number; purchases: number; downloads: number }>();
    for (const p of purchases) {
      const wfId = p.workflow_id;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const wfTitle = (p as any).vault_workflows?.title || 'Unknown';
      const existing = revenueMap.get(wfId) || { workflow_id: wfId, workflow_title: wfTitle, revenue: 0, purchases: 0, downloads: 0 };
      existing.revenue += p.amount || 0;
      existing.purchases += 1;
      revenueMap.set(wfId, existing);
    }
    const revenue_by_workflow = Array.from(revenueMap.values())
      .sort((a, b) => b.revenue - a.revenue);

    // Revenue by month
    const monthMap = new Map<string, { month: string; revenue: number; purchases: number }>();
    for (const p of purchases) {
      const date = new Date(p.purchased_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const existing = monthMap.get(monthKey) || { month: monthKey, revenue: 0, purchases: 0 };
      existing.revenue += p.amount || 0;
      existing.purchases += 1;
      monthMap.set(monthKey, existing);
    }
    const revenue_by_month = Array.from(monthMap.values())
      .sort((a, b) => a.month.localeCompare(b.month));

    // Top workflows
    const top_workflows = workflows.map(w => ({
      workflow_id: w.id,
      workflow_title: w.title,
      downloads: w.downloads || 0,
      favorites: w.favorites || 0,
      rating: w.rating || 0,
    }));

    // Customer metrics
    const uniqueCustomerIds = new Set(allCustomerPurchases.map(p => p.user_id));
    const totalCustomers = uniqueCustomerIds.size;

    const newCustomerIdsThisMonth = new Set(monthlyPurchases.map(p => p.user_id));
    const newCustomersThisMonth = newCustomerIdsThisMonth.size;

    // Repeat customers: users who made more than one purchase
    const customerPurchaseCounts = new Map<string, number>();
    for (const p of allCustomerPurchases) {
      customerPurchaseCounts.set(p.user_id, (customerPurchaseCounts.get(p.user_id) || 0) + 1);
    }
    const repeatCustomers = Array.from(customerPurchaseCounts.values()).filter(count => count > 1).length;

    // Avg purchase value and total
    const totalRevenue = purchases.reduce((sum, p) => sum + (p.amount || 0), 0);
    const avgPurchaseValue = purchases.length > 0 ? totalRevenue / purchases.length : 0;
    const avgCustomerLTV = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;

    // Conversion metrics (simplified)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const totalWorkflowViews = workflows.reduce((sum, w) => sum + ((w as any).view_count || 0), 0);
    const totalWorkflowDownloads = workflows.reduce((sum, w) => sum + (w.downloads || 0), 0);
    const viewsToDownloads = totalWorkflowViews > 0 ? totalWorkflowDownloads / totalWorkflowViews : 0;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const freeWorkflowCount = workflows.filter((w: any) => w.pricing_type === 'free').length;
    const premiumPurchaserCount = totalCustomers;
    const freeToPremium = freeWorkflowCount > 0 && totalCustomers > 0
      ? premiumPurchaserCount / (premiumPurchaserCount + freeWorkflowCount * 10) // estimate
      : 0;

    const analytics = {
      revenue_by_workflow,
      revenue_by_month,
      top_workflows,
      conversion_metrics: {
        views_to_downloads: viewsToDownloads,
        free_to_premium: freeToPremium,
        avg_purchase_value: Math.round(avgPurchaseValue * 100) / 100,
      },
      customer_metrics: {
        total_customers: totalCustomers,
        new_customers_this_month: newCustomersThisMonth,
        repeat_customers: repeatCustomers,
        avg_customer_lifetime_value: Math.round(avgCustomerLTV * 100) / 100,
      },
    };

    return NextResponse.json<ApiResponse>({
      success: true,
      data: analytics,
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to load analytics',
      },
      { status: 500 }
    );
  }
}
