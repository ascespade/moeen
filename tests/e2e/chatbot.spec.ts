// tests/e2e/chatbot.spec.ts
// Chatbot E2E Tests
// Tests healthcare chatbot flows, appointment booking, and AI interactions

import { test, expect } from '@playwright/test';

test.describe('Healthcare Chatbot', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to chatbot interface
    await page.goto('/chatbot');
    await page.waitForLoadState('networkidle');
  });

  test('should display chatbot interface', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Chatbot/);
    
    // Check chatbot header
    await expect(page.locator('h1')).toContainText('مركز الهمم');
    await expect(page.locator('text=مساعد الذكي')).toBeVisible();
    
    // Check chat interface
    await expect(page.locator('[data-testid="chat-container"]')).toBeVisible();
    await expect(page.locator('[data-testid="message-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="send-button"]')).toBeVisible();
  });

  test('should handle appointment booking flow', async ({ page }) => {
    // Start appointment booking conversation
    await page.fill('[data-testid="message-input"]', 'أريد حجز موعد');
    await page.click('[data-testid="send-button"]');
    
    // Wait for bot response
    await page.waitForSelector('[data-testid="bot-message"]', { timeout: 10000 });
    
    // Check bot response
    const botMessage = page.locator('[data-testid="bot-message"]').last();
    await expect(botMessage).toContainText('حجز موعد');
    
    // Provide patient information
    await page.fill('[data-testid="message-input"]', 'أحمد محمد');
    await page.click('[data-testid="send-button"]');
    
    // Wait for next response
    await page.waitForSelector('[data-testid="bot-message"]', { timeout: 10000 });
    
    // Check that bot asks for more information
    const nextBotMessage = page.locator('[data-testid="bot-message"]').last();
    await expect(nextBotMessage).toBeVisible();
  });

  test('should handle appointment inquiry flow', async ({ page }) => {
    // Start appointment inquiry
    await page.fill('[data-testid="message-input"]', 'أريد الاستفسار عن موعدي');
    await page.click('[data-testid="send-button"]');
    
    // Wait for bot response
    await page.waitForSelector('[data-testid="bot-message"]', { timeout: 10000 });
    
    // Check bot response
    const botMessage = page.locator('[data-testid="bot-message"]').last();
    await expect(botMessage).toContainText('موعد');
    
    // Provide appointment reference
    await page.fill('[data-testid="message-input"]', 'APT001');
    await page.click('[data-testid="send-button"]');
    
    // Wait for response
    await page.waitForSelector('[data-testid="bot-message"]', { timeout: 10000 });
    
    // Check appointment details
    const appointmentMessage = page.locator('[data-testid="bot-message"]').last();
    await expect(appointmentMessage).toBeVisible();
  });

  test('should handle appointment cancellation flow', async ({ page }) => {
    // Start appointment cancellation
    await page.fill('[data-testid="message-input"]', 'أريد إلغاء موعدي');
    await page.click('[data-testid="send-button"]');
    
    // Wait for bot response
    await page.waitForSelector('[data-testid="bot-message"]', { timeout: 10000 });
    
    // Check bot response
    const botMessage = page.locator('[data-testid="bot-message"]').last();
    await expect(botMessage).toContainText('إلغاء');
    
    // Provide appointment reference
    await page.fill('[data-testid="message-input"]', 'APT001');
    await page.click('[data-testid="send-button"]');
    
    // Wait for confirmation
    await page.waitForSelector('[data-testid="bot-message"]', { timeout: 10000 });
    
    // Check cancellation confirmation
    const confirmationMessage = page.locator('[data-testid="bot-message"]').last();
    await expect(confirmationMessage).toContainText('تم إلغاء');
  });

  test('should handle general inquiries flow', async ({ page }) => {
    // Start general inquiry
    await page.fill('[data-testid="message-input"]', 'ما هي ساعات العمل؟');
    await page.click('[data-testid="send-button"]');
    
    // Wait for bot response
    await page.waitForSelector('[data-testid="bot-message"]', { timeout: 10000 });
    
    // Check bot response
    const botMessage = page.locator('[data-testid="bot-message"]').last();
    await expect(botMessage).toContainText('ساعات العمل');
  });

  test('should display quick action buttons', async ({ page }) => {
    // Check for quick action buttons
    const quickActions = page.locator('[data-testid="quick-action"]');
    await expect(quickActions).toHaveCount(4);
    
    // Check individual buttons
    await expect(quickActions.nth(0)).toContainText('حجز موعد');
    await expect(quickActions.nth(1)).toContainText('استعلام عن موعد');
    await expect(quickActions.nth(2)).toContainText('إلغاء موعد');
    await expect(quickActions.nth(3)).toContainText('استفسارات عامة');
  });

  test('should handle quick action button clicks', async ({ page }) => {
    // Click quick action button
    await page.click('[data-testid="quick-action"]:has-text("حجز موعد")');
    
    // Check that message was sent
    const userMessage = page.locator('[data-testid="user-message"]').last();
    await expect(userMessage).toContainText('حجز موعد');
    
    // Wait for bot response
    await page.waitForSelector('[data-testid="bot-message"]', { timeout: 10000 });
    
    // Check bot response
    const botMessage = page.locator('[data-testid="bot-message"]').last();
    await expect(botMessage).toBeVisible();
  });

  test('should handle Arabic text input', async ({ page }) => {
    // Test Arabic text input
    const arabicText = 'مرحباً، أريد حجز موعد مع الدكتور سعد';
    await page.fill('[data-testid="message-input"]', arabicText);
    await page.click('[data-testid="send-button"]');
    
    // Check that Arabic text was sent
    const userMessage = page.locator('[data-testid="user-message"]').last();
    await expect(userMessage).toContainText(arabicText);
    
    // Wait for bot response
    await page.waitForSelector('[data-testid="bot-message"]', { timeout: 10000 });
    
    // Check bot response in Arabic
    const botMessage = page.locator('[data-testid="bot-message"]').last();
    await expect(botMessage).toBeVisible();
  });

  test('should handle long messages', async ({ page }) => {
    // Test long message
    const longMessage = 'أريد حجز موعد مع الدكتور سعد العتيبي في تخصص القلب، وأنا أعاني من ألم في الصدر منذ أسبوع، وأريد فحص شامل';
    await page.fill('[data-testid="message-input"]', longMessage);
    await page.click('[data-testid="send-button"]');
    
    // Check that long message was sent
    const userMessage = page.locator('[data-testid="user-message"]').last();
    await expect(userMessage).toContainText(longMessage);
    
    // Wait for bot response
    await page.waitForSelector('[data-testid="bot-message"]', { timeout: 10000 });
    
    // Check bot response
    const botMessage = page.locator('[data-testid="bot-message"]').last();
    await expect(botMessage).toBeVisible();
  });

  test('should handle empty message input', async ({ page }) => {
    // Try to send empty message
    await page.click('[data-testid="send-button"]');
    
    // Check that no message was sent
    const userMessages = page.locator('[data-testid="user-message"]');
    await expect(userMessages).toHaveCount(0);
  });

  test('should handle special characters', async ({ page }) => {
    // Test special characters
    const specialText = 'أريد حجز موعد @#$%^&*()';
    await page.fill('[data-testid="message-input"]', specialText);
    await page.click('[data-testid="send-button"]');
    
    // Check that special characters were handled
    const userMessage = page.locator('[data-testid="user-message"]').last();
    await expect(userMessage).toContainText(specialText);
  });

  test('should display typing indicator', async ({ page }) => {
    // Send message
    await page.fill('[data-testid="message-input"]', 'مرحبا');
    await page.click('[data-testid="send-button"]');
    
    // Check for typing indicator
    await expect(page.locator('[data-testid="typing-indicator"]')).toBeVisible();
    
    // Wait for response
    await page.waitForSelector('[data-testid="bot-message"]', { timeout: 10000 });
    
    // Check that typing indicator is gone
    await expect(page.locator('[data-testid="typing-indicator"]')).not.toBeVisible();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API error
    await page.route('**/api/chatbot/message', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' })
      });
    });
    
    // Send message
    await page.fill('[data-testid="message-input"]', 'مرحبا');
    await page.click('[data-testid="send-button"]');
    
    // Check for error message
    await expect(page.locator('text=حدث خطأ')).toBeVisible();
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that chatbot is responsive
    await expect(page.locator('h1')).toBeVisible();
    
    // Check that chat interface is accessible
    await expect(page.locator('[data-testid="chat-container"]')).toBeVisible();
    
    // Check that quick actions are accessible
    const quickActions = page.locator('[data-testid="quick-action"]');
    await expect(quickActions.first()).toBeVisible();
  });

  test('should maintain conversation history', async ({ page }) => {
    // Send first message
    await page.fill('[data-testid="message-input"]', 'مرحبا');
    await page.click('[data-testid="send-button"]');
    
    // Wait for response
    await page.waitForSelector('[data-testid="bot-message"]', { timeout: 10000 });
    
    // Send second message
    await page.fill('[data-testid="message-input"]', 'أريد حجز موعد');
    await page.click('[data-testid="send-button"]');
    
    // Wait for response
    await page.waitForSelector('[data-testid="bot-message"]', { timeout: 10000 });
    
    // Check that both messages are visible
    const userMessages = page.locator('[data-testid="user-message"]');
    await expect(userMessages).toHaveCount(2);
    
    const botMessages = page.locator('[data-testid="bot-message"]');
    await expect(botMessages).toHaveCount(2);
  });

  test('should handle rapid message sending', async ({ page }) => {
    // Send multiple messages rapidly
    const messages = ['مرحبا', 'أريد حجز موعد', 'مع الدكتور سعد'];
    
    for (const message of messages) {
      await page.fill('[data-testid="message-input"]', message);
      await page.click('[data-testid="send-button"]');
      await page.waitForTimeout(500); // Small delay between messages
    }
    
    // Check that all messages were sent
    const userMessages = page.locator('[data-testid="user-message"]');
    await expect(userMessages).toHaveCount(3);
  });
});
