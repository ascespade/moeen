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

async function runMigration(filePath) {
  try {
    console.log(`Running migration: ${filePath}`);
    const sql = fs.readFileSync(filePath, 'utf8');
    
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
      console.error(`Error running migration ${filePath}:`, error);
      return false;
    }
    
    console.log(`✅ Migration ${filePath} completed successfully`);
    return true;
  } catch (err) {
    console.error(`Error reading migration ${filePath}:`, err);
    return false;
  }
}

async function main() {
  const migrationsDir = './migrations';
  const migrationFiles = [
    '001_create_roles_users.sql',
    '002_patients_doctors_appointments.sql',
    '003_insurance_payments_claims.sql',
    '004_translations.sql',
    '005_reports_metrics.sql'
  ];

  console.log('Starting database migrations...');
  
  for (const file of migrationFiles) {
    const filePath = path.join(migrationsDir, file);
    if (fs.existsSync(filePath)) {
      const success = await runMigration(filePath);
      if (!success) {
        console.error(`Migration ${file} failed, stopping...`);
        process.exit(1);
      }
    } else {
      console.warn(`Migration file ${file} not found, skipping...`);
    }
  }
  
  console.log('All migrations completed successfully!');
}

main().catch(console.error);