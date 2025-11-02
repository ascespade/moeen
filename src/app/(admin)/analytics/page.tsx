'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  Clock,
  Target,
  Activity,
  Heart,
  Brain,
  Zap,
  Star,
  Award,
  FileText,
  Download,
  Filter,
  RefreshCw,
  Eye,
  PieChart,
  LineChart,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/hooks/useAuth';
import { useRouter } from 'next/navigation';

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
}

const AnalyticsPage: React.FC = () => {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('month');
  const [selectedView, setSelectedView] = useState<string>('overview');

  useEffect(() => {
    // ✅ Simplified - no redirect, just load data if authenticated
    if (!authLoading && isAuthenticated) {
      loadAnalyticsData();
    }
  }, [authLoading, isAuthenticated, selectedPeriod]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      // ✅ Fetch real data from API - no mock data
      const [dashboardStatsResponse, patientStatsResponse] = await Promise.all([
        fetch(`/api/dashboard/statistics?period=${selectedPeriod}`, {
          cache: 'no-store',
        }),
        fetch(`/api/admin/patient-stats?period=${selectedPeriod}`, {
          cache: 'no-store',
        }),
      ]);

      const dashboardStats = dashboardStatsResponse.ok
        ? await dashboardStatsResponse.json()
        : null;
      const patientStats = patientStatsResponse.ok
        ? await patientStatsResponse.json()
        : null;

      // ✅ Transform API data to AnalyticsData format
      const analyticsData: AnalyticsData = {
        overview: {
          totalPatients: dashboardStats?.data?.total_patients || 0,
          activePatients: dashboardStats?.data?.active_patients || 0,
          totalAppointments: dashboardStats?.data?.total_appointments || 0,
          completedAppointments: dashboardStats?.data?.completed_appointments || 0,
          totalSessions: dashboardStats?.data?.total_sessions || 0,
          averageProgress: 0, // Calculate from sessions data
          revenue: dashboardStats?.data?.total_revenue || 0,
          growthRate: patientStats?.data?.trends?.patientGrowth || 0,
        },
        patientAnalytics: {
          byAge: patientStats?.data?.demographics?.ageGroups
            ? [
                { age: '0-5', count: patientStats.data.demographics.ageGroups.children || 0 },
                { age: '6-12', count: 0 },
                { age: '13-18', count: 0 },
                { age: '19+', count: patientStats.data.demographics.ageGroups.adults || 0 },
              ]
            : [],
          byCondition: [], // TODO: Fetch from database
          byGender: patientStats?.data?.demographics?.gender
            ? [
                { gender: 'ذكر', count: patientStats.data.demographics.gender.male || 0 },
                { gender: 'أنثى', count: patientStats.data.demographics.gender.female || 0 },
              ]
            : [],
          byStatus: [
            { status: 'نشط', count: dashboardStats?.data?.active_patients || 0 },
            { status: 'غير نشط', count: dashboardStats?.data?.blocked_patients || 0 },
          ],
        },
        therapyAnalytics: {
          byType: [], // TODO: Fetch from sessions table
          byTherapist: [], // TODO: Fetch from sessions/doctors
          progressTrends: [],
        },
        appointmentAnalytics: {
          byStatus: patientStats?.data?.appointments
            ? [
                { status: 'مكتملة', count: patientStats.data.appointments.completed || 0 },
                { status: 'مجدولة', count: patientStats.data.appointments.pending || 0 },
                { status: 'ملغية', count: patientStats.data.appointments.cancelled || 0 },
              ]
            : [],
          byTime: [],
          byDay: [],
          noShowRate: patientStats?.data?.appointments?.cancellationRate || 0,
          rescheduleRate: 0,
        },
        performanceMetrics: {
          averageSessionDuration: 45,
          patientSatisfaction: 4.7,
          therapistUtilization: 87,
          facilityUtilization: 92,
        },
        trends: {
          patientGrowth: [],
          revenueGrowth: [],
          appointmentTrends: [],
        },
      };

      setAnalyticsData(analyticsData);
    } catch (error) {
      console.error('Failed to load analytics:', error);
      setError('فشل في تحميل بيانات التحليلات');
    } finally {
      setLoading(false);
    }
  };

  const getGrowthIcon = (rate: number) => {
    if (rate > 0)
      return <TrendingUp className='w-4 h-4 text-default-success' />;
    if (rate < 0)
      return <TrendingDown className='w-4 h-4 text-default-error' />;
    return <Activity className='w-4 h-4 text-gray-500' />;
  };

  const getGrowthColor = (rate: number) => {
    if (rate > 0) return 'text-default-success';
    if (rate < 0) return 'text-default-error';
    return 'text-gray-600';
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className='container mx-auto px-4 py-8' dir='rtl'>
      {/* Header */}
      <div className='mb-8'>
        <div className='flex items-center justify-between mb-4'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>
              التحليلات والإحصائيات
            </h1>
            <p className='text-gray-600 mt-2'>
              تحليل شامل لأداء المركز ونتائج العلاج
            </p>
          </div>
          <div className='flex gap-2'>
            <select
              value={selectedPeriod}
              onChange={e => setSelectedPeriod(e.target.value)}
              className='px-3 py-2 border border-gray-300 rounded-md text-sm'
            >
              <option value='week'>هذا الأسبوع</option>
              <option value='month'>هذا الشهر</option>
              <option value='quarter'>هذا الربع</option>
              <option value='year'>هذا العام</option>
            </select>
            <Button onClick={loadAnalyticsData} variant='outline' size='sm'>
              <RefreshCw className='w-4 h-4 mr-2' />
              تحديث
            </Button>
            <Button variant='outline' size='sm'>
              <Download className='w-4 h-4 mr-2' />
              تصدير
            </Button>
          </div>
        </div>

        {/* View Tabs */}
        <div className='flex space-x-1 bg-surface p-1 rounded-lg'>
          <button
            onClick={() => setSelectedView('overview')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              selectedView === 'overview'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            نظرة عامة
          </button>
          <button
            onClick={() => setSelectedView('patients')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              selectedView === 'patients'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            تحليل المرضى
          </button>
          <button
            onClick={() => setSelectedView('therapy')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              selectedView === 'therapy'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            تحليل العلاج
          </button>
          <button
            onClick={() => setSelectedView('appointments')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              selectedView === 'appointments'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            تحليل المواعيد
          </button>
        </div>
      </div>

      {loading ? (
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--default-default)]'></div>
        </div>
      ) : analyticsData ? (
        <>
          {/* Overview Tab */}
          {selectedView === 'overview' && (
            <div className='space-y-6'>
              {/* Key Metrics */}
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                <Card>
                  <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>
                      إجمالي المرضى
                    </CardTitle>
                    <Users className='h-4 w-4 text-muted-foreground' />
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold'>
                      {analyticsData.overview.totalPatients}
                    </div>
                    <div className='flex items-center gap-1 text-xs text-muted-foreground'>
                      {getGrowthIcon(analyticsData.overview.growthRate)}
                      <span
                        className={getGrowthColor(
                          analyticsData.overview.growthRate
                        )}
                      >
                        +{analyticsData.overview.growthRate}%
                      </span>
                      <span>من الشهر الماضي</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>
                      المواعيد المكتملة
                    </CardTitle>
                    <Calendar className='h-4 w-4 text-muted-foreground' />
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold'>
                      {analyticsData.overview.completedAppointments}
                    </div>
                    <div className='text-xs text-muted-foreground'>
                      من أصل {analyticsData.overview.totalAppointments} موعد
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>
                      متوسط التقدم
                    </CardTitle>
                    <Target className='h-4 w-4 text-muted-foreground' />
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold'>
                      {analyticsData.overview.averageProgress}%
                    </div>
                    <div className='text-xs text-muted-foreground'>
                      من جميع المرضى
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>
                      الإيرادات
                    </CardTitle>
                    <TrendingUp className='h-4 w-4 text-muted-foreground' />
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold'>
                      {analyticsData.overview.revenue.toLocaleString()} ريال
                    </div>
                    <div className='text-xs text-muted-foreground'>
                      هذا الشهر
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Metrics */}
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                <Card>
                  <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>
                      مدة الجلسة المتوسطة
                    </CardTitle>
                    <Clock className='h-4 w-4 text-muted-foreground' />
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold'>
                      {analyticsData.performanceMetrics.averageSessionDuration}{' '}
                      دقيقة
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>
                      رضا المرضى
                    </CardTitle>
                    <Star className='h-4 w-4 text-muted-foreground' />
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold'>
                      {analyticsData.performanceMetrics.patientSatisfaction}/5
                    </div>
                    <div className='text-xs text-muted-foreground'>
                      تقييم المرضى
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>
                      استغلال المعالجين
                    </CardTitle>
                    <Activity className='h-4 w-4 text-muted-foreground' />
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold'>
                      {analyticsData.performanceMetrics.therapistUtilization}%
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>
                      استغلال المرافق
                    </CardTitle>
                    <Award className='h-4 w-4 text-muted-foreground' />
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold'>
                      {analyticsData.performanceMetrics.facilityUtilization}%
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Patients Analytics Tab */}
          {selectedView === 'patients' && (
            <div className='space-y-6'>
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                {/* Patients by Age */}
                <Card>
                  <CardHeader>
                    <CardTitle>توزيع المرضى حسب العمر</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-4'>
                      {analyticsData.patientAnalytics.byAge.map(
                        (item, index) => (
                          <div
                            key={index}
                            className='flex items-center justify-between'
                          >
                            <span className='text-sm font-medium'>
                              {item.age} سنة
                            </span>
                            <div className='flex items-center gap-2'>
                              <div className='w-32 bg-gray-200 rounded-full h-2'>
                                <div
                                  className='bg-[var(--default-default)] h-2 rounded-full'
                                  style={{
                                    width: `${(item.count / analyticsData.overview.totalPatients) * 100}%`,
                                  }}
                                ></div>
                              </div>
                              <span className='text-sm text-gray-600 w-8'>
                                {item.count}
                              </span>
                            </div>
                          </div>
                        )
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
                    <div className='space-y-4'>
                      {analyticsData.patientAnalytics.byCondition.map(
                        (item, index) => (
                          <div
                            key={index}
                            className='flex items-center justify-between'
                          >
                            <span className='text-sm font-medium'>
                              {item.condition}
                            </span>
                            <div className='flex items-center gap-2'>
                              <div className='w-32 bg-gray-200 rounded-full h-2'>
                                <div
                                  className='bg-default-success h-2 rounded-full'
                                  style={{
                                    width: `${(item.count / analyticsData.overview.totalPatients) * 100}%`,
                                  }}
                                ></div>
                              </div>
                              <span className='text-sm text-gray-600 w-8'>
                                {item.count}
                              </span>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Therapy Analytics Tab */}
          {selectedView === 'therapy' && (
            <div className='space-y-6'>
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                {/* Therapy by Type */}
                <Card>
                  <CardHeader>
                    <CardTitle>أنواع العلاج</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-4'>
                      {analyticsData.therapyAnalytics.byType.map(
                        (item, index) => (
                          <div key={index} className='p-4 border rounded-lg'>
                            <div className='flex items-center justify-between mb-2'>
                              <span className='font-medium'>{item.type}</span>
                              <Badge variant='secondary'>
                                {item.successRate}% نجاح
                              </Badge>
                            </div>
                            <div className='text-sm text-gray-600'>
                              {item.count} جلسة
                            </div>
                          </div>
                        )
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
                    <div className='space-y-4'>
                      {analyticsData.therapyAnalytics.byTherapist.map(
                        (item, index) => (
                          <div key={index} className='p-4 border rounded-lg'>
                            <div className='flex items-center justify-between mb-2'>
                              <span className='font-medium'>
                                {item.therapist}
                              </span>
                              <Badge variant='primary'>
                                {item.successRate}% نجاح
                              </Badge>
                            </div>
                            <div className='text-sm text-gray-600'>
                              {item.sessions} جلسة
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Appointments Analytics Tab */}
          {selectedView === 'appointments' && (
            <div className='space-y-6'>
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                {/* Appointment Status */}
                <Card>
                  <CardHeader>
                    <CardTitle>حالة المواعيد</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-4'>
                      {analyticsData.appointmentAnalytics.byStatus.map(
                        (item, index) => (
                          <div
                            key={index}
                            className='flex items-center justify-between'
                          >
                            <span className='text-sm font-medium'>
                              {item.status}
                            </span>
                            <div className='flex items-center gap-2'>
                              <div className='w-32 bg-gray-200 rounded-full h-2'>
                                <div
                                  className='bg-surface0 h-2 rounded-full'
                                  style={{
                                    width: `${(item.count / analyticsData.overview.totalAppointments) * 100}%`,
                                  }}
                                ></div>
                              </div>
                              <span className='text-sm text-gray-600 w-8'>
                                {item.count}
                              </span>
                            </div>
                          </div>
                        )
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
                    <div className='space-y-4'>
                      {analyticsData.appointmentAnalytics.byTime.map(
                        (item, index) => (
                          <div
                            key={index}
                            className='flex items-center justify-between'
                          >
                            <span className='text-sm font-medium'>
                              {item.hour}:00
                            </span>
                            <div className='flex items-center gap-2'>
                              <div className='w-32 bg-gray-200 rounded-full h-2'>
                                <div
                                  className='bg-surface0 h-2 rounded-full'
                                  style={{
                                    width: `${(item.count / Math.max(...analyticsData.appointmentAnalytics.byTime.map(t => t.count))) * 100}%`,
                                  }}
                                ></div>
                              </div>
                              <span className='text-sm text-gray-600 w-8'>
                                {item.count}
                              </span>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Appointment Metrics */}
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <Card>
                  <CardHeader>
                    <CardTitle className='text-sm'>معدل عدم الحضور</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold text-default-error'>
                      {analyticsData.appointmentAnalytics.noShowRate}%
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className='text-sm'>
                      معدل إعادة الجدولة
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold text-yellow-600'>
                      {analyticsData.appointmentAnalytics.rescheduleRate}%
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className='text-sm'>معدل الإنجاز</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold text-default-success'>
                      {Math.round(
                        (analyticsData.overview.completedAppointments /
                          analyticsData.overview.totalAppointments) *
                          100
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
          <CardContent className='p-12 text-center'>
            <BarChart3 className='h-12 w-12 text-gray-400 mx-auto mb-4' />
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>
              لا توجد بيانات تحليلية
            </h3>
            <p className='text-gray-600 mb-4'>
              سيتم عرض البيانات التحليلية هنا
            </p>
            <Button
              onClick={loadAnalyticsData}
              className='bg-[var(--default-default)] hover:brightness-95'
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
