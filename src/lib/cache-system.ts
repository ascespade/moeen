// Comprehensive Caching System for Hemam Center
import { NextRequest } from "next/server";

// Cache entry interface
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  hits: number;
}

// Cache configuration
interface CacheConfig {
  maxSize: number;
  defaultTTL: number;
  cleanupInterval: number;
}

// Memory cache implementation
export class MemoryCache {
  private cache = new Map<string, CacheEntry<any>>();
  private config: CacheConfig;
  private cleanupTimer?: NodeJS.Timeout;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      maxSize: config.maxSize || 1000,
      defaultTTL: config.defaultTTL || 5 * 60 * 1000, // 5 minutes
      cleanupInterval: config.cleanupInterval || 60 * 1000, // 1 minute
    };

    this.startCleanup();
  }

  set<T>(key: string, data: T, ttl?: number): void {
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.config.maxSize) {
      const iter = this.cache.keys().next();
      const oldestKey: string | undefined =
        iter && iter.value ? String(iter.value) : undefined;
      if (oldestKey !== undefined) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.config.defaultTTL,
      hits: 0,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    // Increment hit count
    entry.hits++;
    return entry.data;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    return entry ? Date.now() - entry.timestamp <= entry.ttl : false;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  stats(): { size: number; hits: number; missRate: number } {
    let totalHits = 0;
    for (const entry of Array.from(this.cache.values())) {
      totalHits += entry.hits;
    }

    return {
      size: this.cache.size,
      hits: totalHits,
      missRate: 0, // Would need to track misses separately
    };
  }

  private startCleanup(): void {
    this.cleanupTimer = setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of Array.from(this.cache.entries())) {
        if (now - entry.timestamp > entry.ttl) {
          this.cache.delete(key);
        }
      }
    }, this.config.cleanupInterval);
  }

  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
    this.cache.clear();
  }
}

// Cache key generators
export class CacheKeys {
  static user(id: string): string {
    return `user:${id}`;
  }

  static patient(id: string): string {
    return `patient:${id}`;
  }

  static doctor(id: string): string {
    return `doctor:${id}`;
  }

  static appointments(
    patientId?: string,
    doctorId?: string,
    date?: string,
  ): string {
    const params = [patientId, doctorId, date].filter(Boolean).join(":");
    return `appointments:${params}`;
  }

  static sessions(patientId: string): string {
    return `sessions:${patientId}`;
  }

  static conversations(patientId: string): string {
    return `conversations:${patientId}`;
  }

  static analytics(period: string): string {
    return `analytics:${period}`;
  }

  static notifications(userId: string): string {
    return `notifications:${userId}`;
  }

  static insuranceClaims(patientId: string): string {
    return `insurance_claims:${patientId}`;
  }

  static centerSettings(): string {
    return "center_settings";
  }

  static messageTemplates(): string {
    return "message_templates";
  }
}

// Cache manager
export class CacheManager {
  private static instance: CacheManager;
  private cache: MemoryCache;
  private requestCache = new Map<string, Promise<any>>();

  private constructor() {
    this.cache = new MemoryCache({
      maxSize: 2000,
      defaultTTL: 5 * 60 * 1000, // 5 minutes
      cleanupInterval: 60 * 1000, // 1 minute
    });
  }

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  // Generic cache methods
  async get<T>(
    key: string,
    fetcher?: () => Promise<T>,
    ttl?: number,
  ): Promise<T | null> {
    // Check cache first
    const cached = this.cache.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // If no fetcher provided, return null
    if (!fetcher) {
      return null;
    }

    // Check if request is already in progress
    if (this.requestCache.has(key)) {
      return this.requestCache.get(key);
    }

    // Fetch data
    const promise = fetcher()
      .then((data) => {
        this.cache.set(key, data, ttl);
        this.requestCache.delete(key);
        return data;
      })
      .catch((error) => {
        this.requestCache.delete(key);
        throw error;
      });

    this.requestCache.set(key, promise);
    return promise;
  }

