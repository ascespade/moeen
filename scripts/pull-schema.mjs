#!/usr/bin/env node

/**
 * Pull Database Schema from Supabase
 * ??? schema ?? ????? ????????
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('? Missing Supabase credentials in environment variables');
  console.error(
    'Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY'
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function pullSchema() {
  try {
    console.log('?? Pulling database schema from Supabase...\n');

    // Get all tables
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name, table_schema')
      .eq('table_schema', 'public')
      .order('table_name');

    if (tablesError) {
      console.error('? Error fetching tables:', tablesError);
      return;
    }

    console.log(`? Found ${tables?.length || 0} tables\n`);

    // Get schema for each table
    const schema = {
      tables: [],
      enums: [],
      functions: [],
      views: [],
    };

    // For each table, get columns, constraints, indexes
    for (const table of tables || []) {
      const tableName = table.table_name;
      console.log(`?? Processing table: ${tableName}`);

      // Get columns
      const { data: columns } = await supabase
        .rpc('get_table_columns', {
          table_name: tableName,
        })
        .catch(() => ({ data: null }));

      // Get constraints
      const { data: constraints } = await supabase
        .rpc('get_table_constraints', {
          table_name: tableName,
        })
        .catch(() => ({ data: null }));

      schema.tables.push({
        name: tableName,
        columns: columns || [],
        constraints: constraints || [],
      });
    }

    // Get enums
    const { data: enums } = await supabase
      .rpc('get_enums')
      .catch(() => ({ data: null }));
    if (enums) {
      schema.enums = enums;
    }

    // Get functions
    const { data: functions } = await supabase
      .rpc('get_functions')
      .catch(() => ({ data: null }));
    if (functions) {
      schema.functions = functions;
    }

    // Save schema to file
    const schemaPath = path.join(__dirname, '../supabase/schema.json');
    fs.mkdirSync(path.dirname(schemaPath), { recursive: true });
    fs.writeFileSync(schemaPath, JSON.stringify(schema, null, 2));

    console.log(`\n? Schema saved to: ${schemaPath}`);
    console.log(`\n?? Summary:`);
    console.log(`   - Tables: ${schema.tables.length}`);
    console.log(`   - Enums: ${schema.enums?.length || 0}`);
    console.log(`   - Functions: ${schema.functions?.length || 0}`);
  } catch (error) {
    console.error('? Error pulling schema:', error);
    process.exit(1);
  }
}

// Alternative: Use pg_dump if available
async function pullSchemaWithPgDump() {
  const dbUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;

  if (!dbUrl) {
    console.error('? DATABASE_URL not found. Using API method...');
    return pullSchema();
  }

  console.log('?? Pulling schema using pg_dump...\n');

  const { exec } = await import('child_process');
  const { promisify } = await import('util');
  const execAsync = promisify(exec);

  try {
    const { stdout } = await execAsync(
      `pg_dump "${dbUrl}" --schema-only --no-owner --no-acl`
    );

    const schemaPath = path.join(__dirname, '../supabase/schema.sql');
    fs.mkdirSync(path.dirname(schemaPath), { recursive: true });
    fs.writeFileSync(schemaPath, stdout);

    console.log(`? Schema saved to: ${schemaPath}`);
  } catch (error) {
    console.error('? Error with pg_dump, trying API method...');
    return pullSchema();
  }
}

// Run
if (process.env.USE_PG_DUMP === 'true') {
  pullSchemaWithPgDump();
} else {
  pullSchema();
}
