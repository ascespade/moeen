import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'error' | 'success';
  label?: string;
  error?: string;
  help?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant = 'default',
      label,
      error,
      help,
      leftIcon,
      rightIcon,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    const baseClasses =
      'w-full px-4 py-3 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200';

    const variants = {
      default:
        'border-gray-300 dark:border-gray-600 focus:ring-[var(--primary-primary)] focus:border-transparent',
      error: 'border-red-500 focus:ring-red-500 focus:border-transparent',
      success: 'border-green-500 focus:ring-green-500 focus:border-transparent',
    };

    const inputClasses = cn(
      baseClasses,
      variants[variant],
      leftIcon && 'pl-10',
      rightIcon && 'pr-10',
      className
    );

    return (
      <div className='space-y-2'>
        {label && (
          <label
            htmlFor={inputId}
            className='block text-sm font-medium text-gray-700 dark:text-gray-300'
          >
            {label}
          </label>
        )}

        <div className='relative'>
          {leftIcon && (
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              {leftIcon}
            </div>
          )}

          <input id={inputId} className={inputClasses} ref={ref} {...props} />

          {rightIcon && (
            <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <p className='text-sm text-red-600 dark:text-red-400'>{error}</p>
        )}

        {help && !error && (
          <p className='text-sm text-gray-500 dark:text-gray-400'>{help}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
