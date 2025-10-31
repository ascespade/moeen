'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { RouteGuard } from '@/components/admin/RouteGuard';
import { useT } from '@/components/providers/I18nProvider';
import { usePermissions } from '@/hooks/usePermissions';
import { useAdminPatients } from '@/hooks/useAdminPatients';
import { AdminHeader, AdminCard, AdminStatsCard } from '@/components/admin/ui';
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
  Users,
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
  FileText,
  Heart,
  Activity,
  Download,
  Upload,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  UserX,
  Clock,
  AlertTriangle
} from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  nationalId: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  status: 'active' | 'inactive' | 'pending';
  lastVisit: string;
  createdAt: string;
  avatar?: string;
  address?: string;
  emergencyContact?: string;
  medicalHistory?: string[];
  allergies?: string[];
  currentMedications?: string[];
  insuranceProvider?: string;
  insuranceNumber?: string;
  bloodType?: string;
  height?: number;
  weight?: number;
  bmi?: number;
}

function PatientsPageContent() {
  const { t } = useT();
  const { hasPermission } = usePermissions({ userRole: 'admin' });
  // Use the real hook for data fetching
  const {
    patients: hookPatients,
    filteredPatients,
    loading,
    error: hookError,
    filters: hookFilters,
    pagination: hookPagination,
    updateFilters,
    setPage,
    refetch,
    deletePatient,
    updatePatient,
    createPatient,
    activatePatient,
    blockPatient
  } = useAdminPatients();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [selectedPatients, setSelectedPatients] = useState<string[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Update hook filters when local filters change
  useEffect(() => {
    updateFilters({
      search: searchTerm,
      status: statusFilter === 'all' ? 'all' : statusFilter,
      gender: genderFilter === 'all' ? 'all' : genderFilter,
    });
  }, [searchTerm, statusFilter, genderFilter, updateFilters]);

  // Map hook data (snake_case) to page data (camelCase) for compatibility
  const mappedPatients = (filteredPatients || []).map(patient => ({
    ...patient,
    name: patient.full_name || '',
    nationalId: patient.national_id || '',
    dateOfBirth: patient.date_of_birth || '',
    lastVisit: patient.last_visit || '',
    createdAt: patient.created_at || '',
    emergencyContact: patient.emergency_contact || '',
    medicalHistory: patient.medical_history || [],
    allergies: patient.allergies || [],
    currentMedications: patient.current_medications || [],
    insuranceProvider: patient.insurance_provider || '',
    insuranceNumber: patient.insurance_number || '',
    bloodType: patient.blood_type || '',
    // Calculate BMI if height and weight are available
    bmi: patient.height && patient.weight ? 
      (patient.weight / Math.pow((patient.height / 100), 2)) : undefined
  }));

  // Use mapped patients (convert snake_case to camelCase)
  const patients = mappedPatients;
  
  // Calculate total pages from pagination
  const totalPages = hookPagination?.totalPages || 1;
  const currentPageForPagination = hookPagination?.currentPage || 1;

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'نشط', variant: 'default' as const, className: 'bg-[color-mix(in_srgb,var(--brand-success)_10%,transparent)] text-[var(--brand-success)] border-[color-mix(in_srgb,var(--brand-success)_20%,transparent)]' },
      inactive: { label: 'غير نشط', variant: 'secondary' as const, className: 'bg-[color-mix(in_srgb,var(--text-muted)_10%,transparent)] text-[var(--text-muted)] border-[color-mix(in_srgb,var(--text-muted)_20%,transparent)]' },
      pending: { label: 'في الانتظار', variant: 'outline' as const, className: 'bg-[color-mix(in_srgb,var(--brand-warning)_10%,transparent)] text-[var(--brand-warning)] border-[color-mix(in_srgb,var(--brand-warning)_20%,transparent)]' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, variant: 'outline' as const, className: '' };
    return <Badge variant={config.variant} className={config.className}>{config.label}</Badge>;
  };

  const getGenderBadge = (gender: string) => {
    return gender === 'male' ? (
      <Badge variant="outline" className="bg-[color-mix(in_srgb,var(--brand-info)_10%,transparent)] text-[var(--brand-info)] border-[color-mix(in_srgb,var(--brand-info)_20%,transparent)]">ذكر</Badge>
    ) : (
      <Badge variant="outline" className="bg-[color-mix(in_srgb,var(--brand-primary)_10%,transparent)] text-[var(--brand-primary)] border-[color-mix(in_srgb,var(--brand-primary)_20%,transparent)]">أنثى</Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--background)]">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" style={{ color: 'var(--brand-primary)' }} />
          <p className="text-[var(--text-secondary)]">جاري تحميل المرضى...</p>
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
            <h1 className="text-3xl font-bold">إدارة المرضى</h1>
            <p className="text-muted-foreground">
              إدارة ملفات المرضى والسجلات الطبية
            </p>
          </div>
          <div className="flex items-center gap-4">
            {hasPermission('patients:create') && (
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    إضافة مريض
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>إضافة مريض جديد</DialogTitle>
                    <DialogDescription>
                      قم بملء البيانات المطلوبة لإضافة مريض جديد
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">الاسم الكامل</label>
                        <Input placeholder="الاسم الكامل" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">رقم الهوية</label>
                        <Input placeholder="1234567890" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">البريد الإلكتروني</label>
                        <Input placeholder="example@email.com" type="email" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">رقم الهاتف</label>
                        <Input placeholder="+966501234567" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">تاريخ الميلاد</label>
                        <Input type="date" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">الجنس</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر الجنس" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">ذكر</SelectItem>
                            <SelectItem value="female">أنثى</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                        إلغاء
                      </Button>
                      <Button onClick={() => setIsCreateDialogOpen(false)}>
                        إضافة المريض
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
              <CardTitle className="text-sm font-medium">إجمالي المرضى</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{patients.length}</div>
              <p className="text-xs text-muted-foreground">
                +12 من الشهر الماضي
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">المرضى النشطون</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {patients.filter(p => p.status === 'active').length}
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.round((patients.filter(p => p.status === 'active').length / patients.length) * 100)}% من الإجمالي
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الزيارات اليوم</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {patients.filter(p => {
                  if (!p.lastVisit) return false;
                  const lastVisitDate = new Date(p.lastVisit);
                  const today = new Date();
                  return lastVisitDate.toDateString() === today.toDateString();
                }).length}
              </div>
              <p className="text-xs text-muted-foreground">
                مواعيد مجدولة
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">في الانتظار</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {patients.filter(p => p.status === 'pending').length}
              </div>
              <p className="text-xs text-muted-foreground">
                يحتاجون مراجعة
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
                    placeholder="البحث بالاسم أو الهوية أو الهاتف..."
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
                    <SelectItem value="pending">في الانتظار</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={genderFilter} onValueChange={setGenderFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="الجنس" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الأجناس</SelectItem>
                    <SelectItem value="male">ذكر</SelectItem>
                    <SelectItem value="female">أنثى</SelectItem>
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

        {/* Patients Table */}
        <Card>
          <CardHeader>
            <CardTitle>قائمة المرضى</CardTitle>
            <CardDescription>
              عرض وإدارة جميع مرضى المركز
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
                          setSelectedPatients(patients.map(p => p.id));
                        } else {
                          setSelectedPatients([]);
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>المريض</TableHead>
                  <TableHead>العمر</TableHead>
                  <TableHead>الجنس</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>آخر زيارة</TableHead>
                  <TableHead>مؤشر كتلة الجسم</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        className="rounded border-[var(--brand-border)]"
                        checked={selectedPatients.includes(patient.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPatients([...selectedPatients, patient.id]);
                          } else {
                            setSelectedPatients(selectedPatients.filter(id => id !== patient.id));
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground grid place-items-center">
                          {patient.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium">{patient.name}</div>
                          <div className="text-sm text-muted-foreground">{patient.nationalId}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {patient.phone}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {calculateAge(patient.dateOfBirth)} سنة
                      </div>
                    </TableCell>
                    <TableCell>
                      {getGenderBadge(patient.gender)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(patient.status)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {formatDate(patient.lastVisit)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {patient.bmi ? (
                          <div className="flex items-center gap-1">
                            <span>{patient.bmi.toFixed(1)}</span>
                            {patient.bmi < 18.5 ? (
                              <Badge variant="outline" className="text-xs bg-[color-mix(in_srgb,var(--brand-info)_10%,transparent)] text-[var(--brand-info)] border-[color-mix(in_srgb,var(--brand-info)_20%,transparent)]">نحيف</Badge>
                            ) : patient.bmi < 25 ? (
                              <Badge variant="outline" className="text-xs bg-[color-mix(in_srgb,var(--brand-success)_10%,transparent)] text-[var(--brand-success)] border-[color-mix(in_srgb,var(--brand-success)_20%,transparent)]">طبيعي</Badge>
                            ) : patient.bmi < 30 ? (
                              <Badge variant="outline" className="text-xs bg-[color-mix(in_srgb,var(--brand-warning)_10%,transparent)] text-[var(--brand-warning)] border-[color-mix(in_srgb,var(--brand-warning)_20%,transparent)]">زائد</Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs bg-[color-mix(in_srgb,var(--brand-error)_10%,transparent)] text-[var(--brand-error)] border-[color-mix(in_srgb,var(--brand-error)_20%,transparent)]">سمنة</Badge>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">غير محدد</span>
                        )}
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
                            عرض الملف
                          </DropdownMenuItem>
                          {hasPermission('patients:edit') && (
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              تعديل
                            </DropdownMenuItem>
                          )}
                          {hasPermission('patients:medical_records') && (
                            <DropdownMenuItem>
                              <FileText className="h-4 w-4 mr-2" />
                              السجل الطبي
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <Calendar className="h-4 w-4 mr-2" />
                            حجز موعد
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
                          {hasPermission('patients:delete') && (
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
                عرض {patients.length > 0 ? ((currentPageForPagination - 1) * 10 + 1) : 0} - {Math.min(currentPageForPagination * 10, patients.length)} من {hookPagination?.totalItems || patients.length} مريض
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

export default function PatientsPage() {
  return (
    <RouteGuard
      requiredRoles={['admin', 'manager', 'supervisor', 'doctor', 'staff']}
      requiredPermissions={['patients:view']}
    >
      <PatientsPageContent />
    </RouteGuard>
  );
}