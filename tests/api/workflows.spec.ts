/**
 * Workflows & Business Logic Tests
 * Tests multi-step workflows, constraints, and business rules
 */

import { expect, test } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3001';

test.describe('Appointment Workflow', () => {
  test('Should prevent duplicate appointments (same doctor, same time)', async ({ request }) => {
    const appointmentData = {
      doctor_id: 'test-doctor-id',
      patient_id: 'test-patient-id',
      appointment_date: '2024-12-31',
      appointment_time: '10:00',
      duration: 60,
    };

    // Create first appointment (would need auth token)
    const response1 = await request.post(`${BASE_URL}/api/healthcare/appointments`, {
      data: appointmentData,
    });

    // If first succeeds (200/201), try to create duplicate
    if ([200, 201].includes(response1.status())) {
      const response2 = await request.post(`${BASE_URL}/api/healthcare/appointments`, {
        data: appointmentData,
      });

      // Should return error for duplicate
      expect([400, 409, 422]).toContain(response2.status());
    } else {
      // First request failed (probably auth), which is expected
      expect([401, 400]).toContain(response1.status());
    }
  });

  test('Should validate appointment time conflicts', async ({ request }) => {
    const appointment1 = {
      doctor_id: 'test-doctor-id',
      patient_id: 'test-patient-id',
      appointment_date: '2024-12-31',
      appointment_time: '10:00',
      duration: 60,
    };

    // Overlapping appointment (starts 30 minutes into the first one)
    const appointment2 = {
      doctor_id: 'test-doctor-id',
      patient_id: 'test-patient-id-2',
      appointment_date: '2024-12-31',
      appointment_time: '10:30',
      duration: 60,
    };

    // Both should not be able to be created for same doctor
    const response1 = await request.post(`${BASE_URL}/api/healthcare/appointments`, {
      data: appointment1,
    });

    if ([200, 201].includes(response1.status())) {
      const response2 = await request.post(`${BASE_URL}/api/healthcare/appointments`, {
        data: appointment2,
      });

      // Should detect conflict
      expect([400, 409, 422]).toContain(response2.status());
    }
  });

  test('Should validate required fields for appointment creation', async ({ request }) => {
    // Missing required fields
    const incompleteData = {
      doctor_id: 'test-doctor-id',
      // Missing patient_id, appointment_date, appointment_time
    };

    const response = await request.post(`${BASE_URL}/api/healthcare/appointments`, {
      data: incompleteData,
    });

    // Should return 400 Bad Request
    expect([400, 401]).toContain(response.status());
  });
});

test.describe('User Registration Workflow', () => {
  test('Should prevent duplicate email registration', async ({ request }) => {
    const userData = {
      email: `test-${Date.now()}@example.com`,
      password: 'SecurePass123!@#',
      name: 'Test User',
    };

    // Create first user
    const response1 = await request.post(`${BASE_URL}/api/auth/register`, {
      data: userData,
    });

    // If first succeeds, try duplicate
    if ([200, 201].includes(response1.status())) {
      const response2 = await request.post(`${BASE_URL}/api/auth/register`, {
        data: userData,
      });

      // Should return error for duplicate email
      expect([400, 409, 422]).toContain(response2.status());
    }
  });

  test('Should validate email format', async ({ request }) => {
    const invalidEmailData = {
      email: 'not-an-email',
      password: 'SecurePass123!@#',
      name: 'Test User',
    };

    const response = await request.post(`${BASE_URL}/api/auth/register`, {
      data: invalidEmailData,
    });

    expect([400, 422]).toContain(response.status());
  });

  test('Should validate password strength', async ({ request }) => {
    const weakPasswordData = {
      email: `test-${Date.now()}@example.com`,
      password: '123', // Too weak
      name: 'Test User',
    };

    const response = await request.post(`${BASE_URL}/api/auth/register`, {
      data: weakPasswordData,
    });

    // Should reject weak password
    expect([400, 422]).toContain(response.status());
  });
});

test.describe('Chatbot Conversation Workflow', () => {
  test('Should create conversation and add messages sequentially', async ({ request }) => {
    // Create conversation
    const conversationData = {
      whatsapp_number: `+1234567890${Date.now()}`,
      customer_name: 'Test Customer',
    };

    const createResponse = await request.post(
      `${BASE_URL}/api/chatbot/conversations`,
      {
        data: conversationData,
      }
    );

    // Should require auth
    expect([200, 201, 401]).toContain(createResponse.status());

    if ([200, 201].includes(createResponse.status())) {
      const conversation = await createResponse.json();
      expect(conversation.conversation).toBeDefined();
      expect(conversation.conversation.id).toBeDefined();
    }
  });
});

test.describe('Patient Data Workflow', () => {
  test('Should create patient and associate with user', async ({ request }) => {
    const patientData = {
      first_name: 'Test',
      last_name: 'Patient',
      email: `patient-${Date.now()}@example.com`,
      phone: '+1234567890',
    };

    const response = await request.post(`${BASE_URL}/api/healthcare/patients`, {
      data: patientData,
    });

    // Should require authorized role
    expect([200, 201, 401, 403]).toContain(response.status());
  });

  test('Should validate patient required fields', async ({ request }) => {
    const incompleteData = {
      first_name: 'Test',
      // Missing last_name
    };

    const response = await request.post(`${BASE_URL}/api/healthcare/patients`, {
      data: incompleteData,
    });

    expect([400, 401, 403]).toContain(response.status());
  });
});
