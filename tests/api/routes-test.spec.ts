import { test, expect } from '@playwright/test';

test.describe('API Routes Tests', () => {
  test('should test auth routes', async ({ request }) => {
    const response = await request.get('http://localhost:3001/api/auth/me');
    expect(response.status()).toBeGreaterThanOrEqual(200);
  });

  test('should test dashboard API', async ({ request }) => {
    const response = await request.get('http://localhost:3001/api/dashboard/metrics');
    expect(response.status()).toBeGreaterThanOrEqual(200);
  });

  test('should test patients API', async ({ request }) => {
    const response = await request.get('http://localhost:3001/api/patients');
    expect(response.status()).toBeGreaterThanOrEqual(200);
  });

  test('should test doctors API', async ({ request }) => {
    const response = await request.get('http://localhost:3001/api/doctors');
    expect(response.status()).toBeGreaterThanOrEqual(200);
  });

  test('should test appointments API', async ({ request }) => {
    const response = await request.get('http://localhost:3001/api/appointments');
    expect(response.status()).toBeGreaterThanOrEqual(200);
  });

  test('should test chatbot API', async ({ request }) => {
    const response = await request.get('http://localhost:3001/api/chatbot/config');
    expect(response.status()).toBeGreaterThanOrEqual(200);
  });

  test('should test CRM API', async ({ request }) => {
    const response = await request.get('http://localhost:3001/api/crm/stats');
    expect(response.status()).toBeGreaterThanOrEqual(200);
  });

  test('should test notifications API', async ({ request }) => {
    const response = await request.get('http://localhost:3001/api/notifications');
    expect(response.status()).toBeGreaterThanOrEqual(200);
  });
});
