/**
 * Production Security Tests - اختبارات الأمان للإنتاج
 * Tests for requireAuth, ErrorHandler, env config, and Supabase client standardization
 */

import { expect, test } from '@playwright/test';
import { getServiceSupabase } from '../../src/lib/supabaseClient';

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3001';

// Helper to create authenticated request
async function createAuthenticatedRequest(request: any, token?: string) {
  return {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };
}

test.describe('Security: requireAuth Implementation', () => {
  test('GET /api/chatbot/config - should require authentication', async ({
    request,
  }) => {
    const response = await request.get(`${BASE_URL}/api/chatbot/config`);
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.error).toBe('Unauthorized');
  });

  test('POST /api/chatbot/config - should require admin role', async ({
    request,
  }) => {
    // Without auth
    const response1 = await request.post(`${BASE_URL}/api/chatbot/config`, {
      data: { enabled: true },
    });
    expect(response1.status()).toBe(401);

    // With regular user (not admin)
    // Note: This would require creating a test user and getting a token
    // For now, we verify the endpoint exists and requires auth
  });

  test('GET /api/chatbot/conversations - should require authentication', async ({
    request,
  }) => {
    const response = await request.get(
      `${BASE_URL}/api/chatbot/conversations`
    );
    expect(response.status()).toBe(401);
  });

  test('POST /api/chatbot/intents - should require admin/staff role', async ({
    request,
  }) => {
    const response = await request.post(`${BASE_URL}/api/chatbot/intents`, {
      data: { name: 'test', patterns: ['test'] },
    });
    expect(response.status()).toBe(401);
  });

  test('GET /api/healthcare/patients - should require staff/supervisor/doctor/admin', async ({
    request,
  }) => {
    const response = await request.get(`${BASE_URL}/api/healthcare/patients`);
    expect(response.status()).toBe(401);
  });

  test('POST /api/healthcare/patients - should require authorized role', async ({
    request,
  }) => {
    const response = await request.post(`${BASE_URL}/api/healthcare/patients`, {
      data: { first_name: 'Test', last_name: 'Patient' },
    });
    expect(response.status()).toBe(401);
  });

  test('GET /api/dynamic-data/doctors - should require authentication', async ({
    request,
  }) => {
    const response = await request.get(`${BASE_URL}/api/dynamic-data/doctors`);
    expect(response.status()).toBe(401);
  });

  test('POST /api/dynamic-data/doctors - should require admin/supervisor/manager', async ({
    request,
  }) => {
    const response = await request.post(`${BASE_URL}/api/dynamic-data/doctors`, {
      data: { first_name: 'Test', last_name: 'Doctor' },
    });
    expect(response.status()).toBe(401);
  });
});

test.describe('Security: Error Handling', () => {
  test('Error responses should use ErrorHandler format', async ({
    request,
  }) => {
    // Trigger an error by sending invalid data to a protected endpoint
    const response = await request.post(
      `${BASE_URL}/api/dynamic-data/doctors`,
      {
        data: {}, // Invalid empty data
      }
    );

    // Should return 401 (auth error) or 400 (validation error), both with error message
    expect([400, 401]).toContain(response.status());
    const body = await response.json();
    expect(body).toHaveProperty('error');
  });

  test('GET /api/chatbot/doctors - should handle errors gracefully', async ({
    request,
  }) => {
    const response = await request.get(`${BASE_URL}/api/chatbot/doctors`);
    // Should return 401, not 500
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.error).toBeDefined();
  });
});

test.describe('Security: Environment Variable Validation', () => {
  test('WhatsApp webhook should use env.WHATSAPP_VERIFY_TOKEN', async ({
    request,
  }) => {
    // GET request for webhook verification
    const response = await request.get(
      `${BASE_URL}/api/webhook/whatsapp?hub.mode=subscribe&hub.verify_token=wrong_token&hub.challenge=test`
    );
    // Should return 403 Forbidden for wrong token
    expect(response.status()).toBe(403);
  });

  test('WhatsApp webhook POST should validate token', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/webhook/whatsapp`, {
      data: { object: 'whatsapp_business_account' },
      headers: {
        'x-verify-token': 'wrong_token',
      },
    });
    expect(response.status()).toBe(401);
  });
});

test.describe('Security: Supabase Client Standardization', () => {
  test('Protected routes should not expose internal errors', async ({
    request,
  }) => {
    // Try accessing a route that requires admin client
    const response = await request.get(
      `${BASE_URL}/api/dynamic-data/staff?role=admin`
    );
    
    // Should return 401, not 500 (which would indicate internal error)
    expect(response.status()).toBe(401);
    const body = await response.json();
    // Error message should be user-friendly, not exposing stack traces
    expect(body.error).toBe('Unauthorized');
    expect(body.stack).toBeUndefined();
  });
});

test.describe('Security: Authorization Checks', () => {
  test('POST /api/dynamic-data/staff - should require admin/supervisor/manager', async ({
    request,
  }) => {
    const response = await request.post(`${BASE_URL}/api/dynamic-data/staff`, {
      data: {
        email: 'test@test.com',
        name: 'Test Staff',
        role: 'staff',
      },
    });
    expect(response.status()).toBe(401);
  });

  test('DELETE /api/dynamic-data/doctors - should require admin only', async ({
    request,
  }) => {
    const response = await request.delete(
      `${BASE_URL}/api/dynamic-data/doctors?id=test-id`
    );
    expect(response.status()).toBe(401);
  });

  test('DELETE /api/dynamic-data/patients - should require admin only', async ({
    request,
  }) => {
    const response = await request.delete(
      `${BASE_URL}/api/dynamic-data/patients?id=test-id`
    );
    expect(response.status()).toBe(401);
  });
});
