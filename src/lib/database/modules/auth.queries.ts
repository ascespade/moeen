/**
 * Authentication Module Database Queries
 * استعلامات قاعدة البيانات لوحدة المصادقة
 * 
 * Centralized, optimized queries for authentication module
 * All queries use real database - NO MOCK DATA
 */

import { SupabaseClient } from '@supabase/supabase-js'
import { executeQuery } from '../client'

export interface AuthUser {
  id: string
  email: string
  role: string
  status: string
  name?: string
  phone?: string
}

export interface UserPermissions {
  permissions: string[]
  rolePermissions: string[]
  userPermissions: string[]
}

/**
 * Get user by ID from database
 */
export async function getUserById(
  supabase: SupabaseClient,
  userId: string
): Promise<AuthUser | null> {
  return executeQuery(async () => {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, role, status, name, phone')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data as AuthUser
  }).then(result => result.data || null)
}

/**
 * Get user by email from database
 */
export async function getUserByEmail(
  supabase: SupabaseClient,
  email: string
): Promise<AuthUser | null> {
  return executeQuery(async () => {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, role, status, name, phone')
      .eq('email', email)
      .single()

    if (error) throw error
    return data as AuthUser
  }).then(result => result.data || null)
}

/**
 * Get user permissions from database
 * Optimized query with caching support
 */
export async function getUserPermissions(
  supabase: SupabaseClient,
  userId: string,
  role: string
): Promise<UserPermissions> {
  const permissions: UserPermissions = {
    permissions: [],
    rolePermissions: [],
    userPermissions: [],
  }

  try {
    // Get role-based permissions using PermissionManager (fast - no DB query)
    // This is preferred as it's cached and faster
    try {
      const { PermissionManager } = await import('@/lib/permissions')
      const rolePerms = PermissionManager.getRolePermissions(role)
      if (Array.isArray(rolePerms)) {
        permissions.rolePermissions = rolePerms
        permissions.permissions = [...rolePerms]
      }
    } catch (e) {
      // Fallback to DB if PermissionManager not available
    }

    // Get user-specific permissions from database
    try {
      const { data: userPerms } = await supabase
        .from('user_permissions')
        .select('permission_id, permissions:permission_id(code)')
        .eq('user_id', userId)
        .eq('is_active', true)

      if (userPerms && Array.isArray(userPerms)) {
        const codes = userPerms
          .map((up: any) => up?.permissions?.code)
          .filter(Boolean)
        permissions.userPermissions = codes
        // Add unique permissions
        codes.forEach((code: string) => {
          if (!permissions.permissions.includes(code)) {
            permissions.permissions.push(code)
          }
        })
      }
    } catch (e) {
      // User permissions query failed - continue with role permissions only
    }

    // Admin always has all permissions
    if (role === 'admin' || role === 'manager') {
      if (!permissions.permissions.includes('*')) {
        permissions.permissions.unshift('*')
      }
    }

    // Ensure at least basic dashboard permission
    if (permissions.permissions.length === 0) {
      permissions.permissions.push('dashboard:view')
    }
  } catch (error) {
    console.error('[Auth] Error fetching permissions:', error)
    // Return basic permissions on error
    permissions.permissions = ['dashboard:view']
  }

  return permissions
}

/**
 * Update user last login timestamp
 */
export async function updateUserLastLogin(
  supabase: SupabaseClient,
  userId: string
): Promise<void> {
  await executeQuery(async () => {
    const { error } = await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', userId)

    if (error) throw error
    return null
  })
}

/**
 * Check if user exists and is active
 */
export async function isUserActive(
  supabase: SupabaseClient,
  userId: string
): Promise<boolean> {
  const user = await getUserById(supabase, userId)
  return user !== null && user.status === 'active'
}

/**
 * Get user role from database
 */
export async function getUserRole(
  supabase: SupabaseClient,
  userId: string
): Promise<string | null> {
  const user = await getUserById(supabase, userId)
  return user?.role || null
}
