'use client';

import { Clipboard } from 'lucide-react';
import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  cta?: React.ReactNode;
  className?: string;
}

export default function EmptyState({
  icon = <Clipboard className='w-10 h-10' />,
  title,
  description,
  action,
  cta,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`py-12 text-center ${className}`}>
      <div className='mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-surface dark:bg-gray-800'>
        <span className='text-4xl'>{icon}</span>
      </div>
      <h3 className='mb-2 text-lg font-semibold text-gray-900 dark:text-white'>
        {title}
      </h3>
      <p className='mx-auto mb-6 max-w-md text-gray-600 dark:text-gray-300'>
        {description}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className='inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
        >
          {action.label}
        </button>
      )}
      {cta && <div className='mt-4'>{cta}</div>}
    </div>
  );
}
