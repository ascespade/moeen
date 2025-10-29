import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/middleware/auth';

// Mock user database (replace with real database in production)
const MOCK_USERS = [
  {
    id: 'admin-1',
    email: 'admin@moeen.com',
    password: 'admin123',
    name: 'مدير النظام',
    role: 'admin',
  },
  {
    id: 'doctor-1',
    email: 'doctor@moeen.com',
    password: 'doctor123',
    name: 'د. أحمد محمد',
    role: 'doctor',
  },
  {
    id: 'patient-1',
    email: 'patient@moeen.com',
    password: 'patient123',
    name: 'محمد علي',
    role: 'patient',
  },
  {
    id: 'staff-1',
    email: 'staff@moeen.com',
    password: 'staff123',
    name: 'فاطمة أحمد',
    role: 'staff',
  },
  {
    id: 'supervisor-1',
    email: 'supervisor@moeen.com',
    password: 'supervisor123',
    name: 'خالد السالم',
    role: 'supervisor',
  },
  // Test user
  {
    id: 'test-user',
    email: 'test@moeen.com',
    password: 'test123',
    name: 'Test User',
    role: 'admin',
  },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, role, rememberMe } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'البريد الإلكتروني وكلمة المرور مطلوبة' },
        { status: 400 }
      );
    }

    // Find user by email
    let user = MOCK_USERS.find(u => u.email === email);

    // If role is specified, also match by role
    if (role) {
      user = MOCK_USERS.find(u => u.email === email && u.role === role);
    }

    // Check if user exists
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }

    // Verify password (in production, use bcrypt.compare)
    if (user.password !== password) {
      return NextResponse.json(
        { success: false, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Create response
    const response = NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        token,
      },
      message: 'تم تسجيل الدخول بنجاح',
    });

    // Set cookie
    const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60; // 30 days or 1 day
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء تسجيل الدخول' },
      { status: 500 }
    );
  }
}
