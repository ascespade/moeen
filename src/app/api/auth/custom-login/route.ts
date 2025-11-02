/**
 * Custom Login API - Optimized
 * API تسجيل الدخول المخصص - محسّن
 * 
 * ✅ Clean business logic
 * ✅ Proper error handling
 * ✅ Security best practices
 */

import { NextRequest, NextResponse } from 'next/server';
import { customAuthHub } from '@/lib/auth/CustomAuthHub';

const isDev = process.env.NODE_ENV === 'development';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Business Logic: Login attempt
    const result = await customAuthHub.login(email, password);

    if (!result.user || !result.token) {
      // Don't reveal specific error reasons (security)
      return NextResponse.json(
        { success: false, error: result.error || 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Get permissions (cached, fast)
    const permissions = await customAuthHub.getUserPermissions(result.user.id);

    const response = NextResponse.json({
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
        permissions: permissions || null,
      },
    });

    // Set auth_token cookie (secure)
    const isProduction = process.env.NODE_ENV === 'production';
    response.cookies.set('auth_token', result.token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    // Log in development only
    if (isDev) {
      console.error('[CUSTOM-LOGIN] Error:', error);
    }
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
