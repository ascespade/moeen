import { createServerSupabaseClient } from './supabase'
import { redirect } from 'next/navigation'

export async function getCurrentUser() {
  const supabase = createServerSupabaseClient()
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return null
    }
    
    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

export async function requireAuth() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }
  
  return user
}

export async function getUserRole(userId: string) {
  const supabase = createServerSupabaseClient()
  
  try {
    const { data, error } = await supabase
      .from('users')
      .select('role_id, roles(name)')
      .eq('id', userId)
      .single()
    
    if (error) {
      console.error('Error getting user role:', error)
      return null
    }
    
    return data?.roles?.name || 'viewer'
  } catch (error) {
    console.error('Error getting user role:', error)
    return null
  }
}

export async function checkPermission(userId: string, requiredRole: string) {
  const userRole = await getUserRole(userId)
  
  const roleHierarchy = {
    'admin': 3,
    'staff': 2,
    'viewer': 1
  }
  
  const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0
  const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0
  
  return userLevel >= requiredLevel
}
