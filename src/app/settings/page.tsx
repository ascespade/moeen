"use client";

import { useState } from "react";
import Image from "next/image";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"general" | "api" | "integrations" | "notifications" | "templates">("general");

  return (
    <div className="min-h-screen bg-[var(--brand-surface)]">
      <header className="bg-white dark:bg-gray-900 border-b border-brand sticky top-0 z-10">
        <div className="container-app py-6">
          <div className="flex items-center gap-4">
            <Image src="/logo.jpg" alt="مُعين" width={50} height={50} className="rounded-lg" />
            <div>
              <h1 className="text-2xl font-bold text-brand">الإعدادات</h1>
              <p className="text-gray-600 dark:text-gray-300">إدارة إعدادات النظام</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container-app py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {[
                { id: "general", label: "عام", icon: "⚙️" },
                { id: "api", label: "مفاتيح API", icon: "🔑" },
                { id: "integrations", label: "التكاملات", icon: "��" },
                { id: "notifications", label: "الإشعارات", icon: "🔔" },
                { id: "templates", label: "القوالب", icon: "📝" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-right rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? "bg-[var(--brand-primary)] text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="lg:col-span-3">
            <div className="card p-6">
              {activeTab === "general" && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">الإعدادات العامة</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">اسم المركز</label>
                      <input type="text" defaultValue="مركز الهمم للرعاية الصحية المتخصصة" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">البريد الإلكتروني</label>
                      <input type="email" defaultValue="info@moeen.com" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">الهاتف</label>
                      <input type="tel" defaultValue="+966501234567" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">العنوان</label>
                      <textarea rows={3} defaultValue="الرياض، المملكة العربية السعودية" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">المنطقة الزمنية</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent">
                        <option value="Asia/Riyadh">الرياض (GMT+3)</option>
                        <option value="Asia/Dubai">دبي (GMT+4)</option>
                        <option value="Europe/London">لندن (GMT+0)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">اللغة</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent">
                        <option value="ar">العربية</option>
                        <option value="en">English</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "api" && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">مفاتيح API</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Gemini API Key</label>
                      <div className="flex gap-2">
                        <input type="password" defaultValue="AIzaSyB..." className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent" />
                        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">تحديث</button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">OpenAI API Key</label>
                      <div className="flex gap-2">
                        <input type="password" defaultValue="sk-..." className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent" />
                        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">تحديث</button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">WhatsApp Business API</label>
                      <div className="flex gap-2">
                        <input type="password" defaultValue="EAA..." className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent" />
                        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">تحديث</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "integrations" && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">التكاملات</h2>
                  <div className="space-y-4">
                    {[
                      { name: "واتساب بزنس", status: "connected", description: "متصل" },
                      { name: "تيليجرام", status: "disconnected", description: "غير متصل" },
                      { name: "فيسبوك ماسنجر", status: "error", description: "خطأ في الاتصال" },
                      { name: "الموقع الإلكتروني", status: "connected", description: "متصل" }
                    ].map((integration, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div>
                          <h3 className="font-medium">{integration.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{integration.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            integration.status === "connected" ? "bg-green-100 text-green-800" :
                            integration.status === "disconnected" ? "bg-gray-100 text-gray-800" :
                            "bg-red-100 text-red-800"
                          }`}>
                            {integration.status === "connected" ? "متصل" :
                             integration.status === "disconnected" ? "غير متصل" : "خطأ"}
                          </span>
                          <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                            {integration.status === "connected" ? "إعدادات" : "اتصال"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">إعدادات الإشعارات</h2>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">إشعارات البريد الإلكتروني</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">تلقي إشعارات عبر البريد الإلكتروني</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-[var(--brand-primary)] border-gray-300 rounded focus:ring-[var(--brand-primary)]" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">إشعارات واتساب</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">تلقي إشعارات عبر واتساب</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-[var(--brand-primary)] border-gray-300 rounded focus:ring-[var(--brand-primary)]" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">إشعارات المواعيد</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">إشعارات تذكير المواعيد</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-[var(--brand-primary)] border-gray-300 rounded focus:ring-[var(--brand-primary)]" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">إشعارات النظام</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">إشعارات تحديثات النظام</p>
                      </div>
                      <input type="checkbox" className="w-4 h-4 text-[var(--brand-primary)] border-gray-300 rounded focus:ring-[var(--brand-primary)]" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "templates" && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">قوالب الإشعارات</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">قالب ترحيب المرضى</label>
                      <textarea rows={3} defaultValue="مرحباً {{اسم المريض}}، أهلاً وسهلاً بك في {{اسم المركز}}!" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">قالب تأكيد الموعد</label>
                      <textarea rows={3} defaultValue="تم تأكيد موعدك {{اسم المريض}} مع {{اسم الطبيب}} في {{التاريخ}} الساعة {{الوقت}}" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">قالب تذكير الموعد</label>
                      <textarea rows={3} defaultValue="تذكير: لديك موعد غداً {{اسم المريض}} في {{التاريخ}} الساعة {{الوقت}}" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"></textarea>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700 mt-8">
                <button className="btn-brand px-6 py-2 rounded-lg text-white hover:bg-[var(--brand-primary-hover)] transition-colors">حفظ التغييرات</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
