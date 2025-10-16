const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

// Load environment variables
require("dotenv").config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function runMigration(migrationFile) {
  console.log(`Running migration: ${migrationFile}`);

  const sql = fs.readFileSync(
    path.join(__dirname, "..", "migrations", migrationFile),
    "utf8",
  );

  const { data, error } = await supabase.rpc("exec_sql", { sql_query: sql });

  if (error) {
    console.error(`Error running ${migrationFile}:`, error);
    return false;
  }

  console.log(`✅ ${migrationFile} completed successfully`);
  return true;
}

async function main() {
  const migrations = [
    "001_create_roles_users.sql",
    "002_patients_doctors_appointments.sql",
    "003_insurance_payments_claims.sql",
    "004_translations.sql",
    "005_reports_metrics.sql",
  ];

  console.log("Starting database migrations...");

  for (const migration of migrations) {
    const success = await runMigration(migration);
    if (!success) {
      console.error(`Migration ${migration} failed. Stopping.`);
      process.exit(1);
    }
  }

  console.log("All migrations completed successfully!");
}

main().catch(console.error);
