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
  Activity,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  User,
  Users,
  Settings,
  Shield,
  TrendingUp,
  BarChart3,
  PieChart,
  Target,
  Zap,
  Globe,
  Database,
  Mail,
  Phone,
  Smile,
  Frown,
  Meh,
  Heart,
  Star,
  Bell,
  Flag,
  Archive,
  Copy,
  Share,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Award,
  Trophy,
  Medal,
  Crown,
  Flame,
  Zap as Thunder,
  Rocket,
  Gauge,
  Gauge as Speedometer,
  Timer,
  Timer as Stopwatch,
  Play,
  Pause,
  Square,
  RotateCcw,
  RotateCw,
  SkipForward,
  SkipBack,
  FastForward,
  Rewind,
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
  SignalZero,
  SignalLow,
  SignalMedium,
  SignalHigh,
  Battery,
  BatteryLow,
  BatteryMedium,
  Battery as BatteryHigh,
  Cpu,
  HardDrive,
  MemoryStick,
  HardDriveIcon,
  DatabaseIcon,
  Server,
  Cloud,
  CloudOff,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Sun,
  Moon,
  Sunrise,
  Sunset
} from 'lucide-react';

interface PerformanceMetric {
  id: string;
  name: string;
  description: string;
  category: 'system' | 'user' | 'application' | 'database' | 'network' | 'security';
  type: 'response_time' | 'throughput' | 'error_rate' | 'availability' | 'utilization' | 'satisfaction';
  value: number;
  unit: string;
  threshold: {
    warning: number;
    critical: number;
  };
  status: 'excellent' | 'good' | 'warning' | 'critical' | 'unknown';
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
  lastUpdated: string;
  history: Array<{
    timestamp: string;
    value: number;
  }>;
  tags?: string[];
  notes?: string;
}

interface PerformanceAlert {
  id: string;
  metricId: string;
  metricName: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: string;
  isResolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
  action?: string;
}

