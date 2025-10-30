import { NextRequest, NextResponse } from 'next/server';
import { authorize } from '@/lib/auth/authorize';

export async function GET(request: NextRequest) {
  try {
    const { user, error } = await authorize(request);

    // Primary path: Supabase auth session
    if (user && !error) {
      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          permissions: user.meta?.permissions || []
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
          .select('id, email, role, metadata')
          .eq('email', demoEmail)
          .single();

        if (!userError && userData) {
          return NextResponse.json({
            success: true,
            user: {
              id: userData.id,
              email: userData.email,
              role: userData.role,
              permissions: (userData as any).metadata?.permissions || []
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
