"use client";

import { useState } from "react";
import Image from "next/image";
import { ROUTES } from "@/constants/routes";

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
}

const mockActivities: Activity[] = [
  {
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
    createdAt: "2024-01-15"
  },
  {
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
    completedAt: "2024-01-18"
  },
  {
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
    createdAt: "2024-01-12"
  }
];

export default function CRMActivitiesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const getTypeIcon = (type: Activity["type"]) => {
    switch (type) {
      case "call": return "📞";
      case "meeting": return "🤝";
      case "email": return "📧";
      case "task": return "✅";
      case "note": return "📝";
      default: return "📋";
    }
  };

  const getTypeText = (type: Activity["type"]) => {
    switch (type) {
      case "call": return "مكالمة";
      case "meeting": return "اجتماع";
      case "email": return "بريد إلكتروني";
      case "task": return "مهمة";
      case "note": return "ملاحظة";
      default: return "نشاط";
    }
  };

  const getStatusColor = (status: Activity["status"]) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "completed": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: Activity["status"]) => {
    switch (status) {
      case "pending": return "معلق";
      case "completed": return "مكتمل";
      case "cancelled": return "ملغي";
      default: return "غير محدد";
    }
  };

  const getPriorityColor = (priority: Activity["priority"]) => {
    switch (priority) {
      case "high": return "text-red-600";
      case "medium": return "text-yellow-600";
      case "low": return "text-green-600";
      default: return "text-gray-600";
    }
  };

  const getPriorityText = (priority: Activity["priority"]) => {
    switch (priority) {
      case "high": return "عالي";
      case "medium": return "متوسط";
      case "low": return "منخفض";
      default: return "غير محدد";
    }
  };

  const filteredActivities = mockActivities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.contactName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || activity.type === selectedType;
    const matchesStatus = selectedStatus === "all" || activity.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[var(--brand-surface)]">
      <header className="bg-white dark:bg-gray-900 border-b border-brand sticky top-0 z-10">
        <div className="container-app py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image src="/logo.jpg" alt="مُعين" width={50} height={50} className="rounded-lg" />
              <div>
                <h1 className="text-2xl font-bold text-brand">إدارة الأنشطة</h1>
                <p className="text-gray-600 dark:text-gray-300">تتبع المهام والاجتماعات والمكالمات</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex border border-gray-300 rounded-lg">
                <button onClick={() => setViewMode("list")} className={`px-3 py-2 text-sm ${viewMode === "list" ? "bg-[var(--brand-primary)] text-white" : "text-gray-600"}`}>قائمة</button>
                <button onClick={() => setViewMode("calendar")} className={`px-3 py-2 text-sm ${viewMode === "calendar" ? "bg-[var(--brand-primary)] text-white" : "text-gray-600"}`}>تقويم</button>
              </div>
              <button onClick={() => setShowCreateModal(true)} className="btn-brand px-6 py-2 rounded-lg text-white hover:bg-[var(--brand-primary-hover)] transition-colors">إضافة نشاط</button>
            </div>
          </div>
        </div>
      </header>

      <main className="container-app py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{mockActivities.length}</div>
            <div className="text-gray-600 dark:text-gray-300">إجمالي الأنشطة</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{mockActivities.filter(a => a.status === "completed").length}</div>
            <div className="text-gray-600 dark:text-gray-300">مكتملة</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">{mockActivities.filter(a => a.status === "pending").length}</div>
            <div className="text-gray-600 dark:text-gray-300">معلقة</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">{mockActivities.filter(a => a.priority === "high").length}</div>
            <div className="text-gray-600 dark:text-gray-300">أولوية عالية</div>
          </div>
        </div>

        <div className="card p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">البحث</label>
              <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="ابحث في الأنشطة..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">النوع</label>
              <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent">
                <option value="all">جميع الأنواع</option>
                <option value="call">مكالمة</option>
                <option value="meeting">اجتماع</option>
                <option value="email">بريد إلكتروني</option>
                <option value="task">مهمة</option>
                <option value="note">ملاحظة</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">الحالة</label>
              <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent">
                <option value="all">جميع الحالات</option>
                <option value="pending">معلق</option>
                <option value="completed">مكتمل</option>
                <option value="cancelled">ملغي</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="w-full btn-brand py-2 rounded-lg text-white hover:bg-[var(--brand-primary-hover)] transition-colors">تطبيق الفلاتر</button>
            </div>
          </div>
        </div>

        {viewMode === "list" ? (
          <div className="space-y-4">
            {filteredActivities.map((activity) => (
              <div key={activity.id} className="card p-6 hover:shadow-soft transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="text-2xl">{getTypeIcon(activity.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{activity.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(activity.status)}`}>{getStatusText(activity.status)}</span>
                      <span className={`text-xs font-medium ${getPriorityColor(activity.priority)}`}>{getPriorityText(activity.priority)}</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-3">{activity.description}</p>
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <span>جهة الاتصال: {activity.contactName}</span>
                      <span>المكلف: {activity.assignedTo}</span>
                      <span>تاريخ الاستحقاق: {activity.dueDate}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-[var(--brand-primary)] text-white text-sm rounded hover:bg-[var(--brand-primary-hover)] transition-colors">عرض</button>
                    <button className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50 transition-colors">تعديل</button>
                    {activity.status === "pending" && (
                      <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors">إكمال</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">عرض التقويم</h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📅</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300">عرض التقويم قيد التطوير</p>
            </div>
          </div>
        )}

        {filteredActivities.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"><span className="text-4xl">📋</span></div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">لا توجد أنشطة</h3>
            <p className="text-gray-600 dark:text-gray-300">لا توجد أنشطة مطابقة للفلتر المحدد</p>
          </div>
        )}
      </main>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">إضافة نشاط جديد</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">عنوان النشاط</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent" placeholder="أدخل عنوان النشاط" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">الوصف</label>
                <textarea rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent" placeholder="أدخل وصف النشاط"></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">النوع</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent">
                    <option value="call">مكالمة</option>
                    <option value="meeting">اجتماع</option>
                    <option value="email">بريد إلكتروني</option>
                    <option value="task">مهمة</option>
                    <option value="note">ملاحظة</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">الأولوية</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent">
                    <option value="low">منخفض</option>
                    <option value="medium">متوسط</option>
                    <option value="high">عالي</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">جهة الاتصال</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent">
                    <option value="">اختر جهة الاتصال</option>
                    <option value="1">أحمد العتيبي</option>
                    <option value="2">فاطمة السعيد</option>
                    <option value="3">خالد القحطاني</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">تاريخ الاستحقاق</label>
                  <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent" />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">إلغاء</button>
                <button type="submit" className="flex-1 btn-brand py-2 rounded-lg text-white hover:bg-[var(--brand-primary-hover)] transition-colors">إضافة النشاط</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
