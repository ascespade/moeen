'use client';

import React, { useState } from 'react';
import { useT } from '@/components/providers/I18nProvider';
import { usePermissions } from '@/hooks/usePermissions';
import { useAdminAppointments } from '@/hooks/useAdminAppointments';
import { RouteGuard } from '@/components/admin/RouteGuard';
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

function AppointmentsPageContent() {
  const { t } = useT();
  const { hasPermission } = usePermissions({ userRole: 'admin' });

  const {
    appointments: hookAppointments,
    filteredAppointments,
    loading,
    error: hookError,
    filters: hookFilters,
    pagination: hookPagination,
    updateFilters,
    setPage,
    refetch,
    deleteAppointment,
    updateAppointment,
    createAppointment,
    cancelAppointment,
    confirmAppointment
  } = useAdminAppointments();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedAppointments, setSelectedAppointments] = useState<string[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Update hook filters when local filters change
  React.useEffect(() => {
    updateFilters({
      search: searchTerm,
      status: statusFilter === 'all' ? 'all' : statusFilter,
      type: typeFilter === 'all' ? 'all' : typeFilter,
      dateFilter: dateFilter === 'all' ? 'all' : dateFilter,
    });
  }, [searchTerm, statusFilter, typeFilter, dateFilter, updateFilters]);

  // Map hook data (snake_case) to page data (camelCase) for compatibility
  const mappedAppointments = hookAppointments.map(appointment => {
    const scheduledAt = new Date(appointment.scheduled_at);
    return {
      id: appointment.id,
      patientId: appointment.patient_id,
      patientName: appointment.patients?.full_name || 'غير معروف',
      patientPhone: appointment.patients?.phone || '',
      doctorId: appointment.doctor_id,
      doctorName: appointment.doctors?.speciality || 'غير معروف',
      doctorSpecialization: appointment.doctors?.speciality || '',
      date: scheduledAt.toISOString().split('T')[0],
      time: scheduledAt.toTimeString().slice(0, 5),
      duration: 30, // Default duration
      type: appointment.type || 'in_person',
      status: appointment.status,
      reason: appointment.reason || 'موعد طبي',
      notes: appointment.notes,
      createdAt: appointment.created_at,
      updatedAt: appointment.updated_at || appointment.created_at,
      location: appointment.location,
      room: appointment.room
    };
  });

  const appointments = mappedAppointments;
  const totalPages = hookPagination?.totalPages || 1;
  const currentPageForPagination = hookPagination?.currentPage || 1;

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: { label: 'مجدول', variant: 'outline' as const, className: 'bg-[color-mix(in_srgb,var(--brand-info)_10%,transparent)] text-[var(--brand-info)] border-[color-mix(in_srgb,var(--brand-info)_20%,transparent)]' },
      confirmed: { label: 'مؤكد', variant: 'default' as const, className: 'bg-[color-mix(in_srgb,var(--brand-success)_10%,transparent)] text-[var(--brand-success)] border-[color-mix(in_srgb,var(--brand-success)_20%,transparent)]' },
      in_progress: { label: 'جاري', variant: 'secondary' as const, className: 'bg-[color-mix(in_srgb,var(--brand-warning)_10%,transparent)] text-[var(--brand-warning)] border-[color-mix(in_srgb,var(--brand-warning)_20%,transparent)]' },
      completed: { label: 'مكتمل', variant: 'default' as const, className: 'bg-[color-mix(in_srgb,var(--brand-success)_10%,transparent)] text-[var(--brand-success)] border-[color-mix(in_srgb,var(--brand-success)_20%,transparent)]' },
      cancelled: { label: 'ملغي', variant: 'error' as const, className: 'bg-[color-mix(in_srgb,var(--brand-error)_10%,transparent)] text-[var(--brand-error)] border-[color-mix(in_srgb,var(--brand-error)_20%,transparent)]' },
      no_show: { label: 'لم يحضر', variant: 'error' as const, className: 'bg-[color-mix(in_srgb,var(--text-muted)_10%,transparent)] text-[var(--text-muted)] border-[color-mix(in_srgb,var(--text-muted)_20%,transparent)]' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, variant: 'outline' as const, className: '' };
    return <Badge variant={config.variant} className={config.className}>{config.label}</Badge>;
  };

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      in_person: { label: 'حضوري', icon: <MapPin className="h-3 w-3" />, className: 'bg-[color-mix(in_srgb,var(--brand-info)_10%,transparent)] text-[var(--brand-info)] border-[color-mix(in_srgb,var(--brand-info)_20%,transparent)]' },
      video: { label: 'فيديو', icon: <Video className="h-3 w-3" />, className: 'bg-[color-mix(in_srgb,var(--brand-success)_10%,transparent)] text-[var(--brand-success)] border-[color-mix(in_srgb,var(--brand-success)_20%,transparent)]' },
      phone: { label: 'هاتفي', icon: <PhoneCall className="h-3 w-3" />, className: 'bg-[color-mix(in_srgb,var(--brand-primary)_10%,transparent)] text-[var(--brand-primary)] border-[color-mix(in_srgb,var(--brand-primary)_20%,transparent)]' }
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
      <div className="flex items-center justify-center min-h-screen bg-[var(--background)]">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" style={{ color: 'var(--brand-primary)' }} />
          <p className="text-[var(--text-secondary)]">جاري تحميل المواعيد...</p>
        </div>
      </div>
    );
  }

  if (hookError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--background)]">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--brand-error)' }} />
          <p className="mb-4" style={{ color: 'var(--brand-error)' }}>{hookError}</p>
          <Button onClick={refetch} className='bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white'>
            <RefreshCw className="w-4 h-4 ml-2" />
            إعادة المحاولة
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
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
              <div className="text-2xl font-bold">{hookPagination?.totalItems || 0}</div>
              <p className="text-xs text-muted-foreground">
                {filteredAppointments.length} موعد بعد الفلترة
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
                      className="rounded border-[var(--brand-border)]"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedAppointments(appointments.map(a => a.id));
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
                {appointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        className="rounded border-[var(--brand-border)]"
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
                عرض {appointments.length > 0 ? ((currentPageForPagination - 1) * 10 + 1) : 0} - {Math.min(currentPageForPagination * 10, hookPagination?.totalItems || 0)} من {hookPagination?.totalItems || 0} موعد
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.max(1, currentPageForPagination - 1))}
                  disabled={currentPageForPagination === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <Button
                      key={page}
                      variant={currentPageForPagination === page ? "primary" : "outline"}
                      size="sm"
                      onClick={() => setPage(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.min(totalPages, currentPageForPagination + 1))}
                  disabled={currentPageForPagination === totalPages}
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

export default function AppointmentsPage() {
  return (
    <RouteGuard
      requiredRoles={['admin', 'manager', 'supervisor', 'doctor', 'staff']}
      requiredPermissions={['appointments:view']}
    >
      <AppointmentsPageContent />
    </RouteGuard>
  );
}
