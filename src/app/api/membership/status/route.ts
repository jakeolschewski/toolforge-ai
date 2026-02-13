// Membership API - Get Membership Status

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import type { ApiResponse, VaultMembership } from '@/types';

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

    // Fetch membership status
    const { data: membership, error } = await supabaseAdmin
      .from('vault_memberships')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 is "not found" error, which is okay
      throw error;
    }

    if (!membership) {
      return NextResponse.json<ApiResponse>({
        success: true,
        data: {
          has_membership: false,
          status: null,
          plan: null,
        },
      });
    }

    // Calculate membership benefits
    const benefits = {
      has_membership: membership.status === 'active',
      status: membership.status,
      plan: membership.plan,
      current_period_start: membership.current_period_start,
      current_period_end: membership.current_period_end,
      cancel_at_period_end: membership.cancel_at_period_end,
      created_at: membership.created_at,
    };

    // If active, get additional stats
    if (membership.status === 'active') {
      // Count available members-only workflows
      const { count: workflowCount } = await supabaseAdmin
        .from('vault_workflows')
        .select('id', { count: 'exact', head: true })
        .eq('pricing_type', 'members_only')
        .eq('status', 'published');

      // Count user's downloads from members-only workflows
      const { count: downloadCount } = await supabaseAdmin
        .from('vault_download_logs')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id);

      return NextResponse.json<ApiResponse>({
        success: true,
        data: {
          ...benefits,
          stats: {
            available_workflows: workflowCount || 0,
            total_downloads: downloadCount || 0,
          },
        },
      });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: benefits,
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch membership status',
      },
      { status: 500 }
    );
  }
}

// Cancel membership
export async function DELETE(request: NextRequest) {
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

    // Get active membership
    const { data: membership } = await supabaseAdmin
      .from('vault_memberships')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (!membership) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'No active membership found' },
        { status: 404 }
      );
    }

    // In production, cancel Stripe subscription
    if (process.env.STRIPE_SECRET_KEY && membership.stripe_subscription_id) {
      // TODO: Cancel Stripe subscription
      // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      // await stripe.subscriptions.update(membership.stripe_subscription_id, {
      //   cancel_at_period_end: true,
      // });
    }

    // Update membership to cancel at period end
    const { error } = await supabaseAdmin
      .from('vault_memberships')
      .update({
        cancel_at_period_end: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', membership.id);

    if (error) throw error;

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Membership will be canceled at the end of the current billing period',
      data: {
        cancel_at_period_end: true,
        current_period_end: membership.current_period_end,
      },
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to cancel membership',
      },
      { status: 500 }
    );
  }
}
