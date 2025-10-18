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
  }
});

async function applyMigration(migrationFile) {
  // console.log(`🔄 Applying migration: ${migrationFile}`

  let migrationPath = path.join(__dirname, 'supabase', 'migrations', migrationFile);

  if (!fs.existsSync(migrationPath)) {
    // console.error(`❌ Migration file not found: ${migrationPath}`
    return false;
  }

  let sql = fs.readFileSync(migrationPath, 'utf8');

  // Split SQL into individual statements
  let statements = sql
    .split(';')
    .map(stmt => stmt.trim())
    .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

  let successCount = 0;
  let totalStatements = statements.length;

  for (const statement of statements) {
    if (statement.trim()) {
      try {
        // Try using the REST API directly
        let response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseServiceKey}`
            'apikey': supabaseServiceKey
          },
          body: JSON.stringify({ sqlQuery: statement })
        });

        if (!response.ok) {
          let errorText = await response.text();
          // console.error(`❌ Error in statement: ${statement.substring(0, 100)}...`
          // console.error(`   HTTP ${response.status}: ${errorText.substring(0, 200)}...`
          return false;
        }

        successCount++;
        // console.log('✅ Statement executed successfully');
      } catch (err) {
        // console.error(`❌ Exception in statement: ${statement.substring(0, 100)}...`
        // console.error(`   Error: ${err.message}`
        return false;
      }
    }
  }

  // console.log(`✅ ${migrationFile} applied successfully (${successCount}/${totalStatements} statements)`
  return true;
}

async function main() {
  let migrationFile = process.argv[2] || '001_create_core_tables_fixed.sql';

  // console.log('🚀 Starting single migration process...');
  // console.log(`📦 Project: ${supabaseUrl}`

  // Test connection first
  try {
    const data, error = await supabase
      .from('users')
      .select('count')
      .limit(1);

    if (error) {
      // console.log('⚠️  Users table not found (expected for new database)');
    } else {
      // console.log('✅ Database connection successful');
    }
  } catch (err) {
    // console.error('❌ Database connection failed:', err.message);
    return;
  }

  let success = await applyMigration(migrationFile);

  if (success) {
    // console.log('\n🎉 Migration completed successfully!');
  } else {
    // console.log('\n❌ Migration failed!');
    process.exit(1);
  }
}

main().catch(console.error);
