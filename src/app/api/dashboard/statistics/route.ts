// src/app/api/dashboard/statistics/route.ts
// Dynamic Dashboard Statistics API
// Provides real-time statistics and analytics from the database

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'month';

    const supabase = await createClient();

    // Calculate date ranges based on period
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case 'today':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
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

    const { count: blockedPatients } = await supabase
      .from('patients')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'blocked');

    // Get appointments
    const { count: totalAppointments } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true });

    const { count: completedAppointments } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed');

    const { count: pendingAppointments } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    // Get revenue
    const { data: payments } = await supabase
      .from('payments')
      .select('amount, created_at')
      .eq('status', 'paid');

    const totalRevenue = payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
    
    const monthlyPayments = payments?.filter(p => {
      const paymentDate = new Date(p.created_at);
      return paymentDate >= startDate;
    }) || [];
    
    const monthlyRevenue = monthlyPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

    // Get claims
    const { count: totalClaims } = await supabase
      .from('insurance_claims')
      .select('*', { count: 'exact', head: true });

    const { count: approvedClaims } = await supabase
      .from('insurance_claims')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'approved');

    const { count: pendingClaims } = await supabase
      .from('insurance_claims')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    const { count: rejectedClaims } = await supabase
      .from('insurance_claims')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'rejected');

    // Get staff
    const { count: totalStaff } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .in('role', ['doctor', 'nurse', 'staff', 'therapist']);

    const { count: activeStaff } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .in('role', ['doctor', 'nurse', 'staff', 'therapist'])
      .eq('status', 'active');

    const { count: onDutyStaff } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .in('role', ['doctor', 'nurse', 'staff', 'therapist'])
      .eq('status', 'active');

    // Get sessions
    const { count: totalSessions } = await supabase
      .from('sessions')
      .select('*', { count: 'exact', head: true });

    const { count: completedSessions } = await supabase
      .from('sessions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed');

    const { count: upcomingSessions } = await supabase
      .from('sessions')
      .select('*', { count: 'exact', head: true })
      .in('status', ['scheduled', 'confirmed']);

    const data = {
      total_patients: totalPatients || 0,
      active_patients: activePatients || 0,
      blocked_patients: blockedPatients || 0,
      total_appointments: totalAppointments || 0,
      completed_appointments: completedAppointments || 0,
      pending_appointments: pendingAppointments || 0,
      total_revenue: totalRevenue,
      monthly_revenue: monthlyRevenue,
      total_claims: totalClaims || 0,
      approved_claims: approvedClaims || 0,
      pending_claims: pendingClaims || 0,
      rejected_claims: rejectedClaims || 0,
      total_staff: totalStaff || 0,
      active_staff: activeStaff || 0,
      on_duty_staff: onDutyStaff || 0,
      total_sessions: totalSessions || 0,
      completed_sessions: completedSessions || 0,
      upcoming_sessions: upcomingSessions || 0,
    };

    return NextResponse.json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Dashboard statistics API error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Optional: POST endpoint to refresh/update statistics
export async function POST(request: NextRequest) {
  // Use same logic as GET
  return await GET(request);
}
