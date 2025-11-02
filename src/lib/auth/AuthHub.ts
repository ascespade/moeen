/**
 * 🏗️ Centralized Authentication Hub
 * Single source of truth for all authentication & authorization
 * 
 * This replaces all scattered auth logic with a unified, maintainable system
 */

import { createBrowserClient, SupabaseClient } from '@supabase/ssr'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { PermissionManager } from '@/lib/permissions'

export interface UserPermissions {
  role: string
  permissions: string[]
}

export interface AuthResult {
  user: User | null
  session: Session | null
  error: AuthError | null
}

class AuthHub {
  private static instance: AuthHub
  private supabase: SupabaseClient
  private permissionsCache = new Map<string, {
    permissions: UserPermissions
    timestamp: number
  }>()
  private readonly CACHE_TTL = 5 * 60 * 1000 // 5 minutes

  private constructor() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    
    this.supabase = createBrowserClient(url, anonKey)
  }

  /**
   * Singleton instance
   */
  public static getInstance(): AuthHub {
    if (!AuthHub.instance) {
      AuthHub.instance = new AuthHub()
    }
    return AuthHub.instance
  }

  /**
   * 🔐 AUTHENTICATION METHODS
   */
  async login(email: string, password: string): Promise<AuthResult> {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { user: null, session: null, error }
      }

      // Clear old cache on new login
      if (data.user) {
        this.permissionsCache.delete(data.user.id)
      }

      return {
        user: data.user,
        session: data.session,
        error: null,
      }
    } catch (error) {
      return {
        user: null,
        session: null,
        error: error as AuthError,
      }
    }
  }

  async logout(): Promise<void> {
    try {
      // 1. Sign out from Supabase
      await this.supabase.auth.signOut()

      // 2. Clear all caches
      this.clearAllCache()

      // 3. Clear storage
      if (typeof window !== 'undefined') {
        localStorage.clear()
        sessionStorage.clear()

        // Clear cookies
        document.cookie.split(";").forEach((c) => {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/")
        })
      }

      // 4. Force reload to clear all state
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  }

  async getSession(): Promise<Session | null> {
    const { data: { session } } = await this.supabase.auth.getSession()
    return session
  }

  async refreshSession(): Promise<Session | null> {
    const { data: { session } } = await this.supabase.auth.refreshSession()
    return session
  }

  async getUser(): Promise<User | null> {
    const { data: { user } } = await this.supabase.auth.getUser()
    return user
  }

  /**
   * 🛡️ AUTHORIZATION METHODS
   */
  async getUserPermissions(userId: string, role?: string): Promise<UserPermissions> {
    // Check cache first
    const cached = this.permissionsCache.get(userId)
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.permissions
    }

    // If role provided, use it directly (faster)
    if (role) {
      const permissions = PermissionManager.getRolePermissions(role)
      const userPermissions: UserPermissions = {
        role,
        permissions,
      }
      
      // Cache it
      this.permissionsCache.set(userId, {
        permissions: userPermissions,
        timestamp: Date.now(),
      })
      
      return userPermissions
    }

    // Otherwise fetch from database
    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single()

      if (error || !data) {
        throw new Error(`Failed to fetch user role: ${error?.message}`)
      }

      const permissions = PermissionManager.getRolePermissions(data.role)
      const userPermissions: UserPermissions = {
        role: data.role,
        permissions,
      }

      // Cache it
      this.permissionsCache.set(userId, {
        permissions: userPermissions,
        timestamp: Date.now(),
      })

      return userPermissions
    } catch (error) {
      console.error('Failed to fetch permissions:', error)
      // Return default permissions
      return {
        role: 'patient',
        permissions: PermissionManager.getRolePermissions('patient'),
      }
    }
  }

  async checkPermission(
    userId: string,
    resource: string,
    action: string,
    role?: string
  ): Promise<boolean> {
    try {
      const permissions = await this.getUserPermissions(userId, role)

      // Admin has all permissions
      if (permissions.role === 'admin') {
        return true
      }

      // Check specific permission
      const hasPermission = PermissionManager.canAccess(
        permissions.permissions,
        resource,
        action
      )

      return hasPermission
    } catch (error) {
      console.error('Permission check error:', error)
      return false
    }
  }

  async getUserRole(userId: string): Promise<string> {
    const permissions = await this.getUserPermissions(userId)
    return permissions.role
  }

  /**
   * ✅ VALIDATION METHODS
   */
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  validatePassword(password: string): {
    valid: boolean
    errors: string[]
  } {
    const errors: string[] = []

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters')
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter')
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter')
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number')
    }
    if (!/[!@#$%^&*]/.test(password)) {
      errors.push('Password must contain at least one special character')
    }

    return {
      valid: errors.length === 0,
      errors,
    }
  }

  validateSession(session: Session | null): boolean {
    if (!session) return false
    const now = Date.now() / 1000
    const expiresAt = session.expires_at
    if (!expiresAt) return false

    // Check if session is expired or expires soon (within 5 minutes)
    return expiresAt > now + 300
  }

  /**
   * 👤 USER MANAGEMENT METHODS
   */
  async getUserProfile(userId: string) {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data
  }

  async updateUserProfile(userId: string, updates: any) {
    const { data, error } = await this.supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    
    // Clear cache when profile updated
    this.permissionsCache.delete(userId)
    
    return data
  }

  /**
   * 🔄 STATE MANAGEMENT
   */
  subscribeToAuthChanges(
    callback: (event: string, session: Session | null) => void
  ) {
    const { data: { subscription } } = this.supabase.auth.onAuthStateChange(
      (event, session) => {
        callback(event, session)

        // Clear cache on sign out
        if (event === 'SIGNED_OUT') {
          this.clearAllCache()
        } else if (event === 'USER_UPDATED' && session?.user) {
          // Clear cache when user updated
          this.permissionsCache.delete(session.user.id)
        }
      }
    )

    return () => subscription.unsubscribe()
  }

  clearAllCache(): void {
    this.permissionsCache.clear()
  }

  clearUserCache(userId: string): void {
    this.permissionsCache.delete(userId)
  }

  /**
   * 🔧 UTILITY METHODS
   */
  getSupabaseClient(): SupabaseClient {
    return this.supabase
  }
}

// Export singleton instance
export const authHub = AuthHub.getInstance()
export default AuthHub
