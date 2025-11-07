/**
 * 🔐 Custom Authentication Hub - Optimized & Clean (SERVER-ONLY)
 * نظام المصادقة المخصص - محسّن ونظيف (SERVER-ONLY)
 *
 * ⚠️ This file uses server-only functions (next/headers)
 * ⚠️ DO NOT import this in client components
 * ✅ Use API routes instead for client-side access
 *
 * ✅ No console logs in production
 * ✅ Optimized database queries
 * ✅ Better error handling
 * ✅ Clean business logic
 */

import { createClient } from '@/lib/supabase/server';
import jwt from 'jsonwebtoken';
import type { CustomAuthUser, UserPermissions, AuthResult } from './types';
import { logger } from '@/lib/utils/logger';

// Re-export types for convenience
export type { CustomAuthUser, UserPermissions, AuthResult };

// JWT Configuration
function getJWTSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set.');
  }
  return secret;
}

function getJWTExpiresIn(): string {
  return process.env.JWT_EXPIRES_IN || '7d';
}

// Logger helper (only in development)
const isDev = process.env.NODE_ENV === 'development';
const log = (message: string, ...args: unknown[]) => {
  if (isDev) {
    logger.info(`[AUTH-HUB] ${message}`, args.length > 0 ? { args } : undefined);
  }
};

class CustomAuthHub {
  private static instance: CustomAuthHub;
  private permissionsCache = new Map<
    string,
    {
      permissions: UserPermissions;
      timestamp: number;
    }
  >();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  public static getInstance(): CustomAuthHub {
    if (!CustomAuthHub.instance) {
      CustomAuthHub.instance = new CustomAuthHub();
    }
    return CustomAuthHub.instance;
  }

