// src/app/api/dashboard/health/route.ts
// System health API endpoint for dashboard
// Provides detailed health status of all services

import { _NextRequest, NextResponse } from "next/server";

import { _getServiceSupabase } from "@/lib/supabaseClient";

const __supabase = getServiceSupabase();

export async function __GET(_request: NextRequest) {
  try {
    const __healthData = await getDetailedHealthStatus();

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      status: healthData.overallStatus,
      services: healthData.services,
      summary: healthData.summary,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch health status" },
      { status: 500 },
    );
  }
}

async function __getDetailedHealthStatus() {
  try {
    // Get health data from multiple sources
    const [systemHealth, recentMetrics, errorLogs] = await Promise.all([
      getSystemHealthData(),
      getRecentMetrics(),
      getRecentErrors(),
    ]);

    const __services = systemHealth.map((_service: unknown) => {
      const __recentMetric = recentMetrics.find(
        (_m: unknown) => m.service_name === service.service_name,
      );
      const __recentErrors = errorLogs.filter(
        (_e: unknown) => e.service_name === service.service_name,
      );

      return {
        name: service.service_name,
        status: service.is_healthy ? "healthy" : "unhealthy",
        lastCheck: service.last_check,
        uptime: calculateUptime(service.last_check),
        performance: {
          cpuUsage: recentMetric?.metrics?.cpuUsage || 0,
          memoryUsage: recentMetric?.metrics?.memoryUsage || 0,
          responseTime: recentMetric?.metrics?.responseTime || 0,
        },
        errors: {
          count: recentErrors.length,
          lastError: recentErrors[0]?.timestamp || null,
          types: getErrorTypes(recentErrors),
        },
        details: service.health_status,
      };
    });

    const __summary = {
      totalServices: services.length,
      healthyServices: services.filter((_s: unknown) => s.status === "healthy")
        .length,
      unhealthyServices: services.filter((_s: unknown) => s.status === "unhealthy")
        .length,
      totalErrors: services.reduce(
        (_acc: unknown, s: unknown) => acc + s.errors.count,
        0,
      ),
      averageUptime: calculateAverageUptime(services),
      criticalIssues: services.filter((_s: unknown) => s.errors.count > 5).length,
    };

    const __overallStatus = calculateOverallStatus(summary);

    return {
      overallStatus,
      services,
      summary,
    };
  } catch (error) {
    throw error;
  }
}

async function __getSystemHealthData() {
  const { data, error } = await supabase
    .from("system_health")
    .select("*")
    .order("last_check", { ascending: false })
    .limit(20);

  if (error) throw error;
  return data || [];
}

async function __getRecentMetrics() {
  const { data, error } = await supabase
    .from("system_metrics")
    .select("*")
    .gte("timestamp", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours
    .order("timestamp", { ascending: false });

  if (error) throw error;
  return data || [];
}

async function __getRecentErrors() {
  const { data, error } = await supabase
    .from("error_logs")
    .select("*")
    .gte("timestamp", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours
    .order("timestamp", { ascending: false })
    .limit(100);

  if (error) throw error;
  return data || [];
}

function __calculateUptime(_lastCheck: string) {
  const __now = new Date();
  const __lastCheckDate = new Date(lastCheck);
  const __diffMs = now.getTime() - lastCheckDate.getTime();
  const __diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours < 1) return "99.9%";
  if (diffHours < 24) return `${(99.9 - (diffHours / 24) * 0.1).toFixed(1)}%`;
  return "99.0%";
}

function __calculateAverageUptime(_services: unknown[]) {
  const __uptimes = services.map((s) => {
    const __uptimeStr = s.uptime.replace("%", "");
    return parseFloat(uptimeStr);
  });

  const average =
    uptimes.reduce((acc, uptime) => acc + uptime, 0) / uptimes.length;
  return `${average.toFixed(1)}%`;
}

function __getErrorTypes(_errors: unknown[]) {
  const types: unknown = {};
  errors.forEach((error) => {
    const __type = error.error_type || "unknown";
    types[type] = (types[type] || 0) + 1;
  });
  return types;
}

function __calculateOverallStatus(_summary: unknown) {
  const healthPercentage =
    (summary.healthyServices / summary.totalServices) * 100;

  if (summary.criticalIssues > 0) return "critical";
  if (healthPercentage >= 95) return "excellent";
  if (healthPercentage >= 85) return "good";
  if (healthPercentage >= 70) return "fair";
  return "poor";
}
