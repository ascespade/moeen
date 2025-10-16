/**
 * Report Generation API - توليد التقارير
 * Generate comprehensive reports with analytics and export functionality
 */

import { _NextRequest, NextResponse } from "next/server";
import { _z } from "zod";

import { _ErrorHandler } from "@/core/errors";
import { _ValidationHelper } from "@/core/validation";
import { _authorize, requireRole } from "@/lib/auth/authorize";
import { _createClient } from "@/lib/supabase/server";

const __reportSchema = z.object({
  type: z.enum([
    "dashboard_metrics",
    "patient_statistics",
    "appointment_analytics",
    "revenue_report",
    "insurance_claims",
    "staff_performance",
    "doctor_workload",
    "custom",
  ]),
  dateRange: z.object({
    startDate: z.string().date(),
    endDate: z.string().date(),
  }),
  filters: z.record(z.any()).optional(),
  format: z.enum(["json", "csv", "pdf"]).default("json"),
  groupBy: z.enum(["day", "week", "month", "year"]).optional(),
});

export async function __POST(_request: NextRequest) {
  try {
    // Authorize user (staff, supervisor, admin only)
    const { user: authUser, error: authError } = await authorize(request);
    if (
      authError ||
      !authUser ||
      !requireRole(["staff", "supervisor", "admin"])(authUser)
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const __supabase = createClient();
    const __body = await request.json();

    // Validate input
    const __validation = await ValidationHelper.validateAsync(reportSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.message },
        { status: 400 },
      );
    }

    const { type, dateRange, filters, format, groupBy } = validation.data;

    // Generate report based on type
    let reportData;
    switch (type) {
      case "dashboard_metrics":
        reportData = await generateDashboardMetrics(
          supabase,
          dateRange,
          filters,
        );
        break;
      case "patient_statistics":
        reportData = await generatePatientStatistics(
          supabase,
          dateRange,
          filters,
          groupBy || "",
        );
        break;
      case "appointment_analytics":
        reportData = await generateAppointmentAnalytics(
          supabase,
          dateRange,
          filters,
          groupBy || "",
        );
        break;
      case "revenue_report":
        reportData = await generateRevenueReport(
          supabase,
          dateRange,
          filters,
          groupBy || "",
        );
        break;
      case "insurance_claims":
        reportData = await generateInsuranceClaimsReport(
          supabase,
          dateRange,
          filters,
        );
        break;
      case "staff_performance":
        reportData = await generateStaffPerformanceReport(
          supabase,
          dateRange,
          filters,
        );
        break;
      case "doctor_workload":
        reportData = await generateDoctorWorkloadReport(
          supabase,
          dateRange,
          filters,
        );
        break;
      default:
        return NextResponse.json(
          { error: "Invalid report type" },
          { status: 400 },
        );
    }

    // Save report to database
    const { data: savedReport, error: saveError } = await supabase
      .from("reports_admin")
      .insert({
        type,
        payload: reportData,
        generatedBy: authUser.id,
        dateRange,
        filters,
        format,
      })
      .select()
      .single();

    if (saveError) {
      return NextResponse.json(
        { error: "Failed to save report" },
        { status: 500 },
      );
    }

    // Create audit log
    await supabase.from("audit_logs").insert({
      action: "report_generated",
      entityType: "report",
      entityId: savedReport.id,
      userId: authUser.id,
      metadata: {
        type,
        dateRange,
        format,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        reportId: savedReport.id,
        type,
        generatedAt: savedReport.generatedAt,
        data: reportData,
        format,
      },
      message: "Report generated successfully",
    });
  } catch (error) {
    return ErrorHandler.getInstance().handle(error as Error);
  }
}

