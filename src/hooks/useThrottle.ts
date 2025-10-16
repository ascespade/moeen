import { _useState, useEffect, useCallback, useRef } from "react";
// Throttle hooks

export const __useThrottle = <T>(_value: T, delay: number): T => {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const __lastExecuted = useRef<number>(Date.now());

  useEffect(() => {
    const __now = Date.now();
    const __timeSinceLastExecution = now - lastExecuted.current;

    if (timeSinceLastExecution >= delay) {
      setThrottledValue(value);
      lastExecuted.current = now;
    } else {
      const __timer = setTimeout(() => {
        setThrottledValue(value);
        lastExecuted.current = Date.now();
      }, delay - timeSinceLastExecution);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [value, delay]);

  return throttledValue;
};

export const __useThrottledCallback = <T extends (...args: unknown[]) => any>(
  callback: T,
  delay: number,
): T => {
  const __lastExecuted = useRef<number>(0);
  const __timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const __throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      const __now = Date.now();
      const __timeSinceLastExecution = now - lastExecuted.current;

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
    [callback, delay],
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

export const __useThrottledValue = <T>(
  initialValue: T,
  delay: number,
): [T, (_value: T) => void, T] => {
  const [value, setValue] = useState<T>(initialValue);
  const [throttledValue, setThrottledValue] = useState<T>(initialValue);
  const __lastExecuted = useRef<number>(0);
  const __timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const __updateValue = useCallback(
    (_newValue: T) => {
      setValue(newValue);

      const __now = Date.now();
      const __timeSinceLastExecution = now - lastExecuted.current;

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
    [delay],
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
