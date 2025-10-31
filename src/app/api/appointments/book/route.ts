/**
 * Appointment Booking API - حجز المواعيد
 * Comprehensive appointment booking with availability checking and conflict validation
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { authorize } from '@/lib/auth/authorize';
import { getClientInfo } from '@/lib/utils/request-helpers';

const bookingSchema = z.object({
  patientId: z.string().uuid('Invalid patient ID'),
  doctorId: z.string().uuid('Invalid doctor ID'),
  scheduledAt: z.string().datetime('Invalid datetime format'),
  type: z
    .enum(['consultation', 'follow_up', 'emergency', 'routine_checkup'])
    .default('consultation'),
  notes: z.string().optional(),
  duration: z.number().min(15).max(240).default(30), // minutes
  isVirtual: z.boolean().default(false),
  insuranceClaimId: z.string().uuid().optional(),
});

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const { ipAddress, userAgent } = getClientInfo(request);

  try {
    // Authorize user
    const { user, error: authError } = await authorize(request);
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check role permissions
    if (!['patient', 'staff', 'admin'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const supabase = await createClient();
    const body = await request.json();

    // Validate input
    const validation = bookingSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validation.error.issues.map((err: any) => ({
            path: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    const {
      patientId,
      doctorId,
      scheduledAt,
      type,
      notes,
      duration,
      isVirtual,
      insuranceClaimId,
    } = validation.data;

    // Check doctor availability
    const doctorAvailability = await checkDoctorAvailability(
      doctorId,
      scheduledAt,
      duration!
    );
    if (!doctorAvailability.available) {
      return NextResponse.json(
        {
          error: 'Doctor not available at this time',
          conflicts: doctorAvailability.conflicts,
        },
        { status: 409 }
      );
    }

    // Check for conflicts
    const conflicts = await checkAppointmentConflicts(
      doctorId,
      scheduledAt,
      duration!
    );
    if (conflicts.length > 0) {
      return NextResponse.json(
        {
          error: 'Time slot conflicts with existing appointments',
          conflicts,
        },
        { status: 409 }
      );
    }

    // Verify patient exists and is active
    // IMPORTANT: Database uses snake_case
    const { data: patient, error: patientError } = await supabase
      .from('patients')
      .select('id, is_activated, user_id')
      .eq('id', patientId)
      .single();

    if (patientError || !patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    if (!patient.is_activated) {
      return NextResponse.json(
        { error: 'Patient account not activated' },
        { status: 400 }
      );
    }

    // Verify doctor exists and is available
    // IMPORTANT: Database uses snake_case
    const { data: doctor, error: doctorError } = await supabase
      .from('doctors')
      .select('id, user_id, speciality, schedule')
      .eq('id', doctorId)
      .single();

    if (doctorError || !doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    // Create appointment with full tracking
    // IMPORTANT: Database uses snake_case, not camelCase
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .insert({
        patient_id: patientId,
        doctor_id: doctorId,
        scheduled_at: scheduledAt,
        type: type,
        notes: notes,
        duration: duration,
        is_virtual: isVirtual,
        status: 'pending',
        payment_status: 'unpaid',
        insurance_claim_id: insuranceClaimId,
        created_by: user.id,
        booking_source: 'web',
        last_activity_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (appointmentError) {
      return NextResponse.json(
        { error: 'Failed to create appointment' },
        { status: 500 }
      );
    }

    // Create audit log with full tracking
    // IMPORTANT: Database uses snake_case
    await supabase.from('audit_logs').insert({
      action: 'appointment_created',
      resource_type: 'appointment',
      resource_id: appointment.id,
      user_id: user.id,
      ip_address: ipAddress,
      user_agent: userAgent,
      status: 'success',
      severity: 'secondary',
      metadata: {
        patientId,
        doctorId,
        scheduledAt,
        type,
        duration,
        isVirtual,
        bookingSource: 'web',
      },
      durationMs: Date.now() - startTime,
    });

    // Send confirmation notification
    await sendAppointmentConfirmation(appointment.id);

    return NextResponse.json({
      success: true,
      data: appointment,
      message: 'Appointment booked successfully',
    });
  } catch (error) {
    console.error('Error in appointment booking:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function checkDoctorAvailability(
  doctorId: string,
  scheduledAt: string,
  duration: number
) {
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

async function checkAppointmentConflicts(
  doctorId: string,
  scheduledAt: string,
  duration: number
) {
  const supabase = await createClient();

  const startTime = new Date(scheduledAt);
  const endTime = new Date(startTime.getTime() + duration * 60000);

  // IMPORTANT: Database uses snake_case
  // Improved conflict check - fetch appointments that might overlap and filter in JS
  const { data: allAppointments } = await supabase
    .from('appointments')
    .select('id, scheduled_at, duration, patient_id')
    .eq('doctor_id', doctorId)
    .in('status', ['pending', 'confirmed', 'in_progress'])
    .lt('scheduled_at', endTime.toISOString()); // Start before our end time

  // Filter for actual overlaps
  const conflicts = (allAppointments || []).filter((appt: any) => {
    const apptStart = new Date(appt.scheduled_at);
    const apptDuration = appt.duration || 30;
    const apptEnd = new Date(apptStart.getTime() + apptDuration * 60000);
    // Check overlap: appt_start < requested_end AND appt_end > requested_start
    return apptStart < endTime && apptEnd > startTime;
  });

  return conflicts;
}

async function sendAppointmentConfirmation(appointmentId: string) {
  // This will be implemented in the notification system
  console.log(`Sending appointment confirmation for ${appointmentId}`);
}
