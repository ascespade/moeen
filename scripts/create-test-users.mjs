#!/usr/bin/env node

/**
 * Create Test Users for E2E Tests
 * ????? ???????? ???????? ??????????
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('? Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const testUsers = [
  { email: 'admin@test.com', password: 'Admin123!', role: 'admin' },
  { email: 'doctor@test.com', password: 'Doctor123!', role: 'doctor' },
  { email: 'patient@test.com', password: 'Patient123!', role: 'patient' },
  { email: 'staff@test.com', password: 'Staff123!', role: 'staff' },
  { email: 'supervisor@test.com', password: 'Supervisor123!', role: 'supervisor' },
  { email: 'manager@test.com', password: 'Manager123!', role: 'manager' },
  { email: 'therapist@test.com', password: 'Therapist123!', role: 'therapist' },
  { email: 'nurse@test.com', password: 'Nurse123!', role: 'nurse' },
  { email: 'agent@test.com', password: 'Agent123!', role: 'agent' },
];

async function createTestUsers() {
  console.log('?? Creating Test Users...\n');
  
  for (const user of testUsers) {
    try {
      // Check if user exists
      const { data: existing } = await supabase.auth.admin.listUsers();
      const exists = existing?.users?.some(u => u.email === user.email);
      
      if (exists) {
        console.log(`  ??  ${user.email} already exists - skipping`);
        continue;
      }
      
      // Create user
      const { data, error } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          role: user.role,
        },
      });
      
      if (error) {
        console.log(`  ? ${user.email}: ${error.message}`);
      } else {
        console.log(`  ? ${user.email} (${user.role}) created`);
        
        // Update user role in users table
        if (data.user) {
          await supabase
            .from('users')
            .upsert({
              id: data.user.id,
              email: user.email,
              role: user.role,
              full_name: `${user.role} User`,
            }, {
              onConflict: 'id',
            });
        }
      }
    } catch (error) {
      console.log(`  ? ${user.email}: ${error.message}`);
    }
  }
  
  console.log('\n? Test users creation completed\n');
}

createTestUsers().catch(console.error);
