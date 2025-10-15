/**
 * Performance Optimization - تحسين الأداء
 * Performance monitoring and optimization utilities
 */

import { logger } from '../monitoring/logger';

interface PerformanceMetrics {
  operation: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  memoryUsage?: NodeJS.MemoryUsage;
  metadata?: Record<string, any>;
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetrics> = new Map();
  private thresholds = {
    slowQuery: 1000, // 1 second
    slowRequest: 2000, // 2 seconds
    slowOperation: 5000, // 5 seconds
  };

  startOperation(operationId: string, operation: string, metadata?: Record<string, any>): void {
    const startTime = performance.now();
    const memoryUsage = process.memoryUsage();
    
    this.metrics.set(operationId, {
      operation,
      startTime,
      memoryUsage,
      metadata,
    });
  }

  endOperation(operationId: string): PerformanceMetrics | null {
    const metric = this.metrics.get(operationId);
    if (!metric) return null;

    const endTime = performance.now();
    const duration = endTime - metric.startTime;
    const finalMemoryUsage = process.memoryUsage();

    const completedMetric: PerformanceMetrics = {
      ...metric,
      endTime,
      duration,
      memoryUsage: {
        rss: finalMemoryUsage.rss - (metric.memoryUsage?.rss || 0),
        heapTotal: finalMemoryUsage.heapTotal - (metric.memoryUsage?.heapTotal || 0),
        heapUsed: finalMemoryUsage.heapUsed - (metric.memoryUsage?.heapUsed || 0),
        external: finalMemoryUsage.external - (metric.memoryUsage?.external || 0),
        arrayBuffers: finalMemoryUsage.arrayBuffers - (metric.memoryUsage?.arrayBuffers || 0),
      },
    };

    this.metrics.delete(operationId);
    this.logPerformance(completedMetric);
    
    return completedMetric;
  }

  private logPerformance(metric: PerformanceMetrics): void {
    const { operation, duration, memoryUsage, metadata } = metric;
    
    if (duration && duration > this.thresholds.slowOperation) {
      logger.warn(`Slow operation detected: ${operation}`, {
        duration: `${duration.toFixed(2)}ms`,
        memoryUsage,
        metadata,
      });
    } else {
      logger.debug(`Operation completed: ${operation}`, {
        duration: `${duration?.toFixed(2)}ms`,
        memoryUsage,
        metadata,
      });
    }
  }

  getMetrics(): PerformanceMetrics[] {
    return Array.from(this.metrics.values());
  }

  clearMetrics(): void {
    this.metrics.clear();
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Performance decorator
export function measurePerformance(operationName?: string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    const operation = operationName || `${target.constructor.name}.${propertyName}`;

    descriptor.value = async function (...args: any[]) {
      const operationId = `${operation}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      performanceMonitor.startOperation(operationId, operation, {
        className: target.constructor.name,
        methodName: propertyName,
        args: args.length,
      });

      try {
        const result = await method.apply(this, args);
        performanceMonitor.endOperation(operationId);
        return result;
      } catch (error) {
        performanceMonitor.endOperation(operationId);
        throw error;
      }
    };
  };
}

// Database query optimization
export class QueryOptimizer {
  static optimizeQuery(query: string): string {
    // Remove unnecessary whitespace
    let optimized = query.replace(/\s+/g, ' ').trim();
    
    // Add query hints if needed
    if (optimized.toLowerCase().includes('select') && !optimized.toLowerCase().includes('limit')) {
      // Add default limit for large queries
      optimized += ' LIMIT 1000';
    }
    
    return optimized;
  }

  static addIndexHints(tableName: string, columns: string[]): string {
    return `/*+ USE_INDEX(${tableName}, ${columns.join(',')}) */`;
  }
}

// Memory optimization
export class MemoryOptimizer {
  static cleanup(): void {
    if (global.gc) {
      global.gc();
      logger.debug('Garbage collection triggered');
    }
  }

  static getMemoryUsage(): NodeJS.MemoryUsage {
    return process.memoryUsage();
  }

  static isMemoryPressure(): boolean {
    const usage = this.getMemoryUsage();
    const heapUsedMB = usage.heapUsed / 1024 / 1024;
    const heapTotalMB = usage.heapTotal / 1024 / 1024;
    
    // Consider memory pressure if heap usage is over 80%
    return (heapUsedMB / heapTotalMB) > 0.8;
  }
}

// Caching optimization
export class CacheOptimizer {
  private static cacheHits = 0;
  private static cacheMisses = 0;

  static recordCacheHit(): void {
    this.cacheHits++;
  }

  static recordCacheMiss(): void {
    this.cacheMisses++;
  }

  static getCacheStats(): { hits: number; misses: number; hitRate: number } {
    const total = this.cacheHits + this.cacheMisses;
    return {
      hits: this.cacheHits,
      misses: this.cacheMisses,
      hitRate: total > 0 ? (this.cacheHits / total) * 100 : 0,
    };
  }

  static resetStats(): void {
    this.cacheHits = 0;
    this.cacheMisses = 0;
  }
}

// Bundle optimization
export class BundleOptimizer {
  static getBundleSize(): number {
    // This would integrate with webpack-bundle-analyzer
    // For now, return a placeholder
    return 0;
  }

  static analyzeBundle(): Record<string, any> {
    // This would analyze the bundle and return optimization suggestions
    return {
      totalSize: this.getBundleSize(),
      suggestions: [
        'Consider code splitting for large components',
        'Remove unused dependencies',
        'Optimize images and assets',
      ],
    };
  }
}

// API response optimization
export class ResponseOptimizer {
  static compressResponse(data: any): any {
    // Remove null/undefined values
    const cleaned = JSON.parse(JSON.stringify(data, (key, value) => 
      value === null || value === undefined ? undefined : value
    ));
    
    return cleaned;
  }

  static paginateResponse(data: any[], page: number, limit: number): {
    data: any[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  } {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = data.slice(startIndex, endIndex);
    
    return {
      data: paginatedData,
      pagination: {
        page,
        limit,
        total: data.length,
        pages: Math.ceil(data.length / limit),
      },
    };
  }
}