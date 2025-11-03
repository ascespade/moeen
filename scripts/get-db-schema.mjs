#!/usr/bin/env node

/**
 * Get Database Schema from Supabase
 * ??? schema ?? ????? ????????
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('? Missing Supabase credentials');
  console.log('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function getSchema() {
  try {
    console.log('?? Fetching database schema from Supabase...\n');

    // Get all tables
    const { data: tables, error } = await supabase
      .rpc('get_all_tables')
      .catch(async () => {
        // Fallback: query information_schema directly
        const { data, error } = await supabase
          .from('pg_tables')
          .select('tablename')
          .eq('schemaname', 'public');
        return { data, error };
      });

    console.log(`? Found tables`);

    // Build schema structure
    const schema = {
      timestamp: new Date().toISOString(),
      tables: {},
      enums: {},
      functions: {},
    };

    // For each table, get its structure using direct SQL queries
    const tableNames = [
      'users', 'roles', 'permissions', 'patients', 'doctors', 'appointments',
      'sessions', 'medical_records', 'insurance_claims', 'payments', 'notifications',
      'translations', 'audit_logs', 'settings', 'center_info', 'staff_members',
      'emergency_contacts', 'crm_leads', 'crm_contacts', 'customers',
      'therapist_schedules', 'approvals', 'error_logs'
    ];

    for (const tableName of tableNames) {
      console.log(`?? Getting schema for: ${tableName}`);
      
      // Get columns
      const { data: columns } = await supabase
        .from(tableName)
        .select('*')
        .limit(0)
        .then(() => {
          // Use RPC to get column info
          return supabase.rpc('get_table_columns_info', { table_name: tableName })
            .catch(() => ({ data: null }));
        })
        .catch(() => ({ data: null }));

      if (columns) {
        schema.tables[tableName] = {
          columns: columns,
          exists: true,
        };
      } else {
        schema.tables[tableName] = {
          exists: false,
          note: 'Table not found or no access',
        };
      }
    }

    // Save schema
    const schemaDir = path.join(process.cwd(), 'supabase');
    fs.mkdirSync(schemaDir, { recursive: true });
    
    const schemaPath = path.join(schemaDir, 'current-schema.json');
    fs.writeFileSync(schemaPath, JSON.stringify(schema, null, 2));
    
    console.log(`\n? Schema saved to: ${schemaPath}`);
    console.log(`\n?? Summary:`);
    console.log(`   - Tables checked: ${tableNames.length}`);
    
    return schema;

  } catch (error) {
    console.error('? Error:', error.message);
    console.log('\n?? Tip: Make sure Supabase credentials are correct');
    process.exit(1);
  }
}

// Run
getSchema().then(() => {
  console.log('\n? Done!');
  process.exit(0);
}).catch((error) => {
  console.error('? Failed:', error);
  process.exit(1);
});
