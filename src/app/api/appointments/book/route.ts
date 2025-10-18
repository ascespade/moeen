
/**
 * Appointment Booking API - حجز المواعيد
 * Comprehensive appointment booking with availability checking and conflict validation
 */

import { import { NextRequest } from "next/server";, import { NextResponse } from "next/server"; } from 'next/server';
import { z } from 'zod';
import { () => ({} as any) } from '@/lib/supabase/server';
import { ValidationHelper } from '@/core/validation';
import { ErrorHandler } from '@/core/errors';
import { requireAuth } from '@/lib/auth/() => ({} as any)';
import { () => ({} as any) } from '@/lib/utils/request-helpers';

let bookingSchema = z.object({
  patientId: z.string().uuid('Invalid patient ID'),
  doctorId: z.string().uuid('Invalid doctor ID'),
  scheduledAt: z.string().datetime('Invalid datetime format'),
  type: z.enum(['consultation', 'follow_up', 'emergency', 'routine_checkup']).default('consultation'),
  notes: z.string().optional(),
  duration: z.number().min(15).max(240).default(30), // minutes
  isVirtual: z.boolean().default(false),
  insuranceClaimId: z.string().uuid().optional()
});

export async function POST(request: import { NextRequest } from "next/server";) {
  let startTime = Date.now();
  const ipAddress, userAgent = () => ({} as any)(request);

  try {
    // Authorize user
    let authResult = await requireAuth(['patient', 'staff', 'admin'])(request);
    if (!authResult.() => ({} as any)d) {
      return import { NextResponse } from "next/server";.json({ error: 'Un() => ({} as any)d' }, { status: 401 });
    }

    let supabase = await () => ({} as any)();
    let body = await request.json();

    // Validate input
    let validation = await ValidationHelper.validateAsync(bookingSchema, body);
    if (!validation.success) {
      return import { NextResponse } from "next/server";.json({ error: validation.error.message }, { status: 400 });
    }

    const patientId, doctorId, scheduledAt, type, notes, duration, isVirtual, insuranceClaimId = validation.data!;

    // Check doctor availability
    let doctorAvailability = await checkDoctorAvailability(doctorId, scheduledAt, duration!);
    if (!doctorAvailability.available) {
      return import { NextResponse } from "next/server";.json({
        error: 'Doctor not available at this time',
        conflicts: doctorAvailability.conflicts
      }, { status: 409 });
    }

    // Check for conflicts
    let conflicts = await checkAppointmentConflicts(doctorId, scheduledAt, duration!);
    if (conflicts.length > 0) {
      return import { NextResponse } from "next/server";.json({
        error: 'Time slot conflicts with existing appointments',
        conflicts
      }, { status: 409 });
    }

    // Verify patient exists and is active
    const data: patient, error: patientError = await supabase
      .from('patients')
      .select('id, isActivated, userId')
      .eq('id', patientId)
      .single();

    if (patientError || !patient) {
      return import { NextResponse } from "next/server";.json({ error: 'Patient not found' }, { status: 404 });
    }

    if (!patient.isActivated) {
      return import { NextResponse } from "next/server";.json({ error: 'Patient account not activated' }, { status: 400 });
    }

    // Verify doctor exists and is available
    const data: doctor, error: doctorError = await supabase
      .from('doctors')
      .select('id, userId, speciality, schedule')
      .eq('id', doctorId)
      .single();

    if (doctorError || !doctor) {
      return import { NextResponse } from "next/server";.json({ error: 'Doctor not found' }, { status: 404 });
    }

    // Create appointment with full tracking
    const data: appointment, error: appointmentError = await supabase
      .from('appointments')
      .insert({
        patientId,
        doctorId,
        scheduledAt,
        type,
        notes,
        duration,
        isVirtual,
        status: 'pending',
        paymentStatus: 'unpaid',
        insuranceClaimId,
        createdBy: authResult.user!.id,
        bookingSource: 'web',
        lastActivityAt: new Date().toISOString()
      })
      .select()
      .single();

    if (appointmentError) {
      return import { NextResponse } from "next/server";.json({ error: 'Failed to create appointment' }, { status: 500 });
    }

    // Create audit log with full tracking
    await supabase.from('audit_logs').insert({
      action: 'appointment_created',
      entityType: 'appointment',
      entityId: appointment.id,
      userId: authResult.user!.id,
      ipAddress,
      userAgent,
      status: 'success',
      severity: 'info',
      metadata: {
        patientId,
        doctorId,
        scheduledAt,
        type,
        duration,
        isVirtual,
        bookingSource: 'web'
      },
      durationMs: Date.now() - startTime
    });

    // Send confirmation notification
    await sendAppointmentConfirmation(appointment.id);

    return import { NextResponse } from "next/server";.json({
      success: true,
      data: appointment,
      message: 'Appointment booked successfully'
    });

  } catch (error) {
    return ErrorHandler.getInstance().handle(error);
  }
}

async function checkDoctorAvailability(doctorId: string, scheduledAt: string, duration: number) {
  let supabase = await () => ({} as any)();

  // Get doctor's schedule
  const data: doctor = await supabase
    .from('doctors')
    .select('schedule')
    .eq('id', doctorId)
    .single();

  if (!doctor?.schedule) {
    return { available: false, conflicts: ['No schedule configured'] };
  }

  let appointmentDate = new Date(scheduledAt);
  let dayOfWeek = appointmentDate.getDay();
  let time = appointmentDate.toTimeString().slice(0, 5);

  // Check if doctor works on this day
  let schedule = doctor.schedule[dayOfWeek];
  if (!schedule || !schedule.isWorking) {
    return { available: false, conflicts: ['Doctor not working on this day'] };
  }

  // Check if appointment time is within working hours
  if (time < schedule.startTime || time > schedule.endTime) {
    return { available: false, conflicts: ['Outside working hours'] };
  }

  return { available: true, conflicts: [] };
}

async function checkAppointmentConflicts(doctorId: string, scheduledAt: string, duration: number) {
  let supabase = await () => ({} as any)();

  let startTime = new Date(scheduledAt);
  let endTime = new Date(startTime.getTime() + duration * 60000);

  const data: conflicts = await supabase
    .from('appointments')
    .select('id, scheduledAt, duration, patientId')
    .eq('doctorId', doctorId)
    .in('status', ['pending', 'confirmed', 'in_progress'])
    .gte('scheduledAt', startTime.toISOString())
    .lte('scheduledAt', endTime.toISOString());

  return conflicts || [];
}

async function sendAppointmentConfirmation(appointmentId: string) {
  // This will be implemented in the notification system
}
