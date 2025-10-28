import { NextRequest, NextResponse } from 'next/server';
import { SlackIntegration } from '@/lib/slack-integration';
import { createClient } from '@/lib/supabase/server';

const slack = new SlackIntegration();

export async function POST(request: NextRequest) {
  try {
    const {
      type,
      appointmentId,
      doctorId,
      patientId,
      message,
      channel = 'general',
      priority = 'medium',
    } = await request.json();

    if (!type) {
      return NextResponse.json(
        { error: 'Notification type is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    switch (type) {
      case 'appointment_created':
        await handleAppointmentCreated(
          appointmentId,
          doctorId,
          patientId,
          supabase
        );
        break;

      case 'appointment_confirmed':
        await handleAppointmentConfirmed(
          appointmentId,
          doctorId,
          patientId,
          supabase
        );
        break;

      case 'appointment_cancelled':
        await handleAppointmentCancelled(
          appointmentId,
          doctorId,
          patientId,
          supabase
        );
        break;

      case 'appointment_reminder':
        await handleAppointmentReminder(
          appointmentId,
          doctorId,
          patientId,
          supabase
        );
        break;

      case 'patient_message':
        await handlePatientMessage(
          patientId,
          doctorId,
          message,
          channel,
          supabase
        );
        break;

      case 'doctor_response':
        await handleDoctorResponse(patientId, doctorId, message, supabase);
        break;

      case 'emergency_alert':
        await handleEmergencyAlert(message, channel, priority);
        break;

      default:
        return NextResponse.json(
          { error: 'Unknown notification type' },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handleAppointmentCreated(
  appointmentId: string,
  doctorId: string,
  patientId: string,
  supabase: any
) {
  try {
    // جلب بيانات الموعد والطبيب والمريض
    const { data: appointment } = await supabase
      .from('appointments')
      .select(
        `
        *,
        doctors!appointments_doctor_id_fkey(
          first_name,
          last_name,
          specialty
        ),
        patients!appointments_patient_id_fkey(
          first_name,
          last_name,
          phone
        )
      `
      )
      .eq('id', appointmentId)
      .single();

    if (appointment) {
      await slack.sendAppointmentNotification(
        appointmentId,
        'created',
        appointment,
        appointment.doctors,
        appointment.patients
      );
    }
  } catch (error) {}
}

async function handleAppointmentConfirmed(
  appointmentId: string,
  doctorId: string,
  patientId: string,
  supabase: any
) {
  try {
    const { data: appointment } = await supabase
      .from('appointments')
      .select(
        `
        *,
        doctors!appointments_doctor_id_fkey(
          first_name,
          last_name,
          specialty
        ),
        patients!appointments_patient_id_fkey(
          first_name,
          last_name,
          phone
        )
      `
      )
      .eq('id', appointmentId)
      .single();

    if (appointment) {
      await slack.sendAppointmentNotification(
        appointmentId,
        'confirmed',
        appointment,
        appointment.doctors,
        appointment.patients
      );
    }
  } catch (error) {}
}

async function handleAppointmentCancelled(
  appointmentId: string,
  doctorId: string,
  patientId: string,
  supabase: any
) {
  try {
    const { data: appointment } = await supabase
      .from('appointments')
      .select(
        `
        *,
        doctors!appointments_doctor_id_fkey(
          first_name,
          last_name,
          specialty
        ),
        patients!appointments_patient_id_fkey(
          first_name,
          last_name,
          phone
        )
      `
      )
      .eq('id', appointmentId)
      .single();

    if (appointment) {
      await slack.sendAppointmentNotification(
        appointmentId,
        'cancelled',
        appointment,
        appointment.doctors,
        appointment.patients
      );
    }
  } catch (error) {}
}

async function handleAppointmentReminder(
  appointmentId: string,
  doctorId: string,
  patientId: string,
  supabase: any
) {
  try {
    const { data: appointment } = await supabase
      .from('appointments')
      .select(
        `
        *,
        doctors!appointments_doctor_id_fkey(
          first_name,
          last_name,
          specialty
        ),
        patients!appointments_patient_id_fkey(
          first_name,
          last_name,
          phone
        )
      `
      )
      .eq('id', appointmentId)
      .single();

    if (appointment) {
      await slack.sendAppointmentNotification(
        appointmentId,
        'reminder',
        appointment,
        appointment.doctors,
        appointment.patients
      );
    }
  } catch (error) {}
}

async function handlePatientMessage(
  patientId: string,
  doctorId: string,
  message: string,
  channel: string,
  supabase: any
) {
  try {
    // جلب بيانات المريض
    const { data: patient } = await supabase
      .from('patients')
      .select('first_name, last_name, phone')
      .eq('id', patientId)
      .single();

    if (patient) {
      await slack.sendPatientMessage(
        patientId,
        doctorId,
        message,
        channel as 'whatsapp' | 'website'
      );
    }
  } catch (error) {}
}

async function handleDoctorResponse(
  patientId: string,
  doctorId: string,
  message: string,
  supabase: any
) {
  try {
    // جلب بيانات الطبيب
    const { data: doctor } = await supabase
      .from('doctors')
      .select('first_name, last_name, specialty')
      .eq('id', doctorId)
      .single();

    if (doctor) {
      await slack.sendDoctorResponse(patientId, doctorId, message);
    }
  } catch (error) {}
}

async function handleEmergencyAlert(
  message: string,
  channel: string,
  priority: string
) {
  try {
    await slack.sendEmergencyAlert(message, channel);
  } catch (error) {}
}
