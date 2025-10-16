/**
 * Audit Middleware - أمان التدقيق
 * Comprehensive audit logging for all API requests and responses
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface AuditConfig {
  enableRequestLogging: boolean;
  enableResponseLogging: boolean;
  enableErrorLogging: boolean;
  enablePerformanceLogging: boolean;
  sensitiveFields: string[];
  excludedPaths: string[];
  maxBodySize: number;
}

const defaultAuditConfig: AuditConfig = {
  enableRequestLogging: true,
  enableResponseLogging: true,
  enableErrorLogging: true,
  enablePerformanceLogging: true,
  sensitiveFields: ['password', 'token', 'secret', 'key', 'authorization'],
  excludedPaths: ['/api/health', '/api/status', '/_next/'],
  maxBodySize: 1024 * 1024, // 1MB
};

export class AuditMiddleware {
  private config: AuditConfig;

  constructor(config: Partial<AuditConfig> = {}) {
    this.config = { ...defaultAuditConfig, ...config };
  }

  async logRequest(req: NextRequest, startTime: number): Promise<void> {
    if (!this.config.enableRequestLogging) return;

    const auditData = {
      type: 'request',
      method: req.method,
      url: req.url,
      pathname: req.nextUrl.pathname,
      searchParams: Object.fromEntries(req.nextUrl.searchParams),
      headers: this.sanitizeHeaders(req.headers),
      userAgent: req.headers.get('user-agent'),
      ip: this.getClientIP(req),
      timestamp: new Date().toISOString(),
      startTime,
    };

    await this.saveAuditLog(auditData);
  }

  async logResponse(
    req: NextRequest,
    response: NextResponse,
    startTime: number,
    endTime: number
  ): Promise<void> {
    if (!this.config.enableResponseLogging) return;

    const auditData = {
      type: 'response',
      method: req.method,
      url: req.url,
      pathname: req.nextUrl.pathname,
      statusCode: response.status,
      statusText: response.statusText,
      headers: this.sanitizeHeaders(response.headers),
      duration: endTime - startTime,
      timestamp: new Date().toISOString(),
      startTime,
      endTime,
    };

    await this.saveAuditLog(auditData);
  }

  async logError(
    req: NextRequest,
    error: Error,
    startTime: number,
    endTime: number
  ): Promise<void> {
    if (!this.config.enableErrorLogging) return;

    const auditData = {
      type: 'error',
      method: req.method,
      url: req.url,
      pathname: req.nextUrl.pathname,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      duration: endTime - startTime,
      timestamp: new Date().toISOString(),
      startTime,
      endTime,
    };

    await this.saveAuditLog(auditData);
  }

  async logPerformance(
    req: NextRequest,
    metrics: {
      duration: number;
      highResDuration?: number;
      memoryUsage?: NodeJS.MemoryUsage;
      cpuUsage?: NodeJS.CpuUsage;
    }
  ): Promise<void> {
    if (!this.config.enablePerformanceLogging) return;

    const auditData = {
      type: 'performance',
      method: req.method,
      url: req.url,
      pathname: req.nextUrl.pathname,
      metrics: {
        duration: metrics.duration,
        highResDuration: metrics.highResDuration || null,
        memoryUsage: metrics.memoryUsage ? {
          rss: metrics.memoryUsage.rss,
          heapTotal: metrics.memoryUsage.heapTotal,
          heapUsed: metrics.memoryUsage.heapUsed,
          external: metrics.memoryUsage.external,
        } : null,
        cpuUsage: metrics.cpuUsage ? {
          user: metrics.cpuUsage.user,
          system: metrics.cpuUsage.system,
        } : null,
      },
      timestamp: new Date().toISOString(),
    };

    await this.saveAuditLog(auditData);
  }

  private sanitizeHeaders(headers: Headers): Record<string, string> {
    const sanitized: Record<string, string> = {};
    
    headers.forEach((value, key) => {
      const lowerKey = key.toLowerCase();
      if (this.config.sensitiveFields.some(field => lowerKey.includes(field))) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = value;
      }
    });

    return sanitized;
  }

  private getClientIP(req: NextRequest): string {
    const forwarded = req.headers.get('x-forwarded-for');
    const realIP = req.headers.get('x-real-ip');
    const remoteAddr = req.headers.get('x-remote-addr');
    
    if (forwarded) {
      return forwarded.split(',')[0].trim();
    }
    
    if (realIP) {
      return realIP;
    }
    
    if (remoteAddr) {
      return remoteAddr;
    }
    
    return 'unknown';
  }

  private async saveAuditLog(auditData: any): Promise<void> {
    try {
      const supabase = await createClient();
      
      await supabase.from('audit_logs').insert({
        action: auditData.type,
        entityType: 'api_request',
        entityId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: auditData.userId || null,
        metadata: auditData,
        ipAddress: auditData.ip,
        userAgent: auditData.userAgent,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Failed to save audit log:', error);
    }
  }

  shouldLogRequest(req: NextRequest): boolean {
    const pathname = req.nextUrl.pathname;
    return !this.config.excludedPaths.some(excludedPath => 
      pathname.startsWith(excludedPath)
    );
  }

  shouldLogResponse(req: NextRequest, response: NextResponse): boolean {
    if (!this.shouldLogRequest(req)) return false;
    
    const pathname = req.nextUrl.pathname;
    
    // Don't log successful health checks
    if (pathname === '/api/health' && response.status === 200) {
      return false;
    }
    
    return true;
  }

  shouldLogError(req: NextRequest, error: Error): boolean {
    if (!this.shouldLogRequest(req)) return false;
    
    // Don't log expected errors (like validation errors)
    if (error.name === 'ValidationError') {
      return false;
    }
    
    return true;
  }
}

export function createAuditMiddleware(config: Partial<AuditConfig> = {}): AuditMiddleware {
  return new AuditMiddleware(config);
}

export async function auditMiddleware(
  req: NextRequest,
  response: NextResponse,
  startTime: number,
  endTime: number
): Promise<void> {
  const audit = createAuditMiddleware();
  
  // Log request
  if (audit.shouldLogRequest(req)) {
    await audit.logRequest(req, startTime);
  }
  
  // Log response
  if (audit.shouldLogResponse(req, response)) {
    await audit.logResponse(req, response, startTime, endTime);
  }
  
  // Log performance metrics
  if (audit.shouldLogRequest(req)) {
    // Use Web Performance API which is available in Edge Runtime
    const performanceMetrics = {
      duration: endTime - startTime,
      // Use performance.now() for high-resolution timing with fallback
      highResDuration: typeof performance !== 'undefined' ? performance.now() - startTime : endTime - startTime,
      // Edge Runtime doesn't support process.memoryUsage or process.cpuUsage
      // So we'll skip those metrics in middleware
    };
    
    await audit.logPerformance(req, performanceMetrics);
  }
}

export async function auditErrorMiddleware(
  req: NextRequest,
  error: Error,
  startTime: number,
  endTime: number
): Promise<void> {
  const audit = createAuditMiddleware();
  
  if (audit.shouldLogError(req, error)) {
    await audit.logError(req, error, startTime, endTime);
  }
}

// Specific audit configurations for different environments
export const developmentAuditConfig: Partial<AuditConfig> = {
  enableRequestLogging: true,
  enableResponseLogging: true,
  enableErrorLogging: true,
  enablePerformanceLogging: true,
  excludedPaths: ['/api/health', '/_next/', '/favicon.ico'],
};

export const productionAuditConfig: Partial<AuditConfig> = {
  enableRequestLogging: true,
  enableResponseLogging: false, // Disable response logging in production for performance
  enableErrorLogging: true,
  enablePerformanceLogging: false, // Disable performance logging in production
  excludedPaths: ['/api/health', '/_next/', '/favicon.ico', '/api/status'],
};

export const stagingAuditConfig: Partial<AuditConfig> = {
  enableRequestLogging: true,
  enableResponseLogging: true,
  enableErrorLogging: true,
  enablePerformanceLogging: true,
  excludedPaths: ['/api/health', '/_next/', '/favicon.ico'],
};