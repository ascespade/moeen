'use client';

import { RouteGuard } from '@/components/admin/RouteGuard';
import { AdminFilterBar, AdminHeader, AdminStatsCard } from '@/components/admin/ui';
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
    Key,
    MoreHorizontal,
    PhoneCall,
    Plus,
    RefreshCw,
    Shield,
    Trash2,
    TrendingUp,
    User,
    UserCheck,
    UserCog,
    Users,
    UserX
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

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
  notes?: string;
}

interface ApiUserResponse {
  id: string;
  email: string;
  role: string;
  profile?: {
    fullName?: string;
    phone?: string;
    department?: string;
    position?: string;
  };
  avatar?: string;
  isActive: boolean;
  permissions?: string[];
  createdAt: string;
  updatedAt?: string;
  createdBy?: string;
  lastLoginAt?: string;
}

function UsersPageContent() {
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
  const [error, setError] = useState<string | null>(null);

  const getRoleDisplayName = (role: string): string => {
    const roleMap: Record<string, string> = {
      admin: 'مدير النظام',
      manager: 'مدير',
      supervisor: 'مشرف',
      doctor: 'طبيب',
      nurse: 'ممرض',
      staff: 'موظف',
      agent: 'وكيل',
      patient: 'مريض',
      demo: 'تجريبي'
    };
    return roleMap[role] || role;
  };

  // Load users data from API
  const loadUsersData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const searchParams = new URLSearchParams();
      searchParams.set('page', currentPage.toString());
      searchParams.set('limit', '20');
      if (roleFilter !== 'all') {
        searchParams.set('role', roleFilter);
      }
      if (statusFilter !== 'all') {
        searchParams.set('isActive', statusFilter === 'active' ? 'true' : 'false');
      }
      const response = await fetch(`/api/admin/users?${searchParams.toString()}`);
      const result = await response.json();

      if (result.success) {
        // Transform API data to match our User interface
        const transformedUsers: User[] = (result.data || []).map((user: ApiUserResponse) => ({
          id: user.id,
          username: user.email.split('@')[0],
          email: user.email,
          firstName: user.profile?.fullName?.split(' ')[0] || '',
          lastName: user.profile?.fullName?.split(' ').slice(1).join(' ') || '',
          displayName: user.profile?.fullName || user.email,
          phone: user.profile?.phone,
          avatar: user.avatar,
          role: user.role,
          roleDisplayName: getRoleDisplayName(user.role),
          status: user.isActive ? 'active' : 'inactive',
        isVerified: true,
          lastLoginAt: user.lastLoginAt,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt || user.createdAt,
          createdBy: user.createdBy || 'system',
          createdByName: user.createdBy || 'النظام',
          department: user.profile?.department,
          position: user.profile?.position,
          permissions: user.permissions || [],
        preferences: {
          language: 'ar',
          theme: 'light',
          notifications: true,
          emailNotifications: true,
          smsNotifications: false
        },
        statistics: {
            totalLogins: 0,
            lastActivity: user.updatedAt || user.createdAt,
            sessionsCount: 0,
            averageSessionDuration: 0
          }
        }));
        setUsers(transformedUsers);
        setTotalPages(result.pagination?.pages || Math.ceil(transformedUsers.length / 20) || 1);
      } else {
        setError('فشل في تحميل المستخدمين');
      }
    } catch (err) {
      console.error('Error loading users:', err);
      setError('حدث خطأ أثناء تحميل المستخدمين');
    } finally {
    setLoading(false);
    }
  }, [currentPage, roleFilter, statusFilter, getRoleDisplayName]);

  useEffect(() => {
    loadUsersData();
  }, [loadUsersData]);

  // Filter users client-side for search only (API handles role and status)
  const filteredUsers = users.filter(user => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return user.displayName.toLowerCase().includes(searchLower) ||
           user.email.toLowerCase().includes(searchLower) ||
           user.username.toLowerCase().includes(searchLower) ||
           (user.firstName && user.firstName.toLowerCase().includes(searchLower)) ||
           (user.lastName && user.lastName.toLowerCase().includes(searchLower));
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'نشط', variant: 'default' as const, className: 'bg-[color-mix(in_srgb,var(--brand-success)_10%,transparent)] text-[var(--brand-success)] border-[color-mix(in_srgb,var(--brand-success)_20%,transparent)]' },
      inactive: { label: 'غير نشط', variant: 'outline' as const, className: 'bg-[color-mix(in_srgb,var(--text-muted)_10%,transparent)] text-[var(--text-muted)] border-[color-mix(in_srgb,var(--text-muted)_20%,transparent)]' },
      suspended: { label: 'معلق', variant: 'error' as const, className: 'bg-[color-mix(in_srgb,var(--brand-error)_10%,transparent)] text-[var(--brand-error)] border-[color-mix(in_srgb,var(--brand-error)_20%,transparent)]' },
      pending: { label: 'في الانتظار', variant: 'secondary' as const, className: 'bg-[color-mix(in_srgb,var(--brand-warning)_10%,transparent)] text-[var(--brand-warning)] border-[color-mix(in_srgb,var(--brand-warning)_20%,transparent)]' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] ||
                  { label: status, variant: 'outline' as const, className: '' };
    return <Badge variant={config.variant} className={config.className}>{config.label}</Badge>;
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      admin: { label: 'مدير النظام', icon: <Crown className="h-3 w-3" />, className: 'bg-[color-mix(in_srgb,var(--brand-error)_10%,transparent)] text-[var(--brand-error)] border-[color-mix(in_srgb,var(--brand-error)_20%,transparent)]' },
      manager: { label: 'مدير', icon: <TrendingUp className="h-3 w-3" />, className: 'bg-[color-mix(in_srgb,var(--brand-info)_10%,transparent)] text-[var(--brand-info)] border-[color-mix(in_srgb,var(--brand-info)_20%,transparent)]' },
      supervisor: { label: 'مشرف', icon: <Award className="h-3 w-3" />, className: 'bg-[color-mix(in_srgb,var(--brand-warning)_10%,transparent)] text-[var(--brand-warning)] border-[color-mix(in_srgb,var(--brand-warning)_20%,transparent)]' },
      doctor: { label: 'طبيب', icon: <User className="h-3 w-3" />, className: 'bg-[color-mix(in_srgb,var(--brand-info)_10%,transparent)] text-[var(--brand-info)] border-[color-mix(in_srgb,var(--brand-info)_20%,transparent)]' },
      nurse: { label: 'ممرض', icon: <User className="h-3 w-3" />, className: 'bg-[color-mix(in_srgb,var(--brand-success)_10%,transparent)] text-[var(--brand-success)] border-[color-mix(in_srgb,var(--brand-success)_20%,transparent)]' },
      staff: { label: 'موظف', icon: <User className="h-3 w-3" />, className: 'bg-[color-mix(in_srgb,var(--brand-warning)_10%,transparent)] text-[var(--brand-warning)] border-[color-mix(in_srgb,var(--brand-warning)_20%,transparent)]' },
      agent: { label: 'وكيل', icon: <PhoneCall className="h-3 w-3" />, className: 'bg-[color-mix(in_srgb,var(--brand-primary)_10%,transparent)] text-[var(--brand-primary)] border-[color-mix(in_srgb,var(--brand-primary)_20%,transparent)]' },
      patient: { label: 'مريض', icon: <User className="h-3 w-3" />, className: 'bg-[color-mix(in_srgb,var(--brand-primary)_10%,transparent)] text-[var(--brand-primary)] border-[color-mix(in_srgb,var(--brand-primary)_20%,transparent)]' },
      demo: { label: 'تجريبي', icon: <Eye className="h-3 w-3" />, className: 'bg-[color-mix(in_srgb,var(--text-muted)_10%,transparent)] text-[var(--text-muted)] border-[color-mix(in_srgb,var(--text-muted)_20%,transparent)]' }
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

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="mb-4" style={{ color: 'var(--brand-error)' }}>{error}</p>
          <Button onClick={loadUsersData}>إعادة المحاولة</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <AdminHeader
        title="إدارة المستخدمين"
        description="إدارة وتنظيم مستخدمي النظام وصلاحياتهم"
      >
        <Button variant="outline" className='border-[var(--brand-border)] hover:bg-[var(--brand-primary)]/5'>
          <Download className="h-4 w-4 ml-2" />
              تصدير
            </Button>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className='bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white'
        >
          <Plus className="h-4 w-4 ml-2" />
              مستخدم جديد
            </Button>
      </AdminHeader>

      <main className="container-app py-8 space-y-8">

        {/* Stats Cards - Modern Design */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <AdminStatsCard
            title="إجمالي المستخدمين"
            value={users.length}
            subtitle="مستخدمين مسجلين"
            icon={Users}
            iconColor="var(--brand-primary)"
            trend={{
              value: 8,
              isPositive: true
            }}
          />

          <AdminStatsCard
            title="نشط"
            value={users.filter(u => u.status === 'active').length}
            subtitle={users.length > 0 ? `${Math.round((users.filter(u => u.status === 'active').length / users.length) * 100)}% من الإجمالي` : '0% من الإجمالي'}
            icon={UserCheck}
            iconColor="#10b981"
          />

          <AdminStatsCard
            title="موثق"
            value={users.filter(u => u.isVerified).length}
            subtitle="مستخدمين موثقين"
            icon={Shield}
            iconColor="#3b82f6"
          />

          <AdminStatsCard
            title="آخر نشاط"
            value={users.filter(u => u.lastLoginAt && new Date(u.lastLoginAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)).length}
            subtitle="نشط خلال 24 ساعة"
            icon={Activity}
            iconColor="#f59e0b"
          />
        </div>

        {/* Filters - Enhanced Design */}
        <AdminFilterBar
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="البحث في المستخدمين..."
          filters={[
            {
              label: "الدور",
              value: roleFilter,
              options: [
                { label: "جميع الأدوار", value: "all" },
                { label: "مدير النظام", value: "admin" },
                { label: "مدير", value: "manager" },
                { label: "مشرف", value: "supervisor" },
                { label: "طبيب", value: "doctor" },
                { label: "ممرض", value: "nurse" },
                { label: "موظف", value: "staff" },
                { label: "وكيل", value: "agent" },
                { label: "مريض", value: "patient" },
                { label: "تجريبي", value: "demo" }
              ],
              onChange: setRoleFilter
            },
            {
              label: "الحالة",
              value: statusFilter,
              options: [
                { label: "جميع الحالات", value: "all" },
                { label: "نشط", value: "active" },
                { label: "غير نشط", value: "inactive" },
                { label: "محظور", value: "suspended" },
                { label: "قيد الانتظار", value: "pending" }
              ],
              onChange: setStatusFilter
            }
          ]}
          onRefresh={loadUsersData}
        />

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>قائمة المستخدمين</CardTitle>
            <CardDescription>
              عرض وإدارة جميع مستخدمي النظام
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">لا توجد مستخدمين</p>
              </div>
            ) : (
              <>
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
                                {user.isVerified && <Shield className="h-3 w-3" style={{ color: 'var(--brand-success)' }} />}
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
              </>
            )}
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
      </main>
    </div>
  );
}

export default function UsersPage() {
  return (
    <RouteGuard
      requiredRoles={['admin', 'manager']}
      requiredPermissions={['users:view']}
    >
      <UsersPageContent />
    </RouteGuard>
  );
}
