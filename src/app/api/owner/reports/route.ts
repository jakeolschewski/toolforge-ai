// Owner Financial Reports API
// Generates printable HTML financial reports (print to PDF from browser)

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyOwnerAuth } from '@/lib/owner-auth';
import type { ApiResponse } from '@/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET - Generate financial report as printable HTML
export async function GET(request: NextRequest) {
  if (!verifyOwnerAuth(request)) {
    return NextResponse.json<ApiResponse>({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const reportType = searchParams.get('type') || 'profit-loss';
  const year = searchParams.get('year') || new Date().getFullYear().toString();
  const startDate = searchParams.get('start') || `${year}-01-01`;
  const endDate = searchParams.get('end') || `${year}-12-31`;
  const format = searchParams.get('format') || 'html';

  try {
    if (format === 'json') {
      const data = await generateReportData(reportType, startDate, endDate, year);
      return NextResponse.json<ApiResponse>({ success: true, data });
    }

    // Return printable HTML
    const reportHtml = await generateReportHtml(reportType, startDate, endDate, year);
    return new NextResponse(reportHtml, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: error instanceof Error ? error.message : 'Failed to generate report' },
      { status: 500 }
    );
  }
}

async function generateReportData(type: string, startDate: string, endDate: string, year: string) {
  // Get revenue
  const { data: revenueData } = await supabaseAdmin
    .from('revenue_logs')
    .select('*')
    .gte('conversion_date', startDate)
    .lte('conversion_date', endDate)
    .order('conversion_date', { ascending: true });

  // Get expenses
  const { data: expenseData } = await supabaseAdmin
    .from('expenses')
    .select('*')
    .gte('expense_date', startDate)
    .lte('expense_date', endDate)
    .order('expense_date', { ascending: true });

  // Get payouts
  const { data: payoutData } = await supabaseAdmin
    .from('payouts')
    .select('*')
    .gte('payment_date', startDate)
    .lte('payment_date', endDate)
    .order('payment_date', { ascending: true });

  // Get withdrawals
  const { data: withdrawalData } = await supabaseAdmin
    .from('owner_withdrawals')
    .select('*')
    .gte('created_at', startDate)
    .lte('created_at', endDate + 'T23:59:59')
    .order('created_at', { ascending: true });

  const revenue = revenueData || [];
  const expenses = expenseData || [];
  const payouts = payoutData || [];
  const withdrawals = withdrawalData || [];

  // Monthly aggregation
  const months: Record<string, { revenue: number; expenses: number; profit: number }> = {};
  for (let m = 1; m <= 12; m++) {
    const key = `${year}-${m.toString().padStart(2, '0')}`;
    months[key] = { revenue: 0, expenses: 0, profit: 0 };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  revenue.forEach((r: any) => {
    const month = r.conversion_date?.substring(0, 7);
    if (month && months[month]) months[month].revenue += parseFloat(r.amount) || 0;
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expenses.forEach((e: any) => {
    const month = e.expense_date?.substring(0, 7);
    if (month && months[month]) months[month].expenses += parseFloat(e.amount) || 0;
  });

  Object.values(months).forEach(m => { m.profit = m.revenue - m.expenses; });

  const totalRevenue = Object.values(months).reduce((s, m) => s + m.revenue, 0);
  const totalExpenses = Object.values(months).reduce((s, m) => s + m.expenses, 0);
  const totalProfit = totalRevenue - totalExpenses;

  // Revenue by source
  const revenueBySource: Record<string, number> = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  revenue.forEach((r: any) => {
    const src = r.source || 'other';
    revenueBySource[src] = (revenueBySource[src] || 0) + (parseFloat(r.amount) || 0);
  });

  // Expense by category
  const expenseByCategory: Record<string, number> = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expenses.forEach((e: any) => {
    const cat = e.category || 'other';
    expenseByCategory[cat] = (expenseByCategory[cat] || 0) + (parseFloat(e.amount) || 0);
  });

  // Tax deductible expenses
  const taxDeductible = expenses
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .filter((e: any) => e.is_tax_deductible)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .reduce((s: number, e: any) => s + (parseFloat(e.amount) || 0), 0);

  const totalWithdrawals = withdrawals
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .filter((w: any) => w.status === 'completed')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .reduce((s: number, w: any) => s + (parseFloat(w.amount) || 0), 0);

  return {
    period: { start: startDate, end: endDate, year },
    summary: { totalRevenue, totalExpenses, totalProfit, taxDeductible, totalWithdrawals },
    monthly: months,
    revenueBySource,
    expenseByCategory,
    transactions: { revenue: revenue.length, expenses: expenses.length, payouts: payouts.length, withdrawals: withdrawals.length },
  };
}

async function generateReportHtml(type: string, startDate: string, endDate: string, year: string): Promise<string> {
  const data = await generateReportData(type, startDate, endDate, year);
  const generatedAt = new Date().toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' });

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const monthlyRows = Object.entries(data.monthly).map(([month, vals]) => {
    const monthIdx = parseInt(month.split('-')[1]) - 1;
    return `<tr>
      <td>${monthNames[monthIdx]} ${year}</td>
      <td class="num">$${vals.revenue.toFixed(2)}</td>
      <td class="num">$${vals.expenses.toFixed(2)}</td>
      <td class="num ${vals.profit >= 0 ? 'positive' : 'negative'}">$${vals.profit.toFixed(2)}</td>
    </tr>`;
  }).join('');

  const revenueSourceRows = Object.entries(data.revenueBySource)
    .sort((a, b) => b[1] - a[1])
    .map(([src, amt]) => `<tr><td>${src}</td><td class="num">$${amt.toFixed(2)}</td></tr>`)
    .join('');

  const expenseCategoryRows = Object.entries(data.expenseByCategory)
    .sort((a, b) => b[1] - a[1])
    .map(([cat, amt]) => `<tr><td>${cat}</td><td class="num">$${amt.toFixed(2)}</td></tr>`)
    .join('');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>ToolForge AI - Financial Report ${year}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1f2937; padding: 40px; max-width: 900px; margin: 0 auto; }
    @media print { body { padding: 20px; } .no-print { display: none !important; } }
    h1 { font-size: 28px; margin-bottom: 4px; color: #111827; }
    h2 { font-size: 20px; margin: 32px 0 16px; color: #374151; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; }
    .subtitle { color: #6b7280; margin-bottom: 24px; }
    .meta { color: #9ca3af; font-size: 12px; margin-bottom: 32px; }
    .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 32px; }
    .summary-card { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; }
    .summary-card .label { font-size: 13px; color: #6b7280; margin-bottom: 4px; }
    .summary-card .value { font-size: 24px; font-weight: 700; }
    .positive { color: #059669; }
    .negative { color: #dc2626; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    th { text-align: left; padding: 10px 12px; background: #f3f4f6; border-bottom: 2px solid #d1d5db; font-size: 13px; color: #374151; }
    td { padding: 10px 12px; border-bottom: 1px solid #e5e7eb; font-size: 14px; }
    .num { text-align: right; font-variant-numeric: tabular-nums; }
    tr.total { font-weight: 700; background: #f9fafb; }
    .footer { margin-top: 48px; padding-top: 16px; border-top: 1px solid #e5e7eb; color: #9ca3af; font-size: 12px; text-align: center; }
    .print-btn { position: fixed; top: 20px; right: 20px; background: #4f46e5; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; z-index: 100; }
    .print-btn:hover { background: #4338ca; }
  </style>
</head>
<body>
  <button class="print-btn no-print" onclick="window.print()">Print / Save PDF</button>

  <h1>ToolForge AI</h1>
  <p class="subtitle">Financial Report &mdash; ${type === 'profit-loss' ? 'Profit & Loss Statement' : 'Annual Report'}</p>
  <p class="meta">Period: ${startDate} to ${endDate} | Generated: ${generatedAt}</p>

  <div class="summary-grid">
    <div class="summary-card">
      <div class="label">Total Revenue</div>
      <div class="value positive">$${data.summary.totalRevenue.toFixed(2)}</div>
    </div>
    <div class="summary-card">
      <div class="label">Total Expenses</div>
      <div class="value negative">$${data.summary.totalExpenses.toFixed(2)}</div>
    </div>
    <div class="summary-card">
      <div class="label">Net Profit</div>
      <div class="value ${data.summary.totalProfit >= 0 ? 'positive' : 'negative'}">$${data.summary.totalProfit.toFixed(2)}</div>
    </div>
  </div>

  <div class="summary-grid">
    <div class="summary-card">
      <div class="label">Tax Deductible Expenses</div>
      <div class="value">$${data.summary.taxDeductible.toFixed(2)}</div>
    </div>
    <div class="summary-card">
      <div class="label">Total Withdrawals</div>
      <div class="value">$${data.summary.totalWithdrawals.toFixed(2)}</div>
    </div>
    <div class="summary-card">
      <div class="label">Total Transactions</div>
      <div class="value">${data.transactions.revenue + data.transactions.expenses + data.transactions.payouts}</div>
    </div>
  </div>

  <h2>Monthly Profit & Loss</h2>
  <table>
    <thead><tr><th>Month</th><th class="num">Revenue</th><th class="num">Expenses</th><th class="num">Profit</th></tr></thead>
    <tbody>
      ${monthlyRows}
      <tr class="total">
        <td>Total</td>
        <td class="num">$${data.summary.totalRevenue.toFixed(2)}</td>
        <td class="num">$${data.summary.totalExpenses.toFixed(2)}</td>
        <td class="num ${data.summary.totalProfit >= 0 ? 'positive' : 'negative'}">$${data.summary.totalProfit.toFixed(2)}</td>
      </tr>
    </tbody>
  </table>

  <h2>Revenue by Source</h2>
  <table>
    <thead><tr><th>Source</th><th class="num">Amount</th></tr></thead>
    <tbody>
      ${revenueSourceRows || '<tr><td colspan="2" style="text-align:center;color:#9ca3af;">No revenue data</td></tr>'}
    </tbody>
  </table>

  <h2>Expenses by Category</h2>
  <table>
    <thead><tr><th>Category</th><th class="num">Amount</th></tr></thead>
    <tbody>
      ${expenseCategoryRows || '<tr><td colspan="2" style="text-align:center;color:#9ca3af;">No expense data</td></tr>'}
    </tbody>
  </table>

  <div class="footer">
    <p>ToolForge AI &mdash; Confidential Financial Report</p>
    <p>Generated automatically. This document is for internal use only.</p>
  </div>
</body>
</html>`;
}
