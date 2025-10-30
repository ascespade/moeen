import { NextRequest, NextResponse } from 'next/server';
import { authorize } from '@/lib/auth/authorize';
import { PermissionManager } from '@/lib/permissions';

export async function GET(request: NextRequest) {
  try {
    const { user, error } = await authorize(request);

    // Primary path: Supabase auth session
    if (user && !error) {
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
        }
      });
    }

    // Fallback path: demo email header for quick login (still reads from DB, no mock data)
    const demoEmail = request.headers.get('x-demo-email');
    if (demoEmail) {
      try {
        const { createClient } = await import('@/lib/supabase/server');
        const supabase = await createClient();
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, email, role, full_name, avatar_url, status')
          .eq('email', demoEmail)
          .single();

        if (!userError && userData) {
          const userPermissions = PermissionManager.getRolePermissions(userData.role);

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
            }
          });
        }
      } catch (e) {
        // ignore and fallthrough to 401
      }
    }

    return NextResponse.json({
      success: false,
      error: error || 'Unauthorized',
      user: null
    }, { status: 401 });
  } catch (error) {
    console.error('Auth me error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        user: null
      },
      { status: 500 }
    );
  }
}
