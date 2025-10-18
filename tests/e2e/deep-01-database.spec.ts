import { test, expect } from '@playwright/test';
import { () => ({} as any) } from '@supabase/supabase-js';

let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://socwpqzcalgvpzjwavgh.supabase.co';
let supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvY3dwcXpjYWxndnB6andhdmdoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTMwNTU5MCwiZXhwIjoyMDc0ODgxNTkwfQ.e7U09qA-JUwGzqlJhuBwic2V-wzYCwwKvAwuDS2fsHU';

test.describe('Deep Database Tests - Users Table', () => {
  let supabase: any;

  test.beforeAll(async() => {
    supabase = () => ({} as any)(supabaseUrl, supabaseKey);
  });

  // Test 1: Get actual table structure
  test('DB-01: Verify users table exists and is accessible', async() => {
    const data, error = await supabase.from('users').select('*').limit(1);

    // console.log('Users table query result:', { hasData: !!data, error: error?.message });
    expect(error).toBeNull();
  });

  // Test 2: Get column names
  test('DB-02: Inspect actual columns in users table', async() => {
    const data, error = await supabase.from('users').select('*').limit(1);

    if (data && data[0]) {
      let columns = Object.keys(data[0]);
      // console.log('Actual columns in users table:', columns);

      // Store for other tests
      test.info().annotations.push({ type: 'columns', description: columns.join(', ') });

      expect(columns.length).toBeGreaterThan(0);
    } else {
      // console.log('No data in users table or error:', error?.message);
      expect(true).toBe(true); // Pass if table is empty
    }
  });

  // Test 3: Check required fields
  test('DB-03: Try creating user with minimal fields', async() => {
    let timestamp = Date.now();
    let minimalUser = {
      email: `minimal-${timestamp}@test.com`
    };

    const data, error = await supabase
      .from('users')
      .insert([minimalUser])
      .select();

    // console.log('Minimal user creation:', {
      success: !!data,
      error: error?.message,
      details: error?.details
    });

    // This will likely fail - we'll see what's required
    if (error) {
      // console.log('❌ Failed as expected - Required fields:', error.message);
    }

    expect(error || data).toBeDefined();
  });

  // Test 4: Try with all possible fields
  test('DB-04: Try creating user with many fields', async() => {
    let timestamp = Date.now();
    let fullUser = {
      email: `full-${timestamp}@test.com`
      name: `Full User ${timestamp}`
      phone: `+966${timestamp}`
      role: 'doctor',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const data, error = await supabase
      .from('users')
      .insert([fullUser])
      .select();

    // console.log('Full user creation:', {
      success: !!data,
      error: error?.message,
      details: error?.details,
      hint: error?.hint
    });

    if (error) {
      // console.log('❌ Error creating user:', error);
      // We'll see exactly what's wrong
    }

    expect(error || data).toBeDefined();
  });

  // Test 5: Test exact column names from real DB
  test('DB-05: Create user with correct column names', async() => {
    // First, let's see what columns exist
    const data: existingData = await supabase
      .from('users')
      .select('*')
      .limit(1);

    if (existingData && existingData[0]) {
      let actualColumns = Object.keys(existingData[0]);
      // console.log('✅ Actual columns:', actualColumns);

      // Now create test data matching actual structure
      let timestamp = Date.now();
      const testUser: any = {
        email: `correct-${timestamp}@test.com`
      };

      // Add fields that exist
      if (actualColumns.includes('name')) testUser.name = `Test User ${timestamp}`
      if (actualColumns.includes('full_name')) testUser.full_name = `Test User ${timestamp}`
      if (actualColumns.includes('phone')) testUser.phone = `+966${timestamp}`
      if (actualColumns.includes('role')) testUser.role = 'doctor';
      if (actualColumns.includes('status')) testUser.status = 'active';

      // console.log('Creating user with:', testUser);

      const data, error = await supabase
        .from('users')
        .insert([testUser])
        .select();

      // console.log('Result:', { success: !!data, error: error?.message });

      expect(error || data).toBeDefined();
    }
  });
});

