"use client";

import { useState } from 'react';


import Image from "next/image";

interface AuditLog {
  id: string;
  user: string;
  action: string;
  resource: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  status: "success" | "failed" | "warning";
}

const mockAuditLogs: AuditLog[] = [
  {
    id: "1",
    user: "أحمد العتيبي",
    action: "تسجيل دخول",
    resource: "نظام المصادقة",
    details: "تم تسجيل الدخول بنجاح",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    timestamp: "2024-01-15 10:30:25",
    status: "success",
  },
  {
    id: "2",
    user: "سارة أحمد",
    action: "إنشاء موعد",
    resource: "نظام المواعيد",
    details: "تم إنشاء موعد جديد للمريض محمد السعد",
    ipAddress: "192.168.1.101",
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    timestamp: "2024-01-15 10:25:15",
    status: "success",
  },
  {
    id: "3",
    user: "خالد القحطاني",
    action: "تحديث بيانات المريض",
    resource: "نظام المرضى",
    details: "تم تحديث معلومات المريض فاطمة العتيبي",
    ipAddress: "192.168.1.102",
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15",
    timestamp: "2024-01-15 10:20:45",
    status: "success",
  },
  {
    id: "4",
    user: "نورا محمد",
    action: "محاولة تسجيل دخول",
    resource: "نظام المصادقة",
    details: "فشل في تسجيل الدخول - كلمة مرور خاطئة",
    ipAddress: "192.168.1.103",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    timestamp: "2024-01-15 10:15:30",
    status: "failed",
  },
  {
    id: "5",
    user: "محمد حسن",
    action: "حذف رسالة",
    resource: "نظام الرسائل",
    details: "تم حذف رسالة واتساب للمريض أحمد محمد",
    ipAddress: "192.168.1.104",
    userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
    timestamp: "2024-01-15 10:10:20",
    status: "success",
  },
];

export default function AuditLogsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("today");

  const getStatusColor = (status: AuditLog["status"]) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: AuditLog["status"]) => {
    switch (status) {
      case "success":
        return "نجح";
      case "failed":
        return "فشل";
      case "warning":
        return "تحذير";
      default:
        return "غير محدد";
    }
  };

  const getActionIcon = (action: string) => {
    if (action.includes("تسجيل دخول")) return "🔐";
    if (action.includes("إنشاء")) return "➕";
    if (action.includes("تحديث")) return "✏️";
    if (action.includes("حذف")) return "🗑️";
    if (action.includes("عرض")) return "👁️";
    return "📋";
  };

  const filteredLogs = mockAuditLogs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || log.status === statusFilter;
    const matchesAction =
      actionFilter === "all" || log.action.includes(actionFilter);
    return matchesSearch && matchesStatus && matchesAction;
  });

  const allActions = Array.from(
    new Set(mockAuditLogs.map((log) => log.action.split(" ")[0])),
  );

  return (
    <div className="min-h-screen bg-[var(--brand-surface)]">
      <header className="border-brand sticky top-0 z-10 border-b bg-white dark:bg-gray-900">
        <div className="container-app py-6">
          <div className="flex items-center gap-4">
            <Image
              src="/logo.png"
              alt="مُعين"
              width={50}
              height={50}
              className="rounded-lg"
            />
            <div>
              <h1 className="text-brand text-2xl font-bold">سجل التدقيق</h1>
              <p className="text-gray-600 dark:text-gray-300">
                تتبع جميع أنشطة النظام
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container-app py-8">
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="card p-6 text-center">
            <div className="mb-2 text-3xl font-bold text-blue-600">
              {mockAuditLogs.length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              إجمالي السجلات
            </div>
          </div>
          <div className="card p-6 text-center">
            <div className="mb-2 text-3xl font-bold text-green-600">
              {mockAuditLogs.filter((l) => l.status === "success").length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">نجح</div>
          </div>
          <div className="card p-6 text-center">
            <div className="mb-2 text-3xl font-bold text-red-600">
              {mockAuditLogs.filter((l) => l.status === "failed").length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">فشل</div>
          </div>
          <div className="card p-6 text-center">
            <div className="mb-2 text-3xl font-bold text-yellow-600">
              {mockAuditLogs.filter((l) => l.status === "warning").length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">تحذير</div>
          </div>
        </div>

        <div className="card mb-8 p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                البحث
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث في السجلات..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                الحالة
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
              >
                <option value="all">جميع الحالات</option>
                <option value="success">نجح</option>
                <option value="failed">فشل</option>
                <option value="warning">تحذير</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                نوع الإجراء
              </label>
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
              >
                <option value="all">جميع الإجراءات</option>
                {allActions.map((action) => (
                  <option key={action} value={action}>
                    {action}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button className="btn-brand w-full rounded-lg py-2 text-white transition-colors hover:bg-[var(--brand-primary-hover)]">
                تطبيق الفلاتر
              </button>
            </div>
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    المستخدم
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    الإجراء
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    المورد
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    التفاصيل
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    الحالة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    الوقت
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    IP
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                {filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center">
                        <div className="ml-3 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--brand-primary)] text-sm font-semibold text-white">
                          {log.user.charAt(0)}
                        </div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {log.user}
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {getActionIcon(log.action)}
                        </span>
                        <span className="text-sm text-gray-900 dark:text-white">
                          {log.action}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {log.resource}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs truncate text-sm text-gray-600 dark:text-gray-300">
                        {log.details}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${getStatusColor(log.status)}`}
                      >
                        {getStatusText(log.status)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {log.timestamp}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="font-mono text-sm text-gray-500">
                        {log.ipAddress}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredLogs.length === 0 && (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
              <span className="text-4xl">📋</span>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              لا توجد سجلات
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              لا توجد سجلات مطابقة للفلتر المحدد
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
