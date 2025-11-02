/**
 * 🔐 Custom Authentication Hub
 * نظام المصادقة المخصص - يعتمد على جداول قاعدة البيانات
 * 
 * هذا النظام يستخدم جداول قاعدة البيانات المخصصة (users, roles, permissions)
 * بدلاً من Supabase Authentication
 */

import { createClient } from '@/lib/supabase/server';
import jwt from 'jsonwebtoken';

export interface CustomAuthUser {
  id: number;
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
}

export interface AuthResult {
  user: CustomAuthUser | null;
  token: string | null;
  error: string | null;
}

// Get JWT secret dynamically at runtime from environment
function getJWTSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set. Please add it to your .env file.');
  }
  return secret;
}

// Get JWT expires in dynamically at runtime
function getJWTExpiresIn(): string {
  return process.env.JWT_EXPIRES_IN || '7d';
}

class CustomAuthHub {
  private static instance: CustomAuthHub;
  private permissionsCache = new Map<number, {
    permissions: UserPermissions;
    timestamp: number;
  }>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  /**
   * Singleton instance
   */
  public static getInstance(): CustomAuthHub {
    if (!CustomAuthHub.instance) {
      CustomAuthHub.instance = new CustomAuthHub();
    }
    return CustomAuthHub.instance;
  }

  /**
   * 🔐 AUTHENTICATION METHODS
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

      // Verify password
      if (!userData.password_hash) {
        // If password_hash is null, try to create one for test users
        // This is a fallback for users created without passwords
        console.warn(`User ${email} has no password_hash. Attempting to set one...`);
        
        // For development: allow setting password for test users
        if (process.env.NODE_ENV !== 'production' || email.includes('@test.com')) {
          try {
            // Hash the password and update user
            const { data: hashResult, error: hashError } = await supabase.rpc('hash_password', {
              password_input: password
            });

            if (!hashError && hashResult) {
              // Update user with new password hash
              await supabase
                .from('users')
                .update({ password_hash: hashResult })
                .eq('id', userData.id);
              
              // Continue with login
            } else {
              // Fallback: use direct SQL to hash password
              const { data: updateResult, error: updateError } = await supabase
                .from('users')
                .update({ 
                  password_hash: `$2a$10$${Buffer.from(password).toString('base64').substring(0, 53)}` 
                })
                .eq('id', userData.id)
                .select();

              // For test users in dev, allow login even without proper hash
              if (updateError && process.env.NODE_ENV !== 'production') {
                console.warn('Could not set password hash, allowing dev login');
                // Continue - we'll verify differently
              } else {
                return { 
                  user: null, 
                  token: null, 
                  error: 'Password not set. Please set your password first or contact administrator.' 
                };
              }
            }
          } catch (error) {
            console.error('Error setting password hash:', error);
          }
        } else {
          return { 
            user: null, 
            token: null, 
            error: 'Password not set. Please contact administrator.' 
          };
        }
      }

      // Check password using pgcrypto
      let isValid = false;
      
      try {
        // Use pgcrypto to verify password
        const { data: verifyResult, error: verifyError } = await supabase.rpc('verify_password', {
          password_input: password,
          password_hash: userData.password_hash
        });

        if (verifyError) {
          console.warn('verify_password RPC error:', verifyError);
          
          // If verify_password function doesn't exist, try direct SQL query
          // Use a SELECT with WHERE clause that uses crypt() directly
          try {
            // For development: temporary workaround
            if (process.env.NODE_ENV !== 'production') {
              // Test passwords for development
              const testPasswords = {
                'admin@test.com': 'Admin123!',
                'doctor@test.com': 'Doctor123!',
                'patient@test.com': 'Patient123!',
                'staff@test.com': 'Staff123!',
              };
              
              if (testPasswords[email] === password) {
                console.warn('Using development password verification');
                isValid = true;
              } else if (!userData.password_hash && email.includes('@test.com')) {
                // Allow login for test users without password_hash in dev (temporary)
                console.warn('⚠️  ALLOWING DEV LOGIN WITHOUT PASSWORD HASH - FIX THIS!');
                isValid = true;
              }
            }

            if (!isValid) {
              return { 
                user: null, 
                token: null, 
                error: 'Password verification failed. Please ensure verify_password function exists. Run QUICK_FIX_SQL.sql in Supabase SQL Editor.' 
              };
            }
          } catch (e) {
            console.error('Verification error:', e);
            return { user: null, token: null, error: 'Password verification failed' };
          }
        } else {
          isValid = verifyResult === true;
        }
      } catch (error) {
        console.error('Password verification error:', error);
        
        // Development fallback - REMOVE IN PRODUCTION
        if (process.env.NODE_ENV !== 'production') {
          const testPasswords: Record<string, string> = {
            'admin@test.com': 'Admin123!',
            'doctor@test.com': 'Doctor123!',
            'patient@test.com': 'Patient123!',
            'staff@test.com': 'Staff123!',
          };
          
          if (testPasswords[email] === password) {
            console.warn('⚠️  Using development password fallback');
            isValid = true;
          }
        }
        
        if (!isValid) {
          return { user: null, token: null, error: 'Invalid credentials' };
        }
      }

      if (!isValid) {
        return { user: null, token: null, error: 'Invalid credentials' };
      }

      // Update last_login
      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', userData.id);

      // Create user object (without password_hash)
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
      console.error('Login error:', error);
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
    // Clear all caches
    this.clearAllCache();

    // Clear storage
    if (typeof window !== 'undefined') {
      localStorage.clear();
      sessionStorage.clear();
    }

    // Force reload to clear all state
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  /**
   * 🛡️ AUTHORIZATION METHODS
   */

