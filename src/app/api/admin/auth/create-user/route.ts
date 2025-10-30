import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

// This endpoint requires an internal secret header to prevent abuse
const INTERNAL_SECRET = process.env.ADMIN_INTERNAL_SECRET;

export async function POST(req: NextRequest) {
  try {
    if (!INTERNAL_SECRET) {
      return NextResponse.json({ success: false, error: 'Internal secret not configured' }, { status: 500 });
    }

    const headerSecret = req.headers.get('x-admin-secret');
    if (headerSecret !== INTERNAL_SECRET) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const email = String(body?.email || '').trim().toLowerCase();
    const password = String(body?.password || '').trim();
    const name = String(body?.name || 'Admin User');
    const role = String(body?.role || 'admin');

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 });
    }

    // 1) Create or get Auth user
    const { data: existing, error: getErr } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1,
      filter: { email },
    } as any);

    let authUserId: string | null = null;
    if (existing && (existing.users?.length || 0) > 0) {
      authUserId = existing.users[0].id;
    } else {
      const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });
      if (createErr || !created?.user) {
        return NextResponse.json({ success: false, error: createErr?.message || 'Failed to create auth user' }, { status: 500 });
      }
      authUserId = created.user.id;
    }

    // 2) Upsert into application users table and set permissions
    const supabase = await createClient();
    const fullPermissions = [
      'dashboard:view','users:view','users:edit','patients:view','patients:edit','audit_logs:view','roles:view','roles:edit','settings:view','settings:edit','appointments:view','appointments:edit','reports:view','reports:generate'
    ];

    const { data: upserted, error: upsertErr } = await supabase
      .from('users')
      .upsert({
        id: authUserId,
        email,
        name,
        role,
        status: 'active',
        is_active: true,
        metadata: { permissions: fullPermissions },
      }, { onConflict: 'id' })
      .select('id')
      .single();

    if (upsertErr || !upserted) {
      return NextResponse.json({ success: false, error: upsertErr?.message || 'Failed to upsert user' }, { status: 500 });
    }

    // 3) Ensure role mapping in user_roles (if roles table exists)
    const { data: roleRow } = await supabase
      .from('roles')
      .select('id')
      .eq('name', role)
      .limit(1)
      .maybeSingle();

    if (roleRow?.id) {
      await supabase
        .from('user_roles')
        .upsert({ user_id: upserted.id, role_id: roleRow.id, is_active: true }, { onConflict: 'user_id,role_id' });
    }

    return NextResponse.json({ success: true, user_id: upserted.id });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'Internal error' }, { status: 500 });
  }
}


