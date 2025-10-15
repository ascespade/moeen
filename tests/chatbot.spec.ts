import { test, expect } from '@playwright/test';

test.describe('Chatbot System', () => {
  test.beforeEach(async ({ page }) => {
    // الانتقال إلى صفحة الشات بوت
    await page.goto('/chatbot/flows');
  });

  test('should display chatbot flows page', async ({ page }) => {
    // التحقق من وجود العنوان
    await expect(page.getByText('تدفقات الشات بوت')).toBeVisible();
    
    // التحقق من وجود إحصائيات
    await expect(page.getByText('إجمالي التدفقات')).toBeVisible();
    await expect(page.getByText('منشورة')).toBeVisible();
    await expect(page.getByText('مسودات')).toBeVisible();
    
    // التحقق من وجود زر إنشاء تدفق
    await expect(page.getByText('إنشاء تدفق')).toBeVisible();
  });

  test('should create new flow', async ({ page }) => {
    // النقر على زر إنشاء تدفق
    await page.getByText('إنشاء تدفق').click();
    
    // التحقق من ظهور النافذة المنبثقة
    await expect(page.getByText('إنشاء تدفق جديد')).toBeVisible();
    
    // ملء النموذج
    await page.fill('input[placeholder="مثال: استقبال المرضى"]', 'تدفق اختبار');
    await page.fill('textarea[placeholder="وصف مختصر للتدفق..."]', 'وصف اختبار للتدفق');
    await page.fill('input[placeholder="ترحيب، استقبال (مفصولة بفواصل)"]', 'اختبار، تجريبي');
    
    // النقر على إنشاء التدفق
    await page.getByText('إنشاء التدفق').click();
    
    // التحقق من إغلاق النافذة المنبثقة
    await expect(page.getByText('إنشاء تدفق جديد')).not.toBeVisible();
  });

  test('should filter flows by status', async ({ page }) => {
    // اختيار فلتر الحالة
    await page.selectOption('select', 'draft');
    
    // النقر على تطبيق الفلاتر
    await page.getByText('تطبيق الفلاتر').click();
    
    // التحقق من ظهور التدفقات المفلترة فقط
    const draftFlows = page.locator('.card').filter({ hasText: 'مسودة' });
    await expect(draftFlows).toHaveCount(1);
  });

  test('should search flows', async ({ page }) => {
    // البحث عن تدفق
    await page.fill('input[placeholder="ابحث في التدفقات..."]', 'استقبال');
    
    // النقر على تطبيق الفلاتر
    await page.getByText('تطبيق الفلاتر').click();
    
    // التحقق من ظهور النتائج
    await expect(page.getByText('استقبال المرضى')).toBeVisible();
  });
});

test.describe('Chatbot Templates', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/chatbot/templates');
  });

  test('should display templates page', async ({ page }) => {
    await expect(page.getByText('قوالب الرسائل')).toBeVisible();
    await expect(page.getByText('إضافة قالب')).toBeVisible();
  });

  test('should create new template', async ({ page }) => {
    await page.getByText('إضافة قالب').click();
    
    await expect(page.getByText('إنشاء قالب جديد')).toBeVisible();
    
    await page.fill('input[placeholder="اسم القالب"]', 'قالب اختبار');
    await page.fill('textarea[placeholder="محتوى القالب..."]', 'مرحباً بك! هذا قالب اختبار.');
    
    await page.getByText('إنشاء القالب').click();
    
    await expect(page.getByText('إنشاء قالب جديد')).not.toBeVisible();
  });
});

test.describe('Chatbot Integrations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/chatbot/integrations');
  });

  test('should display integrations page', async ({ page }) => {
    await expect(page.getByText('التكاملات')).toBeVisible();
    await expect(page.getByText('واتساب')).toBeVisible();
  });

  test('should configure WhatsApp integration', async ({ page }) => {
    // البحث عن بطاقة واتساب
    const whatsappCard = page.locator('.card').filter({ hasText: 'واتساب' });
    await expect(whatsappCard).toBeVisible();
    
    // النقر على إعداد
    await whatsappCard.getByText('إعداد').click();
    
    // التحقق من ظهور نموذج الإعداد
    await expect(page.getByText('إعداد واتساب')).toBeVisible();
  });
});

test.describe('Chatbot Analytics', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/chatbot/analytics');
  });

  test('should display analytics page', async ({ page }) => {
    await expect(page.getByText('تحليلات الشات بوت')).toBeVisible();
    await expect(page.getByText('إجمالي الرسائل')).toBeVisible();
    await expect(page.getByText('المحادثات النشطة')).toBeVisible();
  });

  test('should filter analytics by date range', async ({ page }) => {
    // اختيار نطاق زمني
    await page.selectOption('select', 'week');
    
    // النقر على تطبيق الفلتر
    await page.getByText('تطبيق الفلتر').click();
    
    // التحقق من تحديث البيانات
    await expect(page.getByText('آخر 7 أيام')).toBeVisible();
  });
});
