import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { authorize } from '@/lib/auth/authorize';
import { emailService } from '@/lib/notifications/email';

export async function POST(request: NextRequest) {
  try {
    const { user, error: authError } = await authorize(request);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only staff, supervisor, and admin can send notifications
    if (!['staff', 'supervisor', 'admin'].includes(user.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { 
      type, 
      patientId, 
      appointmentId, 
      customMessage,
      notificationData = {} 
    } = await request.json();

    if (!type || !patientId) {
      return NextResponse.json({ 
        error: 'Missing required fields: type, patientId' 
      }, { status: 400 });
    }

    const supabase = createClient();

    // Get patient details
    const { data: patient, error: patientError } = await supabase
      .from('patients')
      .select('id, full_name, email, user_id')
      .eq('id', patientId)
      .single();

    if (patientError || !patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    // Get user email if patient doesn't have direct email
    let patientEmail = patient.email;
    if (!patientEmail && patient.user_id) {
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('email')
        .eq('id', patient.user_id)
        .single();

      if (!userError && user) {
        patientEmail = user.email;
      }
    }

    if (!patientEmail) {
      return NextResponse.json({ error: 'Patient email not found' }, { status: 400 });
    }

    let result;

    switch (type) {
      case 'appointment_confirmation':
        if (!appointmentId) {
          return NextResponse.json({ error: 'Appointment ID required for appointment confirmation' }, { status: 400 });
        }

        // Get appointment details
        const { data: appointment, error: appointmentError } = await supabase
          .from('appointments')
          .select(`
            id,
            scheduled_at,
            doctors!inner(speciality, users!inner(email))
          `)
          .eq('id', appointmentId)
          .single();

        if (appointmentError || !appointment) {
          return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
        }

        const appointmentDate = new Date(appointment.scheduled_at);
        result = await emailService.sendAppointmentConfirmation({
          patientEmail,
          patientName: patient.full_name,
          doctorName: appointment.doctors.users.email, // This should be doctor name
          appointmentDate: appointmentDate.toLocaleDateString('ar-SA'),
          appointmentTime: appointmentDate.toLocaleTimeString('ar-SA', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          speciality: appointment.doctors.speciality
        });
        break;

      case 'payment_confirmation':
        const { amount, paymentMethod, transactionId } = notificationData;
        if (!amount || !paymentMethod || !transactionId) {
          return NextResponse.json({ 
            error: 'Missing payment data: amount, paymentMethod, transactionId' 
          }, { status: 400 });
        }

        result = await emailService.sendPaymentConfirmation({
          patientEmail,
          patientName: patient.full_name,
          amount,
          paymentMethod,
          transactionId,
          paymentDate: new Date().toLocaleDateString('ar-SA')
        });
        break;

      case 'appointment_reminder':
        if (!appointmentId) {
          return NextResponse.json({ error: 'Appointment ID required for appointment reminder' }, { status: 400 });
        }

        // Get appointment details for reminder
        const { data: reminderAppointment, error: reminderError } = await supabase
          .from('appointments')
          .select(`
            id,
            scheduled_at,
            doctors!inner(users!inner(email))
          `)
          .eq('id', appointmentId)
          .single();

        if (reminderError || !reminderAppointment) {
          return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
        }

        const reminderDate = new Date(reminderAppointment.scheduled_at);
        result = await emailService.sendAppointmentReminder({
          patientEmail,
          patientName: patient.full_name,
          doctorName: reminderAppointment.doctors.users.email, // This should be doctor name
          appointmentDate: reminderDate.toLocaleDateString('ar-SA'),
          appointmentTime: reminderDate.toLocaleTimeString('ar-SA', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })
        });
        break;

      default:
        return NextResponse.json({ error: 'Invalid notification type' }, { status: 400 });
    }

    if (!result.success) {
      return NextResponse.json({ 
        error: result.error || 'Failed to send notification' 
      }, { status: 500 });
    }

    // Log notification
    await supabase
      .from('audit_logs')
      .insert({
        action: 'notification_sent',
        user_id: user.id,
        resource_type: 'notification',
        resource_id: patientId,
        metadata: {
          type,
          patient_name: patient.full_name,
          patient_email: patientEmail,
          appointment_id: appointmentId
        }
      });

    return NextResponse.json({
      success: true,
      message: 'Notification sent successfully'
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}