'use client';
import { ROUTES } from '@/constants/routes';
import { useI18n } from '@/hooks/useI18n';
import { usePreferences } from '@/hooks/usePreferences';
import { UI_CONSTANTS } from '@/lib/constants/ui';
import { Languages, Moon, Sun } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { memo } from 'react';

// Theme and Language Switches Component
const ThemeLanguageSwitches = memo(function ThemeLanguageSwitches() {
  const {
    theme,
    language,
    isLoading,
    toggleTheme,
    toggleLanguage,
  } = usePreferences();
  const { t } = useI18n(language);

  return (
    <>
      {/* Theme Toggle Button */}
      <button
        className='inline-flex h-9 items-center gap-2 rounded-md border border-[var(--brand-border)] px-3 text-[var(--foreground)] bg-[var(--panel)] hover:bg-[var(--brand-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] disabled:opacity-50 transition-colors'
        onClick={toggleTheme}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className='h-4 w-4 animate-spin rounded-full border-2 border-[var(--brand-border)] border-t-[var(--brand-primary)]'></div>
        ) : theme === 'light' ? (
          <Sun className='h-4 w-4' />
        ) : (
          <Moon className='h-4 w-4' />
        )}
        <span className='hidden sm:inline'>{t('theme', 'الثيم')}</span>
      </button>

      {/* Language Toggle Button */}
      <button
        className='inline-flex h-9 items-center gap-2 rounded-md border border-[var(--brand-border)] px-3 text-[var(--foreground)] bg-[var(--panel)] hover:bg-[var(--brand-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] disabled:opacity-50 transition-colors'
        onClick={toggleLanguage}
        disabled={isLoading}
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

// Main Header Component
const GlobalHeader = memo(function GlobalHeader() {
  const { language } = usePreferences();
  const { t } = useI18n(language);

  return (
    <nav className='nav sticky top-0 z-50'>
      <div className='container-app py-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <Image
              src='/logo.png'
              alt='مركز الهمم'
              width={UI_CONSTANTS.AVATAR.LARGE}
              height={UI_CONSTANTS.AVATAR.LARGE}
              className='rounded-lg'
              priority
            />
            <h1 className='text-foreground text-2xl font-bold'>مركز الهمم</h1>
          </div>
          <div className='hidden items-center gap-6 md:flex'>
            <Link href='#services' className='nav-link'>
              {t('nav.services', 'الخدمات')}
            </Link>
            <Link href='#about' className='nav-link'>
              {t('nav.about', 'عن المركز')}
            </Link>
            <Link href='#gallery' className='nav-link'>
              {t('nav.gallery', 'المعرض')}
            </Link>
            <Link href='#contact' className='nav-link'>
              {t('nav.contact', 'اتصل بنا')}
            </Link>
          </div>
          <div className='flex items-center gap-3'>
            {/* Theme and Language Switches */}
            <ThemeLanguageSwitches />
            <Link href={ROUTES.LOGIN} className='btn btn-outline'>
              {t('auth.login', 'تسجيل الدخول')}
            </Link>
            <Link href={ROUTES.REGISTER} className='btn btn-default'>
              {t('auth.register', 'إنشاء حساب')}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
});

GlobalHeader.displayName = 'GlobalHeader';
export default GlobalHeader;
