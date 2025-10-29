/**
 * User Roles and Permissions System
 * نظام الأدوار والصلاحيات
 */

export type UserRole = 'admin' | 'doctor' | 'patient' | 'staff' | 'supervisor';

export interface Permission {
  resource: string;
  actions: ('create' | 'read' | 'update' | 'delete' | 'manage')[];
}

export const ROLES: Record<UserRole, { label: string; labelAr: string; permissions: Permission[] }> = {
  admin: {
    label: 'Administrator',
    labelAr: 'مدير النظام',
    permissions: [
      { resource: '*', actions: ['create', 'read', 'update', 'delete', 'manage'] },
    ],
  },
  doctor: {
    label: 'Doctor',
    labelAr: 'طبيب',
    permissions: [
      { resource: 'patients', actions: ['create', 'read', 'update'] },
      { resource: 'appointments', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'medical-records', actions: ['create', 'read', 'update'] },
      { resource: 'prescriptions', actions: ['create', 'read', 'update'] },
      { resource: 'messages', actions: ['create', 'read'] },
      { resource: 'profile', actions: ['read', 'update'] },
    ],
  },
  patient: {
    label: 'Patient',
    labelAr: 'مريض',
    permissions: [
      { resource: 'own-medical-records', actions: ['read'] },
      { resource: 'own-appointments', actions: ['create', 'read'] },
      { resource: 'own-profile', actions: ['read', 'update'] },
      { resource: 'messages', actions: ['create', 'read'] },
    ],
  },
  staff: {
    label: 'Staff',
    labelAr: 'موظف',
    permissions: [
      { resource: 'patients', actions: ['create', 'read', 'update'] },
      { resource: 'appointments', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'payments', actions: ['create', 'read', 'update'] },
      { resource: 'insurance', actions: ['create', 'read', 'update'] },
      { resource: 'messages', actions: ['create', 'read'] },
    ],
  },
  supervisor: {
    label: 'Supervisor',
    labelAr: 'مشرف',
    permissions: [
      { resource: 'reports', actions: ['read'] },
      { resource: 'analytics', actions: ['read'] },
      { resource: 'patients', actions: ['read'] },
      { resource: 'appointments', actions: ['read'] },
      { resource: 'performance', actions: ['read'] },
    ],
  },
};

// Default routes for each role after login
export const DEFAULT_ROUTES: Record<UserRole, string> = {
  admin: '/dashboard',
  doctor: '/dashboard/doctor',
  patient: '/dashboard/patient',
  staff: '/dashboard/staff',
  supervisor: '/dashboard/supervisor',
};

// Check if a role has a specific permission
export function hasPermission(
  role: UserRole,
  resource: string,
  action: 'create' | 'read' | 'update' | 'delete' | 'manage'
): boolean {
  const roleData = ROLES[role];
  
  if (!roleData) return false;

  // Admin has all permissions
  if (role === 'admin') return true;

  // Check specific permissions
  return roleData.permissions.some(
    p => (p.resource === resource || p.resource === '*') && p.actions.includes(action)
  );
}

// Get all permissions for a role
export function getRolePermissions(role: UserRole): Permission[] {
  return ROLES[role]?.permissions || [];
}

// Get role display name
export function getRoleLabel(role: UserRole, lang: 'en' | 'ar' = 'ar'): string {
  const roleData = ROLES[role];
  if (!roleData) return role;
  return lang === 'ar' ? roleData.labelAr : roleData.label;
}

// Export USER_ROLES for backwards compatibility
export const USER_ROLES = ROLES;
