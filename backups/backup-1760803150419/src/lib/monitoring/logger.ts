/**
 * Professional Logging System
 * Replaces console.log with structured logging
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: string;
  data?: any;
  stack?: string;
}

class Logger {
  private isDevelopment: boolean;
  private isServer: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === "development";
    this.isServer = typeof window === "undefined";
  }

  /**
   * Log debug information (only in development)
   */
  debug(message: string, data?: any, context?: string): void {
    if (this.isDevelopment) {
      this.log("debug", message, data, context);
    }
  }

  /**
   * Log informational messages
   */
  info(message: string, data?: any, context?: string): void {
    this.log("info", message, data, context);
  }

  /**
   * Log warnings
   */
  warn(message: string, data?: any, context?: string): void {
    this.log("warn", message, data, context);
  }

  /**
   * Log errors
   */
  error(message: string, error?: Error | any, context?: string): void {
    const errorData =
      error instanceof Error
        ? {
            message: error.message,
            stack: error.stack,
            name: error.name,
          }
        : error;

    this.log("error", message, errorData, context, error?.stack);
  }

  /**
   * Internal logging method
   */
  private log(
    level: LogLevel,
    message: string,
    data?: any,
    context?: string,
    stack?: string,
  ): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      data: this.sanitizeData(data),
      stack,
    };

    // In development, log to console with colors
    if (this.isDevelopment) {
      this.logToConsole(entry);
    }

    // In production, send to logging service
    if (!this.isDevelopment) {
      this.sendToLoggingService(entry);
    }
  }

  /**
   * Log to console (development only)
   */
  private logToConsole(entry: LogEntry): void {
    const prefix = `[${entry.timestamp}] [${entry.level.toUpperCase()}]`;
    const contextStr = entry.context ? ` [${entry.context}]` : "";
    const fullMessage = `${prefix}${contextStr} ${entry.message}`;

    switch (entry.level) {
      case "debug":
        // eslint-disable-next-line no-console
        console.debug(fullMessage, entry.data);
        break;
      case "info":
        // eslint-disable-next-line no-console
        console.info(fullMessage, entry.data);
        break;
      case "warn":
        // eslint-disable-next-line no-console
        console.warn(fullMessage, entry.data);
        break;
      case "error":
        // eslint-disable-next-line no-console
        console.error(fullMessage, entry.data, entry.stack);
        break;
    }
  }

  /**
   * Send logs to external logging service (production)
   */
  private async sendToLoggingService(entry: LogEntry): Promise<void> {
    // Only send errors and warns to external service
    if (entry.level === "debug" || entry.level === "info") {
      return;
    }

    try {
      // In production, send to your logging service (e.g., Sentry, LogRocket, etc.)
      if (this.isServer) {
        // Server-side logging (e.g., to file or external service)
        // await fetch('/api/logs', { method: 'POST', body: JSON.stringify(entry) });
      } else {
        // Client-side error tracking
        // window.Sentry?.captureException(entry);
      }
    } catch (error) {
      // Fail silently - don't break the app
    }
  }

  /**
   * Sanitize sensitive data before logging
   */
  private sanitizeData(data: any): any {
    if (!data) return data;

    const sensitiveKeys = [
      "password",
      "token",
      "secret",
      "api_key",
      "apiKey",
      "apikey",
      "authorization",
      "auth",
      "credit_card",
      "ssn",
      "social_security",
    ];

    if (typeof data === "object") {
      const sanitized = { ...data };

      for (const key in sanitized) {
        const lowerKey = key.toLowerCase();
        if (sensitiveKeys.some((sensitive) => lowerKey.includes(sensitive))) {
          sanitized[key] = "***REDACTED***";
        } else if (typeof sanitized[key] === "object") {
          sanitized[key] = this.sanitizeData(sanitized[key]);
        }
      }

      return sanitized;
    }

    return data;
  }
}

// Export singleton instance
export const logger = new Logger();

export default logger;
