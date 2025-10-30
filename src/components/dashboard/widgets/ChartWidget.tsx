'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import {
    Activity,
    Download,
    Maximize2,
    Minimize2,
    MoreHorizontal,
    RefreshCw,
    TrendingUp
} from 'lucide-react';
import React, { useMemo } from 'react';

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
  }[];
}

export interface ChartWidgetProps {
  title: string;
  subtitle?: string;
  type: 'line' | 'bar' | 'pie' | 'doughnut' | 'area' | 'radar';
  data: ChartData;
  height?: number;
  showLegend?: boolean;
  showGrid?: boolean;
  animate?: boolean;
  isLoading?: boolean;
  error?: string;
  onRefresh?: () => void;
  onExport?: () => void;
  onExpand?: () => void;
  isExpanded?: boolean;
  className?: string;
  trend?: {
    value: number;
    label: string;
    isPositive?: boolean;
  };
}

const ChartWidget: React.FC<ChartWidgetProps> = ({
  title,
  subtitle,
  type,
  data,
  height = 300,
  showLegend = true,
  showGrid = true,
  animate = true,
  isLoading = false,
  error,
  onRefresh,
  onExport,
  onExpand,
  isExpanded = false,
  className,
  trend,
}) => {
  const chartId = useMemo(() => `chart-${Math.random().toString(36).substr(2, 9)}`, []);

  const renderChart = () => {
    if (error) {
      return (
        <div className="h-full flex items-center justify-center text-center">
          <div>
            <Activity className="w-12 h-12 text-error-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-error-700 dark:text-error-300 mb-2">
              خطأ في تحميل البيانات
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
              {error}
            </p>
            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                icon={RefreshCw}
              >
                إعادة المحاولة
              </Button>
            )}
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

    // Simple SVG-based chart implementation
    return (
      <div className="h-full">
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 400 ${height}`}
          className="overflow-visible"
        >
          {renderChartContent()}
        </svg>
      </div>
    );
  };

  const renderChartContent = () => {
    if (!data || !data.labels || !data.datasets) return null;

    const { labels, datasets } = data;
    const maxValue = Math.max(...datasets.flatMap(d => d.data));
    const chartWidth = 350;
    const chartHeight = height - 60;
    const padding = 20;

    switch (type) {
      case 'bar':
        return renderBarChart(labels, datasets, maxValue, chartWidth, chartHeight, padding);
      case 'line':
      case 'area':
        return renderLineChart(labels, datasets, maxValue, chartWidth, chartHeight, padding, type === 'area');
      case 'pie':
      case 'doughnut':
        return renderPieChart(datasets, chartWidth, chartHeight, type === 'doughnut');
      default:
        return renderBarChart(labels, datasets, maxValue, chartWidth, chartHeight, padding);
    }
  };

  const renderBarChart = (labels: string[], datasets: any[], maxValue: number, width: number, height: number, padding: number) => {
    const barWidth = (width - padding * 2) / labels.length / datasets.length;
    const elements = [];

    // Grid lines
    if (showGrid) {
      for (let i = 0; i <= 5; i++) {
        const y = padding + (height - padding * 2) * (i / 5);
        elements.push(
          <line
            key={`grid-${i}`}
            x1={padding}
            y1={y}
            x2={width - padding}
            y2={y}
            stroke="var(--color-neutral-200)"
            strokeWidth="1"
            strokeDasharray="2,2"
          />
        );
      }
    }

    // Bars
    datasets.forEach((dataset, datasetIndex) => {
      dataset.data.forEach((value: number, index: number) => {
        const barHeight = ((value / maxValue) * (height - padding * 2));
        const x = padding + index * (width - padding * 2) / labels.length + datasetIndex * barWidth;
        const y = height - padding - barHeight;

        elements.push(
          <rect
            key={`bar-${datasetIndex}-${index}`}
            x={x}
            y={y}
            width={barWidth - 2}
            height={barHeight}
            fill={dataset.backgroundColor || `var(--color-primary-${(datasetIndex + 1) * 100})`}
            className="transition-all duration-300 hover:opacity-80"
          />
        );
      });
    });

    // X-axis labels
    labels.forEach((label, index) => {
      const x = padding + index * (width - padding * 2) / labels.length + ((width - padding * 2) / labels.length) / 2;
      elements.push(
        <text
          key={`label-${index}`}
          x={x}
          y={height - 5}
          textAnchor="middle"
          className="text-xs fill-neutral-600 dark:fill-neutral-400"
        >
          {label}
        </text>
      );
    });

    return elements;
  };

  const renderLineChart = (labels: string[], datasets: any[], maxValue: number, width: number, height: number, padding: number, isArea: boolean) => {
    const elements = [];

    datasets.forEach((dataset, datasetIndex) => {
      const points = dataset.data.map((value: number, index: number) => {
        const x = padding + index * (width - padding * 2) / (labels.length - 1);
        const y = height - padding - ((value / maxValue) * (height - padding * 2));
        return `${x},${y}`;
      }).join(' ');

      // Area fill
      if (isArea) {
        const areaPoints = points + ` ${width - padding},${height - padding} ${padding},${height - padding}`;
        elements.push(
          <polygon
            key={`area-${datasetIndex}`}
            points={areaPoints}
            fill={dataset.backgroundColor || `var(--color-primary-${(datasetIndex + 1) * 100})`}
            fillOpacity="0.1"
          />
        );
      }

      // Line
      elements.push(
        <polyline
          key={`line-${datasetIndex}`}
          points={points}
          fill="none"
          stroke={dataset.borderColor || `var(--color-primary-${(datasetIndex + 1) * 100})`}
          strokeWidth="2"
          className="transition-all duration-300"
        />
      );

      // Points
      dataset.data.forEach((value: number, index: number) => {
        const x = padding + index * (width - padding * 2) / (labels.length - 1);
        const y = height - padding - ((value / maxValue) * (height - padding * 2));

        elements.push(
          <circle
            key={`point-${datasetIndex}-${index}`}
            cx={x}
            cy={y}
            r="4"
            fill={dataset.borderColor || `var(--color-primary-${(datasetIndex + 1) * 100})`}
            className="transition-all duration-300 hover:r-6"
          />
        );
      });
    });

    return elements;
  };

  const renderPieChart = (datasets: any[], width: number, height: number, isDoughnut: boolean) => {
    const data = datasets[0]?.data || [];
    const total = data.reduce((sum, value) => sum + value, 0);
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3;
    const innerRadius = isDoughnut ? radius * 0.6 : 0;

    let currentAngle = -Math.PI / 2; // Start from top

    return data.map((value: number, index: number) => {
      const angle = (value / total) * 2 * Math.PI;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;

      // Calculate path
      const x1 = centerX + Math.cos(startAngle) * radius;
      const y1 = centerY + Math.sin(startAngle) * radius;
      const x2 = centerX + Math.cos(endAngle) * radius;
      const y2 = centerY + Math.sin(endAngle) * radius;

      const largeArcFlag = angle > Math.PI ? 1 : 0;

      let pathData = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

      if (isDoughnut) {
        const ix1 = centerX + Math.cos(startAngle) * innerRadius;
        const iy1 = centerY + Math.sin(startAngle) * innerRadius;
        const ix2 = centerX + Math.cos(endAngle) * innerRadius;
        const iy2 = centerY + Math.sin(endAngle) * innerRadius;

        pathData = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${ix1} ${iy1} Z`;
      }

      currentAngle = endAngle;

      const color = datasets[0]?.backgroundColor?.[index] || `var(--color-primary-${((index % 9) + 1) * 100})`;

      return (
        <path
          key={`slice-${index}`}
          d={pathData}
          fill={color}
          className="transition-all duration-300 hover:opacity-80"
        />
      );
    });
  };

  return (
    <Card
      variant="elevated"
      className={cn(
        'relative overflow-hidden',
        isExpanded && 'fixed inset-4 z-50',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 pb-0">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              {subtitle}
            </p>
          )}
          {trend && (
            <div className="flex items-center gap-2 mt-2">
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
        </div>

        <div className="flex items-center gap-2">
          {onRefresh && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              icon={RefreshCw}
              className="w-8 h-8 p-0"
            />
          )}
          {onExport && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onExport}
              icon={Download}
              className="w-8 h-8 p-0"
            />
          )}
          {onExpand && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onExpand}
              icon={isExpanded ? Minimize2 : Maximize2}
              className="w-8 h-8 p-0"
            />
          )}
          <Button
            variant="ghost"
            size="sm"
            icon={MoreHorizontal}
            className="w-8 h-8 p-0"
          />
        </div>
      </div>

      {/* Chart Container */}
      <div
        className="px-6 pb-6"
        style={{ height: `${height}px` }}
      >
        {renderChart()}
      </div>

      {/* Legend */}
      {showLegend && data?.datasets && (
        <div className="px-6 pb-6">
          <div className="flex flex-wrap gap-4">
            {data.datasets.map((dataset, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: dataset.backgroundColor || `var(--color-primary-${(index + 1) * 100})`
                  }}
                />
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  {dataset.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default ChartWidget;
