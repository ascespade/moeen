import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

const INTERNAL_SECRET = process.env.ADMIN_INTERNAL_SECRET;
const DEFAULT_PASSWORD = process.env.TEST_USERS_PASSWORD || 'A123456';

const USERS = [
  { email: 'admin@test.local', name: 'Admin User', role: 'admin' },
  { email: 'manager@test.local', name: 'Manager User', role: 'manager' },
  { email: 'supervisor@test.local', name: 'Supervisor User', role: 'supervisor' },
  { email: 'agent@test.local', name: 'Agent User', role: 'agent' }
] as const;

export async function POST(req: NextRequest) {
  const isDev = process.env.NODE_ENV !== 'production';
  const referer = req.headers.get('referer') || '';
  const fromLocalhost = /localhost|127\.0\.0\.1/.test(referer);

  const headerOk = INTERNAL_SECRET && (req.headers.get('x-admin-secret') || '') === INTERNAL_SECRET;
  const devOk = isDev && fromLocalhost;

  if (!headerOk && !devOk) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = await createClient();
  const created: any[] = [];

  for (const u of USERS) {
    // Create or fetch auth user
    const { data: listed } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1, filter: { email: u.email } } as any);
    let authId = listed?.users?.[0]?.id as string | undefined;
    if (!authId) {
      const { data: createdUser, error: cErr } = await supabaseAdmin.auth.admin.createUser({
        email: u.email,
        password: DEFAULT_PASSWORD,
        email_confirm: true,
      });
      if (cErr || !createdUser?.user) return NextResponse.json({ success: false, error: cErr?.message || 'createUser failed' }, { status: 500 });
      authId = createdUser.user.id;
    }

    // Upsert application user
    const { data: up, error: upErr } = await supabase
      .from('users')
      .upsert({ id: authId, email: u.email, name: u.name, role: u.role, status: 'active', is_active: true }, { onConflict: 'id' })
      .select('id')
      .single();
    if (upErr || !up) return NextResponse.json({ success: false, error: upErr?.message || 'upsert users failed' }, { status: 500 });

    // Link role in user_roles if roles table has this role
    const { data: roleRow } = await supabase.from('roles').select('id').eq('name', u.role).maybeSingle();
    if (roleRow?.id) {
      await supabase.from('user_roles').upsert({ user_id: up.id, role_id: roleRow.id, is_active: true }, { onConflict: 'user_id,role_id' });
    }

    created.push({ email: u.email, role: u.role });
  }

  return NextResponse.json({ success: true, users: created, password: DEFAULT_PASSWORD });
}


