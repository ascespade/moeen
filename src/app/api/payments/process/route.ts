import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { authorize } from '@/lib/auth/authorize';
import { stripeService } from '@/lib/payments/stripe';
import { moyasarService } from '@/lib/payments/moyasar';

export async function POST(request: NextRequest) {
  try {
    const { user, error: authError } = await authorize(request);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { 
      appointmentId, 
      amount, 
      currency = 'SAR', 
      method = 'card',
      provider = 'stripe',
      metadata = {} 
    } = await request.json();

    if (!appointmentId || !amount) {
      return NextResponse.json({ 
        error: 'Missing required fields: appointmentId, amount' 
      }, { status: 400 });
    }

    const supabase = createClient();

    // Get appointment details
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .select(`
        id,
        patient_id,
        patients!inner(id, full_name, user_id)
      `)
      .eq('id', appointmentId)
      .single();

    if (appointmentError || !appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    // Check if user has permission to process this payment
    if (user.role === 'patient' && appointment.patients.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    let paymentResult;

    // Process payment based on provider
    if (provider === 'stripe') {
      paymentResult = await stripeService.createPaymentIntent({
        amount,
        currency,
        patientId: appointment.patient_id,
        appointmentId: appointment.id,
        metadata: {
          ...metadata,
          patient_name: appointment.patients.full_name
        }
      });
    } else if (provider === 'moyasar') {
      paymentResult = await moyasarService.createPayment({
        amount,
        currency,
        description: `Payment for appointment ${appointment.id}`,
        patientId: appointment.patient_id,
        appointmentId: appointment.id,
        metadata: {
          ...metadata,
          patient_name: appointment.patients.full_name
        }
      });
    } else {
      return NextResponse.json({ error: 'Unsupported payment provider' }, { status: 400 });
    }

    if (!paymentResult.success) {
      return NextResponse.json({ 
        error: paymentResult.error || 'Payment processing failed' 
      }, { status: 400 });
    }

    // Create payment record in database
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        appointment_id: appointmentId,
        amount,
        currency,
        method,
        status: 'pending',
        meta: {
          provider,
          payment_id: paymentResult.paymentIntentId || paymentResult.paymentId,
          client_secret: paymentResult.clientSecret,
          ...metadata
        }
      })
      .select()
      .single();

    if (paymentError) {
      return NextResponse.json({ error: 'Failed to create payment record' }, { status: 500 });
    }

    // Log payment creation
    await supabase
      .from('audit_logs')
      .insert({
        action: 'payment_created',
        user_id: user.id,
        resource_type: 'payment',
        resource_id: payment.id,
        metadata: {
          appointment_id: appointmentId,
          amount,
          provider,
          patient_name: appointment.patients.full_name
        }
      });

    return NextResponse.json({
      success: true,
      payment: {
        id: payment.id,
        amount,
        currency,
        method,
        status: payment.status,
        client_secret: paymentResult.clientSecret,
        payment_intent_id: paymentResult.paymentIntentId || paymentResult.paymentId
      }
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { user, error: authError } = await authorize(request);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { paymentId, status, provider = 'stripe' } = await request.json();

    if (!paymentId || !status) {
      return NextResponse.json({ 
        error: 'Missing required fields: paymentId, status' 
      }, { status: 400 });
    }

    const supabase = createClient();

    // Get payment record
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('id', paymentId)
      .single();

    if (paymentError || !payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    // Update payment status
    const { error: updateError } = await supabase
      .from('payments')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', paymentId);

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update payment status' }, { status: 500 });
    }

    // If payment is completed, update appointment payment status
    if (status === 'completed') {
      await supabase
        .from('appointments')
        .update({ 
          payment_status: 'paid',
          updated_at: new Date().toISOString()
        })
        .eq('id', payment.appointment_id);
    }

    // Log payment status update
    await supabase
      .from('audit_logs')
      .insert({
        action: 'payment_status_updated',
        user_id: user.id,
        resource_type: 'payment',
        resource_id: paymentId,
        metadata: {
          old_status: payment.status,
          new_status: status,
          provider
        }
      });

    return NextResponse.json({
      success: true,
      payment: {
        id: paymentId,
        status,
        updated_at: new Date().toISOString()
      }
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}