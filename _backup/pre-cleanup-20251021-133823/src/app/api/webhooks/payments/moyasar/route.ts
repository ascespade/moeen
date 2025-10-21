import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { moyasarService } from '@/lib/payments/moyasar';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Verify webhook signature (implement Moyasar signature verification)
    const signature = request.headers.get('x-moyasar-signature');
    if (!signature) {
      return NextResponse.json(
        { error: 'Missing Moyasar signature' },
        { status: 400 }
      );
    }

    // Process webhook
    const result = await moyasarService.handleWebhook(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Webhook processing failed' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Find payment record by payment ID
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('meta->>payment_id', result.paymentId)
      .single();

    if (paymentError || !payment) {
      return NextResponse.json(
        { error: 'Payment record not found' },
        { status: 404 }
      );
    }

    // Update payment status based on webhook event
    const newStatus = result.status === 'succeeded' ? 'completed' : 'failed';

    const { error: updateError } = await supabase
      .from('payments')
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', payment.id);

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to update payment status' },
        { status: 500 }
      );
    }

    // If payment completed, update appointment payment status
    if (newStatus === 'completed') {
      await supabase
        .from('appointments')
        .update({
          payment_status: 'paid',
          updated_at: new Date().toISOString(),
        })
        .eq('id', payment.appointment_id);

      // Log successful payment
      await supabase.from('audit_logs').insert({
        action: 'payment_completed',
        user_id: null, // System action
        resource_type: 'payment',
        resource_id: payment.id,
        metadata: {
          payment_id: result.paymentId,
          provider: 'moyasar',
          webhook_event: 'payment.succeeded',
        },
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
