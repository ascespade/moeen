import { NextRequest, NextResponse } from 'next/server';
import { authorize } from '@/lib/auth/authorize';
import { PermissionManager } from '@/lib/permissions';

export async function GET(request: NextRequest) {
  try {
    const { user, error } = await authorize(request);
    console.log('[api/auth/me] authorize result', { userId: user?.id, error });

    // Primary path: Supabase auth session
    if (user && !error) {
      console.log('[api/auth/me] authenticated user', { id: user.id, email: user.email, role: user.role });
      const userPermissions = PermissionManager.getRolePermissions(user.role);

      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.full_name,
          avatar: user.avatar_url,
          status: user.status,
          permissions: userPermissions,
        },
      });
    }

    // Fallback path: demo email header for quick login (still reads from DB, no mock data)
    const demoEmail = request.headers.get('x-demo-email');
    if (demoEmail) {
      console.log('[api/auth/me] demo email header present', demoEmail);
      try {
        const { createClient } = await import('@/lib/supabase/server');
        const supabase = await createClient();
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, email, role, full_name, avatar_url, status')
          .eq('email', demoEmail)
          .single();

        console.log('[api/auth/me] demo user fetch', { userData, userError: userError?.message || null });

        if (!userError && userData) {
          const userPermissions = PermissionManager.getRolePermissions(
            userData.role
          );

          return NextResponse.json({
            success: true,
            user: {
              id: userData.id,
              email: userData.email,
              role: userData.role,
              name: userData.full_name,
              avatar: userData.avatar_url,
              status: userData.status,
              permissions: userPermissions,
            },
          });
        }
      } catch (e) {
        console.error('[api/auth/me] error fetching demo user', e);
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
