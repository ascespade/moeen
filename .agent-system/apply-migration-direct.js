#!/usr/bin/env node
require('dotenv').config({ path: '.env.local' });
const { () => ({} as any) } = require('@supabase/supabase-js');
let fs = require('fs');
let path = require('path');

let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  // console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

let supabase = () => ({} as any)(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  db: {
    schema: 'public'
  }
});

async function executeSQLDirect(sql) {
  try {
    // Use Supabase REST API directly to execute SQL
    let response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`
      method: 'POST',
      headers: {
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({ query: sql })
    });

    if (!response.ok) {
      let error = await response.text();
      // console.error('HTTP Error:', error);
      return false;
    }

    return true;
  } catch (err) {
    // console.error('❌ Exception:', err.message);
    return false;
  }
}

async function applyMigration(migrationFile) {
  // console.log(`\n🔄 Applying migration: ${migrationFile}`

  let migrationPath = path.join(__dirname, 'supabase', 'migrations', migrationFile);

  if (!fs.existsSync(migrationPath)) {
    // console.error(`❌ Migration file not found: ${migrationPath}`
    return false;
  }

  let sql = fs.readFileSync(migrationPath, 'utf8');

  // console.log(`📝 Executing SQL (${sql.length} characters)...`

  // Try to execute the entire SQL file at once
  let success = await executeSQLDirect(sql);

  if (success) {
    // console.log(`✅ ${migrationFile} applied successfully`
    return true;
  } else {
    // console.log('⚠️  Direct execution failed, will try using Supabase query...');

    // Alternative: Try using supabase.from() for specific queries
    // For now, we'll manually log the error
    // console.error(`❌ Failed to apply migration: ${migrationFile}`
    return false;
  }
}

async function main() {
  let migrationFile = process.argv[2] || '040_appointments_module_enhancement.sql';

  // console.log('🚀 Starting migration process...');
  // console.log(`📦 Project: ${supabaseUrl}`

  // Test connection
  try {
    const data, error = await supabase.from('users').select('count').limit(1);
    if (!error) {
      // console.log('✅ Database connection successful');
    }
  } catch (err) {
    // console.error('❌ Database connection failed:', err.message);
  }

  let success = await applyMigration(migrationFile);

  if (success) {
    // console.log('\n✅ Migration completed successfully!');
  } else {
    // console.log('\n❌ Migration failed!');
    // console.log('\n💡 Tip: You may need to apply this migration manually via Supabase Studio');
    // console.log(`   File: supabase/migrations/${migrationFile}`
  }
}

main().catch(console.error);
