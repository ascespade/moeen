/**
 * Notification Scheduling API - جدولة الإشعارات
 * Schedule and manage notifications with templates and multi-channel support
 */

import { _NextRequest, NextResponse } from 'next/server';
import { _z } from 'zod';

import { _ErrorHandler } from '@/core/errors';
import { _ValidationHelper } from '@/core/validation';
import { _authorize, requireRole } from '@/lib/auth/authorize';
import { _createClient } from '@/lib/supabase/server';

const __scheduleSchema = z.object({
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
  templateData: z.record(z.any()).optional(),
  customMessage: z.string().optional(),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
  expiresAt: z.string().datetime().optional(),
});

export async function __POST(_request: NextRequest) {
  try {
    // Authorize user
    const { user: authUser, error: authError } = await authorize(request);
    if (authError || !authUser || !requireRole(['staff', 'admin'])(authUser)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const __supabase = createClient();
    const __body = await request.json();

    // Validate input
    const __validation = await ValidationHelper.validateAsync(
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
    const __recipient = await getRecipientInfo(recipientId, recipientType);
    if (!recipient) {
      return NextResponse.json(
        { error: 'Recipient not found' },
        { status: 404 }
      );
    }

    // Generate notification content
    const __content = await generateNotificationContent(
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
      await processNotification(notification.id);
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

export async function __GET(_request: NextRequest) {
  try {
    const __supabase = createClient();
    const { searchParams } = new URL(request.url);
    const __status = searchParams.get('status');
    const __type = searchParams.get('type');
    const __recipientId = searchParams.get('recipientId');

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
  const __supabase = createClient();

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
    .eq('id', recipientId)
    .single();

  return error ? null : data;
}

async function __generateNotificationContent(
  type: string,
  templateData: unknown,
  customMessage: string,
  recipient: unknown
) {
  const __templates = {
    appointment_confirmation: {
      title: 'تأكيد الموعد',
      message:
        customMessage ||
        `تم تأكيد موعدك في ${templateData?.date} مع ${templateData?.doctorName}`,
    },
    appointment_reminder: {
      title: 'تذكير بالموعد',
      message:
        customMessage ||
        `تذكير: لديك موعد غداً في ${templateData?.time} مع ${templateData?.doctorName}`,
    },
    payment_confirmation: {
      title: 'تأكيد الدفع',
      message:
        customMessage || `تم تأكيد دفعتك بقيمة ${templateData?.amount} ريال`,
    },
    insurance_claim_update: {
      title: 'تحديث مطالبة التأمين',
      message:
        customMessage ||
        `تم تحديث حالة مطالبة التأمين إلى: ${templateData?.status}`,
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
      message:
        customMessage || templateData?.message || 'إعلان من المركز الطبي',
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
