/**
 * Unified Page Guard System
 * نظام موحد لحماية الصفحات والتحقق من الصلاحيات
 *
 * يوحد جميع أنظمة الحماية في نظام واحد مركزي
 * - لا يعيد تحميل الصفحة (SPA navigation)
 * - يعرض رسائل خطأ واضحة
 * - يدعم الصلاحيات والأدوار
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';
import { getPageConfig } from '@/lib/admin/page-config';
import { getDefaultRoute } from '@/lib/auth/RouteManager';

export interface PageGuardProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
  requiredRoles?: string[];
  pageKey?: string;
  fallback?: React.ReactNode;
  showError?: boolean;
  redirectOnUnauthorized?: boolean;
}

export interface PageAccessResult {
  authorized: boolean;
  reason?: 'not_authenticated' | 'insufficient_role' | 'insufficient_permissions';
  missingPermissions?: string[];
  missingRoles?: string[];
}

/**
 * Unified Page Guard Component
 * Component موحد لحماية جميع الصفحات
 */
export function UnifiedPageGuard({
  children,
  requiredPermissions = [],
  requiredRoles = [],
  pageKey,
  fallback,
  showError = true,
  redirectOnUnauthorized = false,
}: PageGuardProps) {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { hasPermission, loading: permissionsLoading } = usePermissions({
    userRole: user?.role || '',
  });
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [accessResult, setAccessResult] = useState<PageAccessResult | null>(null);

  // Check page access
  const checkPageAccess = useCallback((): PageAccessResult => {
    // Not authenticated
    if (!isAuthenticated || !user) {
      return {
        authorized: false,
        reason: 'not_authenticated',
      };
    }

    // Get page config from pathname or pageKey
    const pageConfig = pageKey
      ? Object.values(require('@/lib/admin/page-config').ADMIN_PAGES).find(
          p => p.path === pageKey
        )
      : getPageConfig(pathname);

    // Merge required permissions and roles
    const finalRequiredPermissions =
      requiredPermissions.length > 0
        ? requiredPermissions
        : (pageConfig?.requiredPermissions || []);
    const finalRequiredRoles =
      requiredRoles.length > 0
        ? requiredRoles
        : (pageConfig?.requiredRoles || []);

    // Check role permissions
    if (finalRequiredRoles.length > 0) {
      if (!finalRequiredRoles.includes(user.role)) {
        return {
          authorized: false,
          reason: 'insufficient_role',
          missingRoles: finalRequiredRoles.filter(r => r !== user.role),
        };
      }
    }

    // Check specific permissions
    if (finalRequiredPermissions.length > 0) {
      const missingPermissions: string[] = [];
      const hasAllPermissions = finalRequiredPermissions.every(permission => {
        const has = hasPermission(permission);
        if (!has) {
          missingPermissions.push(permission);
        }
        return has;
      });

      if (!hasAllPermissions) {
        return {
          authorized: false,
          reason: 'insufficient_permissions',
          missingPermissions,
        };
      }
    }

    return { authorized: true };
  }, [
    isAuthenticated,
    user,
    pathname,
    pageKey,
    requiredPermissions,
    requiredRoles,
    hasPermission,
  ]);

  useEffect(() => {
    // Wait for auth and permissions to finish loading
    if (authLoading || permissionsLoading) {
      return;
    }

    setIsChecking(false);

    // Check authentication
    if (!isAuthenticated || !user) {
      // Use Next.js router for client-side navigation (no refresh)
      if (redirectOnUnauthorized && pathname !== '/login') {
        router.push('/login');
      }
      setAccessResult({
        authorized: false,
        reason: 'not_authenticated',
      });
      setIsAuthorized(false);
      return;
    }

    // Check page access
    const result = checkPageAccess();
    setAccessResult(result);

    if (result.authorized) {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);

      // Redirect if configured
      if (redirectOnUnauthorized) {
        const defaultRoute = getDefaultRoute(user.role);
        if (pathname !== defaultRoute) {
          router.push(defaultRoute);
        }
      }
    }
  }, [
    authLoading,
    permissionsLoading,
    isAuthenticated,
    user,
    pathname,
    checkPageAccess,
    router,
    redirectOnUnauthorized,
  ]);

  // Show loading state
  if (isChecking) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <div className='mb-4 h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-blue-600 mx-auto'></div>
          <p className='text-sm text-gray-600'>جاري التحقق من الصلاحيات...</p>
        </div>
      </div>
    );
  }

  // Show error message if not authorized
  if (!isAuthorized && showError && !redirectOnUnauthorized) {
    const errorFallback = fallback || (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center max-w-md'>
          <div className='mb-4 text-6xl'>🔒</div>
          <h2 className='text-2xl font-bold text-gray-900 mb-2'>غير مصرح لك</h2>
          <p className='text-gray-600 mb-4'>
            {accessResult?.reason === 'not_authenticated'
              ? 'يجب تسجيل الدخول للوصول إلى هذه الصفحة'
              : accessResult?.reason === 'insufficient_role'
                ? 'ليس لديك الدور المطلوب للوصول إلى هذه الصفحة'
                : accessResult?.reason === 'insufficient_permissions'
                  ? 'ليس لديك الصلاحيات المطلوبة للوصول إلى هذه الصفحة'
                  : 'ليس لديك صلاحية للوصول إلى هذه الصفحة'}
          </p>
          {accessResult?.missingPermissions && accessResult.missingPermissions.length > 0 && (
            <div className='mb-4 p-3 bg-gray-50 rounded-lg'>
              <p className='text-sm font-medium text-gray-700 mb-2'>الصلاحيات المطلوبة:</p>
              <ul className='text-sm text-gray-600 space-y-1'>
                {accessResult.missingPermissions.map((perm, index) => (
                  <li key={index}>• {perm}</li>
                ))}
              </ul>
            </div>
          )}
          {accessResult?.missingRoles && accessResult.missingRoles.length > 0 && (
            <div className='mb-4 p-3 bg-gray-50 rounded-lg'>
              <p className='text-sm font-medium text-gray-700 mb-2'>الأدوار المطلوبة:</p>
              <ul className='text-sm text-gray-600 space-y-1'>
                {accessResult.missingRoles.map((role, index) => (
                  <li key={index}>• {role}</li>
                ))}
              </ul>
            </div>
          )}
          <button
            onClick={() => {
              if (user) {
                const defaultRoute = getDefaultRoute(user.role);
                router.push(defaultRoute);
              } else {
                router.push('/login');
              }
            }}
            className='px-4 py-2 bg-[var(--default-default)] text-white rounded-lg hover:brightness-95 transition-colors'
          >
            {user ? 'العودة إلى لوحة التحكم' : 'تسجيل الدخول'}
          </button>
        </div>
      </div>
    );

    return <>{errorFallback}</>;
  }

  // Authorized - render children
  if (isAuthorized) {
    return <>{children}</>;
  }

  // Not authorized but redirecting or no error shown
  return null;
}

