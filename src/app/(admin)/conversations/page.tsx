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
  MessageSquare,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Phone,
  Mail,
  Calendar,
  Clock,
  User,
  Bot,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  Upload,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Send,
  Reply,
  Forward,
  Archive,
  Flag,
  Star,
  ThumbsUp,
  ThumbsDown,
  Volume2,
  VolumeX,
  Mic,
  Video,
  PhoneCall,
  Smartphone,
  Monitor,
  Tablet,
  Globe,
  MapPin,
  FileText,
  Image,
  Paperclip,
  Smile,
  Frown,
  Meh,
  Heart,
  Zap,
  Target,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  Users,
  Settings,
  Copy,
  Share,
  ExternalLink
} from 'lucide-react';

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantType: 'patient' | 'visitor' | 'staff' | 'bot';
  participantPhone?: string;
  participantEmail?: string;
  status: 'active' | 'resolved' | 'pending' | 'archived' | 'escalated';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  channel: 'chat' | 'phone' | 'email' | 'video' | 'whatsapp' | 'telegram';
  subject: string;
  lastMessage: string;
  lastMessageTime: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  assignedToName?: string;
  tags?: string[];
  notes?: string;
  satisfaction?: number;
  resolution?: string;
  duration: number; // in minutes
  messageCount: number;
  isRead: boolean;
  isFlagged: boolean;
  isStarred: boolean;
  device: 'mobile' | 'desktop' | 'tablet';
  language: 'ar' | 'en';
  location?: string;
  source: string;
  category: 'appointment' | 'support' | 'billing' | 'general' | 'complaint' | 'feedback';
}

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderType: 'user' | 'agent' | 'bot' | 'system';
  content: string;
  type: 'text' | 'image' | 'file' | 'audio' | 'video' | 'location' | 'contact';
  timestamp: string;
  isRead: boolean;
  isEdited: boolean;
  isDeleted: boolean;
  attachments?: {
    name: string;
    url: string;
    type: string;
    size: number;
  }[];
  metadata?: {
    sentiment?: 'positive' | 'negative' | 'neutral';
    intent?: string;
    confidence?: number;
    entities?: any[];
  };
}

