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
  content: "مرحباً {{اسم المريض}}، أهلاً وسهلاً بك في {{اسم المركز}}! نحن سعداء لاختيارك خدماتنا الطبية المتخصصة. كيف يمكننا مساعدتك اليوم؟",
  variables: ["اسم المريض", "اسم المركز"],
  createdAt: "2024-01-10",
  updatedAt: "2024-01-15",
  usageCount: 45
};

export default function TemplateEditorPage({ params }: { params: { id: string } }) {
  const [template, setTemplate] = useState<Template>(mockTemplate);
  const [isEditing, setIsEditing] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [testVariables, setTestVariables] = useState<Record<string, string>>({});

  const handleContentChange = (newContent: string) => {
    setTemplate(prev => ({ ...prev, content: newContent }));
  };

  const handleVariableAdd = (newVariable: string) => {
    if (newVariable && !template.variables.includes(newVariable)) {
      setTemplate(prev => ({
        ...prev,
        variables: [...prev.variables, newVariable]
      }));
    }
  };

  const handleVariableRemove = (variableToRemove: string) => {
    setTemplate(prev => ({
      ...prev,
      variables: prev.variables.filter(v => v !== variableToRemove)
    }));
  };

  const generatePreview = () => {
    let preview = template.content;
    template.variables.forEach(variable => {
      const value = testVariables[variable] || `{{${variable}}}`;
      preview = preview.replace(new RegExp(`{{${variable}}}`, 'g'), value);
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
    template.variables.forEach(variable => {
      initialTestVars[variable] = `قيمة ${variable}`;
    });
    setTestVariables(initialTestVars);
    setShowTestModal(true);
  };

  return (
    <div className="min-h-screen bg-[var(--brand-surface)]">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-brand sticky top-0 z-10">
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
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                اختبار
              </button>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {isEditing ? "عرض" : "تعديل"}
              </button>
              {isEditing && (
                <button
                  onClick={handleSave}
                  className="btn-brand px-6 py-2 rounded-lg text-white hover:bg-[var(--brand-primary-hover)] transition-colors"
                >
                  حفظ
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container-app py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Template Info */}
          <div className="lg:col-span-1">
            <div className="card p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">معلومات القالب</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">التصنيف:</label>
                  <p className="text-gray-900 dark:text-white">{template.category}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">اللغة:</label>
                  <p className="text-gray-900 dark:text-white">{template.language}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">الحالة:</label>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                    موافق عليه
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">عدد الاستخدام:</label>
                  <p className="text-gray-900 dark:text-white">{template.usageCount} مرة</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">آخر تحديث:</label>
                  <p className="text-gray-900 dark:text-white">{template.updatedAt}</p>
                </div>
              </div>
            </div>

            {/* Variables */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4">المتغيرات</h3>
              <div className="space-y-3">
                {template.variables.map((variable, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-sm font-medium">{variable}</span>
                    {isEditing && (
                      <button
                        onClick={() => handleVariableRemove(variable)}
                        className="text-red-500 hover:text-red-700 text-sm"
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
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleVariableAdd(e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        const input = document.querySelector('input[placeholder="إضافة متغير جديد"]') as HTMLInputElement;
                        if (input?.value) {
                          handleVariableAdd(input.value);
                          input.value = '';
                        }
                      }}
                      className="px-3 py-2 bg-[var(--brand-primary)] text-white rounded-lg text-sm hover:bg-[var(--brand-primary-hover)] transition-colors"
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
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">محتوى القالب</h3>
                <div className="flex gap-2">
                  <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                    نسخ
                  </button>
                  <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                    استيراد
                  </button>
                </div>
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      اسم القالب
                    </label>
                    <input
                      type="text"
                      value={template.name}
                      onChange={(e) => setTemplate(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      الوصف
                    </label>
                    <textarea
                      rows={2}
                      value={template.description}
                      onChange={(e) => setTemplate(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      محتوى القالب
                    </label>
                    <textarea
                      rows={8}
                      value={template.content}
                      onChange={(e) => handleContentChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent font-mono"
                      placeholder="اكتب محتوى القالب هنا... استخدم {{اسم المتغير}} للمتغيرات"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      استخدم {{اسم المتغير}} لإدراج المتغيرات في النص
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">المحتوى الحالي:</h4>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {template.content}
                    </p>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 text-blue-800 dark:text-blue-300">المعاينة:</h4>
                    <p className="text-blue-700 dark:text-blue-300 whitespace-pre-wrap">
                      {generatePreview()}
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleTest}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  اختبار القالب
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  نسخ القالب
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  تصدير
                </button>
                {isEditing && (
                  <button
                    onClick={handleSave}
                    className="btn-brand px-6 py-2 rounded-lg text-white hover:bg-[var(--brand-primary-hover)] transition-colors"
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
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">اختبار القالب</h3>
              <button
                onClick={() => setShowTestModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h4 className="font-semibold mb-2">المعاينة المباشرة:</h4>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {generatePreview()}
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-3">قيم المتغيرات:</h4>
                <div className="space-y-3">
                  {template.variables.map((variable, index) => (
                    <div key={index}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {variable}:
                      </label>
                      <input
                        type="text"
                        value={testVariables[variable] || ''}
                        onChange={(e) => setTestVariables(prev => ({
                          ...prev,
                          [variable]: e.target.value
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                        placeholder={`أدخل قيمة ${variable}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowTestModal(false)}
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