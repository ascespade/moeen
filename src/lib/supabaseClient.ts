import { createBrowserClient, createServerClient } from '@supabase/ssr'
import { cookies, headers } from 'next/headers'

export function getBrowserSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
  return createBrowserClient(url, anon)
}

export function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
  return createServerClient(url, anon, {
    cookies: {
      getAll() {
        return cookies().getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookies().set(name, value, options)
        })
      },
    },
  })
}

export function getServiceSupabase() {
  const { createClient } = require('@supabase/supabase-js')
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const service = process.env.SUPABASE_SERVICE_ROLE || 'placeholder-service-key'
  return createClient(url, service)
}

