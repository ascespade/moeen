"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("muayin_user");
    if (!userData) {
      router.push("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } catch (error) {
      console.error("Error parsing user data:", error);
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("muayin_user");
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Image
                src="/logo.svg"
                alt="مركز الهمم"
                width={32}
                height={32}
                className="rounded-full"
              />
              <h1 className="mr-3 text-xl font-bold text-gray-900">مُعين</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                مرحباً، {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">لوحة التحكم</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* User Info Card */}
            <div className="bg-gradient-to-r from-emerald-500 to-blue-600 rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">معلومات المستخدم</h3>
              <p className="text-sm opacity-90">البريد: {user.email}</p>
              <p className="text-sm opacity-90">الدور: {user.role}</p>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">إجراءات سريعة</h3>
              <div className="space-y-2">
                <button className="w-full text-right px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors">
                  إدارة المحادثات
                </button>
                <button className="w-full text-right px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                  التقارير
                </button>
                <button className="w-full text-right px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
                  الإعدادات
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">الإحصائيات</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">المحادثات النشطة</span>
                  <span className="font-semibold text-emerald-600">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">الرسائل اليوم</span>
                  <span className="font-semibold text-blue-600">45</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">المستخدمون الجدد</span>
                  <span className="font-semibold text-purple-600">8</span>
                </div>
              </div>
            </div>
          </div>

          {/* Welcome Message */}
          <div className="mt-8 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg p-6 border border-emerald-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">مرحباً بك في نظام مُعين</h3>
            <p className="text-gray-600">
              نظام ذكي متكامل يجمع بين التكنولوجيا المتقدمة والرعاية الإنسانية لخدمة مجتمع مركز الهمم.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
