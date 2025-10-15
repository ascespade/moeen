type ErrorSeverity = "low" | "medium" | "high" | "critical";

interface ErrorContext {
  userId?: string | undefined;
  sessionId?: string | undefined;
  url?: string | undefined;
  userAgent?: string | undefined;
  timestamp: string;
  severity: ErrorSeverity;
}

interface ErrorReport {
  message: string;
  stack?: string;
  context: ErrorContext;
  componentStack?: string;
}

export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorQueue: ErrorReport[] = [];
  private isProcessing = false;

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  async reportError(
    error: Error,
    context: Partial<ErrorContext> = {},
    componentStack?: string,
  ): Promise<void> {
    const errorReport: ErrorReport = {
      message: error.message,
      stack: error.stack,
      context: {
        userId: context.userId,
        sessionId: context.sessionId,
        url: typeof window !== "undefined" ? window.location.href : context.url,
        userAgent:
          typeof window !== "undefined"
            ? navigator.userAgent
            : context.userAgent,
        timestamp: new Date().toISOString(),
        severity: this.determineSeverity(error),
        ...context,
      },
      componentStack,
    };

    // Add to queue
    this.errorQueue.push(errorReport);

    // Process queue if not already processing
    if (!this.isProcessing) {
      this.processErrorQueue();
    }

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      }
  }

  private determineSeverity(error: Error): ErrorSeverity {
    const message = error.message.toLowerCase();

    if (message.includes("network") || message.includes("fetch")) {
      return "medium";
    }

    if (message.includes("auth") || message.includes("permission")) {
      return "high";
    }

    if (message.includes("critical") || message.includes("fatal")) {
      return "critical";
    }

    return "low";
  }

  private async processErrorQueue(): Promise<void> {
    if (this.isProcessing || this.errorQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    try {
      while (this.errorQueue.length > 0) {
        const errorReport = this.errorQueue.shift();
        if (errorReport) {
          await this.sendErrorReport(errorReport);
        }
      }
    } catch (error) {
      } finally {
      this.isProcessing = false;
    }
  }

  private async sendErrorReport(errorReport: ErrorReport): Promise<void> {
    try {
      // Send to analytics/monitoring service
      if (process.env.NODE_ENV === "production") {
        await fetch("/api/errors", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(errorReport),
        });
      }

      // Log to audit_logs table
      await this.logToAuditLogs(errorReport);
    } catch (error) {
      }
  }

  private async logToAuditLogs(errorReport: ErrorReport): Promise<void> {
    try {
      // This would integrate with your Supabase client
      // const { createClient } = await import('@/lib/supabase/client');
      // const supabase = createClient();
      // await supabase.from('audit_logs').insert({
      //   action: 'error_occurred',
      //   details: errorReport,
      //   user_id: errorReport.context.userId,
      //   session_id: errorReport.context.sessionId,
      //   severity: errorReport.context.severity,
      //   created_at: errorReport.context.timestamp,
      // });
    } catch (error) {
      }
  }

  // Performance monitoring
  async reportPerformanceIssue(
    metric: string,
    value: number,
    threshold: number,
    context: Partial<ErrorContext> = {},
  ): Promise<void> {
    const error = new Error(
      `Performance issue: ${metric} exceeded threshold (${value}ms > ${threshold}ms)`,
    );
    await this.reportError(error, {
      ...context,
      severity: "medium",
    });
  }

  // User analytics (privacy-compliant)
  async trackUserAction(
    action: string,
    context: Partial<ErrorContext> = {},
  ): Promise<void> {
    try {
      if (process.env.NODE_ENV === "production") {
        await fetch("/api/analytics/action", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action,
            context: {
              ...context,
              timestamp: new Date().toISOString(),
            },
          }),
        });
      }
    } catch (error) {
      }
  }
}

export const errorHandler = ErrorHandler.getInstance();

// Global error handler
if (typeof window !== "undefined") {
  window.addEventListener("error", (event) => {
    errorHandler.reportError(event.error, {
      url: window.location.href,
      userAgent: navigator.userAgent,
    });
  });

  window.addEventListener("unhandledrejection", (event) => {
    errorHandler.reportError(
      new Error(`Unhandled Promise Rejection: ${event.reason}`),
      {
        url: window.location.href,
        userAgent: navigator.userAgent,
      },
    );
  });
}

export default errorHandler;
