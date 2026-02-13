import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabase';
import { sendPurchaseConfirmationEmail, sendMembershipWelcomeEmail } from '@/lib/email';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_VAULT_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        // Determine if this is a workflow purchase or membership
        if (session.mode === 'payment') {
          // Workflow Purchase
          const workflowId = session.metadata?.workflow_id;
          const userId = session.metadata?.user_id;
          const pricingTier = session.metadata?.pricing_tier;

          if (!workflowId || !userId) {
            console.error('Missing metadata in checkout session');
            break;
          }

          // Create purchase record
          const { data: purchase, error: purchaseError } = await supabaseAdmin
            .from('workflow_purchases')
            .insert({
              user_id: userId,
              workflow_id: workflowId,
              purchase_type: pricingTier,
              price_paid: (session.amount_total || 0) / 100,
              currency: session.currency?.toUpperCase() || 'USD',
              stripe_payment_intent_id: session.payment_intent as string,
              stripe_customer_id: session.customer as string,
              payment_status: 'completed',
              access_granted: true,
              receives_updates: pricingTier === 'with_updates',
              updates_until:
                pricingTier === 'with_updates'
                  ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
                  : null,
              purchased_at: new Date(),
            })
            .select()
            .single();

          if (purchaseError) {
            console.error('Error creating purchase:', purchaseError);
            break;
          }

          // Increment workflow purchase count
          await supabaseAdmin.rpc('increment_workflow_purchases', {
            workflow_id: workflowId,
          });

          // Send confirmation email
          await sendPurchaseConfirmationEmail(userId, workflowId, purchase.id);

          console.log('Workflow purchase completed:', purchase.id);
        } else if (session.mode === 'subscription') {
          // Membership Subscription
          const userId = session.metadata?.user_id;
          const planType = session.metadata?.plan_type;

          if (!userId) {
            console.error('Missing user_id in subscription session');
            break;
          }

          // Create/update membership record
          const { error: membershipError } = await supabaseAdmin
            .from('memberships')
            .upsert({
              user_id: userId,
              plan_type: planType,
              status: 'active',
              stripe_subscription_id: session.subscription as string,
              stripe_customer_id: session.customer as string,
              billing_cycle: planType === 'annual' ? 'annual' : 'monthly',
              all_workflows_access: true,
              priority_support: true,
              early_access: true,
              joined_at: new Date(),
            });

          if (membershipError) {
            console.error('Error creating membership:', membershipError);
            break;
          }

          // Send welcome email
          await sendMembershipWelcomeEmail(userId);

          console.log('Membership created for user:', userId);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;

        await supabaseAdmin
          .from('memberships')
          .update({
            status: subscription.status === 'active' ? 'active' : 'inactive',
            current_period_start: new Date(subscription.current_period_start * 1000),
            current_period_end: new Date(subscription.current_period_end * 1000),
          })
          .eq('stripe_subscription_id', subscription.id);

        console.log('Subscription updated:', subscription.id);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;

        await supabaseAdmin
          .from('memberships')
          .update({
            status: 'cancelled',
            cancelled_at: new Date(),
            all_workflows_access: false,
          })
          .eq('stripe_subscription_id', subscription.id);

        console.log('Subscription cancelled:', subscription.id);
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        // Update purchase status
        await supabaseAdmin
          .from('workflow_purchases')
          .update({
            payment_status: 'completed',
          })
          .eq('stripe_payment_intent_id', paymentIntent.id);

        console.log('Payment intent succeeded:', paymentIntent.id);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        await supabaseAdmin
          .from('workflow_purchases')
          .update({
            payment_status: 'failed',
          })
          .eq('stripe_payment_intent_id', paymentIntent.id);

        console.log('Payment intent failed:', paymentIntent.id);
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;

        await supabaseAdmin
          .from('workflow_purchases')
          .update({
            payment_status: 'refunded',
            access_granted: false,
          })
          .eq('stripe_payment_intent_id', charge.payment_intent as string);

        console.log('Charge refunded:', charge.id);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed', message: error.message },
      { status: 500 }
    );
  }
}
