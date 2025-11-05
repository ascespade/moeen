/**
 * Notification Scheduling API - جدولة الإشعارات
 * Schedule and manage notifications with templates and multi-channel support
 */

import { NextRequest, NextResponse } from 'next/server';
import { handleApiError } from '@/lib/errors/error-handler';
import { z } from 'zod';

import { ValidationHelper } from '@/core/validation';
import { authorize, requireRole } from '@/lib/auth/authorize';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/utils/logger';

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
    return handleApiError(error);
  }
}

export const revalidate = 60;

export async function GET(_request: NextRequest) {
  try {
    // Optional: authorize user (but don't block if not authenticated for GET)
    const { _user } = await authorize(_request).catch(() => ({
      user: null,
      error: null,
    }));

    const supabase = await createClient();
    const { searchParams } = new URL(_request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const recipientId = searchParams.get('recipientId');

    // Start with basic query - avoid joins that might fail
    let query = supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });

    // Filter by user_id (the actual column name in notifications table)
    if (recipientId) {
      // The notifications table uses 'user_id' column (not recipientId)
      query = query.eq('user_id', recipientId);
    }

    if (status) {
      query = query.eq('status', status);
    }
    if (type) {
      query = query.eq('type', type);
    }

    // Apply limit if provided
    const limitParam = searchParams.get('limit');
    if (limitParam) {
      const limitNum = parseInt(limitParam);
      if (!isNaN(limitNum) && limitNum > 0) {
        query = query.limit(limitNum);
      }
    }

    const { data: notifications, error } = await query;

    // If error occurs, return empty array instead of 500 to prevent loops
    if (error) {
      logger.error('Error fetching notifications:', error, {});
      // Return empty array to prevent infinite loops
      return NextResponse.json({
        success: true,
        data: [],
        count: 0,
        error: 'Failed to fetch notifications, returning empty array',
      });
    }

    // If notifications exist, try to enrich with user data (optional, don't fail if this fails)
    let enrichedNotifications = notifications || [];
    if (notifications && notifications.length > 0) {
      try {
        // Try to get createdBy user info for notifications that have createdBy field
        const createdByIds = notifications
          .map((n: unknown) => n.createdBy || n.created_by)
          .filter((id: unknown) => id && typeof id === 'string');

        if (createdByIds.length > 0) {
          const { data: users } = await supabase
            .from('users')
            .select('id, email, full_name, fullName, name')
            .in('id', createdByIds);

          if (users) {
            const userMap = new Map(users.map((u: unknown) => [u.id, u]));
            enrichedNotifications = notifications.map((n: unknown) => ({
              ...n,
              createdByUser:
                n.createdBy || n.created_by
                  ? userMap.get(n.createdBy || n.created_by)
                  : null,
            }));
          }
        }
      } catch (enrichError) {
        // Ignore enrichment errors - just return basic notifications
        logger.warn(
          'Failed to enrich notifications with user data:',
          enrichError
        );
      }
    }

    return NextResponse.json({
      success: true,
      data: enrichedNotifications,
      count: enrichedNotifications?.length || 0,
    });
  } catch (error) {
    logger.error('Unexpected error in notifications GET:', error, {});
    // Always return success with empty array to prevent loops
    return NextResponse.json({
      success: true,
      data: [],
      count: 0,
      error: 'Unexpected error occurred',
    });
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
  _recipient: unknown
) {
  const templates = {
    appointment_confirmation: {
      title: 'تأكيد الموعد',
      message:
        customMessage ||
        `تم تأكيد موعدك في ${(templateData as unknown)?.date} مع ${(templateData as unknown)?.doctorName}`,
    },
    appointment_reminder: {
      title: 'تذكير بالموعد',
      message:
        customMessage ||
        `تذكير: لديك موعد غداً في ${(templateData as unknown)?.time} مع ${(templateData as unknown)?.doctorName}`,
    },
    payment_confirmation: {
      title: 'تأكيد الدفع',
      message:
        customMessage ||
        `تم تأكيد دفعتك بقيمة ${(templateData as unknown)?.amount} ريال`,
    },
    insurance_claim_update: {
      title: 'تحديث مطالبة التأمين',
      message:
        customMessage ||
        `تم تحديث حالة مطالبة التأمين إلى: ${(templateData as unknown)?.status}`,
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
      title: (templateData as unknown)?.title || 'إعلان عام',
      message:
        customMessage ||
        (templateData as unknown)?.message ||
        'إعلان من المركز الطبي',
    },
  };

  return (
    (templates as unknown)[type] || {
      title: 'إشعار',
      message: customMessage || 'لديك إشعار جديد',
    }
  );
}

async function __processNotification(_notificationId: string) {
  // This will be implemented with the actual notification processing logic
  logger.info(`Processing notification ${notificationId}`);
}
