import { useState } from 'react';
"use client";


import Image from "next/image";

interface Message {
  id: string;
  sender: string;
  recipient: string;
  subject: string;
  content: string;
  channel: "whatsapp" | "telegram" | "facebook" | "website";
  status: "sent" | "delivered" | "read" | "failed";
  createdAt: string;
  priority: "low" | "medium" | "high";
}

const mockMessages: Message[] = [
  {
    id: "1",
    sender: "نظام المواعيد",
    recipient: "أحمد محمد",
    subject: "تأكيد الموعد",
    content: "تم تأكيد موعدك مع د. سارة أحمد في 2024-01-20 الساعة 10:00 صباحاً",
    channel: "whatsapp",
    status: "delivered",
    createdAt: "2024-01-15 09:30",
    priority: "medium",
  },
  {
    id: "2",
    sender: "نظام التذكير",
    recipient: "فاطمة العتيبي",
    subject: "تذكير بالموعد",
    content:
      "تذكير: لديك موعد غداً مع د. خالد القحطاني في 2024-01-16 الساعة 2:00 مساءً",
    channel: "telegram",
    status: "read",
    createdAt: "2024-01-15 08:15",
    priority: "high",
  },
  {
    id: "3",
    sender: "نظام الاستفسارات",
    recipient: "محمد السعد",
    subject: "رد على استفسارك",
    content: "شكراً لاستفسارك. سنتواصل معك قريباً لتوضيح التفاصيل",
    channel: "facebook",
    status: "sent",
    createdAt: "2024-01-15 07:45",
    priority: "low",
  },
];

export default function MessagesPage() {
  const [filter, setFilter] = useState<
    "all" | "sent" | "delivered" | "read" | "failed"
  >("all");
  const [channelFilter, setChannelFilter] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const getChannelIcon = (channel: Message["channel"]) => {
    switch (channel) {
      case "whatsapp":
        return "📱";
      case "telegram":
        return "✈️";
      case "facebook":
        return "📘";
      case "website":
        return "🌐";
      default:
        return "💬";
    }
  };

  const getChannelText = (channel: Message["channel"]) => {
    switch (channel) {
      case "whatsapp":
        return "واتساب";
      case "telegram":
        return "تيليجرام";
      case "facebook":
        return "فيسبوك";
      case "website":
        return "الموقع";
      default:
        return "قناة";
    }
  };

  const getStatusColor = (status: Message["status"]) => {
    switch (status) {
      case "sent":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "read":
        return "bg-purple-100 text-purple-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: Message["status"]) => {
    switch (status) {
      case "sent":
        return "مرسل";
      case "delivered":
        return "تم التسليم";
      case "read":
        return "مقروء";
      case "failed":
        return "فشل";
      default:
        return "غير محدد";
    }
  };

  const getPriorityColor = (priority: Message["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredMessages = mockMessages.filter((message) => {
    const matchesFilter = filter === "all" || message.status === filter;
    const matchesChannel =
      channelFilter === "all" || message.channel === channelFilter;
    return matchesFilter && matchesChannel;
  });

  return (
    <div className="min-h-screen bg-[var(--brand-surface)]">
      <header className="border-brand sticky top-0 z-10 border-b bg-white dark:bg-gray-900">
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
                <h1 className="text-brand text-2xl font-bold">إدارة الرسائل</h1>
                <p className="text-gray-600 dark:text-gray-300">
                  تتبع وإدارة الرسائل المرسلة
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-brand rounded-lg px-6 py-2 text-white transition-colors hover:bg-[var(--brand-primary-hover)]"
            >
              إرسال رسالة
            </button>
          </div>
        </div>
      </header>

      <main className="container-app py-8">
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="card p-6 text-center">
            <div className="mb-2 text-3xl font-bold text-blue-600">
              {mockMessages.length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              إجمالي الرسائل
            </div>
          </div>
          <div className="card p-6 text-center">
            <div className="mb-2 text-3xl font-bold text-green-600">
              {mockMessages.filter((m) => m.status === "delivered").length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">تم التسليم</div>
          </div>
          <div className="card p-6 text-center">
            <div className="mb-2 text-3xl font-bold text-purple-600">
              {mockMessages.filter((m) => m.status === "read").length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">مقروءة</div>
          </div>
          <div className="card p-6 text-center">
            <div className="mb-2 text-3xl font-bold text-red-600">
              {mockMessages.filter((m) => m.status === "failed").length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">فشل</div>
          </div>
        </div>

        <div className="card mb-8 p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                فلتر الحالة
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
              >
                <option value="all">جميع الحالات</option>
                <option value="sent">مرسل</option>
                <option value="delivered">تم التسليم</option>
                <option value="read">مقروء</option>
                <option value="failed">فشل</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                فلتر القناة
              </label>
              <select
                value={channelFilter}
                onChange={(e) => setChannelFilter(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
              >
                <option value="all">جميع القنوات</option>
                <option value="whatsapp">واتساب</option>
                <option value="telegram">تيليجرام</option>
                <option value="facebook">فيسبوك</option>
                <option value="website">الموقع</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="btn-brand w-full rounded-lg py-2 text-white transition-colors hover:bg-[var(--brand-primary-hover)]">
                تطبيق الفلاتر
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredMessages.map((message) => (
            <div
              key={message.id}
              className="card hover:shadow-soft p-6 transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="text-2xl">
                  {getChannelIcon(message.channel)}
                </div>
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {message.subject}
                    </h3>
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${getStatusColor(message.status)}`}
                    >
                      {getStatusText(message.status)}
                    </span>
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${getPriorityColor(message.priority)}`}
                    >
                      {message.priority === "high"
                        ? "عالي"
                        : message.priority === "medium"
                          ? "متوسط"
                          : "منخفض"}
                    </span>
                  </div>
                  <div className="mb-3 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-4">
                      <span>من: {message.sender}</span>
                      <span>إلى: {message.recipient}</span>
                      <span>القناة: {getChannelText(message.channel)}</span>
                    </div>
                  </div>
                  <p className="mb-3 text-gray-700 dark:text-gray-300">
                    {message.content}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {message.createdAt}
                    </span>
                    <div className="flex gap-2">
                      <button className="rounded bg-[var(--brand-primary)] px-3 py-1 text-sm text-white transition-colors hover:bg-[var(--brand-primary-hover)]">
                        عرض
                      </button>
                      <button className="rounded border border-gray-300 px-3 py-1 text-sm text-gray-700 transition-colors hover:bg-gray-50">
                        إعادة إرسال
                      </button>
                      <button className="rounded border border-red-300 px-3 py-1 text-sm text-red-700 transition-colors hover:bg-red-50">
                        حذف
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMessages.length === 0 && (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
              <span className="text-4xl">💬</span>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              لا توجد رسائل
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              لا توجد رسائل مطابقة للفلتر المحدد
            </p>
          </div>
        )}
      </main>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 dark:bg-gray-900">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-semibold">إرسال رسالة جديدة</h3>
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
                    المستقبل
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                    placeholder="اسم المستقبل"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    القناة
                  </label>
                  <select className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]">
                    <option value="whatsapp">واتساب</option>
                    <option value="telegram">تيليجرام</option>
                    <option value="facebook">فيسبوك</option>
                    <option value="website">الموقع</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  الموضوع
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                  placeholder="موضوع الرسالة"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  المحتوى
                </label>
                <textarea
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                  placeholder="محتوى الرسالة"
                ></textarea>
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
                  إرسال الرسالة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
