import React from "react";

'use client';

import { useState } from 'react';

type Item = { id: string; user: string; suggestion: string; createdAt: string };
const seed: Item[] = Array.from({ length: 6 }).map((_, i) => ({ id: String(i + 1), user: 'مرحبا كيف أبدأ؟', suggestion: 'يمكنك البدء عبر النقر على زر البدء.', createdAt: new Date().toISOString() }));

export default function ReviewCenterPage() {
  const [rows] = useState<Item[]>(seed);
  const [q, setQ] = useState('');

  const filtered = rows.filter((r) => r.user.includes(q) || r.suggestion.includes(q));

  return (
    <main className="min-h-screen bg-[var(--brand-surface)]">
      <div className="container-app py-6">
        <div className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 items-center">
            <h1 className="text-2xl font-semibold text-[var(--foreground)]">مركز المراجعة</h1>
            <input className="form-input w-full md:w-64" placeholder="بحث" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>

          <div className="overflow-x-auto card">
            <table className="w-full text-sm">
              <thead className="bg-[var(--brand-surface)]">
                <tr>
                  <th className="text-start p-3 text-[var(--foreground)]">رسالة المستخدم</th>
                  <th className="text-start p-3 text-[var(--foreground)]">رد مُعين المقترح</th>
                  <th className="text-start p-3 text-[var(--foreground)]">تاريخ</th>
                  <th className="text-start p-3 text-[var(--foreground)]">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="border-t border-[var(--brand-border)]">
                    <td className="p-3 text-[var(--foreground)]">{r.user}</td>
                    <td className="p-3 text-[var(--foreground)]">{r.suggestion}</td>
                    <td className="p-3 text-[var(--foreground)]/60">{new Date(r.createdAt).toLocaleString()}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <button className="btn btn-outline btn-sm">أرشفة</button>
                        <button className="btn btn-outline btn-sm">تحسين الرد</button>
                        <button className="btn btn-outline btn-sm">إنشاء قاعدة</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}

