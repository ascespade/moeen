import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@
  try {
    // Security: Require authentication
    const authResult = await requireAuth(["admin"])(request);
    if (!authResult.authorized || !authResult.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Authentication required' },
        { status: 401 }
      );
    }
/lib/auth/authorize';

export async function GET() {
  try {
    const startTime = Date.now();

    // Get basic system metrics
    const supabase = await createClient();

    // Get user count
    const { count: userCount } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    // Get appointment count
    const { count: appointmentCount } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true });

    // Get patient count
    const { count: patientCount } = await supabase
      .from('patients')
      .select('*', { count: 'exact', head: true });

    const responseTime = Date.now() - startTime;

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      metrics: {
        users: userCount || 0,
        appointments: appointmentCount || 0,
        patients: patientCount || 0,
      },
      responseTime,
      uptime: process.uptime(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message,
        responseTime: 0,
      },
      { status: 500 }
    );
  }
}
