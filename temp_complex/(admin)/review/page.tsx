"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { RefreshCw, Search, ArrowLeft, BarChart, Settings } from "lucide-react";

export default function ReviewPage() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedConversation, setSelectedConversation] = useState<
    number | null
  >(null);

  const conversations = [
    {
      id: 1,
      customer: "أحمد محمد",
      channel: "واتساب",
      message: "شكراً لكم على المساعدة الممتازة",
      time: "منذ 5 دقائق",
      status: "positive",
      rating: 5,
      tags: ["ممتاز", "خدمة سريعة"],
    },
    {
      id: 2,
      customer: "فاطمة علي",
      channel: "تليجرام",
      message: "الخدمة كانت جيدة لكن يمكن تحسينها",
      time: "منذ 15 دقيقة",
      status: "neutral",
      rating: 3,
      tags: ["جيد", "يحتاج تحسين"],
    },
    {
      id: 3,
      customer: "محمد السعيد",
      channel: "فيسبوك",
      message: "لم أحصل على المساعدة المطلوبة",
      time: "منذ ساعة",
      status: "negative",
      rating: 2,
      tags: ["مشكلة", "يحتاج متابعة"],
    },
    {
      id: 4,
      customer: "سارة أحمد",
      channel: "إنستغرام",
      message: "خدمة رائعة! أنصح بها",
      time: "منذ ساعتين",
      status: "positive",
      rating: 5,
      tags: ["ممتاز", "توصية"],
    },
  ];

  const stats = [
    { title: "إجمالي المراجعات", value: "1,234", change: "+12%", trend: "up" },
    { title: "التقييم المتوسط", value: "4.2", change: "+0.3", trend: "up" },
    { title: "المراجعات الإيجابية", value: "89%", change: "+5%", trend: "up" },
    { title: "الردود المطلوبة", value: "23", change: "-8%", trend: "down" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "positive":
        return "text-green-500 bg-green-100 dark:bg-green-900";
      case "neutral":
        return "text-yellow-500 bg-yellow-100 dark:bg-yellow-900";
      case "negative":
        return "text-red-500 bg-red-100 dark:bg-red-900";
      default:
        return "text-gray-500 bg-gray-100 dark:bg-gray-900";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "positive":
        return "إيجابي";
      case "neutral":
        return "محايد";
      case "negative":
        return "سلبي";
      default:
        return "غير محدد";
    }
  };

  const filteredConversations = conversations.filter((conv) => {
    if (selectedFilter === "all") return true;
    return conv.status === selectedFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Page Intro */}
      <section className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-screen-xl px-4 py-4">
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
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  مركز المراجعة
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  مراجعة وتحليل المحادثات
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-300"
              >
                <ArrowLeft className="h-4 w-4" /> العودة للوحة التحكم
              </Link>
              <button className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <BarChart className="h-4 w-4" /> تقرير شامل
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-screen-xl px-4 py-6">
        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </h3>
                <span className="text-green-500">📈</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </span>
                <span
                  className={`text-sm font-medium ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}
                >
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Conversations List */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="border-b border-gray-200 p-6 dark:border-gray-800">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    المراجعات الحديثة
                  </h2>
                  <div className="flex items-center gap-2">
                    <button className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                      <RefreshCw className="h-4 w-4" /> تحديث
                    </button>
                    <button
                      className="rounded-md border border-gray-200 p-2 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800"
                      aria-label="Search"
                    >
                      <Search className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Filters */}
                <div className="flex gap-1">
                  {["all", "positive", "neutral", "negative"].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setSelectedFilter(filter)}
                      className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                        selectedFilter === filter
                          ? "bg-blue-600 text-white"
                          : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                      }`}
                    >
                      {filter === "all" && "الكل"}
                      {filter === "positive" && "إيجابي"}
                      {filter === "neutral" && "محايد"}
                      {filter === "negative" && "سلبي"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="divide-y divide-gray-200 dark:divide-gray-800">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`cursor-pointer p-6 transition-colors ${
                      selectedConversation === conversation.id
                        ? "border-e-4 border-blue-600 bg-blue-50 dark:bg-gray-800"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                    onClick={() =>
                      setSelectedConversation(
                        selectedConversation === conversation.id
                          ? null
                          : conversation.id,
                      )
                    }
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4 space-x-reverse">
                        <div className="relative">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                            {conversation.customer.charAt(0)}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="mb-1 flex items-center space-x-2 space-x-reverse">
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                              {conversation.customer}
                            </p>
                            <span className="text-sm text-gray-500">
                              {conversation.channel}
                            </span>
                          </div>
                          <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                            {conversation.message}
                          </p>
                          <div className="flex items-center gap-2">
                            <div
                              className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(conversation.status)}`}
                            >
                              {getStatusText(conversation.status)}
                            </div>
                            <div className="flex items-center space-x-1 space-x-reverse">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <span
                                  key={i}
                                  className={`text-sm ${i < conversation.rating ? "text-yellow-400" : "text-gray-300"}`}
                                >
                                  ⭐
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 space-x-reverse">
                        <span className="text-sm text-gray-500">
                          {conversation.time}
                        </span>
                        <button
                          className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
                          aria-label="Settings"
                        >
                          <Settings className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {selectedConversation === conversation.id && (
                      <div className="mt-4 border-t border-[var(--brand-border)] pt-4">
                        <div className="space-y-3">
                          <div>
                            <h4 className="mb-2 font-medium text-gray-900 dark:text-white">
                              التقييم التفصيلي
                            </h4>
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-bold text-yellow-500">
                                {conversation.rating}/5
                              </span>
                              <div className="flex items-center space-x-1 space-x-reverse">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <span
                                    key={i}
                                    className={`text-lg ${i < conversation.rating ? "text-yellow-400" : "text-gray-300"}`}
                                  >
                                    ⭐
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="mb-2 font-medium text-gray-900 dark:text-white">
                              العلامات
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {conversation.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="rounded-full bg-blue-50 px-2 py-1 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 space-x-reverse">
                            <button className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                              <RefreshCw className="h-4 w-4" /> إضافة رد
                            </button>
                            <button className="rounded-md border border-gray-200 px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800">
                              📊 تحليل
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                إجراءات سريعة
              </h3>
              <div className="space-y-3">
                <button className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--brand-primary)] px-4 py-3 font-medium text-white hover:bg-[var(--brand-primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-2">
                  📊 تقرير شامل
                </button>
                <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-brand-primary py-3 font-medium text-[var(--brand-primary)] transition-all duration-300 hover:bg-brand-primary hover:text-white">
                  📧 إرسال استطلاع
                </button>
                <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--brand-border)] py-3 font-medium text-gray-600 transition-colors hover:bg-[var(--brand-surface)]">
                  ⚙️ إعدادات المراجعة
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-[color:var(--background)]/70 rounded-xl border border-[var(--brand-border)] p-4 shadow-sm backdrop-blur">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                النشاط الأخير
              </h3>
              <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                <li className="flex items-center space-x-2 space-x-reverse">
                  <span>✅</span>
                  <span>تم تحليل 15 محادثة جديدة</span>
                </li>
                <li className="flex items-center space-x-2 space-x-reverse">
                  <span>📊</span>
                  <span>تم إنشاء تقرير أسبوعي</span>
                </li>
                <li className="flex items-center space-x-2 space-x-reverse">
                  <span>🔔</span>
                  <span>تنبيه: انخفاض في التقييمات</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
