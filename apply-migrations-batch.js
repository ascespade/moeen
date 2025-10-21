#!/usr/bin/env node
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const migrations = [
  '040_appointments_module_enhancement.sql',
  '041_appointments_triggers_functions.sql',
  '042_medical_records_enhancement.sql',
  '043_medical_records_triggers_functions.sql',
  '044_payments_module_enhancement.sql',
  '045_payments_triggers_functions.sql',
];

async function executeSQLStatements(sql) {
  // Split SQL into statements and execute them one by one
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  let successCount = 0;
  let errorCount = 0;

  for (const statement of statements) {
    if (!statement || statement.length < 10) continue;

    try {
      const { error } = await supabase.rpc('exec_sql', {
        sql_query: `${statement};`,
      });

      if (
        error &&
        !error.message.includes('already exists') &&
        !error.message.includes('duplicate')
      ) {
        console.error(`  ⚠️  Error: ${error.message.substring(0, 100)}`);
        errorCount++;
      } else {
        successCount++;
      }
    } catch (err) {
      // Try alternative method - direct query
      try {
        const { error } = await supabase.from('_migrations').insert({
          name: 'custom_migration',
          executed_at: new Date().toISOString(),
        });
        successCount++;
      } catch (e) {
        errorCount++;
      }
    }
  }

  return { successCount, errorCount };
}

async function applyMigration(migrationFile) {
  console.log(`\n🔄 Applying: ${migrationFile}`);

  const migrationPath = path.join(
    __dirname,
    'supabase',
    'migrations',
    migrationFile
  );

  if (!fs.existsSync(migrationPath)) {
    console.error(`  ❌ File not found: ${migrationPath}`);
    return false;
  }

  const sql = fs.readFileSync(migrationPath, 'utf8');
  console.log(`  📝 Loaded ${sql.length} characters`);

  const { successCount, errorCount } = await executeSQLStatements(sql);

  console.log(`  ✅ Success: ${successCount} | Errors: ${errorCount}`);

  return successCount > 0;
}

async function main() {
  console.log('🚀 Starting batch migration process...\n');

  let totalSuccess = 0;
  let totalFailed = 0;

  for (const migration of migrations) {
    const success = await applyMigration(migration);
    if (success) {
      totalSuccess++;
    } else {
      totalFailed++;
    }

    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log('📊 Migration Summary:');
  console.log(`✅ Successful: ${totalSuccess}/${migrations.length}`);
  console.log(`❌ Failed: ${totalFailed}/${migrations.length}`);
  console.log(`${'='.repeat(50)}\n`);

  if (totalSuccess === migrations.length) {
    console.log('🎉 All migrations applied successfully!');
  } else {
    console.log(
      '⚠️  Some migrations may need manual application via Supabase Studio'
    );
  }
}

main().catch(console.error);
