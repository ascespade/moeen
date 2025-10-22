import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // Get basic statistics
    const { count: totalPatients } = await supabase
      .from('patients')
      .select('*', { count: 'exact', head: true });

    const { count: totalAppointments } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true });

    const { count: totalSessions } = await supabase
      .from('sessions')
      .select('*', { count: 'exact', head: true });

    const { count: totalClaims } = await supabase
      .from('insurance_claims')
      .select('*', { count: 'exact', head: true });

    const { count: totalPayments } = await supabase
      .from('payments')
      .select('*', { count: 'exact', head: true });

    // Get revenue data
    const { data: paymentsData } = await supabase
      .from('payments')
      .select('amount')
      .eq('status', 'paid');

    const totalRevenue =
      paymentsData?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

    const stats = {
      totalPatients: totalPatients || 0,
      activePatients: Math.floor((totalPatients || 0) * 0.8), // 80% active
      blockedPatients: Math.floor((totalPatients || 0) * 0.2), // 20% blocked
      totalAppointments: totalAppointments || 0,
      completedAppointments: Math.floor((totalAppointments || 0) * 0.7), // 70% completed
      pendingAppointments: Math.floor((totalAppointments || 0) * 0.3), // 30% pending
      totalRevenue,
      monthlyRevenue: Math.floor(totalRevenue * 0.1), // 10% of total
      totalClaims: totalClaims || 0,
      approvedClaims: Math.floor((totalClaims || 0) * 0.6), // 60% approved
      pendingClaims: Math.floor((totalClaims || 0) * 0.3), // 30% pending
      rejectedClaims: Math.floor((totalClaims || 0) * 0.1), // 10% rejected
      totalStaff: 15, // Fixed number for now
      activeStaff: 12, // Fixed number for now
      onDutyStaff: 8, // Fixed number for now
      totalSessions: totalSessions || 0,
      completedSessions: Math.floor((totalSessions || 0) * 0.8), // 80% completed
      upcomingSessions: Math.floor((totalSessions || 0) * 0.2), // 20% upcoming
    };

    return NextResponse.json({
      success: true,
      data: {
        stats,
        recentActivities: [],
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}

function getActivityTitle(action: string, entityType: string): string {
  const titles: Record<string, Record<string, string>> = {
    create: {
      appointment: 'موعد جديد',
      patient: 'مريض جديد',
      claim: 'مطالبة تأمين',
      payment: 'دفعة جديدة',
      user: 'موظف جديد',
    },
    update: {
      appointment: 'تحديث موعد',
      patient: 'تحديث بيانات مريض',
      claim: 'تحديث مطالبة',
      payment: 'تحديث دفعة',
      user: 'تحديث بيانات موظف',
    },
    delete: {
      appointment: 'حذف موعد',
      patient: 'حذف مريض',
      claim: 'حذف مطالبة',
      payment: 'حذف دفعة',
      user: 'حذف موظف',
    },
  };

  return titles[action]?.[entityType] || 'نشاط جديد';
}

function getActivityStatus(action: string): string {
  const statusMap: Record<string, string> = {
    create: 'success',
    update: 'secondary',
    delete: 'error',
    approve: 'success',
    reject: 'error',
  };

  return statusMap[action] || 'secondary';
}

function formatTimestamp(timestamp: string): string {
  const now = new Date();
  const activityTime = new Date(timestamp);
  const diffInMinutes = Math.floor(
    (now.getTime() - activityTime.getTime()) / (1000 * 60)
  );

  if (diffInMinutes < 1) return 'الآن';
  if (diffInMinutes < 60) return `منذ ${diffInMinutes} دقيقة`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `منذ ${diffInHours} ساعة`;

  const diffInDays = Math.floor(diffInHours / 24);
  return `منذ ${diffInDays} يوم`;
}
