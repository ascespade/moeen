import React from "react";

import { useTheme } from "@/core/theme";

"use client";

/**
 * Area Chart Component - مكون الرسم البياني المساحي
 * RTL-compatible area chart with brand colors and theme support
 */

AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface AreaChartProps {
  data: any[];
  dataKey: string;
  xAxisKey: string;
  areas?: Array<{
    dataKey: string;
    color: string;
    name: string;
  }>;
  height?: number;
  className?: string;
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;

export const AreaChart: React.FC<AreaChartProps> = ({
  data,
  dataKey,
  xAxisKey,
  areas = [],
  height = 300,
  className = "",
  showGrid = true,
  showLegend = true,
  showTooltip = true,
}) => {
  const { isDark } = useTheme();

  // Default areas if none provided
  const defaultAreas =
    areas.length > 0
      ? areas
      : [
            dataKey: dataKey,
            color: "var(--brand-primary)",
            name: "Value",
          },
        ];

  const isRTL = document.documentElement.getAttribute("dir") === "rtl";

  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart
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
              strokeDasharray="3 3"
              stroke={isDark ? "#374151" : "#e5e7eb"}
            />
          )}
          <XAxis
            dataKey={xAxisKey}
            tick={{ fontSize: 12, fill: isDark ? "#9ca3af" : "#6b7280" }}
            axisLine={{ stroke: isDark ? "#374151" : "#e5e7eb" }}
            tickLine={{ stroke: isDark ? "#374151" : "#e5e7eb" }}
            reversed={isRTL}
          />
          <YAxis
            tick={{ fontSize: 12, fill: isDark ? "#9ca3af" : "#6b7280" }}
            axisLine={{ stroke: isDark ? "#374151" : "#e5e7eb" }}
            tickLine={{ stroke: isDark ? "#374151" : "#e5e7eb" }}
            orientation={isRTL ? "right" : "left"}
          />
          {showTooltip && (
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? "#1f2937" : "#ffffff",
                border: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
                borderRadius: "8px",
                color: isDark ? "#e5eef7" : "#0f172a",
              }}
              labelStyle={{
                color: isDark ? "#9ca3af" : "#6b7280",
                fontSize: "12px",
              }}
            />
          )}
          {showLegend && (
            <Legend
              wrapperStyle={{
                color: isDark ? "#e5eef7" : "#0f172a",
                fontSize: "12px",
              }}
            />
          )}
          {defaultAreas.map((area, index) => (
            <Area
              key={area.dataKey}
              type="monotone"
              dataKey={area.dataKey}
              stackId={index}
              stroke={area.color}
              fill={area.color}
              fillOpacity={0.6}
              name={area.name}
            />
          ))}
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AreaChart;
