#!/usr/bin/env node
/**
 * Database Introspection
 * Scans Supabase database schema completely
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const DB_SCHEMA = {
  tables: [],
  columns: {},
  indexes: {},
  foreign_keys: {},
  triggers: {},
  functions: {},
  sample_data: {},
  statistics: {},
};

async function introspectDatabase() {
  console.log('\n🔍 Introspecting database schema...\n');
  
  try {
    // Get all tables
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .order('table_name');
    
    if (tablesError) {
      console.log('⚠️  Using fallback table detection...');
      // Fallback: try to list tables via known tables
      const knownTables = [
        'users', 'patients', 'appointments', 'session_types',
        'therapist_schedules', 'therapist_specializations', 'therapist_time_off',
        'ieps', 'iep_goals', 'goal_progress', 'session_notes',
        'call_requests', 'notification_rules', 'supervisor_notification_preferences',
        'notification_logs', 'notifications', 'payments', 'insurance_claims',
        'chat_conversations', 'chat_messages',
      ];
      
      for (const tableName of knownTables) {
        const { count, error } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true });
        
        if (!error) {
          DB_SCHEMA.tables.push(tableName);
          DB_SCHEMA.statistics[tableName] = { row_count: count || 0 };
          
          // Get column info by querying the table
          const { data: sampleRow } = await supabase
            .from(tableName)
            .select('*')
            .limit(1)
            .single();
          
          if (sampleRow) {
            DB_SCHEMA.columns[tableName] = Object.keys(sampleRow).map(col => ({
              column_name: col,
              data_type: typeof sampleRow[col],
            }));
          }
        }
      }
    } else {
      DB_SCHEMA.tables = tables.map(t => t.table_name);
    }
    
    console.log(`✅ Found ${DB_SCHEMA.tables.length} tables\n`);
    
    // For each table, get detailed info
    for (const tableName of DB_SCHEMA.tables) {
      console.log(`📊 Analyzing: ${tableName}`);
      
      // Get row count
      const { count } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });
      
      DB_SCHEMA.statistics[tableName] = { row_count: count || 0 };
      
      // Get sample data
      const { data: sampleRows } = await supabase
        .from(tableName)
        .select('*')
        .limit(3);
      
      if (sampleRows && sampleRows.length > 0) {
        DB_SCHEMA.sample_data[tableName] = sampleRows;
        
        // Infer columns from sample
        if (!DB_SCHEMA.columns[tableName]) {
          DB_SCHEMA.columns[tableName] = Object.keys(sampleRows[0]).map(col => ({
            column_name: col,
            data_type: typeof sampleRows[0][col],
            is_nullable: sampleRows.some(row => row[col] === null) ? 'YES' : 'NO',
          }));
        }
      }
      
      console.log(`   - ${count || 0} rows`);
      console.log(`   - ${DB_SCHEMA.columns[tableName]?.length || 0} columns`);
    }
    
    console.log('\n✅ Database introspection complete\n');
    
    // Summary
    console.log('📊 Summary:');
    console.log(`   - Total tables: ${DB_SCHEMA.tables.length}`);
    console.log(`   - Total rows: ${Object.values(DB_SCHEMA.statistics).reduce((sum, s) => sum + s.row_count, 0)}`);
    console.log(`   - Tables with data: ${Object.values(DB_SCHEMA.statistics).filter(s => s.row_count > 0).length}\n`);
    
    // Save results
    fs.writeFileSync(
      '/workspace/tmp/db-schema-scan.json',
      JSON.stringify(DB_SCHEMA, null, 2)
    );
    
    console.log('📁 Saved: tmp/db-schema-scan.json\n');
    
    return DB_SCHEMA;
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  introspectDatabase().catch(console.error);
}

module.exports = { introspectDatabase };
