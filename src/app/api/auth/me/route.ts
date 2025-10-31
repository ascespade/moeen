import { NextRequest, NextResponse } from 'next/server';
import { authorize } from '@/lib/auth/authorize';

export async function GET(request: NextRequest) {
  try {
    // Try to get user from headers (sent from client localStorage)
    const clientUserId = request.headers.get('x-user-id');
    const clientUserEmail = request.headers.get('x-user-email');
    const clientUserRole = request.headers.get('x-user-role');

    if (clientUserId && clientUserEmail && clientUserRole) {
      console.log('[api/auth/me] Using client-provided user info', { clientUserEmail });
      try {
        const { createClient } = await import('@/lib/supabase/server');
        const supabase = await createClient();

        // Verify user exists in DB
        const { data: userData } = await supabase
          .from('users')
          .select('id, email, role, status')
          .eq('id', clientUserId)
          .eq('email', clientUserEmail)
          .maybeSingle();

        if (userData && userData.status === 'active') {
          // Get permissions using PermissionManager (faster than DB queries)
          try {
            const { PermissionManager } = await import('@/lib/permissions');
            const permissions = PermissionManager.getRolePermissions(userData.role);

            return NextResponse.json({
              success: true,
              user: {
                id: userData.id,
                email: userData.email,
                role: userData.role,
                permissions: Array.isArray(permissions) ? permissions : [],
              },
            });
          } catch (e) {
            // Fallback to basic permissions
            return NextResponse.json({
              success: true,
              user: {
                id: userData.id,
                email: userData.email,
                role: userData.role,
                permissions: userData.role === 'admin' ? ['*', 'dashboard:view'] : ['dashboard:view'],
              },
            });
          }
        }
      } catch (e) {
        console.warn('[api/auth/me] Client user verification failed:', e);
      }
    }

    const { user, error } = await authorize(request);
    console.log('[api/auth/me] authorize result', { userId: user?.id, error });

    // Primary path: Supabase auth session
    if (user && !error) {
      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          permissions: user.meta?.permissions || [],
        },
      });
    }

    // Fallback path: demo email header for quick login (still reads from DB, no mock data)
    const demoEmail = request.headers.get('x-demo-email');
    if (demoEmail) {
      try {
        const { createClient } = await import('@/lib/supabase/server');
        const supabase = await createClient();
        const { data: userData } = await supabase
          .from('users')
          .select('id, email, role, status')
          .eq('email', demoEmail)
          .maybeSingle();

        if (userData) {
          // Aggregate real permissions
          const { data: ur } = await supabase
            .from('user_roles')
            .select('role_id')
            .eq('user_id', userData.id)
            .maybeSingle();

          let permCodes: string[] = [];
          if (ur?.role_id) {
            const { data: rolePermRows } = await supabase
              .from('role_permissions')
              .select('permission_id')
              .eq('role_id', ur.role_id);
            const ids = (rolePermRows || [])
              .map(rp => rp.permission_id)
              .filter(Boolean);
            if (ids.length) {
              const { data: permRows } = await supabase
                .from('permissions')
                .select('code')
                .in('id', ids as string[]);
              permCodes = (permRows || [])
                .map(p => p.code)
                .filter(Boolean) as string[];
            }
          }
          const { data: userPermRows } = await supabase
            .from('user_permissions')
            .select('permission_id')
            .eq('user_id', userData.id);
          const uids = (userPermRows || [])
            .map(up => up.permission_id)
            .filter(Boolean);
          if (uids.length) {
            const { data: permRows } = await supabase
              .from('permissions')
              .select('code')
              .in('id', uids as string[]);
            permCodes.push(
              ...((permRows || []).map(p => p.code).filter(Boolean) as string[])
            );
          }

          return NextResponse.json({
            success: true,
            user: {
              id: userData.id,
              email: userData.email,
              role: userData.role,
              status: userData.status,
              permissions: Array.from(new Set(permCodes)),
            },
          });
        }
      } catch (e) {
        // ignore and fallthrough to 401
      }
    }

    console.log('[api/auth/me] returning 401 unauthorized', { error });
    return NextResponse.json(
      {
        success: false,
        error: error || 'Unauthorized',
        user: null,
      },
      { status: 401 }
    );
  } catch (error) {
    console.error('[api/auth/me] unexpected error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        user: null,
      },
      { status: 500 }
    );
  }
}
