/**
 * Apply Password Fixes via PostgreSQL
 * إصلاح كلمات المرور للمستخدمين
 */

import pkg from 'pg';
const { Client } = pkg;

const CONNECTION_STRING = 'postgresql://postgres.socwpqzcalgvpzjwavgh:rZqeMdbeyCwXW5cB@aws-1-eu-central-1.pooler.supabase.com:6543/postgres';

async function fixPasswords() {
  console.log('🔐 Fixing user passwords...\n');

  const client = new Client({
    connectionString: CONNECTION_STRING,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    // Enable pgcrypto
    await client.query('CREATE EXTENSION IF NOT EXISTS pgcrypto');
    console.log('✅ pgcrypto extension enabled');

    // Create verify_password function
    await client.query(`
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
    `);
    console.log('✅ verify_password function created');

    // Create hash_password function
    await client.query(`
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
    `);
    console.log('✅ hash_password function created');

    // Grant permissions
    await client.query('GRANT EXECUTE ON FUNCTION verify_password(TEXT, TEXT) TO authenticated, anon, service_role');
    await client.query('GRANT EXECUTE ON FUNCTION hash_password(TEXT) TO authenticated, anon, service_role');
    console.log('✅ Functions permissions granted\n');

    // Fix passwords for test users
    const users = [
      { email: 'admin@test.com', password: 'Admin123!' },
      { email: 'doctor@test.com', password: 'Doctor123!' },
      { email: 'patient@test.com', password: 'Patient123!' },
      { email: 'staff@test.com', password: 'Staff123!' },
    ];

    for (const user of users) {
      const result = await client.query(`
        UPDATE users
        SET password_hash = crypt($1, gen_salt('bf'))
        WHERE email = $2
        RETURNING email, name
      `, [user.password, user.email]);

      if (result.rows.length > 0) {
        console.log(`✅ Password set for: ${user.email}`);
      } else {
        console.log(`⚠️  User not found: ${user.email}`);
      }
    }

    // Verify
    console.log('\n🔍 Verifying passwords...\n');
    const verifyResult = await client.query(`
      SELECT 
        email,
        CASE 
          WHEN password_hash IS NULL OR password_hash = '' THEN '❌ No password'
          ELSE '✅ Has password'
        END as password_status
      FROM users
      WHERE email IN ('admin@test.com', 'doctor@test.com', 'patient@test.com', 'staff@test.com')
      ORDER BY email
    `);

    verifyResult.rows.forEach(row => {
      console.log(`   ${row.email}: ${row.password_status}`);
    });

    console.log('\n✅ Password fixes complete!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

fixPasswords().catch(console.error);
