#!/usr/bin/env node
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");

async function applyMigrationDirectly() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE;

  console.log("🚀 Applying database migration directly...");

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Read the complete migration file
  const migrationSQL = fs.readFileSync("migration-complete.sql", "utf8");

  // Split into individual statements
  const statements = migrationSQL
    .split(";")
    .map((stmt) => stmt.trim())
    .filter(
      (stmt) =>
        stmt.length > 0 && !stmt.startsWith("--") && !stmt.startsWith("/*"),
    );

  let successCount = 0;
  let errorCount = 0;

  console.log(`📝 Found ${statements.length} SQL statements to execute`);

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    if (statement.trim()) {
      console.log(`\n🔄 Executing statement ${i + 1}/${statements.length}...`);
      console.log(`   ${statement.substring(0, 100)}...`);

      try {
        // Use the SQL editor approach
        const { data, error } = await supabase.rpc("exec_sql", {
          sql: statement + ";",
        });

        if (error) {
          console.error(`❌ Error: ${error.message}`);
          errorCount++;
        } else {
          console.log(`✅ Success`);
          successCount++;
        }
      } catch (err) {
        console.error(`❌ Exception: ${err.message}`);
        errorCount++;
      }
    }
  }

  console.log(`\n📊 Migration Results:`);
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${errorCount}`);

  if (errorCount === 0) {
    console.log("\n🎉 Migration completed successfully!");
    return true;
  } else {
    console.log("\n⚠️  Some statements failed. Check errors above.");
    return false;
  }
}

applyMigrationDirectly().then((success) => {
  if (success) {
    console.log("\n✅ Ready to test the application!");
  }
  process.exit(success ? 0 : 1);
});
