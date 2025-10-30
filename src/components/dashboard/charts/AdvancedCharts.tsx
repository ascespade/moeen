'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import {
    Activity,
    BarChart3,
    Download,
    LineChart as LineChartIcon,
    Maximize2,
    PieChart as PieChartIcon,
    RefreshCw,
    Target,
    TrendingUp
} from 'lucide-react';
import React, { useCallback, useMemo } from 'react';

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
  metadata?: Record<string, any>;
}

export interface TimeSeriesData {
  timestamp: Date;
  value: number;
  label?: string;
  category?: string;
}

export interface AdvancedChartProps {
  type: 'line' | 'bar' | 'area' | 'pie' | 'doughnut' | 'radar' | 'scatter' | 'bubble' | 'heatmap' | 'treemap' | 'funnel' | 'gauge';
  data: ChartDataPoint[] | TimeSeriesData[];
  title?: string;
  subtitle?: string;
  width?: number;
  height?: number;
  showLegend?: boolean;
  showGrid?: boolean;
  showTooltip?: boolean;
  animate?: boolean;
  interactive?: boolean;
  colorScheme?: string[];
  onPointClick?: (point: ChartDataPoint | TimeSeriesData, index: number) => void;
  onRefresh?: () => void;
  onExport?: (format: 'png' | 'svg' | 'pdf') => void;
  onExpand?: () => void;
  isLoading?: boolean;
  error?: string;
  trend?: {
    value: number;
    label: string;
    isPositive?: boolean;
  };
  className?: string;
}

