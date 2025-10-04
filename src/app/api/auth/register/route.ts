import { NextRequest, NextResponse } from 'next/server';
import { enhancedAuthService } from '@/lib/auth-service-enhanced';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, role, phone } = await request.json();

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, error: 'البريد الإلكتروني وكلمة المرور والاسم مطلوبان' },
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

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' },
        { status: 400 }
      );
    }

    // Attempt registration using enhanced auth service
    const result = await enhancedAuthService.register({
      email,
      password,
      name,
      role: role || 'agent',
      phone
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'تم إنشاء الحساب بنجاح',
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
        created_at: result.user!.created_at,
        updated_at: result.user!.updated_at
      }
    });

  } catch (error) {
    console.error('Register API error:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}