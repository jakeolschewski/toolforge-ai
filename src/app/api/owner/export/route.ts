// Owner Export API - Export financial data to CSV

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyOwnerAuth } from '@/lib/owner-auth';
import type { ApiResponse } from '@/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Convert array of objects to CSV
function convertToCSV(data: any[], headers: string[]): string {
  if (!data || data.length === 0) return '';

  const csvRows = [];

  // Add headers
  csvRows.push(headers.join(','));

  // Add data rows
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      // Handle values that might contain commas or quotes
      if (value === null || value === undefined) return '';
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
}

// GET - Export financial data
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
    const type = searchParams.get('type') || 'payouts';
    const year = searchParams.get('year');
    const format = searchParams.get('format') || 'csv';

    let data: any[] = [];
    let headers: string[] = [];
    let filename = '';

    switch (type) {
      case 'payouts':
        ({ data, headers, filename } = await exportPayouts(year));
        break;
      case 'expenses':
        ({ data, headers, filename } = await exportExpenses(year));
        break;
      case 'revenue':
        ({ data, headers, filename } = await exportRevenue(year));
        break;
      case 'profit-loss':
        ({ data, headers, filename } = await exportProfitLoss(year));
        break;
      default:
        return NextResponse.json<ApiResponse>(
          { success: false, error: 'Invalid export type' },
          { status: 400 }
        );
    }

    if (format === 'csv') {
      const csv = convertToCSV(data, headers);

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      });
    } else {
      // Return JSON
      return NextResponse.json({
        success: true,
        data,
      });
    }
  } catch (error) {
    console.error('[OWNER EXPORT] Error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: error instanceof Error ? error.message : 'Failed to export data' },
      { status: 500 }
    );
  }
}

async function exportPayouts(year?: string | null) {
  let query = supabaseAdmin
    .from('payouts')
    .select('*')
    .order('payment_date', { ascending: false });

  if (year) {
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;
    query = query.gte('payment_date', startDate).lte('payment_date', endDate);
  }

  const { data, error } = await query;
  if (error) throw error;

  const headers = [
    'id',
    'network',
    'tool_name',
    'amount',
    'currency',
    'status',
    'payment_method',
    'transaction_id',
    'reference_number',
    'payment_date',
    'due_date',
    'received_date',
    'notes',
    'created_at',
  ];

  const filename = year
    ? `payouts_${year}.csv`
    : `payouts_${new Date().toISOString().split('T')[0]}.csv`;

  return { data: data || [], headers, filename };
}

async function exportExpenses(year?: string | null) {
  let query = supabaseAdmin
    .from('expenses')
    .select('*')
    .order('expense_date', { ascending: false });

  if (year) {
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;
    query = query.gte('expense_date', startDate).lte('expense_date', endDate);
  }

  const { data, error } = await query;
  if (error) throw error;

  const headers = [
    'id',
    'category',
    'subcategory',
    'description',
    'amount',
    'currency',
    'expense_date',
    'payment_method',
    'vendor',
    'invoice_number',
    'is_recurring',
    'recurrence_period',
    'is_tax_deductible',
    'tax_category',
    'receipt_url',
    'notes',
  ];

  const filename = year
    ? `expenses_${year}.csv`
    : `expenses_${new Date().toISOString().split('T')[0]}.csv`;

  return { data: data || [], headers, filename };
}

async function exportRevenue(year?: string | null) {
  let query = supabaseAdmin
    .from('revenue_logs')
    .select('*')
    .order('conversion_date', { ascending: false });

  if (year) {
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;
    query = query.gte('conversion_date', startDate).lte('conversion_date', endDate);
  }

  const { data, error } = await query;
  if (error) throw error;

  const headers = [
    'id',
    'source',
    'tool_name',
    'network',
    'amount',
    'currency',
    'commission_rate',
    'clicks',
    'conversions',
    'conversion_date',
    'notes',
  ];

  const filename = year
    ? `revenue_${year}.csv`
    : `revenue_${new Date().toISOString().split('T')[0]}.csv`;

  return { data: data || [], headers, filename };
}

async function exportProfitLoss(year?: string | null) {
  const currentYear = year || new Date().getFullYear().toString();

  // Get revenue by month
  const { data: revenueData, error: revenueError } = await supabaseAdmin
    .from('revenue_logs')
    .select('conversion_date, amount')
    .gte('conversion_date', `${currentYear}-01-01`)
    .lte('conversion_date', `${currentYear}-12-31`);

  if (revenueError) throw revenueError;

  // Get expenses by month
  const { data: expenseData, error: expenseError } = await supabaseAdmin
    .from('expenses')
    .select('expense_date, amount')
    .gte('expense_date', `${currentYear}-01-01`)
    .lte('expense_date', `${currentYear}-12-31`);

  if (expenseError) throw expenseError;

  // Aggregate by month
  const monthlyData: Record<string, { month: string; revenue: number; expenses: number; profit: number }> = {};

  for (let i = 1; i <= 12; i++) {
    const month = i.toString().padStart(2, '0');
    monthlyData[month] = {
      month: `${currentYear}-${month}`,
      revenue: 0,
      expenses: 0,
      profit: 0,
    };
  }

  // Sum revenue
  (revenueData || []).forEach((item: any) => {
    const month = item.conversion_date?.substring(5, 7);
    if (month && monthlyData[month]) {
      monthlyData[month].revenue += parseFloat(item.amount) || 0;
    }
  });

  // Sum expenses
  (expenseData || []).forEach((item: any) => {
    const month = item.expense_date?.substring(5, 7);
    if (month && monthlyData[month]) {
      monthlyData[month].expenses += parseFloat(item.amount) || 0;
    }
  });

  // Calculate profit
  Object.values(monthlyData).forEach(data => {
    data.profit = data.revenue - data.expenses;
  });

  const data = Object.values(monthlyData);
  const headers = ['month', 'revenue', 'expenses', 'profit'];
  const filename = `profit_loss_${currentYear}.csv`;

  return { data, headers, filename };
}
