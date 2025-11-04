/**
 * Enhanced Homepage
 * الصفحة الرئيسية المحسّنة
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { usePreferences } from '@/hooks/usePreferences';
import { useI18n } from '@/hooks/useI18n';
import { I18N_KEYS } from '@/constants/i18n-keys';
import { Languages, Moon, Sun } from 'lucide-react';
import { memo } from 'react';

// Theme and Language Switches Component
const ThemeLanguageSwitches = memo(function ThemeLanguageSwitches() {
  const { theme, language, isLoading, toggleTheme, toggleLanguage } =
    usePreferences();
  const { t } = useI18n(language);

  return (
    <>
      {/* Theme Toggle Button */}
      <button
        className='inline-flex h-9 items-center gap-2 rounded-md border border-[var(--brand-border)] px-3 text-[var(--foreground)] bg-[var(--panel)] hover:bg-[var(--brand-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] disabled:opacity-50 transition-colors'
        onClick={toggleTheme}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleTheme();
          }
        }}
        disabled={isLoading}
        aria-label={isLoading ? 'جاري التحميل...' : t(I18N_KEYS.THEME.LABEL, 'تبديل الثيم')}
      >
        {isLoading ? (
          <div className='h-4 w-4 animate-spin rounded-full border-2 border-[var(--brand-border)] border-t-[var(--brand-primary)]'></div>
        ) : theme === 'light' ? (
          <Sun className='h-4 w-4' />
        ) : (
          <Moon className='h-4 w-4' />
        )}
        <span className='hidden sm:inline'>
          {t(I18N_KEYS.THEME.LABEL, 'الثيم')}
        </span>
      </button>

      {/* Language Toggle Button */}
      <button
        className='inline-flex h-9 items-center gap-2 rounded-md border border-[var(--brand-border)] px-3 text-[var(--foreground)] bg-[var(--panel)] hover:bg-[var(--brand-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] disabled:opacity-50 transition-colors'
        onClick={toggleLanguage}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleLanguage();
          }
        }}
        disabled={isLoading}
        aria-label={isLoading ? 'جاري التحميل...' : language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
      >
        {isLoading ? (
          <div className='h-4 w-4 animate-spin rounded-full border-2 border-[var(--brand-border)] border-t-[var(--brand-primary)]'></div>
        ) : (
          <Languages className='h-4 w-4' />
        )}
        <span className='hidden sm:inline'>
          {language === 'ar' ? 'العربية' : 'English'}
        </span>
      </button>
    </>
  );
});

ThemeLanguageSwitches.displayName = 'ThemeLanguageSwitches';

export default function HomePage() {
  return (
    <div className='min-h-screen bg-background' role="application">
      {/* Skip Link */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--brand-primary)] focus:text-white focus:rounded" aria-label="التخطي للمحتوى الرئيسي">
        التخطي للمحتوى الرئيسي
      </a>

      {/* Header */}
      <header className='nav sticky top-0 z-50' role="banner">
        <div className='container-app py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <h1 className='text-2xl font-bold text-[var(--brand-primary)]'>
                Mu3een
              </h1>
            </div>
            <nav className='flex items-center gap-3' role="navigation" aria-label="القائمة الرئيسية">
              {/* Theme and Language Switches */}
              <ThemeLanguageSwitches />
              <Link href='/login' className='btn btn-outline'>
                تسجيل الدخول
              </Link>
              <Link href='/register' className='btn btn-default'>
                إنشاء حساب
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main id="main-content" className='container-app py-20 text-center' role="main">
        <section className='space-y-8'>
          <h1 className='text-5xl font-bold text-[var(--text-primary)] mb-6'>
            مرحباً بك في نظام Mu3een
          </h1>
          <p className='text-xl text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto'>
            نظام متكامل لإدارة الرعاية الصحية والمعلومات
          </p>
          <div className='flex gap-4 justify-center'>
            <Link href='/login' className='btn btn-default px-8 py-3'>
              تسجيل الدخول
            </Link>
            <Link href='/register' className='btn btn-outline px-8 py-3'>
              إنشاء حساب جديد
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className='container-app py-16 mt-16' aria-labelledby="features-heading">
          <h2 id="features-heading" className='text-3xl font-bold text-center text-[var(--text-primary)] mb-12'>
            المميزات الرئيسية
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='card p-6'>
              <div className='text-4xl mb-4' role="img" aria-label="أمان">🔐</div>
              <h3 className='text-xl font-semibold text-[var(--text-primary)] mb-2'>
                أمان عالي
              </h3>
              <p className='text-[var(--text-secondary)]'>
                نظام مصادقة وتشفير متقدم لحماية بياناتك
              </p>
            </div>
            <div className='card p-6'>
              <div className='text-4xl mb-4' role="img" aria-label="إدارة المستخدمين">👥</div>
              <h3 className='text-xl font-semibold text-[var(--text-primary)] mb-2'>
                إدارة المستخدمين
              </h3>
              <p className='text-[var(--text-secondary)]'>
                إدارة شاملة للمستخدمين والصلاحيات
              </p>
            </div>
            <div className='card p-6'>
              <div className='text-4xl mb-4' role="img" aria-label="تقارير">📊</div>
              <h3 className='text-xl font-semibold text-[var(--text-primary)] mb-2'>
                تقارير شاملة
              </h3>
              <p className='text-[var(--text-secondary)]'>
                تقارير وإحصائيات مفصلة
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className='nav mt-20' role="contentinfo">
        <div className='container-app py-8 text-center text-[var(--text-secondary)]'>
          <p>&copy; 2024 Mu3een. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
}
