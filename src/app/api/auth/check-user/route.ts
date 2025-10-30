import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json().catch(() => ({} as any));
    console.log('[api/auth/check-user] request', { email });
    if (!email) {
      return NextResponse.json({ success: false, error: 'Missing email' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from('users')
      .select('id, email, name, role, status')
      .eq('email', email)
      .single();

    if (error) {
      console.error('[api/auth/check-user] db error', error.message);
      // If not found, supabase returns 406 or 404 depending; handle as not found
      const notFound = error.code === 'PGRST116' || error.code === '404' || error.status === 406;
      if (notFound) {
        return NextResponse.json({ success: true, found: false });
      }
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ success: true, found: false });
    }

    // Compute role permissions if role present
    try {
      const { PermissionManager } = await import('@/lib/permissions');
      const perms = data?.role ? PermissionManager.getRolePermissions(data.role) : [];
      return NextResponse.json({ success: true, found: true, user: data, permissions: perms });
    } catch (e) {
      return NextResponse.json({ success: true, found: true, user: data });
    }
  } catch (e: any) {
    console.error('[api/auth/check-user] unexpected error', e);
    return NextResponse.json({ success: false, error: e?.message || 'Internal error' }, { status: 500 });
  }
}
