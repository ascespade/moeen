require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyMigrations() {
  console.log('\n🚀 تطبيق Migrations...\n');
  
  const migrations = [
    'supabase/migrations/070_session_types.sql',
    'supabase/migrations/071_therapist_schedules.sql',
    'supabase/migrations/072_iep_system.sql',
    'supabase/migrations/073_supervisor_notifications.sql',
  ];

  for (const migrationFile of migrations) {
    try {
      console.log(`\n📄 تطبيق ${migrationFile}...`);
      
      if (!fs.existsSync(migrationFile)) {
        console.log(`⚠️  الملف غير موجود`);
        continue;
      }
      
      const sql = fs.readFileSync(migrationFile, 'utf8');
      
      // Execute SQL using Supabase (need to use raw SQL endpoint or psql)
      console.log(`   ${sql.split('\n').length} سطر SQL`);
      console.log('   ⚠️  يحتاج تطبيق يدوي أو عبر psql');
      
    } catch (error) {
      console.error(`❌ خطأ في ${migrationFile}:`, error.message);
    }
  }
  
  console.log('\n💡 لتطبيق Migrations، استخدم إحدى الطرق:\n');
  console.log('الطريقة 1: Supabase Dashboard');
  console.log('  → افتح Supabase Dashboard');
  console.log('  → SQL Editor');
  console.log('  → انسخ والصق كل migration');
  console.log('  → Run\n');
  
  console.log('الطريقة 2: psql (إذا متوفر DATABASE_URL):');
  console.log('  $ psql $DATABASE_URL -f supabase/migrations/070_session_types.sql');
  console.log('  $ psql $DATABASE_URL -f supabase/migrations/071_therapist_schedules.sql');
  console.log('  $ psql $DATABASE_URL -f supabase/migrations/072_iep_system.sql');
  console.log('  $ psql $DATABASE_URL -f supabase/migrations/073_supervisor_notifications.sql\n');
}

applyMigrations();