async function __generateDashboardMetrics(
  supabase: unknown,
  dateRange: unknown,
  filters: unknown,
) {
  const { startDate, endDate } = dateRange;

  // Get basic counts
  const [patientsResult, appointmentsResult, paymentsResult] =
    await Promise.all([
      supabase
        .from("patients")
        .select("id, createdAt, isActivated")
        .gte("createdAt", startDate)
        .lte("createdAt", endDate),
      supabase
        .from("appointments")
        .select("id, status, paymentStatus, scheduledAt")
        .gte("scheduledAt", startDate)
        .lte("scheduledAt", endDate),
      supabase
        .from("payments")
        .select("id, amount, status, createdAt")
        .gte("createdAt", startDate)
        .lte("createdAt", endDate),
    ]);

  const __patients = patientsResult.data || [];
  const __appointments = appointmentsResult.data || [];
  const __payments = paymentsResult.data || [];

  // Calculate metrics
  const __totalPatients = patients.length;
  const __activatedPatients = patients.filter((_p: unknown) => p.isActivated).length;
  const __totalAppointments = appointments.length;
  const __completedAppointments = appointments.filter(
    (_a: unknown) => a.status === "completed",
  ).length;
  const __totalRevenue = payments
    .filter((_p: unknown) => p.status === "paid")
    .reduce((_sum: unknown, p: unknown) => sum + (p.amount || 0), 0);

  // Daily breakdown
  const __dailyStats = generateDailyBreakdown(
    appointments,
    payments,
    startDate,
    endDate,
  );

  return {
    summary: {
      totalPatients,
      activatedPatients,
      totalAppointments,
      completedAppointments,
      totalRevenue,
      activationRate:
        totalPatients > 0 ? (activatedPatients / totalPatients) * 100 : 0,
      completionRate:
        totalAppointments > 0
          ? (completedAppointments / totalAppointments) * 100
          : 0,
    },
    dailyStats,
    trends: {
      patientGrowth: calculateGrowthRate(patients, "createdAt"),
      appointmentGrowth: calculateGrowthRate(appointments, "scheduledAt"),
      revenueGrowth: calculateGrowthRate(payments, "createdAt"),
    },
  };
}

async function __generatePatientStatistics(
  supabase: unknown,
  dateRange: unknown,
  filters: unknown,
  groupBy: string,
) {
  const { startDate, endDate } = dateRange;

  const { data: patients } = await supabase
    .from("patients")
    .select(
      `
      id,
      createdAt,
      isActivated,
      activationDate,
      insuranceProvider,
      emergencyContact
    `,
    )
    .gte("createdAt", startDate)
    .lte("createdAt", endDate);

  if (!patients) return {};

  // Group by specified period
  const __grouped = groupDataByPeriod(patients, "createdAt", groupBy || "");

  // Calculate statistics
  const __stats = {
    total: patients.length,
    activated: patients.filter((_p: unknown) => p.isActivated).length,
    pending: patients.filter((_p: unknown) => !p.isActivated).length,
    byInsurance: groupByField(patients, "insuranceProvider"),
    byAgeGroup: calculateAgeGroups(patients),
    activationTrend: grouped.map((group) => ({
      period: group.period,
      total: group.data.length,
      activated: group.data.filter((_p: unknown) => p.isActivated).length,
    })),
  };

  return stats;
}

async function __generateAppointmentAnalytics(
  supabase: unknown,
  dateRange: unknown,
  filters: unknown,
  groupBy: string,
) {
  const { startDate, endDate } = dateRange;

  const { data: appointments } = await supabase
    .from("appointments")
    .select(
      `
      id,
      status,
      type,
      scheduledAt,
      duration,
      patientId,
      doctorId
    `,
    )
    .gte("scheduledAt", startDate)
    .lte("scheduledAt", endDate);

  if (!appointments) return {};

  const __grouped = groupDataByPeriod(appointments, "scheduledAt", groupBy || "");

  return {
    total: appointments.length,
    byStatus: groupByField(appointments, "status"),
    byType: groupByField(appointments, "type"),
    averageDuration:
      appointments.reduce(
        (_sum: unknown, apt: unknown) => sum + (apt.duration || 30),
        0,
      ) / appointments.length,
    trends: grouped.map((group) => ({
      period: group.period,
      total: group.data.length,
      completed: group.data.filter((_a: unknown) => a.status === "completed").length,
    })),
  };
}

async function __generateRevenueReport(
  supabase: unknown,
  dateRange: unknown,
  filters: unknown,
  groupBy: string,
) {
  const { startDate, endDate } = dateRange;

  const { data: payments } = await supabase
    .from("payments")
    .select(
      `
      id,
      amount,
      status,
      method,
      createdAt,
      appointmentId
    `,
    )
    .gte("createdAt", startDate)
    .lte("createdAt", endDate);

  if (!payments) return {};

  const __paidPayments = payments.filter((p) => p.status === "paid");
  const __grouped = groupDataByPeriod(paidPayments, "createdAt", groupBy || "");

  return {
    totalRevenue: paidPayments.reduce((sum, p) => sum + (p.amount || 0), 0),
    byMethod: groupByField(paidPayments, "method"),
    byStatus: groupByField(payments, "status"),
    dailyRevenue: grouped.map((group) => ({
      period: group.period,
      revenue: group.data.reduce((sum, p) => sum + (p.amount || 0), 0),
      count: group.data.length,
    })),
  };
}

