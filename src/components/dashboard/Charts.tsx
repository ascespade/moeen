import React from "react";
"use client";

// Lightweight chart implementations using SVG and CSS only to minimize bundle size

const data = Array.from({ length: 7 }).map((_, i) => ({
  day: `D${i + 1}`
  messages: Math.round(50 + Math.random() * 100),
  conversations: Math.round(5 + Math.random() * 20),
}));

const pie = [
  { name: "WhatsApp", value: 60, color: "#16a34a" },
  { name: "Web", value: 30, color: "#2563eb" },
  { name: "Other", value: 10, color: "#f59e0b" },
];

export function LineChart() {
  const width = 600;
  const height = 220;
  const padding = 30;
  const maxY =
    Math.max(...data.map((d) => Math.max(d.messages, d.conversations))) * 1.1;
  const xStep = (width - padding * 2) / (data.length - 1);
  const yScale = (v: number) =>
    height - padding - (v / maxY) * (height - padding * 2);

  const toPolyline = (key: "messages" | "conversations") =>
    data.map((d, i) => `${padding + i * xStep},${yScale(d[key])}`

  return (
    <div className="h-64">
      <svg viewBox={`0 0 ${width} ${height}`
        <g>
          {/* Axes */}
          <line
            x1={padding}
            y1={height - padding}
            x2={width - padding}
            y2={height - padding}
            stroke="#e5e7eb"
          />
          <line
            x1={padding}
            y1={padding}
            x2={padding}
            y2={height - padding}
            stroke="#e5e7eb"
          />
          {/* Lines */}
          <polyline
            fill="none"
            stroke="#2563eb"
            strokeWidth={2}
            points={toPolyline("messages")}
          />
          <polyline
            fill="none"
            stroke="#16a34a"
            strokeWidth={2}
            points={toPolyline("conversations")}
          />
        </g>
      </svg>
    </div>
  );
}

export function BarChart() {
  const maxY =
    Math.max(...data.map((d) => Math.max(d.messages, d.conversations))) * 1.1;
  return (
    <div className="h-64 grid grid-cols-7 items-end gap-2 p-4 border border-gray-200 dark:border-gray-700 rounded-md">
      {data.map((d, i) => (
        <div key={i} className="flex flex-col items-center gap-2">
          <div className="flex flex-col gap-1 w-full">
            <div
              className="bg-blue-500 rounded-t"
              style={{
                height: `${(d.messages / maxY) * 200}px`
              }}
            />
            <div
              className="bg-green-500 rounded-b"
              style={{
                height: `${(d.conversations / maxY) * 200}px`
              }}
            />
          </div>
          <span className="text-xs text-gray-500">{d.day}</span>
        </div>
      ))}
    </div>
  );
}

export function PieChart() {
  const total = pie.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  return (
    <div className="h-64 w-64 mx-auto">
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <g transform="translate(100, 100)">
          {pie.map((item, i) => {
            const angle = (item.value / total) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            currentAngle += angle;

            const x1 = Math.cos((startAngle * Math.PI) / 180) * 80;
            const y1 = Math.sin((startAngle * Math.PI) / 180) * 80;
            const x2 = Math.cos((endAngle * Math.PI) / 180) * 80;
            const y2 = Math.sin((endAngle * Math.PI) / 180) * 80;

            const largeArcFlag = angle > 180 ? 1 : 0;

            const pathData = [
              `M 0 0`
              `L ${x1} ${y1}`
              `A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2}`
              `Z`
            ].join(" ");

            return (
              <path
                key={i}
                d={pathData}
                fill={item.color}
                stroke="white"
                strokeWidth="2"
              />
            );
          })}
        </g>
      </svg>
      <div className="mt-4 space-y-2">
        {pie.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm">{item.name}: {item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AreaChart() {
  const width = 600;
  const height = 220;
  const padding = 30;
  const maxY = Math.max(...data.map((d) => d.messages)) * 1.1;
  const xStep = (width - padding * 2) / (data.length - 1);
  const yScale = (v: number) =>
    height - padding - (v / maxY) * (height - padding * 2);

  const points = data
    .map((d, i) => `${padding + i * xStep},${yScale(d.messages)}`
    .join(" ");

  const areaPath = `
    padding + (data.length - 1) * xStep
  },${height - padding} Z`

  return (
    <div className="h-64">
      <svg viewBox={`0 0 ${width} ${height}`
        <g>
          {/* Area */}
          <path
            d={areaPath}
            fill="url(#gradient)"
            stroke="#2563eb"
            strokeWidth={2}
          />
          {/* Line */}
          <polyline
            fill="none"
            stroke="#2563eb"
            strokeWidth={2}
            points={points}
          />
          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2563eb" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
            </linearGradient>
          </defs>
        </g>
      </svg>
    </div>
  );
}