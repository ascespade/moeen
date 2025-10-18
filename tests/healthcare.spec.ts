import { test, expect } from '@playwright/test';

test.describe('Healthcare Appointments', () => {
  test.beforeEach(async({ page }) => {
    await page.goto('/appointments');
  });

  test('should display appointments page', async({ page }) => {
    await expect(page.getByText('إدارة المواعيد')).toBeVisible();
    await expect(page.getByText('إنشاء موعد')).toBeVisible();
    await expect(page.getByText('التقويم')).toBeVisible();
  });

  test('should create new appointment', async({ page }) => {
    await page.getByText('إنشاء موعد').click();

    await expect(page.getByText('إنشاء موعد جديد')).toBeVisible();

    // ملء النموذج
    await page.selectOption('select', '1'); // اختيار المريض
    await page.selectOption('select', '1'); // اختيار الطبيب
    await page.fill('input[type="date"]', '2024-02-15');
    await page.fill('input[type="time"]', '10:00');
    await page.fill('input[type="number"]', '60');
    await page.selectOption('select', 'علاج طبيعي');

    await page.getByText('إنشاء الموعد').click();

    await expect(page.getByText('إنشاء موعد جديد')).not.toBeVisible();
  });

  test('should filter appointments by doctor', async({ page }) => {
    await page.selectOption('select', '1'); // اختيار الطبيب
    await page.getByText('تطبيق الفلاتر').click();

    // التحقق من ظهور مواعيد الطبيب المحدد فقط
    const doctorAppointments = page.locator('.card').filter({ hasText: 'د. سارة أحمد' });
    await expect(doctorAppointments).toHaveCount(1);
  });

  test('should filter appointments by period', async({ page }) => {
    await page.selectOption('select', 'month');
    await page.getByText('تطبيق الفلاتر').click();

    await expect(page.getByText('عرض شهري')).toBeVisible();
  });

  test('should toggle sidebar', async({ page }) => {
    // إخفاء الشريط الجانبي
    await page.getByText('إخفاء الشريط الجانبي').click();

    // التحقق من إخفاء الشريط الجانبي
    await expect(page.locator('aside')).not.toBeVisible();

    // إظهار الشريط الجانبي مرة أخرى
    await page.getByText('إظهار الشريط الجانبي').click();

    // التحقق من ظهور الشريط الجانبي
    await expect(page.locator('aside')).toBeVisible();
  });
});

test.describe('Healthcare Sessions', () => {
  test.beforeEach(async({ page }) => {
    await page.goto('/sessions');
  });

  test('should display sessions page', async({ page }) => {
    await expect(page.getByText('إدارة الجلسات')).toBeVisible();
    await expect(page.getByText('جلسات اليوم')).toBeVisible();
  });

  test('should start session', async({ page }) => {
    const startButton = page.getByText('بدء الجلسة').first();
    await startButton.click();

    // التحقق من تغيير الحالة
    await expect(page.getByText('جاري التنفيذ')).toBeVisible();
  });

  test('should complete session', async({ page }) => {
    const completeButton = page.getByText('إكمال الجلسة').first();
    await completeButton.click();

    // التحقق من تغيير الحالة
    await expect(page.getByText('مكتملة')).toBeVisible();
  });
});

test.describe('Healthcare Patients', () => {
  test.beforeEach(async({ page }) => {
    await page.goto('/patients');
  });

  test('should display patients page', async({ page }) => {
    await expect(page.getByText('إدارة المرضى')).toBeVisible();
    await expect(page.getByText('إضافة مريض')).toBeVisible();
  });

  test('should create new patient', async({ page }) => {
    await page.getByText('إضافة مريض').click();

    await expect(page.getByText('إضافة مريض جديد')).toBeVisible();

    // ملء النموذج
    await page.fill('input[placeholder="الاسم الأول"]', 'أحمد');
    await page.fill('input[placeholder="الاسم الأخير"]', 'محمد');
    await page.fill('input[placeholder="0501234567"]', '0501234567');
    await page.fill('input[placeholder="example@email.com"]', 'ahmed@example.com');
    await page.fill('input[type="date"]', '1990-01-01');
    await page.selectOption('select', 'male');

    await page.getByText('إضافة المريض').click();

    await expect(page.getByText('إضافة مريض جديد')).not.toBeVisible();
  });

  test('should search patients', async({ page }) => {
    await page.fill('input[placeholder="ابحث بالاسم أو الهاتف..."]', 'أحمد');
    await page.getByText('تطبيق الفلتر').click();

    await expect(page.getByText('أحمد محمد')).toBeVisible();
  });

  test('should filter patients by gender', async({ page }) => {
    await page.selectOption('select', 'male');
    await page.getByText('تطبيق الفلتر').click();

    const malePatients = page.locator('.card').filter({ hasText: 'ذكر' });
    await expect(malePatients).toHaveCount(1);
  });

  test('should view patient details', async({ page }) => {
    await page.getByText('عرض التفاصيل').first().click();

    // التحقق من الانتقال إلى صفحة التفاصيل
    await expect(page.url()).toContain('/patients/');
    await expect(page.getByText('ملف المريض')).toBeVisible();
  });
});

test.describe('Healthcare Insurance Claims', () => {
  test.beforeEach(async({ page }) => {
    await page.goto('/insurance-claims');
  });

  test('should display insurance claims page', async({ page }) => {
    await expect(page.getByText('مطالبات التأمين')).toBeVisible();
    await expect(page.getByText('إضافة مطالبة')).toBeVisible();
  });

  test('should create new insurance claim', async({ page }) => {
    await page.getByText('إضافة مطالبة').click();

    await expect(page.getByText('إضافة مطالبة جديدة')).toBeVisible();

    // ملء النموذج
    await page.fill('input[placeholder="رقم المطالبة"]', 'CLM-2024-001');
    await page.selectOption('select', '1'); // اختيار المريض
    await page.fill('input[placeholder="شركة التأمين"]', 'شركة التأمين الوطنية');
    await page.fill('input[type="number"]', '1000');

    await page.getByText('إضافة المطالبة').click();

    await expect(page.getByText('إضافة مطالبة جديدة')).not.toBeVisible();
  });

  test('should filter claims by status', async({ page }) => {
    await page.selectOption('select', 'pending');
    await page.getByText('تطبيق الفلتر').click();

    const pendingClaims = page.locator('.card').filter({ hasText: 'معلقة' });
    await expect(pendingClaims).toHaveCount(1);
  });

  test('should upload documents', async({ page }) => {
    await page.getByText('رفع مستندات').first().click();

    // محاكاة رفع ملف
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('tests/fixtures/sample-document.pdf');

    await expect(page.getByText('تم رفع الملف بنجاح')).toBeVisible();
  });
});
