"use client";

// Lightweight chart implementations using SVG and CSS only to minimize bundle size

const data = Array.from({ length: 7 }).map((_, i) => ({
  day: `D${i + 1}`,
  messages: Math.round(50 + Math.random() * 100),
  conversations: Math.round(5 + Math.random() * 20),
}));
const pie = [
  { name: "WhatsApp", value: 60, color: "#16a34a" },
  { name: "Web", value: 30, color: "#2563eb" },
  { name: "Other", value: 10, color: "#f59e0b" },
];

export function ChartsA() {
  const width = 600;
  const height = 220;
  const padding = 30;
  const maxY =
    Math.max(...data.map((d) => Math.max(d.messages, d.conversations))) * 1.1;
  const xStep = (width - padding * 2) / (data.length - 1);
  const yScale = (v: number) =>
    height - padding - (v / maxY) * (height - padding * 2);

  const toPolyline = (key: "messages" | "conversations") =>
    data.map((d, i) => `${padding + i * xStep},${yScale(d[key])}`).join(" ");

  return (
    <div className="h-64">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
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

export function ChartsB() {
  const maxY =
    Math.max(...data.map((d) => Math.max(d.messages, d.conversations))) * 1.1;
  return (
    <div className="h-64 grid grid-cols-7 items-end gap-2 p-4 border border-gray-200 dark:border-gray-700 rounded-md">
      {data.map((d, i) => (
        <div key={i} className="flex h-full items-end gap-1">
          <div
            className="w-3 bg-[var(--brand-primary)]/80 rounded-sm"
            style={{ height: `${(d.messages / maxY) * 100}%` }}
            title={`Messages: ${d.messages}`}
          />
          <div
            className="w-3 bg-green-600/80 rounded-sm"
            style={{ height: `${(d.conversations / maxY) * 100}%` }}
            title={`Conversations: ${d.conversations}`}
          />
        </div>
      ))}
    </div>
  );
}

export function ChartsC() {
  const total = pie.reduce((a, b) => a + b.value, 0);
  const gradientStops = pie
    .reduce<{ start: number; end: number; color: string }[]>((acc, seg) => {
      const last = acc.length > 0 ? acc[acc.length - 1] : undefined;
      const start = last ? last.end : 0;
      const end = start + (seg.value / total) * 360;
      acc.push({ start, end, color: seg.color });
      return acc;
    }, [])
    .map((s) => `${s.color} ${s.start}deg ${s.end}deg`)
    .join(", ");

  return (
    <div className="h-64 flex items-center justify-center">
      <div
        className="relative w-40 h-40 rounded-full"
        style={{ background: `conic-gradient(${gradientStops})` }}
        aria-label="Channel distribution"
      >
        <div className="absolute inset-3 rounded-full bg-white dark:bg-gray-900" />
      </div>
      <div className="ml-6 space-y-2">
        {pie.map((s, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <span
              className="inline-block w-3 h-3 rounded-sm"
              style={{ backgroundColor: s.color }}
            />
            <span className="text-gray-700 dark:text-gray-300">
              {s.name}: {s.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
export default ChartsA;
