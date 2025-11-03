/**
 * Apply Database Fix Directly using Supabase Client
 * تطبيق إصلاح قاعدة البيانات مباشرة
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

console.log('🔧 Connecting to Supabase...');
console.log('   URL:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function executeSQL(sql) {
  // Use REST API to execute SQL via Supabase
  // Note: This requires using the REST API endpoint
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'apikey': supabaseServiceKey,
      'Authorization': `Bearer ${supabaseServiceKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sql }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`SQL execution failed: ${error}`);
  }

  return response.json();
}

async function applyDatabaseFix() {
  console.log('\n🔧 Applying database fixes...\n');

  try {
    // Step 1: Enable pgcrypto extension
    console.log('1. Enabling pgcrypto extension...');
    try {
      const { error } = await supabase.rpc('exec_sql', {
        sql: 'CREATE EXTENSION IF NOT EXISTS pgcrypto;'
      });
      if (error && !error.message.includes('already exists')) {
        console.warn('   ⚠️  Extension:', error.message);
      } else {
        console.log('   ✅ Extension enabled (or already exists)');
      }
    } catch (e) {
      console.log('   ℹ️  Extension check skipped (may need manual setup)');
    }

    // Step 2: Create verify_password function using direct SQL via REST API
    console.log('\n2. Creating verify_password function...');
    const verifyPasswordSQL = `
      CREATE OR REPLACE FUNCTION verify_password(
        password_input TEXT,
        password_hash TEXT
      )
      RETURNS BOOLEAN
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      BEGIN
        RETURN crypt(password_input, password_hash) = password_hash;
      EXCEPTION
        WHEN OTHERS THEN
          RETURN FALSE;
      END;
      $$;
      
      GRANT EXECUTE ON FUNCTION verify_password(TEXT, TEXT) TO authenticated;
      GRANT EXECUTE ON FUNCTION verify_password(TEXT, TEXT) TO anon;
      GRANT EXECUTE ON FUNCTION verify_password(TEXT, TEXT) TO service_role;
    `;

    // Try using REST API
    try {
      await executeSQL(verifyPasswordSQL);
      console.log('   ✅ Function created');
    } catch (e) {
      console.warn('   ⚠️  Could not create via REST API. Function may need manual creation.');
      console.warn('   💡 Run this SQL in Supabase SQL Editor:');
      console.warn('      File: supabase/create_verify_password_function.sql');
    }

    // Step 3: Create hash_password function
    console.log('\n3. Creating hash_password function...');
    const hashPasswordSQL = `
      CREATE OR REPLACE FUNCTION hash_password(
        password_input TEXT
      )
      RETURNS TEXT
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      BEGIN
        RETURN crypt(password_input, gen_salt('bf'));
      EXCEPTION
        WHEN OTHERS THEN
          RETURN NULL;
      END;
      $$;
      
      GRANT EXECUTE ON FUNCTION hash_password(TEXT) TO authenticated;
      GRANT EXECUTE ON FUNCTION hash_password(TEXT) TO anon;
      GRANT EXECUTE ON FUNCTION hash_password(TEXT) TO service_role;
    `;

    try {
      await executeSQL(hashPasswordSQL);
      console.log('   ✅ Function created');
    } catch (e) {
      console.warn('   ⚠️  Could not create via REST API. Function may need manual creation.');
    }

    // Step 4: Ensure roles exist
    console.log('\n4. Ensuring roles exist...');
    const roles = [
      { role: 'admin', description: 'System administrator with full access' },
      { role: 'doctor', description: 'Medical professional with patient access' },
      { role: 'patient', description: 'Patient with personal data access' },
      { role: 'staff', description: 'Staff member with administrative access' },
      { role: 'supervisor', description: 'Supervisor with limited administrative access' },
      { role: 'manager', description: 'Manager with comprehensive administrative access' },
    ];

    for (const roleData of roles) {
      const { error: roleError } = await supabase
        .from('roles')
        .upsert(roleData, { onConflict: 'role' });

      if (roleError) {
        console.warn(`   ⚠️  Role ${roleData.role}:`, roleError.message);
      } else {
        console.log(`   ✅ Role ${roleData.role}`);
      }
    }

    // Step 5: Fix test users passwords using RPC
    console.log('\n5. Fixing test users passwords...');
    
    const testUsers = [
      { email: 'admin@test.com', password: 'Admin123!', name: 'Test Admin', role: 'admin' },
      { email: 'doctor@test.com', password: 'Doctor123!', name: 'Test Doctor', role: 'doctor' },
      { email: 'patient@test.com', password: 'Patient123!', name: 'Test Patient', role: 'patient' },
      { email: 'staff@test.com', password: 'Staff123!', name: 'Test Staff', role: 'staff' },
    ];

    for (const userData of testUsers) {
      // Check if user exists
      const { data: existingUser, error: userError } = await supabase
        .from('users')
        .select('id, email, password_hash')
        .eq('email', userData.email)
        .maybeSingle();

      if (userError && userError.code !== 'PGRST116') {
        console.warn(`   ⚠️  Error checking ${userData.email}:`, userError.message);
        continue;
      }

      if (existingUser) {
        // User exists - update if password_hash is missing
        if (!existingUser.password_hash || existingUser.password_hash === '') {
          // Try to hash password using RPC
          const { data: hashedPassword, error: hashError } = await supabase.rpc('hash_password', {
            password_input: userData.password
          });

          if (!hashError && hashedPassword) {
            const { error: updateError } = await supabase
              .from('users')
              .update({ 
                password_hash: hashedPassword,
                name: userData.name,
                role: userData.role,
                status: 'active'
              })
              .eq('id', existingUser.id);

            if (updateError) {
              console.warn(`   ⚠️  Update error for ${userData.email}:`, updateError.message);
            } else {
              console.log(`   ✅ Updated ${userData.email} with password`);
            }
          } else {
            // Fallback: Use direct SQL update
            console.warn(`   ⚠️  hash_password RPC not available for ${userData.email}`);
            console.warn(`   💡 Run SQL manually to set password for ${userData.email}`);
          }
        } else {
          console.log(`   ✅ ${userData.email} already has password`);
        }
      } else {
        // User doesn't exist - create with hashed password
        const { data: hashedPassword, error: hashError } = await supabase.rpc('hash_password', {
          password_input: userData.password
        });

        if (!hashError && hashedPassword) {
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
            console.warn(`   ⚠️  Insert error for ${userData.email}:`, insertError.message);
          } else {
            console.log(`   ✅ Created ${userData.email}`);
          }
        } else {
          console.warn(`   ⚠️  Cannot create ${userData.email} - hash_password function needed`);
        }
      }
    }

    // Step 6: Verify
    console.log('\n6. Verifying setup...');
    const { data: users, error: verifyError } = await supabase
      .from('users')
      .select('email, name, role, password_hash')
      .in('email', testUsers.map(u => u.email));

    if (verifyError) {
      console.error('   ❌ Verification error:', verifyError.message);
    } else {
      console.log(`   ✅ Found ${users?.length || 0} test users`);
      users?.forEach((user) => {
        const hasPassword = user.password_hash && user.password_hash !== '';
        console.log(`   ${hasPassword ? '✅' : '❌'} ${user.email} (${user.role}) - ${hasPassword ? 'Has password' : 'No password'}`);
      });
    }

    console.log('\n✅ Database fix completed!');
    console.log('\n📋 Next steps:');
    console.log('   1. Test login at http://localhost:3001/login');
    console.log('   2. Use test users:');
    testUsers.forEach(u => {
      console.log(`      - ${u.email} / ${u.password}`);
    });

    // Check if any users still need passwords
    const usersWithoutPasswords = users?.filter(u => !u.password_hash || u.password_hash === '');
    if (usersWithoutPasswords && usersWithoutPasswords.length > 0) {
      console.log('\n⚠️  Some users still need passwords. Run SQL manually:');
      console.log('   File: apply_db_fix_direct.sql');
    }

  } catch (error) {
    console.error('❌ Error applying database fix:', error.message);
    console.error('\n💡 Alternative: Run SQL script manually in Supabase SQL Editor:');
    console.error('   File: apply_db_fix_direct.sql');
    process.exit(1);
  }
}

// Run the script
applyDatabaseFix();
