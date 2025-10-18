
// User roles and permissions
export const USER_ROLES = {
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  NURSE: 'nurse',
  STAFF: 'staff',
  SUPERVISOR: 'supervisor',
  PATIENT: 'patient',
  AGENT: 'agent',
  MANAGER: 'manager',
  DEMO: 'demo',
} as const;

export const ROLE_PERMISSIONS = {
  [USER_ROLES.ADMIN]: ['*'],
  [USER_ROLES.DOCTOR]: ['read:patients', 'write:appointments', 'read:medical_records'],
  [USER_ROLES.NURSE]: ['read:patients', 'read:appointments'],
  [USER_ROLES.STAFF]: ['read:appointments', 'write:appointments'],
  [USER_ROLES.SUPERVISOR]: ['read:*', 'write:appointments'],
  [USER_ROLES.PATIENT]: ['read:own_data', 'write:own_appointments'],
  [USER_ROLES.AGENT]: ['read:appointments', 'write:appointments'],
  [USER_ROLES.MANAGER]: ['read:*', 'write:appointments', 'write:patients'],
  [USER_ROLES.DEMO]: ['read:*'],
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
