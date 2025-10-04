import React from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  cta?: React.ReactNode;
}

export default function EmptyState({ title, description, cta }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-8 text-center text-gray-600 dark:text-gray-400">
      <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 mb-3 flex items-center justify-center">
        <span className="text-2xl">📭</span>
      </div>
      <div className="text-lg font-medium text-gray-900 dark:text-white">{title}</div>
      {description && <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</div>}
      {cta && <div className="mt-4">{cta}</div>}
    </div>
  );
}