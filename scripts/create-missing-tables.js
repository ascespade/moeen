#!/usr/bin/env node
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

async function createMissingTables() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE;

  console.log("🚀 Creating missing database tables...");

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Create a simple test table first to verify we can create tables
  console.log("\n🧪 Testing table creation capability...");

  try {
    // Try to create a simple test table
    const { error } = await supabase.rpc("create_test_table");

    if (error) {
      console.log("⚠️  Direct table creation not available via RPC");
      console.log("📝 Using alternative approach...");

      // Try to insert into a table that might not exist to trigger creation
      const { error: insertError } = await supabase
        .from("patients")
        .insert({ name: "Test Patient", email: "test@example.com" });

      if (insertError) {
        console.log("✅ Confirmed: patients table needs to be created");
        console.log("📋 Manual creation required via SQL Editor");
      }
    }
  } catch (err) {
    console.log("✅ Confirmed: Manual table creation required");
  }

  // Generate the SQL for manual execution
  console.log("\n📝 SQL Statements for Manual Execution:");
  console.log("=".repeat(60));

  const missingTables = [
    {
      name: "patients",
      sql: `CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  date_of_birth DATE,
  gender VARCHAR(20),
  address TEXT,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);`,
    },
    {
      name: "doctors",
      sql: `CREATE TABLE IF NOT EXISTS doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  specialty VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);`,
    },
    {
      name: "appointments",
      sql: `CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE,
  patient_id UUID REFERENCES patients(id),
  doctor_id UUID REFERENCES doctors(id),
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  status VARCHAR(50) DEFAULT 'scheduled',
  type VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);`,
    },
    {
      name: "sessions",
      sql: `CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE,
  appointment_id UUID REFERENCES appointments(id),
  doctor_id UUID REFERENCES doctors(id),
  patient_id UUID REFERENCES patients(id),
  session_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME,
  diagnosis TEXT,
  treatment_plan TEXT,
  prescription TEXT,
  notes TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);`,
    },
    {
      name: "insurance_claims",
      sql: `CREATE TABLE IF NOT EXISTS insurance_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE,
  patient_id UUID REFERENCES patients(id),
  appointment_id UUID REFERENCES appointments(id),
  claim_number VARCHAR(100) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  submission_date DATE NOT NULL,
  approval_date DATE,
  rejection_reason TEXT,
  attachments TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);`,
    },
    {
      name: "chatbot_flows",
      sql: `CREATE TABLE IF NOT EXISTS chatbot_flows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'draft',
  version INTEGER DEFAULT 1,
  created_by UUID REFERENCES users(id),
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);`,
    },
    {
      name: "chatbot_nodes",
      sql: `CREATE TABLE IF NOT EXISTS chatbot_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL,
  flow_id UUID REFERENCES chatbot_flows(id) ON DELETE CASCADE,
  node_type VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  config JSONB NOT NULL,
  position_x INTEGER DEFAULT 0,
  position_y INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);`,
    },
    {
      name: "chatbot_edges",
      sql: `CREATE TABLE IF NOT EXISTS chatbot_edges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL,
  flow_id UUID REFERENCES chatbot_flows(id) ON DELETE CASCADE,
  source_node_id UUID REFERENCES chatbot_nodes(id) ON DELETE CASCADE,
  target_node_id UUID REFERENCES chatbot_nodes(id) ON DELETE CASCADE,
  condition JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);`,
    },
    {
      name: "chatbot_templates",
      sql: `CREATE TABLE IF NOT EXISTS chatbot_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  language VARCHAR(10) DEFAULT 'ar',
  content TEXT NOT NULL,
  variables JSONB,
  is_approved BOOLEAN DEFAULT false,
  created_by UUID REFERENCES users(id),
  approved_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);`,
    },
    {
      name: "chatbot_integrations",
      sql: `CREATE TABLE IF NOT EXISTS chatbot_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL,
  provider VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  config JSONB NOT NULL,
  status VARCHAR(50) DEFAULT 'inactive',
  webhook_url VARCHAR(500),
  webhook_secret VARCHAR(255),
  last_health_check TIMESTAMP,
  health_status VARCHAR(50) DEFAULT 'unknown',
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);`,
    },
    {
      name: "crm_leads",
      sql: `CREATE TABLE IF NOT EXISTS crm_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  company VARCHAR(255),
  source VARCHAR(100),
  status VARCHAR(50) DEFAULT 'new',
  score INTEGER DEFAULT 0,
  notes TEXT,
  owner_id UUID REFERENCES users(id),
  assigned_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);`,
    },
    {
      name: "crm_deals",
      sql: `CREATE TABLE IF NOT EXISTS crm_deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  value DECIMAL(12,2),
  currency VARCHAR(10) DEFAULT 'SAR',
  stage VARCHAR(50) DEFAULT 'prospecting',
  probability INTEGER DEFAULT 0,
  expected_close_date DATE,
  actual_close_date DATE,
  owner_id UUID REFERENCES users(id),
  contact_id UUID REFERENCES patients(id),
  lead_id UUID REFERENCES crm_leads(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);`,
    },
    {
      name: "crm_activities",
      sql: `CREATE TABLE IF NOT EXISTS crm_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL,
  type VARCHAR(50) NOT NULL,
  subject VARCHAR(255) NOT NULL,
          description TEXT,
          due_date DATE,
          due_time TIME,
          status VARCHAR(50) DEFAULT 'pending',
          priority VARCHAR(20) DEFAULT 'medium',
          owner_id UUID REFERENCES users(id),
          contact_id UUID REFERENCES patients(id),
          deal_id UUID REFERENCES crm_deals(id),
          completed_at TIMESTAMP,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );`,
    },
    {
      name: "internal_messages",
      sql: `CREATE TABLE IF NOT EXISTS internal_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL,
  sender_id UUID REFERENCES users(id),
  recipient_id UUID REFERENCES users(id),
  subject VARCHAR(255),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  parent_message_id UUID REFERENCES internal_messages(id),
  created_at TIMESTAMP DEFAULT NOW(),
  read_at TIMESTAMP
);`,
    },
    {
      name: "settings",
      sql: `CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(255) UNIQUE NOT NULL,
  key VARCHAR(255) UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  category VARCHAR(100) DEFAULT 'general',
  is_public BOOLEAN DEFAULT false,
  updated_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);`,
    },
  ];

  for (const table of missingTables) {
    console.log(`\n-- Creating table: ${table.name}`);
    console.log(table.sql);
    console.log("");
  }

  console.log("=".repeat(60));
  console.log("\n📋 Instructions:");
  console.log("1. Copy all SQL statements above");
  console.log("2. Go to Supabase Dashboard > SQL Editor");
  console.log("3. Paste and run the complete script");
  console.log("4. Run: node scripts/test-after-migration.js");
  console.log(
    "\n🔗 Dashboard: https://supabase.com/dashboard/project/socwpqzcalgvpzjwavgh",
  );
}

createMissingTables();
