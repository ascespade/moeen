/**
 * Appointment Booking API - حجز المواعيد
 * Comprehensive appointment booking with availability checking and conflict validation
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { ValidationHelper } from '@/core/validation';
import { ErrorHandler } from '@/core/errors';
import { requireAuth } from '@/lib/auth/authorize';

const bookingSchema = z.object({
  patientId: z.string().uuid('Invalid patient ID'),
  doctorId: z.string().uuid('Invalid doctor ID'),
  scheduledAt: z.string().datetime('Invalid datetime format'),
  type: z.enum(['consultation', 'follow_up', 'emergency', 'routine_checkup']).default('consultation'),
  notes: z.string().optional(),
  duration: z.number().min(15).max(240).default(30), // minutes
  isVirtual: z.boolean().default(false),
  insuranceClaimId: z.string().uuid().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Authorize user
    const authResult = await requireAuth(['patient', 'staff', 'admin'])(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();
    const body = await request.json();

    // Validate input
    const validation = await ValidationHelper.validateAsync(bookingSchema, body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.message }, { status: 400 });
    }

    const { patientId, doctorId, scheduledAt, type, notes, duration, isVirtual, insuranceClaimId } = validation.data!;

    // Check doctor availability
    const doctorAvailability = await checkDoctorAvailability(doctorId, scheduledAt, duration!);
    if (!doctorAvailability.available) {
      return NextResponse.json({ 
        error: 'Doctor not available at this time',
        conflicts: doctorAvailability.conflicts 
      }, { status: 409 });
    }

    // Check for conflicts
    const conflicts = await checkAppointmentConflicts(doctorId, scheduledAt, duration!);
    if (conflicts.length > 0) {
      return NextResponse.json({ 
        error: 'Time slot conflicts with existing appointments',
        conflicts 
      }, { status: 409 });
    }

    // Verify patient exists and is active
    const { data: patient, error: patientError } = await supabase
      .from('patients')
      .select('id, isActivated, userId')
      .eq('id', patientId)
      .single();

    if (patientError || !patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    if (!patient.isActivated) {
      return NextResponse.json({ error: 'Patient account not activated' }, { status: 400 });
    }

    // Verify doctor exists and is available
    const { data: doctor, error: doctorError } = await supabase
      .from('doctors')
      .select('id, userId, speciality, schedule')
      .eq('id', doctorId)
      .single();

    if (doctorError || !doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    // Create appointment
    const { data: appointment, error: appointmentError } = await supabase
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
      })
      .select()
      .single();

    if (appointmentError) {
      return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
    }

    // Create audit log
    await supabase.from('audit_logs').insert({
      action: 'appointment_created',
      entityType: 'appointment',
      entityId: appointment.id,
      userId: authResult.user!.id,
      metadata: {
        patientId,
        doctorId,
        scheduledAt,
        type,
      },
    });

    // Send confirmation notification
    await sendAppointmentConfirmation(appointment.id);

    return NextResponse.json({
      success: true,
      data: appointment,
      message: 'Appointment booked successfully'
    });

  } catch (error) {
    return ErrorHandler.getInstance().handle(error);
  }
}

async function checkDoctorAvailability(doctorId: string, scheduledAt: string, duration: number) {
  const supabase = await createClient();
  
  // Get doctor's schedule
  const { data: doctor } = await supabase
    .from('doctors')
    .select('schedule')
    .eq('id', doctorId)
    .single();

  if (!doctor?.schedule) {
    return { available: false, conflicts: ['No schedule configured'] };
  }

  const appointmentDate = new Date(scheduledAt);
  const dayOfWeek = appointmentDate.getDay();
  const time = appointmentDate.toTimeString().slice(0, 5);

  // Check if doctor works on this day
  const schedule = doctor.schedule[dayOfWeek];
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
  const supabase = await createClient();
  
  const startTime = new Date(scheduledAt);
  const endTime = new Date(startTime.getTime() + duration * 60000);

  const { data: conflicts } = await supabase
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
  console.log(`Sending appointment confirmation for ${appointmentId}`);
}