'use client';

import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';
import { AdminCard } from './AdminCard';

interface AdminStatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  iconColor?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  children?: ReactNode;
  animate?: boolean;
}

export default function AdminStatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'var(--brand-primary)',
  trend,
  className,
  children,
  animate = true
}: AdminStatsCardProps) {
  return (
    <AdminCard 
      className={cn('text-center relative overflow-hidden', className)}
      hover={true}
      animate={animate}
    >
      {/* Background decoration */}
      <div className='absolute top-0 right-0 w-20 h-20 rounded-full bg-[var(--brand-primary)]/5 -translate-y-10 translate-x-10' />
      
      <div className='relative z-10'>
        {/* Icon */}
        {Icon && (
          <div className='mb-4 flex justify-center'>
            <div 
              className='w-14 h-14 rounded-xl flex items-center justify-center shadow-md'
              style={{ 
                backgroundColor: `color-mix(in srgb, ${iconColor} 8%, transparent)`,
                border: `1px solid color-mix(in srgb, ${iconColor} 20%, transparent)`
              }}
            >
              <Icon 
                className='w-7 h-7' 
                style={{ color: iconColor }} // Keep dynamic color from props
              />
            </div>
          </div>
        )}
        
        {/* Main value */}
        <div className='mb-2'>
          <div 
            className='text-3xl md:text-4xl font-bold'
            style={{ color: iconColor || 'var(--brand-primary)' }}
          >
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>
        </div>
        
        {/* Title */}
        <div className='mb-3 text-[var(--text-primary)] font-semibold text-lg'>
          {title}
        </div>
        
        {/* Subtitle */}
        {subtitle && (
          <div className='text-[var(--text-secondary)] text-sm mb-2'>
            {subtitle}
          </div>
        )}
        
        {/* Trend */}
        {trend && (
          <div className={cn(
            'text-sm font-medium flex items-center justify-center gap-1',
            trend.isPositive ? 'text-green-600' : 'text-red-600'
          )}>
            <span>{trend.isPositive ? '↗' : '↘'}</span>
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
        
        {/* Custom children */}
        {children && (
          <div className='mt-4'>
            {children}
          </div>
        )}
      </div>
    </AdminCard>
  );
}

export { AdminStatsCard };
