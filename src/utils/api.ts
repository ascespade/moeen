import { ApiResponse } from "@/types";
// API utilities
let API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any,
  ) {
    super(message);
    this.name = "ApiError";
  }
}
  async request<T = any>(
    endpoint: string,
    options: any = {},
  ): Promise<ApiResponse<T>> {
    let url = `${API_BASE_URL}${endpoint}`
    const defaultHeaders: HeadersInit = {
      "Content-Type": "application/json",
    };
    // Add auth token if available
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      defaultHeaders.Authorization = `Bearer ${token}`
    }
    const config: any = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };
    try {
      let response = await fetch(url, config);
      let data = await response.json();
      if (!response.ok) {
        throw new ApiError(
          data.message || "An error occurred",
          response.status,
          data,
        );
      }
      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Network error occurred", 0, { originalError: error });
    }
  },
  get: <T = any>(endpoint: string, options?: any) =>
    api.request<T>(endpoint, { ...options, method: "GET" }),
  post: <T = any>(endpoint: string, data?: any, options?: any) =>
    api.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : null,
    }),
  put: <T = any>(endpoint: string, data?: any, options?: any) =>
    api.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : null,
    }),
  patch: <T = any>(endpoint: string, data?: any, options?: any) =>
    api.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : null,
    }),
  delete: <T = any>(endpoint: string, options?: any) =>
    api.request<T>(endpoint, { ...options, method: "DELETE" }),
};
// Request interceptors
  interceptor: (config: any) => any,
) => {
  // This would be implemented with a more sophisticated interceptor system
  // For now, we'll use a simple approach
  let originalRequest = api.request;
  api.request = async (endpoint, options = {}) => {
    let modifiedOptions = interceptor(options);
    return originalRequest(endpoint, modifiedOptions);
  };
};
// Response interceptors
  onSuccess?: (response: any) => any,
  onError?: (error: ApiError) => any,
) => {
  let originalRequest = api.request;
  api.request = async (endpoint, options) => {
    try {
      let response = await originalRequest(endpoint, options);
      return onSuccess ? onSuccess(response) : response;
    } catch (error) {
      if (error instanceof ApiError && onError) {
        return onError(error);
      }
      throw error;
    }
  };
};
// Utility functions
  let searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach((item) => searchParams.append(key, String(item)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });
  return searchParams.toString();
};
  endpoint: string,
  params?: Record<string, any>,
): string => {
  if (!params || Object.keys(params).length === 0) {
    return endpoint;
  }
  let queryString = buildQueryString(params);
  return `${endpoint}?${queryString}`
};
// Error handling
  if (error instanceof ApiError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred";
};
// Retry logic
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000,
): Promise<T> => {
  let lastError: Error;
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (i === maxRetries) {
        throw lastError;
      }
      // Wait before retrying
      await new Promise((resolve) =>
        setTimeout(resolve, delay * Math.pow(2, i)),
      );
    }
  }
  throw lastError!;
};
// Exports
export class ApiError extends Error {
export let api = {
export let addRequestInterceptor = (
export let addResponseInterceptor = (
export let buildQueryString = (params: Record<string, any>): string => {
export let buildUrl = (
export let handleApiError = (error: unknown): string => {
export let withRetry = async <T>(