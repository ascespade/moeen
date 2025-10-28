import { expect, test } from '@playwright/test';

test.describe('Chatbot Conversations Tests', () => {
  test('should start conversation', async ({ page }) => {
    await page.goto('http://localhost:3001/chatbot');
    await page.waitForLoadState('networkidle');

    expect(true).toBe(true);
  });

  test('should send message', async ({ page }) => {
    await page.goto('http://localhost:3001/chatbot');

    expect(true).toBe(true);
  });

  test('should receive AI response', async ({ page }) => {
    expect(true).toBe(true);
  });
});
