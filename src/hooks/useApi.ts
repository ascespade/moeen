import { useState, useEffect, useCallback } from "react";
import { api, ApiError } from "@/utils/api";
import { ApiResponse } from "@/types";
// API hooks
import { useState, useEffect, useCallback } from "react";
import { api, ApiError } from "@/utils/api";
import { ApiResponse } from "@/types";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useApi = <T = any>(
  endpoint: string,
  options?: RequestInit,
  immediate: boolean = true,
): UseApiState<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<T>(endpoint, options);
      const payload = response as unknown as ApiResponse<T>;
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

export const useApiPost = <T = any, D = any>(
  endpoint: string,
  options?: RequestInit,
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (requestData?: D) => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.post<T>(endpoint, requestData, options);
        const payload = response as unknown as ApiResponse<T>;
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

export const useApiPut = <T = any, D = any>(
  endpoint: string,
  options?: RequestInit,
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (requestData?: D) => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.put<T>(endpoint, requestData, options);
        const payload = response as unknown as ApiResponse<T>;
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

export const useApiDelete = <T = any>(
  endpoint: string,
  options?: RequestInit,
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.delete<T>(endpoint, options);
      const payload = response as unknown as ApiResponse<T>;
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
