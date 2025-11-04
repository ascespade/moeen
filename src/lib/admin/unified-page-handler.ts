/**
 * Unified Page Handler for Admin Pages
 * معالج موحد لجميع صفحات Admin
 * يضمن التحقق من الصلاحيات والتحميل بشكل موحد
 */

import { getPageConfig } from './page-config';

export interface PageAccessResult {
  authorized: boolean;
  redirectTo?: string;
  reason?: string;
}

export async function checkPageAccess(
  pathname: string,
  userRole: string,
  userPermissions: string[]
): Promise<PageAccessResult> {
  const pageConfig = getPageConfig(pathname);
  
  if (!pageConfig) {
    // Page not found in config, allow access (default behavior)
    return { authorized: true };
  }

  // Check role permissions
  if (pageConfig.requiredRoles && pageConfig.requiredRoles.length > 0) {
    if (!pageConfig.requiredRoles.includes(userRole)) {
      return {
        authorized: false,
        redirectTo: '/admin/dashboard',
        reason: 'Insufficient role permissions',
      };
    }
  }

  // Check specific permissions
  if (pageConfig.requiredPermissions && pageConfig.requiredPermissions.length > 0) {
    const hasAllPermissions = pageConfig.requiredPermissions.every(permission =>
      userPermissions.includes(permission)
    );
    
    if (!hasAllPermissions) {
      return {
        authorized: false,
        redirectTo: '/admin/dashboard',
        reason: 'Insufficient permissions',
      };
    }
  }

  return { authorized: true };
}

