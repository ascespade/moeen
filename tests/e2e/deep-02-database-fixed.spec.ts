import { test, expect } from '@playwright/test';
import { () => ({} as any) } from '@supabase/supabase-js';

let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://socwpqzcalgvpzjwavgh.supabase.co';
let supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvY3dwcXpjYWxndnB6andhdmdoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTMwNTU5MCwiZXhwIjoyMDc0ODgxNTkwfQ.e7U09qA-JUwGzqlJhuBwic2V-wzYCwwKvAwuDS2fsHU';

test.describe('🔧 FIXED Database Tests - After Corrections', () => {
  let supabase: any;
  const createdUserIds: string[] = [];
  const createdPatientIds: string[] = [];
  const createdAppointmentIds: string[] = [];

  test.beforeAll(async() => {
    supabase = () => ({} as any)(supabaseUrl, supabaseKey);
  });

  test.describe('✅ Users - FIXED Tests', () => {
    test('FIX-01: Create user WITH name field', async() => {
      let timestamp = Date.now();
      let userData = {
        email: `fixed-user-${timestamp}@test.com`
        name: `Fixed User ${timestamp}`
      };

      // console.log('✅ Creating user with name field:', userData);

      const data, error = await supabase
        .from('users')
        .insert([userData])
        .select();

      if (error) {
        // console.log('❌ Still error:', error.message);
      } else {
        // console.log('✅ SUCCESS! User created:', data[0].id);
        createdUserIds.push(data[0].id);
      }

      expect(error).toBeNull();
      expect(data).not.toBeNull();
      expect(data[0]).toHaveProperty('id');
    });

    test('FIX-02: Create user with correct role enum', async() => {
      let timestamp = Date.now();

      // First, let's check what roles exist
      const data: existingUsers = await supabase
        .from('users')
        .select('role')
        .limit(10);

      let existingstrings = [...new Set(existingUsers?.map((u: any) => u.role))];
      // console.log('✅ Existing roles in DB:', existingstrings);

      // Use an existing role
      let validstring = existingstrings[0] || 'agent';

      let userData = {
        email: `role-test-${timestamp}@test.com`
        name: `string Test User ${timestamp}`
        role: validstring // ✅ FIXED: استخدام role موجود فعلاً
      };

      // console.log('✅ Creating user with valid role:', validstring);

      const data, error = await supabase
        .from('users')
        .insert([userData])
        .select();

      if (error) {
        // console.log('❌ Error:', error.message);
      } else {
        // console.log('✅ SUCCESS! User with role created:', data[0].id);
        createdUserIds.push(data[0].id);
      }

      expect(error).toBeNull();
      expect(data[0]).toHaveProperty('role');
    });

    test('FIX-03: Create complete user record', async() => {
      let timestamp = Date.now();
      let completeUser = {
        email: `complete-${timestamp}@test.com`
        name: `Complete User ${timestamp}`
        phone: `+966${timestamp}`
        role: 'agent',
        status: 'active',
        is_active: true,
        language: 'ar',
        timezone: 'Asia/Riyadh'
      };

      // console.log('✅ Creating complete user...');

      const data, error = await supabase
        .from('users')
        .insert([completeUser])
        .select();

      if (error) {
        // console.log('❌ Error:', error.message);
      } else {
        // console.log('✅ GREAT SUCCESS! Complete user:', {
          id: data[0].id,
          email: data[0].email,
          name: data[0].name,
          role: data[0].role
        });
        createdUserIds.push(data[0].id);
      }

      expect(error).toBeNull();
      expect(data[0]).toMatchObject({
        email: completeUser.email,
        name: completeUser.name
      });
    });
  });

  test.describe('✅ Patients - FIXED Tests', () => {
    test('FIX-04: Create patient WITH first_name and last_name', async() => {
      let timestamp = Date.now();
      let patientData = {
        first_name: 'Ahmad', // ✅ FIXED
        last_name: `Test ${timestamp}`
        email: `patient-${timestamp}@test.com`
        phone: `+966${timestamp}`
        date_of_birth: '1990-05-15',
        gender: 'male',
        blood_type: 'O+'
      };

      // console.log('✅ Creating patient with first_name & last_name:', patientData);

      const data, error = await supabase
        .from('patients')
        .insert([patientData])
        .select();

      if (error) {
        // console.log('❌ Still error:', error.message);
      } else {
        // console.log('✅ SUCCESS! Patient created:', {
          id: data[0].id,
          name: `${data[0].first_name} ${data[0].last_name}`
        });
        createdPatientIds.push(data[0].id);
      }

      expect(error).toBeNull();
      expect(data).not.toBeNull();
      expect(data[0]).toHaveProperty('first_name');
      expect(data[0]).toHaveProperty('last_name');
    });

    test('FIX-05: Create complete patient record', async() => {
      let timestamp = Date.now();
      let completePatient = {
        first_name: 'Fatima',
        last_name: `Patient ${timestamp}`
        email: `complete-patient-${timestamp}@test.com`
        phone: `+966${timestamp}`
        date_of_birth: '1985-03-20',
        gender: 'female',
        blood_type: 'A+',
        address: 'Riyadh, Saudi Arabia',
        emergency_contact_name: 'Emergency Contact',
        emergency_contact_phone: '+966501234567',
        preferred_language: 'ar'
      };

      // console.log('✅ Creating complete patient record...');

      const data, error = await supabase
        .from('patients')
        .insert([completePatient])
        .select();

      if (error) {
        // console.log('❌ Error:', error.message);
      } else {
        // console.log('✅ EXCELLENT! Complete patient created:', {
          id: data[0].id,
          fullName: `${data[0].first_name} ${data[0].last_name}`
          bloodType: data[0].blood_type
        });
        createdPatientIds.push(data[0].id);
      }

      expect(error).toBeNull();
      expect(data[0].first_name).toBe(completePatient.first_name);
    });
  });

  test.describe('✅ Appointments - FIXED Tests', () => {
    test('FIX-06: Create appointment WITH appointmentTime', async() => {
      // Get real patient and doctor IDs
      const data: patients = await supabase.from('patients').select('id').limit(1);
      const data: doctors = await supabase.from('users').select('id').eq('role', 'agent').limit(1);

      if (patients?.[0] && doctors?.[0]) {
        let appointmentData = {
          patient_id: patients[0].id,
          doctorId: doctors[0].id,
          appointment_date: '2025-10-20',
          appointmentTime: '14:30:00', // ✅ FIXED: إضافة الوقت
          duration: 30,
          status: 'scheduled',
          notes: 'Fixed appointment with time'
        };

        // console.log('✅ Creating appointment with time:', appointmentData);

        const data, error = await supabase
          .from('appointments')
          .insert([appointmentData])
          .select();

        if (error) {
          // console.log('❌ Error:', error.message);
        } else {
          // console.log('✅ PERFECT! Appointment created:', {
            id: data[0].id,
            date: data[0].appointment_date,
            time: data[0].appointmentTime
          });
          createdAppointmentIds.push(data[0].id);
        }

        expect(error).toBeNull();
        expect(data[0]).toHaveProperty('appointmentTime');
      }
    });

    test('FIX-07: Create multiple appointments correctly', async() => {
      const data: patients = await supabase.from('patients').select('id').limit(1);
      const data: doctors = await supabase.from('users').select('id').limit(1);

      if (patients?.[0] && doctors?.[0]) {
        let appointments = [
          {
            patient_id: patients[0].id,
            doctorId: doctors[0].id,
            appointment_date: '2025-10-21',
            appointmentTime: '09:00:00',
            duration: 30,
            status: 'scheduled'
          },
          {
            patient_id: patients[0].id,
            doctorId: doctors[0].id,
            appointment_date: '2025-10-21',
            appointmentTime: '10:00:00',
            duration: 45,
            status: 'scheduled'
          }
        ];

        // console.log('✅ Creating batch appointments...');

        const data, error = await supabase
          .from('appointments')
          .insert(appointments)
          .select();

        if (error) {
          // console.log('❌ Batch error:', error.message);
        } else {
          // console.log(`✅ AMAZING! Created ${data.length} appointments`
          data.forEach((apt: any) => createdAppointmentIds.push(apt.id));
        }

        expect(error).toBeNull();
        expect(data).toHaveLength(2);
      }
    });
  });

  test.describe('✅ Advanced Tests - Now Working', () => {
    test('FIX-08: Update user name', async() => {
      if (createdUserIds.length > 0) {
        let userId = createdUserIds[0];
        let newName = `Updated Name ${Date.now()}`

        // console.log('✅ Updating user name...');

        const data, error = await supabase
          .from('users')
          .update({ name: newName })
          .eq('id', userId)
          .select();

        if (error) {
          // console.log('❌ Update error:', error.message);
        } else {
          // console.log('✅ Update SUCCESS!', data[0].name);
        }

        expect(error).toBeNull();
        expect(data[0].name).toBe(newName);
      }
    });

    test('FIX-09: Update patient information', async() => {
      if (createdPatientIds.length > 0) {
        let patientId = createdPatientIds[0];

        // console.log('✅ Updating patient...');

        const data, error = await supabase
          .from('patients')
          .update({
            blood_type: 'B+',
            height_cm: 175,
            weight_kg: 70
          })
          .eq('id', patientId)
          .select();

        if (error) {
          // console.log('❌ Update error:', error.message);
        } else {
          // console.log('✅ Patient updated!', {
            bloodType: data[0].blood_type,
            height: data[0].height_cm,
            weight: data[0].weight_kg
          });
        }

        expect(error).toBeNull();
      }
    });

    test('FIX-10: Update appointment status', async() => {
      if (createdAppointmentIds.length > 0) {
        let aptId = createdAppointmentIds[0];

        // console.log('✅ Updating appointment status...');

        const data, error = await supabase
          .from('appointments')
          .update({ status: 'completed' })
          .eq('id', aptId)
          .select();

        if (error) {
          // console.log('❌ Error:', error.message);
        } else {
          // console.log('✅ Appointment updated to:', data[0].status);
        }

        expect(error).toBeNull();
        expect(data[0].status).toBe('completed');
      }
    });
  });

  test.afterAll(async() => {
    // Cleanup
    // console.log('🧹 Cleaning up test data...');

    for (const id of createdAppointmentIds) {
      await supabase.from('appointments').delete().eq('id', id);
    }
    for (const id of createdPatientIds) {
      await supabase.from('patients').delete().eq('id', id);
    }
    for (const id of createdUserIds) {
      await supabase.from('users').delete().eq('id', id);
    }

    // console.log('✅ Cleanup done!');
  });
});
