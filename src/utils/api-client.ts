// API client utilities
export class ApiClient {
  private baseURL: string;
  private static responseCache: Map<string, { timestamp: number; payload: any }> = new Map();
  private cacheTtlMs: number;

  constructor(baseURL: string = "/api", cacheTtlMs: number = 30000) {
  constructor(baseURL: string = "/api") {
    this.baseURL = baseURL;
    this.cacheTtlMs = cacheTtlMs;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const method = (options.method || "GET").toUpperCase();
    const cacheKey = `${method}:${url}:${JSON.stringify(options.headers || {})}:${options.body ?? ""}`;

    const defaultHeaders = {
      "Content-Type": "application/json",
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      // Serve from cache for idempotent GET requests
      if (method === "GET" && this.cacheTtlMs > 0) {
        const cached = ApiClient.responseCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < this.cacheTtlMs) {
          return cached.payload as T;
        }
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`,
        );
      }

      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`,
        );
      }

      const json = await response.json();

      if (method === "GET" && this.cacheTtlMs > 0) {
        ApiClient.responseCache.set(cacheKey, { timestamp: Date.now(), payload: json });
      }

      return json;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Authentication methods
  async login(email: string, password: string, rememberMe: boolean = false) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password, rememberMe }),
    });
  }

  async logout() {
    return this.request("/auth/logout", {
      method: "POST",
    });
  }

  async refreshToken() {
    return this.request("/auth/refresh", {
      method: "POST",
    });
  }

  async getCurrentUser() {
    return this.request("/auth/me");
  }

  // Generic API methods
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : null,
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : null,
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

// Create a default API client instance
export const apiClient = new ApiClient();
