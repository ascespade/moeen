import { _useEffect, useRef, useCallback } from "react";
// Hook to prevent memory leaks by cleaning up resources
export const __useMemoryLeakPrevention = () => {
  const __cleanupFunctions = useRef<Array<() => void>>([]);

  const __addCleanup = useCallback((_cleanup: () => void) => {
    cleanupFunctions.current.push(cleanup);
  }, []);

  const __cleanup = useCallback(() => {
    cleanupFunctions.current.forEach((fn) => {
      try {
        fn();
      } catch (error) {}
    });
    cleanupFunctions.current = [];
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return { addCleanup, cleanup };
};

// Hook for managing event listeners with automatic cleanup
export const __useEventListener = <T extends keyof WindowEventMap>(
  eventName: T,
  handler: (_event: WindowEventMap[T]) => void,
  element?: Element | Window | Document,
) => {
  const __savedHandler = useRef<(_event: WindowEventMap[T]) => void>();

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const __targetElement = element || window;

    if (!targetElement.addEventListener) return;

    const __eventListener = (_event: Event) => {
      if (savedHandler.current) {
        savedHandler.current(event as WindowEventMap[T]);
      }
    };

    targetElement.addEventListener(eventName, eventListener);

    return () => {
      targetElement.removeEventListener(eventName, eventListener);
    };
  }, [eventName, element]);
};

// Hook for managing intervals with automatic cleanup
export const __useInterval = (_callback: () => void, delay: number | null) => {
  const __savedCallback = useRef<() => void>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    const __id = setInterval(() => {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }, delay);

    return () => clearInterval(id);
  }, [delay]);
};

// Hook for managing timeouts with automatic cleanup
export const __useTimeout = (_callback: () => void, delay: number | null) => {
  const __savedCallback = useRef<() => void>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    const __id = setTimeout(() => {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }, delay);

    return () => clearTimeout(id);
  }, [delay]);
};

// Hook for managing AbortController with automatic cleanup
export const __useAbortController = () => {
  const __abortControllerRef = useRef<AbortController | null>(null);

  const __createAbortController = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    return abortControllerRef.current;
  }, []);

  const __abort = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return { createAbortController, abort };
};

// Hook for managing WebSocket connections with automatic cleanup
export const __useWebSocket = (
  url: string,
  options?: {
    onOpen?: () => void;
    onMessage?: (_event: MessageEvent) => void;
    onClose?: () => void;
    onError?: (_event: Event) => void;
  },
) => {
  const __wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!url) return;

    const __ws = new WebSocket(url);
    wsRef.current = ws;

    if (options?.onOpen) {
      ws.onopen = options.onOpen;
    }

    if (options?.onMessage) {
      ws.onmessage = options.onMessage;
    }

    if (options?.onClose) {
      ws.onclose = options.onClose;
    }

    if (options?.onError) {
      ws.onerror = options.onError;
    }

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [url, options]);

  const __sendMessage = useCallback((_message: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(message);
    }
  }, []);

  const __close = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.close();
    }
  }, []);

  return { sendMessage, close };
};
