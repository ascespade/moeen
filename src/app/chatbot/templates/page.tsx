"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

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
  {
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
    usageCount: 45
  },
  {
    id: "2",
    name: "تأكيد الموعد",
    description: "رسالة تأكيد المواعيد",
    category: "مواعيد",
    language: "العربية",
    status: "approved",
    createdAt: "2024-01-08",
    updatedAt: "2024-01-12",
    variables: ["اسم المريض", "التاريخ", "الوقت", "اسم الطبيب"],
    preview: "تم تأكيد موعدك {{اسم المريض}} مع {{اسم الطبيب}} في {{التاريخ}} الساعة {{الوقت}}",
    usageCount: 32
  },
  {
    id: "3",
    name: "تذكير الموعد",
    description: "تذكير قبل 24 ساعة من الموعد",
    category: "مواعيد",
    language: "العربية",
    status: "approved",
    createdAt: "2024-01-05",
    updatedAt: "2024-01-10",
    variables: ["اسم المريض", "التاريخ", "الوقت"],
    preview: "تذكير: لديك موعد غداً {{اسم المريض}} في {{التاريخ}} الساعة {{الوقت}}",
    usageCount: 28
  },
  {
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
    usageCount: 15
  },
  {
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
    usageCount: 0
  }
];

export default function ChatbotTemplatesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState<Template | null>(null);

  const getStatusColor = (status: Template["status"]) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
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

  const allCategories = Array.from(new Set(mockTemplates.map(t => t.category)));
  const allLanguages = Array.from(new Set(mockTemplates.map(t => t.language)));

  const filteredTemplates = mockTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    const matchesLanguage = selectedLanguage === "all" || template.language === selectedLanguage;
    const matchesStatus = selectedStatus === "all" || template.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesLanguage && matchesStatus;
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
                <h1 className="text-2xl font-bold text-brand">قوالب الشات بوت</h1>
                <p className="text-gray-600 dark:text-gray-300">إدارة قوالب الرسائل الذكية</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-brand px-6 py-2 rounded-lg text-white hover:bg-[var(--brand-primary-hover)] transition-colors"
              >
                إنشاء قالب
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
              {mockTemplates.length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">إجمالي القوالب</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {mockTemplates.filter(t => t.status === "approved").length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">موافق عليها</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {mockTemplates.filter(t => t.status === "pending").length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">قيد المراجعة</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {mockTemplates.reduce((sum, template) => sum + template.usageCount, 0)}
            </div>
            <div className="text-gray-600 dark:text-gray-300">إجمالي الاستخدام</div>
          </div>
        </div>

        {/* Filters */}
        <div className="card p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                البحث
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث في القوالب..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                التصنيف
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
              >
                <option value="all">جميع التصنيفات</option>
                {allCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                اللغة
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
              >
                <option value="all">جميع اللغات</option>
                {allLanguages.map(language => (
                  <option key={language} value={language}>{language}</option>
                ))}
              </select>
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
                <option value="pending">قيد المراجعة</option>
                <option value="approved">موافق عليها</option>
              </select>
            </div>

            <div className="flex items-end">
              <button className="w-full btn-brand py-2 rounded-lg text-white hover:bg-[var(--brand-primary-hover)] transition-colors">
                تطبيق الفلاتر
              </button>
            </div>
          </div>
        </div>

        {/* Templates Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    القالب
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    التصنيف
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    اللغة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    المتغيرات
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    الاستخدام
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    الحالة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredTemplates.map((template) => (
                  <tr key={template.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {template.name}
                        </div>
                        <div className="text-sm text-gray-500">{template.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {template.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {template.language}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {template.variables.length} متغير
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {template.usageCount} مرة
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(template.status)}`}>
                        {getStatusText(template.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
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
                        <button className="text-green-600 hover:text-green-700">
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
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">📝</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
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
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    اسم القالب
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                    placeholder="مثال: ترحيب المرضى"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    التصنيف
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent">
                    <option value="">اختر التصنيف</option>
                    <option value="ترحيب">ترحيب</option>
                    <option value="مواعيد">مواعيد</option>
                    <option value="استفسارات">استفسارات</option>
                    <option value="إشعارات">إشعارات</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  الوصف
                </label>
                <textarea
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                  placeholder="وصف مختصر للقالب..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    اللغة
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent">
                    <option value="العربية">العربية</option>
                    <option value="English">English</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    المتغيرات
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                    placeholder="اسم المريض، اسم المركز (مفصولة بفواصل)"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  محتوى القالب
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                  placeholder="اكتب محتوى القالب هنا... استخدم {{اسم المتغير}} للمتغيرات"
                />
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
                  إنشاء القالب
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
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
                <h4 className="font-semibold mb-2">{showPreviewModal.name}</h4>
                <p className="text-gray-600 dark:text-gray-300">{showPreviewModal.description}</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h5 className="font-medium mb-2">المعاينة:</h5>
                <p className="text-gray-700 dark:text-gray-300">{showPreviewModal.preview}</p>
              </div>

              <div>
                <h5 className="font-medium mb-2">المتغيرات:</h5>
                <div className="flex flex-wrap gap-2">
                  {showPreviewModal.variables.map((variable, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {variable}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowPreviewModal(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  إغلاق
                </button>
                <button className="flex-1 btn-brand py-2 rounded-lg text-white hover:bg-[var(--brand-primary-hover)] transition-colors">
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