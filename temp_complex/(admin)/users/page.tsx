"use client";

import { useMemo, useState, useEffect } from "react";
import EmptyState from "@/components/common/EmptyState";
import { Skeleton } from "@/components/common/Skeleton";

type UserRow = {
  id: string;
  email: string;
  role: "admin" | "staff" | "viewer";
  status: "active" | "suspended";
};

const seed: UserRow[] = [
  { id: "1", email: "admin@example.com", role: "admin", status: "active" },
  { id: "2", email: "staff@example.com", role: "staff", status: "active" },
  { id: "3", email: "viewer@example.com", role: "viewer", status: "suspended" },
];

export default function UsersAdminPage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Simple timeout for demo purposes
    const timer = setTimeout(() => setLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<UserRow[]>(seed);
  const filtered = useMemo(
    () => rows.filter((r) => r.email.includes(q)),
    [rows, q],
  );

  function updateRole(id: string, role: UserRow["role"]) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, role } : r)));
  }

  function toggleStatus(id: string) {
    setRows((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: r.status === "active" ? "suspended" : "active" }
          : r,
      ),
    );
  }

  return (
    <main className="mx-auto grid max-w-screen-xl gap-4 p-6">
      <div className="grid grid-cols-1 items-center gap-3 md:grid-cols-2">
    <main className="max-w-screen-xl mx-auto p-6 grid gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          المستخدمون والأدوار
        </h1>
        <div className="justify-self-end">
          <input
            className="h-10 w-full rounded-md border border-gray-200 bg-white px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 md:w-64 dark:border-gray-800 dark:bg-gray-900"
            className="h-10 rounded-md border border-gray-200 dark:border-gray-800 px-3 w-full md:w-64 bg-white dark:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="بحث بالبريد"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="grid gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-12" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="لا يوجد مستخدمون"
          description="أضف أعضاء جدد لبدء العمل."
          cta={
            <button className="h-9 rounded-md border border-gray-200 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-800">
            <button className="h-9 rounded-md border border-gray-200 dark:border-gray-800 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500">
              دعوة عضو
            </button>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-white/5">
              <tr>
                <th className="p-3 text-start">البريد</th>
                <th className="p-3 text-start">الدور</th>
                <th className="p-3 text-start">الحالة</th>
                <th className="p-3 text-start">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr
                  key={r.id}
                  className="border-t border-gray-200 dark:border-gray-800"
                >
                  <td className="p-3">{r.email}</td>
                  <td className="p-3">
                    <select
                      className="bg_white h-9 rounded-md border border-gray-200 px-2 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-800 dark:bg-gray-900"
                      className="h-9 rounded-md border border-gray-200 dark:border-gray-800 px-2 bg_white dark:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={r.role}
                      onChange={(e) =>
                        updateRole(r.id, e.target.value as UserRow["role"])
                      }
                    >
                      <option value="admin">Admin</option>
                      <option value="staff">Staff</option>
                      <option value="viewer">Viewer</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <span
                      className={`rounded px-2 py-1 text-xs ${r.status === "active" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200" : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200"}`}
                      className={`px-2 py-1 rounded text-xs ${r.status === "active" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200" : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200"}`}
                    >
                      {r.status === "active" ? "نشط" : "معلّق"}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <button
                        className="h-9 rounded-md border border-gray-200 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-800"
                        className="h-9 rounded-md border border-gray-200 dark:border-gray-800 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        onClick={() => toggleStatus(r.id)}
                      >
                        {r.status === "active" ? "تعليق" : "تفعيل"}
                      </button>
                      <button className="h-9 rounded-md border border-gray-200 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-800">
                      <button className="h-9 rounded-md border border-gray-200 dark:border-gray-800 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500">
                        إرسال دعوة
                      </button>
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
