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

    // Use Supabase session token if available (server client will have set cookies)
    const sessionToken = (data as any).session?.access_token || null;

    // Prepare user response object
    const userResponse = {
      id: userData.id,
      email: userData.email,
      name: userData.full_name,
      role: userData.role,
      avatar: userData.avatar_url,
      status: userData.status,
    };

    const resBody = {
      success: true,
      data: {
        user: userResponse,
        token: sessionToken,
        permissions: rolePermissions,
      },
    };

    return NextResponse.json(resBody);
  } catch (e: any) {
    console.error('Login error:', e);
    return NextResponse.json(
      { success: false, error: e?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
