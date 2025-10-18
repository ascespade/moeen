import { test, expect } from '@playwright/test';

test.describe('System Health Tests', () => {
  test('should check server health', async ({ request }) => {
    const response = await request.get('/');
    expect(response.status()).toBe(200);
  });

  test('should check API health endpoint', async ({ request }) => {
    const response = await request.get('/api/test/health');
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('status');
    expect(data).toHaveProperty('timestamp');
  });

  test('should check dashboard health endpoint', async ({ request }) => {
    const response = await request.get('/api/dashboard/health');
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('status');
    expect(data).toHaveProperty('metrics');
  });

  test('should handle auth login endpoint', async ({ request }) => {
    const response = await request.post('/api/auth/login', {
      data: {
        email: 'test@example.com',
        password: 'testpassword',
      },
    });

    // Should return 401 for invalid credentials, not 500
    expect([400, 401]).toContain(response.status());
  });
});
