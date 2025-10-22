// Logger implementation

interface LogLevel {
  ERROR: 'error';
  WARN: 'warn';
  INFO: 'secondary';
  DEBUG: 'debug';
}

const LOG_LEVELS: LogLevel = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'secondary',
  DEBUG: 'debug',
};

interface LogEntry {
  level: string;
  message: string;
  timestamp: string;
  context?: any;
  userId?: string;
  requestId?: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isProduction = process.env.NODE_ENV === 'production';

  private formatMessage(
    level: string,
    message: string,
    context?: any
  ): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      userId: context?.userId,
      requestId: context?.requestId,
    };
  }

  private shouldLog(level: string): boolean {
    if (this.isDevelopment) return true;
    if (this.isProduction) return level !== 'debug';
    return true;
  }

  private log(level: string, message: string, context?: any) {
    if (!this.shouldLog(level)) return;

    const logEntry = this.formatMessage(level, message, context);

    // Console logging
    const consoleMethod =
      level === 'error'
        ? 'error'
        : level === 'warn'
          ? 'warn'
          : level === 'secondary'
            ? 'secondary'
            : 'log';

    console[consoleMethod](
      `[${logEntry.timestamp}] ${level.toUpperCase()}: ${message}`,
      context || ''
    );

    // Send to external service in production
    if (this.isProduction && level === 'error') {
      this.sendToExternalService(logEntry);
    }
  }

  private async sendToExternalService(logEntry: LogEntry) {
    try {
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logEntry),
      });
    } catch (error) {
      // Fallback to console if external service fails
      logger.error('Failed to send log to external service:', error);
    }
  }

  error(message: string, context?: any) {
    this.log(LOG_LEVELS.ERROR, message, context);
  }

  warn(message: string, context?: any) {
    this.log(LOG_LEVELS.WARN, message, context);
  }

  info(message: string, context?: any) {
    this.log(LOG_LEVELS.INFO, message, context);
  }

  debug(message: string, context?: any) {
    this.log(LOG_LEVELS.DEBUG, message, context);
  }
}

export const logger = new Logger();
