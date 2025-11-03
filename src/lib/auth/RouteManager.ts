/**
 * Route Manager - Optimized & Simple
 * مدير المسارات - محسّن وبسيط
 * 
 * ✅ Simple business logic
 * ✅ Fast route resolution
 * ✅ Clear role mapping
 */

export interface RouteConfig {
  path: string;
  label: string;
  icon?: string;
  roles?: string[];
  permissions?: string[];
  children?: RouteConfig[];
  badge?: string;
}

/**
 * Get default route for user role - Simple & Fast
 */
export function getDefaultRoute(role: string): string {
  // Direct mapping - fastest
  const routeMap: Record<string, string> = {
    admin: '/admin/dashboard',
    manager: '/admin/dashboard',
    supervisor: '/dashboard/supervisor',
    agent: '/dashboard',
    doctor: '/dashboard/doctor',
    patient: '/dashboard/patient',
    staff: '/dashboard/staff',
    nurse: '/dashboard/staff',
    therapist: '/dashboard',
  };

  return routeMap[role] || '/dashboard';
}

/**
 * Check if user can access route - Simple Logic
 */
export function canAccessRoute(
  userRole: string,
  userPermissions: string[],
  routePath: string
): boolean {
  // Public routes - always accessible
  const publicRoutes = ['/', '/login', '/register', '/forgot-password', '/reset-password'];
  if (publicRoutes.includes(routePath)) {
    return true;
  }

  // Admin routes - only admin/manager
  if (routePath.startsWith('/admin')) {
    return userRole === 'admin' || userRole === 'manager';
  }

  // Dashboard routes - all authenticated users
  if (routePath.startsWith('/dashboard')) {
    return ['admin', 'manager', 'supervisor', 'agent', 'doctor', 'patient', 'staff'].includes(userRole);
  }

  // Profile routes - all authenticated users
  if (routePath.startsWith('/profile')) {
    return true;
  }

  // Settings - check permission
  if (routePath.startsWith('/settings')) {
    return hasPermission(userPermissions, 'settings.view') || 
           hasPermission(userPermissions, 'settings.manage') ||
           userRole === 'admin';
  }

  // Default: deny access
  return false;
}

/**
 * Get navigation routes based on user role and permissions
 */
export function getNavigationRoutes(
  userRole: string,
  userPermissions: string[]
): RouteConfig[] {
  const baseRoutes: RouteConfig[] = [
    {
      path: '/dashboard',
      label: 'لوحة التحكم',
      icon: 'dashboard',
      roles: ['admin', 'manager', 'supervisor', 'agent', 'doctor', 'patient', 'staff'],
    },
  ];

  // Admin routes
  if (userRole === 'admin' || userRole === 'manager') {
    baseRoutes.push({
      path: '/admin',
      label: 'الإدارة',
      icon: 'admin',
      roles: ['admin', 'manager'],
      children: [
        {
          path: '/admin/dashboard',
          label: 'لوحة التحكم',
          icon: 'dashboard',
        },
        {
          path: '/admin/users',
          label: 'المستخدمون',
          icon: 'users',
          permissions: ['users.read'],
        },
        {
          path: '/admin/patients',
          label: 'المرضى',
          icon: 'patients',
          permissions: ['patients.read'],
        },
        {
          path: '/admin/appointments',
          label: 'المواعيد',
          icon: 'appointments',
          permissions: ['appointments.read'],
        },
        {
          path: '/admin/settings',
          label: 'الإعدادات',
          icon: 'settings',
          permissions: ['settings.manage'],
        },
      ],
    });
  }

  // Patients routes
  if (hasPermission(userPermissions, 'patients.read')) {
    baseRoutes.push({
      path: '/patients',
      label: 'المرضى',
      icon: 'patients',
      permissions: ['patients.read'],
    });
  }

  // Appointments routes
  if (hasPermission(userPermissions, 'appointments.read')) {
    baseRoutes.push({
      path: '/appointments',
      label: 'المواعيد',
      icon: 'appointments',
      permissions: ['appointments.read'],
    });
  }

  // Reports routes
  if (hasPermission(userPermissions, 'reports.view')) {
    baseRoutes.push({
      path: '/reports',
      label: 'التقارير',
      icon: 'reports',
      permissions: ['reports.view'],
    });
  }

  // Profile - all users
  baseRoutes.push({
    path: '/profile',
    label: 'الملف الشخصي',
    icon: 'profile',
    roles: ['admin', 'manager', 'supervisor', 'agent', 'doctor', 'patient', 'staff'],
  });

  // Settings - if has permission
  if (hasPermission(userPermissions, 'settings.view')) {
    baseRoutes.push({
      path: '/settings',
      label: 'الإعدادات',
      icon: 'settings',
      permissions: ['settings.view'],
    });
  }

  // Filter routes based on role and permissions
  return baseRoutes.filter(route => {
    // Check role access
    if (route.roles && !route.roles.includes(userRole)) {
      return false;
    }

    // Check permission access
    if (route.permissions && !route.permissions.some(p => hasPermission(userPermissions, p))) {
      return false;
    }

    return true;
  });
}

/**
 * Check if user has permission - Simple & Fast
 */
function hasPermission(userPermissions: string[], permission: string): boolean {
  // Admin has all permissions
  if (userPermissions.includes('*') || userPermissions.includes('admin.access')) {
    return true;
  }

  // Direct permission match
  if (userPermissions.includes(permission)) {
    return true;
  }

  // Wildcard resource permission (e.g., "users.*" for "users.read")
  const [resource] = permission.split('.');
  if (resource && userPermissions.includes(`${resource}.*`)) {
    return true;
  }

  return false;
}
