"use client";

import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

  BarChart3,
} from "lucide-react";

export default function UserDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }
  }, [isAuthenticated, isLoading, router]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    document.title = "Dashboard - مُعين";
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[var(--brand-surface)] via-white to-[var(--bg-surface)]">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] shadow-lg">
            <span className="text-2xl font-bold text-white">م</span>
          </div>
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[var(--brand-primary)] border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            جاري التحميل...
          </p>
        </div>
      </div>
    );

  if (!isAuthenticated) {
    return null;

  const stats = [
      title: "المواعيد القادمة",
      value: "3",
      change: "+2 هذا الأسبوع",
      icon: Calendar,
      color: "text-brand-primary",
      bgColor: "bg-blue-100",
    },
      title: "الملفات الطبية",
      value: "12",
      change: "تم تحديث 2 ملف",
      icon: FileText,
      color: "text-brand-success",
      bgColor: "bg-green-100",
    },
      title: "الإشعارات",
      value: "5",
      change: "3 جديدة",
      icon: Bell,
      color: "text-brand-primary",
      bgColor: "bg-orange-100",
    },
      title: "الوقت المتبقي",
      value: "2س 30د",
      change: "حتى الموعد التالي",
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  const recentActivities = [
      id: 1,
      title: "تم تأكيد موعدك مع د. أحمد محمد",
      time: "منذ 2 ساعة",
      type: "appointment",
      status: "confirmed",
  },
  {
    id: 2,
      title: "تم تحديث ملفك الطبي",
      time: "منذ 4 ساعات",
      type: "medical",
      status: "updated",
  },
  {
    id: 3,
      title: "إشعار جديد: تذكير بموعد غد",
      time: "منذ 6 ساعات",
      type: "notification",
      status: "new",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--brand-surface)] via-white to-[var(--bg-surface)]">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="h-8 w-8 bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">م</span>
                </div>
                <h1 className="ml-3 text-xl font-semibold text-gray-900 dark:text-white">
                  لوحة التحكم
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                الإعدادات
              </Button>
              <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700">
                  {user?.name?.charAt(0) || "U"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            مرحباً، {user?.name || "مستخدم"}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            إليك نظرة عامة على نشاطك اليوم
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-500">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  النشاط الأخير
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start space-x-3 p-3 rounded-lg hover:bg-surface dark:hover:bg-gray-800"
                    >
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-brand-primary" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {activity.title}
                        </p>
                        <p className="text-sm text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>الإجراءات السريعة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  حجز موعد جديد
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  عرض الملفات الطبية
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  التواصل مع الطبيب
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  تحديث البيانات
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
