import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { authorize } from '@/lib/auth/authorize';

export async function GET(request: NextRequest) {
  try {
    const { user, error: authError } = await authorize(request);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only staff, supervisor, and admin can access reports
    if (!['staff', 'supervisor', 'admin'].includes(user.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30'; // days
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const supabase = createClient();

    // Calculate date range
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate ? new Date(startDate) : new Date();
    start.setDate(start.getDate() - parseInt(period));

    // Get patient statistics
    const { data: patients, error: patientsError } = await supabase
      .from('patients')
      .select('id, created_at, activated')
      .gte('created_at', start.toISOString())
      .lte('created_at', end.toISOString());

    if (patientsError) {
      return NextResponse.json({ error: 'Failed to fetch patient data' }, { status: 500 });
    }

    // Get appointment statistics
    const { data: appointments, error: appointmentsError } = await supabase
      .from('appointments')
      .select('id, status, payment_status, created_at, scheduled_at')
      .gte('created_at', start.toISOString())
      .lte('created_at', end.toISOString());

    if (appointmentsError) {
      return NextResponse.json({ error: 'Failed to fetch appointment data' }, { status: 500 });
    }

    // Get payment statistics
    const { data: payments, error: paymentsError } = await supabase
      .from('payments')
      .select('id, amount, status, method, created_at')
      .gte('created_at', start.toISOString())
      .lte('created_at', end.toISOString());

    if (paymentsError) {
      return NextResponse.json({ error: 'Failed to fetch payment data' }, { status: 500 });
    }

    // Get insurance claims statistics
    const { data: claims, error: claimsError } = await supabase
      .from('insurance_claims')
      .select('id, claim_status, amount, created_at')
      .gte('created_at', start.toISOString())
      .lte('created_at', end.toISOString());

    if (claimsError) {
      return NextResponse.json({ error: 'Failed to fetch claims data' }, { status: 500 });
    }

    // Calculate metrics
    const totalPatients = patients?.length || 0;
    const activatedPatients = patients?.filter(p => p.activated).length || 0;
    const newPatients = patients?.length || 0;

    const totalAppointments = appointments?.length || 0;
    const completedAppointments = appointments?.filter(a => a.status === 'completed').length || 0;
    const cancelledAppointments = appointments?.filter(a => a.status === 'cancelled').length || 0;
    const upcomingAppointments = appointments?.filter(a => 
      a.status === 'pending' || a.status === 'confirmed'
    ).length || 0;

    const totalRevenue = payments?.filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + parseFloat(p.amount.toString()), 0) || 0;
    
    const pendingPayments = payments?.filter(p => p.status === 'pending').length || 0;
    const completedPayments = payments?.filter(p => p.status === 'completed').length || 0;

    const totalClaims = claims?.length || 0;
    const approvedClaims = claims?.filter(c => c.claim_status === 'approved').length || 0;
    const pendingClaims = claims?.filter(c => c.claim_status === 'pending' || c.claim_status === 'submitted').length || 0;
    const rejectedClaims = claims?.filter(c => c.claim_status === 'rejected').length || 0;

    // Calculate conversion rates
    const activationRate = totalPatients > 0 ? (activatedPatients / totalPatients) * 100 : 0;
    const completionRate = totalAppointments > 0 ? (completedAppointments / totalAppointments) * 100 : 0;
    const approvalRate = totalClaims > 0 ? (approvedClaims / totalClaims) * 100 : 0;

    // Payment method breakdown
    const paymentMethods = payments?.reduce((acc, payment) => {
      const method = payment.method;
      acc[method] = (acc[method] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    // Daily statistics for charts
    const dailyStats = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dayStart = new Date(d);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(d);
      dayEnd.setHours(23, 59, 59, 999);

      const dayPatients = patients?.filter(p => {
        const created = new Date(p.created_at);
        return created >= dayStart && created <= dayEnd;
      }).length || 0;

      const dayAppointments = appointments?.filter(a => {
        const scheduled = new Date(a.scheduled_at);
        return scheduled >= dayStart && scheduled <= dayEnd;
      }).length || 0;

      const dayRevenue = payments?.filter(p => {
        const created = new Date(p.created_at);
        return created >= dayStart && created <= dayEnd && p.status === 'completed';
      }).reduce((sum, p) => sum + parseFloat(p.amount.toString()), 0) || 0;

      dailyStats.push({
        date: d.toISOString().split('T')[0],
        patients: dayPatients,
        appointments: dayAppointments,
        revenue: dayRevenue
      });
    }

    const metrics = {
      period: {
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0],
        days: parseInt(period)
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

    return NextResponse.json({ metrics });

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}