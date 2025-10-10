"use client";

import { useState } from "react";
import Image from "next/image";

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  createdAt: string;
}

const mockRoles: Role[] = [
  {
    id: "1",
    name: "مدير النظام",
    description: "صلاحيات كاملة لإدارة النظام",
    permissions: ["users", "settings", "reports", "analytics", "roles"],
    userCount: 2,
    createdAt: "2024-01-01"
  },
  {
    id: "2",
    name: "مدير الرعاية الصحية",
    description: "إدارة وحدة الرعاية الصحية",
    permissions: ["patients", "appointments", "sessions", "claims"],
    userCount: 5,
    createdAt: "2024-01-01"
  },
  {
    id: "3",
    name: "طبيب",
    description: "إدارة المرضى والمواعيد",
    permissions: ["patients", "appointments", "sessions"],
    userCount: 12,
    createdAt: "2024-01-01"
  },
  {
    id: "4",
    name: "ممرض",
    description: "إدارة الجلسات والمرضى",
    permissions: ["sessions", "patients"],
    userCount: 8,
    createdAt: "2024-01-01"
  }
];

const allPermissions = [
  { id: "users", name: "إدارة المستخدمين" },
  { id: "settings", name: "الإعدادات" },
  { id: "reports", name: "التقارير" },
  { id: "analytics", name: "التحليلات" },
  { id: "roles", name: "إدارة الأدوار" },
  { id: "patients", name: "إدارة المرضى" },
  { id: "appointments", name: "إدارة المواعيد" },
  { id: "sessions", name: "إدارة الجلسات" },
  { id: "claims", name: "إدارة المطالبات" },
  { id: "contacts", name: "إدارة جهات الاتصال" },
  { id: "leads", name: "إدارة العملاء المحتملين" },
  { id: "deals", name: "إدارة الصفقات" },
  { id: "activities", name: "إدارة الأنشطة" },
  { id: "chatbot", name: "إدارة الشات بوت" },
  { id: "templates", name: "إدارة القوالب" }
];

export default function RolesPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  return (
    <div className="min-h-screen bg-[var(--brand-surface)]">
      <header className="bg-white dark:bg-gray-900 border-b border-brand sticky top-0 z-10">
        <div className="container-app py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image src="/logo.jpg" alt="مُعين" width={50} height={50} className="rounded-lg" />
              <div>
                <h1 className="text-2xl font-bold text-brand">إدارة الأدوار والصلاحيات</h1>
                <p className="text-gray-600 dark:text-gray-300">تحديد صلاحيات المستخدمين</p>
              </div>
            </div>
            <button onClick={() => setShowCreateModal(true)} className="btn-brand px-6 py-2 rounded-lg text-white hover:bg-[var(--brand-primary-hover)] transition-colors">إضافة دور</button>
          </div>
        </div>
      </header>

      <main className="container-app py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{mockRoles.length}</div>
            <div className="text-gray-600 dark:text-gray-300">إجمالي الأدوار</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{mockRoles.reduce((sum, r) => sum + r.userCount, 0)}</div>
            <div className="text-gray-600 dark:text-gray-300">إجمالي المستخدمين</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">{allPermissions.length}</div>
            <div className="text-gray-600 dark:text-gray-300">الصلاحيات المتاحة</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">4</div>
            <div className="text-gray-600 dark:text-gray-300">أدوار نشطة</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-6">الأدوار</h2>
              <div className="space-y-4">
                {mockRoles.map((role) => (
                  <div key={role.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{role.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{role.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">{role.userCount} مستخدم</span>
                        <button onClick={() => setEditingRole(role)} className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">تعديل</button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {role.permissions.map((permission) => {
                        const perm = allPermissions.find(p => p.id === permission);
                        return perm ? (
                          <span key={permission} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {perm.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-6">جميع الصلاحيات</h2>
              <div className="space-y-2">
                {allPermissions.map((permission) => (
                  <div key={permission.id} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <input type="checkbox" className="w-4 h-4 text-[var(--brand-primary)] border-gray-300 rounded focus:ring-[var(--brand-primary)]" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{permission.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">إضافة دور جديد</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">اسم الدور</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent" placeholder="أدخل اسم الدور" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">الوصف</label>
                <textarea rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent" placeholder="أدخل وصف الدور"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">الصلاحيات</label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {allPermissions.map((permission) => (
                    <div key={permission.id} className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg">
                      <input type="checkbox" className="w-4 h-4 text-[var(--brand-primary)] border-gray-300 rounded focus:ring-[var(--brand-primary)]" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{permission.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">إلغاء</button>
                <button type="submit" className="flex-1 btn-brand py-2 rounded-lg text-white hover:bg-[var(--brand-primary-hover)] transition-colors">إضافة الدور</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
