'use client';

import { usePermissions } from '@/lib/auth/hooks/usePermissions';
import { ReactNode, useState, useEffect } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  resource: string;
  action: string;
  fallback?: ReactNode;
}

export function ProtectedRoute({
  children,
  resource,
  action,
  fallback = <div className='p-4 text-center text-red-600'>Access Denied</div>,
}: ProtectedRouteProps) {
  const { checkPermission, loading } = usePermissions();
  const [hasAccess, setHasAccess] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!loading) {
      checkPermission(resource, action).then(access => {
        setHasAccess(access);
        setChecking(false);
      });
    }
  }, [resource, action, loading, checkPermission]);

  if (checking || loading) {
    return (
      <div className='flex items-center justify-center p-8'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary' />
      </div>
    );
  }

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
