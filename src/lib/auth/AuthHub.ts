/**
 * 🏗️ Centralized Authentication Hub
 * Single source of truth for all authentication & authorization
 * نظام موحد للتحقق من الهوية والصلاحيات
 */

import { createBrowserClient, SupabaseClient } from '@supabase/ssr';
import { User, Session, AuthError } from '@supabase/supabase-js';

export interface UserPermissions {
  role: string;
  permissions: Array<{
    resource: string;
    actions: string[];
  }>;
}

export interface AuthResult {
  user: User | null;
  session: Session | null;
  error: AuthError | null;
}

class AuthHub {
  private static instance: AuthHub;
  private supabase: SupabaseClient;
  private permissionsCache = new Map<
    string,
    {
      permissions: UserPermissions;
      timestamp: number;
    }
  >();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  private constructor() {
    this.supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  /**
   * Singleton instance
   */
  public static getInstance(): AuthHub {
    if (!AuthHub.instance) {
      AuthHub.instance = new AuthHub();
    }
    return AuthHub.instance;
  }

  /**
   * 🔐 AUTHENTICATION METHODS
   */
  async login(email: string, password: string): Promise<AuthResult> {
    try {
      // ✅ Use API route instead of direct Supabase auth
      // This allows fallback logic and auto-user creation
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        // Try to get error message from response
        const errorMessage = data.error || data.message || 'Login failed';
        return {
          user: null,
          session: null,
          error: { message: errorMessage } as AuthError,
        };
      }

      if (!data.success) {
        return {
          user: null,
          session: null,
          error: { message: data.error || 'Login failed' } as AuthError,
        };
      }

      // Clear old cache
      this.permissionsCache.clear();

      // Get session from Supabase after successful API login
      const session = await this.getSession();

      // Convert API user response to Supabase User format
      const apiUser = data.data?.user;
      if (!apiUser) {
        return {
          user: null,
          session: null,
          error: { message: 'User data not found' } as AuthError,
        };
      }

      // Create a mock User object compatible with Supabase User
      const user = {
        id: apiUser.id,
        email: apiUser.email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        app_metadata: {},
        user_metadata: {
          name: apiUser.name,
          role: apiUser.role,
        },
        aud: 'authenticated',
        confirmation_sent_at: null,
        confirmed_at: new Date().toISOString(),
        email_confirmed_at: new Date().toISOString(),
        recovery_sent_at: null,
        last_sign_in_at: new Date().toISOString(),
        role: 'authenticated',
      } as any;

      return {
        user,
        session,
        error: null,
      };
    } catch (error) {
      return {
        user: null,
        session: null,
        error: {
          message: error instanceof Error ? error.message : 'Login failed',
        } as AuthError,
      };
    }
  }

  async logout(): Promise<void> {
    try {
      // 1. Sign out from Supabase
      await this.supabase.auth.signOut();

      // 2. Clear all caches
      this.clearAllCache();

      // 3. Clear storage
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
      }

      // 4. Clear cookies
      if (typeof window !== 'undefined') {
        document.cookie.split(';').forEach((c) => {
          document.cookie = c
            .replace(/^ +/, '')
            .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
        });
      }

      // 5. Force reload
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  async getSession(): Promise<Session | null> {
    const { data: { session } } = await this.supabase.auth.getSession();
    return session;
  }

  async refreshSession(): Promise<Session | null> {
    const { data: { session } } = await this.supabase.auth.refreshSession();
    return session;
  }

  async getUser(): Promise<User | null> {
    const { data: { user } } = await this.supabase.auth.getUser();
    return user;
  }

  /**
   * 🛡️ AUTHORIZATION METHODS
   */
  async getUserPermissions(userId: string): Promise<UserPermissions> {
    // Check cache first
    const cached = this.permissionsCache.get(userId);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.permissions;
    }

    // Fetch from database
    const { data, error } = await this.supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();

    if (error || !data) {
      throw new Error(`Failed to fetch user permissions: ${error?.message}`);
    }

    // Map role to permissions (adapting to existing role-based system)
    const rolePermissions = this.getRolePermissions(data.role);

    const permissions: UserPermissions = {
      role: data.role,
      permissions: rolePermissions,
    };

    // Cache it
    this.permissionsCache.set(userId, {
      permissions,
      timestamp: Date.now(),
    });

    return permissions;
  }

