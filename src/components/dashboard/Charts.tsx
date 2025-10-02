"use client";

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

const data = Array.from({ length: 7 }).map((_, i) => ({ day: `D${i + 1}`, messages: Math.round(50 + Math.random() * 100), conversations: Math.round(5 + Math.random() * 20) }));
const pie = [
  { name: "WhatsApp", value: 60 },
  { name: "Web", value: 30 },
  { name: "Other", value: 10 },
];
const colors = ["#16a34a", "#2563eb", "#f59e0b"];

export function ChartsA() {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="messages" stroke="#2563eb" strokeWidth={2} />
          <Line type="monotone" dataKey="conversations" stroke="#16a34a" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ChartsB() {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="messages" fill="#16a34a" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ChartsPie() {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={pie} innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value" nameKey="name">
            {pie.map((_, i) => (
              <Cell key={i} fill={colors[i % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}