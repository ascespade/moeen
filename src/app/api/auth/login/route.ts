import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import jwt from 'jsonwebtoken';
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
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
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

    return NextResponse.json({
      success: true,
      data: {
        user: userResponse,
        token,
        permissions: rolePermissions,
      },
    });
  } catch (e: any) {
    console.error('Login error:', e);
    return NextResponse.json(
      { success: false, error: e?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
