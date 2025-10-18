import React from "react";

'use client';
import { useState } from 'react';


import Image from 'next/image';


export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<
    'general' | 'api' | 'integrations' | 'notifications' | 'templates'
  >('general');

  return (
    <div className="min-h-screen bg-[var(--brand-surface)]">
      <header className="border-brand sticky top-0 z-10 border-b bg-white dark:bg-gray-900">
        <div className="container-app py-6">
          <div className="flex items-center gap-4">
            <Image
              src="/logo.png"
              alt="مُعين"
              width={50}
              height={50}
              className="rounded-lg"
            />
            <div>
              <h1 className="text-brand text-2xl font-bold">الإعدادات</h1>
              <p className="text-gray-600 dark:text-gray-300">
                إدارة إعدادات النظام
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container-app py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {[
                { id: 'general', label: 'عام', icon: '⚙️' },
                { id: 'api', label: 'مفاتيح API', icon: '🔑' },
                { id: 'integrations', label: 'التكاملات', icon: '��' },
                { id: 'notifications', label: 'الإشعارات', icon: '🔔' },
                { id: 'templates', label: 'القوالب', icon: '📝' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`
                    activeTab === tab.id
                      ? 'bg-[var(--brand-primary)] text-white'
                      : 'text-gray-700 hover:bg-surface dark:text-gray-300 dark:hover:bg-gray-800'
                  }`
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="lg:col-span-3">
            <div className="card p-6">
              {activeTab === 'general' && (
                <div>
                  <h2 className="mb-6 text-xl font-semibold">
                    الإعدادات العامة
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        اسم المركز
                      </label>
                      <input
                        type="text"
                        defaultValue="مركز الهمم للرعاية الصحية المتخصصة"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        البريد الإلكتروني
                      </label>
                      <input
                        type="email"
                        defaultValue="info@moeen.com"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        الهاتف
                      </label>
                      <input
                        type="tel"
                        defaultValue="+966501234567"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        العنوان
                      </label>
                      <textarea
                        rows={3}
                        defaultValue="الرياض، المملكة العربية السعودية"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                      ></textarea>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        المنطقة الزمنية
                      </label>
                      <select className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]">
                        <option value="Asia/Riyadh">الرياض (GMT+3)</option>
                        <option value="Asia/Dubai">دبي (GMT+4)</option>
                        <option value="Europe/London">لندن (GMT+0)</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        اللغة
                      </label>
                      <select className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]">
                        <option value="ar">العربية</option>
                        <option value="en">English</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'api' && (
                <div>
                  <h2 className="mb-6 text-xl font-semibold">مفاتيح API</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Gemini API Key
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="password"
                          defaultValue="AIzaSyB..."
                          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                        />
                        <button className="rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-surface">
                          تحديث
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        OpenAI API Key
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="password"
                          defaultValue="sk-..."
                          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                        />
                        <button className="rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-surface">
                          تحديث
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        WhatsApp Business API
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="password"
                          defaultValue="EAA..."
                          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                        />
                        <button className="rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-surface">
                          تحديث
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'integrations' && (
                <div>
                  <h2 className="mb-6 text-xl font-semibold">التكاملات</h2>
                  <div className="space-y-4">
                    {[
                      {
                        name: 'واتساب بزنس',
                        status: 'connected',
                        description: 'متصل'
                      },
                      {
                        name: 'تيليجرام',
                        status: 'disconnected',
                        description: 'غير متصل'
                      },
                      {
                        name: 'فيسبوك ماسنجر',
                        status: 'error',
                        description: 'خطأ في الاتصال'
                      },
                      {
                        name: 'الموقع الإلكتروني',
                        status: 'connected',
                        description: 'متصل'
                      }
                    ].map((integration, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                      >
                        <div>
                          <h3 className="font-medium">{integration.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {integration.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`
                              integration.status === 'connected'
                                ? 'bg-green-100 text-green-800'
                                : integration.status === 'disconnected'
                                  ? 'bg-surface text-gray-800'
                                  : 'bg-red-100 text-red-800'
                            }`
                          >
                            {integration.status === 'connected'
                              ? 'متصل'
                              : integration.status === 'disconnected'
                                ? 'غير متصل'
                                : 'خطأ'}
                          </span>
                          <button className="rounded-lg border border-gray-300 px-3 py-1 text-sm transition-colors hover:bg-surface">
                            {integration.status === 'connected'
                              ? 'إعدادات'
                              : 'اتصال'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div>
                  <h2 className="mb-6 text-xl font-semibold">
                    إعدادات الإشعارات
                  </h2>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">
                          إشعارات البريد الإلكتروني
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          تلقي إشعارات عبر البريد الإلكتروني
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 rounded border-gray-300 text-[var(--brand-primary)] focus:ring-[var(--brand-primary)]"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">إشعارات واتساب</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          تلقي إشعارات عبر واتساب
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 rounded border-gray-300 text-[var(--brand-primary)] focus:ring-[var(--brand-primary)]"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">إشعارات المواعيد</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          إشعارات تذكير المواعيد
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 rounded border-gray-300 text-[var(--brand-primary)] focus:ring-[var(--brand-primary)]"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">إشعارات النظام</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          إشعارات تحديثات النظام
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-[var(--brand-primary)] focus:ring-[var(--brand-primary)]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'templates' && (
                <div>
                  <h2 className="mb-6 text-xl font-semibold">
                    قوالب الإشعارات
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        قالب ترحيب المرضى
                      </label>
                      <textarea
                        rows={3}
                        defaultValue="مرحباً {{اسم المريض}}، أهلاً وسهلاً بك في {{اسم المركز}}!"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                      ></textarea>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        قالب تأكيد الموعد
                      </label>
                      <textarea
                        rows={3}
                        defaultValue="تم تأكيد موعدك {{اسم المريض}} مع {{اسم الطبيب}} في {{التاريخ}} الساعة {{الوقت}}"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                      ></textarea>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        قالب تذكير الموعد
                      </label>
                      <textarea
                        rows={3}
                        defaultValue="تذكير: لديك موعد غداً {{اسم المريض}} في {{التاريخ}} الساعة {{الوقت}}"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                      ></textarea>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8 flex justify-end border-t border-gray-200 pt-6 dark:border-gray-700">
                <button className="btn-brand rounded-lg px-6 py-2 text-white transition-colors hover:bg-[var(--brand-primary-hover)]">
                  حفظ التغييرات
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
