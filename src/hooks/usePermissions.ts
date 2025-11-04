// Permission hooks for React components
import { useMemo, useEffect, useState } from 'react';
// Import only types and client-safe utilities (no server dependencies)
import type { PermissionId, RoleId } from '@/lib/permissions/types';
import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  canAccess,
  getAccessibleResources,
} from '@/lib/permissions/utils';

interface UsePermissionsProps {
  userRole: RoleId;
  customPermissions?: string[];
  restrictions?: string[];
}

export function usePermissions({
  userRole,
  customPermissions = [],
  restrictions = [],
}: UsePermissionsProps) {
  const [rolePermissions, setRolePermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch permissions from database via API (client-side safe)
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    // Use API endpoint for client-side fetching
    fetch(`/api/permissions/role/${userRole}`)
      .then(res => res.json())
      .then(data => {
        if (isMounted && data.success) {
          setRolePermissions(data.permissions || []);
          setLoading(false);
        } else {
          throw new Error('Failed to fetch permissions');
        }
      })
      .catch(() => {
        if (isMounted) {
          // Fallback: admin always has wildcard, others get empty array
          setRolePermissions(userRole === 'admin' ? ['*'] : []);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [userRole]);

  const permissions = useMemo(() => {
    const allPermissions = [...rolePermissions, ...customPermissions];

    // Remove restricted permissions
    return allPermissions.filter(
      permission => !restrictions.includes(permission)
    );
  }, [rolePermissions, customPermissions, restrictions]);

  const hasPermissionCheck = (permission: PermissionId | string): boolean => {
    return hasPermission(permissions, permission);
  };

  const hasAnyPermissionCheck = (
    permissionsToCheck: (PermissionId | string)[]
  ): boolean => {
    return hasAnyPermission(permissions, permissionsToCheck);
  };

  const hasAllPermissionsCheck = (
    permissionsToCheck: (PermissionId | string)[]
  ): boolean => {
    return hasAllPermissions(permissions, permissionsToCheck);
  };

  const canAccessCheck = (resource: string, action: string): boolean => {
    return canAccess(permissions, resource, action);
  };

  const getAccessibleResourcesCheck = (): string[] => {
    return getAccessibleResources(permissions);
  };

  const getPermissionsByCategoryCheck = (category: string): string[] => {
    // Use dynamic import from client-safe exports
    return import('@/lib/permissions/client').then(({ PERMISSIONS }) => {
      return permissions.filter(permission => {
        const permissionObj = Object.values(PERMISSIONS).find(
          (p: any) => p.id === permission
        );
        return permissionObj?.category === category;
      });
    }).catch(() => permissions); // Fallback: return all permissions on error
  };

  return {
    permissions,
    loading,
    hasPermission: hasPermissionCheck,
    hasAnyPermission: hasAnyPermissionCheck,
    hasAllPermissions: hasAllPermissionsCheck,
    canAccess: canAccessCheck,
    getAccessibleResources: getAccessibleResourcesCheck,
    getPermissionsByCategory: getPermissionsByCategoryCheck,
  };
}

// Hook for checking specific permission
export function usePermission(
  permission: PermissionId | string,
  userRole: RoleId
) {
  const { hasPermission } = usePermissions({ userRole });
  return hasPermission(permission);
}

// Hook for checking resource access
export function useResourceAccess(
  resource: string,
  action: string,
  userRole: RoleId
) {
  const { canAccess } = usePermissions({ userRole });
  return canAccess(resource, action);
}
