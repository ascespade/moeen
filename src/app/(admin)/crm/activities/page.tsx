import { useState } from "react";

import Image from "next/image";

import { ROUTES } from "@/constants/routes";

("use client");

interface Activity {
  id: string;
  type: "call" | "meeting" | "email" | "task" | "note";
  title: string;
  description: string;
  contactId: string;
  contactName: string;
  assignedTo: string;
  dueDate: string;
  status: "pending" | "completed" | "cancelled";
  priority: "low" | "medium" | "high";
  createdAt: string;
  completedAt?: string;

const mockActivities: Activity[] = [
    id: "1",
    type: "call",
    title: "مكالمة مع أحمد العتيبي",
    description: "مناقشة متطلبات نظام إدارة المواعيد",
    contactId: "1",
    contactName: "أحمد العتيبي",
    assignedTo: "سارة أحمد",
    dueDate: "2024-01-20",
    status: "pending",
    priority: "high",
    createdAt: "2024-01-15",
  },
    id: "2",
    type: "meeting",
    title: "اجتماع مع فريق مستشفى الملك فهد",
    description: "عرض توضيحي لنظام إدارة المرضى",
    contactId: "2",
    contactName: "فاطمة السعيد",
    assignedTo: "محمد حسن",
    dueDate: "2024-01-18",
    status: "completed",
    priority: "high",
    createdAt: "2024-01-10",
    completedAt: "2024-01-18",
  },
    id: "3",
    type: "task",
    title: "إعداد عرض تقديمي للعميل",
    description: "تحضير عرض شامل لحلول إدارة المواعيد",
    contactId: "3",
    contactName: "خالد القحطاني",
    assignedTo: "نورا محمد",
    dueDate: "2024-01-25",
    status: "pending",
    priority: "medium",
    createdAt: "2024-01-12",
  },
];

