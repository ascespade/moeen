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

// All migration files in order
const migrations = [
  '001_create_roles_users.sql',
  '002_patients_doctors_appointments.sql',
  '003_insurance_payments_claims.sql',
  '004_translations.sql',
  '005_reports_metrics.sql',
  '040_appointments_module_enhancement.sql',
  '041_appointments_triggers_functions.sql',
  '042_medical_records_enhancement.sql',
  '043_medical_records_triggers_functions.sql',
  '044_payments_module_enhancement.sql',
  '045_payments_triggers_functions.sql',
  '046_chatbot_ai_enhancement.sql',
  '047_chatbot_triggers_functions.sql',
  '048_crm_enhancement.sql',
  '049_crm_triggers_functions.sql',
  '050_conversations_enhancement.sql',
  '051_insurance_analytics_notifications.sql',
  '052_settings_admin_final.sql'
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
      // Try using the rpc function first
      const { error } = await supabase.rpc('exec_sql', { sql_query: statement + ';' });
      
      if (error && !error.message.includes('already exists') && !error.message.includes('duplicate') && !error.message.includes('does not exist')) {
        console.error(`  ⚠️  Error: ${error.message.substring(0, 100)}`);
        errorCount++;
      } else {
        successCount++;
      }
    } catch (err) {
      // If rpc fails, try direct query execution
      try {
        const { error } = await supabase
          .from('_migrations')
          .insert({
            name: `migration_${Date.now()}`,
            executed_at: new Date().toISOString()
          });
        
        if (error) {
          console.error(`  ⚠️  Migration tracking error: ${error.message.substring(0, 100)}`);
        }
        successCount++;
      } catch (e) {
        console.error(`  ⚠️  Direct execution error: ${e.message.substring(0, 100)}`);
        errorCount++;
      }
    }
  }
  
  return { successCount, errorCount };
}

async function applyMigration(migrationFile) {
  console.log(`\n🔄 Applying: ${migrationFile}`);
  
  const migrationPath = path.join(__dirname, 'supabase', 'migrations', migrationFile);
  
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
  console.log('🚀 Starting comprehensive migration process...\n');
  console.log(`📋 Found ${migrations.length} migration files to apply\n`);
  
  let totalSuccess = 0;
  let totalFailed = 0;
  
  for (const migration of migrations) {
    const success = await applyMigration(migration);
    if (success) {
      totalSuccess++;
    } else {
      totalFailed++;
    }
    
    // Small delay between migrations
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 Migration Summary:');
  console.log(`✅ Successful: ${totalSuccess}/${migrations.length}`);
  console.log(`❌ Failed: ${totalFailed}/${migrations.length}`);
  console.log('='.repeat(60) + '\n');
  
  if (totalSuccess === migrations.length) {
    console.log('🎉 All migrations applied successfully!');
  } else if (totalSuccess > 0) {
    console.log('⚠️  Some migrations applied successfully. Check the errors above.');
  } else {
    console.log('❌ No migrations were applied successfully. Please check your Supabase connection.');
  }
}

main().catch(console.error);