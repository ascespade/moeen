"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Save, Eye, ArrowLeft, Edit3, Settings, Search } from "lucide-react";

export default function FlowPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const templates = [
    {
      id: "welcome",
      name: "تدفق الترحيب",
      description: "ترحيب بالعملاء الجدد وتوجيههم",
      icon: "👋",
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: "support",
      name: "دعم العملاء",
      description: "معالجة استفسارات وطلبات الدعم",
      icon: "🛠️",
      color: "from-green-500 to-emerald-500"
    },
    {
      id: "sales",
      name: "مبيعات",
      description: "توجيه العملاء نحو الشراء",
      icon: "💰",
      color: "from-purple-500 to-pink-500"
    },
    {
      id: "feedback",
      name: "جمع التقييمات",
      description: "طلب تقييم الخدمة من العملاء",
      icon: "⭐",
      color: "from-yellow-500 to-orange-500"
    }
  ];

  const flows = [
    {
      id: 1,
      name: "ترحيب العملاء الجدد",
      status: "نشط",
      messages: 156,
      lastUsed: "منذ ساعتين",
      icon: "👋"
    },
    {
      id: 2,
      name: "دعم فني",
      status: "معلق",
      messages: 89,
      lastUsed: "منذ يوم",
      icon: "🛠️"
    },
    {
      id: 3,
      name: "استفسارات المبيعات",
      status: "نشط",
      messages: 234,
      lastUsed: "منذ 30 دقيقة",
      icon: "💰"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Page Intro */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image
                src="/hemam-logo.jpg"
                alt="Hemam Logo"
                width={40}
                height={40}
                className="rounded-lg"
                unoptimized
              />
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">منشئ التدفق</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">إنشاء وإدارة تدفقات المحادثة</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="px-4 py-2 text-gray-600 dark:text-gray-300 transition-colors inline-flex items-center gap-2"
                style={{ color: "var(--brand-primary)" }}
              >
                <ArrowLeft className="h-4 w-4" /> العودة للوحة التحكم
              </Link>
              <button className="inline-flex items-center justify-center gap-2 rounded-md px-6 py-2 font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2" style={{ background: "var(--brand-primary)" }}>
                <Edit3 className="h-4 w-4" /> تدفق جديد
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Templates */}
          <div className="lg:col-span-1">
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">القوالب الجاهزة</h3>
              <div className="space-y-3">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={`p-4 rounded-md border-2 cursor-pointer transition-all ${selectedTemplate === template.id
                      ? "border-[var(--brand-primary)] bg-[color:var(--brand-primary)]/10"
                      : "border-gray-200 dark:border-gray-800 hover:border-[var(--brand-primary)]/60"
                      }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div className={`w-12 h-12 rounded-md flex items-center justify-center text-white text-xl`} style={{ background: "var(--brand-primary)" }}>
                        {template.icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{template.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{template.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Flow Builder */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">منشئ التدفق</h3>
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors inline-flex items-center gap-2 focus:outline-none focus:ring-1" style={{ outlineColor: "var(--brand-primary)" }}>
                    <Eye className="h-4 w-4" /> معاينة
                  </button>
                  <button className="inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2" style={{ background: "var(--brand-primary)" }}>
                    <Save className="h-4 w-4" /> حفظ
                  </button>
                </div>
              </div>

              {selectedTemplate ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-md border" style={{ background: "color-mix(in oklab, var(--brand-primary) 12%, transparent)", borderColor: "color-mix(in oklab, var(--brand_primary) 35%, transparent)" }}>
                    <h4 className="font-medium mb-2" style={{ color: "var(--brand-primary)" }}>
                      {templates.find(t => t.id === selectedTemplate)?.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {templates.find(t => t.id === selectedTemplate)?.description}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-md">
                      <div className="flex items-center space-x-3 space-x-reverse mb-2">
                        <span className="text-2xl">👋</span>
                        <span className="font-medium">رسالة الترحيب</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        مرحباً! كيف يمكنني مساعدتك اليوم؟
                      </p>
                    </div>

                    <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-md">
                      <div className="flex items-center space-x-3 space-x-reverse mb-2">
                        <span className="text-2xl">🤖</span>
                        <span className="font-medium">رد تلقائي</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        سأقوم بتوجيهك للشخص المناسب...
                      </p>
                    </div>

                    <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-md">
                      <div className="flex items-center space-x-3 space-x-reverse mb-2">
                        <span className="text-2xl">👤</span>
                        <span className="font-medium">تحويل للفريق</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        سأقوم بتوصيلك مع أحد أعضاء فريقنا...
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔄</div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    اختر قالب لبدء إنشاء التدفق
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    اختر أحد القوالب الجاهزة لتبدأ في إنشاء تدفق المحادثة الخاص بك
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Existing Flows */}
        <div className="mt-8">
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">التدفقات الموجودة</h3>
              <div className="flex items-center space-x-2 space-x-reverse">
                <button className="p-2 border border-gray-200 dark:border-gray-800 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" aria-label="Search">
                  <Search className="h-4 w-4" />
                </button>
                <button className="p-2 border border-gray-200 dark:border-gray-800 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" aria-label="Settings">
                  <Settings className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {flows.map((flow) => (
                <div key={flow.id} className="p-4 border border-gray-200 dark:border-gray-800 rounded-md hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{flow.icon}</span>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{flow.name}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${flow.status === 'نشط'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                        {flow.status}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex justify-between">
                      <span>الرسائل:</span>
                      <span className="font-medium">{flow.messages}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>آخر استخدام:</span>
                      <span className="font-medium">{flow.lastUsed}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4">
                    <button className="flex-1 py-2 rounded-md text-sm inline-flex items-center justify-center gap-2 text-white focus:outline-none focus:ring-2 focus:ring_offset-2" style={{ background: "var(--brand-primary)" }}>
                      <Edit3 className="h-4 w-4" /> تحرير
                    </button>
                    <button className="p-2 border border-gray-200 dark:border-gray-800 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" aria-label="Settings">
                      <Settings className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
