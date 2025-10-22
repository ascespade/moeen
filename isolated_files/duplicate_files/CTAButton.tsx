'use client';

import React from 'react';

interface CTAButtonProps {
  children: React.ReactNode;
  variant?: 'default' | 'info' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

export default function CTAButton({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  onClick,
}: CTAButtonProps) {
  const baseClasses =
    'font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-blue-200';

  const variantClasses = {
    default:
      'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700',
    info: 'bg-white text-blue-600 border-2 border-blue-200 hover:bg-blue-50 hover:border-blue-300 shadow-md hover:shadow-lg',
    outline:
      'bg-transparent text-blue-600 border-2 border-blue-500 hover:bg-blue-500 hover:text-white shadow-md hover:shadow-lg',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
