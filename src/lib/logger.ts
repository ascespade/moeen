/**
 * Centralized logging utility
 * Replaces direct console calls with a configurable logger
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private isProduction = process.env.NODE_ENV === 'production';
  private minLevel: LogLevel;

  constructor() {
    // In production, only show warnings and errors
    this.minLevel = this.isProduction ? 'warn' : 'debug';
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    return levels.indexOf(level) >= levels.indexOf(this.minLevel);
  }

  private formatMessage(message: string, context?: LogContext): string {
    if (!context || Object.keys(context).length === 0) {
      return message;
    }
    return `${message} ${JSON.stringify(context)}`;
  }

  debug(message: string, context?: LogContext): void {
    if (this.shouldLog('debug')) {
      console.debug(`[DEBUG] ${this.formatMessage(message, context)}`);
    }
  }

  info(message: string, context?: LogContext): void {
    if (this.shouldLog('info')) {
      console.info(`[INFO] ${this.formatMessage(message, context)}`);
    }
  }

  warn(message: string, context?: LogContext): void {
    if (this.shouldLog('warn')) {
      console.warn(`[WARN] ${this.formatMessage(message, context)}`);
    }
  }

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    if (this.shouldLog('error')) {
      const errorInfo =
        error instanceof Error
          ? { message: error.message, stack: error.stack, ...context }
          : { error, ...context };

      console.error(`[ERROR] ${this.formatMessage(message, errorInfo)}`);
    }

    // In production, send errors to logging service
    if (this.isProduction && error instanceof Error) {
      this.sendToLoggingService(message, error, context);
    }
  }

  private async sendToLoggingService(
    message: string,
    error: Error,
    context?: LogContext
  ): Promise<void> {
    try {
      await fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          error: {
            name: error.name,
            message: error.message,
            stack: error.stack,
          },
          context,
          timestamp: new Date().toISOString(),
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
          url:
            typeof window !== 'undefined' ? window.location.href : 'server-side',
        }),
      });
    } catch (sendError) {
      // Fail silently if logging service is unavailable
      console.error('Failed to send error to logging service', sendError);
    }
  }
}

// Export singleton instance
export const logger = new Logger();

// Export convenience functions
export const log = {
  debug: (message: string, context?: LogContext) => logger.debug(message, context),
  info: (message: string, context?: LogContext) => logger.info(message, context),
  warn: (message: string, context?: LogContext) => logger.warn(message, context),
  error: (message: string, error?: Error | unknown, context?: LogContext) =>
    logger.error(message, error, context),
};
