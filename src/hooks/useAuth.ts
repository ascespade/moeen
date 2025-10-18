import { useState, useEffect, useCallback } from "react";
import { User } from "@/types";
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
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  loginWithCredentials: (
    email: string,
    password: string,
    rememberMe?: boolean,
  ) => Promise<{ success: boolean }>;
}

export const useAuth = (): AuthState & AuthActions => {
  const [user, setUserState] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from storage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = getUser();
        const storedToken = getToken();

        if (storedUser && storedToken) {
          setUserState(storedUser);
          setTokenState(storedToken);
        }
      } catch (error) {
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback((userData: User, tokenData: string) => {
    setUser(userData);
    setToken(tokenData);
    setUserState(userData);
    setTokenState(tokenData);
  }, []);

  const loginWithCredentials = useCallback(
    async (email: string, password: string, rememberMe: boolean = false) => {
      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password, rememberMe }),
        });

        const data = await response.json();

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

  const logout = useCallback(async () => {
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

  const updateUser = useCallback(
    (userData: Partial<User>) => {
      if (user) {
        const updatedUser = { ...user, ...userData };
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
  };
};

export const useRequireAuth = (redirectTo: string = "/login") => {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // In a real app, you would use Next.js router here
      window.location.href = redirectTo;
    }
  }, [isAuthenticated, isLoading, redirectTo]);

  return { isAuthenticated, isLoading };
};

export const useRole = (requiredRole: string | string[]) => {
  const { user } = useAuth();

  const hasRole = useCallback(
    (role: string) => {
      return user?.role === role;
    },
    [user?.role],
  );

  const hasAnyRole = useCallback(
    (roles: string[]) => {
      return user ? roles.includes(user.role) : false;
    },
    [user],
  );

  const canAccess = useCallback(() => {
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
