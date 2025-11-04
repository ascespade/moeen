/**
 * 🏗️ Centralized Authentication Hub
 * Single source of truth for all authentication & authorization
 *
 * This class provides a centralized, singleton-based authentication system
 * that handles all auth operations with proper caching and error handling.
 */

import { createBrowserClient, SupabaseClient } from '@supabase/ssr';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { getBrowserSupabase } from '@/lib/supabaseClient';
import { createClient } from '@/lib/supabase/server';

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
  private supabase: SupabaseClient | null = null;
  private permissionsCache = new Map<
    string,
    {
      permissions: UserPermissions;
      timestamp: number;
    }
  >();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  private constructor() {
    // Initialize browser client only if in browser
    if (typeof window !== 'undefined') {
      this.supabase = getBrowserSupabase();
    }
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
   * Get browser Supabase client (client-side only)
   */
  private getBrowserClient(): SupabaseClient {
    if (!this.supabase) {
      if (typeof window === 'undefined') {
        throw new Error('AuthHub: Cannot create browser client on server');
      }
      this.supabase = getBrowserSupabase();
    }
    return this.supabase;
  }

  /**
   * 🔐 AUTHENTICATION METHODS
   */

  async login(email: string, password: string): Promise<AuthResult> {
    try {
      const supabase = this.getBrowserClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { user: null, session: null, error };
      }

      // Clear old cache
      if (data.user) {
        this.permissionsCache.delete(data.user.id);
      }

      return {
        user: data.user,
        session: data.session,
        error: null,
      };
    } catch (error) {
      return {
        user: null,
        session: null,
        error: error as AuthError,
      };
    }
  }

  async logout(): Promise<void> {
    try {
      // 1. Sign out from Supabase
      if (this.supabase) {
        await this.supabase.auth.signOut();
      }

      // 2. Clear all caches
      this.clearAllCache();

      // 3. Clear storage
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
      }

      // 4. Force reload to clear all state
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  async getSession(): Promise<Session | null> {
    try {
      const supabase = this.getBrowserClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      return session;
    } catch (error) {
      console.error('Get session error:', error);
      return null;
    }
  }

  async refreshSession(): Promise<Session | null> {
    try {
      const supabase = this.getBrowserClient();
      const {
        data: { session },
      } = await supabase.auth.refreshSession();
      return session;
    } catch (error) {
      console.error('Refresh session error:', error);
      return null;
    }
  }

  async getUser(): Promise<User | null> {
    try {
      const supabase = this.getBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      return user;
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  }

  /**
   * 🛡️ AUTHORIZATION METHODS
   */

  async getUserPermissions(userId: string): Promise<UserPermissions | null> {
    try {
      // Check cache first
      const cached = this.permissionsCache.get(userId);
      if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
        return cached.permissions;
      }

      // Fetch from database using server client
      // We need to get the user's role from the users table
      const supabase = await createClient();

      // Get user with role
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .maybeSingle();

      if (userError || !userData) {
        console.error('Failed to fetch user role:', userError);
        return null;
      }

      // For now, use simple role-based permissions
      // Admin has all permissions
      const permissions: UserPermissions = {
        role: userData.role || 'patient',
        permissions: this.getRolePermissions(userData.role || 'patient'),
      };

      // Cache it
      this.permissionsCache.set(userId, {
        permissions,
        timestamp: Date.now(),
      });

      return permissions;
    } catch (error) {
      console.error('Get user permissions error:', error);
      return null;
    }
  }

  /**
   * Get permissions for a role
   */
  private getRolePermissions(
    role: string
  ): Array<{ resource: string; actions: string[] }> {
    const rolePermissions: Record<
      string,
      Array<{ resource: string; actions: string[] }>
    > = {
      admin: [
        { resource: '*', actions: ['*'] },
        { resource: 'users', actions: ['create', 'read', 'update', 'delete'] },
        { resource: 'dashboard', actions: ['access'] },
        { resource: 'settings', actions: ['manage'] },
      ],
      doctor: [
        { resource: 'patients', actions: ['read', 'write'] },
        { resource: 'appointments', actions: ['read', 'create', 'update'] },
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
        {
          resource: 'appointments',
          actions: ['read', 'create', 'update', 'delete'],
        },
        { resource: 'patients', actions: ['read', 'write'] },
        { resource: 'staff', actions: ['read', 'manage'] },
        { resource: 'dashboard', actions: ['access'] },
      ],
      manager: [
        { resource: '*', actions: ['read'] },
        { resource: 'users', actions: ['read', 'update'] },
        { resource: 'dashboard', actions: ['access'] },
        { resource: 'reports', actions: ['read'] },
      ],
    };

    return rolePermissions[role] || [];
  }

  async checkPermission(
    userId: string,
    resource: string,
    action: string
  ): Promise<boolean> {
    try {
      const permissions = await this.getUserPermissions(userId);
      if (!permissions) return false;

      // Admin has all permissions
      if (permissions.role === 'admin') {
        return true;
      }

      // Check specific permission
      const hasPermission = permissions.permissions.some(
        p =>
          (p.resource === resource || p.resource === '*') &&
          (p.actions.includes(action) || p.actions.includes('*'))
      );

      return hasPermission;
    } catch (error) {
      console.error('Permission check error:', error);
      return false;
    }
  }

  async getUserRole(userId: string): Promise<string | null> {
    try {
      const permissions = await this.getUserPermissions(userId);
      return permissions?.role || null;
    } catch (error) {
      console.error('Get user role error:', error);
      return null;
    }
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
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Get user profile error:', error);
      throw error;
    }
  }

  /**
   * 🔄 STATE MANAGEMENT
   */

  subscribeToAuthChanges(
    callback: (event: string, session: Session | null) => void
  ) {
    if (!this.supabase) {
      console.warn('AuthHub: Cannot subscribe to auth changes without client');
      return () => {};
    }

    const {
      data: { subscription },
    } = this.supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
      // Clear cache on sign out
      if (event === 'SIGNED_OUT') {
        this.clearAllCache();
      }
    });

    return () => subscription.unsubscribe();
  }

  clearAllCache(): void {
    this.permissionsCache.clear();
  }

  /**
   * 🔧 UTILITY METHODS
   */

  getSupabaseClient(): SupabaseClient | null {
    return this.supabase;
  }
}

// Export singleton instance
export const authHub = AuthHub.getInstance();
export default AuthHub;
