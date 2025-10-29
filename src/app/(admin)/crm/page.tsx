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
  Building2,
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
  Star,
  Clock,
  Users,
  Activity,
  Download,
  Upload,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Target,
  TrendingUp,
  PieChart,
  BarChart3,
  DollarSign,
  UserCheck,
  UserX,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock3,
  MapPin,
  FileText,
  MessageSquare,
  CalendarDays
} from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  value: number;
  probability: number;
  expectedCloseDate: string;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  lastActivity: string;
  notes?: string;
  tags?: string[];
  address?: string;
  industry?: string;
  position?: string;
  website?: string;
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
}

interface Contact {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone: string;
  position?: string;
  status: 'active' | 'inactive' | 'unsubscribed';
  source: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  lastActivity: string;
  notes?: string;
  address?: string;
  industry?: string;
  website?: string;
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
}

interface Deal {
  id: string;
  title: string;
  contactId: string;
  contactName: string;
  value: number;
  stage: 'lead' | 'qualification' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  probability: number;
  expectedCloseDate: string;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  lastActivity: string;
  notes?: string;
  tags?: string[];
  source?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export default function CRMPage() {
  const { t } = useT();
  const { hasPermission } = usePermissions({ userRole: 'admin' });
  const [activeTab, setActiveTab] = useState<'leads' | 'contacts' | 'deals'>('leads');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Mock data
  useEffect(() => {
    const mockLeads: Lead[] = [
      {
        id: '1',
        name: 'أحمد محمد العلي',
        company: 'شركة التقنية المتقدمة',
        email: 'ahmed.ali@tech.com',
        phone: '+966501234567',
        source: 'الموقع الإلكتروني',
        status: 'new',
        priority: 'high',
        value: 50000,
        probability: 75,
        expectedCloseDate: '2024-02-15',
        assignedTo: 'فريق المبيعات',
        createdAt: '2024-01-10T08:00:00Z',
        updatedAt: '2024-01-10T08:00:00Z',
        lastActivity: '2024-01-15T10:30:00Z',
        notes: 'عميل محتمل مهتم بخدمات الرعاية الصحية',
        tags: ['رعاية صحية', 'شركة كبيرة'],
        address: 'الرياض، حي النخيل',
        industry: 'التقنية',
        position: 'مدير المشتريات',
        website: 'www.tech.com',
        socialMedia: {
          linkedin: 'linkedin.com/in/ahmed-ali',
          twitter: '@ahmed_ali'
        }
      },
      {
        id: '2',
        name: 'فاطمة أحمد السعد',
        company: 'مستشفى الأمل',
        email: 'fatima.saad@hope.com',
        phone: '+966502345678',
        source: 'الإحالة',
        status: 'qualified',
        priority: 'urgent',
        value: 75000,
        probability: 90,
        expectedCloseDate: '2024-01-30',
        assignedTo: 'فريق المبيعات',
        createdAt: '2024-01-05T08:00:00Z',
        updatedAt: '2024-01-12T14:20:00Z',
        lastActivity: '2024-01-14T09:15:00Z',
        notes: 'مستشفى كبير يحتاج نظام إدارة شامل',
        tags: ['مستشفى', 'نظام شامل', 'عاجل'],
        address: 'جدة، حي الروضة',
        industry: 'الرعاية الصحية',
        position: 'مدير تقنية المعلومات',
        website: 'www.hope.com'
      },
      {
        id: '3',
        name: 'محمد عبدالله القحطاني',
        company: 'عيادة الأسنان الحديثة',
        email: 'mohammed.qhtani@dental.com',
        phone: '+966503456789',
        source: 'المعرض التجاري',
        status: 'proposal',
        priority: 'medium',
        value: 25000,
        probability: 60,
        expectedCloseDate: '2024-02-28',
        assignedTo: 'فريق المبيعات',
        createdAt: '2024-01-08T08:00:00Z',
        updatedAt: '2024-01-13T16:45:00Z',
        lastActivity: '2024-01-13T16:45:00Z',
        notes: 'عيادة صغيرة تحتاج نظام مواعيد',
        tags: ['عيادة', 'نظام مواعيد'],
        address: 'الدمام، حي الفيصلية',
        industry: 'طب الأسنان',
        position: 'مالك العيادة',
        website: 'www.dental.com'
      }
    ];

    const mockContacts: Contact[] = [
      {
        id: '1',
        name: 'نورا سعد المطيري',
        company: 'مركز الرعاية المتخصصة',
        email: 'nora.mutairi@care.com',
        phone: '+966504567890',
        position: 'مدير العمليات',
        status: 'active',
        source: 'الموقع الإلكتروني',
        tags: ['رعاية صحية', 'عميل نشط'],
        createdAt: '2023-12-15T08:00:00Z',
        updatedAt: '2024-01-10T11:30:00Z',
        lastActivity: '2024-01-10T11:30:00Z',
        notes: 'عميل راضي عن الخدمات',
        address: 'الرياض، حي العليا',
        industry: 'الرعاية الصحية',
        website: 'www.care.com'
      },
      {
        id: '2',
        name: 'خالد فيصل الشمري',
        company: 'مستشفى الشفاء',
        email: 'khalid.shamri@healing.com',
        phone: '+966505678901',
        position: 'مدير تقنية المعلومات',
        status: 'active',
        source: 'الإحالة',
        tags: ['مستشفى', 'تقنية'],
        createdAt: '2023-11-20T08:00:00Z',
        updatedAt: '2024-01-08T14:20:00Z',
        lastActivity: '2024-01-08T14:20:00Z',
        notes: 'عميل مهم يحتاج متابعة دورية',
        address: 'الطائف، حي الشهداء',
        industry: 'الرعاية الصحية',
        website: 'www.healing.com'
      }
    ];

    const mockDeals: Deal[] = [
      {
        id: '1',
        title: 'نظام إدارة المستشفى الشامل',
        contactId: '1',
        contactName: 'نورا سعد المطيري',
        value: 100000,
        stage: 'negotiation',
        probability: 80,
        expectedCloseDate: '2024-02-15',
        assignedTo: 'فريق المبيعات',
        createdAt: '2024-01-01T08:00:00Z',
        updatedAt: '2024-01-14T10:30:00Z',
        lastActivity: '2024-01-14T10:30:00Z',
        notes: 'صفقة كبيرة تحتاج موافقة الإدارة',
        tags: ['نظام شامل', 'مستشفى'],
        source: 'الموقع الإلكتروني',
        priority: 'high'
      },
      {
        id: '2',
        title: 'نظام المواعيد الذكي',
        contactId: '2',
        contactName: 'خالد فيصل الشمري',
        value: 30000,
        stage: 'proposal',
        probability: 70,
        expectedCloseDate: '2024-01-25',
        assignedTo: 'فريق المبيعات',
        createdAt: '2024-01-05T08:00:00Z',
        updatedAt: '2024-01-12T16:45:00Z',
        lastActivity: '2024-01-12T16:45:00Z',
        notes: 'نظام مواعيد متقدم مع تكامل AI',
        tags: ['مواعيد', 'ذكي', 'AI'],
        source: 'الإحالة',
        priority: 'medium'
      }
    ];

    setLeads(mockLeads);
    setContacts(mockContacts);
    setDeals(mockDeals);
    setTotalPages(1);
    setLoading(false);
  }, []);

  const getCurrentData = () => {
    switch (activeTab) {
      case 'leads': return leads;
      case 'contacts': return contacts;
      case 'deals': return deals;
      default: return [];
    }
  };

  const filteredData = getCurrentData().filter((item: any) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.company && item.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         item.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter !== 'all') {
      matchesStatus = item.status === statusFilter || item.stage === statusFilter;
    }
    
    let matchesPriority = true;
    if (priorityFilter !== 'all') {
      matchesPriority = item.priority === priorityFilter;
    }
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusBadge = (status: string, type: 'lead' | 'contact' | 'deal' = 'lead') => {
    const statusConfigs = {
      lead: {
        new: { label: 'جديد', variant: 'outline' as const, className: 'bg-blue-100 text-blue-800' },
        contacted: { label: 'تم الاتصال', variant: 'secondary' as const, className: 'bg-yellow-100 text-yellow-800' },
        qualified: { label: 'مؤهل', variant: 'default' as const, className: 'bg-green-100 text-green-800' },
        proposal: { label: 'عرض', variant: 'secondary' as const, className: 'bg-purple-100 text-purple-800' },
        negotiation: { label: 'تفاوض', variant: 'outline' as const, className: 'bg-orange-100 text-orange-800' },
        closed_won: { label: 'مكتمل', variant: 'default' as const, className: 'bg-green-100 text-green-800' },
        closed_lost: { label: 'مرفوض', variant: 'error' as const, className: 'bg-red-100 text-red-800' }
      },
      contact: {
        active: { label: 'نشط', variant: 'default' as const, className: 'bg-green-100 text-green-800' },
        inactive: { label: 'غير نشط', variant: 'secondary' as const, className: 'bg-gray-100 text-gray-800' },
        unsubscribed: { label: 'ملغي الاشتراك', variant: 'error' as const, className: 'bg-red-100 text-red-800' }
      },
      deal: {
        lead: { label: 'عميل محتمل', variant: 'outline' as const, className: 'bg-blue-100 text-blue-800' },
        qualification: { label: 'تأهيل', variant: 'secondary' as const, className: 'bg-yellow-100 text-yellow-800' },
        proposal: { label: 'عرض', variant: 'secondary' as const, className: 'bg-purple-100 text-purple-800' },
        negotiation: { label: 'تفاوض', variant: 'outline' as const, className: 'bg-orange-100 text-orange-800' },
        closed_won: { label: 'مكتمل', variant: 'default' as const, className: 'bg-green-100 text-green-800' },
        closed_lost: { label: 'مرفوض', variant: 'error' as const, className: 'bg-red-100 text-red-800' }
      }
    };
    
    const config = (statusConfigs as any)[type]?.[status] ||
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR'
    }).format(amount);
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'leads': return <Target className="h-4 w-4" />;
      case 'contacts': return <Users className="h-4 w-4" />;
      case 'deals': return <TrendingUp className="h-4 w-4" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>جاري تحميل بيانات CRM...</p>
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
            <h1 className="text-3xl font-bold">إدارة العملاء (CRM)</h1>
            <p className="text-muted-foreground">
              إدارة العملاء المحتملين والجهات والصفقات
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
              <CardTitle className="text-sm font-medium">العملاء المحتملين</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{leads.length}</div>
              <p className="text-xs text-muted-foreground">
                {leads.filter(l => l.status === 'new').length} جديد
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">جهات الاتصال</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{contacts.length}</div>
              <p className="text-xs text-muted-foreground">
                {contacts.filter(c => c.status === 'active').length} نشط
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الصفقات</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{deals.length}</div>
              <p className="text-xs text-muted-foreground">
                {deals.filter(d => d.stage === 'closed_won').length} مكتملة
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي القيمة</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(deals.reduce((sum, deal) => sum + deal.value, 0))}
              </div>
              <p className="text-xs text-muted-foreground">
                قيمة الصفقات
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6">
          {[
            { id: 'leads', label: 'العملاء المحتملين', count: leads.length },
            { id: 'contacts', label: 'جهات الاتصال', count: contacts.length },
            { id: 'deals', label: 'الصفقات', count: deals.length }
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'outline'}
              onClick={() => setActiveTab(tab.id as any)}
              className="flex items-center gap-2"
            >
              {getTabIcon(tab.id)}
              {tab.label}
              <Badge variant="secondary" className="ml-2">
                {tab.count}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="البحث بالاسم أو الشركة..."
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
                    {activeTab === 'leads' && (
                      <>
                        <SelectItem value="new">جديد</SelectItem>
                        <SelectItem value="contacted">تم الاتصال</SelectItem>
                        <SelectItem value="qualified">مؤهل</SelectItem>
                        <SelectItem value="proposal">عرض</SelectItem>
                        <SelectItem value="negotiation">تفاوض</SelectItem>
                        <SelectItem value="closed_won">مكتمل</SelectItem>
                        <SelectItem value="closed_lost">مرفوض</SelectItem>
                      </>
                    )}
                    {activeTab === 'contacts' && (
                      <>
                        <SelectItem value="active">نشط</SelectItem>
                        <SelectItem value="inactive">غير نشط</SelectItem>
                        <SelectItem value="unsubscribed">ملغي الاشتراك</SelectItem>
                      </>
                    )}
                    {activeTab === 'deals' && (
                      <>
                        <SelectItem value="lead">عميل محتمل</SelectItem>
                        <SelectItem value="qualification">تأهيل</SelectItem>
                        <SelectItem value="proposal">عرض</SelectItem>
                        <SelectItem value="negotiation">تفاوض</SelectItem>
                        <SelectItem value="closed_won">مكتمل</SelectItem>
                        <SelectItem value="closed_lost">مرفوض</SelectItem>
                      </>
                    )}
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
                  {activeTab === 'leads' && 'العملاء المحتملين'}
                  {activeTab === 'contacts' && 'جهات الاتصال'}
                  {activeTab === 'deals' && 'الصفقات'}
                </CardTitle>
                <CardDescription>
                  {activeTab === 'leads' && 'إدارة العملاء المحتملين والفرص'}
                  {activeTab === 'contacts' && 'إدارة جهات الاتصال والعملاء'}
                  {activeTab === 'deals' && 'إدارة الصفقات والمبيعات'}
                </CardDescription>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                إضافة {activeTab === 'leads' ? 'عميل محتمل' : activeTab === 'contacts' ? 'جهة اتصال' : 'صفقة'}
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
                  <TableHead>الشركة</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>الأولوية</TableHead>
                  {activeTab === 'leads' && <TableHead>القيمة</TableHead>}
                  {activeTab === 'deals' && <TableHead>القيمة</TableHead>}
                  <TableHead>آخر نشاط</TableHead>
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
                          {item.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {item.phone}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.company || '-'}</div>
                        <div className="text-xs text-muted-foreground">{item.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(item.status || item.stage, activeTab as any)}
                    </TableCell>
                    <TableCell>
                      {getPriorityBadge(item.priority)}
                    </TableCell>
                    {(activeTab === 'leads' || activeTab === 'deals') && (
                      <TableCell>
                        <div className="text-sm font-medium">
                          {formatCurrency(item.value)}
                        </div>
                        {activeTab === 'leads' && (
                          <div className="text-xs text-muted-foreground">
                            {item.probability}% احتمال
                          </div>
                        )}
                      </TableCell>
                    )}
                    <TableCell>
                      <div className="text-sm">
                        {formatDate(item.lastActivity)}
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
                            عرض التفاصيل
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            تعديل
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Phone className="h-4 w-4 mr-2" />
                            اتصال
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
                            إرسال رسالة
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Calendar className="h-4 w-4 mr-2" />
                            جدولة موعد
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
      </div>
    </div>
  );
}