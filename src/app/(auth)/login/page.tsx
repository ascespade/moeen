'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCustomAuth } from '@/lib/auth/hooks/useCustomAuth';
import { getDefaultRoute } from '@/lib/auth/unified-auth';
export const dynamic = 'force-dynamic';

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
      if (result.success) {
        // Get user from state or fetch
        const currentUser = user || await fetchUser();
        if (currentUser) {
          const route = getDefaultRoute(currentUser.role);
          router.push(route);
        } else {
          router.push('/dashboard');
        }
      } else {
        setError(result.error || 'بيانات الاعتماد غير صحيحة.');
      }
    } catch (err: any) {
      setError(err?.message || 'حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setSubmitting(false);
    }
  };

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return null;
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      if (response.ok) {
        const data = await response.json();
        return data.user;
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>جاري التحميل...</p>
        </div>
      </div>
    );
  }

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
            <div className='border-default mt-6 border-t pt-6'>
              <p className='mb-4 text-center text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400'>
                🔧 تسجيل دخول سريع (للتجربة)
              </p>
                <div className='grid grid-cols-2 gap-2'>
                  <button
                    type='button'
                    onClick={async () => {
                      setEmail('admin@test.com');
                      setPassword('Admin123!');
                      setError(null);
                      setSubmitting(true);
                      try {
                        const result = await login('admin@test.com', 'Admin123!');
                        if (result.success) {
                          router.push('/dashboard');
                        } else {
                          setError(result.error || 'بيانات الاعتماد غير صحيحة.');
                        }
                      } catch (err: any) {
                        setError(err?.message || 'حدث خطأ أثناء تسجيل الدخول');
                      } finally {
                        setSubmitting(false);
                      }
                    }}
                    disabled={submitting}
                    className='btn btn-sm bg-red-500 hover:bg-red-600 text-white text-xs disabled:opacity-50 disabled:cursor-not-allowed'
                    title='Admin Dashboard'
                  >
                    👑 Admin
                  </button>
                  <button
                    type='button'
                    onClick={async () => {
                      setEmail('doctor@test.com');
                      setPassword('Doctor123!');
                      setError(null);
                      setSubmitting(true);
                      try {
                        const result = await login('doctor@test.com', 'Doctor123!');
                        if (result.success) {
                          router.push('/dashboard');
                        } else {
                          setError(result.error || 'بيانات الاعتماد غير صحيحة.');
                        }
                      } catch (err: any) {
                        setError(err?.message || 'حدث خطأ أثناء تسجيل الدخول');
                      } finally {
                        setSubmitting(false);
                      }
                    }}
                    disabled={submitting}
                    className='btn btn-sm bg-blue-500 hover:bg-blue-600 text-white text-xs disabled:opacity-50 disabled:cursor-not-allowed'
                    title='Doctor (Agent Role)'
                  >
                    🩺 Doctor
                  </button>
                  <button
                    type='button'
                    onClick={async () => {
                      setEmail('patient@test.com');
                      setPassword('Patient123!');
                      setError(null);
                      setSubmitting(true);
                      try {
                        const result = await login('patient@test.com', 'Patient123!');
                        if (result.success) {
                          router.push('/dashboard');
                        } else {
                          setError(result.error || 'بيانات الاعتماد غير صحيحة.');
                        }
                      } catch (err: any) {
                        setError(err?.message || 'حدث خطأ أثناء تسجيل الدخول');
                      } finally {
                        setSubmitting(false);
                      }
                    }}
                    disabled={submitting}
                    className='btn btn-sm bg-green-500 hover:bg-green-600 text-white text-xs disabled:opacity-50 disabled:cursor-not-allowed'
                    title='Patient (Agent Role)'
                  >
                    👤 Patient
                  </button>
                  <button
                    type='button'
                    onClick={async () => {
                      setEmail('staff@test.com');
                      setPassword('Staff123!');
                      setError(null);
                      setSubmitting(true);
                      try {
                        const result = await login('staff@test.com', 'Staff123!');
                        if (result.success) {
                          router.push('/dashboard');
                        } else {
                          setError(result.error || 'بيانات الاعتماد غير صحيحة.');
                        }
                      } catch (err: any) {
                        setError(err?.message || 'حدث خطأ أثناء تسجيل الدخول');
                      } finally {
                        setSubmitting(false);
                      }
                    }}
                    disabled={submitting}
                    className='btn btn-sm bg-yellow-500 hover:bg-yellow-600 text-white text-xs disabled:opacity-50 disabled:cursor-not-allowed'
                    title='Staff (Agent Role)'
                  >
                    🏥 Staff
                  </button>
                </div>
              <div className='mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg'>
                <p className='mb-2 text-xs font-medium text-gray-700 dark:text-gray-300'>Test Credentials:</p>
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
            </div>

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