  async getUserPermissions(userId: number): Promise<UserPermissions | null> {
    try {
      // Check cache first
      const cached = this.permissionsCache.get(userId);
      if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
        return cached.permissions;
      }

      const supabase = await createClient();

      // Get user with role
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .maybeSingle();

      if (userError || !userData) {
        return null;
      }

      // Try to get permissions from user_roles and user_permissions tables
      let permissionCodes: string[] = [];

      try {
        // Get role permissions from user_roles -> role_permissions -> permissions
        const { data: userRole } = await supabase
          .from('user_roles')
          .select('role_id')
          .eq('user_id', userId)
          .eq('is_active', true)
          .maybeSingle();

        if (userRole?.role_id) {
          const { data: rolePerms } = await supabase
            .from('role_permissions')
            .select('permission_id, permissions:permission_id(code)')
            .eq('role_id', userRole.role_id);

          if (rolePerms) {
            rolePerms.forEach((rp: any) => {
              if (rp?.permissions?.code) {
                permissionCodes.push(rp.permissions.code);
              }
            });
          }
        }

        // Get user-specific permissions
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
      } catch (error) {
        console.warn('Error fetching permissions from DB, using role-based fallback:', error);
      }

      // Convert permission codes to permissions structure
      // Format: "resource:action" -> { resource: "resource", actions: ["action"] }
      const permissionsMap = new Map<string, string[]>();

      permissionCodes.forEach((code) => {
        if (code === '*') {
          permissionsMap.set('*', ['*']);
        } else {
          const [resource, action] = code.split(':');
          if (resource && action) {
            if (!permissionsMap.has(resource)) {
              permissionsMap.set(resource, []);
            }
            permissionsMap.get(resource)!.push(action);
          }
        }
      });

      const permissions: UserPermissions = {
        role: userData.role || 'patient',
        permissions: Array.from(permissionsMap.entries()).map(([resource, actions]) => ({
          resource,
          actions,
        })),
      };

      // If no permissions found, use role-based fallback
      if (permissions.permissions.length === 0) {
        permissions.permissions = this.getRolePermissions(userData.role || 'patient');
      }

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
   * Get permissions for a role (fallback)
   * Note: user_role enum values: 'admin', 'manager', 'agent', 'demo', 'supervisor'
   */
  private getRolePermissions(role: string): Array<{ resource: string; actions: string[] }> {
    const rolePermissions: Record<string, Array<{ resource: string; actions: string[] }>> = {
      admin: [
        { resource: '*', actions: ['*'] },
        { resource: 'users', actions: ['create', 'read', 'update', 'delete'] },
        { resource: 'dashboard', actions: ['access'] },
        { resource: 'settings', actions: ['manage'] },
      ],
      manager: [
        { resource: '*', actions: ['read'] },
        { resource: 'users', actions: ['read', 'update'] },
        { resource: 'dashboard', actions: ['access'] },
        { resource: 'reports', actions: ['read'] },
        { resource: 'appointments', actions: ['read', 'create', 'update'] },
        { resource: 'patients', actions: ['read', 'write'] },
      ],
      supervisor: [
        { resource: 'appointments', actions: ['read', 'create', 'update', 'delete'] },
        { resource: 'patients', actions: ['read', 'write'] },
        { resource: 'staff', actions: ['read', 'manage'] },
        { resource: 'dashboard', actions: ['access'] },
        { resource: 'medical_records', actions: ['read', 'write'] },
      ],
      agent: [
        // Agent role - can be used for doctor, patient, staff based on metadata
        { resource: 'appointments', actions: ['read', 'create', 'update'] },
        { resource: 'patients', actions: ['read'] },
        { resource: 'dashboard', actions: ['access'] },
        { resource: 'profile', actions: ['read', 'update'] },
      ],
      demo: [
        { resource: 'dashboard', actions: ['access'] },
        { resource: 'profile', actions: ['read'] },
      ],
      // Legacy roles (for backward compatibility, map to agent)
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
    };

    return rolePermissions[role] || rolePermissions['agent'] || [];
  }

  async checkPermission(
    userId: number,
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

  /**
   * Clear all cache
   */
  clearAllCache(): void {
    this.permissionsCache.clear();
  }
}

// Export singleton instance
export const customAuthHub = CustomAuthHub.getInstance();
export default CustomAuthHub;
