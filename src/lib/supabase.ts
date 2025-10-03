import { createClient } from '@supabase/supabase-js'
import { createBrowserClient, createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Browser client for client-side operations
export const createBrowserSupabaseClient = () => {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// Server client for server-side operations
export const createServerSupabaseClient = () => {
  const cookieStore = cookies()
  
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          phone: string | null
          role_id: number
          is_active: boolean
          last_login: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name: string
          phone?: string | null
          role_id: number
          is_active?: boolean
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          phone?: string | null
          role_id?: number
          is_active?: boolean
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      patients: {
        Row: {
          id: string
          full_name: string
          phone: string
          email: string | null
          date_of_birth: string | null
          gender: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          medical_history: string | null
          current_conditions: string[] | null
          assigned_staff_id: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          full_name: string
          phone: string
          email?: string | null
          date_of_birth?: string | null
          gender?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          medical_history?: string | null
          current_conditions?: string[] | null
          assigned_staff_id?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          phone?: string
          email?: string | null
          date_of_birth?: string | null
          gender?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          medical_history?: string | null
          current_conditions?: string[] | null
          assigned_staff_id?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          patient_id: string
          staff_id: string | null
          status: string
          priority: string
          last_message_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          staff_id?: string | null
          status?: string
          priority?: string
          last_message_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          staff_id?: string | null
          status?: string
          priority?: string
          last_message_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_type: string
          sender_id: string | null
          content: string
          message_type: string
          metadata: any
          is_ai_generated: boolean
          ai_model: string | null
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_type: string
          sender_id?: string | null
          content: string
          message_type?: string
          metadata?: any
          is_ai_generated?: boolean
          ai_model?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          sender_type?: string
          sender_id?: string | null
          content?: string
          message_type?: string
          metadata?: any
          is_ai_generated?: boolean
          ai_model?: string | null
          created_at?: string
        }
      }
    }
  }
}
