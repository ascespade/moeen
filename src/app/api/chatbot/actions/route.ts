/**
 * Chatbot Actions API - إجراءات الشات بوت
 * Enhanced chatbot with appointment booking, notification sending, and reminder actions
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { ErrorHandler } from '@/core/errors';
import { ValidationHelper } from '@/core/validation';
import { authorize, requireRole } from '@/lib/auth/authorize';
import { createClient } from '@/lib/supabase/server';
// import { FlowManager, IntentAnalyzer, ActionExecutor } from '@/lib/conversation-flows';

const actionSchema = z.object({
  action: z.enum([
    'create_appointment',
    'send_notification',
    'send_reminder',
    'update_patient',
    'send_email',
    'send_sms',
    'get_patient_info',
    'get_appointment_info',
    'cancel_appointment',
    'reschedule_appointment',
    'check_availability',
    'get_medical_records',
    'schedule_reminder',
    'update_payment_status',
    'create_insurance_claim',
  ]),
  parameters: z.record(z.string(), z.any()),
  context: z.record(z.string(), z.any()).optional(),
  userId: z.string().uuid('Invalid user ID'),
  conversationId: z.string().optional(),
});

export async function POST(_request: NextRequest) {
  try {
    // Authorize user
    const { user: authUser, error: authError } = await authorize(_request);
    if (
      authError ||
      !authUser ||
      !requireRole(['patient', 'doctor', 'staff', 'admin'])(authUser)
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();
    const body = await _request.json();

    // Validate input
    const validation = await ValidationHelper.validateAsync(actionSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.message },
        { status: 400 }
      );
    }

    const { action, parameters, context, userId, conversationId } =
      validation.data;

    // Initialize chatbot components - temporarily disabled
    // const intentAnalyzer = new IntentAnalyzer();
    // const actionExecutor = new ActionExecutor(supabase);
    // const flowManager = new FlowManager(intentAnalyzer, actionExecutor);

    // Execute the action - temporarily disabled
    const result = {
      success: true,
      data: { message: 'Chatbot actions temporarily disabled' },
    };
    // const result = await flowManager.executeAction(action, parameters, {
    //   userId: authUser.id,
    //   userRole: authUser.role,
    //   conversationId,
    //   ...context,
    // });

    // Log the action
    await supabase.from('chatbot_actions').insert({
      action,
      parameters,
      context,
      userId: authUser.id,
      conversationId,
      result: result.success ? 'success' : 'error',
      errorMessage: null,
      executedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: result.success,
      data: result.data,
    });
  } catch (error) {
    return ErrorHandler.getInstance().handle(error as Error);
  }
}

export async function GET(_request: NextRequest) {
  try {
    // Authorize user
    const { user: authUser, error: authError } = await authorize(_request);
    if (
      authError ||
      !authUser ||
      !requireRole(['patient', 'doctor', 'staff', 'admin'])(authUser)
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();
    const { searchParams } = new URL(_request.url);
    const conversationId = searchParams.get('conversationId');
    const action = searchParams.get('action');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    let query = supabase
      .from('chatbot_actions')
      .select(
        `
        *,
        user:users(id, email, fullName, role)
      `
      )
      .eq('userId', authUser.id)
      .order('executedAt', { ascending: false })
      .range(
        ((page || 1) - 1) * (limit || 20),
        (page || 1) * (limit || 20) - 1
      );

    if (conversationId) {
      query = query.eq('conversationId', conversationId);
    }
    if (action) {
      query = query.eq('action', action);
    }

    const { data: actions, error, count } = await query;

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch chatbot actions' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: actions,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / (limit || 20)),
      },
    });
  } catch (error) {
    return ErrorHandler.getInstance().handle(error as Error);
  }
}

// Enhanced ActionExecutor with more actions - temporarily disabled
/*
export class EnhancedActionExecutor extends ActionExecutor {
  async executeAction(_action: string, parameters: unknown, context: unknown) {
    switch (action) {
      case 'create_appointment':
        return await this.createAppointment(parameters, context);
      case 'send_notification':
        return await this.sendNotification(parameters, context);
      case 'send_reminder':
        return await this.sendReminder(parameters, context);
      case 'update_patient':
        return await this.updatePatient(parameters, context);
      case 'send_email':
        return await this.sendEmail(parameters, context);
      case 'send_sms':
        return await this.sendSMS(parameters, context);
      case 'get_patient_info':
        return await this.getPatientInfo(parameters, context);
      case 'get_appointment_info':
        return await this.getAppointmentInfo(parameters, context);
      case 'cancel_appointment':
        return await this.cancelAppointment(parameters, context);
      case 'reschedule_appointment':
        return await this.rescheduleAppointment(parameters, context);
      case 'check_availability':
        return await this.checkAvailability(parameters, context);
      case 'get_medical_records':
        return await this.getMedicalRecords(parameters, context);
      case 'schedule_reminder':
        return await this.scheduleReminder(parameters, context);
      case 'update_payment_status':
        return await this.updatePaymentStatus(parameters, context);
      case 'create_insurance_claim':
        return await this.createInsuranceClaim(parameters, context);
      default:
        return {
          success: false,
          error: 'Unknown action',
        };
    }
  }

  async getPatientInfo(_parameters: unknown, context: unknown) {
    try {
      const { patientId } = parameters;
      
      const { data: patient, error } = await this.supabase
        .from('patients')
        .select(`
          id,
          fullName,
          email,
          phone,
          dateOfBirth,
          isActivated,
          insuranceProvider,
          insuranceNumber,
          createdAt
        `)
        .eq('id', patientId)
        .single();

      if (error || !patient) {
        return {
          success: false,
          error: 'Patient not found',
        };
      }

      return {
        success: true,
        data: patient,
        message: 'Patient information retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to get patient information',
      };
    }
  }

  async getAppointmentInfo(_parameters: unknown, context: unknown) {
    try {
      const { appointmentId } = parameters;
      
      const { data: appointment, error } = await this.supabase
        .from('appointments')
        .select(`
          id,
          scheduledAt,
          status,
          type,
          notes,
          patients(id, fullName, email),
          doctors(id, fullName, speciality)
        `)
        .eq('id', appointmentId)
        .single();

      if (error || !appointment) {
        return {
          success: false,
          error: 'Appointment not found',
        };
      }

      return {
        success: true,
        data: appointment,
        message: 'Appointment information retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to get appointment information',
      };
    }
  }

  async cancelAppointment(_parameters: unknown, context: unknown) {
    try {
      const { appointmentId, reason } = parameters;
      
      const { error } = await this.supabase
        .from('appointments')
        .update({
          status: 'cancelled',
          cancellationReason: reason,
          cancelledAt: new Date().toISOString(),
        })
        .eq('id', appointmentId);

      if (error) {
        return {
          success: false,
          error: 'Failed to cancel appointment',
        };
      }

      return {
        success: true,
        message: 'Appointment cancelled successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to cancel appointment',
      };
    }
  }

  async rescheduleAppointment(_parameters: unknown, context: unknown) {
    try {
      const { appointmentId, newDate, reason } = parameters;
      
      const { error } = await this.supabase
        .from('appointments')
        .update({
          scheduledAt: newDate,
          rescheduleReason: reason,
          rescheduledAt: new Date().toISOString(),
        })
        .eq('id', appointmentId);

      if (error) {
        return {
          success: false,
          error: 'Failed to reschedule appointment',
        };
      }

      return {
        success: true,
        message: 'Appointment rescheduled successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to reschedule appointment',
      };
    }
  }

  async checkAvailability(_parameters: unknown, context: unknown) {
    try {
      const { doctorId, date, duration = 30 } = parameters;
      
      // This would integrate with the availability API
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/appointments/availability?doctorId=${doctorId}&date=${date}&duration=${duration}`);
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to check availability',
        };
      }

      return {
        success: true,
        data: data.data,
        message: 'Availability checked successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to check availability',
      };
    }
  }

  async getMedicalRecords(_parameters: unknown, context: unknown) {
    try {
      const { patientId, recordType } = parameters;
      
      let query = this.supabase
        .from('medical_records')
        .select('*')
        .eq('patientId', patientId)
        .order('createdAt', { ascending: false });

      if (recordType) {
        query = query.eq('recordType', recordType);
      }

      const { data: records, error } = await query;

      if (error) {
        return {
          success: false,
          error: 'Failed to get medical records',
        };
      }

      return {
        success: true,
        data: records,
        message: 'Medical records retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to get medical records',
      };
    }
  }

  async scheduleReminder(_parameters: unknown, context: unknown) {
    try {
      const { appointmentId, reminderTime, message } = parameters;
      
      const { data: reminder, error } = await this.supabase
        .from('scheduled_reminders')
        .insert({
          appointmentId,
          reminderTime,
          message,
          status: 'scheduled',
          createdBy: context.userId,
        })
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: 'Failed to schedule reminder',
        };
      }

      return {
        success: true,
        data: reminder,
        message: 'Reminder scheduled successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to schedule reminder',
      };
    }
  }

  async updatePaymentStatus(_parameters: unknown, context: unknown) {
    try {
      const { paymentId, status, notes } = parameters;
      
      const { error } = await this.supabase
        .from('payments')
        .update({
          status,
          notes,
          updatedAt: new Date().toISOString(),
        })
        .eq('id', paymentId);

      if (error) {
        return {
          success: false,
          error: 'Failed to update payment status',
        };
      }

      return {
        success: true,
        message: 'Payment status updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to update payment status',
      };
    }
  }

  async createInsuranceClaim(_parameters: unknown, context: unknown) {
    try {
      const { appointmentId, provider, policyNumber, memberId, claimAmount, diagnosis, treatment } = parameters;
      
      const { data: claim, error } = await this.supabase
        .from('insurance_claims')
        .insert({
          appointmentId,
          provider,
          policyNumber,
          memberId,
          claimAmount,
          diagnosis,
          treatment,
          status: 'draft',
          createdBy: context.userId,
        })
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: 'Failed to create insurance claim',
        };
      }

      return {
        success: true,
        data: claim,
        message: 'Insurance claim created successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to create insurance claim',
      };
    }
  }
}
*/
