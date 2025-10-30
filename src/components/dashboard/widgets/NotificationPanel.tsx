'use client';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import {
    AlertTriangle,
    Archive,
    Bell,
    CheckCircle,
    Eye,
    Filter,
    Info,
    MoreHorizontal,
    RefreshCw,
    Search,
    Trash2,
    Volume2,
    VolumeX
} from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';

export interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  isArchived?: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category?: string;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, any>;
}

export interface NotificationPanelProps {
  notifications: Notification[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onArchive?: (id: string) => void;
  onDelete?: (id: string) => void;
  onActionClick?: (notification: Notification) => void;
  onRefresh?: () => void;
  isLoading?: boolean;
  maxHeight?: number;
  showFilters?: boolean;
  showSearch?: boolean;
  soundEnabled?: boolean;
  onSoundToggle?: () => void;
  className?: string;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onArchive,
  onDelete,
  onActionClick,
  onRefresh,
  isLoading = false,
  maxHeight = 400,
  showFilters = true,
  showSearch = true,
  soundEnabled = true,
  onSoundToggle,
  className,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'read' | 'archived'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | 'low' | 'medium' | 'high' | 'critical'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);

  const categories = useMemo(() => {
    const cats = new Set(notifications.map(n => n.category).filter(Boolean));
    return Array.from(cats);
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    return notifications.filter(notification => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = notification.title.toLowerCase().includes(query) ||
                            notification.message.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Type filter
      if (filterType === 'unread' && notification.isRead) return false;
      if (filterType === 'read' && !notification.isRead) return false;
      if (filterType === 'archived' && !notification.isArchived) return false;

      // Priority filter
      if (filterPriority !== 'all' && notification.priority !== filterPriority) return false;

      // Category filter
      if (filterCategory !== 'all' && notification.category !== filterCategory) return false;

      return true;
    });
  }, [notifications, searchQuery, filterType, filterPriority, filterCategory]);

  const unreadCount = useMemo(() =>
    notifications.filter(n => !n.isRead).length,
    [notifications]
  );

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return CheckCircle;
      case 'warning':
        return AlertTriangle;
      case 'error':
        return AlertTriangle;
      case 'info':
      default:
        return Info;
    }
  };

  const getNotificationColor = (type: Notification['type'], priority: Notification['priority']) => {
    const baseColors = {
      success: 'text-success-600 bg-success-50 border-success-200 dark:bg-success-900/20 dark:border-success-800',
      warning: 'text-warning-600 bg-warning-50 border-warning-200 dark:bg-warning-900/20 dark:border-warning-800',
      error: 'text-error-600 bg-error-50 border-error-200 dark:bg-error-900/20 dark:border-error-800',
      info: 'text-info-600 bg-info-50 border-info-200 dark:bg-info-900/20 dark:border-info-800',
    };

    let color = baseColors[type];

    // Add priority styling
    if (priority === 'critical') {
      color += ' ring-2 ring-error-300 dark:ring-error-700';
    } else if (priority === 'high') {
      color += ' ring-1 ring-warning-300 dark:ring-warning-700';
    }

    return color;
  };

  const getPriorityBadge = (priority: Notification['priority']) => {
    const variants = {
      low: 'secondary',
      medium: 'default',
      high: 'warning',
      critical: 'error',
    } as const;

    const labels = {
      low: 'منخفض',
      medium: 'متوسط',
      high: 'عالي',
      critical: 'حرج',
    };

    return (
      <Badge variant={variants[priority]} size="sm">
        {labels[priority]}
      </Badge>
    );
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'الآن';
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    if (hours < 24) return `منذ ${hours} ساعة`;
    if (days < 7) return `منذ ${days} يوم`;
    return timestamp.toLocaleDateString('ar-SA');
  };

  const handleMarkAsRead = useCallback((id: string) => {
    onMarkAsRead?.(id);
  }, [onMarkAsRead]);

  const handleActionClick = useCallback((notification: Notification) => {
    onActionClick?.(notification);
    if (!notification.isRead) {
      onMarkAsRead?.(notification.id);
    }
  }, [onActionClick, onMarkAsRead]);

  return (
    <Card variant="elevated" className={cn('w-full', className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 pb-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-error-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
              الإشعارات
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {unreadCount > 0 ? `${unreadCount} إشعار غير مقروء` : 'جميع الإشعارات مقروءة'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onSoundToggle && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onSoundToggle}
              icon={soundEnabled ? Volume2 : VolumeX}
              className="w-8 h-8 p-0"
              title={soundEnabled ? 'كتم الصوت' : 'تفعيل الصوت'}
            />
          )}

          {onRefresh && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              icon={RefreshCw}
              className="w-8 h-8 p-0"
              title="تحديث"
              disabled={isLoading}
            />
          )}

          {showFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFiltersPanel(!showFiltersPanel)}
              icon={Filter}
              className="w-8 h-8 p-0"
              title="الفلاتر"
            />
          )}

          {onMarkAllAsRead && unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onMarkAllAsRead}
            >
              تحديد الكل كمقروء
            </Button>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      {(showSearch || showFiltersPanel) && (
        <div className="px-6 pt-4">
          {showSearch && (
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="البحث في الإشعارات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              />
            </div>
          )}

          {showFiltersPanel && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  النوع
                </label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">الكل</option>
                  <option value="unread">غير مقروء</option>
                  <option value="read">مقروء</option>
                  <option value="archived">مؤرشف</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  الأولوية
                </label>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">الكل</option>
                  <option value="critical">حرج</option>
                  <option value="high">عالي</option>
                  <option value="medium">متوسط</option>
                  <option value="low">منخفض</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  الفئة
                </label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">الكل</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setFilterType('all');
                    setFilterPriority('all');
                    setFilterCategory('all');
                  }}
                  className="w-full"
                >
                  مسح الفلاتر
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Notifications List */}
      <div
        className="px-6 pb-6"
        style={{ maxHeight: `${maxHeight}px`, overflowY: 'auto' }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-50 mb-2">
              لا توجد إشعارات
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {searchQuery || filterType !== 'all' || filterPriority !== 'all' || filterCategory !== 'all'
                ? 'لا توجد إشعارات تطابق الفلاتر المحددة'
                : 'ستظهر الإشعارات الجديدة هنا'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => {
              const IconComponent = getNotificationIcon(notification.type);

              return (
                <div
                  key={notification.id}
                  className={cn(
                    'relative p-4 rounded-lg border transition-all duration-200 hover:shadow-md cursor-pointer',
                    getNotificationColor(notification.type, notification.priority),
                    !notification.isRead && 'bg-opacity-50 dark:bg-opacity-30'
                  )}
                  onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <IconComponent className="w-5 h-5 flex-shrink-0 mt-0.5" />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50 mb-1">
                            {notification.title}
                          </h4>
                          <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-2">
                            {notification.message}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          {getPriorityBadge(notification.priority)}
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={MoreHorizontal}
                            className="w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Show dropdown menu
                            }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-xs text-neutral-500 dark:text-neutral-400">
                            {formatTimestamp(notification.timestamp)}
                          </span>
                          {notification.category && (
                            <Badge variant="outline" size="sm">
                              {notification.category}
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          {notification.actionLabel && notification.actionUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleActionClick(notification);
                              }}
                              className="text-xs px-3 py-1"
                            >
                              {notification.actionLabel}
                            </Button>
                          )}

                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => handleMarkAsRead(notification.id)}
                              icon={Eye}
                              className="w-6 h-6 p-0"
                              title="تحديد كمقروء"
                            />
                          )}

                          {onArchive && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onArchive(notification.id)}
                              icon={Archive}
                              className="w-6 h-6 p-0"
                              title="أرشفة"
                            />
                          )}

                          {onDelete && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onDelete(notification.id)}
                              icon={Trash2}
                              className="w-6 h-6 p-0 text-error-500 hover:text-error-600"
                              title="حذف"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {!notification.isRead && (
                    <div className="absolute top-2 right-2 w-2 h-2 bg-current rounded-full"></div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
};

export default NotificationPanel;
