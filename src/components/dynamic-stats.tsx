'use client';
import { memo, useEffect, useState } from 'react';

interface DynamicStats {
  id: number;
  value: string;
  label: string;
  icon: string;
  color: string;
}

const defaultStats: DynamicStats[] = [
  {
    id: 1,
    value: '1,247',
    label: 'مريض نشط',
    icon: '👥',
    color: 'text-[var(--brand-primary)]',
  },
  {
    id: 2,
    value: '3,421',
    label: 'موعد مكتمل',
    icon: '📅',
    color: 'text-[var(--brand-primary)]',
  },
  {
    id: 3,
    value: '98%',
    label: 'معدل الرضا',
    icon: '⭐',
    color: 'text-[var(--brand-primary)]',
  },
  {
    id: 4,
    value: '24/7',
    label: 'دعم فني',
    icon: '🛠️',
    color: 'text-[var(--brand-primary)]',
  },
];

const DynamicStats = memo(function DynamicStats() {
  const [stats, setStats] = useState<DynamicStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      // Only fetch once
      if (hasFetched) return;
      setHasFetched(true);

      try {
        const response = await fetch('/api/dynamic-data?type=stats');
        const data = await response.json();

        if (data.stats) {
          const dynamicStats = [
            {
              id: 1,
              value: data.stats.total_patients?.toString() || '1,247',
              label: 'مريض نشط',
              icon: '👥',
              color: 'text-[var(--brand-primary)]',
            },
            {
              id: 2,
              value: data.stats.completed_appointments?.toString() || '3,421',
              label: 'موعد مكتمل',
              icon: '📅',
              color: 'text-[var(--brand-primary)]',
            },
            {
              id: 3,
              value: `${data.stats.satisfaction_rate || 98}%`,
              label: 'معدل الرضا',
              icon: '⭐',
              color: 'text-[var(--brand-primary)]',
            },
            {
              id: 4,
              value: data.stats.support_hours || '24/7',
              label: 'دعم فني',
              icon: '🛠️',
              color: 'text-[var(--brand-primary)]',
            },
          ];
          setStats(dynamicStats);
        } else {
          setStats(defaultStats);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats(defaultStats);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [hasFetched]);

  if (loading) {
    return (
      <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
        {[1, 2, 3, 4].map(i => (
          <div key={i} className='text-center animate-pulse'>
            <div className='h-12 w-12 bg-gray-200 rounded-full mx-auto mb-2'></div>
            <div className='h-8 bg-gray-200 rounded mb-2'></div>
            <div className='h-4 bg-gray-200 rounded'></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
      {stats.map(stat => (
        <div key={stat.id} className='text-center'>
          <div className='text-4xl mb-2'>{stat.icon}</div>
          <div className={`text-3xl font-bold ${stat.color} mb-2`}>
            {stat.value}
          </div>
          <div className='text-muted-foreground'>{stat.label}</div>
        </div>
      ))}
    </div>
  );
});

export default DynamicStats;
