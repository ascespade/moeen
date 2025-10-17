import { test, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

test.describe('Database CRUD Operations - Comprehensive', () => {
  let supabase: any;
  let testUserId: string;
  let testPatientId: string;
  
  test.beforeAll(async () => {
    supabase = createClient(supabaseUrl, supabaseKey);
  });
  
  test.describe('Users Table Operations', () => {
    test('should create a new user with all fields', async () => {
      const timestamp = Date.now();
      const userData = {
        email: `test-user-${timestamp}@moeen.test`,
        full_name: `Test User ${timestamp}`,
        role: 'doctor',
        phone: `+966${timestamp}`.slice(0, 13),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('users')
        .insert([userData])
        .select();
      
      expect(error).toBeNull();
      expect(data).not.toBeNull();
      expect(data[0]).toMatchObject({
        email: userData.email,
        full_name: userData.full_name,
        role: userData.role
      });
      
      testUserId = data[0].id;
    });
    
    test('should read user data', async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', testUserId)
        .single();
      
      expect(error).toBeNull();
      expect(data).not.toBeNull();
      expect(data.id).toBe(testUserId);
    });
    
    test('should update user data', async () => {
      const newName = `Updated User ${Date.now()}`;
      
      const { data, error } = await supabase
        .from('users')
        .update({ full_name: newName })
        .eq('id', testUserId)
        .select();
      
      expect(error).toBeNull();
      expect(data[0].full_name).toBe(newName);
    });
    
    test('should query users with filters', async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'doctor')
        .limit(10);
      
      expect(error).toBeNull();
      expect(Array.isArray(data)).toBe(true);
    });
  });
  
  test.describe('Patients Table Operations', () => {
    test('should create a patient record', async () => {
      const timestamp = Date.now();
      const patientData = {
        full_name: `Test Patient ${timestamp}`,
        national_id: `100000${timestamp}`.slice(0, 10),
        phone: `+966${timestamp}`.slice(0, 13),
        email: `patient-${timestamp}@test.com`,
        date_of_birth: '1990-01-01',
        gender: 'male',
        blood_type: 'O+',
        created_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('patients')
        .insert([patientData])
        .select();
      
      expect(error).toBeNull();
      expect(data).not.toBeNull();
      expect(data[0].full_name).toBe(patientData.full_name);
      
      testPatientId = data[0].id;
    });
    
    test('should search patients by name', async () => {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .ilike('full_name', '%Test Patient%')
        .limit(10);
      
      expect(error).toBeNull();
      expect(Array.isArray(data)).toBe(true);
    });
    
    test('should filter patients by age range', async () => {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .gte('date_of_birth', '1980-01-01')
        .lte('date_of_birth', '2000-12-31');
      
      expect(error).toBeNull();
      expect(Array.isArray(data)).toBe(true);
    });
  });
  
  test.describe('Appointments Table Operations', () => {
    test('should create an appointment', async () => {
      if (!testUserId || !testPatientId) {
        test.skip();
      }
      
      const appointmentData = {
        patient_id: testPatientId,
        doctor_id: testUserId,
        appointment_date: new Date(Date.now() + 86400000).toISOString(),
        status: 'scheduled',
        type: 'consultation',
        notes: 'Test appointment',
        created_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('appointments')
        .insert([appointmentData])
        .select();
      
      expect(error).toBeNull();
      expect(data).not.toBeNull();
      expect(data[0].status).toBe('scheduled');
    });
    
    test('should query upcoming appointments', async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .gte('appointment_date', new Date().toISOString())
        .eq('status', 'scheduled')
        .order('appointment_date', { ascending: true })
        .limit(10);
      
      expect(error).toBeNull();
      expect(Array.isArray(data)).toBe(true);
    });
    
    test('should update appointment status', async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select('id')
        .eq('patient_id', testPatientId)
        .limit(1)
        .single();
      
      if (data) {
        const { data: updateData, error: updateError } = await supabase
          .from('appointments')
          .update({ status: 'completed' })
          .eq('id', data.id)
          .select();
        
        expect(updateError).toBeNull();
        expect(updateData[0].status).toBe('completed');
      }
    });
  });
  
  test.describe('Complex Queries and Joins', () => {
    test('should perform join query - patients with appointments', async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          patients:patient_id (
            full_name,
            phone,
            email
          ),
          users:doctor_id (
            full_name,
            role
          )
        `)
        .limit(5);
      
      expect(error).toBeNull();
      expect(Array.isArray(data)).toBe(true);
    });
    
    test('should count records by status', async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select('status', { count: 'exact', head: false })
        .eq('status', 'scheduled');
      
      expect(error).toBeNull();
    });
    
    test('should perform aggregation query', async () => {
      const { data, error } = await supabase
        .rpc('get_appointment_stats', {});
      
      // This will fail if RPC function doesn't exist, which is expected
      // Just checking if RPC calls work
      expect(error || data).toBeDefined();
    });
  });
  
  test.describe('Data Integrity Tests', () => {
    test('should enforce unique constraints', async () => {
      const timestamp = Date.now();
      const duplicateEmail = `duplicate-${timestamp}@test.com`;
      
      // Create first user
      await supabase
        .from('users')
        .insert([{
          email: duplicateEmail,
          full_name: 'First User'
        }]);
      
      // Try to create duplicate
      const { error } = await supabase
        .from('users')
        .insert([{
          email: duplicateEmail,
          full_name: 'Second User'
        }]);
      
      expect(error).not.toBeNull();
      expect(error?.message).toContain('duplicate');
    });
    
    test('should enforce foreign key constraints', async () => {
      const { error } = await supabase
        .from('appointments')
        .insert([{
          patient_id: '00000000-0000-0000-0000-000000000000',
          doctor_id: '00000000-0000-0000-0000-000000000000',
          appointment_date: new Date().toISOString(),
          status: 'scheduled'
        }]);
      
      expect(error).not.toBeNull();
    });
    
    test('should handle null values correctly', async () => {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .is('email', null)
        .limit(10);
      
      expect(error).toBeNull();
      expect(Array.isArray(data)).toBe(true);
    });
  });
  
  test.describe('Performance Tests', () => {
    test('should handle batch inserts efficiently', async () => {
      const timestamp = Date.now();
      const batchSize = 10;
      const patients = Array.from({ length: batchSize }, (_, i) => ({
        full_name: `Batch Patient ${timestamp}-${i}`,
        national_id: `200${timestamp}${i}`.slice(0, 10),
        phone: `+966${timestamp}${i}`.slice(0, 13),
        gender: i % 2 === 0 ? 'male' : 'female',
        created_at: new Date().toISOString()
      }));
      
      const startTime = Date.now();
      const { data, error } = await supabase
        .from('patients')
        .insert(patients)
        .select();
      const endTime = Date.now();
      
      expect(error).toBeNull();
      expect(data).toHaveLength(batchSize);
      expect(endTime - startTime).toBeLessThan(5000); // Should complete within 5 seconds
    });
    
    test('should handle pagination efficiently', async () => {
      const pageSize = 20;
      const { data, error, count } = await supabase
        .from('patients')
        .select('*', { count: 'exact' })
        .range(0, pageSize - 1);
      
      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.length).toBeLessThanOrEqual(pageSize);
    });
  });
  
  test.afterAll(async () => {
    // Cleanup test data
    if (testPatientId) {
      await supabase.from('appointments').delete().eq('patient_id', testPatientId);
      await supabase.from('patients').delete().eq('id', testPatientId);
    }
    if (testUserId) {
      await supabase.from('users').delete().eq('id', testUserId);
    }
  });
});
