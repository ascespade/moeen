'use client';

import { useT } from '@/components/providers/I18nProvider';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/Card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from '@/components/ui/Dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { Input } from '@/components/ui/Input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/Select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/Table';
import { usePermissions } from '@/hooks/usePermissions';
import {
    Activity,
    Award,
    ChevronLeft,
    ChevronRight,
    Copy,
    Crown,
    Download,
    Edit,
    Eye,
    Filter,
    Key,
    MoreHorizontal,
    PhoneCall,
    Plus,
    RefreshCw,
    Search,
    Shield,
    Trash2,
    TrendingUp,
    User,
    UserCheck,
    UserCog,
    Users,
    UserX
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  phone?: string;
  avatar?: string;
  role: string;
  roleDisplayName: string;
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  isVerified: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  createdByName: string;
  department?: string;
  position?: string;
  permissions: string[];
  preferences: {
    language: string;
    theme: string;
    notifications: boolean;
    emailNotifications: boolean;
    smsNotifications: boolean;
  };
  statistics: {
    totalLogins: number;
    lastActivity: string;
    sessionsCount: number;
    averageSessionDuration: number;
  };
  tags?: string[];
  notes?: string;
}

export default function UsersPage() {
  const { t } = useT();
  const { hasPermission } = usePermissions({ userRole: 'admin' });
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Mock data
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: '1',
        username: 'admin',
        email: 'admin@hemam.com',
        firstName: 'أحمد',
        lastName: 'التقني',
        displayName: 'أحمد التقني',
        phone: '+966501234567',
        avatar: '/avatars/admin.jpg',
        role: 'admin',
        roleDisplayName: 'مدير النظام',
        status: 'active',
        isVerified: true,
        lastLoginAt: '2024-01-15T14:30:00Z',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-15T14:30:00Z',
        createdBy: 'system',
        createdByName: 'النظام',
        department: 'التقنية',
        position: 'مدير النظام',
        permissions: ['users:view', 'users:create', 'users:edit', 'users:delete', 'roles:view', 'roles:create', 'roles:edit', 'roles:delete'],
        preferences: {
          language: 'ar',
          theme: 'light',
          notifications: true,
          emailNotifications: true,
          smsNotifications: false
        },
        statistics: {
          totalLogins: 156,
          lastActivity: '2024-01-15T14:30:00Z',
          sessionsCount: 45,
          averageSessionDuration: 120
        },
        tags: ['مدير', 'نظام', 'تقني'],
        notes: 'المدير الرئيسي للنظام'
      },
      {
        id: '2',
        username: 'dr.fatima',
        email: 'fatima.ahmed@hemam.com',
        firstName: 'فاطمة',
        lastName: 'أحمد العلي',
        displayName: 'د. فاطمة أحمد العلي',
        phone: '+966502345678',
        avatar: '/avatars/dr-fatima.jpg',
        role: 'doctor',
        roleDisplayName: 'طبيب',
        status: 'active',
        isVerified: true,
        lastLoginAt: '2024-01-15T13:45:00Z',
        createdAt: '2024-01-02T09:00:00Z',
        updatedAt: '2024-01-15T13:45:00Z',
        createdBy: 'admin1',
        createdByName: 'أحمد التقني',
        department: 'الطب العام',
        position: 'طبيب استشاري',
        permissions: ['patients:view', 'patients:create', 'patients:edit', 'appointments:view', 'appointments:create', 'appointments:edit'],
        preferences: {
          language: 'ar',
          theme: 'light',
          notifications: true,
          emailNotifications: true,
          smsNotifications: true
        },
        statistics: {
          totalLogins: 89,
          lastActivity: '2024-01-15T13:45:00Z',
          sessionsCount: 32,
          averageSessionDuration: 95
        },
        tags: ['طبيب', 'استشاري', 'طب عام'],
        notes: 'طبيب استشاري في الطب العام'
      },
      {
        id: '3',
        username: 'nurse.sara',
        email: 'sara.nurse@hemam.com',
        firstName: 'سارة',
        lastName: 'أحمد السعد',
        displayName: 'سارة أحمد السعد',
        phone: '+966503456789',
        avatar: '/avatars/nurse-sara.jpg',
        role: 'nurse',
        roleDisplayName: 'ممرض',
        status: 'active',
        isVerified: true,
        lastLoginAt: '2024-01-15T12:20:00Z',
        createdAt: '2024-01-03T10:00:00Z',
        updatedAt: '2024-01-15T12:20:00Z',
        createdBy: 'admin1',
        createdByName: 'أحمد التقني',
        department: 'التمريض',
        position: 'ممرض أول',
        permissions: ['patients:view', 'patients:edit', 'appointments:view', 'appointments:edit'],
        preferences: {
          language: 'ar',
          theme: 'dark',
          notifications: true,
          emailNotifications: true,
          smsNotifications: true
        },
        statistics: {
          totalLogins: 67,
          lastActivity: '2024-01-15T12:20:00Z',
          sessionsCount: 28,
          averageSessionDuration: 75
        },
        tags: ['ممرض', 'تمريض', 'أول'],
        notes: 'ممرض أول في قسم التمريض'
      },
      {
        id: '4',
        username: 'reception.ahmed',
        email: 'ahmed.reception@hemam.com',
        firstName: 'أحمد',
        lastName: 'محمد القحطاني',
        displayName: 'أحمد محمد القحطاني',
        phone: '+966504567890',
        avatar: '/avatars/reception-ahmed.jpg',
        role: 'staff',
        roleDisplayName: 'موظف',
        status: 'active',
        isVerified: true,
        lastLoginAt: '2024-01-15T11:15:00Z',
        createdAt: '2024-01-04T08:00:00Z',
        updatedAt: '2024-01-15T11:15:00Z',
        createdBy: 'admin1',
        createdByName: 'أحمد التقني',
        department: 'الاستقبال',
        position: 'موظف استقبال',
        permissions: ['patients:view', 'patients:create', 'patients:edit', 'appointments:view', 'appointments:create', 'appointments:edit', 'appointments:delete'],
        preferences: {
          language: 'ar',
          theme: 'light',
          notifications: true,
          emailNotifications: true,
          smsNotifications: false
        },
        statistics: {
          totalLogins: 45,
          lastActivity: '2024-01-15T11:15:00Z',
          sessionsCount: 18,
          averageSessionDuration: 180
        },
        tags: ['استقبال', 'إداري', 'موظف'],
        notes: 'موظف استقبال في القسم الإداري'
      },
      {
        id: '5',
        username: 'finance.nora',
        email: 'nora.finance@hemam.com',
        firstName: 'نورا',
        lastName: 'سعد المطيري',
        displayName: 'نورا سعد المطيري',
        phone: '+966505678901',
        avatar: '/avatars/finance-nora.jpg',
        role: 'manager',
        roleDisplayName: 'مدير',
        status: 'active',
        isVerified: true,
        lastLoginAt: '2024-01-15T10:30:00Z',
        createdAt: '2024-01-10T09:00:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
        createdBy: 'admin1',
        createdByName: 'أحمد التقني',
        department: 'المالية',
        position: 'مدير مالي',
        permissions: ['payments:view', 'payments:create', 'payments:edit', 'payments:delete', 'reports:view', 'reports:create'],
        preferences: {
          language: 'ar',
          theme: 'light',
          notifications: true,
          emailNotifications: true,
          smsNotifications: false
        },
        statistics: {
          totalLogins: 34,
          lastActivity: '2024-01-15T10:30:00Z',
          sessionsCount: 15,
          averageSessionDuration: 110
        },
        tags: ['مالي', 'مدير', 'إدارة'],
        notes: 'مدير الشؤون المالية'
      },
      {
        id: '6',
        username: 'patient.ahmed',
        email: 'ahmed.patient@email.com',
        firstName: 'أحمد',
        lastName: 'محمد العلي',
        displayName: 'أحمد محمد العلي',
        phone: '+966506789012',
        avatar: '/avatars/patient-ahmed.jpg',
        role: 'patient',
        roleDisplayName: 'مريض',
        status: 'active',
        isVerified: true,
        lastLoginAt: '2024-01-15T09:45:00Z',
        createdAt: '2024-01-05T14:00:00Z',
        updatedAt: '2024-01-15T09:45:00Z',
        createdBy: 'reception1',
        createdByName: 'أحمد القحطاني',
        department: 'المرضى',
        position: 'مريض',
        permissions: ['patients:view_own', 'appointments:view_own', 'appointments:create_own', 'medical_records:view_own'],
        preferences: {
          language: 'ar',
          theme: 'light',
          notifications: true,
          emailNotifications: true,
          smsNotifications: true
        },
        statistics: {
          totalLogins: 23,
          lastActivity: '2024-01-15T09:45:00Z',
          sessionsCount: 12,
          averageSessionDuration: 45
        },
        tags: ['مريض', 'عام', 'مستخدم'],
        notes: 'مريض مسجل في النظام'
      }
    ];

    setUsers(mockUsers);
    setTotalPages(Math.ceil(mockUsers.length / 10));
    setLoading(false);
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'نشط', variant: 'default' as const, className: 'bg-green-100 text-green-800' },
      inactive: { label: 'غير نشط', variant: 'outline' as const, className: 'bg-gray-100 text-gray-800' },
      suspended: { label: 'معلق', variant: 'error' as const, className: 'bg-red-100 text-red-800' },
      pending: { label: 'في الانتظار', variant: 'secondary' as const, className: 'bg-yellow-100 text-yellow-800' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || 
                  { label: status, variant: 'outline' as const, className: '' };
    return <Badge variant={config.variant} className={config.className}>{config.label}</Badge>;
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      admin: { label: 'مدير النظام', icon: <Crown className="h-3 w-3" />, className: 'bg-red-100 text-red-800' },
      manager: { label: 'مدير', icon: <TrendingUp className="h-3 w-3" />, className: 'bg-cyan-100 text-cyan-800' },
      supervisor: { label: 'مشرف', icon: <Award className="h-3 w-3" />, className: 'bg-orange-100 text-orange-800' },
      doctor: { label: 'طبيب', icon: <User className="h-3 w-3" />, className: 'bg-blue-100 text-blue-800' },
      nurse: { label: 'ممرض', icon: <User className="h-3 w-3" />, className: 'bg-green-100 text-green-800' },
      staff: { label: 'موظف', icon: <User className="h-3 w-3" />, className: 'bg-yellow-100 text-yellow-800' },
      agent: { label: 'وكيل', icon: <PhoneCall className="h-3 w-3" />, className: 'bg-indigo-100 text-indigo-800' },
      patient: { label: 'مريض', icon: <User className="h-3 w-3" />, className: 'bg-purple-100 text-purple-800' },
      demo: { label: 'تجريبي', icon: <Eye className="h-3 w-3" />, className: 'bg-gray-100 text-gray-800' }
    };
    
    const config = roleConfig[role as keyof typeof roleConfig] || 
                  { label: role, icon: null, className: '' };
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

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsUserDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>جاري تحميل المستخدمين...</p>
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
            <h1 className="text-3xl font-bold">إدارة المستخدمين</h1>
            <p className="text-muted-foreground">
              إدارة وتنظيم مستخدمي النظام وصلاحياتهم
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              تصدير
            </Button>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              مستخدم جديد
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي المستخدمين</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">
                مستخدمين مسجلين
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">نشط</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter(u => u.status === 'active').length}
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.round((users.filter(u => u.status === 'active').length / users.length) * 100)}% من الإجمالي
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">موثق</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter(u => u.isVerified).length}
              </div>
              <p className="text-xs text-muted-foreground">
                مستخدمين موثقين
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">آخر نشاط</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter(u => u.lastLoginAt && new Date(u.lastLoginAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)).length}
              </div>
              <p className="text-xs text-muted-foreground">
                نشط خلال 24 ساعة
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
                    placeholder="البحث في المستخدمين..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="الدور" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الأدوار</SelectItem>
                    <SelectItem value="admin">مدير النظام</SelectItem>
                    <SelectItem value="manager">مدير</SelectItem>
                    <SelectItem value="supervisor">مشرف</SelectItem>
                    <SelectItem value="doctor">طبيب</SelectItem>
                    <SelectItem value="nurse">ممرض</SelectItem>
                    <SelectItem value="staff">موظف</SelectItem>
                    <SelectItem value="agent">وكيل</SelectItem>
                    <SelectItem value="patient">مريض</SelectItem>
                    <SelectItem value="demo">تجريبي</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الحالات</SelectItem>
                    <SelectItem value="active">نشط</SelectItem>
                    <SelectItem value="inactive">غير نشط</SelectItem>
                    <SelectItem value="suspended">معلق</SelectItem>
                    <SelectItem value="pending">في الانتظار</SelectItem>
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

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>قائمة المستخدمين</CardTitle>
            <CardDescription>
              عرض وإدارة جميع مستخدمي النظام
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
                          setSelectedUsers(filteredUsers.map(u => u.id));
                        } else {
                          setSelectedUsers([]);
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>المستخدم</TableHead>
                  <TableHead>البريد الإلكتروني</TableHead>
                  <TableHead>الدور</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>القسم</TableHead>
                  <TableHead>آخر تسجيل دخول</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        checked={selectedUsers.includes(user.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers([...selectedUsers, user.id]);
                          } else {
                            setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground grid place-items-center text-sm">
                          {user.displayName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {user.displayName}
                            {user.isVerified && <Shield className="h-3 w-3 text-green-500" />}
                          </div>
                          <div className="text-sm text-muted-foreground">@{user.username}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{user.email}</div>
                      {user.phone && (
                        <div className="text-xs text-muted-foreground">{user.phone}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      {getRoleBadge(user.role)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(user.status)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {user.department || '-'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {user.position || '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.lastLoginAt ? (
                        <div>
                          <div className="text-sm">{formatDate(user.lastLoginAt)}</div>
                          <div className="text-xs text-muted-foreground">{formatTime(user.lastLoginAt)}</div>
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">لم يسجل دخول</div>
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
                          <DropdownMenuItem onClick={() => handleViewUser(user)}>
                            <Eye className="h-4 w-4 mr-2" />
                            عرض التفاصيل
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditUser(user)}>
                            <Edit className="h-4 w-4 mr-2" />
                            تعديل
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="h-4 w-4 mr-2" />
                            نسخ
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Shield className="h-4 w-4 mr-2" />
                            إدارة الصلاحيات
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Key className="h-4 w-4 mr-2" />
                            إعادة تعيين كلمة المرور
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <UserCog className="h-4 w-4 mr-2" />
                            إعدادات المستخدم
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <UserX className="h-4 w-4 mr-2" />
                            {user.status === 'active' ? 'تعطيل' : 'تفعيل'}
                          </DropdownMenuItem>
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
                عرض {filteredUsers.length} من {users.length} مستخدم
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

        {/* User Detail Dialog */}
        <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedUser?.displayName}
              </DialogTitle>
              <DialogDescription>
                تفاصيل المستخدم
              </DialogDescription>
            </DialogHeader>
            
            {selectedUser && (
              <div className="space-y-4">
                {/* User Info */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                  <div>
                    <div className="text-sm font-medium">الدور</div>
                    <div>{getRoleBadge(selectedUser.role)}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">الحالة</div>
                    <div>{getStatusBadge(selectedUser.status)}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">البريد الإلكتروني</div>
                    <div className="text-sm">{selectedUser.email}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">الهاتف</div>
                    <div className="text-sm">{selectedUser.phone || '-'}</div>
                  </div>
                </div>

                {/* Department & Position */}
                <div>
                  <div className="text-sm font-medium mb-2">المعلومات الوظيفية</div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>القسم: {selectedUser.department || '-'}</div>
                    <div>المنصب: {selectedUser.position || '-'}</div>
                  </div>
                </div>

                {/* Statistics */}
                <div>
                  <div className="text-sm font-medium mb-2">الإحصائيات</div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>إجمالي تسجيلات الدخول: {selectedUser.statistics.totalLogins}</div>
                    <div>عدد الجلسات: {selectedUser.statistics.sessionsCount}</div>
                    <div>متوسط مدة الجلسة: {selectedUser.statistics.averageSessionDuration} دقيقة</div>
                    <div>آخر نشاط: {formatDate(selectedUser.statistics.lastActivity)}</div>
                  </div>
                </div>

                {/* Preferences */}
                <div>
                  <div className="text-sm font-medium mb-2">التفضيلات</div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>اللغة: {selectedUser.preferences.language === 'ar' ? 'العربية' : 'English'}</div>
                    <div>السمة: {selectedUser.preferences.theme === 'light' ? 'فاتحة' : 'داكنة'}</div>
                    <div>الإشعارات: {selectedUser.preferences.notifications ? 'مفعلة' : 'معطلة'}</div>
                    <div>إشعارات البريد: {selectedUser.preferences.emailNotifications ? 'مفعلة' : 'معطلة'}</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => setIsUserDialogOpen(false)}>
                    إغلاق
                  </Button>
                  <Button onClick={() => handleEditUser(selectedUser)}>
                    <Edit className="h-4 w-4 mr-2" />
                    تعديل
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