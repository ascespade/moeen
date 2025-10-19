'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

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
      await new Promise(resolve => setTimeout(resolve, 1000));

      // For demo purposes, accept any email/password
      if (formData.email && formData.password) {
        router.push('/dashboard');
      } else {
        setError('يرجى إدخال البريد الإلكتروني وكلمة المرور');
      }
    } catch (err: any) {
      setError('فشل تسجيل الدخول');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleQuickTestLogin = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      router.push('/dashboard');
    } catch (err: any) {
      setError('فشل تسجيل الدخول السريع');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-[var(--brand-surface)] via-white to-[var(--bg-gray-50)] p-4'>
      <div className='w-full max-w-md'>
        {/* Logo and Header */}
        <div className='mb-8 text-center'>
          <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] shadow-lg'>
            <span className='text-2xl font-bold text-white'>م</span>
          </div>
          <h1 className='mb-2 text-3xl font-bold text-foreground'>
            مرحباً بعودتك
          </h1>
          <p className='text-muted-foreground'>
            سجل دخولك للوصول إلى لوحة التحكم
          </p>
        </div>

        {/* Login Form */}
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
              {/* Email Field */}
              <div>
                <label htmlFor='email' className='form-label'>
                  البريد الإلكتروني
                </label>
                <input
                  type='email'
                  id='email'
                  name='email'
                  value={formData.email}
                  onChange={handleInputChange}
                  className='form-input'
                  placeholder='أدخل بريدك الإلكتروني'
                  required
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor='password' className='form-label'>
                  كلمة المرور
                </label>
                <input
                  type='password'
                  id='password'
                  name='password'
                  value={formData.password}
                  onChange={handleInputChange}
                  className='form-input'
                  placeholder='أدخل كلمة المرور'
                  required
                />
              </div>

              {/* Remember Me & Forgot Password */}
              <div className='flex items-center justify-between'>
                <label className='form-checkbox'>
                  <input
                    type='checkbox'
                    name='rememberMe'
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                  />
                  تذكرني
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
                className='btn btn-brand btn-lg w-full'
              >
                {submitting ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
              </button>
            </form>

            {/* Quick Test Login */}
            <div className='mt-6'>
              <button
                onClick={handleQuickTestLogin}
                disabled={submitting}
                className='btn btn-outline btn-md w-full'
              >
                تسجيل دخول تجريبي
              </button>
            </div>

            {/* Divider */}
            <div className='my-6 flex items-center'>
              <div className='flex-1 border-t border-gray-200 dark:border-gray-700'></div>
              <span className='px-4 text-sm text-gray-500'>أو</span>
              <div className='flex-1 border-t border-gray-200 dark:border-gray-700'></div>
            </div>

            {/* Social Login */}
            <div className='space-y-3'>
              <button className='btn btn-ghost btn-md w-full flex items-center justify-center gap-2'>
                <span>📧</span>
                تسجيل الدخول بـ Google
              </button>
              <button className='btn btn-ghost btn-md w-full flex items-center justify-center gap-2'>
                <span>📱</span>
                تسجيل الدخول بـ Apple
              </button>
            </div>

            {/* Sign Up Link */}
            <div className='mt-6 text-center'>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                ليس لديك حساب؟{' '}
                <Link
                  href='/register'
                  className='text-[var(--brand-primary)] hover:underline font-medium'
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
