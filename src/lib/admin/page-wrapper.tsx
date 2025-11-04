/**
 * Unified Admin Page Wrapper
 * wrapper موحد لجميع صفحات Admin
 * يضمن التحقق من الصلاحيات بشكل موحد بدون loading states كبيرة
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';
import { getPageConfig } from './page-config';

interface AdminPageWrapperProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
  requiredRoles?: string[];
  pageTitle?: string;
}

export function AdminPageWrapper({
  children,
  requiredPermissions = [],
  requiredRoles = [],
  pageTitle,
}: AdminPageWrapperProps) {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { hasPermission, loading: permissionsLoading } = usePermissions({
    userRole: user?.role || '',
  });
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading || permissionsLoading) {
      return;
    }

    setIsChecking(false);

    // Check authentication
    if (!isAuthenticated || !user) {
      // Use window.location only for initial auth redirect
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
      return;
    }

    // Get page config if not provided
    const pageConfig = getPageConfig(pathname);
    const finalRequiredPermissions = requiredPermissions.length > 0
      ? requiredPermissions
      : (pageConfig?.requiredPermissions || []);
    const finalRequiredRoles = requiredRoles.length > 0
      ? requiredRoles
      : (pageConfig?.requiredRoles || []);

    // Check role permissions
    if (finalRequiredRoles.length > 0 && !finalRequiredRoles.includes(user.role)) {
      // Use Next.js router for internal navigation (no refresh)
      router.push('/admin/dashboard');
      return;
    }

    // Check specific permissions
    if (finalRequiredPermissions.length > 0) {
      const hasAllPermissions = finalRequiredPermissions.every(permission =>
        hasPermission(permission)
      );
      if (!hasAllPermissions) {
        // Use Next.js router for internal navigation (no refresh)
        router.push('/admin/dashboard');
        return;
      }
    }

    setIsAuthorized(true);
  }, [
    authLoading,
    permissionsLoading,
    isAuthenticated,
    user,
    requiredRoles,
    requiredPermissions,
    hasPermission,
    router,
    pathname,
  ]);

  // Show minimal loading state - only in content area
  if (isChecking || !isAuthorized) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <div className='mb-4 h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-blue-600 mx-auto'></div>
          <p className='text-sm text-gray-600'>جاري التحقق من الصلاحيات...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
