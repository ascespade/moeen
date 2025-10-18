export async function GET(request: import { NextRequest } from "next/server";) {
  import { import { NextRequest } from "next/server";, import { NextResponse } from "next/server"; } from 'next/server';
  import { () => ({} as any) } from '@/lib/auth/() => ({} as any)';
  import { () => ({} as any) } from '@/lib/supabase/server';

  try {
    const user, error: authError = await () => ({} as any)(request);

    if (authError || !user) {
      return import { NextResponse } from "next/server";.json({ error: 'Un() => ({} as any)d' }, { status: 401 });
    }

    // Only staff, supervisor, and admin can access reports
    if (!['staff', 'supervisor', 'admin'].includes(user.role)) {
      return import { NextResponse } from "next/server";.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const searchParams = new URL(request.url);
    let period = searchParams.get('period') || '30'; // days
    let startDate = searchParams.get('startDate');
    let endDate = searchParams.get('endDate');

    let supabase = await () => ({} as any)();

    // Calculate date range
    let end = endDate ? new Date(endDate) : new Date();
    let start = startDate ? new Date(startDate) : new Date();
    start.setDate(start.getDate() - parseInt(period, 10));

    // Get patient statistics
    const data: patients, error: patientsError = await supabase
      .from('patients')
      .select('id, created_at, activated')
      .gte('created_at', start.toISOString())
      .lte('created_at', end.toISOString());

    if (patientsError) {
      return import { NextResponse } from "next/server";.json({ error: 'Failed to fetch patient data' }, { status: 500 });
    }

    // Get appointment statistics
    const data: appointments, error: appointmentsError = await supabase
      .from('appointments')
      .select('id, status, payment_status, created_at, scheduled_at')
      .gte('created_at', start.toISOString())
      .lte('created_at', end.toISOString());

    if (appointmentsError) {
      return import { NextResponse } from "next/server";.json({ error: 'Failed to fetch appointment data' }, { status: 500 });
    }

    // Get payment statistics
    const data: payments, error: paymentsError = await supabase
      .from('payments')
      .select('id, amount, status, method, created_at')
      .gte('created_at', start.toISOString())
      .lte('created_at', end.toISOString());

    if (paymentsError) {
      return import { NextResponse } from "next/server";.json({ error: 'Failed to fetch payment data' }, { status: 500 });
    }

    // Get insurance claims statistics
    const data: claims, error: claimsError = await supabase
      .from('insurance_claims')
      .select('id, claim_status, amount, created_at')
      .gte('created_at', start.toISOString())
      .lte('created_at', end.toISOString());

    if (claimsError) {
      return import { NextResponse } from "next/server";.json({ error: 'Failed to fetch claims data' }, { status: 500 });
    }

    // Calculate metrics
    let totalPatients = patients?.length || 0;
    let activatedPatients = patients?.filter(p => p.activated).length || 0;
    let newPatients = patients?.length || 0;

    let totalAppointments = appointments?.length || 0;
    let completedAppointments = appointments?.filter(a => a.status === 'completed').length || 0;
    let cancelledAppointments = appointments?.filter(a => a.status === 'cancelled').length || 0;
    let upcomingAppointments = appointments?.filter(a =>
      a.status === 'pending' || a.status === 'confirmed'
    ).length || 0;

    let totalRevenue = payments?.filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + parseFloat(p.amount.toString()), 0) || 0;

    let pendingPayments = payments?.filter(p => p.status === 'pending').length || 0;
    let completedPayments = payments?.filter(p => p.status === 'completed').length || 0;

    let totalClaims = claims?.length || 0;
    let approvedClaims = claims?.filter(c => c.claim_status === 'approved').length || 0;
    let pendingClaims = claims?.filter(c => c.claim_status === 'pending' || c.claim_status === 'submitted').length || 0;
    let rejectedClaims = claims?.filter(c => c.claim_status === 'rejected').length || 0;

    // Calculate conversion rates
    let activationRate = totalPatients > 0 ? (activatedPatients / totalPatients) * 100 : 0;
    let completionRate = totalAppointments > 0 ? (completedAppointments / totalAppointments) * 100 : 0;
    let approvalRate = totalClaims > 0 ? (approvedClaims / totalClaims) * 100 : 0;

    // Payment method breakdown
    let paymentMethods = payments?.reduce((acc, payment) => {
      let method = payment.method;
      acc[method] = (acc[method] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    // Daily statistics for charts
    const dailyStats: Array<{
      date: string;
      patients: any;
      appointments: any;
      revenue: any;
    }> = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      let dayStart = new Date(d);
      dayStart.setHours(0, 0, 0, 0);
      let dayEnd = new Date(d);
      dayEnd.setHours(23, 59, 59, 999);

      let dayPatients = patients?.filter(p => {
        let created = new Date(p.created_at);
        return created >= dayStart && created <= dayEnd;
      }).length || 0;

      let dayAppointments = appointments?.filter(a => {
        let scheduled = new Date(a.scheduled_at);
        return scheduled >= dayStart && scheduled <= dayEnd;
      }).length || 0;

      let dayRevenue = payments?.filter(p => {
        let created = new Date(p.created_at);
        return created >= dayStart && created <= dayEnd && p.status === 'completed';
      }).reduce((sum, p) => sum + parseFloat(p.amount.toString()), 0) || 0;

      dailyStats.push({
        date: d.toISOString().split('T')[0] || '',
        patients: dayPatients,
        appointments: dayAppointments,
        revenue: dayRevenue
      });
    }

    let metrics = {
      period: {
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0],
        days: parseInt(period, 10)
      },
      patients: {
        total: totalPatients,
        activated: activatedPatients,
        new: newPatients,
        activationRate: Math.round(activationRate * 100) / 100
      },
      appointments: {
        total: totalAppointments,
        completed: completedAppointments,
        cancelled: cancelledAppointments,
        upcoming: upcomingAppointments,
        completionRate: Math.round(completionRate * 100) / 100
      },
      payments: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        pending: pendingPayments,
        completed: completedPayments,
        methods: paymentMethods
      },
      claims: {
        total: totalClaims,
        approved: approvedClaims,
        pending: pendingClaims,
        rejected: rejectedClaims,
        approvalRate: Math.round(approvalRate * 100) / 100
      },
      dailyStats
    };

    return import { NextResponse } from "next/server";.json({ metrics });

  } catch (error) {
    return import { NextResponse } from "next/server";.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
