/**
 * Stripe Webhook Handler - معالج ويب هوك سترايب
 * Handle Stripe webhook events for payment status updates
 */

import logger from '@/lib/monitoring/logger';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = headers().get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature provided' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const supabase = await createClient();

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(
          event.data.object as Stripe.PaymentIntent,
          supabase
        );
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentFailed(
          event.data.object as Stripe.PaymentIntent,
          supabase
        );
        break;
      case 'payment_intent.canceled':
        await handlePaymentCanceled(
          event.data.object as Stripe.PaymentIntent,
          supabase
        );
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handlePaymentSucceeded(
  paymentIntent: Stripe.PaymentIntent,
  supabase: any
) {
  const appointmentId = paymentIntent.metadata?.appointmentId;

  if (!appointmentId) {
    console.error('No appointment ID in payment intent metadata');
    return;
  }

  // Update payment status
  const { error: paymentError } = await supabase
    .from('payments')
    .update({
      status: 'paid',
      paymentData: {
        ...paymentIntent,
        processedAt: new Date().toISOString(),
      },
    })
    .eq('transactionId', paymentIntent.id);

  if (paymentError) {
    console.error('Failed to update payment status:', paymentError);
    return;
  }

  // Update appointment payment status
  const { error: appointmentError } = await supabase
    .from('appointments')
    .update({ paymentStatus: 'paid' })
    .eq('id', appointmentId);

  if (appointmentError) {
    console.error(
      'Failed to update appointment payment status:',
      appointmentError
    );
    return;
  }

  // Create audit log
  await supabase.from('audit_logs').insert({
    action: 'payment_confirmed',
    entityType: 'payment',
    entityId: paymentIntent.id,
    metadata: {
      appointmentId,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      method: 'stripe',
    },
  });

  console.log(`Payment succeeded for appointment ${appointmentId}`);
}

async function handlePaymentFailed(
  paymentIntent: Stripe.PaymentIntent,
  supabase: any
) {
  const appointmentId = paymentIntent.metadata?.appointmentId;

  if (!appointmentId) {
    console.error('No appointment ID in payment intent metadata');
    return;
  }

  // Update payment status
  const { error: paymentError } = await supabase
    .from('payments')
    .update({
      status: 'failed',
      paymentData: {
        ...paymentIntent,
        failedAt: new Date().toISOString(),
      },
    })
    .eq('transactionId', paymentIntent.id);

  if (paymentError) {
    console.error('Failed to update payment status:', paymentError);
    return;
  }

  // Create audit log
  await supabase.from('audit_logs').insert({
    action: 'payment_failed',
    entityType: 'payment',
    entityId: paymentIntent.id,
    metadata: {
      appointmentId,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      method: 'stripe',
      error: paymentIntent.last_payment_error?.message,
    },
  });

  console.log(`Payment failed for appointment ${appointmentId}`);
}

async function handlePaymentCanceled(
  paymentIntent: Stripe.PaymentIntent,
  supabase: any
) {
  const appointmentId = paymentIntent.metadata?.appointmentId;

  if (!appointmentId) {
    console.error('No appointment ID in payment intent metadata');
    return;
  }

  // Update payment status
  const { error: paymentError } = await supabase
    .from('payments')
    .update({
      status: 'canceled',
      paymentData: {
        ...paymentIntent,
        canceledAt: new Date().toISOString(),
      },
    })
    .eq('transactionId', paymentIntent.id);

  if (paymentError) {
    console.error('Failed to update payment status:', paymentError);
    return;
  }

  // Create audit log
  await supabase.from('audit_logs').insert({
    action: 'payment_canceled',
    entityType: 'payment',
    entityId: paymentIntent.id,
    metadata: {
      appointmentId,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      method: 'stripe',
    },
  });

  console.log(`Payment canceled for appointment ${appointmentId}`);
}
