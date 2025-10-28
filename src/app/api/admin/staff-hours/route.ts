import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // Get doctors as staff for now
    const { data: staff, error } = await supabase
      .from('doctors')
      .select('id, first_name, last_name, specialization')
      .order('first_name', { ascending: true });

    if (error) throw error;

    // Generate mock work hours data
    const staffWorkHours = staff.map(member => ({
      id: member.id,
      name: `${member.first_name} ${member.last_name}`,
      position: member.specialization || 'طبيب',
      totalHours: Math.floor(Math.random() * 200) + 100,
      todayHours: Math.floor(Math.random() * 8) + 1,
      thisWeekHours: Math.floor(Math.random() * 40) + 20,
      thisMonthHours: Math.floor(Math.random() * 160) + 80,
      isOnDuty: Math.random() > 0.5,
      lastCheckIn: '08:00',
      lastCheckOut: '17:00',
    }));

    return NextResponse.json({
      success: true,
      data: staffWorkHours,
    });
  } catch (error) {
    console.error('Staff hours API error:', error);
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
