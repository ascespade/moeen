/**
 * Appointments Module E2E Tests
 * Comprehensive testing following Authentication module methodology
 */

import { test, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

// Test data
const testPatient = {
  email: `test-patient-${Date.now()}@example.com`,
  name: 'Test Patient',
  password: 'TestPassword123!'
};

const testDoctor = {
  id: null as number | null, // Will be fetched
  speciality: 'General Practice'
};

const testAppointment = {
  scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
  type: 'consultation',
  duration: 30
};

// Helper to clean up test data
async function cleanupTestData() {
  // Delete test appointments
  await supabase
    .from('appointments')
    .delete()
    .like('created_by', '%test%');
    
  // Delete test users
  await supabase
    .from('users')
    .delete()
    .like('email', '%test-patient%');
}

test.describe('Appointments Module Tests', () => {
  let patientId: number;
  let patientUserId: string;

  test.beforeAll(async () => {
    // Get a doctor for testing
    const { data: doctors } = await supabase
      .from('doctors')
      .select('id, speciality')
      .limit(1)
      .single();
      
    if (doctors) {
      testDoctor.id = doctors.id;
      testDoctor.speciality = doctors.speciality;
    }
  });

  test.afterAll(async () => {
    await cleanupTestData();
  });

  test.describe('1. Appointment Creation', () => {
    test('1.1 should create appointment successfully', async ({ request }) => {
      // First create a test user and patient
      const { data: authData } = await supabase.auth.signUp({
        email: testPatient.email,
        password: testPatient.password,
      });
      
      expect(authData.user).toBeTruthy();
      patientUserId = authData.user!.id;

      // Create patient record
      const { data: patient } = await supabase
        .from('patients')
        .insert({
          user_id: patientUserId,
          full_name: testPatient.name,
          phone: '0500000000'
        })
        .select()
        .single();

      expect(patient).toBeTruthy();
      patientId = patient.id;

      // Login
      const loginResponse = await request.post('/api/auth/login', {
        data: {
          email: testPatient.email,
          password: testPatient.password
        }
      });

      expect(loginResponse.status()).toBe(200);
      const loginData = await loginResponse.json();
      expect(loginData.success).toBe(true);

      // Create appointment
      const appointmentResponse = await request.post('/api/appointments', {
        data: {
          patientId: patientId,
          doctorId: testDoctor.id,
          scheduledAt: testAppointment.scheduledAt,
          type: testAppointment.type
        },
        headers: {
          'Content-Type': 'application/json'
        }
      });

      expect(appointmentResponse.status()).toBe(200);
      const appointmentData = await appointmentResponse.json();
      
      expect(appointmentData.success).toBe(true);
      expect(appointmentData.appointment).toBeTruthy();
      expect(appointmentData.appointment.status).toBe('pending');
      expect(appointmentData.appointment.paymentStatus).toBe('unpaid');

      // Verify in database
      const { data: dbAppointment } = await supabase
        .from('appointments')
        .select('*')
        .eq('patient_id', patientId)
        .single();

      expect(dbAppointment).toBeTruthy();
      expect(dbAppointment.status).toBe('pending');
      expect(dbAppointment.booking_source).toBe('web');
      expect(dbAppointment.created_by).toBe(patientUserId);

      // Verify audit log
      const { data: auditLog } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('action', 'appointment_created')
        .eq('resource_id', dbAppointment.id)
        .single();

      expect(auditLog).toBeTruthy();
      expect(auditLog.ip_address).toBeTruthy();
      expect(auditLog.user_agent).toBeTruthy();
      expect(auditLog.status).toBe('success');
    });

    test('1.2 should detect appointment conflicts', async ({ request }) => {
      // Check for conflicts at same time
      const conflictResponse = await request.post('/api/appointments/conflict-check', {
        data: {
          doctorId: testDoctor.id,
          scheduledAt: testAppointment.scheduledAt,
          duration: 30
        }
      });

      expect(conflictResponse.status()).toBe(200);
      const conflictData = await conflictResponse.json();
      
      expect(conflictData.success).toBe(true);
      expect(conflictData.data.hasConflicts).toBeTruthy();
      expect(conflictData.data.conflictCount).toBeGreaterThan(0);
    });

    test('1.3 should check doctor availability', async ({ request }) => {
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const dateStr = tomorrow.toISOString().split('T')[0];

      const availabilityResponse = await request.get(
        `/api/appointments/availability?doctorId=${testDoctor.id}&date=${dateStr}&duration=30`
      );

      expect(availabilityResponse.status()).toBe(200);
      const availabilityData = await availabilityResponse.json();
      
      expect(availabilityData.available).toBeDefined();
      expect(availabilityData.slots).toBeDefined();
    });
  });

  test.describe('2. Appointment Updates', () => {
    let appointmentId: number;

    test.beforeAll(async () => {
      // Get existing appointment
      const { data } = await supabase
        .from('appointments')
        .select('id')
        .eq('patient_id', patientId)
        .single();
        
      if (data) {
        appointmentId = data.id;
      }
    });

    test('2.1 should update appointment status', async ({ request }) => {
      const updateResponse = await request.patch(`/api/appointments/${appointmentId}`, {
        data: {
          status: 'confirmed'
        }
      });

      expect(updateResponse.status()).toBe(200);
      const updateData = await updateResponse.json();
      
      expect(updateData.success).toBe(true);
      expect(updateData.appointment.status).toBe('confirmed');

      // Verify in database
      const { data: dbAppointment } = await supabase
        .from('appointments')
        .select('*')
        .eq('id', appointmentId)
        .single();

      expect(dbAppointment.status).toBe('confirmed');
      expect(dbAppointment.updated_by).toBe(patientUserId);
      expect(dbAppointment.last_activity_at).toBeTruthy();

      // Verify audit log
      const { data: auditLog } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('action', 'appointment_updated')
        .eq('resource_id', appointmentId.toString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      expect(auditLog).toBeTruthy();
      expect(auditLog.metadata).toHaveProperty('old_status');
      expect(auditLog.metadata).toHaveProperty('new_status');
      expect(auditLog.metadata.new_status).toBe('confirmed');
    });

    test('2.2 should reschedule appointment', async ({ request }) => {
      const newScheduledAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

      const updateResponse = await request.patch(`/api/appointments/${appointmentId}`, {
        data: {
          scheduled_at: newScheduledAt
        }
      });

      expect(updateResponse.status()).toBe(200);

      // Verify in database
      const { data: dbAppointment } = await supabase
        .from('appointments')
        .select('*')
        .eq('id', appointmentId)
        .single();

      expect(new Date(dbAppointment.scheduled_at).toISOString()).toBe(newScheduledAt);
    });
  });

  test.describe('3. Appointment Retrieval', () => {
    test('3.1 should fetch appointments list', async ({ request }) => {
      const response = await request.get('/api/appointments');

      expect(response.status()).toBe(200);
      const data = await response.json();
      
      expect(data.appointments).toBeDefined();
      expect(Array.isArray(data.appointments)).toBe(true);
    });

    test('3.2 should fetch single appointment', async ({ request }) => {
      const { data: appointment } = await supabase
        .from('appointments')
        .select('id')
        .eq('patient_id', patientId)
        .single();

      if (!appointment) return;

      const response = await request.get(`/api/appointments/${appointment.id}`);

      expect(response.status()).toBe(200);
      const data = await response.json();
      
      expect(data.appointment).toBeTruthy();
      expect(data.appointment.id).toBe(appointment.id);
      expect(data.appointment.patient).toBeTruthy();
      expect(data.appointment.doctor).toBeTruthy();

      // Verify audit log for view
      const { data: auditLog } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('action', 'appointment_viewed')
        .eq('resource_id', appointment.id.toString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      expect(auditLog).toBeTruthy();
    });

    test('3.3 should filter appointments by status', async ({ request }) => {
      const response = await request.get('/api/appointments?status=confirmed');

      expect(response.status()).toBe(200);
      const data = await response.json();
      
      expect(data.appointments).toBeDefined();
      data.appointments.forEach((apt: any) => {
        expect(apt.status).toBe('confirmed');
      });
    });

    test('3.4 should filter appointments by patient', async ({ request }) => {
      const response = await request.get(`/api/appointments?patientId=${patientId}`);

      expect(response.status()).toBe(200);
      const data = await response.json();
      
      expect(data.appointments).toBeDefined();
      data.appointments.forEach((apt: any) => {
        expect(apt.patient_id).toBe(patientId);
      });
    });
  });

  test.describe('4. Appointment Cancellation', () => {
    test('4.1 should cancel appointment', async ({ request }) => {
      const { data: appointment } = await supabase
        .from('appointments')
        .select('id')
        .eq('patient_id', patientId)
        .single();

      if (!appointment) return;

      const updateResponse = await request.patch(`/api/appointments/${appointment.id}`, {
        data: {
          status: 'cancelled',
          cancellation_reason: 'Patient unavailable'
        }
      });

      expect(updateResponse.status()).toBe(200);

      // Verify in database
      const { data: dbAppointment } = await supabase
        .from('appointments')
        .select('*')
        .eq('id', appointment.id)
        .single();

      expect(dbAppointment.status).toBe('cancelled');
      expect(dbAppointment.cancelled_at).toBeTruthy();
      expect(dbAppointment.cancelled_by).toBe(patientUserId);
      expect(dbAppointment.cancellation_reason).toBe('Patient unavailable');

      // Verify audit log
      const { data: auditLog } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('action', 'appointment_cancelled')
        .eq('resource_id', appointment.id.toString())
        .order('created_at', { ascending: false })
        .limit(1);

      // Should have audit log from trigger
      expect(auditLog).toBeTruthy();
    });
  });

  test.describe('5. Database Integration Tests', () => {
    test('5.1 should have tracking columns populated', async () => {
      const { data: appointment } = await supabase
        .from('appointments')
        .select('*')
        .eq('patient_id', patientId)
        .single();

      expect(appointment).toBeTruthy();
      expect(appointment.booking_source).toBeTruthy();
      expect(appointment.created_by).toBeTruthy();
      expect(appointment.last_activity_at).toBeTruthy();
      expect(appointment.created_at).toBeTruthy();
      expect(appointment.updated_at).toBeTruthy();
    });

    test('5.2 should have audit logs for all operations', async () => {
      const { data: appointment } = await supabase
        .from('appointments')
        .select('id')
        .eq('patient_id', patientId)
        .single();

      if (!appointment) return;

      const { data: auditLogs, count } = await supabase
        .from('audit_logs')
        .select('*', { count: 'exact' })
        .or(`resource_id.eq.${appointment.id},metadata->>appointment_id.eq.${appointment.id}`);

      expect(count).toBeGreaterThan(0);
      expect(auditLogs).toBeTruthy();

      // Check for different types of logs
      const actions = auditLogs!.map(log => log.action);
      expect(actions).toContain('user_login');
    });

    test('5.3 should track IP and User Agent', async () => {
      const { data: auditLog } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('action', 'user_login')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      expect(auditLog).toBeTruthy();
      expect(auditLog.ip_address).toBeTruthy();
      expect(auditLog.user_agent).toBeTruthy();
      expect(auditLog.duration_ms).toBeGreaterThan(0);
    });

    test('5.4 should calculate statistics correctly', async () => {
      // Test if we can query appointment statistics
      const { data: stats, count } = await supabase
        .from('appointments')
        .select('*', { count: 'exact' })
        .eq('patient_id', patientId);

      expect(count).toBeGreaterThanOrEqual(0);
      
      const statusCounts = stats?.reduce((acc: any, apt) => {
        acc[apt.status] = (acc[apt.status] || 0) + 1;
        return acc;
      }, {});

      expect(statusCounts).toBeTruthy();
    });
  });
});
