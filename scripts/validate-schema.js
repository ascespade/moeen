#!/usr/bin/env node
const { Client } = require('pg');

async function validateSchema(client) {
  const results = {
    tables: {},
    indexes: {},
    rls: {},
    errors: []
  };
  
  // Check public_id columns exist
  const tables = ['patients', 'doctors', 'appointments', 'sessions', 'insurance_claims'];
  for (const table of tables) {
    const { rows } = await client.query(`
      SELECT column_name, is_nullable, data_type 
      FROM information_schema.columns 
      WHERE table_name = $1 AND column_name = 'public_id'
    `, [table]);
    
    if (rows.length === 0) {
      results.errors.push(`Missing public_id column in ${table}`);
    } else {
      results.tables[table] = { public_id: 'OK', ...rows[0] };
    }
  }
  
  // Check indexes
  const { rows: indexes } = await client.query(`
    SELECT tablename, indexname 
    FROM pg_indexes 
    WHERE schemaname = 'public' AND indexname LIKE '%public_id%'
  `);
  
  results.indexes = indexes;
  
  // Check RLS enabled
  const { rows: rlsTables } = await client.query(`
    SELECT tablename, rowsecurity 
    FROM pg_tables 
    WHERE schemaname = 'public' AND tablename = ANY($1)
  `, [tables]);
  
  results.rls = rlsTables;
  
  return results;
}

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  
  console.log('🔍 Validating schema...\n');
  const results = await validateSchema(client);
  
  console.log(JSON.stringify(results, null, 2));
  
  if (results.errors.length > 0) {
    console.error('\n❌ Validation failed!');
    process.exit(1);
  }
  
  console.log('\n✅ Schema validation passed!');
  await client.end();
}

main().catch(console.error);
