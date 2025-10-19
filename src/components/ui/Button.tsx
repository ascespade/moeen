import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'brand' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
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
  const baseClasses = 'btn';
  const variantClasses = {
    brand: 'btn-brand',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    ghost: 'btn-ghost',
  };
  const sizeClasses = {
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg',
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
