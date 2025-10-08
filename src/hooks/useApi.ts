// API hooks
import { useState, useEffect, useCallback } from 'react';
import { api, ApiError } from '@/utils/api';

interface UseApiState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export const useApi = <T = any>(
    endpoint: string,
    options?: RequestInit,
    immediate: boolean = true
): UseApiState<T> => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(immediate);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get<T>(endpoint, options);
            setData(response.data || response);
        } catch (err) {
            const errorMessage = err instanceof ApiError ? err.message : 'An error occurred';
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
    options?: RequestInit
) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const execute = useCallback(async (requestData?: D) => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.post<T>(endpoint, requestData, options);
            setData(response.data || response);
            return response;
        } catch (err) {
            const errorMessage = err instanceof ApiError ? err.message : 'An error occurred';
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

export const useApiPut = <T = any, D = any>(
    endpoint: string,
    options?: RequestInit
) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const execute = useCallback(async (requestData?: D) => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.put<T>(endpoint, requestData, options);
            setData(response.data || response);
            return response;
        } catch (err) {
            const errorMessage = err instanceof ApiError ? err.message : 'An error occurred';
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

export const useApiDelete = <T = any>(
    endpoint: string,
    options?: RequestInit
) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const execute = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.delete<T>(endpoint, options);
            setData(response.data || response);
            return response;
        } catch (err) {
            const errorMessage = err instanceof ApiError ? err.message : 'An error occurred';
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
