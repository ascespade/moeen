import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: 'تم تسجيل الخروج بنجاح',
  });

  // Clear auth cookie
  response.cookies.delete('auth_token');

  return response;
}
