'use client';

import React, { useState, useEffect } from 'react';
import { useT } from '@/components/providers/I18nProvider';
import { usePermissions } from '@/hooks/usePermissions';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/Dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import {
  Bell,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Send,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  Upload,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Mail,
  Phone,
  Calendar,
  Clock,
  User,
  Users,
  Settings,
  Shield,
  Activity,
  TrendingUp,
  BarChart3,
  PieChart,
  Target,
  Zap,
  Globe,
  Database,
  FileText,
  Image,
  Paperclip,
  Smile,
  Frown,
  Meh,
  Heart,
  Star,
  Flag,
  Archive,
  Copy,
  Share,
  ExternalLink
} from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'urgent';
  category: 'appointment' | 'payment' | 'system' | 'security' | 'marketing' | 'general';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'draft' | 'scheduled' | 'sent' | 'delivered' | 'failed' | 'cancelled';
  targetAudience: 'all' | 'patients' | 'doctors' | 'staff' | 'specific';
  targetUsers?: string[];
  channels: ('email' | 'sms' | 'push' | 'in_app')[];
  scheduledAt?: string;
  sentAt?: string;
  deliveredAt?: string;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  createdByName: string;
  readCount: number;
  totalSent: number;
  deliveryRate: number;
  clickRate: number;
  isActive: boolean;
  isRecurring: boolean;
  recurringPattern?: string;
  attachments?: {
    name: string;
    url: string;
    type: string;
    size: number;
  }[];
  metadata?: {
    templateId?: string;
    campaignId?: string;
    tags?: string[];
    customFields?: Record<string, any>;
  };
}

