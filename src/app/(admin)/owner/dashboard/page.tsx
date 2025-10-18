import { useEffect, useState } from "react";

import { createClient } from "@/lib/supabase/client";
import logger from "@/lib/monitoring/logger";

("use client");

export default function OwnerDashboardPage() {
  const [stats, setStats] = useState({
    today_revenue: 0,
    today_sessions: 0,
    today_attendance_rate: 0,
    total_patients: 0,
    total_therapists: 0,
    pending_payments: 0,
    month_revenue: 0,
    week_sessions: 0,
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();

    // Real-time updates
    const supabase = createClient();
    const channel = supabase
      .channel("owner-feed")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "appointments" },
        () => loadDashboardData(),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "payments" },
        () => loadDashboardData(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadDashboardData = async () => {
    try {
      const supabase = createClient();
      const today = new Date().toISOString().split("T")[0];
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);

      // Today's sessions
      const { count: todaySessions } = await supabase
        .from("appointments")
        .select("*", { count: "exact", head: true })
        .eq("appointment_date", today);

      // Today's completed sessions
      const { count: completedToday } = await supabase
        .from("appointments")
        .select("*", { count: "exact", head: true })
        .eq("appointment_date", today)
        .eq("status", "completed");

      // Today's revenue
      const { data: todayPayments } = await supabase
        .from("payments")
        .select("amount")
        .eq("payment_date", today)
        .eq("status", "completed");

      const todayRevenue =
        todayPayments?.reduce(
          (sum, p) => sum + parseFloat(p.amount.toString()),
          0,
        ) || 0;

      // Month revenue
      const { data: monthPayments } = await supabase
        .from("payments")
        .select("amount")
        .gte("payment_date", monthAgo.toISOString().split("T")[0])
        .eq("status", "completed");

      const monthRevenue =
        monthPayments?.reduce(
          (sum, p) => sum + parseFloat(p.amount.toString()),
          0,
        ) || 0;

      // Week sessions
      const { count: weekSessions } = await supabase
        .from("appointments")
        .select("*", { count: "exact", head: true })
        .gte("appointment_date", weekAgo.toISOString().split("T")[0]);

      // Total patients
      const { count: totalPatients } = await supabase
        .from("patients")
        .select("*", { count: "exact", head: true });

      // Total therapists
      const { count: totalTherapists } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .eq("role", "doctor");

      // Pending payments
      const { count: pendingPayments } = await supabase
        .from("payments")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");

      setStats({
        today_revenue: todayRevenue,
        today_sessions: todaySessions || 0,
        today_attendance_rate: todaySessions
          ? Math.round(((completedToday || 0) / todaySessions) * 100)
          : 0,
        total_patients: totalPatients || 0,
        total_therapists: totalTherapists || 0,
        pending_payments: pendingPayments || 0,
        month_revenue: monthRevenue,
        week_sessions: weekSessions || 0,
      });

      // Recent activity
      const { data: recentSessions } = await supabase
        .from("appointments")
        .select(
          "*, patient:patients(first_name), therapist:users!appointments_doctor_id_fkey(name)",
        )
        .order("created_at", { ascending: false })
        .limit(10);

      setRecentActivity(recentSessions || []);
    } catch (error) {
      logger.error("Error loading owner dashboard", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container-app py-8">
        <div className="card p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--brand-primary)] mx-auto"></div>
          <p className="mt-4">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-app py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          لوحة تحكم المالك
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          مركز الهمم - نظرة شاملة على العمليات
        </p>
      </div>

      {/* KPIs Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-green-700 dark:text-green-300">
              الإيرادات اليوم
            </p>
            <div className="text-3xl">💰</div>
          </div>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            {stats.today_revenue.toLocaleString()}{" "}
            <span className="text-xl">ريال</span>
          </p>
        </div>

        <div className="card p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              الجلسات اليوم
            </p>
            <div className="text-3xl">📅</div>
          </div>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {stats.today_sessions}
          </p>
        </div>

        <div className="card p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-purple-700 dark:text-purple-300">
              معدل الحضور
            </p>
            <div className="text-3xl">✅</div>
          </div>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {stats.today_attendance_rate}%
          </p>
        </div>

        <div className="card p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-orange-700 dark:text-orange-300">
              مدفوعات معلقة
            </p>
            <div className="text-3xl">⏳</div>
          </div>
          <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
            {stats.pending_payments}
          </p>
        </div>
      </div>

      {/* KPIs Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              إيرادات الشهر
            </p>
            <div className="text-2xl">💵</div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.month_revenue.toLocaleString()}{" "}
            <span className="text-sm">ريال</span>
          </p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              جلسات الأسبوع
            </p>
            <div className="text-2xl">📊</div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.week_sessions}
          </p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              إجمالي المرضى
            </p>
            <div className="text-2xl">👶</div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.total_patients}
          </p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              الأخصائيون
            </p>
            <div className="text-2xl">👨‍⚕️</div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.total_therapists}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 card p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            النشاط الأخير
          </h2>

          {recentActivity.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">📋</div>
              <p className="text-gray-600 dark:text-gray-400">
                لا توجد أنشطة حديثة
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.status === "completed"
                          ? "bg-green-100 text-green-600"
                          : activity.status === "cancelled"
                            ? "bg-red-100 text-red-600"
                            : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {activity.status === "completed"
                        ? "✅"
                        : activity.status === "cancelled"
                          ? "❌"
                          : "📅"}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        جلسة - {activity.patient?.first_name || "مريض"}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        مع {activity.therapist?.name || "أخصائي"}
                      </p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(activity.created_at).toLocaleTimeString(
                        "ar-SA",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              إجراءات سريعة
            </h3>
            <div className="space-y-3">
              <button className="btn btn-brand w-full justify-start">
                <span className="text-xl ml-2">👥</span>
                إدارة المستخدمين
              </button>
              <button className="btn btn-outline w-full justify-start">
                <span className="text-xl ml-2">📊</span>
                التقارير المالية
              </button>
              <button className="btn btn-outline w-full justify-start">
                <span className="text-xl ml-2">⚙️</span>
                إعدادات المركز
              </button>
              <button className="btn btn-outline w-full justify-start">
                <span className="text-xl ml-2">📈</span>
                تحليلات الأداء
              </button>
            </div>
          </div>

          {/* Alerts */}
          {stats.pending_payments > 0 && (
            <div className="card p-6 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
              <h4 className="font-bold text-orange-900 dark:text-orange-100 mb-2">
                ⚠️ تنبيه
              </h4>
              <p className="text-sm text-orange-800 dark:text-orange-200">
                لديك {stats.pending_payments} مدفوعات معلقة تحتاج متابعة
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
