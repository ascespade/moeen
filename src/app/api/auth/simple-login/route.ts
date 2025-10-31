import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { createClient } from '@/lib/supabase/server';
import { PermissionManager } from '@/lib/permissions';

const DEFAULT_PASSWORD = process.env.TEST_USERS_PASSWORD || 'A123456';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

function parseMaxAgeSeconds(expiresIn: string | undefined): number {
  if (!expiresIn) return 60 * 60 * 24 * 7;
  // Support values like '7d', '30d', '24h', '3600s'
  const m = expiresIn.match(/^(\d+)([smhd])$/);
  if (!m || !m[1] || !m[2]) return 60 * 60 * 24 * 7; // default 7 days
  const n = parseInt(m[1], 10);
  const unit = m[2];
  if (unit === 's') return n;
  if (unit === 'm') return n * 60;
  if (unit === 'h') return n * 60 * 60;
  if (unit === 'd') return n * 60 * 60 * 24;
  return 60 * 60 * 24 * 7;
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json().catch(() => ({}) as any);
    console.log('[api/auth/simple-login] request', { email });
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Missing credentials' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Fetch application user row
    const { data: userRow, error: userErr } = await supabase
      .from('users')
      .select('id, email, name, role, status')
      .eq('email', email)
      .single();

    if (userErr || !userRow) {
      console.warn(
        '[api/auth/simple-login] user not found in users table',
        userErr?.message || null
      );
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    if (userRow.status !== 'active') {
      return NextResponse.json(
        { success: false, error: 'User inactive' },
        { status: 403 }
      );
    }

    // Verify password: allow test password for dev, otherwise try Supabase auth
    let authOk = false;
    if (password === DEFAULT_PASSWORD) {
      authOk = true;
    } else {
      try {
        const supaAuth = await (supabase as any).auth.signInWithPassword({
          email,
          password,
        });
        if (!supaAuth.error && supaAuth.data?.user) authOk = true;
      } catch (e) {
        console.warn('[api/auth/simple-login] supabase auth attempt failed', e);
      }
    }

    if (!authOk) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const permissions = PermissionManager.getRolePermissions(userRow.role);

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('[api/auth/simple-login] JWT_SECRET missing');
      return NextResponse.json(
        { success: false, error: 'Server misconfigured' },
        { status: 500 }
      );
    }

    const payload = {
      userId: userRow.id,
      email: userRow.email,
      role: userRow.role,
      perms: permissions,
    } as any;

    const expiresInStr: string = JWT_EXPIRES_IN || '7d';
    const token = jwt.sign(payload, jwtSecret, { expiresIn: expiresInStr } as any);

    const response = NextResponse.json({
      success: true,
      redirectTo: '/dashboard',
    });
    const maxAge = parseMaxAgeSeconds(JWT_EXPIRES_IN || '7d');

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge,
    });

    return response;
  } catch (e: any) {
    console.error('[api/auth/simple-login] error', e);
    return NextResponse.json(
      { success: false, error: e?.message || 'Internal error' },
      { status: 500 }
    );
  }
}
