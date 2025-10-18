import React from "react";
import clsx from 'clsx';

type BadgeVariant =
  | 'primary'
  | 'secondary'
  | 'destructive'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'outline'
  | 'primary'
  | 'error';

export function Badge({
  className,
  variant = 'primary',
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  const styles = {
    default:
      'badge bg-surface text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    secondary: 'badge bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    destructive: 'badge bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    success: 'badge badge-success',
    warning: 'badge badge-warning',
    danger: 'badge badge-error',
    info: 'badge badge-info',
    outline:
      'badge bg-transparent text-gray-700 border border-[var(--brand-border)] dark:text-gray-200 dark:border-gray-800',
    brand:
      'badge bg-[var(--brand-primary)] text-white border border-transparent',
    error: 'badge badge-error'
  } as const;

  return <span className={clsx(styles[variant], className)} {...props} />;
}

export default Badge;
