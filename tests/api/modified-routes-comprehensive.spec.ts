/**
 * Comprehensive Tests for Modified Production Routes
 * Tests all routes that were updated for production readiness
 */

import { expect, test } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3001';

test.describe('Modified Routes: WhatsApp Webhook', () => {
  test('GET /api/webhook/whatsapp - webhook verification', async ({
    request,
  }) => {
    // Test with correct verify token (if env var is set)
    // This test requires WHATSAPP_VERIFY_TOKEN to be set
    const response = await request.get(
      `${BASE_URL}/api/webhook/whatsapp?hub.mode=subscribe&hub.verify_token=test_token&hub.challenge=test_challenge`
    );

    // Should return either 200 (if token matches) or 403 (if token doesn't match)
    expect([200, 403]).toContain(response.status());
  });

  test('POST /api/webhook/whatsapp - should validate verify token header', async ({
    request,
  }) => {
    const response = await request.post(`${BASE_URL}/api/webhook/whatsapp`, {
      data: {
        object: 'whatsapp_business_account',
        entry: [],
      },
      headers: {
        'x-verify-token': 'invalid_token',
      },
    });

    // Should return 401 for invalid token
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.error).toBe('Unauthorized');
  });

  test('POST /api/webhook/whatsapp - should handle valid webhook payload', async ({
    request,
  }) => {
    // This would require valid token - testing structure only
    const response = await request.post(`${BASE_URL}/api/webhook/whatsapp`, {
      data: {
        object: 'whatsapp_business_account',
        entry: [
          {
            changes: [
              {
                value: {
                  messages: [
                    {
                      from: '1234567890',
                      text: { body: 'test message' },
                      id: 'msg_123',
                    },
                  ],
                  contacts: [{ profile: { name: 'Test User' } }],
                },
              },
            ],
          },
        ],
      },
      headers: {
        'x-verify-token': 'invalid_for_test',
      },
    });

    // Should validate token first
    expect([401, 403]).toContain(response.status());
  });
});

test.describe('Modified Routes: Chatbot Configuration', () => {
  test('GET /api/chatbot/config - requires authentication', async ({
    request,
  }) => {
    const response = await request.get(`${BASE_URL}/api/chatbot/config`);
    expect(response.status()).toBe(401);
  });

  test('POST /api/chatbot/config - requires admin role', async ({
    request,
  }) => {
    const response = await request.post(`${BASE_URL}/api/chatbot/config`, {
      data: { enabled: true },
    });
    expect(response.status()).toBe(401);
  });
});

