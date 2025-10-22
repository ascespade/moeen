/**
 * Unified Components - المكونات الموحدة
 *
 * Centralized components that replace all duplicates
 * مكونات مركزية تحل محل جميع المكررات
 */

import React from 'react';
import { cn } from '@/lib/utils';

// ========================================
// UNIFIED BUTTON - الزر الموحد
// ========================================

export interface UnifiedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  asChild?: boolean;
  children: React.ReactNode;
}

export const UnifiedButton = React.forwardRef<
  HTMLButtonElement,
  UnifiedButtonProps
>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled,
      asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary:
        'bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-primary-hover)] focus:ring-[var(--brand-primary)]',
      secondary:
        'bg-[var(--brand-secondary)] text-white hover:bg-opacity-90 focus:ring-[var(--brand-secondary)]',
      outline:
        'border-2 border-[var(--brand-primary)] text-[var(--brand-primary)] hover:bg-[var(--brand-primary)] hover:text-white focus:ring-[var(--brand-primary)]',
      ghost:
        'text-[var(--brand-primary)] hover:bg-[var(--brand-primary)] hover:bg-opacity-10 focus:ring-[var(--brand-primary)]',
      destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
      xl: 'px-8 py-4 text-xl',
    };

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, {
        className: cn(baseClasses, variants[variant], sizes[size], className),
        ref,
        ...props,
      });
    }

    return (
      <button
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <div className='h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2' />
        )}
        {children}
      </button>
    );
  }
);

UnifiedButton.displayName = 'UnifiedButton';

// ========================================
// UNIFIED CARD - البطاقة الموحدة
// ========================================

export interface UnifiedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'glass' | 'stat' | 'feature';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}

export const UnifiedCard = React.forwardRef<HTMLDivElement, UnifiedCardProps>(
  (
    { className, variant = 'default', padding = 'md', children, ...props },
    ref
  ) => {
    const baseClasses = 'rounded-xl border transition-all duration-200';

    const variants = {
      default:
        'bg-white dark:bg-gray-800 shadow-sm border-gray-200 dark:border-gray-700',
      elevated:
        'bg-white dark:bg-gray-800 shadow-lg border-gray-200 dark:border-gray-700',
      outlined:
        'bg-white dark:bg-gray-800 border-2 border-[var(--brand-primary)]',
      glass:
        'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50',
      stat: 'bg-white/80 backdrop-blur-xl border border-blue-200/30 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer',
      feature:
        'bg-white/80 backdrop-blur-xl rounded-2xl border border-blue-200/30 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer',
    };

    const paddings = {
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
      xl: 'p-10',
    };

    return (
      <div
        className={cn(
          baseClasses,
          variants[variant],
          padding !== 'md' && paddings[padding],
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

UnifiedCard.displayName = 'UnifiedCard';

// ========================================
// UNIFIED BADGE - الشارة الموحدة
// ========================================

export interface UnifiedBadgeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const UnifiedBadge = React.forwardRef<HTMLDivElement, UnifiedBadgeProps>(
  (
    { className, variant = 'default', size = 'md', children, ...props },
    ref
  ) => {
    const baseClasses = 'inline-flex items-center rounded-full font-medium';

    const variants = {
      default: 'bg-[var(--brand-primary)] text-white',
      success:
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      warning:
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      outline:
        'border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300',
    };

    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-0.5 text-xs',
      lg: 'px-3 py-1 text-sm',
    };

    return (
      <div
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

UnifiedBadge.displayName = 'UnifiedBadge';

// ========================================
// UNIFIED HEADER - الرأس الموحد
// ========================================

export interface UnifiedHeaderProps {
  title?: string;
  showThemeToggle?: boolean;
  showLanguageToggle?: boolean;
  showDirectionToggle?: boolean;
  className?: string;
}

export const UnifiedHeader: React.FC<UnifiedHeaderProps> = ({
  title = 'مركز الهمم للرعاية الصحية',
  showThemeToggle = true,
  showLanguageToggle = true,
  showDirectionToggle = true,
  className = '',
}) => {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');
  const [language, setLanguage] = React.useState<'ar' | 'en'>('ar');
  const [direction, setDirection] = React.useState<'rtl' | 'ltr'>('rtl');

  React.useEffect(() => {
    const html = document.documentElement;
    html.setAttribute('data-theme', theme);
    html.setAttribute('dir', direction);
    html.setAttribute('lang', language);
    localStorage.setItem('theme', theme);
    localStorage.setItem('language', language);
    localStorage.setItem('direction', direction);
  }, [theme, language, direction]);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b bg-white/80 backdrop-blur dark:bg-gray-900/80 border-gray-200',
        className
      )}
    >
      <div className='max-w-7xl mx-auto px-4 py-2'>
        <div className='flex h-14 items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='w-8 h-8 bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] rounded-lg flex items-center justify-center'>
              <span className='text-white font-bold text-sm'>م</span>
            </div>
            <div className='text-base font-semibold text-gray-900 dark:text-white'>
              {title}
            </div>
          </div>

          <div className='flex items-center gap-2'>
            {showThemeToggle && (
              <UnifiedButton
                variant='ghost'
                size='sm'
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </UnifiedButton>
            )}

            {showLanguageToggle && (
              <UnifiedButton
                variant='ghost'
                size='sm'
                onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              >
                {language === 'ar' ? 'EN' : 'AR'}
              </UnifiedButton>
            )}

            {showDirectionToggle && (
              <UnifiedButton
                variant='ghost'
                size='sm'
                onClick={() =>
                  setDirection(direction === 'rtl' ? 'ltr' : 'rtl')
                }
              >
                {direction === 'rtl' ? 'LTR' : 'RTL'}
              </UnifiedButton>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

// ========================================
// EXPORTS - الصادرات
// ========================================

export { UnifiedButton as Button };
export { UnifiedCard as Card };
export { UnifiedBadge as Badge };
export { UnifiedHeader as Header };
