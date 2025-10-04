"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useT } from "@/components/providers/I18nProvider";
import Button from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import EmptyState from "@/components/common/EmptyState";
import StatusBanner from "@/components/common/StatusBanner";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
}

interface DashboardStats {
  totalUsers: number;
  activeConversations: number;
  messagesToday: number;
  responseTime: number;
}

interface RecentActivity {
  id: string;
  type: string;
  message: string;
  time: string;
  status: "success" | "warning" | "error";
}

export default function DashboardPage() {
  const router = useRouter();
  const { t } = useT();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeConversations: 0,
    messagesToday: 0,
    responseTime: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    const userData = localStorage.getItem("muayin_user");
    if (!userData) {
      router.push("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Load dashboard data
      loadDashboardData();
    } catch (error) {
      console.error("Error parsing user data:", error);
      localStorage.removeItem("muayin_user");
      localStorage.removeItem("muayin_token");
      router.push("/login");
    }
  }, [router]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Simulate API call to get dashboard data
      const response = await fetch("/api/dashboard/stats", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("muayin_token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setRecentActivity(data.recentActivity);
      } else {
        // Use mock data if API fails
        setStats({
          totalUsers: 156,
          activeConversations: 23,
          messagesToday: 89,
          responseTime: 2.3,
        });
        setRecentActivity([
          {
            id: "1",
            type: "message",
            message: "رسالة جديدة من العميل أحمد",
            time: "منذ 5 دقائق",
            status: "success",
          },
          {
            id: "2",
            type: "system",
            message: "تم تحديث النظام بنجاح",
            time: "منذ 15 دقيقة",
            status: "success",
          },
          {
            id: "3",
            type: "warning",
            message: "تحذير: استجابة بطيئة",
            time: "منذ 30 دقيقة",
            status: "warning",
          },
        ]);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      // Use mock data on error
      setStats({
        totalUsers: 156,
        activeConversations: 23,
        messagesToday: 89,
        responseTime: 2.3,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("muayin_user");
    localStorage.removeItem("muayin_token");
    router.push("/login");
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "new_conversation":
        router.push("/conversations/new");
        break;
      case "view_reports":
        router.push("/reports");
        break;
      case "settings":
        router.push("/settings");
        break;
      case "admin":
        router.push("/admin/dashboard");
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <EmptyState
          title="غير مصرح لك"
          description="يجب تسجيل الدخول أولاً"
          action={{
            label: "تسجيل الدخول",
            onClick: () => router.push("/login"),
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">م</span>
              </div>
              <div className="mr-3">
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  مُعين - لوحة التحكم
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  مرحباً، {user.name}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <Badge variant="success" className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full ml-2"></div>
                متصل
              </Badge>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-800"
              >
                تسجيل الخروج
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Banner */}
        <StatusBanner
          type="info"
          message="مرحباً بك في لوحة التحكم! يمكنك إدارة المحادثات والمراقبة من هنا."
          className="mb-6"
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <span className="text-2xl">👥</span>
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">إجمالي المستخدمين</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <span className="text-2xl">💬</span>
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">محادثات نشطة</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeConversations}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <span className="text-2xl">📨</span>
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">رسائل اليوم</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.messagesToday}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <span className="text-2xl">⏱️</span>
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">وقت الاستجابة</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.responseTime}د</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              إجراءات سريعة
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => handleQuickAction("new_conversation")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                محادثة جديدة
              </Button>
              <Button
                onClick={() => handleQuickAction("view_reports")}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                التقارير
              </Button>
              <Button
                onClick={() => handleQuickAction("settings")}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white"
              >
                الإعدادات
              </Button>
              {user.role === "admin" && (
                <Button
                  onClick={() => handleQuickAction("admin")}
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                  لوحة الإدارة
                </Button>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              النشاط الأخير
            </h3>
            <div className="space-y-3">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className={`w-2 h-2 rounded-full ml-3 ${
                      activity.status === "success" ? "bg-green-500" :
                      activity.status === "warning" ? "bg-yellow-500" : "bg-red-500"
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-white">{activity.message}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState
                  title="لا يوجد نشاط"
                  description="لم يتم تسجيل أي نشاط مؤخراً"
                />
              )}
            </div>
          </Card>
        </div>

        {/* User Info */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            معلومات المستخدم
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                الاسم
              </label>
              <p className="text-gray-900 dark:text-white">{user.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                البريد الإلكتروني
              </label>
              <p className="text-gray-900 dark:text-white">{user.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                الدور
              </label>
              <Badge variant="primary">{user.role}</Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}