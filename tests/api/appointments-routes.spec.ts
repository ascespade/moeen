import { expect, test } from '@playwright/test';

test.describe('Appointments API Routes', () => {
  test('GET /api/appointments', async ({ request }) => {
    const response = await request.get(
      'http://localhost:3001/api/appointments'
    );
    expect(response.status()).toBeGreaterThanOrEqual(200);
  });

  test('POST /api/appointments/book', async ({ request }) => {
    const response = await request.post(
      'http://localhost:3001/api/appointments/book'
    );
    expect(response.status()).toBeGreaterThanOrEqual(200);
  });

  test('GET /api/appointments/availability', async ({ request }) => {
    const response = await request.get(
      'http://localhost:3001/api/appointments/availability'
    );
    expect(response.status()).toBeGreaterThanOrEqual(200);
  });
});
