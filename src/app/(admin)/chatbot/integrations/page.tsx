"use client";

import { useState } from "react";

import Image from "next/image";

import { ROUTES } from "@/constants/routes";

();

interface Integration {
  id: string;
  name: string;
  type: "whatsapp" | "web" | "telegram" | "facebook";
  status: "connected" | "disconnected" | "error";
  description: string;
  webhookUrl?: string;
  lastSync?: string;
  messageCount: number;
  icon: string;
  color: string;

const mockIntegrations: Integration[] = [
  {
    id: "1",
    name: "واتساب بزنس",
    type: "whatsapp",
    status: "connected",
    description: "تكامل مع واتساب بزنس لإرسال واستقبال الرسائل",
    webhookUrl: "https://api.moeen.com/webhook/whatsapp",
    lastSync: "2024-01-15 14:30",
    messageCount: 1247,
    icon: "📱",
    color: "text-brand-success",
  },
    id: "2",
    name: "الموقع الإلكتروني",
    type: "web",
    status: "connected",
    description: "شات بوت مدمج في الموقع الإلكتروني",
    webhookUrl: "https://api.moeen.com/webhook/web",
    lastSync: "2024-01-15 14:25",
    messageCount: 892,
    icon: "🌐",
    color: "text-brand-primary",
  },
    id: "3",
    name: "تيليجرام",
    type: "telegram",
    status: "disconnected",
    description: "تكامل مع تيليجرام للرسائل",
    messageCount: 0,
    icon: "✈️",
    color: "text-brand-primary",
  },
    id: "4",
    name: "فيسبوك ماسنجر",
    type: "facebook",
    status: "error",
    description: "تكامل مع فيسبوك ماسنجر",
    webhookUrl: "https://api.moeen.com/webhook/facebook",
    lastSync: "2024-01-14 09:15",
    messageCount: 156,
    icon: "💬",
    color: "text-blue-700",
  },
];

