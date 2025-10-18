/**
 * Professional Logging System
 * Replaces console.log with structured logging
 */

type LogLevel = "debug" | "info" | "warn" | "error";

}
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
  error(message: string, error?: any, context?: string): void {
    const errorData =
      error instanceof Error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
          }
        : error;

    this.log("error", message, errorData, context);
  }

  /**
   * Core logging function
   */
  private log(
    level: LogLevel,
    message: string,
    data?: any,
    context?: string,
  ): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      data,
    };

    // Console output with colors
    if (typeof window !== "undefined" || this.isDevelopment) {
      const color = this.getColor(level);
      const prefix = `[${entry.timestamp}] [${level.toUpperCase()}]${context ? ` [${context}]` : ""}`;

      console.log(
        `%c${prefix}`,
        `color: ${color}; font-weight: bold`,
        message,
        data || "",
      );
    }

    // Server-side: could send to external service
    if (this.isServer && level === "error") {
      // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
    }
  }

  /**
   * Get color for console output
   */
  private getColor(level: LogLevel): string {
    switch (level) {
      case "debug":
        return "#6B7280";
      case "info":
        return "#3B82F6";
      case "warn":
        return "#F59E0B";
      case "error":
        return "#EF4444";
      default:
        return "#000000";
    }
  }
}

// Export singleton instance
const logger = new Logger();
export default logger;
