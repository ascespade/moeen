// src/app/api/dashboard/metrics/route.ts
// Real-time metrics API endpoint for dashboard
// Provides system health, performance, and automation metrics

import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabaseClient";

const supabase = getServiceSupabase();

export async function GET(request: NextRequest) {
  try {
    // Get system metrics from multiple sources
    const [
      systemHealth,
      systemMetrics,
      socialMediaMetrics,
      workflowMetrics,
      chatbotMetrics,
      healthcareMetrics,
      crmMetrics,
    ] = await Promise.all([
      getSystemHealth(),
      getSystemMetrics(),
      getSocialMediaMetrics(),
      getWorkflowMetrics(),
      getChatbotMetrics(),
      getHealthcareMetrics(),
      getCrmMetrics(),
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
      healthcare: healthcareMetrics,
      crm: crmMetrics,
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

async function getHealthcareMetrics() {
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
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const patientsThisMonth = patients.filter(p => 
      new Date(p.created_at) >= thisMonth
    ).length;

    const appointmentsToday = appointments.filter(a => 
      new Date(a.appointment_date).toDateString() === today.toDateString()
    ).length;

    const appointmentsThisWeek = appointments.filter(a => 
      new Date(a.appointment_date) >= thisWeek
    ).length;

    const completedAppointments = appointments.filter(a => 
      a.status === 'completed'
    ).length;

    const cancelledAppointments = appointments.filter(a => 
      a.status === 'cancelled'
    ).length;

    // Group doctors by specialty
    const specialties = doctors.reduce((acc, doctor) => {
      const specialty = doctor.specialty || 'غير محدد';
      acc[specialty] = (acc[specialty] || 0) + 1;
      return acc;
    }, {});

    const specialtiesArray = Object.entries(specialties).map(([name, count]) => ({
      name,
      count: count as number
    }));

    return {
      patients: {
        total: patients.length,
        active: patients.filter(p => p.status === 'active').length,
        newThisMonth: patientsThisMonth,
        growthRate: patients.length > 0 ? Math.round((patientsThisMonth / patients.length) * 100) : 0
      },
      appointments: {
        total: appointments.length,
        today: appointmentsToday,
        thisWeek: appointmentsThisWeek,
        completed: completedAppointments,
        cancelled: cancelledAppointments
      },
      doctors: {
        total: doctors.length,
        active: doctors.filter(d => d.status === 'active').length,
        specialties: specialtiesArray
      },
      revenue: {
        thisMonth: 0, // Would need revenue table
        lastMonth: 0,
        growthRate: 0,
        averagePerPatient: 0
      }
    };
  } catch (error) {
    console.error("Healthcare metrics error:", error);
    return {
      patients: { total: 0, active: 0, newThisMonth: 0, growthRate: 0 },
      appointments: { total: 0, today: 0, thisWeek: 0, completed: 0, cancelled: 0 },
      doctors: { total: 0, active: 0, specialties: [] },
      revenue: { thisMonth: 0, lastMonth: 0, growthRate: 0, averagePerPatient: 0 }
    };
  }
}

async function getCrmMetrics() {
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

    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const newLeads = leads.filter(l => 
      new Date(l.created_at) >= thisMonth
    ).length;

    const qualifiedLeads = leads.filter(l => 
      l.status === 'qualified'
    ).length;

    const convertedLeads = leads.filter(l => 
      l.status === 'converted'
    ).length;

    const wonDeals = deals.filter(d => 
      d.status === 'won'
    ).length;

    const lostDeals = deals.filter(d => 
      d.status === 'lost'
    ).length;

    const pipelineDeals = deals.filter(d => 
      ['prospecting', 'qualification', 'proposal', 'negotiation'].includes(d.status)
    ).length;

    const calls = activities.filter(a => 
      a.type === 'call'
    ).length;

    const meetings = activities.filter(a => 
      a.type === 'meeting'
    ).length;

    const tasks = activities.filter(a => 
      a.type === 'task'
    ).length;

    return {
      leads: {
        total: leads.length,
        new: newLeads,
        qualified: qualifiedLeads,
        converted: convertedLeads
      },
      deals: {
        total: deals.length,
        won: wonDeals,
        lost: lostDeals,
        pipeline: pipelineDeals
      },
      activities: {
        total: activities.length,
        calls,
        meetings,
        tasks
      }
    };
  } catch (error) {
    console.error("CRM metrics error:", error);
    return {
      leads: { total: 0, new: 0, qualified: 0, converted: 0 },
      deals: { total: 0, won: 0, lost: 0, pipeline: 0 },
      activities: { total: 0, calls: 0, meetings: 0, tasks: 0 }
    };
  }
}
