/**
 * Auth Utilities - Helper Functions
 * أدوات المصادقة - دوال مساعدة
 * 
 * Common utilities for authentication
 */

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sanitize email (trim and lowercase)
 */
export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Check if role is valid
 */
export function isValidRole(role: string): boolean {
  const validRoles = ['admin', 'manager', 'supervisor', 'agent', 'doctor', 'patient', 'staff'];
  return validRoles.includes(role);
}

/**
 * Get role display name
 */
export function getRoleDisplayName(role: string): string {
  const roleNames: Record<string, string> = {
    admin: 'مدير',
    manager: 'مدير',
    supervisor: 'مشرف',
    agent: 'وكيل',
    doctor: 'طبيب',
    patient: 'مريض',
    staff: 'موظف',
  };

  return roleNames[role] || role;
}
