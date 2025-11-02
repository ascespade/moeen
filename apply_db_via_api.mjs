/**
 * Apply Database Fix via Supabase Management API
 * استخدام Supabase Management API لتطبيق الإصلاحات
 */

import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE;
const projectRef = supabaseUrl?.match(/https?:\/\/([^.]+)\.supabase\.co/)?.[1];

if (!supabaseUrl || !serviceRoleKey || !projectRef) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

console.log('🔧 Using Supabase Management API');
console.log('   Project:', projectRef);
console.log('');

// SQL to execute
const sql = `
-- Enable pgcrypto
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create verify_password function
CREATE OR REPLACE FUNCTION verify_password(
  password_input TEXT,
  password_hash TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN crypt(password_input, password_hash) = password_hash;
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$;

GRANT EXECUTE ON FUNCTION verify_password(TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION verify_password(TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION verify_password(TEXT, TEXT) TO service_role;

-- Create hash_password function
CREATE OR REPLACE FUNCTION hash_password(
  password_input TEXT
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN crypt(password_input, gen_salt('bf'));
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$;

GRANT EXECUTE ON FUNCTION hash_password(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION hash_password(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION hash_password(TEXT) TO service_role;

-- Fix passwords for test users
UPDATE users
SET password_hash = crypt('Admin123!', gen_salt('bf'))
WHERE email = 'admin@test.com' AND (password_hash IS NULL OR password_hash = '');

UPDATE users
SET password_hash = crypt('Doctor123!', gen_salt('bf'))
WHERE email = 'doctor@test.com' AND (password_hash IS NULL OR password_hash = '');

UPDATE users
SET password_hash = crypt('Patient123!', gen_salt('bf'))
WHERE email = 'patient@test.com' AND (password_hash IS NULL OR password_hash = '');

UPDATE users
SET password_hash = crypt('Staff123!', gen_salt('bf'))
WHERE email = 'staff@test.com' AND (password_hash IS NULL OR password_hash = '');

-- Create users if they don't exist
INSERT INTO users (email, password_hash, name, role, status, created_at)
SELECT 'admin@test.com', crypt('Admin123!', gen_salt('bf')), 'Test Admin', 'admin', 'active', NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@test.com');

INSERT INTO users (email, password_hash, name, role, status, created_at)
SELECT 'doctor@test.com', crypt('Doctor123!', gen_salt('bf')), 'Test Doctor', 'doctor', 'active', NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'doctor@test.com');

INSERT INTO users (email, password_hash, name, role, status, created_at)
SELECT 'patient@test.com', crypt('Patient123!', gen_salt('bf')), 'Test Patient', 'patient', 'active', NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'patient@test.com');

INSERT INTO users (email, password_hash, name, role, status, created_at)
SELECT 'staff@test.com', crypt('Staff123!', gen_salt('bf')), 'Test Staff', 'staff', 'active', NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'staff@test.com');
`;

async function executeSQL() {
  try {
    // Use Supabase REST API to execute SQL
    // Note: Supabase doesn't have direct SQL execution via REST API
    // We'll need to use the SQL Editor API or Management API
    
    console.log('⚠️  Supabase REST API does not support direct SQL execution.');
    console.log('');
    console.log('📋 Please run this SQL in Supabase SQL Editor:');
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(sql);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('📍 Steps:');
    console.log('   1. Open: https://supabase.com/dashboard/project/' + projectRef + '/sql');
    console.log('   2. Paste the SQL above');
    console.log('   3. Click "Run"');
    console.log('   4. Verify the results');
    console.log('');
    console.log('📁 Or use the prepared file: apply_db_fix_direct.sql');
    
    // Try alternative: Update users directly via REST API
    console.log('');
    console.log('🔄 Trying alternative: Update users directly via REST API...');
    console.log('');
    
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });
    
    // Try to use hash_password RPC if it exists
    const testUsers = [
      { email: 'admin@test.com', password: 'Admin123!', name: 'Test Admin', role: 'admin' },
      { email: 'doctor@test.com', password: 'Doctor123!', name: 'Test Doctor', role: 'doctor' },
      { email: 'patient@test.com', password: 'Patient123!', name: 'Test Patient', role: 'patient' },
      { email: 'staff@test.com', password: 'Staff123!', name: 'Test Staff', role: 'staff' },
    ];
    
    // First, try to create hash_password function via a workaround
    // We'll try to call it and if it fails, we know we need to create it
    
    for (const userData of testUsers) {
      // Check if user exists
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id, email, password_hash')
        .eq('email', userData.email)
        .maybeSingle();
      
      if (user) {
        if (!user.password_hash || user.password_hash === '') {
          console.log(`   ⚠️  ${userData.email} needs password - requires SQL execution`);
        } else {
          console.log(`   ✅ ${userData.email} already has password`);
        }
      } else {
        console.log(`   ❌ ${userData.email} not found - will be created by SQL`);
      }
    }
    
    console.log('');
    console.log('✅ Check complete. SQL execution required for full fix.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('');
    console.log('💡 Please run SQL manually in Supabase SQL Editor');
  }
}

executeSQL();
