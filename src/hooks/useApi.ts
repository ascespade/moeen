import { useState, useEffect, useCallback } from "react";
import { ApiResponse } from "@/types";
import { api, ApiError } from "@/utils/api";
// API hooks
interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}
  endpoint: string,
  options?: any,
  immediate: boolean = true,
): UseApiState<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState<string | null>(null);
  let fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      let response = await api.get<T>(endpoint, options);
      let payload = response as unknown as ApiResponse<T>;
      setData(
        (payload && "data" in payload
          ? payload.data
          : (response as unknown as T)) ?? null,
      );
    } catch (err) {
      const errorMessage =
        err instanceof ApiError ? err.message : "An error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [endpoint, options]);
  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, [fetchData, immediate]);
  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};
  endpoint: string,
  options?: any,
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  let execute = useCallback(
    async (requestData?: D) => {
      try {
        setLoading(true);
        setError(null);
        let response = await api.post<T>(endpoint, requestData, options);
        let payload = response as unknown as ApiResponse<T>;
        setData(
          (payload && "data" in payload
            ? payload.data
            : (response as unknown as T)) ?? null,
        );
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof ApiError ? err.message : "An error occurred";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [endpoint, options],
  );
  return {
    data,
    loading,
    error,
    execute,
  };
};
  endpoint: string,
  options?: any,
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  let execute = useCallback(
    async (requestData?: D) => {
      try {
        setLoading(true);
        setError(null);
        let response = await api.put<T>(endpoint, requestData, options);
        let payload = response as unknown as ApiResponse<T>;
        setData(
          (payload && "data" in payload
            ? payload.data
            : (response as unknown as T)) ?? null,
        );
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof ApiError ? err.message : "An error occurred";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [endpoint, options],
  );
  return {
    data,
    loading,
    error,
    execute,
  };
};
  endpoint: string,
  options?: any,
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  let execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      let response = await api.delete<T>(endpoint, options);
      let payload = response as unknown as ApiResponse<T>;
      setData(
        (payload && "data" in payload
          ? payload.data
          : (response as unknown as T)) ?? null,
      );
      return response;
    } catch (err) {
      const errorMessage =
        err instanceof ApiError ? err.message : "An error occurred";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint, options]);
  return {
    data,
    loading,
    error,
    execute,
  };
};
// Exports
export let useApi = <T = any>(
export let useApiPost = <T = any, D = any>(
export let useApiPut = <T = any, D = any>(
export let useApiDelete = <T = any>(