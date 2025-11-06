import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth/authorize';
import { logger } from '@/lib/utils/logger';

export const revalidate = 60;

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Security: Require authentication
    const authResult = await requireAuth(['admin', 'supervisor'])(request);
    if (!authResult.authorized || !authResult.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Authentication required' },
        { status: 401 }
      );
    }

    const supabase = await createClient();

    // Get staff from users table with work hours from attendance_records
    const { data: staff, error } = await supabase
      .from('users')
      .select(
        `
        id,
        full_name,
        email,
        role,
        position,
        department,
        status,
        work_schedules (
          id,
          start_time,
          end_time,
          day_of_week,
          is_active
        )
      `
      )
      .in('role', ['doctor', 'nurse', 'staff', 'therapist', 'supervisor'])
      .eq('status', 'active')
      .order('full_name', { ascending: true });

    if (error) throw error;

    // Get attendance records for today, this week, and this month
    const today = new Date().toISOString().split('T')[0];
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);
    const monthStart = new Date();
    monthStart.setMonth(monthStart.getMonth() - 1);

    const { data: todayAttendance } = await supabase
      .from('attendance_records')
      .select('user_id, check_in_time, check_out_time, total_hours, date')
      .eq('date', today);

    const { data: weeklyAttendance } = await supabase
      .from('attendance_records')
      .select('user_id, total_hours, date')
      .gte('date', weekStart.toISOString().split('T')[0])
      .lte('date', today);

    const { data: monthlyAttendance } = await supabase
      .from('attendance_records')
      .select('user_id, total_hours, date')
      .gte('date', monthStart.toISOString().split('T')[0])
      .lte('date', today);

    // Calculate real work hours from attendance records
    const staffWorkHours = (staff || []).map((member: unknown) => {
      const todayRecord = todayAttendance?.find(
        (a: unknown) => a.user_id === member.id
      );
      const weeklyHours =
        weeklyAttendance
          ?.filter((a: unknown) => a.user_id === member.id)
          ?.reduce((sum: number, record: unknown) => sum + (record.total_hours || 0), 0) || 0;
      const monthlyHours =
        monthlyAttendance
          ?.filter((a: unknown) => a.user_id === member.id)
          ?.reduce((sum: number, record: unknown) => sum + (record.total_hours || 0), 0) || 0;

      const isOnDuty =
        todayRecord && todayRecord.check_in_time && !todayRecord.check_out_time;

      return {
        id: member.id,
        name: member.full_name || member.email,
        position: member.position || getPositionTitle(member.role),
        totalHours: monthlyHours,
        todayHours: todayRecord?.total_hours || 0,
        thisWeekHours: weeklyHours,
        thisMonthHours: monthlyHours,
        isOnDuty,
        lastCheckIn: todayRecord?.check_in_time
          ? formatTime(todayRecord.check_in_time)
          : null,
        lastCheckOut: todayRecord?.check_out_time
          ? formatTime(todayRecord.check_out_time)
          : null,
      };
    });

    return NextResponse.json({
      success: true,
      data: staffWorkHours,
    });
  } catch (error) {
    logger.error('Staff hours API error:', { error });
    return NextResponse.json(
      { error: 'Failed to fetch staff hours data' },
      { status: 500 }
    );
  }
}

function getPositionTitle(role: string): string {
  const titles: Record<string, string> = {
    admin: 'مدير النظام',
    manager: 'مدير',
    supervisor: 'مشرف',
    doctor: 'طبيب',
    therapist: 'معالج', // Alias for doctor
    nurse: 'ممرض',
    staff: 'موظف',
    agent: 'وكيل',
    patient: 'مريض',
    demo: 'تجريبي',
  };

  return titles[role] || 'موظف';
}

function formatTime(timeString: string): string {
  try {
    const date = new Date(timeString);
    return date.toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  } catch {
    return timeString;
  }
}
