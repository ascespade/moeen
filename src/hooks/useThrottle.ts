import { useState, useEffect, useCallback, useRef } from 'react';

// Throttle hooks

export const useThrottle = <T>(value: T, delay: number): T => {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastExecuted = useRef<number>(Date.now());

  useEffect(() => {
    const now = Date.now();
    const timeSinceLastExecution = now - lastExecuted.current;

    if (timeSinceLastExecution >= delay) {
      setThrottledValue(value);
      lastExecuted.current = now;
    } else {
      const timer = setTimeout(() => {
        setThrottledValue(value);
        lastExecuted.current = Date.now();
      }, delay - timeSinceLastExecution);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [value, delay]);

  return throttledValue;
};

export const useThrottledCallback = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const lastExecuted = useRef<number>(0);
  const timeoutRef = useRef<global.Timeout | null>(null);

  const throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const timeSinceLastExecution = now - lastExecuted.current;

      if (timeSinceLastExecution >= delay) {
        callback(...args);
        lastExecuted.current = now;
      } else {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          callback(...args);
          lastExecuted.current = Date.now();
        }, delay - timeSinceLastExecution);
      }
    },
    [callback, delay]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return throttledCallback as T;
};

export const useThrottledValue = <T>(
  initialValue: T,
  delay: number
): [T, (value: T) => void, T] => {
  const [value, setValue] = useState<T>(initialValue);
  const [throttledValue, setThrottledValue] = useState<T>(initialValue);
  const lastExecuted = useRef<number>(0);
  const timeoutRef = useRef<global.Timeout | null>(null);

  const updateValue = useCallback(
    (newValue: T) => {
      setValue(newValue);

      const now = Date.now();
      const timeSinceLastExecution = now - lastExecuted.current;

      if (timeSinceLastExecution >= delay) {
        setThrottledValue(newValue);
        lastExecuted.current = now;
      } else {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          setThrottledValue(newValue);
          lastExecuted.current = Date.now();
        }, delay - timeSinceLastExecution);
      }
    },
    [delay]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [value, updateValue, throttledValue];
};
