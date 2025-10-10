"use client";
import { useState, useEffect } from "react";
import { useRequireAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants/routes";
import { ChartsA, ChartsB, ChartsC } from "@/components/dashboard/Charts";
import { usePageI18n } from "@/hooks/usePageI18n";
import { I18N_KEYS } from "@/constants/i18n-keys";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

import KpiCard from "@/components/dashboard/KpiCard";

interface DashboardStats {
  totalPatients: number;
  totalAppointments: number;
  totalSessions: number;
  totalRevenue: number;
  activePatients: number;
  pendingAppointments: number;
  completedSessions: number;
  monthlyRevenue: number;
}

export default function DashboardPage() {
  useRequireAuth("/login");
  const { t } = usePageI18n();
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    totalAppointments: 0,
    totalSessions: 0,
    totalRevenue: 0,
    activePatients: 0,
    pendingAppointments: 0,
    completedSessions: 0,
    monthlyRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  // Load dashboard statistics from database
  useEffect(() => {
    const loadDashboardStats = async () => {
      try {
        setLoading(true);

        // Get counts from different tables
        const [
          { count: totalPatients },
          { count: totalAppointments },
          { count: totalSessions },
          { count: activePatients },
          { count: pendingAppointments },
          { count: completedSessions }
        ] = await Promise.all([
          supabase.from('patients').select('*', { count: 'exact', head: true }),
          supabase.from('appointments').select('*', { count: 'exact', head: true }),
          supabase.from('sessions').select('*', { count: 'exact', head: true }),
          supabase.from('patients').select('*', { count: 'exact', head: true }).gte('updated_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
          supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('status', 'scheduled'),
          supabase.from('sessions').select('*', { count: 'exact', head: true }).eq('status', 'completed')
        ]);

        // Calculate revenue (this would need to be enhanced with actual billing data)
        const totalRevenue = 0; // Placeholder - would need billing/payment tables
        const monthlyRevenue = 0; // Placeholder - would need billing/payment tables

        setStats({
          totalPatients: totalPatients || 0,
          totalAppointments: totalAppointments || 0,
          totalSessions: totalSessions || 0,
          totalRevenue,
          activePatients: activePatients || 0,
          pendingAppointments: pendingAppointments || 0,
          completedSessions: completedSessions || 0,
          monthlyRevenue,
        });

      } catch (error) {
        console.error('Error loading dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--brand-surface)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل لوحة التحكم...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--brand-surface)]">
      {/* Top Bar */}
      <div className="border-brand border-b bg-white dark:bg-gray-900">
        <div className="container-app flex items-center justify-between py-4">
          <h1 className="text-brand text-2xl font-bold">
            {t(I18N_KEYS.DASHBOARD.TITLE, "لوحة التحكم")}
          </h1>
          <div className="text-sm text-gray-500">
            اليوم: {new Date().toLocaleDateString("ar-SA")}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-app grid grid-cols-1 gap-6 py-6 lg:grid-cols-12">
        {/* Sidebar */}
        <aside className="space-y-4 lg:col-span-3">
          <div className="card">
            <div className="card-header">
              <div className="flex items-center gap-2">
                <div className="bg-brand flex h-6 w-6 items-center justify-center rounded-md">
                  <span className="text-xs text-white">📊</span>
                </div>
                <h3 className="card-title">
                  {t(I18N_KEYS.DASHBOARD.NAVIGATION, "التنقل")}
                </h3>
              </div>
            </div>
            <ul className="space-y-3">
              <li>
                <a className="nav-link" href="#stats">
                  <span className="bg-brand h-2 w-2 rounded-full"></span>
                  {t(I18N_KEYS.DASHBOARD.STATISTICS, "الإحصائيات")}
                </a>
              </li>
              <li>
                <Link className="nav-link" href={ROUTES.HEALTH.PATIENTS}>
                  <span className="bg-green-500 h-2 w-2 rounded-full"></span>
                  {t(I18N_KEYS.DASHBOARD.PATIENTS, "المرضى")}
                </Link>
              </li>
              <li>
                <Link className="nav-link" href={ROUTES.HEALTH.APPOINTMENTS}>
                  <span className="bg-blue-500 h-2 w-2 rounded-full"></span>
                  {t(I18N_KEYS.DASHBOARD.APPOINTMENTS, "المواعيد")}
                </Link>
              </li>
              <li>
                <Link className="nav-link" href={ROUTES.HEALTH.SESSIONS}>
                  <span className="bg-purple-500 h-2 w-2 rounded-full"></span>
                  {t(I18N_KEYS.DASHBOARD.SESSIONS, "الجلسات")}
                </Link>
              </li>
              <li>
                <Link className="nav-link" href={ROUTES.HEALTH.INSURANCE}>
                  <span className="bg-yellow-500 h-2 w-2 rounded-full"></span>
                  {t(I18N_KEYS.DASHBOARD.INSURANCE, "التأمين")}
                </Link>
              </li>
            </ul>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="flex items-center gap-2">
                <div className="bg-brand flex h-6 w-6 items-center justify-center rounded-md">
                  <span className="text-xs text-white">⚡</span>
                </div>
                <h3 className="card-title">
                  {t(I18N_KEYS.DASHBOARD.QUICK_ACTIONS, "إجراءات سريعة")}
                </h3>
              </div>
            </div>
            <div className="space-y-3">
              <Link
                href={ROUTES.HEALTH.PATIENTS + "/new"}
                className="btn btn-primary w-full"
              >
                {t(I18N_KEYS.DASHBOARD.ADD_PATIENT, "إضافة مريض")}
              </Link>
              <Link
                href={ROUTES.HEALTH.APPOINTMENTS + "/new"}
                className="btn btn-secondary w-full"
              >
                {t(I18N_KEYS.DASHBOARD.BOOK_APPOINTMENT, "حجز موعد")}
              </Link>
              <Link
                href={ROUTES.HEALTH.SESSIONS + "/new"}
                className="btn btn-outline w-full"
              >
                {t(I18N_KEYS.DASHBOARD.NEW_SESSION, "جلسة جديدة")}
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="space-y-6 lg:col-span-9">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              title={t(I18N_KEYS.DASHBOARD.TOTAL_PATIENTS, "إجمالي المرضى")}
              value={stats.totalPatients}
              change="+12%"
              changeType="positive"
              icon="👥"
            />
            <KpiCard
              title={t(I18N_KEYS.DASHBOARD.TOTAL_APPOINTMENTS, "إجمالي المواعيد")}
              value={stats.totalAppointments}
              change="+8%"
              changeType="positive"
              icon="📅"
            />
            <KpiCard
              title={t(I18N_KEYS.DASHBOARD.TOTAL_SESSIONS, "إجمالي الجلسات")}
              value={stats.totalSessions}
              change="+15%"
              changeType="positive"
              icon="🏥"
            />
            <KpiCard
              title={t(I18N_KEYS.DASHBOARD.TOTAL_REVENUE, "إجمالي الإيرادات")}
              value={`${stats.totalRevenue.toLocaleString()} ريال`}
              change="+5%"
              changeType="positive"
              icon="💰"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  {t(I18N_KEYS.DASHBOARD.PATIENTS_CHART, "نمو المرضى")}
                </h3>
              </div>
              <div className="card-content">
                <ChartsA />
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  {t(I18N_KEYS.DASHBOARD.APPOINTMENTS_CHART, "المواعيد الشهرية")}
                </h3>
              </div>
              <div className="card-content">
                <ChartsB />
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                {t(I18N_KEYS.DASHBOARD.RECENT_ACTIVITY, "النشاط الأخير")}
              </h3>
            </div>
            <div className="card-content">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {t(I18N_KEYS.DASHBOARD.ACTIVITY_NEW_PATIENT, "تم إضافة مريض جديد")}
                    </p>
                    <p className="text-xs text-gray-500">منذ 5 دقائق</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm">📅</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {t(I18N_KEYS.DASHBOARD.ACTIVITY_APPOINTMENT, "تم حجز موعد جديد")}
                    </p>
                    <p className="text-xs text-gray-500">منذ 15 دقيقة</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 text-sm">🏥</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {t(I18N_KEYS.DASHBOARD.ACTIVITY_SESSION, "تم إكمال جلسة علاجية")}
                    </p>
                    <p className="text-xs text-gray-500">منذ 30 دقيقة</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}