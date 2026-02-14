// Owner Payouts API

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyOwnerAuth } from '@/lib/owner-auth';
import type { ApiResponse, Payout } from '@/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Audit log function
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function logAudit(action: string, recordId: string, oldData: any, newData: any, request: NextRequest) {
  await supabaseAdmin.from('owner_audit_logs').insert({
    action,
    table_name: 'payouts',
    record_id: recordId,
    old_data: oldData,
    new_data: newData,
    ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
    user_agent: request.headers.get('user-agent'),
  });
}

// GET - Get all payouts with filters
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
    const network = searchParams.get('network');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabaseAdmin
      .from('payouts')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (network) {
      query = query.eq('network', network);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        payouts: data as Payout[],
        total: count,
      },
    });
  } catch (error) {
    console.error('[OWNER PAYOUTS] GET Error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: error instanceof Error ? error.message : 'Failed to fetch payouts' },
      { status: 500 }
    );
  }
}

// POST - Create new payout
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
      network,
      tool_id,
      tool_name,
      amount,
      currency = 'USD',
      status = 'pending',
      payment_method,
      transaction_id,
      reference_number,
      payment_date,
      due_date,
      received_date,
      notes,
    } = body;

    // Validate required fields
    if (!network || !amount) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Network and amount are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('payouts')
      .insert({
        network,
        tool_id,
        tool_name,
        amount,
        currency,
        status,
        payment_method,
        transaction_id,
        reference_number,
        payment_date,
        due_date,
        received_date,
        notes,
      })
      .select()
      .single();

    if (error) throw error;

    // Log audit
    await logAudit('create', data.id, null, data, request);

    return NextResponse.json<ApiResponse<Payout>>({
      success: true,
      data: data as Payout,
      message: 'Payout created successfully',
    });
  } catch (error) {
    console.error('[OWNER PAYOUTS] POST Error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: error instanceof Error ? error.message : 'Failed to create payout' },
      { status: 500 }
    );
  }
}

// PATCH - Update payout (e.g., mark as received)
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
        { success: false, error: 'Payout ID is required' },
        { status: 400 }
      );
    }

    // Get old data for audit
    const { data: oldData } = await supabaseAdmin
      .from('payouts')
      .select('*')
      .eq('id', id)
      .single();

    // Update payout
    const { data, error } = await supabaseAdmin
      .from('payouts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Log audit
    await logAudit('update', id, oldData, data, request);

    return NextResponse.json<ApiResponse<Payout>>({
      success: true,
      data: data as Payout,
      message: 'Payout updated successfully',
    });
  } catch (error) {
    console.error('[OWNER PAYOUTS] PATCH Error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: error instanceof Error ? error.message : 'Failed to update payout' },
      { status: 500 }
    );
  }
}

// DELETE - Delete payout
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
        { success: false, error: 'Payout ID is required' },
        { status: 400 }
      );
    }

    // Get data for audit
    const { data: oldData } = await supabaseAdmin
      .from('payouts')
      .select('*')
      .eq('id', id)
      .single();

    const { error } = await supabaseAdmin
      .from('payouts')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Log audit
    await logAudit('delete', id, oldData, null, request);

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Payout deleted successfully',
    });
  } catch (error) {
    console.error('[OWNER PAYOUTS] DELETE Error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: error instanceof Error ? error.message : 'Failed to delete payout' },
      { status: 500 }
    );
  }
}
