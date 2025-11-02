'use client'

import { useState, useEffect } from 'react'
import { authHub } from '../AuthHub'
import { UserPermissions } from '../AuthHub'
import { useAuth } from './useAuth'

export function usePermissions() {
  const { user, loading: authLoading } = useAuth()
  const [permissions, setPermissions] = useState<UserPermissions | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return

    if (!user) {
      setPermissions(null)
      setLoading(false)
      return
    }

    authHub.getUserPermissions(user.id).then((perms) => {
      setPermissions(perms)
      setLoading(false)
    }).catch((error) => {
      console.error('Failed to load permissions:', error)
      setLoading(false)
    })
  }, [user?.id, authLoading])

  const checkPermission = async (resource: string, action: string): Promise<boolean> => {
    if (!user) return false
    return authHub.checkPermission(user.id, resource, action, permissions?.role)
  }

  const hasRole = (role: string): boolean => {
    return permissions?.role === role
  }

  const hasPermission = (permission: string): boolean => {
    if (!permissions) return false
    return permissions.permissions.includes(permission) || permissions.permissions.includes('*')
  }

  return {
    permissions,
    loading,
    checkPermission,
    hasRole,
    hasPermission,
    role: permissions?.role,
    permissionList: permissions?.permissions || [],
  }
}
