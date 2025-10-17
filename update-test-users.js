#!/usr/bin/env node
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function ensureTestUsers() {
  console.log('🔧 Ensuring test users exist...\n');
  
  const testUsers = [
    { email: 'admin@moeen.com', password: 'admin123', name: 'مدير النظام', role: 'admin' },
    { email: 'supervisor@moeen.com', password: 'super123', name: 'المشرف', role: 'supervisor' },
    { email: 'test@moeen.com', password: 'test123', name: 'مريض تجريبي', role: 'agent' },
    { email: 'user@moeen.com', password: 'user123', name: 'موظف', role: 'user' },
    { email: 'doctor@moeen.com', password: 'doctor123', name: 'الطبيب', role: 'agent' },
  ];

  for (const user of testUsers) {
    console.log(`Checking ${user.role}: ${user.email}`);
    
    // Check if user exists in auth
    const { data: existingUser } = await supabase.auth.admin.listUsers();
    const userExists = existingUser?.users?.find(u => u.email === user.email);
    
    if (!userExists) {
      // Create new user
      const { data: authData, error } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: { name: user.name, role: user.role }
      });
      
      if (error) {
        console.log(`  ⚠️  Auth error: ${error.message}`);
      } else {
        console.log(`  ✅ Created in auth`);
        
        // Add to users table
        await supabase.from('users').upsert({
          id: authData.user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          status: 'active',
          is_active: true,
          language: 'ar',
          timezone: 'Asia/Riyadh'
        });
        console.log(`  ✅ Added to database`);
      }
    } else {
      console.log(`  ✅ Already exists`);
    }
  }
  
  console.log('\n✅ All test users ready!');
}

ensureTestUsers();