// Line Chart Component
export const AdvancedLineChart: React.FC<Omit<AdvancedChartProps, 'type'> & { data: TimeSeriesData[] }> = ({
  data,
  title,
  subtitle,
  width = 600,
  height = 300,
  showLegend = true,
  showGrid = true,
  showTooltip = true,
  animate = true,
  interactive = true,
  colorScheme = ['#f97316', '#3b82f6', '#10b981', '#f59e0b'],
  onPointClick,
  className,
}) => {
  const processedData = useMemo(() => {
    const categories = [...new Set(data.map(d => d.category || 'default'))];
    return categories.map((category, index) => ({
      category,
      points: data.filter(d => (d.category || 'default') === category),
      color: colorScheme[index % colorScheme.length],
    }));
  }, [data, colorScheme]);

  const maxValue = useMemo(() =>
    Math.max(...data.map(d => d.value)) * 1.1,
    [data]
  );

  const minValue = useMemo(() =>
    Math.min(...data.map(d => d.value)) * 0.9,
    [data]
  );

  const timeRange = useMemo(() => {
    if (data.length === 0) return { start: new Date(), end: new Date() };
    const timestamps = data.map(d => d.timestamp.getTime());
    return {
      start: new Date(Math.min(...timestamps)),
      end: new Date(Math.max(...timestamps)),
    };
  }, [data]);

  const svgPoints = useCallback((points: TimeSeriesData[], color: string) => {
    if (points.length === 0) return null;

    const timeSpan = timeRange.end.getTime() - timeRange.start.getTime();
    const valueSpan = maxValue - minValue;

    const pathData = points.map((point, index) => {
      const x = (point.timestamp.getTime() - timeRange.start.getTime()) / timeSpan * (width - 80) + 40;
      const y = height - 40 - ((point.value - minValue) / valueSpan * (height - 80));
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');

    return (
      <g key={color}>
        {/* Area fill */}
        <path
          d={`${pathData} L ${width - 40} ${height - 40} L 40 ${height - 40} Z`}
          fill={color}
          fillOpacity="0.1"
          className={cn(animate && 'transition-all duration-1000')}
        />

        {/* Line */}
        <path
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth="2"
          className={cn(animate && 'transition-all duration-1000')}
        />

        {/* Points */}
        {points.map((point, index) => {
          const x = (point.timestamp.getTime() - timeRange.start.getTime()) / timeSpan * (width - 80) + 40;
          const y = height - 40 - ((point.value - minValue) / valueSpan * (height - 80));

          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="4"
              fill={color}
              className={cn(
                'transition-all duration-200 hover:r-6',
                interactive && 'cursor-pointer'
              )}
              onClick={() => interactive && onPointClick?.(point, index)}
            />
          );
        })}
      </g>
    );
  }, [width, height, timeRange, maxValue, minValue, animate, interactive, onPointClick]);

  return (
    <div className={cn('w-full', className)}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Grid */}
        {showGrid && (
          <>
            {/* Horizontal grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
              <line
                key={`h-${index}`}
                x1="40"
                y1={40 + ratio * (height - 80)}
                x2={width - 40}
                y2={40 + ratio * (height - 80)}
                stroke="var(--color-neutral-200)"
                strokeWidth="1"
                strokeDasharray="2,2"
              />
            ))}

            {/* Vertical grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
              <line
                key={`v-${index}`}
                x1={40 + ratio * (width - 80)}
                y1="40"
                x2={40 + ratio * (width - 80)}
                y2={height - 40}
                stroke="var(--color-neutral-200)"
                strokeWidth="1"
                strokeDasharray="2,2"
              />
            ))}
          </>
        )}

        {/* Axes */}
        {/* X-axis */}
        <line
          x1="40"
          y1={height - 40}
          x2={width - 40}
          y2={height - 40}
          stroke="var(--color-neutral-400)"
          strokeWidth="1"
        />

        {/* Y-axis */}
        <line
          x1="40"
          y1="40"
          x2="40"
          y2={height - 40}
          stroke="var(--color-neutral-400)"
          strokeWidth="1"
        />

        {/* Data */}
        {processedData.map(({ points, color }) => svgPoints(points, color))}
      </svg>
    </div>
  );
};

// Bar Chart Component
export const AdvancedBarChart: React.FC<Omit<AdvancedChartProps, 'type'> & { data: ChartDataPoint[] }> = ({
  data,
  title,
  subtitle,
  width = 600,
  height = 300,
  showLegend = true,
  showGrid = true,
  animate = true,
  interactive = true,
  colorScheme = ['#f97316', '#3b82f6', '#10b981', '#f59e0b'],
  onPointClick,
  className,
}) => {
  const maxValue = useMemo(() =>
    Math.max(...data.map(d => d.value)) * 1.1,
    [data]
  );

  const barWidth = useMemo(() =>
    Math.max(20, (width - 80) / data.length - 10),
    [width, data.length]
  );

  return (
    <div className={cn('w-full', className)}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Grid */}
        {showGrid && (
          <>
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
              <line
                key={`grid-${index}`}
                x1="40"
                y1={40 + ratio * (height - 80)}
                x2={width - 40}
                y2={40 + ratio * (height - 80)}
                stroke="var(--color-neutral-200)"
                strokeWidth="1"
                strokeDasharray="2,2"
              />
            ))}
          </>
        )}

        {/* Axes */}
        <line
          x1="40"
          y1={height - 40}
          x2={width - 40}
          y2={height - 40}
          stroke="var(--color-neutral-400)"
          strokeWidth="1"
        />
        <line
          x1="40"
          y1="40"
          x2="40"
          y2={height - 40}
          stroke="var(--color-neutral-400)"
          strokeWidth="1"
        />

        {/* Bars */}
        {data.map((point, index) => {
          const barHeight = (point.value / maxValue) * (height - 80);
          const x = 40 + index * ((width - 80) / data.length);
          const y = height - 40 - barHeight;
          const color = point.color || colorScheme[index % colorScheme.length];

          return (
            <rect
              key={index}
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              fill={color}
              className={cn(
                'transition-all duration-500',
                animate && 'animate-fade-in',
                interactive && 'cursor-pointer hover:opacity-80'
              )}
              style={{
                animationDelay: animate ? `${index * 100}ms` : undefined
              }}
              onClick={() => interactive && onPointClick?.(point, index)}
            />
          );
        })}
      </svg>
    </div>
  );
};

