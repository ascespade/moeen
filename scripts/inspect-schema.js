// Deep schema inspection
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectSchema() {
  console.log('\n🔍 فحص Schema بالتفصيل...\n');

  try {
    // Get users table columns
    console.log('👥 جدول users:\n');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(1);

    if (usersError) {
      console.log('❌ خطأ:', usersError.message);
    } else if (users && users[0]) {
      console.log('الأعمدة الموجودة:');
      Object.keys(users[0]).forEach(col => console.log(`  - ${col}`));
    }

    // Check appointments
    console.log('\n📅 جدول appointments:\n');
    const { data: appointments, error: appError } = await supabase
      .from('appointments')
      .select('*')
      .limit(1);

    if (appError) {
      console.log('❌ خطأ:', appError.message);
    } else if (appointments && appointments[0]) {
      console.log('الأعمدة الموجودة:');
      Object.keys(appointments[0]).forEach(col => console.log(`  - ${col}`));
    }

    // Try to query session_types directly
    console.log('\n🔍 محاولة الوصول لـ session_types...\n');
    const { data: sessionTypes, error: stError } = await supabase
      .from('session_types')
      .select('*')
      .limit(1);

    if (stError) {
      console.log('❌ session_types غير موجود:', stError.message);
      console.log('\n⚠️  يجب تطبيق migrations 070-073 أولاً!\n');
    } else {
      console.log('✅ session_types موجود!');
      if (sessionTypes && sessionTypes[0]) {
        console.log('الأعمدة:');
        Object.keys(sessionTypes[0]).forEach(col => console.log(`  - ${col}`));
      } else {
        console.log('⚠️  الجدول فارغ (يحتاج seed)');
      }
    }

  } catch (error) {
    console.error('\n❌ خطأ:', error.message);
  }
}

inspectSchema();
