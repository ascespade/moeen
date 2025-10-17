/**
 * Advanced Logger - مسجل متقدم
 * Comprehensive logging system with multiple transports and log levels
 */

import { createClient } from '@/lib/supabase/server';

enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  TRACE = 'trace',
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: Record<string, any>;
  error?: Error;
  userId?: string;
  requestId?: string;
  module?: string;
  function?: string;
  duration?: number;
  metadata?: Record<string, any>;
}

export interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableFile: boolean;
  enableDatabase: boolean;
  enableRemote: boolean;
  maxFileSize: number;
  maxFiles: number;
  remoteEndpoint?: string;
  remoteApiKey?: string;
}

const defaultConfig: LoggerConfig = {
  level: LogLevel.INFO,
  enableConsole: true,
  enableFile: false,
  enableDatabase: true,
  enableRemote: false,
  maxFileSize: 10 * 1024 * 1024, // 10MB
  maxFiles: 5,
};

export class Logger {
  private config: LoggerConfig;
  private supabase: any;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
    this.supabase = createClient();
  }

  error(message: string, context?: Record<string, any>, error?: Error): void {
    this.log(LogLevel.ERROR, message, context, error);
  }

  warn(message: string, context?: Record<string, any>, error?: Error): void {
    this.log(LogLevel.WARN, message, context, error);
  }

  info(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context);
  }

  debug(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  trace(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.TRACE, message, context);
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error): void {
    // Check if we should log this level
    if (!this.shouldLog(level)) {
      return;
    }

    const logEntry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      context,
      error,
      module: this.getCallerInfo().module,
      function: this.getCallerInfo().function,
    };

    // Console logging
    if (this.config.enableConsole) {
      this.logToConsole(logEntry);
    }

    // File logging
    if (this.config.enableFile) {
      this.logToFile(logEntry);
    }

    // Database logging
    if (this.config.enableDatabase) {
      this.logToDatabase(logEntry);
    }

    // Remote logging
    if (this.config.enableRemote) {
      this.logToRemote(logEntry).catch(() => {});
    }
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.ERROR, LogLevel.WARN, LogLevel.INFO, LogLevel.DEBUG, LogLevel.TRACE];
    const currentLevelIndex = levels.indexOf(this.config.level);
    const messageLevelIndex = levels.indexOf(level);
    return messageLevelIndex <= currentLevelIndex;
  }

  private logToConsole(logEntry: LogEntry): void {
    const timestamp = logEntry.timestamp.toISOString();
    const level = logEntry.level.toUpperCase().padEnd(5);
    const moduleName = logEntry.module ? `[${logEntry.module}]` : '';
    const functionName = logEntry.function ? `[${logEntry.function}]` : '';
    const context = logEntry.context ? JSON.stringify(logEntry.context) : '';
    const error = logEntry.error ? `\nError: ${logEntry.error.stack}` : '';

    const logMessage = `${timestamp} ${level} ${moduleName}${functionName} ${logEntry.message} ${context}${error}`;

    switch (logEntry.level) {
      case LogLevel.ERROR:
        console.error(logMessage);
        break;
      case LogLevel.WARN:
        console.warn(logMessage);
        break;
      case LogLevel.INFO:
        console.info(logMessage);
        break;
      case LogLevel.DEBUG:
        console.debug(logMessage);
        break;
      case LogLevel.TRACE:
        console.trace(logMessage);
        break;
    }
  }

  private logToFile(logEntry: LogEntry): void {
    // File logging implementation would go here
    // For now, we'll just log to console
    console.log('File logging not implemented yet');
  }

  private async logToDatabase(logEntry: LogEntry): Promise<void> {
    try {
      await this.supabase.from('system_logs').insert({
        level: logEntry.level,
        message: logEntry.message,
        context: logEntry.context,
        error: logEntry.error ? {
          name: logEntry.error.name,
          message: logEntry.error.message,
          stack: logEntry.error.stack,
        } : null,
        userId: logEntry.userId,
        requestId: logEntry.requestId,
        module: logEntry.module,
        function: logEntry.function,
        duration: logEntry.duration,
        metadata: logEntry.metadata,
        createdAt: logEntry.timestamp.toISOString(),
      });
    } catch (error) {
      console.error('Failed to log to database:', error);
    }
  }

  private async logToRemote(logEntry: LogEntry): Promise<void> {
    if (!this.config.remoteEndpoint || !this.config.remoteApiKey) {
      return;
    }

    try {
      await fetch(this.config.remoteEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.remoteApiKey}`,
        },
        body: JSON.stringify(logEntry),
      });
    } catch (error) {
      console.error('Failed to log to remote service:', error);
    }
  }

  private getCallerInfo(): { module: string; function: string } {
    const stack = new Error().stack;
    if (!stack) {
      return { module: 'unknown', function: 'unknown' };
    }

    const lines = stack.split('\n');
    const callerLine = lines[3]; // Skip Error, getCallerInfo, and log methods

    if (!callerLine) {
      return { module: 'unknown', function: 'unknown' };
    }

    // Extract module and function name from stack trace
    const match = callerLine.match(/at\s+(.+?)\s+\((.+?):\d+:\d+\)/) || callerLine.match(/at\s+([^\s]+)\s+\(([^)]+)\)/);
    if (match) {
      const fullPath = match[2] || '';
      const moduleName = (fullPath.split('/').pop() || '').replace(/\.(ts|js)x?$/, '') || 'unknown';
      const functionName = (match[1] || '').split('.').pop() || 'unknown';
      return { module: moduleName, function: functionName };
    }

    return { module: 'unknown', function: 'unknown' };
  }

  // Performance logging
  time(label: string): void {
    console.time(label);
  }

  timeEnd(label: string): void {
    console.timeEnd(label);
  }

  // Structured logging for specific use cases
  logApiRequest(req: any, res: any, duration: number): void {
    this.info('API Request', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration,
      userAgent: req.headers['user-agent'],
      ip: req.ip,
    });
  }

  logApiError(req: any, error: Error, duration: number): void {
    this.error('API Error', {
      method: req.method,
      url: req.url,
      duration,
      userAgent: req.headers['user-agent'],
      ip: req.ip,
    }, error);
  }

  logDatabaseQuery(query: string, duration: number, error?: Error): void {
    if (error) {
      this.error('Database Query Error', {
        query,
        duration,
      }, error);
    } else {
      this.debug('Database Query', {
        query,
        duration,
      });
    }
  }

  logAuthentication(userId: string, action: string, success: boolean, error?: Error): void {
    if (success) {
      this.info('Authentication Success', {
        userId,
        action,
      });
    } else {
      this.warn('Authentication Failed', {
        userId,
        action,
      }, error);
    }
  }

  logSecurityEvent(event: string, details: Record<string, any>): void {
    this.warn('Security Event', {
      event,
      ...details,
    });
  }
}

// Create default logger instance
export const logger = new Logger();

// Create specialized loggers for different modules
export const apiLogger = new Logger({
  level: LogLevel.INFO,
  enableConsole: true,
  enableDatabase: true,
});

export const authLogger = new Logger({
  level: LogLevel.WARN,
  enableConsole: true,
  enableDatabase: true,
});

export const securityLogger = new Logger({
  level: LogLevel.WARN,
  enableConsole: true,
  enableDatabase: true,
});

export const performanceLogger = new Logger({
  level: LogLevel.DEBUG,
  enableConsole: false,
  enableDatabase: true,
});

// Export log levels for use in other modules
export { LogLevel };