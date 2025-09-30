"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Phone, Video, Settings, Send } from "lucide-react";

export default function ConversationsPage() {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const conversations = [
    {
      id: 1,
      customer: "أحمد محمد",
      channel: "واتساب",
      lastMessage: "شكراً لكم على المساعدة الممتازة",
      time: "منذ 5 دقائق",
      status: "active",
      unread: 2,
      avatar: "أ"
    },
    {
      id: 2,
      customer: "فاطمة علي",
      channel: "تليجرام",
      lastMessage: "هل يمكنني تغيير الموعد؟",
      time: "منذ 15 دقيقة",
      status: "pending",
      unread: 0,
      avatar: "ف"
    },
    {
      id: 3,
      customer: "محمد السعيد",
      channel: "فيسبوك",
      lastMessage: "متى سيكون المنتج متاحاً؟",
      time: "منذ ساعة",
      status: "resolved",
      unread: 0,
      avatar: "م"
    },
    {
      id: 4,
      customer: "سارة أحمد",
      channel: "إنستغرام",
      lastMessage: "أريد معرفة المزيد عن الخدمة",
      time: "منذ ساعتين",
      status: "active",
      unread: 1,
      avatar: "س"
    },
    {
      id: 5,
      customer: "خالد حسن",
      channel: "واتساب",
      lastMessage: "شكراً على الخدمة السريعة",
      time: "منذ 3 ساعات",
      status: "resolved",
      unread: 0,
      avatar: "خ"
    }
  ];

  const messages = [
    {
      id: 1,
      sender: "customer",
      message: "مرحباً، أريد الاستفسار عن المنتج الجديد",
      time: "10:30 ص",
      avatar: "أ"
    },
    {
      id: 2,
      sender: "agent",
      message: "مرحباً أحمد! أهلاً وسهلاً بك. كيف يمكنني مساعدتك اليوم؟",
      time: "10:31 ص",
      avatar: "م"
    },
    {
      id: 3,
      sender: "customer",
      message: "أريد معرفة تفاصيل المنتج الجديد وأسعاره",
      time: "10:32 ص",
      avatar: "أ"
    },
    {
      id: 4,
      sender: "agent",
      message: "بالطبع! المنتج الجديد يتميز بـ...",
      time: "10:33 ص",
      avatar: "م"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-green-500 bg-green-100 dark:bg-green-900";
      case "pending": return "text-yellow-500 bg-yellow-100 dark:bg-yellow-900";
      case "resolved": return "text-blue-500 bg-blue-100 dark:bg-blue-900";
      default: return "text-gray-500 bg-gray-100 dark:bg-gray-900";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active": return "نشط";
      case "pending": return "معلق";
      case "resolved": return "تم الحل";
      default: return "غير محدد";
    }
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || conv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const selectedConv = conversations.find(conv => conv.id === selectedConversation);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-[var(--brand-border)]">
        <div className="container-app px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 space-x-reverse">
              <Image
                src="/hemam-logo.jpg"
                alt="Hemam Logo"
                width={40}
                height={40}
                className="rounded-lg"
                unoptimized
              />
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">المحادثات</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">إدارة جميع المحادثات</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 space-x-reverse">
              <Link
                href="/dashboard"
                className="px-4 py-2 text-gray-600 hover:text-[var(--brand-primary)] transition-colors"
              >
                ← العودة للوحة التحكم
              </Link>
              <button className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-2 font-medium text-white bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--focus-ring)]">
                + محادثة جديدة
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Conversations List */}
        <div className="w-1/3 border-l border-[var(--brand-border)] bg-white dark:bg-slate-800">
          <div className="p-4 border-b border-[var(--brand-border)]">
            <div className="flex items-center space-x-2 space-x-reverse mb-4">
              <input
                type="text"
                placeholder="البحث في المحادثات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 py-2 px-3 border border-[var(--brand-border)] rounded-lg bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:border-[var(--brand-primary)]"
              />
              <button className="p-2 border border-[var(--brand-border)] rounded-lg hover:bg-[var(--brand-surface)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]" aria-label="Search">
                <Search className="h-4 w-4" />
              </button>
            </div>

            <div className="flex space-x-1 space-x-reverse">
              {["all", "active", "pending", "resolved"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    statusFilter === status
                    ? "bg-[var(--brand-primary)] text-white"
                    : "text-gray-600 hover:bg-[var(--brand-surface)] dark:text-gray-400"
                  }`}
                >
                  {status === "all" && "الكل"}
                  {status === "active" && "نشط"}
                  {status === "pending" && "معلق"}
                  {status === "resolved" && "تم الحل"}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-y-auto h-[calc(100vh-200px)]">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-4 border-b border-[var(--brand-border)] cursor-pointer transition-colors ${
                  selectedConversation === conversation.id
                    ? "bg-[color:var(--brand-primary)]/5 border-r-4 border-[var(--brand-primary)]"
                    : "hover:bg-[var(--brand-surface)]"
                }`}
                onClick={() => setSelectedConversation(conversation.id)}
              >
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="relative">
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-[var(--brand-primary)] font-semibold">
                      {conversation.avatar}
                    </div>
                    {conversation.unread > 0 && (
                      <span className="absolute -top-1 -right-1 bg-brand-error text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {conversation.unread}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {conversation.customer}
                      </p>
                      <span className="text-xs text-gray-500">{conversation.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate mb-1">
                      {conversation.lastMessage}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{conversation.channel}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(conversation.status)}`}>
                        {getStatusText(conversation.status)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConv ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-[var(--brand-border)] bg-white dark:bg-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-[var(--brand-primary)] font-semibold">
                      {selectedConv.avatar}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{selectedConv.customer}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{selectedConv.channel}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <button className="p-2 border border-[var(--brand-border)] rounded-lg hover:bg-[var(--brand-surface)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]" aria-label="Call">
                      <Phone className="h-4 w-4" />
                    </button>
                    <button className="p-2 border border-[var(--brand-border)] rounded-lg hover:bg-[var(--brand-surface)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]" aria-label="Video">
                      <Video className="h-4 w-4" />
                    </button>
                    <button className="p-2 border border-[var(--brand-border)] rounded-lg hover:bg-[var(--brand-surface)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]" aria-label="Settings">
                      <Settings className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-3 space-x-reverse ${
                      message.sender === "customer" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-semibold">
                      {message.avatar}
                    </div>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === "customer"
                        ? "bg-brand-primary text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                    }`}>
                      <p className="text-sm">{message.message}</p>
                      <p className="text-xs opacity-70 mt-1">{message.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-[var(--brand-border)] bg-white dark:bg-slate-800">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <button className="p-2 text-gray-600 hover:text-[var(--brand-primary)] transition-colors">
                    📎
                  </button>
                  <button className="p-2 text-gray-600 hover:text-[var(--brand-primary)] transition-colors">
                    😊
                  </button>
                  <input
                    type="text"
                    placeholder="اكتب رسالتك هنا..."
                    className="flex-1 py-2 px-3 border border-[var(--brand-border)] rounded-lg bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:border-[var(--brand-primary)]"
                  />
                  <button className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-2 font-medium text-white bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--focus-ring)]">
                    <Send className="h-4 w-4" /> إرسال
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">💬</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  اختر محادثة للبدء
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  اختر إحدى المحادثات من القائمة الجانبية لبدء المحادثة
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
