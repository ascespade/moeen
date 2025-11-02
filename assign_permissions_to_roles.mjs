/**
 * Assign Permissions to Roles
 * ربط الصلاحيات بالأدوار
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

// Load env
const envContent = fs.readFileSync('.env.local', 'utf-8');
const urlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
const keyMatch = envContent.match(/SUPABASE_SERVICE_ROLE=(.+)/);

if (!urlMatch || !keyMatch) {
  console.error('❌ Missing env vars');
  process.exit(1);
}

const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim(), {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function assignPermissions() {
  console.log('🔗 Assigning permissions to roles...\n');

  // Get roles
  const { data: roles } = await supabase.from('roles').select('id, name');
  if (!roles) {
    console.error('❌ No roles found');
    return;
  }

  const roleMap = {};
  roles.forEach(r => roleMap[r.name] = r.id);

  // Get permissions
  const { data: permissions } = await supabase.from('permissions').select('id, code');
  if (!permissions) {
    console.error('❌ No permissions found');
    return;
  }

  const permMap = {};
  permissions.forEach(p => permMap[p.code] = p.id);

  // Admin: All permissions
  if (roleMap.admin && permMap['dashboard.view']) {
    let assigned = 0;
    for (const [code, permId] of Object.entries(permMap)) {
      try {
        const { error } = await supabase
          .from('role_permissions')
          .insert({ role_id: roleMap.admin, permission_id: permId, is_active: true });
        if (!error) assigned++;
      } catch (e) {
        // Already exists
      }
    }
    console.log(`✅ Admin role: ${assigned} permissions assigned`);
  }

  // Manager: Limited permissions
  if (roleMap.manager) {
    const managerPerms = ['dashboard.view', 'users.read', 'users.update', 
                         'patients.read', 'patients.update', 'appointments.read', 
                         'appointments.update', 'reports.view'];
    let assigned = 0;
    for (const code of managerPerms) {
      if (permMap[code]) {
        try {
          const { error } = await supabase
            .from('role_permissions')
            .insert({ role_id: roleMap.manager, permission_id: permMap[code], is_active: true });
          if (!error) assigned++;
        } catch (e) {}
      }
    }
    console.log(`✅ Manager role: ${assigned} permissions assigned`);
  }

  // Supervisor: Moderate permissions
  if (roleMap.supervisor) {
    const supervisorPerms = ['dashboard.view', 'patients.read', 'patients.update',
                            'appointments.create', 'appointments.read', 'appointments.update'];
    let assigned = 0;
    for (const code of supervisorPerms) {
      if (permMap[code]) {
        try {
          const { error } = await supabase
            .from('role_permissions')
            .insert({ role_id: roleMap.supervisor, permission_id: permMap[code], is_active: true });
          if (!error) assigned++;
        } catch (e) {}
      }
    }
    console.log(`✅ Supervisor role: ${assigned} permissions assigned`);
  }

  // Agent: Basic permissions
  if (roleMap.agent) {
    const agentPerms = ['dashboard.view', 'patients.read', 'appointments.read', 'appointments.create'];
    let assigned = 0;
    for (const code of agentPerms) {
      if (permMap[code]) {
        try {
          const { error } = await supabase
            .from('role_permissions')
            .insert({ role_id: roleMap.agent, permission_id: permMap[code], is_active: true });
          if (!error) assigned++;
        } catch (e) {}
      }
    }
    console.log(`✅ Agent role: ${assigned} permissions assigned`);
  }
}

async function assignRolesToUsers() {
  console.log('\n👥 Assigning roles to test users...\n');

  // Get roles
  const { data: roles } = await supabase.from('roles').select('id, name');
  const roleMap = {};
  roles?.forEach(r => roleMap[r.name] = r.id);

  // Get users
  const { data: users } = await supabase
    .from('users')
    .select('id, email, role')
    .in('email', ['admin@test.com', 'doctor@test.com', 'patient@test.com', 'staff@test.com']);

  if (!users) {
    console.log('⚠️  Test users not found');
    return;
  }

  for (const user of users) {
    let targetRole = 'agent'; // default
    
    if (user.email === 'admin@test.com') {
      targetRole = 'admin';
    } else if (user.email.includes('doctor') || user.email.includes('patient') || user.email.includes('staff')) {
      targetRole = 'agent'; // They all use agent role
    }

    if (roleMap[targetRole]) {
      try {
        const { error } = await supabase
          .from('user_roles')
          .insert({ 
            user_id: user.id, 
            role_id: roleMap[targetRole], 
            is_active: true 
          });
        
        if (!error) {
          console.log(`✅ ${user.email} → ${targetRole}`);
        }
      } catch (e) {
        // Already assigned
        console.log(`ℹ️  ${user.email} already has role ${targetRole}`);
      }
    }
  }
}

async function main() {
  await assignPermissions();
  await assignRolesToUsers();
  console.log('\n✅ Complete!');
}

main().catch(console.error);
