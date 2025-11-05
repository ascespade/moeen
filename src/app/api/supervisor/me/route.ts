import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth/authorize';

export const revalidate = 60;

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Security: Require authentication and supervisor/admin role
    const authResult = await requireAuth(['supervisor', 'admin'])(request);
    if (!authResult.authorized || !authResult.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Supervisor or Admin access required' },
        { status: 401 }
      );
    }

    const supabase = await createClient();
    const userId = authResult.user.id;

    // Get supervisor user details
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, full_name, role, email, phone')
      .eq('id', userId)
      .maybeSingle();

    // If user not found, return error - but continue if we have basic user info from auth
    if (userError) {
      console.error('Error fetching user data:', userError);
      // Use auth user data as fallback
      const fallbackUserData = {
        id: authResult.user.id,
        full_name: authResult.user.email?.split('@')[0] || 'Supervisor',
        role: authResult.user.role || 'supervisor',
        email: authResult.user.email || '',
        phone: '',
      };
      return NextResponse.json({
        id: fallbackUserData.id,
        fullName: fallbackUserData.full_name,
        role: fallbackUserData.role,
        staffActivity: [],
        systemMetrics: {
          totalPatients: 0,
          totalAppointments: 0,
          revenue: 0,
          claimsProcessed: 0,
        },
        alerts: [],
        reports: [],
      });
    }

    const finalUserData = userData || {
      id: authResult.user.id,
      full_name: authResult.user.email?.split('@')[0] || 'Supervisor',
      role: authResult.user.role || 'supervisor',
      email: authResult.user.email || '',
      phone: '',
    };

    // Get staff activity (all active staff members with their tasks)
    const { data: staffMembers, error: staffError } = await supabase
      .from('users')
      .select('id, full_name, role, email')
      .in('role', ['doctor', 'nurse', 'staff', 'therapist'])
      .eq('status', 'active')
      .limit(20)
      .maybe();

    if (staffError) {
      console.warn('Error fetching staff members:', staffError);
    }

    // Calculate staff activity metrics
    const today = new Date().toISOString().split('T')[0];
    const staffActivity = await Promise.all(
      (staffMembers || []).slice(0, 10).map(async staff => {
        try {
          // Get today's appointments for this staff member
          const { count: todayTasks, error: todayError } = await supabase
            .from('appointments')
            .select('*', { count: 'exact', head: true })
            .eq('doctor_id', staff.id)
            .eq('appointment_date', today);

          if (todayError) {
            console.warn(
              `Error fetching today tasks for staff ${staff.id}:`,
              todayError
            );
          }

          // Get completed appointments
          const { count: completedTasks, error: completedError } =
            await supabase
              .from('appointments')
              .select('*', { count: 'exact', head: true })
              .eq('doctor_id', staff.id)
              .eq('status', 'completed')
              .gte('appointment_date', today);

          if (completedError) {
            console.warn(
              `Error fetching completed tasks for staff ${staff.id}:`,
              completedError
            );
          }

          const totalTasks = todayTasks || 0;
          const completed = completedTasks || 0;
          const efficiency =
            totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0;

          return {
            id: staff.id,
            name: staff.full_name || staff.email || 'Unknown',
            role: staff.role,
            todayTasks: totalTasks,
            completedTasks: completed,
            efficiency,
          };
        } catch (error) {
          console.warn(
            `Error calculating metrics for staff ${staff.id}:`,
            error
          );
          return {
            id: staff.id,
            name: staff.full_name || staff.email || 'Unknown',
            role: staff.role,
            todayTasks: 0,
            completedTasks: 0,
            efficiency: 0,
          };
        }
      })
    );

    // Get system metrics with error handling
    let totalPatients = 0;
    let totalAppointments = 0;
    let revenue = 0;
    let claimsProcessed = 0;

    try {
      // Total patients
      const { count: patientsCount, error: patientsError } = await supabase
        .from('patients')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      if (patientsError) {
        console.warn('Error fetching patients count:', patientsError);
      } else {
        totalPatients = patientsCount || 0;
      }
    } catch (error) {
      console.warn('Error in patients query:', error);
    }

    try {
      // Total appointments
      const { count: appointmentsCount, error: appointmentsError } =
        await supabase
          .from('appointments')
          .select('*', { count: 'exact', head: true })
          .in('status', ['scheduled', 'confirmed', 'in_progress']);

      if (appointmentsError) {
        console.warn('Error fetching appointments count:', appointmentsError);
      } else {
        totalAppointments = appointmentsCount || 0;
      }
    } catch (error) {
      console.warn('Error in appointments query:', error);
    }

    try {
      // Get revenue from insurance claims (approved)
      const { data: claimsData, error: claimsError } = await supabase
        .from('insurance_claims')
        .select('amount')
        .eq('status', 'approved');

      if (claimsError) {
        console.warn('Error fetching claims data:', claimsError);
      } else {
        revenue =
          claimsData?.reduce((sum: number, claim: any) => sum + (claim.amount || 0), 0) || 0;
      }

      // Claims processed (approved + rejected)
      const { count: claimsCount, error: claimsCountError } = await supabase
        .from('insurance_claims')
        .select('*', { count: 'exact', head: true })
        .in('status', ['approved', 'rejected']);

      if (claimsCountError) {
        console.warn(
          'Error fetching claims processed count:',
          claimsCountError
        );
      } else {
        claimsProcessed = claimsCount || 0;
      }
    } catch (error) {
      console.warn('Error in claims queries:', error);
    }

    // Get alerts (appointments needing attention, overdue tasks, etc.)
    let alerts: any[] = [];
    try {
      const { data: upcomingAppointments, error: alertsError } = await supabase
        .from('appointments')
        .select('id, appointment_date, appointment_time, status')
        .eq('status', 'scheduled')
        .gte('appointment_date', today)
        .order('appointment_date', { ascending: true })
        .limit(5)
        .maybe();

      if (alertsError) {
        console.warn('Error fetching alerts:', alertsError);
      } else {
        alerts = (upcomingAppointments || []).slice(0, 3).map(apt => ({
          id: `alert-${apt.id}`,
          type: 'info' as const,
          message: `Upcoming appointment on ${apt.appointment_date}`,
          timestamp: new Date().toISOString(),
        }));
      }
    } catch (error) {
      console.warn('Error in alerts query:', error);
    }

    // Get recent reports (if reports table exists)
    let reports: any[] = [];
    try {
      const { data: reportsData, error: reportsError } = await supabase
        .from('reports')
        .select('id, name, type, status, created_at')
        .order('created_at', { ascending: false })
        .limit(10)
        .maybe();

      if (reportsError) {
        console.warn('Error fetching reports:', reportsError);
      } else {
        reports =
          reportsData?.map(report => ({
            id: report.id,
            name: report.name || 'Untitled Report',
            type: report.type || 'general',
            generatedAt: report.created_at,
            status: (report.status || 'ready') as
              | 'ready'
              | 'processing'
              | 'failed',
          })) || [];
      }
    } catch (error) {
      console.warn('Error in reports query:', error);
    }

    const response = {
      id: finalUserData.id,
      fullName: finalUserData.full_name || finalUserData.email || 'Supervisor',
      role: finalUserData.role,
      staffActivity,
      systemMetrics: {
        totalPatients,
        totalAppointments,
        revenue,
        claimsProcessed,
      },
      alerts,
      reports,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in /api/supervisor/me:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
