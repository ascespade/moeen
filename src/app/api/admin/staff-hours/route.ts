import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth/authorize';
import { ErrorHandler } from '@/core/errors';

export async function GET(request: NextRequest) {
  try {
    // Authorize admin or supervisor
    const authResult = await requireAuth(['admin', 'supervisor'])(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();
    // Get doctors as staff for now
    const { data: staff, error } = await supabase
      .from('doctors')
      .select('id, first_name, last_name, specialization')
      .order('first_name', { ascending: true });

    if (error) throw error;

    // Get real work hours data from database
    const { data: workHoursData } = await supabase
      .from('staff_work_hours')
      .select('*')
      .in('staff_id', staff.map((s: any) => s.id));

    // Map staff with their real work hours
    const staffWorkHours = staff.map((member: any) => {
      const hoursData = workHoursData?.find((wh: any) => wh.staff_id === member.id);
      return {
        id: member.id,
        name: `${member.first_name} ${member.last_name}`,
        position: member.specialization || 'طبيب',
        totalHours: hoursData?.total_hours || 0,
        todayHours: hoursData?.today_hours || 0,
        thisWeekHours: hoursData?.this_week_hours || 0,
        thisMonthHours: hoursData?.this_month_hours || 0,
        isOnDuty: hoursData?.is_on_duty || false,
        lastCheckIn: hoursData?.last_check_in || null,
        lastCheckOut: hoursData?.last_check_out || null,
      };
    });

    return NextResponse.json({
      success: true,
      data: staffWorkHours,
    });
  } catch (error) {
    return ErrorHandler.getInstance().handle(error as Error);
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
