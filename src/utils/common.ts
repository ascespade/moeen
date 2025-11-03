
/**
 * Common Utility Functions
 * Centralized utilities to avoid duplication
 */

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('ar-SA');
}

export function formatTime(time: string): string {
  return time;
}

export function handleError(error: unknown, message?: string): Error {
  if (error instanceof Error) {
    return error;
  }
  return new Error(message || 'Unknown error occurred');
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

export async function retry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError!;
}
