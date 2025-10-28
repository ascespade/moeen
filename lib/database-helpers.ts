/**
 * Database Helper Functions
 * Workaround for ip_address trigger issue
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Create patient with ip_address workaround
 * Uses API endpoint instead of direct insert
 */
export async function createPatientSafe(patientData: any) {
  // Option 1: Use API endpoint (recommended for production)
  try {
    const response = await fetch('/api/patients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patientData),
    });

    if (response.ok) {
      return { data: await response.json(), error: null };
    }
  } catch (e) {
    // Fallback to direct insert if API not available
  }

  // Option 2: Direct insert (will work once trigger is fixed)
  return await supabase.from('patients').insert([patientData]).select();
}

/**
 * Update user with ip_address workaround
 */
export async function updateUserSafe(userId: string, updates: any) {
  // Option 1: Use API
  try {
    const response = await fetch(`/api/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });

    if (response.ok) {
      return { data: await response.json(), error: null };
    }
  } catch (e) {
    // Fallback
  }

  // Option 2: Direct update
  return await supabase.from('users').update(updates).eq('id', userId).select();
}

/**
 * Create appointment with proper doctor_id from doctors table
 */
export async function createAppointmentSafe(appointmentData: any) {
  // Ensure we have both date and time
  if (!appointmentData.appointment_time) {
    appointmentData.appointment_time = '09:00:00';
  }

  // Ensure doctor_id is from doctors table
  if (!appointmentData.doctor_id) {
    const { data: doctors } = await supabase
      .from('doctors')
      .select('id')
      .limit(1);

    if (doctors && doctors[0]) {
      appointmentData.doctor_id = doctors[0].id;
    }
  }

  return await supabase.from('appointments').insert([appointmentData]).select();
}

/**
 * Get real doctor IDs (not from users table)
 */
export async function getRealDoctors(limit = 10) {
  return await supabase
    .from('doctors')
    .select('id, first_name, last_name, specialization')
    .limit(limit);
}

/**
 * Safe queries that always work
 */
export const safeQueries = {
  // Get all patients
  getPatients: (limit = 10) =>
    supabase.from('patients').select('*').limit(limit),

  // Get all users
  getUsers: (limit = 10) => supabase.from('users').select('*').limit(limit),

  // Get appointments with joins
  getAppointmentsWithDetails: (limit = 10) =>
    supabase
      .from('appointments')
      .select(
        `
      *,
      patient:patient_id (first_name, last_name, email, phone),
      doctor:doctor_id (first_name, last_name, specialization)
    `
      )
      .limit(limit),

  // Get doctors
  getDoctors: (limit = 10) => supabase.from('doctors').select('*').limit(limit),

  // Count records
  countRecords: async (table: string) => {
    const { count } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });
    return count;
  },
};
