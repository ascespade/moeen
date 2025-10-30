'use client';
import { useState, useEffect, useMemo, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getBrowserSupabase } from '@/lib/supabaseClient';

const ROLE_REDIRECTS: Record<string, string> = {
  admin: '/dashboard/admin',
  doctor: '/dashboard/doctor',
  staff: '/dashboard/staff',
  patient: '/dashboard/patient',
  customer: '/dashboard/customer',
};

function getRedirectForRole(role?: string | null) {
  if (!role) return '/dashboard';
  return ROLE_REDIRECTS[role] || '/dashboard';
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
        const redirect = await resolveRedirectAfterLogin(session.user.id);
        router.replace(redirect);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [router, supabase]);

  async function resolveRedirectAfterLogin(userId: string): Promise<string> {
    // Check user status
    const { data: userRow, error: userErr } = await supabase
      .from('users')
      .select('status, role')
      .eq('id', userId)
      .maybeSingle();

    if (userErr) {
      // In case of metadata table missing or error, keep user signed in but send to default dashboard
      return '/dashboard';
    }

    if (userRow && userRow.status && userRow.status !== 'active') {
      // Block inactive
      await supabase.auth.signOut();
      setError('⚠️ حسابك قيد المراجعة. يرجى التواصل مع المشرف.');
      return '/login';
    }

    // Try user_roles -> roles join (two-step to avoid FK dependency issues)
    let roleName: string | null = null;
    const { data: ur } = await supabase
      .from('user_roles')
      .select('role_id')
      .eq('user_id', userId)
      .maybeSingle();

    if (ur?.role_id) {
      const { data: role } = await supabase
        .from('roles')
        .select('name')
        .eq('id', ur.role_id as string)
        .maybeSingle();
      roleName = role?.name ?? null;
    }

    if (!roleName && userRow?.role) {
      roleName = userRow.role as string;
    }

    if (!roleName) {
      await supabase.auth.signOut();
      setError('⚠️ لا توجد صلاحية مرتبطة بحسابك. يرجى التواصل مع المشرف.');
      return '/login';
    }

    return getRedirectForRole(roleName);
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError || !data?.user) {
        setError('بيانات الاعتماد غير صحيحة.');
        setSubmitting(false);
        return;
      }

      const redirectTo = await resolveRedirectAfterLogin(data.user.id);
      if (redirectTo === '/login') {
        // resolveRedirectAfterLogin already set error and signed out
        setSubmitting(false);
        return;
      }

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
                    <span>����</span>
                    تسجيل الدخول
                  </>
                )}
              </button>
            </form>

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