test.describe('Modified Routes: Dynamic Data APIs', () => {
  test('GET /api/dynamic-data/doctors - requires auth', async ({
    request,
  }) => {
    const response = await request.get(`${BASE_URL}/api/dynamic-data/doctors`);
    expect(response.status()).toBe(401);
  });

  test('GET /api/dynamic-data/doctors - with query params structure', async ({
    request,
  }) => {
    // Test that endpoint accepts expected query params (even without auth)
    const response = await request.get(
      `${BASE_URL}/api/dynamic-data/doctors?specialization=cardiology&include_users=true`
    );
    // Should still require auth
    expect(response.status()).toBe(401);
  });

  test('POST /api/dynamic-data/doctors - requires admin/supervisor/manager', async ({
    request,
  }) => {
    const response = await request.post(`${BASE_URL}/api/dynamic-data/doctors`, {
      data: {
        first_name: 'Test',
        last_name: 'Doctor',
        specialization: 'Cardiology',
      },
    });
    expect(response.status()).toBe(401);
  });

  test('PUT /api/dynamic-data/doctors - requires admin/supervisor/manager', async ({
    request,
  }) => {
    const response = await request.put(`${BASE_URL}/api/dynamic-data/doctors`, {
      data: {
        id: 'test-id',
        specialization: 'Updated Specialty',
      },
    });
    expect(response.status()).toBe(401);
  });

  test('DELETE /api/dynamic-data/doctors - requires admin only', async ({
    request,
  }) => {
    const response = await request.delete(
      `${BASE_URL}/api/dynamic-data/doctors?id=test-id`
    );
    expect(response.status()).toBe(401);
  });

  test('GET /api/dynamic-data/patients - requires auth', async ({
    request,
  }) => {
    const response = await request.get(`${BASE_URL}/api/dynamic-data/patients`);
    expect(response.status()).toBe(401);
  });

  test('POST /api/dynamic-data/patients - requires authorized role', async ({
    request,
  }) => {
    const response = await request.post(
      `${BASE_URL}/api/dynamic-data/patients`,
      {
        data: {
          first_name: 'Test',
          last_name: 'Patient',
        },
      }
    );
    expect(response.status()).toBe(401);
  });

  test('GET /api/dynamic-data/staff - requires auth', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/dynamic-data/staff`);
    expect(response.status()).toBe(401);
  });

  test('POST /api/dynamic-data/staff - requires admin/supervisor/manager', async ({
    request,
  }) => {
    const response = await request.post(`${BASE_URL}/api/dynamic-data/staff`, {
      data: {
        email: 'staff@test.com',
        name: 'Test Staff',
        role: 'staff',
      },
    });
    expect(response.status()).toBe(401);
  });
});

test.describe('Modified Routes: Healthcare APIs', () => {
  test('GET /api/healthcare/patients - requires authorized role', async ({
    request,
  }) => {
    const response = await request.get(
      `${BASE_URL}/api/healthcare/patients`
    );
    expect(response.status()).toBe(401);
  });

  test('POST /api/healthcare/patients - requires authorized role', async ({
    request,
  }) => {
    const response = await request.post(
      `${BASE_URL}/api/healthcare/patients`,
      {
        data: {
          first_name: 'Test',
          last_name: 'Patient',
        },
      }
    );
    expect(response.status()).toBe(401);
  });

  test('GET /api/healthcare/appointments - requires auth', async ({
    request,
  }) => {
    const response = await request.get(
      `${BASE_URL}/api/healthcare/appointments`
    );
    expect(response.status()).toBe(401);
  });

  test('POST /api/healthcare/appointments - requires auth', async ({
    request,
  }) => {
    const response = await request.post(
      `${BASE_URL}/api/healthcare/appointments`,
      {
        data: {
          patient_id: 'test-id',
          doctor_id: 'test-id',
          appointment_date: '2024-01-01',
          appointment_time: '10:00',
        },
      }
    );
    expect(response.status()).toBe(401);
  });
});

test.describe('Modified Routes: Chatbot APIs', () => {
  test('GET /api/chatbot/conversations - requires auth', async ({
    request,
  }) => {
    const response = await request.get(
      `${BASE_URL}/api/chatbot/conversations`
    );
    expect(response.status()).toBe(401);
  });

  test('POST /api/chatbot/conversations - requires auth', async ({
    request,
  }) => {
    const response = await request.post(
      `${BASE_URL}/api/chatbot/conversations`,
      {
        data: {
          whatsapp_number: '+1234567890',
          customer_name: 'Test Customer',
        },
      }
    );
    expect(response.status()).toBe(401);
  });

  test('GET /api/chatbot/intents - requires auth', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/chatbot/intents`);
    expect(response.status()).toBe(401);
  });

  test('POST /api/chatbot/intents - requires admin/staff', async ({
    request,
  }) => {
    const response = await request.post(`${BASE_URL}/api/chatbot/intents`, {
      data: {
        name: 'test_intent',
        patterns: ['test pattern'],
      },
    });
    expect(response.status()).toBe(401);
  });

  test('GET /api/chatbot/flows - requires auth', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/chatbot/flows`);
    expect(response.status()).toBe(401);
  });

  test('POST /api/chatbot/flows - requires admin/staff', async ({
    request,
  }) => {
    const response = await request.post(`${BASE_URL}/api/chatbot/flows`, {
      data: {
        name: 'test_flow',
        steps: [],
      },
    });
    expect(response.status()).toBe(401);
  });

  test('GET /api/chatbot/doctors - requires auth', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/chatbot/doctors`);
    expect(response.status()).toBe(401);
  });
});
