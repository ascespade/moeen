// Script to check database schema
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  console.log('\n🔍 فحص اتصال قاعدة البيانات...\n');
  
  try {
    // Test connection
    const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ خطأ في الاتصال:', error.message);
      return;
    }
    
    console.log('✅ الاتصال بقاعدة البيانات ناجح!\n');
    
    // Get all tables
    console.log('📊 الجداول الموجودة:\n');
    
    const tables = [
      'users',
      'patients', 
      'appointments',
      'session_types',
      'therapist_schedules',
      'therapist_specializations',
      'therapist_time_off',
      'ieps',
      'iep_goals',
      'goal_progress',
      'session_notes',
      'call_requests',
      'notification_rules',
      'notifications',
      'payments',
      'insurance_claims',
      'chat_conversations',
      'chat_messages',
    ];
    
    for (const table of tables) {
      try {
        const { count, error: countError } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        if (countError) {
          console.log(`❌ ${table}: غير موجود`);
        } else {
          console.log(`✅ ${table}: ${count} سجل`);
        }
      } catch (err) {
        console.log(`❌ ${table}: خطأ`);
      }
    }
    
    // Check for new tables (from our migrations)
    console.log('\n🆕 الجداول الجديدة المطلوبة:\n');
    
    const newTables = [
      'session_types',
      'therapist_schedules', 
      'therapist_specializations',
      'therapist_time_off',
      'ieps',
      'iep_goals',
      'goal_progress',
      'session_notes',
      'call_requests',
      'notification_rules',
      'supervisor_notification_preferences',
      'notification_logs',
    ];
    
    for (const table of newTables) {
      try {
        const { count, error: countError } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        if (countError) {
          console.log(`⏳ ${table}: يحتاج تطبيق (migration 070-073)`);
        } else {
          console.log(`✅ ${table}: موجود (${count} سجل)`);
        }
      } catch (err) {
        console.log(`⏳ ${table}: يحتاج تطبيق`);
      }
    }
    
  } catch (err) {
    console.error('❌ خطأ:', err.message);
  }
}

checkSchema();
