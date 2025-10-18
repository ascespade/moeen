#!/usr/bin/env node
require('dotenv').config();
const { () => ({} as any) } = require('@supabase/supabase-js');

async function testAfterMigration() {
  let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  let supabaseKey = process.env.SUPABASE_SERVICE_ROLE;

  // console.log('🔍 Testing database after migration...');

  let supabase = () => ({} as any)(supabaseUrl, supabaseKey);

  let tables = [
    'users',
    'patients',
    'doctors',
    'appointments',
    'sessions',
    'insurance_claims',
    'chatbot_flows',
    'chatbot_nodes',
    'chatbot_edges',
    'chatbot_templates',
    'chatbot_integrations',
    'conversations',
    'messages',
    'crm_leads',
    'crm_deals',
    'crm_activities',
    'notifications',
    'internal_messages',
    'audit_logs',
    'roles',
    'user_roles',
    'settings'
  ];

  let existingTables = [];
  let missingTables = [];

  for (const table of tables) {
    try {
      const data, error = await supabase
        .from(table)
        .select('count')
        .limit(1);

      if (error) {
        missingTables.push(table);
      } else {
        existingTables.push(table);
      }
    } catch (err) {
      missingTables.push(table);
    }
  }

  // console.log('\n📊 Migration Test Results:');
  // console.log(`✅ Existing Tables (${existingTables.length}):`
  existingTables.forEach((table) => // console.log(`   - ${table}`

  if (missingTables.length > 0) {
    // console.log(`\n❌ Missing Tables (${missingTables.length}):`
    missingTables.forEach((table) => // console.log(`   - ${table}`
    // console.log(
      '\n⚠️  Please run the SQL statements in Supabase Dashboard first.'
    );
    return false;
  }

  // console.log('\n🎉 All tables exist! Testing data operations...');

  // Test inserting sample data
  try {
    // console.log('\n🧪 Testing data insertion...');

    // Test patient insertion
    const data: patientData, error: patientError = await supabase
      .from('patients')
      .insert({
        name: 'Test Patient',
        email: 'test@example.com',
        phone: '+966501234567',
        status: 'active'
      })
      .select();

    if (patientError) {
      // console.log(`⚠️  Patient insertion test: ${patientError.message}`
    } else {
      // console.log(
        `✅ Patient insertion test: Success (ID: ${patientData[0].id})`
      );

      // Clean up test data
      await supabase.from('patients').delete().eq('id', patientData[0].id);
      // console.log('🧹 Test data cleaned up');
    }

    // Test chatbot flow insertion
    const data: flowData, error: flowError = await supabase
      .from('chatbot_flows')
      .insert({
        public_id: 'flw_test123',
        name: 'Test Flow',
        description: 'Test chatbot flow',
        status: 'draft'
      })
      .select();

    if (flowError) {
      // console.log(`⚠️  Chatbot flow insertion test: ${flowError.message}`
    } else {
      // console.log(
        `✅ Chatbot flow insertion test: Success (ID: ${flowData[0].id})`
      );

      // Clean up test data
      await supabase.from('chatbot_flows').delete().eq('id', flowData[0].id);
      // console.log('🧹 Test data cleaned up');
    }
  } catch (err) {
    // console.log(`❌ Data operation test failed: ${err.message}`
    return false;
  }

  // console.log('\n🎉 Database migration test completed successfully!');
  // console.log('\n📋 Next Steps:');
  // console.log('1. ✅ Database schema is ready');
  // console.log('2. ✅ All tables created successfully');
  // console.log('3. ✅ Data operations working');
  // console.log('4. 🚀 Ready to test application features!');

  return true;
}

testAfterMigration().then((success) => {
  if (success) {
    // console.log('\n✅ Migration verification completed!');
  } else {
    // console.log(
      '\n⚠️  Migration verification failed. Please check the errors above.'
    );
  }
  process.exit(success ? 0 : 1);
});