// Pie Chart Component
export const AdvancedPieChart: React.FC<Omit<AdvancedChartProps, 'type'> & { data: ChartDataPoint[] }> = ({
  data,
  title,
  subtitle,
  width = 400,
  height = 400,
  showLegend = true,
  animate = true,
  interactive = true,
  colorScheme = ['#f97316', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
  onPointClick,
  className,
}) => {
  const total = useMemo(() =>
    data.reduce((sum, point) => sum + point.value, 0),
    [data]
  );

  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 3;

  let currentAngle = -Math.PI / 2; // Start from top

  return (
    <div className={cn('w-full flex items-center justify-center', className)}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {data.map((point, index) => {
          const angle = (point.value / total) * 2 * Math.PI;
          const startAngle = currentAngle;
          const endAngle = currentAngle + angle;

          const x1 = centerX + Math.cos(startAngle) * radius;
          const y1 = centerY + Math.sin(startAngle) * radius;
          const x2 = centerX + Math.cos(endAngle) * radius;
          const y2 = centerY + Math.sin(endAngle) * radius;

          const largeArcFlag = angle > Math.PI ? 1 : 0;

          const pathData = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

          const color = point.color || colorScheme[index % colorScheme.length];

          currentAngle = endAngle;

          return (
            <path
              key={index}
              d={pathData}
              fill={color}
              className={cn(
                'transition-all duration-500 stroke-white stroke-2',
                animate && 'animate-fade-in',
                interactive && 'cursor-pointer hover:opacity-80'
              )}
              style={{
                animationDelay: animate ? `${index * 200}ms` : undefined
              }}
              onClick={() => interactive && onPointClick?.(point, index)}
            />
          );
        })}
      </svg>
    </div>
  );
};

// Gauge Chart Component
export const GaugeChart: React.FC<{
  value: number;
  maxValue?: number;
  minValue?: number;
  title?: string;
  subtitle?: string;
  color?: string;
  size?: number;
  showValue?: boolean;
  animate?: boolean;
}> = ({
  value,
  maxValue = 100,
  minValue = 0,
  title,
  subtitle,
  color = '#f97316',
  size = 200,
  showValue = true,
  animate = true,
}) => {
  const percentage = Math.min(100, Math.max(0, ((value - minValue) / (maxValue - minValue)) * 100));
  const angle = (percentage / 100) * Math.PI + Math.PI; // Start from left, go to right
  const radius = size / 2 - 20;
  const centerX = size / 2;
  const centerY = size / 2 + 20;

  const x = centerX + Math.cos(angle) * radius;
  const y = centerY + Math.sin(angle) * radius;

  // Background arc
  const backgroundPath = `M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}`;

  // Value arc
  const valueAngle = (percentage / 100) * Math.PI;
  const valuePath = `M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 ${valueAngle > Math.PI ? 1 : 0} 1 ${x} ${y}`;

  return (
    <div className="flex flex-col items-center">
      {title && (
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-2">
          {title}
        </h3>
      )}

      <div className="relative">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Background arc */}
          <path
            d={backgroundPath}
            fill="none"
            stroke="var(--color-neutral-200)"
            strokeWidth="12"
            strokeLinecap="round"
          />

          {/* Value arc */}
          <path
            d={valuePath}
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            className={cn(animate && 'transition-all duration-1000')}
          />

          {/* Center circle */}
          <circle
            cx={centerX}
            cy={centerY}
            r="8"
            fill={color}
          />

          {/* Value text */}
          {showValue && (
            <text
              x={centerX}
              y={centerY + 40}
              textAnchor="middle"
              className="text-2xl font-bold fill-neutral-900 dark:fill-neutral-50"
            >
              {Math.round(percentage)}%
            </text>
          )}
        </svg>
      </div>

      {subtitle && (
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 text-center">
          {subtitle}
        </p>
      )}
    </div>
  );
};

