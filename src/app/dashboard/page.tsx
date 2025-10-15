"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Users, 
  Calendar, 
  MessageCircle, 
  FileText, 
  Bell, 
  Search,
  CheckCircle,
  TrendingUp,
  TrendingDown
} from "lucide-react";

// Dashboard Stats Data
const dashboardStats = [
  {
    id: 1,
    title: "إجمالي المرضى",
    value: "1,234",
    description: "مرضى مسجلين",
    change: "+12% من الشهر الماضي",
    changeType: "positive",
    icon: Users,
    color: "text-orange-500"
  },
  {
    id: 2,
    title: "المواعيد اليوم",
    value: "28",
    description: "مواعيد مجدولة",
    change: "+5% من الشهر الماضي",
    changeType: "positive",
    icon: Calendar,
    color: "text-orange-500"
  },
  {
    id: 3,
    title: "رسائل الشات بوت",
    value: "156",
    description: "ردود تلقائية",
    change: "+23% من الشهر الماضي",
    changeType: "positive",
    icon: MessageCircle,
    color: "text-orange-500"
  },
  {
    id: 4,
    title: "المطالبات المعلقة",
    value: "12",
    description: "تحتاج مراجعة",
    change: "-8% من الشهر الماضي",
    changeType: "negative",
    icon: FileText,
    color: "text-orange-500"
  }
];

// Treatment Types Data
const treatmentTypes = [
  { name: "العلاج الطبيعي", value: 45, color: "bg-blue-500" },
  { name: "العلاج الوظيفي", value: 30, color: "bg-green-500" },
  { name: "العلاج النفسي", value: 15, color: "bg-purple-500" },
  { name: "العلاج النطقي", value: 10, color: "bg-orange-500" }
];

// Recent Activity Data
const recentActivities = [
  {
    id: 1,
    type: "موعد جديد",
    description: "تم حجز موعد مع د. أحمد العتيبي",
    time: "منذ 5 دقائق",
    icon: Calendar,
    status: "success"
  },
  {
    id: 2,
    type: "مريض جديد",
    description: "تم تسجيل مريض جديد: فاطمة السعيد",
    time: "منذ 15 دقيقة",
    icon: Users,
    status: "success"
  },
  {
    id: 3,
    type: "رسالة شات بوت",
    description: "رد تلقائي على استفسار حول العلاج الطبيعي",
    time: "منذ 30 دقيقة",
    icon: MessageCircle,
    status: "success"
  }
];

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Top Header */}
      <header className="bg-[var(--panel)] border-b border-[var(--brand-border)] px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[var(--brand-primary)] rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">م</span>
              </div>
              <h1 className="text-xl font-bold text-[var(--foreground)]">لوحة التحكم</h1>
            </div>
            <div className="text-sm text-[var(--foreground)]/70">
              مرحباً بك في نظام إدارة مركز الهمم
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-[var(--foreground)]/70" />
              <span className="text-[var(--foreground)]">المستخدم</span>
              <span className="text-[var(--foreground)]/70">مدير النظام</span>
            </div>
            
            <div className="relative">
              <Bell className="w-5 h-5 text-[var(--foreground)]/70" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                5
              </span>
            </div>
            
            <div className="relative">
              <Search className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--foreground)]/50" />
              <input
                type="text"
                placeholder="بحث..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[var(--brand-surface)] border border-[var(--brand-border)] rounded-lg px-4 py-2 pr-10 text-[var(--foreground)] placeholder-[var(--foreground)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex">
        {/* Main Content Area */}
        <main className="flex-1 p-6">
          {/* Dashboard Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {dashboardStats.map((stat) => {
              const IconComponent = stat.icon;
              return (
                <div key={stat.id} className="bg-[var(--panel)] border border-[var(--brand-border)] rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <IconComponent className={`w-8 h-8 ${stat.color}`} />
                    <div className="flex items-center gap-1">
                      {stat.changeType === "positive" ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                      <span className={`text-sm ${
                        stat.changeType === "positive" ? "text-green-500" : "text-red-500"
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="text-sm text-[var(--foreground)]/70 mb-2">{stat.title}</h3>
                  <div className="text-3xl font-bold text-[var(--brand-primary)] mb-1">
                    {stat.value}
                  </div>
                  <p className="text-sm text-[var(--foreground)]/60">{stat.description}</p>
                </div>
              );
            })}
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Treatment Types Distribution */}
            <div className="bg-[var(--panel)] border border-[var(--brand-border)] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-6">
                توزيع أنواع العلاج
              </h3>
              
              <div className="flex items-center justify-center mb-6">
                <div className="relative w-48 h-48">
                  {/* Doughnut Chart Placeholder */}
                  <div className="w-full h-full rounded-full border-8 border-[var(--brand-border)] flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[var(--brand-primary)]">100</div>
                      <div className="text-sm text-[var(--foreground)]/70">إجمالي</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                {treatmentTypes.map((type, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${type.color}`}></div>
                      <span className="text-sm text-[var(--foreground)]">{type.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-[var(--foreground)]">{type.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-[var(--panel)] border border-[var(--brand-border)] rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-[var(--foreground)]">
                  النشاط الأخير
                </h3>
                <Link href="/activities" className="text-sm text-[var(--brand-primary)] hover:underline">
                  عرض الكل
                </Link>
              </div>
              
              <div className="space-y-4">
                {recentActivities.map((activity) => {
                  const IconComponent = activity.icon;
                  return (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <IconComponent className="w-5 h-5 text-[var(--foreground)]/70" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-[var(--foreground)]">
                            {activity.type}:
                          </span>
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        </div>
                        <p className="text-sm text-[var(--foreground)]/80 mb-1">
                          {activity.description}
                        </p>
                        <p className="text-xs text-[var(--foreground)]/60">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}