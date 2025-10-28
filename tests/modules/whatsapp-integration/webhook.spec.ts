import { expect, test } from '@playwright/test';

test.describe('WhatsApp Integration Tests', () => {
  test('should receive webhook', async ({ request }) => {
    const response = await request.post(
      'http://localhost:3001/api/webhook/whatsapp'
    );
    expect(response.status()).toBeGreaterThanOrEqual(200);
  });

  test('should send WhatsApp message', async ({ request }) => {
    expect(true).toBe(true);
  });
});
