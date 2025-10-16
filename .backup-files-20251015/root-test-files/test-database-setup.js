#!/usr/bin/env node
require("dotenv").config({ path: ".env.local" });
const { createClient } = require("@supabase/supabase-js");

async function testDatabaseSetup() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE;

  if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Missing Supabase environment variables");
    console.error(
      "Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY",
    );
    process.exit(1);
  }

  console.log("🔍 Testing database setup...");
  console.log(`📡 Supabase URL: ${supabaseUrl}`);

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Test basic connection
    console.log("\n1️⃣ Testing basic connection...");
    const { data: healthData, error: healthError } = await supabase
      .from("settings")
      .select("key, value")
      .eq("key", "app_name")
      .single();

    if (healthError) {
      console.log("❌ Database connection failed:", healthError.message);
      console.log("\n📋 Next Steps:");
      console.log("1. Go to Supabase Dashboard > SQL Editor");
      console.log("2. Copy and run the contents of setup-database.sql");
      console.log("3. Run this script again");
      return false;
    }

    console.log("✅ Database connection successful");
    console.log(`📱 App Name: ${healthData?.value}`);

    // Test core tables
    console.log("\n2️⃣ Testing core tables...");
    const tables = [
      "users",
      "patients",
      "doctors",
      "appointments",
      "sessions",
      "insurance_claims",
    ];

    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select("count")
          .limit(1);

        if (error) {
          console.log(`❌ Table ${table}: ${error.message}`);
        } else {
          console.log(`✅ Table ${table}: OK`);
        }
      } catch (err) {
        console.log(`❌ Table ${table}: ${err.message}`);
      }
    }

    // Test chatbot tables
    console.log("\n3️⃣ Testing chatbot tables...");
    const chatbotTables = [
      "chatbot_flows",
      "chatbot_intents",
      "chatbot_conversations",
      "chatbot_messages",
    ];

    for (const table of chatbotTables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select("count")
          .limit(1);

        if (error) {
          console.log(`❌ Table ${table}: ${error.message}`);
        } else {
          console.log(`✅ Table ${table}: OK`);
        }
      } catch (err) {
        console.log(`❌ Table ${table}: ${err.message}`);
      }
    }

    // Test CRM tables
    console.log("\n4️⃣ Testing CRM tables...");
    const crmTables = ["crm_leads", "crm_deals", "crm_activities"];

    for (const table of crmTables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select("count")
          .limit(1);

        if (error) {
          console.log(`❌ Table ${table}: ${error.message}`);
        } else {
          console.log(`✅ Table ${table}: OK`);
        }
      } catch (err) {
        console.log(`❌ Table ${table}: ${err.message}`);
      }
    }

    // Test authentication
    console.log("\n5️⃣ Testing authentication...");
    try {
      const { data: testUser, error: userError } = await supabase
        .from("users")
        .select("id, email, name, role")
        .eq("email", "test@moeen.com")
        .single();

      if (userError) {
        console.log(`❌ Test user not found: ${userError.message}`);
      } else {
        console.log(`✅ Test user found: ${testUser.name} (${testUser.email})`);
      }
    } catch (err) {
      console.log(`❌ User test failed: ${err.message}`);
    }

    // Test chatbot intents
    console.log("\n6️⃣ Testing chatbot intents...");
    try {
      const { data: intents, error: intentsError } = await supabase
        .from("chatbot_intents")
        .select("name, action_type, keywords")
        .eq("is_active", true);

      if (intentsError) {
        console.log(`❌ Chatbot intents error: ${intentsError.message}`);
      } else {
        console.log(`✅ Found ${intents.length} active chatbot intents`);
        intents.forEach((intent) => {
          console.log(`   - ${intent.name} (${intent.action_type})`);
        });
      }
    } catch (err) {
      console.log(`❌ Chatbot intents test failed: ${err.message}`);
    }

    console.log("\n🎉 Database setup test completed!");
    console.log("\n📋 Next Steps:");
    console.log("1. If all tests passed, your database is ready");
    console.log("2. You can now test the login functionality");
    console.log("3. Run: npm run dev to start the application");

    return true;
  } catch (error) {
    console.error("❌ Database test failed:", error.message);
    return false;
  }
}

testDatabaseSetup().then((success) => {
  process.exit(success ? 0 : 1);
});
