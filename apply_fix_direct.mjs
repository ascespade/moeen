/**
 * Apply Database Fix Directly - Using Supabase Service Role
 * تطبيق الإصلاح مباشرة باستخدام Service Role
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE;

if (!supabaseUrl || !serviceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function applyFix() {
  console.log('🔧 Connecting to Supabase Database...\n');
  console.log('URL:', supabaseUrl);
  console.log('');

  try {
    // Step 1: Try to call hash_password RPC function (if exists)
    console.log('1. Checking if hash_password function exists...');
    const { data: hashTest, error: hashError } = await supabase.rpc('hash_password', {
      password_input: 'test123'
    });

    if (hashError) {
      console.log('   ⚠️  hash_password function not found');
      console.log('   💡 We need to create it via SQL Editor first');
      console.log('');
      console.log('   Run this SQL in Supabase SQL Editor:');
      console.log('   File: QUICK_FIX_SQL.sql');
      console.log('');
    } else {
      console.log('   ✅ hash_password function exists');
      console.log('');

      // Step 2: Update existing users
      console.log('2. Updating test users passwords...');
      
      const testUsers = [
        { email: 'admin@test.com', password: 'Admin123!', name: 'Test Admin', role: 'admin' },
        { email: 'doctor@test.com', password: 'Doctor123!', name: 'Test Doctor', role: 'doctor' },
        { email: 'patient@test.com', password: 'Patient123!', name: 'Test Patient', role: 'patient' },
        { email: 'staff@test.com', password: 'Staff123!', name: 'Test Staff', role: 'staff' },
      ];

      for (const userData of testUsers) {
        // Check if user exists
        const { data: user, error: userError } = await supabase
          .from('users')
          .select('id, email, password_hash')
          .eq('email', userData.email)
          .maybeSingle();

        if (userError && userError.code !== 'PGRST116') {
          console.log(`   ⚠️  Error checking ${userData.email}:`, userError.message);
          continue;
        }

        if (user) {
          // User exists - check if needs password
          if (!user.password_hash || user.password_hash === '') {
            // Hash password
            const { data: hashedPassword, error: hashErr } = await supabase.rpc('hash_password', {
              password_input: userData.password
            });

            if (!hashErr && hashedPassword) {
              // Update user
              const { error: updateError } = await supabase
                .from('users')
                .update({
                  password_hash: hashedPassword,
                  name: userData.name,
                  role: userData.role,
                  status: 'active'
                })
                .eq('id', user.id);

              if (updateError) {
                console.log(`   ❌ Failed to update ${userData.email}:`, updateError.message);
              } else {
                console.log(`   ✅ Updated ${userData.email} with password`);
              }
            } else {
              console.log(`   ⚠️  Could not hash password for ${userData.email}:`, hashErr?.message);
            }
          } else {
            console.log(`   ✅ ${userData.email} already has password`);
          }
        } else {
          // User doesn't exist - create with hashed password
          const { data: hashedPassword, error: hashErr } = await supabase.rpc('hash_password', {
            password_input: userData.password
          });

          if (!hashErr && hashedPassword) {
            const { error: insertError } = await supabase
              .from('users')
              .insert({
                email: userData.email,
                password_hash: hashedPassword,
                name: userData.name,
                role: userData.role,
                status: 'active',
              });

            if (insertError) {
              console.log(`   ❌ Failed to create ${userData.email}:`, insertError.message);
            } else {
              console.log(`   ✅ Created ${userData.email}`);
            }
          } else {
            console.log(`   ⚠️  Could not create ${userData.email}:`, hashErr?.message);
          }
        }
      }
    }

    // Step 3: Verify
    console.log('\n3. Verifying results...');
    const { data: users, error: verifyError } = await supabase
      .from('users')
      .select('email, name, role, password_hash')
      .in('email', ['admin@test.com', 'doctor@test.com', 'patient@test.com', 'staff@test.com']);

    if (verifyError) {
      console.error('   ❌ Verification error:', verifyError.message);
    } else {
      console.log(`   ✅ Found ${users?.length || 0} test users`);
      users?.forEach((user) => {
        const hasPassword = user.password_hash && user.password_hash !== '';
        console.log(`   ${hasPassword ? '✅' : '❌'} ${user.email} (${user.role || 'no role'}) - ${hasPassword ? 'Has password' : 'No password'}`);
      });
    }

    console.log('\n✅ Fix applied!');
    console.log('\n📋 Test login at: http://localhost:3001/login');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\n💡 Alternative: Run SQL script in Supabase SQL Editor:');
    console.error('   File: QUICK_FIX_SQL.sql');
  }
}

applyFix();
