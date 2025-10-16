// src/app/api/dashboard/metrics/route.ts
// Real-time metrics API endpoint for dashboard
// Provides system health, performance, and automation metrics

import { _NextRequest, NextResponse } from "next/server";

import { _getServiceSupabase } from "@/lib/supabaseClient";

const __supabase = getServiceSupabase();

export async function __GET(_request: NextRequest) {
  const __logError = (_error: unknown, context: string) => {
    const __timestamp = new Date().toISOString();
    const __errorMessage = `[${timestamp}] Dashboard metrics error in ${context}: ${error.message || error}`;
    // Log to file if possible
    try {
      const __fs = require("fs");
      const __path = require("path");
      const __logFile = path.join(
        process.cwd(),
        "logs",
        "dashboard_refactor.log",
      );
      fs.appendFileSync(logFile, errorMessage + "\n");
    } catch (logError) {
      // Ignore logging errors
    }
  };

  try {
    // Check if database is accessible first
    const { data: healthCheck, error: healthError } = await supabase
      .from("system_health")
      .select("id")
      .limit(1);

    if (healthError) {
      logError(healthError, "database_connection");
      // Return fallback data when DB is down
      return NextResponse.json({
        timestamp: new Date().toISOString(),
        system: {
          health: [],
          metrics: [],
        },
        automation: {
          socialMedia: {
            totalPosts: 0,
            platforms: {},
            engagement: {
              totalViews: 0,
              totalLikes: 0,
              totalComments: 0,
              totalShares: 0,
            },
          },
          workflows: {
            totalWorkflows: 0,
            validWorkflows: 0,
            invalidWorkflows: 0,
            commonIssues: {},
          },
          chatbot: {
            activeFlows: 0,
            totalNodes: 0,
            totalTemplates: 0,
            languages: [],
            categories: [],
          },
        },
        healthcare: {
          patients: { total: 0, active: 0, newThisMonth: 0, growthRate: 0 },
          appointments: {
            total: 0,
            today: 0,
            thisWeek: 0,
            completed: 0,
            cancelled: 0,
          },
          doctors: { total: 0, active: 0, specialties: [] },
          revenue: {
            thisMonth: 0,
            lastMonth: 0,
            growthRate: 0,
            averagePerPatient: 0,
          },
        },
        crm: {
          leads: { total: 0, new: 0, qualified: 0, converted: 0 },
          deals: { total: 0, won: 0, lost: 0, pipeline: 0 },
          activities: { total: 0, calls: 0, meetings: 0, tasks: 0 },
        },
        summary: {
          overallHealth: "unknown",
          activeServices: 0,
          totalAutomation: 0,
          errorRate: 0,
        },
        fallback: true,
        message: "Database connection failed, returning fallback data",
      });
    }

    // Get system metrics from multiple sources with individual error handling
    const [
      systemHealth,
      systemMetrics,
      socialMediaMetrics,
      workflowMetrics,
      chatbotMetrics,
      healthcareMetrics,
      crmMetrics,
    ] = await Promise.allSettled([
      getSystemHealth(),
      getSystemMetrics(),
      getSocialMediaMetrics(),
      getWorkflowMetrics(),
      getChatbotMetrics(),
      getHealthcareMetrics(),
      getCrmMetrics(),
    ]);

    // Extract successful results or use fallback data
    const systemHealthData =
      systemHealth.status === "fulfilled" ? systemHealth.value : [];
    const systemMetricsData =
      systemMetrics.status === "fulfilled" ? systemMetrics.value : [];
    const socialMediaMetricsData =
      socialMediaMetrics.status === "fulfilled"
        ? socialMediaMetrics.value
        : {
            totalPosts: 0,
            platforms: {},
            engagement: {
              totalViews: 0,
              totalLikes: 0,
              totalComments: 0,
              totalShares: 0,
            },
          };
    const workflowMetricsData =
      workflowMetrics.status === "fulfilled"
        ? workflowMetrics.value
        : {
            totalWorkflows: 0,
            validWorkflows: 0,
            invalidWorkflows: 0,
            commonIssues: {},
          };
    const chatbotMetricsData =
      chatbotMetrics.status === "fulfilled"
        ? chatbotMetrics.value
        : {
            activeFlows: 0,
            totalNodes: 0,
            totalTemplates: 0,
            languages: [],
            categories: [],
          };
    const healthcareMetricsData =
      healthcareMetrics.status === "fulfilled"
        ? healthcareMetrics.value
        : {
            patients: { total: 0, active: 0, newThisMonth: 0, growthRate: 0 },
            appointments: {
              total: 0,
              today: 0,
              thisWeek: 0,
              completed: 0,
              cancelled: 0,
            },
            doctors: { total: 0, active: 0, specialties: [] },
            revenue: {
              thisMonth: 0,
              lastMonth: 0,
              growthRate: 0,
              averagePerPatient: 0,
            },
          };
    const crmMetricsData =
      crmMetrics.status === "fulfilled"
        ? crmMetrics.value
        : {
            leads: { total: 0, new: 0, qualified: 0, converted: 0 },
            deals: { total: 0, won: 0, lost: 0, pipeline: 0 },
            activities: { total: 0, calls: 0, meetings: 0, tasks: 0 },
          };

    // Log any failed promises
    [
      systemHealth,
      systemMetrics,
      socialMediaMetrics,
      workflowMetrics,
      chatbotMetrics,
      healthcareMetrics,
      crmMetrics,
    ].forEach((result, index) => {
      if (result.status === "rejected") {
        const __contexts = [
          "systemHealth",
          "systemMetrics",
          "socialMediaMetrics",
          "workflowMetrics",
          "chatbotMetrics",
          "healthcareMetrics",
          "crmMetrics",
        ];
        logError(result.reason, contexts[index] || "unknown");
      }
    });

    const __metrics = {
      timestamp: new Date().toISOString(),
      system: {
        health: systemHealthData,
        metrics: systemMetricsData,
      },
      automation: {
        socialMedia: socialMediaMetricsData,
        workflows: workflowMetricsData,
        chatbot: chatbotMetricsData,
      },
      healthcare: healthcareMetricsData,
      crm: crmMetricsData,
      summary: {
        overallHealth: calculateOverallHealth(systemHealthData),
        activeServices: countActiveServices(systemHealthData),
        totalAutomation:
          (socialMediaMetricsData as any).postsPublished +
          (workflowMetricsData as any).executionsSuccessful,
        errorRate: calculateErrorRate(systemMetricsData),
      },
    };

    return NextResponse.json(metrics);
  } catch (error) {
    logError(error, "main_handler");
    return NextResponse.json(
      {
        error: "Failed to fetch metrics",
        timestamp: new Date().toISOString(),
        fallback: true,
        message: "System error occurred, returning fallback data",
      },
      { status: 500 },
    );
  }
}

