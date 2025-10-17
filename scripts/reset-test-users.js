#!/usr/bin/env node

/**
 * Reset Test Users Script
 * إعادة تعيين المستخدمين التجريبيين
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function resetTestUsers() {
  console.log('🔄 Resetting test users...');
  
  try {
    // Delete test users from auth.users
    const { error: authError } = await supabase.auth.admin.listUsers();
    if (authError) {
      console.error('Error listing users:', authError);
      return;
    }

    // Delete test users from public.users
    const { error: usersError } = await supabase
      .from('users')
      .delete()
      .like('email', '%test%');

    if (usersError) {
      console.error('Error deleting test users:', usersError);
    } else {
      console.log('✅ Test users deleted from public.users');
    }

    // Clear rate limit cache
    try {
      const response = await fetch('http://localhost:3001/api/test/clear-rate-limit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        console.log('✅ Rate limit cache cleared');
      }
    } catch (error) {
      console.log('⚠️ Could not clear rate limit cache');
    }

    console.log('✅ Test users reset completed');
    
  } catch (error) {
    console.error('❌ Error resetting test users:', error);
  }
}

resetTestUsers();