export default function ChatbotIntegrationsPage() {
  const [showConnectModal, setShowConnectModal] = useState<string | null>(null);
  const [webhookTest, setWebhookTest] = useState<Record<string, boolean>>({});

  const getStatusColor = (status: Integration["status"]) => {
    switch (status) {
      case "connected":
        return "bg-green-100 text-green-800";
      case "disconnected":
        return "bg-surface text-gray-800";
      case "error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-surface text-gray-800";
    }
  };

  const getStatusText = (status: Integration["status"]) => {
    switch (status) {
      case "connected":
        return "متصل";
      case "disconnected":
        return "غير متصل";
      case "error":
        return "خطأ";
      default:
        return "غير محدد";
    }
  };

  const handleConnect = (integrationId: string) => {
    setShowConnectModal(integrationId);
  };

  const handleDisconnect = (integrationId: string) => {
    // Simulate disconnect
  };

  const handleTestWebhook = (integrationId: string) => {
    setWebhookTest((prev) => ({ ...prev, [integrationId]: true }));
    // Simulate webhook test
    setTimeout(() => {
      setWebhookTest((prev) => ({ ...prev, [integrationId]: false }));
    }, 2000);
  };

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
                  تكاملات الشات بوت
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  إدارة قنوات التواصل المختلفة
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="btn-brand rounded-lg px-6 py-2 text-white transition-colors hover:bg-[var(--brand-primary-hover)]">
                إضافة تكامل
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
              {mockIntegrations.length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              إجمالي التكاملات
            </div>
          </div>
          <div className="card p-6 text-center">
            <div className="mb-2 text-3xl font-bold text-brand-success">
              {mockIntegrations.filter((i) => i.status === "connected").length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">متصلة</div>
          </div>
          <div className="card p-6 text-center">
            <div className="mb-2 text-3xl font-bold text-brand-error">
              {mockIntegrations.filter((i) => i.status === "error").length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">خطأ</div>
          </div>
          <div className="card p-6 text-center">
            <div className="mb-2 text-3xl font-bold text-purple-600">
              {mockIntegrations.reduce(
                (sum, integration) => sum + integration.messageCount,
                0,
              )}
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              إجمالي الرسائل
            </div>
          </div>
        </div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockIntegrations.map((integration) => (
            <div
              key={integration.id}
              className="card hover:shadow-soft p-6 transition-shadow"
            >
              <div className="mb-4 flex items-center gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-lg text-2xl ${integration.color}`}
                >
                  {integration.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {integration.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {integration.description}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-sm ${getStatusColor(integration.status)}`}
                >
                  {getStatusText(integration.status)}
                </span>
              </div>

              <div className="mb-6 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex justify-between">
                  <span>عدد الرسائل:</span>
                  <span className="font-medium">
                    {integration.messageCount.toLocaleString()}
                  </span>
                </div>
                {integration.lastSync && (
                  <div className="flex justify-between">
                    <span>آخر مزامنة:</span>
                    <span className="font-medium">{integration.lastSync}</span>
                  </div>
                )}
                {integration.webhookUrl && (
                  <div className="flex justify-between">
                    <span>Webhook:</span>
                    <span className="rounded bg-surface px-2 py-1 font-mono text-xs dark:bg-gray-800">
                      {integration.webhookUrl.split("/").pop()}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {integration.status === "connected" ? (
                  <>
                    <button
                      onClick={() => handleTestWebhook(integration.id)}
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors hover:bg-surface"
                      disabled={webhookTest[integration.id]}
                    >
                      {webhookTest[integration.id]
                        ? "جاري الاختبار..."
                        : "اختبار Webhook"}
                    </button>
                    <button
                      onClick={() => handleDisconnect(integration.id)}
                      className="rounded-lg border border-red-300 px-3 py-2 text-sm text-brand-error transition-colors hover:bg-surface"
                    >
                      قطع الاتصال
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleConnect(integration.id)}
                    className="btn-brand flex-1 rounded-lg py-2 text-sm text-white transition-colors hover:bg-[var(--brand-primary-hover)]"
                  >
                    {integration.status === "error" ? "إعادة الاتصال" : "اتصال"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Available Integrations */}
        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
            التكاملات المتاحة
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
                name: "واتساب بزنس",
                icon: "📱",
                description: "رسائل واتساب التجارية",
              },
              { name: "تيليجرام", icon: "✈️", description: "بوت تيليجرام" },
                name: "فيسبوك ماسنجر",
                icon: "💬",
                description: "فيسبوك ماسنجر",
              },
              { name: "إنستغرام", icon: "📷", description: "رسائل إنستغرام" },
                name: "تويتر",
                icon: "🐦",
                description: "رسائل تويتر المباشرة",
              },
              { name: "لينكد إن", icon: "💼", description: "لينكد إن ماسنجر" },
              { name: "سلاك", icon: "💬", description: "سلاك ووركسبيس" },
              { name: "ديسكورد", icon: "🎮", description: "ديسكورد بوت" },
            ].map((integration, index) => (
              <div
                key={index}
                className="card hover:shadow-soft cursor-pointer p-4 text-center transition-shadow"
              >
                <div className="mb-2 text-3xl">{integration.icon}</div>
                <h3 className="mb-1 font-semibold text-gray-900 dark:text-white">
                  {integration.name}
                </h3>
                <p className="mb-3 text-sm text-gray-600 dark:text-gray-300">
                  {integration.description}
                </p>
                <button className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors hover:bg-surface">
                  إضافة
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Connect Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-900">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-semibold">إعداد التكامل</h3>
              <button
                onClick={() => setShowConnectModal(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  API Key
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                  placeholder="أدخل API Key"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Webhook URL
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                  placeholder="https://api.moeen.com/webhook/..."
                  readOnly
                />
              </div>

              <div className="rounded-lg border border-blue-200 bg-surface p-4">
                <p className="text-sm text-blue-800">
                  <strong>ملاحظة:</strong> قم بإعداد Webhook في منصة التكامل
                  لتوجيه الرسائل إلى الرابط أعلاه.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowConnectModal(null)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-surface"
                >
                  إلغاء
                </button>
                <button
                  onClick={() => setShowConnectModal(null)}
                  className="btn-brand flex-1 rounded-lg py-2 text-white transition-colors hover:bg-[var(--brand-primary-hover)]"
                >
                  حفظ الإعدادات
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
