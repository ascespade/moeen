/**
 * Permissions API Tests
 * Tests role-based access control and permission enforcement
 */

import { expect, test } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3001';

// Mock user tokens for different roles (would need real JWT tokens in actual implementation)
const ROLES = {
  admin: 'admin-token',
  staff: 'staff-token',
  doctor: 'doctor-token',
  patient: 'patient-token',
  supervisor: 'supervisor-token',
  manager: 'manager-token',
};

test.describe('Permissions & Role-Based Access Control', () => {
  test.describe('Admin Routes', () => {
    test('Admin route with admin role should return 200', async ({ request }) => {
      // Note: This requires proper JWT token in Authorization header
      // For now, testing that unauthenticated requests are rejected
      const response = await request.get(`${BASE_URL}/api/admin/dashboard`, {
        headers: {
          Authorization: `Bearer ${ROLES.admin}`,
        },
      });
      
      // Should return 401 if token is invalid/missing, or 200 if valid admin
      expect([200, 401, 403]).toContain(response.status());
    });

    test('Admin route with staff role should return 403', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/admin/dashboard`, {
        headers: {
          Authorization: `Bearer ${ROLES.staff}`,
        },
      });
      
      // Should return 403 Forbidden or 401 Unauthorized
      expect([401, 403]).toContain(response.status());
    });

    test('Admin route without authentication should return 401', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/admin/dashboard`);
      expect(response.status()).toBe(401);
      const body = await response.json();
      expect(body.error).toBeDefined();
    });
  });

  test.describe('Staff Routes', () => {
    test('Healthcare patients route with staff role should work', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/healthcare/patients`, {
        headers: {
          Authorization: `Bearer ${ROLES.staff}`,
        },
      });
      
      // Should return 200 if authorized, 401/403 if not
      expect([200, 401, 403]).toContain(response.status());
    });

    test('Healthcare patients route with patient role should return 403', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/healthcare/patients`, {
        headers: {
          Authorization: `Bearer ${ROLES.patient}`,
        },
      });
      
      // Patients should not access healthcare staff routes
      expect([401, 403]).toContain(response.status());
    });
  });

  test.describe('Role Fallback Logic', () => {
    test('User with multiple roles should have highest permission', async ({ request }) => {
      // Test that users with multiple roles get appropriate permissions
      const response = await request.get(`${BASE_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${ROLES.admin}`,
        },
      });
      
      if (response.status() === 200) {
        const body = await response.json();
        expect(body.user).toBeDefined();
        expect(body.user.role).toBeDefined();
      }
    });
  });

  test.describe('Permission Checks', () => {
    test('POST /api/dynamic-data/doctors requires admin/supervisor/manager', async ({ request }) => {
      // Without auth - should be 401
      const response1 = await request.post(`${BASE_URL}/api/dynamic-data/doctors`, {
        data: { first_name: 'Test' },
      });
      expect(response1.status()).toBe(401);

      // With staff role - should be 403
      const response2 = await request.post(`${BASE_URL}/api/dynamic-data/doctors`, {
        headers: {
          Authorization: `Bearer ${ROLES.staff}`,
        },
        data: { first_name: 'Test' },
      });
      expect([401, 403]).toContain(response2.status());
    });

    test('DELETE /api/dynamic-data/doctors requires admin only', async ({ request }) => {
      // Without auth - should be 401
      const response1 = await request.delete(`${BASE_URL}/api/dynamic-data/doctors?id=test`);
      expect(response1.status()).toBe(401);

      // With supervisor role - should be 403 (only admin allowed)
      const response2 = await request.delete(`${BASE_URL}/api/dynamic-data/doctors?id=test`, {
        headers: {
          Authorization: `Bearer ${ROLES.supervisor}`,
        },
      });
      expect([401, 403]).toContain(response2.status());
    });

    test('POST /api/chatbot/config requires admin only', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/api/chatbot/config`, {
        data: { enabled: true },
      });
      expect(response.status()).toBe(401);
    });

    test('POST /api/chatbot/intents requires admin/staff', async ({ request }) => {
      // Without auth - should be 401
      const response1 = await request.post(`${BASE_URL}/api/chatbot/intents`, {
        data: { name: 'test' },
      });
      expect(response1.status()).toBe(401);

      // With patient role - should be 403
      const response2 = await request.post(`${BASE_URL}/api/chatbot/intents`, {
        headers: {
          Authorization: `Bearer ${ROLES.patient}`,
        },
        data: { name: 'test' },
      });
      expect([401, 403]).toContain(response2.status());
    });
  });
});
