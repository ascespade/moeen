"use client";

import { useState } from "react";
import Image from "next/image";
import { Bell, Settings, BarChart, MessageSquare, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
// import Link from "next/link"; // Unused import removed

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("all");

  const stats = [
    { title: "المحادثات", value: "1,234", change: "+12%" },
    { title: "العملاء", value: "456", change: "+8%" },
    { title: "الاستجابة", value: "94%", change: "+2%" },
    { title: "الوقت", value: "2.3د", change: "-15%" },
  ];

  const conversations = [
    { id: 1, name: "أحمد محمد", channel: "واتساب", lastMessage: "شكراً لكم على المساعدة", time: "منذ 5 دقائق", status: "new", unread: 2 },
    { id: 2, name: "فاطمة علي", channel: "تليجرام", lastMessage: "هل يمكنني تغيير الموعد؟", time: "منذ 15 دقيقة", status: "pending", unread: 0 },
    { id: 3, name: "محمد السعيد", channel: "فيسبوك", lastMessage: "متى سيكون المنتج متاحاً؟", time: "منذ ساعة", status: "resolved", unread: 0 },
    { id: 4, name: "سارة أحمد", channel: "إنستغرام", lastMessage: "أريد معرفة المزيد عن الخدمة", time: "منذ ساعتين", status: "new", unread: 1 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "text-red-500";
      case "pending": return "text-yellow-500";
      case "resolved": return "text-green-500";
      default: return "text-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Page Intro */}
      <section className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
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
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">مُعين</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">لوحة التحكم</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <input type="search" placeholder="ابحث في المحادثات..." className="py-2 pe-10 ps-3 block w-64 border border-gray-200 dark:border-gray-700 rounded-md text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
              </div>

              <button className="relative p-2 text-gray-600 dark:text-gray-300 transition-colors" aria-label="Notifications" style={{ color: "var(--brand-primary)" }}>
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-[var(--brand-error)] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
              </button>

              <button className="p-2 text-gray-600 dark:text-gray-300 transition-colors" aria-label="Settings" style={{ color: "var(--brand-primary)" }}>
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</h3>
                  <BarChart className="h-5 w-5 text-green-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</span>
                  <span className={`text-sm font-medium ${stat.change.includes('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversations List */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
              <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">المحادثات الحديثة</h2>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Button className="inline-flex items-center gap-2 text-sm">➕ محادثة جديدة</Button>
                    <Button variant="secondary" className="h-10 w-10">🔍</Button>
                  </div>
                </div>

                {/* Tabs */}
                <div className="hs-tab flex gap-1">
                  {[
                    { id: "all", label: "الكل", count: 24 },
                    { id: "new", label: "جديدة", count: 8 },
                    { id: "pending", label: "معلقة", count: 12 },
                    { id: "resolved", label: "محلولة", count: 4 },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab.id
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
                  <div key={conversation.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold bg-[var(--brand-primary)]">
                          {conversation.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <h3 className="font-medium text-gray-900 dark:text-white">{conversation.name}</h3>
                            <span className="text-xs bg-gray-100 dark:bg-gray-800 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                              {conversation.channel}
                            </span>
                            {conversation.unread > 0 && (
                              <span className="bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {conversation.unread}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{conversation.lastMessage}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className={`flex items-center space-x-1 space-x-reverse ${getStatusColor(conversation.status)}`}>
                          <span className="text-sm font-medium capitalize">{conversation.status}</span>
                        </div>
                        <span className="text-sm text-gray-500">{conversation.time}</span>
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
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">إجراءات سريعة</h3>
              <div className="space-y-3">
                <Button className="w-full inline-flex items-center justify-center gap-2"><MessageSquare className="h-5 w-5" /> بدء محادثة جديدة</Button>
                <Button variant="secondary" className="w-full inline-flex items-center justify-center gap-2"><Users className="h-5 w-5" /> إدارة العملاء</Button>
                <Button variant="secondary" className="w-full inline-flex items-center justify-center gap-2"><BarChart className="h-5 w-5" /> عرض التقارير</Button>
              </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardContent className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">النشاط الأخير</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">تم حل محادثة مع أحمد محمد</p>
                    <span className="text-xs text-gray-500">منذ 10 دقائق</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">محادثة جديدة من فاطمة علي</p>
                    <span className="text-xs text-gray-500">منذ 25 دقيقة</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">تم إنشاء تقرير شهري</p>
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