  /**
   * 🔐 LOGIN - Optimized with Business Logic
   */
  async login(email: string, password: string): Promise<AuthResult> {
    try {
      const supabase = await createClient();

      // Business Logic: Sanitize email
      const sanitizedEmail = email.toLowerCase().trim();

      // Single optimized query: get user with all needed data
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, email, password_hash, name, role, status, avatar_url')
        .eq('email', sanitizedEmail)
        .maybeSingle();

      // Business Logic: Don't reveal if user exists (security)
      if (userError || !userData) {
        return { user: null, token: null, error: 'Invalid credentials' };
      }

      // Business Logic: Check user status FIRST (before password check)
      if (userData.status !== 'active') {
        return {
          user: null,
          token: null,
          error:
            userData.status === 'suspended'
              ? 'Account suspended. Please contact administrator.'
              : 'Account is inactive',
        };
      }

      // Business Logic: Password must be set
      if (!userData.password_hash || userData.password_hash.trim() === '') {
        return {
          user: null,
          token: null,
          error: 'Password not set. Please contact administrator.',
        };
      }

      // Business Logic: Verify password using pgcrypto function
      let isValid = false;
      try {
        const { data: verifyResult, error: verifyError } = await supabase.rpc(
          'verify_password',
          {
            password_input: password,
            password_hash: userData.password_hash,
          }
        );

        if (verifyError) {
          // Fallback only in development for testing
          if (isDev) {
            const testPasswords: Record<string, string> = {
              'admin@test.com': 'Admin123!',
              'doctor@test.com': 'Doctor123!',
              'patient@test.com': 'Patient123!',
              'staff@test.com': 'Staff123!',
            };
            isValid = testPasswords[sanitizedEmail] === password;
            if (isValid) {
              log('Using dev fallback password verification');
            }
          }
          if (!isValid) {
            return { user: null, token: null, error: 'Invalid credentials' };
          }
        } else {
          isValid = verifyResult === true;
        }
      } catch (error) {
        log('Password verification error:', error);
        return { user: null, token: null, error: 'Authentication failed' };
      }

      // Business Logic: Final password validation
      if (!isValid) {
        return { user: null, token: null, error: 'Invalid credentials' };
      }

      // Update last_login (fire and forget - don't block on this)
      supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', userData.id)
        .then(() => log('Updated last_login'))
        .catch(() => {}); // Ignore errors

      // Create user object
      const user: CustomAuthUser = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        status: userData.status,
        avatar_url: userData.avatar_url || undefined,
      };

      // Generate JWT token
      const token = this.generateToken(user);

      // Clear old cache for this user
      this.permissionsCache.delete(user.id);

      return {
        user,
        token,
        error: null,
      };
    } catch (error) {
      log('Login error:', error);
      return {
        user: null,
        token: null,
        error: error instanceof Error ? error.message : 'Login failed',
      };
    }
  }

  /**
   * Generate JWT token
   */
  private generateToken(user: CustomAuthUser): string {
    const secret = getJWTSecret();
    const expiresIn = getJWTExpiresIn();
    return jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        status: user.status || 'active', // Include status for middleware
        verifyStatus: false, // Don't require DB verification in middleware
      },
      secret,
      { expiresIn }
    );
  }

  /**
   * Verify JWT token - Optimized
   */
  async verifyToken(token: string): Promise<CustomAuthUser | null> {
    try {
      const secret = getJWTSecret();
      const decoded = jwt.verify(token, secret) as unknown;

      // Verify user still exists and is active (optimized query with filter)
      const supabase = await createClient();
      const { data: userData } = await supabase
        .from('users')
        .select('id, email, name, role, status, avatar_url')
        .eq('id', decoded.userId)
        .eq('status', 'active') // Filter at DB level for performance
        .maybeSingle();

      if (!userData) {
        return null;
      }

      return {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        status: userData.status,
        avatar_url: userData.avatar_url || undefined,
      };
    } catch (error) {
      // Token invalid or expired - silently fail
      return null;
    }
  }

  /**
   * Logout
   */
  async logout(): Promise<void> {
    this.clearAllCache();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      localStorage.removeItem('permissions');
      sessionStorage.clear();
    }
  }

  /**
   * 🛡️ Get User Permissions - Highly Optimized
   */
  async getUserPermissions(userId: string): Promise<UserPermissions | null> {
    try {
      // Check cache first (fastest path)
      const cached = this.permissionsCache.get(userId);
      if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
        return cached.permissions;
      }

      const supabase = await createClient();

      // Strategy 1: Try database function first (fastest)
      const { data: permData, error: permError } = await supabase.rpc(
        'get_user_permissions',
        { user_id_param: userId }
      );

      let permissionCodes: string[] = [];
      let userRole = 'agent'; // default

      if (
        !permError &&
        permData &&
        Array.isArray(permData) &&
        permData.length > 0
      ) {
        // Function worked - use its result
        permissionCodes = permData.map((p: unknown) => p.permission_code);

        // Get role from user (single optimized query)
        const { data: userData } = await supabase
          .from('users')
          .select('role')
          .eq('id', userId)
          .maybeSingle();

        userRole = userData?.role || 'agent';
      } else {
        // Strategy 2: Fallback - Manual query (slower but reliable)
        // Get user role first
        const { data: userData } = await supabase
          .from('users')
          .select('role')
          .eq('id', userId)
          .maybeSingle();

        if (userData) {
          userRole = userData.role || 'agent';
        }

        // Get permissions from user_roles -> role_permissions -> permissions
        const { data: userRolesData } = await supabase
          .from('user_roles')
          .select(
            `
            role_id,
            roles:role_id (
              name,
              role_permissions (
                permissions:permission_id (
                  code
                )
              )
            )
          `
          )
          .eq('user_id', userId)
          .eq('is_active', true)
          .maybeSingle();

        if (userRolesData?.roles) {
          const role = userRolesData.roles as unknown;

          // Extract permission codes
          if (role.role_permissions) {
            const rolePerms = Array.isArray(role.role_permissions)
              ? role.role_permissions
              : [role.role_permissions];

            rolePerms.forEach((rp: unknown) => {
              if (rp?.permissions?.code) {
                permissionCodes.push(rp.permissions.code);
              }
            });
          }
        }

        // Get direct user permissions (overrides)
        const { data: userPerms } = await supabase
          .from('user_permissions')
          .select('permissions:permission_id(code)')
          .eq('user_id', userId)
          .eq('is_active', true);

        if (userPerms) {
          userPerms.forEach((up: unknown) => {
            if (up?.permissions?.code) {
              permissionCodes.push(up.permissions.code);
            }
          });
        }
      }

      // Remove duplicates
      permissionCodes = [...new Set(permissionCodes)];

      // Convert to permissions structure
      const permissionsMap = new Map<string, string[]>();
      permissionCodes.forEach(code => {
        if (code === '*') {
          permissionsMap.set('*', ['*']);
        } else {
          const [resource, action] = code.split('.');
          if (resource && action) {
            if (!permissionsMap.has(resource)) {
              permissionsMap.set(resource, []);
            }
            permissionsMap.get(resource)!.push(action);
          }
        }
      });

      const permissions: UserPermissions = {
        role: userRole,
        permissions: Array.from(permissionsMap.entries()).map(
          ([resource, actions]) => ({
            resource,
            actions,
          })
        ),
        permissionCodes,
      };

      // Cache result
      this.permissionsCache.set(userId, {
        permissions,
        timestamp: Date.now(),
      });

      return permissions;
    } catch (error) {
      log('Get permissions error:', error);
      return null;
    }
  }

  /**
   * Check permission - Optimized
   */
  async checkPermission(
    userId: string,
    resource: string,
    action: string
  ): Promise<boolean> {
    try {
      const permissions = await this.getUserPermissions(userId);
      if (!permissions) return false;

      // Business Logic: Admin has all permissions
      if (
        permissions.role === 'admin' ||
        permissions.permissionCodes.includes('*') ||
        permissions.permissionCodes.includes('admin.access')
      ) {
        return true;
      }

      // Check specific permission
      const perm = permissions.permissions.find(p => p.resource === resource);
      if (!perm) return false;

      return perm.actions.includes(action) || perm.actions.includes('*');
    } catch (error) {
      log('Permission check error:', error);
      return false;
    }
  }

  /**
   * Clear cache
   */
  private clearAllCache(): void {
    this.permissionsCache.clear();
  }

  /**
   * Invalidate user cache (public method)
   */
  invalidateUserCache(userId: string): void {
    this.permissionsCache.delete(userId);
  }
}

// Export singleton instance
export const customAuthHub = CustomAuthHub.getInstance();
