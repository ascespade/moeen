/**
 * User Roles System - نظام الأدوار
 * Canonical definition of all user roles in the system
 * This file is the single source of truth for role definitions
 */

// Role hierarchy levels (higher number = more permissions)
export const ROLE_HIERARCHY = {
  admin: 100,
  manager: 80,
  supervisor: 60,
  doctor: 40,
  nurse: 30,
  staff: 20,
  agent: 15,
  patient: 10,
  demo: 5,
} as const;

// Role Arabic display names
export const ROLE_DISPLAY_NAMES = {
  admin: 'مدير النظام',
  manager: 'مدير',
  supervisor: 'مشرف',
  doctor: 'طبيب',
  nurse: 'ممرض',
  staff: 'موظف',
  agent: 'وكيل',
  patient: 'مريض',
  demo: 'تجريبي',
} as const;

// Role descriptions
export const ROLE_DESCRIPTIONS = {
  admin: 'مدير النظام - صلاحيات كاملة على جميع الوحدات',
  manager: 'مدير - صلاحيات إدارية شاملة',
  supervisor: 'مشرف - صلاحيات إشرافية وإدارية محدودة',
  doctor: 'طبيب/معالج - إدارة المرضى والجلسات',
  nurse: 'ممرض - إدارة المرضى والجلسات محدودة',
  staff: 'موظف - صلاحيات أساسية للعمليات اليومية',
  agent: 'وكيل خدمة العملاء - إدارة المحادثات والطلبات',
  patient: 'مريض - الوصول إلى البيانات الخاصة',
  demo: 'مستخدم تجريبي - صلاحيات عرض فقط',
} as const;

// User roles enumeration - THE CANONICAL SOURCE OF TRUTH
export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  SUPERVISOR: 'supervisor',
  DOCTOR: 'doctor',
  NURSE: 'nurse',
  STAFF: 'staff',
  AGENT: 'agent',
  PATIENT: 'patient',
  DEMO: 'demo',
} as const;

// Export the UserRole type
export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

// Role permission mappings (basic structure - detailed permissions in permissions system)
export const ROLE_PERMISSIONS = {
  [USER_ROLES.ADMIN]: ['*'], // Full access
  [USER_ROLES.MANAGER]: ['read:*', 'write:*', 'manage:users', 'manage:appointments'],
  [USER_ROLES.SUPERVISOR]: ['read:*', 'write:appointments', 'manage:patients'],
  [USER_ROLES.DOCTOR]: ['read:patients', 'write:appointments', 'read:medical_records', 'manage:sessions'],
  [USER_ROLES.NURSE]: ['read:patients', 'read:appointments', 'read:medical_records'],
  [USER_ROLES.STAFF]: ['read:appointments', 'write:appointments', 'manage:booking'],
  [USER_ROLES.AGENT]: ['read:appointments', 'write:appointments', 'manage:conversations'],
  [USER_ROLES.PATIENT]: ['read:own_data', 'write:own_appointments', 'read:own_records'],
  [USER_ROLES.DEMO]: ['read:*'], // Read-only
} as const;

// Helper function to get role level
export function getRoleLevel(role: UserRole): number {
  return ROLE_HIERARCHY[role] || 0;
}

// Helper function to get role display name
export function getRoleDisplayName(role: UserRole): string {
  return ROLE_DISPLAY_NAMES[role] || role;
}

// Helper function to get role description
export function getRoleDescription(role: UserRole): string {
  return ROLE_DESCRIPTIONS[role] || '';
}

// Check if role has higher or equal permission level
export function hasRoleLevel(userRole: UserRole, requiredRole: UserRole): boolean {
  return getRoleLevel(userRole) >= getRoleLevel(requiredRole);
}
