'use client';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import {
    Activity,
    AlertTriangle,
    Calendar,
    CheckCircle,
    DollarSign,
    Info,
    Minus,
    TrendingDown,
    TrendingUp,
    Users
} from 'lucide-react';
import React from 'react';

export interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    label: string;
    isPositive?: boolean;
  };
  icon?: React.ComponentType<{ className?: string }>;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  onClick?: () => void;
  className?: string;
}

const iconMap = {
  users: Users,
  calendar: Calendar,
  dollar: DollarSign,
  activity: Activity,
  trendingUp: TrendingUp,
  trendingDown: TrendingDown,
  alert: AlertTriangle,
  check: CheckCircle,
  info: Info,
};

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon,
  variant = 'default',
  size = 'md',
  isLoading = false,
  onClick,
  className,
}) => {
  const IconComponent = icon || iconMap.activity;

  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const titleSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const valueSizeClasses = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl',
  };

  const getTrendIcon = () => {
    if (!trend) return null;

    if (trend.value === 0) return <Minus className="w-4 h-4" />;
    if (trend.isPositive ?? trend.value > 0) {
      return <TrendingUp className="w-4 h-4 text-success-600" />;
    }
    return <TrendingDown className="w-4 h-4 text-error-600" />;
  };

  const getTrendColor = () => {
    if (!trend) return 'text-neutral-600';

    if (trend.value === 0) return 'text-neutral-600';
    if (trend.isPositive ?? trend.value > 0) {
      return 'text-success-600';
    }
    return 'text-error-600';
  };

  if (isLoading) {
    return (
      <Card variant="elevated" className={cn(sizeClasses[size], className)}>
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 bg-neutral-200 dark:bg-neutral-700 rounded-lg"></div>
            <div className="w-16 h-4 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
          </div>
          <div className="w-20 h-8 bg-neutral-200 dark:bg-neutral-700 rounded mb-2"></div>
          <div className="w-12 h-4 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      variant="elevated"
      hover={!!onClick}
      className={cn(
        sizeClasses[size],
        onClick && 'cursor-pointer hover-lift',
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className={cn(
            'font-medium text-neutral-600 dark:text-neutral-400 mb-1',
            titleSizeClasses[size]
          )}>
            {title}
          </div>

          <div className={cn(
            'font-bold text-neutral-900 dark:text-neutral-50 mb-2',
            valueSizeClasses[size]
          )}>
            {typeof value === 'number' ? value.toLocaleString('ar-SA') : value}
          </div>

          {subtitle && (
            <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">
              {subtitle}
            </div>
          )}

          {trend && (
            <div className="flex items-center gap-2">
              {getTrendIcon()}
              <span className={cn('text-sm font-medium', getTrendColor())}>
                {trend.isPositive ?? trend.value > 0 ? '+' : ''}
                {trend.value}% {trend.label}
              </span>
            </div>
          )}
        </div>

        <div className={cn(
          'flex-shrink-0 ml-4',
          size === 'sm' && 'w-8 h-8',
          size === 'md' && 'w-10 h-10',
          size === 'lg' && 'w-12 h-12'
        )}>
          <div className={cn(
            'w-full h-full rounded-lg flex items-center justify-center',
            variant === 'success' && 'bg-success-100 dark:bg-success-900/20',
            variant === 'warning' && 'bg-warning-100 dark:bg-warning-900/20',
            variant === 'error' && 'bg-error-100 dark:bg-error-900/20',
            variant === 'info' && 'bg-info-100 dark:bg-info-900/20',
            variant === 'default' && 'bg-primary-100 dark:bg-primary-900/20'
          )}>
            <IconComponent className={cn(
              variant === 'success' && 'text-success-600 dark:text-success-400',
              variant === 'warning' && 'text-warning-600 dark:text-warning-400',
              variant === 'error' && 'text-error-600 dark:text-error-400',
              variant === 'info' && 'text-info-600 dark:text-info-400',
              variant === 'default' && 'text-primary-600 dark:text-primary-400',
              size === 'sm' && 'w-4 h-4',
              size === 'md' && 'w-5 h-5',
              size === 'lg' && 'w-6 h-6'
            )} />
          </div>
        </div>
      </div>

      {/* Status Indicator */}
      <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center justify-between">
          <Badge variant={variant} size="sm">
            {variant === 'success' && 'ممتاز'}
            {variant === 'warning' && 'يحتاج انتباه'}
            {variant === 'error' && 'عاجل'}
            {variant === 'info' && 'معلومات'}
            {variant === 'default' && 'طبيعي'}
          </Badge>

          <div className="text-xs text-neutral-400 dark:text-neutral-500">
            آخر تحديث: الآن
          </div>
        </div>
      </div>
    </Card>
  );
};

export default KPICard;
