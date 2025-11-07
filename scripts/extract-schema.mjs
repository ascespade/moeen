#!/usr/bin/env node

/**
 * Extract Database Schema from Supabase
 * ??? schema ?? ????? ????????
 */

import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database connection string
const dbUrl =
  process.env.DATABASE_URL ||
  'postgresql://postgres.socwpqzcalgvpzjwavgh:rZqeMdbeyCwXW5cB@aws-1-eu-central-1.pooler.supabase.com:6543/postgres';

// Parse the connection string manually
const match = dbUrl.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
if (!match) {
  throw new Error('Invalid database URL format');
}

const [, user, password, host, port, database] = match;

const client = new pg.Client({
  host,
  port: parseInt(port),
  database,
  user, // Use the full username including 'postgres.'
  password,
  ssl: {
    rejectUnauthorized: false,
    require: true,
  },
});

async function extractSchema() {
  try {
    console.log('?? Connecting to database...\n');
    await client.connect();

    // Get all tables
    const tablesQuery = `
      SELECT 
        table_name,
        table_schema
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `;

    const { rows: tables } = await client.query(tablesQuery);
    console.log(`? Found ${tables.length} tables\n`);

    const schema = {
      timestamp: new Date().toISOString(),
      database_url: dbUrl.replace(/:[^:@]+@/, ':****@'), // Hide password
      tables: {},
      enums: {},
      functions: {},
      views: {},
    };

    // For each table, get columns, constraints, indexes
    for (const table of tables) {
      const tableName = table.table_name;
      console.log(`?? Processing table: ${tableName}`);

      // Get columns
      const columnsQuery = `
        SELECT 
          column_name,
          data_type,
          character_maximum_length,
          is_nullable,
          column_default,
          udt_name
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = $1
        ORDER BY ordinal_position;
      `;

      const { rows: columns } = await client.query(columnsQuery, [tableName]);

      // Get constraints
      const constraintsQuery = `
        SELECT
          tc.constraint_name,
          tc.constraint_type,
          kcu.column_name,
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
        LEFT JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
        WHERE tc.table_schema = 'public'
          AND tc.table_name = $1;
      `;

      const { rows: constraints } = await client.query(constraintsQuery, [
        tableName,
      ]);

      // Get indexes
      const indexesQuery = `
        SELECT
          indexname,
          indexdef
        FROM pg_indexes
        WHERE schemaname = 'public'
          AND tablename = $1;
      `;

      const { rows: indexes } = await client.query(indexesQuery, [tableName]);

      schema.tables[tableName] = {
        columns: columns.map(col => ({
          name: col.column_name,
          type: col.data_type,
          udt_name: col.udt_name,
          maxLength: col.character_maximum_length,
          nullable: col.is_nullable === 'YES',
          default: col.column_default,
        })),
        constraints: constraints.map(con => ({
          name: con.constraint_name,
          type: con.constraint_type,
          column: con.column_name,
          foreignTable: con.foreign_table_name,
          foreignColumn: con.foreign_column_name,
        })),
        indexes: indexes.map(idx => ({
          name: idx.indexname,
          definition: idx.indexdef,
        })),
      };
    }

    // Get enums
    const enumsQuery = `
      SELECT
        t.typname AS enum_name,
        e.enumlabel AS enum_value
      FROM pg_type t
      JOIN pg_enum e ON t.oid = e.enumtypid
      WHERE t.typname NOT LIKE 'pg_%'
      ORDER BY t.typname, e.enumsortorder;
    `;

    const { rows: enumRows } = await client.query(enumsQuery);
    const enums = {};
    for (const row of enumRows) {
      if (!enums[row.enum_name]) {
        enums[row.enum_name] = [];
      }
      enums[row.enum_name].push(row.enum_value);
    }
    schema.enums = enums;

    // Get functions
    const functionsQuery = `
      SELECT
        routine_name,
        routine_type,
        data_type,
        routine_definition
      FROM information_schema.routines
      WHERE routine_schema = 'public'
      ORDER BY routine_name;
    `;

    const { rows: functions } = await client.query(functionsQuery);
    schema.functions = functions.map(fn => ({
      name: fn.routine_name,
      type: fn.routine_type,
      returnType: fn.data_type,
      definition: fn.routine_definition?.substring(0, 500), // Truncate for readability
    }));

    // Get views
    const viewsQuery = `
      SELECT
        table_name,
        view_definition
      FROM information_schema.views
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;

    const { rows: views } = await client.query(viewsQuery);
    schema.views = views.map(view => ({
      name: view.table_name,
      definition: view.view_definition?.substring(0, 500), // Truncate
    }));

    // Save schema to file
    const schemaDir = path.join(process.cwd(), 'supabase');
    fs.mkdirSync(schemaDir, { recursive: true });

    const schemaPath = path.join(schemaDir, 'schema.json');
    fs.writeFileSync(schemaPath, JSON.stringify(schema, null, 2));

    // Also create a SQL representation
    const sqlPath = path.join(schemaDir, 'schema-summary.sql');
    let sqlOutput = `-- Database Schema Summary\n`;
    sqlOutput += `-- Extracted at: ${schema.timestamp}\n\n`;

    for (const [tableName, tableInfo] of Object.entries(schema.tables)) {
      sqlOutput += `-- Table: ${tableName}\n`;
      sqlOutput += `CREATE TABLE IF NOT EXISTS ${tableName} (\n`;

      const columns = tableInfo.columns
        .map(col => {
          let def = `  ${col.name} ${col.udt_name || col.type}`;
          if (col.maxLength) def += `(${col.maxLength})`;
          if (!col.nullable) def += ' NOT NULL';
          if (col.default) def += ` DEFAULT ${col.default}`;
          return def;
        })
        .join(',\n');

      sqlOutput += columns;
      sqlOutput += '\n);\n\n';
    }

    fs.writeFileSync(sqlPath, sqlOutput);

    console.log(`\n? Schema saved to: ${schemaPath}`);
    console.log(`?? SQL summary saved to: ${sqlPath}`);
    console.log(`\n?? Summary:`);
    console.log(`   - Tables: ${Object.keys(schema.tables).length}`);
    console.log(`   - Enums: ${Object.keys(schema.enums).length}`);
    console.log(`   - Functions: ${schema.functions.length}`);
    console.log(`   - Views: ${schema.views.length}`);

    await client.end();
  } catch (error) {
    console.error('? Error extracting schema:', error.message);
    if (client) await client.end();
    process.exit(1);
  }
}

// Run
extractSchema()
  .then(() => {
    console.log('\n? Done!');
    process.exit(0);
  })
  .catch(error => {
    console.error('? Failed:', error);
    process.exit(1);
  });
