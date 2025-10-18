#!/usr/bin/env node
let fs = require('fs');
let path = require('path');

function generateMigrationScript() {
  // console.log('📝 Generating migration script for Supabase SQL Editor...');

  let migrations = [
    '001_add_public_id_core_tables.sql',
    '010_chatbot_tables.sql',
    '011_chatbot_indexes.sql',
    '012_chatbot_rls.sql',
    '020_crm_tables.sql',
    '021_crm_indexes.sql',
    '022_crm_rls.sql',
    '030_system_admin_tables.sql',
    '031_system_rls.sql'
  ];

  let combinedSQL = `
-- Generated: ${new Date().toISOString()}
-- Project: Moeen Healthcare Platform

-- ============================================
-- MIGRATION 1: Core Healthcare Tables
-- ============================================

`

  for (const migrationFile of migrations) {
    let migrationPath = path.join('supabase', 'migrations', migrationFile);

    if (fs.existsSync(migrationPath)) {
      let sql = fs.readFileSync(migrationPath, 'utf8');
      combinedSQL += `-- ${migrationFile}\n`
      combinedSQL += sql + '\n\n';
    }
  }

  // Write combined migration
  fs.writeFileSync('migration-complete.sql', combinedSQL);

  // console.log('✅ Migration script generated: migration-complete.sql');
  // console.log('\n📋 Instructions:');
  // console.log('1. Go to your Supabase dashboard');
  // console.log('2. Navigate to SQL Editor');
  // console.log('3. Copy and paste the contents of migration-complete.sql');
  // console.log('4. Run the script');
  // console.log(
    '\n🔗 Supabase Dashboard: https://supabase.com/dashboard/project/socwpqzcalgvpzjwavgh'
  );
}

generateMigrationScript();
