"use client";

import { _useCallback } from "react";

import { _useT } from "@/components/providers/I18nProvider";
// import { _toast } from '@/components/ui/Toast';
// import { _logger } from '@/lib/logger';

interface ErrorHandlerOptions {
  showToast?: boolean;
  logError?: boolean;
  fallbackMessage?: string;
}

export function __useErrorHandler() {
  const { t } = useT();

  const __handleError = useCallback(
    (_error: unknown, options: ErrorHandlerOptions = {}) => {
      const {
        showToast = true,
        logError = true,
        fallbackMessage = t("error.generic"),
      } = options;

      let errorMessage = fallbackMessage;
      const __errorCode = "UNKNOWN_ERROR";

      // Extract error information
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      } else if (error && typeof error === "object" && "message" in error) {
        errorMessage = (error as any).message;
      }

      // Log error if enabled
      if (logError) {
        // Log to external service in production
        if (process.env.NODE_ENV === "production") {
          fetch("/api/errors", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: errorMessage,
              stack: error instanceof Error ? error.stack : undefined,
              timestamp: new Date().toISOString(),
              userAgent: navigator.userAgent,
              url: window.location.href,
            }),
          }).catch(// // console.error);
        }
      }

      // Show toast if enabled
      if (showToast) {
        // // console.error("Error:", errorMessage);
      }

      return {
        message: errorMessage,
        code: errorCode,
      };
    },
    [t],
  );

  const __handleAsyncError = useCallback(
    async (_asyncFn: () => Promise<any>, options: ErrorHandlerOptions = {}) => {
      try {
        return await asyncFn();
      } catch (error) {
        return handleError(error, options);
      }
    },
    [handleError],
  );

  return {
    handleError,
    handleAsyncError,
  };
}
