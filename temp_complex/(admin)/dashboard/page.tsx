"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Bell, Settings, BarChart, MessageSquare, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useT } from "@/components/providers/I18nProvider";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
// import Link from "next/link"; // Unused import removed

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("all");
  const { t } = useT();
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            جاري التحميل...
          </p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const stats = [
    { title: "المرضى النشطون", value: "1,234", change: "+12%" },
    { title: "المواعيد اليوم", value: "45", change: "+8%" },
    { title: "معدل الرضا", value: "94%", change: "+2%" },
    { title: "وقت الانتظار", value: "15د", change: "-15%" },
  ];

  const conversations = [
    {
      id: 1,
      name: "أحمد محمد",
      channel: "واتساب",
      lastMessage: "شكراً لكم على العلاج",
      time: "منذ 5 دقائق",
      status: "new",
      unread: 2,
    },
    {
      id: 2,
      name: "فاطمة علي",
      channel: "واتساب",
      lastMessage: "هل يمكنني تغيير الموعد؟",
      time: "منذ 15 دقيقة",
      status: "pending",
      unread: 0,
    },
    {
      id: 3,
      name: "محمد السعيد",
      channel: "واتساب",
      lastMessage: "متى سيكون موعدي القادم؟",
      time: "منذ ساعة",
      status: "resolved",
      unread: 0,
    },
    {
      id: 4,
      name: "سارة أحمد",
      channel: "واتساب",
      lastMessage: "أريد معرفة المزيد عن العلاج",
      time: "منذ ساعتين",
      status: "new",
      unread: 1,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "text-red-500";
      case "pending":
        return "text-yellow-500";
      case "resolved":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Page Intro */}
      <section className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
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
                  مركز الهمم
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  لوحة التحكم الطبية
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="search"
                  placeholder="ابحث في المحادثات..."
                  className="block w-64 rounded-md border border-gray-200 bg-white py-2 pe-10 ps-3 text-sm text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:placeholder-gray-500"
                  className="py-2 pe-10 ps-3 block w-64 border border-gray-200 dark:border-gray-700 rounded-md text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <button
                className="relative p-2 text-gray-600 transition-colors dark:text-gray-300"
                className="relative p-2 text-gray-600 dark:text-gray-300 transition-colors"
                aria-label="Notifications"
                style={{ color: "var(--brand-primary)" }}
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--brand-error)] text-xs text-white">
                <span className="absolute -top-1 -right-1 bg-[var(--brand-error)] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </button>

              <button
                className="p-2 text-gray-600 transition-colors dark:text-gray-300"
                className="p-2 text-gray-600 dark:text-gray-300 transition-colors"
                aria-label="Settings"
                style={{ color: "var(--brand-primary)" }}
              >
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-screen-xl px-4 py-6">
        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </h3>
                  <BarChart className="h-5 w-5 text-green-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </span>
                  <span
                    className={`text-sm font-medium ${stat.change.includes("+") ? "text-green-600" : "text-red-600"}`}
                  >
                    {stat.change}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Conversations List */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                <div className="border-b border-gray-200 p-6 dark:border-gray-800">
                  <div className="mb-4 flex items-center justify-between">
                <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      المحادثات الطبية
                    </h2>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Button className="inline-flex items-center gap-2 text-sm">
                        ➕ محادثة جديدة
                      </Button>
                      <Button variant="secondary" className="h-10 w-10">
                        🔍
                      </Button>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="hs-tab flex gap-1">
                    {[
                      { id: "all", label: "الكل", count: 24 },
                      { id: "new", label: "جديدة", count: 8 },
                      { id: "pending", label: "معلقة", count: 12 },
                      { id: "resolved", label: "مكتملة", count: 4 },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                          activeTab === tab.id
                            ? "bg-blue-600 text-white"
                            : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          activeTab === tab.id
                            ? "bg-blue-600 text-white"
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                      >
                        {tab.label} ({tab.count})
                      </button>
                    ))}
                  </div>
                </div>

                {/* Conversations */}
                <div className="divide-y divide-gray-200 dark:divide-gray-800">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className="cursor-pointer p-6 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-primary)] font-semibold text-white">
                      className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold bg-[var(--brand-primary)]">
                            {conversation.name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2 space-x-reverse">
                              <h3 className="font-medium text-gray-900 dark:text-white">
                                {conversation.name}
                              </h3>
                              <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-blue-700 dark:bg-gray-800 dark:text-blue-300">
                                {conversation.channel}
                              </span>
                              {conversation.unread > 0 && (
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white">
                              <span className="text-xs bg-gray-100 dark:bg-gray-800 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                                {conversation.channel}
                              </span>
                              {conversation.unread > 0 && (
                                <span className="bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                  {conversation.unread}
                                </span>
                              )}
                            </div>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {conversation.lastMessage}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div
                            className={`flex items-center space-x-1 space-x-reverse ${getStatusColor(conversation.status)}`}
                          >
                            <span className="text-sm font-medium capitalize">
                              {conversation.status}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {conversation.time}
                          </span>
                          <button className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-800">
                          <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                            ⚙️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardContent className="p-4">
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                  إجراءات سريعة
                </h3>
                <div className="space-y-3">
                  <Button className="inline-flex w-full items-center justify-center gap-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  إجراءات سريعة
                </h3>
                <div className="space-y-3">
                  <Button className="w-full inline-flex items-center justify-center gap-2">
                    <MessageSquare className="h-5 w-5" /> بدء محادثة طبية
                  </Button>
                  <Button
                    variant="secondary"
                    className="inline-flex w-full items-center justify-center gap-2"
                    className="w-full inline-flex items-center justify-center gap-2"
                  >
                    <Users className="h-5 w-5" /> إدارة المرضى
                  </Button>
                  <Button
                    variant="secondary"
                    className="inline-flex w-full items-center justify-center gap-2"
                    className="w-full inline-flex items-center justify-center gap-2"
                  >
                    <BarChart className="h-5 w-5" /> التقارير الطبية
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardContent className="p-4">
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  النشاط الطبي
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-2 h-2 w-2 rounded-full bg-green-500"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        تم إكمال جلسة علاج مع أحمد محمد
                      </p>
                      <span className="text-xs text-gray-500">
                        منذ 10 دقائق
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-2 h-2 w-2 rounded-full bg-yellow-500"></div>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        موعد جديد مع فاطمة علي
                      </p>
                      <span className="text-xs text-gray-500">
                        منذ 25 دقيقة
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-2 h-2 w-2 rounded-full bg-blue-600"></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        تم إنشاء تقرير طبي شهري
                      </p>
                      <span className="text-xs text-gray-500">منذ ساعة</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
