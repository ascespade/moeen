#!/usr/bin/env node
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function checkMigrationStatus() {
  console.log('🔍 Checking Healthcare System Migration Status');
  console.log('==============================================');
  console.log(`📦 Project: ${supabaseUrl}`);
  console.log('');

  // Test basic connection
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('⚠️  Users table not found (expected for new database)');
      console.log('✅ Connection successful - ready for migrations');
    } else {
      console.log('✅ Connection successful - found users table');
    }
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('1. Check Supabase status: https://status.supabase.com/');
    console.log('2. Verify your API keys in .env.local');
    console.log('3. Wait a few minutes and try again');
    console.log('4. Check if your IP is blocked');
    return;
  }

  // Check for key tables
  const tablesToCheck = [
    'users',
    'patients', 
    'doctors',
    'appointments',
    'sessions',
    'insurance_claims',
    'conversations',
    'messages',
    'chatbot_conversations',
    'crm_leads',
    'settings',
    'translations'
  ];

  console.log('');
  console.log('📊 Checking database tables:');
  
  let existingTables = 0;
  let missingTables = 0;

  for (const table of tablesToCheck) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('count')
        .limit(1);

      if (error) {
        console.log(`❌ ${table}: Not found`);
        missingTables++;
      } else {
        console.log(`✅ ${table}: Exists`);
        existingTables++;
      }
    } catch (err) {
      console.log(`❌ ${table}: Error - ${err.message}`);
      missingTables++;
    }
  }

  console.log('');
  console.log('📈 Migration Status Summary:');
  console.log(`✅ Tables found: ${existingTables}`);
  console.log(`❌ Tables missing: ${missingTables}`);
  console.log(`📊 Completion: ${Math.round((existingTables / tablesToCheck.length) * 100)}%`);

  if (missingTables === 0) {
    console.log('');
    console.log('🎉 All migrations appear to be complete!');
    console.log('🚀 You can start the application with: npm run dev');
  } else if (existingTables > 0) {
    console.log('');
    console.log('⚠️  Partial migration detected.');
    console.log('🔧 Run: ./apply-migrations-when-ready.sh');
  } else {
    console.log('');
    console.log('📋 No tables found - ready for initial migration.');
    console.log('🔧 Run: ./apply-migrations-when-ready.sh');
  }
}

checkMigrationStatus().catch(console.error);
