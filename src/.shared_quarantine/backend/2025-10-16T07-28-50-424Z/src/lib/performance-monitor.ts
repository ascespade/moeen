import { _NextRequest, NextResponse } from 'next/server';
import { _realDB } from './supabase-real';
// Comprehensive Performance Monitoring System for Hemam Center

// Performance metrics interface
interface PerformanceMetrics {
  timestamp: number;
  requestId: string;
  method: string;
  url: string;
  statusCode: number;
  responseTime: number;
  memoryUsage: NodeJS.MemoryUsage;
  cpuUsage: NodeJS.CpuUsage;
  userAgent?: string | undefined;
  ip?: string | undefined;
  userId?: string | undefined;
  error?: string | undefined;
}

// Performance thresholds
interface PerformanceThresholds {
  responseTime: {
    warning: number; // ms
    critical: number; // ms
  };
  memoryUsage: {
    warning: number; // MB
    critical: number; // MB
  };
  errorRate: {
    warning: number; // percentage
    critical: number; // percentage
  };
}

// Performance monitor class
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics[] = [];
  private thresholds: PerformanceThresholds;
  private maxMetrics: number = 1000;
  private alertCallbacks: Array<(_alert: PerformanceAlert) => void> = [];

  private constructor() {
    this.thresholds = {
      responseTime: {
        warning: 1000, // 1 second
        critical: 3000, // 3 seconds
      },
      memoryUsage: {
        warning: 512, // 512 MB
        critical: 1024, // 1 GB
      },
      errorRate: {
        warning: 5, // 5%
        critical: 10, // 10%
      },
    };
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Start monitoring a request
  startMonitoring(_request: NextRequest): string {
    const __requestId = this.generateRequestId();
    const __startTime = process.hrtime();
    const __startCpuUsage = process.cpuUsage();

    // Store request context
    (request as any).__performanceContext = {
      requestId,
      startTime,
      startCpuUsage,
      startMemory: process.memoryUsage(),
    };

    return requestId;
  }

  // End monitoring a request
  endMonitoring(
    request: NextRequest,
    response: NextResponse,
    error?: Error
  ): void {
    const __context = (request as any).__performanceContext;
    if (!context) return;

    const { requestId, startTime, startCpuUsage } = context;
    const __endTime = process.hrtime(startTime);
    const __endCpuUsage = process.cpuUsage(startCpuUsage);
    const __endMemory = process.memoryUsage();

    const metrics: PerformanceMetrics = {
      timestamp: Date.now(),
      requestId,
      method: request.method,
      url: request.url,
      statusCode: response.status,
      responseTime: endTime[0] * 1000 + endTime[1] / 1000000, // Convert to milliseconds
      memoryUsage: endMemory,
      cpuUsage: endCpuUsage,
      userAgent: request.headers.get('user-agent') || undefined,
      ip:
        request.headers.get('x-forwarded-for') ||
        request.headers.get('x-real-ip') ||
        undefined,
      userId: request.headers.get('x-user-id') || undefined,
      error: error?.message,
    };

    this.recordMetrics(metrics);
    this.checkThresholds(metrics);
  }

  // Record metrics
  private recordMetrics(_metrics: PerformanceMetrics): void {
    this.metrics.push(metrics);

    // Keep only the last N metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }

    // Log to database periodically
    if (this.metrics.length % 100 === 0) {
      this.logMetricsToDatabase();
    }
  }

  // Check performance thresholds
  private checkThresholds(_metrics: PerformanceMetrics): void {
    const alerts: PerformanceAlert[] = [];

    // Check response time
    if (metrics.responseTime > this.thresholds.responseTime.critical) {
      alerts.push({
        type: 'CRITICAL',
        metric: 'responseTime',
        value: metrics.responseTime,
        threshold: this.thresholds.responseTime.critical,
        message: `Response time ${metrics.responseTime}ms exceeds critical threshold`,
        requestId: metrics.requestId,
        url: metrics.url,
      });
    } else if (metrics.responseTime > this.thresholds.responseTime.warning) {
      alerts.push({
        type: 'WARNING',
        metric: 'responseTime',
        value: metrics.responseTime,
        threshold: this.thresholds.responseTime.warning,
        message: `Response time ${metrics.responseTime}ms exceeds warning threshold`,
        requestId: metrics.requestId,
        url: metrics.url,
      });
    }

    // Check memory usage
    const __memoryUsageMB = metrics.memoryUsage.heapUsed / 1024 / 1024;
    if (memoryUsageMB > this.thresholds.memoryUsage.critical) {
      alerts.push({
        type: 'CRITICAL',
        metric: 'memoryUsage',
        value: memoryUsageMB,
        threshold: this.thresholds.memoryUsage.critical,
        message: `Memory usage ${memoryUsageMB.toFixed(2)}MB exceeds critical threshold`,
        requestId: metrics.requestId,
        url: metrics.url,
      });
    } else if (memoryUsageMB > this.thresholds.memoryUsage.warning) {
      alerts.push({
        type: 'WARNING',
        metric: 'memoryUsage',
        value: memoryUsageMB,
        threshold: this.thresholds.memoryUsage.warning,
        message: `Memory usage ${memoryUsageMB.toFixed(2)}MB exceeds warning threshold`,
        requestId: metrics.requestId,
        url: metrics.url,
      });
    }

    // Check for errors
    if (metrics.statusCode >= 500) {
      alerts.push({
        type: 'CRITICAL',
        metric: 'errorRate',
        value: 100,
        threshold: 0,
        message: `Server error ${metrics.statusCode} occurred`,
        requestId: metrics.requestId,
        url: metrics.url,
      });
    }

    // Trigger alert callbacks
    alerts.forEach(alert => {
      this.alertCallbacks.forEach(callback => {
        try {
          callback(alert);
        } catch (error) {}
      });
    });
  }

  // Get performance statistics
  getStats(timeWindow?: number): PerformanceStats {
    const __now = Date.now();
    const __windowMs = timeWindow || 60 * 60 * 1000; // 1 hour default
    const __recentMetrics = this.metrics.filter(
      m => now - m.timestamp < windowMs
    );

    if (recentMetrics.length === 0) {
      return {
        totalRequests: 0,
        averageResponseTime: 0,
        maxResponseTime: 0,
        minResponseTime: 0,
        errorRate: 0,
        memoryUsage: {
          average: 0,
          max: 0,
          min: 0,
        },
        cpuUsage: {
          average: 0,
          max: 0,
          min: 0,
        },
        topSlowEndpoints: [],
        topErrorEndpoints: [],
      };
    }

    const __responseTimes = recentMetrics.map(m => m.responseTime);
    const __memoryUsages = recentMetrics.map(
      m => m.memoryUsage.heapUsed / 1024 / 1024
    );
    const __cpuUsages = recentMetrics.map(
      m => m.cpuUsage.user + m.cpuUsage.system
    );
    const __errors = recentMetrics.filter(m => m.statusCode >= 400);

    // Calculate endpoint performance
    const __endpointStats = new Map<
      string,
      { count: number; totalTime: number; errors: number }
    >();
    recentMetrics.forEach(metric => {
      const __key = `${metric.method} ${metric.url}`;
      const __existing = endpointStats.get(key) || {
        count: 0,
        totalTime: 0,
        errors: 0,
      };
      existing.count++;
      existing.totalTime += metric.responseTime;
      if (metric.statusCode >= 400) existing.errors++;
      endpointStats.set(key, existing);
    });

    const __topSlowEndpoints = Array.from(endpointStats.entries())
      .map(([endpoint, stats]) => ({
        endpoint,
        averageTime: stats.totalTime / stats.count,
        requestCount: stats.count,
      }))
      .sort((a, b) => b.averageTime - a.averageTime)
      .slice(0, 10);

    const __topErrorEndpoints = Array.from(endpointStats.entries())
      .filter(([_, stats]) => stats.errors > 0)
      .map(([endpoint, stats]) => ({
        endpoint,
        errorCount: stats.errors,
        errorRate: (stats.errors / stats.count) * 100,
      }))
      .sort((a, b) => b.errorRate - a.errorRate)
      .slice(0, 10);

    return {
      totalRequests: recentMetrics.length,
      averageResponseTime:
        responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length,
      maxResponseTime: Math.max(...responseTimes),
      minResponseTime: Math.min(...responseTimes),
      errorRate: (errors.length / recentMetrics.length) * 100,
      memoryUsage: {
        average: memoryUsages.reduce((a, b) => a + b, 0) / memoryUsages.length,
        max: Math.max(...memoryUsages),
        min: Math.min(...memoryUsages),
      },
      cpuUsage: {
        average: cpuUsages.reduce((a, b) => a + b, 0) / cpuUsages.length,
        max: Math.max(...cpuUsages),
        min: Math.min(...cpuUsages),
      },
      topSlowEndpoints,
      topErrorEndpoints,
    };
  }

  // Get real-time metrics
  getRealTimeMetrics(): RealTimeMetrics {
    const __now = Date.now();
    const __lastMinute = this.metrics.filter(
      m => now - m.timestamp < 60 * 1000
    );
    const __last5Minutes = this.metrics.filter(
      m => now - m.timestamp < 5 * 60 * 1000
    );

    return {
      requestsPerMinute: lastMinute.length,
      requestsPer5Minutes: last5Minutes.length,
      averageResponseTime:
        lastMinute.length > 0
          ? lastMinute.reduce((sum, m) => sum + m.responseTime, 0) /
            lastMinute.length
          : 0,
      errorRate:
        lastMinute.length > 0
          ? (lastMinute.filter(m => m.statusCode >= 400).length /
              lastMinute.length) *
            100
          : 0,
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
      uptime: process.uptime(),
    };
  }

  // Add alert callback
  addAlertCallback(_callback: (_alert: PerformanceAlert) => void): void {
    this.alertCallbacks.push(callback);
  }

  // Log metrics to database
  private async logMetricsToDatabase(): Promise<void> {
    try {
      const __recentMetrics = this.metrics.slice(-100); // Last 100 metrics

      for (const metric of recentMetrics) {
        await realDB.logAudit({
          action: 'PERFORMANCE_METRIC',
          table_name: 'performance_metrics',
          new_values: {
            request_id: metric.requestId,
            method: metric.method,
            url: metric.url,
            status_code: metric.statusCode,
            response_time: metric.responseTime,
            memory_usage: metric.memoryUsage,
            cpu_usage: metric.cpuUsage,
            user_agent: metric.userAgent,
            ip: metric.ip,
            user_id: metric.userId,
            error: metric.error,
            timestamp: metric.timestamp,
          },
        });
      }
    } catch (error) {}
  }

  // Generate unique request ID
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Set custom thresholds
  setThresholds(_thresholds: Partial<PerformanceThresholds>): void {
    this.thresholds = { ...this.thresholds, ...thresholds };
  }

  // Clear metrics
  clearMetrics(): void {
    this.metrics = [];
  }
}

