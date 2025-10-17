import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

// Add missing methods to ActionExecutor
interface ActionExecutorInterface {
  createAppointment(data: any): Promise<any>;
  sendNotification(data: any): Promise<any>;
  sendReminder(data: any): Promise<any>;
  updatePatient(data: any): Promise<any>;
  sendEmail(data: any): Promise<any>;
  sendSMS(data: any): Promise<any>;
  executeAction(action: string, parameters: any, context: any): Promise<any>;
}

// Validation schema
const actionSchema = z.object({
  action: z.enum([
    'get_patient_info',
    'create_appointment',
    'cancel_appointment',
    'reschedule_appointment',
    'get_appointments',
    'send_notification',
    'send_reminder',
    'update_patient',
    'get_medical_records',
    'schedule_reminder',
    'update_payment_status',
    'create_insurance_claim'
  ]),
  parameters: z.record(z.any()).default({}),
  context: z.record(z.any()).optional().default({}),
  userId: z.string().uuid('Invalid user ID'),
  conversationId: z.string().optional(),
});

// Enhanced ActionExecutor with more actions
export class EnhancedActionExecutor implements ActionExecutorInterface {
  async createAppointment(data: any): Promise<any> {
    return { success: true, data };
  }
  async sendNotification(data: any): Promise<any> {
    return { success: true, data };
  }
  async sendReminder(data: any): Promise<any> {
    return { success: true, data };
  }
  async updatePatient(data: any): Promise<any> {
    return { success: true, data };
  }
  async sendEmail(data: any): Promise<any> {
    return { success: true, data };
  }
  async sendSMS(data: any): Promise<any> {
    return { success: true, data };
  }
  async executeAction(action: string, parameters: any, context: any) {
    return { success: true, data: { action, parameters, context } };
  }
}

// Helper functions
async function getPatientInfo(parameters: any, context: any) {
  try {
    const { patientId } = parameters;
    
    const { data: patient, error } = await createClient()
      .from('patients')
      .select('*')
      .eq('id', patientId)
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: patient };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

async function createAppointment(parameters: any, context: any) {
  try {
    const { patientId, doctorId, scheduledAt, type, notes, duration, isVirtual, insuranceClaimId } = parameters;
    
    const { data: appointment, error } = await createClient()
      .from('appointments')
      .insert({
        patient_id: patientId,
        doctor_id: doctorId,
        scheduled_at: scheduledAt,
        type,
        notes,
        duration,
        is_virtual: isVirtual,
        insurance_claim_id: insuranceClaimId,
        status: 'scheduled'
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: appointment };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

async function cancelAppointment(parameters: any, context: any) {
  try {
    const { appointmentId, reason } = parameters;
    
    const { data: appointment, error } = await createClient()
      .from('appointments')
      .update({ 
        status: 'cancelled',
        cancellation_reason: reason,
        cancelled_at: new Date().toISOString()
      })
      .eq('id', appointmentId)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: appointment };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

async function rescheduleAppointment(parameters: any, context: any) {
  try {
    const { appointmentId, newScheduledAt, reason } = parameters;
    
    const { data: appointment, error } = await createClient()
      .from('appointments')
      .update({ 
        scheduled_at: newScheduledAt,
        reschedule_reason: reason,
        rescheduled_at: new Date().toISOString()
      })
      .eq('id', appointmentId)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: appointment };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

async function getAppointments(parameters: any, context: any) {
  try {
    const { patientId, doctorId, startDate, endDate, status } = parameters;
    
    let query = createClient()
      .from('appointments')
      .select('*');

    if (patientId) query = query.eq('patient_id', patientId);
    if (doctorId) query = query.eq('doctor_id', doctorId);
    if (status) query = query.eq('status', status);
    if (startDate) query = query.gte('scheduled_at', startDate);
    if (endDate) query = query.lte('scheduled_at', endDate);

    const { data: appointments, error } = await query;

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: appointments };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

async function sendNotification(parameters: any, context: any) {
  try {
    const { recipientId, type, message, channels } = parameters;
    
    // Implementation for sending notifications
    return { success: true, data: { recipientId, type, message, channels } };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

async function sendReminder(parameters: any, context: any) {
  try {
    const { appointmentId, reminderType, scheduledAt } = parameters;
    
    // Implementation for sending reminders
    return { success: true, data: { appointmentId, reminderType, scheduledAt } };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

async function updatePatient(parameters: any, context: any) {
  try {
    const { patientId, updates } = parameters;
    
    const { data: patient, error } = await createClient()
      .from('patients')
      .update(updates)
      .eq('id', patientId)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: patient };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

async function getMedicalRecords(parameters: any, context: any) {
  try {
    const { patientId, recordType, startDate, endDate } = parameters;
    
    let query = createClient()
      .from('medical_records')
      .select('*')
      .eq('patient_id', patientId);

    if (recordType) query = query.eq('record_type', recordType);
    if (startDate) query = query.gte('created_at', startDate);
    if (endDate) query = query.lte('created_at', endDate);

    const { data: records, error } = await query;

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: records };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

async function scheduleReminder(parameters: any, context: any) {
  try {
    const { appointmentId, reminderTime, message } = parameters;
    
    // Implementation for scheduling reminders
    return { success: true, data: { appointmentId, reminderTime, message } };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

async function updatePaymentStatus(parameters: any, context: any) {
  try {
    const { paymentId, status, notes } = parameters;
    
    // Implementation for updating payment status
    return { success: true, data: { paymentId, status, notes } };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

async function createInsuranceClaim(parameters: any, context: any) {
  try {
    const { appointmentId, provider, policyNumber, memberId, claimAmount, diagnosis, treatment, attachments, notes, priority } = parameters;
    
    const { data: claim, error } = await createClient()
      .from('insurance_claims')
      .insert({
        appointment_id: appointmentId,
        provider,
        policy_number: policyNumber,
        member_id: memberId,
        claim_amount: claimAmount,
        diagnosis,
        treatment,
        attachments,
        notes,
        priority,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: claim };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validation = actionSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.message }, { status: 400 });
    }

    const { action, parameters, context, userId, conversationId } = validation.data;

    // Initialize chatbot components
    const { IntentAnalyzer, ActionExecutor, FlowManager } = await import('@/lib/conversation-flows');
    const intentAnalyzer = new IntentAnalyzer();
    const actionExecutor = new ActionExecutor();
    const flowManager = new FlowManager();

    // Execute the action
    const result = await (actionExecutor as any).executeAction(
      { type: action as any, data: parameters },
      {
        userId,
        conversationId: conversationId || '',
        data: context || {},
        history: [],
      } as any
    );

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}