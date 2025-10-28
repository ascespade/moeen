import dynamic from 'next/dynamic';
import { _Suspense } from 'react';

import LoadingSpinner from '@/components/shared/LoadingSpinner';

// Lazy load heavy components
export const __LazyCalendar = dynamic(
  () => import('@/components/appointments/AppointmentManager'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

export const __LazyChart = dynamic(
  () => import('@/components/dashboard/Charts'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

export const __LazyFlowBuilder = dynamic(
  () => import('@/components/chatbot/MoainChatbot'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

export const __LazyDataTable = dynamic(
  () => import('@/components/shared/DataTable'),
  {
    loading: () => <div className='h-64 bg-gray-100 animate-pulse rounded' />,
    ssr: false,
  }
);

export const __LazyModal = dynamic(() => import('@/components/shared/Modal'), {
  loading: () => null,
  ssr: false,
});

// Suspense wrapper for better loading states
export function __SuspenseWrapper({
  children,
  fallback = <LoadingSpinner />,
  className = '',
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Suspense fallback={fallback}>{children}</Suspense>
    </div>
  );
}

const __LazyComponents = {
  LazyCalendar,
  LazyChart,
  LazyFlowBuilder,
  LazyDataTable,
  LazyModal,
  SuspenseWrapper,
};

export default LazyComponents;
