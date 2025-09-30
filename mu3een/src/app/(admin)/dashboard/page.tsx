"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
// Icons removed for performance

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
    <div className="min-h-screen bg-brand-surface">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-brand-border">
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
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">مُعين</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">لوحة التحكم</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="relative">
                <input
                  type="text"
                  placeholder="البحث في المحادثات..."
                  className="pr-10 pl-4 py-2 border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent w-64"
                />
              </div>
              
              <button className="relative p-2 text-gray-600 hover:text-brand-primary transition-colors">
                🔔
                <span className="absolute -top-1 -right-1 bg-brand-error text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
              </button>
              
              <button className="p-2 text-gray-600 hover:text-brand-primary transition-colors">
                ⚙️
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container-app px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="card card-pad shadow-soft">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</h3>
                <span className="text-green-500">📈</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</span>
                <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-brand-success' : 'text-brand-error'}`}>
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversations List */}
          <div className="lg:col-span-2">
            <div className="card shadow-soft">
              <div className="p-6 border-b border-brand-border">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">المحادثات الحديثة</h2>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <button className="btn-brand px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                      ➕ محادثة جديدة
                    </button>
                    <button className="p-2 border border-brand-border rounded-lg hover:bg-brand-surface transition-colors">
                      🔍
                    </button>
                  </div>
                </div>
                
                {/* Tabs */}
                <div className="flex space-x-1 space-x-reverse">
                  {[
                    { id: "all", label: "الكل", count: 24 },
                    { id: "new", label: "جديدة", count: 8 },
                    { id: "pending", label: "معلقة", count: 12 },
                    { id: "resolved", label: "محلولة", count: 4 },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === tab.id
                          ? "bg-brand-primary text-white"
                          : "text-gray-600 hover:text-brand-primary hover:bg-brand-surface"
                      }`}
                    >
                      {tab.label} ({tab.count})
                    </button>
                  ))}
                </div>
              </div>

              {/* Conversations */}
              <div className="divide-y divide-brand-border">
                {conversations.map((conversation) => (
                  <div key={conversation.id} className="p-6 hover:bg-brand-surface transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 space-x-reverse">
                        <div className="w-12 h-12 bg-brand-gradient rounded-full flex items-center justify-center text-white font-semibold">
                          {conversation.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <h3 className="font-medium text-gray-900 dark:text-white">{conversation.name}</h3>
                            <span className="text-xs bg-brand-surface text-brand-primary px-2 py-1 rounded-full">
                              {conversation.channel}
                            </span>
                            {conversation.unread > 0 && (
                              <span className="bg-brand-error text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {conversation.unread}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{conversation.lastMessage}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <div className={`flex items-center space-x-1 space-x-reverse ${getStatusColor(conversation.status)}`}>
                          <span className="text-sm font-medium capitalize">{conversation.status}</span>
                        </div>
                        <span className="text-sm text-gray-500">{conversation.time}</span>
                        <button className="p-1 hover:bg-brand-surface rounded">
                          ⚙️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="card card-pad shadow-soft">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">إجراءات سريعة</h3>
              <div className="space-y-3">
                <button className="w-full btn-brand py-3 rounded-lg font-medium flex items-center justify-center gap-2">
                  💬 بدء محادثة جديدة
                </button>
                <button className="w-full border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2">
                  👥 إدارة العملاء
                </button>
                <button className="w-full border border-brand-border text-gray-600 hover:bg-brand-surface py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                  📊 عرض التقارير
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card card-pad shadow-soft">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">النشاط الأخير</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 space-x-reverse">
                  <div className="w-2 h-2 bg-brand-success rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">تم حل محادثة مع أحمد محمد</p>
                    <span className="text-xs text-gray-500">منذ 10 دقائق</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3 space-x-reverse">
                  <div className="w-2 h-2 bg-brand-warning rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">محادثة جديدة من فاطمة علي</p>
                    <span className="text-xs text-gray-500">منذ 25 دقيقة</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3 space-x-reverse">
                  <div className="w-2 h-2 bg-brand-primary rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">تم إنشاء تقرير شهري</p>
                    <span className="text-xs text-gray-500">منذ ساعة</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
