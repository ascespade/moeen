/**
 * Database Client - عميل قاعدة البيانات
 * 
 * Centralized database connection and query management
 * إدارة مركزية لاتصال قاعدة البيانات والاستعلامات
 */

import { createClient } from '@supabase/supabase-js'

// Database connection string from environment
const DATABASE_URL = process.env.DATABASE_URL || 
  'postgresql://postgres.socwpqzcalgvpzjwavgh:rZqeMdbeyCwXW5cB@aws-1-eu-central-1.pooler.supabase.com:6543/postgres'

// Supabase URL and keys
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Singleton client instances
let supabaseClient: ReturnType<typeof createClient> | null = null
let supabaseServiceClient: ReturnType<typeof createClient> | null = null

/**
 * Get Supabase client (anon key - for client-side)
 */
export function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      db: {
        schema: 'public',
      },
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  }
  return supabaseClient
}

/**
 * Get Supabase service client (service role key - for server-side)
 */
export function getSupabaseServiceClient() {
  if (!supabaseServiceClient && SUPABASE_SERVICE_KEY) {
    supabaseServiceClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      db: {
        schema: 'public',
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  }
  return supabaseServiceClient
}

/**
 * Execute a database query with error handling
 */
export async function executeQuery<T>(
  query: () => Promise<{ data: T | null; error: any }>
): Promise<{ data: T | null; error: Error | null }> {
  try {
    const result = await query()
    if (result.error) {
      console.error('[Database Error]', result.error)
      return {
        data: null,
        error: new Error(result.error.message || 'Database query failed'),
      }
    }
    return {
      data: result.data,
      error: null,
    }
  } catch (error) {
    console.error('[Database Exception]', error)
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown database error'),
    }
  }
}

/**
 * Database tables mapping
 * Mapping of module names to their database tables
 */
export const DATABASE_TABLES = {
  // Authentication & Users
  users: 'users',
  roles: 'roles',
  audit_logs: 'audit_logs',
  
  // Healthcare
  patients: 'patients',
  doctors: 'doctors',
  appointments: 'appointments',
  medical_records: 'medical_records',
  sessions: 'sessions',
  
  // Insurance & Claims
  insurance_claims: 'insurance_claims',
  insurance_providers: 'insurance_providers',
  
  // Payments
  payments: 'payments',
  transactions: 'transactions',
  
  // CRM
  crm_leads: 'crm_leads',
  crm_contacts: 'crm_contacts',
  crm_deals: 'crm_deals',
  
  // Chatbot
  conversations: 'conversations',
  chatbot_flows: 'chatbot_flows',
  chatbot_intents: 'chatbot_intents',
  
  // Notifications
  notifications: 'notifications',
  notification_templates: 'notification_templates',
  
  // Settings
  settings: 'settings',
  system_config: 'system_config',
} as const

export type DatabaseTable = typeof DATABASE_TABLES[keyof typeof DATABASE_TABLES]
