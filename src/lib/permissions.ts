/**
 * Comprehensive Permissions System
 * نظام الصلاحيات الشامل
 *
 * Defines permissions for all user roles and provides permission checking utilities
 */

import { logger } from '@/lib/monitoring/logger';

export type UserRole =
  | 'admin'
  | 'doctor'
  | 'patient'
  | 'staff'
  | 'supervisor'
  | 'manager'
  | 'therapist'
  | 'nurse'
  | 'agent';

export type Permission = string;
export type Resource = string;
export type Action =
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'manage'
  | 'approve'
  | 'reject';

export interface RolePermission {
  resource: Resource;
  actions: Action[];
  conditions?: {
    ownOnly?: boolean; // Can only access own resources
    departmentOnly?: boolean; // Can only access department resources
    readOnly?: boolean; // Can only read
  };
}

/**
 * Comprehensive permissions for all roles
 */
export const ROLE_PERMISSIONS: Record<UserRole, RolePermission[]> = {
  admin: [
    {
      resource: '*',
      actions: ['create', 'read', 'update', 'delete', 'manage'],
    },
  ],

  doctor: [
    {
      resource: 'patients',
      actions: ['read', 'update'],
      conditions: { ownOnly: true },
    },
    {
      resource: 'appointments',
      actions: ['create', 'read', 'update', 'delete'],
      conditions: { ownOnly: true },
    },
    {
      resource: 'medical-records',
      actions: ['create', 'read', 'update'],
      conditions: { ownOnly: true },
    },
    {
      resource: 'prescriptions',
      actions: ['create', 'read', 'update'],
      conditions: { ownOnly: true },
    },
    {
      resource: 'insurance-claims',
      actions: ['create', 'read'],
      conditions: { ownOnly: true },
    },
    { resource: 'messages', actions: ['create', 'read'] },
    { resource: 'profile', actions: ['read', 'update'] },
    {
      resource: 'sessions',
      actions: ['create', 'read', 'update'],
      conditions: { ownOnly: true },
    },
  ],

  patient: [
    { resource: 'own-medical-records', actions: ['read'] },
    { resource: 'own-appointments', actions: ['create', 'read'] },
    { resource: 'own-profile', actions: ['read', 'update'] },
    { resource: 'own-payments', actions: ['read'] },
    { resource: 'own-insurance-claims', actions: ['read'] },
    { resource: 'messages', actions: ['create', 'read'] },
    { resource: 'chatbot', actions: ['create', 'read'] },
  ],

  staff: [
    { resource: 'patients', actions: ['create', 'read', 'update'] },
    {
      resource: 'appointments',
      actions: ['create', 'read', 'update', 'delete'],
    },
    { resource: 'payments', actions: ['create', 'read', 'update'] },
    { resource: 'insurance-claims', actions: ['create', 'read', 'update'] },
    { resource: 'messages', actions: ['create', 'read'] },
    { resource: 'profile', actions: ['read', 'update'] },
    { resource: 'check-in', actions: ['create', 'update'] },
  ],

  supervisor: [
    { resource: 'reports', actions: ['read'] },
    { resource: 'analytics', actions: ['read'] },
    { resource: 'patients', actions: ['read'] },
    { resource: 'appointments', actions: ['read'] },
    { resource: 'performance', actions: ['read'] },
    { resource: 'insurance-claims', actions: ['read'] },
    { resource: 'payments', actions: ['read'] },
    { resource: 'profile', actions: ['read', 'update'] },
  ],

  manager: [
    {
      resource: 'users',
      actions: ['create', 'read', 'update'],
      conditions: { departmentOnly: true },
    },
    {
      resource: 'patients',
      actions: ['read'],
      conditions: { departmentOnly: true },
    },
    {
      resource: 'appointments',
      actions: ['read'],
      conditions: { departmentOnly: true },
    },
    {
      resource: 'reports',
      actions: ['read'],
      conditions: { departmentOnly: true },
    },
    {
      resource: 'settings',
      actions: ['read', 'update'],
      conditions: { departmentOnly: true },
    },
    { resource: 'profile', actions: ['read', 'update'] },
  ],

  therapist: [
    {
      resource: 'patients',
      actions: ['read', 'update'],
      conditions: { ownOnly: true },
    },
    {
      resource: 'appointments',
      actions: ['create', 'read', 'update'],
      conditions: { ownOnly: true },
    },
    {
      resource: 'medical-records',
      actions: ['create', 'read', 'update'],
      conditions: { ownOnly: true },
    },
    { resource: 'messages', actions: ['create', 'read'] },
    { resource: 'profile', actions: ['read', 'update'] },
    {
      resource: 'sessions',
      actions: ['create', 'read', 'update'],
      conditions: { ownOnly: true },
    },
  ],

  nurse: [
    { resource: 'patients', actions: ['read'], conditions: { ownOnly: true } },
    {
      resource: 'appointments',
      actions: ['read'],
      conditions: { ownOnly: true },
    },
    {
      resource: 'medical-records',
      actions: ['read', 'update'],
      conditions: { ownOnly: true, readOnly: true },
    },
    { resource: 'medications', actions: ['read', 'update'] },
    { resource: 'messages', actions: ['create', 'read'] },
    { resource: 'profile', actions: ['read', 'update'] },
  ],

  agent: [
    { resource: 'chatbot', actions: ['create', 'read', 'update'] },
    { resource: 'messages', actions: ['create', 'read'] },
    { resource: 'profile', actions: ['read', 'update'] },
  ],
};

