/**
 * Admin Statistics API - إحصائيات الإدارة
 * Get system statistics and metrics
 */

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

    // Get user statistics
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('role, isActive, createdAt');

    if (usersError) {
      console.error('Error fetching users:', usersError);
    }

    // Calculate user stats
    const totalUsers = users?.length || 0;
    const activeUsers = users?.filter(u => u.isActive).length || 0;
    const inactiveUsers = totalUsers - activeUsers;

    // Count by role
    const roleCounts = users?.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    // Get recent users (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentUsers = users?.filter(u => 
      new Date(u.createdAt) >= thirtyDaysAgo
    ).length || 0;

    // Get appointments stats (if table exists)
    let appointmentStats = {
      total: 0,
      today: 0,
      thisWeek: 0,
      thisMonth: 0
    };

    try {
      const { data: appointments } = await supabase
        .from('appointments')
        .select('createdAt, scheduledAt');

      if (appointments) {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

        appointmentStats = {
          total: appointments.length,
          today: appointments.filter(a => 
            new Date(a.scheduledAt) >= today
          ).length,
          thisWeek: appointments.filter(a => 
            new Date(a.scheduledAt) >= weekAgo
          ).length,
          thisMonth: appointments.filter(a => 
            new Date(a.scheduledAt) >= monthAgo
          ).length
        };
      }
    } catch (error) {
      console.log('Appointments table not found, using default stats');
    }

    // Get system configuration
    let systemConfig = {
      maintenanceMode: false,
      registrationEnabled: true,
      maxUsers: 1000,
      version: '1.0.0'
    };

    try {
      const { data: config } = await supabase
        .from('system_config')
        .select('key, value')
        .in('key', ['maintenance_mode', 'registration_enabled', 'max_users', 'version']);

      if (config) {
        config.forEach(item => {
          switch (item.key) {
            case 'maintenance_mode':
              systemConfig.maintenanceMode = item.value === 'true';
              break;
            case 'registration_enabled':
              systemConfig.registrationEnabled = item.value === 'true';
              break;
            case 'max_users':
              systemConfig.maxUsers = parseInt(item.value) || 1000;
              break;
            case 'version':
              systemConfig.version = item.value || '1.0.0';
              break;
          }
        });
      }
    } catch (error) {
      console.log('System config table not found, using default config');
    }

    const stats = {
      users: {
        total: totalUsers,
        active: activeUsers,
        inactive: inactiveUsers,
        recent: recentUsers,
        byRole: roleCounts
      },
      appointments: appointmentStats,
      system: systemConfig,
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error) {
    return ErrorHandler.getInstance().handle(error);
  }
}
