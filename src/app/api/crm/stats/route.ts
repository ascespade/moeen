import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const today = new Date().toISOString().split('T')[0];

    // جلب إحصائيات المواعيد
    const [
      totalAppointmentsResult,
      todayAppointmentsResult,
      pendingAppointmentsResult,
      completedAppointmentsResult,
      totalPatientsResult,
      totalDoctorsResult
    ] = await Promise.all([
      // إجمالي المواعيد
      supabase
        .from('appointments')
        .select('id', { count: 'exact' }),
      
      // مواعيد اليوم
      supabase
        .from('appointments')
        .select('id', { count: 'exact' })
        .eq('appointment_date', today),
      
      // المواعيد المعلقة
      supabase
        .from('appointments')
        .select('id', { count: 'exact' })
        .in('status', ['scheduled', 'confirmed']),
      
      // المواعيد المكتملة
      supabase
        .from('appointments')
        .select('id', { count: 'exact' })
        .eq('status', 'completed'),
      
      // إجمالي المرضى
      supabase
        .from('patients')
        .select('id', { count: 'exact' }),
      
      // إجمالي الأطباء
      supabase
        .from('doctors')
        .select('id', { count: 'exact' })
        .eq('is_active', true)
    ]);

    const stats = {
      totalAppointments: totalAppointmentsResult.count || 0,
      todayAppointments: todayAppointmentsResult.count || 0,
      pendingAppointments: pendingAppointmentsResult.count || 0,
      completedAppointments: completedAppointmentsResult.count || 0,
      totalPatients: totalPatientsResult.count || 0,
      totalDoctors: totalDoctorsResult.count || 0
    };

    return NextResponse.json({
      success: true,
      stats
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
