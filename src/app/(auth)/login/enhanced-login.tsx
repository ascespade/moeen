/**
 * Enhanced Login Page - Clean & Simple
 * صفحة تسجيل دخول محسّنة - نظيفة وبسيطة
 */

'use client';

import { useCustomAuth } from '@/lib/auth/hooks/useCustomAuth';
import { getDefaultRoute } from '@/lib/auth/RouteManager';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EnhancedLoginPage() {
  const router = useRouter();
  const { login, user, isAuthenticated, loading: isLoading } = useCustomAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Redirect if already authenticated
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
        // Wait to ensure cookie is set and ready for middleware
        await new Promise(resolve => setTimeout(resolve, 500));

        // Get user from localStorage
        const userStr = localStorage.getItem('user');
        let currentRole = 'agent';

        if (userStr) {
          try {
            const userData = JSON.parse(userStr);
            currentRole = userData.role || 'agent';
          } catch (e) {
            console.error('Error parsing user:', e);
          }
        }

        const route = getDefaultRoute(currentRole);
        window.location.href = route;
      } else {
        setError(result.error || 'بيانات الاعتماد غير صحيحة');
      }
    } catch (err: unknown) {
      setError(err?.message || 'حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setSubmitting(false);
    }
  };

  const quickLogin = async (userEmail: string, userPassword: string) => {
    setEmail(userEmail);
    setPassword(userPassword);
    setError(null);
    setSubmitting(true);

    try {
      const result = await login(userEmail, userPassword);

      if (result.success) {
        // Wait to ensure cookie is set and ready for middleware
        await new Promise(resolve => setTimeout(resolve, 500));

        const userStr = localStorage.getItem('user');
        let currentRole = 'agent';

        if (userStr) {
          try {
            const userData = JSON.parse(userStr);
            currentRole = userData.role || 'agent';
          } catch (e) {}
        }

        const route = getDefaultRoute(currentRole);
        window.location.href = route;
      } else {
        setError(result.error || 'بيانات الاعتماد غير صحيحة');
      }
    } catch (err: unknown) {
      setError(err?.message || 'حدث خطأ');
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-[var(--background)]'>
        <div className='text-center'>
          <div className='h-12 w-12 animate-spin rounded-full border-4 border-[var(--border)] border-t-[var(--brand-primary)] mx-auto mb-4'></div>
          <p className='text-[var(--text-secondary)]'>جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-[var(--background)] to-[var(--background-secondary)] p-4'>
      <div className='w-full max-w-md'>
        {/* Logo/Header */}
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-[var(--text-primary)] mb-2'>
            تسجيل الدخول
          </h1>
          <p className='text-[var(--text-secondary)]'>
            أدخل بياناتك للوصول إلى حسابك
          </p>
        </div>

        {/* Login Form */}
        <div className='bg-[var(--background-secondary)] rounded-lg shadow-lg p-6 border border-[var(--border)]'>
          <form onSubmit={handleSubmit} className='space-y-4'>
            {/* Error Message */}
            {error && (
              <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm'>
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-[var(--text-primary)] mb-2'
              >
                البريد الإلكتروني
              </label>
              <input
                id='email'
                type='email'
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className='w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]'
                placeholder='example@email.com'
                disabled={submitting}
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor='password'
                className='block text-sm font-medium text-[var(--text-primary)] mb-2'
              >
                كلمة المرور
              </label>
              <input
                id='password'
                type='password'
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className='w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]'
                placeholder='••••••••'
                disabled={submitting}
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className='flex items-center justify-between'>
              <label className='flex items-center'>
                <input
                  type='checkbox'
                  className='mr-2 rounded border-[var(--border)]'
                />
                <span className='text-sm text-[var(--text-secondary)]'>
                  تذكرني
                </span>
              </label>
              <Link
                href='/forgot-password'
                className='text-sm text-[var(--brand-primary)] hover:underline'
              >
                نسيت كلمة المرور؟
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type='submit'
              disabled={submitting}
              className='w-full bg-[var(--brand-primary)] text-white py-2.5 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {submitting ? (
                <span className='flex items-center justify-center gap-2'>
                  <div className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent'></div>
                  جاري تسجيل الدخول...
                </span>
              ) : (
                'تسجيل الدخول'
              )}
            </button>
          </form>

          {/* Quick Login Buttons */}
          <div className='mt-6 pt-6 border-t border-[var(--border)]'>
            <p className='text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)] mb-4 text-center'>
              🔧 تسجيل دخول سريع (للتجربة)
            </p>
            <div className='grid grid-cols-2 gap-2'>
              <button
                type='button'
                onClick={() => quickLogin('admin@test.com', 'Admin123!')}
                disabled={submitting}
                className='btn btn-sm bg-red-500 hover:bg-red-600 text-white text-xs disabled:opacity-50'
                title='Admin Dashboard'
              >
                👑 Admin
              </button>
              <button
                type='button'
                onClick={() => quickLogin('doctor@test.com', 'Doctor123!')}
                disabled={submitting}
                className='btn btn-sm bg-blue-500 hover:bg-blue-600 text-white text-xs disabled:opacity-50'
                title='Doctor (Agent Role)'
              >
                🩺 Doctor
              </button>
              <button
                type='button'
                onClick={() => quickLogin('patient@test.com', 'Patient123!')}
                disabled={submitting}
                className='btn btn-sm bg-green-500 hover:bg-green-600 text-white text-xs disabled:opacity-50'
                title='Patient (Agent Role)'
              >
                👤 Patient
              </button>
              <button
                type='button'
                onClick={() => quickLogin('staff@test.com', 'Staff123!')}
                disabled={submitting}
                className='btn btn-sm bg-yellow-500 hover:bg-yellow-600 text-white text-xs disabled:opacity-50'
                title='Staff (Agent Role)'
              >
                🏥 Staff
              </button>
            </div>
          </div>
        </div>

        {/* Register Link */}
        <div className='mt-6 text-center'>
          <p className='text-sm text-[var(--text-secondary)]'>
            ليس لديك حساب؟{' '}
            <Link
              href='/register'
              className='text-[var(--brand-primary)] hover:underline font-medium'
            >
              سجّل الآن
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
