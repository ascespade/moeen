/**
 * Report Generation API - توليد التقارير
 * Generate comprehensive reports with analytics and export functionality
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { ValidationHelper } from '@/core/validation';
import { ErrorHandler } from '@/core/errors';
import { requireAuth } from '@/lib/auth/authorize';

const reportSchema = z.object({
  type: z.enum([
    'dashboard_metrics',
    'patient_statistics',
    'appointment_analytics',
    'revenue_report',
    'insurance_claims',
    'staff_performance',
    'doctor_workload',
    'custom'
  ]),
  dateRange: z.object({
    startDate: z.string().date(),
    endDate: z.string().date(),
  }),
  filters: z.record(z.any()).optional(),
  format: z.enum(['json', 'csv', 'pdf']).default('json'),
  groupBy: z.enum(['day', 'week', 'month', 'year']).optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Authorize user (staff, supervisor, admin only)
    const authResult = await requireAuth(['staff', 'supervisor', 'admin'])(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();
    const body = await request.json();

    // Validate input
    const validation = await ValidationHelper.validateAsync(reportSchema, body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.message }, { status: 400 });
    }

    const { type, dateRange, filters, format, groupBy } = validation.data;

    // Generate report based on type
    let reportData;
    switch (type) {
      case 'dashboard_metrics':
        reportData = await generateDashboardMetrics(supabase, dateRange, filters);
        break;
      case 'patient_statistics':
        reportData = await generatePatientStatistics(supabase, dateRange, filters, groupBy);
        break;
      case 'appointment_analytics':
        reportData = await generateAppointmentAnalytics(supabase, dateRange, filters, groupBy);
        break;
      case 'revenue_report':
        reportData = await generateRevenueReport(supabase, dateRange, filters, groupBy);
        break;
      case 'insurance_claims':
        reportData = await generateInsuranceClaimsReport(supabase, dateRange, filters);
        break;
      case 'staff_performance':
        reportData = await generateStaffPerformanceReport(supabase, dateRange, filters);
        break;
      case 'doctor_workload':
        reportData = await generateDoctorWorkloadReport(supabase, dateRange, filters);
        break;
      default:
        return NextResponse.json({ error: 'Invalid report type' }, { status: 400 });
    }

    // Save report to database
    const { data: savedReport, error: saveError } = await supabase
      .from('reports_admin')
      .insert({
        type,
        payload: reportData,
        generatedBy: authResult.user!.id,
        dateRange,
        filters,
        format,
      })
      .select()
      .single();

    if (saveError) {
      return NextResponse.json({ error: 'Failed to save report' }, { status: 500 });
    }

    // Create audit log
    await supabase.from('audit_logs').insert({
      action: 'report_generated',
      entityType: 'report',
      entityId: savedReport.id,
      userId: authResult.user!.id,
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
      message: 'Report generated successfully'
    });

  } catch (error) {
    return ErrorHandler.getInstance().handle(error);
  }
}

async function generateDashboardMetrics(supabase: any, dateRange: any, filters: any) {
  const { startDate, endDate } = dateRange;

  // Get basic counts
  const [patientsResult, appointmentsResult, paymentsResult] = await Promise.all([
    supabase
      .from('patients')
      .select('id, createdAt, isActivated')
      .gte('createdAt', startDate)
      .lte('createdAt', endDate),
    supabase
      .from('appointments')
      .select('id, status, paymentStatus, scheduledAt')
      .gte('scheduledAt', startDate)
      .lte('scheduledAt', endDate),
    supabase
      .from('payments')
      .select('id, amount, status, createdAt')
      .gte('createdAt', startDate)
      .lte('createdAt', endDate),
  ]);

  const patients = patientsResult.data || [];
  const appointments = appointmentsResult.data || [];
  const payments = paymentsResult.data || [];

  // Calculate metrics
  const totalPatients = patients.length;
  const activatedPatients = patients.filter(p => p.isActivated).length;
  const totalAppointments = appointments.length;
  const completedAppointments = appointments.filter(a => a.status === 'completed').length;
  const totalRevenue = payments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  // Daily breakdown
  const dailyStats = generateDailyBreakdown(appointments, payments, startDate, endDate);

  return {
    summary: {
      totalPatients,
      activatedPatients,
      totalAppointments,
      completedAppointments,
      totalRevenue,
      activationRate: totalPatients > 0 ? (activatedPatients / totalPatients) * 100 : 0,
      completionRate: totalAppointments > 0 ? (completedAppointments / totalAppointments) * 100 : 0,
    },
    dailyStats,
    trends: {
      patientGrowth: calculateGrowthRate(patients, 'createdAt'),
      appointmentGrowth: calculateGrowthRate(appointments, 'scheduledAt'),
      revenueGrowth: calculateGrowthRate(payments, 'createdAt'),
    },
  };
}

async function generatePatientStatistics(supabase: any, dateRange: any, filters: any, groupBy: string) {
  const { startDate, endDate } = dateRange;

  const { data: patients } = await supabase
    .from('patients')
    .select(`
      id,
      createdAt,
      isActivated,
      activationDate,
      insuranceProvider,
      emergencyContact
    `)
    .gte('createdAt', startDate)
    .lte('createdAt', endDate);

  if (!patients) return {};

  // Group by specified period
  const grouped = groupDataByPeriod(patients, 'createdAt', groupBy);

  // Calculate statistics
  const stats = {
    total: patients.length,
    activated: patients.filter(p => p.isActivated).length,
    pending: patients.filter(p => !p.isActivated).length,
    byInsurance: groupByField(patients, 'insuranceProvider'),
    byAgeGroup: calculateAgeGroups(patients),
    activationTrend: grouped.map(group => ({
      period: group.period,
      total: group.data.length,
      activated: group.data.filter(p => p.isActivated).length,
    })),
  };

  return stats;
}

async function generateAppointmentAnalytics(supabase: any, dateRange: any, filters: any, groupBy: string) {
  const { startDate, endDate } = dateRange;

  const { data: appointments } = await supabase
    .from('appointments')
    .select(`
      id,
      status,
      type,
      scheduledAt,
      duration,
      patientId,
      doctorId
    `)
    .gte('scheduledAt', startDate)
    .lte('scheduledAt', endDate);

  if (!appointments) return {};

  const grouped = groupDataByPeriod(appointments, 'scheduledAt', groupBy);

  return {
    total: appointments.length,
    byStatus: groupByField(appointments, 'status'),
    byType: groupByField(appointments, 'type'),
    averageDuration: appointments.reduce((sum, apt) => sum + (apt.duration || 30), 0) / appointments.length,
    trends: grouped.map(group => ({
      period: group.period,
      total: group.data.length,
      completed: group.data.filter(a => a.status === 'completed').length,
    })),
  };
}

async function generateRevenueReport(supabase: any, dateRange: any, filters: any, groupBy: string) {
  const { startDate, endDate } = dateRange;

  const { data: payments } = await supabase
    .from('payments')
    .select(`
      id,
      amount,
      status,
      method,
      createdAt,
      appointmentId
    `)
    .gte('createdAt', startDate)
    .lte('createdAt', endDate);

  if (!payments) return {};

  const paidPayments = payments.filter(p => p.status === 'paid');
  const grouped = groupDataByPeriod(paidPayments, 'createdAt', groupBy);

  return {
    totalRevenue: paidPayments.reduce((sum, p) => sum + (p.amount || 0), 0),
    byMethod: groupByField(paidPayments, 'method'),
    byStatus: groupByField(payments, 'status'),
    dailyRevenue: grouped.map(group => ({
      period: group.period,
      revenue: group.data.reduce((sum, p) => sum + (p.amount || 0), 0),
      count: group.data.length,
    })),
  };
}

async function generateInsuranceClaimsReport(supabase: any, dateRange: any, filters: any) {
  const { startDate, endDate } = dateRange;

  const { data: claims } = await supabase
    .from('insurance_claims')
    .select(`
      id,
      provider,
      claimStatus,
      amount,
      createdAt,
      patientId
    `)
    .gte('createdAt', startDate)
    .lte('createdAt', endDate);

  if (!claims) return {};

  return {
    total: claims.length,
    byProvider: groupByField(claims, 'provider'),
    byStatus: groupByField(claims, 'claimStatus'),
    totalAmount: claims.reduce((sum, c) => sum + (c.amount || 0), 0),
    approvalRate: claims.length > 0 ? 
      (claims.filter(c => c.claimStatus === 'approved').length / claims.length) * 100 : 0,
  };
}

async function generateStaffPerformanceReport(supabase: any, dateRange: any, filters: any) {
  // Implementation for staff performance metrics
  return { message: 'Staff performance report implementation pending' };
}

async function generateDoctorWorkloadReport(supabase: any, dateRange: any, filters: any) {
  // Implementation for doctor workload metrics
  return { message: 'Doctor workload report implementation pending' };
}

// Helper functions
function generateDailyBreakdown(appointments: any[], payments: any[], startDate: string, endDate: string) {
  const days = [];
  const current = new Date(startDate);
  const end = new Date(endDate);

  while (current <= end) {
    const dateStr = current.toISOString().split('T')[0];
    const dayAppointments = appointments.filter(a => 
      a.scheduledAt?.startsWith(dateStr)
    );
    const dayPayments = payments.filter(p => 
      p.createdAt?.startsWith(dateStr)
    );

    days.push({
      date: dateStr,
      appointments: dayAppointments.length,
      revenue: dayPayments
        .filter(p => p.status === 'paid')
        .reduce((sum, p) => sum + (p.amount || 0), 0),
    });

    current.setDate(current.getDate() + 1);
  }

  return days;
}

function calculateGrowthRate(data: any[], dateField: string) {
  if (data.length < 2) return 0;
  
  const sorted = data.sort((a, b) => 
    new Date(a[dateField]).getTime() - new Date(b[dateField]).getTime()
  );
  
  const firstHalf = sorted.slice(0, Math.floor(sorted.length / 2));
  const secondHalf = sorted.slice(Math.floor(sorted.length / 2));
  
  const firstCount = firstHalf.length;
  const secondCount = secondHalf.length;
  
  return firstCount > 0 ? ((secondCount - firstCount) / firstCount) * 100 : 0;
}

function groupDataByPeriod(data: any[], dateField: string, period: string) {
  const groups = new Map();
  
  data.forEach(item => {
    const date = new Date(item[dateField]);
    let key;
    
    switch (period) {
      case 'day':
        key = date.toISOString().split('T')[0];
        break;
      case 'week':
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split('T')[0];
        break;
      case 'month':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        break;
      case 'year':
        key = date.getFullYear().toString();
        break;
      default:
        key = date.toISOString().split('T')[0];
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

function groupByField(data: any[], field: string) {
  const groups = new Map();
  
  data.forEach(item => {
    const value = item[field] || 'Unknown';
    groups.set(value, (groups.get(value) || 0) + 1);
  });
  
  return Object.fromEntries(groups);
}

function calculateAgeGroups(patients: any[]) {
  const groups = {
    '0-18': 0,
    '19-35': 0,
    '36-50': 0,
    '51-65': 0,
    '65+': 0,
  };
  
  patients.forEach(patient => {
    // This would need actual birth date calculation
    // For now, return empty groups
  });
  
  return groups;
}