export default function ConversationsPage() {
  const { t } = useT();
  const { hasPermission } = usePermissions({ userRole: 'admin' });
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [channelFilter, setChannelFilter] = useState('all');
  const [selectedConversations, setSelectedConversations] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [isConversationDialogOpen, setIsConversationDialogOpen] = useState(false);

  // Mock data
  useEffect(() => {
    const mockConversations: Conversation[] = [
      {
        id: '1',
        participantId: '1',
        participantName: 'أحمد محمد العلي',
        participantType: 'patient',
        participantPhone: '+966501234567',
        participantEmail: 'ahmed.ali@email.com',
        status: 'active',
        priority: 'high',
        channel: 'chat',
        subject: 'حجز موعد مع د. فاطمة',
        lastMessage: 'شكراً لك، سأحضر في الموعد المحدد',
        lastMessageTime: '2024-01-15T14:30:00Z',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T14:30:00Z',
        assignedTo: 'agent1',
        assignedToName: 'سارة أحمد',
        tags: ['موعد', 'طوارئ'],
        notes: 'مريض يعاني من ألم في الصدر',
        satisfaction: 5,
        duration: 45,
        messageCount: 12,
        isRead: false,
        isFlagged: true,
        isStarred: false,
        device: 'mobile',
        language: 'ar',
        location: 'الرياض',
        source: 'الموقع الإلكتروني',
        category: 'appointment'
      },
      {
        id: '2',
        participantId: '2',
        participantName: 'فاطمة أحمد السعد',
        participantType: 'patient',
        participantPhone: '+966502345678',
        participantEmail: 'fatima.saad@email.com',
        status: 'resolved',
        priority: 'medium',
        channel: 'whatsapp',
        subject: 'استفسار عن نتائج التحاليل',
        lastMessage: 'تم إرسال النتائج عبر البريد الإلكتروني',
        lastMessageTime: '2024-01-15T12:15:00Z',
        createdAt: '2024-01-15T11:00:00Z',
        updatedAt: '2024-01-15T12:15:00Z',
        assignedTo: 'agent2',
        assignedToName: 'محمد عبدالله',
        tags: ['تحاليل', 'نتائج'],
        notes: 'مريضة تريد معرفة نتائج تحاليل الدم',
        satisfaction: 4,
        resolution: 'تم إرسال النتائج عبر البريد الإلكتروني',
        duration: 25,
        messageCount: 8,
        isRead: true,
        isFlagged: false,
        isStarred: true,
        device: 'mobile',
        language: 'ar',
        location: 'جدة',
        source: 'واتساب',
        category: 'support'
      },
      {
        id: '3',
        participantId: '3',
        participantName: 'محمد عبدالله القحطاني',
        participantType: 'visitor',
        participantPhone: '+966503456789',
        status: 'pending',
        priority: 'low',
        channel: 'phone',
        subject: 'استفسار عام عن الخدمات',
        lastMessage: 'هل تقدمون خدمات طب الأسنان؟',
        lastMessageTime: '2024-01-15T09:45:00Z',
        createdAt: '2024-01-15T09:30:00Z',
        updatedAt: '2024-01-15T09:45:00Z',
        assignedTo: 'agent3',
        assignedToName: 'نورا سعد',
        tags: ['استفسار', 'خدمات'],
        notes: 'زائر يريد معرفة الخدمات المتاحة',
        duration: 15,
        messageCount: 4,
        isRead: false,
        isFlagged: false,
        isStarred: false,
        device: 'desktop',
        language: 'ar',
        location: 'الدمام',
        source: 'الهاتف',
        category: 'general'
      },
      {
        id: '4',
        participantId: '4',
        participantName: 'نورا سعد المطيري',
        participantType: 'patient',
        participantPhone: '+966504567890',
        participantEmail: 'nora.mutairi@email.com',
        status: 'escalated',
        priority: 'urgent',
        channel: 'email',
        subject: 'شكوى حول الخدمة',
        lastMessage: 'لم أحصل على رد على استفساري منذ 3 أيام',
        lastMessageTime: '2024-01-15T08:20:00Z',
        createdAt: '2024-01-12T14:00:00Z',
        updatedAt: '2024-01-15T08:20:00Z',
        assignedTo: 'supervisor1',
        assignedToName: 'خالد فيصل',
        tags: ['شكوى', 'عاجل'],
        notes: 'مريضة تشكو من عدم الرد على استفسارها',
        satisfaction: 1,
        duration: 120,
        messageCount: 20,
        isRead: true,
        isFlagged: true,
        isStarred: false,
        device: 'desktop',
        language: 'ar',
        location: 'الرياض',
        source: 'البريد الإلكتروني',
        category: 'complaint'
      },
      {
        id: '5',
        participantId: '5',
        participantName: 'خالد فيصل الشمري',
        participantType: 'staff',
        participantPhone: '+966505678901',
        participantEmail: 'khalid.shamri@hemam.com',
        status: 'active',
        priority: 'medium',
        channel: 'chat',
        subject: 'طلب مساعدة تقنية',
        lastMessage: 'هل يمكنك مساعدتي في إعداد النظام الجديد؟',
        lastMessageTime: '2024-01-15T13:10:00Z',
        createdAt: '2024-01-15T13:00:00Z',
        updatedAt: '2024-01-15T13:10:00Z',
        assignedTo: 'tech1',
        assignedToName: 'أحمد التقني',
        tags: ['تقني', 'نظام'],
        notes: 'موظف يحتاج مساعدة في النظام',
        duration: 30,
        messageCount: 6,
        isRead: false,
        isFlagged: false,
        isStarred: false,
        device: 'desktop',
        language: 'ar',
        location: 'الطائف',
        source: 'النظام الداخلي',
        category: 'support'
      }
    ];

    setConversations(mockConversations);
    setTotalPages(Math.ceil(mockConversations.length / 10));
    setLoading(false);
  }, []);

  const filteredConversations = conversations.filter(conversation => {
    const matchesSearch = conversation.participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conversation.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conversation.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || conversation.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || conversation.priority === priorityFilter;
    const matchesChannel = channelFilter === 'all' || conversation.channel === channelFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesChannel;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'نشط', variant: 'default' as const, className: 'bg-green-100 text-green-800' },
      resolved: { label: 'محلول', variant: 'secondary' as const, className: 'bg-blue-100 text-blue-800' },
      pending: { label: 'في الانتظار', variant: 'outline' as const, className: 'bg-yellow-100 text-yellow-800' },
      archived: { label: 'مؤرشف', variant: 'secondary' as const, className: 'bg-gray-100 text-gray-800' },
      escalated: { label: 'مرفوع', variant: 'error' as const, className: 'bg-red-100 text-red-800' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] ||
                  { label: status, variant: 'outline' as const, className: '' };
    return <Badge variant={config.variant} className={config.className}>{config.label}</Badge>;
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

  const getChannelBadge = (channel: string) => {
    const channelConfig = {
      chat: { label: 'دردشة', icon: <MessageCircle className="h-3 w-3" />, className: 'bg-blue-100 text-blue-800' },
      phone: { label: 'هاتف', icon: <Phone className="h-3 w-3" />, className: 'bg-green-100 text-green-800' },
      email: { label: 'بريد', icon: <Mail className="h-3 w-3" />, className: 'bg-purple-100 text-purple-800' },
      video: { label: 'فيديو', icon: <Video className="h-3 w-3" />, className: 'bg-red-100 text-red-800' },
      whatsapp: { label: 'واتساب', icon: <MessageSquare className="h-3 w-3" />, className: 'bg-green-100 text-green-800' },
      telegram: { label: 'تيليجرام', icon: <Send className="h-3 w-3" />, className: 'bg-blue-100 text-blue-800' }
    };

    const config = channelConfig[channel as keyof typeof channelConfig] ||
                  { label: channel, icon: null, className: '' };
    return (
      <Badge variant="outline" className={config.className}>
        <span className="flex items-center gap-1">
          {config.icon}
          {config.label}
        </span>
      </Badge>
    );
  };

  const getParticipantTypeBadge = (type: string) => {
    const typeConfig = {
      patient: { label: 'مريض', icon: <User className="h-3 w-3" />, className: 'bg-blue-100 text-blue-800' },
      visitor: { label: 'زائر', icon: <Globe className="h-3 w-3" />, className: 'bg-gray-100 text-gray-800' },
      staff: { label: 'موظف', icon: <Users className="h-3 w-3" />, className: 'bg-green-100 text-green-800' },
      bot: { label: 'بوت', icon: <Bot className="h-3 w-3" />, className: 'bg-purple-100 text-purple-800' }
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

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'desktop': return <Monitor className="h-4 w-4" />;
      case 'tablet': return <Tablet className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  const handleViewConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setIsConversationDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>جاري تحميل المحادثات...</p>
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
            <h1 className="text-3xl font-bold">إدارة المحادثات</h1>
            <p className="text-muted-foreground">
              إدارة ومتابعة جميع المحادثات مع العملاء والمرضى
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              تصدير
            </Button>
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              استيراد
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي المحادثات</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{conversations.length}</div>
              <p className="text-xs text-muted-foreground">
                +8 من الأسبوع الماضي
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">المحادثات النشطة</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {conversations.filter(c => c.status === 'active').length}
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.round((conversations.filter(c => c.status === 'active').length / conversations.length) * 100)}% من الإجمالي
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">المحادثات المحلولة</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {conversations.filter(c => c.status === 'resolved').length}
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.round((conversations.filter(c => c.status === 'resolved').length / conversations.length) * 100)}% من الإجمالي
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">متوسط وقت الاستجابة</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(conversations.reduce((sum, c) => sum + c.duration, 0) / conversations.length)} دقيقة
              </div>
              <p className="text-xs text-muted-foreground">
                متوسط مدة المحادثة
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
                    placeholder="البحث في المحادثات..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الحالات</SelectItem>
                    <SelectItem value="active">نشط</SelectItem>
                    <SelectItem value="resolved">محلول</SelectItem>
                    <SelectItem value="pending">في الانتظار</SelectItem>
                    <SelectItem value="archived">مؤرشف</SelectItem>
                    <SelectItem value="escalated">مرفوع</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="الأولوية" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الأولويات</SelectItem>
                    <SelectItem value="low">منخفض</SelectItem>
                    <SelectItem value="medium">متوسط</SelectItem>
                    <SelectItem value="high">عالي</SelectItem>
                    <SelectItem value="urgent">عاجل</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={channelFilter} onValueChange={setChannelFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="القناة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع القنوات</SelectItem>
                    <SelectItem value="chat">دردشة</SelectItem>
                    <SelectItem value="phone">هاتف</SelectItem>
                    <SelectItem value="email">بريد</SelectItem>
                    <SelectItem value="video">فيديو</SelectItem>
                    <SelectItem value="whatsapp">واتساب</SelectItem>
                    <SelectItem value="telegram">تيليجرام</SelectItem>
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

        {/* Conversations Table */}
        <Card>
          <CardHeader>
            <CardTitle>قائمة المحادثات</CardTitle>
            <CardDescription>
              عرض وإدارة جميع المحادثات مع العملاء والمرضى
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
                          setSelectedConversations(filteredConversations.map(c => c.id));
                        } else {
                          setSelectedConversations([]);
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>المشارك</TableHead>
                  <TableHead>الموضوع</TableHead>
                  <TableHead>القناة</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>الأولوية</TableHead>
                  <TableHead>آخر رسالة</TableHead>
                  <TableHead>المدة</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredConversations.map((conversation) => (
                  <TableRow key={conversation.id} className={!conversation.isRead ? 'bg-blue-50' : ''}>
                    <TableCell>
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        checked={selectedConversations.includes(conversation.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedConversations([...selectedConversations, conversation.id]);
                          } else {
                            setSelectedConversations(selectedConversations.filter(id => id !== conversation.id));
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground grid place-items-center text-sm">
                          {conversation.participantName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {conversation.participantName}
                            {conversation.isStarred && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
                            {conversation.isFlagged && <Flag className="h-3 w-3 text-red-500" />}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            {getParticipantTypeBadge(conversation.participantType)}
                            {getDeviceIcon(conversation.device)}
                          </div>
                          {conversation.participantPhone && (
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {conversation.participantPhone}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{conversation.subject}</div>
                        <div className="text-sm text-muted-foreground">{conversation.category}</div>
                        {conversation.assignedToName && (
                          <div className="text-xs text-muted-foreground">
                            مخصص لـ: {conversation.assignedToName}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getChannelBadge(conversation.channel)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(conversation.status)}
                    </TableCell>
                    <TableCell>
                      {getPriorityBadge(conversation.priority)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="truncate max-w-48">{conversation.lastMessage}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatTime(conversation.lastMessageTime)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {conversation.duration} دقيقة
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {conversation.messageCount} رسالة
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
                          <DropdownMenuItem onClick={() => handleViewConversation(conversation)}>
                            <Eye className="h-4 w-4 mr-2" />
                            عرض المحادثة
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
                            <Archive className="h-4 w-4 mr-2" />
                            أرشفة
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Phone className="h-4 w-4 mr-2" />
                            اتصال
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
                            إرسال بريد
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Star className="h-4 w-4 mr-2" />
                            {conversation.isStarred ? 'إلغاء التمييز' : 'تمييز'}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Flag className="h-4 w-4 mr-2" />
                            {conversation.isFlagged ? 'إلغاء العلم' : 'وضع علم'}
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
                عرض {filteredConversations.length} من {conversations.length} محادثة
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

        {/* Conversation Detail Dialog */}
        <Dialog open={isConversationDialogOpen} onOpenChange={setIsConversationDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedConversation?.subject}
              </DialogTitle>
              <DialogDescription>
                محادثة مع {selectedConversation?.participantName} - {selectedConversation?.channel}
              </DialogDescription>
            </DialogHeader>

            {selectedConversation && (
              <div className="space-y-4">
                {/* Conversation Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
                  <div>
                    <div className="text-sm font-medium">الحالة</div>
                    <div>{getStatusBadge(selectedConversation.status)}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">الأولوية</div>
                    <div>{getPriorityBadge(selectedConversation.priority)}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">المدة</div>
                    <div className="text-sm">{selectedConversation.duration} دقيقة</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">الرسائل</div>
                    <div className="text-sm">{selectedConversation.messageCount} رسالة</div>
                  </div>
                </div>

                {/* Messages */}
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  <div className="text-center text-muted-foreground">
                    عرض المحادثة قريباً...
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => setIsConversationDialogOpen(false)}>
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
