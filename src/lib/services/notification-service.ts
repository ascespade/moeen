/**
 * Notification Service - Business Logic for Notifications
 * خدمة الإشعارات - منطق الأعمال للإشعارات
 *
 * Business logic layer for notification operations
 */

import { createAdminClient } from '../supabase/admin';
import { AppError } from '../errors';

export type NotificationType = 'info' | 'warning' | 'error' | 'success';

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  data?: unknown;
  created_at: string;
}

/**
 * Notification Service Class
 */
export class NotificationService {
  /**
   * Create notification
   */
  static async createNotification(data: {
    user_id: string;
    type: NotificationType;
    title: string;
    message: string;
    data?: unknown;
  }): Promise<Notification> {
    const adminClient = createAdminClient();
    const { data: notification, error } = await adminClient
      .from('notifications')
      .insert({
        user_id: data.user_id,
        type: data.type,
        title: data.title,
        message: data.message,
        read: false,
        data: data.data || null,
      })
      .select()
      .single();

    if (error) {
      throw AppError.internal(
        `Failed to create notification: ${error.message}`
      );
    }

    if (!notification) {
      throw AppError.internal(
        'Failed to create notification: No data returned'
      );
    }

    return notification as Notification;
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(
    notificationId: string,
    userId: string
  ): Promise<void> {
    const adminClient = createAdminClient();
    const { error } = await adminClient
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)
      .eq('user_id', userId);

    if (error) {
      throw AppError.internal(
        `Failed to mark notification as read: ${error.message}`
      );
    }
  }

  /**
   * Mark all notifications as read
   */
  static async markAllAsRead(userId: string): Promise<void> {
    const adminClient = createAdminClient();
    const { error } = await adminClient
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false);

    if (error) {
      throw AppError.internal(
        `Failed to mark all notifications as read: ${error.message}`
      );
    }
  }

  /**
   * Get user notifications
   */
  static async getUserNotifications(
    userId: string,
    limit?: number
  ): Promise<Notification[]> {
    const adminClient = createAdminClient();
    let query = adminClient
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      throw AppError.internal(
        `Failed to fetch notifications: ${error.message}`
      );
    }

    return (data || []) as Notification[];
  }

  /**
   * Get unread notifications count
   */
  static async getUnreadCount(userId: string): Promise<number> {
    const adminClient = createAdminClient();
    const { count, error } = await adminClient
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('read', false);

    if (error) {
      throw AppError.internal(`Failed to get unread count: ${error.message}`);
    }

    return count || 0;
  }
}
