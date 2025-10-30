import { useState, useEffect, useCallback } from 'react';
import { User } from '@/types';
import {
  getUser,
  setUser,
  getToken,
  setToken,
  clearAuth,
} from '@/utils/storage';

interface AuthState {
  user: User | null;
  token: string | null;
  permissions: string[];
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  login: (user: User, token: string, permissions?: string[]) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  loginWithCredentials: (
    email: string,
    password: string,
    rememberMe?: boolean
  ) => Promise<{ success: boolean }>;
}

export const useAuth = (): AuthState & AuthActions => {
  const [user, setUserState] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state: prefer server session via /api/auth/me, fallback to local storage
  useEffect(() => {
    const initializeAuth = async () => {
        console.log('[useAuth] initializeAuth start');
      try {
        // If we have a stored user, use it immediately for fast render
        const storedUser = getUser();
        if (storedUser) {
            setUserState(storedUser);
            console.log('[useAuth] found storedUser', storedUser);
          }

        // Attempt to get server session (uses HttpOnly cookie set by login endpoint)
        try {
          console.log('[useAuth] fetching /api/auth/me');
          const res = await fetch('/api/auth/me', { method: 'GET', credentials: 'include' });
          console.log('[useAuth] /api/auth/me status', res.status);
          if (res.ok) {
            const payload = await res.json().catch(() => ({} as any));
            console.log('[useAuth] /api/auth/me payload', payload);
            const foundUser = payload?.data?.user || payload?.user || null;
            const foundPermissions = payload?.data?.permissions || payload?.permissions || [];
            if (payload.success && foundUser) {
              setUserState(foundUser);
              setPermissions(foundPermissions || []);
              // persist user for fast client-side loads
              setUser(foundUser);
              localStorage.setItem('permissions', JSON.stringify(foundPermissions || []));
            } else {
              // clear if session invalid
              console.log('[useAuth] /api/auth/me did not return a valid session, clearing auth');
              clearAuth();
            }
          } else {
            console.log('[useAuth] /api/auth/me response not ok', res.status);
          }
        } catch (e) {
          console.error('[useAuth] initializeAuth /api/auth/me fetch error:', e);
        }
      } catch (error) {
        console.error('[useAuth] initializeAuth error', error);
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(
    (userData: User, tokenData: string | null = null, perms: string[] = []) => {
      // Persist only user and permissions on client side. Token is stored as HttpOnly cookie by server.
      setUser(userData);
      if (tokenData) setTokenState(tokenData); // keep in-memory token if provided
      setPermissions(perms);
      setUserState(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('permissions', JSON.stringify(perms));
    },
    []
  );

  const loginWithCredentials = useCallback(
    async (email: string, password: string, rememberMe: boolean = false) => {
      try {
        console.log('[useAuth] loginWithCredentials request', { email, rememberMe });
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, rememberMe }),
          credentials: 'include',
        });

        const data = await response.json().catch(() => ({}));
        console.log('[useAuth] /api/auth/login response status', response.status, 'data:', data);

        if (!response.ok) {
          console.error('[useAuth] login failed', response.status, data);
          // Dev fallback: if server says invalid credentials and password matches TEST_USERS_PASSWORD, try demo-email /api/auth/me fallback
          try {
            const fallbackPassword = process.env.NEXT_PUBLIC_TEST_PASSWORD || process.env.TEST_USERS_PASSWORD || 'A123456';
            if (data?.error === 'Invalid login credentials' && password === fallbackPassword) {
              console.log('[useAuth] attempting demo-email fallback via /api/auth/me');
              const demoRes = await fetch('/api/auth/me', {
                method: 'GET',
                credentials: 'include',
                headers: { 'x-demo-email': email },
              });
              console.log('[useAuth] demo-email /api/auth/me status', demoRes.status);
              if (demoRes.ok) {
                const demoData = await demoRes.json().catch(() => ({}));
                console.log('[useAuth] demo-email payload', demoData);
                if (demoData.success && (demoData.user || demoData.data?.user)) {
                  const demoUser = demoData.user || demoData.data?.user;
                  const demoPerms = demoData.user?.permissions || demoData.data?.permissions || demoData.data?.permissions || [];
                  login(demoUser, null, demoPerms || []);
                  return { success: true };
                }
              }
            }
          } catch (e) {
            console.error('[useAuth] demo-email fallback error', e);
          }

          throw new Error(data.error || 'Login failed');
        }

        // Prefer to fetch /me to get canonical user object and permissions
        try {
          console.log('[useAuth] fetching /api/auth/me after login');
          const meRes = await fetch('/api/auth/me', { method: 'GET', credentials: 'include' });
          console.log('[useAuth] /api/auth/me after login status', meRes.status);
          if (meRes.ok) {
            const meData = await meRes.json().catch(() => ({} as any));
            console.log('[useAuth] /api/auth/me after login payload', meData);
            const meUser = meData?.data?.user || meData?.user;
            const mePerms = meData?.data?.permissions || meData?.permissions || [];
            if (meData.success && meUser) {
              login(meUser, meData?.data?.token || null, mePerms || []);
              return { success: true };
            }
          } else {
            console.log('[useAuth] /api/auth/me after login not ok', meRes.status);
          }
        } catch (e) {
          console.error('[useAuth] error fetching /api/auth/me after login', e);
          // fallback to using returned data
        }

        if (data.success && data.data?.user) {
          login(data.data.user, data.data.token || null, data.data.permissions || []);
          return { success: true };
        }

        console.error('[useAuth] loginWithCredentials final fallback failed', data);
        throw new Error(data.error || 'Login failed');
      } catch (error) {
        console.error('[useAuth] loginWithCredentials error', error);
        throw error;
      }
    },
    [login]
  );

  const logout = useCallback(async () => {
    try {
      // Call logout API to clear server-side session
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      // Ignore logout API errors
    } finally {
      // Clear local storage regardless of API call result
      clearAuth();
      localStorage.removeItem('permissions');
      setUserState(null);
      setTokenState(null);
      setPermissions([]);
    }
  }, []);

  const updateUser = useCallback(
    (userData: Partial<User>) => {
      if (user) {
        const updatedUser = { ...user, ...userData };
        setUser(updatedUser);
        setUserState(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    },
    [user]
  );

  return {
    user,
    token,
    permissions,
    isAuthenticated: !!user,
    isLoading,
    login,
    loginWithCredentials,
    logout,
    updateUser,
  };
};

export const useRequireAuth = (redirectTo: string = '/login') => {
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
    [user?.role]
  );

  const hasAnyRole = useCallback(
    (roles: string[]) => {
      return user ? roles.includes(user.role) : false;
    },
    [user]
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

export const usePermission = (requiredPermissions: string | string[]) => {
  const { permissions, user } = useAuth();

  const hasPermission = useCallback(
    (permission: string) => {
      return permissions.includes(permission) || permissions.includes('*');
    },
    [permissions]
  );

  const hasAnyPermission = useCallback(
    (perms: string[]) => {
      return perms.some(permission => hasPermission(permission));
    },
    [hasPermission]
  );

  const hasAllPermissions = useCallback(
    (perms: string[]) => {
      return perms.every(permission => hasPermission(permission));
    },
    [hasPermission]
  );

  const canAccess = useCallback(() => {
    if (!user || !permissions.length) return false;

    if (Array.isArray(requiredPermissions)) {
      return hasAnyPermission(requiredPermissions);
    }

    return hasPermission(requiredPermissions);
  }, [user, requiredPermissions, permissions, hasPermission, hasAnyPermission]);

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccess: canAccess(),
    userPermissions: permissions,
  };
};
