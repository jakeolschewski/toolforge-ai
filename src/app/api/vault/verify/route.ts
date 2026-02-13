// Workflow Vault API - Verify Purchase Access

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import type { ApiResponse } from '@/types';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { workflow_id } = body;

    if (!workflow_id) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Missing workflow_id' },
        { status: 400 }
      );
    }

    // Fetch workflow details
    const { data: workflow, error: workflowError } = await supabaseAdmin
      .from('vault_workflows')
      .select('pricing_type')
      .eq('id', workflow_id)
      .eq('status', 'published')
      .single();

    if (workflowError || !workflow) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Workflow not found' },
        { status: 404 }
      );
    }

    // Free workflows - always accessible
    if (workflow.pricing_type === 'free') {
      return NextResponse.json<ApiResponse>({
        success: true,
        data: {
          has_access: true,
          access_type: 'free',
        },
      });
    }

    // Premium workflows - check purchase
    if (workflow.pricing_type === 'premium') {
      const { data: purchase } = await supabaseAdmin
        .from('vault_purchases')
        .select('*')
        .eq('user_id', user.id)
        .eq('workflow_id', workflow_id)
        .eq('payment_status', 'completed')
        .eq('access_granted', true)
        .single();

      if (purchase) {
        return NextResponse.json<ApiResponse>({
          success: true,
          data: {
            has_access: true,
            access_type: 'purchased',
            purchase_date: purchase.purchase_date,
          },
        });
      }
    }

    // Members-only workflows - check membership
    if (workflow.pricing_type === 'members_only') {
      const { data: membership } = await supabaseAdmin
        .from('vault_memberships')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      if (membership) {
        return NextResponse.json<ApiResponse>({
          success: true,
          data: {
            has_access: true,
            access_type: 'membership',
            membership_plan: membership.plan,
            expires_at: membership.current_period_end,
          },
        });
      }

      // Also check for individual purchase (members can buy individually too)
      const { data: purchase } = await supabaseAdmin
        .from('vault_purchases')
        .select('*')
        .eq('user_id', user.id)
        .eq('workflow_id', workflow_id)
        .eq('payment_status', 'completed')
        .eq('access_granted', true)
        .single();

      if (purchase) {
        return NextResponse.json<ApiResponse>({
          success: true,
          data: {
            has_access: true,
            access_type: 'purchased',
            purchase_date: purchase.purchase_date,
          },
        });
      }
    }

    // No access
    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        has_access: false,
        access_type: null,
        pricing_type: workflow.pricing_type,
      },
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to verify access',
      },
      { status: 500 }
    );
  }
}
