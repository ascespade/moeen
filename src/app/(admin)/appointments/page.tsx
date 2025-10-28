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
  Calendar,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Phone,
  Mail,
  Clock,
  User,
  Stethoscope,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  Upload,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  MapPin,
  FileText,
  Video,
  PhoneCall
} from 'lucide-react';

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialization: string;
  date: string;
  time: string;
  duration: number; // in minutes
  type: 'in_person' | 'video' | 'phone';
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  reason: string;
  notes?: string;
  diagnosis?: string;
  prescription?: string[];
  followUpDate?: string;
  createdAt: string;
  updatedAt: string;
  location?: string;
  room?: string;
}

export default function AppointmentsPage() {
  const { t } = useT();
  const { hasPermission } = usePermissions({ userRole: 'admin' });
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedAppointments, setSelectedAppointments] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Mock data
  useEffect(() => {
    const mockAppointments: Appointment[] = [
      {
        id: '1',
        patientId: '1',
        patientName: 'أحمد محمد العلي',
        patientPhone: '+966501234567',
        doctorId: '1',
        doctorName: 'د. أحمد محمد العلي',
        doctorSpecialization: 'الطب العام',
        date: '2024-01-16',
        time: '10:00',
        duration: 30,
        type: 'in_person',
        status: 'scheduled',
        reason: 'فحص دوري',
        notes: 'مريض يعاني من ارتفاع ضغط الدم',
        createdAt: '2024-01-10T08:00:00Z',
        updatedAt: '2024-01-10T08:00:00Z',
        location: 'العيادة الرئيسية',
        room: 'A101'
      },
      {
        id: '2',
        patientId: '2',
        patientName: 'فاطمة أحمد السعد',
        patientPhone: '+966502345678',
        doctorId: '2',
        doctorName: 'د. فاطمة أحمد السعد',
        doctorSpecialization: 'أمراض القلب',
        date: '2024-01-16',
        time: '11:30',
        duration: 45,
        type: 'video',
        status: 'confirmed',
        reason: 'متابعة حالة القلب',
        notes: 'مريضة تعاني من عدم انتظام ضربات القلب',
        createdAt: '2024-01-12T10:30:00Z',
        updatedAt: '2024-01-12T10:30:00Z'
      },
      {
        id: '3',
        patientId: '3',
        patientName: 'محمد عبدالله القحطاني',
        patientPhone: '+966503456789',
        doctorId: '3',
        doctorName: 'د. محمد عبدالله القحطاني',
        doctorSpecialization: 'الجراحة العامة',
        date: '2024-01-15',
        time: '14:00',
        duration: 60,
        type: 'in_person',
        status: 'completed',
        reason: 'استشارة جراحية',
        notes: 'مريض يحتاج عملية استئصال المرارة',
        diagnosis: 'حصوات في المرارة',
        prescription: ['مسكنات الألم', 'مضادات الالتهاب'],
        followUpDate: '2024-01-22',
        createdAt: '2024-01-08T14:20:00Z',
        updatedAt: '2024-01-15T15:00:00Z',
        location: 'العيادة الرئيسية',
        room: 'B202'
      },
      {
        id: '4',
        patientId: '4',
        patientName: 'نورا سعد المطيري',
        patientPhone: '+966504567890',
        doctorId: '4',
        doctorName: 'د. نورا سعد المطيري',
        doctorSpecialization: 'طب الأطفال',
        date: '2024-01-15',
        time: '09:00',
        duration: 30,
        type: 'phone',
        status: 'cancelled',
        reason: 'استشارة طبية للأطفال',
        notes: 'مريضة صغيرة تعاني من ارتفاع في درجة الحرارة',
        createdAt: '2024-01-13T16:45:00Z',
        updatedAt: '2024-01-15T08:30:00Z'
      },
      {
        id: '5',
        patientId: '5',
        patientName: 'خالد فيصل الشمري',
        patientPhone: '+966505678901',
        doctorId: '5',
        doctorName: 'د. خالد فيصل الشمري',
        doctorSpecialization: 'الطب النفسي',
        date: '2024-01-17',
        time: '16:00',
        duration: 50,
        type: 'video',
        status: 'scheduled',
        reason: 'جلسة علاج نفسي',
        notes: 'مريض يعاني من القلق والاكتئاب',
        createdAt: '2024-01-14T11:30:00Z',
        updatedAt: '2024-01-14T11:30:00Z'
      },
      {
        id: '6',
        patientId: '1',
        patientName: 'أحمد محمد العلي',
        patientPhone: '+966501234567',
        doctorId: '2',
        doctorName: 'د. فاطمة أحمد السعد',
        doctorSpecialization: 'أمراض القلب',
        date: '2024-01-14',
        time: '13:30',
        duration: 40,
        type: 'in_person',
        status: 'no_show',
        reason: 'فحص القلب',
        notes: 'مريض لم يحضر الموعد',
        createdAt: '2024-01-09T09:15:00Z',
        updatedAt: '2024-01-14T13:45:00Z',
        location: 'العيادة الرئيسية',
        room: 'A102'
      }
    ];

    setAppointments(mockAppointments);
    setTotalPages(Math.ceil(mockAppointments.length / 10));
    setLoading(false);
  }, []);

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    const matchesType = typeFilter === 'all' || appointment.type === typeFilter;
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const appointmentDate = new Date(appointment.date);
      const today = new Date();
      
      switch (dateFilter) {
        case 'today':
          matchesDate = appointmentDate.toDateString() === today.toDateString();
          break;
        case 'tomorrow':
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          matchesDate = appointmentDate.toDateString() === tomorrow.toDateString();
          break;
        case 'this_week':
          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - today.getDay());
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);
          matchesDate = appointmentDate >= weekStart && appointmentDate <= weekEnd;
          break;
        case 'this_month':
          matchesDate = appointmentDate.getMonth() === today.getMonth() && 
                       appointmentDate.getFullYear() === today.getFullYear();
          break;
      }
    }
    
    return matchesSearch && matchesStatus && matchesType && matchesDate;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: { label: 'مجدول', variant: 'outline' as const, className: 'bg-blue-100 text-blue-800' },
      confirmed: { label: 'مؤكد', variant: 'default' as const, className: 'bg-green-100 text-green-800' },
      in_progress: { label: 'جاري', variant: 'secondary' as const, className: 'bg-yellow-100 text-yellow-800' },
      completed: { label: 'مكتمل', variant: 'default' as const, className: 'bg-green-100 text-green-800' },
      cancelled: { label: 'ملغي', variant: 'destructive' as const, className: 'bg-red-100 text-red-800' },
      no_show: { label: 'لم يحضر', variant: 'destructive' as const, className: 'bg-gray-100 text-gray-800' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, variant: 'outline' as const, className: '' };
    return <Badge variant={config.variant} className={config.className}>{config.label}</Badge>;
  };

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      in_person: { label: 'حضوري', icon: <MapPin className="h-3 w-3" />, className: 'bg-blue-100 text-blue-800' },
      video: { label: 'فيديو', icon: <Video className="h-3 w-3" />, className: 'bg-green-100 text-green-800' },
      phone: { label: 'هاتفي', icon: <PhoneCall className="h-3 w-3" />, className: 'bg-purple-100 text-purple-800' }
    };
    
    const config = typeConfig[type as keyof typeof typeConfig] || { label: type, icon: null, className: '' };
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

  const formatTime = (timeString: string) => {
    return timeString;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_progress': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'cancelled': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'no_show': return <AlertTriangle className="h-4 w-4 text-gray-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>جاري تحميل المواعيد...</p>
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
            <h1 className="text-3xl font-bold">إدارة المواعيد</h1>
            <p className="text-muted-foreground">
              إدارة وحجز مواعيد المرضى مع الأطباء
            </p>
          </div>
          <div className="flex items-center gap-4">
            {hasPermission('appointments:create') && (
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    حجز موعد
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>حجز موعد جديد</DialogTitle>
                    <DialogDescription>
                      قم بملء البيانات المطلوبة لحجز موعد جديد
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">المريض</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر المريض" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">أحمد محمد العلي</SelectItem>
                            <SelectItem value="2">فاطمة أحمد السعد</SelectItem>
                            <SelectItem value="3">محمد عبدالله القحطاني</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">الطبيب</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر الطبيب" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">د. أحمد محمد العلي - الطب العام</SelectItem>
                            <SelectItem value="2">د. فاطمة أحمد السعد - أمراض القلب</SelectItem>
                            <SelectItem value="3">د. محمد عبدالله القحطاني - الجراحة العامة</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">التاريخ</label>
                        <Input type="date" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">الوقت</label>
                        <Input type="time" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">نوع الموعد</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر النوع" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="in_person">حضوري</SelectItem>
                            <SelectItem value="video">فيديو</SelectItem>
                            <SelectItem value="phone">هاتفي</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">المدة (دقيقة)</label>
                        <Input type="number" placeholder="30" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">سبب الموعد</label>
                      <Input placeholder="مثال: فحص دوري" />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                        إلغاء
                      </Button>
                      <Button onClick={() => setIsCreateDialogOpen(false)}>
                        حجز الموعد
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              تصدير
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي المواعيد</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{appointments.length}</div>
              <p className="text-xs text-muted-foreground">
                +8 من الأسبوع الماضي
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">اليوم</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {appointments.filter(a => {
                  const appointmentDate = new Date(a.date);
                  const today = new Date();
                  return appointmentDate.toDateString() === today.toDateString();
                }).length}
              </div>
              <p className="text-xs text-muted-foreground">
                مواعيد مجدولة
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">مكتملة</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {appointments.filter(a => a.status === 'completed').length}
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.round((appointments.filter(a => a.status === 'completed').length / appointments.length) * 100)}% من الإجمالي
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ملغية</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {appointments.filter(a => a.status === 'cancelled' || a.status === 'no_show').length}
              </div>
              <p className="text-xs text-muted-foreground">
                مواعيد ملغية أو لم يحضر
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
                    placeholder="البحث بالاسم أو السبب..."
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
                    <SelectItem value="scheduled">مجدول</SelectItem>
                    <SelectItem value="confirmed">مؤكد</SelectItem>
                    <SelectItem value="in_progress">جاري</SelectItem>
                    <SelectItem value="completed">مكتمل</SelectItem>
                    <SelectItem value="cancelled">ملغي</SelectItem>
                    <SelectItem value="no_show">لم يحضر</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="النوع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الأنواع</SelectItem>
                    <SelectItem value="in_person">حضوري</SelectItem>
                    <SelectItem value="video">فيديو</SelectItem>
                    <SelectItem value="phone">هاتفي</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="التاريخ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع التواريخ</SelectItem>
                    <SelectItem value="today">اليوم</SelectItem>
                    <SelectItem value="tomorrow">غداً</SelectItem>
                    <SelectItem value="this_week">هذا الأسبوع</SelectItem>
                    <SelectItem value="this_month">هذا الشهر</SelectItem>
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

        {/* Appointments Table */}
        <Card>
          <CardHeader>
            <CardTitle>قائمة المواعيد</CardTitle>
            <CardDescription>
              عرض وإدارة جميع مواعيد المركز
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
                          setSelectedAppointments(filteredAppointments.map(a => a.id));
                        } else {
                          setSelectedAppointments([]);
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>المريض</TableHead>
                  <TableHead>الطبيب</TableHead>
                  <TableHead>التاريخ والوقت</TableHead>
                  <TableHead>النوع</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>السبب</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        checked={selectedAppointments.includes(appointment.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedAppointments([...selectedAppointments, appointment.id]);
                          } else {
                            setSelectedAppointments(selectedAppointments.filter(id => id !== appointment.id));
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground grid place-items-center text-sm">
                          {appointment.patientName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium">{appointment.patientName}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {appointment.patientPhone}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{appointment.doctorName}</div>
                        <div className="text-xs text-muted-foreground">{appointment.doctorSpecialization}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{formatDate(appointment.date)}</div>
                        <div className="text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTime(appointment.time)} ({appointment.duration} دقيقة)
                        </div>
                        {appointment.location && (
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {appointment.location} - {appointment.room}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getTypeBadge(appointment.type)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(appointment.status)}
                        {getStatusBadge(appointment.status)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {appointment.reason}
                      </div>
                      {appointment.notes && (
                        <div className="text-xs text-muted-foreground truncate max-w-32">
                          {appointment.notes}
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
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            عرض التفاصيل
                          </DropdownMenuItem>
                          {hasPermission('appointments:edit') && (
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              تعديل
                            </DropdownMenuItem>
                          )}
                          {appointment.status === 'scheduled' && (
                            <DropdownMenuItem>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              تأكيد الموعد
                            </DropdownMenuItem>
                          )}
                          {appointment.status === 'confirmed' && (
                            <DropdownMenuItem>
                              <Clock className="h-4 w-4 mr-2" />
                              بدء الموعد
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <FileText className="h-4 w-4 mr-2" />
                            السجل الطبي
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Phone className="h-4 w-4 mr-2" />
                            اتصال
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
                            إرسال رسالة
                          </DropdownMenuItem>
                          {hasPermission('appointments:delete') && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                حذف
                              </DropdownMenuItem>
                            </>
                          )}
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
                عرض {filteredAppointments.length} من {appointments.length} موعد
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