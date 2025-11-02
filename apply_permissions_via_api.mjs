/**
 * Apply Permissions Schema via Supabase API
 * تطبيق صلاحيات قاعدة البيانات عبر Supabase API
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Supabase configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE || 'sbp_a1d07c37833d0bfd3bd1e05129c811813dd223dd';

if (!SUPABASE_URL) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL is not set in .env.local');
  process.exit(1);
}

// Create Supabase client with service role key
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function executeSQL(sqlScript) {
  try {
    // Split SQL script into individual statements
    const statements = sqlScript
      .split(';')
      .map(s => s.trim())
      .filter(s => s && !s.startsWith('--') && s.length > 10);

    console.log(`📝 Executing ${statements.length} SQL statements...`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (!statement || statement.length < 10) continue;

      try {
        // Try to execute via RPC (if available) or direct query
        const { data, error } = await supabase.rpc('exec_sql', { 
          sql: statement + ';' 
        });

        if (error) {
          // If RPC doesn't exist, try direct query (may not work for DDL)
          console.warn(`⚠️  Statement ${i + 1} failed via RPC, trying alternative...`);
          console.warn(`   Error: ${error.message}`);
          console.warn(`   Statement: ${statement.substring(0, 100)}...`);
        } else {
          console.log(`✅ Statement ${i + 1}/${statements.length} executed`);
        }
      } catch (err) {
        console.warn(`⚠️  Statement ${i + 1} skipped: ${err.message}`);
      }
    }
  } catch (error) {
    console.error('❌ Error executing SQL:', error);
    throw error;
  }
}

async function applyPermissions() {
  console.log('🚀 Starting permissions schema application...\n');

  try {
    // Read SQL file
    const sqlPath = path.join(process.cwd(), 'supabase', 'fix_permissions_schema.sql');
    const sqlScript = fs.readFileSync(sqlPath, 'utf-8');

    console.log('📄 SQL file read successfully');
    console.log(`📏 SQL script length: ${sqlScript.length} characters\n`);

    // Note: Supabase REST API doesn't support direct SQL execution
    // We need to use Management API or apply via SQL Editor
    console.log('⚠️  Note: Supabase REST API has limitations for DDL operations.');
    console.log('📋 Please apply the SQL script manually in Supabase SQL Editor:');
    console.log(`   File: ${sqlPath}\n`);

    // However, we can still verify/test permissions structure
    console.log('🔍 Verifying current database structure...\n');

    // Check if permissions table exists
    const { data: permissions, error: permError } = await supabase
      .from('permissions')
      .select('id, code, name')
      .limit(5);

    if (permError && permError.code === 'PGRST116') {
      console.log('❌ Permissions table does not exist yet');
      console.log('   Need to create it via SQL Editor\n');
    } else if (permError) {
      console.log(`⚠️  Error checking permissions: ${permError.message}\n`);
    } else {
      console.log(`✅ Permissions table exists (${permissions?.length || 0} records found)`);
    }

    // Check roles table
    const { data: roles, error: roleError } = await supabase
      .from('roles')
      .select('id, name, display_name')
      .limit(5);

    if (roleError && roleError.code === 'PGRST116') {
      console.log('❌ Roles table does not exist yet');
      console.log('   Need to create it via SQL Editor\n');
    } else if (roleError) {
      console.log(`⚠️  Error checking roles: ${roleError.message}\n`);
    } else {
      console.log(`✅ Roles table exists (${roles?.length || 0} records found)`);
    }

    // Check user_roles
    const { data: userRoles, error: urError } = await supabase
      .from('user_roles')
      .select('id')
      .limit(1);

    if (urError && urError.code === 'PGRST116') {
      console.log('❌ user_roles table does not exist yet');
    } else if (urError) {
      console.log(`⚠️  Error checking user_roles: ${urError.message}`);
    } else {
      console.log('✅ user_roles table exists');
    }

    console.log('\n📝 Summary:');
    console.log('   To apply the full permissions schema, run this SQL in Supabase SQL Editor:');
    console.log(`   ${sqlPath}`);
    console.log('\n   Or copy the contents of fix_permissions_schema.sql');
    console.log('   and paste it into Supabase Dashboard > SQL Editor\n');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run
applyPermissions().then(() => {
  console.log('\n✅ Verification complete!');
  process.exit(0);
}).catch((error) => {
  console.error('\n❌ Failed:', error);
  process.exit(1);
});
