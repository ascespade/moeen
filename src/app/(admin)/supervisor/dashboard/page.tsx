import { useEffect, useState } from "react";

import { createClient } from "@/lib/supabase/client";
import logger from "@/lib/monitoring/logger";

("use client");

interface CallRequest {
  id: string;
  requester: { full_name: string; phone: string };
  reason: string;
  priority: string;
  status: string;
  created_at: string;
}

export default function SupervisorDashboardPage() {
  const [callRequests, setCallRequests] = useState<CallRequest[]>([]);
  const [stats, setStats] = useState({
    pending: 0,
    today_sessions: 0,
    today_attendance: 0,
    today_cancellations: 0,
  });
  const [loading, setLoading] = useState(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadData();

    // Real-time subscription
    const supabase = createClient();
    const channel = supabase
      .channel("supervisor-feed")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "call_requests" },
        (payload) => {
          // New call request - show alert!
          playNotificationSound();
          loadCallRequests();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadData = async () => {
    await Promise.all([loadCallRequests(), loadStats()]);
    setLoading(false);
  };

  const loadCallRequests = async () => {
    try {
      const response = await fetch("/api/supervisor/call-request");
      const data = await response.json();

      if (data.success) {
        setCallRequests(data.requests || []);
      }
    } catch (error) {
      logger.error("Error loading call requests", error);
    }
  };

  const loadStats = async () => {
    try {
      const supabase = createClient();
      const today = new Date().toISOString().split("T")[0];

      // Today's sessions
      const { count: sessionsCount } = await supabase
        .from("appointments")
        .select("*", { count: "exact", head: true })
        .eq("appointment_date", today);

      // Completed sessions
      const { count: completedCount } = await supabase
        .from("appointments")
        .select("*", { count: "exact", head: true })
        .eq("appointment_date", today)
        .eq("status", "completed");

      // Cancelled sessions
      const { count: cancelledCount } = await supabase
        .from("appointments")
        .select("*", { count: "exact", head: true })
        .eq("appointment_date", today)
        .eq("status", "cancelled");

      // Pending call requests
      const { count: pendingRequests } = await supabase
        .from("call_requests")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");

      setStats({
        pending: pendingRequests || 0,
        today_sessions: sessionsCount || 0,
        today_attendance: completedCount || 0,
        today_cancellations: cancelledCount || 0,
      });
    } catch (error) {
      logger.error("Error loading stats", error);
    }
  };

  const handleAcknowledge = async (requestId: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("call_requests")
        .update({
          status: "acknowledged",
          acknowledged_at: new Date().toISOString(),
        })
        .eq("id", requestId);

      if (error) throw error;

      alert("✅ تم تأكيد الاستلام");
      await loadCallRequests();
    } catch (error: any) {
      logger.error("Error acknowledging request", error);
      alert("خطأ: " + error.message);
    }
  };

  const handleComplete = async (requestId: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("call_requests")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
        })
        .eq("id", requestId);

      if (error) throw error;

      alert("✅ تم إنهاء الطلب");
      await loadCallRequests();
    } catch (error: any) {
      logger.error("Error completing request", error);
      alert("خطأ: " + error.message);
    }
  };

  const playNotificationSound = () => {
    // Play notification sound
    if (typeof Audio !== "undefined") {
      const audio = new Audio("/notification.mp3");
      audio.play().catch(() => {});
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

  const pendingRequests = callRequests.filter((r) => r.status === "pending");

  return (
    <div className="container-app py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        لوحة تحكم المشرف
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        مراقبة العمليات اليومية والطلبات العاجلة
      </p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                طلبات معلقة
              </p>
              <p className="text-3xl font-bold text-red-600">{stats.pending}</p>
            </div>
            <div className="text-4xl">🔴</div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                جلسات اليوم
              </p>
              <p className="text-3xl font-bold text-blue-600">
                {stats.today_sessions}
              </p>
            </div>
            <div className="text-4xl">📅</div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">الحضور</p>
              <p className="text-3xl font-bold text-green-600">
                {stats.today_attendance}
              </p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                الإلغاءات
              </p>
              <p className="text-3xl font-bold text-orange-600">
                {stats.today_cancellations}
              </p>
            </div>
            <div className="text-4xl">❌</div>
          </div>
        </div>
      </div>

      {/* Urgent Call Requests */}
      {pendingRequests.length > 0 && (
        <div className="card p-6 mb-8 border-2 border-red-500 bg-red-50 dark:bg-red-900/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-4xl animate-bounce">🔴</div>
            <div>
              <h2 className="text-2xl font-bold text-red-900 dark:text-red-100">
                طلبات مكالمات عاجلة ({pendingRequests.length})
              </h2>
              <p className="text-red-700 dark:text-red-300">يرجى الرد فوراً!</p>
            </div>
          </div>

          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <div
                key={request.id}
                className="card p-6 bg-white dark:bg-gray-800"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                      {request.requester?.full_name || "مستخدم"}
                    </h3>
                    <a
                      href={`tel:${request.requester?.phone}`}
                      className="text-[var(--brand-primary)] font-bold text-lg hover:underline"
                    >
                      📞 {request.requester?.phone || "غير متوفر"}
                    </a>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-red-100 text-red-700 font-bold">
                    {request.priority === "emergency"
                      ? "🔴 طارئ"
                      : request.priority === "high"
                        ? "🟠 عاجل"
                        : "🟡 عادي"}
                  </span>
                </div>

                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {request.reason}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                  <span>
                    ⏰{" "}
                    {new Date(request.created_at).toLocaleTimeString("ar-SA")}
                  </span>
                  <span>
                    📅{" "}
                    {new Date(request.created_at).toLocaleDateString("ar-SA")}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleAcknowledge(request.id)}
                    className="btn btn-outline flex-1"
                  >
                    ✅ تم الاستلام
                  </button>
                  <button
                    onClick={() => handleComplete(request.id)}
                    className="btn btn-brand flex-1"
                  >
                    ✔️ تم الإنجاز
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Call Requests */}
      <div className="card p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          سجل الطلبات
        </h2>

        {callRequests.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">📞</div>
            <p className="text-gray-600 dark:text-gray-400">
              لا توجد طلبات حالياً
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {callRequests.map((request) => (
              <div
                key={request.id}
                className={`p-4 rounded-lg border ${
                  request.status === "pending"
                    ? "border-red-300 bg-red-50 dark:bg-red-900/10"
                    : request.status === "acknowledged"
                      ? "border-yellow-300 bg-yellow-50 dark:bg-yellow-900/10"
                      : "border-green-300 bg-green-50 dark:bg-green-900/10"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {request.requester?.full_name || "مستخدم"}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {request.requester?.phone}
                    </p>
                  </div>
                  <div className="text-left">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        request.status === "pending"
                          ? "bg-red-100 text-red-700"
                          : request.status === "acknowledged"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                      }`}
                    >
                      {request.status === "pending"
                        ? "⏳ معلق"
                        : request.status === "acknowledged"
                          ? "✅ مستلم"
                          : "✔️ مكتمل"}
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(request.created_at).toLocaleTimeString(
                        "ar-SA",
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
