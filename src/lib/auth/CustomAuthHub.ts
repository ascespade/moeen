/**
 * 🔐 Custom Authentication Hub - Enhanced & Simplified
 * نظام المصادقة المخصص المحسّن والمبسط
 * 
 * ✅ Simplified logic
 * ✅ Better error handling
 * ✅ Optimized permissions fetching
 * ✅ Clean code structure
 */

import { createClient } from '@/lib/supabase/server';
import jwt from 'jsonwebtoken';

export interface CustomAuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  avatar_url?: string;
}

export interface UserPermissions {
  role: string;
  permissions: Array<{
    resource: string;
    actions: string[];
  }>;
  permissionCodes: string[];
}

export interface AuthResult {
  user: CustomAuthUser | null;
  token: string | null;
  error: string | null;
}

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

class CustomAuthHub {
  private static instance: CustomAuthHub;
  private permissionsCache = new Map<string, {
    permissions: UserPermissions;
    timestamp: number;
  }>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  public static getInstance(): CustomAuthHub {
    if (!CustomAuthHub.instance) {
      CustomAuthHub.instance = new CustomAuthHub();
    }
    return CustomAuthHub.instance;
  }

  /**
   * 🔐 LOGIN
   */
  async login(email: string, password: string): Promise<AuthResult> {
    try {
      const supabase = await createClient();

      // Get user from database
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, email, password_hash, name, role, status, avatar_url')
        .eq('email', email)
        .maybeSingle();

      if (userError || !userData) {
        return { user: null, token: null, error: 'Invalid credentials' };
      }

      // Check if user is active
      if (userData.status !== 'active') {
        return { user: null, token: null, error: 'User account is inactive' };
      }

      // Check password
      if (!userData.password_hash) {
        return { user: null, token: null, error: 'Password not set. Please contact administrator.' };
      }

      // Verify password using pgcrypto function
      let isValid = false;
      try {
        const { data: verifyResult, error: verifyError } = await supabase.rpc('verify_password', {
          password_input: password,
          password_hash: userData.password_hash
        });

        if (verifyError) {
          // Fallback for development
          if (process.env.NODE_ENV !== 'production') {
            const testPasswords: Record<string, string> = {
              'admin@test.com': 'Admin123!',
              'doctor@test.com': 'Doctor123!',
              'patient@test.com': 'Patient123!',
              'staff@test.com': 'Staff123!',
            };
            isValid = testPasswords[email] === password;
          }
          if (!isValid) {
            return { user: null, token: null, error: 'Invalid credentials' };
          }
        } else {
          isValid = verifyResult === true;
        }
      } catch (error) {
        return { user: null, token: null, error: 'Password verification failed' };
      }

      if (!isValid) {
        return { user: null, token: null, error: 'Invalid credentials' };
      }

      // Update last_login
      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', userData.id);

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

      // Clear old cache
      this.permissionsCache.delete(user.id);

      return {
        user,
        token,
        error: null,
      };
    } catch (error) {
      console.error('[AUTH-HUB] Login error:', error);
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
      },
      secret,
      { expiresIn }
    );
  }

  /**
   * Verify JWT token
   */
  async verifyToken(token: string): Promise<CustomAuthUser | null> {
    try {
      const secret = getJWTSecret();
      const decoded = jwt.verify(token, secret) as any;

      const supabase = await createClient();
      const { data: userData } = await supabase
        .from('users')
        .select('id, email, name, role, status, avatar_url')
        .eq('id', decoded.userId)
        .maybeSingle();

      if (!userData || userData.status !== 'active') {
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
      return null;
    }
  }

  /**
   * Logout
   */
  async logout(): Promise<void> {
    this.clearAllCache();
    if (typeof window !== 'undefined') {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/login';
    }
  }

  /**
   * 🛡️ Get User Permissions - Optimized
   */
  async getUserPermissions(userId: string): Promise<UserPermissions | null> {
    try {
      // Check cache
      const cached = this.permissionsCache.get(userId);
      if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
        return cached.permissions;
      }

      const supabase = await createClient();

      // Get user role
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .maybeSingle();

      if (!userData) {
        return null;
      }

      // Use database function for optimized permission fetching
      const { data: permData, error: permError } = await supabase
        .rpc('get_user_permissions', { user_id_param: userId });

      let permissionCodes: string[] = [];

      if (!permError && permData) {
        permissionCodes = permData.map((p: any) => p.permission_code);
      } else {
        // Fallback: get from user_roles -> role_permissions -> permissions
        const { data: userRoles } = await supabase
          .from('user_roles')
          .select('role_id')
          .eq('user_id', userId)
          .eq('is_active', true)
          .maybeSingle();

        if (userRoles?.role_id) {
          const { data: rolePerms } = await supabase
            .from('role_permissions')
            .select('permission_id, permissions:permission_id(code)')
            .eq('role_id', userRoles.role_id)
            .eq('is_active', true);

          if (rolePerms) {
            rolePerms.forEach((rp: any) => {
              if (rp?.permissions?.code) {
                permissionCodes.push(rp.permissions.code);
              }
            });
          }
        }

        // Get direct user permissions
        const { data: userPerms } = await supabase
          .from('user_permissions')
          .select('permission_id, permissions:permission_id(code)')
          .eq('user_id', userId)
          .eq('is_active', true);

        if (userPerms) {
          userPerms.forEach((up: any) => {
            if (up?.permissions?.code) {
              permissionCodes.push(up.permissions.code);
            }
          });
        }
      }

      // Convert to permissions structure
      const permissionsMap = new Map<string, string[]>();
      permissionCodes.forEach((code) => {
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
        role: userData.role,
        permissions: Array.from(permissionsMap.entries()).map(([resource, actions]) => ({
          resource,
          actions,
        })),
        permissionCodes,
      };

      // Cache result
      this.permissionsCache.set(userId, {
        permissions,
        timestamp: Date.now(),
      });

      return permissions;
    } catch (error) {
      console.error('[AUTH-HUB] Get permissions error:', error);
      return null;
    }
  }

  /**
   * Check permission
   */
  async checkPermission(
    userId: string,
    resource: string,
    action: string
  ): Promise<boolean> {
    try {
      const permissions = await this.getUserPermissions(userId);
      if (!permissions) return false;

      // Admin has all permissions
      if (permissions.permissionCodes.includes('*') || 
          permissions.permissionCodes.includes('admin.access') ||
          permissions.role === 'admin') {
        return true;
      }

      // Check specific permission
      const perm = permissions.permissions.find(p => p.resource === resource);
      if (!perm) return false;

      return perm.actions.includes(action) || perm.actions.includes('*');
    } catch (error) {
      return false;
    }
  }

  /**
   * Clear cache
   */
  private clearAllCache(): void {
    this.permissionsCache.clear();
  }
}

// Export singleton instance
export const customAuthHub = CustomAuthHub.getInstance();
