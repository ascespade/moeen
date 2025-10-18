"use client";

import React, { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";

BarChart3,
} from "lucide-react";

interface AnalyticsData {
  overview: {
    totalPatients: number;
    activePatients: number;
    totalAppointments: number;
    completedAppointments: number;
    totalSessions: number;
    averageProgress: number;
    revenue: number;
    growthRate: number;
  };
  patientAnalytics: {
    byAge: Array<{ age: string; count: number }>;
    byCondition: Array<{ condition: string; count: number }>;
    byGender: Array<{ gender: string; count: number }>;
    byStatus: Array<{ status: string; count: number }>;
  };
  therapyAnalytics: {
    byType: Array<{ type: string; count: number; successRate: number }>;
    byTherapist: Array<{
      therapist: string;
      sessions: number;
      successRate: number;
    }>;
    progressTrends: Array<{ month: string; averageProgress: number }>;
  };
  appointmentAnalytics: {
    byStatus: Array<{ status: string; count: number }>;
    byTime: Array<{ hour: number; count: number }>;
    byDay: Array<{ day: string; count: number }>;
    noShowRate: number;
    rescheduleRate: number;
  };
  performanceMetrics: {
    averageSessionDuration: number;
    patientSatisfaction: number;
    therapistUtilization: number;
    facilityUtilization: number;
  };
  trends: {
    patientGrowth: Array<{ month: string; count: number }>;
    revenueGrowth: Array<{ month: string; amount: number }>;
    appointmentTrends: Array<{ month: string; count: number }>;
  };

const AnalyticsPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("month");
  const [selectedView, setSelectedView] = useState<string>("overview");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    loadAnalyticsData();
  }, [isAuthenticated, router, selectedPeriod]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      // في التطبيق الحقيقي، سيتم جلب البيانات من API
      const mockData: AnalyticsData = {
        overview: {
          totalPatients: 156,
          activePatients: 142,
          totalAppointments: 1248,
          completedAppointments: 1156,
          totalSessions: 3420,
          averageProgress: 73,
          revenue: 245000,
          growthRate: 12.5,
        },
        patientAnalytics: {
          byAge: [
            { age: "0-5", count: 45 },
            { age: "6-12", count: 67 },
            { age: "13-18", count: 34 },
            { age: "19+", count: 10 },
          ],
          byCondition: [
            { condition: "شلل دماغي", count: 52 },
            { condition: "متلازمة داون", count: 38 },
            { condition: "التوحد", count: 29 },
            { condition: "صعوبات التعلم", count: 25 },
            { condition: "إعاقة حركية", count: 12 },
          ],
          byGender: [
            { gender: "ذكر", count: 89 },
            { gender: "أنثى", count: 67 },
          ],
          byStatus: [
            { status: "نشط", count: 142 },
            { status: "غير نشط", count: 14 },
          ],
        },
        therapyAnalytics: {
          byType: [
            { type: "العلاج الطبيعي", count: 1240, successRate: 78 },
            { type: "العلاج الوظيفي", count: 890, successRate: 82 },
            { type: "علاج النطق", count: 650, successRate: 75 },
            { type: "العلاج النفسي", count: 320, successRate: 85 },
          ],
          byTherapist: [
            { therapist: "د. فاطمة العلي", sessions: 456, successRate: 88 },
            { therapist: "أ. محمد السعد", sessions: 389, successRate: 82 },
            { therapist: "د. نورا الزهراني", sessions: 321, successRate: 85 },
          ],
          progressTrends: [
            { month: "يناير", averageProgress: 65 },
            { month: "فبراير", averageProgress: 68 },
            { month: "مارس", averageProgress: 71 },
            { month: "أبريل", averageProgress: 73 },
          ],
        },
        appointmentAnalytics: {
          byStatus: [
            { status: "مكتملة", count: 1156 },
            { status: "مجدولة", count: 67 },
            { status: "ملغية", count: 25 },
          ],
          byTime: [
            { hour: 9, count: 45 },
            { hour: 10, count: 67 },
            { hour: 11, count: 52 },
            { hour: 14, count: 38 },
            { hour: 15, count: 41 },
            { hour: 16, count: 33 },
          ],
          byDay: [
            { day: "السبت", count: 89 },
            { day: "الأحد", count: 92 },
            { day: "الاثنين", count: 87 },
            { day: "الثلاثاء", count: 85 },
            { day: "الأربعاء", count: 78 },
            { day: "الخميس", count: 71 },
          ],
          noShowRate: 3.2,
          rescheduleRate: 8.5,
        },
        performanceMetrics: {
          averageSessionDuration: 45,
          patientSatisfaction: 4.7,
          therapistUtilization: 87,
          facilityUtilization: 92,
        },
        trends: {
          patientGrowth: [
            { month: "يناير", count: 145 },
            { month: "فبراير", count: 148 },
            { month: "مارس", count: 152 },
            { month: "أبريل", count: 156 },
          ],
          revenueGrowth: [
            { month: "يناير", amount: 58000 },
            { month: "فبراير", amount: 62000 },
            { month: "مارس", amount: 65000 },
            { month: "أبريل", amount: 60000 },
          ],
          appointmentTrends: [
            { month: "يناير", count: 298 },
            { month: "فبراير", count: 312 },
            { month: "مارس", count: 325 },
            { month: "أبريل", count: 313 },
          ],
        },
      };

      setAnalyticsData(mockData);
    } catch (error) {
      setError("فشل في تحميل بيانات التحليلات");
    } finally {
      setLoading(false);
    }
  };

  const getGrowthIcon = (rate: number) => {
    if (rate > 0) return <TrendingUp className="w-4 h-4 text-brand-success" />;
    if (rate < 0) return <TrendingDown className="w-4 h-4 text-brand-error" />;
    return <Activity className="w-4 h-4 text-gray-500" />;
  };

  const getGrowthColor = (rate: number) => {
    if (rate > 0) return "text-brand-success";
    if (rate < 0) return "text-brand-error";
    return "text-gray-600";
  };

  if (!isAuthenticated) {
    return null;

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              التحليلات والإحصائيات
            </h1>
            <p className="text-gray-600 mt-2">
              تحليل شامل لأداء المركز ونتائج العلاج
            </p>
          </div>
          <div className="flex gap-2">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="week">هذا الأسبوع</option>
              <option value="month">هذا الشهر</option>
              <option value="quarter">هذا الربع</option>
              <option value="year">هذا العام</option>
            </select>
            <Button onClick={loadAnalyticsData} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              تحديث
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              تصدير
            </Button>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex space-x-1 bg-surface p-1 rounded-lg">
          <button
            onClick={() => setSelectedView("overview")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              selectedView === "overview"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            نظرة عامة
          </button>
          <button
            onClick={() => setSelectedView("patients")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              selectedView === "patients"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            تحليل المرضى
          </button>
          <button
            onClick={() => setSelectedView("therapy")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              selectedView === "therapy"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            تحليل العلاج
          </button>
          <button
            onClick={() => setSelectedView("appointments")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              selectedView === "appointments"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            تحليل المواعيد
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--brand-primary)]"></div>
        </div>
      ) : analyticsData ? (
        <>
          {/* Overview Tab */}
          {selectedView === "overview" && (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      إجمالي المرضى
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {analyticsData.overview.totalPatients}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      {getGrowthIcon(analyticsData.overview.growthRate)}
                      <span
                        className={getGrowthColor(
                          analyticsData.overview.growthRate,
                        )}
                      >
                        +{analyticsData.overview.growthRate}%
                      </span>
                      <span>من الشهر الماضي</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      المواعيد المكتملة
                    </CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {analyticsData.overview.completedAppointments}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      من أصل {analyticsData.overview.totalAppointments} موعد
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      متوسط التقدم
                    </CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {analyticsData.overview.averageProgress}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      من جميع المرضى
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      الإيرادات
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {analyticsData.overview.revenue.toLocaleString()} ريال
                    </div>
                    <div className="text-xs text-muted-foreground">
                      هذا الشهر
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      مدة الجلسة المتوسطة
                    </CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {analyticsData.performanceMetrics.averageSessionDuration}{" "}
                      دقيقة
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      رضا المرضى
                    </CardTitle>
                    <Star className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {analyticsData.performanceMetrics.patientSatisfaction}/5
                    </div>
                    <div className="text-xs text-muted-foreground">
                      تقييم المرضى
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      استغلال المعالجين
                    </CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {analyticsData.performanceMetrics.therapistUtilization}%
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      استغلال المرافق
                    </CardTitle>
                    <Award className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {analyticsData.performanceMetrics.facilityUtilization}%
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Patients Analytics Tab */}
          {selectedView === "patients" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Patients by Age */}
                <Card>
                  <CardHeader>
                    <CardTitle>توزيع المرضى حسب العمر</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analyticsData.patientAnalytics.byAge.map(
                        (item, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between"
                          >
                            <span className="text-sm font-medium">
                              {item.age} سنة
                            </span>
                            <div className="flex items-center gap-2">
                              <div className="w-32 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-[var(--brand-primary)] h-2 rounded-full"
                                  style={{
                                    width: `${(item.count / analyticsData.overview.totalPatients) * 100}%`,
                                  }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-600 w-8">
                                {item.count}
                              </span>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Patients by Condition */}
                <Card>
                  <CardHeader>
                    <CardTitle>توزيع المرضى حسب الحالة</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analyticsData.patientAnalytics.byCondition.map(
                        (item, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between"
                          >
                            <span className="text-sm font-medium">
                              {item.condition}
                            </span>
                            <div className="flex items-center gap-2">
                              <div className="w-32 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-brand-success h-2 rounded-full"
                                  style={{
                                    width: `${(item.count / analyticsData.overview.totalPatients) * 100}%`,
                                  }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-600 w-8">
                                {item.count}
                              </span>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Therapy Analytics Tab */}
          {selectedView === "therapy" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Therapy by Type */}
                <Card>
                  <CardHeader>
                    <CardTitle>أنواع العلاج</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analyticsData.therapyAnalytics.byType.map(
                        (item, index) => (
                          <div key={index} className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">{item.type}</span>
                              <Badge variant="outline">
                                {item.successRate}% نجاح
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-600">
                              {item.count} جلسة
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Therapist Performance */}
                <Card>
                  <CardHeader>
                    <CardTitle>أداء المعالجين</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analyticsData.therapyAnalytics.byTherapist.map(
                        (item, index) => (
                          <div key={index} className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">
                                {item.therapist}
                              </span>
                              <Badge variant="primary">
                                {item.successRate}% نجاح
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-600">
                              {item.sessions} جلسة
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Appointments Analytics Tab */}
          {selectedView === "appointments" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Appointment Status */}
                <Card>
                  <CardHeader>
                    <CardTitle>حالة المواعيد</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analyticsData.appointmentAnalytics.byStatus.map(
                        (item, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between"
                          >
                            <span className="text-sm font-medium">
                              {item.status}
                            </span>
                            <div className="flex items-center gap-2">
                              <div className="w-32 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-surface0 h-2 rounded-full"
                                  style={{
                                    width: `${(item.count / analyticsData.overview.totalAppointments) * 100}%`,
                                  }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-600 w-8">
                                {item.count}
                              </span>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Appointment Times */}
                <Card>
                  <CardHeader>
                    <CardTitle>أوقات المواعيد</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analyticsData.appointmentAnalytics.byTime.map(
                        (item, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between"
                          >
                            <span className="text-sm font-medium">
                              {item.hour}:00
                            </span>
                            <div className="flex items-center gap-2">
                              <div className="w-32 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-surface0 h-2 rounded-full"
                                  style={{
                                    width: `${(item.count / Math.max(...analyticsData.appointmentAnalytics.byTime.map((t) => t.count))) * 100}%`,
                                  }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-600 w-8">
                                {item.count}
                              </span>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Appointment Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">معدل عدم الحضور</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-brand-error">
                      {analyticsData.appointmentAnalytics.noShowRate}%
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">
                      معدل إعادة الجدولة
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">
                      {analyticsData.appointmentAnalytics.rescheduleRate}%
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">معدل الإنجاز</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-brand-success">
                      {Math.round(
                        (analyticsData.overview.completedAppointments /
                          analyticsData.overview.totalAppointments) *
                          100,
                      )}
                      %
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              لا توجد بيانات تحليلية
            </h3>
            <p className="text-gray-600 mb-4">
              سيتم عرض البيانات التحليلية هنا
            </p>
            <Button
              onClick={loadAnalyticsData}
              className="bg-[var(--brand-primary)] hover:brightness-95"
            >
              تحميل البيانات
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AnalyticsPage;
}}
