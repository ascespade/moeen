/**
 * Advanced Logging System - نظام السجلات المتقدم
 * Comprehensive logging with different levels and monitoring
 */

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  TRACE = 'trace',
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  userId?: string;
  requestId?: string;
  error?: Error;
  metadata?: Record<string, any>;
}

class Logger {
  private logLevel: LogLevel;
  private isDevelopment: boolean;

  constructor() {
    this.logLevel = (process.env.LOG_LEVEL as LogLevel) || LogLevel.INFO;
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.ERROR, LogLevel.WARN, LogLevel.INFO, LogLevel.DEBUG, LogLevel.TRACE];
    const currentLevelIndex = levels.indexOf(this.logLevel);
    const messageLevelIndex = levels.indexOf(level);
    return messageLevelIndex <= currentLevelIndex;
  }

  private formatLog(entry: LogEntry): string {
    const { timestamp, level, message, context, userId, requestId, error, metadata } = entry;
    
    let logString = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    
    if (userId) logString += ` | User: ${userId}`;
    if (requestId) logString += ` | Request: ${requestId}`;
    if (context && Object.keys(context).length > 0) {
      logString += ` | Context: ${JSON.stringify(context)}`;
    }
    if (error) {
      logString += ` | Error: ${error.message}`;
      if (this.isDevelopment) {
        logString += ` | Stack: ${error.stack}`;
      }
    }
    if (metadata && Object.keys(metadata).length > 0) {
      logString += ` | Metadata: ${JSON.stringify(metadata)}`;
    }
    
    return logString;
  }

  private writeLog(entry: LogEntry): void {
    if (!this.shouldLog(entry.level)) return;

    const formattedLog = this.formatLog(entry);
    
    // Console output
    switch (entry.level) {
      case LogLevel.ERROR:
        console.error(formattedLog);
        break;
      case LogLevel.WARN:
        console.warn(formattedLog);
        break;
      case LogLevel.INFO:
        console.info(formattedLog);
        break;
      case LogLevel.DEBUG:
        console.debug(formattedLog);
        break;
      case LogLevel.TRACE:
        console.trace(formattedLog);
        break;
    }

    // In production, this would also write to files or external logging services
    if (process.env.NODE_ENV === 'production') {
      this.writeToFile(entry);
    }
  }

  private writeToFile(entry: LogEntry): void {
    // This would implement file writing logic
    // For now, we'll just log to console
    console.log(`[FILE] ${this.formatLog(entry)}`);
  }

  error(message: string, context?: Record<string, any>, error?: Error, metadata?: Record<string, any>): void {
    this.writeLog({
      timestamp: new Date().toISOString(),
      level: LogLevel.ERROR,
      message,
      context,
      error,
      metadata,
    });
  }

  warn(message: string, context?: Record<string, any>, metadata?: Record<string, any>): void {
    this.writeLog({
      timestamp: new Date().toISOString(),
      level: LogLevel.WARN,
      message,
      context,
      metadata,
    });
  }

  info(message: string, context?: Record<string, any>, metadata?: Record<string, any>): void {
    this.writeLog({
      timestamp: new Date().toISOString(),
      level: LogLevel.INFO,
      message,
      context,
      metadata,
    });
  }

  debug(message: string, context?: Record<string, any>, metadata?: Record<string, any>): void {
    this.writeLog({
      timestamp: new Date().toISOString(),
      level: LogLevel.DEBUG,
      message,
      context,
      metadata,
    });
  }

  trace(message: string, context?: Record<string, any>, metadata?: Record<string, any>): void {
    this.writeLog({
      timestamp: new Date().toISOString(),
      level: LogLevel.TRACE,
      message,
      context,
      metadata,
    });
  }

  // Request logging
  logRequest(method: string, url: string, statusCode: number, responseTime: number, userId?: string, requestId?: string): void {
    this.info(`${method} ${url}`, {
      method,
      url,
      statusCode,
      responseTime: `${responseTime}ms`,
    }, {
      userId,
      requestId,
    });
  }

  // Database query logging
  logQuery(query: string, duration: number, rowsAffected?: number): void {
    this.debug('Database query executed', {
      query: query.substring(0, 100) + (query.length > 100 ? '...' : ''),
      duration: `${duration}ms`,
      rowsAffected,
    });
  }

  // Security event logging
  logSecurityEvent(event: string, details: Record<string, any>, userId?: string, ip?: string): void {
    this.warn(`Security event: ${event}`, details, {
      userId,
      ip,
      securityEvent: true,
    });
  }

  // Performance logging
  logPerformance(operation: string, duration: number, metadata?: Record<string, any>): void {
    this.info(`Performance: ${operation}`, {
      operation,
      duration: `${duration}ms`,
    }, metadata);
  }

  // Business logic logging
  logBusinessEvent(event: string, details: Record<string, any>, userId?: string): void {
    this.info(`Business event: ${event}`, details, {
      userId,
      businessEvent: true,
    });
  }
}

// Export singleton instance
export const logger = new Logger();

// Export convenience functions
export const logError = logger.error.bind(logger);
export const logWarn = logger.warn.bind(logger);
export const logInfo = logger.info.bind(logger);
export const logDebug = logger.debug.bind(logger);
export const logTrace = logger.trace.bind(logger);