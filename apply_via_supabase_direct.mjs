/**
 * Apply Database Fixes Directly via Supabase
 * استخدام Supabase token لتطبيق الإصلاحات مباشرة
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

// Use service role key from env or provided token
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE || 
                              process.env.SUPABASE_SERVICE_ROLE_KEY ||
                              'sbp_a1d07c37833d0bfd3bd1e05129c811813dd223dd';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';

if (!SUPABASE_URL) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL missing. Checking .env.local...');
  // Try to read from .env.local
  try {
    const envContent = fs.readFileSync('.env.local', 'utf-8');
    const urlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
    if (urlMatch) {
      const url = urlMatch[1].trim();
      console.log(`✅ Found URL in .env.local: ${url.substring(0, 30)}...`);
      process.env.NEXT_PUBLIC_SUPABASE_URL = url;
    }
  } catch (e) {
    console.error('❌ Could not read .env.local');
  }
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_URL,
  SUPABASE_SERVICE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function verifyConnection() {
  console.log('🔌 Testing Supabase connection...\n');
  
  try {
    // Test connection by querying users table
    const { data, error } = await supabase
      .from('users')
      .select('id, email')
      .limit(1);

    if (error) {
      console.error('❌ Connection failed:', error.message);
      return false;
    }

    console.log('✅ Connected successfully!');
    console.log(`   Database URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 40)}...\n`);
    return true;
  } catch (error) {
    console.error('❌ Connection error:', error.message);
    return false;
  }
}

async function checkAndCreatePermissions() {
  console.log('📋 Checking permissions structure...\n');

  // Check permissions table
  const { data: perms, error: permError } = await supabase
    .from('permissions')
    .select('code, name')
    .limit(10);

  if (permError && permError.code === 'PGRST116') {
    console.log('❌ Permissions table does not exist');
    console.log('   Need to create via SQL Editor\n');
    return false;
  } else if (permError) {
    console.log(`⚠️  Permissions table error: ${permError.message}\n`);
    return false;
  } else {
    console.log(`✅ Permissions table exists (${perms?.length || 0} permissions found)`);
    if (perms && perms.length > 0) {
      console.log('   Sample permissions:');
      perms.slice(0, 3).forEach(p => {
        console.log(`     - ${p.code}: ${p.name}`);
      });
    }
    console.log('');
  }

  // Check roles
  const { data: roles, error: roleError } = await supabase
    .from('roles')
    .select('name, display_name')
    .limit(10);

  if (roleError && roleError.code === 'PGRST116') {
    console.log('❌ Roles table does not exist');
    console.log('   Need to create via SQL Editor\n');
    return false;
  } else if (roleError) {
    console.log(`⚠️  Roles table error: ${roleError.message}\n`);
    return false;
  } else {
    console.log(`✅ Roles table exists (${roles?.length || 0} roles found)`);
    if (roles && roles.length > 0) {
      console.log('   Available roles:');
      roles.forEach(r => {
        console.log(`     - ${r.name}: ${r.display_name}`);
      });
    }
    console.log('');
  }

  // Check user_roles
  const { data: userRoles, error: urError } = await supabase
    .from('user_roles')
    .select('id, user_id, role_id')
    .limit(5);

  if (urError && urError.code === 'PGRST116') {
    console.log('❌ user_roles table does not exist');
  } else if (urError) {
    console.log(`⚠️  user_roles error: ${urError.message}`);
  } else {
    console.log(`✅ user_roles table exists (${userRoles?.length || 0} assignments found)`);
  }

  return true;
}

async function applyPermissionsViaAPI() {
  console.log('🔧 Attempting to create permissions via API...\n');

  const permissions = [
    { code: 'dashboard.view', name: 'View Dashboard', description: 'Can view dashboard', category: 'dashboard' },
    { code: 'users.create', name: 'Create Users', description: 'Can create new users', category: 'users' },
    { code: 'users.read', name: 'Read Users', description: 'Can view users', category: 'users' },
    { code: 'users.update', name: 'Update Users', description: 'Can update users', category: 'users' },
    { code: 'users.delete', name: 'Delete Users', description: 'Can delete users', category: 'users' },
    { code: 'patients.create', name: 'Create Patients', description: 'Can create patients', category: 'patients' },
    { code: 'patients.read', name: 'Read Patients', description: 'Can view patients', category: 'patients' },
    { code: 'patients.update', name: 'Update Patients', description: 'Can update patients', category: 'patients' },
    { code: 'appointments.create', name: 'Create Appointments', description: 'Can create appointments', category: 'appointments' },
    { code: 'appointments.read', name: 'Read Appointments', description: 'Can view appointments', category: 'appointments' },
    { code: 'appointments.update', name: 'Update Appointments', description: 'Can update appointments', category: 'appointments' },
    { code: 'settings.manage', name: 'Manage Settings', description: 'Can manage system settings', category: 'settings' },
    { code: 'reports.view', name: 'View Reports', description: 'Can view reports', category: 'reports' },
  ];

  let created = 0;
  let skipped = 0;

  for (const perm of permissions) {
    try {
      // Try to insert (will fail if exists due to unique constraint)
      const { data, error } = await supabase
        .from('permissions')
        .insert(perm)
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          // Unique violation - already exists
          skipped++;
        } else {
          console.warn(`⚠️  Failed to create ${perm.code}: ${error.message}`);
        }
      } else {
        console.log(`✅ Created permission: ${perm.code}`);
        created++;
      }
    } catch (err) {
      console.warn(`⚠️  Error with ${perm.code}: ${err.message}`);
    }
  }

  console.log(`\n📊 Permissions: ${created} created, ${skipped} already existed\n`);
}

async function applyRolesViaAPI() {
  console.log('👥 Creating roles via API...\n');

  const roles = [
    { name: 'admin', display_name: 'Administrator', description: 'Full system access', is_system_role: true },
    { name: 'manager', display_name: 'Manager', description: 'Management access', is_system_role: true },
    { name: 'supervisor', display_name: 'Supervisor', description: 'Supervisory access', is_system_role: true },
    { name: 'agent', display_name: 'Agent', description: 'Standard user access', is_system_role: true },
  ];

  let created = 0;
  let skipped = 0;

  for (const role of roles) {
    try {
      const { data, error } = await supabase
        .from('roles')
        .insert(role)
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          skipped++;
        } else {
          console.warn(`⚠️  Failed to create role ${role.name}: ${error.message}`);
        }
      } else {
        console.log(`✅ Created role: ${role.name}`);
        created++;
      }
    } catch (err) {
      console.warn(`⚠️  Error with ${role.name}: ${err.message}`);
    }
  }

  console.log(`\n📊 Roles: ${created} created, ${skipped} already existed\n`);
}

async function main() {
  console.log('🚀 Supabase Direct Database Fix Application\n');
  console.log('=' .repeat(50) + '\n');

  // Step 1: Verify connection
  const connected = await verifyConnection();
  if (!connected) {
    console.log('\n❌ Cannot proceed without database connection');
    console.log('   Please check:');
    console.log('   1. NEXT_PUBLIC_SUPABASE_URL in .env.local');
    console.log('   2. Supabase service key is valid');
    process.exit(1);
  }

  // Step 2: Check structure
  const structureOk = await checkAndCreatePermissions();
  
  // Step 3: Try to apply via API (for data, not DDL)
  if (structureOk) {
    await applyPermissionsViaAPI();
    await applyRolesViaAPI();
  } else {
    console.log('\n⚠️  Tables need to be created first via SQL Editor');
    console.log('   Please run: supabase/fix_permissions_schema.sql\n');
  }

  console.log('✅ Process complete!');
  console.log('\n📝 Note: Some operations require SQL Editor');
  console.log('   For DDL (CREATE TABLE, etc.), use Supabase SQL Editor');
  console.log('   File: supabase/fix_permissions_schema.sql\n');
}

main().catch(console.error);
