/**
 * Check role enum values
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkRoles() {
  console.log('🔍 Checking role values...\n');

  // Try to get enum values via SQL query
  try {
    // Query to get enum values
    const query = `
      SELECT 
        t.typname as enum_name,
        e.enumlabel as enum_value
      FROM pg_type t 
      JOIN pg_enum e ON t.oid = e.enumtypid
      WHERE t.typname LIKE '%role%'
      ORDER BY e.enumsortorder;
    `;

    // Use RPC if available, or check existing users
    const { data: users, error } = await supabase
      .from('users')
      .select('role')
      .not('role', 'is', null)
      .limit(20);

    if (!error && users) {
      const uniqueRoles = [...new Set(users.map(u => u.role).filter(Boolean))];
      console.log('✅ Role values found in users table:');
      uniqueRoles.forEach(role => console.log(`   - "${role}"`));
      console.log('');
      console.log('📋 Use these exact values in SQL (case-sensitive):');
      console.log('   ', uniqueRoles.join(', '));
    } else {
      console.log('⚠️  Could not query users:', error?.message);
    }

    // Check admin user
    const { data: admin } = await supabase
      .from('users')
      .select('role')
      .eq('email', 'admin@test.com')
      .maybeSingle();

    if (admin) {
      console.log(`\n✅ admin@test.com has role: "${admin.role}"`);
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkRoles();
