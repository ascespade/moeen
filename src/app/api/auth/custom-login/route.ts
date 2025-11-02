/**
 * Custom Login API
 * نظام Login المخصص من جداول قاعدة البيانات
 */

import { NextRequest, NextResponse } from 'next/server';
import { customAuthHub } from '@/lib/auth/CustomAuthHub';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'البريد الإلكتروني وكلمة المرور مطلوبان' },
        { status: 400 }
      );
    }

    // Login using custom auth hub
    const result = await customAuthHub.login(email, password);

    if (result.error || !result.user) {
      return NextResponse.json(
        { success: false, error: result.error || 'خطأ في تسجيل الدخول' },
        { status: 401 }
      );
    }

    // Get user permissions
    const permissions = await customAuthHub.getUserPermissions(result.user.id);

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          role: result.user.role,
          avatar: result.user.avatar_url,
          status: result.user.status,
        },
        token: result.token,
        permissions: permissions?.permissions || [],
      },
    });
  } catch (error) {
    console.error('Custom login error:', error);
    return NextResponse.json(
      { success: false, error: 'خطأ داخلي في السيرفر' },
      { status: 500 }
    );
  }
}
