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
  FileText,
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
  Activity,
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
  Flag,
  Archive,
  Copy,
  Share,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';

interface Report {
  id: string;
  title: string;
  description: string;
  type: 'financial' | 'medical' | 'operational' | 'compliance' | 'custom';
  category: 'patients' | 'appointments' | 'revenue' | 'performance' | 'audit' | 'analytics';
  status: 'draft' | 'generating' | 'completed' | 'failed' | 'scheduled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  format: 'pdf' | 'excel' | 'csv' | 'json';
  size: number; // in bytes
  createdAt: string;
  updatedAt: string;
  generatedAt?: string;
  generatedBy: string;
  generatedByName: string;
  scheduledAt?: string;
  isRecurring: boolean;
  recurringPattern?: string;
  filters?: {
    dateRange?: { start: string; end: string };
    departments?: string[];
    users?: string[];
    customFilters?: Record<string, any>;
  };
  data?: {
    totalRecords: number;
    summary: Record<string, any>;
    charts?: Array<{
      type: string;
      title: string;
      data: any[];
    }>;
  };
  permissions: string[];
  isPublic: boolean;
  tags?: string[];
  notes?: string;
}

export default function ReportsPage() {
  const { t } = useT();
  const { hasPermission } = usePermissions({ userRole: 'admin' });
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);

  // Mock data
  useEffect(() => {
    const mockReports: Report[] = [
      {
        id: '1',
        title: 'تقرير المرضى الشهري',
        description: 'تقرير شامل عن جميع المرضى المسجلين خلال الشهر الحالي',
        type: 'medical',
        category: 'patients',
        status: 'completed',
        priority: 'high',
        format: 'pdf',
        size: 2048576,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        generatedAt: '2024-01-15T10:05:00Z',
        generatedBy: 'admin1',
        generatedByName: 'أحمد التقني',
        isRecurring: true,
        recurringPattern: 'monthly',
        filters: {
          dateRange: { start: '2024-01-01', end: '2024-01-31' },
          departments: ['therapy', 'medical']
        },
        data: {
          totalRecords: 156,
          summary: {
            totalPatients: 156,
            newPatients: 23,
            activePatients: 142,
            completedTreatments: 89
          }
        },
        permissions: ['reports:view', 'patients:view'],
        isPublic: false,
        tags: ['مرضى', 'شهري', 'طبي'],
        notes: 'تقرير مهم للمتابعة الشهرية'
      },
      {
        id: '2',
        title: 'تقرير الإيرادات المالية',
        description: 'تقرير مفصل عن الإيرادات والمصروفات للربع الأول',
        type: 'financial',
        category: 'revenue',
        status: 'completed',
        priority: 'high',
        format: 'excel',
        size: 1536000,
        createdAt: '2024-01-14T14:30:00Z',
        updatedAt: '2024-01-14T14:30:00Z',
        generatedAt: '2024-01-14T14:35:00Z',
        generatedBy: 'finance1',
        generatedByName: 'سارة المالية',
        isRecurring: true,
        recurringPattern: 'quarterly',
        filters: {
          dateRange: { start: '2024-01-01', end: '2024-03-31' }
        },
        data: {
          totalRecords: 1248,
          summary: {
            totalRevenue: 245000,
            totalExpenses: 180000,
            netProfit: 65000,
            growthRate: 12.5
          }
        },
        permissions: ['reports:view', 'financial:view'],
        isPublic: false,
        tags: ['مالي', 'إيرادات', 'ربعي']
      },
      {
        id: '3',
        title: 'تقرير أداء المواعيد',
        description: 'تحليل أداء المواعيد ومعدلات الحضور والغياب',
        type: 'operational',
        category: 'appointments',
        status: 'generating',
        priority: 'medium',
        format: 'pdf',
        size: 0,
        createdAt: '2024-01-15T09:00:00Z',
        updatedAt: '2024-01-15T09:00:00Z',
        generatedBy: 'admin1',
        generatedByName: 'أحمد التقني',
        isRecurring: false,
        filters: {
          dateRange: { start: '2024-01-01', end: '2024-01-15' }
        },
        permissions: ['reports:view', 'appointments:view'],
        isPublic: false,
        tags: ['مواعيد', 'أداء', 'تشغيلي']
      },
      {
        id: '4',
        title: 'تقرير الامتثال والجودة',
        description: 'تقرير مراجعة الامتثال للمعايير الطبية والجودة',
        type: 'compliance',
        category: 'audit',
        status: 'scheduled',
        priority: 'urgent',
        format: 'pdf',
        size: 0,
        createdAt: '2024-01-15T08:00:00Z',
        updatedAt: '2024-01-15T08:00:00Z',
        generatedBy: 'quality1',
        generatedByName: 'نورا الجودة',
        scheduledAt: '2024-01-20T10:00:00Z',
        isRecurring: true,
        recurringPattern: 'monthly',
        permissions: ['reports:view', 'audit:view'],
        isPublic: false,
        tags: ['امتثال', 'جودة', 'مراجعة']
      },
      {
        id: '5',
        title: 'تقرير تحليلات الذكاء الاصطناعي',
        description: 'تقرير تحليلي عن استخدام الذكاء الاصطناعي في المركز',
        type: 'custom',
        category: 'analytics',
        status: 'draft',
        priority: 'low',
        format: 'json',
        size: 0,
        createdAt: '2024-01-15T11:00:00Z',
        updatedAt: '2024-01-15T11:00:00Z',
        generatedBy: 'ai1',
        generatedByName: 'محمد الذكي',
        isRecurring: false,
        permissions: ['reports:view', 'ai:view'],
        isPublic: false,
        tags: ['ذكاء اصطناعي', 'تحليلات', 'مخصص']
      }
    ];

    setReports(mockReports);
    setTotalPages(Math.ceil(mockReports.length / 10));
    setLoading(false);
  }, []);

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || report.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || report.category === categoryFilter;
    
    return matchesSearch && matchesType && matchesStatus && matchesCategory;
  });

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      financial: { label: 'مالي', variant: 'default' as const, className: 'bg-green-100 text-green-800' },
      medical: { label: 'طبي', variant: 'default' as const, className: 'bg-blue-100 text-blue-800' },
      operational: { label: 'تشغيلي', variant: 'secondary' as const, className: 'bg-purple-100 text-purple-800' },
      compliance: { label: 'امتثال', variant: 'outline' as const, className: 'bg-yellow-100 text-yellow-800' },
      custom: { label: 'مخصص', variant: 'outline' as const, className: 'bg-gray-100 text-gray-800' }
    };
    
    const config = typeConfig[type as keyof typeof typeConfig] || 
                  { label: type, variant: 'outline' as const, className: '' };
    return <Badge variant={config.variant} className={config.className}>{config.label}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: 'مسودة', variant: 'outline' as const, className: 'bg-gray-100 text-gray-800' },
      generating: { label: 'جاري التوليد', variant: 'secondary' as const, className: 'bg-blue-100 text-blue-800' },
      completed: { label: 'مكتمل', variant: 'default' as const, className: 'bg-green-100 text-green-800' },
      failed: { label: 'فشل', variant: 'destructive' as const, className: 'bg-red-100 text-red-800' },
      scheduled: { label: 'مجدول', variant: 'secondary' as const, className: 'bg-yellow-100 text-yellow-800' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || 
                  { label: status, variant: 'outline' as const, className: '' };
    return <Badge variant={config.variant} className={config.className}>{config.label}</Badge>;
  };

  const getCategoryBadge = (category: string) => {
    const categoryConfig = {
      patients: { label: 'مرضى', icon: <Users className="h-3 w-3" />, className: 'bg-blue-100 text-blue-800' },
      appointments: { label: 'مواعيد', icon: <Calendar className="h-3 w-3" />, className: 'bg-green-100 text-green-800' },
      revenue: { label: 'إيرادات', icon: <TrendingUp className="h-3 w-3" />, className: 'bg-green-100 text-green-800' },
      performance: { label: 'أداء', icon: <Activity className="h-3 w-3" />, className: 'bg-purple-100 text-purple-800' },
      audit: { label: 'مراجعة', icon: <Shield className="h-3 w-3" />, className: 'bg-red-100 text-red-800' },
      analytics: { label: 'تحليلات', icon: <BarChart3 className="h-3 w-3" />, className: 'bg-orange-100 text-orange-800' }
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
      urgent: { label: 'عاجل', variant: 'destructive' as const, className: 'bg-red-100 text-red-800' }
    };
    
    const config = priorityConfig[priority as keyof typeof priorityConfig] || 
                  { label: priority, variant: 'outline' as const, className: '' };
    return <Badge variant={config.variant} className={config.className}>{config.label}</Badge>;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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

  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
    setIsReportDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>جاري تحميل التقارير...</p>
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
            <h1 className="text-3xl font-bold">التقارير والإحصائيات</h1>
            <p className="text-muted-foreground">
              إدارة وتوليد التقارير الشاملة للمركز
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              استيراد
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              تقرير جديد
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي التقارير</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reports.length}</div>
              <p className="text-xs text-muted-foreground">
                +5 من الأسبوع الماضي
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">المكتملة</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {reports.filter(r => r.status === 'completed').length}
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.round((reports.filter(r => r.status === 'completed').length / reports.length) * 100)}% من الإجمالي
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">المجدولة</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {reports.filter(r => r.status === 'scheduled').length}
              </div>
              <p className="text-xs text-muted-foreground">
                تقارير مجدولة للتوليد
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">المتكررة</CardTitle>
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {reports.filter(r => r.isRecurring).length}
              </div>
              <p className="text-xs text-muted-foreground">
                تقارير متكررة التوليد
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
                    placeholder="البحث في التقارير..."
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
                    <SelectItem value="financial">مالي</SelectItem>
                    <SelectItem value="medical">طبي</SelectItem>
                    <SelectItem value="operational">تشغيلي</SelectItem>
                    <SelectItem value="compliance">امتثال</SelectItem>
                    <SelectItem value="custom">مخصص</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الحالات</SelectItem>
                    <SelectItem value="draft">مسودة</SelectItem>
                    <SelectItem value="generating">جاري التوليد</SelectItem>
                    <SelectItem value="completed">مكتمل</SelectItem>
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
                    <SelectItem value="patients">مرضى</SelectItem>
                    <SelectItem value="appointments">مواعيد</SelectItem>
                    <SelectItem value="revenue">إيرادات</SelectItem>
                    <SelectItem value="performance">أداء</SelectItem>
                    <SelectItem value="audit">مراجعة</SelectItem>
                    <SelectItem value="analytics">تحليلات</SelectItem>
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

        {/* Reports Table */}
        <Card>
          <CardHeader>
            <CardTitle>قائمة التقارير</CardTitle>
            <CardDescription>
              عرض وإدارة جميع التقارير المولدة والمجدولة
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
                          setSelectedReports(filteredReports.map(r => r.id));
                        } else {
                          setSelectedReports([]);
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>العنوان</TableHead>
                  <TableHead>النوع</TableHead>
                  <TableHead>الفئة</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>الأولوية</TableHead>
                  <TableHead>التنسيق</TableHead>
                  <TableHead>الحجم</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        checked={selectedReports.includes(report.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedReports([...selectedReports, report.id]);
                          } else {
                            setSelectedReports(selectedReports.filter(id => id !== report.id));
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{report.title}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-48">
                          {report.description}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          بواسطة: {report.generatedByName}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getTypeBadge(report.type)}
                    </TableCell>
                    <TableCell>
                      {getCategoryBadge(report.category)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(report.status)}
                    </TableCell>
                    <TableCell>
                      {getPriorityBadge(report.priority)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="uppercase">
                        {report.format}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {report.size > 0 ? formatFileSize(report.size) : '-'}
                      </div>
                      {report.generatedAt && (
                        <div className="text-xs text-muted-foreground">
                          {formatDate(report.generatedAt)}
                        </div>
                      )}
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
                          <DropdownMenuItem onClick={() => handleViewReport(report)}>
                            <Eye className="h-4 w-4 mr-2" />
                            عرض التفاصيل
                          </DropdownMenuItem>
                          {report.status === 'completed' && (
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              تحميل
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            تعديل
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="h-4 w-4 mr-2" />
                            نسخ
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Share className="h-4 w-4 mr-2" />
                            مشاركة
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
                عرض {filteredReports.length} من {reports.length} تقرير
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
                      variant={currentPage === page ? "default" : "outline"}
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

        {/* Report Detail Dialog */}
        <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedReport?.title}
              </DialogTitle>
              <DialogDescription>
                تفاصيل التقرير
              </DialogDescription>
            </DialogHeader>
            
            {selectedReport && (
              <div className="space-y-4">
                {/* Report Info */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                  <div>
                    <div className="text-sm font-medium">النوع</div>
                    <div>{getTypeBadge(selectedReport.type)}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">الفئة</div>
                    <div>{getCategoryBadge(selectedReport.category)}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">الحالة</div>
                    <div>{getStatusBadge(selectedReport.status)}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">الأولوية</div>
                    <div>{getPriorityBadge(selectedReport.priority)}</div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <div className="text-sm font-medium mb-2">الوصف</div>
                  <div className="p-4 bg-muted rounded-lg">
                    {selectedReport.description}
                  </div>
                </div>

                {/* Details */}
                <div>
                  <div className="text-sm font-medium mb-2">التفاصيل</div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>التنسيق: {selectedReport.format.toUpperCase()}</div>
                    <div>الحجم: {selectedReport.size > 0 ? formatFileSize(selectedReport.size) : 'غير محدد'}</div>
                    <div>المولدة بواسطة: {selectedReport.generatedByName}</div>
                    <div>تاريخ الإنشاء: {formatDate(selectedReport.createdAt)}</div>
                    {selectedReport.generatedAt && (
                      <div>تاريخ التوليد: {formatDate(selectedReport.generatedAt)}</div>
                    )}
                    {selectedReport.scheduledAt && (
                      <div>مجدول لـ: {formatDate(selectedReport.scheduledAt)}</div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => setIsReportDialogOpen(false)}>
                    إغلاق
                  </Button>
                  {selectedReport.status === 'completed' && (
                    <Button>
                      <Download className="h-4 w-4 mr-2" />
                      تحميل
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
