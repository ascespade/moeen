/**
 * Roles - User Roles and Permissions
 * الأدوار - أدوار المستخدمين والصلاحيات
 * 
 * All user roles and their definitions
 */

export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  THERAPIST: 'therapist',
  PATIENT: 'patient',
  STAFF: 'staff',
  SUPERVISOR: 'supervisor',
  USER: 'user',
} as const;

export const ROLE_LABELS: Record<string, string> = {
  [ROLES.SUPER_ADMIN]: 'مدير النظام',
  [ROLES.ADMIN]: 'مدير',
  [ROLES.DOCTOR]: 'طبيب',
  [ROLES.THERAPIST]: 'أخصائي علاج',
  [ROLES.PATIENT]: 'مريض',
  [ROLES.STAFF]: 'موظف',
  [ROLES.SUPERVISOR]: 'مشرف',
  [ROLES.USER]: 'مستخدم',
} as const;

export const ROLE_HIERARCHY: Record<string, number> = {
  [ROLES.SUPER_ADMIN]: 100,
  [ROLES.ADMIN]: 90,
  [ROLES.SUPERVISOR]: 80,
  [ROLES.DOCTOR]: 70,
  [ROLES.THERAPIST]: 60,
  [ROLES.STAFF]: 50,
  [ROLES.USER]: 40,
  [ROLES.PATIENT]: 30,
} as const;

// Helper functions
export function getRoleLabel(role: string): string {
  return ROLE_LABELS[role] || role;
}

export function hasRoleAccess(userRole: string, requiredRole: string): boolean {
  const userLevel = ROLE_HIERARCHY[userRole] || 0;
  const requiredLevel = ROLE_HIERARCHY[requiredRole] || 0;
  return userLevel >= requiredLevel;
}

export function isAdmin(role: string): boolean {
  return role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN;
}

export function isStaff(role: string): boolean {
  const staffRoles: string[] = [
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.DOCTOR,
    ROLES.THERAPIST,
    ROLES.STAFF,
    ROLES.SUPERVISOR,
  ];
  return staffRoles.includes(role);
}

// Type exports
export type Role = typeof ROLES[keyof typeof ROLES];