async function __generateInsuranceClaimsReport(
  supabase: unknown,
  dateRange: unknown,
  filters: unknown,
) {
  const { startDate, endDate } = dateRange;

  const { data: claims } = await supabase
    .from("insurance_claims")
    .select(
      `
      id,
      provider,
      claimStatus,
      amount,
      createdAt,
      patientId
    `,
    )
    .gte("createdAt", startDate)
    .lte("createdAt", endDate);

  if (!claims) return {};

  return {
    total: claims.length,
    byProvider: groupByField(claims, "provider"),
    byStatus: groupByField(claims, "claimStatus"),
    totalAmount: claims.reduce((sum, c) => sum + (c.amount || 0), 0),
    approvalRate:
      claims.length > 0
        ? (claims.filter((c) => c.claimStatus === "approved").length /
            claims.length) *
          100
        : 0,
  };
}

async function __generateStaffPerformanceReport(
  supabase: unknown,
  dateRange: unknown,
  filters: unknown,
) {
  // Implementation for staff performance metrics
  return { message: "Staff performance report implementation pending" };
}

async function __generateDoctorWorkloadReport(
  supabase: unknown,
  dateRange: unknown,
  filters: unknown,
) {
  // Implementation for doctor workload metrics
  return { message: "Doctor workload report implementation pending" };
}

// Helper functions
function __generateDailyBreakdown(
  appointments: unknown[],
  payments: unknown[],
  startDate: string,
  endDate: string,
) {
  const days: Array<{ date: string; appointments: number; revenue: number }> =
    [];
  const __current = new Date(startDate);
  const __end = new Date(endDate);

  while (current <= end) {
    const __dateStr = current.toISOString().split("T")[0] || "";
    const __dayAppointments = appointments.filter((a) =>
      a.scheduledAt?.startsWith(dateStr),
    );
    const __dayPayments = payments.filter((p) =>
      p.createdAt?.startsWith(dateStr),
    );

    days.push({
      date: dateStr,
      appointments: dayAppointments.length,
      revenue: dayPayments
        .filter((p) => p.status === "paid")
        .reduce((sum, p) => sum + (p.amount || 0), 0),
    });

    current.setDate(current.getDate() + 1);
  }

  return days;
}

function __calculateGrowthRate(_data: unknown[], dateField: string) {
  if (data.length < 2) return 0;

  const __sorted = data.sort(
    (a, b) =>
      new Date(a[dateField]).getTime() - new Date(b[dateField]).getTime(),
  );

  const __firstHalf = sorted.slice(0, Math.floor(sorted.length / 2));
  const __secondHalf = sorted.slice(Math.floor(sorted.length / 2));

  const __firstCount = firstHalf.length;
  const __secondCount = secondHalf.length;

  return firstCount > 0 ? ((secondCount - firstCount) / firstCount) * 100 : 0;
}

function __groupDataByPeriod(_data: unknown[], dateField: string, period: string) {
  const __groups = new Map();

  data.forEach((item) => {
    const __date = new Date(item[dateField]);
    let key;

    switch (period) {
      case "day":
        key = date.toISOString().split("T")[0];
        break;
      case "week":
        const __weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split("T")[0];
        break;
      case "month":
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        break;
      case "year":
        key = date.getFullYear().toString();
        break;
      default:
        key = date.toISOString().split("T")[0];
    }

    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key).push(item);
  });

  return Array.from(groups.entries()).map(([period, data]) => ({
    period,
    data,
  }));
}

function __groupByField(_data: unknown[], field: string) {
  const __groups = new Map();

  data.forEach((item) => {
    const __value = item[field] || "Unknown";
    groups.set(value, (groups.get(value) || 0) + 1);
  });

  return Object.fromEntries(groups);
}

function __calculateAgeGroups(_patients: unknown[]) {
  const __groups = {
    "0-18": 0,
    "19-35": 0,
    "36-50": 0,
    "51-65": 0,
    "65+": 0,
  };

  patients.forEach((patient) => {
    // This would need actual birth date calculation
    // For now, return empty groups
  });

  return groups;
}
