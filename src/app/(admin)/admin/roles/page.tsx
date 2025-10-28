'use client';

import React, { useState, useEffect } from 'react';
import { useT } from '@/components/providers/I18nProvider';
import { usePermissions } from '@/hooks/usePermissions';
import { ROLES, PERMISSIONS } from '@/lib/permissions';
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
import { Checkbox } from '@/components/ui/Checkbox';
import {
  Shield,
  Plus,
  Edit,
  Trash2,
  Users,
  Key,
  Search,
  Filter,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Eye,
  Copy,
  Save
} from 'lucide-react';

interface RoleWithUsers {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  level: number;
  userCount: number;
  isSystem: boolean;
}

export default function RolesPage() {
  const { t } = useT();
  const { hasPermission } = usePermissions({ userRole: 'admin' });
  const [roles, setRoles] = useState<RoleWithUsers[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleWithUsers | null>(null);
  const [expandedRoles, setExpandedRoles] = useState<Set<string>>(new Set());

  // Mock data with user counts
  useEffect(() => {
    const mockRoles: RoleWithUsers[] = [
      {
        ...ROLES.admin,
        userCount: 3,
        isSystem: true
      },
      {
        ...ROLES.manager,
        userCount: 5,
        isSystem: true
      },
      {
        ...ROLES.supervisor,
        userCount: 8,
        isSystem: true
      },
      {
        ...ROLES.doctor,
        userCount: 25,
        isSystem: true
      },
      {
        ...ROLES.nurse,
        userCount: 15,
        isSystem: true
      },
      {
        ...ROLES.staff,
        userCount: 12,
        isSystem: true
      },
      {
        ...ROLES.agent,
        userCount: 6,
        isSystem: true
      },
      {
        ...ROLES.patient,
        userCount: 1247,
        isSystem: true
      },
      {
        ...ROLES.demo,
        userCount: 1,
        isSystem: true
      }
    ];

    setRoles(mockRoles);
    setLoading(false);
  }, []);

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPermissionCategories = () => {
    const categories = new Set<string>();
    Object.values(PERMISSIONS).forEach(permission => {
      categories.add(permission.category);
    });
    return Array.from(categories).sort();
  };

  const getPermissionsByCategory = (category: string) => {
    return Object.values(PERMISSIONS).filter(permission => permission.category === category);
  };

  const getRoleBadge = (level: number) => {
    if (level >= 80) return <Badge variant="destructive">عالي</Badge>;
    if (level >= 60) return <Badge variant="default">متوسط</Badge>;
    if (level >= 40) return <Badge variant="secondary">منخفض</Badge>;
    return <Badge variant="outline">محدود</Badge>;
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

  const handleEditRole = (role: RoleWithUsers) => {
    setSelectedRole(role);
    setIsEditDialogOpen(true);
  };

  const handleCreateRole = () => {
    setSelectedRole(null);
    setIsCreateDialogOpen(true);
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
              إدارة أدوار المستخدمين والصلاحيات
            </p>
          </div>
          <div className="flex items-center gap-4">
            {hasPermission('roles:create') && (
              <Button onClick={handleCreateRole}>
                <Plus className="h-4 w-4 mr-2" />
                إضافة دور
              </Button>
            )}
            <Button variant="outline">
              <Copy className="h-4 w-4 mr-2" />
              نسخ الأدوار
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
                {roles.filter(r => !r.isSystem).length} مخصص
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">المستخدمون النشطون</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {roles.reduce((sum, role) => sum + role.userCount, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                عبر جميع الأدوار
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الصلاحيات</CardTitle>
              <Key className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Object.keys(PERMISSIONS).length}</div>
              <p className="text-xs text-muted-foreground">
                إجمالي الصلاحيات المتاحة
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الفئات</CardTitle>
              <Filter className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getPermissionCategories().length}</div>
              <p className="text-xs text-muted-foreground">
                فئات الصلاحيات
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث في الأدوار..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Roles List */}
        <div className="space-y-4">
          {filteredRoles.map((role) => (
            <Card key={role.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary text-primary-foreground grid place-items-center">
                      <Shield className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {role.name}
                        {role.isSystem && (
                          <Badge variant="outline" className="text-xs">نظام</Badge>
                        )}
                      </CardTitle>
                      <CardDescription>{role.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-medium">{role.userCount} مستخدم</div>
                      <div className="text-xs text-muted-foreground">
                        {role.permissions.length} صلاحية
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getRoleBadge(role.level)}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleRoleExpansion(role.id)}
                      >
                        {expandedRoles.has(role.id) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              {expandedRoles.has(role.id) && (
                <CardContent>
                  <div className="space-y-6">
                    {/* Permissions by Category */}
                    <div>
                      <h4 className="font-medium mb-4">الصلاحيات</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {getPermissionCategories().map(category => {
                          const categoryPermissions = getPermissionsByCategory(category);
                          const roleHasCategoryPermissions = categoryPermissions.some(permission => 
                            role.permissions.includes(permission.id)
                          );
                          
                          if (!roleHasCategoryPermissions) return null;
                          
                          return (
                            <div key={category} className="space-y-2">
                              <h5 className="font-medium text-sm text-muted-foreground">
                                {category}
                              </h5>
                              <div className="space-y-1">
                                {categoryPermissions
                                  .filter(permission => role.permissions.includes(permission.id))
                                  .map(permission => (
                                    <div key={permission.id} className="flex items-center gap-2 text-sm">
                                      <div className="h-2 w-2 rounded-full bg-green-500" />
                                      <span>{permission.name}</span>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-sm text-muted-foreground">
                        مستوى الصلاحية: {role.level}/100
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          عرض التفاصيل
                        </Button>
                        {hasPermission('roles:edit') && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditRole(role)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            تعديل
                          </Button>
                        )}
                        {hasPermission('roles:delete') && !role.isSystem && (
                          <Button variant="outline" size="sm" className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            حذف
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Create/Edit Role Dialog */}
        <Dialog open={isCreateDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
          if (!open) {
            setIsCreateDialogOpen(false);
            setIsEditDialogOpen(false);
            setSelectedRole(null);
          }
        }}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedRole ? 'تعديل الدور' : 'إضافة دور جديد'}
              </DialogTitle>
              <DialogDescription>
                {selectedRole 
                  ? 'قم بتعديل معلومات الدور والصلاحيات'
                  : 'قم بإنشاء دور جديد مع الصلاحيات المناسبة'
                }
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">اسم الدور</label>
                  <Input 
                    placeholder="مثال: مدير المبيعات" 
                    defaultValue={selectedRole?.name || ''}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">مستوى الصلاحية</label>
                  <Select defaultValue={selectedRole?.level?.toString() || '50'}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 - محدود</SelectItem>
                      <SelectItem value="20">20 - أساسي</SelectItem>
                      <SelectItem value="40">40 - متوسط</SelectItem>
                      <SelectItem value="60">60 - متقدم</SelectItem>
                      <SelectItem value="80">80 - إداري</SelectItem>
                      <SelectItem value="100">100 - مدير عام</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">وصف الدور</label>
                <Input 
                  placeholder="وصف مختصر للدور ومسؤولياته" 
                  defaultValue={selectedRole?.description || ''}
                />
              </div>

              {/* Permissions */}
              <div>
                <h4 className="font-medium mb-4">الصلاحيات</h4>
                <div className="space-y-4">
                  {getPermissionCategories().map(category => (
                    <div key={category} className="border rounded-lg p-4">
                      <h5 className="font-medium mb-3">{category}</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {getPermissionsByCategory(category).map(permission => (
                          <div key={permission.id} className="flex items-center space-x-2">
                            <Checkbox 
                              id={permission.id}
                              defaultChecked={selectedRole?.permissions.includes(permission.id) || false}
                            />
                            <label 
                              htmlFor={permission.id}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {permission.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsCreateDialogOpen(false);
                    setIsEditDialogOpen(false);
                    setSelectedRole(null);
                  }}
                >
                  إلغاء
                </Button>
                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  {selectedRole ? 'حفظ التغييرات' : 'إنشاء الدور'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}