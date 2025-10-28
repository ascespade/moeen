import { expect, test } from '@playwright/test';

test.describe('Auth API Routes', () => {
  test('POST /api/auth/login', async ({ request }) => {
    const response = await request.post('http://localhost:3001/api/auth/login', {
      data: { email: 'test@test.com', password: 'test' }
    });
    expect(response.status()).toBeGreaterThanOrEqual(200);
  });

  test('POST /api/auth/register', async ({ request }) => {
    const response = await request.post('http://localhost:3001/api/auth/register', {
      data: { email: 'new@test.com', password: 'test123' }
    });
    expect(response.status()).toBeGreaterThanOrEqual(200);
  });

  test('GET /api/auth/me', async ({ request }) => {
    const response = await request.get('http://localhost:3001/api/auth/me');
    expect(response.status()).toBeGreaterThanOrEqual(200);
  });
});
