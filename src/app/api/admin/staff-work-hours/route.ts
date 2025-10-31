/**
 * Admin Staff Work Hours API - ساعات عمل الموظفين
 * Get staff work hours and attendance data for admin dashboard
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth/authorize';

export async function GET(request: NextRequest) {
  try {
    // Authorize admin, manager, or supervisor
    const authResult = await requireAuth(['admin', 'manager', 'supervisor'])(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const department = searchParams.get('department');
    const status = searchParams.get('status'); // on_duty, off_duty, all

    const supabase = await createClient();

    // Get staff members with their work hours
    let staffQuery = supabase
      .from('users')
      .select(`
        id,
        full_name,
        email,
        phone,
        role,
        department,
        position,
        status,
        last_login_at,
        created_at,
        work_schedules (
          id,
          start_time,
          end_time,
          day_of_week,
          is_active
        )
      `)
      .in('role', ['doctor', 'nurse', 'staff', 'therapist'])
      .eq('status', 'active')
      .order('full_name');

    if (department) {
      staffQuery = staffQuery.eq('department', department);
    }

    if (limit > 0) {
      staffQuery = staffQuery.limit(limit);
    }

    const { data: staff, error: staffError } = await staffQuery;

    if (staffError) {
      console.error('Error fetching staff:', staffError);
      return NextResponse.json({ 
        error: 'Failed to fetch staff data',
        details: staffError.message 
      }, { status: 500 });
    }

    // Get attendance records for today
    const today = new Date().toISOString().split('T')[0];
    const { data: todayAttendance } = await supabase
      .from('attendance_records')
      .select(`
        user_id,
        check_in_time,
        check_out_time,
        total_hours,
        status,
        date
      `)
      .eq('date', today);

    // Get weekly attendance
    const weekStart = getWeekStart(new Date()).toISOString().split('T')[0];
    const { data: weeklyAttendance } = await supabase
      .from('attendance_records')
      .select(`
        user_id,
        total_hours,
        date
      `)
      .gte('date', weekStart)
      .lte('date', today);

    // Get monthly attendance
    const monthStart = getMonthStart(new Date()).toISOString().split('T')[0];
    const { data: monthlyAttendance } = await supabase
      .from('attendance_records')
      .select(`
        user_id,
        total_hours,
        date
      `)
      .gte('date', monthStart)
      .lte('date', today);

    // Transform data
    const staffWorkHours = (staff || []).map((member: any) => {
      const todayRecord = todayAttendance?.find((a: any) => a.user_id === member.id);
      const weeklyHours = weeklyAttendance
        ?.filter((a: any) => a.user_id === member.id)
        ?.reduce((sum: number, record: any) => sum + (record.total_hours || 0), 0) || 0;
      const monthlyHours = monthlyAttendance
        ?.filter((a: any) => a.user_id === member.id)
        ?.reduce((sum: number, record: any) => sum + (record.total_hours || 0), 0) || 0;

      const isOnDuty = todayRecord && todayRecord.check_in_time && !todayRecord.check_out_time;

      return {
        id: member.id,
        name: member.full_name || member.email,
        email: member.email,
        phone: member.phone,
        position: member.position || getRoleDisplayName(member.role),
        department: member.department || 'غير محدد',
        role: member.role,
        
        // Work hours data
        totalHours: monthlyHours,
        todayHours: todayRecord?.total_hours || 0,
        thisWeekHours: weeklyHours,
        thisMonthHours: monthlyHours,
        
        // Status
        isOnDuty,
        lastCheckIn: todayRecord?.check_in_time ? 
          formatTime(todayRecord.check_in_time) : null,
        lastCheckOut: todayRecord?.check_out_time ? 
          formatTime(todayRecord.check_out_time) : null,
        
        // Additional info
        attendanceStatus: todayRecord?.status || 'absent',
        lastLoginAt: member.last_login_at,
        workSchedules: member.work_schedules || []
      };
    });

    // Filter by on-duty status if requested
    const filteredStaff = status === 'on_duty' 
      ? staffWorkHours.filter((s: any) => s.isOnDuty)
      : status === 'off_duty' 
      ? staffWorkHours.filter((s: any) => !s.isOnDuty)
      : staffWorkHours;

    // Calculate summary statistics
    const summary = {
      totalStaff: staffWorkHours.length,
      onDutyStaff: staffWorkHours.filter((s: any) => s.isOnDuty).length,
      offDutyStaff: staffWorkHours.filter((s: any) => !s.isOnDuty).length,
      avgHoursToday: staffWorkHours.length > 0 ? staffWorkHours.reduce((sum: number, s: any) => sum + s.todayHours, 0) / staffWorkHours.length : 0,
      avgHoursWeek: staffWorkHours.length > 0 ? staffWorkHours.reduce((sum: number, s: any) => sum + s.thisWeekHours, 0) / staffWorkHours.length : 0,
      avgHoursMonth: staffWorkHours.length > 0 ? staffWorkHours.reduce((sum: number, s: any) => sum + s.thisMonthHours, 0) / staffWorkHours.length : 0,
      departments: [...new Set(staffWorkHours.map((s: any) => s.department))]
    };

    return NextResponse.json({
      success: true,
      data: filteredStaff,
      summary,
      meta: {
        total: filteredStaff.length,
        date: today,
        filters: { department, status }
      }
    });

  } catch (error) {
    console.error('Error in staff work hours API:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Helper functions
function getRoleDisplayName(role: string): string {
  const roleNames: Record<string, string> = {
    doctor: 'طبيب',
    nurse: 'ممرض',
    staff: 'موظف',
    therapist: 'معالج',
    admin: 'مدير',
    manager: 'مدير عام',
    supervisor: 'مشرف'
  };
  return roleNames[role] || role;
}

function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString('ar-SA', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

function getWeekStart(date: Date): Date {
  const start = new Date(date);
  const day = start.getDay();
  const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Monday as first day
  start.setDate(diff);
  start.setHours(0, 0, 0, 0);
  return start;
}

function getMonthStart(date: Date): Date {
  const start = new Date(date);
  start.setDate(1);
  start.setHours(0, 0, 0, 0);
  return start;
}
