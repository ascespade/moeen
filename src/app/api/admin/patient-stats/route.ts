/**
 * Admin Patient Statistics API - إحصائيات المرضى التفصيلية
 * Detailed patient analytics for admin dashboard
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth/authorize';

export async function GET(request: NextRequest) {
  try {
    // Authorize admin, manager, supervisor, or doctor
    const authResult = await requireAuth(['admin', 'manager', 'supervisor', 'doctor'])(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'month'; // today, week, month, year
    const department = searchParams.get('department');

    const supabase = await createClient();

    // Get date ranges
    const dates = getDateRanges(period);

    // Get patient statistics
    const [
      totalPatientsResult,
      activePatientsResult,
      newPatientsResult,
      appointmentsResult,
      sessionsResult,
      paymentsResult
    ] = await Promise.all([
      // Total patients
      supabase
        .from('patients')
        .select('id, status, created_at, updated_at')
        .eq('activated', true),

      // Active patients (with recent appointments)
      supabase
        .from('patients')
        .select(`
          id,
          appointments!inner (
            id,
            appointment_date,
            status
          )
        `)
        .eq('activated', true)
        .gte('appointments.appointment_date', dates.startDate)
        .lte('appointments.appointment_date', dates.endDate),

      // New patients in period
      supabase
        .from('patients')
        .select('id, created_at, gender, age')
        .gte('created_at', dates.startDate)
        .lte('created_at', dates.endDate),

      // Appointments in period
      supabase
        .from('appointments')
        .select('id, status, appointment_date, created_at')
        .gte('appointment_date', dates.startDate)
        .lte('appointment_date', dates.endDate),

      // Sessions in period
      supabase
        .from('sessions')
        .select('id, status, session_date, session_type')
        .gte('session_date', dates.startDate)
        .lte('session_date', dates.endDate),

      // Payments in period
      supabase
        .from('payments')
        .select('id, amount, status, created_at')
        .gte('created_at', dates.startDate)
        .lte('created_at', dates.endDate)
    ]);

    // Process results
    const totalPatients = totalPatientsResult.data || [];
    const activePatients = activePatientsResult.data || [];
    const newPatients = newPatientsResult.data || [];
    const appointments = appointmentsResult.data || [];
    const sessions = sessionsResult.data || [];
    const payments = paymentsResult.data || [];

    // Calculate demographics
    const demographics = calculateDemographics(newPatients);
    
    // Calculate appointment statistics
    const appointmentStats = calculateAppointmentStats(appointments);
    
    // Calculate session statistics  
    const sessionStats = calculateSessionStats(sessions);
    
    // Calculate financial statistics
    const financialStats = calculateFinancialStats(payments);

    // Calculate trends (compare with previous period)
    const previousDates = getPreviousDateRanges(period);
    const { data: previousNewPatients } = await supabase
      .from('patients')
      .select('id')
      .gte('created_at', previousDates.startDate)
      .lte('created_at', previousDates.endDate);

    const patientGrowth = calculateGrowthRate(
      newPatients.length, 
      (previousNewPatients || []).length
    );

    const stats = {
      // Basic counts
      totalPatients: totalPatients.length,
      activePatients: [...new Set(activePatients.map(p => p.id))].length,
      newPatients: newPatients.length,
      blockedPatients: totalPatients.filter(p => p.status === 'blocked').length,
      
      // Demographics
      demographics,
      
      // Appointments
      appointments: appointmentStats,
      
      // Sessions
      sessions: sessionStats,
      
      // Financial
      financial: financialStats,
      
      // Trends
      trends: {
        patientGrowth,
        period,
        comparedToPrevious: previousDates.label
      },
      
      // Metadata
      meta: {
        period,
        startDate: dates.startDate,
        endDate: dates.endDate,
        department,
        lastUpdated: new Date().toISOString()
      }
    };

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error in patient stats API:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Helper functions
function getDateRanges(period: string) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (period) {
    case 'today':
      return {
        startDate: today.toISOString(),
        endDate: new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString(),
        label: 'اليوم'
      };
    
    case 'week':
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay() + 1);
      return {
        startDate: weekStart.toISOString(),
        endDate: new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        label: 'هذا الأسبوع'
      };
    
    case 'month':
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      return {
        startDate: monthStart.toISOString(),
        endDate: monthEnd.toISOString(),
        label: 'هذا الشهر'
      };
    
    case 'year':
      const yearStart = new Date(today.getFullYear(), 0, 1);
      const yearEnd = new Date(today.getFullYear(), 11, 31);
      return {
        startDate: yearStart.toISOString(),
        endDate: yearEnd.toISOString(),
        label: 'هذا العام'
      };
    
    default:
      return getDateRanges('month');
  }
}

function getPreviousDateRanges(period: string) {
  const current = getDateRanges(period);
  const currentStart = new Date(current.startDate);
  const currentEnd = new Date(current.endDate);
  const duration = currentEnd.getTime() - currentStart.getTime();

  return {
    startDate: new Date(currentStart.getTime() - duration).toISOString(),
    endDate: new Date(currentEnd.getTime() - duration).toISOString(),
    label: `الفترة السابقة`
  };
}

function calculateDemographics(patients: any[]) {
  const maleCount = patients.filter(p => p.gender === 'male').length;
  const femaleCount = patients.filter(p => p.gender === 'female').length;
  
  const ageGroups = {
    children: patients.filter(p => p.age < 18).length,
    adults: patients.filter(p => p.age >= 18 && p.age < 60).length,
    seniors: patients.filter(p => p.age >= 60).length
  };

  return {
    gender: {
      male: maleCount,
      female: femaleCount,
      malePercentage: maleCount / patients.length * 100,
      femalePercentage: femaleCount / patients.length * 100
    },
    ageGroups,
    total: patients.length
  };
}

function calculateAppointmentStats(appointments: any[]) {
  const completed = appointments.filter(a => a.status === 'completed').length;
  const pending = appointments.filter(a => a.status === 'scheduled').length;
  const cancelled = appointments.filter(a => a.status === 'cancelled').length;

  return {
    total: appointments.length,
    completed,
    pending,
    cancelled,
    completionRate: completed / appointments.length * 100,
    cancellationRate: cancelled / appointments.length * 100
  };
}

function calculateSessionStats(sessions: any[]) {
  const completed = sessions.filter(s => s.status === 'completed').length;
  const upcoming = sessions.filter(s => s.status === 'scheduled').length;
  
  const sessionTypes = sessions.reduce((acc: Record<string, number>, session) => {
    acc[session.session_type] = (acc[session.session_type] || 0) + 1;
    return acc;
  }, {});

  return {
    total: sessions.length,
    completed,
    upcoming,
    completionRate: completed / sessions.length * 100,
    sessionTypes
  };
}

function calculateFinancialStats(payments: any[]) {
  const totalAmount = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const paidAmount = payments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + (p.amount || 0), 0);
  const pendingAmount = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  return {
    totalRevenue: totalAmount,
    paidRevenue: paidAmount,
    pendingRevenue: pendingAmount,
    averagePerPatient: totalAmount / payments.length || 0,
    collectionRate: paidAmount / totalAmount * 100
  };
}

function calculateGrowthRate(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}
