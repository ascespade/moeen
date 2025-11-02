# AuthHub Usage Guide

Quick reference for using the new centralized authentication system.

## 🎯 Overview

AuthHub is a centralized authentication and authorization system that replaces scattered auth logic throughout the codebase.

## 📦 Installation

Already integrated! Files are in:
- `src/lib/auth/AuthHub.ts` - Core AuthHub class
- `src/lib/auth/hooks/useAuth.ts` - React hook for authentication
- `src/lib/auth/hooks/usePermissions.ts` - React hook for permissions

## 🔑 Basic Usage

### Using the Auth Hook

```typescript
'use client'

import { useAuth } from '@/lib/auth/hooks/useAuth'

export default function MyComponent() {
  const { user, session, loading, login, logout, isAuthenticated } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return <div>Please login</div>
  }

  return (
    <div>
      <p>Welcome, {user?.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

### Using the Permissions Hook

```typescript
'use client'

import { usePermissions } from '@/lib/auth/hooks/usePermissions'

export default function ProtectedComponent() {
  const { permissions, role, hasPermission, checkPermission, loading } = usePermissions()

  if (loading) {
    return <div>Loading permissions...</div>
  }

  // Check permission synchronously
  if (hasPermission('users:view')) {
    return <div>You can view users</div>
  }

  // Check permission asynchronously (with cache)
  const canEdit = await checkPermission('users', 'edit')
  
  return (
    <div>
      <p>Your role: {role}</p>
      {canEdit && <button>Edit User</button>}
    </div>
  )
}
```

### Using AuthHub Directly

```typescript
import { authHub } from '@/lib/auth/AuthHub'

// Login
const result = await authHub.login('user@example.com', 'password')
if (result.error) {
  console.error('Login failed:', result.error)
} else {
  console.log('Logged in as:', result.user?.email)
}

// Get permissions
const permissions = await authHub.getUserPermissions(userId)
console.log('User role:', permissions.role)
console.log('Permissions:', permissions.permissions)

// Check permission
const canAccess = await authHub.checkPermission(userId, 'patients', 'view')
if (canAccess) {
  // Show patient data
}

// Logout
await authHub.logout() // Automatically redirects to /login
```

## 🛡️ Protected Routes

Use the middleware (already configured) or create a protected route component:

```typescript
'use client'

import { useAuth } from '@/lib/auth/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
```

## 🔄 Migrating from Old Auth System

### Old Code (useUnifiedAuth)
```typescript
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth'

const { user, login, logout } = useUnifiedAuth()
```

### New Code (useAuth)
```typescript
import { useAuth } from '@/lib/auth/hooks/useAuth'

const { user, login, logout } = useAuth()
```

The API is very similar, so migration should be straightforward.

## 📝 API Reference

### useAuth Hook

```typescript
interface UseAuthReturn {
  user: User | null
  session: Session | null
  loading: boolean
  login: (email: string, password: string) => Promise<AuthResult>
  logout: () => Promise<void>
  isAuthenticated: boolean
}
```

### usePermissions Hook

```typescript
interface UsePermissionsReturn {
  permissions: UserPermissions | null
  loading: boolean
  checkPermission: (resource: string, action: string) => Promise<boolean>
  hasRole: (role: string) => boolean
  hasPermission: (permission: string) => boolean
  role: string | undefined
  permissionList: string[]
}
```

### AuthHub Methods

- `login(email, password)` - Authenticate user
- `logout()` - Sign out and clear all state
- `getSession()` - Get current session
- `refreshSession()` - Refresh expired session
- `getUser()` - Get current user
- `getUserPermissions(userId, role?)` - Get user permissions (cached)
- `checkPermission(userId, resource, action, role?)` - Check specific permission
- `getUserRole(userId)` - Get user role
- `validateEmail(email)` - Validate email format
- `validatePassword(password)` - Validate password strength
- `validateSession(session)` - Check if session is valid
- `getUserProfile(userId)` - Get user profile data
- `updateUserProfile(userId, updates)` - Update user profile
- `subscribeToAuthChanges(callback)` - Subscribe to auth state changes
- `clearAllCache()` - Clear permission cache
- `getSupabaseClient()` - Get Supabase client instance

## 🔧 Configuration

### Cache TTL

Default permission cache TTL is 5 minutes. To change:

```typescript
// In AuthHub.ts
private readonly CACHE_TTL = 10 * 60 * 1000 // 10 minutes
```

### Custom Permission Check

```typescript
// Direct permission check (bypasses cache)
const hasPermission = await authHub.checkPermission(userId, 'patients', 'view', 'doctor')
```

## 🐛 Troubleshooting

### Permission cache not clearing

```typescript
// Manually clear cache for a user
authHub.clearUserCache(userId)

// Clear all cache
authHub.clearAllCache()
```

### Session not refreshing

The middleware automatically refreshes sessions. If issues persist:

```typescript
// Manually refresh
const session = await authHub.refreshSession()
```

### Login not working

1. Check Supabase credentials in environment variables
2. Verify user exists in Supabase Auth
3. Check browser console for errors
4. Verify middleware is not blocking login route

## 📚 Examples

See the implementation in:
- `src/app/(auth)/login/page.tsx` - Login page example
- `src/middleware.ts` - Route protection example
- `src/app/api/auth/logout/route.ts` - Logout API example

## ✅ Best Practices

1. **Always use hooks in client components** - `useAuth` and `usePermissions` are client-only
2. **Check loading states** - Always handle loading state before checking auth
3. **Use permission caching** - Don't fetch permissions on every render
4. **Handle errors gracefully** - Auth operations can fail
5. **Clear cache on logout** - AuthHub does this automatically, but be aware

---

**For more details, see:** `DATABASE_SETUP_REPORT.md`
