/**
 * Permission utility functions (client-safe)
 * These functions don't use server-side dependencies
 */

export function hasPermission(
  userPermissions: string[],
  permission: string
): boolean {
  return (
    userPermissions.includes(permission) || userPermissions.includes('*')
  );
}

export function hasAnyPermission(
  userPermissions: string[],
  permissions: string[]
): boolean {
  return permissions.some(permission =>
    hasPermission(userPermissions, permission)
  );
}

export function hasAllPermissions(
  userPermissions: string[],
  permissions: string[]
): boolean {
  return permissions.every(permission =>
    hasPermission(userPermissions, permission)
  );
}

export function canAccess(
  userPermissions: string[],
  resource: string,
  action: string
): boolean {
  const permission = `${resource}:${action}`;
  return hasPermission(userPermissions, permission);
}

export function getAccessibleResources(userPermissions: string[]): string[] {
  const resources = new Set<string>();
  userPermissions.forEach(permission => {
    const [resource] = permission.split(':');
    if (resource) {
      resources.add(resource);
    }
  });
  return Array.from(resources);
}

export function getPermissionsByCategory(
  userPermissions: string[],
  category: string,
  permissionsMap?: Record<string, { category: string }>
): string[] {
  if (!permissionsMap) {
    // Fallback: return all permissions if no map provided
    return userPermissions;
  }
  return userPermissions.filter(permission => {
    const permissionObj = permissionsMap[permission];
    return permissionObj?.category === category;
  });
}

