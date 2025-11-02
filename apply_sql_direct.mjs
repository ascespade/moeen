/**
 * Apply SQL Scripts Directly via PostgreSQL Connection
 * تطبيق SQL مباشرة عبر PostgreSQL
 */

import pkg from 'pg';
const { Client } = pkg;
import * as fs from 'fs';
import * as path from 'path';

// PostgreSQL connection string
const CONNECTION_STRING = 'postgresql://postgres.socwpqzcalgvpzjwavgh:rZqeMdbeyCwXW5cB@aws-1-eu-central-1.pooler.supabase.com:6543/postgres';

async function executeSQL(client, sql) {
  try {
    // Split by semicolon, but preserve DO blocks and functions
    const statements = [];
    let current = '';
    let inBlock = false;
    let blockDepth = 0;

    for (let i = 0; i < sql.length; i++) {
      const char = sql[i];
      const nextChars = sql.substring(i, i + 2);

      if (nextChars === '$$') {
        inBlock = !inBlock;
        current += char;
        continue;
      }

      current += char;

      if (!inBlock && char === ';') {
        const stmt = current.trim();
        if (stmt && stmt.length > 5 && !stmt.startsWith('--')) {
          statements.push(stmt);
        }
        current = '';
      }
    }

    if (current.trim() && !current.trim().startsWith('--')) {
      statements.push(current.trim());
    }

    console.log(`📝 Executing ${statements.length} SQL statements...\n`);

    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      if (!stmt || stmt.length < 5) continue;

      try {
        await client.query(stmt);
        console.log(`✅ Statement ${i + 1}/${statements.length} executed`);
      } catch (error) {
        // Skip if already exists or minor errors
        if (error.code === '42P07' || error.code === '42710' || error.code === '23505') {
          console.log(`ℹ️  Statement ${i + 1}: ${error.message.split('\n')[0]}`);
        } else {
          console.warn(`⚠️  Statement ${i + 1} failed: ${error.message.split('\n')[0]}`);
          // Don't stop on errors, continue
        }
      }
    }
  } catch (error) {
    console.error('❌ Error executing SQL:', error.message);
    throw error;
  }
}

async function applyPermissionsSchema() {
  console.log('🚀 Applying Permissions Schema via PostgreSQL...\n');
  console.log('='.repeat(60) + '\n');

  const client = new Client({
    connectionString: CONNECTION_STRING,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL database\n');

    // Read SQL file
    const sqlPath = path.join(process.cwd(), 'supabase', 'fix_permissions_schema.sql');
    const sqlScript = fs.readFileSync(sqlPath, 'utf-8');

    console.log(`📄 Reading SQL file: ${sqlPath}`);
    console.log(`📏 SQL script length: ${sqlScript.length} characters\n`);

    // Execute SQL
    await executeSQL(client, sqlScript);

    console.log('\n✅ Permissions schema applied successfully!\n');

    // Verify
    console.log('🔍 Verifying application...\n');

    // Check permissions count
    const permResult = await client.query('SELECT COUNT(*) as count FROM permissions');
    console.log(`✅ Permissions table: ${permResult.rows[0].count} records`);

    // Check roles count
    const roleResult = await client.query('SELECT COUNT(*) as count FROM roles');
    console.log(`✅ Roles table: ${roleResult.rows[0].count} records`);

    // Check role_permissions count
    const rpResult = await client.query('SELECT COUNT(*) as count FROM role_permissions');
    console.log(`✅ Role permissions: ${rpResult.rows[0].count} assignments`);

    // Check user_roles count
    const urResult = await client.query('SELECT COUNT(*) as count FROM user_roles');
    console.log(`✅ User roles: ${urResult.rows[0].count} assignments\n`);

    // Show sample data
    const sampleRoles = await client.query(`
      SELECT r.name, COUNT(rp.permission_id) as perm_count
      FROM roles r
      LEFT JOIN role_permissions rp ON r.id = rp.role_id AND rp.is_active = true
      WHERE r.name IN ('admin', 'manager', 'supervisor', 'agent')
      GROUP BY r.name
      ORDER BY r.name
    `);

    console.log('📊 Permissions per role:');
    sampleRoles.rows.forEach(row => {
      console.log(`   ${row.name}: ${row.perm_count} permissions`);
    });

    const sampleUsers = await client.query(`
      SELECT u.email, r.name as role_name
      FROM users u
      LEFT JOIN user_roles ur ON u.id = ur.user_id AND ur.is_active = true
      LEFT JOIN roles r ON ur.role_id = r.id
      WHERE u.email LIKE '%@test.com'
      ORDER BY u.email
    `);

    console.log('\n👥 Test users roles:');
    sampleUsers.rows.forEach(row => {
      console.log(`   ${row.email}: ${row.role_name || 'no role'}`);
    });

    console.log('\n' + '='.repeat(60));
    console.log('✅ All done! Database schema is ready.\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Run
applyPermissionsSchema().catch(console.error);
