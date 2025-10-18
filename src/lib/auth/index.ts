
/**
 * 🔒 Authentication & Authorization System
 * Central export for all auth-related functionality
 */

// Core authorization
export {
  authorize,
  requireAuth,
  requireRole,
  requirePermission,
  requirePermissionCheck,
  requireAdmin,
  requireStaff,
  getUserOrThrow,
  type User,
  type AuthResult,
  type AuthorizationCheck,
} from './authorize';

// RBAC System
export {
  ROLES,
  PERMISSIONS,
  ROLE_PERMISSIONS,
  roleHasPermission,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  getRolePermissions,
  isAdmin,
  isSupervisorOrHigher,
  isStaffOrHigher,
  isDoctor,
  isPatient,
  hasRole,
  hasHigherOrEqualRole,
  hasMinimumRole,
  canPerformAction,
  canAccessResource,
  type Role,
  type Permission,
  type AuthorizationResult,
} from './rbac';
