/**
 * Unified Protected Route Component
 * Component موحد لحماية الصفحات
 *
 * Simplified route protection using unified auth system
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import { LoadingSpinner } from '@/components/ui';
import { getDefaultRoute } from '@/lib/auth/unified-auth';

interface UnifiedProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  requiredPermissions?: string | string[];
  fallback?: React.ReactNode;
}

export default function UnifiedProtectedRoute({
  children,
  allowedRoles = [],
  requiredPermissions,
  fallback,
}: UnifiedProtectedRouteProps) {
  const { user, isAuthenticated, isLoading, _hasPermission, hasAnyPermission } =
    useUnifiedAuth();
  const router = useRouter();
  const _pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    // Wait for auth to load
    if (isLoading) {
      return;
    }

    // Not authenticated - redirect to login
    if (!isAuthenticated || !user) {
      setHasChecked(true);
      setIsAuthorized(false);
      router.push('/login');
      return;
    }

    // Check role-based access
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      setHasChecked(true);
      setIsAuthorized(false);
      // Redirect to default route for user's role
      const defaultRoute = getDefaultRoute(user.role);
      router.push(defaultRoute);
      return;
    }

    // Check permission-based access
    if (requiredPermissions) {
      const permissionsArray = Array.isArray(requiredPermissions)
        ? requiredPermissions
        : [requiredPermissions];

      // Admin, manager, supervisor bypass permission checks
      if (
        user.role === 'admin' ||
        user.role === 'manager' ||
        user.role === 'supervisor'
      ) {
        setHasChecked(true);
        setIsAuthorized(true);
        return;
      }

      const hasAccess = hasAnyPermission(permissionsArray);
      if (!hasAccess) {
        setHasChecked(true);
        setIsAuthorized(false);
        // Redirect to default route
        const defaultRoute = getDefaultRoute(user.role);
        router.push(defaultRoute);
        return;
      }
    }

    // All checks passed
    setHasChecked(true);
    setIsAuthorized(true);
  }, [
    isLoading,
    isAuthenticated,
    user,
    allowedRoles,
    requiredPermissions,
    hasAnyPermission,
    router,
  ]);

  // Show loading while checking
  if (isLoading || !hasChecked) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <LoadingSpinner size='lg' />
        <span className='ml-2'>جاري التحقق من الصلاحيات...</span>
      </div>
    );
  }

  // Not authorized
  if (!isAuthorized) {
    return (
      fallback || (
        <div className='flex items-center justify-center min-h-screen'>
          <div className='text-center'>
            <h1 className='text-2xl font-bold text-red-600 mb-4'>
              غير مصرح لك بالوصول
            </h1>
            <p className='text-gray-600 mb-4'>
              ليس لديك الصلاحيات اللازمة للوصول إلى هذه الصفحة
            </p>
            <button
              onClick={() => router.push(user ? getDefaultRoute(user.role) : '/login')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  router.push(user ? getDefaultRoute(user.role) : '/login');
                }
              }}
              className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
              aria-label='العودة للوحة التحكم'
            >
              العودة للوحة التحكم
            </button>
          </div>
        </div>
      )
    );
  }

  // Authorized - render children
  return <>{children}</>;
}
