/**
 * Notification System
 * نظام الإشعارات
 */

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  title?: string;
  duration?: number;
}

class NotificationManager {
  private notifications: Notification[] = [];
  private listeners: ((notifications: Notification[]) => void)[] = [];

  subscribe(listener: (notifications: Notification[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(listener => listener([...this.notifications]));
  }

  show(notification: Omit<Notification, 'id'>) {
    const id = `notif-${Date.now()}-${Math.random()}`;
    const newNotification: Notification = {
      id,
      duration: 5000,
      ...notification,
    };
    this.notifications.push(newNotification);
    this.notify();

    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, newNotification.duration);
    }

    return id;
  }

  remove(id: string) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notify();
  }

  clear() {
    this.notifications = [];
    this.notify();
  }

  success(message: string, title?: string) {
    return this.show({ type: 'success', message, title });
  }

  error(message: string, title?: string) {
    return this.show({ type: 'error', message, title });
  }

  warning(message: string, title?: string) {
    return this.show({ type: 'warning', message, title });
  }

  info(message: string, title?: string) {
    return this.show({ type: 'info', message, title });
  }

  getNotifications() {
    return [...this.notifications];
  }
}

export const notificationManager = new NotificationManager();
