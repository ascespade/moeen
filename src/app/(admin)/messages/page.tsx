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
  Mail,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Send,
  Reply,
  Forward,
  Archive,
  Star,
  Flag,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  Upload,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
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
  Copy,
  Share,
  ExternalLink,
  Inbox,
  Send as Outbox,
  FileText as Drafts,
  AlertOctagon as Spam,
  Trash,
  ArchiveIcon,
  Folder,
  FolderOpen,
  Tag,
  Pin,
  Lock,
  Unlock,
  EyeOff,
  Bell,
  BellOff,
  Volume2,
  VolumeX,
  Mic,
  Video,
  PhoneCall,
  Smartphone,
  Monitor,
  Tablet,
  Wifi,
  WifiOff,
  Signal,
  Battery,
  Cpu,
  HardDrive,
  MemoryStick,
  Server,
  Cloud,
  Sun,
  Moon,
  Sunrise,
  Sunset
} from 'lucide-react';

interface Message {
  id: string;
  subject: string;
  content: string;
  senderId: string;
  senderName: string;
  senderEmail: string;
  recipientId: string;
  recipientName: string;
  recipientEmail: string;
  type: 'email' | 'sms' | 'push' | 'in_app' | 'whatsapp' | 'telegram';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'draft' | 'sent' | 'delivered' | 'read' | 'failed' | 'scheduled';
  category: 'appointment' | 'payment' | 'notification' | 'marketing' | 'support' | 'general';
  isRead: boolean;
  isStarred: boolean;
  isFlagged: boolean;
  isArchived: boolean;
  isSpam: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  sentAt?: string;
  deliveredAt?: string;
  readAt?: string;
  scheduledAt?: string;
  attachments?: {
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
  }[];
  tags?: string[];
  notes?: string;
  replyTo?: string;
  threadId?: string;
  metadata?: {
    templateId?: string;
    campaignId?: string;
    customFields?: Record<string, any>;
  };
}

