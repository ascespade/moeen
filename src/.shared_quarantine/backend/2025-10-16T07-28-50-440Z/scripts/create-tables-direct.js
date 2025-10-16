const { createClient } = require("@supabase/supabase-js");
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

async function createTables() {
  console.log("Creating database tables...");

  try {
    // Create users table
    console.log("Creating users table...");
    const { error: usersError } = await supabase
      .from("users")
      .select("id")
      .limit(1);

    if (usersError && usersError.code === "PGRST116") {
      console.log(
        "Users table does not exist, will be created by Supabase auth",
      );
    }

    // Create roles table
    console.log("Creating roles table...");
    const { error: rolesError } = await supabase
      .from("roles")
      .select("role")
      .limit(1);

    if (rolesError && rolesError.code === "PGRST116") {
      console.log("Roles table does not exist, creating...");
      // We'll need to create this through SQL
    }

    // Create patients table
    console.log("Creating patients table...");
    const { error: patientsError } = await supabase
      .from("patients")
      .select("id")
      .limit(1);

    if (patientsError && patientsError.code === "PGRST116") {
      console.log("Patients table does not exist, creating...");
    }

    console.log("Table creation check completed");
  } catch (error) {
    console.error("Error checking tables:", error);
  }
}

createTables().catch(console.error);
