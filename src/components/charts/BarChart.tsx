/**
 * Bar Chart Component - مكون الرسم البياني العمودي
 * RTL-compatible bar chart with brand colors and theme support
 */

'use client';

import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useTheme } from '@/core/theme';

interface BarChartProps {
  data: any[];
  dataKey: string;
  xAxisKey: string;
  bars?: Array<{
    dataKey: string;
    color: string;
    name: string;
  }>;
  height?: number;
  className?: string;
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  horizontal?: boolean;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  dataKey,
  xAxisKey,
  bars = [],
  height = 300,
  className = '',
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  horizontal = false,
}) => {
  const { isDark } = useTheme();

  // Default bars if none provided
  const defaultBars =
    bars.length > 0
      ? bars
      : [
          {
            dataKey: dataKey,
            color: 'var(--brand-primary)',
            name: 'Value',
          },
        ];

  const isRTL = document.documentElement.getAttribute('dir') === 'rtl';

  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <ResponsiveContainer width='100%' height='100%'>
        <RechartsBarChart
          data={data}
          margin={{
            top: 20,
            right: isRTL ? 30 : 30,
            left: isRTL ? 30 : 0,
            bottom: 20,
          }}
          layout={horizontal ? 'horizontal' : 'vertical'}
        >
          {showGrid && (
            <CartesianGrid
              strokeDasharray='3 3'
              stroke={isDark ? '#374151' : '#e5e7eb'}
            />
          )}
          <XAxis
            dataKey={horizontal ? dataKey : xAxisKey}
            tick={{ fontSize: 12, fill: isDark ? '#9ca3af' : '#6b7280' }}
            axisLine={{ stroke: isDark ? '#374151' : '#e5e7eb' }}
            tickLine={{ stroke: isDark ? '#374151' : '#e5e7eb' }}
            reversed={isRTL && !horizontal}
            type={horizontal ? 'number' : 'category'}
          />
          <YAxis
            dataKey={horizontal ? xAxisKey : dataKey}
            tick={{ fontSize: 12, fill: isDark ? '#9ca3af' : '#6b7280' }}
            axisLine={{ stroke: isDark ? '#374151' : '#e5e7eb' }}
            tickLine={{ stroke: isDark ? '#374151' : '#e5e7eb' }}
            orientation={isRTL ? 'right' : 'left'}
            type={horizontal ? 'category' : 'number'}
          />
          {showTooltip && (
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#1f2937' : '#ffffff',
                border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                borderRadius: '8px',
                color: isDark ? '#e5eef7' : '#0f172a',
              }}
              labelStyle={{
                color: isDark ? '#9ca3af' : '#6b7280',
                fontSize: '12px',
              }}
            />
          )}
          {showLegend && (
            <Legend
              wrapperStyle={{
                color: isDark ? '#e5eef7' : '#0f172a',
                fontSize: '12px',
              }}
            />
          )}
          {defaultBars.map((bar, index) => (
            <Bar
              key={bar.dataKey}
              dataKey={bar.dataKey}
              fill={bar.color}
              name={bar.name}
              radius={[2, 2, 0, 0]}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
