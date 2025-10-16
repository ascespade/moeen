// src/app/api/dashboard/logs/route.ts
// Activity logs API endpoint for dashboard
// Provides real-time logs and activity monitoring

import { _NextRequest, NextResponse } from "next/server";

import { _getServiceSupabase } from "@/lib/supabaseClient";

const __supabase = getServiceSupabase();

export async function __GET(_request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const __service = searchParams.get("service");
    const __level = searchParams.get("level");
    const __limit = parseInt(searchParams.get("limit") || "100");
    const __hours = parseInt(searchParams.get("hours") || "24");

    const __logs = await getActivityLogs({
      service,
      level,
      limit,
      hours,
    });

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      logs,
      summary: generateLogSummary(logs),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch logs" },
      { status: 500 },
    );
  }
}

async function __getActivityLogs(_filters: {
  service?: string | null;
  level?: string | null;
  limit: number;
  hours: number;
}) {
  try {
    let query = supabase
      .from("activity_logs")
      .select("*")
      .gte(
        "timestamp",
        new Date(Date.now() - filters.hours * 60 * 60 * 1000).toISOString(),
      )
      .order("timestamp", { ascending: false })
      .limit(filters.limit);

    if (filters.service) {
      query = query.eq("service_name", filters.service);
    }

    if (filters.level) {
      query = query.eq("level", filters.level);
    }

    const { data, error } = await query;

    if (error) throw error;

    return (
      data?.map((_log: unknown) => ({
        id: log.id,
        timestamp: log.timestamp,
        service: log.service_name,
        level: log.level,
        message: log.message,
        details: log.details,
        category: log.category,
        userId: log.user_id,
        sessionId: log.session_id,
      })) || []
    );
  } catch (error) {
    return [];
  }
}

function __generateLogSummary(_logs: unknown[]) {
  const __summary = {
    total: logs.length,
    byLevel: {} as Record<string, number>,
    byService: {} as Record<string, number>,
    byCategory: {} as Record<string, number>,
    recentActivity: logs.slice(0, 10),
    errorRate: 0,
    warningRate: 0,
  };

  logs.forEach((log) => {
    // Count by level
    summary.byLevel[log.level] = (summary.byLevel[log.level] || 0) + 1;

    // Count by service
    summary.byService[log.service] = (summary.byService[log.service] || 0) + 1;

    // Count by category
    if (log.category) {
      summary.byCategory[log.category] =
        (summary.byCategory[log.category] || 0) + 1;
    }
  });

  // Calculate rates
  summary.errorRate =
    summary.total > 0
      ? ((summary.byLevel.error || 0) / summary.total) * 100
      : 0;
  summary.warningRate =
    summary.total > 0 ? ((summary.byLevel.warn || 0) / summary.total) * 100 : 0;

  return summary;
}
