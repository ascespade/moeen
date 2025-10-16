/**
 * Logger utility
 * Provides structured logging for the application
 */

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
  error?: Error;
}

class Logger {
  private level: LogLevel;
  private context: Record<string, any> = {};

  constructor(_level: LogLevel = LogLevel.INFO) {
    this.level = level;
  }

  setLevel(_level: LogLevel): void {
    this.level = level;
  }

  setContext(_context: Record<string, any>): void {
    this.context = { ...this.context, ...context };
  }

  private shouldLog(_level: LogLevel): boolean {
    return level <= this.level;
  }

  private formatMessage(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    error?: Error,
  ): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      context: { ...this.context, ...context },
      error: error
        ? ({
            name: error.name,
            message: error.message,
            stack: error.stack,
          } as any)
        : undefined,
    };
  }

  private log(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    error?: Error,
  ): void {
    if (!this.shouldLog(level)) return;

    const __entry = this.formatMessage(level, message, context, error);

    const __levelName = LogLevel[level];
    const __timestamp = entry.timestamp;
    const __contextStr = entry.context ? ` ${JSON.stringify(entry.context)}` : "";
    const __errorStr = entry.error ? `\nError: ${entry.error.message}` : "";

    // // console.log(
      `[${timestamp}] ${levelName}: ${message}${contextStr}${errorStr}`,
    );
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
}

// Create default logger instance
export const __logger = new Logger(
  process.env.NODE_ENV === "development" ? LogLevel.DEBUG : LogLevel.INFO,
);

// Create logger with context
export function __createLogger(_context: Record<string, any>): Logger {
  const __loggerInstance = new Logger();
  loggerInstance.setContext(context);
  return loggerInstance;
}
