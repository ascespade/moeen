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
  Bot,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Play,
  Pause,
  Settings,
  BarChart3,
  MessageSquare,
  Workflow,
  FileText,
  Zap,
  Download,
  Upload,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Activity,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Brain,
  Target,
  TrendingUp,
  PieChart,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Headphones,
  Mic,
  Video,
  Phone,
  Mail,
  Calendar,
  Star,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Send,
  Copy,
  Share,
  ExternalLink
} from 'lucide-react';

interface ChatbotFlow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'draft' | 'testing';
  type: 'welcome' | 'support' | 'appointment' | 'information' | 'custom';
  language: 'ar' | 'en' | 'both';
  triggers: string[];
  responses: number;
  interactions: number;
  successRate: number;
  createdAt: string;
  updatedAt: string;
  lastUsed: string;
  tags?: string[];
  isPublic: boolean;
  version: string;
}

interface ChatbotTemplate {
  id: string;
  name: string;
  description: string;
  category: 'healthcare' | 'appointment' | 'support' | 'marketing' | 'general';
  language: 'ar' | 'en' | 'both';
  content: string;
  variables: string[];
  usage: number;
  rating: number;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  author: string;
  tags?: string[];
}

interface ChatbotAnalytics {
  totalConversations: number;
  activeUsers: number;
  averageResponseTime: number;
  satisfactionRate: number;
  topFlows: { name: string; usage: number }[];
  topTemplates: { name: string; usage: number }[];
  deviceBreakdown: { device: string; percentage: number }[];
  languageBreakdown: { language: string; percentage: number }[];
  hourlyStats: { hour: number; conversations: number }[];
  dailyStats: { date: string; conversations: number }[];
}

