/**
 * Apply SQL Directly via Supabase Management API
 * تطبيق SQL مباشرة عبر Supabase Management API
 */

import dotenv from 'dotenv';
import { readFileSync } from 'fs';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE;
const projectRef = supabaseUrl?.match(/https?:\/\/([^.]+)\.supabase\.co/)?.[1];

if (!projectRef || !serviceKey) {
  console.error('❌ Missing credentials');
  process.exit(1);
}

// Read SQL file
const sql = readFileSync('QUICK_FIX_SQL.sql', 'utf-8');

async function applySQL() {
  console.log('🔧 Applying SQL directly via Supabase API...\n');
  console.log('Project:', projectRef);
  console.log('');

  try {
    // Try to use Supabase Management API
    // Note: This requires the Management API which may not be available in all plans
    const managementUrl = `https://api.supabase.com/v1/projects/${projectRef}/database/pools/default/query`;
    
    console.log('Attempting to execute SQL via Management API...');
    
    const response = await fetch(managementUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
        'apikey': serviceKey
      },
      body: JSON.stringify({
        query: sql
      })
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ SQL executed successfully!');
      console.log('Result:', result);
      return;
    } else {
      const error = await response.text();
      console.log('⚠️  Management API not available or requires different auth');
      console.log('Error:', error);
    }
  } catch (error) {
    console.log('⚠️  Management API approach failed:', error.message);
  }

  // Fallback: Use Supabase REST API to update users directly
  // We'll need to hash passwords first, but without hash_password function, we can't
  // So we'll use a workaround: update users if we can get hashed passwords another way
  
  console.log('');
  console.log('🔄 Trying alternative: Direct user updates via REST API...');
  console.log('');
  
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  // Since we can't hash passwords without the function, we need to:
  // 1. First ensure the SQL functions are created (requires SQL Editor)
  // 2. Then we can update users via API
  
  console.log('⚠️  Cannot execute SQL functions via REST API.');
  console.log('');
  console.log('📋 Solution: You need to run SQL in Supabase SQL Editor first');
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔗 Open: https://supabase.com/dashboard/project/' + projectRef + '/sql/new');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('📋 Copy and paste this SQL:');
  console.log('');
  console.log(sql);
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('After running SQL, you can test with:');
  console.log('  node apply_fix_direct.mjs');
}

applySQL();
