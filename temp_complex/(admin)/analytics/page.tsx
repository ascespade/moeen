"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Calendar,
  MessageSquare,
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
} from "lucide-react";

interface AnalyticsData {
  patients: {
    total: number;
    newLast30Days: number;
    newLast7Days: number;
  };
  appointments: {
    total: number;
    recent: number;
    completed: number;
    cancelled: number;
  };
  sessions: {
    total_sessions: number;
    completed_sessions: number;
    recent_sessions: number;
  };
  conversations: {
    total: number;
    crisis: number;
    recent: number;
  };
  systemHealth: {
    status: string;
    connected: boolean;
  };
}

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("30");
  const [selectedType, setSelectedType] = useState("overview");

  useEffect(() => {
    fetchAnalytics();
  }, [selectedPeriod, selectedType]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/analytics/dashboard?period=${selectedPeriod}&type=${selectedType}`,
      );
      const data = await response.json();

      if (data.success) {
        setAnalyticsData(data.data);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-32 w-32 animate-spin rounded-full border-b-2 border-orange-500"></div>
          <p className="mt-4 text-gray-600">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                لوحة التحليلات
              </h1>
              <p className="text-gray-600">مركز الهمم - إحصائيات شاملة</p>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
              >
                <option value="7">آخر 7 أيام</option>
                <option value="30">آخر 30 يوم</option>
                <option value="90">آخر 90 يوم</option>
                <option value="365">آخر سنة</option>
              </select>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
              >
                <option value="overview">نظرة عامة</option>
                <option value="patients">المرضى</option>
                <option value="appointments">المواعيد</option>
                <option value="conversations">المحادثات</option>
                <option value="crisis">الأزمات</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {analyticsData && (
          <>
            {/* Overview Cards */}
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl bg-white p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      إجمالي المرضى
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {analyticsData.patients.total}
                    </p>
                    <p className="text-sm text-green-600">
                      +{analyticsData.patients.newLast30Days} هذا الشهر
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-white p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      المواعيد
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {analyticsData.appointments.recent}
                    </p>
                    <p className="text-sm text-green-600">
                      {analyticsData.appointments.completed} مكتملة
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                    <Calendar className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-white p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      المحادثات
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {analyticsData.conversations.recent}
                    </p>
                    <p className="text-sm text-orange-600">
                      {analyticsData.conversations.crisis} أزمة
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
                    <MessageSquare className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-white p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">الجلسات</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {analyticsData.sessions.total_sessions}
                    </p>
                    <p className="text-sm text-green-600">
                      {analyticsData.sessions.completed_sessions} مكتملة
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                    <Activity className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* System Health */}
            <div className="mb-8 rounded-xl bg-white p-6 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  حالة النظام
                </h3>
                <div
                  className={`rounded-full px-3 py-1 text-sm font-medium ${
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    analyticsData.systemHealth.status === "healthy"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {analyticsData.systemHealth.status === "healthy"
                    ? "سليم"
                    : "مشكلة"}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div
                    className={`h-3 w-3 rounded-full ${
                    className={`w-3 h-3 rounded-full ${
                      analyticsData.systemHealth.connected
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  ></div>
                  <span className="text-sm text-gray-600">
                    اتصال قاعدة البيانات
                  </span>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-600">
                    خدمة الذكاء الاصطناعي
                  </span>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-600">تكامل واتساب</span>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Patient Growth Chart */}
              <div className="rounded-xl bg-white p-6 shadow-lg">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    نمو المرضى
                  </h3>
                  <TrendingUp className="h-5 w-5 text-green-600" />
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    نمو المرضى
                  </h3>
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex h-64 items-center justify-center rounded-lg bg-gray-50">
                  <div className="text-center">
                    <BarChart3 className="mx-auto mb-2 h-12 w-12 text-gray-400" />
                    <p className="text-gray-500">رسم بياني لنمو المرضى</p>
                  </div>
                </div>
              </div>

              {/* Appointment Status Chart */}
              <div className="rounded-xl bg-white p-6 shadow-lg">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    حالة المواعيد
                  </h3>
                  <PieChart className="h-5 w-5 text-blue-600" />
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    حالة المواعيد
                  </h3>
                  <PieChart className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex h-64 items-center justify-center rounded-lg bg-gray-50">
                  <div className="text-center">
                    <PieChart className="mx-auto mb-2 h-12 w-12 text-gray-400" />
                    <p className="text-gray-500">رسم بياني لحالة المواعيد</p>
                  </div>
                </div>
              </div>

              {/* Conversation Trends */}
              <div className="rounded-xl bg-white p-6 shadow-lg">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    اتجاهات المحادثات
                  </h3>
                  <LineChart className="h-5 w-5 text-orange-600" />
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    اتجاهات المحادثات
                  </h3>
                  <LineChart className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex h-64 items-center justify-center rounded-lg bg-gray-50">
                  <div className="text-center">
                    <LineChart className="mx-auto mb-2 h-12 w-12 text-gray-400" />
                    <LineChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">
                      رسم بياني لاتجاهات المحادثات
                    </p>
                  </div>
                </div>
              </div>

              {/* Crisis Response Times */}
              <div className="rounded-xl bg-white p-6 shadow-lg">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    أوقات الاستجابة للأزمات
                  </h3>
                  <Clock className="h-5 w-5 text-red-600" />
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    أوقات الاستجابة للأزمات
                  </h3>
                  <Clock className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex h-64 items-center justify-center rounded-lg bg-gray-50">
                  <div className="text-center">
                    <Clock className="mx-auto mb-2 h-12 w-12 text-gray-400" />
                    <p className="text-gray-500">رسم بياني لأوقات الاستجابة</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="mt-8 rounded-xl bg-white p-6 shadow-lg">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
            <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                النشاط الأخير
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 space-x-reverse rounded-lg bg-gray-50 p-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      تم إكمال جلسة علاج طبيعي
                    </p>
                    <p className="text-xs text-gray-500">
                      أحمد محمد - منذ 2 ساعة
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse rounded-lg bg-gray-50 p-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      تم حجز موعد جديد
                    </p>
                    <p className="text-xs text-gray-500">
                      فاطمة علي - منذ 4 ساعات
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse rounded-lg bg-gray-50 p-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
                    <MessageSquare className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      محادثة جديدة مع المساعد الذكي
                    </p>
                    <p className="text-xs text-gray-500">
                      سارة أحمد - منذ 6 ساعات
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
