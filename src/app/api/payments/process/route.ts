/**
 * Payment Processing API - معالجة المدفوعات
 * Process payments with Stripe and Moyasar integration
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { ValidationHelper } from '@/core/validation';
import { ErrorHandler } from '@/core/errors';
import { requireAuth } from '@/lib/auth/authorize';
import Stripe from 'stripe';

const paymentSchema = z.object({
  appointmentId: z.string().uuid('Invalid appointment ID'),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().default('SAR'),
  method: z.enum(['stripe', 'moyasar', 'cash', 'bank_transfer']),
  paymentData: z.record(z.any()).optional().default({}),
  description: z.string().optional(),
  metadata: z.record(z.any()).optional().default({}),
});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(request: NextRequest) {
  try {
    // Authorize user
    const authResult = await requireAuth(['patient', 'staff', 'admin'])(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createClient();
    const body = await request.json();

    // Validate input
    const validation = await ValidationHelper.validateAsync(paymentSchema, body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.message }, { status: 400 });
    }

    const { appointmentId, amount, currency, method, paymentData, description, metadata } = validation.data;

    // Verify appointment exists and get details
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .select(`
        id,
        patientId,
        doctorId,
        scheduledAt,
        status,
        paymentStatus,
        patients(id, fullName, email),
        doctors(id, fullName, speciality)
      `)
      .eq('id', appointmentId)
      .single();

    if (appointmentError || !appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    if (appointment.paymentStatus === 'paid') {
      return NextResponse.json({ error: 'Appointment already paid' }, { status: 400 });
    }

    // Process payment based on method
    let paymentResult;
    switch (method) {
      case 'stripe':
        paymentResult = await processStripePayment(amount, currency, paymentData, appointment);
        break;
      case 'moyasar':
        paymentResult = await processMoyasarPayment(amount, currency, paymentData, appointment);
        break;
      case 'cash':
        paymentResult = await processCashPayment(amount, currency, appointment);
        break;
      case 'bank_transfer':
        paymentResult = await processBankTransfer(amount, currency, appointment);
        break;
      default:
        return NextResponse.json({ error: 'Invalid payment method' }, { status: 400 });
    }

    if (!paymentResult.success) {
      return NextResponse.json({ error: paymentResult.error }, { status: 400 });
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
          patientId: appointment.patientId,
          doctorId: appointment.doctorId,
        },
        processedBy: authResult.user!.id,
      })
      .select()
      .single();

    if (paymentError) {
      return NextResponse.json({ error: 'Failed to create payment record' }, { status: 500 });
    }

    // Update appointment payment status
    await supabase
      .from('appointments')
      .update({ paymentStatus: paymentResult.status })
      .eq('id', appointmentId);

    // Create audit log
    await supabase.from('audit_logs').insert({
      action: 'payment_processed',
      entityType: 'payment',
      entityId: payment.id,
      userId: authResult.user!.id,
      metadata: {
        appointmentId,
        amount,
        method,
        status: paymentResult.status,
      },
    });

    // Send payment confirmation
    await sendPaymentConfirmation(payment.id, appointment);

    return NextResponse.json({
      success: true,
      data: payment,
      message: 'Payment processed successfully'
    });

  } catch (error) {
    return ErrorHandler.getInstance().handle(error);
  }
}

async function processStripePayment(amount: number, currency: string, paymentData: any, appointment: any) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      description: `Payment for appointment ${appointment.id}`,
      metadata: {
        appointmentId: appointment.id,
        patientId: appointment.patientId,
        doctorId: appointment.doctorId,
      },
      ...paymentData,
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

async function processMoyasarPayment(amount: number, currency: string, paymentData: any, appointment: any) {
  try {
    // Moyasar API integration
    const moyasarResponse = await fetch('https://api.moyasar.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.MOYASAR_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Convert to halalas
        currency: currency,
        description: `Payment for appointment ${appointment.id}`,
        metadata: {
          appointmentId: appointment.id,
          patientId: appointment.patientId,
          doctorId: appointment.doctorId,
        },
        ...paymentData,
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

async function processCashPayment(amount: number, currency: string, appointment: any) {
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

async function processBankTransfer(amount: number, currency: string, appointment: any) {
  // Bank transfers are marked as pending until confirmed
  return {
    success: true,
    status: 'pending',
    transactionId: `BANK_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    paymentData: {
      method: 'bank_transfer',
      amount,
      currency,
      instructions: 'Please transfer the amount to our bank account and provide the reference number.',
    },
  };
}

async function sendPaymentConfirmation(paymentId: string, appointment: any) {
  // This will be implemented in the notification system
  console.log(`Sending payment confirmation for payment ${paymentId}`);
}