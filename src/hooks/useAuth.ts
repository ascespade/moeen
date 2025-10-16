import { _useState, useEffect, useCallback } from "react";

import { _User } from "@/types";
import {
  getUser,
  setUser,
  getToken,
  setToken,
  clearAuth,
} from "@/utils/storage";
// Authentication hooks

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  login: (_user: User, token: string) => void;
  logout: () => void;
  updateUser: (_user: Partial<User>) => void;
  loginWithCredentials: (
    email: string,
    password: string,
    rememberMe?: boolean,
  ) => Promise<{ success: boolean }>;
}

export const __useAuth = (): AuthState & AuthActions => {
  const [user, setUserState] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from storage
  useEffect(() => {
    const __initializeAuth = () => {
      try {
        const __storedUser = getUser();
        const __storedToken = getToken();

        if (storedUser && storedToken) {
          setUserState(storedUser);
          setTokenState(storedToken);
        } else {
          // Clear any invalid data
          clearAuth();
          setUserState(null);
          setTokenState(null);
        }
      } catch (error) {
        // // console.error("Auth initialization error:", error);
        clearAuth();
        setUserState(null);
        setTokenState(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const __login = useCallback((_userData: User, tokenData: string) => {
    setUser(userData);
    setToken(tokenData);
    setUserState(userData);
    setTokenState(tokenData);
  }, []);

  const __loginWithCredentials = useCallback(
    async (_email: string, password: string, rememberMe: boolean = false) => {
      try {
        const __response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password, rememberMe }),
        });

        const __data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Login failed");
        }

        if (data.success) {
          login(data.data.user, data.data.token);
          return { success: true };
        } else {
          throw new Error(data.error || "Login failed");
        }
      } catch (error) {
        throw error;
      }
    },
    [login],
  );

  // Helper function to get auth headers for API calls
  const __getAuthHeaders = useCallback(() => {
    if (token) {
      return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
    }
    return {
      "Content-Type": "application/json",
    };
  }, [token]);

  const __logout = useCallback(async () => {
    try {
      // Call logout API to clear server-side session
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } catch (error) {
    } finally {
      // Clear local storage regardless of API call result
      clearAuth();
      setUserState(null);
      setTokenState(null);
    }
  }, []);

  const __updateUser = useCallback(
    (_userData: Partial<User>) => {
      if (user) {
        const __updatedUser = { ...user, ...userData };
        setUser(updatedUser);
        setUserState(updatedUser);
      }
    },
    [user],
  );

  return {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    loginWithCredentials,
    logout,
    updateUser,
    getAuthHeaders,
  };
};

export const __useRequireAuth = (_redirectTo: string = "/login") => {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // In a real app, you would use Next.js router here
      window.location.href = redirectTo;
    }
  }, [isAuthenticated, isLoading, redirectTo]);

  return { isAuthenticated, isLoading };
};

export const __useRole = (_requiredRole: string | string[]) => {
  const { user } = useAuth();

  const __hasRole = useCallback(
    (_role: string) => {
      return user?.role === role;
    },
    [user?.role],
  );

  const __hasAnyRole = useCallback(
    (_roles: string[]) => {
      return user ? roles.includes(user.role) : false;
    },
    [user],
  );

  const __canAccess = useCallback(() => {
    if (!user) return false;

    if (Array.isArray(requiredRole)) {
      return hasAnyRole(requiredRole);
    }

    return hasRole(requiredRole);
  }, [user, requiredRole, hasRole, hasAnyRole]);

  return {
    hasRole,
    hasAnyRole,
    canAccess: canAccess(),
    userRole: user?.role,
  };
};
