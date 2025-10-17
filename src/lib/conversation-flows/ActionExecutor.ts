
// Add missing methods to ActionExecutor
interface ActionExecutor {
  createAppointment(data: any): Promise<any>;
  sendNotification(data: any): Promise<any>;
  sendReminder(data: any): Promise<any>;
  updatePatient(data: any): Promise<any>;
  sendEmail(data: any): Promise<any>;
}
import { FlowAction, ConversationContext } from './types';
import { createClient } from '@/lib/supabase/server';
import { emailService } from '@/lib/notifications/email';
import { smsService } from '@/lib/notifications/sms';

export class ActionExecutor {
  private supabase = createClient();

  async executeAction(action: FlowAction, context: ConversationContext): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      switch (action.type) {
        case 'create_appointment':
          return await this.createAppointment(action.data, context);
        
        case 'send_notification':
          return await this.sendNotification(action.data, context);
        
        case 'send_reminder':
          return await this.sendReminder(action.data, context);
        
        case 'update_patient':
          return await this.updatePatient(action.data, context);
        
        case 'send_email':
          return await this.sendEmail(action.data, context);
        
        case 'send_sms':
          return await this.sendSMS(action.data, context);
        
        default:
          return { success: false, error: 'Unknown action type' };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Action execution failed' 
      };
    }
  }

  private async createAppointment(data: any, context: ConversationContext) {
    const { doctorId, appointmentTime, patientId, notes } = data;

    if (!doctorId || !appointmentTime || !patientId) {
      return { success: false, error: 'Missing required appointment data' };
    }

    // Get patient details
    const { data: patient, error: patientError } = await this.supabase
      .from('patients')
      .select('id, full_name, user_id')
      .eq('user_id', patientId)
      .single();

    if (patientError || !patient) {
      return { success: false, error: 'Patient not found' };
    }

    // Check for conflicts
    const { data: conflicts, error: conflictError } = await this.supabase
      .from('appointments')
      .select('id')
      .eq('doctor_id', doctorId)
      .eq('scheduled_at', appointmentTime)
      .in('status', ['pending', 'confirmed', 'in_progress']);

    if (conflictError) {
      return { success: false, error: 'Failed to check appointment conflicts' };
    }

    if (conflicts && conflicts.length > 0) {
      return { success: false, error: 'Doctor has a conflicting appointment at this time' };
    }

    // Create appointment
    const { data: appointment, error: appointmentError } = await this.supabase
      .from('appointments')
      .insert({
        patient_id: patient.id,
        doctor_id: doctorId,
        scheduled_at: appointmentTime,
        status: 'pending',
        payment_status: 'unpaid',
        notes: notes || 'Created via chatbot'
      })
      .select(`
        id,
        scheduled_at,
        status,
        patients!inner(full_name),
        doctors!inner(speciality)
      `)
      .single();

    if (appointmentError) {
      return { success: false, error: 'Failed to create appointment' };
    }

    // Log appointment creation
    await this.supabase
      .from('audit_logs')
      .insert({
        action: 'appointment_created_via_chatbot',
        user_id: patientId,
        resource_type: 'appointment',
        resource_id: appointment.id,
        metadata: {
          patient_name: patient.full_name,
          doctor_id: doctorId,
          scheduled_at: appointmentTime,
          created_via: 'chatbot'
        }
      });

    return { 
      success: true, 
      data: {
        appointmentId: appointment.id,
        patientName: appointment.patients.full_name,
        doctorSpeciality: appointment.doctors.speciality,
        scheduledAt: appointment.scheduled_at,
        status: appointment.status
      }
    };
  }

  private async sendNotification(data: any, context: ConversationContext) {
    const { type, patientId, channels = ['email'], notificationData = {} } = data;

    // Call the notification API
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/notifications/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${context.userId}` // This would be a proper auth token
      },
      body: JSON.stringify({
        type,
        patientId,
        channels,
        notificationData
      })
    });

    if (!response.ok) {
      return { success: false, error: 'Failed to send notification' };
    }

    const result = await response.json();
    return { success: true, data: result };
  }

  private async sendReminder(data: any, context: ConversationContext) {
    const { appointmentId, reminderType = 'appointment', timeBefore = 24 } = data;

    if (!appointmentId) {
      return { success: false, error: 'Appointment ID required for reminder' };
    }

    // Get appointment details
    const { data: appointment, error: appointmentError } = await this.supabase
      .from('appointments')
      .select(`
        id,
        scheduled_at,
        patients!inner(id, full_name, phone, user_id),
        doctors!inner(speciality, users!inner(email))
      `)
      .eq('id', appointmentId)
      .single();

    if (appointmentError || !appointment) {
      return { success: false, error: 'Appointment not found' };
    }

    // Calculate reminder time
    const appointmentTime = new Date(appointment.scheduled_at);
    const reminderTime = new Date(appointmentTime.getTime() - (timeBefore * 60 * 60 * 1000));

    // Schedule reminder (in a real system, this would use a job queue)
    const { data: reminder, error: reminderError } = await this.supabase
      .from('scheduled_reminders')
      .insert({
        appointment_id: appointmentId,
        reminder_type: reminderType,
        scheduled_for: reminderTime.toISOString(),
        status: 'pending',
        created_by: context.userId
      })
      .select()
      .single();

    if (reminderError) {
      return { success: false, error: 'Failed to schedule reminder' };
    }

    return { 
      success: true, 
      data: {
        reminderId: reminder.id,
        scheduledFor: reminder.scheduled_for,
        appointmentTime: appointment.scheduled_at,
        patientName: appointment.patients.full_name
      }
    };
  }

  private async updatePatient(data: any, context: ConversationContext) {
    const { patientId, updates } = data;

    if (!patientId || !updates) {
      return { success: false, error: 'Patient ID and updates required' };
    }

    const { data: patient, error: updateError } = await this.supabase
      .from('patients')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', patientId)
      .select()
      .single();

    if (updateError) {
      return { success: false, error: 'Failed to update patient' };
    }

    return { success: true, data: patient };
  }

  private async sendEmail(data: any, context: ConversationContext) {
    const { to, template, templateData } = data;

    const result = await emailService.sendEmail({
      to,
      template,
      data: templateData,
      language: 'ar'
    });

    return result;
  }

  private async sendSMS(data: any, context: ConversationContext) {
    const { to, message } = data;

    const result = await smsService.sendSMS({
      to,
      message,
      language: 'ar'
    });

    return result;
  }
}