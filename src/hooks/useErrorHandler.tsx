'use client';
import logger from '@/lib/monitoring/logger';

import { useCallback } from 'react';
import { useT } from '@/hooks/useT';
// import { toast } from '@/components/ui/Toast';
// import { logger } from '@/lib/logger';

interface ErrorHandlerOptions {
  showToast?: boolean;
  logError?: boolean;
  fallbackMessage?: string;
}

export function useErrorHandler() {
  const { t } = useT();

  const handleError = useCallback(
    (error: unknown, options: ErrorHandlerOptions = {}) => {
      const {
        showToast = true,
        logError = true,
        fallbackMessage = t('error.generic'),
      } = options;

      let errorMessage = fallbackMessage;
      const errorCode = 'UNKNOWN_ERROR';

      // Extract error information
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = String((error as { message?: string }).message || fallbackMessage);
      }

      // Log error if enabled
      if (logError) {
        // Log to external service in production
        if (process.env.NODE_ENV === 'production') {
          fetch('/api/errors', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: errorMessage,
              stack: error instanceof Error ? error.stack : undefined,
              timestamp: new Date().toISOString(),
              userAgent: navigator.userAgent,
              url: window.location.href,
            }),
          }).catch((error) => {
            // Silently fail - error logging service unavailable
            if (process.env.NODE_ENV === 'development') {
              console.error('Failed to log error to service:', error);
            }
          });
        }
      }

      // Show toast if enabled (will be handled by toast system)
      // Error is already logged above

      return {
        message: errorMessage,
        code: errorCode,
      };
    },
    [t]
  );

  const handleAsyncError = useCallback(
    async <T>(asyncFn: () => Promise<T>, options: ErrorHandlerOptions = {}): Promise<T | undefined> => {
      try {
        return await asyncFn();
      } catch (error) {
        return handleError(error, options);
      }
    },
    [handleError]
  );

  return {
    handleError,
    handleAsyncError,
  };
}
