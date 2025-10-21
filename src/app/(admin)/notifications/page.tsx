'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import {
  Bell,
  BellRing,
  CheckCircle,
  AlertCircle,
  Info,
  Calendar,
  Users,
  MessageCircle,
  Phone,
  Mail,
  Clock,
  Filter,
  Search,
  MoreVertical,
  Eye,
  Trash2,
  Archive,
  Star,
  Settings,
  Send,
  Plus,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

interface Notification {
  id: string;
  title: string;
  message: string;
  type:
    | 'info'
    | 'success'
    | 'warning'
    | 'error'
    | 'appointment'
    | 'reminder'
    | 'system';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'unread' | 'read' | 'archived';
  category: string;
  recipient_id: string;
  recipient_name: string;
  sender_id: string;
  sender_name: string;
  created_at: string;
  read_at?: string;
  action_url?: string;
  action_text?: string;
  metadata?: {
    patient_id?: string;
    appointment_id?: string;
    therapy_session_id?: string;
  };
}

interface NotificationTemplate {
  id: string;
  name: string;
  title: string;
  message: string;
  type: string;
  category: string;
  variables: string[];
  is_active: boolean;
  created_at: string;
}

const NotificationsPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showCompose, setShowCompose] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    loadNotifications();
  }, [isAuthenticated, router]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      // في التطبيق الحقيقي، سيتم جلب البيانات من API
      const mockNotifications: Notification[] = [
        {
          id: '1',
          title: 'موعد جديد مجدول',
          message: 'تم جدولة موعد جديد للمريض أحمد محمد في 15 يناير 2024',
          type: 'appointment',
          priority: 'medium',
          status: 'unread',
          category: 'المواعيد',
          recipient_id: 'user-1',
          recipient_name: 'د. فاطمة العلي',
          sender_id: 'system',
          sender_name: 'النظام',
          created_at: '2024-01-15T10:00:00Z',
          action_url: '/appointments/123',
          action_text: 'عرض الموعد',
          metadata: {
            patient_id: 'pat-1',
            appointment_id: 'apt-123',
          },
        },
        {
          id: '2',
          title: 'تذكير بجلسة علاج',
          message:
            'تذكير: جلسة العلاج الطبيعي للمريض سارة أحمد في الساعة 2:00 مساءً',
          type: 'reminder',
          priority: 'high',
          status: 'read',
          category: 'التذكيرات',
          recipient_id: 'user-2',
          recipient_name: 'أ. محمد السعد',
          sender_id: 'system',
          sender_name: 'النظام',
          created_at: '2024-01-15T09:30:00Z',
          read_at: '2024-01-15T09:35:00Z',
          action_url: '/therapy/sessions/456',
          action_text: 'عرض الجلسة',
          metadata: {
            patient_id: 'pat-2',
            therapy_session_id: 'ts-456',
          },
        },
        {
          id: '3',
          title: 'تحديث حالة المريض',
          message: "تم تحديث حالة المريض نورا الزهراني إلى 'مكتمل العلاج'",
          type: 'success',
          priority: 'medium',
          status: 'unread',
          category: 'تحديثات الحالة',
          recipient_id: 'user-1',
          recipient_name: 'د. فاطمة العلي',
          sender_id: 'user-3',
          sender_name: 'أ. أحمد المحمد',
          created_at: '2024-01-15T08:45:00Z',
          action_url: '/patients/pat-3',
          action_text: 'عرض المريض',
          metadata: {
            patient_id: 'pat-3',
          },
        },
        {
          id: '4',
          title: 'تنبيه نظام',
          message: 'تم إجراء نسخة احتياطية من قاعدة البيانات بنجاح',
          type: 'system',
          priority: 'low',
          status: 'read',
          category: 'النظام',
          recipient_id: 'admin-1',
          recipient_name: 'مدير النظام',
          sender_id: 'system',
          sender_name: 'النظام',
          created_at: '2024-01-15T06:00:00Z',
          read_at: '2024-01-15T06:05:00Z',
        },
      ];

      const mockTemplates: NotificationTemplate[] = [
        {
          id: '1',
          name: 'تذكير الموعد',
          title: 'تذكير بموعدك',
          message:
            'عزيزي {patient_name}، نذكرك بموعدك في {appointment_date} في الساعة {appointment_time}',
          type: 'reminder',
          category: 'المواعيد',
          variables: ['patient_name', 'appointment_date', 'appointment_time'],
          is_active: true,
          created_at: '2024-01-01T00:00:00Z',
        },
        {
          id: '2',
          name: 'تأكيد الموعد',
          title: 'تأكيد حجز الموعد',
          message:
            'تم تأكيد حجز موعدك في {appointment_date} مع {therapist_name}',
          type: 'success',
          category: 'المواعيد',
          variables: ['appointment_date', 'therapist_name'],
          is_active: true,
          created_at: '2024-01-01T00:00:00Z',
        },
      ];

      setNotifications(mockNotifications);
      setTemplates(mockTemplates);
    } catch (error) {
      setError('فشل في تحميل الإشعارات');
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return <Calendar className='w-4 h-4 text-brand-primary' />;
      case 'reminder':
        return <Clock className='w-4 h-4 text-brand-primary' />;
      case 'success':
        return <CheckCircle className='w-4 h-4 text-brand-success' />;
      case 'warning':
        return <AlertCircle className='w-4 h-4 text-brand-warning' />;
      case 'error':
        return <AlertCircle className='w-4 h-4 text-brand-error' />;
      case 'system':
        return <Settings className='w-4 h-4 text-gray-500' />;
      default:
        return <Info className='w-4 h-4 text-brand-primary' />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const priorityMap = {
      low: { label: 'منخفض', variant: 'secondary' as const },
      medium: { label: 'متوسط', variant: 'primary' as const },
      high: { label: 'عالي', variant: 'primary' as const },
      urgent: { label: 'عاجل', variant: 'error' as const },
    };

    const priorityInfo = priorityMap[priority as keyof typeof priorityMap] || {
      label: priority,
      variant: 'primary' as const,
    };
    return <Badge variant={priorityInfo.variant}>{priorityInfo.label}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      unread: { label: 'غير مقروء', variant: 'primary' as const },
      read: { label: 'مقروء', variant: 'secondary' as const },
      archived: { label: 'مؤرشف', variant: 'outline' as const },
    };

    const statusInfo = statusMap[status as keyof typeof statusMap] || {
      label: status,
      variant: 'primary' as const,
    };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId
          ? {
              ...notif,
              status: 'read' as const,
              read_at: new Date().toISOString(),
            }
          : notif
      )
    );
  };

  const markAsArchived = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId
          ? { ...notif, status: 'archived' as const }
          : notif
      )
    );
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.recipient_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesType =
      filterType === 'all' || notification.type === filterType;
    const matchesStatus =
      filterStatus === 'all' || notification.status === filterStatus;
    const matchesPriority =
      filterPriority === 'all' || notification.priority === filterPriority;

    return matchesSearch && matchesType && matchesStatus && matchesPriority;
  });

  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className='container mx-auto px-4 py-8' dir='rtl'>
      {/* Header */}
      <div className='mb-8'>
        <div className='flex items-center justify-between mb-4'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>مركز الإشعارات</h1>
            <p className='text-gray-600 mt-2'>إدارة الإشعارات والتذكيرات</p>
          </div>
          <div className='flex gap-2'>
            <Button
              onClick={() => setShowTemplates(!showTemplates)}
              variant='outline'
              size='sm'
            >
              <Settings className='w-4 h-4 mr-2' />
              القوالب
            </Button>
            <Button
              onClick={() => setShowCompose(true)}
              className='bg-[var(--brand-primary)] hover:brightness-95'
            >
              <Plus className='w-4 h-4 mr-2' />
              إرسال إشعار
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-6'>
          <Card>
            <CardContent className='p-4'>
              <div className='flex items-center gap-2'>
                <Bell className='w-5 h-5 text-brand-primary' />
                <div>
                  <div className='text-2xl font-bold'>
                    {notifications.length}
                  </div>
                  <div className='text-sm text-gray-600'>إجمالي الإشعارات</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-4'>
              <div className='flex items-center gap-2'>
                <BellRing className='w-5 h-5 text-brand-primary' />
                <div>
                  <div className='text-2xl font-bold'>{unreadCount}</div>
                  <div className='text-sm text-gray-600'>غير مقروء</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-4'>
              <div className='flex items-center gap-2'>
                <Calendar className='w-5 h-5 text-brand-success' />
                <div>
                  <div className='text-2xl font-bold'>
                    {notifications.filter(n => n.type === 'appointment').length}
                  </div>
                  <div className='text-sm text-gray-600'>مواعيد</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-4'>
              <div className='flex items-center gap-2'>
                <Clock className='w-5 h-5 text-purple-500' />
                <div>
                  <div className='text-2xl font-bold'>
                    {notifications.filter(n => n.type === 'reminder').length}
                  </div>
                  <div className='text-sm text-gray-600'>تذكيرات</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className='flex flex-col md:flex-row gap-4 mb-6'>
          <div className='flex-1'>
            <Input
              placeholder='البحث في الإشعارات...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className='pr-10'
            />
          </div>
          <div className='flex gap-2'>
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className='px-3 py-2 border border-gray-300 rounded-md text-sm'
            >
              <option value='all'>جميع الأنواع</option>
              <option value='appointment'>المواعيد</option>
              <option value='reminder'>التذكيرات</option>
              <option value='success'>نجاح</option>
              <option value='warning'>تحذير</option>
              <option value='error'>خطأ</option>
              <option value='system'>النظام</option>
            </select>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className='px-3 py-2 border border-gray-300 rounded-md text-sm'
            >
              <option value='all'>جميع الحالات</option>
              <option value='unread'>غير مقروء</option>
              <option value='read'>مقروء</option>
              <option value='archived'>مؤرشف</option>
            </select>
            <select
              value={filterPriority}
              onChange={e => setFilterPriority(e.target.value)}
              className='px-3 py-2 border border-gray-300 rounded-md text-sm'
            >
              <option value='all'>جميع الأولويات</option>
              <option value='urgent'>عاجل</option>
              <option value='high'>عالي</option>
              <option value='medium'>متوسط</option>
              <option value='low'>منخفض</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--brand-primary)]'></div>
        </div>
      ) : (
        <div className='space-y-4'>
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className='p-12 text-center'>
                <Bell className='h-12 w-12 text-gray-400 mx-auto mb-4' />
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                  لا توجد إشعارات
                </h3>
                <p className='text-gray-600 mb-4'>
                  ستظهر الإشعارات هنا عند توفرها
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map(notification => (
              <Card
                key={notification.id}
                className={`cursor-pointer transition-colors ${
                  notification.status === 'unread'
                    ? 'border-l-4 border-l-blue-500 bg-surface'
                    : 'hover:bg-surface'
                }`}
                onClick={() => {
                  setSelectedNotification(notification);
                  if (notification.status === 'unread') {
                    markAsRead(notification.id);
                  }
                }}
              >
                <CardContent className='p-6'>
                  <div className='flex items-start justify-between'>
                    <div className='flex items-start gap-4'>
                      <div className='p-2 bg-white rounded-full'>
                        {getTypeIcon(notification.type)}
                      </div>
                      <div className='flex-1'>
                        <div className='flex items-center gap-2 mb-2'>
                          <h3 className='text-lg font-semibold'>
                            {notification.title}
                          </h3>
                          {notification.status === 'unread' && (
                            <div className='w-2 h-2 bg-surface0 rounded-full'></div>
                          )}
                        </div>
                        <p className='text-gray-700 mb-3'>
                          {notification.message}
                        </p>
                        <div className='flex items-center gap-4 text-sm text-gray-600'>
                          <span>من: {notification.sender_name}</span>
                          <span>إلى: {notification.recipient_name}</span>
                          <span>
                            {new Date(
                              notification.created_at
                            ).toLocaleDateString('ar-SA')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      {getPriorityBadge(notification.priority)}
                      {getStatusBadge(notification.status)}
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={e => {
                          e.stopPropagation();
                          markAsArchived(notification.id);
                        }}
                      >
                        <Archive className='w-4 h-4' />
                      </Button>
                    </div>
                  </div>

                  {notification.action_url && (
                    <div className='mt-4 pt-4 border-t'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={e => {
                          e.stopPropagation();
                          router.push(notification.action_url!);
                        }}
                      >
                        {notification.action_text || 'عرض التفاصيل'}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Templates Section */}
      {showTemplates && (
        <Card className='mt-8'>
          <CardHeader>
            <CardTitle>قوالب الإشعارات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {templates.map(template => (
                <div key={template.id} className='p-4 border rounded-lg'>
                  <div className='flex items-center justify-between mb-2'>
                    <h4 className='font-semibold'>{template.name}</h4>
                    <Badge
                      variant={template.is_active ? 'primary' : 'secondary'}
                    >
                      {template.is_active ? 'نشط' : 'غير نشط'}
                    </Badge>
                  </div>
                  <p className='text-sm text-gray-600 mb-2'>{template.title}</p>
                  <p className='text-sm text-gray-700 mb-3'>
                    {template.message}
                  </p>
                  <div className='flex items-center gap-2'>
                    <Badge variant='outline'>{template.type}</Badge>
                    <Badge variant='outline'>{template.category}</Badge>
                    <span className='text-xs text-gray-500'>
                      متغيرات: {template.variables.join(', ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NotificationsPage;
