import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import jwt from 'jsonwebtoken';

export interface User {
  id: string;
  email: string;
  role:
    | 'patient'
    | 'doctor'
    | 'staff'
    | 'supervisor'
    | 'admin'
    | 'manager'
    | 'agent'
    | 'demo';
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
        const jwtSecret = process.env.JWT_SECRET;
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

    // Get user data with role using optimized query
    const { getUserById, getUserPermissions, updateUserLastLogin } = await import('@/lib/database/modules/auth.queries');
    
    const userData = await getUserById(supabase, session.user.id);

    if (!userData) {
      return { user: null, error: 'User not found' };
    }
    if (userData.status && userData.status !== 'active') {
      return { user: null, error: 'Inactive user' };
    }

    // Get user permissions (optimized - uses PermissionManager cache + DB queries)
    const userPerms = await getUserPermissions(supabase, userData.id, userData.role);

    // Update last login timestamp (async - don't wait)
    updateUserLastLogin(supabase, userData.id).catch(() => {
      // Silently fail - not critical
    });

    const meta = { permissions: userPerms.permissions };

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

export function requireAuth(allowedRoles?: User['role'][]) {
  return async (request: NextRequest) => {
    const { user, error } = await authorize(request);

    if (error || !user) {
      return { authorized: false, user: null, error };
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return { authorized: false, user, error: 'Insufficient permissions' };
    }

    return { authorized: true, user, error: null };
  };
}
