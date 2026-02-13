// Workflow Vault API - Get User Purchases

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import type { ApiResponse, VaultPurchase } from '@/types';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const offset = (page - 1) * limit;

    // Fetch user purchases with workflow details
    let query = supabaseAdmin
      .from('vault_purchases')
      .select(
        `
        *,
        vault_workflows!inner(
          id,
          slug,
          title,
          description,
          thumbnail_url,
          file_type,
          file_size,
          category_id,
          pricing_type
        )
      `,
        { count: 'exact' }
      )
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('payment_status', status);
    }

    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    // Transform data
    const purchases = (data || []).map((purchase: any) => ({
      id: purchase.id,
      user_id: purchase.user_id,
      user_email: purchase.user_email,
      workflow_id: purchase.workflow_id,
      workflow_slug: purchase.vault_workflows?.slug,
      workflow_title: purchase.vault_workflows?.title,
      amount: purchase.amount,
      currency: purchase.currency,
      stripe_payment_intent_id: purchase.stripe_payment_intent_id,
      stripe_checkout_session_id: purchase.stripe_checkout_session_id,
      payment_status: purchase.payment_status,
      access_granted: purchase.access_granted,
      purchase_date: purchase.purchase_date,
      created_at: purchase.created_at,
      updated_at: purchase.updated_at,
      workflow: purchase.vault_workflows,
    }));

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        purchases,
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        },
      },
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch purchases',
      },
      { status: 500 }
    );
  }
}
