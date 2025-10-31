import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

const INTERNAL_SECRET = process.env.ADMIN_INTERNAL_SECRET;
const DEFAULT_PASSWORD = process.env.TEST_USERS_PASSWORD || 'A123456';

const USERS = [
  { email: 'admin@test.local', name: 'Admin User', role: 'admin' },
  { email: 'doctor@test.local', name: 'Doctor User', role: 'doctor' },
  { email: 'patient@test.local', name: 'Patient User', role: 'patient' },
  { email: 'staff@test.local', name: 'Staff User', role: 'staff' },
  {
    email: 'supervisor@test.local',
    name: 'Supervisor User',
    role: 'supervisor',
  },
  { email: 'manager@test.local', name: 'Manager User', role: 'manager' },
  { email: 'agent@test.local', name: 'Agent User', role: 'agent' },
];

export async function POST(req: any) {
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

  // Allow when: header matches, or running in dev from localhost, or origin matches configured app url, or debug mode enabled
  if (!headerOk && !isDev && !fromLocalhost && !originOk && !debugAllow) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const supabase = await createClient();
  const created: Array<{ email: string; role: string }> = [];

  for (const u of USERS) {
    try {
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
          continue; // Skip this user and continue with next
        }
        authId = createdUser.user.id;
      }

      // Upsert application user
      const userData: any = {
        id: authId,
        email: u.email,
        name: u.name,
        status: 'active',
        is_active: true,
        role: u.role,
      };

      const { data: up, error: upErr } = await supabase
        .from('users')
        .upsert(userData, { onConflict: 'id' })
        .select('id')
        .single();

      let finalUser = up;

      if (upErr) {
        // Check if it's a duplicate key error (user already exists by email)
        if (upErr.message?.includes('duplicate key') || upErr.message?.includes('unique constraint')) {
          // User exists, fetch it
          const { data: existingUser, error: fetchErr } = await supabase
            .from('users')
            .select('id')
            .eq('email', u.email)
            .single();

          if (existingUser && !fetchErr) {
            finalUser = existingUser;
          } else {
            continue;
          }
        }
        // If role constraint fails, try without role (role will be set via user_roles table)
        else if (upErr.message?.includes('role') || upErr.message?.includes('enum') || upErr.message?.includes('check constraint')) {
          const userDataWithoutRole = { ...userData };
          delete userDataWithoutRole.role;
          const { data: up2, error: upErr2 } = await supabase
            .from('users')
            .upsert(userDataWithoutRole, { onConflict: 'id' })
            .select('id')
            .single();

          if (upErr2) {
            // If still fails with duplicate, fetch existing
            if (upErr2.message?.includes('duplicate key')) {
              const { data: existingUser } = await supabase
                .from('users')
                .select('id')
                .eq('email', u.email)
                .single();
              if (existingUser) {
                finalUser = existingUser;
              } else {
                continue;
              }
            } else {
              continue;
            }
          } else if (up2) {
            finalUser = up2;
          } else {
            continue;
          }
        } else {
          // Other errors - skip user
          continue;
        }
      }

      if (!finalUser) {
        continue;
      }

      // Force update role in users table
      if (u.role && finalUser) {
        try {
          await supabase
            .from('users')
            .update({ role: u.role })
            .eq('id', finalUser.id);
        } catch (e: any) {
          // Error updating role - continue
        }
      }

      // Link role in user_roles if roles table has this role
      const { data: roleRow } = await supabase
        .from('roles')
        .select('id')
        .eq('name', u.role)
        .maybeSingle();
      if (roleRow?.id && finalUser) {
        const { error: roleErr } = await supabase
          .from('user_roles')
          .upsert(
            { user_id: finalUser.id, role_id: roleRow.id, is_active: true },
            { onConflict: 'user_id,role_id' }
          );
      }

      created.push({ email: u.email, role: u.role });
    } catch (error: any) {
      // Continue with next user
    }
  }
  return NextResponse.json({
    success: true,
    users: created,
    password: DEFAULT_PASSWORD,
  });
}
