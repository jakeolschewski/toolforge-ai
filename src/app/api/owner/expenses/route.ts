// Owner Expenses API

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyOwnerAuth } from '@/lib/owner-auth';
import type { ApiResponse, Expense } from '@/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Audit log function
async function logAudit(action: string, recordId: string, oldData: any, newData: any, request: NextRequest) {
  await supabaseAdmin.from('owner_audit_logs').insert({
    action,
    table_name: 'expenses',
    record_id: recordId,
    old_data: oldData,
    new_data: newData,
    ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
    user_agent: request.headers.get('user-agent'),
  });
}

// GET - Get all expenses with filters
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
    const category = searchParams.get('category');
    const year = searchParams.get('year');
    const month = searchParams.get('month');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');
    const view = searchParams.get('view');

    // If requesting category summary
    if (view === 'categories') {
      const { data, error } = await supabaseAdmin
        .from('expense_categories')
        .select('*')
        .order('total_amount', { ascending: false });

      if (error) throw error;

      return NextResponse.json<ApiResponse>({
        success: true,
        data,
      });
    }

    let query = supabaseAdmin
      .from('expenses')
      .select('*', { count: 'exact' })
      .order('expense_date', { ascending: false })
      .range(offset, offset + limit - 1);

    if (category) {
      query = query.eq('category', category);
    }

    if (year) {
      const startDate = `${year}-01-01`;
      const endDate = `${year}-12-31`;
      query = query.gte('expense_date', startDate).lte('expense_date', endDate);
    }

    if (month && year) {
      const startDate = `${year}-${month.padStart(2, '0')}-01`;
      const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
      const endDate = `${year}-${month.padStart(2, '0')}-${lastDay}`;
      query = query.gte('expense_date', startDate).lte('expense_date', endDate);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        expenses: data as Expense[],
        total: count,
      },
    });
  } catch (error) {
    console.error('[OWNER EXPENSES] GET Error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: error instanceof Error ? error.message : 'Failed to fetch expenses' },
      { status: 500 }
    );
  }
}

// POST - Create new expense
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    if (!verifyOwnerAuth(request)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      category,
      subcategory,
      description,
      amount,
      currency = 'USD',
      expense_date,
      payment_method,
      vendor,
      invoice_number,
      is_recurring = false,
      recurrence_period,
      is_tax_deductible = true,
      tax_category,
      receipt_url,
      notes,
    } = body;

    // Validate required fields
    if (!category || !description || !amount || !expense_date) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Category, description, amount, and expense_date are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('expenses')
      .insert({
        category,
        subcategory,
        description,
        amount,
        currency,
        expense_date,
        payment_method,
        vendor,
        invoice_number,
        is_recurring,
        recurrence_period,
        is_tax_deductible,
        tax_category,
        receipt_url,
        notes,
      })
      .select()
      .single();

    if (error) throw error;

    // Log audit
    await logAudit('create', data.id, null, data, request);

    return NextResponse.json<ApiResponse<Expense>>({
      success: true,
      data: data as Expense,
      message: 'Expense created successfully',
    });
  } catch (error) {
    console.error('[OWNER EXPENSES] POST Error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: error instanceof Error ? error.message : 'Failed to create expense' },
      { status: 500 }
    );
  }
}

// PATCH - Update expense
export async function PATCH(request: NextRequest) {
  try {
    // Verify authentication
    if (!verifyOwnerAuth(request)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Expense ID is required' },
        { status: 400 }
      );
    }

    // Get old data for audit
    const { data: oldData } = await supabaseAdmin
      .from('expenses')
      .select('*')
      .eq('id', id)
      .single();

    // Update expense
    const { data, error } = await supabaseAdmin
      .from('expenses')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Log audit
    await logAudit('update', id, oldData, data, request);

    return NextResponse.json<ApiResponse<Expense>>({
      success: true,
      data: data as Expense,
      message: 'Expense updated successfully',
    });
  } catch (error) {
    console.error('[OWNER EXPENSES] PATCH Error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: error instanceof Error ? error.message : 'Failed to update expense' },
      { status: 500 }
    );
  }
}

// DELETE - Delete expense
export async function DELETE(request: NextRequest) {
  try {
    // Verify authentication
    if (!verifyOwnerAuth(request)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Expense ID is required' },
        { status: 400 }
      );
    }

    // Get data for audit
    const { data: oldData } = await supabaseAdmin
      .from('expenses')
      .select('*')
      .eq('id', id)
      .single();

    const { error } = await supabaseAdmin
      .from('expenses')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Log audit
    await logAudit('delete', id, oldData, null, request);

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Expense deleted successfully',
    });
  } catch (error) {
    console.error('[OWNER EXPENSES] DELETE Error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: error instanceof Error ? error.message : 'Failed to delete expense' },
      { status: 500 }
    );
  }
}
