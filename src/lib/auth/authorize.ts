import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import jwt from 'jsonwebtoken';
import { logger } from '@/lib/logger';
import { env } from '@/config/env';

export type UserRole =
  | 'patient'
  | 'doctor'
  | 'staff'
  | 'supervisor'
  | 'admin'
  | 'manager'
  | 'agent'
  | 'demo'
  | 'nurse'
  | 'employee'
  | 'patient_responsible'
  | 'other';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  meta?: Record<string, any>;
}

export interface AuthResult {
  user: User | null;
  error: string | null;
}

export async function authorize(request: NextRequest): Promise<AuthResult> {
  try {
    // First: check for our JWT auth-token cookie
    try {
      const token = request.cookies?.get?.('auth-token')?.value || null;
      if (token) {
        const jwtSecret = env.JWT_SECRET;
        if (jwtSecret) {
          try {
            const decoded = jwt.verify(token, jwtSecret) as any;
            // decoded should contain userId, email, role, perms
            const perms = decoded?.perms || decoded?.permissions || [];
            return {
              user: {
                id: decoded.userId,
                email: decoded.email,
                role: decoded.role as User['role'],
                meta: { permissions: perms },
              },
              error: null,
            };
          } catch (e) {
            // invalid token - fallthrough to supabase session
            logger.debug('Invalid auth-token JWT, falling back to Supabase session', { error: e });
          }
        }
      }
    } catch (e) {
      // ignore cookie parsing errors
    }

    const supabase = await createClient();

    // Get session from cookies (Supabase)
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return { user: null, error: 'Unauthorized' };
    }

    // Get user data with role
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, email, role, status')
      .eq('id', session.user.id)
      .maybeSingle();

    if (userError || !userData) {
      return { user: null, error: 'User not found' };
    }
    if (userData.status && userData.status !== 'active') {
      return { user: null, error: 'Inactive user' };
    }

    // Aggregate permissions from role_permissions and user_permissions
    // Use simpler query with timeout protection
    let rolePerms = null;
    let userPerms = null;

    try {
      // Try simpler query first (without nested joins that might hang)
      const rolePermsResult = await Promise.race([
        supabase
          .from('user_roles')
          .select('role_id')
          .eq('user_id', userData.id)
          .eq('is_active', true)
          .maybeSingle(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000))
      ]) as any;

      rolePerms = rolePermsResult?.data;

      // If we got a role_id, try to get permissions
      if (rolePerms?.role_id) {
        try {
          const permResult = await Promise.race([
            supabase
              .from('role_permissions')
              .select('permission_id, permissions:permission_id(code)')
              .eq('role_id', rolePerms.role_id),
            new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 2000))
          ]) as any;

          rolePerms = { role_permissions: permResult?.data || [] };
        } catch (e) {
          logger.warn('Failed to fetch role permissions', { error: e });
          rolePerms = null;
        }
      }
    } catch (e) {
      logger.warn('Failed to fetch user_roles', { error: e });
      rolePerms = null;
    }

    try {
      const userPermsResult = await Promise.race([
        supabase
          .from('user_permissions')
          .select('permission_id, permissions:permission_id(code)')
          .eq('user_id', userData.id)
          .eq('is_active', true),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 2000))
      ]) as any;

      userPerms = userPermsResult?.data || [];
    } catch (e) {
      logger.warn('Failed to fetch user_permissions', { error: e });
      userPerms = [];
    }

    let codes = new Set<string>();

    try {
      // Handle rolePerms - could be single object or array
      if (rolePerms) {
        const rolePermsArray = Array.isArray(rolePerms) ? rolePerms : [rolePerms];
        rolePermsArray.forEach((rp: any) => {
          if (rp?.role_permissions) {
            const permArray = Array.isArray(rp.role_permissions) ? rp.role_permissions : [rp.role_permissions];
            permArray.forEach((x: any) => {
              if (x?.permissions?.code) codes.add(x.permissions.code);
            });
          }
        });
      }

      // Handle userPerms
      const userPermsArray = Array.isArray(userPerms) ? userPerms : (userPerms ? [userPerms] : []);
      userPermsArray.forEach((up: any) => {
        if (up?.permissions?.code) codes.add(up.permissions.code);
      });
    } catch (error) {
      logger.warn('Error processing permissions', { error });
    }

    // Fallback: If no permissions found, use PermissionManager
    if (codes.size === 0 && userData.role) {
      try {
        const { PermissionManager } = await import('@/lib/permissions');
        const rolePermsList = PermissionManager.getRolePermissions(userData.role);
        if (Array.isArray(rolePermsList)) {
          rolePermsList.forEach((p: string) => codes.add(p));
        } else {
          // Ultimate fallback: basic permissions based on role
          const fallbackPerms = getDefaultPermissionsForRole(userData.role);
          fallbackPerms.forEach((p: string) => codes.add(p));
        }
      } catch (e) {
        logger.warn('PermissionManager fallback failed', { error: e });
        // Ultimate fallback: basic permissions based on role
        const fallbackPerms = getDefaultPermissionsForRole(userData.role);
        fallbackPerms.forEach((p: string) => codes.add(p));
      }
    }

    const meta = { permissions: Array.from(codes) };

    return {
      user: {
        id: userData.id,
        email: userData.email,
        role: userData.role as User['role'],
        meta,
      },
      error: null,
    };
  } catch (error) {
    return { user: null, error: 'Authorization failed' };
  }
}

export function requireRole(
  allowedRoles: User['role'][]
): (user: User) => boolean {
  return (user: User) => allowedRoles.includes(user.role);
}

// Helper function to get default permissions for a role
function getDefaultPermissionsForRole(role: string): string[] {
  const rolePermMap: Record<string, string[]> = {
    admin: ['dashboard:view', '*'],
    manager: ['dashboard:view', '*'],
    supervisor: ['dashboard:view', 'reports:view', 'analytics:view'],
    doctor: ['dashboard:view', 'patients:view', 'appointments:manage', 'medical_records:view'],
    nurse: ['dashboard:view', 'patients:view', 'appointments:view'],
    staff: ['dashboard:view', 'appointments:view'],
    employee: ['dashboard:view', 'appointments:view'],
    agent: ['dashboard:view', 'crm:view', 'conversations:manage'],
    patient: ['dashboard:view', 'profile:view', 'appointments:create'],
    patient_responsible: ['dashboard:view', 'profile:view'],
    demo: ['dashboard:view'],
    other: ['dashboard:view'],
  };

  return rolePermMap[role] || ['dashboard:view'];
}

export function requireAuth(allowedRoles?: UserRole[]) {
  return async (request: NextRequest) => {
    const { user, error } = await authorize(request);

    if (error || !user) {
      return { authorized: false, user: null, error };
    }

    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      return { authorized: false, user, error: 'Insufficient permissions' };
    }

    return { authorized: true, user, error: null };
  };
}
