/**
 * Line Chart Component - مكون الرسم البياني الخطي
 * RTL-compatible line chart with brand colors and theme support
 */

'use client';

import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useTheme } from '@/core/theme';

interface LineChartProps {
  data: any[];
  dataKey: string;
  xAxisKey: string;
  lines?: Array<{
    dataKey: string;
    color: string;
    name: string;
    strokeWidth?: number;
  }>;
  height?: number;
  className?: string;
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  smooth?: boolean;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  dataKey,
  xAxisKey,
  lines = [],
  height = 300,
  className = '',
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  smooth = true,
}) => {
  const { isDark } = useTheme();

  // Default lines if none provided
  const defaultLines =
    lines.length > 0
      ? lines
      : [
          {
            dataKey,
            color: 'var(--brand-primary)',
            name: 'Value',
            strokeWidth: 2,
          },
        ];

  const isRTL = document.documentElement.getAttribute('dir') === 'rtl';

  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <ResponsiveContainer width='100%' height='100%'>
        <RechartsLineChart
          data={data}
          margin={{
            top: 20,
            right: isRTL ? 30 : 30,
            left: isRTL ? 30 : 0,
            bottom: 20,
          }}
        >
          {showGrid && (
            <CartesianGrid
              strokeDasharray='3 3'
              stroke={isDark ? '#374151' : '#e5e7eb'}
            />
          )}
          <XAxis
            dataKey={xAxisKey}
            tick={{ fontSize: 12, fill: isDark ? '#9ca3af' : '#6b7280' }}
            axisLine={{ stroke: isDark ? '#374151' : '#e5e7eb' }}
            tickLine={{ stroke: isDark ? '#374151' : '#e5e7eb' }}
            reversed={isRTL}
          />
          <YAxis
            tick={{ fontSize: 12, fill: isDark ? '#9ca3af' : '#6b7280' }}
            axisLine={{ stroke: isDark ? '#374151' : '#e5e7eb' }}
            tickLine={{ stroke: isDark ? '#374151' : '#e5e7eb' }}
            orientation={isRTL ? 'right' : 'left'}
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
          {defaultLines.map((line, index) => (
            <Line
              key={line.dataKey}
              type={smooth ? 'monotone' : 'linear'}
              dataKey={line.dataKey}
              stroke={line.color}
              strokeWidth={line.strokeWidth || 2}
              dot={{ fill: line.color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: line.color, strokeWidth: 2 }}
              name={line.name}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChart;
