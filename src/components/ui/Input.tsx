/**
 * Input Component - مكون حقل الإدخال
 * Unified input component with validation states
 */

'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/cn';
import { AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showPasswordToggle?: boolean;
  variant?: 'default' | 'filled' | 'outlined';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({
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
  }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);
    
    const inputType = showPasswordToggle && type === 'password' 
      ? (showPassword ? 'text' : 'password') 
      : type;

    const baseClasses = 'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';
    
    const variants = {
      default: 'border-gray-300 focus-visible:ring-gray-500',
      filled: 'border-gray-300 bg-surface focus-visible:ring-gray-500',
      outlined: 'border-2 border-gray-300 focus-visible:ring-gray-500',
    };

    const stateClasses = error 
      ? 'border-red-500 focus-visible:ring-red-500' 
      : success 
      ? 'border-green-500 focus-visible:ring-green-500'
      : '';

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {props.required && <span className="text-brand-error ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
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
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {showPasswordToggle ? (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              ) : (
                rightIcon
              )}
            </div>
          )}
          
          {(error || success) && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {error ? (
                <AlertCircle className="h-4 w-4 text-brand-error" />
              ) : (
                <CheckCircle className="h-4 w-4 text-brand-success" />
              )}
            </div>
          )}
        </div>
        
        {(error || success || helperText) && (
          <div className="mt-1 text-sm">
            {error && <p className="text-brand-error">{error}</p>}
            {success && <p className="text-brand-success">{success}</p>}
            {helperText && !error && !success && <p className="text-gray-500">{helperText}</p>}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };