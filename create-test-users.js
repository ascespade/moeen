#!/usr/bin/env node
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const testUsers = [
  { email: 'admin@moeen.com', password: 'admin123', name: 'Admin Test', role: 'admin' },
  { email: 'supervisor@moeen.com', password: 'super123', name: 'Supervisor Test', role: 'supervisor' },
  { email: 'patient@moeen.com', password: 'patient123', name: 'Patient Test', role: 'patient' },
  { email: 'staff@moeen.com', password: 'staff123', name: 'Staff Test', role: 'staff' },
  { email: 'doctor@moeen.com', password: 'doctor123', name: 'Doctor Test', role: 'doctor' },
];

async function createTestUsers() {
  console.log('🚀 Creating test users...\n');
  
  for (const user of testUsers) {
    console.log(`Creating ${user.role}: ${user.email}`);
    
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          name: user.name,
          role: user.role
        }
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          console.log(`  ⚠️  User already exists, updating...`);
          
          // Update existing user
          const { data: users } = await supabase
            .from('users')
            .update({ 
              name: user.name,
              role: user.role,
              status: 'active',
              is_active: true
            })
            .eq('email', user.email)
            .select();
            
          console.log(`  ✅ Updated ${user.role}`);
        } else {
          console.error(`  ❌ Error: ${authError.message}`);
        }
        continue;
      }

      if (authData.user) {
        // Create/update user in users table
        const { error: dbError } = await supabase
          .from('users')
          .upsert({
            id: authData.user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            status: 'active',
            is_active: true,
            timezone: 'Asia/Riyadh',
            language: 'ar'
          });

        if (dbError) {
          console.error(`  ❌ DB Error: ${dbError.message}`);
        } else {
          console.log(`  ✅ Created ${user.role} successfully`);
        }
      }
    } catch (err) {
      console.error(`  ❌ Exception: ${err.message}`);
    }
  }
  
  console.log('\n✅ Test users setup complete!');
  console.log('\nCredentials:');
  testUsers.forEach(u => {
    console.log(`  ${u.role.padEnd(12)} | ${u.email.padEnd(25)} | ${u.password}`);
  });
}

createTestUsers().catch(console.error);