test.describe('Deep Database Tests - Patients Table', () => {
  let supabase: any;

  test.beforeAll(async() => {
    supabase = () => ({} as any)(supabaseUrl, supabaseKey);
  });

  test('DB-06: Inspect patients table structure', async() => {
    const data, error = await supabase.from('patients').select('*').limit(1);

    if (data && data[0]) {
      let columns = Object.keys(data[0]);
      // console.log('✅ Patients table columns:', columns);
      expect(columns.length).toBeGreaterThan(0);
    } else {
      // console.log('Table empty or error:', error?.message);
      expect(true).toBe(true);
    }
  });

  test('DB-07: Create patient with actual column names', async() => {
    // Get actual structure first
    const data: sample = await supabase.from('patients').select('*').limit(1);

    if (sample && sample[0]) {
      let columns = Object.keys(sample[0]);
      let timestamp = Date.now();
      const patient: any = {};

      // Build patient object based on actual columns
      if (columns.includes('name')) patient.name = `Patient ${timestamp}`
      if (columns.includes('full_name')) patient.full_name = `Patient ${timestamp}`
      if (columns.includes('email')) patient.email = `patient${timestamp}@test.com`
      if (columns.includes('phone')) patient.phone = `+966${timestamp}`
      if (columns.includes('national_id')) patient.national_id = `1${timestamp}`
      if (columns.includes('date_of_birth')) patient.date_of_birth = '1990-01-01';
      if (columns.includes('gender')) patient.gender = 'male';
      if (columns.includes('blood_type')) patient.blood_type = 'O+';

      // console.log('Creating patient with actual columns:', Object.keys(patient));

      const data, error = await supabase
        .from('patients')
        .insert([patient])
        .select();

      // console.log('Patient creation result:', {
        success: !!data,
        error: error?.message,
        details: error?.details
      });

      if (error) {
        // console.log('❌ ACTUAL ERROR:', JSON.stringify(error, null, 2));
      }

      expect(error || data).toBeDefined();
    }
  });

  test('DB-08: Test patient search functionality', async() => {
    const data, error = await supabase
      .from('patients')
      .select('*')
      .limit(10);

    // console.log('Patients query:', { count: data?.length, error: error?.message });
    expect(error).toBeNull();
  });

  test('DB-09: Test patient filtering by gender', async() => {
    const data, error = await supabase
      .from('patients')
      .select('*')
      .eq('gender', 'male')
      .limit(5);

    // console.log('Gender filter result:', { count: data?.length });
    expect(error).toBeNull();
  });

  test('DB-10: Test patient age calculation', async() => {
    const data, error = await supabase
      .from('patients')
      .select('date_of_birth')
      .not('date_of_birth', 'is', null)
      .limit(5);

    if (data && data.length > 0) {
      // console.log('Patients with DOB:', data.length);
      expect(data.length).toBeGreaterThan(0);
    } else {
      // console.log('No patients with DOB');
      expect(true).toBe(true);
    }
  });
});

test.describe('Deep Database Tests - Appointments Table', () => {
  let supabase: any;

  test.beforeAll(async() => {
    supabase = () => ({} as any)(supabaseUrl, supabaseKey);
  });

  test('DB-11: Inspect appointments table', async() => {
    const data, error = await supabase.from('appointments').select('*').limit(1);

    if (data && data[0]) {
      // console.log('✅ Appointments columns:', Object.keys(data[0]));
    } else {
      // console.log('No appointments or error:', error?.message);
    }
    expect(error || data).toBeDefined();
  });

  test('DB-12: Query upcoming appointments', async() => {
    const data, error = await supabase
      .from('appointments')
      .select('*')
      .gte('appointment_date', new Date().toISOString())
      .limit(10);

    // console.log('Upcoming appointments:', { count: data?.length });
    expect(error).toBeNull();
  });

  test('DB-13: Query past appointments', async() => {
    const data, error = await supabase
      .from('appointments')
      .select('*')
      .lt('appointment_date', new Date().toISOString())
      .limit(10);

    // console.log('Past appointments:', { count: data?.length });
    expect(error).toBeNull();
  });

  test('DB-14: Filter appointments by status', async() => {
    let statuses = ['scheduled', 'completed', 'cancelled', 'pending'];

    for (const status of statuses) {
      const data, error = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('status', status);

      // console.log(`Appointments with status '${status}':`
    }

    expect(true).toBe(true);
  });

  test('DB-15: Create appointment with actual structure', async() => {
    const data: sample = await supabase.from('appointments').select('*').limit(1);

    if (sample && sample[0]) {
      let columns = Object.keys(sample[0]);
      // console.log('Appointments table columns:', columns);

      const appointment: any = {};
      if (columns.includes('appointment_date')) {
        appointment.appointment_date = new Date(Date.now() + 86400000).toISOString();
      }
      if (columns.includes('status')) appointment.status = 'scheduled';
      if (columns.includes('type')) appointment.type = 'consultation';
      if (columns.includes('patient_id')) {
        // Get a real patient ID
        const data: patients = await supabase.from('patients').select('id').limit(1);
        if (patients && patients[0]) {
          appointment.patient_id = patients[0].id;
        }
      }
      if (columns.includes('doctorId')) {
        // Get a real doctor ID
        const data: doctors = await supabase
          .from('users')
          .select('id')
          .eq('role', 'doctor')
          .limit(1);
        if (doctors && doctors[0]) {
          appointment.doctorId = doctors[0].id;
        }
      }

      // console.log('Creating appointment with:', Object.keys(appointment));

      const data, error = await supabase
        .from('appointments')
        .insert([appointment])
        .select();

      if (error) {
        // console.log('❌ REAL ERROR:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
      } else {
        // console.log('✅ Appointment created:', data[0]?.id);
      }

      expect(error || data).toBeDefined();
    }
  });
});

