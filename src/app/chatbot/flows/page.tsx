"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

interface Flow {
  id: string;
  name: string;
  description: string;
  status: "draft" | "published" | "archived";
  createdAt: string;
  updatedAt: string;
  tags: string[];
  messageCount: number;
  lastUsed?: string;
}

const mockFlows: Flow[] = [
  {
    id: "1",
    name: "استقبال المرضى",
    description: "تدفق ترحيب واستقبال المرضى الجدد",
    status: "published",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-15",
    tags: ["ترحيب", "استقبال"],
    messageCount: 12,
    lastUsed: "2024-01-15"
  },
  {
    id: "2",
    name: "حجز المواعيد",
    description: "مساعدة المرضى في حجز المواعيد",
    status: "published",
    createdAt: "2024-01-08",
    updatedAt: "2024-01-12",
    tags: ["مواعيد", "حجز"],
    messageCount: 8,
    lastUsed: "2024-01-14"
  },
  {
    id: "3",
    name: "استفسارات عامة",
    description: "الرد على الاستفسارات العامة حول الخدمات",
    status: "draft",
    createdAt: "2024-01-12",
    updatedAt: "2024-01-13",
    tags: ["استفسارات", "خدمات"],
    messageCount: 5
  },
  {
    id: "4",
    name: "تأكيد المواعيد",
    description: "تأكيد المواعيد قبل 24 ساعة",
    status: "archived",
    createdAt: "2024-01-05",
    updatedAt: "2024-01-10",
    tags: ["تأكيد", "مواعيد"],
    messageCount: 3
  }
];

export default function ChatbotFlowsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const getStatusColor = (status: Flow["status"]) => {
    switch (status) {
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "published":
        return "bg-green-100 text-green-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: Flow["status"]) => {
    switch (status) {
      case "draft":
        return "مسودة";
      case "published":
        return "منشور";
      case "archived":
        return "مؤرشف";
      default:
        return "غير محدد";
    }
  };

  const allTags = Array.from(new Set(mockFlows.flatMap(flow => flow.tags)));

  const filteredFlows = mockFlows.filter(flow => {
    const matchesSearch = flow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         flow.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || flow.status === selectedStatus;
    const matchesTag = selectedTag === "all" || flow.tags.includes(selectedTag);
    return matchesSearch && matchesStatus && matchesTag;
  });

  return (
    <div className="min-h-screen bg-[var(--brand-surface)]">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-brand sticky top-0 z-10">
        <div className="container-app py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image
                src="/logo.jpg"
                alt="مُعين"
                width={50}
                height={50}
                className="rounded-lg"
              />
              <div>
                <h1 className="text-2xl font-bold text-brand">تدفقات الشات بوت</h1>
                <p className="text-gray-600 dark:text-gray-300">إدارة تدفقات المحادثة الذكية</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-brand px-6 py-2 rounded-lg text-white hover:bg-[var(--brand-primary-hover)] transition-colors"
              >
                إنشاء تدفق
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container-app py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {mockFlows.length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">إجمالي التدفقات</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {mockFlows.filter(f => f.status === "published").length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">منشورة</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {mockFlows.filter(f => f.status === "draft").length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">مسودات</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {mockFlows.reduce((sum, flow) => sum + flow.messageCount, 0)}
            </div>
            <div className="text-gray-600 dark:text-gray-300">إجمالي الرسائل</div>
          </div>
        </div>

        {/* Filters */}
        <div className="card p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                البحث
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث في التدفقات..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                الحالة
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
              >
                <option value="all">جميع الحالات</option>
                <option value="draft">مسودة</option>
                <option value="published">منشور</option>
                <option value="archived">مؤرشف</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                الوسم
              </label>
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
              >
                <option value="all">جميع الأوسمة</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button className="w-full btn-brand py-2 rounded-lg text-white hover:bg-[var(--brand-primary-hover)] transition-colors">
                تطبيق الفلاتر
              </button>
            </div>
          </div>
        </div>

        {/* Flows Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFlows.map((flow) => (
            <div key={flow.id} className="card p-6 hover:shadow-soft transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {flow.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {flow.description}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(flow.status)}`}>
                  {getStatusText(flow.status)}
                </span>
              </div>

              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {flow.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2 mb-6 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex justify-between">
                  <span>عدد الرسائل:</span>
                  <span className="font-medium">{flow.messageCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>تاريخ الإنشاء:</span>
                  <span className="font-medium">{flow.createdAt}</span>
                </div>
                {flow.lastUsed && (
                  <div className="flex justify-between">
                    <span>آخر استخدام:</span>
                    <span className="font-medium">{flow.lastUsed}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Link
                  href={ROUTES.CHATBOT.FLOW(flow.id)}
                  className="flex-1 btn-brand py-2 rounded-lg text-white text-sm hover:bg-[var(--brand-primary-hover)] transition-colors text-center"
                >
                  فتح المحرر
                </Link>
                <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                  نسخ
                </button>
                <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                  أرشفة
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredFlows.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🤖</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              لا توجد تدفقات
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              لا توجد تدفقات مطابقة للفلتر المحدد
            </p>
          </div>
        )}
      </main>

      {/* Create Flow Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">إنشاء تدفق جديد</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  اسم التدفق
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                  placeholder="مثال: استقبال المرضى"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  الوصف
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                  placeholder="وصف مختصر للتدفق..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  الأوسمة
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                  placeholder="ترحيب، استقبال (مفصولة بفواصل)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  القالب
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent">
                  <option value="">بدون قالب</option>
                  <option value="welcome">ترحيب</option>
                  <option value="appointment">حجز مواعيد</option>
                  <option value="support">دعم فني</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-brand py-2 rounded-lg text-white hover:bg-[var(--brand-primary-hover)] transition-colors"
                >
                  إنشاء التدفق
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}