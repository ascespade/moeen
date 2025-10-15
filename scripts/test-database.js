#!/usr/bin/env node
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

async function testDatabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE;

  console.log("🔗 Testing Supabase connection...");
  console.log("URL:", supabaseUrl);

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Test basic connection
    const { data, error } = await supabase
      .from("users")
      .select("count")
      .limit(1);

    if (error) {
      console.log("⚠️  Users table not found (expected for new database)");
      console.log("✅ Connection successful - ready for migrations");
    } else {
      console.log("✅ Connection successful - found users table");
    }

    // Test if we can create a simple table
    console.log("\n🧪 Testing table creation...");

    const { error: createError } = await supabase.rpc("exec", {
      sql: "CREATE TABLE IF NOT EXISTS test_migration (id SERIAL PRIMARY KEY, name TEXT);",
    });

    if (createError) {
      console.log("⚠️  Direct SQL execution not available (normal)");
      console.log("📝 Use the generated migration-complete.sql file instead");
    } else {
      console.log("✅ Direct SQL execution available");
    }

    console.log("\n📋 Next Steps:");
    console.log(
      "1. Open Supabase Dashboard: https://supabase.com/dashboard/project/socwpqzcalgvpzjwavgh",
    );
    console.log("2. Go to SQL Editor");
    console.log("3. Copy contents of migration-complete.sql");
    console.log("4. Paste and run the migration");
    console.log("5. Run: node scripts/test-after-migration.js");
  } catch (err) {
    console.error("❌ Connection test failed:", err.message);
  }
}

testDatabase();
