import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/authorize';

export const revalidate = 60;

export async function GET(request: NextRequest) {
  try {
    // Security: Require authentication
    const authResult = await requireAuth(['admin'])(request);
    if (!authResult.authorized || !authResult.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Authentication required' },
        { status: 401 }
      );
    }

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
      revenue?.reduce((sum: number, p: unknown) => sum + (p.amount || 0), 0) ||
      0;

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
