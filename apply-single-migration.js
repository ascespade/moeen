#!/usr/bin/env node
require("dotenv").config({ path: ".env.local" });
const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function applyMigration(migrationFile) {
  console.log(`🔄 Applying migration: ${migrationFile}`);

  const migrationPath = path.join(
    __dirname,
    "supabase",
    "migrations",
    migrationFile,
  );

  if (!fs.existsSync(migrationPath)) {
    console.error(`❌ Migration file not found: ${migrationPath}`);
    return false;
  }

  const sql = fs.readFileSync(migrationPath, "utf8");

  // Split SQL into individual statements
  const statements = sql
    .split(";")
    .map((stmt) => stmt.trim())
    .filter((stmt) => stmt.length > 0 && !stmt.startsWith("--"));

  let successCount = 0;
  let totalStatements = statements.length;

  for (const statement of statements) {
    if (statement.trim()) {
      try {
        // Try using the REST API directly
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${supabaseServiceKey}`,
            apikey: supabaseServiceKey,
          },
          body: JSON.stringify({ sql_query: statement }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(
            `❌ Error in statement: ${statement.substring(0, 100)}...`,
          );
          console.error(
            `   HTTP ${response.status}: ${errorText.substring(0, 200)}...`,
          );
          return false;
        }

        successCount++;
        console.log(`✅ Statement executed successfully`);
      } catch (err) {
        console.error(
          `❌ Exception in statement: ${statement.substring(0, 100)}...`,
        );
        console.error(`   Error: ${err.message}`);
        return false;
      }
    }
  }

  console.log(
    `✅ ${migrationFile} applied successfully (${successCount}/${totalStatements} statements)`,
  );
  return true;
}

async function main() {
  const migrationFile = process.argv[2] || "001_create_core_tables_fixed.sql";

  console.log("🚀 Starting single migration process...");
  console.log(`📦 Project: ${supabaseUrl}`);

  // Test connection first
  try {
    const { data, error } = await supabase
      .from("users")
      .select("count")
      .limit(1);

    if (error) {
      console.log("⚠️  Users table not found (expected for new database)");
    } else {
      console.log("✅ Database connection successful");
    }
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    return;
  }

  const success = await applyMigration(migrationFile);

  if (success) {
    console.log("\n🎉 Migration completed successfully!");
  } else {
    console.log("\n❌ Migration failed!");
    process.exit(1);
  }
}

main().catch(console.error);