  /**
   * Get permissions based on role (adapting to existing schema)
   */
  private getRolePermissions(role: string): Array<{ resource: string; actions: string[] }> {
    const rolePermissionMap: Record<string, Array<{ resource: string; actions: string[] }>> = {
      admin: [
        { resource: '*', actions: ['*'] },
        { resource: 'users', actions: ['create', 'read', 'update', 'delete'] },
        { resource: 'dashboard', actions: ['access'] },
        { resource: 'settings', actions: ['manage'] },
        { resource: 'patients', actions: ['create', 'read', 'update', 'delete'] },
        { resource: 'appointments', actions: ['create', 'read', 'update', 'delete'] },
        { resource: 'medical_records', actions: ['create', 'read', 'update', 'delete'] },
      ],
      doctor: [
        { resource: 'patients', actions: ['read', 'write'] },
        { resource: 'appointments', actions: ['read', 'create'] },
        { resource: 'medical_records', actions: ['read', 'write'] },
        { resource: 'dashboard', actions: ['access'] },
      ],
      patient: [
        { resource: 'profile', actions: ['read', 'update'] },
        { resource: 'appointments', actions: ['read', 'create'] },
        { resource: 'medical_records', actions: ['read'] },
      ],
      staff: [
        { resource: 'appointments', actions: ['read', 'create', 'update'] },
        { resource: 'patients', actions: ['read'] },
        { resource: 'dashboard', actions: ['access'] },
      ],
      supervisor: [
        { resource: 'patients', actions: ['read', 'update'] },
        { resource: 'appointments', actions: ['read', 'create', 'update'] },
        { resource: 'staff', actions: ['read'] },
        { resource: 'dashboard', actions: ['access'] },
      ],
      manager: [
        { resource: '*', actions: ['read'] },
        { resource: 'patients', actions: ['create', 'read', 'update'] },
        { resource: 'appointments', actions: ['create', 'read', 'update'] },
        { resource: 'dashboard', actions: ['access'] },
        { resource: 'reports', actions: ['read'] },
      ],
    };

    return rolePermissionMap[role] || [];
  }

  async checkPermission(
    userId: string,
    resource: string,
    action: string
  ): Promise<boolean> {
    try {
      const permissions = await this.getUserPermissions(userId);

      // Admin has all permissions
      if (permissions.role === 'admin') {
        return true;
      }

      // Check specific permission
      const hasPermission = permissions.permissions.some(
        (p) =>
          (p.resource === resource || p.resource === '*') &&
          (p.actions.includes(action) || p.actions.includes('*'))
      );

      return hasPermission;
    } catch (error) {
      console.error('Permission check error:', error);
      return false;
    }
  }

  async getUserRole(userId: string): Promise<string> {
    const permissions = await this.getUserPermissions(userId);
    return permissions.role;
  }

  /**
   * ✅ VALIDATION METHODS
   */
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validatePassword(password: string): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  validateSession(session: Session | null): boolean {
    if (!session) return false;

    const now = Date.now() / 1000;
    const expiresAt = session.expires_at;

    if (!expiresAt) return false;

    // Check if session is expired or expires soon (within 5 minutes)
    return expiresAt > now + 300;
  }

  /**
   * 👤 USER MANAGEMENT METHODS
   */
  async getUserProfile(userId: string) {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  }

  async updateUserProfile(userId: string, updates: any) {
    const { data, error } = await this.supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * 🔄 STATE MANAGEMENT
   */
  subscribeToAuthChanges(
    callback: (event: string, session: Session | null) => void
  ) {
    const { data: { subscription } } = this.supabase.auth.onAuthStateChange(
      (event, session) => {
        callback(event, session);

        // Clear cache on sign out
        if (event === 'SIGNED_OUT') {
          this.clearAllCache();
        }
      }
    );

    return () => subscription.unsubscribe();
  }

  clearAllCache(): void {
    this.permissionsCache.clear();
  }

  /**
   * 🔧 UTILITY METHODS
   */
  getSupabaseClient(): SupabaseClient {
    return this.supabase;
  }
}

// Export singleton instance
export const authHub = AuthHub.getInstance();
export default AuthHub;