import { useState } from 'react';
import { ROUTES } from '@/constants/routes';
"use client";


import Image from "next/image";
import Link from "next/link";


interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  language: string;
  status: "draft" | "approved" | "pending";
  content: string;
  variables: string[];
  createdAt: string;
  updatedAt: string;
  usageCount: number;
}

const mockTemplate: Template = {
  id: "1",
  name: "ترحيب المرضى",
  description: "رسالة ترحيب للمرضى الجدد",
  category: "ترحيب",
  language: "العربية",
  status: "approved",
  content:
    "مرحباً {{اسم المريض}}، أهلاً وسهلاً بك في {{اسم المركز}}! نحن سعداء لاختيارك خدماتنا الطبية المتخصصة. كيف يمكننا مساعدتك اليوم؟",
  variables: ["اسم المريض", "اسم المركز"],
  createdAt: "2024-01-10",
  updatedAt: "2024-01-15",
  usageCount: 45,
};

export default function TemplateEditorPage({
  params,
}: {
  params: { id: string };
}) {
  const [template, setTemplate] = useState<Template>(mockTemplate);
  const [isEditing, setIsEditing] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [testVariables, setTestVariables] = useState<Record<string, string>>(
    {},
  );

  const handleContentChange = (newContent: string) => {
    setTemplate((prev) => ({ ...prev, content: newContent }));
  };

  const handleVariableAdd = (newVariable: string) => {
    if (newVariable && !template.variables.includes(newVariable)) {
      setTemplate((prev) => ({
        ...prev,
        variables: [...prev.variables, newVariable],
      }));
    }
  };

  const handleVariableRemove = (variableToRemove: string) => {
    setTemplate((prev) => ({
      ...prev,
      variables: prev.variables.filter((v) => v !== variableToRemove),
    }));
  };

  const generatePreview = () => {
    let preview = template.content;
    template.variables.forEach((variable) => {
      const value = testVariables[variable] || `{{${variable}}}`;
      preview = preview.replace(new RegExp(`{{${variable}}}`, "g"), value);
    });
    return preview;
  };

  const handleSave = () => {
    // Simulate save
    setIsEditing(false);
    // Show success message
  };

  const handleTest = () => {
    // Initialize test variables
    const initialTestVars: Record<string, string> = {};
    template.variables.forEach((variable) => {
      initialTestVars[variable] = `قيمة ${variable}`;
    });
    setTestVariables(initialTestVars);
    setShowTestModal(true);
  };

  return (
    <div className="min-h-screen bg-[var(--brand-surface)]">
      {/* Header */}
      <header className="border-brand sticky top-0 z-10 border-b bg-white dark:bg-gray-900">
        <div className="container-app py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href={ROUTES.CHATBOT.TEMPLATES}
                className="text-gray-400 hover:text-gray-600"
              >
                ← العودة
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {template.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-300">محرر القوالب</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleTest}
                className="rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50"
              >
                اختبار
              </button>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50"
              >
                {isEditing ? "عرض" : "تعديل"}
              </button>
              {isEditing && (
                <button
                  onClick={handleSave}
                  className="btn-brand rounded-lg px-6 py-2 text-white transition-colors hover:bg-[var(--brand-primary-hover)]"
                >
                  حفظ
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container-app py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Template Info */}
          <div className="lg:col-span-1">
            <div className="card mb-6 p-6">
              <h3 className="mb-4 text-lg font-semibold">معلومات القالب</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    التصنيف:
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {template.category}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    اللغة:
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {template.language}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    الحالة:
                  </label>
                  <span className="rounded-full bg-green-100 px-2 py-1 text-sm text-green-800">
                    موافق عليه
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    عدد الاستخدام:
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {template.usageCount} مرة
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    آخر تحديث:
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {template.updatedAt}
                  </p>
                </div>
              </div>
            </div>

            {/* Variables */}
            <div className="card p-6">
              <h3 className="mb-4 text-lg font-semibold">المتغيرات</h3>
              <div className="space-y-3">
                {template.variables.map((variable, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg bg-gray-50 p-2 dark:bg-gray-800"
                  >
                    <span className="text-sm font-medium">{variable}</span>
                    {isEditing && (
                      <button
                        onClick={() => handleVariableRemove(variable)}
                        className="text-sm text-red-500 hover:text-red-700"
                      >
                        حذف
                      </button>
                    )}
                  </div>
                ))}

                {isEditing && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="إضافة متغير جديد"
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleVariableAdd(e.currentTarget.value);
                          e.currentTarget.value = "";
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        const input = document.querySelector(
                          'input[placeholder="إضافة متغير جديد"]',
                        ) as HTMLInputElement;
                        if (input?.value) {
                          handleVariableAdd(input.value);
                          input.value = "";
                        }
                      }}
                      className="rounded-lg bg-[var(--brand-primary)] px-3 py-2 text-sm text-white transition-colors hover:bg-[var(--brand-primary-hover)]"
                    >
                      إضافة
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Template Editor */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-semibold">محتوى القالب</h3>
                <div className="flex gap-2">
                  <button className="rounded-lg border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50">
                    نسخ
                  </button>
                  <button className="rounded-lg border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50">
                    استيراد
                  </button>
                </div>
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      اسم القالب
                    </label>
                    <input
                      type="text"
                      value={template.name}
                      onChange={(e) =>
                        setTemplate((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      الوصف
                    </label>
                    <textarea
                      rows={2}
                      value={template.description}
                      onChange={(e) =>
                        setTemplate((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      محتوى القالب
                    </label>
                    <textarea
                      rows={8}
                      value={template.content}
                      onChange={(e) => handleContentChange(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                      placeholder="اكتب محتوى القالب هنا... استخدم {{اسم المتغير}} للمتغيرات"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      استخدم {"{{"}اسم المتغير{"}}"} لإدراج المتغيرات في النص
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                    <h4 className="mb-2 font-semibold">المحتوى الحالي:</h4>
                    <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                      {template.content}
                    </p>
                  </div>

                  <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                    <h4 className="mb-2 font-semibold text-blue-800 dark:text-blue-300">
                      المعاينة:
                    </h4>
                    <p className="whitespace-pre-wrap text-blue-700 dark:text-blue-300">
                      {generatePreview()}
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 border-t border-gray-200 pt-6 dark:border-gray-700">
                <button
                  onClick={handleTest}
                  className="rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50"
                >
                  اختبار القالب
                </button>
                <button className="rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50">
                  نسخ القالب
                </button>
                <button className="rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50">
                  تصدير
                </button>
                {isEditing && (
                  <button
                    onClick={handleSave}
                    className="btn-brand rounded-lg px-6 py-2 text-white transition-colors hover:bg-[var(--brand-primary-hover)]"
                  >
                    حفظ التغييرات
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Test Modal */}
      {showTestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 dark:bg-gray-900">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-semibold">اختبار القالب</h3>
              <button
                onClick={() => setShowTestModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                <h4 className="mb-2 font-semibold">المعاينة المباشرة:</h4>
                <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                  {generatePreview()}
                </p>
              </div>

              <div>
                <h4 className="mb-3 font-semibold">قيم المتغيرات:</h4>
                <div className="space-y-3">
                  {template.variables.map((variable, index) => (
                    <div key={index}>
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {variable}:
                      </label>
                      <input
                        type="text"
                        value={testVariables[variable] || ""}
                        onChange={(e) =>
                          setTestVariables((prev) => ({
                            ...prev,
                            [variable]: e.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                        placeholder={`أدخل قيمة ${variable}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowTestModal(false)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50"
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
