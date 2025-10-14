// src/app/api/dashboard/health/route.ts
// System health API endpoint for dashboard
// Provides detailed health status of all services

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const healthData = await getDetailedHealthStatus();
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      status: healthData.overallStatus,
      services: healthData.services,
      summary: healthData.summary
    });

  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch health status' },
      { status: 500 }
    );
  }
}

async function getDetailedHealthStatus() {
  try {
    // Get health data from multiple sources
    const [
      systemHealth,
      recentMetrics,
      errorLogs
    ] = await Promise.all([
      getSystemHealthData(),
      getRecentMetrics(),
      getRecentErrors()
    ]);

    const services = systemHealth.map(service => {
      const recentMetric = recentMetrics.find(m => m.service_name === service.service_name);
      const recentErrors = errorLogs.filter(e => e.service_name === service.service_name);

      return {
        name: service.service_name,
        status: service.is_healthy ? 'healthy' : 'unhealthy',
        lastCheck: service.last_check,
        uptime: calculateUptime(service.last_check),
        performance: {
          cpuUsage: recentMetric?.metrics?.cpuUsage || 0,
          memoryUsage: recentMetric?.metrics?.memoryUsage || 0,
          responseTime: recentMetric?.metrics?.responseTime || 0
        },
        errors: {
          count: recentErrors.length,
          lastError: recentErrors[0]?.timestamp || null,
          types: getErrorTypes(recentErrors)
        },
        details: service.health_status
      };
    });

    const summary = {
      totalServices: services.length,
      healthyServices: services.filter(s => s.status === 'healthy').length,
      unhealthyServices: services.filter(s => s.status === 'unhealthy').length,
      totalErrors: services.reduce((acc, s) => acc + s.errors.count, 0),
      averageUptime: calculateAverageUptime(services),
      criticalIssues: services.filter(s => s.errors.count > 5).length
    };

    const overallStatus = calculateOverallStatus(summary);

    return {
      overallStatus,
      services,
      summary
    };

  } catch (error) {
    console.error('Detailed health status error:', error);
    throw error;
  }
}

async function getSystemHealthData() {
  const { data, error } = await supabase
    .from('system_health')
    .select('*')
    .order('last_check', { ascending: false })
    .limit(20);

  if (error) throw error;
  return data || [];
}

async function getRecentMetrics() {
  const { data, error } = await supabase
    .from('system_metrics')
    .select('*')
    .gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours
    .order('timestamp', { ascending: false });

  if (error) throw error;
  return data || [];
}

async function getRecentErrors() {
  const { data, error } = await supabase
    .from('error_logs')
    .select('*')
    .gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours
    .order('timestamp', { ascending: false })
    .limit(100);

  if (error) throw error;
  return data || [];
}

function calculateUptime(lastCheck: string) {
  const now = new Date();
  const lastCheckDate = new Date(lastCheck);
  const diffMs = now.getTime() - lastCheckDate.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  
  if (diffHours < 1) return '99.9%';
  if (diffHours < 24) return `${(99.9 - (diffHours / 24) * 0.1).toFixed(1)}%`;
  return '99.0%';
}

function calculateAverageUptime(services: any[]) {
  const uptimes = services.map(s => {
    const uptimeStr = s.uptime.replace('%', '');
    return parseFloat(uptimeStr);
  });
  
  const average = uptimes.reduce((acc, uptime) => acc + uptime, 0) / uptimes.length;
  return `${average.toFixed(1)}%`;
}

function getErrorTypes(errors: any[]) {
  const types = {};
  errors.forEach(error => {
    const type = error.error_type || 'unknown';
    types[type] = (types[type] || 0) + 1;
  });
  return types;
}

function calculateOverallStatus(summary: any) {
  const healthPercentage = (summary.healthyServices / summary.totalServices) * 100;
  
  if (summary.criticalIssues > 0) return 'critical';
  if (healthPercentage >= 95) return 'excellent';
  if (healthPercentage >= 85) return 'good';
  if (healthPercentage >= 70) return 'fair';
  return 'poor';
}
