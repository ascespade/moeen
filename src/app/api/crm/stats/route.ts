export async function GET(request: import { NextRequest } from "next/server";) {
  import { import { NextRequest } from "next/server";, import { NextResponse } from "next/server"; } from 'next/server';
  import { () => ({} as any) } from '@/lib/supabase/server';

  try {
    let supabase = await () => ({} as any)();
    let today = new Date().toISOString().split('T')[0];

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

    let stats = {
      totalAppointments: totalAppointmentsResult.count || 0,
      todayAppointments: todayAppointmentsResult.count || 0,
      pendingAppointments: pendingAppointmentsResult.count || 0,
      completedAppointments: completedAppointmentsResult.count || 0,
      totalPatients: totalPatientsResult.count || 0,
      totalDoctors: totalDoctorsResult.count || 0
    };

    return import { NextResponse } from "next/server";.json({
      success: true,
      stats
    });

  } catch (error) {
    return import { NextResponse } from "next/server";.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
