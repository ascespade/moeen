// src/app/api/dashboard/metrics/route.ts
// Real-time metrics API endpoint for dashboard
// Provides system health, performance, and automation metrics

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function GET(request: NextRequest) {
  try {
    // Get system metrics from multiple sources
    const [
      systemHealth,
      systemMetrics,
      socialMediaMetrics,
      workflowMetrics,
      chatbotMetrics,
    ] = await Promise.all([
      getSystemHealth(),
      getSystemMetrics(),
      getSocialMediaMetrics(),
      getWorkflowMetrics(),
      getChatbotMetrics(),
    ]);

    const metrics = {
      timestamp: new Date().toISOString(),
      system: {
        health: systemHealth,
        metrics: systemMetrics,
      },
      automation: {
        socialMedia: socialMediaMetrics,
        workflows: workflowMetrics,
        chatbot: chatbotMetrics,
      },
      summary: {
        overallHealth: calculateOverallHealth(systemHealth),
        activeServices: countActiveServices(systemHealth),
        totalAutomation:
          (socialMediaMetrics as any).postsPublished +
          (workflowMetrics as any).executionsSuccessful,
        errorRate: calculateErrorRate(systemMetrics),
      },
    };

    return NextResponse.json(metrics);
  } catch (error) {
    console.error("Dashboard metrics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch metrics" },
      { status: 500 },
    );
  }
}

async function getSystemHealth() {
  try {
    const { data, error } = await supabase
      .from("system_health")
      .select("*")
      .order("last_check", { ascending: false })
      .limit(10);

    if (error) throw error;

    return data.map((service) => ({
      service: service.service_name,
      status: service.is_healthy ? "healthy" : "unhealthy",
      lastCheck: service.last_check,
      details: service.health_status,
    }));
  } catch (error) {
    console.error("System health error:", error);
    return [];
  }
}

async function getSystemMetrics() {
  try {
    const { data, error } = await supabase
      .from("system_metrics")
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(50);

    if (error) throw error;

    // Aggregate metrics by service
    const aggregated = data.reduce((acc, metric) => {
      const service = metric.service_name;
      if (!acc[service]) {
        acc[service] = {
          service,
          lastUpdate: metric.timestamp,
          metrics: metric.metrics,
        };
      }
      return acc;
    }, {});

    return Object.values(aggregated);
  } catch (error) {
    console.error("System metrics error:", error);
    return [];
  }
}

async function getSocialMediaMetrics() {
  try {
    const { data, error } = await supabase
      .from("social_media_metrics")
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(100);

    if (error) throw error;

    const summary = {
      totalPosts: data.length,
      platforms: {},
      engagement: {
        totalViews: 0,
        totalLikes: 0,
        totalComments: 0,
        totalShares: 0,
      },
    };

    data.forEach((metric) => {
      const platform = metric.platform;
      if (!summary.platforms[platform]) {
        summary.platforms[platform] = {
          posts: 0,
          views: 0,
          likes: 0,
          comments: 0,
          shares: 0,
        };
      }

      summary.platforms[platform].posts++;
      summary.platforms[platform].views += metric.metrics.views || 0;
      summary.platforms[platform].likes += metric.metrics.likes || 0;
      summary.platforms[platform].comments += metric.metrics.comments || 0;
      summary.platforms[platform].shares += metric.metrics.shares || 0;

      summary.engagement.totalViews += metric.metrics.views || 0;
      summary.engagement.totalLikes += metric.metrics.likes || 0;
      summary.engagement.totalComments += metric.metrics.comments || 0;
      summary.engagement.totalShares += metric.metrics.shares || 0;
    });

    return summary;
  } catch (error) {
    console.error("Social media metrics error:", error);
    return {
      totalPosts: 0,
      platforms: {},
      engagement: {
        totalViews: 0,
        totalLikes: 0,
        totalComments: 0,
        totalShares: 0,
      },
    };
  }
}

async function getWorkflowMetrics() {
  try {
    const { data, error } = await supabase
      .from("workflow_validation")
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(50);

    if (error) throw error;

    const summary = {
      totalWorkflows: data.length,
      validWorkflows: data.filter((w) => w.is_valid).length,
      invalidWorkflows: data.filter((w) => !w.is_valid).length,
      commonIssues: {},
    };

    // Count common issues
    data.forEach((workflow) => {
      workflow.issues.forEach((issue) => {
        summary.commonIssues[issue] = (summary.commonIssues[issue] || 0) + 1;
      });
    });

    return summary;
  } catch (error) {
    console.error("Workflow metrics error:", error);
    return {
      totalWorkflows: 0,
      validWorkflows: 0,
      invalidWorkflows: 0,
      commonIssues: {},
    };
  }
}

async function getChatbotMetrics() {
  try {
    const { data, error } = await supabase
      .from("chatbot_flows")
      .select("*")
      .eq("status", "published");

    if (error) throw error;

    const summary = {
      activeFlows: data.length,
      totalNodes: data.reduce(
        (acc, flow) => acc + (flow.nodes?.length || 0),
        0,
      ),
      totalTemplates: 0, // Would need separate query
      languages: [...new Set(data.map((flow) => flow.language))],
      categories: [...new Set(data.map((flow) => flow.category))],
    };

    return summary;
  } catch (error) {
    console.error("Chatbot metrics error:", error);
    return {
      activeFlows: 0,
      totalNodes: 0,
      totalTemplates: 0,
      languages: [],
      categories: [],
    };
  }
}

function calculateOverallHealth(systemHealth: any[]) {
  if (systemHealth.length === 0) return "unknown";

  const healthyServices = systemHealth.filter(
    (service) => service.status === "healthy",
  ).length;
  const totalServices = systemHealth.length;

  const healthPercentage = (healthyServices / totalServices) * 100;

  if (healthPercentage >= 90) return "excellent";
  if (healthPercentage >= 75) return "good";
  if (healthPercentage >= 50) return "fair";
  return "poor";
}

function countActiveServices(systemHealth: any[]) {
  return systemHealth.filter((service) => service.status === "healthy").length;
}

function calculateErrorRate(systemMetrics: any[]) {
  if (systemMetrics.length === 0) return 0;

  const totalErrors = systemMetrics.reduce((acc, metric) => {
    return acc + (metric.metrics?.errors || 0);
  }, 0);

  const totalOperations = systemMetrics.reduce((acc, metric) => {
    return acc + (metric.metrics?.totalOperations || 1);
  }, 0);

  return totalOperations > 0 ? (totalErrors / totalOperations) * 100 : 0;
}
