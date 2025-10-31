import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth/authorize';
import { ErrorHandler } from '@/core/errors';

export async function GET(request: NextRequest) {
  try {
    // Authorize admin only
    const authResult = await requireAuth(['admin'])(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();
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
      paymentsData?.reduce((sum: number, p: any) => sum + (p.amount || 0), 0) || 0;

    // Get real statistics from database
    const { count: activePatients } = await supabase
      .from('patients')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    const { count: blockedPatients } = await supabase
      .from('patients')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'blocked');

    const { count: completedAppointments } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed');

    const { count: pendingAppointments } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    // Calculate monthly revenue (current month)
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const { data: monthlyPaymentsData } = await supabase
      .from('payments')
      .select('amount')
      .eq('status', 'paid')
      .gte('created_at', startOfMonth.toISOString());

    const monthlyRevenue = monthlyPaymentsData?.reduce((sum: number, p: any) => sum + (p.amount || 0), 0) || 0;

    // Get real claims statistics
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

    // Get real staff statistics
    const { count: totalStaff } = await supabase
      .from('doctors')
      .select('*', { count: 'exact', head: true });

    const { count: activeStaff } = await supabase
      .from('doctors')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    // Get on-duty staff (staff with appointments today or currently working)
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const { data: todayAppointments } = await supabase
      .from('appointments')
      .select('doctor_id')
      .gte('scheduled_at', todayStart.toISOString())
      .lte('scheduled_at', todayEnd.toISOString())
      .in('status', ['pending', 'confirmed', 'in_progress']);

    const uniqueOnDutyStaffIds = new Set(todayAppointments?.map((a: any) => a.doctor_id) || []);
    const onDutyStaff = uniqueOnDutyStaffIds.size;

    // Get real session statistics
    const { count: completedSessions } = await supabase
      .from('sessions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed');

    const { count: upcomingSessions } = await supabase
      .from('sessions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'scheduled')
      .gte('scheduled_at', new Date().toISOString());

    const stats = {
      totalPatients: totalPatients || 0,
      activePatients: activePatients || 0,
      blockedPatients: blockedPatients || 0,
      totalAppointments: totalAppointments || 0,
      completedAppointments: completedAppointments || 0,
      pendingAppointments: pendingAppointments || 0,
      totalRevenue,
      monthlyRevenue,
      totalClaims: totalClaims || 0,
      approvedClaims: approvedClaims || 0,
      pendingClaims: pendingClaims || 0,
      rejectedClaims: rejectedClaims || 0,
      totalStaff: totalStaff || 0,
      activeStaff: activeStaff || 0,
      onDutyStaff: onDutyStaff || 0,
      totalSessions: totalSessions || 0,
      completedSessions: completedSessions || 0,
      upcomingSessions: upcomingSessions || 0,
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
    return ErrorHandler.getInstance().handle(error as Error);
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
