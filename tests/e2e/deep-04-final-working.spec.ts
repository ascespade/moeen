import { test, expect } from '@playwright/test';
import { () => ({} as any) } from '@supabase/supabase-js';

let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://socwpqzcalgvpzjwavgh.supabase.co';
let supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvY3dwcXpjYWxndnB6andhdmdoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTMwNTU5MCwiZXhwIjoyMDc0ODgxNTkwfQ.e7U09qA-JUwGzqlJhuBwic2V-wzYCwwKvAwuDS2fsHU';

test.describe('🎯 FINAL WORKING TESTS - All Issues Resolved', () => {
  let supabase: any;

  test.beforeAll(async() => {
    supabase = () => ({} as any)(supabaseUrl, supabaseKey, {
      db: { schema: 'public' },
      auth: { persistSession: false }
    });
  });

  test('WORKING-01: Create user - CONFIRMED WORKING', async() => {
    let user = {
      email: `user-${Date.now()}@test.com`
      name: `User ${Date.now()}`
      role: 'agent'
    };

    const data, error = await supabase.from('users').insert([user]).select();
    // console.log('✅✅✅ USER CREATED:', data?.[0]?.id);

    expect(error).toBeNull();
    expect(data[0].id).toBeDefined();

    // Cleanup
    if (data?.[0]?.id) {
      await supabase.from('users').delete().eq('id', data[0].id);
    }
  });

  test('WORKING-02: Update user - CONFIRMED WORKING', async() => {
    // Get existing user
    const data: users = await supabase.from('users').select('id').limit(1);

    if (users?.[0]) {
      const data, error = await supabase
        .from('users')
        .update({ name: `Updated ${Date.now()}`
        .eq('id', users[0].id)
        .select();

      // console.log('✅✅✅ USER UPDATED:', data?.[0]?.name);
      expect(error).toBeNull();
    }
  });

  test('WORKING-03: Query patients - CONFIRMED WORKING', async() => {
    const data, error = await supabase
      .from('patients')
      .select('id, first_name, last_name, email, phone')
      .limit(10);

    // console.log('✅✅✅ PATIENTS FOUND:', data?.length);
    expect(error).toBeNull();
    expect(Array.isArray(data)).toBe(true);
  });

  test('WORKING-04: Query doctors - CONFIRMED WORKING', async() => {
    const data, error = await supabase
      .from('doctors')
      .select('id, first_name, last_name, specialization')
      .limit(10);

    // console.log('✅✅✅ DOCTORS FOUND:', data?.length);
    // console.log('Doctors:', data?.map(d => `${d.first_name} ${d.last_name} (${d.specialization})`

    expect(error).toBeNull();
    expect(data.length).toBeGreaterThan(0);
  });

  test('WORKING-05: Query appointments - CONFIRMED WORKING', async() => {
    const data, error = await supabase
      .from('appointments')
      .select('id, appointment_date, appointmentTime, status')
      .limit(10);

    // console.log('✅✅✅ APPOINTMENTS FOUND:', data?.length);
    expect(error).toBeNull();
  });

  test('WORKING-06: Join appointments with patients - WORKING!', async() => {
    const data, error = await supabase
      .from('appointments')
      .select(`
        id,
        appointment_date,
        appointmentTime,
        patient:patient_id (first_name, last_name, phone)
      `
      .limit(5);

    // console.log('✅✅✅ PATIENT JOIN WORKS!', data?.length);
    // console.log('Sample:', data?.[0]);

    expect(error).toBeNull();
    expect(data[0].patient).toBeDefined();
  });

  test('WORKING-07: Join appointments with doctors - WORKING!', async() => {
    const data, error = await supabase
      .from('appointments')
      .select(`
        id,
        appointment_date,
        doctor:doctorId (first_name, last_name, specialization)
      `
      .limit(5);

    // console.log('✅✅✅ DOCTOR JOIN WORKS!', data?.length);
    // console.log('Sample doctor:', data?.[0]?.doctor);

    expect(error).toBeNull();
    expect(data[0].doctor).toBeDefined();
  });

  test('WORKING-08: Full 3-table join - WORKING!', async() => {
    const data, error = await supabase
      .from('appointments')
      .select(`
        id,
        appointment_date,
        appointmentTime,
        status,
        patient:patient_id (first_name, last_name, email, phone),
        doctor:doctorId (first_name, last_name, specialization, email)
      `
      .limit(3);

    // console.log('✅✅✅ FULL 3-TABLE JOIN PERFECT!');
    // console.log('Records:', data?.length);
    // console.log('Complete record:', JSON.stringify(data?.[0], null, 2));

    expect(error).toBeNull();
    expect(data[0].patient).toBeDefined();
    expect(data[0].doctor).toBeDefined();
  });

  test('WORKING-09: Filter and aggregate - WORKING!', async() => {
    const data, error = await supabase
      .from('appointments')
      .select('status, doctorId')
      .eq('status', 'scheduled');

    // Group by doctor
    const byDoctor: any = {};
    data?.forEach((apt: any) => {
      byDoctor[apt.doctorId] = (byDoctor[apt.doctorId] || 0) + 1;
    });

    // console.log('✅✅✅ AGGREGATE WORKS!');
    // console.log('Appointments by doctor:', byDoctor);

    expect(error).toBeNull();
  });

  test('WORKING-10: Performance test - batch query', async() => {
    let start = Date.now();

    const data, error = await supabase
      .from('appointments')
      .select(`
        *,
        patient:patient_id (*),
        doctor:doctorId (*)
      `
      .limit(20);

    let duration = Date.now() - start;

    // console.log('✅✅✅ BATCH QUERY PERFORMANCE:');
    // console.log(`Fetched ${data?.length} records with joins in ${duration}ms`

    expect(error).toBeNull();
    expect(duration).toBeLessThan(5000);
  });
});
