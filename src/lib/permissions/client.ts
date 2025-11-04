/**
 * Client-side safe exports from permissions
 * Only exports that don't require server-side dependencies
 */

// Re-export types (safe - types are stripped at compile time)
export type { PermissionId, RoleId } from './types';

// Re-export utility functions (safe - no server dependencies)
export {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  canAccess,
  getAccessibleResources,
  getPermissionsByCategory,
} from './utils';

// Re-export PERMISSIONS from constants (client-safe, no server dependencies)
export { PERMISSIONS } from './constants';

// PermissionManager is NOT exported - use API endpoint instead
// For client-side, use: fetch('/api/permissions/role/[roleId]')

