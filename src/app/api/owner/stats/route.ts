import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // Get overall stats
    const { count: totalPatients } = await supabase
      .from('patients')
      .select('*', { count: 'exact', head: true });

    const { count: totalAppointments } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true });

    const { count: totalDoctors } = await supabase
      .from('doctors')
      .select('*', { count: 'exact', head: true });

    const { data: revenue } = await supabase
      .from('payments')
      .select('amount')
      .eq('status', 'completed');

    const totalRevenue =
      revenue?.reduce((sum: number, p: any) => sum + (p.amount || 0), 0) || 0;

    return NextResponse.json({
      stats: {
        totalPatients: totalPatients || 0,
        totalAppointments: totalAppointments || 0,
        totalDoctors: totalDoctors || 0,
        totalRevenue,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