async function __getSystemHealth() {
  try {
    // Check if table exists first
    const { data, error } = await supabase
      .from("system_health")
      .select("id")
      .limit(1);

    if (error && error.code === "PGRST116") {
      // Table doesn't exist, return empty array
      return [];
    }

    if (error) throw error;

    const { data: healthData, error: healthError } = await supabase
      .from("system_health")
      .select("*")
      .order("last_check", { ascending: false })
      .limit(10);

    if (healthError) throw healthError;

    return healthData.map((_service: unknown) => ({
      service: service.service_name,
      status: service.is_healthy ? "healthy" : "unhealthy",
      lastCheck: service.last_check,
      details: service.health_status,
    }));
  } catch (error) {
    return [];
  }
}

async function __getSystemMetrics() {
  try {
    // Check if table exists first
    const { data, error } = await supabase
      .from("system_metrics")
      .select("id")
      .limit(1);

    if (error && error.code === "PGRST116") {
      // Table doesn't exist, return empty array
      return [];
    }

    if (error) throw error;

    const { data: metricsData, error: metricsError } = await supabase
      .from("system_metrics")
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(50);

    if (metricsError) throw metricsError;

    // Aggregate metrics by service
    const __aggregated = metricsData.reduce((_acc: unknown, metric: unknown) => {
      const __service = metric.service_name;
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
    return [];
  }
}

async function __getSocialMediaMetrics() {
  try {
    const { data, error } = await supabase
      .from("social_media_metrics")
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(100);

    if (error) throw error;

    const __summary = {
      totalPosts: data.length,
      platforms: {},
      engagement: {
        totalViews: 0,
        totalLikes: 0,
        totalComments: 0,
        totalShares: 0,
      },
    };

    data.forEach((_metric: unknown) => {
      const __platform = metric.platform;
      if (!(summary.platforms as any)[platform]) {
        (summary.platforms as any)[platform] = {
          posts: 0,
          views: 0,
          likes: 0,
          comments: 0,
          shares: 0,
        };
      }

      (summary.platforms as any)[platform].posts++;
      (summary.platforms as any)[platform].views +=
        (metric.metrics as any).views || 0;
      (summary.platforms as any)[platform].likes +=
        (metric.metrics as any).likes || 0;
      (summary.platforms as any)[platform].comments +=
        (metric.metrics as any).comments || 0;
      (summary.platforms as any)[platform].shares +=
        (metric.metrics as any).shares || 0;

      summary.engagement.totalViews += (metric.metrics as any).views || 0;
      summary.engagement.totalLikes += (metric.metrics as any).likes || 0;
      summary.engagement.totalComments += (metric.metrics as any).comments || 0;
      summary.engagement.totalShares += (metric.metrics as any).shares || 0;
    });

    return summary;
  } catch (error) {
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

async function __getWorkflowMetrics() {
  try {
    const { data, error } = await supabase
      .from("workflow_validation")
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(50);

    if (error) throw error;

    const __summary = {
      totalWorkflows: data.length,
      validWorkflows: data.filter((_w: unknown) => w.is_valid).length,
      invalidWorkflows: data.filter((_w: unknown) => !w.is_valid).length,
      commonIssues: {},
    };

    // Count common issues
    data.forEach((_workflow: unknown) => {
      workflow.issues.forEach((_issue: unknown) => {
        (summary.commonIssues as any)[issue] =
          ((summary.commonIssues as any)[issue] || 0) + 1;
      });
    });

    return summary;
  } catch (error) {
    return {
      totalWorkflows: 0,
      validWorkflows: 0,
      invalidWorkflows: 0,
      commonIssues: {},
    };
  }
}

async function __getChatbotMetrics() {
  try {
    const { data, error } = await supabase
      .from("chatbot_flows")
      .select("*")
      .eq("status", "published");

    if (error) throw error;

    const __summary = {
      activeFlows: data.length,
      totalNodes: data.reduce(
        (_acc: unknown, flow: unknown) => acc + (flow.nodes?.length || 0),
        0,
      ),
      totalTemplates: 0, // Would need separate query
      languages: [...new Set(data.map((_flow: unknown) => flow.language))],
      categories: [...new Set(data.map((_flow: unknown) => flow.category))],
    };

    return summary;
  } catch (error) {
    return {
      activeFlows: 0,
      totalNodes: 0,
      totalTemplates: 0,
      languages: [],
      categories: [],
    };
  }
}

function __calculateOverallHealth(_systemHealth: unknown[]) {
  if (systemHealth.length === 0) return "unknown";

  const __healthyServices = systemHealth.filter(
    (service) => service.status === "healthy",
  ).length;
  const __totalServices = systemHealth.length;

  const __healthPercentage = (healthyServices / totalServices) * 100;

  if (healthPercentage >= 90) return "excellent";
  if (healthPercentage >= 75) return "good";
  if (healthPercentage >= 50) return "fair";
  return "poor";
}

function __countActiveServices(_systemHealth: unknown[]) {
  return systemHealth.filter((service) => service.status === "healthy").length;
}

function __calculateErrorRate(_systemMetrics: unknown[]) {
  if (systemMetrics.length === 0) return 0;

  const __totalErrors = systemMetrics.reduce((acc, metric) => {
    return acc + (metric.metrics?.errors || 0);
  }, 0);

  const __totalOperations = systemMetrics.reduce((acc, metric) => {
    return acc + (metric.metrics?.totalOperations || 1);
  }, 0);

  return totalOperations > 0 ? (totalErrors / totalOperations) * 100 : 0;
}

async function __getHealthcareMetrics() {
  try {
    // Get patients data
    const { data: patients, error: patientsError } = await supabase
      .from("patients")
      .select("id, created_at, status");

    if (patientsError) throw patientsError;

    // Get appointments data
    const { data: appointments, error: appointmentsError } = await supabase
      .from("appointments")
      .select("id, appointment_date, status, created_at");

    if (appointmentsError) throw appointmentsError;

    // Get doctors data
    const { data: doctors, error: doctorsError } = await supabase
      .from("doctors")
      .select("id, specialty, status");

    if (doctorsError) throw doctorsError;

    // Calculate metrics
    const __now = new Date();
    const __thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const __today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const __thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const __patientsThisMonth = patients.filter(
      (_p: unknown) => new Date(p.created_at) >= thisMonth,
    ).length;

    const __appointmentsToday = appointments.filter(
      (_a: unknown) =>
        new Date(a.appointment_date).toDateString() === today.toDateString(),
    ).length;

    const __appointmentsThisWeek = appointments.filter(
      (_a: unknown) => new Date(a.appointment_date) >= thisWeek,
    ).length;

    const __completedAppointments = appointments.filter(
      (_a: unknown) => a.status === "completed",
    ).length;

    const __cancelledAppointments = appointments.filter(
      (_a: unknown) => a.status === "cancelled",
    ).length;

    // Group doctors by specialty
    const __specialties = doctors.reduce((_acc: unknown, doctor: unknown) => {
      const __specialty = doctor.specialty || "غير محدد";
      acc[specialty] = (acc[specialty] || 0) + 1;
      return acc;
    }, {});

    const __specialtiesArray = Object.entries(specialties).map(
      ([name, count]) => ({
        name,
        count: count as number,
      }),
    );

    return {
      patients: {
        total: patients.length,
        active: patients.filter((_p: unknown) => p.status === "active").length,
        newThisMonth: patientsThisMonth,
        growthRate:
          patients.length > 0
            ? Math.round((patientsThisMonth / patients.length) * 100)
            : 0,
      },
      appointments: {
        total: appointments.length,
        today: appointmentsToday,
        thisWeek: appointmentsThisWeek,
        completed: completedAppointments,
        cancelled: cancelledAppointments,
      },
      doctors: {
        total: doctors.length,
        active: doctors.filter((_d: unknown) => d.status === "active").length,
        specialties: specialtiesArray,
      },
      revenue: {
        thisMonth: 0, // Would need revenue table
        lastMonth: 0,
        growthRate: 0,
        averagePerPatient: 0,
      },
    };
  } catch (error) {
    return {
      patients: { total: 0, active: 0, newThisMonth: 0, growthRate: 0 },
      appointments: {
        total: 0,
        today: 0,
        thisWeek: 0,
        completed: 0,
        cancelled: 0,
      },
      doctors: { total: 0, active: 0, specialties: [] },
      revenue: {
        thisMonth: 0,
        lastMonth: 0,
        growthRate: 0,
        averagePerPatient: 0,
      },
    };
  }
}

async function __getCrmMetrics() {
  try {
    // Get leads data
    const { data: leads, error: leadsError } = await supabase
      .from("leads")
      .select("id, status, created_at");

    if (leadsError) throw leadsError;

    // Get deals data
    const { data: deals, error: dealsError } = await supabase
      .from("deals")
      .select("id, status, created_at");

    if (dealsError) throw dealsError;

    // Get activities data
    const { data: activities, error: activitiesError } = await supabase
      .from("activities")
      .select("id, type, created_at");

    if (activitiesError) throw activitiesError;

    const __now = new Date();
    const __thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const __newLeads = leads.filter(
      (_l: unknown) => new Date(l.created_at) >= thisMonth,
    ).length;

    const __qualifiedLeads = leads.filter(
      (_l: unknown) => l.status === "qualified",
    ).length;

    const __convertedLeads = leads.filter(
      (_l: unknown) => l.status === "converted",
    ).length;

    const __wonDeals = deals.filter((_d: unknown) => d.status === "won").length;

    const __lostDeals = deals.filter((_d: unknown) => d.status === "lost").length;

    const __pipelineDeals = deals.filter((_d: unknown) =>
      ["prospecting", "qualification", "proposal", "negotiation"].includes(
        d.status,
      ),
    ).length;

    const __calls = activities.filter((_a: unknown) => a.type === "call").length;

    const __meetings = activities.filter((_a: unknown) => a.type === "meeting").length;

    const __tasks = activities.filter((_a: unknown) => a.type === "task").length;

    return {
      leads: {
        total: leads.length,
        new: newLeads,
        qualified: qualifiedLeads,
        converted: convertedLeads,
      },
      deals: {
        total: deals.length,
        won: wonDeals,
        lost: lostDeals,
        pipeline: pipelineDeals,
      },
      activities: {
        total: activities.length,
        calls,
        meetings,
        tasks,
      },
    };
  } catch (error) {
    return {
      leads: { total: 0, new: 0, qualified: 0, converted: 0 },
      deals: { total: 0, won: 0, lost: 0, pipeline: 0 },
      activities: { total: 0, calls: 0, meetings: 0, tasks: 0 },
    };
  }
}