export default function CRMActivitiesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const getTypeIcon = (type: Activity["type"]) => {
    switch (type) {
      case "call":
        return "📞";
      case "meeting":
        return "🤝";
      case "email":
        return "📧";
      case "task":
        return "✅";
      case "note":
        return "📝";
      default:
        return "📋";
    }
  };

  const getTypeText = (type: Activity["type"]) => {
    switch (type) {
      case "call":
        return "مكالمة";
      case "meeting":
        return "اجتماع";
      case "email":
        return "بريد إلكتروني";
      case "task":
        return "مهمة";
      case "note":
        return "ملاحظة";
      default:
        return "نشاط";
    }
  };

  const getStatusColor = (status: Activity["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-surface text-gray-800";
    }
  };

  const getStatusText = (status: Activity["status"]) => {
    switch (status) {
      case "pending":
        return "معلق";
      case "completed":
        return "مكتمل";
      case "cancelled":
        return "ملغي";
      default:
        return "غير محدد";
    }
  };

  const getPriorityColor = (priority: Activity["priority"]) => {
    switch (priority) {
      case "high":
        return "text-brand-error";
      case "medium":
        return "text-yellow-600";
      case "low":
        return "text-brand-success";
      default:
        return "text-gray-600";
    }
  };

  const getPriorityText = (priority: Activity["priority"]) => {
    switch (priority) {
      case "high":
        return "عالي";
      case "medium":
        return "متوسط";
      case "low":
        return "منخفض";
      default:
        return "غير محدد";
    }
  };

  const filteredActivities = mockActivities.filter((activity) => {
    const matchesSearch =
      activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.contactName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      selectedType === "all" || activity.type === selectedType;
    const matchesStatus =
      selectedStatus === "all" || activity.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

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
                <h1 className="text-brand text-2xl font-bold">إدارة الأنشطة</h1>
                <p className="text-gray-600 dark:text-gray-300">
                  تتبع المهام والاجتماعات والمكالمات
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex rounded-lg border border-gray-300">
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-2 text-sm ${viewMode === "list" ? "bg-[var(--brand-primary)] text-white" : "text-gray-600"}`}
                >
                  قائمة
                </button>
                <button
                  onClick={() => setViewMode("calendar")}
                  className={`px-3 py-2 text-sm ${viewMode === "calendar" ? "bg-[var(--brand-primary)] text-white" : "text-gray-600"}`}
                >
                  تقويم
                </button>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-brand rounded-lg px-6 py-2 text-white transition-colors hover:bg-[var(--brand-primary-hover)]"
              >
                إضافة نشاط
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container-app py-8">
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="card p-6 text-center">
            <div className="mb-2 text-3xl font-bold text-brand-primary">
              {mockActivities.length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              إجمالي الأنشطة
            </div>
          </div>
          <div className="card p-6 text-center">
            <div className="mb-2 text-3xl font-bold text-brand-success">
              {mockActivities.filter((a) => a.status === "completed").length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">مكتملة</div>
          </div>
          <div className="card p-6 text-center">
            <div className="mb-2 text-3xl font-bold text-yellow-600">
              {mockActivities.filter((a) => a.status === "pending").length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">معلقة</div>
          </div>
          <div className="card p-6 text-center">
            <div className="mb-2 text-3xl font-bold text-brand-error">
              {mockActivities.filter((a) => a.priority === "high").length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">أولوية عالية</div>
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
                placeholder="ابحث في الأنشطة..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                النوع
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
              >
                <option value="all">جميع الأنواع</option>
                <option value="call">مكالمة</option>
                <option value="meeting">اجتماع</option>
                <option value="email">بريد إلكتروني</option>
                <option value="task">مهمة</option>
                <option value="note">ملاحظة</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                الحالة
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
              >
                <option value="all">جميع الحالات</option>
                <option value="pending">معلق</option>
                <option value="completed">مكتمل</option>
                <option value="cancelled">ملغي</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="btn-brand w-full rounded-lg py-2 text-white transition-colors hover:bg-[var(--brand-primary-hover)]">
                تطبيق الفلاتر
              </button>
            </div>
          </div>
        </div>

        {viewMode === "list" ? (
          <div className="space-y-4">
            {filteredActivities.map((activity) => (
              <div
                key={activity.id}
                className="card hover:shadow-soft p-6 transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="text-2xl">{getTypeIcon(activity.type)}</div>
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {activity.title}
                      </h3>
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${getStatusColor(activity.status)}`}
                      >
                        {getStatusText(activity.status)}
                      </span>
                      <span
                        className={`text-xs font-medium ${getPriorityColor(activity.priority)}`}
                      >
                        {getPriorityText(activity.priority)}
                      </span>
                    </div>
                    <p className="mb-3 text-gray-600 dark:text-gray-300">
                      {activity.description}
                    </p>
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <span>جهة الاتصال: {activity.contactName}</span>
                      <span>المكلف: {activity.assignedTo}</span>
                      <span>تاريخ الاستحقاق: {activity.dueDate}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="rounded bg-[var(--brand-primary)] px-3 py-1 text-sm text-white transition-colors hover:bg-[var(--brand-primary-hover)]">
                      عرض
                    </button>
                    <button className="rounded border border-gray-300 px-3 py-1 text-sm text-gray-700 transition-colors hover:bg-surface">
                      تعديل
                    </button>
                    {activity.status === "pending" && (
                      <button className="rounded bg-brand-success px-3 py-1 text-sm text-white transition-colors hover:bg-green-700">
                        إكمال
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-6">
            <h3 className="mb-4 text-lg font-semibold">عرض التقويم</h3>
            <div className="rounded-lg bg-surface p-8 text-center dark:bg-gray-800">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
                <span className="text-2xl">📅</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                عرض التقويم قيد التطوير
              </p>
            </div>
          </div>
        )}

        {filteredActivities.length === 0 && (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-surface">
              <span className="text-4xl">📋</span>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              لا توجد أنشطة
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              لا توجد أنشطة مطابقة للفلتر المحدد
            </p>
          </div>
        )}
      </main>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 dark:bg-gray-900">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-semibold">إضافة نشاط جديد</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  عنوان النشاط
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                  placeholder="أدخل عنوان النشاط"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  الوصف
                </label>
                <textarea
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                  placeholder="أدخل وصف النشاط"
                ></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    النوع
                  </label>
                  <select className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]">
                    <option value="call">مكالمة</option>
                    <option value="meeting">اجتماع</option>
                    <option value="email">بريد إلكتروني</option>
                    <option value="task">مهمة</option>
                    <option value="note">ملاحظة</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    الأولوية
                  </label>
                  <select className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]">
                    <option value="low">منخفض</option>
                    <option value="medium">متوسط</option>
                    <option value="high">عالي</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    جهة الاتصال
                  </label>
                  <select className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]">
                    <option value="">اختر جهة الاتصال</option>
                    <option value="1">أحمد العتيبي</option>
                    <option value="2">فاطمة السعيد</option>
                    <option value="3">خالد القحطاني</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    تاريخ الاستحقاق
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-surface"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="btn-brand flex-1 rounded-lg py-2 text-white transition-colors hover:bg-[var(--brand-primary-hover)]"
                >
                  إضافة النشاط
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
