/**
 * Permissions - User Permissions
 * الصلاحيات - صلاحيات المستخدمين
 * 
 * All permissions defined here
 */

import { ROLES } from './roles';

export const PERMISSIONS = {
  // User Management
  USERS_VIEW: 'users.view',
  USERS_CREATE: 'users.create',
  USERS_UPDATE: 'users.update',
  USERS_DELETE: 'users.delete',

  // Patient Management
  PATIENTS_VIEW: 'patients.view',
  PATIENTS_CREATE: 'patients.create',
  PATIENTS_UPDATE: 'patients.update',
  PATIENTS_DELETE: 'patients.delete',

  // Doctor Management
  DOCTORS_VIEW: 'doctors.view',
  DOCTORS_CREATE: 'doctors.create',
  DOCTORS_UPDATE: 'doctors.update',
  DOCTORS_DELETE: 'doctors.delete',

  // Appointment Management
  APPOINTMENTS_VIEW: 'appointments.view',
  APPOINTMENTS_CREATE: 'appointments.create',
  APPOINTMENTS_UPDATE: 'appointments.update',
  APPOINTMENTS_DELETE: 'appointments.delete',
  APPOINTMENTS_BOOK: 'appointments.book',

  // Admin Permissions
  ADMIN_VIEW: 'admin.view',
  ADMIN_SETTINGS: 'admin.settings',
  ADMIN_ANALYTICS: 'admin.analytics',
  ADMIN_SECURITY: 'admin.security',

  // CRM Permissions
  CRM_VIEW: 'crm.view',
  CRM_CONTACTS: 'crm.contacts',
  CRM_LEADS: 'crm.leads',
  CRM_DEALS: 'crm.deals',

  // Insurance Permissions
  INSURANCE_VIEW: 'insurance.view',
  INSURANCE_CLAIMS: 'insurance.claims',
  INSURANCE_APPROVE: 'insurance.approve',

  // Reports
  REPORTS_VIEW: 'reports.view',
  REPORTS_EXPORT: 'reports.export',
} as const;

// Role-Permission Mapping
export const ROLE_PERMISSIONS: Record<string, string[]> = {
  [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),
  [ROLES.ADMIN]: [
    PERMISSIONS.USERS_VIEW,
    PERMISSIONS.USERS_CREATE,
    PERMISSIONS.USERS_UPDATE,
    PERMISSIONS.PATIENTS_VIEW,
    PERMISSIONS.PATIENTS_CREATE,
    PERMISSIONS.PATIENTS_UPDATE,
    PERMISSIONS.DOCTORS_VIEW,
    PERMISSIONS.DOCTORS_CREATE,
    PERMISSIONS.DOCTORS_UPDATE,
    PERMISSIONS.APPOINTMENTS_VIEW,
    PERMISSIONS.APPOINTMENTS_CREATE,
    PERMISSIONS.APPOINTMENTS_UPDATE,
    PERMISSIONS.ADMIN_VIEW,
    PERMISSIONS.ADMIN_ANALYTICS,
    PERMISSIONS.CRM_VIEW,
    PERMISSIONS.CRM_CONTACTS,
    PERMISSIONS.INSURANCE_VIEW,
    PERMISSIONS.INSURANCE_CLAIMS,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.REPORTS_EXPORT,
  ],
  [ROLES.DOCTOR]: [
    PERMISSIONS.PATIENTS_VIEW,
    PERMISSIONS.PATIENTS_UPDATE,
    PERMISSIONS.APPOINTMENTS_VIEW,
    PERMISSIONS.APPOINTMENTS_CREATE,
    PERMISSIONS.APPOINTMENTS_UPDATE,
    PERMISSIONS.REPORTS_VIEW,
  ],
  [ROLES.THERAPIST]: [
    PERMISSIONS.PATIENTS_VIEW,
    PERMISSIONS.APPOINTMENTS_VIEW,
    PERMISSIONS.APPOINTMENTS_CREATE,
    PERMISSIONS.APPOINTMENTS_UPDATE,
  ],
  [ROLES.STAFF]: [
    PERMISSIONS.PATIENTS_VIEW,
    PERMISSIONS.APPOINTMENTS_VIEW,
    PERMISSIONS.APPOINTMENTS_CREATE,
  ],
  [ROLES.PATIENT]: [
    PERMISSIONS.APPOINTMENTS_VIEW,
    PERMISSIONS.APPOINTMENTS_BOOK,
  ],
  [ROLES.USER]: [],
} as const;

// Helper functions
export function hasPermission(role: string, permission: string): boolean {
  const rolePermissions = ROLE_PERMISSIONS[role] || [];
  return rolePermissions.includes(permission);
}

export function getRolePermissions(role: string): string[] {
  return ROLE_PERMISSIONS[role] || [];
}

// Type exports
export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];
