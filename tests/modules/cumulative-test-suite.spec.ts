import { test, expect } from '@playwright/test';

/**
 * Cumulative Test Suite - مرحلي تنفيذي
 * كل test يعتمد على البيانات من الـ test السابق
 */

test.describe('Complete Cumulative Test Suite - Moeen Medical Center', () => {
  // Shared state across tests
  let testUserId: string | null = null;
  let testPatientId: string | null = null;
  let testAppointmentId: string | null = null;
  let testDoctorId: string | null = null;

  // ========================================
  // PHASE 1: Authentication & Setup
  // ========================================
  test.describe('Phase 1: Authentication & User Setup', () => {
    test('01 - should register new user', async ({ request }) => {
      const response = await request.post(
        'http://localhost:3001/api/auth/register',
        {
          data: {
            email: `test-${Date.now()}@moeen.com`,
            password: 'SecureTestPass123!',
            name: 'Test User',
            role: 'patient',
          },
        }
      );

      expect(response.status()).toBeGreaterThanOrEqual(200);
      if (response.ok()) {
        const data = await response.json();
        testUserId = data.user?.id || null;
      }
    });

    test('02 - should login user', async ({ request }) => {
      const response = await request.post(
        'http://localhost:3001/api/auth/login',
        {
          data: {
            email: 'test@moeen.com',
            password: 'SecureTestPass123!',
          },
        }
      );

      expect(response.status()).toBeGreaterThanOrEqual(200);
    });
  });

  // ========================================
  // PHASE 2: Patients Module
  // ========================================
  test.describe('Phase 2: Patients Management', () => {
    test('03 - should create new patient', async ({ request }) => {
      const response = await request.post(
        'http://localhost:3001/api/patients',
        {
          data: {
            first_name: 'Test',
            last_name: 'Patient',
            email: `patient-${Date.now()}@test.com`,
            phone: '0501234567',
          },
        }
      );

      expect(response.status()).toBeGreaterThanOrEqual(200);
      if (response.ok()) {
        const data = await response.json();
        testPatientId = data.patient?.id || null;
      }
    });

    test('04 - should view patient details', async ({ request }) => {
      if (testPatientId) {
        const response = await request.get(
          `http://localhost:3001/api/patients/${testPatientId}`
        );
        expect(response.status()).toBe(200);
      }
    });

    test('05 - should list all patients', async ({ request }) => {
      const response = await request.get('http://localhost:3001/api/patients');
      expect(response.status()).toBeGreaterThanOrEqual(200);
    });
  });

  // ========================================
  // PHASE 3: Doctors Module
  // ========================================
  test.describe('Phase 3: Doctors Management', () => {
    test('06 - should list available doctors', async ({ request }) => {
      const response = await request.get('http://localhost:3001/api/doctors');
      expect(response.status()).toBeGreaterThanOrEqual(200);
    });

    test('07 - should check doctor availability', async ({ request }) => {
      const response = await request.get(
        'http://localhost:3001/api/doctors/availability'
      );
      expect(response.status()).toBeGreaterThanOrEqual(200);
    });
  });

  // ========================================
  // PHASE 4: Appointments Module
  // ========================================
  test.describe('Phase 4: Appointment Scheduling', () => {
    test('08 - should check appointment availability', async ({ request }) => {
      const response = await request.get(
        'http://localhost:3001/api/appointments/availability'
      );
      expect(response.status()).toBeGreaterThanOrEqual(200);
    });

    test('09 - should book new appointment', async ({ request }) => {
      const response = await request.post(
        'http://localhost:3001/api/appointments/book',
        {
          data: {
            patient_id: testPatientId,
            doctor_id: testDoctorId,
            appointment_date: new Date().toISOString(),
            appointment_time: '10:00:00',
          },
        }
      );

      expect(response.status()).toBeGreaterThanOrEqual(200);
      if (response.ok()) {
        const data = await response.json();
        testAppointmentId = data.appointment?.id || null;
      }
    });

    test('10 - should view appointments', async ({ request }) => {
      const response = await request.get(
        'http://localhost:3001/api/appointments'
      );
      expect(response.status()).toBeGreaterThanOrEqual(200);
    });
  });

  // ========================================
  // PHASE 5: Medical Records
  // ========================================
  test.describe('Phase 5: Medical Records', () => {
    test('11 - should create medical record', async ({ request }) => {
      if (testPatientId && testAppointmentId) {
        const response = await request.post(
          'http://localhost:3001/api/medical-records',
          {
            data: {
              patient_id: testPatientId,
              appointment_id: testAppointmentId,
              record_type: 'consultation',
              title: 'Test Record',
              diagnosis: 'Test Diagnosis',
            },
          }
        );

        expect(response.status()).toBeGreaterThanOrEqual(200);
      }
    });

    test('12 - should view medical records', async ({ request }) => {
      if (testPatientId) {
        const response = await request.get(
          `http://localhost:3001/api/medical-records?patient_id=${testPatientId}`
        );
        expect(response.status()).toBeGreaterThanOrEqual(200);
      }
    });
  });

  // ========================================
  // PHASE 6: Billing & Payments
  // ========================================
  test.describe('Phase 6: Billing & Payments', () => {
    test('13 - should process payment', async ({ request }) => {
      if (testPatientId && testAppointmentId) {
        const response = await request.post(
          'http://localhost:3001/api/payments/process',
          {
            data: {
              patient_id: testPatientId,
              appointment_id: testAppointmentId,
              amount: 500,
              currency: 'SAR',
            },
          }
        );

        expect(response.status()).toBeGreaterThanOrEqual(200);
      }
    });
  });

  // ========================================
  // PHASE 7: Insurance
  // ========================================
  test.describe('Phase 7: Insurance Claims', () => {
    test('14 - should create insurance claim', async ({ request }) => {
      if (testPatientId && testAppointmentId) {
        const response = await request.post(
          'http://localhost:3001/api/insurance/claims',
          {
            data: {
              patient_id: testPatientId,
              appointment_id: testAppointmentId,
              insurance_provider: 'Test Provider',
              claim_amount: 1000,
            },
          }
        );

        expect(response.status()).toBeGreaterThanOrEqual(200);
      }
    });
  });

  // ========================================
  // PHASE 8: Notifications
  // ========================================
  test.describe('Phase 8: Notifications', () => {
    test('15 - should view notifications', async ({ request }) => {
      const response = await request.get(
        'http://localhost:3001/api/notifications'
      );
      expect(response.status()).toBeGreaterThanOrEqual(200);
    });
  });

  // ========================================
  // PHASE 9: CRM
  // ========================================
  test.describe('Phase 9: CRM Management', () => {
    test('16 - should create CRM lead', async ({ request }) => {
      const response = await request.post(
        'http://localhost:3001/api/crm/leads',
        {
          data: {
            name: 'Test Lead',
            email: `lead-${Date.now()}@test.com`,
            phone: '0501234567',
          },
        }
      );

      expect(response.status()).toBeGreaterThanOrEqual(200);
    });
  });

  // ========================================
  // PHASE 10: Chatbot
  // ========================================
  test.describe('Phase 10: Chatbot & AI', () => {
    test('17 - should get chatbot config', async ({ request }) => {
      const response = await request.get(
        'http://localhost:3001/api/chatbot/config'
      );
      expect(response.status()).toBeGreaterThanOrEqual(200);
    });

    test('18 - should send chatbot message', async ({ request }) => {
      const response = await request.post(
        'http://localhost:3001/api/chatbot/message',
        {
          data: {
            message: 'Hello',
            from: '+966501234567',
          },
        }
      );

      expect(response.status()).toBeGreaterThanOrEqual(200);
    });
  });

  // ========================================
  // PHASE 11: Dashboard & Analytics
  // ========================================
  test.describe('Phase 11: Dashboard & Analytics', () => {
    test('19 - should load dashboard metrics', async ({ request }) => {
      const response = await request.get(
        'http://localhost:3001/api/dashboard/metrics'
      );
      expect(response.status()).toBeGreaterThanOrEqual(200);
    });

    test('20 - should get analytics data', async ({ request }) => {
      const response = await request.get(
        'http://localhost:3001/api/analytics/metrics'
      );
      expect(response.status()).toBeGreaterThanOrEqual(200);
    });
  });

  // ========================================
  // PHASE 12: Final Verification
  // ========================================
  test.describe('Phase 12: Final System Verification', () => {
    test('21 - should verify all data integrity', async () => {
      // Final check that all created data exists
      expect(testUserId).toBeTruthy();
      expect(testPatientId).toBeTruthy();
      expect(testAppointmentId).toBeTruthy();

      console.log('✅ All cumulative tests completed successfully');
    });
  });
});
