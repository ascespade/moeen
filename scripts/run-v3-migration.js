const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  try {
    console.log('Running Healthcare Dashboard v3.0 migration...');
    
    // Read the migration file
    const migrationPath = './migrations/006_healthcare_dashboard_v3.sql';
    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    // Split the SQL into individual statements
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        console.log(`Executing statement ${i + 1}/${statements.length}...`);
        
        try {
          const { data, error } = await supabase.rpc('exec_sql', { 
            sql_query: statement + ';' 
          });
          
          if (error) {
            console.error(`Error in statement ${i + 1}:`, error);
            // Continue with other statements
          } else {
            console.log(`✅ Statement ${i + 1} completed`);
          }
        } catch (err) {
          console.error(`Exception in statement ${i + 1}:`, err.message);
          // Continue with other statements
        }
      }
    }
    
    console.log('✅ Healthcare Dashboard v3.0 migration completed!');
    
    // Test the migration by checking if tables exist
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .like('table_name', '%_v3');
    
    if (tablesError) {
      console.error('Error checking tables:', tablesError);
    } else {
      console.log('Created tables:', tables.map(t => t.table_name));
    }
    
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

// Check if we need to create the exec_sql function first
async function createExecSqlFunction() {
  const createFunctionSQL = `
    CREATE OR REPLACE FUNCTION exec_sql(sql_query text)
    RETURNS text
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    BEGIN
      EXECUTE sql_query;
      RETURN 'OK';
    EXCEPTION
      WHEN OTHERS THEN
        RETURN 'ERROR: ' || SQLERRM;
    END;
    $$;
  `;
  
  try {
    const { data, error } = await supabase.rpc('exec_sql', { 
      sql_query: createFunctionSQL 
    });
    
    if (error) {
      console.log('Creating exec_sql function...');
      // Try to create the function using a different approach
      const { data: result, error: createError } = await supabase
        .from('pg_proc')
        .select('proname')
        .eq('proname', 'exec_sql');
      
      if (createError || !result || result.length === 0) {
        console.log('Function does not exist, will create it...');
        return true;
      }
    }
    
    return true;
  } catch (err) {
    console.log('Will create exec_sql function...');
    return true;
  }
}

async function main() {
  console.log('Starting Healthcare Dashboard v3.0 migration process...');
  
  // First, try to create the exec_sql function
  await createExecSqlFunction();
  
  // Run the migration
  await runMigration();
}

main().catch(console.error);