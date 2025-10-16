const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");
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

async function applyMigration(migrationFile) {
  console.log(`Applying migration: ${migrationFile}`);

  const sql = fs.readFileSync(
    path.join(__dirname, "..", "supabase", "migrations", migrationFile),
    "utf8",
  );

  // Split SQL into individual statements
  const statements = sql
    .split(";")
    .map((stmt) => stmt.trim())
    .filter((stmt) => stmt.length > 0 && !stmt.startsWith("--"));

  for (const statement of statements) {
    if (statement.trim()) {
      try {
        const { data, error } = await supabase.rpc("exec_sql", {
          sql_query: statement,
        });
        if (error) {
          console.error(
            `Error in statement: ${statement.substring(0, 100)}...`,
          );
          console.error("Error:", error);
          return false;
        }
      } catch (err) {
        console.error(
          `Exception in statement: ${statement.substring(0, 100)}...`,
        );
        console.error("Exception:", err.message);
        return false;
      }
    }
  }

  console.log(`✅ ${migrationFile} applied successfully`);
  return true;
}

async function main() {
  const migrations = [
    "033_roles_users_system.sql",
    "034_patients_doctors_appointments.sql",
    "035_insurance_payments_claims.sql",
    "036_reports_metrics.sql",
  ];

  console.log("Starting Supabase migrations...");

  for (const migration of migrations) {
    const success = await applyMigration(migration);
    if (!success) {
      console.error(`Migration ${migration} failed. Stopping.`);
      process.exit(1);
    }
  }

  console.log("All migrations completed successfully!");
}

main().catch(console.error);
