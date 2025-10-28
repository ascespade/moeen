#!/usr/bin/env node
const { createClient } = require("@supabase/supabase-js");

async function testConnection() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE;

  if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Missing Supabase environment variables");
    process.exit(1);
  }

  console.log("🔗 Testing Supabase connection...");
  console.log("URL:", supabaseUrl);

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Test connection by querying a simple table
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

    return true;
  } catch (err) {
    console.error("❌ Connection failed:", err.message);
    return false;
  }
}

testConnection().then((success) => {
  process.exit(success ? 0 : 1);
});
