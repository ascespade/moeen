import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

const INTERNAL_SECRET = process.env.ADMIN_INTERNAL_SECRET;
const DEFAULT_PASSWORD = process.env.TEST_USERS_PASSWORD || 'A123456';

const USERS = [
  { email: 'admin@test.local', name: 'Admin User', role: 'admin' },
  { email: 'manager@test.local', name: 'Manager User', role: 'manager' },
  {
    email: 'supervisor@test.local',
    name: 'Supervisor User',
    role: 'supervisor',
  },
  { email: 'agent@test.local', name: 'Agent User', role: 'agent' },
];

export async function POST(req) {
  const isDev = process.env.NODE_ENV !== 'production';
  const referer = req.headers.get('referer') || '';
  const origin = req.headers.get('origin') || '';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || '';

  const fromLocalhost = /localhost|127\.0\.0\.1/.test(referer || origin);

  const headerOk =
    INTERNAL_SECRET &&
    (req.headers.get('x-admin-secret') || '') === INTERNAL_SECRET;
  const originOk =
    appUrl && (origin.includes(appUrl) || referer.includes(appUrl));
  const debugAllow = process.env.NEXT_PUBLIC_ENABLE_DEBUG === 'true';

  console.log('[admin/seed-defaults] request context', {
    referer,
    origin,
    isDev,
    fromLocalhost,
    headerOk,
    originOk,
    debugAllow,
  });

  // Allow when: header matches, or running in dev from localhost, or origin matches configured app url, or debug mode enabled
  if (!headerOk && !isDev && !fromLocalhost && !originOk && !debugAllow) {
    console.warn(
      '[admin/seed-defaults] unauthorized attempt to seed defaults',
      { referer, origin }
    );
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const supabase = await createClient();
  const created = JSON.parse('[]');

  for (const u of USERS) {
    console.log('[admin/seed-defaults] processing user', u.email, u.role);
    // Create or fetch auth user
    const { data: listed } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1,
      filter: { email: u.email },
    });
    let authId = listed?.users?.[0]?.id;
    if (!authId) {
      const { data: createdUser, error: cErr } =
        await supabaseAdmin.auth.admin.createUser({
          email: u.email,
          password: DEFAULT_PASSWORD,
          email_confirm: true,
        });
      if (cErr || !createdUser?.user) {
        console.error('[admin/seed-defaults] createUser failed', cErr?.message);
        return NextResponse.json(
          { success: false, error: cErr?.message || 'createUser failed' },
          { status: 500 }
        );
      }
      authId = createdUser.user.id;
      console.log('[admin/seed-defaults] created auth user', authId);
    } else {
      console.log('[admin/seed-defaults] existing auth user found', authId);
    }

    // Upsert application user
    const { data: up, error: upErr } = await supabase
      .from('users')
      .upsert(
        {
          id: authId,
          email: u.email,
          name: u.name,
          role: u.role,
          status: 'active',
          is_active: true,
        },
        { onConflict: 'id' }
      )
      .select('id')
      .single();
    if (upErr || !up) {
      console.error(
        '[admin/seed-defaults] upsert users failed',
        upErr?.message
      );
      return NextResponse.json(
        { success: false, error: upErr?.message || 'upsert users failed' },
        { status: 500 }
      );
    }

    // Link role in user_roles if roles table has this role
    const { data: roleRow } = await supabase
      .from('roles')
      .select('id')
      .eq('name', u.role)
      .maybeSingle();
    if (roleRow?.id) {
      await supabase
        .from('user_roles')
        .upsert(
          { user_id: up.id, role_id: roleRow.id, is_active: true },
          { onConflict: 'user_id,role_id' }
        );
    }

    created.push({ email: u.email, role: u.role });
  }

  console.log('[admin/seed-defaults] created users', created);
  return NextResponse.json({
    success: true,
    users: created,
    password: DEFAULT_PASSWORD,
  });
}
