import { cn } from '@/lib/utils';
import React from 'react';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'ghost'
    | 'success'
    | 'warning'
    | 'error'
    | 'info';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
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
    const baseClasses = `
      inline-flex items-center justify-center
      rounded-lg font-medium
      transition-all duration-200 ease-out
      focus:outline-none focus:ring-2 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
      active:scale-95
    `;

    const variants = {
      primary: `
        bg-primary-600 text-white
        hover:bg-primary-700 hover:shadow-lg
        focus:ring-primary-500 focus:ring-offset-2
        active:bg-primary-800
        dark:bg-primary-600 dark:text-white
        dark:hover:bg-primary-500 dark:hover:shadow-xl
        dark:focus:ring-primary-400
      `,
      secondary: `
        bg-neutral-100 text-neutral-900
        hover:bg-neutral-200 hover:shadow-md
        focus:ring-neutral-500 focus:ring-offset-2
        active:bg-neutral-300
        dark:bg-neutral-700 dark:text-neutral-100
        dark:hover:bg-neutral-600 dark:hover:shadow-lg
        dark:focus:ring-neutral-400
      `,
      outline: `
        border-2 border-primary-600 text-primary-600
        hover:bg-primary-600 hover:text-white hover:shadow-md
        focus:ring-primary-500 focus:ring-offset-2
        active:bg-primary-700
        dark:border-primary-400 dark:text-primary-400
        dark:hover:bg-primary-400 dark:hover:text-neutral-900
        dark:focus:ring-primary-400
      `,
      ghost: `
        text-primary-600
        hover:bg-primary-50 hover:shadow-sm
        focus:ring-primary-500 focus:ring-offset-2
        active:bg-primary-100
        dark:text-primary-400 dark:hover:bg-primary-950
        dark:focus:ring-primary-400
      `,
      success: `
        bg-success-600 text-white
        hover:bg-success-700 hover:shadow-lg
        focus:ring-success-500 focus:ring-offset-2
        active:bg-success-800
        dark:bg-success-600 dark:hover:bg-success-500
        dark:focus:ring-success-400
      `,
      warning: `
        bg-warning-600 text-white
        hover:bg-warning-700 hover:shadow-lg
        focus:ring-warning-500 focus:ring-offset-2
        active:bg-warning-800
        dark:bg-warning-600 dark:hover:bg-warning-500
        dark:focus:ring-warning-400
      `,
      error: `
        bg-error-600 text-white
        hover:bg-error-700 hover:shadow-lg
        focus:ring-error-500 focus:ring-offset-2
        active:bg-error-800
        dark:bg-error-600 dark:hover:bg-error-500
        dark:focus:ring-error-400
      `,
      info: `
        bg-info-600 text-white
        hover:bg-info-700 hover:shadow-lg
        focus:ring-info-500 focus:ring-offset-2
        active:bg-info-800
        dark:bg-info-600 dark:hover:bg-info-500
        dark:focus:ring-info-400
      `,
    };

    const sizes = {
      xs: 'px-2.5 py-1.5 text-xs gap-1.5',
      sm: 'px-3 py-2 text-sm gap-2',
      md: 'px-4 py-2.5 text-base gap-2',
      lg: 'px-6 py-3 text-lg gap-2',
      xl: 'px-8 py-4 text-xl gap-3',
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
