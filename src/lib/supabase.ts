import { createClient } from '@supabase/supabase-js';

// Supabase Configuration - محمي من التعديل
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://socwpqzcalgvpzjwavgh.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_SUOK-3frglejEWKTYESWWw_zGmbekdc';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side client for admin operations
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_secret_e07nVssMWN37xExeZhQG4A_4koosqNe',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Database Tables - محمي من التعديل
export const TABLES = {
  USERS: 'users',
  CONVERSATIONS: 'conversations',
  MESSAGES: 'messages',
  FLOWS: 'flows',
  REVIEWS: 'reviews',
} as const;

// Row Level Security Policies - محمي من التعديل
export const RLS_POLICIES = {
  // Users can only see their own data
  USERS_SELECT: 'users_select_policy',
  USERS_UPDATE: 'users_update_policy',
  
  // Staff can only see their own conversations
  CONVERSATIONS_SELECT: 'conversations_select_policy',
  CONVERSATIONS_INSERT: 'conversations_insert_policy',
  CONVERSATIONS_UPDATE: 'conversations_update_policy',
  
  // Messages are linked to conversations
  MESSAGES_SELECT: 'messages_select_policy',
  MESSAGES_INSERT: 'messages_insert_policy',
  
  // Flows are public for reading
  FLOWS_SELECT: 'flows_select_policy',
  
  // Reviews are linked to conversations
  REVIEWS_SELECT: 'reviews_select_policy',
  REVIEWS_INSERT: 'reviews_insert_policy',
} as const;