"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { RefreshCw, Search, ArrowLeft, BarChart, Settings } from "lucide-react";

export default function ReviewPage() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);

  const conversations = [
    {
      id: 1,
      customer: "أحمد محمد",
      channel: "واتساب",
      message: "شكراً لكم على المساعدة الممتازة",
      time: "منذ 5 دقائق",
      status: "positive",
      rating: 5,
      tags: ["ممتاز", "خدمة سريعة"]
    },
    {
      id: 2,
      customer: "فاطمة علي",
      channel: "تليجرام",
      message: "الخدمة كانت جيدة لكن يمكن تحسينها",
      time: "منذ 15 دقيقة",
      status: "neutral",
      rating: 3,
      tags: ["جيد", "يحتاج تحسين"]
    },
    {
      id: 3,
      customer: "محمد السعيد",
      channel: "فيسبوك",
      message: "لم أحصل على المساعدة المطلوبة",
      time: "منذ ساعة",
      status: "negative",
      rating: 2,
      tags: ["مشكلة", "يحتاج متابعة"]
    },
    {
      id: 4,
      customer: "سارة أحمد",
      channel: "إنستغرام",
      message: "خدمة رائعة! أنصح بها",
      time: "منذ ساعتين",
      status: "positive",
      rating: 5,
      tags: ["ممتاز", "توصية"]
    }
  ];

  const stats = [
    { title: "إجمالي المراجعات", value: "1,234", change: "+12%", trend: "up" },
    { title: "التقييم المتوسط", value: "4.2", change: "+0.3", trend: "up" },
    { title: "المراجعات الإيجابية", value: "89%", change: "+5%", trend: "up" },
    { title: "الردود المطلوبة", value: "23", change: "-8%", trend: "down" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "positive": return "text-green-500 bg-green-100 dark:bg-green-900";
      case "neutral": return "text-yellow-500 bg-yellow-100 dark:bg-yellow-900";
      case "negative": return "text-red-500 bg-red-100 dark:bg-red-900";
      default: return "text-gray-500 bg-gray-100 dark:bg-gray-900";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "positive": return "إيجابي";
      case "neutral": return "محايد";
      case "negative": return "سلبي";
      default: return "غير محدد";
    }
  };

  const filteredConversations = conversations.filter(conv => {
    if (selectedFilter === "all") return true;
    return conv.status === selectedFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Page Intro */}
      <section className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image
                src="/logo.svg"
                alt="Hemam Logo"
                width={40}
                height={40}
                className="rounded-lg"
                unoptimized
              />
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">مركز المراجعة</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">مراجعة وتحليل المحادثات</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors inline-flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" /> العودة للوحة التحكم
              </Link>
              <button className="inline-flex items-center justify-center gap-2 rounded-md px-6 py-2 font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <BarChart className="h-4 w-4" /> تقرير شامل
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</h3>
                <span className="text-green-500">📈</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</span>
                <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversations List */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
              <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">المراجعات الحديثة</h2>
                  <div className="flex items-center gap-2">
                    <button className="px-4 py-2 rounded-md text-sm font-medium inline-flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      <RefreshCw className="h-4 w-4" /> تحديث
                    </button>
                    <button className="p-2 border border-gray-200 dark:border-gray-800 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" aria-label="Search">
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
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${selectedFilter === filter
                          ? "bg-blue-600 text-white"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
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
                    className={`p-6 cursor-pointer transition-colors ${selectedConversation === conversation.id
                        ? "bg-blue-50 dark:bg-gray-800 border-e-4 border-blue-600"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    onClick={() => setSelectedConversation(selectedConversation === conversation.id ? null : conversation.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4 space-x-reverse">
                        <div className="relative">
                          <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-300 font-semibold">
                            {conversation.customer.charAt(0)}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 space-x-reverse mb-1">
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">{conversation.customer}</p>
                            <span className="text-sm text-gray-500">{conversation.channel}</span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{conversation.message}</p>
                          <div className="flex items-center gap-2">
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(conversation.status)}`}>
                              {getStatusText(conversation.status)}
                            </div>
                            <div className="flex items-center space-x-1 space-x-reverse">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <span key={i} className={`text-sm ${i < conversation.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                                  ⭐
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 space-x-reverse">
                        <span className="text-sm text-gray-500">{conversation.time}</span>
                        <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded" aria-label="Settings">
                          <Settings className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {selectedConversation === conversation.id && (
                      <div className="mt-4 pt-4 border-t border-[var(--brand-border)]">
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">التقييم التفصيلي</h4>
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-bold text-yellow-500">{conversation.rating}/5</span>
                              <div className="flex items-center space-x-1 space-x-reverse">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <span key={i} className={`text-lg ${i < conversation.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                                    ⭐
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">العلامات</h4>
                            <div className="flex flex-wrap gap-2">
                              {conversation.tags.map((tag, index) => (
                                <span key={index} className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 space-x-reverse">
                            <button className="px-4 py-2 rounded-md text-sm inline-flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                              <RefreshCw className="h-4 w-4" /> إضافة رد
                            </button>
                            <button className="px-4 py-2 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md text-sm transition-colors">
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
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">إجراءات سريعة</h3>
              <div className="space-y-3">
                <button className="w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 font-medium text-white bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--focus-ring)]">
                  📊 تقرير شامل
                </button>
                <button className="w-full border border-brand-primary text-[var(--brand-primary)] hover:bg-brand-primary hover:text-white py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2">
                  📧 إرسال استطلاع
                </button>
                <button className="w-full border border-[var(--brand-border)] text-gray-600 hover:bg-[var(--brand-surface)] py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                  ⚙️ إعدادات المراجعة
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="rounded-xl border border-[var(--brand-border)] bg-[color:var(--background)]/70 backdrop-blur p-4 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">النشاط الأخير</h3>
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
