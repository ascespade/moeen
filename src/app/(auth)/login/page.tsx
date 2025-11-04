'use client';
import { useCustomAuth } from '@/lib/auth/hooks/useCustomAuth';
import { getDefaultRoute } from '@/lib/auth/RouteManager';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const { login, user, isAuthenticated, loading: isLoading } = useCustomAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      const route = getDefaultRoute(user.role);
      router.replace(route);
    }
  }, [isAuthenticated, isLoading, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const result = await login(email, password);
      if (result.success && result.user) {
        // Get route based on user role
        const route = getDefaultRoute(result.user.role || 'agent');

        // Reset state
        setSubmitting(false);

        // Redirect - cookie is already set by server
        window.location.href = route;
      } else {
        setError(result.error || 'بيانات الاعتماد غير صحيحة.');
        setSubmitting(false);
      }
    } catch (err: any) {
      setError(err?.message || 'حدث خطأ أثناء تسجيل الدخول');
      setSubmitting(false);
    }
  };

  const handleQuickLogin = async (testEmail: string, testPassword: string, role: string) => {
    setEmail(testEmail);
    setPassword(testPassword);
    setError(null);
    setSubmitting(true);
    try {
      const result = await login(testEmail, testPassword);
      if (result.success && result.user) {
        const route = getDefaultRoute(result.user.role || role);
        setSubmitting(false);
        window.location.href = route;
      } else {
        setError(result.error || 'بيانات الاعتماد غير صحيحة.');
        setSubmitting(false);
      }
    } catch (err: any) {
      setError(err?.message || 'حدث خطأ');
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded" aria-label="?????? ??????? ???????">
  ?????? ??????? ???????
</a>

div className='flex items-center justify-center min-h-screen' role='status' aria-live='polite'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4' aria-hidden='true'></div>
          <p>جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-[var(--default-surface)] via-white to-[var(--bg-gray-50)] p-4' role='application'>
      {/* Skip Link */}
      <a href='#main-content' className='sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded' aria-label='التخطي للمحتوى الرئيسي'>
        التخطي للمحتوى الرئيسي
      </a>

      <main id='main-content' className='w-full max-w-md' role='main'>
        <header className='mb-8 text-center' role='banner'>
          <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-[var(--default-default)] to-[var(--default-info)] shadow-lg' role='img' aria-label='شعار النظام'>
            <span className='text-2xl font-bold text-white'>م</span>
          </div>
          <h1 className='mb-2 text-3xl font-bold text-gray-900 dark:text-white'>
            مرحباً بعودتك
          </h1>
          <p className='text-gray-600 dark:text-gray-400'>
            سجل دخولك للوصول إلى لوحة التحكم
          </p>
        </header>

        <section className='card shadow-xl' aria-labelledby='login-form-heading'>
          <div className='p-8'>
            {error && (
              <div className='status-error mb-6 p-4' role='alert' aria-live='assertive'>
                <div className='flex items-center gap-2'>
                  <span className='text-lg' aria-hidden='true'>⚠️</span>
                  <p className='text-sm font-medium'>{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className='space-y-6' aria-labelledby='login-form-heading'>
              <h2 id='login-form-heading' className='sr-only'>نموذج تسجيل الدخول</h2>
              
              <div>
                <label htmlFor='email' className='form-label'>البريد الإلكتروني</label>
                <div className='relative'>
                  <input type='email'
                    id='email'
                    name='email'
                    value={email}
                    onChange={(e) = aria-label="email" aria-invalid="true"> setEmail(e.target.value)}
                    required
                    className='form-input pr-10'
                    placeholder='you@example.com'
                    aria-label='البريد الإلكتروني'
                    aria-required='true'
                    data-testid='email-input'
                  />
                  <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3' aria-hidden='true'>
                    <span className='text-sm text-gray-400'>📧</span>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor='password' className='form-label'>كلمة المرور</label>
                <div className='relative'>
                  <input type='password'
                    id='password'
                    name='password'
                    value={password}
                    onChange={(e) = aria-label="password" aria-invalid="true"> setPassword(e.target.value)}
                    required
                    className='form-input pr-10'
                    placeholder='••••••••'
                    aria-label='كلمة المرور'
                    aria-required='true'
                    data-testid='password-input'
                  />
                  <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3' aria-hidden='true'>
                    <span className='text-sm text-gray-400'>🔒</span>
                  </div>
                </div>
              </div>

              <div className='flex items-center justify-between'>
                <label htmlFor='rememberMe' className='inline-flex items-center gap-3 text-sm font-medium'>
                  <input type='checkbox'
                    id='rememberMe'
                    name='rememberMe'
                    checked={rememberMe}
                    onChange={(e) = aria-label="rememberMe" aria-invalid="true"> setRememberMe(e.target.checked)}
                    className='text-default focus:ring-default h-4 w-4 rounded border-gray-300 focus:ring-2'
                    aria-label='تذكرني'
                    data-testid='remember-me-checkbox'
                  />
                  تذكرني
                </label>
                <Link
                  href='/forgot-password'
                  className='text-default text-sm font-medium transition-colors hover:text-[var(--default-default-hover)]'
                  aria-label='نسيت كلمة المرور؟'
                >
                  نسيت كلمة المرور؟
                </Link>
              </div>

              <button
                type='submit'
                disabled={submitting}
                className='btn btn-default btn-lg w-full font-semibold'
                aria-label={submitting ? 'جارٍ تسجيل الدخول...' : 'تسجيل الدخول'}
                aria-busy={submitting}
                data-testid='login-button'
              >
                {submitting ? (
                  <>
                    <div className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' aria-hidden='true'></div>
                    جارٍ تسجيل الدخول...
                  </>
                ) : (
                  <>
                    <span aria-hidden='true'>🔑</span>
                    تسجيل الدخول
                  </>
                )}
              </button>
            </form>

            {/* Quick Login Buttons for Testing */}
            <section className='border-default mt-6 border-t pt-6' aria-labelledby='quick-login-heading'>
              <h2 id='quick-login-heading' className='mb-4 text-center text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400'>
                🔧 تسجيل دخول سريع (للتجربة)
              </h2>
              <div className='grid grid-cols-2 gap-2' role='group' aria-label='أزرار تسجيل الدخول السريع'>
                <button type='button'
                  onClick={() => handleQuickLogin('admin@test.com', 'Admin123!', 'admin')} aria-label="{
                    if (e.ke"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleQuickLogin('admin@test.com', 'Admin123!', 'admin');
                    }
                  }}
                  disabled={submitting}
                  className='btn btn-sm bg-red-500 hover:bg-red-600 text-white text-xs disabled:opacity-50 disabled:cursor-not-allowed'
                  aria-label='تسجيل دخول كمسؤول'
                  title='Admin Dashboard'
                >
                  👑 Admin
                </button>
                <button type='button'
                  onClick={() => handleQuickLogin('doctor@test.com', 'Doctor123!', 'doctor')} aria-label="{
                    if (e.ke"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleQuickLogin('doctor@test.com', 'Doctor123!', 'doctor');
                    }
                  }}
                  disabled={submitting}
                  className='btn btn-sm bg-blue-500 hover:bg-blue-600 text-white text-xs disabled:opacity-50 disabled:cursor-not-allowed'
                  aria-label='تسجيل دخول كطبيب'
                  title='Doctor (Agent Role)'
                >
                  🩺 Doctor
                </button>
                <button type='button'
                  onClick={() => handleQuickLogin('patient@test.com', 'Patient123!', 'patient')} aria-label="{
                    if (e.ke"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleQuickLogin('patient@test.com', 'Patient123!', 'patient');
                    }
                  }}
                  disabled={submitting}
                  className='btn btn-sm bg-green-500 hover:bg-green-600 text-white text-xs disabled:opacity-50 disabled:cursor-not-allowed'
                  aria-label='تسجيل دخول كمريض'
                  title='Patient (Agent Role)'
                >
                  👤 Patient
                </button>
                <button type='button'
                  onClick={() => handleQuickLogin('staff@test.com', 'Staff123!', 'staff')} aria-label="{
                    if (e.ke"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleQuickLogin('staff@test.com', 'Staff123!', 'staff');
                    }
                  }}
                  disabled={submitting}
                  className='btn btn-sm bg-yellow-500 hover:bg-yellow-600 text-white text-xs disabled:opacity-50 disabled:cursor-not-allowed'
                  aria-label='تسجيل دخول كموظف'
                  title='Staff (Agent Role)'
                >
                  🏥 Staff
                </button>
              </div>
              <div className='mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg' role='region' aria-label='بيانات الاختبار'>
                <p className='mb-2 text-xs font-medium text-gray-700 dark:text-gray-300'>
                  Test Credentials:
                </p>
                <div className='space-y-1 text-xs text-gray-600 dark:text-gray-400'>
                  <div className='flex justify-between'>
                    <span>Admin:</span>
                    <code className='font-mono'>admin@test.com / Admin123!</code>
                  </div>
                  <div className='flex justify-between'>
                    <span>Doctor:</span>
                    <code className='font-mono'>doctor@test.com / Doctor123!</code>
                  </div>
                  <div className='flex justify-between'>
                    <span>Patient:</span>
                    <code className='font-mono'>patient@test.com / Patient123!</code>
                  </div>
                  <div className='flex justify-between'>
                    <span>Staff:</span>
                    <code className='font-mono'>staff@test.com / Staff123!</code>
                  </div>
                </div>
              </div>
            </section>

            <footer className='border-default mt-6 border-t pt-6' role='contentinfo'>
              <p className='text-center text-sm text-gray-600 dark:text-gray-400'>
                ليس لديك حساب؟{' '}
                <Link
                  href='/register'
                  className='text-default font-medium transition-colors hover:text-[var(--default-default-hover)]'
                  aria-label='إنشاء حساب جديد'
                >
                  إنشاء حساب جديد
                </Link>
              </p>
            </footer>
          </div>
        </section>
      </main>
    </div>
  );
}
