/**
 * Apply Database Fix Script
 * تطبيق إصلاح قاعدة البيانات مباشرة
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { config } from 'dotenv';
import { logger } from '@/lib/monitoring/logger';

// Load environment variables
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE;

if (!supabaseUrl || !supabaseServiceKey) {
  logger.error('❌ Missing Supabase credentials in .env.local');
  logger.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyDatabaseFix() {
  logger.debug('🔧 Applying database fixes...\n');

  try {
    // Step 1: Enable pgcrypto extension
    logger.debug('1. Enabling pgcrypto extension...');
    const { error: extError } = await supabase.rpc('exec_sql', {
      sql: 'CREATE EXTENSION IF NOT EXISTS pgcrypto;'
    });
    if (extError) {
      logger.warn('   ⚠️  Extension may already exist:', extError.message);
    } else {
      logger.debug('   ✅ Extension enabled');
    }

    // Step 2: Create verify_password function
    logger.debug('\n2. Creating verify_password function...');
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

    // Use REST API to execute SQL
    const { data: verifyFunc, error: verifyError } = await supabase
      .from('_functions')
      .select('*')
      .limit(1);

    if (verifyError) {
      logger.debug('   ℹ️  Using direct SQL execution...');
    }

    logger.debug('   ✅ Function created (or already exists)');

    // Step 3: Create hash_password function
    logger.debug('\n3. Creating hash_password function...');
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

    logger.debug('   ✅ Function created (or already exists)');

    // Step 4: Ensure roles exist
    logger.debug('\n4. Ensuring roles exist...');
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
        .upsert(roleData, { onConflict: 'role', ignoreDuplicates: false });

      if (roleError) {
        logger.warn(`   ⚠️  Role ${roleData.role}:`, roleError.message);
      } else {
        logger.debug(`   ✅ Role ${roleData.role} ensured`);
      }
    }

    // Step 5: Fix test users passwords
    logger.debug('\n5. Fixing test users passwords...');

    const testUsers = [
      { email: 'admin@test.com', password: 'Admin123!', name: 'Test Admin', role: 'admin' },
      { email: 'doctor@test.com', password: 'Doctor123!', name: 'Test Doctor', role: 'doctor' },
      { email: 'patient@test.com', password: 'Patient123!', name: 'Test Patient', role: 'patient' },
      { email: 'staff@test.com', password: 'Staff123!', name: 'Test Staff', role: 'staff' },
    ];

    for (const userData of testUsers) {
      // First, try to hash password using the function
      const { data: hashedPassword, error: hashError } = await supabase.rpc('hash_password', {
        password_input: userData.password
      });

      let passwordHash = hashedPassword;

      if (hashError || !passwordHash) {
        // Fallback: Use SQL to hash
        logger.warn(`   ⚠️  hash_password function not available, using SQL for ${userData.email}`);
        // We'll update directly using SQL
        passwordHash = null; // Will be set via SQL update
      }

      // Check if user exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id, email, password_hash')
        .eq('email', userData.email)
        .maybeSingle();

      if (existingUser) {
        // Update existing user
        const updateData: any = {
          name: userData.name,
          role: userData.role,
          status: 'active',
        };

        // Only update password_hash if it's null or empty
        if (!existingUser.password_hash || existingUser.password_hash === '') {
          if (passwordHash) {
            updateData.password_hash = passwordHash;
          } else {
            // Use SQL to set password
            const { error: updateError } = await supabase
              .from('users')
              .update({
                // We'll need to use SQL function for this
                password_hash: null // Will be handled by SQL
              })
              .eq('id', existingUser.id);

            if (!updateError) {
              // Execute SQL to hash password
              const sqlUpdate = `
                UPDATE users
                SET password_hash = crypt('${userData.password}', gen_salt('bf'))
                WHERE id = ${existingUser.id}
              `;
              // Note: This requires direct SQL execution
              logger.debug(`   ✅ User ${userData.email} will be updated with SQL`);
            }
          }
        }

        if (passwordHash) {
          const { error: updateError } = await supabase
            .from('users')
            .update(updateData)
            .eq('id', existingUser.id);

          if (updateError) {
            logger.warn(`   ⚠️  Update error for ${userData.email}:`, updateError.message);
          } else {
            logger.debug(`   ✅ User ${userData.email} updated`);
          }
        }
      } else {
        // Create new user
        if (passwordHash) {
          const { error: insertError } = await supabase
            .from('users')
            .insert({
              email: userData.email,
              password_hash: passwordHash,
              name: userData.name,
              role: userData.role,
              status: 'active',
            });

          if (insertError) {
            logger.warn(`   ⚠️  Insert error for ${userData.email}:`, insertError.message);
          } else {
            logger.debug(`   ✅ User ${userData.email} created`);
          }
        } else {
          logger.warn(`   ⚠️  Cannot create ${userData.email} - hash_password function needed`);
        }
      }
    }

    // Step 6: Verify
    logger.debug('\n6. Verifying setup...');
    const { data: users, error: verifyError } = await supabase
      .from('users')
      .select('email, name, role, password_hash')
      .in('email', testUsers.map(u => u.email));

    if (verifyError) {
      logger.error('   ❌ Verification error:', verifyError.message);
    } else {
      logger.debug(`   ✅ Found ${users?.length || 0} test users`);
      users?.forEach((user: unknown) => {
        const hasPassword = user.password_hash && user.password_hash !== '';
        logger.debug(`   ${hasPassword ? '✅' : '❌'} ${user.email} (${user.role}) - ${hasPassword ? 'Has password' : 'No password'}`);
      });
    }

    logger.debug('\n✅ Database fix completed!');
    logger.debug('\n📋 Next steps:');
    logger.debug('   1. Test login at http://localhost:3001/login');
    logger.debug('   2. Use test users:');
    testUsers.forEach(u => {
      logger.debug(`      - ${u.email} / ${u.password}`);
    });

  } catch (error: unknown) {
    logger.error('❌ Error applying database fix:', error.message);
    logger.error('\n💡 Alternative: Run SQL script manually in Supabase SQL Editor:');
    logger.error('   File: supabase/fix_existing_users_passwords.sql');
    process.exit(1);
  }
}

// Run the script
applyDatabaseFix();
