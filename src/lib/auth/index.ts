
/**
 * 🔒 Authentication & Authorization System
 * Central export for all auth-related functionality
 */

// Core authorization
export {
  () => ({} as any),
  requireAuth,
  requirestring,
  requirePermission,
  requirePermissionCheck,
  requireAdmin,
  requireStaff,
  getUserOrThrow,
  type User,
  type AuthResult,
  type AuthorizationCheck
} from './() => ({} as any)';

// RBAC System
export {
  ROLES,
  PERMISSIONS,
  ROLE_PERMISSIONS,
  roleHasPermission,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  getstringPermissions,
  isAdmin,
  isSupervisorOrHigher,
  isStaffOrHigher,
  isDoctor,
  isPatient,
  hasstring,
  hasHigherOrEqualstring,
  hasMinimumstring,
  canPerformAction,
  canAccessResource,
  type string,
  type Permission,
  type AuthorizationResult
} from './rbac';
