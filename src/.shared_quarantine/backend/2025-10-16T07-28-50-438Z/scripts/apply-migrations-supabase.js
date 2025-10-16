#!/usr/bin/env node
const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

async function applyMigrations() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE;

  if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Missing Supabase environment variables");
    process.exit(1);
  }

  console.log("🚀 Starting database migration process...");
  console.log("📦 Project:", supabaseUrl);

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Migration files in order
  const migrations = [
    "001_add_public_id_core_tables.sql",
    "010_chatbot_tables.sql",
    "011_chatbot_indexes.sql",
    "012_chatbot_rls.sql",
    "020_crm_tables.sql",
    "021_crm_indexes.sql",
    "022_crm_rls.sql",
    "030_system_admin_tables.sql",
    "031_system_rls.sql",
  ];

  let successCount = 0;
  let errorCount = 0;

  for (const migrationFile of migrations) {
    const migrationPath = path.join("supabase", "migrations", migrationFile);

    if (!fs.existsSync(migrationPath)) {
      console.log(`⚠️  Migration file not found: ${migrationFile}`);
      continue;
    }

    console.log(`\n🔄 Applying ${migrationFile}...`);

    try {
      const sql = fs.readFileSync(migrationPath, "utf8");

      // Split SQL into individual statements
      const statements = sql
        .split(";")
        .map((stmt) => stmt.trim())
        .filter((stmt) => stmt.length > 0 && !stmt.startsWith("--"));

      for (const statement of statements) {
        if (statement.trim()) {
          const { error } = await supabase.rpc("exec_sql", { sql: statement });
          if (error) {
            console.error(
              `❌ Error in statement: ${statement.substring(0, 50)}...`,
            );
            console.error(`   ${error.message}`);
            errorCount++;
          }
        }
      }

      console.log(`✅ ${migrationFile} applied successfully`);
      successCount++;
    } catch (error) {
      console.error(`❌ Failed to apply ${migrationFile}:`, error.message);
      errorCount++;
    }
  }

  console.log(`\n📊 Migration Summary:`);
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${errorCount}`);

  if (errorCount === 0) {
    console.log("\n🎉 All migrations completed successfully!");

    // Test the schema
    console.log("\n🔍 Testing schema...");
    await testSchema(supabase);
  } else {
    console.log("\n⚠️  Some migrations failed. Check the errors above.");
    process.exit(1);
  }
}

async function testSchema(supabase) {
  try {
    // Test if key tables exist
    const tables = [
      "users",
      "patients",
      "appointments",
      "chatbot_flows",
      "crm_leads",
    ];

    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select("count")
        .limit(1);

      if (error) {
        console.log(`⚠️  Table ${table}: ${error.message}`);
      } else {
        console.log(`✅ Table ${table}: OK`);
      }
    }

    console.log("\n✅ Schema validation completed!");
  } catch (error) {
    console.error("❌ Schema validation failed:", error.message);
  }
}

applyMigrations().catch(console.error);
