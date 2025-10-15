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

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Migration order as specified in the guide
const migrations = [
  // Core Healthcare Tables
  '001_add_public_id_core_tables.sql',
  '002_performance_indexes.sql',
  
  // System Administration
  '030_system_admin_tables.sql',
  '031_system_rls.sql',
  '032_dynamic_content_tables.sql',
  '033_roles_users_system.sql',
  '034_patients_doctors_appointments.sql',
  '035_insurance_payments_claims.sql',
  '036_medical_records_files.sql',
  '036_reports_metrics.sql',
  
  // Chatbot System
  '010_chatbot_tables.sql',
  '011_chatbot_indexes.sql',
  '012_chatbot_rls.sql',
  '037_chatbot_system.sql',
  
  // CRM System
  '020_crm_tables.sql',
  '021_crm_indexes.sql',
  '022_crm_rls.sql'
];

async function executeSQL(sql) {
  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
    if (error) {
      console.error('❌ SQL Error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('❌ Exception:', err.message);
    return false;
  }
}

async function applyMigration(migrationFile) {
  console.log(`\n🔄 Applying migration: ${migrationFile}`);
  
  const migrationPath = path.join(__dirname, 'supabase', 'migrations', migrationFile);
  
  if (!fs.existsSync(migrationPath)) {
    console.error(`❌ Migration file not found: ${migrationPath}`);
    return false;
  }
  
  const sql = fs.readFileSync(migrationPath, 'utf8');
  
  // Split SQL into individual statements
  const statements = sql
    .split(';')
    .map(stmt => stmt.trim())
    .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
  
  let successCount = 0;
  let totalStatements = statements.length;
  
  for (const statement of statements) {
    if (statement.trim()) {
      const success = await executeSQL(statement);
      if (success) {
        successCount++;
      } else {
        console.error(`❌ Failed statement: ${statement.substring(0, 100)}...`);
        return false;
      }
    }
  }
  
  console.log(`✅ ${migrationFile} applied successfully (${successCount}/${totalStatements} statements)`);
  return true;
}

async function main() {
  console.log('🚀 Starting comprehensive migration process...');
  console.log(`📊 Total migrations to apply: ${migrations.length}`);
  
  let successCount = 0;
  let failedMigrations = [];
  
  for (const migration of migrations) {
    const success = await applyMigration(migration);
    if (success) {
      successCount++;
    } else {
      console.error(`❌ Migration ${migration} failed. Continuing with next migration...`);
      failedMigrations.push(migration);
    }
    
    // Small delay between migrations
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n📋 Migration Summary:');
  console.log(`✅ Successful: ${successCount}/${migrations.length}`);
  
  if (failedMigrations.length > 0) {
    console.log(`❌ Failed: ${failedMigrations.length}`);
    console.log('Failed migrations:', failedMigrations.join(', '));
  } else {
    console.log('🎉 All migrations completed successfully!');
  }
  
  // Test database connection after migrations
  console.log('\n🔍 Testing database connection...');
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('⚠️  Users table not found (expected for new database)');
    } else {
      console.log('✅ Database connection successful');
    }
  } catch (err) {
    console.error('❌ Database connection test failed:', err.message);
  }
}

main().catch(console.error);
