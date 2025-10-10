"use client";

import { useState } from "react";
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
    priority: "medium"
  },
  {
    id: "2",
    sender: "نظام التذكير",
    recipient: "فاطمة العتيبي",
    subject: "تذكير بالموعد",
    content: "تذكير: لديك موعد غداً مع د. خالد القحطاني في 2024-01-16 الساعة 2:00 مساءً",
    channel: "telegram",
    status: "read",
    createdAt: "2024-01-15 08:15",
    priority: "high"
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
    priority: "low"
  }
];

export default function MessagesPage() {
  const [filter, setFilter] = useState<"all" | "sent" | "delivered" | "read" | "failed">("all");
  const [channelFilter, setChannelFilter] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const getChannelIcon = (channel: Message["channel"]) => {
    switch (channel) {
      case "whatsapp": return "📱";
      case "telegram": return "✈️";
      case "facebook": return "📘";
      case "website": return "🌐";
      default: return "💬";
    }
  };

  const getChannelText = (channel: Message["channel"]) => {
    switch (channel) {
      case "whatsapp": return "واتساب";
      case "telegram": return "تيليجرام";
      case "facebook": return "فيسبوك";
      case "website": return "الموقع";
      default: return "قناة";
    }
  };

  const getStatusColor = (status: Message["status"]) => {
    switch (status) {
      case "sent": return "bg-blue-100 text-blue-800";
      case "delivered": return "bg-green-100 text-green-800";
      case "read": return "bg-purple-100 text-purple-800";
      case "failed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: Message["status"]) => {
    switch (status) {
      case "sent": return "مرسل";
      case "delivered": return "تم التسليم";
      case "read": return "مقروء";
      case "failed": return "فشل";
      default: return "غير محدد";
    }
  };

  const getPriorityColor = (priority: Message["priority"]) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredMessages = mockMessages.filter(message => {
    const matchesFilter = filter === "all" || message.status === filter;
    const matchesChannel = channelFilter === "all" || message.channel === channelFilter;
    return matchesFilter && matchesChannel;
  });

  return (
    <div className="min-h-screen bg-[var(--brand-surface)]">
      <header className="bg-white dark:bg-gray-900 border-b border-brand sticky top-0 z-10">
        <div className="container-app py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image src="/logo.jpg" alt="مُعين" width={50} height={50} className="rounded-lg" />
              <div>
                <h1 className="text-2xl font-bold text-brand">إدارة الرسائل</h1>
                <p className="text-gray-600 dark:text-gray-300">تتبع وإدارة الرسائل المرسلة</p>
              </div>
            </div>
            <button onClick={() => setShowCreateModal(true)} className="btn-brand px-6 py-2 rounded-lg text-white hover:bg-[var(--brand-primary-hover)] transition-colors">إرسال رسالة</button>
          </div>
        </div>
      </header>

      <main className="container-app py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{mockMessages.length}</div>
            <div className="text-gray-600 dark:text-gray-300">إجمالي الرسائل</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{mockMessages.filter(m => m.status === "delivered").length}</div>
            <div className="text-gray-600 dark:text-gray-300">تم التسليم</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">{mockMessages.filter(m => m.status === "read").length}</div>
            <div className="text-gray-600 dark:text-gray-300">مقروءة</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">{mockMessages.filter(m => m.status === "failed").length}</div>
            <div className="text-gray-600 dark:text-gray-300">فشل</div>
          </div>
        </div>

        <div className="card p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">فلتر الحالة</label>
              <select value={filter} onChange={(e) => setFilter(e.target.value as any)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent">
                <option value="all">جميع الحالات</option>
                <option value="sent">مرسل</option>
                <option value="delivered">تم التسليم</option>
                <option value="read">مقروء</option>
                <option value="failed">فشل</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">فلتر القناة</label>
              <select value={channelFilter} onChange={(e) => setChannelFilter(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent">
                <option value="all">جميع القنوات</option>
                <option value="whatsapp">واتساب</option>
                <option value="telegram">تيليجرام</option>
                <option value="facebook">فيسبوك</option>
                <option value="website">الموقع</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="w-full btn-brand py-2 rounded-lg text-white hover:bg-[var(--brand-primary-hover)] transition-colors">تطبيق الفلاتر</button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredMessages.map((message) => (
            <div key={message.id} className="card p-6 hover:shadow-soft transition-shadow">
              <div className="flex items-start gap-4">
                <div className="text-2xl">{getChannelIcon(message.channel)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{message.subject}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(message.status)}`}>
                      {getStatusText(message.status)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(message.priority)}`}>
                      {message.priority === "high" ? "عالي" : message.priority === "medium" ? "متوسط" : "منخفض"}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    <div className="flex items-center gap-4">
                      <span>من: {message.sender}</span>
                      <span>إلى: {message.recipient}</span>
                      <span>القناة: {getChannelText(message.channel)}</span>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">{message.content}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{message.createdAt}</span>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-[var(--brand-primary)] text-white text-sm rounded hover:bg-[var(--brand-primary-hover)] transition-colors">عرض</button>
                      <button className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50 transition-colors">إعادة إرسال</button>
                      <button className="px-3 py-1 border border-red-300 text-red-700 text-sm rounded hover:bg-red-50 transition-colors">حذف</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMessages.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"><span className="text-4xl">💬</span></div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">لا توجد رسائل</h3>
            <p className="text-gray-600 dark:text-gray-300">لا توجد رسائل مطابقة للفلتر المحدد</p>
          </div>
        )}
      </main>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">إرسال رسالة جديدة</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">المستقبل</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent" placeholder="اسم المستقبل" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">القناة</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent">
                    <option value="whatsapp">واتساب</option>
                    <option value="telegram">تيليجرام</option>
                    <option value="facebook">فيسبوك</option>
                    <option value="website">الموقع</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">الموضوع</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent" placeholder="موضوع الرسالة" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">المحتوى</label>
                <textarea rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent" placeholder="محتوى الرسالة"></textarea>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">إلغاء</button>
                <button type="submit" className="flex-1 btn-brand py-2 rounded-lg text-white hover:bg-[var(--brand-primary-hover)] transition-colors">إرسال الرسالة</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
