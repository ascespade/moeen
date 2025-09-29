"use client";

import { useState } from "react";

type Item = { id: string; user: string; suggestion: string; createdAt: string };
const seed: Item[] = Array.from({ length: 6 }).map((_, i) => ({ id: String(i+1), user: "مرحبا كيف أبدأ؟", suggestion: "يمكنك البدء عبر النقر على زر البدء.", createdAt: new Date().toISOString() }));

export default function ReviewCenterPage() {
  const [rows] = useState<Item[]>(seed);
  const [q, setQ] = useState("");

  const filtered = rows.filter((r) => r.user.includes(q) || r.suggestion.includes(q));

  return (
    <main className="p-6 grid gap-4">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 items-center">
        <h1 className="text-2xl font-semibold">مركز المراجعة</h1>
        <input className="h-10 rounded-md border px-3 w-full md:w-64" placeholder="بحث" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-white/5">
            <tr>
              <th className="text-start p-3">رسالة المستخدم</th>
              <th className="text-start p-3">رد مُعين المقترح</th>
              <th className="text-start p-3">تاريخ</th>
              <th className="text-start p-3">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-3">{r.user}</td>
                <td className="p-3">{r.suggestion}</td>
                <td className="p-3">{new Date(r.createdAt).toLocaleString()}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <button className="h-9 rounded-md border px-3">أرشفة</button>
                    <button className="h-9 rounded-md border px-3">تحسين الرد</button>
                    <button className="h-9 rounded-md border px-3">إنشاء قاعدة</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

