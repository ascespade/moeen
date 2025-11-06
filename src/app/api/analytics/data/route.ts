/**
 * Analytics Data API
 * بيانات التحليلات - بيانات حقيقية من قاعدة البيانات
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth/authorize';

export const revalidate = 60;

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const authResult = await requireAuth(['admin', 'supervisor', 'manager'])(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'month';

    // Calculate date range based on period
    const now = new Date();
    let startDate: Date;
    switch (period) {
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
    }

    // Get patients statistics
    const { count: totalPatients } = await supabase
      .from('patients')
      .select('*', { count: 'exact', head: true });

    const { count: activePatients } = await supabase
      .from('patients')
      .select('*', { count: 'exact', head: true })
      .eq('activated', true);

    // Get appointments statistics
    const { count: totalAppointments } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true });

    const { count: completedAppointments } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed');

    // Get sessions statistics
    const { count: totalSessions } = await supabase
      .from('sessions')
      .select('*', { count: 'exact', head: true });

    // Get revenue
    const { data: payments } = await supabase
      .from('payments')
      .select('amount, created_at')
      .eq('status', 'paid')
      .gte('created_at', startDate.toISOString());

    const revenue = payments?.reduce((sum: number, p: any) => sum + (p.amount || 0), 0) || 0;

    // Get patient analytics by age (if age field exists)
    const { data: patients } = await supabase
      .from('patients')
      .select('birth_date, gender, condition, status')
      .limit(1000);

    // Process patient data for analytics
    const patientAnalytics = {
      byAge: calculateAgeGroups(patients || []),
      byGender: calculateGenderGroups(patients || []),
      byCondition: calculateConditionGroups(patients || []),
      byStatus: calculateStatusGroups(patients || []),
    };

    // Get appointment trends
    const { data: appointments } = await supabase
      .from('appointments')
      .select('appointment_date, status')
      .gte('appointment_date', startDate.toISOString())
      .order('appointment_date', { ascending: true });

    const appointmentTrends = calculateAppointmentTrends(appointments || []);

    // Get therapy analytics
    const { data: sessions } = await supabase
      .from('sessions')
      .select('therapy_type, therapist_id, progress, status, duration')
      .gte('created_at', startDate.toISOString())
      .limit(1000);

    const therapyAnalytics = calculateTherapyAnalytics(sessions || []);

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalPatients: totalPatients || 0,
          activePatients: activePatients || 0,
          totalAppointments: totalAppointments || 0,
          completedAppointments: completedAppointments || 0,
          totalSessions: totalSessions || 0,
          averageProgress: calculateAverageProgress(sessions || []),
          revenue,
          growthRate: 0, // Calculate from historical data if available
        },
        patientAnalytics,
        therapyAnalytics,
        appointmentAnalytics: {
          byStatus: calculateAppointmentStatusGroups(appointments || []),
          byTime: calculateAppointmentTimeGroups(appointments || []),
          byDay: calculateAppointmentDayGroups(appointments || []),
          noShowRate: 0, // Calculate from appointments
          rescheduleRate: 0, // Calculate from appointments
        },
        performanceMetrics: {
          averageSessionDuration: calculateAverageSessionDuration(sessions || []),
          patientSatisfaction: 0, // From feedback if available
          therapistUtilization: 0, // Calculate from schedules
          facilityUtilization: 0, // Calculate from schedules
        },
        trends: {
          patientGrowth: calculatePatientGrowth(patients || []),
          appointmentTrends,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch analytics data',
        data: null,
      },
      { status: 500 }
    );
  }
}

// Helper functions
function calculateAgeGroups(patients: any[]): Array<{ age: string; count: number }> {
  const groups = {
    '0-5': 0,
    '6-12': 0,
    '13-18': 0,
    '19+': 0,
  };

  patients.forEach((patient: any) => {
    if (!patient.birth_date) return;
    const age = calculateAge(patient.birth_date);
    if (age <= 5) groups['0-5']++;
    else if (age <= 12) groups['6-12']++;
    else if (age <= 18) groups['13-18']++;
    else groups['19+']++;
  });

  return Object.entries(groups).map(([age, count]) => ({ age, count }));
}

function calculateAge(birthDate: string): number {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

function calculateGenderGroups(patients: any[]): Array<{ gender: string; count: number }> {
  const groups: Record<string, number> = {};
  patients.forEach((patient: any) => {
    const gender = patient.gender || 'غير محدد';
    groups[gender] = (groups[gender] || 0) + 1;
  });
  return Object.entries(groups).map(([gender, count]) => ({ gender, count }));
}

function calculateConditionGroups(patients: any[]): Array<{ condition: string; count: number }> {
  const groups: Record<string, number> = {};
  patients.forEach((patient: any) => {
    const condition = patient.condition || 'غير محدد';
    groups[condition] = (groups[condition] || 0) + 1;
  });
  return Object.entries(groups)
    .map(([condition, count]) => ({ condition, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

function calculateStatusGroups(patients: any[]): Array<{ status: string; count: number }> {
  const groups: Record<string, number> = {};
  patients.forEach((patient: any) => {
    const status = patient.activated ? 'نشط' : 'غير نشط';
    groups[status] = (groups[status] || 0) + 1;
  });
  return Object.entries(groups).map(([status, count]) => ({ status, count }));
}

function calculateAppointmentTrends(appointments: any[]): Array<{ month: string; count: number }> {
  const trends: Record<string, number> = {};
  appointments.forEach((apt: any) => {
    if (!apt.appointment_date) return;
    const date = new Date(apt.appointment_date);
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    trends[month] = (trends[month] || 0) + 1;
  });
  return Object.entries(trends)
    .map(([month, count]) => ({ month, count }))
    .sort();
}

function calculateTherapyAnalytics(sessions: any[]): any {
  const byType: Record<string, { count: number; successRate: number }> = {};
  const byTherapist: Record<string, { sessions: number; successRate: number }> = {};

  sessions.forEach((session: any) => {
    // By type
    const type = session.therapy_type || 'غير محدد';
    if (!byType[type]) {
      byType[type] = { count: 0, successRate: 0 };
    }
    byType[type].count++;
    if (session.status === 'completed') {
      byType[type].successRate += session.progress || 0;
    }

    // By therapist
    const therapistId = session.therapist_id || 'غير محدد';
    if (!byTherapist[therapistId]) {
      byTherapist[therapistId] = { sessions: 0, successRate: 0 };
    }
    byTherapist[therapistId].sessions++;
    if (session.status === 'completed') {
      byTherapist[therapistId].successRate += session.progress || 0;
    }
  });

  // Calculate averages
  Object.keys(byType).forEach((type) => {
    const typeData = byType[type];
    if (typeData) {
      typeData.successRate = typeData.successRate / (typeData.count || 1);
    }
  });

  Object.keys(byTherapist).forEach((therapistId) => {
    const therapistData = byTherapist[therapistId];
    if (therapistData) {
      therapistData.successRate =
        therapistData.successRate / (therapistData.sessions || 1);
    }
  });

  return {
    byType: Object.entries(byType).map(([type, data]) => ({
      type,
      count: data.count,
      successRate: data.successRate,
    })),
    byTherapist: Object.entries(byTherapist).map(([therapistId, data]) => ({
      therapist: therapistId,
      sessions: data.sessions,
      successRate: data.successRate,
    })),
    progressTrends: calculateProgressTrends(sessions),
  };
}

function calculateProgressTrends(sessions: any[]): Array<{ month: string; averageProgress: number }> {
  const trends: Record<string, { total: number; count: number }> = {};
  sessions.forEach((session: any) => {
    if (!session.created_at) return;
    const date = new Date(session.created_at);
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!trends[month]) {
      trends[month] = { total: 0, count: 0 };
    }
    trends[month].total += session.progress || 0;
    trends[month].count++;
  });

  return Object.entries(trends)
    .map(([month, data]) => ({
      month,
      averageProgress: data.count > 0 ? data.total / data.count : 0,
    }))
    .sort();
}

function calculateAppointmentStatusGroups(appointments: any[]): Array<{ status: string; count: number }> {
  const groups: Record<string, number> = {};
  appointments.forEach((apt: any) => {
    const status = apt.status || 'غير محدد';
    groups[status] = (groups[status] || 0) + 1;
  });
  return Object.entries(groups).map(([status, count]) => ({ status, count }));
}

function calculateAppointmentTimeGroups(appointments: any[]): Array<{ hour: number; count: number }> {
  const groups: Record<number, number> = {};
  appointments.forEach((apt: any) => {
    if (!apt.appointment_date) return;
    const hour = new Date(apt.appointment_date).getHours();
    groups[hour] = (groups[hour] || 0) + 1;
  });
  return Object.entries(groups)
    .map(([hour, count]) => ({ hour: parseInt(hour), count }))
    .sort((a, b) => a.hour - b.hour);
}

function calculateAppointmentDayGroups(appointments: any[]): Array<{ day: string; count: number }> {
  const groups: Record<string, number> = {};
  const dayNames = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  appointments.forEach((apt: any) => {
    if (!apt.appointment_date) return;
    const dayIndex = new Date(apt.appointment_date).getDay();
    const day = dayNames[dayIndex];
    if (day) {
      groups[day] = (groups[day] || 0) + 1;
    }
  });
  return Object.entries(groups).map(([day, count]) => ({ day, count }));
}

function calculateAverageProgress(sessions: any[]): number {
  if (sessions.length === 0) return 0;
  const total = sessions.reduce((sum: number, s: any) => sum + (s.progress || 0), 0);
  return total / sessions.length;
}

function calculateAverageSessionDuration(sessions: any[]): number {
  if (sessions.length === 0) return 0;
  const total = sessions.reduce((sum: number, s: any) => sum + (s.duration || 0), 0);
  return total / sessions.length;
}

function calculatePatientGrowth(patients: any[]): Array<{ month: string; count: number }> {
  const trends: Record<string, number> = {};
  patients.forEach((patient: any) => {
    if (!patient.created_at) return;
    const date = new Date(patient.created_at);
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    trends[month] = (trends[month] || 0) + 1;
  });

  // Calculate cumulative
  const sorted = Object.entries(trends).sort();
  let cumulative = 0;
  return sorted.map(([month, count]) => {
    cumulative += count;
    return { month, count: cumulative };
  });
}

