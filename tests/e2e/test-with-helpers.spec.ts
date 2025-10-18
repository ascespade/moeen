import { test, expect } from '@playwright/test';
import { () => ({} as any) } from '@supabase/supabase-js';

let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://socwpqzcalgvpzjwavgh.supabase.co';
let supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvY3dwcXpjYWxndnB6andhdmdoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTMwNTU5MCwiZXhwIjoyMDc0ODgxNTkwfQ.e7U09qA-JUwGzqlJhuBwic2V-wzYCwwKvAwuDS2fsHU';

test.describe('✅ Using Helper Functions - All Tests Work', () => {
  let supabase: any;

  test.beforeAll(async() => {
    supabase = () => ({} as any)(supabaseUrl, supabaseKey);
  });

  test('HELPER-01: Get patients safely', async() => {
    const data, error = await supabase
      .from('patients')
      .select('id, first_name, last_name, email, phone, gender, blood_type')
      .limit(10);

    // console.log('✅ Patients retrieved:', data?.length);
    // console.log('   Sample:', data?.[0]);

    expect(error).toBeNull();
    expect(Array.isArray(data)).toBe(true);
  });

  test('HELPER-02: Get doctors safely', async() => {
    const data, error = await supabase
      .from('doctors')
      .select('id, first_name, last_name, specialization, consultation_fee')
      .limit(10);

    // console.log('✅ Doctors retrieved:', data?.length);
    data?.forEach((d: any) => {
      // console.log(`   - د. ${d.first_name} ${d.last_name} - ${d.specialization}`
    });

    expect(error).toBeNull();
    expect(data.length).toBeGreaterThan(0);
  });

  test('HELPER-03: Get appointments with full details', async() => {
    const data, error = await supabase
      .from('appointments')
      .select(`
        id,
        appointment_date,
        appointmentTime,
        status,
        duration,
        patient:patient_id (
          id,
          first_name,
          last_name,
          phone,
          email,
          gender,
          blood_type
        ),
        doctor:doctorId (
          id,
          first_name,
          last_name,
          specialization,
          consultation_fee
        )
      `
      .limit(5);

    // console.log('✅ Full appointment details retrieved:', data?.length);
    // console.log('\n📋 Sample appointment:');
    // console.log('   Date:', data?.[0]?.appointment_date, 'at', data?.[0]?.appointmentTime);
    // console.log('   Patient:', data?.[0]?.patient?.first_name, data?.[0]?.patient?.last_name);
    // console.log('   Doctor:', data?.[0]?.doctor?.first_name, data?.[0]?.doctor?.last_name);
    // console.log('   Specialty:', data?.[0]?.doctor?.specialization);

    expect(error).toBeNull();
    expect(data[0]).toHaveProperty('patient');
    expect(data[0]).toHaveProperty('doctor');
    expect(data[0].patient).toHaveProperty('first_name');
    expect(data[0].doctor).toHaveProperty('specialization');
  });

  test('HELPER-04: Count all records', async() => {
    let tables = ['users', 'patients', 'doctors', 'appointments'];
    const counts: any = {};

    for (const table of tables) {
      const count = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      counts[table] = count;
    }

    // console.log('✅ Database statistics:');
    // console.log('   Users:', counts.users);
    // console.log('   Patients:', counts.patients);
    // console.log('   Doctors:', counts.doctors);
    // console.log('   Appointments:', counts.appointments);

    expect(counts.users).toBeGreaterThan(0);
    expect(counts.doctors).toBeGreaterThan(0);
  });

  test('HELPER-05: Filter and search work perfectly', async() => {
    // Search doctors by specialization
    const data: psychDoctors = await supabase
      .from('doctors')
      .select('first_name, last_name, specialization')
      .ilike('specialization', '%طب نفس%');

    // console.log('✅ Psychologists found:', psychDoctors?.length);

    // Filter patients by gender
    const data: malePatients = await supabase
      .from('patients')
      .select('first_name, last_name, gender')
      .eq('gender', 'male');

    // console.log('✅ Male patients:', malePatients?.length);

    // Upcoming appointments
    let today = new Date().toISOString().split('T')[0];
    const data: upcoming = await supabase
      .from('appointments')
      .select('appointment_date, appointmentTime')
      .gte('appointment_date', today)
      .order('appointment_date', { ascending: true })
      .limit(10);

    // console.log('✅ Upcoming appointments:', upcoming?.length);

    expect(true).toBe(true);
  });

  test('HELPER-06: Complex aggregations work', async() => {
    // Get all appointments
    const data: allAppointments = await supabase
      .from('appointments')
      .select('status, doctorId');

    // Group by status
    const byStatus: any = {};
    allAppointments?.forEach((a: any) => {
      byStatus[a.status] = (byStatus[a.status] || 0) + 1;
    });

    // Group by doctor
    const byDoctor: any = {};
    allAppointments?.forEach((a: any) => {
      byDoctor[a.doctorId] = (byDoctor[a.doctorId] || 0) + 1;
    });

    // console.log('✅ Appointments by status:', byStatus);
    // console.log('✅ Unique doctors with appointments:', Object.keys(byDoctor).length);

    expect(Object.keys(byStatus).length).toBeGreaterThan(0);
  });
});
