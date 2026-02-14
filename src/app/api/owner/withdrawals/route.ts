// Owner Withdrawals API
// Manage bank accounts and fund withdrawal requests

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyOwnerAuth } from '@/lib/owner-auth';
import type { ApiResponse } from '@/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET - List withdrawals and bank accounts
export async function GET(request: NextRequest) {
  if (!verifyOwnerAuth(request)) {
    return NextResponse.json<ApiResponse>({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const view = searchParams.get('view') || 'withdrawals';

  try {
    if (view === 'bank-accounts') {
      const { data, error } = await supabaseAdmin
        .from('owner_bank_accounts')
        .select('*')
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return NextResponse.json<ApiResponse>({ success: true, data: data || [] });
    }

    // Default: withdrawals
    const { data, error } = await supabaseAdmin
      .from('owner_withdrawals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Calculate totals
    const withdrawals = data || [];
    const totalWithdrawn = withdrawals
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((w: any) => w.status === 'completed')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .reduce((sum: number, w: any) => sum + (parseFloat(w.amount) || 0), 0);
    const totalPending = withdrawals
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((w: any) => w.status === 'pending')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .reduce((sum: number, w: any) => sum + (parseFloat(w.amount) || 0), 0);

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        withdrawals,
        totalWithdrawn,
        totalPending,
        count: withdrawals.length,
      },
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: error instanceof Error ? error.message : 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

// POST - Create a withdrawal request or bank account
export async function POST(request: NextRequest) {
  if (!verifyOwnerAuth(request)) {
    return NextResponse.json<ApiResponse>({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { type } = body;

    if (type === 'bank-account') {
      const { bank_name, account_holder, account_number_last4, routing_number_last4, account_type, is_default, notes } = body;

      if (!bank_name || !account_holder) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: 'Bank name and account holder are required' },
          { status: 400 }
        );
      }

      // If setting as default, unset other defaults first
      if (is_default) {
        await supabaseAdmin
          .from('owner_bank_accounts')
          .update({ is_default: false })
          .eq('is_default', true);
      }

      const { data, error } = await supabaseAdmin
        .from('owner_bank_accounts')
        .insert({
          bank_name,
          account_holder,
          account_number_last4: account_number_last4 || '',
          routing_number_last4: routing_number_last4 || '',
          account_type: account_type || 'checking',
          is_default: is_default || false,
          notes: notes || '',
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json<ApiResponse>({ success: true, data, message: 'Bank account added' });
    }

    // Default: create withdrawal
    const { amount, bank_account_id, notes } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Valid amount is required' },
        { status: 400 }
      );
    }

    // Get bank account info for the record
    let bankInfo = 'Not specified';
    if (bank_account_id) {
      const { data: bank } = await supabaseAdmin
        .from('owner_bank_accounts')
        .select('bank_name, account_number_last4')
        .eq('id', bank_account_id)
        .single();

      if (bank) {
        bankInfo = `${bank.bank_name} (****${bank.account_number_last4})`;
      }
    }

    const { data, error } = await supabaseAdmin
      .from('owner_withdrawals')
      .insert({
        amount: parseFloat(amount),
        currency: 'USD',
        bank_account_id: bank_account_id || null,
        bank_info: bankInfo,
        status: 'pending',
        notes: notes || '',
        requested_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json<ApiResponse>({ success: true, data, message: 'Withdrawal request created' });
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: error instanceof Error ? error.message : 'Failed to create' },
      { status: 500 }
    );
  }
}

// PATCH - Update withdrawal status or bank account
export async function PATCH(request: NextRequest) {
  if (!verifyOwnerAuth(request)) {
    return NextResponse.json<ApiResponse>({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, type, ...updates } = body;

    if (!id) {
      return NextResponse.json<ApiResponse>({ success: false, error: 'ID is required' }, { status: 400 });
    }

    const table = type === 'bank-account' ? 'owner_bank_accounts' : 'owner_withdrawals';

    // If marking withdrawal as completed, record the date
    if (type !== 'bank-account' && updates.status === 'completed') {
      updates.completed_at = new Date().toISOString();
    }

    const { data, error } = await supabaseAdmin
      .from(table)
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json<ApiResponse>({ success: true, data });
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: error instanceof Error ? error.message : 'Failed to update' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a bank account or withdrawal
export async function DELETE(request: NextRequest) {
  if (!verifyOwnerAuth(request)) {
    return NextResponse.json<ApiResponse>({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const type = searchParams.get('type') || 'withdrawal';

  if (!id) {
    return NextResponse.json<ApiResponse>({ success: false, error: 'ID is required' }, { status: 400 });
  }

  try {
    const table = type === 'bank-account' ? 'owner_bank_accounts' : 'owner_withdrawals';

    const { error } = await supabaseAdmin.from(table).delete().eq('id', id);
    if (error) throw error;

    return NextResponse.json<ApiResponse>({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: error instanceof Error ? error.message : 'Failed to delete' },
      { status: 500 }
    );
  }
}
