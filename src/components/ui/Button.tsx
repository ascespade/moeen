import React from 'react';

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'brand' | 'secondary' | 'outline' | 'ghost' | 'primary' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  // eslint-disable-next-line no-undef
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({
  children,
  variant = 'brand',
  size = 'md',
  className = '',
  disabled = false,
  onClick,
  type = 'button',
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    brand: 'bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)] text-white focus:ring-[var(--color-primary-500)] disabled:opacity-50 disabled:cursor-not-allowed',
    primary: 'bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)] text-white focus:ring-[var(--color-primary-500)] disabled:opacity-50 disabled:cursor-not-allowed',
    secondary: 'bg-[var(--color-secondary-500)] hover:bg-[var(--color-secondary-600)] text-white focus:ring-[var(--color-secondary-500)] disabled:opacity-50 disabled:cursor-not-allowed',
    outline: 'border-2 border-[var(--color-primary-500)] text-[var(--color-primary-500)] hover:bg-[var(--color-primary-500)] hover:text-white focus:ring-[var(--color-primary-500)] disabled:opacity-50 disabled:cursor-not-allowed',
    ghost: 'text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] focus:ring-[var(--color-primary-500)] disabled:opacity-50 disabled:cursor-not-allowed',
    destructive: 'bg-[var(--color-error-500)] hover:bg-[var(--color-error-600)] text-white focus:ring-[var(--color-error-500)] disabled:opacity-50 disabled:cursor-not-allowed',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
