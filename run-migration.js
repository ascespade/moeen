#!/usr/bin/env node
require("dotenv").config({ path: ".env.local" });

// Set the environment variable that the script expects
process.env.SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Now run the existing migration script
require("./scripts/create-tables-supabase.js");
