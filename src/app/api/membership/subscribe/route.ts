// Membership API - Create Subscription

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

    // In production, integrate with Stripe Subscriptions
    const stripeCheckoutUrl = process.env.STRIPE_SECRET_KEY
      ? await createStripeSubscription(user, plan)
      : null;

    if (stripeCheckoutUrl) {
      return NextResponse.json<ApiResponse>({
        success: true,
        data: {
          checkout_url: stripeCheckoutUrl,
        },
      });
    }

    // Mock response for development
    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        checkout_url: `https://checkout.stripe.com/mock/subscription/${plan}`,
        message: 'Stripe integration pending - mock checkout URL returned',
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

async function createStripeSubscription(user: any, plan: string): Promise<string | null> {
  // TODO: Implement Stripe subscription creation
  // This is a placeholder for actual Stripe integration

  // Example implementation:
  // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  //
  // // Get or create Stripe customer
  // let customerId = user.stripe_customer_id;
  // if (!customerId) {
  //   const customer = await stripe.customers.create({
  //     email: user.email,
  //     metadata: { user_id: user.id },
  //   });
  //   customerId = customer.id;
  //
  //   // Update user with customer ID
  //   await supabaseAdmin
  //     .from('users')
  //     .update({ stripe_customer_id: customerId })
  //     .eq('id', user.id);
  // }
  //
  // // Get price ID based on plan
  // const priceId = plan === 'monthly'
  //   ? process.env.STRIPE_MONTHLY_PRICE_ID
  //   : process.env.STRIPE_YEARLY_PRICE_ID;
  //
  // const session = await stripe.checkout.sessions.create({
  //   customer: customerId,
  //   payment_method_types: ['card'],
  //   line_items: [{
  //     price: priceId,
  //     quantity: 1,
  //   }],
  //   mode: 'subscription',
  //   success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/membership/success?session_id={CHECKOUT_SESSION_ID}`,
  //   cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/membership`,
  //   metadata: {
  //     user_id: user.id,
  //     plan,
  //   },
  // });
  //
  // return session.url;

  return null;
}
