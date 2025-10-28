// API client utilities
export class ApiClient {
  private baseURL: string;

  constructor(_baseURL: string = "/api") {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const __url = `${this.baseURL}${endpoint}`;

    const __defaultHeaders = {
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
      const __response = await fetch(url, config);

      if (!response.ok) {
        const __errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`,
        );
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  // Authentication methods
  async login(_email: string, password: string, rememberMe: boolean = false) {
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
  async get<T>(_endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(_endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : null,
    });
  }

  async put<T>(_endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : null,
    });
  }

  async delete<T>(_endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

// Create a default API client instance
export const __apiClient = new ApiClient();
