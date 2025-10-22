import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary:
        'bg-[var(--primary-primary)] text-white hover:bg-[var(--primary-primary-hover)] focus:ring-[var(--primary-primary)]',
      secondary:
        'bg-[var(--primary-secondary)] text-white hover:bg-opacity-90 focus:ring-[var(--primary-secondary)]',
      outline:
        'border-2 border-[var(--primary-primary)] text-[var(--primary-primary)] hover:bg-[var(--primary-primary)] hover:text-white focus:ring-[var(--primary-primary)]',
      ghost:
        'text-[var(--primary-primary)] hover:bg-[var(--primary-primary)] hover:bg-opacity-10 focus:ring-[var(--primary-primary)]',
      destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
      xl: 'px-8 py-4 text-xl',
    };

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

Button.displayName = 'Button';

export { Button };
