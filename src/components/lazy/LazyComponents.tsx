import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

// Lazy load heavy components
export const LazyCalendar = dynamic(
  () => import('@/components/healthcare/Calendar'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false // Calendar doesn't need SSR
  }
);

export const LazyChart = dynamic(
  () => import('@/components/dashboard/Chart'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false
  }
);

export const LazyFlowBuilder = dynamic(
  () => import('@/components/chatbot/FlowBuilder'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false
  }
);

export const LazyDataTable = dynamic(
  () => import('@/components/shared/DataTable'),
  {
    loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded" />,
    ssr: false
  }
);

export const LazyModal = dynamic(
  () => import('@/components/shared/Modal'),
  {
    loading: () => null,
    ssr: false
  }
);

// Suspense wrapper for better loading states
export function SuspenseWrapper({ 
  children, 
  fallback = <LoadingSpinner />,
  className = '' 
}: { 
  children: React.ReactNode; 
  fallback?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </div>
  );
}

export default {
  LazyCalendar,
  LazyChart,
  LazyFlowBuilder,
  LazyDataTable,
  LazyModal,
  SuspenseWrapper
};