"use client";

import { useMemo, useState, useEffect } from "react";

import EmptyState from "@/components/common/EmptyState";
import { Skeleton } from "@/components/ui";

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<UserRow[]>(seed);
  const filtered = useMemo(
    () => rows.filter((r) => r.email.includes(q)),
    [rows, q],
  );

  function updateRole(id: string, role: UserRow["role"]) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, role } : r)));

  function toggleStatus(id: string) {
    setRows((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: r.status === "active" ? "suspended" : "active" }
          : r,
      ),
    );

  return (
    <main className="min-h-screen bg-[var(--brand-surface)]">
      <div className="container-app py-6">
        <div className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
            <h1 className="text-2xl font-semibold text-[var(--foreground)]">
              المستخدمون والأدوار
            </h1>
            <div className="justify-self-end">
              <input
                className="form-input w-full md:w-64"
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
              cta={<button className="btn btn-outline btn-sm">دعوة عضو</button>}
            />
          ) : (
            <div className="overflow-x-auto card">
              <table className="w-full text-sm">
                <thead className="bg-[var(--brand-surface)]">
                  <tr>
                    <th className="text-start p-3 text-[var(--foreground)]">
                      البريد
                    </th>
                    <th className="text-start p-3 text-[var(--foreground)]">
                      الدور
                    </th>
                    <th className="text-start p-3 text-[var(--foreground)]">
                      الحالة
                    </th>
                    <th className="text-start p-3 text-[var(--foreground)]">
                      إجراءات
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr
                      key={r.id}
                      className="border-t border-[var(--brand-border)]"
                    >
                      <td className="p-3 text-[var(--foreground)]">
                        {r.email}
                      </td>
                      <td className="p-3">
                        <select
                          className="form-input"
                          value={r.role}
                          onChange={(e) =>
                            updateRole(r.id, e.target.value as UserRow["role"])
                        >
                          <option value="admin">Admin</option>
                          <option value="staff">Staff</option>
                          <option value="viewer">Viewer</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <span
                          className={`badge ${r.status === "active" ? "badge-success" : "badge-error"}`}
                        >
                          {r.status === "active" ? "نشط" : "معلّق"}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => toggleStatus(r.id)}
                          >
                            {r.status === "active" ? "تعليق" : "تفعيل"}
                          </button>
                          <button className="btn btn-outline btn-sm">
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
        </div>
      </div>
    </main>
  );
}}}}
