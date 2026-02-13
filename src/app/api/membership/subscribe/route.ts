// Membership API - Create Subscription

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
        { success: false, error: 'Unauthorized - Please sign in to subscribe' },
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
    const { plan } = body;

    if (!plan || !['monthly', 'yearly'].includes(plan)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Invalid plan - must be "monthly" or "yearly"' },
        { status: 400 }
      );
    }

    // Check if user already has an active membership
    const { data: existingMembership } = await supabaseAdmin
      .from('vault_memberships')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (existingMembership) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'You already have an active membership',
        },
        { status: 400 }
      );
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      // Mock response for development
      return NextResponse.json<ApiResponse>({
        success: true,
        data: {
          checkout_url: `https://checkout.stripe.com/mock/subscription/${plan}`,
          message: 'Stripe integration pending - mock checkout URL returned',
        },
      });
    }

    const stripe = getStripe();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    // Get or create Stripe customer
    let customerId: string | undefined;

    // Check if user already has a stripe_customer_id stored
    const { data: userData } = await supabaseAdmin
      .from('users')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();

    if (userData?.stripe_customer_id) {
      customerId = userData.stripe_customer_id;
    } else {
      // Create a new Stripe customer
      const customer = await stripe.customers.create({
        email: user.email!,
        metadata: { user_id: user.id },
      });
      customerId = customer.id;

      // Store the customer ID on the user record
      await supabaseAdmin
        .from('users')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id);
    }

    // Get price ID based on plan
    const priceId = plan === 'monthly'
      ? process.env.STRIPE_MONTHLY_PRICE_ID
      : process.env.STRIPE_YEARLY_PRICE_ID;

    if (!priceId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: `Stripe price ID not configured for ${plan} plan` },
        { status: 500 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${siteUrl}/membership/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/membership`,
      metadata: {
        user_id: user.id,
        plan_type: plan,
      },
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        checkout_url: session.url,
      },
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create subscription',
      },
      { status: 500 }
    );
  }
}