/**
 * Default routes for each role after login
 */
export const DEFAULT_ROUTES: Record<UserRole, string> = {
  admin: '/admin/dashboard',
  doctor: '/doctor/doctor-dashboard',
  patient: '/patient/patient-dashboard',
  staff: '/staff/staff-dashboard',
  supervisor: '/supervisor/supervisor-dashboard',
  manager: '/admin/dashboard',
  therapist: '/doctor/doctor-dashboard',
  nurse: '/staff/staff-dashboard',
  agent: '/admin/dashboard',
};

/**
 * Permission Manager Class
 * Manages permission checking and validation
 */
export class PermissionManager {
  /**
   * Check if a role has permission for a resource and action
   */
  static hasPermission(
    role: UserRole,
    resource: Resource,
    action: Action,
    context?: {
      userId?: string;
      resourceOwnerId?: string;
      departmentId?: string;
      userDepartmentId?: string;
    }
  ): boolean {
    // Admin has all permissions
    if (role === 'admin') return true;

    const rolePermissions = ROLE_PERMISSIONS[role] || [];

    for (const perm of rolePermissions) {
      // Check wildcard permissions
      if (perm.resource === '*') {
        return true;
      }

      // Check exact resource match
      if (perm.resource === resource && perm.actions.includes(action)) {
        // Check conditions
        if (perm.conditions) {
          // Check ownOnly condition
          if (perm.conditions.ownOnly && context) {
            if (context.userId && context.resourceOwnerId) {
              if (context.userId !== context.resourceOwnerId) {
                return false;
              }
            }
          }

          // Check readOnly condition
          if (perm.conditions.readOnly && action !== 'read') {
            return false;
          }

          // Check departmentOnly condition
          if (perm.conditions.departmentOnly && context) {
            if (context.departmentId && context.userDepartmentId) {
              if (context.departmentId !== context.userDepartmentId) {
                return false;
              }
            }
          }
        }

        return true;
      }
    }

    return false;
  }

  /**
   * Get all permissions for a role
   */
  static getRolePermissions(role: UserRole): RolePermission[] {
    return ROLE_PERMISSIONS[role] || [];
  }

  /**
   * Get all resources a role can access
   */
  static getAccessibleResources(role: UserRole): Resource[] {
    const permissions = ROLE_PERMISSIONS[role] || [];
    return permissions.map(p => (p.resource === '*' ? '*' : p.resource));
  }

