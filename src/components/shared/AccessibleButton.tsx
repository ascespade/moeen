import React from 'react';

interface AccessibleButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  description?: string;
  keyboardAction?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function __AccessibleButton({
  children,
  description,
  keyboardAction = false,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: AccessibleButtonProps) {
  const baseClasses =
    'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

  const __variantClasses = {
    primary:
      'bg-[var(--brand-primary)] text-white hover:brightness-95 focus:ring-2',
    secondary:
      'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
  };

  const __sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      {...props}
      data-keyboard-action={keyboardAction ? 'click' : undefined}
      aria-label={description}
      aria-describedby={description ? `${props.id}-description` : undefined}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
      {description && (
        <span id={`${props.id}-description`} className='sr-only'>
          {description}
        </span>
      )}
    </button>
  );
}

export default AccessibleButton;
