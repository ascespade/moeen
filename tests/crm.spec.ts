import { test, expect } from '@playwright/test';

test.describe('CRM Contacts', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/crm/contacts');
  });

  test('should display contacts page', async ({ page }) => {
    await expect(page.getByText('إدارة جهات الاتصال')).toBeVisible();
    await expect(page.getByText('إجمالي جهات الاتصال')).toBeVisible();
    await expect(page.getByText('إضافة جهة اتصال')).toBeVisible();
  });

  test('should create new contact', async ({ page }) => {
    await page.getByText('إضافة جهة اتصال').click();

    await expect(page.getByText('إضافة جهة اتصال جديدة')).toBeVisible();

    // ملء النموذج
    await page.fill(
      'input[placeholder="أدخل الاسم الكامل"]',
      'أحمد محمد العتيبي'
    );
    await page.fill(
      'input[placeholder="example@company.com"]',
      'ahmed@example.com'
    );
    await page.fill('input[placeholder="0501234567"]', '0501234567');
    await page.fill('input[placeholder="اسم الشركة"]', 'شركة التقنية');

    await page.getByText('إضافة جهة الاتصال').click();

    await expect(page.getByText('إضافة جهة اتصال جديدة')).not.toBeVisible();
  });

  test('should filter contacts by status', async ({ page }) => {
    await page.selectOption('select', 'customer');
    await page.getByText('تطبيق الفلاتر').click();

    const customerContacts = page.locator('.card').filter({ hasText: 'عميل' });
    await expect(customerContacts).toHaveCount(1);
  });

  test('should search contacts', async ({ page }) => {
    await page.fill(
      'input[placeholder="ابحث بالاسم أو البريد أو الشركة..."]',
      'أحمد'
    );
    await page.getByText('تطبيق الفلاتر').click();

    await expect(page.getByText('أحمد العتيبي')).toBeVisible();
  });

  test('should switch between table and card view', async ({ page }) => {
    // التحقق من العرض الافتراضي (جدول)
    await expect(page.locator('table')).toBeVisible();

    // التبديل إلى عرض البطاقات
    await page.getByText('بطاقات').click();

    // التحقق من ظهور البطاقات
    await expect(page.locator('.grid')).toBeVisible();
  });
});

test.describe('CRM Leads', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/crm/leads');
  });

  test('should display leads page', async ({ page }) => {
    await expect(page.getByText('العملاء المحتملين')).toBeVisible();
    await expect(page.getByText('إضافة عميل محتمل')).toBeVisible();
  });

  test('should create new lead', async ({ page }) => {
    await page.getByText('إضافة عميل محتمل').click();

    await expect(page.getByText('إضافة عميل محتمل جديد')).toBeVisible();

    await page.fill('input[placeholder="اسم العميل المحتمل"]', 'شركة الرعاية');
    await page.fill(
      'input[placeholder="example@company.com"]',
      'info@healthcare.com'
    );
    await page.fill('input[placeholder="0501234567"]', '0501234567');

    await page.getByText('إضافة العميل المحتمل').click();

    await expect(page.getByText('إضافة عميل محتمل جديد')).not.toBeVisible();
  });
});

test.describe('CRM Deals', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/crm/deals');
  });

  test('should display deals page', async ({ page }) => {
    await expect(page.getByText('إدارة الصفقات')).toBeVisible();
    await expect(page.getByText('إضافة صفقة')).toBeVisible();
  });

  test('should create new deal', async ({ page }) => {
    await page.getByText('إضافة صفقة').click();

    await expect(page.getByText('إضافة صفقة جديدة')).toBeVisible();

    await page.fill('input[placeholder="عنوان الصفقة"]', 'عقد خدمات طبية');
    await page.fill('input[placeholder="قيمة الصفقة"]', '50000');

    await page.getByText('إضافة الصفقة').click();

    await expect(page.getByText('إضافة صفقة جديدة')).not.toBeVisible();
  });

  test('should switch to kanban view', async ({ page }) => {
    await page.getByText('عرض Kanban').click();

    await expect(page.getByText('مراحل الصفقات')).toBeVisible();
    await expect(page.getByText('جديد')).toBeVisible();
    await expect(page.getByText('مؤهل')).toBeVisible();
    await expect(page.getByText('مفاوضات')).toBeVisible();
  });
});

test.describe('CRM Activities', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/crm/activities');
  });

  test('should display activities page', async ({ page }) => {
    await expect(page.getByText('الأنشطة')).toBeVisible();
    await expect(page.getByText('إضافة نشاط')).toBeVisible();
  });

  test('should create new activity', async ({ page }) => {
    await page.getByText('إضافة نشاط').click();

    await expect(page.getByText('إضافة نشاط جديد')).toBeVisible();

    await page.selectOption('select', 'call');
    await page.fill('input[placeholder="موضوع النشاط"]', 'مكالمة متابعة');

    await page.getByText('إضافة النشاط').click();

    await expect(page.getByText('إضافة نشاط جديد')).not.toBeVisible();
  });

  test('should filter activities by type', async ({ page }) => {
    await page.selectOption('select', 'meeting');
    await page.getByText('تطبيق الفلتر').click();

    const meetingActivities = page
      .locator('.card')
      .filter({ hasText: 'اجتماع' });
    await expect(meetingActivities).toHaveCount(1);
  });
});
