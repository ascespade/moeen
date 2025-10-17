/**
 * Notification Scheduling API - جدولة الإشعارات
 * Schedule and manage notifications with templates and multi-channel support
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { ValidationHelper } from '@/core/validation';
import { ErrorHandler } from '@/core/errors';
import { requireAuth } from '@/lib/auth/authorize';

const scheduleSchema = z.object({
  type: z.enum([
    'appointment_confirmation',
    'appointment_reminder',
    'payment_confirmation',
    'insurance_claim_update',
    'lab_result_ready',
    'prescription_ready',
    'general_announcement'
  ]),
  recipientId: z.string().uuid('Invalid recipient ID'),
  recipientType: z.enum(['patient', 'doctor', 'staff']),
  channels: z.array(z.enum(['email', 'sms', 'push', 'in_app'])).min(1),
  scheduledAt: z.string().datetime().optional(),
  templateData: z.record(z.any()).optional().default({}),
  customMessage: z.string().optional(),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
  expiresAt: z.string().datetime().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Authorize user
    const authResult = await requireAuth(['staff', 'admin'])(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createClient();
    const body = await request.json();

    // Validate input
    const validation = await ValidationHelper.validateAsync(scheduleSchema, body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.message }, { status: 400 });
    }

    const {
      type,
      recipientId,
      recipientType,
      channels,
      scheduledAt,
      templateData,
      customMessage,
      priority,
      expiresAt
    } = validation.data;

    // Get recipient information
    const recipient = await getRecipientInfo(recipientId, recipientType);
    if (!recipient) {
      return NextResponse.json({ error: 'Recipient not found' }, { status: 404 });
    }

    // Generate notification content
    const content = await generateNotificationContent(type, templateData, customMessage, recipient);

    // Create notification record
    const { data: notification, error: notificationError } = await supabase
      .from('notifications')
      .insert({
        type,
        recipientId,
        recipientType,
        title: content.title,
        message: content.message,
        channels,
        scheduledAt: scheduledAt || new Date().toISOString(),
        priority,
        expiresAt,
        status: scheduledAt ? 'scheduled' : 'pending',
        templateData,
        createdBy: authResult.user!.id,
      })
      .select()
      .single();

    if (notificationError) {
      return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 });
    }

    // Process notification immediately if not scheduled
    if (!scheduledAt) {
      await processNotification(notification.id);
    }

    // Create audit log
    await supabase.from('audit_logs').insert({
      action: 'notification_scheduled',
      entityType: 'notification',
      entityId: notification.id,
      userId: authResult.user!.id,
      metadata: {
        type,
        recipientId,
        channels,
        priority,
      },
    });

    return NextResponse.json({
      success: true,
      data: notification,
      message: 'Notification scheduled successfully'
    });

  } catch (error) {
    return ErrorHandler.getInstance().handle(error);
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const recipientId = searchParams.get('recipientId');

    let query = supabase
      .from('notifications')
      .select(`
        *,
        createdBy:users(id, email, fullName)
      `)
      .order('createdAt', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }
    if (type) {
      query = query.eq('type', type);
    }
    if (recipientId) {
      query = query.eq('recipientId', recipientId);
    }

    const { data: notifications, error } = await query;

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: notifications,
      count: notifications?.length || 0
    });

  } catch (error) {
    return ErrorHandler.getInstance().handle(error);
  }
}

async function getRecipientInfo(recipientId: string, recipientType: 'patient' | 'doctor' | 'staff') {
  const supabase = await createClient();
  
  let table = '';
  switch (recipientType) {
    case 'patient':
      table = 'patients';
      break;
    case 'doctor':
      table = 'doctors';
      break;
    case 'staff':
      table = 'users';
      break;
    default:
      return null;
  }

  const { data, error } = await supabase
    .from(table)
    .select(`
      id,
      email,
      phone,
      fullName,
      ${recipientType === 'patient' ? 'userId' : 'id'}
    `)
    .eq('id', recipientId)
    .single();

  return error ? null : data;
}

async function generateNotificationContent(type: string, templateData: any, customMessage: string, recipient: any) {
  const templates = {
    appointment_confirmation: {
      title: 'تأكيد الموعد',
      message: customMessage || `تم تأكيد موعدك في ${templateData?.date} مع ${templateData?.doctorName}`,
    },
    appointment_reminder: {
      title: 'تذكير بالموعد',
      message: customMessage || `تذكير: لديك موعد غداً في ${templateData?.time} مع ${templateData?.doctorName}`,
    },
    payment_confirmation: {
      title: 'تأكيد الدفع',
      message: customMessage || `تم تأكيد دفعتك بقيمة ${templateData?.amount} ريال`,
    },
    insurance_claim_update: {
      title: 'تحديث مطالبة التأمين',
      message: customMessage || `تم تحديث حالة مطالبة التأمين إلى: ${templateData?.status}`,
    },
    lab_result_ready: {
      title: 'نتائج المختبر جاهزة',
      message: customMessage || `نتائج فحوصاتك المختبرية جاهزة للمراجعة`,
    },
    prescription_ready: {
      title: 'الوصفة الطبية جاهزة',
      message: customMessage || `وصفتك الطبية جاهزة للاستلام`,
    },
    general_announcement: {
      title: templateData?.title || 'إعلان عام',
      message: customMessage || templateData?.message || 'إعلان من المركز الطبي',
    },
  };

  return templates[type] || {
    title: 'إشعار',
    message: customMessage || 'لديك إشعار جديد',
  };
}

async function processNotification(notificationId: string) {
  // This will be implemented with the actual notification processing logic
  console.log(`Processing notification ${notificationId}`);
}