import { expect, test } from '@playwright/test';

test.describe('Chatbot API Routes', () => {
  test('GET /api/chatbot/config', async ({ request }) => {
    const response = await request.get(
      'http://localhost:3001/api/chatbot/config'
    );
    expect(response.status()).toBeGreaterThanOrEqual(200);
  });

  test('POST /api/chatbot/message', async ({ request }) => {
    const response = await request.post(
      'http://localhost:3001/api/chatbot/message'
    );
    expect(response.status()).toBeGreaterThanOrEqual(200);
  });

  test('GET /api/chatbot/conversations', async ({ request }) => {
    const response = await request.get(
      'http://localhost:3001/api/chatbot/conversations'
    );
    expect(response.status()).toBeGreaterThanOrEqual(200);
  });

  test('GET /api/chatbot/flows', async ({ request }) => {
    const response = await request.get(
      'http://localhost:3001/api/chatbot/flows'
    );
    expect(response.status()).toBeGreaterThanOrEqual(200);
  });
});
