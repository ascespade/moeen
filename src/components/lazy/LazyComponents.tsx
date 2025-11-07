'use client';

import dynamic from 'next/dynamic';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';

// Lazy load heavy components
export const LazyAdvancedCharts = dynamic(
  () => import('@/components/dashboard/charts/AdvancedCharts'),
  {
    loading: () => <LoadingSkeleton height='400px' count={1} />,
    ssr: false,
  }
);

export const LazyChartWidget = dynamic(
  () => import('@/components/dashboard/widgets/ChartWidget'),
  {
    loading: () => <LoadingSkeleton height='300px' count={1} />,
    ssr: false,
  }
);

export const LazyModuleSettings = dynamic(
  () => import('@/components/admin/settings/ModuleSettings'),
  {
    loading: () => <LoadingSkeleton height='200px' count={3} />,
    ssr: false,
  }
);

export const LazyPatientDashboard = dynamic(
  () => import('@/components/dashboard/widgets/PatientDashboard'),
  {
    loading: () => <LoadingSkeleton height='400px' count={1} />,
    ssr: false,
  }
);

export const LazyDoctorDashboard = dynamic(
  () => import('@/components/dashboard/widgets/DoctorDashboard'),
  {
    loading: () => <LoadingSkeleton height='400px' count={1} />,
    ssr: false,
  }
);
