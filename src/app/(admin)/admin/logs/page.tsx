"use client";

import { useMemo, useState, useEffect } from "react";

import { Skeleton } from "@/components/ui";
import EmptyState from "@/components/common/EmptyState";

type LogEvent = {
  id: string;
  type: "webhook" | "ai" | "error";
  ts: string;
  message: string;
};

const seed: LogEvent[] = [
  {
    id: "1",
    type: "webhook",
    ts: new Date().toISOString(),
    message: "Received WhatsApp message",
  },
  {
    id: "2",
    type: "ai",
    ts: new Date().toISOString(),
    message: "LLM respond ok",
  },
  {
    id: "3",
    type: "error",
    ts: new Date().toISOString(),
    message: "Signature invalid",
  },
];

export default function LogsAdminPage() {
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [rows] = useState<LogEvent[]>(seed);

  const filtered = useMemo(
    () =>
      rows.filter(
        (r) =>
          (filter === "all" || r.type === filter) &&
          r.message.toLowerCase().includes(q.toLowerCase())
      ),
    [rows, filter, q]
  );

  return (
    <main className="p-6 grid gap-4">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-3 items-center">
        <h1 className="text-2xl font-semibold">السجلات</h1>
        <select
          className="h-10 rounded-md border px-2"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">الكل</option>
          <option value="webhook">Webhook</option>
          <option value="ai">AI</option>
          <option value="error">Errors</option>
        </select>
        <input
          className="h-10 rounded-md border px-3 w-full md:w-64"
          placeholder="بحث"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="grid gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-12" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="لا توجد سجلات"
          description="جرّب تغيير المرشحات أو التوقيت."
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead className="bg-surface dark:bg-white/5">
              <tr>
                <th className="text-start p-3">النوع</th>
                <th className="text-start p-3">الوقت</th>
                <th className="text-start p-3">الوصف</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="p-3">{r.type}</td>
                  <td className="p-3">{new Date(r.ts).toLocaleString()}</td>
                  <td className="p-3">{r.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}