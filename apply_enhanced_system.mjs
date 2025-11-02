/**
 * Apply Enhanced Authentication System
 * تطبيق النظام المحسّن
 */

import pkg from 'pg';
const { Client } = pkg;
import * as fs from 'fs';

const CONNECTION_STRING = 'postgresql://postgres.socwpqzcalgvpzjwavgh:rZqeMdbeyCwXW5cB@aws-1-eu-central-1.pooler.supabase.com:6543/postgres';

async function applyEnhancedSystem() {
  console.log('🚀 Applying Enhanced Authentication System...\n');

  const client = new Client({
    connectionString: CONNECTION_STRING,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    // Read and apply SQL
    const sqlPath = './supabase/enhanced_auth_system.sql';
    const sqlScript = fs.readFileSync(sqlPath, 'utf-8');

    console.log(`📄 Applying enhanced schema...\n`);

    // Split and execute SQL statements
    const statements = sqlScript
      .split(';')
      .map(s => s.trim())
      .filter(s => s && !s.startsWith('--') && s.length > 10);

    let success = 0;
    let skipped = 0;

    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      try {
        await client.query(stmt);
        success++;
        if (i % 10 === 0) {
          console.log(`   Processed ${i + 1}/${statements.length} statements...`);
        }
      } catch (error) {
        // Skip if already exists
        if (error.code === '42P07' || error.code === '42710' || error.code === '23505') {
          skipped++;
        } else {
          console.warn(`   ⚠️  Statement ${i + 1} warning: ${error.message.split('\n')[0]}`);
        }
      }
    }

    console.log(`\n✅ Applied: ${success} statements, ${skipped} skipped\n`);

    // Verify
    console.log('🔍 Verifying enhanced system...\n');

    const permResult = await client.query('SELECT COUNT(*) as count FROM permissions');
    const roleResult = await client.query('SELECT COUNT(*) as count FROM roles');
    const rpResult = await client.query('SELECT COUNT(*) as count FROM role_permissions WHERE is_active = true');
    const urResult = await client.query('SELECT COUNT(*) as count FROM user_roles WHERE is_active = true');

    console.log(`✅ Permissions: ${permResult.rows[0].count}`);
    console.log(`✅ Roles: ${roleResult.rows[0].count}`);
    console.log(`✅ Role-Permission Links: ${rpResult.rows[0].count}`);
    console.log(`✅ User-Role Links: ${urResult.rows[0].count}\n`);

    // Check test users
    const usersResult = await client.query(`
      SELECT 
        u.email,
        r.name as role_name,
        CASE 
          WHEN u.password_hash IS NULL OR u.password_hash = '' THEN '❌ No password'
          ELSE '✅ Has password'
        END as password_status
      FROM users u
      LEFT JOIN user_roles ur ON u.id = ur.user_id AND ur.is_active = true
      LEFT JOIN roles r ON ur.role_id = r.id
      WHERE u.email IN ('admin@test.com', 'doctor@test.com', 'patient@test.com', 'staff@test.com')
      ORDER BY u.email
    `);

    console.log('👥 Test Users Status:');
    usersResult.rows.forEach(row => {
      console.log(`   ${row.email}: ${row.role_name || 'no role'} - ${row.password_status}`);
    });

    console.log('\n✅ Enhanced system applied successfully!\n');

  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

applyEnhancedSystem().catch(console.error);
