/**
 * Payment Processing API - معالجة المدفوعات
 * Process payments with Stripe and Moyasar integration
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { z } from 'zod';

import { ErrorHandler } from '@/core/errors';
import { ValidationHelper } from '@/core/validation';
import { requireAuth } from '@/lib/auth/authorize';
import { createClient } from '@/lib/supabase/server';
import { env } from '@/config/env';

const paymentSchema = z.object({
  appointmentId: z.string().uuid('Invalid appointment ID'),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().default('SAR'),
  method: z.enum(['stripe', 'moyasar', 'cash', 'bank_transfer']),
  paymentData: z.record(z.string(), z.any()).optional(),
  description: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

const stripe = new Stripe(env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export async function POST(_request: NextRequest) {
  try {
    // Authorize user
    const authResult = await requireAuth(['patient', 'staff', 'admin'])(_request);
    if (!authResult.authorized || !authResult.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const authUser = authResult.user;

    const supabase = await createClient();
    const body = await _request.json();

    // Validate input
    const validation = await ValidationHelper.validateAsync(
      paymentSchema,
      body
    );
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.message },
        { status: 400 }
      );
    }

    const {
      appointmentId,
      amount,
      currency,
      method,
      paymentData,
      description,
      metadata,
    } = validation.data;
    const currencyCode = currency || 'SAR';

    // Verify appointment exists and get details
    // IMPORTANT: Database uses snake_case
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .select(
        `
        id,
        patient_id,
        doctor_id,
        scheduled_at,
        status,
        payment_status,
        patients!inner(id, full_name, email),
        doctors!inner(id, full_name, speciality)
      `
      )
      .eq('id', appointmentId)
      .single();

    if (appointmentError || !appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    if (appointment.payment_status === 'paid') {
      return NextResponse.json(
        { error: 'Appointment already paid' },
        { status: 400 }
      );
    }

    // Process payment based on method
    let paymentResult;
    switch (method) {
      case 'stripe':
        paymentResult = await __processStripePayment(
          amount,
          currencyCode,
          paymentData,
          appointment
        );
        break;
      case 'moyasar':
        paymentResult = await __processMoyasarPayment(
          amount,
          currencyCode,
          paymentData,
          appointment
        );
        break;
      case 'cash':
        paymentResult = await __processCashPayment(
          amount,
          currencyCode,
          appointment
        );
        break;
      case 'bank_transfer':
        paymentResult = await __processBankTransfer(
          amount,
          currencyCode,
          appointment
        );
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid payment method' },
          { status: 400 }
        );
    }

    if (!paymentResult.success) {
      return NextResponse.json(
        { error: (paymentResult as any).error },
        { status: 400 }
      );
    }

    // Create payment record
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        appointmentId,
        amount,
        currency,
        method,
        status: paymentResult.status,
        transactionId: paymentResult.transactionId,
        paymentData: paymentResult.paymentData,
        description: description || `Payment for appointment ${appointmentId}`,
        metadata: {
          ...metadata,
          patientId: (appointment as any).patientId,
          doctorId: (appointment as any).doctorId,
        },
        processedBy: authUser.id,
      })
      .select()
      .single();

    if (paymentError) {
      return NextResponse.json(
        { error: 'Failed to create payment record' },
        { status: 500 }
      );
    }

    // Update appointment payment status
    // IMPORTANT: Database uses snake_case
    await supabase
      .from('appointments')
      .update({ payment_status: paymentResult.status })
      .eq('id', appointmentId);

    // Create audit log
    // IMPORTANT: Database uses snake_case
    await supabase.from('audit_logs').insert({
      action: 'payment_processed',
      resource_type: 'payment',
      resource_id: payment.id,
      user_id: authUser.id,
      metadata: {
        appointment_id: appointmentId,
        amount,
        method,
        status: paymentResult.status,
      },
    });

    // Send payment confirmation
    await __sendPaymentConfirmation(payment.id, appointment);

    return NextResponse.json({
      success: true,
      data: payment,
      message: 'Payment processed successfully',
    });
  } catch (error) {
    return ErrorHandler.getInstance().handle(error as Error);
  }
}

async function __processStripePayment(
  amount: number,
  currency: string,
  paymentData: unknown,
  appointment: unknown
) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      description: `Payment for appointment ${(appointment as any).id}`,
      metadata: {
        appointmentId: (appointment as any).id,
        patientId: (appointment as any).patientId,
        doctorId: (appointment as any).doctorId,
      },
      ...(paymentData || {}),
    });

    return {
      success: true,
      status: 'pending',
      transactionId: paymentIntent.id,
      paymentData: {
        clientSecret: paymentIntent.client_secret,
        status: paymentIntent.status,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: 'Stripe payment failed',
    };
  }
}

async function __processMoyasarPayment(
  amount: number,
  currency: string,
  paymentData: unknown,
  appointment: unknown
) {
  try {
    // Moyasar API integration
    const moyasarResponse = await fetch('https://api.moyasar.com/v1/payments', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.MOYASAR_SECRET_KEY || ''}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Convert to halalas
        currency: currency,
        description: `Payment for appointment ${(appointment as any).id}`,
        metadata: {
          appointmentId: (appointment as any).id,
          patientId: (appointment as any).patientId,
          doctorId: (appointment as any).doctorId,
        },
        ...(paymentData || {}),
      }),
    });

    const result = await moyasarResponse.json();

    if (!moyasarResponse.ok) {
      return {
        success: false,
        error: result.message || 'Moyasar payment failed',
      };
    }

    return {
      success: true,
      status: result.status === 'paid' ? 'paid' : 'pending',
      transactionId: result.id,
      paymentData: result,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Moyasar payment failed',
    };
  }
}

async function __processCashPayment(
  amount: number,
  currency: string,
  appointment: unknown
) {
  // Cash payments are immediately marked as paid
  return {
    success: true,
    status: 'paid',
    transactionId: `CASH_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    paymentData: {
      method: 'cash',
      amount,
      currency,
    },
  };
}

async function __processBankTransfer(
  amount: number,
  currency: string,
  appointment: unknown
) {
  // Bank transfers are marked as pending until confirmed
  return {
    success: true,
    status: 'pending',
    transactionId: `BANK_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    paymentData: {
      method: 'bank_transfer',
      amount,
      currency,
      instructions:
        'Please transfer the amount to our bank account and provide the reference number.',
    },
  };
}

async function __sendPaymentConfirmation(
  _paymentId: string,
  appointment: unknown
) {
  // This will be implemented in the notification system
  // // console.log(`Sending payment confirmation for payment ${paymentId}`);
}