export default function NotificationsPage() {
  const { t } = useT();
  const { hasPermission } = usePermissions({ userRole: 'admin' });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isNotificationDialogOpen, setIsNotificationDialogOpen] = useState(false);

  // Mock data
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: 'تذكير بموعد طبي',
        message: 'لديك موعد مع د. فاطمة أحمد غداً في الساعة 10:00 صباحاً',
        type: 'info',
        category: 'appointment',
        priority: 'high',
        status: 'sent',
        targetAudience: 'patients',
        channels: ['email', 'sms', 'push'],
        scheduledAt: '2024-01-15T08:00:00Z',
        sentAt: '2024-01-15T08:00:00Z',
        deliveredAt: '2024-01-15T08:05:00Z',
        readAt: '2024-01-15T08:10:00Z',
        createdAt: '2024-01-15T07:30:00Z',
        updatedAt: '2024-01-15T08:10:00Z',
        createdBy: 'system',
        createdByName: 'النظام التلقائي',
        readCount: 1,
        totalSent: 1,
        deliveryRate: 100,
        clickRate: 100,
        isActive: true,
        isRecurring: false,
        metadata: {
          templateId: 'appointment_reminder',
          tags: ['موعد', 'تذكير']
        }
      },
      {
        id: '2',
        title: 'تحديث النظام',
        message: 'سيتم تحديث النظام يوم الجمعة من الساعة 2:00 إلى 4:00 صباحاً',
        type: 'warning',
        category: 'system',
        priority: 'medium',
        status: 'scheduled',
        targetAudience: 'all',
        channels: ['email', 'in_app'],
        scheduledAt: '2024-01-19T02:00:00Z',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        createdBy: 'admin1',
        createdByName: 'أحمد التقني',
        readCount: 0,
        totalSent: 0,
        deliveryRate: 0,
        clickRate: 0,
        isActive: true,
        isRecurring: false,
        metadata: {
          templateId: 'system_update',
          tags: ['نظام', 'تحديث']
        }
      },
      {
        id: '3',
        title: 'استلام دفعة',
        message: 'تم استلام دفعة بقيمة 500 ريال من المريض أحمد محمد',
        type: 'success',
        category: 'payment',
        priority: 'low',
        status: 'delivered',
        targetAudience: 'staff',
        channels: ['email', 'in_app'],
        sentAt: '2024-01-15T11:30:00Z',
        deliveredAt: '2024-01-15T11:30:00Z',
        readAt: '2024-01-15T11:35:00Z',
        createdAt: '2024-01-15T11:30:00Z',
        updatedAt: '2024-01-15T11:35:00Z',
        createdBy: 'system',
        createdByName: 'النظام التلقائي',
        readCount: 1,
        totalSent: 1,
        deliveryRate: 100,
        clickRate: 0,
        isActive: true,
        isRecurring: false,
        metadata: {
          templateId: 'payment_received',
          tags: ['دفعة', 'مالية']
        }
      },
      {
        id: '4',
        title: 'تنبيه أمني',
        message: 'تم اكتشاف محاولة تسجيل دخول غير مصرح بها',
        type: 'error',
        category: 'security',
        priority: 'urgent',
        status: 'sent',
        targetAudience: 'staff',
        channels: ['email', 'sms', 'push'],
        sentAt: '2024-01-15T12:00:00Z',
        deliveredAt: '2024-01-15T12:00:00Z',
        readAt: '2024-01-15T12:05:00Z',
        createdAt: '2024-01-15T12:00:00Z',
        updatedAt: '2024-01-15T12:05:00Z',
        createdBy: 'system',
        createdByName: 'النظام التلقائي',
        readCount: 1,
        totalSent: 1,
        deliveryRate: 100,
        clickRate: 0,
        isActive: true,
        isRecurring: false,
        metadata: {
          templateId: 'security_alert',
          tags: ['أمن', 'تنبيه']
        }
      },
      {
        id: '5',
        title: 'عرض خاص',
        message: 'احصل على خصم 20% على جميع الخدمات الطبية هذا الأسبوع',
        type: 'info',
        category: 'marketing',
        priority: 'medium',
        status: 'draft',
        targetAudience: 'patients',
        channels: ['email', 'push'],
        createdAt: '2024-01-15T13:00:00Z',
        updatedAt: '2024-01-15T13:00:00Z',
        createdBy: 'marketing1',
        createdByName: 'سارة التسويق',
        readCount: 0,
        totalSent: 0,
        deliveryRate: 0,
        clickRate: 0,
        isActive: true,
        isRecurring: false,
        metadata: {
          templateId: 'marketing_offer',
          tags: ['تسويق', 'عرض']
        }
      }
    ];

    setNotifications(mockNotifications);
    setTotalPages(Math.ceil(mockNotifications.length / 10));
    setLoading(false);
  }, []);

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || notification.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || notification.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || notification.category === categoryFilter;

    return matchesSearch && matchesType && matchesStatus && matchesCategory;
  });

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      info: { label: 'معلومات', variant: 'default' as const, className: 'bg-blue-100 text-blue-800' },
      success: { label: 'نجاح', variant: 'default' as const, className: 'bg-green-100 text-green-800' },
      warning: { label: 'تحذير', variant: 'outline' as const, className: 'bg-yellow-100 text-yellow-800' },
      error: { label: 'خطأ', variant: 'error' as const, className: 'bg-red-100 text-red-800' },
      urgent: { label: 'عاجل', variant: 'error' as const, className: 'bg-red-100 text-red-800' }
    };

    const config = typeConfig[type as keyof typeof typeConfig] ||
                  { label: type, variant: 'outline' as const, className: '' };
    return <Badge variant={config.variant} className={config.className}>{config.label}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: 'مسودة', variant: 'outline' as const, className: 'bg-gray-100 text-gray-800' },
      scheduled: { label: 'مجدول', variant: 'secondary' as const, className: 'bg-blue-100 text-blue-800' },
      sent: { label: 'مرسل', variant: 'default' as const, className: 'bg-green-100 text-green-800' },
      delivered: { label: 'تم التسليم', variant: 'default' as const, className: 'bg-green-100 text-green-800' },
      failed: { label: 'فشل', variant: 'error' as const, className: 'bg-red-100 text-red-800' },
      cancelled: { label: 'ملغي', variant: 'secondary' as const, className: 'bg-gray-100 text-gray-800' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] ||
                  { label: status, variant: 'outline' as const, className: '' };
    return <Badge variant={config.variant} className={config.className}>{config.label}</Badge>;
  };

  const getCategoryBadge = (category: string) => {
    const categoryConfig = {
      appointment: { label: 'موعد', icon: <Calendar className="h-3 w-3" />, className: 'bg-blue-100 text-blue-800' },
      payment: { label: 'دفعة', icon: <TrendingUp className="h-3 w-3" />, className: 'bg-green-100 text-green-800' },
      system: { label: 'نظام', icon: <Settings className="h-3 w-3" />, className: 'bg-purple-100 text-purple-800' },
      security: { label: 'أمن', icon: <Shield className="h-3 w-3" />, className: 'bg-red-100 text-red-800' },
      marketing: { label: 'تسويق', icon: <Target className="h-3 w-3" />, className: 'bg-orange-100 text-orange-800' },
      general: { label: 'عام', icon: <Bell className="h-3 w-3" />, className: 'bg-gray-100 text-gray-800' }
    };

    const config = categoryConfig[category as keyof typeof categoryConfig] ||
                  { label: category, icon: null, className: '' };
    return (
      <Badge variant="outline" className={config.className}>
        <span className="flex items-center gap-1">
          {config.icon}
          {config.label}
        </span>
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: { label: 'منخفض', variant: 'outline' as const, className: 'bg-gray-100 text-gray-800' },
      medium: { label: 'متوسط', variant: 'secondary' as const, className: 'bg-yellow-100 text-yellow-800' },
      high: { label: 'عالي', variant: 'default' as const, className: 'bg-orange-100 text-orange-800' },
      urgent: { label: 'عاجل', variant: 'error' as const, className: 'bg-red-100 text-red-800' }
    };

    const config = priorityConfig[priority as keyof typeof priorityConfig] ||
                  { label: priority, variant: 'outline' as const, className: '' };
    return <Badge variant={config.variant} className={config.className}>{config.label}</Badge>;
  };

  const getChannelBadge = (channels: string[]) => {
    const channelConfig = {
      email: { label: 'بريد', icon: <Mail className="h-3 w-3" />, className: 'bg-blue-100 text-blue-800' },
      sms: { label: 'رسالة', icon: <MessageSquare className="h-3 w-3" />, className: 'bg-green-100 text-green-800' },
      push: { label: 'تنبيه', icon: <Bell className="h-3 w-3" />, className: 'bg-purple-100 text-purple-800' },
      in_app: { label: 'داخلي', icon: <Activity className="h-3 w-3" />, className: 'bg-gray-100 text-gray-800' }
    };

    return (
      <div className="flex gap-1">
        {channels.map(channel => {
          const config = channelConfig[channel as keyof typeof channelConfig] ||
                        { label: channel, icon: null, className: '' };
          return (
            <Badge key={channel} variant="outline" className={config.className}>
              <span className="flex items-center gap-1">
                {config.icon}
                {config.label}
              </span>
            </Badge>
          );
        })}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewNotification = (notification: Notification) => {
    setSelectedNotification(notification);
    setIsNotificationDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>جاري تحميل الإشعارات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container-app py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">إدارة الإشعارات</h1>
            <p className="text-muted-foreground">
              إدارة وإرسال الإشعارات للعملاء والموظفين
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              تصدير
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              إشعار جديد
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي الإشعارات</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{notifications.length}</div>
              <p className="text-xs text-muted-foreground">
                +12 من الأسبوع الماضي
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">المرسلة</CardTitle>
              <Send className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {notifications.filter(n => n.status === 'sent' || n.status === 'delivered').length}
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.round((notifications.filter(n => n.status === 'sent' || n.status === 'delivered').length / notifications.length) * 100)}% من الإجمالي
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">معدل التسليم</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(notifications.reduce((sum, n) => sum + n.deliveryRate, 0) / notifications.length)}%
              </div>
              <p className="text-xs text-muted-foreground">
                متوسط معدل التسليم
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">معدل القراءة</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(notifications.reduce((sum, n) => sum + n.clickRate, 0) / notifications.length)}%
              </div>
              <p className="text-xs text-muted-foreground">
                متوسط معدل القراءة
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="البحث في الإشعارات..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="النوع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الأنواع</SelectItem>
                    <SelectItem value="info">معلومات</SelectItem>
                    <SelectItem value="success">نجاح</SelectItem>
                    <SelectItem value="warning">تحذير</SelectItem>
                    <SelectItem value="error">خطأ</SelectItem>
                    <SelectItem value="urgent">عاجل</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الحالات</SelectItem>
                    <SelectItem value="draft">مسودة</SelectItem>
                    <SelectItem value="scheduled">مجدول</SelectItem>
                    <SelectItem value="sent">مرسل</SelectItem>
                    <SelectItem value="delivered">تم التسليم</SelectItem>
                    <SelectItem value="failed">فشل</SelectItem>
                    <SelectItem value="cancelled">ملغي</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="الفئة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الفئات</SelectItem>
                    <SelectItem value="appointment">موعد</SelectItem>
                    <SelectItem value="payment">دفعة</SelectItem>
                    <SelectItem value="system">نظام</SelectItem>
                    <SelectItem value="security">أمن</SelectItem>
                    <SelectItem value="marketing">تسويق</SelectItem>
                    <SelectItem value="general">عام</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  فلتر
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications Table */}
        <Card>
          <CardHeader>
            <CardTitle>قائمة الإشعارات</CardTitle>
            <CardDescription>
              عرض وإدارة جميع الإشعارات المرسلة والمجدولة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedNotifications(filteredNotifications.map(n => n.id));
                        } else {
                          setSelectedNotifications([]);
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>العنوان</TableHead>
                  <TableHead>النوع</TableHead>
                  <TableHead>الفئة</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>الأولوية</TableHead>
                  <TableHead>القنوات</TableHead>
                  <TableHead>الإحصائيات</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNotifications.map((notification) => (
                  <TableRow key={notification.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        checked={selectedNotifications.includes(notification.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedNotifications([...selectedNotifications, notification.id]);
                          } else {
                            setSelectedNotifications(selectedNotifications.filter(id => id !== notification.id));
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{notification.title}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-48">
                          {notification.message}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          بواسطة: {notification.createdByName}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getTypeBadge(notification.type)}
                    </TableCell>
                    <TableCell>
                      {getCategoryBadge(notification.category)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(notification.status)}
                    </TableCell>
                    <TableCell>
                      {getPriorityBadge(notification.priority)}
                    </TableCell>
                    <TableCell>
                      {getChannelBadge(notification.channels)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>التسليم: {notification.deliveryRate}%</div>
                        <div>القراءة: {notification.clickRate}%</div>
                        <div>المرسل: {notification.totalSent}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleViewNotification(notification)}>
                            <Eye className="h-4 w-4 mr-2" />
                            عرض التفاصيل
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            تعديل
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Send className="h-4 w-4 mr-2" />
                            إرسال
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="h-4 w-4 mr-2" />
                            نسخ
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Archive className="h-4 w-4 mr-2" />
                            أرشفة
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            حذف
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                عرض {filteredNotifications.length} من {notifications.length} إشعار
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "primary" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Detail Dialog */}
        <Dialog open={isNotificationDialogOpen} onOpenChange={setIsNotificationDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedNotification?.title}
              </DialogTitle>
              <DialogDescription>
                تفاصيل الإشعار
              </DialogDescription>
            </DialogHeader>

            {selectedNotification && (
              <div className="space-y-4">
                {/* Notification Info */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                  <div>
                    <div className="text-sm font-medium">النوع</div>
                    <div>{getTypeBadge(selectedNotification.type)}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">الفئة</div>
                    <div>{getCategoryBadge(selectedNotification.category)}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">الحالة</div>
                    <div>{getStatusBadge(selectedNotification.status)}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">الأولوية</div>
                    <div>{getPriorityBadge(selectedNotification.priority)}</div>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <div className="text-sm font-medium mb-2">الرسالة</div>
                  <div className="p-4 bg-muted rounded-lg">
                    {selectedNotification.message}
                  </div>
                </div>

                {/* Channels */}
                <div>
                  <div className="text-sm font-medium mb-2">القنوات</div>
                  <div>{getChannelBadge(selectedNotification.channels)}</div>
                </div>

                {/* Statistics */}
                <div>
                  <div className="text-sm font-medium mb-2">الإحصائيات</div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>معدل التسليم: {selectedNotification.deliveryRate}%</div>
                    <div>معدل القراءة: {selectedNotification.clickRate}%</div>
                    <div>إجمالي المرسل: {selectedNotification.totalSent}</div>
                    <div>عدد القراءات: {selectedNotification.readCount}</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => setIsNotificationDialogOpen(false)}>
                    إغلاق
                  </Button>
                  <Button>
                    <Edit className="h-4 w-4 mr-2" />
                    تعديل
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
