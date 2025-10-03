import { createBrowserClient, createServerClient } from '@supabase/ssr'
import { cookies, headers } from 'next/headers'

export function getBrowserSupabase() {
  // Development mode - return mock client
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return createBrowserClient(url, anon)
}

export function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createServerClient(url, anon, {
    cookies,
    headers,
  })
}

export function getServiceSupabase() {
  const { createClient } = require('@supabase/supabase-js')
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const service = process.env.SUPABASE_SERVICE_ROLE!
  return createClient(url, service)
}

