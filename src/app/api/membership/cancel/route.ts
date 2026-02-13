// Membership API - Cancel Subscription

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabase';
import type { ApiResponse } from '@/types';

export const dynamic = 'force-dynamic';

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized - Please sign in to manage your membership' },
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

    // Look up active membership
    const { data: membership, error: membershipError } = await supabaseAdmin
      .from('vault_memberships')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (membershipError || !membership) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'No active membership found' },
        { status: 404 }
      );
    }

    if (!membership.stripe_subscription_id) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'No Stripe subscription associated with this membership' },
        { status: 400 }
      );
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Stripe is not configured' },
        { status: 500 }
      );
    }

    const stripe = getStripe();

    // Cancel at end of current billing period (not immediate)
    await stripe.subscriptions.update(membership.stripe_subscription_id, {
      cancel_at_period_end: true,
    });

    // Update membership record
    await supabaseAdmin
      .from('vault_memberships')
      .update({ cancel_at_period_end: true })
      .eq('id', membership.id);

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        message: 'Membership will be cancelled at the end of your current billing period',
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