export default function ChatbotPage() {
  const { t } = useT();
  const { hasPermission } = usePermissions({ userRole: 'admin' });
  const [activeTab, setActiveTab] = useState<'flows' | 'templates' | 'analytics' | 'integrations'>('flows');
  const [flows, setFlows] = useState<ChatbotFlow[]>([]);
  const [templates, setTemplates] = useState<ChatbotTemplate[]>([]);
  const [analytics, setAnalytics] = useState<ChatbotAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Mock data
  useEffect(() => {
    const mockFlows: ChatbotFlow[] = [
      {
        id: '1',
        name: 'ترحيب المرضى الجدد',
        description: 'تدفق ترحيبي للمرضى الجدد مع جمع المعلومات الأساسية',
        status: 'active',
        type: 'welcome',
        language: 'ar',
        triggers: ['مرحبا', 'أريد حجز موعد', 'معلومات عن المركز'],
        responses: 15,
        interactions: 1247,
        successRate: 92,
        createdAt: '2024-01-01T08:00:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
        lastUsed: '2024-01-15T14:20:00Z',
        tags: ['ترحيب', 'معلومات', 'مواعيد'],
        isPublic: true,
        version: '1.2.0'
      },
      {
        id: '2',
        name: 'حجز المواعيد الذكي',
        description: 'نظام حجز المواعيد التلقائي مع التحقق من التوفر',
        status: 'active',
        type: 'appointment',
        language: 'both',
        triggers: ['حجز موعد', 'book appointment', 'مواعيد متاحة'],
        responses: 25,
        interactions: 2156,
        successRate: 88,
        createdAt: '2024-01-05T08:00:00Z',
        updatedAt: '2024-01-14T16:45:00Z',
        lastUsed: '2024-01-15T11:30:00Z',
        tags: ['مواعيد', 'حجز', 'ذكي'],
        isPublic: true,
        version: '2.1.0'
      },
      {
        id: '3',
        name: 'الدعم الفني',
        description: 'نظام دعم فني للمساعدة في حل المشاكل التقنية',
        status: 'testing',
        type: 'support',
        language: 'ar',
        triggers: ['مشكلة تقنية', 'لا يعمل', 'خطأ'],
        responses: 20,
        interactions: 89,
        successRate: 75,
        createdAt: '2024-01-10T08:00:00Z',
        updatedAt: '2024-01-15T09:15:00Z',
        lastUsed: '2024-01-15T08:45:00Z',
        tags: ['دعم', 'تقني', 'مشاكل'],
        isPublic: false,
        version: '0.9.0'
      },
      {
        id: '4',
        name: 'معلومات الخدمات',
        description: 'تقديم معلومات شاملة عن خدمات المركز الطبي',
        status: 'inactive',
        type: 'information',
        language: 'ar',
        triggers: ['الخدمات', 'ماذا تقدمون', 'أسعار'],
        responses: 12,
        interactions: 456,
        successRate: 85,
        createdAt: '2023-12-20T08:00:00Z',
        updatedAt: '2024-01-12T14:20:00Z',
        lastUsed: '2024-01-10T16:30:00Z',
        tags: ['معلومات', 'خدمات', 'أسعار'],
        isPublic: true,
        version: '1.0.0'
      }
    ];

    const mockTemplates: ChatbotTemplate[] = [
      {
        id: '1',
        name: 'ترحيب بالمرضى',
        description: 'رسالة ترحيبية احترافية للمرضى الجدد',
        category: 'healthcare',
        language: 'ar',
        content: 'مرحباً بك في مركز الهمم الطبي! كيف يمكنني مساعدتك اليوم؟',
        variables: ['اسم المريض', 'وقت اليوم'],
        usage: 1247,
        rating: 4.8,
        isPublic: true,
        createdAt: '2024-01-01T08:00:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
        author: 'فريق التطوير',
        tags: ['ترحيب', 'احترافي', 'طبي']
      },
      {
        id: '2',
        name: 'تأكيد الموعد',
        description: 'رسالة تأكيد حجز الموعد مع التفاصيل',
        category: 'appointment',
        language: 'ar',
        content: 'تم تأكيد موعدك في {التاريخ} في الساعة {الوقت} مع د. {اسم الطبيب}',
        variables: ['التاريخ', 'الوقت', 'اسم الطبيب'],
        usage: 2156,
        rating: 4.9,
        isPublic: true,
        createdAt: '2024-01-05T08:00:00Z',
        updatedAt: '2024-01-14T16:45:00Z',
        author: 'فريق التطوير',
        tags: ['موعد', 'تأكيد', 'تفاصيل']
      },
      {
        id: '3',
        name: 'معلومات الخدمات',
        description: 'قائمة بالخدمات الطبية المتاحة',
        category: 'general',
        language: 'ar',
        content: 'نقدم في مركز الهمم: الطب العام، أمراض القلب، الجراحة، طب الأطفال، والطب النفسي',
        variables: [],
        usage: 456,
        rating: 4.5,
        isPublic: true,
        createdAt: '2023-12-20T08:00:00Z',
        updatedAt: '2024-01-12T14:20:00Z',
        author: 'فريق التسويق',
        tags: ['خدمات', 'معلومات', 'طبي']
      }
    ];

    const mockAnalytics: ChatbotAnalytics = {
      totalConversations: 12456,
      activeUsers: 2341,
      averageResponseTime: 2.3,
      satisfactionRate: 4.6,
      topFlows: [
        { name: 'حجز المواعيد الذكي', usage: 2156 },
        { name: 'ترحيب المرضى الجدد', usage: 1247 },
        { name: 'معلومات الخدمات', usage: 456 },
        { name: 'الدعم الفني', usage: 89 }
      ],
      topTemplates: [
        { name: 'تأكيد الموعد', usage: 2156 },
        { name: 'ترحيب بالمرضى', usage: 1247 },
        { name: 'معلومات الخدمات', usage: 456 }
      ],
      deviceBreakdown: [
        { device: 'الهاتف المحمول', percentage: 65 },
        { device: 'الكمبيوتر', percentage: 25 },
        { device: 'التابلت', percentage: 10 }
      ],
      languageBreakdown: [
        { language: 'العربية', percentage: 80 },
        { language: 'الإنجليزية', percentage: 20 }
      ],
      hourlyStats: [
        { hour: 0, conversations: 12 },
        { hour: 1, conversations: 8 },
        { hour: 2, conversations: 5 },
        { hour: 3, conversations: 3 },
        { hour: 4, conversations: 2 },
        { hour: 5, conversations: 4 },
        { hour: 6, conversations: 15 },
        { hour: 7, conversations: 45 },
        { hour: 8, conversations: 89 },
        { hour: 9, conversations: 156 },
        { hour: 10, conversations: 234 },
        { hour: 11, conversations: 298 },
        { hour: 12, conversations: 345 },
        { hour: 13, conversations: 312 },
        { hour: 14, conversations: 267 },
        { hour: 15, conversations: 234 },
        { hour: 16, conversations: 198 },
        { hour: 17, conversations: 156 },
        { hour: 18, conversations: 123 },
        { hour: 19, conversations: 89 },
        { hour: 20, conversations: 67 },
        { hour: 21, conversations: 45 },
        { hour: 22, conversations: 23 },
        { hour: 23, conversations: 15 }
      ],
      dailyStats: [
        { date: '2024-01-01', conversations: 234 },
        { date: '2024-01-02', conversations: 267 },
        { date: '2024-01-03', conversations: 298 },
        { date: '2024-01-04', conversations: 312 },
        { date: '2024-01-05', conversations: 345 },
        { date: '2024-01-06', conversations: 289 },
        { date: '2024-01-07', conversations: 256 },
        { date: '2024-01-08', conversations: 278 },
        { date: '2024-01-09', conversations: 301 },
        { date: '2024-01-10', conversations: 324 },
        { date: '2024-01-11', conversations: 298 },
        { date: '2024-01-12', conversations: 267 },
        { date: '2024-01-13', conversations: 234 },
        { date: '2024-01-14', conversations: 289 },
        { date: '2024-01-15', conversations: 312 }
      ]
    };

    setFlows(mockFlows);
    setTemplates(mockTemplates);
    setAnalytics(mockAnalytics);
    setTotalPages(1);
    setLoading(false);
  }, []);

  const getCurrentData = () => {
    switch (activeTab) {
      case 'flows': return flows;
      case 'templates': return templates;
      default: return [];
    }
  };

  const filteredData = getCurrentData().filter((item: any) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter !== 'all') {
      matchesStatus = item.status === statusFilter;
    }
    
    let matchesType = true;
    if (typeFilter !== 'all') {
      matchesType = item.type === typeFilter || item.category === typeFilter;
    }
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'نشط', variant: 'default' as const, className: 'bg-green-100 text-green-800' },
      inactive: { label: 'غير نشط', variant: 'secondary' as const, className: 'bg-gray-100 text-gray-800' },
      draft: { label: 'مسودة', variant: 'outline' as const, className: 'bg-yellow-100 text-yellow-800' },
      testing: { label: 'اختبار', variant: 'outline' as const, className: 'bg-blue-100 text-blue-800' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || 
                  { label: status, variant: 'outline' as const, className: '' };
    return <Badge variant={config.variant} className={config.className}>{config.label}</Badge>;
  };

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      welcome: { label: 'ترحيب', icon: <MessageCircle className="h-3 w-3" />, className: 'bg-blue-100 text-blue-800' },
      support: { label: 'دعم', icon: <Headphones className="h-3 w-3" />, className: 'bg-green-100 text-green-800' },
      appointment: { label: 'موعد', icon: <Calendar className="h-3 w-3" />, className: 'bg-purple-100 text-purple-800' },
      information: { label: 'معلومات', icon: <FileText className="h-3 w-3" />, className: 'bg-orange-100 text-orange-800' },
      custom: { label: 'مخصص', icon: <Settings className="h-3 w-3" />, className: 'bg-gray-100 text-gray-800' },
      healthcare: { label: 'رعاية صحية', icon: <Activity className="h-3 w-3" />, className: 'bg-red-100 text-red-800' },
      marketing: { label: 'تسويق', icon: <Target className="h-3 w-3" />, className: 'bg-pink-100 text-pink-800' },
      general: { label: 'عام', icon: <Globe className="h-3 w-3" />, className: 'bg-gray-100 text-gray-800' }
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

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'flows': return <Workflow className="h-4 w-4" />;
      case 'templates': return <FileText className="h-4 w-4" />;
      case 'analytics': return <BarChart3 className="h-4 w-4" />;
      case 'integrations': return <Zap className="h-4 w-4" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>جاري تحميل بيانات البوت الذكي...</p>
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
            <h1 className="text-3xl font-bold">إدارة البوت الذكي</h1>
            <p className="text-muted-foreground">
              إدارة التدفقات والقوالب والتحليلات للبوت الذكي
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
              <div className="text-2xl font-bold">{analytics?.totalConversations.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +12% من الشهر الماضي
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">المستخدمون النشطون</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.activeUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                هذا الشهر
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">متوسط وقت الاستجابة</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.averageResponseTime} ثانية</div>
              <p className="text-xs text-muted-foreground">
                -0.3 ثانية من الأسبوع الماضي
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">معدل الرضا</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.satisfactionRate}/5</div>
              <p className="text-xs text-muted-foreground">
                +0.2 من الشهر الماضي
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6">
          {[
            { id: 'flows', label: 'التدفقات', count: flows.length },
            { id: 'templates', label: 'القوالب', count: templates.length },
            { id: 'analytics', label: 'التحليلات', count: 0 },
            { id: 'integrations', label: 'التكاملات', count: 0 }
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'primary' : 'outline'}
              onClick={() => setActiveTab(tab.id as any)}
              className="flex items-center gap-2"
            >
              {getTabIcon(tab.id)}
              {tab.label}
              {tab.count > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {tab.count}
                </Badge>
              )}
            </Button>
          ))}
        </div>

        {/* Analytics Tab */}
        {activeTab === 'analytics' && analytics && (
          <div className="space-y-6">
            {/* Top Flows and Templates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>أكثر التدفقات استخداماً</CardTitle>
                  <CardDescription>التدفقات الأكثر تفاعلاً مع المستخدمين</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.topFlows.map((flow, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground grid place-items-center text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium">{flow.name}</div>
                            <div className="text-sm text-muted-foreground">{flow.usage} استخدام</div>
                          </div>
                        </div>
                        <div className="text-sm font-medium">{flow.usage}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>أكثر القوالب استخداماً</CardTitle>
                  <CardDescription>القوالب الأكثر استخداماً في المحادثات</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.topTemplates.map((template, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground grid place-items-center text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium">{template.name}</div>
                            <div className="text-sm text-muted-foreground">{template.usage} استخدام</div>
                          </div>
                        </div>
                        <div className="text-sm font-medium">{template.usage}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Device and Language Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>توزيع الأجهزة</CardTitle>
                  <CardDescription>نسبة استخدام البوت حسب نوع الجهاز</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.deviceBreakdown.map((device, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {device.device === 'الهاتف المحمول' && <Smartphone className="h-4 w-4" />}
                          {device.device === 'الكمبيوتر' && <Monitor className="h-4 w-4" />}
                          {device.device === 'التابلت' && <Tablet className="h-4 w-4" />}
                          <span className="font-medium">{device.device}</span>
                        </div>
                        <div className="text-sm font-medium">{device.percentage}%</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>توزيع اللغات</CardTitle>
                  <CardDescription>نسبة استخدام البوت حسب اللغة</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.languageBreakdown.map((language, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Globe className="h-4 w-4" />
                          <span className="font-medium">{language.language}</span>
                        </div>
                        <div className="text-sm font-medium">{language.percentage}%</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Daily Stats Chart */}
            <Card>
              <CardHeader>
                <CardTitle>إحصائيات يومية</CardTitle>
                <CardDescription>عدد المحادثات اليومية خلال آخر 15 يوم</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between gap-2">
                  {analytics.dailyStats.map((stat, index) => (
                    <div key={index} className="flex flex-col items-center gap-2">
                      <div 
                        className="bg-primary rounded-t-sm w-8"
                        style={{ height: `${(stat.conversations / Math.max(...analytics.dailyStats.map(s => s.conversations))) * 200}px` }}
                      />
                      <div className="text-xs text-muted-foreground">
                        {new Date(stat.date).getDate()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Flows and Templates Tabs */}
        {(activeTab === 'flows' || activeTab === 'templates') && (
          <>
            {/* Filters */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="البحث في التدفقات أو القوالب..."
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
                        <SelectItem value="inactive">غير نشط</SelectItem>
                        <SelectItem value="draft">مسودة</SelectItem>
                        <SelectItem value="testing">اختبار</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="النوع" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع الأنواع</SelectItem>
                        {activeTab === 'flows' && (
                          <>
                            <SelectItem value="welcome">ترحيب</SelectItem>
                            <SelectItem value="support">دعم</SelectItem>
                            <SelectItem value="appointment">موعد</SelectItem>
                            <SelectItem value="information">معلومات</SelectItem>
                            <SelectItem value="custom">مخصص</SelectItem>
                          </>
                        )}
                        {activeTab === 'templates' && (
                          <>
                            <SelectItem value="healthcare">رعاية صحية</SelectItem>
                            <SelectItem value="appointment">موعد</SelectItem>
                            <SelectItem value="support">دعم</SelectItem>
                            <SelectItem value="marketing">تسويق</SelectItem>
                            <SelectItem value="general">عام</SelectItem>
                          </>
                        )}
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

            {/* Data Table */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>
                      {activeTab === 'flows' && 'التدفقات'}
                      {activeTab === 'templates' && 'القوالب'}
                    </CardTitle>
                    <CardDescription>
                      {activeTab === 'flows' && 'إدارة تدفقات المحادثة والتفاعل'}
                      {activeTab === 'templates' && 'إدارة قوالب الرسائل والردود'}
                    </CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    إضافة {activeTab === 'flows' ? 'تدفق' : 'قالب'}
                  </Button>
                </div>
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
                              setSelectedItems(filteredData.map((item: any) => item.id));
                            } else {
                              setSelectedItems([]);
                            }
                          }}
                        />
                      </TableHead>
                      <TableHead>الاسم</TableHead>
                      <TableHead>النوع</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>الاستخدام</TableHead>
                      <TableHead>آخر تحديث</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <input
                            type="checkbox"
                            className="rounded border-gray-300"
                            checked={selectedItems.includes(item.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedItems([...selectedItems, item.id]);
                              } else {
                                setSelectedItems(selectedItems.filter(id => id !== item.id));
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground grid place-items-center text-sm">
                              <Bot className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="font-medium">{item.name}</div>
                              <div className="text-sm text-muted-foreground">{item.description}</div>
                              {item.tags && (
                                <div className="flex gap-1 mt-1">
                                  {item.tags.slice(0, 2).map((tag: string, index: number) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                  {item.tags.length > 2 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{item.tags.length - 2}
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getTypeBadge(item.type || item.category)}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(item.status)}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {item.interactions || item.usage} استخدام
                          </div>
                          {item.successRate && (
                            <div className="text-xs text-muted-foreground">
                              {item.successRate}% نجاح
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {formatDate(item.updatedAt)}
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
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                عرض
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                تعديل
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Copy className="h-4 w-4 mr-2" />
                                نسخ
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Share className="h-4 w-4 mr-2" />
                                مشاركة
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Play className="h-4 w-4 mr-2" />
                                تشغيل
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Pause className="h-4 w-4 mr-2" />
                                إيقاف
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
                    عرض {filteredData.length} من {getCurrentData().length} عنصر
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
          </>
        )}

        {/* Integrations Tab */}
        {activeTab === 'integrations' && (
          <Card>
            <CardHeader>
              <CardTitle>التكاملات</CardTitle>
              <CardDescription>
                إدارة التكاملات مع الأنظمة الخارجية
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Zap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">التكاملات قريباً</h3>
                <p className="text-muted-foreground">
                  سيتم إضافة إدارة التكاملات في التحديث القادم
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}