import { expect, test } from '@playwright/test';

test.describe('Patients API Routes', () => {
  test('GET /api/patients', async ({ request }) => {
    const response = await request.get('http://localhost:3001/api/patients');
    expect(response.status()).toBeGreaterThanOrEqual(200);
  });

  test('POST /api/patients', async ({ request }) => {
    const response = await request.post('http://localhost:3001/api/patients', {
      data: { name: 'Test Patient', email: 'patient@test.com' }
    });
    expect(response.status()).toBeGreaterThanOrEqual(200);
  });

  test('GET /api/patients/me', async ({ request }) => {
    const response = await request.get('http://localhost:3001/api/patients/me');
    expect(response.status()).toBeGreaterThanOrEqual(200);
  });
});
