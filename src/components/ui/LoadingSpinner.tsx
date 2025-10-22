/**
 * Loading Spinner Component
 */

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({
  size = 'md',
  className = '',
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div
      className={`animate-spin rounded-full border-2 border-[var(--default-default)] border-t-transparent ${sizeClasses[size]} ${className}`}
    />
  );
}

export function LoadingScreen() {
  return (
    <div className='flex min-h-screen items-center justify-center'>
      <div className='text-center'>
        <LoadingSpinner size='lg' />
        <p className='mt-4 text-gray-600'>جاري التحميل...</p>
      </div>
    </div>
  );
}
