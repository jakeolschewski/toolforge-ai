// Workflow Vault API - Create Stripe Checkout Session

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
        { success: false, error: 'Unauthorized - Please sign in to purchase' },
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
      .select('*')
      .eq('id', workflow_id)
      .eq('status', 'published')
      .single();

    if (workflowError || !workflow) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Workflow not found' },
        { status: 404 }
      );
    }

    // Check if workflow is premium
    if (workflow.pricing_type !== 'premium') {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'This workflow is not a premium item' },
        { status: 400 }
      );
    }

    // Check if user already owns this workflow
    const { data: existingPurchase } = await supabaseAdmin
      .from('vault_purchases')
      .select('id')
      .eq('user_id', user.id)
      .eq('workflow_id', workflow_id)
      .eq('payment_status', 'completed')
      .single();

    if (existingPurchase) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'You already own this workflow' },
        { status: 400 }
      );
    }

    // In production, integrate with Stripe
    // For now, return mock checkout session URL
    const stripeCheckoutUrl = process.env.STRIPE_SECRET_KEY
      ? await createStripeCheckoutSession(user, workflow)
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
        checkout_url: `https://checkout.stripe.com/mock/${workflow_id}`,
        message: 'Stripe integration pending - mock checkout URL returned',
      },
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create checkout session',
      },
      { status: 500 }
    );
  }
}

async function createStripeCheckoutSession(user: any, workflow: any): Promise<string | null> {
  // TODO: Implement Stripe checkout session creation
  // This is a placeholder for actual Stripe integration

  // Example implementation:
  // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  // const session = await stripe.checkout.sessions.create({
  //   customer_email: user.email,
  //   payment_method_types: ['card'],
  //   line_items: [{
  //     price: workflow.stripe_price_id,
  //     quantity: 1,
  //   }],
  //   mode: 'payment',
  //   success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/vault/success?session_id={CHECKOUT_SESSION_ID}`,
  //   cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/vault/workflows/${workflow.slug}`,
  //   metadata: {
  //     user_id: user.id,
  //     workflow_id: workflow.id,
  //   },
  // });
  // return session.url;

  return null;
}
