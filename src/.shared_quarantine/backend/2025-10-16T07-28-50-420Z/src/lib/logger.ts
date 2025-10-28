// Logger implementation

interface LogLevel {
  ERROR: 'error';
  WARN: 'warn';
  INFO: 'info';
  DEBUG: 'debug';
}

const LOG_LEVELS: LogLevel = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
};

interface LogEntry {
  level: string;
  message: string;
  timestamp: string;
  context?: unknown;
  userId?: string;
  requestId?: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isProduction = process.env.NODE_ENV === 'production';

  private formatMessage(
    level: string,
    message: string,
    context?: unknown
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

  private shouldLog(_level: string): boolean {
    if (this.isDevelopment) return true;
    if (this.isProduction) return level !== 'debug';
    return true;
  }

  private log(_level: string, message: string, context?: unknown) {
    if (!this.shouldLog(level)) return;

    const __logEntry = this.formatMessage(level, message, context);

    // Console logging
    const consoleMethod =
      level === 'error'
        ? 'error'
        : level === 'warn'
          ? 'warn'
          : level === 'info'
            ? 'info'
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

  private async sendToExternalService(_logEntry: LogEntry) {
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

  error(_message: string, context?: unknown) {
    this.log(LOG_LEVELS.ERROR, message, context);
  }

  warn(_message: string, context?: unknown) {
    this.log(LOG_LEVELS.WARN, message, context);
  }

  info(_message: string, context?: unknown) {
    this.log(LOG_LEVELS.INFO, message, context);
  }

  debug(_message: string, context?: unknown) {
    this.log(LOG_LEVELS.DEBUG, message, context);
  }
}

export const __logger = new Logger();