export default function PerformancePage() {
  const { t } = useT();
  const { hasPermission } = usePermissions({ userRole: 'admin' });
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<PerformanceMetric | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isMetricDialogOpen, setIsMetricDialogOpen] = useState(false);

  // Mock data
  useEffect(() => {
    const mockMetrics: PerformanceMetric[] = [
      {
        id: '1',
        name: 'استجابة النظام',
        description: 'متوسط وقت استجابة النظام للمستخدمين',
        category: 'system',
        type: 'response_time',
        value: 245,
        unit: 'ms',
        threshold: {
          warning: 500,
          critical: 1000
        },
        status: 'excellent',
        trend: 'down',
        changePercent: -12.5,
        lastUpdated: '2024-01-15T14:30:00Z',
        history: [
          { timestamp: '2024-01-15T14:00:00Z', value: 280 },
          { timestamp: '2024-01-15T14:15:00Z', value: 265 },
          { timestamp: '2024-01-15T14:30:00Z', value: 245 }
        ],
        tags: ['نظام', 'استجابة', 'أداء'],
        notes: 'تحسن ملحوظ في الأداء'
      },
      {
        id: '2',
        name: 'معدل الأخطاء',
        description: 'نسبة الأخطاء في النظام',
        category: 'application',
        type: 'error_rate',
        value: 0.2,
        unit: '%',
        threshold: {
          warning: 1.0,
          critical: 5.0
        },
        status: 'excellent',
        trend: 'stable',
        changePercent: 0,
        lastUpdated: '2024-01-15T14:30:00Z',
        history: [
          { timestamp: '2024-01-15T14:00:00Z', value: 0.2 },
          { timestamp: '2024-01-15T14:15:00Z', value: 0.2 },
          { timestamp: '2024-01-15T14:30:00Z', value: 0.2 }
        ],
        tags: ['أخطاء', 'تطبيق', 'جودة']
      },
      {
        id: '3',
        name: 'استخدام قاعدة البيانات',
        description: 'نسبة استخدام موارد قاعدة البيانات',
        category: 'database',
        type: 'utilization',
        value: 78,
        unit: '%',
        threshold: {
          warning: 80,
          critical: 95
        },
        status: 'good',
        trend: 'up',
        changePercent: 5.2,
        lastUpdated: '2024-01-15T14:30:00Z',
        history: [
          { timestamp: '2024-01-15T14:00:00Z', value: 72 },
          { timestamp: '2024-01-15T14:15:00Z', value: 75 },
          { timestamp: '2024-01-15T14:30:00Z', value: 78 }
        ],
        tags: ['قاعدة بيانات', 'استخدام', 'موارد']
      },
      {
        id: '4',
        name: 'رضا المستخدمين',
        description: 'تقييم المستخدمين لخدمات المركز',
        category: 'user',
        type: 'satisfaction',
        value: 4.7,
        unit: '/5',
        threshold: {
          warning: 3.5,
          critical: 2.5
        },
        status: 'excellent',
        trend: 'up',
        changePercent: 8.3,
        lastUpdated: '2024-01-15T14:30:00Z',
        history: [
          { timestamp: '2024-01-15T14:00:00Z', value: 4.3 },
          { timestamp: '2024-01-15T14:15:00Z', value: 4.5 },
          { timestamp: '2024-01-15T14:30:00Z', value: 4.7 }
        ],
        tags: ['رضا', 'مستخدمين', 'تقييم']
      },
      {
        id: '5',
        name: 'توفر النظام',
        description: 'نسبة توفر النظام للعمل',
        category: 'system',
        type: 'availability',
        value: 99.9,
        unit: '%',
        threshold: {
          warning: 99.0,
          critical: 95.0
        },
        status: 'excellent',
        trend: 'stable',
        changePercent: 0,
        lastUpdated: '2024-01-15T14:30:00Z',
        history: [
          { timestamp: '2024-01-15T14:00:00Z', value: 99.9 },
          { timestamp: '2024-01-15T14:15:00Z', value: 99.9 },
          { timestamp: '2024-01-15T14:30:00Z', value: 99.9 }
        ],
        tags: ['توفر', 'نظام', 'استقرار']
      },
      {
        id: '6',
        name: 'استخدام الذاكرة',
        description: 'نسبة استخدام ذاكرة الخادم',
        category: 'system',
        type: 'utilization',
        value: 85,
        unit: '%',
        threshold: {
          warning: 85,
          critical: 95
        },
        status: 'warning',
        trend: 'up',
        changePercent: 12.8,
        lastUpdated: '2024-01-15T14:30:00Z',
        history: [
          { timestamp: '2024-01-15T14:00:00Z', value: 75 },
          { timestamp: '2024-01-15T14:15:00Z', value: 80 },
          { timestamp: '2024-01-15T14:30:00Z', value: 85 }
        ],
        tags: ['ذاكرة', 'نظام', 'موارد']
      }
    ];

    const mockAlerts: PerformanceAlert[] = [
      {
        id: '1',
        metricId: '6',
        metricName: 'استخدام الذاكرة',
        severity: 'medium',
        message: 'استخدام الذاكرة وصل إلى 85% - قريب من الحد التحذيري',
        timestamp: '2024-01-15T14:30:00Z',
        isResolved: false,
        action: 'مراقبة مستمرة'
      },
      {
        id: '2',
        metricId: '3',
        metricName: 'استخدام قاعدة البيانات',
        severity: 'low',
        message: 'استخدام قاعدة البيانات في ازدياد - 78%',
        timestamp: '2024-01-15T14:15:00Z',
        isResolved: true,
        resolvedAt: '2024-01-15T14:20:00Z',
        resolvedBy: 'أحمد التقني',
        action: 'تم تحسين الاستعلامات'
      }
    ];

    setMetrics(mockMetrics);
    setAlerts(mockAlerts);
    setTotalPages(Math.ceil(mockMetrics.length / 10));
    setLoading(false);
  }, []);

  const filteredMetrics = metrics.filter(metric => {
    const matchesSearch = metric.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         metric.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || metric.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || metric.status === statusFilter;
    const matchesType = typeFilter === 'all' || metric.type === typeFilter;

    return matchesSearch && matchesCategory && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      excellent: { label: 'ممتاز', variant: 'default' as const, className: 'bg-green-100 text-green-800' },
      good: { label: 'جيد', variant: 'default' as const, className: 'bg-blue-100 text-blue-800' },
      warning: { label: 'تحذير', variant: 'outline' as const, className: 'bg-yellow-100 text-yellow-800' },
      critical: { label: 'حرج', variant: 'error' as const, className: 'bg-red-100 text-red-800' },
      unknown: { label: 'غير معروف', variant: 'secondary' as const, className: 'bg-gray-100 text-gray-800' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] ||
                  { label: status, variant: 'outline' as const, className: '' };
    return <Badge variant={config.variant} className={config.className}>{config.label}</Badge>;
  };

  const getCategoryBadge = (category: string) => {
    const categoryConfig = {
      system: { label: 'نظام', icon: <Settings className="h-3 w-3" />, className: 'bg-blue-100 text-blue-800' },
      user: { label: 'مستخدم', icon: <User className="h-3 w-3" />, className: 'bg-green-100 text-green-800' },
      application: { label: 'تطبيق', icon: <Monitor className="h-3 w-3" />, className: 'bg-purple-100 text-purple-800' },
      database: { label: 'قاعدة بيانات', icon: <Database className="h-3 w-3" />, className: 'bg-orange-100 text-orange-800' },
      network: { label: 'شبكة', icon: <Wifi className="h-3 w-3" />, className: 'bg-cyan-100 text-cyan-800' },
      security: { label: 'أمان', icon: <Shield className="h-3 w-3" />, className: 'bg-red-100 text-red-800' }
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

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      response_time: { label: 'وقت الاستجابة', icon: <Timer className="h-3 w-3" />, className: 'bg-blue-100 text-blue-800' },
      throughput: { label: 'الإنتاجية', icon: <TrendingUp className="h-3 w-3" />, className: 'bg-green-100 text-green-800' },
      error_rate: { label: 'معدل الأخطاء', icon: <XCircle className="h-3 w-3" />, className: 'bg-red-100 text-red-800' },
      availability: { label: 'التوفر', icon: <CheckCircle className="h-3 w-3" />, className: 'bg-green-100 text-green-800' },
      utilization: { label: 'الاستخدام', icon: <Gauge className="h-3 w-3" />, className: 'bg-orange-100 text-orange-800' },
      satisfaction: { label: 'الرضا', icon: <Smile className="h-3 w-3" />, className: 'bg-yellow-100 text-yellow-800' }
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

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
      case 'stable': return <Activity className="h-4 w-4 text-gray-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    const severityConfig = {
      low: { label: 'منخفض', variant: 'outline' as const, className: 'bg-gray-100 text-gray-800' },
      medium: { label: 'متوسط', variant: 'secondary' as const, className: 'bg-yellow-100 text-yellow-800' },
      high: { label: 'عالي', variant: 'default' as const, className: 'bg-orange-100 text-orange-800' },
      critical: { label: 'حرج', variant: 'error' as const, className: 'bg-red-100 text-red-800' }
    };

    const config = severityConfig[severity as keyof typeof severityConfig] ||
                  { label: severity, variant: 'outline' as const, className: '' };
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

  const handleViewMetric = (metric: PerformanceMetric) => {
    setSelectedMetric(metric);
    setIsMetricDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>جاري تحميل مؤشرات الأداء...</p>
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
            <h1 className="text-3xl font-bold">مراقبة الأداء</h1>
            <p className="text-muted-foreground">
              مراقبة وتحليل أداء النظام والخدمات
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              تصدير
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              مؤشر جديد
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي المؤشرات</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.length}</div>
              <p className="text-xs text-muted-foreground">
                مؤشرات نشطة
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ممتاز</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics.filter(m => m.status === 'excellent').length}
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.round((metrics.filter(m => m.status === 'excellent').length / metrics.length) * 100)}% من الإجمالي
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">تحذيرات</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics.filter(m => m.status === 'warning').length}
              </div>
              <p className="text-xs text-muted-foreground">
                مؤشرات تحتاج انتباه
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">تنبيهات نشطة</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {alerts.filter(a => !a.isResolved).length}
              </div>
              <p className="text-xs text-muted-foreground">
                تنبيهات تحتاج إجراء
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Alerts Section */}
        {alerts.filter(a => !a.isResolved).length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                التنبيهات النشطة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.filter(a => !a.isResolved).map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                      <div>
                        <div className="font-medium">{alert.metricName}</div>
                        <div className="text-sm text-muted-foreground">{alert.message}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getSeverityBadge(alert.severity)}
                      <span className="text-xs text-muted-foreground">
                        {formatTime(alert.timestamp)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="البحث في المؤشرات..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="الفئة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الفئات</SelectItem>
                    <SelectItem value="system">نظام</SelectItem>
                    <SelectItem value="user">مستخدم</SelectItem>
                    <SelectItem value="application">تطبيق</SelectItem>
                    <SelectItem value="database">قاعدة بيانات</SelectItem>
                    <SelectItem value="network">شبكة</SelectItem>
                    <SelectItem value="security">أمان</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الحالات</SelectItem>
                    <SelectItem value="excellent">ممتاز</SelectItem>
                    <SelectItem value="good">جيد</SelectItem>
                    <SelectItem value="warning">تحذير</SelectItem>
                    <SelectItem value="critical">حرج</SelectItem>
                    <SelectItem value="unknown">غير معروف</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="النوع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الأنواع</SelectItem>
                    <SelectItem value="response_time">وقت الاستجابة</SelectItem>
                    <SelectItem value="throughput">الإنتاجية</SelectItem>
                    <SelectItem value="error_rate">معدل الأخطاء</SelectItem>
                    <SelectItem value="availability">التوفر</SelectItem>
                    <SelectItem value="utilization">الاستخدام</SelectItem>
                    <SelectItem value="satisfaction">الرضا</SelectItem>
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

        {/* Metrics Table */}
        <Card>
          <CardHeader>
            <CardTitle>مؤشرات الأداء</CardTitle>
            <CardDescription>
              عرض ومراقبة جميع مؤشرات أداء النظام
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
                          setSelectedMetrics(filteredMetrics.map(m => m.id));
                        } else {
                          setSelectedMetrics([]);
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>المؤشر</TableHead>
                  <TableHead>الفئة</TableHead>
                  <TableHead>النوع</TableHead>
                  <TableHead>القيمة</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>الاتجاه</TableHead>
                  <TableHead>آخر تحديث</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMetrics.map((metric) => (
                  <TableRow key={metric.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        checked={selectedMetrics.includes(metric.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedMetrics([...selectedMetrics, metric.id]);
                          } else {
                            setSelectedMetrics(selectedMetrics.filter(id => id !== metric.id));
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{metric.name}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-48">
                          {metric.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getCategoryBadge(metric.category)}
                    </TableCell>
                    <TableCell>
                      {getTypeBadge(metric.type)}
                    </TableCell>
                    <TableCell>
                      <div className="text-lg font-bold">
                        {metric.value} {metric.unit}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        تحذير: {metric.threshold.warning}{metric.unit}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(metric.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTrendIcon(metric.trend)}
                        <span className={`text-sm ${metric.changePercent > 0 ? 'text-red-500' : metric.changePercent < 0 ? 'text-green-500' : 'text-gray-500'}`}>
                          {metric.changePercent > 0 ? '+' : ''}{metric.changePercent}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {formatTime(metric.lastUpdated)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(metric.lastUpdated)}
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
                          <DropdownMenuItem onClick={() => handleViewMetric(metric)}>
                            <Eye className="h-4 w-4 mr-2" />
                            عرض التفاصيل
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            تعديل
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <BarChart3 className="h-4 w-4 mr-2" />
                            عرض الرسم البياني
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            تصدير البيانات
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            تحديث
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
                عرض {filteredMetrics.length} من {metrics.length} مؤشر
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

        {/* Metric Detail Dialog */}
        <Dialog open={isMetricDialogOpen} onOpenChange={setIsMetricDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedMetric?.name}
              </DialogTitle>
              <DialogDescription>
                تفاصيل مؤشر الأداء
              </DialogDescription>
            </DialogHeader>

            {selectedMetric && (
              <div className="space-y-4">
                {/* Metric Info */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                  <div>
                    <div className="text-sm font-medium">الفئة</div>
                    <div>{getCategoryBadge(selectedMetric.category)}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">النوع</div>
                    <div>{getTypeBadge(selectedMetric.type)}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">الحالة</div>
                    <div>{getStatusBadge(selectedMetric.status)}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">الاتجاه</div>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(selectedMetric.trend)}
                      <span className="text-sm">{selectedMetric.changePercent}%</span>
                    </div>
                  </div>
                </div>

                {/* Current Value */}
                <div>
                  <div className="text-sm font-medium mb-2">القيمة الحالية</div>
                  <div className="text-3xl font-bold">
                    {selectedMetric.value} {selectedMetric.unit}
                  </div>
                </div>

                {/* Thresholds */}
                <div>
                  <div className="text-sm font-medium mb-2">الحدود</div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>تحذير: {selectedMetric.threshold.warning}{selectedMetric.unit}</div>
                    <div>حرج: {selectedMetric.threshold.critical}{selectedMetric.unit}</div>
                  </div>
                </div>

                {/* History */}
                <div>
                  <div className="text-sm font-medium mb-2">التاريخ</div>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {selectedMetric.history.map((entry, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{formatTime(entry.timestamp)}</span>
                        <span>{entry.value} {selectedMetric.unit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => setIsMetricDialogOpen(false)}>
                    إغلاق
                  </Button>
                  <Button>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    عرض الرسم البياني
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