// Main Advanced Charts Component
export const AdvancedCharts: React.FC<AdvancedChartProps> = ({
  type,
  data,
  title,
  subtitle,
  width = 600,
  height = 300,
  showLegend = true,
  showGrid = true,
  showTooltip = true,
  animate = true,
  interactive = true,
  colorScheme,
  onPointClick,
  onRefresh,
  onExport,
  onExpand,
  isLoading = false,
  error,
  trend,
  className,
}) => {
  const renderChart = () => {
    if (error) {
      return (
        <div className="h-full flex items-center justify-center text-center">
          <div>
            <Activity className="w-12 h-12 text-error-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-error-700 dark:text-error-300 mb-2">
              خطأ في تحميل البيانات
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {error}
            </p>
          </div>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="h-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      );
    }

    switch (type) {
      case 'line':
      case 'area':
        return (
          <AdvancedLineChart
            data={data as TimeSeriesData[]}
            width={width}
            height={height}
            showLegend={showLegend}
            showGrid={showGrid}
            animate={animate}
            interactive={interactive}
            colorScheme={colorScheme}
            onPointClick={onPointClick}
          />
        );
      case 'bar':
        return (
          <AdvancedBarChart
            data={data as ChartDataPoint[]}
            width={width}
            height={height}
            showLegend={showLegend}
            showGrid={showGrid}
            animate={animate}
            interactive={interactive}
            colorScheme={colorScheme}
            onPointClick={onPointClick}
          />
        );
      case 'pie':
      case 'doughnut':
        return (
          <AdvancedPieChart
            data={data as ChartDataPoint[]}
            width={Math.min(width, height)}
            height={Math.min(width, height)}
            showLegend={showLegend}
            animate={animate}
            interactive={interactive}
            colorScheme={colorScheme}
            onPointClick={onPointClick}
          />
        );
      case 'gauge':
        return (
          <div className="h-full flex items-center justify-center">
            <GaugeChart
              value={(data as ChartDataPoint[])[0]?.value || 0}
              maxValue={100}
              title={title}
              animate={animate}
            />
          </div>
        );
      default:
        return (
          <div className="h-full flex items-center justify-center text-neutral-500">
            نوع الرسم البياني غير مدعوم
          </div>
        );
    }
  };

  const getChartIcon = () => {
    switch (type) {
      case 'line':
      case 'area':
        return LineChartIcon;
      case 'bar':
        return BarChart3;
      case 'pie':
      case 'doughnut':
        return PieChartIcon;
      case 'gauge':
        return Target;
      default:
        return Activity;
    }
  };

  const ChartIcon = getChartIcon();

  return (
    <Card variant="elevated" className={cn('overflow-hidden', className)}>
      {/* Header */}
      {(title || subtitle || onRefresh || onExport || onExpand) && (
        <div className="flex items-center justify-between p-6 pb-0">
          <div className="flex items-center gap-3">
            <ChartIcon className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            <div>
              {title && (
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {trend && (
              <div className="flex items-center gap-2 px-3 py-1 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                <TrendingUp className={cn(
                  'w-4 h-4',
                  trend.isPositive ?? trend.value > 0 ? 'text-success-600' : 'text-error-600'
                )} />
                <span className={cn(
                  'text-sm font-medium',
                  trend.isPositive ?? trend.value > 0 ? 'text-success-600' : 'text-error-600'
                )}>
                  {trend.isPositive ?? trend.value > 0 ? '+' : ''}{trend.value}% {trend.label}
                </span>
              </div>
            )}

            {onRefresh && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRefresh}
                icon={RefreshCw}
                className="w-8 h-8 p-0"
                title="تحديث"
              />
            )}

            {onExport && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onExport('png')}
                icon={Download}
                className="w-8 h-8 p-0"
                title="تصدير"
              />
            )}

            {onExpand && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onExpand}
                icon={Maximize2}
                className="w-8 h-8 p-0"
                title="تكبير"
              />
            )}
          </div>
        </div>
      )}

      {/* Chart Container */}
      <div className="p-6">
        <div
          className="w-full"
          style={{ height: `${height}px` }}
        >
          {renderChart()}
        </div>
      </div>
    </Card>
  );
};

export default AdvancedCharts;
