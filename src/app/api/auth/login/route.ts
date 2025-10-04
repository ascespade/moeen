import { NextRequest, NextResponse } from 'next/server';
import { enhancedAuthService } from '@/lib/auth-service-enhanced';

export async function POST(request: NextRequest) {
  try {
    const { email, password, rememberMe } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'البريد الإلكتروني وكلمة المرور مطلوبان' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'البريد الإلكتروني غير صحيح' },
        { status: 400 }
      );
    }

    // Attempt login using enhanced auth service
    const result = await enhancedAuthService.login(email, password);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 401 }
      );
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      user: {
        id: result.user!.id,
        email: result.user!.email,
        name: result.user!.name,
        role: result.user!.role,
        status: result.user!.status,
        phone: result.user!.phone,
        avatar_url: result.user!.avatar_url,
        timezone: result.user!.timezone,
        language: result.user!.language,
        is_active: result.user!.is_active,
        last_login: result.user!.last_login,
        login_count: result.user!.login_count,
        preferences: result.user!.preferences,
        created_at: result.user!.created_at,
        updated_at: result.user!.updated_at
      },
      token: result.token,
    });

  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}