export default function MessagesPage() {
  const { t } = useT();
  const { hasPermission } = usePermissions({ userRole: 'admin' });
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState('inbox');

  // Mock data
  useEffect(() => {
    const mockMessages: Message[] = [
      {
        id: '1',
        subject: 'تأكيد موعد طبي',
        content: 'تم تأكيد موعدك مع د. فاطمة أحمد يوم الأحد الموافق 20 يناير في الساعة 10:00 صباحاً',
        senderId: 'system',
        senderName: 'نظام المواعيد',
        senderEmail: 'appointments@hemam.com',
        recipientId: 'patient1',
        recipientName: 'أحمد محمد العلي',
        recipientEmail: 'ahmed.ali@email.com',
        type: 'email',
        priority: 'high',
        status: 'delivered',
        category: 'appointment',
        isRead: true,
        isStarred: false,
        isFlagged: false,
        isArchived: false,
        isSpam: false,
        isDeleted: false,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        sentAt: '2024-01-15T10:00:00Z',
        deliveredAt: '2024-01-15T10:05:00Z',
        readAt: '2024-01-15T10:15:00Z',
        tags: ['موعد', 'تأكيد', 'طبي'],
        metadata: {
          templateId: 'appointment_confirmation'
        }
      },
      {
        id: '2',
        subject: 'تذكير بموعد غداً',
        content: 'تذكير: لديك موعد مع د. نورا الزهراني غداً في الساعة 2:00 مساءً',
        senderId: 'system',
        senderName: 'نظام التذكيرات',
        senderEmail: 'reminders@hemam.com',
        recipientId: 'patient2',
        recipientName: 'فاطمة أحمد السعد',
        recipientEmail: 'fatima.saad@email.com',
        type: 'sms',
        priority: 'medium',
        status: 'sent',
        category: 'appointment',
        isRead: false,
        isStarred: true,
        isFlagged: false,
        isArchived: false,
        isSpam: false,
        isDeleted: false,
        createdAt: '2024-01-15T14:00:00Z',
        updatedAt: '2024-01-15T14:00:00Z',
        sentAt: '2024-01-15T14:00:00Z',
        tags: ['موعد', 'تذكير', 'طبي']
      },
      {
        id: '3',
        subject: 'استلام دفعة',
        content: 'تم استلام دفعة بقيمة 500 ريال من المريض محمد عبدالله القحطاني',
        senderId: 'system',
        senderName: 'نظام المدفوعات',
        senderEmail: 'payments@hemam.com',
        recipientId: 'staff1',
        recipientName: 'سارة أحمد',
        recipientEmail: 'sara.ahmed@hemam.com',
        type: 'in_app',
        priority: 'low',
        status: 'read',
        category: 'payment',
        isRead: true,
        isStarred: false,
        isFlagged: false,
        isArchived: false,
        isSpam: false,
        isDeleted: false,
        createdAt: '2024-01-15T11:30:00Z',
        updatedAt: '2024-01-15T11:30:00Z',
        sentAt: '2024-01-15T11:30:00Z',
        deliveredAt: '2024-01-15T11:30:00Z',
        readAt: '2024-01-15T11:35:00Z',
        tags: ['دفعة', 'مالي', 'تأكيد']
      },
      {
        id: '4',
        subject: 'عرض خاص - خصم 20%',
        content: 'احصل على خصم 20% على جميع الخدمات الطبية هذا الأسبوع. لا تفوت الفرصة!',
        senderId: 'marketing1',
        senderName: 'فريق التسويق',
        senderEmail: 'marketing@hemam.com',
        recipientId: 'patient3',
        recipientName: 'نورا سعد المطيري',
        recipientEmail: 'nora.mutairi@email.com',
        type: 'whatsapp',
        priority: 'medium',
        status: 'scheduled',
        category: 'marketing',
        isRead: false,
        isStarred: false,
        isFlagged: false,
        isArchived: false,
        isSpam: false,
        isDeleted: false,
        createdAt: '2024-01-15T13:00:00Z',
        updatedAt: '2024-01-15T13:00:00Z',
        scheduledAt: '2024-01-16T09:00:00Z',
        tags: ['تسويق', 'عرض', 'خصم'],
        metadata: {
          campaignId: 'winter_sale_2024'
        }
      },
      {
        id: '5',
        subject: 'طلب دعم فني',
        content: 'أحتاج مساعدة في إعداد النظام الجديد. هل يمكنك مساعدتي؟',
        senderId: 'staff2',
        senderName: 'خالد فيصل الشمري',
        senderEmail: 'khalid.shamri@hemam.com',
        recipientId: 'tech1',
        recipientName: 'أحمد التقني',
        recipientEmail: 'ahmed.tech@hemam.com',
        type: 'email',
        priority: 'high',
        status: 'delivered',
        category: 'support',
        isRead: false,
        isStarred: false,
        isFlagged: true,
        isArchived: false,
        isSpam: false,
        isDeleted: false,
        createdAt: '2024-01-15T12:00:00Z',
        updatedAt: '2024-01-15T12:00:00Z',
        sentAt: '2024-01-15T12:00:00Z',
        deliveredAt: '2024-01-15T12:05:00Z',
        tags: ['دعم', 'تقني', 'مساعدة'],
        attachments: [
          {
            id: 'att1',
            name: 'screenshot.png',
            url: '/attachments/screenshot.png',
            type: 'image/png',
            size: 1024000
          }
        ]
      }
    ];

    setMessages(mockMessages);
    setTotalPages(Math.ceil(mockMessages.length / 10));
    setLoading(false);
  }, []);

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.recipientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || message.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || message.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || message.category === categoryFilter;
    const matchesFolder = selectedFolder === 'all' || 
                         (selectedFolder === 'inbox' && !message.isDeleted && !message.isArchived && !message.isSpam) ||
                         (selectedFolder === 'sent' && message.senderId === 'current_user') ||
                         (selectedFolder === 'drafts' && message.status === 'draft') ||
                         (selectedFolder === 'spam' && message.isSpam) ||
                         (selectedFolder === 'trash' && message.isDeleted) ||
                         (selectedFolder === 'archived' && message.isArchived);
    
    return matchesSearch && matchesType && matchesStatus && matchesCategory && matchesFolder;
  });

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      email: { label: 'بريد إلكتروني', icon: <Mail className="h-3 w-3" />, className: 'bg-blue-100 text-blue-800' },
      sms: { label: 'رسالة نصية', icon: <MessageSquare className="h-3 w-3" />, className: 'bg-green-100 text-green-800' },
      push: { label: 'تنبيه', icon: <Bell className="h-3 w-3" />, className: 'bg-purple-100 text-purple-800' },
      in_app: { label: 'داخلي', icon: <Monitor className="h-3 w-3" />, className: 'bg-gray-100 text-gray-800' },
      whatsapp: { label: 'واتساب', icon: <MessageSquare className="h-3 w-3" />, className: 'bg-green-100 text-green-800' },
      telegram: { label: 'تيليجرام', icon: <Send className="h-3 w-3" />, className: 'bg-blue-100 text-blue-800' }
    };
    
    const config = typeConfig[type as keyof typeof typeConfig] || 
                  { label: type, icon: null, className: '' };
    return (
      <Badge variant="outline" className={config.className}>
        <span className="flex items-center gap-1">
          {config.icon}
          {config.label}
        </span>
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: 'مسودة', variant: 'outline' as const, className: 'bg-gray-100 text-gray-800' },
      sent: { label: 'مرسل', variant: 'default' as const, className: 'bg-blue-100 text-blue-800' },
      delivered: { label: 'تم التسليم', variant: 'default' as const, className: 'bg-green-100 text-green-800' },
      read: { label: 'مقروء', variant: 'default' as const, className: 'bg-green-100 text-green-800' },
      failed: { label: 'فشل', variant: 'error' as const, className: 'bg-red-100 text-red-800' },
      scheduled: { label: 'مجدول', variant: 'secondary' as const, className: 'bg-yellow-100 text-yellow-800' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || 
                  { label: status, variant: 'outline' as const, className: '' };
    return <Badge variant={config.variant} className={config.className}>{config.label}</Badge>;
  };

  const getCategoryBadge = (category: string) => {
    const categoryConfig = {
      appointment: { label: 'موعد', icon: <Calendar className="h-3 w-3" />, className: 'bg-blue-100 text-blue-800' },
      payment: { label: 'دفعة', icon: <TrendingUp className="h-3 w-3" />, className: 'bg-green-100 text-green-800' },
      notification: { label: 'إشعار', icon: <Bell className="h-3 w-3" />, className: 'bg-purple-100 text-purple-800' },
      marketing: { label: 'تسويق', icon: <Target className="h-3 w-3" />, className: 'bg-orange-100 text-orange-800' },
      support: { label: 'دعم', icon: <Settings className="h-3 w-3" />, className: 'bg-cyan-100 text-cyan-800' },
      general: { label: 'عام', icon: <Mail className="h-3 w-3" />, className: 'bg-gray-100 text-gray-800' }
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

  const handleViewMessage = (message: Message) => {
    setSelectedMessage(message);
    setIsMessageDialogOpen(true);
  };

  const folders = [
    { id: 'inbox', label: 'الوارد', icon: <Inbox className="h-4 w-4" />, count: messages.filter(m => !m.isDeleted && !m.isArchived && !m.isSpam).length },
    { id: 'sent', label: 'المرسل', icon: <Outbox className="h-4 w-4" />, count: messages.filter(m => m.senderId === 'current_user').length },
    { id: 'drafts', label: 'المسودات', icon: <Drafts className="h-4 w-4" />, count: messages.filter(m => m.status === 'draft').length },
    { id: 'spam', label: 'المهمل', icon: <Spam className="h-4 w-4" />, count: messages.filter(m => m.isSpam).length },
    { id: 'trash', label: 'المحذوف', icon: <Trash className="h-4 w-4" />, count: messages.filter(m => m.isDeleted).length },
    { id: 'archived', label: 'المؤرشف', icon: <ArchiveIcon className="h-4 w-4" />, count: messages.filter(m => m.isArchived).length }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>جاري تحميل الرسائل...</p>
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
            <h1 className="text-3xl font-bold">إدارة الرسائل</h1>
            <p className="text-muted-foreground">
              إدارة ومتابعة جميع الرسائل والاتصالات
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              تصدير
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              رسالة جديدة
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Folders Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>المجلدات</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {folders.map((folder) => (
                    <button
                      key={folder.id}
                      onClick={() => setSelectedFolder(folder.id)}
                      className={`w-full flex items-center justify-between p-3 text-right hover:bg-muted transition-colors ${
                        selectedFolder === folder.id ? 'bg-muted' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {folder.icon}
                        <span>{folder.label}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {folder.count}
                      </Badge>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Messages Content */}
          <div className="lg:col-span-3">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">{messages.length}</div>
                      <div className="text-sm text-muted-foreground">إجمالي الرسائل</div>
                    </div>
                    <Mail className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">
                        {messages.filter(m => m.isRead).length}
                      </div>
                      <div className="text-sm text-muted-foreground">مقروءة</div>
                    </div>
                    <CheckCircle className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">
                        {messages.filter(m => !m.isRead).length}
                      </div>
                      <div className="text-sm text-muted-foreground">غير مقروءة</div>
                    </div>
                    <XCircle className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">
                        {messages.filter(m => m.isFlagged).length}
                      </div>
                      <div className="text-sm text-muted-foreground">مميزة</div>
                    </div>
                    <Flag className="h-8 w-8 text-muted-foreground" />
                  </div>
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
                        placeholder="البحث في الرسائل..."
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
                        <SelectItem value="email">بريد إلكتروني</SelectItem>
                        <SelectItem value="sms">رسالة نصية</SelectItem>
                        <SelectItem value="push">تنبيه</SelectItem>
                        <SelectItem value="in_app">داخلي</SelectItem>
                        <SelectItem value="whatsapp">واتساب</SelectItem>
                        <SelectItem value="telegram">تيليجرام</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="الحالة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع الحالات</SelectItem>
                        <SelectItem value="draft">مسودة</SelectItem>
                        <SelectItem value="sent">مرسل</SelectItem>
                        <SelectItem value="delivered">تم التسليم</SelectItem>
                        <SelectItem value="read">مقروء</SelectItem>
                        <SelectItem value="failed">فشل</SelectItem>
                        <SelectItem value="scheduled">مجدول</SelectItem>
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
                        <SelectItem value="notification">إشعار</SelectItem>
                        <SelectItem value="marketing">تسويق</SelectItem>
                        <SelectItem value="support">دعم</SelectItem>
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

            {/* Messages Table */}
            <Card>
              <CardHeader>
                <CardTitle>قائمة الرسائل</CardTitle>
                <CardDescription>
                  عرض وإدارة جميع الرسائل في المجلد المحدد
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
                              setSelectedMessages(filteredMessages.map(m => m.id));
                            } else {
                              setSelectedMessages([]);
                            }
                          }}
                        />
                      </TableHead>
                      <TableHead>المرسل</TableHead>
                      <TableHead>الموضوع</TableHead>
                      <TableHead>النوع</TableHead>
                      <TableHead>الفئة</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>الأولوية</TableHead>
                      <TableHead>التاريخ</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMessages.map((message) => (
                      <TableRow key={message.id} className={!message.isRead ? 'bg-blue-50' : ''}>
                        <TableCell>
                          <input
                            type="checkbox"
                            className="rounded border-gray-300"
                            checked={selectedMessages.includes(message.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedMessages([...selectedMessages, message.id]);
                              } else {
                                setSelectedMessages(selectedMessages.filter(id => id !== message.id));
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground grid place-items-center text-sm">
                              {message.senderName.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium flex items-center gap-2">
                                {message.senderName}
                                {message.isStarred && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
                                {message.isFlagged && <Flag className="h-3 w-3 text-red-500" />}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {message.senderEmail}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{message.subject}</div>
                            <div className="text-sm text-muted-foreground truncate max-w-48">
                              {message.content}
                            </div>
                            {message.attachments && message.attachments.length > 0 && (
                              <div className="text-xs text-muted-foreground flex items-center gap-1">
                                <Paperclip className="h-3 w-3" />
                                {message.attachments.length} مرفق
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getTypeBadge(message.type)}
                        </TableCell>
                        <TableCell>
                          {getCategoryBadge(message.category)}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(message.status)}
                        </TableCell>
                        <TableCell>
                          {getPriorityBadge(message.priority)}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {formatDate(message.createdAt)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatTime(message.createdAt)}
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
                              <DropdownMenuItem onClick={() => handleViewMessage(message)}>
                                <Eye className="h-4 w-4 mr-2" />
                                عرض الرسالة
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Reply className="h-4 w-4 mr-2" />
                                الرد
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Forward className="h-4 w-4 mr-2" />
                                تحويل
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                تعديل
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Star className="h-4 w-4 mr-2" />
                                {message.isStarred ? 'إلغاء التمييز' : 'تمييز'}
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Flag className="h-4 w-4 mr-2" />
                                {message.isFlagged ? 'إلغاء العلم' : 'وضع علم'}
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Archive className="h-4 w-4 mr-2" />
                                أرشفة
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
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
                    عرض {filteredMessages.length} من {messages.length} رسالة
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
          </div>
        </div>

        {/* Message Detail Dialog */}
        <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedMessage?.subject}
              </DialogTitle>
              <DialogDescription>
                تفاصيل الرسالة
              </DialogDescription>
            </DialogHeader>
            
            {selectedMessage && (
              <div className="space-y-4">
                {/* Message Info */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                  <div>
                    <div className="text-sm font-medium">المرسل</div>
                    <div className="text-sm">{selectedMessage.senderName}</div>
                    <div className="text-xs text-muted-foreground">{selectedMessage.senderEmail}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">المستقبل</div>
                    <div className="text-sm">{selectedMessage.recipientName}</div>
                    <div className="text-xs text-muted-foreground">{selectedMessage.recipientEmail}</div>
                  </div>
                </div>

                {/* Message Content */}
                <div>
                  <div className="text-sm font-medium mb-2">محتوى الرسالة</div>
                  <div className="p-4 bg-muted rounded-lg">
                    {selectedMessage.content}
                  </div>
                </div>

                {/* Attachments */}
                {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
                  <div>
                    <div className="text-sm font-medium mb-2">المرفقات</div>
                    <div className="space-y-2">
                      {selectedMessage.attachments.map((attachment) => (
                        <div key={attachment.id} className="flex items-center justify-between p-2 bg-muted rounded">
                          <div className="flex items-center gap-2">
                            <Paperclip className="h-4 w-4" />
                            <span className="text-sm">{attachment.name}</span>
                          </div>
                          <Button size="sm" variant="outline">
                            تحميل
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => setIsMessageDialogOpen(false)}>
                    إغلاق
                  </Button>
                  <Button>
                    <Reply className="h-4 w-4 mr-2" />
                    الرد
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