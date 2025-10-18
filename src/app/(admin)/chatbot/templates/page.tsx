import { useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { ROUTES } from "@/constants/routes";

("use client");

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  language: string;
  status: "draft" | "approved" | "pending";
  createdAt: string;
  updatedAt: string;
  variables: string[];
  preview: string;
  usageCount: number;
}

const mockTemplates: Template[] = [
    id: "1",
    name: "ترحيب المرضى",
    description: "رسالة ترحيب للمرضى الجدد",
    category: "ترحيب",
    language: "العربية",
    status: "approved",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-15",
    variables: ["اسم المريض", "اسم المركز"],
    preview: "مرحباً {{اسم المريض}}، أهلاً وسهلاً بك في {{اسم المركز}}!",
    usageCount: 45,
  },
    id: "2",
    name: "تأكيد الموعد",
    description: "رسالة تأكيد المواعيد",
    category: "مواعيد",
    language: "العربية",
    status: "approved",
    createdAt: "2024-01-08",
    updatedAt: "2024-01-12",
    variables: ["اسم المريض", "التاريخ", "الوقت", "اسم الطبيب"],
    preview:
      "تم تأكيد موعدك {{اسم المريض}} مع {{اسم الطبيب}} في {{التاريخ}} الساعة {{الوقت}}",
    usageCount: 32,
  },
    id: "3",
    name: "تذكير الموعد",
    description: "تذكير قبل 24 ساعة من الموعد",
    category: "مواعيد",
    language: "العربية",
    status: "approved",
    createdAt: "2024-01-05",
    updatedAt: "2024-01-10",
    variables: ["اسم المريض", "التاريخ", "الوقت"],
    preview:
      "تذكير: لديك موعد غداً {{اسم المريض}} في {{التاريخ}} الساعة {{الوقت}}",
    usageCount: 28,
  },
    id: "4",
    name: "استفسار الخدمات",
    description: "رد على استفسارات الخدمات",
    category: "استفسارات",
    language: "العربية",
    status: "pending",
    createdAt: "2024-01-12",
    updatedAt: "2024-01-13",
    variables: ["اسم المريض"],
    preview: "شكراً {{اسم المريض}} لاستفسارك، سنرد عليك قريباً",
    usageCount: 15,
  },
    id: "5",
    name: "Welcome Message",
    description: "Welcome message for new patients",
    category: "ترحيب",
    language: "English",
    status: "draft",
    createdAt: "2024-01-14",
    updatedAt: "2024-01-14",
    variables: ["patient_name", "center_name"],
    preview: "Welcome {{patient_name}} to {{center_name}}!",
    usageCount: 0,
  },
];

