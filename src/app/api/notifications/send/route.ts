/**
 * Notifications API Route
 * مسار API الإشعارات
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { logger } from '@/lib/utils/logger';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const notificationSchema = z.object({
  userId: z.string().uuid(),
  templateId: z.string().uuid().optional(),
  type: z.enum(['email', 'sms', 'push', 'in_app', 'whatsapp']),
  title: z.string(),
  body: z.string(),
  data: z.record(z.string(), z.any()).optional(),
  scheduledFor: z.string().datetime().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const { userId, templateId, type, title, body, data, scheduledFor } =
      notificationSchema.parse(requestBody);

    // Check user preferences
    const { data: preferences } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    // Check if notification type is enabled
    const typeKey = `${type}_enabled` as keyof typeof preferences;
    if (preferences && preferences[typeKey] === false) {
      return NextResponse.json(
        { error: 'Notification type disabled by user' },
        { status: 403 }
      );
    }

    // Add to queue
    const { data: notification, error } = await supabase
      .from('notifications_queue')
      .insert({
        user_id: userId,
        template_id: templateId || null,
        type,
        title,
        body,
        data: data || {},
        status: scheduledFor ? 'pending' : 'pending',
        scheduled_for: scheduledFor || new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      logger.error('Error creating notification', {
        error: error instanceof Error ? error.message : String(error),
      });
      return NextResponse.json(
        { error: 'Failed to create notification' },
        { status: 500 }
      );
    }

    // If not scheduled, send immediately
    if (!scheduledFor) {
      // Trigger notification sending (async)
      // This would be handled by a background worker
      // For now, we'll just mark it as sent
      await supabase
        .from('notifications_queue')
        .update({
          status: 'sent',
          sent_at: new Date().toISOString(),
        })
        .eq('id', notification.id);

      // Add to history
      await supabase.from('notifications_history').insert({
        notification_id: notification.id,
        user_id: userId,
        type,
        title,
        body,
        status: 'sent',
        sent_at: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      notificationId: notification.id,
    });
  } catch (error) {
    logger.error('Notification API error', {
      error: error instanceof Error ? error.message : String(error),
    });

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
