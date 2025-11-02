import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(_req: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Sign out from Supabase
    await supabase.auth.signOut();

    const response = NextResponse.json({
      success: true,
      message: 'تم تسجيل الخروج بنجاح',
    });

    // Clear all auth-related cookies
    response.cookies.delete('auth_token');
    response.cookies.delete('sb-access-token');
    response.cookies.delete('sb-refresh-token');
    
    // Clear Supabase auth cookies
    const cookieNames = [
      'sb-access-token',
      'sb-refresh-token',
      'sb-auth-token',
      'auth-token',
    ];
    
    cookieNames.forEach(name => {
      response.cookies.set(name, '', {
        maxAge: 0,
        path: '/',
      });
    });

    return response;
  } catch (error) {
    console.error('[api/auth/logout] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Logout failed' },
      { status: 500 }
    );
  }
}