export default function ChatbotTemplatesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState<Template | null>(
    null,
  );

  const getStatusColor = (status: Template["status"]) => {
    switch (status) {
      case "draft":
        return "bg-surface text-gray-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-surface text-gray-800";
    }
  };

  const getStatusText = (status: Template["status"]) => {
    switch (status) {
      case "draft":
        return "مسودة";
      case "approved":
        return "موافق عليه";
      case "pending":
        return "قيد المراجعة";
      default:
        return "غير محدد";
    }
  };

  const allCategories = Array.from(
    new Set(mockTemplates.map((t) => t.category)),
  );
  const allLanguages = Array.from(
    new Set(mockTemplates.map((t) => t.language)),
  );

  const filteredTemplates = mockTemplates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || template.category === selectedCategory;
    const matchesLanguage =
      selectedLanguage === "all" || template.language === selectedLanguage;
    const matchesStatus =
      selectedStatus === "all" || template.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesLanguage && matchesStatus;
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
                  قوالب الشات بوت
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  إدارة قوالب الرسائل الذكية
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-brand rounded-lg px-6 py-2 text-white transition-colors hover:bg-[var(--brand-primary-hover)]"
              >
                إنشاء قالب
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container-app py-8">
        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="card p-6 text-center">
            <div className="mb-2 text-3xl font-bold text-brand-primary">
              {mockTemplates.length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              إجمالي القوالب
            </div>
          </div>
          <div className="card p-6 text-center">
            <div className="mb-2 text-3xl font-bold text-brand-success">
              {mockTemplates.filter((t) => t.status === "approved").length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">موافق عليها</div>
          </div>
          <div className="card p-6 text-center">
            <div className="mb-2 text-3xl font-bold text-yellow-600">
              {mockTemplates.filter((t) => t.status === "pending").length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">قيد المراجعة</div>
          </div>
          <div className="card p-6 text-center">
            <div className="mb-2 text-3xl font-bold text-purple-600">
              {mockTemplates.reduce(
                (sum, template) => sum + template.usageCount,
                0,
              )}
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              إجمالي الاستخدام
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-8 p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                البحث
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث في القوالب..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                التصنيف
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
              >
                <option value="all">جميع التصنيفات</option>
                {allCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                اللغة
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
              >
                <option value="all">جميع اللغات</option>
                {allLanguages.map((language) => (
                  <option key={language} value={language}>
                    {language}
                  </option>
                ))}
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
                <option value="draft">مسودة</option>
                <option value="pending">قيد المراجعة</option>
                <option value="approved">موافق عليها</option>
              </select>
            </div>

            <div className="flex items-end">
              <button className="btn-brand w-full rounded-lg py-2 text-white transition-colors hover:bg-[var(--brand-primary-hover)]">
                تطبيق الفلاتر
              </button>
            </div>
          </div>
        </div>

        {/* Templates Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    القالب
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    التصنيف
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    اللغة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    المتغيرات
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    الاستخدام
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    الحالة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                {filteredTemplates.map((template) => (
                  <tr
                    key={template.id}
                    className="hover:bg-surface dark:hover:bg-gray-800"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {template.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {template.description}
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">
                        {template.category}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {template.language}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {template.variables.length} متغير
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {template.usageCount} مرة
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${getStatusColor(template.status)}`}
                      >
                        {getStatusText(template.status)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowPreviewModal(template)}
                          className="text-[var(--brand-primary)] hover:text-[var(--brand-primary-hover)]"
                        >
                          معاينة
                        </button>
                        <Link
                          href={ROUTES.CHATBOT.TEMPLATE(template.id)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          تعديل
                        </Link>
                        <button className="text-brand-success hover:text-green-700">
                          نسخ
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-surface">
              <span className="text-4xl">📝</span>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              لا توجد قوالب
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              لا توجد قوالب مطابقة للفلتر المحدد
            </p>
          </div>
        )}
      </main>

      {/* Create Template Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 dark:bg-gray-900">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-semibold">إنشاء قالب جديد</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    اسم القالب
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                    placeholder="مثال: ترحيب المرضى"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    التصنيف
                  </label>
                  <select className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]">
                    <option value="">اختر التصنيف</option>
                    <option value="ترحيب">ترحيب</option>
                    <option value="مواعيد">مواعيد</option>
                    <option value="استفسارات">استفسارات</option>
                    <option value="إشعارات">إشعارات</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  الوصف
                </label>
                <textarea
                  rows={2}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                  placeholder="وصف مختصر للقالب..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    اللغة
                  </label>
                  <select className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]">
                    <option value="العربية">العربية</option>
                    <option value="English">English</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    المتغيرات
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                    placeholder="اسم المريض، اسم المركز (مفصولة بفواصل)"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  محتوى القالب
                </label>
                <textarea
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                  placeholder="اكتب محتوى القالب هنا... استخدم {{اسم المتغير}} للمتغيرات"
                />
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
                  إنشاء القالب
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 dark:bg-gray-900">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-semibold">معاينة القالب</h3>
              <button
                onClick={() => setShowPreviewModal(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="mb-2 font-semibold">{showPreviewModal.name}</h4>
                <p className="text-gray-600 dark:text-gray-300">
                  {showPreviewModal.description}
                </p>
              </div>

              <div className="rounded-lg bg-surface p-4 dark:bg-gray-800">
                <h5 className="mb-2 font-medium">المعاينة:</h5>
                <p className="text-gray-700 dark:text-gray-300">
                  {showPreviewModal.preview}
                </p>
              </div>

              <div>
                <h5 className="mb-2 font-medium">المتغيرات:</h5>
                <div className="flex flex-wrap gap-2">
                  {showPreviewModal.variables.map((variable, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-blue-100 px-2 py-1 text-sm text-blue-800"
                    >
                      {variable}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowPreviewModal(null)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-surface"
                >
                  إغلاق
                </button>
                <button className="btn-brand flex-1 rounded-lg py-2 text-white transition-colors hover:bg-[var(--brand-primary-hover)]">
                  استخدام القالب
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