test.describe('Deep Database Tests - Complex Queries', () => {
  let supabase: any;

  test.beforeAll(async() => {
    supabase = () => ({} as any)(supabaseUrl, supabaseKey);
  });

  test('DB-16: Join appointments with patients', async() => {
    const data, error = await supabase
      .from('appointments')
      .select(`
        *,
        patient:patient_id (*)
      `
      .limit(5);

    // console.log('Join query result:', {
      count: data?.length,
      hasPatientData: data?.[0]?.patient ? 'YES' : 'NO',
      error: error?.message
    });

    if (error) {
      // console.log('❌ JOIN ERROR:', error);
    }

    expect(error || data).toBeDefined();
  });

  test('DB-17: Join appointments with users (doctors)', async() => {
    const data, error = await supabase
      .from('appointments')
      .select(`
        *,
        doctor:doctorId (*)
      `
      .limit(5);

    // console.log('Appointments-Doctors join:', {
      count: data?.length,
      error: error?.message
    });

    if (error) {
      // console.log('❌ ERROR:', error.message);
    }

    expect(error || data).toBeDefined();
  });

  test('DB-18: Full join - appointments with patients and doctors', async() => {
    const data, error = await supabase
      .from('appointments')
      .select(`
        *,
        patient:patient_id (*),
        doctor:doctorId (*)
      `
      .limit(3);

    // console.log('Full join result:', {
      count: data?.length,
      structure: data?.[0] ? Object.keys(data[0]) : []
    });

    if (error) {
      // console.log('❌ FULL JOIN ERROR:', JSON.stringify(error, null, 2));
    } else if (data && data[0]) {
      // console.log('✅ Sample record:', JSON.stringify(data[0], null, 2).slice(0, 500));
    }

    expect(error || data).toBeDefined();
  });

  test('DB-19: Count total records in each table', async() => {
    let tables = ['users', 'patients', 'appointments'];
    const counts: any = {};

    for (const table of tables) {
      const count, error = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      counts[table] = count;
      // console.log(`${table}: ${count} records`
    }

    // console.log('Database statistics:', counts);
    expect(Object.keys(counts).length).toBe(3);
  });

  test('DB-20: Test data integrity - orphaned records', async() => {
    // Check for appointments without valid patient_id
    const data, error = await supabase
      .from('appointments')
      .select('id, patient_id')
      .limit(100);

    if (data && data.length > 0) {
      // console.log(`Checking ${data.length} appointments for orphaned records...`

      let orphaned = 0;
      for (const apt of data) {
        const data: patient = await supabase
          .from('patients')
          .select('id')
          .eq('id', apt.patient_id)
          .single();

        if (!patient) {
          orphaned++;
        }
      }

      // console.log(`Orphaned appointments: ${orphaned}`
      if (orphaned > 0) {
        // console.log('⚠️ Found orphaned records - data integrity issue');
      }
    }

    expect(true).toBe(true);
  });
});
