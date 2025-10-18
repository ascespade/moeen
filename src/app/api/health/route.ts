
/**
 * Health Check API - فحص صحة النظام
 * Comprehensive health monitoring and system status
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';

interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  uptime: number;
  services: {
    database: ServiceStatus;
    storage: ServiceStatus;
    auth: ServiceStatus;
    api: ServiceStatus;
    memory: ServiceStatus;
    cpu: ServiceStatus;
  };
  metrics: {
    responseTime: number;
    memoryUsage: NodeJS.MemoryUsage;
    cpuUsage: NodeJS.CpuUsage;
    activeConnections: number;
    errorRate: number;
  };
}

interface ServiceStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime?: number;
  error?: string;
  lastChecked: string;
}

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const healthCheck = await performHealthCheck();
    const responseTime = Date.now() - startTime;
    
    // Add response time to metrics
    healthCheck.metrics.responseTime = responseTime;
    
    // Determine overall status
    const overallStatus = determineOverallStatus(healthCheck.services);
    healthCheck.status = overallStatus;
    
    // Set appropriate HTTP status code
    const httpStatus = getHttpStatus(overallStatus);
    
    // Add cache headers
    const response = NextResponse.json(healthCheck, { status: httpStatus });
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('X-Health-Check', 'true');
    response.headers.set('X-Response-Time', `${responseTime}ms`);
    
    return response;
    
  } catch (error) {
    logger.error('Health check failed', { error: error.message });
    
    const errorResponse = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
      message: error.message,
    };
    
    return NextResponse.json(errorResponse, { status: 503 });
  }
}

async function performHealthCheck(): Promise<HealthCheck> {
  const timestamp = new Date().toISOString();
  const startTime = Date.now();
  
  // Check all services in parallel
  const [
    databaseStatus,
    storageStatus,
    authStatus,
    apiStatus,
    memoryStatus,
    cpuStatus,
  ] = await Promise.all([
    checkDatabase(),
    checkStorage(),
    checkAuth(),
    checkAPI(),
    checkMemory(),
    checkCPU(),
  ]);
  
  // Get system metrics
  const memoryUsage = process.memoryUsage();
  const cpuUsage = process.cpuUsage();
  
  return {
    status: 'healthy', // Will be determined later
    timestamp,
    version: process.env.npm_package_version || '1.0.0',
    uptime: process.uptime(),
    services: {
      database: databaseStatus,
      storage: storageStatus,
      auth: authStatus,
      api: apiStatus,
      memory: memoryStatus,
      cpu: cpuStatus,
    },
    metrics: {
      responseTime: Date.now() - startTime,
      memoryUsage,
      cpuUsage,
      activeConnections: 0, // Would need to track this
      errorRate: 0, // Would need to track this
    },
  };
}

async function checkDatabase(): Promise<ServiceStatus> {
  const startTime = Date.now();
  
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    
    const responseTime = Date.now() - startTime;
    
    if (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        lastChecked: new Date().toISOString(),
      };
    }
    
    return {
      status: responseTime > 1000 ? 'degraded' : 'healthy',
      responseTime,
      lastChecked: new Date().toISOString(),
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      lastChecked: new Date().toISOString(),
    };
  }
}

async function checkStorage(): Promise<ServiceStatus> {
  const startTime = Date.now();
  
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.storage
      .from('medical-files')
      .list('', { limit: 1 });
    
    const responseTime = Date.now() - startTime;
    
    if (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        lastChecked: new Date().toISOString(),
      };
    }
    
    return {
      status: responseTime > 2000 ? 'degraded' : 'healthy',
      responseTime,
      lastChecked: new Date().toISOString(),
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      lastChecked: new Date().toISOString(),
    };
  }
}

async function checkAuth(): Promise<ServiceStatus> {
  const startTime = Date.now();
  
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getSession();
    
    const responseTime = Date.now() - startTime;
    
    if (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        lastChecked: new Date().toISOString(),
      };
    }
    
    return {
      status: responseTime > 1000 ? 'degraded' : 'healthy',
      responseTime,
      lastChecked: new Date().toISOString(),
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      lastChecked: new Date().toISOString(),
    };
  }
}

async function checkAPI(): Promise<ServiceStatus> {
  const startTime = Date.now();
  
  try {
    // Test a simple API endpoint
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/health`);
    const responseTime = Date.now() - startTime;
    
    if (!response.ok) {
      return {
        status: 'unhealthy',
        error: `HTTP ${response.status}`,
        lastChecked: new Date().toISOString(),
      };
    }
    
    return {
      status: responseTime > 500 ? 'degraded' : 'healthy',
      responseTime,
      lastChecked: new Date().toISOString(),
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      lastChecked: new Date().toISOString(),
    };
  }
}

async function checkMemory(): Promise<ServiceStatus> {
  const memoryUsage = process.memoryUsage();
  const totalMemory = memoryUsage.heapTotal;
  const usedMemory = memoryUsage.heapUsed;
  const memoryUsagePercent = (usedMemory / totalMemory) * 100;
  
  let status: 'healthy' | 'degraded' | 'unhealthy';
  
  if (memoryUsagePercent > 90) {
    status = 'unhealthy';
  } else if (memoryUsagePercent > 75) {
    status = 'degraded';
  } else {
    status = 'healthy';
  }
  
  return {
    status,
    lastChecked: new Date().toISOString(),
  };
}

async function checkCPU(): Promise<ServiceStatus> {
  const cpuUsage = process.cpuUsage();
  const totalUsage = cpuUsage.user + cpuUsage.system;
  
  // This is a simplified check - in production, you'd want more sophisticated CPU monitoring
  let status: 'healthy' | 'degraded' | 'unhealthy';
  
  if (totalUsage > 1000000) { // Arbitrary threshold
    status = 'unhealthy';
  } else if (totalUsage > 500000) {
    status = 'degraded';
  } else {
    status = 'healthy';
  }
  
  return {
    status,
    lastChecked: new Date().toISOString(),
  };
}

function determineOverallStatus(services: HealthCheck['services']): 'healthy' | 'degraded' | 'unhealthy' {
  const statuses = Object.values(services).map(service => service.status);
  
  if (statuses.includes('unhealthy')) {
    return 'unhealthy';
  }
  
  if (statuses.includes('degraded')) {
    return 'degraded';
  }
  
  return 'healthy';
}

function getHttpStatus(status: 'healthy' | 'degraded' | 'unhealthy'): number {
  switch (status) {
    case 'healthy':
      return 200;
    case 'degraded':
      return 200; // Still operational
    case 'unhealthy':
      return 503;
    default:
      return 500;
  }
}

// Additional health check endpoints
export async function POST(request: NextRequest) {
  // Detailed health check with more information
  const { detailed } = await request.json();
  
  if (detailed) {
    const healthCheck = await performDetailedHealthCheck();
    return NextResponse.json(healthCheck);
  }
  
  return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
}

async function performDetailedHealthCheck() {
  // This would include more detailed system information
  // like database connection pools, cache status, etc.
  return {
    ...await performHealthCheck(),
    detailed: true,
    additionalInfo: {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      pid: process.pid,
      environment: process.env.NODE_ENV,
    },
  };
}