/**
 * Button Component
 * Optimized and accessible button component
 */
'use client';

import { cn } from '@/lib/cn';
import { ButtonHTMLAttributes, forwardRef, memo } from 'react';

export type ButtonVariant =
  | 'default'
  | 'outline'
  | 'ghost'
  | 'destructive'
  | 'success'
  | 'warning';

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  default: 'btn-default',
  outline: 'btn-outline',
  ghost: 'btn-ghost',
  destructive: 'bg-red-600 hover:bg-red-700 text-white',
  success: 'bg-green-600 hover:bg-green-700 text-white',
  warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export const Button = memo(
  forwardRef<HTMLButtonElement, ButtonProps>(
    (
      {
        className,
        variant = 'default',
        size = 'md',
        isLoading = false,
        fullWidth = false,
        disabled,
        children,
        ...props
      },
      ref
    ) => {
      return (
        <button
          ref={ref}
          className={cn(
            'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
            variantStyles[variant],
            sizeStyles[size],
            fullWidth && 'w-full',
            className
          )}
          disabled={disabled || isLoading}
          {...props}
        >
          {isLoading && (
            <span className='h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
          )}
          {children}
        </button>
      );
    }
  )
);

Button.displayName = 'Button';

