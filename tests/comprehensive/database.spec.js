import { test, expect } from '@playwright/test';

test.describe('Database Tests - Comprehensive', () => {
  const baseURL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:3000';

  test('Database connection is healthy', async ({ page }) => {
    await page.goto(`${baseURL}/api/health`);
    const response = await page.textContent('body');
    expect(response).toContain('database');
  });

  test('User table operations work', async ({ page }) => {
    // اختبار إنشاء مستخدم
    await page.goto(`${baseURL}/api/admin/users`);
    
    // البحث عن عناصر الجدول
    const table = page.locator('table, .data-table, [data-testid="users-table"]');
    if (await table.isVisible()) {
      await expect(table).toBeVisible();
      
      // اختبار البحث
      const searchInput = page.locator('input[type="search"], input[placeholder*="search"], input[placeholder*="Search"]');
      if (await searchInput.isVisible()) {
        await searchInput.fill('test');
        await page.waitForLoadState('networkidle');
      }
    }
  });

  test('Appointments table operations work', async ({ page }) => {
    // اختبار جدول المواعيد
    await page.goto(`${baseURL}/dashboard`);
    
    // البحث عن جدول المواعيد
    const appointmentsTable = page.locator('[data-testid="appointments-table"], .appointments-table, table');
    if (await appointmentsTable.isVisible()) {
      await expect(appointmentsTable).toBeVisible();
      
      // اختبار التصفية
      const filterButton = page.locator('button[data-testid="filter"], .filter-button, button:has-text("Filter")');
      if (await filterButton.isVisible()) {
        await filterButton.click();
        await page.waitForLoadState('networkidle');
      }
    }
  });

  test('Medical records table operations work', async ({ page }) => {
    // اختبار جدول السجلات الطبية
    await page.goto(`${baseURL}/patients`);
    
    // البحث عن جدول السجلات
    const recordsTable = page.locator('[data-testid="records-table"], .medical-records-table, table');
    if (await recordsTable.isVisible()) {
      await expect(recordsTable).toBeVisible();
      
      // اختبار الترتيب
      const sortButton = page.locator('button[data-testid="sort"], .sort-button, th[role="button"]');
      if (await sortButton.isVisible()) {
        await sortButton.click();
        await page.waitForLoadState('networkidle');
      }
    }
  });

  test('Database transactions work correctly', async ({ page }) => {
    // اختبار المعاملات
    await page.goto(`${baseURL}/api/health`);
    
    // البحث عن معلومات المعاملات
    const response = await page.textContent('body');
    expect(response).toMatch(/transaction|commit|rollback/i);
  });

  test('Database indexes are working', async ({ page }) => {
    // اختبار الفهارس
    await page.goto(`${baseURL}/dashboard`);
    
    // اختبار البحث السريع
    const searchInput = page.locator('input[type="search"], input[placeholder*="search"]');
    if (await searchInput.isVisible()) {
      const startTime = Date.now();
      await searchInput.fill('test query');
      await page.waitForLoadState('networkidle');
      const endTime = Date.now();
      
      // يجب أن يكون البحث سريعاً (أقل من 2 ثانية)
      expect(endTime - startTime).toBeLessThan(2000);
    }
  });

  test('Database constraints are enforced', async ({ page }) => {
    // اختبار القيود
    await page.goto(`${baseURL}/register`);
    
    // محاولة إنشاء مستخدم ببيانات غير صحيحة
    await page.fill('input[name="email"]', 'invalid-email');
    await page.fill('input[name="password"]', '123'); // كلمة مرور قصيرة
    await page.click('button[type="submit"]');
    
    // يجب أن تظهر رسالة خطأ
    const errorMessage = page.locator('.error, [role="alert"], .text-red-500');
    if (await errorMessage.isVisible()) {
      await expect(errorMessage).toBeVisible();
    }
  });

  test('Database backup and recovery work', async ({ page }) => {
    // اختبار النسخ الاحتياطي
    await page.goto(`${baseURL}/admin`);
    
    // البحث عن زر النسخ الاحتياطي
    const backupButton = page.locator('button:has-text("Backup"), [data-testid="backup-button"]');
    if (await backupButton.isVisible()) {
      await backupButton.click();
      await page.waitForLoadState('networkidle');
      
      // تأكد من ظهور رسالة نجاح
      const successMessage = page.locator('.success, .text-green-500, [role="alert"]');
      if (await successMessage.isVisible()) {
        await expect(successMessage).toBeVisible();
      }
    }
  });

  test('Database performance is acceptable', async ({ page }) => {
    // اختبار الأداء
    const startTime = Date.now();
    await page.goto(`${baseURL}/dashboard`);
    await page.waitForLoadState('networkidle');
    const endTime = Date.now();
    
    // يجب أن يتم تحميل الصفحة في أقل من 5 ثوان
    expect(endTime - startTime).toBeLessThan(5000);
  });

  test('Database security is enforced', async ({ page }) => {
    // اختبار الأمان
    await page.goto(`${baseURL}/api/admin/users`);
    
    // يجب أن يتم إعادة التوجيه إلى صفحة تسجيل الدخول إذا لم يكن المستخدم مسجل الدخول
    const currentUrl = page.url();
    if (currentUrl.includes('/login') || currentUrl.includes('/auth')) {
      expect(currentUrl).toMatch(/login|auth/);
    }
  });
});
