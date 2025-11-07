import { test, expect } from '@playwright/test';

test.describe('Auth API Tests', () => {
  const baseURL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001';

  test('POST /api/auth/custom-login should return success with valid credentials', async ({
    request,
  }) => {
    const response = await request.post(`${baseURL}/api/auth/custom-login`, {
      data: {
        email: 'admin@test.com',
        password: 'Admin123!',
      },
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data).toBeDefined();
    expect(data.data.token).toBeTruthy();
    expect(data.data.user).toBeDefined();
    expect(data.data.user.email).toBe('admin@test.com');
  });

  test('POST /api/auth/custom-login should return error with invalid credentials', async ({
    request,
  }) => {
    const response = await request.post(`${baseURL}/api/auth/custom-login`, {
      data: {
        email: 'invalid@test.com',
        password: 'WrongPassword123!',
      },
    });

    expect(response.status()).toBe(401);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error).toBeTruthy();
  });

  test('POST /api/auth/verify should verify valid token', async ({
    request,
  }) => {
    // First login to get token
    const loginResponse = await request.post(
      `${baseURL}/api/auth/custom-login`,
      {
        data: {
          email: 'admin@test.com',
          password: 'Admin123!',
        },
      }
    );

    const loginData = await loginResponse.json();
    expect(loginData.success).toBe(true);
    const token = loginData.data.token;

    // Verify token
    const verifyResponse = await request.post(`${baseURL}/api/auth/verify`, {
      data: { token },
    });

    expect(verifyResponse.ok()).toBeTruthy();
    const verifyData = await verifyResponse.json();
    expect(verifyData.success).toBe(true);
    expect(verifyData.user).toBeDefined();
    expect(verifyData.user.email).toBe('admin@test.com');
  });

  test('POST /api/auth/verify should reject invalid token', async ({
    request,
  }) => {
    const response = await request.post(`${baseURL}/api/auth/verify`, {
      data: { token: 'invalid-token' },
    });

    expect(response.status()).toBe(401);
    const data = await response.json();
    expect(data.success).toBe(false);
  });
});
