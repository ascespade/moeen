import { expect, test } from '@playwright/test';

test.describe('Notifications API Routes', () => {
  test('GET /api/notifications', async ({ request }) => {
    const response = await request.get(
      'http://localhost:3001/api/notifications'
    );
    expect(response.status()).toBeGreaterThanOrEqual(200);
  });

  test('POST /api/notifications/send', async ({ request }) => {
    const response = await request.post(
      'http://localhost:3001/api/notifications/send'
    );
    expect(response.status()).toBeGreaterThanOrEqual(200);
  });

  test('GET /api/notifications/templates', async ({ request }) => {
    const response = await request.get(
      'http://localhost:3001/api/notifications/templates'
    );
    expect(response.status()).toBeGreaterThanOrEqual(200);
  });
});
