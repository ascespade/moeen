"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { useT } from "@/components/providers/I18nProvider";
import { Search, Phone, Video, Settings, Send } from "lucide-react";

export default function ConversationsPage() {
  const [selectedConversation, setSelectedConversation] = useState<
    number | null
  >(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { t } = useT();

  const conversations = [
    {
      id: 1,
      customer: "أحمد محمد",
      channel: "واتساب",
      lastMessage: "شكراً لكم على المساعدة الممتازة",
      time: "منذ 5 دقائق",
      status: "active",
      unread: 2,
      avatar: "أ",
    },
    {
      id: 2,
      customer: "فاطمة علي",
      channel: "تليجرام",
      lastMessage: "هل يمكنني تغيير الموعد؟",
      time: "منذ 15 دقيقة",
      status: "pending",
      unread: 0,
      avatar: "ف",
    },
    {
      id: 3,
      customer: "محمد السعيد",
      channel: "فيسبوك",
      lastMessage: "متى سيكون المنتج متاحاً؟",
      time: "منذ ساعة",
      status: "resolved",
      unread: 0,
      avatar: "م",
    },
    {
      id: 4,
      customer: "سارة أحمد",
      channel: "إنستغرام",
      lastMessage: "أريد معرفة المزيد عن الخدمة",
      time: "منذ ساعتين",
      status: "active",
      unread: 1,
      avatar: "س",
    },
    {
      id: 5,
      customer: "خالد حسن",
      channel: "واتساب",
      lastMessage: "شكراً على الخدمة السريعة",
      time: "منذ 3 ساعات",
      status: "resolved",
      unread: 0,
      avatar: "خ",
    },
  ];

  const messages = [
    {
      id: 1,
      sender: "customer",
      message: "مرحباً، أريد الاستفسار عن المنتج الجديد",
      time: "10:30 ص",
      avatar: "أ",
    },
    {
      id: 2,
      sender: "agent",
      message: "مرحباً أحمد! أهلاً وسهلاً بك. كيف يمكنني مساعدتك اليوم؟",
      time: "10:31 ص",
      avatar: "م",
    },
    {
      id: 3,
      sender: "customer",
      message: "أريد معرفة تفاصيل المنتج الجديد وأسعاره",
      time: "10:32 ص",
      avatar: "أ",
    },
    {
      id: 4,
      sender: "agent",
      message: "بالطبع! المنتج الجديد يتميز بـ...",
      time: "10:33 ص",
      avatar: "م",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-500 bg-green-100 dark:bg-green-900";
      case "pending":
        return "text-yellow-500 bg-yellow-100 dark:bg-yellow-900";
      case "resolved":
        return "text-blue-500 bg-blue-100 dark:bg-blue-900";
      default:
        return "text-gray-500 bg-gray-100 dark:bg-gray-900";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "نشط";
      case "pending":
        return "معلق";
      case "resolved":
        return "تم الحل";
      default:
        return "غير محدد";
    }
  };

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch =
      conv.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || conv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const selectedConv = conversations.find(
    (conv) => conv.id === selectedConversation,
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-screen-xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image
                src="/logo.png"
                alt="Hemam Logo"
                width={40}
                height={40}
                className="rounded-lg"
                unoptimized
              />
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t("nav.conversations", "المحادثات")}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t("conv.subtitle", "إدارة جميع المحادثات")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="px-4 py-2 text-gray-600 transition-colors dark:text-gray-300"
                style={{ color: "var(--brand-primary)" }}
              >
                ← {t("nav.dashboard", "لوحة التحكم")}
              </Link>
              <Button className="inline-flex items-center gap-2">
                + {t("conv.new", "محادثة جديدة")}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Conversations List */}
        <div className="w-1/3 border-s border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <div className="border-b border-gray-200 p-4 dark:border-gray-800">
            <div className="mb-4 flex items-center gap-2">
              <input
                type="text"
                placeholder={t("conv.search", "البحث في المحادثات...")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 rounded-md border border-gray-200 bg-white px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-800 dark:bg-gray-900 dark:placeholder-gray-500"
              />
              <button
                className="rounded-md border border-gray-200 p-2 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-800 dark:hover:bg-gray-800"
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>

            <div className="flex gap-1">
              {["all", "active", "pending", "resolved"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                    statusFilter === status
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                  }`}
                >
                  {status === "all" && t("conv.filter.all", "الكل")}
                  {status === "active" && t("conv.filter.active", "نشط")}
                  {status === "pending" && t("conv.filter.pending", "معلق")}
                  {status === "resolved" &&
                    t("conv.filter.resolved", "تم الحل")}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[calc(100vh-200px)] overflow-y-auto">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`cursor-pointer border-b border-gray-200 p-4 transition-colors dark:border-gray-800 ${
                  selectedConversation === conversation.id
                    ? "border-e-4 border-blue-600 bg-blue-50 dark:bg-gray-800"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
                onClick={() => setSelectedConversation(conversation.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                      {conversation.avatar}
                    </div>
                    {conversation.unread > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white">
                        {conversation.unread}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center justify-between">
                      <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                        {conversation.customer}
                      </p>
                      <span className="text-xs text-gray-500">
                        {conversation.time}
                      </span>
                    </div>
                    <p className="mb-1 truncate text-sm text-gray-600 dark:text-gray-400">
                      {conversation.lastMessage}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {conversation.channel}
                      </span>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(conversation.status)}`}
                      >
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
        <div className="flex flex-1 flex-col">
          {selectedConv ? (
            <>
              {/* Chat Header */}
              <div className="border-b border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                      {selectedConv.avatar}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {selectedConv.customer}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedConv.channel}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="rounded-md border border-gray-200 p-2 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-800 dark:hover:bg-gray-800"
                      aria-label="Call"
                    >
                      <Phone className="h-4 w-4" />
                    </button>
                    <button
                      className="rounded-md border border-gray-200 p-2 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-800 dark:hover:bg-gray-800"
                      aria-label="Video"
                    >
                      <Video className="h-4 w-4" />
                    </button>
                    <button
                      className="rounded-md border border-gray-200 p-2 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-800 dark:hover:bg-gray-800"
                      aria-label="Settings"
                    >
                      <Settings className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 space-y-4 overflow-y-auto p-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-3 ${
                      message.sender === "customer" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold dark:bg-gray-700">
                      {message.avatar}
                    </div>
                    <div
                      className={`max-w-xs rounded-md px-4 py-2 lg:max-w-md ${
                        message.sender === "customer"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
                      }`}
                    >
                      <p className="text-sm">{message.message}</p>
                      <p className="mt-1 text-xs opacity-70">{message.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="border-t border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-600 transition-colors hover:text-[var(--brand-primary)]">
                    📎
                  </button>
                  <button className="p-2 text-gray-600 transition-colors hover:text-[var(--brand-primary)]">
                    😊
                  </button>
                  <input
                    type="text"
                    placeholder="اكتب رسالتك هنا..."
                    className="flex-1 rounded-md border border-gray-200 bg-white px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-800 dark:bg-gray-900 dark:placeholder-gray-500"
                  />
                  <Button className="inline-flex items-center justify-center gap-2 px-6 py-2">
                    <Send className="h-4 w-4" /> إرسال
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <div className="text-center">
                <div className="mb-4 text-6xl">💬</div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
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
