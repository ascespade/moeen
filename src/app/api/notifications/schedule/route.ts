/**
 * Notification Scheduling API - جدولة الإشعارات
 * Schedule and manage notifications with templates and multi-channel support
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { ErrorHandler } from '@/core/errors';
import { ValidationHelper } from '@/core/validation';
import { authorize, requireRole } from '@/lib/auth/authorize';
import { createClient } from '@/lib/supabase/server';

const scheduleSchema = z.object({
  type: z.enum([
    'appointment_confirmation',
    'appointment_reminder',
    'payment_confirmation',
    'insurance_claim_update',
    'lab_result_ready',
    'prescription_ready',
    'general_announcement',
  ]),
  recipientId: z.string().uuid('Invalid recipient ID'),
  recipientType: z.enum(['patient', 'doctor', 'staff']),
  channels: z.array(z.enum(['email', 'sms', 'push', 'in_app'])).min(1),
  scheduledAt: z.string().datetime().optional(),
  templateData: z.record(z.string(), z.any()).optional(),
  customMessage: z.string().optional(),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
  expiresAt: z.string().datetime().optional(),
});

export async function POST(_request: NextRequest) {
  try {
    // Authorize user
    const { user: authUser, error: authError } = await authorize(_request);
    if (authError || !authUser || !requireRole(['staff', 'admin'])(authUser)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();
    const body = await _request.json();

    // Validate input
    const validation = await ValidationHelper.validateAsync(
      scheduleSchema,
      body
    );
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.message },
        { status: 400 }
      );
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
      expiresAt,
    } = validation.data;

    // Get recipient information
    const recipient = await __getRecipientInfo(recipientId, recipientType);
    if (!recipient) {
      return NextResponse.json(
        { error: 'Recipient not found' },
        { status: 404 }
      );
    }

    // Generate notification content
    const content = await __generateNotificationContent(
      type,
      templateData,
      customMessage || '',
      recipient || ''
    );

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
        createdBy: authUser.id,
      })
      .select()
      .single();

    if (notificationError) {
      return NextResponse.json(
        { error: 'Failed to create notification' },
        { status: 500 }
      );
    }

    // Process notification immediately if not scheduled
    if (!scheduledAt) {
      await __processNotification(notification.id);
    }

    // Create audit log
    await supabase.from('audit_logs').insert({
      action: 'notification_scheduled',
      entityType: 'notification',
      entityId: notification.id,
      userId: authUser.id,
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
      message: 'Notification scheduled successfully',
    });
  } catch (error) {
    return ErrorHandler.getInstance().handle(error as Error);
  }
}

export async function GET(_request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(_request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const recipientId = searchParams.get('recipientId');

    let query = supabase
      .from('notifications')
      .select(
        `
        *,
        createdBy:users(id, email, fullName)
      `
      )
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
      return NextResponse.json(
        { error: 'Failed to fetch notifications' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: notifications,
      count: notifications?.length || 0,
    });
  } catch (error) {
    return ErrorHandler.getInstance().handle(error as Error);
  }
}

async function __getRecipientInfo(_recipientId: string, recipientType: string) {
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
    .select(
      `
      id,
      email,
      phone,
      fullName,
      ${recipientType === 'patient' ? 'userId' : 'id'}
    `
    )
    .eq('id', _recipientId)
    .single();

  return error ? null : data;
}

async function __generateNotificationContent(
  type: string,
  templateData: unknown,
  customMessage: string,
  recipient: unknown
) {
  const templates = {
    appointment_confirmation: {
      title: 'تأكيد الموعد',
      message:
        customMessage ||
        `تم تأكيد موعدك في ${(templateData as any)?.date} مع ${(templateData as any)?.doctorName}`,
    },
    appointment_reminder: {
      title: 'تذكير بالموعد',
      message:
        customMessage ||
        `تذكير: لديك موعد غداً في ${(templateData as any)?.time} مع ${(templateData as any)?.doctorName}`,
    },
    payment_confirmation: {
      title: 'تأكيد الدفع',
      message:
        customMessage || `تم تأكيد دفعتك بقيمة ${(templateData as any)?.amount} ريال`,
    },
    insurance_claim_update: {
      title: 'تحديث مطالبة التأمين',
      message:
        customMessage ||
        `تم تحديث حالة مطالبة التأمين إلى: ${(templateData as any)?.status}`,
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
      title: (templateData as any)?.title || 'إعلان عام',
      message:
        customMessage || (templateData as any)?.message || 'إعلان من المركز الطبي',
    },
  };

  return (
    (templates as any)[type] || {
      title: 'إشعار',
      message: customMessage || 'لديك إشعار جديد',
    }
  );
}

async function __processNotification(_notificationId: string) {
  // This will be implemented with the actual notification processing logic
  // // console.log(`Processing notification ${notificationId}`);
}
