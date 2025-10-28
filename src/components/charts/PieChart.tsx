/**
 * Pie Chart Component - مكون الرسم البياني الدائري
 * RTL-compatible pie chart with brand colors and theme support
 */

'use client';

import React from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

import { useTheme } from '@/context/ThemeContext';

interface PieChartProps {
  data: Array<{
    name: string;
    value: number;
    color?: string;
  }>;
  height?: number;
  className?: string;
  showLegend?: boolean;
  showTooltip?: boolean;
  innerRadius?: number;
  outerRadius?: number;
  labelKey?: string;
}

export const PieChart: React.FC<PieChartProps> = ({
  data,
  height = 300,
  className = '',
  showLegend = true,
  showTooltip = true,
  innerRadius = 0,
  outerRadius = 80,
  labelKey,
}) => {
  const { isDark } = useTheme();

  // Brand colors for default coloring
  const brandColors = [
    'var(--brand-primary)',
    'var(--brand-secondary)',
    'var(--brand-accent)',
    'var(--brand-accent-deep)',
    'var(--brand-success)',
    'var(--brand-warning)',
    'var(--brand-error)',
  ];

  // Add colors to data if not provided
  const dataWithColors = data.map((item, index) => ({
    ...item,
    color: item.color || brandColors[index % brandColors.length],
  }));

  const isRTL = document.documentElement.getAttribute('dir') === 'rtl';

  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <ResponsiveContainer width='100%' height='100%'>
        <RechartsPieChart>
          <Pie
            data={dataWithColors}
            cx='50%'
            cy='50%'
            labelLine={false}
            label={
              labelKey
                ? ({ name, percent }: any) =>
                    `${name} ${((percent as number) * 100).toFixed(0)}%`
                : false
            }
            outerRadius={outerRadius}
            innerRadius={innerRadius}
            fill='#8884d8'
            dataKey='value'
          >
            {dataWithColors.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
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
              layout={isRTL ? 'vertical' : 'horizontal'}
              verticalAlign='bottom'
              align={isRTL ? 'right' : 'center'}
            />
          )}
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChart;
