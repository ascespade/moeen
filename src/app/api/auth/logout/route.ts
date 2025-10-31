import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ErrorHandler } from '@/core/errors';

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
    return ErrorHandler.getInstance().handle(error as Error);
  }
}
