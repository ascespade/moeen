import { useState, useCallback } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

interface UseApiCacheOptions {
  cacheDuration?: number; // in milliseconds
}

export function useApiCache<T>(options: UseApiCacheOptions = {}) {
  const { cacheDuration = 30000 } = options; // 30 seconds default
  const [cache, setCache] = useState<Map<string, CacheEntry<T>>>(new Map());

  const getCachedData = useCallback((key: string): T | null => {
    const entry = cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > cacheDuration) {
      cache.delete(key);
      return null;
    }

    return entry.data;
  }, [cache, cacheDuration]);

  const setCachedData = useCallback((key: string, data: T) => {
    setCache(prev => new Map(prev.set(key, {
      data,
      timestamp: Date.now()
    })));
  }, []);

  const fetchWithCache = useCallback(async (
    key: string,
    fetchFn: () => Promise<T>
  ): Promise<T> => {
    const cached = getCachedData(key);
    if (cached) return cached;

    const data = await fetchFn();
    setCachedData(key, data);
    return data;
  }, [getCachedData, setCachedData]);

  return { fetchWithCache, getCachedData, setCachedData };
}
