// Permission hooks for React components
import { useMemo } from 'react';
import { PermissionManager, type PermissionId, type RoleId } from '@/lib/permissions';

interface UsePermissionsProps {
  userRole: RoleId;
  customPermissions?: string[];
  restrictions?: string[];
}

export function usePermissions({ 
  userRole, 
  customPermissions = [], 
  restrictions = [] 
}: UsePermissionsProps) {
  const permissions = useMemo(() => {
    const rolePermissions = PermissionManager.getRolePermissions(userRole);
    const allPermissions = [...rolePermissions, ...customPermissions];
    
    // Remove restricted permissions
    return allPermissions.filter(permission => !restrictions.includes(permission));
  }, [userRole, customPermissions, restrictions]);

  const hasPermission = (permission: PermissionId | string): boolean => {
    return PermissionManager.hasPermission(permissions, permission);
  };

  const hasAnyPermission = (permissionsToCheck: (PermissionId | string)[]): boolean => {
    return PermissionManager.hasAnyPermission(permissions, permissionsToCheck);
  };

  const hasAllPermissions = (permissionsToCheck: (PermissionId | string)[]): boolean => {
    return PermissionManager.hasAllPermissions(permissions, permissionsToCheck);
  };

  const canAccess = (resource: string, action: string): boolean => {
    return PermissionManager.canAccess(permissions, resource, action);
  };

  const getAccessibleResources = (): string[] => {
    return PermissionManager.getAccessibleResources(permissions);
  };

  const getPermissionsByCategory = (category: string): string[] => {
    return PermissionManager.getPermissionsByCategory(permissions, category);
  };

  return {
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccess,
    getAccessibleResources,
    getPermissionsByCategory
  };
}

// Hook for checking specific permission
export function usePermission(permission: PermissionId | string, userRole: RoleId) {
  const { hasPermission } = usePermissions({ userRole });
  return hasPermission(permission);
}

// Hook for checking resource access
export function useResourceAccess(resource: string, action: string, userRole: RoleId) {
  const { canAccess } = usePermissions({ userRole });
  return canAccess(resource, action);
}