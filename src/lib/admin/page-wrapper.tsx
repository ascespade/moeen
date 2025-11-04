/**
 * Unified Admin Page Wrapper
 * wrapper موحد لجميع صفحات Admin
 * يضمن التحقق من الصلاحيات والتحميل بشكل موحد
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';

interface AdminPageWrapperProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
  requiredRoles?: string[];
  pageTitle?: string;
  loadingComponent?: React.ReactNode;
}

export function AdminPageWrapper({
  children,
  requiredPermissions = [],
  requiredRoles = [],
  pageTitle,
  loadingComponent,
}: AdminPageWrapperProps) {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { hasPermission, loading: permissionsLoading } = usePermissions({
    userRole: user?.role || '',
  });
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading || permissionsLoading) {
      return;
    }

    // Check authentication
    if (!isAuthenticated || !user) {
      router.push('/login');
      return;
    }

    // Check role permissions
    if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
      router.push('/admin/dashboard');
      return;
    }

    // Check specific permissions
    if (requiredPermissions.length > 0) {
      const hasAllPermissions = requiredPermissions.every(permission =>
        hasPermission(permission)
      );
      if (!hasAllPermissions) {
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
  ]);

  // Show loading state
  if (authLoading || permissionsLoading || !isAuthorized) {
    return (
      loadingComponent || (
        <div className='flex min-h-screen items-center justify-center'>
          <div className='text-center'>
            <div className='mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 mx-auto'></div>
            <p className='text-gray-600'>جاري التحميل...</p>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
}

