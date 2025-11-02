/**
 * Script to create test users in Supabase Auth
 * Run with: npx tsx scripts/create-test-users.ts
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase credentials!');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Create admin client
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

interface TestUser {
  email: string;
  password: string;
  role: string;
  name: string;
}

const TEST_USERS: TestUser[] = [
  {
    email: 'admin@test.com',
    password: 'Admin123!',
    role: 'admin',
    name: 'Test Admin',
  },
  {
    email: 'doctor@test.com',
    password: 'Doctor123!',
    role: 'doctor',
    name: 'Test Doctor',
  },
  {
    email: 'patient@test.com',
    password: 'Patient123!',
    role: 'patient',
    name: 'Test Patient',
  },
  {
    email: 'staff@test.com',
    password: 'Staff123!',
    role: 'staff',
    name: 'Test Staff',
  },
];

async function createTestUsers() {
  console.log('🚀 Creating test users in Supabase Auth...\n');

  for (const testUser of TEST_USERS) {
    try {
      console.log(`Creating user: ${testUser.email} (${testUser.role})...`);

      // Try to create user in Supabase Auth
      let authUser: { user: any } | null = null;
      
      const { data: createData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: testUser.email,
        password: testUser.password,
        email_confirm: true,
        user_metadata: {
          name: testUser.name,
          role: testUser.role,
        },
      });

      if (authError) {
        if (authError.message.includes('already registered') || authError.message.includes('already been registered')) {
          console.log(`⚠️  User ${testUser.email} already exists, updating password and metadata...`);
          
          // Get existing user and update password
          const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
          const existingUser = existingUsers?.users.find(u => u.email === testUser.email);
          
          if (existingUser) {
            // Update password and metadata
            const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
              existingUser.id,
              {
                password: testUser.password,
                user_metadata: {
                  name: testUser.name,
                  role: testUser.role,
                },
              }
            );

            if (updateError) {
              console.error(`❌ Failed to update ${testUser.email}:`, updateError.message);
              continue;
            } else {
              console.log(`✅ Updated auth user: ${testUser.email} (ID: ${existingUser.id})`);
              
              // Use existing user for DB creation
              authUser = { user: existingUser };
            }
          } else {
            console.error(`❌ User ${testUser.email} exists but couldn't be found`);
            continue;
          }
        } else {
          console.error(`❌ Failed to create ${testUser.email}:`, authError.message);
          continue;
        }
      } else {
        authUser = createData;
      }

      if (!authUser?.user) {
        console.error(`❌ No user returned for ${testUser.email}`);
        continue;
      }

      console.log(`✅ Created auth user: ${testUser.email} (ID: ${authUser.user.id})`);

      // Create/update user in users table
      // Use email as identifier since users table might use SERIAL id
      let dbError = null;
      
      // First check if user exists
      const { data: existingUser } = await supabaseAdmin
        .from('users')
        .select('id, email, role')
        .eq('email', testUser.email)
        .maybeSingle();

      if (existingUser) {
        // Update existing user - try both 'role' and 'user_role' columns
        let updateError = null;
        
        // Try with 'role' first
        const { error: roleError } = await supabaseAdmin
          .from('users')
          .update({
            name: testUser.name,
            role: testUser.role,
            status: 'active',
            is_active: true,
          })
          .eq('email', testUser.email);
        
        if (roleError) {
          // Try with 'user_role' if 'role' fails
          const { error: userRoleError } = await supabaseAdmin
            .from('users')
            .update({
              name: testUser.name,
              user_role: testUser.role,
              status: 'active',
              is_active: true,
            })
            .eq('email', testUser.email);
          updateError = userRoleError;
        } else {
          updateError = null;
        }
        
        dbError = updateError;
      } else {
        // Insert new user - try both column names
        let insertError = null;
        
        // Try with 'role' first
        const { error: roleError } = await supabaseAdmin
          .from('users')
          .insert({
            email: testUser.email,
            name: testUser.name,
            role: testUser.role,
            status: 'active',
            is_active: true,
          });
        
        if (roleError) {
          // Try with 'user_role' if 'role' fails
          const { error: userRoleError } = await supabaseAdmin
            .from('users')
            .insert({
              email: testUser.email,
              name: testUser.name,
              user_role: testUser.role,
              status: 'active',
              is_active: true,
            });
          insertError = userRoleError;
        } else {
          insertError = null;
        }
        
        dbError = insertError;
      }

      if (dbError) {
        console.error(`❌ Failed to create user record in DB for ${testUser.email}:`, dbError.message);
        console.log(`   Note: User is created in Supabase Auth, but DB record creation failed.`);
        console.log(`   You may need to manually create the user record in the users table.`);
      } else {
        console.log(`✅ Created user record in DB: ${testUser.email}`);
      }
      
      console.log('');
    } catch (error: any) {
      console.error(`❌ Error creating ${testUser.email}:`, error.message);
    }
  }

  console.log('\n✅ Test users creation complete!');
  console.log('\n📋 Test Credentials:');
  TEST_USERS.forEach((user) => {
    console.log(`  ${user.role}: ${user.email} / ${user.password}`);
  });
}

// Run the script
createTestUsers().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});