const { test, expect } = require('@playwright/test');

test.describe('Database Health Tests', () => {
  test('Database connection is healthy', async ({ page }) => {
    // Test database health endpoint
    const response = await page.request.get('/api/health');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('database');
    expect(data.database).toBe('connected');
  });

  test('Database schema is valid', async ({ page }) => {
    // Test database schema validation
    const response = await page.request.get('/api/database/schema');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('tables');
    expect(Array.isArray(data.tables)).toBe(true);
  });

  test('Database migrations are up to date', async ({ page }) => {
    // Test database migrations
    const response = await page.request.get('/api/database/migrations');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('status');
    expect(data.status).toBe('up-to-date');
  });
});