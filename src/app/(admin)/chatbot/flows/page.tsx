"use client";
import Image from "next/image";
import Link from "next/link";
import { _useState } from "react";

import { _ROUTES } from "@/constants/routes";

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
    lastUsed: "2024-01-15",
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
    lastUsed: "2024-01-14",
  },
  {
    id: "3",
    name: "استفسارات عامة",
    description: "الرد على الاستفسارات العامة حول الخدمات",
    status: "draft",
    createdAt: "2024-01-12",
    updatedAt: "2024-01-13",
    tags: ["استفسارات", "خدمات"],
    messageCount: 5,
  },
  {
    id: "4",
    name: "تأكيد المواعيد",
    description: "تأكيد المواعيد قبل 24 ساعة",
    status: "archived",
    createdAt: "2024-01-05",
    updatedAt: "2024-01-10",
    tags: ["تأكيد", "مواعيد"],
    messageCount: 3,
  },
];

export default function __ChatbotFlowsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const __getStatusColor = (_status: Flow["status"]) => {
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

  const __getStatusText = (_status: Flow["status"]) => {
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

  const __allTags = Array.from(new Set(mockFlows.flatMap((flow) => flow.tags)));

  const __filteredFlows = mockFlows.filter((flow) => {
    const matchesSearch =
      flow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flow.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || flow.status === selectedStatus;
    const __matchesTag =
      selectedTag === "all" || flow.tags.includes(selectedTag);
    return matchesSearch && matchesStatus && matchesTag;
  });

  return (
    <div className="min-h-screen bg-[var(--brand-surface)]">
      {/* Header */}
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
                <h1 className="text-brand text-2xl font-bold">
                  تدفقات الشات بوت
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  إدارة تدفقات المحادثة الذكية
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-brand rounded-lg px-6 py-2 text-white transition-colors hover:bg-[var(--brand-primary-hover)]"
              >
                إنشاء تدفق
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container-app py-8">
        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="card p-6 text-center">
            <div className="mb-2 text-3xl font-bold text-blue-600">
              {mockFlows.length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              إجمالي التدفقات
            </div>
          </div>
          <div className="card p-6 text-center">
            <div className="mb-2 text-3xl font-bold text-green-600">
              {mockFlows.filter((f) => f.status === "published").length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">منشورة</div>
          </div>
          <div className="card p-6 text-center">
            <div className="mb-2 text-3xl font-bold text-yellow-600">
              {mockFlows.filter((f) => f.status === "draft").length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">مسودات</div>
          </div>
          <div className="card p-6 text-center">
            <div className="mb-2 text-3xl font-bold text-purple-600">
              {mockFlows.reduce((sum, flow) => sum + flow.messageCount, 0)}
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              إجمالي الرسائل
            </div>
          </div>
        </div>

        {/* Filters */}
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
                placeholder="ابحث في التدفقات..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
              />
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
                <option value="draft">مسودة</option>
                <option value="published">منشور</option>
                <option value="archived">مؤرشف</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                الوسم
              </label>
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
              >
                <option value="all">جميع الأوسمة</option>
                {allTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
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

        {/* Flows Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredFlows.map((flow) => (
            <div
              key={flow.id}
              className="card hover:shadow-soft p-6 transition-shadow"
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                    {flow.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {flow.description}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-sm ${getStatusColor(flow.status)}`}
                >
                  {getStatusText(flow.status)}
                </span>
              </div>

              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {flow.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6 space-y-2 text-sm text-gray-600 dark:text-gray-300">
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
                  className="btn-brand flex-1 rounded-lg py-2 text-center text-sm text-white transition-colors hover:bg-[var(--brand-primary-hover)]"
                >
                  فتح المحرر
                </Link>
                <button className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50">
                  نسخ
                </button>
                <button className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50">
                  أرشفة
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredFlows.length === 0 && (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
              <span className="text-4xl">🤖</span>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-900">
            <div className="mb-6 flex items-center justify-between">
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
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  اسم التدفق
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                  placeholder="مثال: استقبال المرضى"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  الوصف
                </label>
                <textarea
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                  placeholder="وصف مختصر للتدفق..."
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  الأوسمة
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                  placeholder="ترحيب، استقبال (مفصولة بفواصل)"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  القالب
                </label>
                <select className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]">
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
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="btn-brand flex-1 rounded-lg py-2 text-white transition-colors hover:bg-[var(--brand-primary-hover)]"
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
