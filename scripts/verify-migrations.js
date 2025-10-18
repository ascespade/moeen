#!/usr/bin/env node
/**
 * Verify all migrations were applied successfully
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const EXPECTED_TABLES = [
  // Original tables (migrations 001-069)
  'users',
  'patients',
  'appointments',
  'payments',
  'notifications',
  'insurance_claims',
  'chat_conversations',
  'chat_messages',
  
  // Migration 070: Session Types
  'session_types',
  
  // Migration 071: Therapist Schedules
  'therapist_schedules',
  'therapist_specializations',
  'therapist_time_off',
  
  // Migration 072: IEP System
  'ieps',
  'iep_goals',
  'goal_progress',
  'session_notes',
  
  // Migration 073: Supervisor Notifications
  'call_requests',
  'notification_rules',
  'supervisor_notification_preferences',
  'notification_logs',
  
  // Migration 075: Reminder System
  'reminder_outbox',
  'reminder_preferences',
];

const EXPECTED_COLUMNS = {
  // Migration 074: Soft Delete
  soft_delete: ['deleted_at', 'deleted_by'],
  
  // Migration 077: Search
  search: ['search_vector'],
};

const EXPECTED_FUNCTIONS = [
  // Migration 074: Soft Delete
  'soft_delete',
  'restore_deleted',
  'cleanup_soft_deleted',
  
  // Migration 075: Reminders
  'schedule_appointment_reminders',
  'process_pending_reminders',
  
  // Migration 076: Booking
  'check_booking_conflict',
  'create_booking',
  
  // Migration 077: Search
  'search_patients',
  'search_users',
];

async function verifyMigrations() {
  console.log('\n🔍 Verifying Migrations...\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  const results = {
    tables: { found: [], missing: [] },
    columns: { found: [], missing: [] },
    functions: { found: [], missing: [] },
  };
  
  // Check Tables
  console.log('📊 Checking Tables...\n');
  
  for (const tableName of EXPECTED_TABLES) {
    try {
      const { count, error } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.log(`   ❌ ${tableName}: Not found`);
        results.tables.missing.push(tableName);
      } else {
        console.log(`   ✅ ${tableName}: ${count || 0} rows`);
        results.tables.found.push(tableName);
      }
    } catch (err) {
      console.log(`   ❌ ${tableName}: Error`);
      results.tables.missing.push(tableName);
    }
  }
  
  console.log(`\n   Summary: ${results.tables.found.length}/${EXPECTED_TABLES.length} tables found\n`);
  
  // Check Soft Delete Columns
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('🗑️  Checking Soft Delete Columns...\n');
  
  const tablesToCheck = ['users', 'patients', 'appointments'];
  
  for (const tableName of tablesToCheck) {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('deleted_at, deleted_by')
        .limit(1);
      
      if (error) {
        console.log(`   ❌ ${tableName}: deleted_at/deleted_by not found`);
        results.columns.missing.push(`${tableName}.deleted_at`);
      } else {
        console.log(`   ✅ ${tableName}: Has soft delete columns`);
        results.columns.found.push(`${tableName}.deleted_at`);
      }
    } catch (err) {
      console.log(`   ❌ ${tableName}: Error checking columns`);
      results.columns.missing.push(`${tableName}.deleted_at`);
    }
  }
  
  console.log(`\n   Summary: ${results.columns.found.length}/${tablesToCheck.length} tables have soft delete\n`);
  
  // Check Search Columns
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('🔍 Checking Search Columns...\n');
  
  const searchTables = ['patients', 'users'];
  
  for (const tableName of searchTables) {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('search_vector')
        .limit(1);
      
      if (error) {
        console.log(`   ❌ ${tableName}: search_vector not found`);
        results.columns.missing.push(`${tableName}.search_vector`);
      } else {
        console.log(`   ✅ ${tableName}: Has search_vector column`);
        results.columns.found.push(`${tableName}.search_vector`);
      }
    } catch (err) {
      console.log(`   ❌ ${tableName}: Error checking search column`);
      results.columns.missing.push(`${tableName}.search_vector`);
    }
  }
  
  console.log(`\n   Summary: ${results.columns.found.length - tablesToCheck.length}/${searchTables.length} tables have search\n`);
  
  // Check Functions (via RPC test calls)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('⚙️  Checking Functions...\n');
  
  // Test search_patients
  try {
    const { data, error } = await supabase.rpc('search_patients', {
      p_query: 'test',
      p_limit: 1
    });
    
    if (error) {
      console.log(`   ❌ search_patients: Not found or error`);
      results.functions.missing.push('search_patients');
    } else {
      console.log(`   ✅ search_patients: Working`);
      results.functions.found.push('search_patients');
    }
  } catch (err) {
    console.log(`   ❌ search_patients: Error`);
    results.functions.missing.push('search_patients');
  }
  
  // Test search_users
  try {
    const { data, error } = await supabase.rpc('search_users', {
      p_query: 'test',
      p_limit: 1
    });
    
    if (error) {
      console.log(`   ❌ search_users: Not found or error`);
      results.functions.missing.push('search_users');
    } else {
      console.log(`   ✅ search_users: Working`);
      results.functions.found.push('search_users');
    }
  } catch (err) {
    console.log(`   ❌ search_users: Error`);
    results.functions.missing.push('search_users');
  }
  
  // Test process_pending_reminders
  try {
    const { data, error } = await supabase.rpc('process_pending_reminders');
    
    if (error) {
      console.log(`   ❌ process_pending_reminders: Not found or error`);
      results.functions.missing.push('process_pending_reminders');
    } else {
      console.log(`   ✅ process_pending_reminders: Working`);
      results.functions.found.push('process_pending_reminders');
    }
  } catch (err) {
    console.log(`   ❌ process_pending_reminders: Error`);
    results.functions.missing.push('process_pending_reminders');
  }
  
  console.log(`\n   Summary: ${results.functions.found.length}/${EXPECTED_FUNCTIONS.length} functions working\n`);
  
  // Final Report
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('📊 Final Report:\n');
  
  const tablesPercent = Math.round((results.tables.found.length / EXPECTED_TABLES.length) * 100);
  const columnsPercent = Math.round((results.columns.found.length / (tablesToCheck.length + searchTables.length)) * 100);
  const functionsPercent = Math.round((results.functions.found.length / EXPECTED_FUNCTIONS.length) * 100);
  
  console.log(`   Tables:    ${results.tables.found.length}/${EXPECTED_TABLES.length} (${tablesPercent}%)`);
  console.log(`   Columns:   ${results.columns.found.length}/${tablesToCheck.length + searchTables.length} (${columnsPercent}%)`);
  console.log(`   Functions: ${results.functions.found.length}/${EXPECTED_FUNCTIONS.length} (${functionsPercent}%)\n`);
  
  if (results.tables.missing.length > 0) {
    console.log('⚠️  Missing Tables:');
    results.tables.missing.forEach(t => console.log(`   - ${t}`));
    console.log('');
  }
  
  if (results.columns.missing.length > 0) {
    console.log('⚠️  Missing Columns:');
    results.columns.missing.forEach(c => console.log(`   - ${c}`));
    console.log('');
  }
  
  if (results.functions.missing.length > 0) {
    console.log('⚠️  Missing Functions:');
    results.functions.missing.forEach(f => console.log(`   - ${f}`));
    console.log('');
  }
  
  const overallPercent = Math.round(
    ((results.tables.found.length + results.columns.found.length + results.functions.found.length) /
    (EXPECTED_TABLES.length + tablesToCheck.length + searchTables.length + EXPECTED_FUNCTIONS.length)) * 100
  );
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  if (overallPercent >= 90) {
    console.log(`✅ Overall: ${overallPercent}% - EXCELLENT!\n`);
  } else if (overallPercent >= 70) {
    console.log(`🟡 Overall: ${overallPercent}% - GOOD (some migrations pending)\n`);
  } else {
    console.log(`🔴 Overall: ${overallPercent}% - NEEDS ATTENTION\n`);
    console.log('💡 Apply missing migrations via Supabase Dashboard → SQL Editor\n');
  }
  
  // Save results
  const fs = require('fs');
  fs.writeFileSync(
    '/workspace/tmp/verification-results.json',
    JSON.stringify({ timestamp: new Date().toISOString(), results, overallPercent }, null, 2)
  );
  
  console.log('📁 Results saved: tmp/verification-results.json\n');
  
  return overallPercent >= 70;
}

// Run
if (require.main === module) {
  verifyMigrations()
    .then(success => process.exit(success ? 0 : 1))
    .catch(err => {
      console.error('\n❌ Error:', err.message);
      process.exit(1);
    });
}

module.exports = { verifyMigrations };