  /**
   * Get all actions a role can perform on a resource
   */
  static getResourceActions(role: UserRole, resource: Resource): Action[] {
    if (role === 'admin') {
      return [
        'create',
        'read',
        'update',
        'delete',
        'manage',
        'approve',
        'reject',
      ];
    }

    const permissions = ROLE_PERMISSIONS[role] || [];
    const actions: Action[] = [];

    for (const perm of permissions) {
      if (perm.resource === '*' || perm.resource === resource) {
        actions.push(...perm.actions);
      }
    }

    return [...new Set(actions)]; // Remove duplicates
  }

  /**
   * Get default route for a role
   */
  static getDefaultRoute(role: UserRole): string {
    return DEFAULT_ROUTES[role] || '/login';
  }

  /**
   * Check if role can access a specific route
   */
  static canAccessRoute(role: UserRole, route: string): boolean {
    const _defaultRoute = DEFAULT_ROUTES[role];

    // Admin can access all routes
    if (role === 'admin') return true;

    // Check if route matches role's allowed routes
    const roleRoutes: Record<UserRole, string[]> = {
      admin: ['/admin'],
      doctor: ['/doctor', '/health'],
      patient: ['/patient', '/health'],
      staff: ['/staff', '/admin/appointments', '/admin/patients'],
      supervisor: ['/supervisor', '/admin/reports', '/admin/analytics'],
      manager: ['/admin'],
      therapist: ['/doctor', '/health'],
      nurse: ['/staff', '/health'],
      agent: ['/admin', '/chatbot'],
    };

    const allowedRoutes = roleRoutes[role] || [];
    return allowedRoutes.some(allowed => route.startsWith(allowed));
  }
}

/**
 * Helper functions for backward compatibility
 */
export function hasPermission(
  role: UserRole,
  _resource: Resource,
  _action: Action
): boolean {
  // Use basic permission check - admin has all permissions
  if (role === 'admin') return true;
  // For other roles, check against role permissions (simplified check)
  // This is a simplified version - full check should use PermissionManager in server-side code
  return false; // Simplified - should check against actual role permissions
}

// Note: This function is deprecated - use API endpoint /api/permissions/role/[roleId] instead
// Kept for backward compatibility but should not be used in client components
export async function getRolePermissions(role: UserRole): Promise<RolePermission[]> {
  // Use API endpoint for client-side compatibility
  if (typeof window !== 'undefined') {
    try {
      const response = await fetch(`/api/permissions/role/${role}`);
      const data = await response.json();
      if (data.success && data.permissions) {
        return data.permissions.map((code: string) => ({
          resource: code.split(':')[0] as Resource,
          action: code.split(':')[1] as Action,
        }));
      }
    } catch (e) {
      logger.error('Failed to fetch permissions from API:', e);
    }
    return [];
  }

  // Server-side: use API endpoint or fetch from database
  // For now, return empty array - should be fetched from API endpoint
  // This prevents importing server-side code in client bundle
  return [];
}

export function getRoleLabel(role: UserRole, lang: 'en' | 'ar' = 'ar'): string {
  const labels: Record<UserRole, { en: string; ar: string }> = {
    admin: { en: 'Administrator', ar: 'مدير النظام' },
    doctor: { en: 'Doctor', ar: 'طبيب' },
    patient: { en: 'Patient', ar: 'مريض' },
    staff: { en: 'Staff', ar: 'موظف إداري' },
    supervisor: { en: 'Supervisor', ar: 'مشرف' },
    manager: { en: 'Manager', ar: 'مدير' },
    therapist: { en: 'Therapist', ar: 'معالج' },
    nurse: { en: 'Nurse', ar: 'ممرض/ممرضة' },
    agent: { en: 'Agent', ar: 'وكيل' },
  };

  return labels[role]?.[lang] || role;
}

// Export for backward compatibility
export const ROLES = ROLE_PERMISSIONS;
export const USER_ROLES = ROLE_PERMISSIONS;
