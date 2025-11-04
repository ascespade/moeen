import { cn } from '@/lib/utils';
import React from 'react';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'error' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  error?: string;
  help?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      label,
      error,
      help,
      leftIcon,
      rightIcon,
      fullWidth = true,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    const baseClasses = `
      border transition-all duration-200 ease-out
      focus:outline-none focus:ring-2 focus:ring-offset-2
      placeholder:text-neutral-400
      disabled:opacity-50 disabled:cursor-not-allowed
    `;

    const variants = {
      default: `
        bg-white dark:bg-neutral-900
        border-neutral-300 dark:border-neutral-600
        text-neutral-900 dark:text-neutral-50
        focus:ring-primary-500 focus:border-primary-500
        hover:border-neutral-400 dark:hover:border-neutral-500
      `,
      error: `
        bg-white dark:bg-neutral-900
        border-error-500
        text-neutral-900 dark:text-neutral-50
        focus:ring-error-500 focus:border-error-500
      `,
      success: `
        bg-white dark:bg-neutral-900
        border-success-500
        text-neutral-900 dark:text-neutral-50
        focus:ring-success-500 focus:border-success-500
      `,
      warning: `
        bg-white dark:bg-neutral-900
        border-warning-500
        text-neutral-900 dark:text-neutral-50
        focus:ring-warning-500 focus:border-warning-500
      `,
    };

    const sizes = {
      sm: 'px-3 py-2 text-sm rounded-md',
      md: 'px-4 py-2.5 text-base rounded-lg',
      lg: 'px-4 py-3 text-lg rounded-lg',
    };

    const inputClasses = cn(
      baseClasses,
      variants[variant],
      sizes[size],
      leftIcon && 'pl-10',
      rightIcon && 'pr-10',
      fullWidth && 'w-full',
      className
    );

    return (
      <div className='space-y-2'>
        {label && (
          <label
            htmlFor={inputId}
            className='block text-sm font-medium text-neutral-700 dark:text-neutral-300'
          >
            {label}
          </label>
        )}

        <div className='relative'>
          {leftIcon && (
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400'>
              {leftIcon}
            </div>
          )}

          <input id={inputId} className={inputClasses} ref={ref} {...props} />

          {rightIcon && (
            <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-neutral-400'>
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <p className='text-sm text-error-600 dark:text-error-400'>{error}</p>
        )}

        {help && !error && (
          <p className='text-sm text-neutral-500 dark:text-neutral-400'>{help}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
