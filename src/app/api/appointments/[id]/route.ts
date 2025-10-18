import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { authorize } from '@/lib/auth/authorize';
import {
  validateData,
  appointmentUpdateSchema,
} from '@/lib/validation/schemas';
import { getClientInfo } from '@/lib/utils/request-helpers';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const startTime = Date.now();
  const { ipAddress, userAgent } = getClientInfo(request);

  try {
    const { user, error: authError } = await authorize(request);

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();
    const appointmentId = params.id;

    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .select(
        `
        id,
        public_id,
        patient_id,
        doctor_id,
        scheduled_at,
        status,
        payment_status,
        created_at,
        updated_at,
        patients!inner(id, full_name, phone, user_id),
        doctors!inner(id, speciality, user_id)
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

    // Check permissions
    if (user.role === 'patient' && appointment.patients.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    if (user.role === 'doctor' && appointment.doctors.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Log appointment view
    const supabase2 = await createClient();
    await supabase2.from('audit_logs').insert({
      action: 'appointment_viewed',
      user_id: user.id,
      resource_type: 'appointment',
      resource_id: appointmentId,
      ip_address: ipAddress,
      user_agent: userAgent,
      status: 'success',
      severity: 'info',
      duration_ms: Date.now() - startTime,
    });

    return NextResponse.json({
      appointment: {
        id: appointment.id,
        publicId: appointment.public_id,
        patient: {
          id: appointment.patients.id,
          name: appointment.patients.full_name,
          phone: appointment.patients.phone,
        },
        doctor: {
          id: appointment.doctors.id,
          speciality: appointment.doctors.speciality,
        },
        scheduledAt: appointment.scheduled_at,
        status: appointment.status,
        paymentStatus: appointment.payment_status,
        createdAt: appointment.created_at,
        updatedAt: appointment.updated_at,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const startTime = Date.now();
  const { ipAddress, userAgent } = getClientInfo(request);

  try {
    const { user, error: authError } = await authorize(request);

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validation = validateData(appointmentUpdateSchema, body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validation.errors,
        },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const appointmentId = params.id;

    // Get current appointment
    const { data: currentAppointment, error: getError } = await supabase
      .from('appointments')
      .select(
        `
        id,
        patient_id,
        doctor_id,
        status,
        patients!inner(user_id),
        doctors!inner(user_id)
      `
      )
      .eq('id', appointmentId)
      .single();

    if (getError || !currentAppointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Check permissions
    if (
      user.role === 'patient' &&
      currentAppointment.patients.user_id !== user.id
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    if (
      user.role === 'doctor' &&
      currentAppointment.doctors.user_id !== user.id
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Update appointment with tracking
    const { data: appointment, error: updateError } = await supabase
      .from('appointments')
      .update({
        ...validation.data,
        updated_at: new Date().toISOString(),
        updated_by: user.id,
        last_activity_at: new Date().toISOString(),
      })
      .eq('id', appointmentId)
      .select(
        `
        id,
        public_id,
        patient_id,
        doctor_id,
        scheduled_at,
        status,
        payment_status,
        patients!inner(full_name),
        doctors!inner(speciality)
      `
      )
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to update appointment' },
        { status: 500 }
      );
    }

    // Log appointment update with full tracking
    await supabase.from('audit_logs').insert({
      action: 'appointment_updated',
      user_id: user.id,
      resource_type: 'appointment',
      resource_id: appointmentId,
      ip_address: ipAddress,
      user_agent: userAgent,
      status: 'success',
      severity: 'info',
      metadata: {
        old_status: currentAppointment.status,
        new_status: appointment.status,
        patient_name: appointment.patients.full_name,
        changes: validation.data,
      },
      duration_ms: Date.now() - startTime,
    });

    return NextResponse.json({
      success: true,
      appointment: {
        id: appointment.id,
        publicId: appointment.public_id,
        patientName: appointment.patients.full_name,
        doctorSpeciality: appointment.doctors.speciality,
        scheduledAt: appointment.scheduled_at,
        status: appointment.status,
        paymentStatus: appointment.payment_status,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
