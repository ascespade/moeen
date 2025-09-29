"use client";

import { useMemo, useState, useEffect } from "react";
import EmptyState from "@/components/common/EmptyState";
import { Skeleton } from "@/components/common/Skeleton";

type UserRow = { id: string; email: string; role: "admin" | "staff" | "viewer"; status: "active" | "suspended" };

const seed: UserRow[] = [
  { id: "1", email: "admin@example.com", role: "admin", status: "active" },
  { id: "2", email: "staff@example.com", role: "staff", status: "active" },
  { id: "3", email: "viewer@example.com", role: "viewer", status: "suspended" },
];

export default function UsersAdminPage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 400); return () => clearTimeout(t); }, []);
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<UserRow[]>(seed);
  const filtered = useMemo(() => rows.filter((r) => r.email.includes(q)), [rows, q]);

  function updateRole(id: string, role: UserRow["role"]) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, role } : r)));
  }

  function toggleStatus(id: string) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: r.status === "active" ? "suspended" : "active" } : r)));
  }

  return (
    <main className="p-6 grid gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
        <h1 className="text-2xl font-semibold">المستخدمون والأدوار</h1>
        <div className="justify-self-end">
          <input className="h-10 rounded-md border px-3 w-full md:w-64" placeholder="بحث بالبريد" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      {loading ? (
        <div className="grid gap-2">
          {Array.from({ length: 6 }).map((_, i) => (<Skeleton key={i} className="h-12" />))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState title="لا يوجد مستخدمون" description="أضف أعضاء جدد لبدء العمل." cta={<button className=\"h-9 rounded-md border px-3\">دعوة عضو</button>} />
      ) : (
      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-white/5">
            <tr>
              <th className="text-start p-3">البريد</th>
              <th className="text-start p-3">الدور</th>
              <th className="text-start p-3">الحالة</th>
              <th className="text-start p-3">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-3">{r.email}</td>
                <td className="p-3">
                  <select className="h-9 rounded-md border px-2" value={r.role} onChange={(e) => updateRole(r.id, e.target.value as UserRow["role"]) }>
                    <option value="admin">Admin</option>
                    <option value="staff">Staff</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs ${r.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"}`}>{r.status === "active" ? "نشط" : "معلّق"}</span>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <button className="h-9 rounded-md border px-3" onClick={() => toggleStatus(r.id)}>{r.status === "active" ? "تعليق" : "تفعيل"}</button>
                    <button className="h-9 rounded-md border px-3">إرسال دعوة</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
    </main>
  );
}

