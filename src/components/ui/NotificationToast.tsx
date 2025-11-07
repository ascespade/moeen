'use client';

import React, { useEffect, useState } from 'react';
import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';
import { notificationManager, Notification } from '@/lib/notifications';

export function NotificationToast() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const unsubscribe = notificationManager.subscribe(setNotifications);
    return unsubscribe;
  }, []);

  if (notifications.length === 0) return null;

  return (
    <div
      className='fixed top-4 right-4 z-50 space-y-2'
      role='region'
      aria-label='الإشعارات'
      aria-live='polite'
    >
      {notifications.map(notification => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClose={() => notificationManager.remove(notification.id)}
        />
      ))}
    </div>
  );
}

function NotificationItem({
  notification,
  onClose,
}: {
  notification: Notification;
  onClose: () => void;
}) {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const colors = {
    success:
      'bg-green-50 border-green-200 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-200',
    error:
      'bg-red-50 border-red-200 text-red-800 dark:bg-red-900 dark:border-red-700 dark:text-red-200',
    warning:
      'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:border-yellow-700 dark:text-yellow-200',
    info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-200',
  };

  const Icon = icons[notification.type];

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border shadow-lg min-w-[300px] max-w-[400px] ${colors[notification.type]}`}
      role='alert'
      aria-live='assertive'
    >
      <Icon className='w-5 h-5 mt-0.5 flex-shrink-0' aria-hidden='true' />
      <div className='flex-1'>
        {notification.title && (
          <h4 className='font-semibold mb-1'>{notification.title}</h4>
        )}
        <p className='text-sm'>{notification.message}</p>
      </div>
      <button
        onClick={onClose}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClose();
          }
        }}
        className='flex-shrink-0 p-1 rounded hover:bg-black/10 dark:hover:bg-white/10'
        aria-label='إغلاق الإشعار'
      >
        <X className='w-4 h-4' aria-hidden='true' />
      </button>
    </div>
  );
}
