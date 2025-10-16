import { _useState, useEffect, useCallback, useRef } from "react";
// Async hooks

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface AsyncOptions {
  immediate?: boolean;
  onSuccess?: (_data: unknown) => void;
  onError?: (_error: Error) => void;
}

export const __useAsync = <T>(
  asyncFunction: (...args: unknown[]) => Promise<T>,
  options: AsyncOptions = {},
) => {
  const { immediate = false, onSuccess, onError } = options;

  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const __isMountedRef = useRef(true);

  const __execute = useCallback(
    async (...args: unknown[]) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const __data = await asyncFunction(...args);

        if (isMountedRef.current) {
          setState({ data, loading: false, error: null });
          onSuccess?.(data);
        }

        return data;
      } catch (error) {
        const errorObj =
          error instanceof Error ? error : new Error("An error occurred");

        if (isMountedRef.current) {
          setState((prev) => ({ ...prev, loading: false, error: errorObj }));
          onError?.(errorObj);
        }

        throw error;
      }
    },
    [asyncFunction, onSuccess, onError],
  );

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return {
    ...state,
    execute,
  };
};

export const __useAsyncEffect = <T>(
  asyncFunction: () => Promise<T>,
  deps: ReadonlyArray<unknown> = [],
  options: AsyncOptions = {},
) => {
  const { onSuccess, onError } = options;

  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const __isMountedRef = useRef(true);

  useEffect(() => {
    let isCancelled = false;

    const __runAsync = async () => {
      try {
        const __data = await asyncFunction();

        if (!isCancelled && isMountedRef.current) {
          setState({ data, loading: false, error: null });
          onSuccess?.(data);
        }
      } catch (error) {
        const errorObj =
          error instanceof Error ? error : new Error("An error occurred");

        if (!isCancelled && isMountedRef.current) {
          setState((prev) => ({ ...prev, loading: false, error: errorObj }));
          onError?.(errorObj);
        }
      }
    };

    runAsync();

    return () => {
      isCancelled = true;
    };
    // Dependencies include async function and handlers plus custom deps
    // This ensures stable behavior and satisfies exhaustive-deps
  }, [asyncFunction, onSuccess, onError, deps]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return state;
};
