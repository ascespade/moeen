import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export interface User {
  id: string;
  email: string;
  role: 'patient' | 'doctor' | 'staff' | 'supervisor' | 'admin' | 'manager' | 'agent' | 'demo';
  meta?: Record<string, any>;
}

export interface AuthResult {
  user: User | null;
  error: string | null;
}

export async function authorize(request: NextRequest): Promise<AuthResult> {
  try {
    const supabase = await createClient();

    // Get session from cookies
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
      .select('id, email, role, metadata')
      .eq('id', session.user.id)
      .single();

    if (userError || !userData) {
      return { user: null, error: 'User not found' };
    }

    // Aggregate permissions from role_permissions and user_permissions
    const { data: rolePerms } = await supabase
      .from('user_roles')
      .select('role_id, roles:role_id(id, name), role_permissions:role_id(role_id, permission_id, permissions:permission_id(code))')
      .eq('user_id', userData.id)
      .eq('is_active', true);

    const { data: userPerms } = await supabase
      .from('user_permissions')
      .select('permission_id, permissions:permission_id(code)')
      .eq('user_id', userData.id)
      .eq('is_active', true);

    const codes = new Set<string>();
    (rolePerms || []).forEach((rp: any) => {
      (rp.role_permissions || []).forEach((x: any) => {
        if (x?.permissions?.code) codes.add(x.permissions.code);
      });
    });
    (userPerms || []).forEach((up: any) => {
      if (up?.permissions?.code) codes.add(up.permissions.code);
    });

    const mergedMeta = { ...(userData as any).metadata, permissions: Array.from(codes) };

    return {
      user: {
        id: userData.id,
        email: userData.email,
        role: userData.role as User['role'],
        meta: mergedMeta,
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
