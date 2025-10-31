'use client';
import { useState, useEffect, useMemo, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getBrowserSupabase } from '@/lib/supabaseClient';
export const dynamic = 'force-dynamic';

const ROLE_REDIRECTS: Record<string, string> = {
  admin: '/admin/dashboard',
  doctor: '/dashboard/doctor',
  staff: '/dashboard/staff',
  patient: '/dashboard/patient',
  supervisor: '/dashboard/supervisor',
  customer: '/dashboard',
};

function getRedirectForRole(role?: string | null) {
  if (!role) return '/dashboard';
  // Normalize role name (handle both 'admin' and 'Administrator' etc.)
  const normalizedRole = role.toLowerCase().trim();
  return ROLE_REDIRECTS[normalizedRole] || ROLE_REDIRECTS[role] || '/dashboard';
}

export default function LoginPage() {
  const router = useRouter();
  const supabase = useMemo(() => getBrowserSupabase(), []);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // If session already exists, resolve role and redirect
  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      const session = data?.session;
      if (mounted && session?.user?.id) {
        const redirect = await resolveRedirectAfterLogin(
          session.user.id,
          session.user.email || undefined
        );
        router.replace(redirect);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [router, supabase]);

  async function fetchPermissions(
    userId: string,
    roleId?: string | null
  ): Promise<string[]> {
    const perms = new Set<string>();

    // Role permissions
    let roleIdToUse: string | undefined | null = roleId ?? null;
    if (!roleIdToUse) {
      const { data: ur } = await supabase
        .from('user_roles')
        .select('role_id')
        .eq('user_id', userId)
        .maybeSingle();
      roleIdToUse = ur?.role_id as string | undefined;
    }
    if (roleIdToUse) {
      const { data: rolePermRows } = await supabase
        .from('role_permissions')
        .select('permission_id')
        .eq('role_id', roleIdToUse);
      const rolePermIds = (rolePermRows || [])
        .map((rp: { permission_id: string }) => rp.permission_id)
        .filter(Boolean);
      if (rolePermIds.length) {
        const { data: permRows } = await supabase
          .from('permissions')
          .select('code')
          .in('id', rolePermIds as string[]);
        (permRows || []).forEach((p: { code?: string }) => p?.code && perms.add(p.code));
      }
    }

    // User direct permissions
    const { data: userPermRows } = await supabase
      .from('user_permissions')
      .select('permission_id')
      .eq('user_id', userId);
    const userPermIds = (userPermRows || [])
      .map((up: { permission_id: string }) => up.permission_id)
      .filter(Boolean);
    if (userPermIds.length) {
      const { data: permRows } = await supabase
        .from('permissions')
        .select('code')
        .in('id', userPermIds as string[]);
      (permRows || []).forEach((p: { code?: string }) => p?.code && perms.add(p.code));
    }

    return Array.from(perms);
  }

  async function resolveRedirectAfterLogin(
    userId: string,
    userEmail?: string
  ): Promise<string> {
    // Check user status and resolve role
    const { data: userRow, error: userErr } = await supabase
      .from('users')
      .select('status, role')
      .eq('id', userId)
      .maybeSingle();

    if (userErr) {
      return '/dashboard';
    }

    const inactiveByStatus = userRow?.status && userRow.status !== 'active';
    if (inactiveByStatus) {
      await supabase.auth.signOut();
      setError('⚠️ حسابك قيد المراجعة. يرجى التواصل مع المشرف.');
      return '/login';
    }

    // Determine role (via user_roles -> roles, fallback users.role)
    let roleId: string | null = null;
    let roleName: string | null = null;

    // First, try to get role from user_roles table (new system)
    const { data: ur } = await supabase
      .from('user_roles')
      .select('role_id, is_active')
      .eq('user_id', userId)
      .eq('is_active', true)
      .maybeSingle();

    if (ur?.role_id) {
      roleId = ur.role_id as string;
      const { data: role } = await supabase
        .from('roles')
        .select('name')
        .eq('id', roleId)
        .maybeSingle();
      roleName = role?.name ?? null;
    }

    // Fallback to users.role column if no role found in user_roles
    if (!roleName && userRow?.role) {
      roleName = userRow.role as string;
    }

    // Normalize role name (handle variations)
    if (roleName) {
      roleName = roleName.toLowerCase().trim();
    }

    // If still no role, try to auto-assign patient role (only as last resort)
    if (!roleName) {
      const { data: patientRole } = await supabase
        .from('roles')
        .select('id, name')
        .eq('name', 'patient')
        .maybeSingle();
      if (patientRole?.id) {
        try {
          await supabase
            .from('user_roles')
            .upsert(
              { user_id: userId, role_id: patientRole.id, is_active: true },
              { onConflict: 'user_id,role_id' }
            );
          roleName = 'patient';
        } catch (e) {
          console.error('Failed to auto-assign patient role:', e);
        }
      }
    }

    // If still no role found, reject login
    if (!roleName) {
      await supabase.auth.signOut();
      setError('⚠️ لا توجد صلاحية مرتبطة بحسابك. يرجى التواصل مع المشرف.');
      return '/login';
    }

    // Fetch permissions and persist locally for client-side checks
    try {
      const permissions = await fetchPermissions(userId, roleId);
      localStorage.setItem('permissions', JSON.stringify(permissions));
      const clientUser = {
        id: userId,
        email: userEmail || '',
        role: roleName,
      } as any;
      localStorage.setItem('user', JSON.stringify(clientUser));
    } catch (e) {
      // Ignore permission fetch errors but continue redirect
    }

    return getRedirectForRole(roleName);
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError || !data?.user) {
        setError('بيانات الاعتماد غير صحيحة.');
        setSubmitting(false);
        return;
      }

      // Wait a bit for session to be saved to cookies
      await new Promise(resolve => setTimeout(resolve, 500));

      const redirectTo = await resolveRedirectAfterLogin(
        data.user.id,
        data.user.email || undefined
      );
      if (redirectTo === '/login') {
        setSubmitting(false);
        return;
      }

      // Ensure session is persisted before redirect
      await supabase.auth.getSession();

      router.replace(redirectTo);
    } catch (err: any) {
      setError(err?.message || 'حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-[var(--default-surface)] via-white to-[var(--bg-gray-50)] p-4'>
      <div className='w-full max-w-md'>
        <div className='mb-8 text-center'>
          <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-[var(--default-default)] to-[var(--default-info)] shadow-lg'>
            <span className='text-2xl font-bold text-white'>م</span>
          </div>
          <h1 className='mb-2 text-3xl font-bold text-gray-900 dark:text-white'>
            مرحباً بعودتك
          </h1>
          <p className='text-gray-600 dark:text-gray-400'>
            سجل دخولك للوصول إلى لوحة التحكم
          </p>
        </div>

        <div className='card shadow-xl'>
          <div className='p-8'>
            {error && (
              <div className='status-error mb-6 p-4'>
                <div className='flex items-center gap-2'>
                  <span className='text-lg'>⚠️</span>
                  <p className='text-sm font-medium'>{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className='space-y-6'>
              <div>
                <label className='form-label'>البريد الإلكتروني</label>
                <div className='relative'>
                  <input
                    type='email'
                    name='email'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className='form-input pr-10'
                    placeholder='you@example.com'
                    data-testid='email-input'
                  />
                  <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3'>
                    <span className='text-sm text-gray-400'>📧</span>
                  </div>
                </div>
              </div>

              <div>
                <label className='form-label'>كلمة المرور</label>
                <div className='relative'>
                  <input
                    type='password'
                    name='password'
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className='form-input pr-10'
                    placeholder='••••••••'
                    data-testid='password-input'
                  />
                  <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3'>
                    <span className='text-sm text-gray-400'>🔒</span>
                  </div>
                </div>
              </div>

              <div className='flex items-center justify-between'>
                <label className='inline-flex items-center gap-3 text-sm font-medium'>
                  <input
                    type='checkbox'
                    name='rememberMe'
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className='text-default focus:ring-default h-4 w-4 rounded border-gray-300 focus:ring-2'
                    data-testid='remember-me-checkbox'
                  />
                  تذكرني
                </label>
                <Link
                  href='/forgot-password'
                  className='text-default text-sm font-medium transition-colors hover:text-[var(--default-default-hover)]'
                >
                  نسيت كلمة المرور؟
                </Link>
              </div>

              <button
                type='submit'
                disabled={submitting}
                className='btn btn-default btn-lg w-full font-semibold'
                data-testid='login-button'
              >
                {submitting ? (
                  <>
                    <div className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent'></div>
                    جارٍ تسجيل الدخول...
                  </>
                ) : (
                  <>
                    <span>🔑</span>
                    تسجيل الدخول
                  </>
                )}
              </button>
            </form>

            {/* Quick Login Buttons for Testing */}
            {process.env.NODE_ENV !== 'production' && (
              <div className='border-default mt-6 border-t pt-6'>
                <p className='mb-4 text-center text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400'>
                  🔧 تسجيل دخول سريع (للتجربة)
                </p>
                <div className='grid grid-cols-2 gap-2'>
                  <button
                    type='button'
                    onClick={() => {
                      setEmail('admin@test.local');
                      setPassword('A123456');
                    }}
                    className='btn btn-sm btn-outline text-xs hover:bg-blue-50 dark:hover:bg-blue-900/20'
                    title='Admin Dashboard'
                  >
                    👑 Admin
                  </button>
                  <button
                    type='button'
                    onClick={() => {
                      setEmail('doctor@test.local');
                      setPassword('A123456');
                    }}
                    className='btn btn-sm btn-outline text-xs hover:bg-green-50 dark:hover:bg-green-900/20'
                    title='Doctor Dashboard'
                  >
                    🩺 Doctor
                  </button>
                  <button
                    type='button'
                    onClick={() => {
                      setEmail('patient@test.local');
                      setPassword('A123456');
                    }}
                    className='btn btn-sm btn-outline text-xs hover:bg-purple-50 dark:hover:bg-purple-900/20'
                    title='Patient Dashboard'
                  >
                    👤 Patient
                  </button>
                  <button
                    type='button'
                    onClick={() => {
                      setEmail('staff@test.local');
                      setPassword('A123456');
                    }}
                    className='btn btn-sm btn-outline text-xs hover:bg-orange-50 dark:hover:bg-orange-900/20'
                    title='Staff Dashboard'
                  >
                    🏥 Staff
                  </button>
                  <button
                    type='button'
                    onClick={() => {
                      setEmail('supervisor@test.local');
                      setPassword('A123456');
                    }}
                    className='btn btn-sm btn-outline text-xs hover:bg-indigo-50 dark:hover:bg-indigo-900/20'
                    title='Supervisor Dashboard'
                  >
                    👔 Supervisor
                  </button>
                  <button
                    type='button'
                    onClick={() => {
                      setEmail('manager@test.local');
                      setPassword('A123456');
                    }}
                    className='btn btn-sm btn-outline text-xs hover:bg-teal-50 dark:hover:bg-teal-900/20'
                    title='Manager Dashboard'
                  >
                    📊 Manager
                  </button>
                </div>
                <p className='mt-3 text-center text-xs text-gray-500 dark:text-gray-400'>
                  كلمة المرور: <code className='rounded bg-gray-100 px-1 py-0.5 dark:bg-gray-800'>A123456</code>
                </p>
              </div>
            )}

            <div className='border-default mt-6 border-t pt-6'>
              <p className='text-center text-sm text-gray-600 dark:text-gray-400'>
                ليس لديك حساب؟{' '}
                <Link
                  href='/register'
                  className='text-default font-medium transition-colors hover:text-[var(--default-default-hover)]'
                >
                  إنشاء حساب جديد
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
