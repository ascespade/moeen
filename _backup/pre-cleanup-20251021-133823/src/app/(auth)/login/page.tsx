'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => globalThis.setTimeout(resolve, 1000));

      // For demo purposes, accept any email/password
      if (formData.email && formData.password) {
        router.push('/dashboard');
      } else {
        setError('يرجى إدخال البريد الإلكتروني وكلمة المرور');
      }
    } catch {
      setError('فشل تسجيل الدخول');
    } finally {
      setSubmitting(false);
    }
  };

  // eslint-disable-next-line no-undef
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const handleQuickTestLogin = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await new Promise(resolve => globalThis.setTimeout(resolve, 500));
      router.push('/dashboard');
    } catch {
      setError('فشل تسجيل الدخول السريع');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--color-bg-secondary)] via-white to-[var(--color-bg-secondary)] p-4'>
      <div className='w-full max-w-md'>
        {/* Logo and Header */}
        <div className='text-center mb-8'>
          <div className='w-16 h-16 bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-secondary-500)] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg'>
            <span className='text-white font-bold text-2xl'>م</span>
          </div>
          <h1 className='text-3xl font-bold text-[var(--color-text-primary)] mb-2'>
            مرحباً بعودتك
          </h1>
          <p className='text-[var(--color-text-secondary)]'>
            سجل دخولك للوصول إلى لوحة التحكم
          </p>
        </div>

        {/* Login Form */}
        <div className='card shadow-xl'>
          <div className='p-8'>
            {error && (
              <div className='mb-6 p-4 status-error'>
                <div className='flex items-center gap-2'>
                  <span className='text-lg'>⚠️</span>
                  <p className='text-sm font-medium'>{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className='space-y-6'>
              {/* Email Field */}
              <div>
                <label htmlFor='email' className='form-label'>
                  البريد الإلكتروني
                </label>
                <div className='relative'>
                  <input
                    type='email'
                    id='email'
                    name='email'
                    value={formData.email}
                    onChange={handleInputChange}
                    className='form-input pr-10'
                    placeholder='you@example.com'
                    required
                  />
                  <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
                    <span className='text-gray-400 text-sm'>📧</span>
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor='password' className='form-label'>
                  كلمة المرور
                </label>
                <div className='relative'>
                  <input
                    type='password'
                    id='password'
                    name='password'
                    value={formData.password}
                    onChange={handleInputChange}
                    className='form-input pr-10'
                    placeholder='••••••••••'
                    required
                  />
                  <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
                    <span className='text-gray-400 text-sm'>🔒</span>
                  </div>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className='flex items-center justify-between'>
                <label className='inline-flex items-center gap-3 text-sm font-medium'>
                  <input
                    type='checkbox'
                    name='rememberMe'
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className='w-4 h-4 rounded border-gray-300 text-[var(--color-primary-500)] focus:ring-[var(--color-primary-500)] focus:ring-2'
                  />
                  تذكرني
                </label>
                <Link
                  href='/forgot-password'
                  className='text-sm font-medium text-[var(--color-primary-500)] hover:text-[var(--color-primary-600)] transition-colors'
                >
                  نسيت كلمة المرور؟
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type='submit'
                disabled={submitting}
                className='w-full btn btn-brand btn-lg font-semibold'
              >
                {submitting ? (
                  <>
                    <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                    جاري تسجيل الدخول...
                  </>
                ) : (
                  <>
                    <span>🔑</span>
                    تسجيل الدخول
                  </>
                )}
              </button>
            </form>

            <div className='mt-6 pt-6 border-t border-[var(--color-primary-500)]'>
              <p className='text-center text-sm text-[var(--color-text-secondary)]'>
                ليس لديك حساب؟{' '}
                <Link
                  href='/register'
                  className='font-medium text-[var(--color-primary-500)] hover:text-[var(--color-primary-600)] transition-colors'
                >
                  إنشاء حساب جديد
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className='mt-8 text-center'>
          <p className='text-xs text-gray-500'>
            © 2024 مركز الهمم. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </div>
  );
}