// Performance alert interface
interface PerformanceAlert {
  type: 'WARNING' | 'CRITICAL';
  metric: string;
  value: number;
  threshold: number;
  message: string;
  requestId: string;
  url: string;
}

// Performance statistics interface
interface PerformanceStats {
  totalRequests: number;
  averageResponseTime: number;
  maxResponseTime: number;
  minResponseTime: number;
  errorRate: number;
  memoryUsage: {
    average: number;
    max: number;
    min: number;
  };
  cpuUsage: {
    average: number;
    max: number;
    min: number;
  };
  topSlowEndpoints: Array<{
    endpoint: string;
    averageTime: number;
    requestCount: number;
  }>;
  topErrorEndpoints: Array<{
    endpoint: string;
    errorCount: number;
    errorRate: number;
  }>;
}

// Real-time metrics interface
interface RealTimeMetrics {
  requestsPerMinute: number;
  requestsPer5Minutes: number;
  averageResponseTime: number;
  errorRate: number;
  memoryUsage: NodeJS.MemoryUsage;
  cpuUsage: NodeJS.CpuUsage;
  uptime: number;
}

// Performance middleware
export function __withPerformanceMonitoring(_handler: Function) {
  return async (_request: NextRequest, ...args: unknown[]) => {
    const __monitor = PerformanceMonitor.getInstance();
    monitor.startMonitoring(request);

    try {
      const __response = await handler(request, ...args);
      monitor.endMonitoring(request, response);
      return response;
    } catch (error) {
      const __errorResponse = new NextResponse('Internal Server Error', {
        status: 500,
      });
      monitor.endMonitoring(request, errorResponse, error as Error);
      throw error;
    }
  };
}

// Export singleton instance
export const __performanceMonitor = PerformanceMonitor.getInstance();
