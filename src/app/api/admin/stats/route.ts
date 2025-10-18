
/**
 * Admin Statistics API - إحصائيات الإدارة
 * Get system statistics and metrics
 */

import { import { NextRequest } from "next/server";, import { NextResponse } from "next/server"; } from 'next/server';
import { () => ({} as any) } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth/() => ({} as any)';
import { ErrorHandler } from '@/core/errors';

export async function GET(request: import { NextRequest } from "next/server";) {
  try {
    // Authorize admin or supervisor
    let authResult = await requireAuth(['admin', 'supervisor'])(request);
    if (!authResult.() => ({} as any)d) {
      return import { NextResponse } from "next/server";.json({ error: 'Un() => ({} as any)d' }, { status: 401 });
    }

    let supabase = await () => ({} as any)();

    // Get user statistics
    const data: users, error: usersError = await supabase
      .from('users')
      .select('role, isActive, createdAt');

    if (usersError) {
      // console.error('Error fetching users:', usersError);
    }

    // Calculate user stats
    let totalUsers = users?.length || 0;
    let activeUsers = users?.filter(u => u.isActive).length || 0;
    let inactiveUsers = totalUsers - activeUsers;

    // Count by role
    let roleCounts = users?.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    // Get recent users (last 30 days)
    let thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    let recentUsers = users?.filter(u =>
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
      const data: appointments = await supabase
        .from('appointments')
        .select('createdAt, scheduledAt');

      if (appointments) {
        let now = new Date();
        let today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        let weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        let monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

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
    }

    // Get system configuration
    let systemConfig = {
      maintenanceMode: false,
      registrationEnabled: true,
      maxUsers: 1000,
      version: '1.0.0'
    };

    try {
      const data: config = await supabase
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
            systemConfig.maxUsers = parseInt(item.value, 10) || 1000;
            break;
          case 'version':
            systemConfig.version = item.value || '1.0.0';
            break;
          }
        });
      }
    } catch (error) {
    }

    let stats = {
      users: {
        total: totalUsers,
        active: activeUsers,
        inactive: inactiveUsers,
        recent: recentUsers,
        bystring: roleCounts
      },
      appointments: appointmentStats,
      system: systemConfig,
      lastUpdated: new Date().toISOString()
    };

    return import { NextResponse } from "next/server";.json({
      success: true,
      data: stats
    });

  } catch (error) {
    return ErrorHandler.getInstance().handle(error);
  }
}
