/**
 * Unified Navigation System
 * نظام موحد للتنقل
 *
 * Centralized navigation based on user privileges
 */

import { AuthUser } from '@/lib/auth/unified-auth';
// Import client-safe permission utilities
import { hasAnyPermission } from '@/lib/permissions/utils';

export interface NavItem {
  id: string;
  label: string;
  labelAr: string;
  href: string;
  icon?: string;
  requiredRole?: string[];
  requiredPermission?: string | string[];
  children?: NavItem[];
}

/**
 * Get navigation items for user
 */
export function getNavigationItems(user: AuthUser | null): NavItem[] {
  if (!user) return [];

  const allItems: NavItem[] = [
    // Dashboard
    {
      id: 'dashboard',
      label: 'Dashboard',
      labelAr: 'لوحة التحكم',
      href: getDashboardRoute(user.role),
      requiredPermission: 'dashboard:view',
    },
    // Admin routes
    {
      id: 'admin-users',
      label: 'Users',
      labelAr: 'المستخدمون',
      href: '/admin/users',
      requiredRole: ['admin', 'manager'],
      requiredPermission: 'users:view',
    },
    {
      id: 'admin-settings',
      label: 'Settings',
      labelAr: 'الإعدادات',
      href: '/admin/settings',
      requiredRole: ['admin'],
      requiredPermission: 'settings:view',
    },
    // Patient routes
    {
      id: 'patient-appointments',
      label: 'Appointments',
      labelAr: 'المواعيد',
      href: '/patient/appointments',
      requiredRole: ['patient'],
      requiredPermission: 'appointments:view',
    },
    {
      id: 'patient-health',
      label: 'Health Records',
      labelAr: 'السجل الصحي',
      href: '/patient/health',
      requiredRole: ['patient'],
      requiredPermission: 'patients:medical_records',
    },
    // Doctor routes
    {
      id: 'doctor-patients',
      label: 'Patients',
      labelAr: 'المرضى',
      href: '/doctor/patients',
      requiredRole: ['doctor'],
      requiredPermission: 'patients:view',
    },
    {
      id: 'doctor-appointments',
      label: 'Appointments',
      labelAr: 'المواعيد',
      href: '/doctor/appointments',
      requiredRole: ['doctor'],
      requiredPermission: 'appointments:view',
    },
    // CRM
    {
      id: 'crm',
      label: 'CRM',
      labelAr: 'إدارة العملاء',
      href: '/crm',
      requiredPermission: 'crm:view',
    },
    // Chatbot
    {
      id: 'chatbot',
      label: 'AI Assistant',
      labelAr: 'المساعد الذكي',
      href: '/chatbot',
      requiredPermission: 'chatbot:view',
    },
    // Reports
    {
      id: 'reports',
      label: 'Reports',
      labelAr: 'التقارير',
      href: '/admin/reports',
      requiredPermission: 'reports:view',
    },
    // Messages
    {
      id: 'messages',
      label: 'Messages',
      labelAr: 'الرسائل',
      href: '/messages',
      requiredPermission: 'messages:view',
    },
  ];

  // Filter items based on user permissions
  return allItems.filter(item => canAccessNavItem(user, item));
}

/**
 * Check if user can access a nav item
 */
function canAccessNavItem(user: AuthUser, item: NavItem): boolean {
  // Check role
  if (item.requiredRole && item.requiredRole.length > 0) {
    if (!item.requiredRole.includes(user.role)) {
      return false;
    }
  }

  // Check permission
  if (item.requiredPermission) {
    const permissions = Array.isArray(item.requiredPermission)
      ? item.requiredPermission
      : [item.requiredPermission];

    const hasAccess = hasAnyPermission(user.permissions, permissions);
    if (!hasAccess) {
      return false;
    }
  }

  // Admin always has access
  if (user.role === 'admin') {
    return true;
  }

  return true;
}

/**
 * Get dashboard route for role
 */
function getDashboardRoute(role: string): string {
  const routes: Record<string, string> = {
    admin: '/admin/dashboard',
    supervisor: '/dashboard/supervisor',
    doctor: '/doctor-dashboard',
    patient: '/dashboard/patient',
    staff: '/dashboard/staff',
    manager: '/admin/dashboard',
    agent: '/dashboard',
    nurse: '/dashboard',
    therapist: '/dashboard',
  };

  return routes[role] || '/dashboard';
}

/**
 * Get sidebar items for user
 */
export function getSidebarItems(user: AuthUser | null): NavItem[] {
  return getNavigationItems(user);
}
