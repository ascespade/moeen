import { cn } from '@/lib/utils';
import React from 'react';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
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
    const base = 'btn focus:outline-none focus:ring-2 focus:ring-offset-2';
    const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
      primary: 'btn-default',
      secondary: 'btn-secondary',
      outline: 'btn-outline',
      ghost: 'btn-ghost',
    };
    const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
      sm: 'btn-sm',
      md: '',
      lg: 'btn-lg',
    };

    const classes = cn(base, variants[variant], sizes[size], className);

    if (
      asChild &&
      typeof children === 'object' &&
      children !== null &&
      'props' in children
    ) {
      return React.cloneElement(children as React.ReactElement, {
        ...props,
        className: cn(
          classes,
          (children as React.ReactElement).props?.className
        ),
        disabled: disabled || loading,
      });
    }

    return (
      <button
        className={classes}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <div className='h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
