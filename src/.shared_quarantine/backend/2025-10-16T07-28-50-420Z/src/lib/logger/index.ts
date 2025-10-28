/**
 * Advanced Logger - مسجل متقدم
 * Comprehensive logging system with multiple transports and log levels
 */

import { _createClient } from "@/lib/supabase/server";

export enum LogLevel {
  ERROR = "error",
  WARN = "warn",
  INFO = "info",
  DEBUG = "debug",
  TRACE = "trace",
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
  private supabase: unknown;

  constructor(_config: Partial<LoggerConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
    this.supabase = createClient();
  }

  error(_message: string, context?: Record<string, any>, error?: Error): void {
    this.log(LogLevel.ERROR, message, context, error);
  }

  warn(_message: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context);
  }

  info(_message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context);
  }

  debug(_message: string, context?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  trace(_message: string, context?: Record<string, any>): void {
    this.log(LogLevel.TRACE, message, context);
  }

  private log(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    error?: Error,
  ): void {
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
      this.logToRemote(logEntry);
    }
  }

  private shouldLog(_level: LogLevel): boolean {
    const __levels = [
      LogLevel.ERROR,
      LogLevel.WARN,
      LogLevel.INFO,
      LogLevel.DEBUG,
      LogLevel.TRACE,
    ];
    const __currentLevelIndex = levels.indexOf(this.config.level);
    const __messageLevelIndex = levels.indexOf(level);
    return messageLevelIndex <= currentLevelIndex;
  }

  private logToConsole(_logEntry: LogEntry): void {
    const __timestamp = logEntry.timestamp.toISOString();
    const __level = logEntry.level.toUpperCase().padEnd(5);
    const __moduleName = logEntry.module ? `[${logEntry.module}]` : "";
    const __functionName = logEntry.function ? `[${logEntry.function}]` : "";
    const __context = logEntry.context ? JSON.stringify(logEntry.context) : "";
    const __error = logEntry.error ? `\nError: ${logEntry.error.stack}` : "";

    const __logMessage = `${timestamp} ${level} ${moduleName}${functionName} ${logEntry.message} ${context}${error}`;

    switch (logEntry.level) {
      case LogLevel.ERROR:
        // // console.error(logMessage);
        break;
      case LogLevel.WARN:
        // // console.warn(logMessage);
        break;
      case LogLevel.INFO:
        // // console.info(logMessage);
        break;
      case LogLevel.DEBUG:
        // // console.debug(logMessage);
        break;
      case LogLevel.TRACE:
        // // console.trace(logMessage);
        break;
    }
  }

  private logToFile(_logEntry: LogEntry): void {
    // File logging implementation would go here
    // For now, we'll just log to console
    // // console.log("File logging not implemented yet");
  }

  private async logToDatabase(_logEntry: LogEntry): Promise<void> {
    try {
      await this.supabase.from("system_logs").insert({
        level: logEntry.level,
        message: logEntry.message,
        context: logEntry.context,
        error: logEntry.error
          ? {
              name: logEntry.error.name,
              message: logEntry.error.message,
              stack: logEntry.error.stack,
            }
          : null,
        userId: logEntry.userId,
        requestId: logEntry.requestId,
        module: logEntry.module,
        function: logEntry.function,
        duration: logEntry.duration,
        metadata: logEntry.metadata,
        createdAt: logEntry.timestamp.toISOString(),
      });
    } catch (error) {
      // // console.error("Failed to log to database:", error);
    }
  }

  private async logToRemote(_logEntry: LogEntry): Promise<void> {
    if (!this.config.remoteEndpoint || !this.config.remoteApiKey) {
      return;
    }

    try {
      await fetch(this.config.remoteEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.config.remoteApiKey}`,
        },
        body: JSON.stringify(logEntry),
      });
    } catch (error) {
      // // console.error("Failed to log to remote service:", error);
    }
  }

  private getCallerInfo(): { module: string; function: string } {
    const __stack = new Error().stack;
    if (!stack) {
      return { module: "unknown", function: "unknown" };
    }

    const __lines = stack.split("\n");
    const __callerLine = lines[3]; // Skip Error, getCallerInfo, and log methods

    if (!callerLine) {
      return { module: "unknown", function: "unknown" };
    }

    // Extract module and function name from stack trace
    const __match = callerLine.match(/at\s+(.+?)\s+\((.+?):\d+:\d+\)/);
    if (match) {
      const __fullPath = match[2];
      const moduleName =
        fullPath?.split("/").pop()?.replace(".ts", "") || "unknown";
      const __functionName = match[1]?.split(".").pop() || "unknown";
      return { module: moduleName, function: functionName };
    }

    return { module: "unknown", function: "unknown" };
  }

  // Performance logging
  time(_label: string): void {
    // // console.time(label);
  }

  timeEnd(_label: string): void {
    // // console.timeEnd(label);
  }

  // Structured logging for specific use cases
  logApiRequest(_req: unknown, res: unknown, duration: number): void {
    this.info("API Request", {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration,
      userAgent: req.headers["user-agent"],
      ip: req.ip,
    });
  }

  logApiError(_req: unknown, error: Error, duration: number): void {
    this.error(
      "API Error",
      {
        method: req.method,
        url: req.url,
        duration,
        userAgent: req.headers["user-agent"],
        ip: req.ip,
      },
      error,
    );
  }

  logDatabaseQuery(_query: string, duration: number, error?: Error): void {
    if (error) {
      this.error(
        "Database Query Error",
        {
          query,
          duration,
        },
        error,
      );
    } else {
      this.debug("Database Query", {
        query,
        duration,
      });
    }
  }

  logAuthentication(
    userId: string,
    action: string,
    success: boolean,
    error?: Error,
  ): void {
    if (success) {
      this.info("Authentication Success", {
        userId,
        action,
      });
    } else {
      this.warn("Authentication Failed", {
        userId,
        action,
        error: error?.message || "Unknown error",
      });
    }
  }

  logSecurityEvent(_event: string, details: Record<string, any>): void {
    this.warn("Security Event", {
      event,
      ...details,
    });
  }
}

// Create default logger instance
export const __logger = new Logger();

// Create specialized loggers for different modules
export const __apiLogger = new Logger({
  level: LogLevel.INFO,
  enableConsole: true,
  enableDatabase: true,
});

export const __authLogger = new Logger({
  level: LogLevel.WARN,
  enableConsole: true,
  enableDatabase: true,
});

export const __securityLogger = new Logger({
  level: LogLevel.WARN,
  enableConsole: true,
  enableDatabase: true,
});

export const __performanceLogger = new Logger({
  level: LogLevel.DEBUG,
  enableConsole: false,
  enableDatabase: true,
});

// Export log levels for use in other modules
// export { LogLevel };
