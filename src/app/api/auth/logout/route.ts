import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth/authoriz
  try {
    // Security: Require authentication
    const authResult = await requireAuth(["admin"])(_req: NextRequest);
    if (!authResult.authorized || !authResult.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Authentication required' },
        { status: 401 }
      );
    }
e';

export async function POST(_req: NextRequest) {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();

    const response = NextResponse.json({
      success: true,
      message: 'تم تسجيل الخروج بنجاح',
    });

    // Clear auth cookie
    response.cookies.delete('auth_token');

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Logout failed' },
      { status: 500 }
    );
  }
}
