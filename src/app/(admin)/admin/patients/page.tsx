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

export default function PatientsPage() {
  const { t } = useT();
  const { hasPermission } = usePermissions({ userRole: 'admin' });
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [selectedPatients, setSelectedPatients] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Mock data
  useEffect(() => {
    const mockPatients: Patient[] = [
      {
        id: '1',
        name: 'أحمد محمد العلي',
        email: 'ahmed.ali@email.com',
        phone: '+966501234567',
        nationalId: '1234567890',
        dateOfBirth: '1985-03-15',
        gender: 'male',
        status: 'active',
        lastVisit: '2024-01-15T10:30:00Z',
        createdAt: '2023-06-15T08:00:00Z',
        address: 'الرياض، حي النخيل',
        emergencyContact: '+966501234568',
        medicalHistory: ['ضغط الدم', 'السكري'],
        allergies: ['البنسلين'],
        currentMedications: ['ميتفورمين', 'لوسارتان'],
        insuranceProvider: 'شركة التأمين الوطنية',
        insuranceNumber: 'INS123456789',
        bloodType: 'O+',
        height: 175,
        weight: 80,
        bmi: 26.1
      },
      {
        id: '2',
        name: 'فاطمة أحمد السعد',
        email: 'fatima.saad@email.com',
        phone: '+966502345678',
        nationalId: '2345678901',
        dateOfBirth: '1990-07-22',
        gender: 'female',
        status: 'active',
        lastVisit: '2024-01-14T14:20:00Z',
        createdAt: '2023-07-20T08:00:00Z',
        address: 'جدة، حي الروضة',
        emergencyContact: '+966502345679',
        medicalHistory: ['الربو'],
        allergies: ['الغبار'],
        currentMedications: ['فينتولين'],
        insuranceProvider: 'شركة التأمين التعاوني',
        insuranceNumber: 'INS234567890',
        bloodType: 'A+',
        height: 160,
        weight: 55,
        bmi: 21.5
      },
      {
        id: '3',
        name: 'محمد عبدالله القحطاني',
        email: 'mohammed.qhtani@email.com',
        phone: '+966503456789',
        nationalId: '3456789012',
        dateOfBirth: '1978-11-08',
        gender: 'male',
        status: 'inactive',
        lastVisit: '2023-12-20T09:15:00Z',
        createdAt: '2023-08-10T08:00:00Z',
        address: 'الدمام، حي الفيصلية',
        emergencyContact: '+966503456790',
        medicalHistory: ['أمراض القلب'],
        allergies: ['المأكولات البحرية'],
        currentMedications: ['أتورفاستاتين', 'أسبرين'],
        insuranceProvider: 'شركة التأمين الأهلية',
        insuranceNumber: 'INS345678901',
        bloodType: 'B+',
        height: 180,
        weight: 90,
        bmi: 27.8
      },
      {
        id: '4',
        name: 'نورا سعد المطيري',
        email: 'nora.mutairi@email.com',
        phone: '+966504567890',
        nationalId: '4567890123',
        dateOfBirth: '1995-05-12',
        gender: 'female',
        status: 'pending',
        lastVisit: '2024-01-10T16:45:00Z',
        createdAt: '2024-01-01T08:00:00Z',
        address: 'الرياض، حي العليا',
        emergencyContact: '+966504567891',
        medicalHistory: [],
        allergies: [],
        currentMedications: [],
        insuranceProvider: 'شركة التأمين الوطنية',
        insuranceNumber: 'INS456789012',
        bloodType: 'AB+',
        height: 165,
        weight: 60,
        bmi: 22.0
      },
      {
        id: '5',
        name: 'خالد فيصل الشمري',
        email: 'khalid.shamri@email.com',
        phone: '+966505678901',
        nationalId: '5678901234',
        dateOfBirth: '1982-09-30',
        gender: 'male',
        status: 'active',
        lastVisit: '2024-01-13T11:30:00Z',
        createdAt: '2023-09-15T08:00:00Z',
        address: 'الطائف، حي الشهداء',
        emergencyContact: '+966505678902',
        medicalHistory: ['الربو', 'الحساسية'],
        allergies: ['حبوب اللقاح', 'الغبار'],
        currentMedications: ['مونتيلوكاست', 'لوراتادين'],
        insuranceProvider: 'شركة التأمين التعاوني',
        insuranceNumber: 'INS567890123',
        bloodType: 'O-',
        height: 170,
        weight: 75,
        bmi: 25.9
      }
    ];

    setPatients(mockPatients);
    setTotalPages(Math.ceil(mockPatients.length / 10));
    setLoading(false);
  }, []);

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.phone.includes(searchTerm) ||
                         patient.nationalId.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || patient.status === statusFilter;
    const matchesGender = genderFilter === 'all' || patient.gender === genderFilter;
    
    return matchesSearch && matchesStatus && matchesGender;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'نشط', variant: 'default' as const, className: 'bg-green-100 text-green-800' },
      inactive: { label: 'غير نشط', variant: 'secondary' as const, className: 'bg-gray-100 text-gray-800' },
      pending: { label: 'في الانتظار', variant: 'outline' as const, className: 'bg-yellow-100 text-yellow-800' }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>جاري تحميل المرضى...</p>
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
              <div className="text-2xl font-bold">23</div>
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
                      className="rounded border-gray-300"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPatients(filteredPatients.map(p => p.id));
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
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
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
                              <Badge variant="outline" className="text-xs bg-blue-100 text-blue-800">نحيف</Badge>
                            ) : patient.bmi < 25 ? (
                              <Badge variant="outline" className="text-xs bg-green-100 text-green-800">طبيعي</Badge>
                            ) : patient.bmi < 30 ? (
                              <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800">زائد</Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs bg-red-100 text-red-800">سمنة</Badge>
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
                عرض {filteredPatients.length} من {patients.length} مريض
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