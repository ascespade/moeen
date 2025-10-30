import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PermissionManager } from '@/lib/permissions';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Missing credentials' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error || !data?.user) {
      return NextResponse.json(
        { success: false, error: error?.message || 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch user data with role and status from database
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, email, full_name, role, status, avatar_url')
      .eq('id', data.user.id)
      .single();

    if (userError || !userData) {
      return NextResponse.json(
        { success: false, error: 'User data not found' },
        { status: 401 }
      );
    }

    // Check if user is active
    if (userData.status !== 'active') {
      return NextResponse.json(
        { success: false, error: 'User account is inactive' },
        { status: 403 }
      );
    }

    // Get user permissions based on role
    const rolePermissions = PermissionManager.getRolePermissions(userData.role);

    // Generate JWT token with user role and permissions
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET not configured');
    }

    const token = jwt.sign(
      {
        userId: userData.id,
        email: userData.email,
        role: userData.role,
        permissions: rolePermissions,
      },
      jwtSecret,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Prepare user response object
    const userResponse = {
      id: userData.id,
      email: userData.email,
      name: userData.full_name,
      role: userData.role,
      avatar: userData.avatar_url,
      status: userData.status,
    };

    // Create HttpOnly cookie for token
    const parseExpiryToSeconds = (exp: string | undefined) => {
      if (!exp) return 60 * 60 * 24 * 7; // default 7 days
      try {
        if (exp.endsWith('d')) {
          const days = parseInt(exp.slice(0, -1), 10);
          return days * 24 * 60 * 60;
        }
        if (exp.endsWith('h')) {
          const hours = parseInt(exp.slice(0, -1), 10);
          return hours * 60 * 60;
        }
        const asNum = parseInt(exp, 10);
        if (!isNaN(asNum)) return asNum;
      } catch (e) {}
      return 60 * 60 * 24 * 7;
    };

    const maxAge = parseExpiryToSeconds(process.env.JWT_EXPIRES_IN);
    const isProd = process.env.NODE_ENV === 'production';
    const cookieParts = [
      `token=${token}`,
      `HttpOnly`,
      `Path=/`,
      `Max-Age=${maxAge}`,
      `SameSite=Lax`,
    ];
    if (isProd) cookieParts.push('Secure');
    const cookie = cookieParts.join('; ');

    const resBody = {
      success: true,
      data: {
        user: userResponse,
        token,
        permissions: rolePermissions,
      },
    };

    return NextResponse.json(resBody, { headers: { 'Set-Cookie': cookie } });
  } catch (e: any) {
    console.error('Login error:', e);
    return NextResponse.json(
      { success: false, error: e?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
