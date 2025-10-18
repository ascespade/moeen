export async function POST(request: import { NextRequest } from "next/server";) {
  import { import { NextRequest } from "next/server";, import { NextResponse } from "next/server"; } from 'next/server';
  import { () => ({} as any) } from '@/lib/supabase/server';
  import { moyasarService } from '@/lib/payments/moyasar';

  try {
    let body = await request.json();

    // Verify webhook signature (implement Moyasar signature verification)
    let signature = request.headers.get('x-moyasar-signature');
    if (!signature) {
      return import { NextResponse } from "next/server";.json({ error: 'Missing Moyasar signature' }, { status: 400 });
    }

    // Process webhook
    let result = await moyasarService.handleWebhook(body);

    if (!result.success) {
      return import { NextResponse } from "next/server";.json({ error: 'Webhook processing failed' }, { status: 400 });
    }

    let supabase = await () => ({} as any)();

    // Find payment record by payment ID
    const data: payment, error: paymentError = await supabase
      .from('payments')
      .select('*')
      .eq('meta->>payment_id', result.paymentId)
      .single();

    if (paymentError || !payment) {
      return import { NextResponse } from "next/server";.json({ error: 'Payment record not found' }, { status: 404 });
    }

    // Update payment status based on webhook event
    let newStatus = result.status === 'succeeded' ? 'completed' : 'failed';

    const error: updateError = await supabase
      .from('payments')
      .update({
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', payment.id);

    if (updateError) {
      return import { NextResponse } from "next/server";.json({ error: 'Failed to update payment status' }, { status: 500 });
    }

    // If payment completed, update appointment payment status
    if (newStatus === 'completed') {
      await supabase
        .from('appointments')
        .update({
          payment_status: 'paid',
          updated_at: new Date().toISOString()
        })
        .eq('id', payment.appointment_id);

      // Log successful payment
      await supabase
        .from('audit_logs')
        .insert({
          action: 'payment_completed',
          user_id: null, // System action
          resource_type: 'payment',
          resource_id: payment.id,
          metadata: {
            payment_id: result.paymentId,
            provider: 'moyasar',
            webhook_event: 'payment.succeeded'
          }
        });
    }

    return import { NextResponse } from "next/server";.json({ received: true });

  } catch (error) {
    return import { NextResponse } from "next/server";.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
