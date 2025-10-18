"use client";

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;


export default function EmptyState({
  icon = "📋",
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div className={`py-12 text-center ${className}`}>
      <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-surface dark:bg-gray-800">
        <span className="text-4xl">{icon}</span>
      </div>
      <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="mx-auto mb-6 max-w-md text-gray-600 dark:text-gray-300">
        {description}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="btn-brand rounded-lg px-6 py-2 text-white transition-colors hover:bg-[var(--brand-primary-hover)]"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}}