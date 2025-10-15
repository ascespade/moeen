"use client";

import { useState } from 'react';


import Image from "next/image";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: string;
  priority: "low" | "medium" | "high";
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "موعد جديد",
    message: "تم حجز موعد جديد مع المريض أحمد محمد",
    type: "info",
    read: false,
    createdAt: "2024-01-15 10:30",
    priority: "medium",
  },
  {
    id: "2",
    title: "تحديث النظام",
    message: "تم تحديث النظام بنجاح إلى الإصدار 2.1.0",
    type: "success",
    read: true,
    createdAt: "2024-01-15 09:15",
    priority: "low",
  },
  {
    id: "3",
    title: "تحذير: مساحة التخزين",
    message: "مساحة التخزين تقترب من الحد الأقصى (85%)",
    type: "warning",
    read: false,
    createdAt: "2024-01-15 08:45",
    priority: "high",
  },
  {
    id: "4",
    title: "خطأ في التكامل",
    message: "فشل في الاتصال بخدمة واتساب",
    type: "error",
    read: true,
    createdAt: "2024-01-14 16:20",
    priority: "high",
  },
];

export default function NotificationsPage() {
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const getTypeColor = (type: Notification["type"]) => {
    switch (type) {
      case "info":
        return "text-blue-600";
      case "success":
        return "text-green-600";
      case "warning":
        return "text-yellow-600";
      case "error":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getTypeIcon = (type: Notification["type"]) => {
    switch (type) {
      case "info":
        return "ℹ️";
      case "success":
        return "✅";
      case "warning":
        return "⚠️";
      case "error":
        return "❌";
      default:
        return "📢";
    }
  };

  const getPriorityColor = (priority: Notification["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredNotifications = mockNotifications.filter((notification) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "unread" && !notification.read) ||
      (filter === "read" && notification.read);
    const matchesType =
      typeFilter === "all" || notification.type === typeFilter;
    return matchesFilter && matchesType;
  });

  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-[var(--brand-surface)]">
      <header className="border-brand sticky top-0 z-10 border-b bg-white dark:bg-gray-900">
        <div className="container-app py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image
                src="/logo.png"
                alt="مُعين"
                width={50}
                height={50}
                className="rounded-lg"
              />
              <div>
                <h1 className="text-brand text-2xl font-bold">الإشعارات</h1>
                <p className="text-gray-600 dark:text-gray-300">
                  إدارة إشعارات النظام
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <button className="rounded-lg bg-blue-100 px-4 py-2 text-blue-600 transition-colors hover:bg-blue-200">
                  قراءة الكل
                </button>
              )}
              <button className="rounded-lg bg-red-100 px-4 py-2 text-red-600 transition-colors hover:bg-red-200">
                حذف الكل
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container-app py-8">
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="card p-6 text-center">
            <div className="mb-2 text-3xl font-bold text-blue-600">
              {mockNotifications.length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              إجمالي الإشعارات
            </div>
          </div>
          <div className="card p-6 text-center">
            <div className="mb-2 text-3xl font-bold text-red-600">
              {unreadCount}
            </div>
            <div className="text-gray-600 dark:text-gray-300">غير مقروءة</div>
          </div>
          <div className="card p-6 text-center">
            <div className="mb-2 text-3xl font-bold text-green-600">
              {mockNotifications.filter((n) => n.read).length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">مقروءة</div>
          </div>
          <div className="card p-6 text-center">
            <div className="mb-2 text-3xl font-bold text-yellow-600">
              {mockNotifications.filter((n) => n.priority === "high").length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">أولوية عالية</div>
          </div>
        </div>

        <div className="card mb-8 p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                فلتر الحالة
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
              >
                <option value="all">جميع الإشعارات</option>
                <option value="unread">غير مقروءة</option>
                <option value="read">مقروءة</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                فلتر النوع
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
              >
                <option value="all">جميع الأنواع</option>
                <option value="info">معلومات</option>
                <option value="success">نجاح</option>
                <option value="warning">تحذير</option>
                <option value="error">خطأ</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="btn-brand w-full rounded-lg py-2 text-white transition-colors hover:bg-[var(--brand-primary-hover)]">
                تطبيق الفلاتر
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`card hover:shadow-soft p-6 transition-shadow ${!notification.read ? "border-r-4 border-[var(--brand-primary)]" : ""}`}
            >
              <div className="flex items-start gap-4">
                <div className="text-2xl">{getTypeIcon(notification.type)}</div>
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <h3
                      className={`text-lg font-semibold ${getTypeColor(notification.type)}`}
                    >
                      {notification.title}
                    </h3>
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${getPriorityColor(notification.priority)}`}
                    >
                      {notification.priority === "high"
                        ? "عالي"
                        : notification.priority === "medium"
                          ? "متوسط"
                          : "منخفض"}
                    </span>
                    {!notification.read && (
                      <span className="h-2 w-2 rounded-full bg-[var(--brand-primary)]"></span>
                    )}
                  </div>
                  <p className="mb-3 text-gray-600 dark:text-gray-300">
                    {notification.message}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {notification.createdAt}
                    </span>
                    <div className="flex gap-2">
                      {!notification.read && (
                        <button className="rounded bg-[var(--brand-primary)] px-3 py-1 text-sm text-white transition-colors hover:bg-[var(--brand-primary-hover)]">
                          قراءة
                        </button>
                      )}
                      <button className="rounded border border-gray-300 px-3 py-1 text-sm text-gray-700 transition-colors hover:bg-gray-50">
                        حذف
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredNotifications.length === 0 && (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
              <span className="text-4xl">🔔</span>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              لا توجد إشعارات
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              لا توجد إشعارات مطابقة للفلتر المحدد
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

