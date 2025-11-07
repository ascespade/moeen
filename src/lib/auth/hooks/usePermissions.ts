'use client';

import { useState, useEffect, useCallback } from 'react';
import { authHub, UserPermissions } from '../AuthHub';
import { useAuth } from './useAuth';
import { logger } from '@/lib/utils/logger';

export function usePermissions() {
  const { user, loading: authLoading } = useAuth();
  const [permissions, setPermissions] = useState<UserPermissions | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setPermissions(null);
      setLoading(false);
      return;
    }

    authHub
      .getUserPermissions(user.id)
      .then(perms => {
        setPermissions(perms);
        setLoading(false);
      })
      .catch(error => {
        logger.error('Failed to load permissions:', { error });
        setLoading(false);
      });
  }, [user, authLoading]);

  const checkPermission = useCallback(
    async (resource: string, action: string): Promise<boolean> => {
      if (!user) return false;
      return authHub.checkPermission(user.id, resource, action);
    },
    [user]
  );

  const hasRole = useCallback(
    (role: string): boolean => {
      return permissions?.role === role;
    },
    [permissions]
  );

  return {
    permissions,
    loading,
    checkPermission,
    hasRole,
    role: permissions?.role,
  };
}
