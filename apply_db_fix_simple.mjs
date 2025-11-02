/**
 * Simple Database Fix - Update users directly
 * إصلاح بسيط - تحديث المستخدمين مباشرة
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Simple bcrypt-like hash function (fallback)
function simpleHash(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.createHash('sha256').update(password + salt).digest('hex');
  return `$2a$10$${salt}${hash.substring(0, 31)}`;
}

async function applyFix() {
  console.log('🔧 Applying database fixes...\n');

  const testUsers = [
    { email: 'admin@test.com', password: 'Admin123!', name: 'Test Admin', role: 'admin' },
    { email: 'doctor@test.com', password: 'Doctor123!', name: 'Test Doctor', role: 'doctor' },
    { email: 'patient@test.com', password: 'Patient123!', name: 'Test Patient', role: 'patient' },
    { email: 'staff@test.com', password: 'Staff123!', name: 'Test Staff', role: 'staff' },
  ];

  // Step 1: Check existing users
  console.log('1. Checking existing users...');
  for (const userData of testUsers) {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, password_hash, role, status')
      .eq('email', userData.email)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.log(`   ⚠️  ${userData.email}: ${error.message}`);
      continue;
    }

    if (user) {
      console.log(`   ✓ Found: ${userData.email} (${user.role || 'no role'})`);
      
      // Check if password_hash exists
      if (!user.password_hash || user.password_hash === '') {
        console.log(`   ⚠️  ${userData.email} has no password_hash`);
        console.log(`   💡 This user needs a password. You need to run SQL manually.`);
      } else {
        console.log(`   ✅ ${userData.email} has password`);
      }
    } else {
      console.log(`   ❌ Not found: ${userData.email}`);
    }
  }

  console.log('\n2. SQL Fix Required:');
  console.log('   Since we cannot execute SQL functions directly via REST API,');
  console.log('   please run this SQL in Supabase SQL Editor:\n');
  
  console.log('   File: apply_db_fix_direct.sql');
  console.log('\n   Or copy this SQL:\n');
  
  const sql = `
-- Fix passwords for existing users
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
`;
  
  console.log(sql);
  
  console.log('\n3. After running SQL, verify:');
  console.log('   SELECT email, name, role,');
  console.log('     CASE WHEN password_hash IS NULL OR password_hash = \'\' THEN \'❌ No password\'');
  console.log('     ELSE \'✅ Has password\' END as password_status');
  console.log('   FROM users WHERE email LIKE \'%@test.com\';');
  
  console.log('\n✅ Check complete! Run SQL to fix passwords.');
}

applyFix().catch(console.error);
