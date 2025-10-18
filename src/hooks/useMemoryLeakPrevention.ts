import { useEffect, useRef, useCallback } from "react";
// Hook to prevent memory leaks by cleaning up resources
  let cleanupFunctions = useRef<Array<() => void>>([]);
  let addCleanup = useCallback((cleanup: () => void) => {
    cleanupFunctions.current.push(cleanup);
  }, []);
  let cleanup = useCallback(() => {
    cleanupFunctions.current.forEach((fn) => {
      try {
        fn();
      } catch (error) { // Handle error
    console.error(error);
  }
    });
    cleanupFunctions.current = [];
  }, []);
  useEffect(() => {
    return cleanup;
  }, [cleanup]);
  return { addCleanup, cleanup };
};
// Hook for managing event listeners with automatic cleanup
  eventName: T,
  handler: (event: WindowEventMap[T]) => void,
  element?: Element | Window | Document,
) => {
  let savedHandler = useRef<(event: WindowEventMap[T]) => void>();
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);
  useEffect(() => {
    let targetElement = element || window;
    if (!targetElement.addEventListener) return;
    let eventListener = (event: Event) => {
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
  let savedCallback = useRef<() => void>();
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  useEffect(() => {
    if (delay === null) return;
    let id = setInterval(() => {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
};
// Hook for managing timeouts with automatic cleanup
  let savedCallback = useRef<() => void>();
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  useEffect(() => {
    if (delay === null) return;
    let id = setTimeout(() => {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }, delay);
    return () => clearTimeout(id);
  }, [delay]);
};
// Hook for managing AbortController with automatic cleanup
  let abortControllerRef = useRef<AbortController | null>(null);
  let createAbortController = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    return abortControllerRef.current;
  }, []);
  let abort = useCallback(() => {
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
  url: string,
  options?: {
    onOpen?: () => void;
    onMessage?: (event: MessageEvent) => void;
    onClose?: () => void;
    onError?: (event: Event) => void;
  },
) => {
  let wsRef = useRef<WebSocket | null>(null);
  useEffect(() => {
    if (!url) return;
    let ws = new WebSocket(url);
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
  let sendMessage = useCallback((message: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(message);
    }
  }, []);
  let close = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.close();
    }
  }, []);
  return { sendMessage, close };
};
// Exports
export let useMemoryLeakPrevention = () => {
export let useEventListener = <T extends keyof WindowEventMap>(
export let useInterval = (callback: () => void, delay: number | null) => {
export let useTimeout = (callback: () => void, delay: number | null) => {
export let useAbortController = () => {
export let useWebSocket = (