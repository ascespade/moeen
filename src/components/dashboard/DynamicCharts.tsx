'use client';

import React, { useState, useEffect } from 'react';
import { useLocalizedNumber } from '@/hooks/useLocalizedNumber';

// Dynamic Chart Components using SVG and CSS
interface ChartData {
  [key: string]: any;
}

interface DynamicChartsProps {
  data: ChartData;
  loading?: boolean;
}

// Line Chart Component for Trends
export function DynamicLineChart({
  data,
  title,
  color = 'var(--brand-accent)', // Changed from hardcoded #2563eb to CSS variable
}: {
  data: Array<{ month: string; count: number }>;
  title: string;
  color?: string;
}) {
  if (!data || data.length === 0) {
    return (
      <div className='h-64 flex items-center justify-center text-gray-500'>
        لا توجد بيانات متاحة
      </div>
    );
  }

  const width = 600;
  const height = 220;
  const padding = 30;
  const maxY = Math.max(...data.map(d => d.count)) * 1.1;
  const xStep = (width - padding * 2) / (data.length - 1);
  const yScale = (v: number) =>
    height - padding - (v / maxY) * (height - padding * 2);

  const points = data
    .map((d, i) => `${padding + i * xStep},${yScale(d.count)}`)
    .join(' ');

  return (
    <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm'>
      <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
        {title}
      </h3>
      <div className='h-64'>
        <svg viewBox={`0 0 ${width} ${height}`} className='w-full h-full'>
          <g>
            {/* Axes */}
            <line
              x1={padding}
              y1={height - padding}
              x2={width - padding}
              y2={height - padding}
              stroke='var(--brand-border)' // Changed from hardcoded #e5e7eb to CSS variable
              strokeWidth='1'
            />
            <line
              x1={padding}
              y1={padding}
              x2={padding}
              y2={height - padding}
              stroke='var(--brand-border)' // Changed from hardcoded #e5e7eb to CSS variable
              strokeWidth='1'
            />

            {/* Line */}
            <polyline
              fill='none'
              stroke={color}
              strokeWidth='2'
              points={points}
            />

            {/* Data points */}
            {data.map((d, i) => (
              <circle
                key={i}
                cx={padding + i * xStep}
                cy={yScale(d.count)}
                r='4'
                fill={color}
              />
            ))}

            {/* Labels */}
            {data.map((d, i) => (
              <text
                key={i}
                x={padding + i * xStep}
                y={height - padding + 15}
                textAnchor='middle'
                className='text-xs fill-gray-600 dark:fill-gray-400'
              >
                {d.month}
              </text>
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
}

// Bar Chart Component
export function DynamicBarChart({
  data,
  title,
  color = 'var(--brand-success)', // Changed from hardcoded #10b981 to CSS variable
}: {
  data: Array<{ name: string; count: number }>;
  title: string;
  color?: string;
}) {
  if (!data || data.length === 0) {
    return (
      <div className='h-64 flex items-center justify-center text-gray-500'>
        لا توجد بيانات متاحة
      </div>
    );
  }

  const maxY = Math.max(...data.map(d => d.count)) * 1.1;
  const barWidth = Math.max(20, Math.min(60, 400 / data.length));

  return (
    <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm'>
      <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
        {title}
      </h3>
      <div className='h-64 flex items-end justify-center gap-2 p-4'>
        {data.map((d, i) => (
          <div key={i} className='flex flex-col items-center'>
            <div
              className='rounded-t-sm transition-all duration-300 hover:opacity-80'
              style={{
                width: `${barWidth}px`,
                height: `${(d.count / maxY) * 200}px`,
                backgroundColor: color,
                minHeight: '4px',
              }}
              title={`${d.name}: ${d.count}`}
            />
            <span className='text-xs text-gray-600 dark:text-gray-400 mt-2 text-center max-w-16 truncate'>
              {d.name}
            </span>
            <span className='text-xs text-gray-500 dark:text-gray-500 mt-1'>
              {d.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Pie Chart Component
export function DynamicPieChart({
  data,
  title,
}: {
  data: Array<{ name: string; count: number }>;
  title: string;
}) {
  if (!data || data.length === 0) {
    return (
      <div className='h-64 flex items-center justify-center text-gray-500'>
        لا توجد بيانات متاحة
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.count, 0);
  // Updated to use CSS variables instead of hardcoded colors
  const colors = [
    'var(--brand-accent)',    // Blue - #2563eb equivalent
    'var(--brand-success)',   // Green - #10b981 equivalent
    'var(--brand-warning)',   // Amber - #f59e0b equivalent
    'var(--brand-error)',     // Red - #ef4444 equivalent
    'var(--brand-primary)',   // Orange - primary brand color
    'var(--brand-info)',      // Sky blue - #06b6d4 equivalent
  ];

  let currentAngle = 0;
  const segments = data.map((item, index) => {
    const percentage = (item.count / total) * 100;
    const angle = (item.count / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle += angle;

    return {
      ...item,
      percentage: Math.round(percentage),
      startAngle,
      endAngle,
      color: colors[index % colors.length],
    };
  });

  const gradientStops = segments
    .map(s => `${s.color} ${s.startAngle}deg ${s.endAngle}deg`)
    .join(', ');

  return (
    <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm'>
      <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
        {title}
      </h3>
      <div className='h-64 flex items-center justify-center'>
        <div className='flex items-center gap-8'>
          <div
            className='relative w-40 h-40 rounded-full'
            style={{ background: `conic-gradient(${gradientStops})` }}
            aria-label='Data distribution'
          >
            <div className='absolute inset-3 rounded-full bg-white dark:bg-gray-800' />
          </div>
          <div className='space-y-2'>
            {segments.map((segment, i) => (
              <div key={i} className='flex items-center gap-2 text-sm'>
                <span
                  className='inline-block w-3 h-3 rounded-sm'
                  style={{ backgroundColor: segment.color }}
                />
                <span className='text-gray-700 dark:text-gray-300'>
                  {segment.name}: {segment.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Statistics Cards Component
export function DynamicStatsCards({ data }: { data: any }) {
  const localizedNumber = useLocalizedNumber();
  if (!data?.statistics) {
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm animate-pulse'
          >
            <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2'></div>
            <div className='h-8 bg-gray-200 dark:bg-gray-700 rounded'></div>
          </div>
        ))}
      </div>
    );
  }

  const stats = data.statistics;
  const statCards = [
    {
      title: 'إجمالي المرضى',
      value: localizedNumber((stats.total_patients || 0).toString()),
      icon: '👥',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: 'إجمالي المواعيد',
      value: localizedNumber((stats.total_appointments || 0).toString()),
      icon: '📅',
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      title: 'إجمالي الأطباء',
      value: localizedNumber((stats.total_doctors || 0).toString()),
      icon: '👨‍⚕️',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      title: 'إجمالي الإيرادات',
      value: `${localizedNumber((stats.total_revenue || 0).toLocaleString())} ريال`,
      icon: '💰',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    },
  ];

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
      {statCards.map((card, index) => (
        <div
          key={index}
          className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm'
        >
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                {card.title}
              </p>
              <p className='text-2xl font-bold text-gray-900 dark:text-white'>
                {typeof card.value === 'number' 
                  ? localizedNumber(card.value.toString())
                  : localizedNumber(card.value)}
              </p>
            </div>
            <div className={`p-3 rounded-full ${card.bgColor}`}>
              <span className='text-2xl'>{card.icon}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Recent Activities Component
export function DynamicRecentActivities({ data }: { data: any }) {
  if (!data?.recent_activities || data.recent_activities.length === 0) {
    return (
      <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm'>
        <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
          الأنشطة الأخيرة
        </h3>
        <div className='text-center text-gray-500 py-8'>
          لا توجد أنشطة حديثة
        </div>
      </div>
    );
  }

  const activities = data.recent_activities.slice(0, 5);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return '📅';
      case 'payment':
        return '💰';
      case 'patient':
        return '👤';
      default:
        return '📋';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'appointment':
        return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
      case 'payment':
        return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'patient':
        return 'text-purple-600 bg-purple-50 dark:bg-purple-900/20';
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  return (
    <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm'>
      <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
        الأنشطة الأخيرة
      </h3>
      <div className='space-y-4'>
        {activities.map((activity: any, index: number) => (
          <div key={index} className='flex items-start gap-3'>
            <div
              className={`p-2 rounded-full ${getActivityColor(activity.activity_type)}`}
            >
              <span className='text-sm'>
                {getActivityIcon(activity.activity_type)}
              </span>
            </div>
            <div className='flex-1 min-w-0'>
              <p className='text-sm font-medium text-gray-900 dark:text-white'>
                {activity.title}
              </p>
              <p className='text-sm text-gray-600 dark:text-gray-400 truncate'>
                {activity.description}
              </p>
              <p className='text-xs text-gray-500 dark:text-gray-500 mt-1'>
                {new Date(activity.activity_timestamp).toLocaleString('ar-SA')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Main Dashboard Charts Component
export function DynamicDashboardCharts({ data, loading }: DynamicChartsProps) {
  if (loading) {
    return (
      <div className='space-y-6'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm animate-pulse'
            >
              <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4'></div>
              <div className='h-64 bg-gray-200 dark:bg-gray-700 rounded'></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className='text-center py-12'>
        <p className='text-gray-500'>لا توجد بيانات متاحة</p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Statistics Cards */}
      <DynamicStatsCards data={data} />

      {/* Charts Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Patient Analytics by Age */}
        <DynamicBarChart
          data={data.patient_analytics?.by_age || []}
          title='توزيع المرضى حسب العمر'
          color='var(--brand-accent)' // Changed from hardcoded #2563eb
        />

        {/* Patient Analytics by Gender */}
        <DynamicPieChart
          data={data.patient_analytics?.by_gender || []}
          title='توزيع المرضى حسب الجنس'
        />

        {/* Appointment Trends */}
        <DynamicLineChart
          data={data.appointment_trends || []}
          title='اتجاهات المواعيد الشهرية'
          color='var(--brand-success)' // Changed from hardcoded #10b981
        />

        {/* Doctor Specialties */}
        <DynamicBarChart
          data={data.doctor_specialties || []}
          title='تخصصات الأطباء'
          color='var(--brand-primary)' // Changed from hardcoded #8b5cf6 to primary brand color
        />
      </div>

      {/* Recent Activities */}
      <DynamicRecentActivities data={data} />
    </div>
  );
}

export default DynamicDashboardCharts;
