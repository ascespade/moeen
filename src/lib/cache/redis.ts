import logger from "@/lib/monitoring/logger";

/**
 * Redis Cache Manager - مدير التخزين المؤقت
 * Redis-based caching system for improved performance
 */

interface CacheConfig {
  ttl: number; // Time to live in seconds
  prefix: string;

class RedisCache {
  private client: any;
  private config: CacheConfig;

  constructor() {
    this.config = {
      ttl: 3600, // 1 hour default
      prefix: "healthcare:",
    };

  async get<T>(key: string): Promise<T | null> {
    try {
      // In a real implementation, this would use Redis
      // For now, we'll use a simple in-memory cache
      const cached = this.getFromMemory(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error("Cache get error:", error);
      return null;
    }

  async set<T>(key: string, value: T, ttl?: number): Promise<boolean> {
    try {
      const serialized = JSON.stringify(value);
      const actualTtl = ttl || this.config.ttl;

      // In a real implementation, this would use Redis
      this.setInMemory(key, serialized, actualTtl);
      return true;
    } catch (error) {
      console.error("Cache set error:", error);
      return false;
    }

  async del(key: string): Promise<boolean> {
    try {
      this.deleteFromMemory(key);
      return true;
    } catch (error) {
      console.error("Cache delete error:", error);
      return false;
    }

  async exists(key: string): Promise<boolean> {
    return this.existsInMemory(key);

  async flush(): Promise<boolean> {
    try {
      this.flushMemory();
      return true;
    } catch (error) {
      console.error("Cache flush error:", error);
      return false;
    }

  // Memory-based cache (fallback)
  private memoryCache = new Map<string, { value: string; expires: number }>();

  private getFromMemory(key: string): string | null {
    const item = this.memoryCache.get(key);
    if (!item) return null;

    if (Date.now() > item.expires) {
      this.memoryCache.delete(key);
      return null;

    return item.value;

  private setInMemory(key: string, value: string, ttl: number): void {
    this.memoryCache.set(key, {
      value,
      expires: Date.now() + ttl * 1000,
    });

  private deleteFromMemory(key: string): void {
    this.memoryCache.delete(key);

  private existsInMemory(key: string): boolean {
    const item = this.memoryCache.get(key);
    return item ? Date.now() <= item.expires : false;

  private flushMemory(): void {
    this.memoryCache.clear();
  }

// Cache decorator for functions
export function cached(
  ttl: number = 3600,
  keyGenerator?: (...args: any[]) => string,
) {
  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor,
  ) {
    const method = descriptor.value;
    const cache = new RedisCache();

    descriptor.value = async function (...args: any[]) {
      const cacheKey = keyGenerator
        ? keyGenerator(...args)
        : `${propertyName}:${JSON.stringify(args)}`;

      // Try to get from cache
      const cached = await cache.get(cacheKey);
      if (cached !== null) {
        return cached;

      // Execute method and cache result
      const result = await method.apply(this, args);
      await cache.set(cacheKey, result, ttl);

      return result;
    };
  };

// Cache manager instance
export const cache = new RedisCache();

// Cache keys
export const CACHE_KEYS = {
  USER_PROFILE: (userId: string) => `user:profile:${userId}`,
  PATIENT_DATA: (patientId: string) => `patient:data:${patientId}`,
  DOCTOR_SCHEDULE: (doctorId: string) => `doctor:schedule:${doctorId}`,
  APPOINTMENT_AVAILABILITY: (doctorId: string, date: string) =>
    `appointment:availability:${doctorId}:${date}`,
  DASHBOARD_METRICS: (dateRange: string) => `dashboard:metrics:${dateRange}`,
  NOTIFICATION_TEMPLATES: (type: string, language: string) =>
    `notification:templates:${type}:${language}`,
  MEDICAL_RECORDS: (patientId: string) => `medical:records:${patientId}`,
  INSURANCE_CLAIMS: (patientId: string) => `insurance:claims:${patientId}`,
  REPORTS: (reportId: string) => `reports:${reportId}`,
} as const;
}}}}}}}}}}}}}}}
