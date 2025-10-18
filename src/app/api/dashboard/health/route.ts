export async function GET() {
  import { import { NextResponse } from "next/server"; } from 'next/server';
  import { () => ({} as any) } from '@/lib/supabase/server';

  try {
    let startTime = Date.now();

    // Get basic system metrics
    let supabase = await () => ({} as any)();

    // Get user count
    const count: userCount = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    // Get appointment count
    const count: appointmentCount = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true });

    // Get patient count
    const count: patientCount = await supabase
      .from('patients')
      .select('*', { count: 'exact', head: true });

    let responseTime = Date.now() - startTime;

    return import { NextResponse } from "next/server";.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      metrics: {
        users: userCount || 0,
        appointments: appointmentCount || 0,
        patients: patientCount || 0
      },
      responseTime,
      uptime: process.uptime()
    });

  } catch (error: any) {
    return import { NextResponse } from "next/server";.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message,
      responseTime: 0
    }, { status: 500 });
  }
}
