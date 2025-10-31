'use client';

import { RouteGuard } from '@/components/admin/RouteGuard';
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
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Copy,
    Crown,
    Download,
    Edit,
    Eye,
    Filter,
    MoreHorizontal,
    Plus,
    RefreshCw,
    Search,
    Settings,
    Shield,
    Trash2,
    TrendingUp,
    User,
    Users
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface Role {
  id: string;
  name: string;
  displayName: string;
  description: string;
  permissions: string[];
  userCount: number;
  isSystem: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  createdByName: string;
  color?: string;
  icon?: string;
  priority: number;
  tags?: string[];
  notes?: string;
}

interface Permission {
  id: string;
  name: string;
  displayName: string;
  description: string;
  category: string;
  isSystem: boolean;
}

function RolesPageContent() {
  const { t } = useT();
  const { hasPermission } = usePermissions({ userRole: 'admin' });
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [expandedRoles, setExpandedRoles] = useState<Set<string>>(new Set());

  // Mock data
  useEffect(() => {
    const mockRoles: Role[] = [
      {
        id: '1',
        name: 'admin',
        displayName: 'مدير النظام',
        description: 'صلاحيات كاملة لإدارة النظام وجميع الوحدات',
        permissions: [
          'users:view', 'users:create', 'users:edit', 'users:delete',
          'roles:view', 'roles:create', 'roles:edit', 'roles:delete',
          'patients:view', 'patients:create', 'patients:edit', 'patients:delete',
          'doctors:view', 'doctors:create', 'doctors:edit', 'doctors:delete',
          'appointments:view', 'appointments:create', 'appointments:edit', 'appointments:delete',
          'reports:view', 'reports:create', 'reports:edit', 'reports:delete',
          'settings:view', 'settings:edit',
          'security:view', 'security:edit',
          'analytics:view',
          'notifications:view', 'notifications:create', 'notifications:edit', 'notifications:delete'
        ],
        userCount: 3,
        isSystem: true,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        createdBy: 'system',
        createdByName: 'النظام',
        color: '#ef4444',
        icon: 'crown',
        priority: 1,
        tags: ['نظام', 'مدير', 'صلاحيات كاملة'],
        notes: 'الدور الرئيسي لإدارة النظام'
      },
      {
        id: '2',
        name: 'doctor',
        displayName: 'طبيب',
        description: 'صلاحيات الطبيب لإدارة المرضى والمواعيد',
        permissions: [
          'patients:view', 'patients:create', 'patients:edit',
          'appointments:view', 'appointments:create', 'appointments:edit',
          'medical_records:view', 'medical_records:create', 'medical_records:edit',
          'reports:view',
          'notifications:view'
        ],
        userCount: 15,
        isSystem: true,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        createdBy: 'system',
        createdByName: 'النظام',
        color: '#3b82f6',
        icon: 'user-md',
        priority: 2,
        tags: ['طبي', 'مستخدم', 'صلاحيات محدودة'],
        notes: 'دور الطبيب الأساسي'
      },
      {
        id: '3',
        name: 'nurse',
        displayName: 'ممرض',
        description: 'صلاحيات الممرض للمساعدة في إدارة المرضى',
        permissions: [
          'patients:view', 'patients:edit',
          'appointments:view', 'appointments:edit',
          'medical_records:view', 'medical_records:create',
          'notifications:view'
        ],
        userCount: 8,
        isSystem: true,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        createdBy: 'system',
        createdByName: 'النظام',
        color: '#10b981',
        icon: 'user-nurse',
        priority: 3,
        tags: ['طبي', 'مستخدم', 'صلاحيات مساعدة'],
        notes: 'دور الممرض المساعد'
      },
      {
        id: '4',
        name: 'receptionist',
        displayName: 'موظف استقبال',
        description: 'صلاحيات موظف الاستقبال لإدارة المواعيد والمرضى',
        permissions: [
          'patients:view', 'patients:create', 'patients:edit',
          'appointments:view', 'appointments:create', 'appointments:edit', 'appointments:delete',
          'reports:view',
          'notifications:view'
        ],
        userCount: 5,
        isSystem: true,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        createdBy: 'system',
        createdByName: 'النظام',
        color: '#f59e0b',
        icon: 'user-tie',
        priority: 4,
        tags: ['إداري', 'مستخدم', 'صلاحيات استقبال'],
        notes: 'دور موظف الاستقبال'
      },
      {
        id: '5',
        name: 'patient',
        displayName: 'مريض',
        description: 'صلاحيات المريض للوصول إلى معلوماته الشخصية',
        permissions: [
          'patients:view_own',
          'appointments:view_own', 'appointments:create_own',
          'medical_records:view_own',
          'notifications:view_own'
        ],
        userCount: 1247,
        isSystem: true,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        createdBy: 'system',
        createdByName: 'النظام',
        color: '#8b5cf6',
        icon: 'user',
        priority: 5,
        tags: ['مريض', 'مستخدم', 'صلاحيات شخصية'],
        notes: 'دور المريض الأساسي'
      },
      {
        id: '6',
        name: 'manager',
        displayName: 'مدير',
        description: 'صلاحيات الإدارة الشاملة للنظام',
        permissions: [
          'dashboard:view',
          'analytics:view',
          'reports:view采收报告:export',
          'users:view', 'users:create', 'users:edit',
          'patients:view', 'patients:create', 'patients:edit',
          'doctors:view', 'doctors:create', 'doctors:edit',
          'appointments:view', 'appointments:create', 'appointments:edit', 'appointments:manage',
          'crm:view', 'crm:leads', 'crm:contacts', 'crm:deals', 'crm:activities',
          'chatbot:view', 'chatbot:flows', 'chatbot:templates', 'chatbot:analytics',
          'conversations:view', 'conversations:manage',
          'payments:view', 'payments:无障碍manage', 'payments:invoices',
          'settings:view',
          'notifications:view', 'notifications:manage',
          'messages:view', 'messages:send',
          'integrations:view',
          'performance:view',
          'profile:view', 'profile:edit',
          'dynamic_data:view', 'dynamic_data:manage',
          'flow:view', 'flow:manage',
          'review:view', 'review:manage',
          'sessions:view', 'sessions:manage', 'sessions:notes'
        ],
        userCount: 2,
        isSystem: true,
        isActive: true,
        createdAt: '2024-01-10T09:00:00Z',
        updatedAt: '2024-odia-15T10:00:00Z',
        createdBy: 'admin1',
        createdByName: 'أحمد التقني',
        color: '#06b6d4',
        icon: 'user-tie',
        priority: 6,
        tags: ['مالي', 'مخصص', 'صلاحيات مالية'],
        notes: 'دور مخصص لإدارة الشؤون المالية'
      }
    ];

    const mockPermissions: Permission[] = [
      // Users permissions
      { id: 'users:view', name: 'users:view', displayName: 'عرض المستخدمين', description: 'عرض قائمة المستخدمين', category: 'المستخدمين', isSystem: true },
      { id: 'users:create', name: 'users:create', displayName: 'إنشاء مستخدم', description: 'إنشاء مستخدم جديد', category: 'المستخدمين', isSystem: true },
      { id: 'users:edit', name: 'users:edit', displayName: 'تعديل المستخدمين', description: 'تعديل بيانات المستخدمين', category: 'المستخدمين', isSystem: true },
      { id: 'users:delete', name: 'users:delete', displayName: 'حذف المستخدمين', description: 'حذف المستخدمين', category: 'المستخدمين', isSystem: true },
      
      // Roles permissions
      { id: 'roles:view', name: 'roles:view', displayName: 'عرض الأدوار', description: 'عرض قائمة الأدوار', category: 'الأدوار', isSystem: true },
      { id: 'roles:create', name: 'roles:create', displayName: 'إنشاء دور', description: 'إنشاء دور جديد', category: 'الأدوار', isSystem: true },
      { id: 'roles:edit', name: 'roles:edit', displayName: 'تعديل الأدوار', description: 'تعديل بيانات الأدوار', category: 'الأدوار', isSystem: true },
      { id: 'roles:delete', name: 'roles:delete', displayName: 'حذف الأدوار', description: 'حذف الأدوار', category: 'الأدوار', isSystem: true },
      
      // Patients permissions
      { id: 'patients:view', name: 'patients:view', displayName: 'عرض المرضى', description: 'عرض قائمة المرضى', category: 'المرضى', isSystem: true },
      { id: 'patients:create', name: 'patients:create', displayName: 'إنشاء مريض', description: 'إنشاء مريض جديد', category: 'المرضى', isSystem: true },
      { id: 'patients:edit', name: 'patients:edit', displayName: 'تعديل المرضى', description: 'تعديل بيانات المرضى', category: 'المرضى', isSystem: true },
      { id: 'patients:delete', name: 'patients:delete', displayName: 'حذف المرضى', description: 'حذف المرضى', category: 'المرضى', isSystem: true },
      { id: 'patients:view_own', name: 'patients:view_own', displayName: 'عرض بياناته الشخصية', description: 'عرض البيانات الشخصية فقط', category: 'المرضى', isSystem: true },
      
      // Appointments permissions
      { id: 'appointments:view', name: 'appointments:view', displayName: 'عرض المواعيد', description: 'عرض قائمة المواعيد', category: 'المواعيد', isSystem: true },
      { id: 'appointments:create', name: 'appointments:create', displayName: 'إنشاء موعد', description: 'إنشاء موعد جديد', category: 'المواعيد', isSystem: true },
      { id: 'appointments:edit', name: 'appointments:edit', displayName: 'تعديل المواعيد', description: 'تعديل بيانات المواعيد', category: 'المواعيد', isSystem: true },
      { id: 'appointments:delete', name: 'appointments:delete', displayName: 'حذف المواعيد', description: 'حذف المواعيد', category: 'المواعيد', isSystem: true },
      { id: 'appointments:view_own', name: 'appointments:view_own', displayName: 'عرض مواعيده', description: 'عرض المواعيد الشخصية فقط', category: 'المواعيد', isSystem: true },
      { id: 'appointments:create_own', name: 'appointments:create_own', displayName: 'إنشاء موعد شخصي', description: 'إنشاء موعد شخصي', category: 'المواعيد', isSystem: true },
      
      // Reports permissions
      { id: 'reports:view', name: 'reports:view', displayName: 'عرض التقارير', description: 'عرض التقارير', category: 'التقارير', isSystem: true },
      { id: 'reports:create', name: 'reports:create', displayName: 'إنشاء تقرير', description: 'إنشاء تقرير جديد', category: 'التقارير', isSystem: true },
      { id: 'reports:edit', name: 'reports:edit', displayName: 'تعديل التقارير', description: 'تعديل التقارير', category: 'التقارير', isSystem: true },
      { id: 'reports:delete', name: 'reports:delete', displayName: 'حذف التقارير', description: 'حذف التقارير', category: 'التقارير', isSystem: true },
      
      // Settings permissions
      { id: 'settings:view', name: 'settings:view', displayName: 'عرض الإعدادات', description: 'عرض إعدادات النظام', category: 'الإعدادات', isSystem: true },
      { id: 'settings:edit', name: 'settings:edit', displayName: 'تعديل الإعدادات', description: 'تعديل إعدادات النظام', category: 'الإعدادات', isSystem: true },
      
      // Security permissions
      { id: 'security:view', name: 'security:view', displayName: 'عرض الأمان', description: 'عرض إعدادات الأمان', category: 'الأمان', isSystem: true },
      { id: 'security:edit', name: 'security:edit', displayName: 'تعديل الأمان', description: 'تعديل إعدادات الأمان', category: 'الأمان', isSystem: true },
      
      // Analytics permissions
      { id: 'analytics:view', name: 'analytics:view', displayName: 'عرض التحليلات', description: 'عرض التحليلات والإحصائيات', category: 'التحليلات', isSystem: true },
      
      // Notifications permissions
      { id: 'notifications:view', name: 'notifications:view', displayName: 'عرض الإشعارات', description: 'عرض الإشعارات', category: 'الإشعارات', isSystem: true },
      { id: 'notifications:create', name: 'notifications:create', displayName: 'إنشاء إشعار', description: 'إنشاء إشعار جديد', category: 'الإشعارات', isSystem: true },
      { id: 'notifications:edit', name: 'notifications:edit', displayName: 'تعديل الإشعارات', description: 'تعديل الإشعارات', category: 'الإشعارات', isSystem: true },
      { id: 'notifications:delete', name: 'notifications:delete', displayName: 'حذف الإشعارات', description: 'حذف الإشعارات', category: 'الإشعارات', isSystem: true },
      { id: 'notifications:view_own', name: 'notifications:view_own', displayName: 'عرض إشعاراته', description: 'عرض الإشعارات الشخصية فقط', category: 'الإشعارات', isSystem: true },
      
      // Medical records permissions
      { id: 'medical_records:view', name: 'medical_records:view', displayName: 'عرض السجلات الطبية', description: 'عرض السجلات الطبية', category: 'السجلات الطبية', isSystem: true },
      { id: 'medical_records:create', name: 'medical_records:create', displayName: 'إنشاء سجل طبي', description: 'إنشاء سجل طبي جديد', category: 'السجلات الطبية', isSystem: true },
      { id: 'medical_records:edit', name: 'medical_records:edit', displayName: 'تعديل السجلات الطبية', description: 'تعديل السجلات الطبية', category: 'السجلات الطبية', isSystem: true },
      { id: 'medical_records:view_own', name: 'medical_records:view_own', displayName: 'عرض سجله الطبي', description: 'عرض السجل الطبي الشخصي فقط', category: 'السجلات الطبية', isSystem: true },
      
      // Payments permissions
      { id: 'payments:view', name: 'payments:view', displayName: 'عرض المدفوعات', description: 'عرض المدفوعات', category: 'المدفوعات', isSystem: true },
      { id: 'payments:create', name: 'payments:create', displayName: 'إنشاء دفعة', description: 'إنشاء دفعة جديدة', category: 'المدفوعات', isSystem: true },
      { id: 'payments:edit', name: 'payments:edit', displayName: 'تعديل المدفوعات', description: 'تعديل المدفوعات', category: 'المدفوعات', isSystem: true },
      { id: 'payments:delete', name: 'payments:delete', displayName: 'حذف المدفوعات', description: 'حذف المدفوعات', category: 'المدفوعات', isSystem: true }
    ];

    setRoles(mockRoles);
    setPermissions(mockPermissions);
    setTotalPages(Math.ceil(mockRoles.length / 10));
    setLoading(false);
  }, []);

  const filteredRoles = roles.filter(role => {
    const matchesSearch = role.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         role.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         role.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && role.isActive) ||
                         (statusFilter === 'inactive' && !role.isActive);
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (isActive: boolean) => {
    if (isActive) {
      return <Badge variant="default" className="bg-[color-mix(in_srgb,var(--brand-success)_10%,transparent)] text-[var(--brand-success)] border-[color-mix(in_srgb,var(--brand-success)_20%,transparent)]">نشط</Badge>;
    } else {
      return <Badge variant="outline" className="bg-[color-mix(in_srgb,var(--text-muted)_10%,transparent)] text-[var(--text-muted)] border-[color-mix(in_srgb,var(--text-muted)_20%,transparent)]">غير نشط</Badge>;
    }
  };

  const getSystemBadge = (isSystem: boolean) => {
    if (isSystem) {
      return <Badge variant="secondary" className="bg-[color-mix(in_srgb,var(--brand-info)_10%,transparent)] text-[var(--brand-info)] border-[color-mix(in_srgb,var(--brand-info)_20%,transparent)]">نظام</Badge>;
    } else {
      return <Badge variant="outline" className="bg-[color-mix(in_srgb,var(--text-muted)_10%,transparent)] text-[var(--text-muted)] border-[color-mix(in_srgb,var(--text-muted)_20%,transparent)]">مخصص</Badge>;
    }
  };

  const getRoleIcon = (iconName?: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'crown': <Crown className="h-4 w-4" />,
      'user-md': <User className="h-4 w-4" />,
      'user-nurse': <User className="h-4 w-4" />,
      'user-tie': <User className="h-4 w-4" />,
      'user': <User className="h-4 w-4" />,
      'dollar-sign': <TrendingUp className="h-4 w-4" />
    };
    
    return iconMap[iconName || 'user'] || <User className="h-4 w-4" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleViewRole = (role: Role) => {
    setSelectedRole(role);
    setIsRoleDialogOpen(true);
  };

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setIsEditDialogOpen(true);
  };

  const toggleRoleExpansion = (roleId: string) => {
    const newExpanded = new Set(expandedRoles);
    if (newExpanded.has(roleId)) {
      newExpanded.delete(roleId);
    } else {
      newExpanded.add(roleId);
    }
    setExpandedRoles(newExpanded);
  };

  const getPermissionsByCategory = (permissionIds: string[]) => {
    const rolePermissions = permissions.filter(p => permissionIds.includes(p.id));
    const grouped = rolePermissions.reduce((acc, permission) => {
      if (!acc[permission.category]) {
        acc[permission.category] = [];
      }
      acc[permission.category]?.push(permission);
      return acc;
    }, {} as Record<string, Permission[]>);
    
    return grouped;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>جاري تحميل الأدوار...</p>
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
            <h1 className="text-3xl font-bold">إدارة الأدوار</h1>
            <p className="text-muted-foreground">
              إدارة وتخصيص أدوار المستخدمين وصلاحياتهم
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              تصدير
            </Button>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              دور جديد
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي الأدوار</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{roles.length}</div>
              <p className="text-xs text-muted-foreground">
                أدوار نشطة ومخصصة
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">أدوار النظام</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {roles.filter(r => r.isSystem).length}
              </div>
              <p className="text-xs text-muted-foreground">
                أدوار مدمجة في النظام
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">أدوار مخصصة</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {roles.filter(r => !r.isSystem).length}
              </div>
              <p className="text-xs text-muted-foreground">
                أدوار تم إنشاؤها مخصصة
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي المستخدمين</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {roles.reduce((sum, role) => sum + role.userCount, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                مستخدمين في جميع الأدوار
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
                    placeholder="البحث في الأدوار..."
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

        {/* Roles Table */}
        <Card>
          <CardHeader>
            <CardTitle>قائمة الأدوار</CardTitle>
            <CardDescription>
              عرض وإدارة جميع أدوار المستخدمين في النظام
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
                          setSelectedRoles(filteredRoles.map(r => r.id));
                        } else {
                          setSelectedRoles([]);
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>الدور</TableHead>
                  <TableHead>الوصف</TableHead>
                  <TableHead>النوع</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>المستخدمين</TableHead>
                  <TableHead>الصلاحيات</TableHead>
                  <TableHead>تاريخ الإنشاء</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRoles.map((role) => (
                  <React.Fragment key={role.id}>
                    <TableRow>
                      <TableCell>
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={selectedRoles.includes(role.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedRoles([...selectedRoles, role.id]);
                            } else {
                              setSelectedRoles(selectedRoles.filter(id => id !== role.id));
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div 
                            className="h-8 w-8 rounded-full grid place-items-center text-white text-sm"
                            style={{ backgroundColor: role.color || '#6b7280' }}
                          >
                            {getRoleIcon(role.icon)}
                          </div>
                          <div>
                            <div className="font-medium">{role.displayName}</div>
                            <div className="text-sm text-muted-foreground">{role.name}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm max-w-48 truncate">
                          {role.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getSystemBadge(role.isSystem)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(role.isActive)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">
                          {role.userCount} مستخدم
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {role.permissions.length} صلاحية
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleRoleExpansion(role.id)}
                          className="h-6 px-2 text-xs"
                        >
                          {expandedRoles.has(role.id) ? 'إخفاء' : 'عرض'}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatDate(role.createdAt)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          بواسطة: {role.createdByName}
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
                            <DropdownMenuItem onClick={() => handleViewRole(role)}>
                              <Eye className="h-4 w-4 mr-2" />
                              عرض التفاصيل
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditRole(role)}>
                              <Edit className="h-4 w-4 mr-2" />
                              تعديل
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="h-4 w-4 mr-2" />
                              نسخ
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Users className="h-4 w-4 mr-2" />
                              عرض المستخدمين
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Shield className="h-4 w-4 mr-2" />
                              إدارة الصلاحيات
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {!role.isSystem && (
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                حذف
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                    
                    {/* Expanded Permissions Row */}
                    {expandedRoles.has(role.id) && (
                      <TableRow>
                        <TableCell colSpan={9} className="p-0">
                          <div className="p-4 bg-muted/50">
                            <div className="text-sm font-medium mb-3">الصلاحيات المخصصة:</div>
                            <div className="space-y-4">
                              {Object.entries(getPermissionsByCategory(role.permissions)).map(([category, categoryPermissions]) => (
                                <div key={category}>
                                  <div className="text-sm font-medium text-muted-foreground mb-2">{category}</div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                    {categoryPermissions.map((permission) => (
                                      <div key={permission.id} className="flex items-center gap-2 p-2 bg-background rounded border">
                                        <CheckCircle className="h-3 w-3 text-green-500" />
                                        <span className="text-xs">{permission.displayName}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                عرض {filteredRoles.length} من {roles.length} دور
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

        {/* Role Detail Dialog */}
        <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedRole?.displayName}
              </DialogTitle>
              <DialogDescription>
                تفاصيل الدور والصلاحيات
              </DialogDescription>
            </DialogHeader>
            
            {selectedRole && (
              <div className="space-y-4">
                {/* Role Info */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                  <div>
                    <div className="text-sm font-medium">النوع</div>
                    <div>{getSystemBadge(selectedRole.isSystem)}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">الحالة</div>
                    <div>{getStatusBadge(selectedRole.isActive)}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">المستخدمين</div>
                    <div className="text-sm">{selectedRole.userCount} مستخدم</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">الصلاحيات</div>
                    <div className="text-sm">{selectedRole.permissions.length} صلاحية</div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <div className="text-sm font-medium mb-2">الوصف</div>
                  <div className="p-4 bg-muted rounded-lg">
                    {selectedRole.description}
                  </div>
                </div>

                {/* Permissions */}
                <div>
                  <div className="text-sm font-medium mb-2">الصلاحيات المخصصة</div>
                  <div className="space-y-4 max-h-64 overflow-y-auto">
                    {Object.entries(getPermissionsByCategory(selectedRole.permissions)).map(([category, categoryPermissions]) => (
                      <div key={category}>
                        <div className="text-sm font-medium text-muted-foreground mb-2">{category}</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {categoryPermissions.map((permission) => (
                            <div key={permission.id} className="flex items-center gap-2 p-2 bg-muted rounded">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              <span className="text-xs">{permission.displayName}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>
                    إغلاق
                  </Button>
                  <Button onClick={() => handleEditRole(selectedRole)}>
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

export default function RolesPage() {
  return (
    <RouteGuard
      requiredRoles={['admin']}
      requiredPermissions={['roles:view']}
    >
      <RolesPageContent />
    </RouteGuard>
  );
}