  set<T>(key: string, data: T, ttl?: number): void {
    this.cache.set(key, data, ttl);
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  invalidatePattern(pattern: string): void {
    const regex = new RegExp(pattern.replace(/\*/g, ".*"));
    for (const key of Array.from(this.cache["cache"].keys())) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  // Specific cache methods for different data types
  async getUser(id: string, fetcher: () => Promise<any>): Promise<any> {
    return this.get(CacheKeys.user(id), fetcher, 10 * 60 * 1000); // 10 minutes
  }

  async getPatient(id: string, fetcher: () => Promise<any>): Promise<any> {
    return this.get(CacheKeys.patient(id), fetcher, 5 * 60 * 1000); // 5 minutes
  }

  async getDoctor(id: string, fetcher: () => Promise<any>): Promise<any> {
    return this.get(CacheKeys.doctor(id), fetcher, 15 * 60 * 1000); // 15 minutes
  }

  async getAppointments(
    fetcher: () => Promise<any>,
    patientId?: string,
    doctorId?: string,
    date?: string,
  ): Promise<any> {
    return this.get(
      CacheKeys.appointments(patientId, doctorId, date),
      fetcher,
      2 * 60 * 1000,
    ); // 2 minutes
  }

  async getSessions(
    patientId: string,
    fetcher: () => Promise<any>,
  ): Promise<any> {
    return this.get(CacheKeys.sessions(patientId), fetcher, 5 * 60 * 1000); // 5 minutes
  }

  async getConversations(
    patientId: string,
    fetcher: () => Promise<any>,
  ): Promise<any> {
    return this.get(CacheKeys.conversations(patientId), fetcher, 1 * 60 * 1000); // 1 minute
  }

  async getAnalytics(
    period: string,
    fetcher: () => Promise<any>,
  ): Promise<any> {
    return this.get(CacheKeys.analytics(period), fetcher, 5 * 60 * 1000); // 5 minutes
  }

  async getNotifications(
    userId: string,
    fetcher: () => Promise<any>,
  ): Promise<any> {
    return this.get(CacheKeys.notifications(userId), fetcher, 1 * 60 * 1000); // 1 minute
  }

  async getInsuranceClaims(
    patientId: string,
    fetcher: () => Promise<any>,
  ): Promise<any> {
    return this.get(
      CacheKeys.insuranceClaims(patientId),
      fetcher,
      10 * 60 * 1000,
    ); // 10 minutes
  }

  async getCenterSettings(fetcher: () => Promise<any>): Promise<any> {
    return this.get(CacheKeys.centerSettings(), fetcher, 30 * 60 * 1000); // 30 minutes
  }

  async getMessageTemplates(fetcher: () => Promise<any>): Promise<any> {
    return this.get(CacheKeys.messageTemplates(), fetcher, 60 * 60 * 1000); // 1 hour
  }

  // Cache invalidation methods
  invalidateUser(id: string): void {
    this.cache.delete(CacheKeys.user(id));
    this.invalidatePattern(`appointments:*:${id}`);
    this.invalidatePattern(`sessions:*:${id}`);
    this.invalidatePattern(`conversations:*:${id}`);
  }

  invalidatePatient(id: string): void {
    this.cache.delete(CacheKeys.patient(id));
    this.cache.delete(CacheKeys.sessions(id));
    this.cache.delete(CacheKeys.conversations(id));
    this.cache.delete(CacheKeys.insuranceClaims(id));
    this.invalidatePattern(`appointments:${id}:*`);
  }

  invalidateDoctor(id: string): void {
    this.cache.delete(CacheKeys.doctor(id));
    this.invalidatePattern(`appointments:*:${id}`);
    this.invalidatePattern(`sessions:*:${id}`);
  }

  invalidateAppointments(patientId?: string, doctorId?: string): void {
    if (patientId) {
      this.invalidatePattern(`appointments:${patientId}:*`);
    }
    if (doctorId) {
      this.invalidatePattern(`appointments:*:${doctorId}`);
    }
    this.invalidatePattern("appointments:*");
  }

  invalidateSessions(patientId: string): void {
    this.cache.delete(CacheKeys.sessions(patientId));
  }

  invalidateConversations(patientId: string): void {
    this.cache.delete(CacheKeys.conversations(patientId));
  }

  invalidateAnalytics(): void {
    this.invalidatePattern("analytics:*");
  }

  invalidateNotifications(userId: string): void {
    this.cache.delete(CacheKeys.notifications(userId));
  }

  invalidateInsuranceClaims(patientId: string): void {
    this.cache.delete(CacheKeys.insuranceClaims(patientId));
  }

  invalidateCenterSettings(): void {
    this.cache.delete(CacheKeys.centerSettings());
  }

  invalidateMessageTemplates(): void {
    this.cache.delete(CacheKeys.messageTemplates());
  }

  // Cache statistics
  getStats(): any {
    return this.cache.stats();
  }

  // Clear all cache
  clear(): void {
    this.cache.clear();
    this.requestCache.clear();
  }
}

// Cache middleware
export function withCache(
  keyGenerator: (request: NextRequest) => string,
  ttl?: number,
) {
  return function (
    _target: any,
    _propertyName: string,
    descriptor: PropertyDescriptor,
  ) {
    const method = descriptor.value;
    const cache = CacheManager.getInstance();

    descriptor.value = async function (request: NextRequest, ...args: any[]) {
      const key = keyGenerator(request);

      return cache.get(
        key,
        async () => {
          return await method.call(this, request, ...args);
        },
        ttl,
      );
    };
  };
}

// Export singleton instance
export const cache = CacheManager.getInstance();