/**
 * Hook to check page access programmatically
 * Hook للتحقق من صلاحية الوصول للصفحة برمجياً
 */
export function usePageAccess(
  requiredPermissions?: string[],
  requiredRoles?: string[]
): {
  isAuthorized: boolean;
  isLoading: boolean;
  accessResult: PageAccessResult | null;
} {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const pathname = usePathname();
  const { hasPermission, loading: permissionsLoading } = usePermissions({
    userRole: user?.role || '',
  });
  const [accessResult, setAccessResult] = useState<PageAccessResult | null>(null);

  useEffect(() => {
    if (authLoading || permissionsLoading) {
      return;
    }

    if (!isAuthenticated || !user) {
      setAccessResult({
        authorized: false,
        reason: 'not_authenticated',
      });
      return;
    }

    const pageConfig = getPageConfig(pathname);
    const finalRequiredPermissions =
      requiredPermissions || pageConfig?.requiredPermissions || [];
    const finalRequiredRoles = requiredRoles || pageConfig?.requiredRoles || [];

    // Check roles
    if (finalRequiredRoles.length > 0 && !finalRequiredRoles.includes(user.role)) {
      setAccessResult({
        authorized: false,
        reason: 'insufficient_role',
        missingRoles: finalRequiredRoles.filter(r => r !== user.role),
      });
      return;
    }

    // Check permissions
    if (finalRequiredPermissions.length > 0) {
      const missingPermissions: string[] = [];
      const hasAll = finalRequiredPermissions.every(permission => {
        const has = hasPermission(permission);
        if (!has) missingPermissions.push(permission);
        return has;
      });

      if (!hasAll) {
        setAccessResult({
          authorized: false,
          reason: 'insufficient_permissions',
          missingPermissions,
        });
        return;
      }
    }

    setAccessResult({ authorized: true });
  }, [
    authLoading,
    permissionsLoading,
    isAuthenticated,
    user,
    pathname,
    requiredPermissions,
    requiredRoles,
    hasPermission,
  ]);

  return {
    isAuthorized: accessResult?.authorized || false,
    isLoading: authLoading || permissionsLoading,
    accessResult,
  };
}


