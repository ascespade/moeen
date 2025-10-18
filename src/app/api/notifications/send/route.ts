export async function POST(request: NextRequest) {
import { NextRequest, NextResponse } from 'next/server';
import { authorize } from '@/lib/auth/authorize';
import { createClient } from '@/lib/supabase/server';
import { emailService } from '@/lib/notifications/email';
import { smsService } from '@/lib/notifications/sms';

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
      notificationData = {},
      channels = ['email'] // email, sms, both
    } = await request.json();

    if (!type || !patientId) {
      return NextResponse.json({ 
        error: 'Missing required fields: type, patientId' 
      }, { status: 400 });
    }

    const supabase = await createClient();

    // Get patient details
    const { data: patient, error: patientError } = await supabase
      .from('patients')
      .select('id, full_name, email, user_id')
      .eq('id', patientId)
      .single();

    if (patientError || !patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    // Get user email and phone if patient doesn't have direct contact info
    let patientEmail = patient.email;
    let patientPhone = patient.phone;
    
    if ((!patientEmail || !patientPhone) && patient.user_id) {
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('email, meta')
        .eq('id', patient.user_id)
        .single();

      if (!userError && user) {
        if (!patientEmail) patientEmail = user.email;
        if (!patientPhone) patientPhone = user.meta?.phone;
      }
    }

    if (channels.includes('email') && !patientEmail) {
      return NextResponse.json({ error: 'Patient email not found' }, { status: 400 });
    }

    if (channels.includes('sms') && !patientPhone) {
      return NextResponse.json({ error: 'Patient phone not found' }, { status: 400 });
    }

    const results: Array<{ channel: string; success: boolean; data?: any; error?: string }> = [];

    // Send email notifications
    if (channels.includes('email') || channels.includes('both')) {
      let emailResult;

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
        emailResult = await emailService.sendAppointmentConfirmation({
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

        emailResult = await emailService.sendPaymentConfirmation({
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
        emailResult = await emailService.sendAppointmentReminder({
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

      if (emailResult) {
        results.push({ channel: 'email', ...emailResult });
      }
    }

    // Send SMS notifications
    if (channels.includes('sms') || channels.includes('both')) {
      let smsResult;

      switch (type) {
        case 'appointment_confirmation':
          if (appointmentId) {
            const { data: smsAppointment, error: smsAppointmentError } = await supabase
              .from('appointments')
              .select(`
                id,
                scheduled_at,
                doctors!inner(users!inner(email))
              `)
              .eq('id', appointmentId)
              .single();

            if (!smsAppointmentError && smsAppointment) {
              const smsAppointmentDate = new Date(smsAppointment.scheduled_at);
              smsResult = await smsService.sendAppointmentConfirmation({
                patientPhone,
                patientName: patient.full_name,
                doctorName: smsAppointment.doctors.users.email,
                appointmentDate: smsAppointmentDate.toLocaleDateString('ar-SA'),
                appointmentTime: smsAppointmentDate.toLocaleTimeString('ar-SA', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })
              });
            }
          }
          break;

        case 'payment_confirmation':
          const { amount, paymentMethod, transactionId } = notificationData;
          if (amount && paymentMethod) {
            smsResult = await smsService.sendPaymentConfirmation({
              patientPhone,
              patientName: patient.full_name,
              amount,
              paymentMethod
            });
          }
          break;

        case 'appointment_reminder':
          if (appointmentId) {
            const { data: smsReminderAppointment, error: smsReminderError } = await supabase
              .from('appointments')
              .select(`
                id,
                scheduled_at,
                doctors!inner(users!inner(email))
              `)
              .eq('id', appointmentId)
              .single();

            if (!smsReminderError && smsReminderAppointment) {
              const smsReminderDate = new Date(smsReminderAppointment.scheduled_at);
              smsResult = await smsService.sendAppointmentReminder({
                patientPhone,
                patientName: patient.full_name,
                doctorName: smsReminderAppointment.doctors.users.email,
                appointmentDate: smsReminderDate.toLocaleDateString('ar-SA'),
                appointmentTime: smsReminderDate.toLocaleTimeString('ar-SA', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })
              });
            }
          }
          break;

        case 'insurance_claim_update':
          const { claimStatus, provider } = notificationData;
          if (claimStatus && provider) {
            smsResult = await smsService.sendInsuranceClaimUpdate({
              patientPhone,
              patientName: patient.full_name,
              claimStatus,
              provider
            });
          }
          break;
      }

      if (smsResult) {
        results.push({ channel: 'sms', ...smsResult });
      }
    }

    // Check if any notification failed
    const failedResults = results.filter(result => !result.success);
    if (failedResults.length > 0) {
      return NextResponse.json({ 
        error: 'Some notifications failed', 
        details: failedResults 
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