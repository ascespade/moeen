"use client";

import { useState } from "react";
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
    priority: "medium"
  },
  {
    id: "2",
    title: "تحديث النظام",
    message: "تم تحديث النظام بنجاح إلى الإصدار 2.1.0",
    type: "success",
    read: true,
    createdAt: "2024-01-15 09:15",
    priority: "low"
  },
  {
    id: "3",
    title: "تحذير: مساحة التخزين",
    message: "مساحة التخزين تقترب من الحد الأقصى (85%)",
    type: "warning",
    read: false,
    createdAt: "2024-01-15 08:45",
    priority: "high"
  },
  {
    id: "4",
    title: "خطأ في التكامل",
    message: "فشل في الاتصال بخدمة واتساب",
    type: "error",
    read: true,
    createdAt: "2024-01-14 16:20",
    priority: "high"
  }
];

export default function NotificationsPage() {
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const getTypeColor = (type: Notification["type"]) => {
    switch (type) {
      case "info": return "text-blue-600";
      case "success": return "text-green-600";
      case "warning": return "text-yellow-600";
      case "error": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getTypeIcon = (type: Notification["type"]) => {
    switch (type) {
      case "info": return "ℹ️";
      case "success": return "✅";
      case "warning": return "⚠️";
      case "error": return "❌";
      default: return "📢";
    }
  };

  const getPriorityColor = (priority: Notification["priority"]) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredNotifications = mockNotifications.filter(notification => {
    const matchesFilter = filter === "all" || 
                         (filter === "unread" && !notification.read) ||
                         (filter === "read" && notification.read);
    const matchesType = typeFilter === "all" || notification.type === typeFilter;
    return matchesFilter && matchesType;
  });

  const unreadCount = mockNotifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-[var(--brand-surface)]">
      <header className="bg-white dark:bg-gray-900 border-b border-brand sticky top-0 z-10">
        <div className="container-app py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image src="/logo.jpg" alt="مُعين" width={50} height={50} className="rounded-lg" />
              <div>
                <h1 className="text-2xl font-bold text-brand">الإشعارات</h1>
                <p className="text-gray-600 dark:text-gray-300">إدارة إشعارات النظام</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <button className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                  قراءة الكل
                </button>
              )}
              <button className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
                حذف الكل
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container-app py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{mockNotifications.length}</div>
            <div className="text-gray-600 dark:text-gray-300">إجمالي الإشعارات</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">{unreadCount}</div>
            <div className="text-gray-600 dark:text-gray-300">غير مقروءة</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{mockNotifications.filter(n => n.read).length}</div>
            <div className="text-gray-600 dark:text-gray-300">مقروءة</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">{mockNotifications.filter(n => n.priority === "high").length}</div>
            <div className="text-gray-600 dark:text-gray-300">أولوية عالية</div>
          </div>
        </div>

        <div className="card p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">فلتر الحالة</label>
              <select value={filter} onChange={(e) => setFilter(e.target.value as any)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent">
                <option value="all">جميع الإشعارات</option>
                <option value="unread">غير مقروءة</option>
                <option value="read">مقروءة</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">فلتر النوع</label>
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent">
                <option value="all">جميع الأنواع</option>
                <option value="info">معلومات</option>
                <option value="success">نجاح</option>
                <option value="warning">تحذير</option>
                <option value="error">خطأ</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="w-full btn-brand py-2 rounded-lg text-white hover:bg-[var(--brand-primary-hover)] transition-colors">تطبيق الفلاتر</button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <div key={notification.id} className={`card p-6 hover:shadow-soft transition-shadow ${!notification.read ? 'border-r-4 border-[var(--brand-primary)]' : ''}`}>
              <div className="flex items-start gap-4">
                <div className="text-2xl">{getTypeIcon(notification.type)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className={`text-lg font-semibold ${getTypeColor(notification.type)}`}>{notification.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(notification.priority)}`}>
                      {notification.priority === "high" ? "عالي" : notification.priority === "medium" ? "متوسط" : "منخفض"}
                    </span>
                    {!notification.read && <span className="w-2 h-2 bg-[var(--brand-primary)] rounded-full"></span>}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-3">{notification.message}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{notification.createdAt}</span>
                    <div className="flex gap-2">
                      {!notification.read && (
                        <button className="px-3 py-1 bg-[var(--brand-primary)] text-white text-sm rounded hover:bg-[var(--brand-primary-hover)] transition-colors">قراءة</button>
                      )}
                      <button className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50 transition-colors">حذف</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredNotifications.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"><span className="text-4xl">🔔</span></div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">لا توجد إشعارات</h3>
            <p className="text-gray-600 dark:text-gray-300">لا توجد إشعارات مطابقة للفلتر المحدد</p>
          </div>
        )}
      </main>
    </div>
  );
}
