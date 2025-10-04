import { NextRequest, NextResponse } from 'next/server';
import { enhancedAuthService } from '@/lib/auth-service-enhanced';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'رمز التحقق مطلوب' },
        { status: 400 }
      );
    }

    // Verify token using enhanced auth service
    const result = await enhancedAuthService.verifyToken(token);

    if (!result.valid) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 401 }
      );
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'الرمز صحيح',
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
      }
    });

  } catch (error) {
    console.error('Verify token API error:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}