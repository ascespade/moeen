import { cn } from '@/lib/utils';
import React from 'react';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'info'
    | 'outline'
    | 'ghost'
    | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  asChild?: boolean;
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
      asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      default:
        'bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-primary-hover)] focus:ring-[var(--brand-primary)]',
      primary:
        'bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-primary-hover)] focus:ring-[var(--brand-primary)]',
      secondary:
        'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 focus:ring-gray-500',
      info: 'bg-[var(--brand-info)] text-white hover:bg-opacity-90 focus:ring-[var(--brand-info)]',
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

    const computedClasses = cn(
      baseClasses,
      variants[variant || 'primary'],
      sizes[size],
      className
    );

    // If asChild is true, we need to wrap the child with className
    if (
      asChild &&
      typeof children === 'object' &&
      children !== null &&
      'props' in children
    ) {
      return React.cloneElement(children as React.ReactElement, {
        ...props,
        className: cn(
          computedClasses,
          (children as React.ReactElement).props?.className
        ),
        disabled: disabled || loading,
      });
    }

    return (
      <button
        className={computedClasses}
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
