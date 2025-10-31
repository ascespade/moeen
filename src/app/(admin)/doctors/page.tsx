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
  Stethoscope,
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
  UserCheck,
  UserX,
  Award,
  GraduationCap,
  MapPin,
  Shield
} from 'lucide-react';

interface Doctor {
  id: string;
  name: string;
  email: string;
  phone: string;
  nationalId: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  status: 'active' | 'inactive' | 'on_leave';
  specialization: string;
  subSpecializations: string[];
  experience: number;
  education: string[];
  certifications: string[];
  languages: string[];
  consultationFee: number;
  rating: number;
  totalPatients: number;
  totalAppointments: number;
  lastActive: string;
  createdAt: string;
  avatar?: string;
  address?: string;
  emergencyContact?: string;
  licenseNumber?: string;
  licenseExpiry?: string;
  workingHours: {
    day: string;
    startTime: string;
    endTime: string;
    isWorking: boolean;
  }[];
  availability: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
}

export default function DoctorsPage() {
  const { t } = useT();
  const { hasPermission } = usePermissions({ userRole: 'admin' });
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [specializationFilter, setSpecializationFilter] = useState('all');
  const [selectedDoctors, setSelectedDoctors] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Mock data
  useEffect(() => {
    const mockDoctors: Doctor[] = [
      {
        id: '1',
        name: 'د. أحمد محمد العلي',
        email: 'dr.ahmed.ali@hemam.com',
        phone: '+966501234567',
        nationalId: '1234567890',
        dateOfBirth: '1975-03-15',
        gender: 'male',
        status: 'active',
        specialization: 'الطب العام',
        subSpecializations: ['طب الأسرة', 'الطب الوقائي'],
        experience: 15,
        education: ['بكالوريوس الطب والجراحة - جامعة الملك سعود', 'ماجستير طب الأسرة - جامعة الملك عبدالعزيز'],
        certifications: ['البورد السعودي لطب الأسرة', 'شهادة طب الطوارئ'],
        languages: ['العربية', 'الإنجليزية'],
        consultationFee: 200,
        rating: 4.8,
        totalPatients: 1247,
        totalAppointments: 3456,
        lastActive: '2024-01-15T10:30:00Z',
        createdAt: '2020-06-15T08:00:00Z',
        address: 'الرياض، حي النخيل',
        emergencyContact: '+966501234568',
        licenseNumber: 'MED123456789',
        licenseExpiry: '2025-12-31',
        workingHours: [
          { day: 'السبت', startTime: '08:00', endTime: '16:00', isWorking: true },
          { day: 'الأحد', startTime: '08:00', endTime: '16:00', isWorking: true },
          { day: 'الاثنين', startTime: '08:00', endTime: '16:00', isWorking: true },
          { day: 'الثلاثاء', startTime: '08:00', endTime: '16:00', isWorking: true },
          { day: 'الأربعاء', startTime: '08:00', endTime: '16:00', isWorking: true },
          { day: 'الخميس', startTime: '08:00', endTime: '12:00', isWorking: true },
          { day: 'الجمعة', startTime: '08:00', endTime: '12:00', isWorking: false }
        ],
        availability: {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: false,
          saturday: true,
          sunday: true
        }
      },
      {
        id: '2',
        name: 'د. فاطمة أحمد السعد',
        email: 'dr.fatima.saad@hemam.com',
        phone: '+966502345678',
        nationalId: '2345678901',
        dateOfBirth: '1980-07-22',
        gender: 'female',
        status: 'active',
        specialization: 'أمراض القلب',
        subSpecializations: ['قسطرة القلب', 'أمراض القلب عند الأطفال'],
        experience: 12,
        education: ['بكالوريوس الطب والجراحة - جامعة الملك عبدالعزيز', 'ماجستير أمراض القلب - جامعة الملك سعود'],
        certifications: ['البورد السعودي لأمراض القلب', 'شهادة قسطرة القلب التداخلية'],
        languages: ['العربية', 'الإنجليزية', 'الفرنسية'],
        consultationFee: 350,
        rating: 4.9,
        totalPatients: 892,
        totalAppointments: 2134,
        lastActive: '2024-01-14T14:20:00Z',
        createdAt: '2021-07-20T08:00:00Z',
        address: 'جدة، حي الروضة',
        emergencyContact: '+966502345679',
        licenseNumber: 'MED234567890',
        licenseExpiry: '2026-03-15',
        workingHours: [
          { day: 'السبت', startTime: '09:00', endTime: '17:00', isWorking: true },
          { day: 'الأحد', startTime: '09:00', endTime: '17:00', isWorking: true },
          { day: 'الاثنين', startTime: '09:00', endTime: '17:00', isWorking: true },
          { day: 'الثلاثاء', startTime: '09:00', endTime: '17:00', isWorking: true },
          { day: 'الأربعاء', startTime: '09:00', endTime: '17:00', isWorking: true },
          { day: 'الخميس', startTime: '09:00', endTime: '13:00', isWorking: true },
          { day: 'الجمعة', startTime: '09:00', endTime: '13:00', isWorking: false }
        ],
        availability: {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: false,
          saturday: true,
          sunday: true
        }
      },
      {
        id: '3',
        name: 'د. محمد عبدالله القحطاني',
        email: 'dr.mohammed.qhtani@hemam.com',
        phone: '+966503456789',
        nationalId: '3456789012',
        dateOfBirth: '1978-11-08',
        gender: 'male',
        status: 'on_leave',
        specialization: 'الجراحة العامة',
        subSpecializations: ['جراحة المناظير', 'جراحة الأورام'],
        experience: 18,
        education: ['بكالوريوس الطب والجراحة - جامعة الملك سعود', 'ماجستير الجراحة العامة - جامعة الملك عبدالعزيز'],
        certifications: ['البورد السعودي للجراحة العامة', 'شهادة جراحة المناظير'],
        languages: ['العربية', 'الإنجليزية'],
        consultationFee: 400,
        rating: 4.7,
        totalPatients: 1567,
        totalAppointments: 2890,
        lastActive: '2024-01-10T16:45:00Z',
        createdAt: '2019-08-10T08:00:00Z',
        address: 'الدمام، حي الفيصلية',
        emergencyContact: '+966503456790',
        licenseNumber: 'MED345678901',
        licenseExpiry: '2025-08-10',
        workingHours: [
          { day: 'السبت', startTime: '07:00', endTime: '15:00', isWorking: true },
          { day: 'الأحد', startTime: '07:00', endTime: '15:00', isWorking: true },
          { day: 'الاثنين', startTime: '07:00', endTime: '15:00', isWorking: true },
          { day: 'الثلاثاء', startTime: '07:00', endTime: '15:00', isWorking: true },
          { day: 'الأربعاء', startTime: '07:00', endTime: '15:00', isWorking: true },
          { day: 'الخميس', startTime: '07:00', endTime: '11:00', isWorking: true },
          { day: 'الجمعة', startTime: '07:00', endTime: '11:00', isWorking: false }
        ],
        availability: {
          monday: false,
          tuesday: false,
          wednesday: false,
          thursday: false,
          friday: false,
          saturday: false,
          sunday: false
        }
      },
      {
        id: '4',
        name: 'د. نورا سعد المطيري',
        email: 'dr.nora.mutairi@hemam.com',
        phone: '+966504567890',
        nationalId: '4567890123',
        dateOfBirth: '1985-05-12',
        gender: 'female',
        status: 'active',
        specialization: 'طب الأطفال',
        subSpecializations: ['حديثي الولادة', 'أمراض الأطفال العصبية'],
        experience: 10,
        education: ['بكالوريوس الطب والجراحة - جامعة الملك سعود', 'ماجستير طب الأطفال - جامعة الملك عبدالعزيز'],
        certifications: ['البورد السعودي لطب الأطفال', 'شهادة رعاية حديثي الولادة'],
        languages: ['العربية', 'الإنجليزية'],
        consultationFee: 250,
        rating: 4.9,
        totalPatients: 2134,
        totalAppointments: 4567,
        lastActive: '2024-01-13T11:30:00Z',
        createdAt: '2022-09-15T08:00:00Z',
        address: 'الرياض، حي العليا',
        emergencyContact: '+966504567891',
        licenseNumber: 'MED456789012',
        licenseExpiry: '2027-05-12',
        workingHours: [
          { day: 'السبت', startTime: '08:30', endTime: '16:30', isWorking: true },
          { day: 'الأحد', startTime: '08:30', endTime: '16:30', isWorking: true },
          { day: 'الاثنين', startTime: '08:30', endTime: '16:30', isWorking: true },
          { day: 'الثلاثاء', startTime: '08:30', endTime: '16:30', isWorking: true },
          { day: 'الأربعاء', startTime: '08:30', endTime: '16:30', isWorking: true },
          { day: 'الخميس', startTime: '08:30', endTime: '12:30', isWorking: true },
          { day: 'الجمعة', startTime: '08:30', endTime: '12:30', isWorking: false }
        ],
        availability: {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: false,
          saturday: true,
          sunday: true
        }
      },
      {
        id: '5',
        name: 'د. خالد فيصل الشمري',
        email: 'dr.khalid.shamri@hemam.com',
        phone: '+966505678901',
        nationalId: '5678901234',
        dateOfBirth: '1972-09-30',
        gender: 'male',
        status: 'inactive',
        specialization: 'الطب النفسي',
        subSpecializations: ['الطب النفسي للأطفال', 'الطب النفسي الجسدي'],
        experience: 20,
        education: ['بكالوريوس الطب والجراحة - جامعة الملك سعود', 'ماجستير الطب النفسي - جامعة الملك عبدالعزيز'],
        certifications: ['البورد السعودي للطب النفسي', 'شهادة العلاج النفسي'],
        languages: ['العربية', 'الإنجليزية', 'الألمانية'],
        consultationFee: 300,
        rating: 4.6,
        totalPatients: 756,
        totalAppointments: 1234,
        lastActive: '2023-12-20T09:15:00Z',
        createdAt: '2018-03-10T08:00:00Z',
        address: 'الطائف، حي الشهداء',
        emergencyContact: '+966505678902',
        licenseNumber: 'MED567890123',
        licenseExpiry: '2024-09-30',
        workingHours: [
          { day: 'السبت', startTime: '10:00', endTime: '18:00', isWorking: true },
          { day: 'الأحد', startTime: '10:00', endTime: '18:00', isWorking: true },
          { day: 'الاثنين', startTime: '10:00', endTime: '18:00', isWorking: true },
          { day: 'الثلاثاء', startTime: '10:00', endTime: '18:00', isWorking: true },
          { day: 'الأربعاء', startTime: '10:00', endTime: '18:00', isWorking: true },
          { day: 'الخميس', startTime: '10:00', endTime: '14:00', isWorking: true },
          { day: 'الجمعة', startTime: '10:00', endTime: '14:00', isWorking: false }
        ],
        availability: {
          monday: false,
          tuesday: false,
          wednesday: false,
          thursday: false,
          friday: false,
          saturday: false,
          sunday: false
        }
      }
    ];

    setDoctors(mockDoctors);
    setTotalPages(Math.ceil(mockDoctors.length / 10));
    setLoading(false);
  }, []);

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.phone.includes(searchTerm) ||
                         doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || doctor.status === statusFilter;
    const matchesSpecialization = specializationFilter === 'all' || doctor.specialization === specializationFilter;

    return matchesSearch && matchesStatus && matchesSpecialization;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'نشط', variant: 'default' as const, className: 'bg-green-100 text-green-800' },
      inactive: { label: 'غير نشط', variant: 'secondary' as const, className: 'bg-gray-100 text-gray-800' },
      on_leave: { label: 'في إجازة', variant: 'outline' as const, className: 'bg-yellow-100 text-yellow-800' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, variant: 'outline' as const, className: '' };
    return <Badge variant={config.variant} className={config.className}>{config.label}</Badge>;
  };

  const getGenderBadge = (gender: string) => {
    return gender === 'male' ? (
      <Badge variant="outline" className="bg-blue-100 text-blue-800">ذكر</Badge>
    ) : (
      <Badge variant="outline" className="bg-pink-100 text-pink-800">أنثى</Badge>
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

  const getSpecializations = () => {
    const specializations = new Set(doctors.map(doctor => doctor.specialization));
    return Array.from(specializations).sort();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>جاري تحميل الأطباء...</p>
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
            <h1 className="text-3xl font-bold">إدارة الأطباء</h1>
            <p className="text-muted-foreground">
              إدارة ملفات الأطباء والمواعيد والتخصصات
            </p>
          </div>
          <div className="flex items-center gap-4">
            {hasPermission('doctors:create') && (
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    إضافة طبيب
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>إضافة طبيب جديد</DialogTitle>
                    <DialogDescription>
                      قم بملء البيانات المطلوبة لإضافة طبيب جديد
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">الاسم الكامل</label>
                        <Input placeholder="د. الاسم الكامل" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">رقم الهوية</label>
                        <Input placeholder="1234567890" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">البريد الإلكتروني</label>
                        <Input placeholder="dr.name@hemam.com" type="email" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">رقم الهاتف</label>
                        <Input placeholder="+966501234567" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">التخصص</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر التخصص" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">الطب العام</SelectItem>
                            <SelectItem value="cardiology">أمراض القلب</SelectItem>
                            <SelectItem value="surgery">الجراحة العامة</SelectItem>
                            <SelectItem value="pediatrics">طب الأطفال</SelectItem>
                            <SelectItem value="psychiatry">الطب النفسي</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">سنوات الخبرة</label>
                        <Input placeholder="10" type="number" />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                        إلغاء
                      </Button>
                      <Button onClick={() => setIsCreateDialogOpen(false)}>
                        إضافة الطبيب
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
              <CardTitle className="text-sm font-medium">إجمالي الأطباء</CardTitle>
              <Stethoscope className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{doctors.length}</div>
              <p className="text-xs text-muted-foreground">
                +3 من الشهر الماضي
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الأطباء النشطون</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {doctors.filter(d => d.status === 'active').length}
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.round((doctors.filter(d => d.status === 'active').length / doctors.length) * 100)}% من الإجمالي
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">متوسط التقييم</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(doctors.reduce((sum, doctor) => sum + doctor.rating, 0) / doctors.length).toFixed(1)}
              </div>
              <p className="text-xs text-muted-foreground">
                من 5 نجوم
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي المرضى</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {doctors.reduce((sum, doctor) => sum + doctor.totalPatients, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                عبر جميع الأطباء
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
                    placeholder="البحث بالاسم أو التخصص..."
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
                    <SelectItem value="on_leave">في إجازة</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="التخصص" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع التخصصات</SelectItem>
                    {getSpecializations().map(spec => (
                      <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                    ))}
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

        {/* Doctors Table */}
        <Card>
          <CardHeader>
            <CardTitle>قائمة الأطباء</CardTitle>
            <CardDescription>
              عرض وإدارة جميع أطباء المركز
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
                          setSelectedDoctors(filteredDoctors.map(d => d.id));
                        } else {
                          setSelectedDoctors([]);
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>الطبيب</TableHead>
                  <TableHead>التخصص</TableHead>
                  <TableHead>الخبرة</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>التقييم</TableHead>
                  <TableHead>المرضى</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDoctors.map((doctor) => (
                  <TableRow key={doctor.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        checked={selectedDoctors.includes(doctor.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedDoctors([...selectedDoctors, doctor.id]);
                          } else {
                            setSelectedDoctors(selectedDoctors.filter(id => id !== doctor.id));
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground grid place-items-center">
                          {doctor.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium">{doctor.name}</div>
                          <div className="text-sm text-muted-foreground">{doctor.specialization}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {doctor.phone}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge variant="secondary">{doctor.specialization}</Badge>
                        {doctor.subSpecializations.slice(0, 2).map((sub, index) => (
                          <div key={index} className="text-xs text-muted-foreground">
                            {sub}
                          </div>
                        ))}
                        {doctor.subSpecializations.length > 2 && (
                          <div className="text-xs text-muted-foreground">
                            +{doctor.subSpecializations.length - 2} أخرى
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {doctor.experience} سنة
                      </div>
                      <div className="text-xs text-muted-foreground">
                        العمر: {calculateAge(doctor.dateOfBirth)} سنة
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(doctor.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{doctor.rating}</span>
                        <span className="text-xs text-muted-foreground">/5</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {doctor.totalPatients.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {doctor.totalAppointments.toLocaleString()} موعد
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
                          {hasPermission('doctors:edit') && (
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              تعديل
                            </DropdownMenuItem>
                          )}
                          {hasPermission('doctors:schedules') && (
                            <DropdownMenuItem>
                              <Calendar className="h-4 w-4 mr-2" />
                              الجدولة
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <Users className="h-4 w-4 mr-2" />
                            المرضى
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
                          {hasPermission('doctors:delete') && (
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
                عرض {filteredDoctors.length} من {doctors.length} طبيب
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
  );
}
