import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'error'
    | 'outline'
    | 'destructive'
    | 'info'
    | 'default';
  className?: string;
}

export function Badge({
  children,
  variant = 'primary',
  className = '',
}: BadgeProps) {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  
  const variantClasses = {
    primary: 'bg-[var(--color-primary-500)] text-white',
    secondary: 'bg-[var(--color-secondary-500)] text-white',
    success: 'bg-[var(--color-success-500)] text-white',
    warning: 'bg-[var(--color-warning-500)] text-white',
    error: 'bg-[var(--color-error-500)] text-white',
    destructive: 'bg-[var(--color-error-500)] text-white',
    info: 'bg-[var(--color-accent-500)] text-white',
    default: 'bg-[var(--color-gray-500)] text-white',
    outline: 'border border-[var(--color-primary-500)] text-[var(--color-primary-500)] bg-transparent',
  };

  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
}
