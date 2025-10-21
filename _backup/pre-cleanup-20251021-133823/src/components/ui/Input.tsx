/**
 * Input Component - مكون حقل الإدخال
 * Unified input component with validation states
 */

'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/cn';
import { AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';

export interface InputProps
  // eslint-disable-next-line no-undef
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showPasswordToggle?: boolean;
  variant?: 'default' | 'filled' | 'outlined';
}

// eslint-disable-next-line no-undef
const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      label,
      error,
      success,
      helperText,
      leftIcon,
      rightIcon,
      showPasswordToggle = false,
      variant = 'default',
      disabled,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    // const [isFocused, setIsFocused] = React.useState(false);

    const inputType =
      showPasswordToggle && type === 'password'
        ? showPassword
          ? 'text'
          : 'password'
        : type;

    const baseClasses =
      'flex h-10 w-full rounded-lg border border-[var(--color-border-primary)] bg-white px-3 py-2 text-sm text-[var(--color-text-primary)] file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[var(--color-text-tertiary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200';

    const variants = {
      default:
        'border-[var(--color-border-primary)] focus-visible:ring-[var(--color-primary-500)]',
      filled:
        'border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] focus-visible:ring-[var(--color-primary-500)]',
      outlined:
        'border-2 border-[var(--color-border-primary)] focus-visible:ring-[var(--color-primary-500)]',
    };

    const stateClasses = error
      ? 'border-[var(--color-error-500)] focus-visible:ring-[var(--color-error-500)]'
      : success
        ? 'border-[var(--color-success-500)] focus-visible:ring-[var(--color-success-500)]'
        : '';

    return (
      <div className='w-full'>
        {label && (
          <label className='block text-sm font-medium text-[var(--color-text-primary)] mb-1'>
            {label}
            {props.required && (
              <span className='text-[var(--color-error-500)] ml-1'>*</span>
            )}
          </label>
        )}

        <div className='relative'>
          {leftIcon && (
            <div className='absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-tertiary)]'>
              {leftIcon}
            </div>
          )}

          <input
            type={inputType}
            className={cn(
              baseClasses,
              variants[variant],
              stateClasses,
              leftIcon && 'pl-10',
              (rightIcon || showPasswordToggle) && 'pr-10',
              className
            )}
            disabled={disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            ref={ref}
            {...props}
          />

          {(rightIcon || showPasswordToggle) && (
            <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
              {showPasswordToggle ? (
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]'
                >
                  {showPassword ? (
                    <EyeOff className='h-4 w-4' />
                  ) : (
                    <Eye className='h-4 w-4' />
                  )}
                </button>
              ) : (
                rightIcon
              )}
            </div>
          )}

          {(error || success) && (
            <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
              {error ? (
                <AlertCircle className='h-4 w-4 text-[var(--color-error-500)]' />
              ) : (
                <CheckCircle className='h-4 w-4 text-[var(--color-success-500)]' />
              )}
            </div>
          )}
        </div>

        {(error || success || helperText) && (
          <div className='mt-1 text-sm'>
            {error && <p className='text-[var(--color-error-500)]'>{error}</p>}
            {success && (
              <p className='text-[var(--color-success-500)]'>{success}</p>
            )}
            {helperText && !error && !success && (
              <p className='text-[var(--color-text-tertiary)]'>{helperText}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
