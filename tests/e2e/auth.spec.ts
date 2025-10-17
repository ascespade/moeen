import { test, expect } from '@playwright/test';

test.describe('Authentication Module', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page before each test
    await page.goto('/login');
  });

  test.describe('Login Page', () => {
    test('should display login form correctly', async ({ page }) => {
      // Check page title and main elements
      await expect(page.getByText('مرحباً بعودتك')).toBeVisible();
      await expect(page.getByText('سجل دخولك للوصول إلى لوحة التحكم')).toBeVisible();
      
      // Check form elements
      await expect(page.getByLabel('البريد الإلكتروني')).toBeVisible();
      await expect(page.getByLabel('كلمة المرور').first()).toBeVisible();
      await expect(page.getByLabel('تذكرني')).toBeVisible();
      await expect(page.getByRole('button', { name: /تسجيل الدخول/ })).toBeVisible();
      await expect(page.getByRole('button', { name: /تسجيل دخول سريع/ })).toBeVisible();
    });

    test('should validate required fields', async ({ page }) => {
      const submitButton = page.getByRole('button', { name: /تسجيل الدخول/ });
      await submitButton.click();

      // Check HTML5 validation
      const emailInput = page.getByLabel('البريد الإلكتروني');
      const passwordInput = page.getByLabel('كلمة المرور');
      
      await expect(emailInput).toHaveAttribute('required');
      await expect(passwordInput).toHaveAttribute('required');
    });

    test('should handle form submission with valid credentials', async ({ page }) => {
      // Fill form
      await page.getByLabel('البريد الإلكتروني').fill('test@moeen.com');
      await page.getByLabel('كلمة المرور').fill('test123');
      await page.getByLabel('تذكرني').check();

      // Submit form
      await page.getByRole('button', { name: /تسجيل الدخول/ }).click();

      // Should redirect to dashboard
      await page.waitForURL('/dashboard/user');
    });

    test('should handle quick test login', async ({ page }) => {
      await page.getByRole('button', { name: /تسجيل دخول سريع/ }).click();
      
      // Should redirect to dashboard
      await page.waitForURL('/dashboard/user');
    });

    test('should show loading state during submission', async ({ page }) => {
      await page.getByLabel('البريد الإلكتروني').fill('test@moeen.com');
      await page.getByLabel('كلمة المرور').fill('test123');
      
      await page.getByRole('button', { name: /تسجيل الدخول/ }).click();
      
      // Check loading state
      await expect(page.getByRole('button', { name: 'جارٍ تسجيل الدخول...' }).first()).toBeVisible();
    });

    test('should navigate to forgot password page', async ({ page }) => {
      await page.getByText('نسيت كلمة المرور؟').click();
      await expect(page).toHaveURL('/forgot-password');
    });

    test('should navigate to register page', async ({ page }) => {
      await page.getByText('إنشاء حساب جديد').click();
      await expect(page).toHaveURL('/register');
    });
  });

  test.describe('Register Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/register');
    });

    test('should display registration form correctly', async ({ page }) => {
      await expect(page.getByText('إنشاء حساب جديد')).toBeVisible();
      await expect(page.getByText('انضم إلى منصة الرعاية الصحية المتخصصة')).toBeVisible();
      
      // Check form elements
      await expect(page.getByLabel('الاسم الكامل')).toBeVisible();
      await expect(page.getByLabel('البريد الإلكتروني')).toBeVisible();
      await expect(page.getByLabel('كلمة المرور').first()).toBeVisible();
      await expect(page.getByLabel('تأكيد كلمة المرور')).toBeVisible();
      await expect(page.getByLabel('أوافق على')).toBeVisible();
      await expect(page.getByRole('button', { name: /إنشاء الحساب/ })).toBeVisible();
    });

    test('should validate form fields', async ({ page }) => {
      await page.getByRole('button', { name: /إنشاء الحساب/ }).click();

      // Check validation messages
      await expect(page.getByText('الاسم مطلوب')).toBeVisible();
      await expect(page.getByText('البريد الإلكتروني مطلوب')).toBeVisible();
      await expect(page.getByText('كلمة المرور مطلوبة')).toBeVisible();
      await expect(page.getByText('يجب الموافقة على الشروط والأحكام')).toBeVisible();
    });

    test('should validate email format', async ({ page }) => {
      await page.getByLabel('البريد الإلكتروني').fill('invalid-email');
      await page.getByRole('button', { name: /إنشاء الحساب/ }).click();

      await expect(page.getByText('البريد الإلكتروني غير صحيح')).toBeVisible();
    });

    test('should validate password length', async ({ page }) => {
      await page.getByLabel('كلمة المرور').first().fill('123');
      await page.getByRole('button', { name: /إنشاء الحساب/ }).click();

      await expect(page.getByText('كلمة المرور يجب أن تكون 6 أحرف على الأقل')).toBeVisible();
    });

    test('should validate password confirmation', async ({ page }) => {
      await page.getByLabel('كلمة المرور').first().fill('password123');
      await page.getByLabel('تأكيد كلمة المرور').fill('different123');
      await page.getByRole('button', { name: /إنشاء الحساب/ }).click();

      await expect(page.getByText('كلمة المرور غير متطابقة')).toBeVisible();
    });

    test('should show success message after registration', async ({ page }) => {
      // Fill valid form
      await page.getByLabel('الاسم الكامل').fill('John Doe');
      await page.getByLabel('البريد الإلكتروني').fill('john@example.com');
      await page.getByLabel('كلمة المرور').first().fill('password123');
      await page.getByLabel('تأكيد كلمة المرور').fill('password123');
      await page.getByLabel('أوافق على').check();

      await page.getByRole('button', { name: /إنشاء الحساب/ }).click();

      await expect(page.getByText('تم إنشاء الحساب بنجاح!')).toBeVisible();
    });

    test('should navigate to login page', async ({ page }) => {
      await page.getByText('تسجيل الدخول').click();
      await expect(page).toHaveURL('/login');
    });
  });

  test.describe('Forgot Password Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/forgot-password');
    });

    test('should display forgot password form correctly', async ({ page }) => {
      await expect(page.getByText('نسيان كلمة المرور')).toBeVisible();
      await expect(page.getByText('أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور')).toBeVisible();
      await expect(page.getByLabel('البريد الإلكتروني')).toBeVisible();
      await expect(page.getByRole('button', { name: /إرسال رابط إعادة التعيين/ })).toBeVisible();
    });

    test('should validate email field', async ({ page }) => {
      await page.getByRole('button', { name: /إرسال رابط إعادة التعيين/ }).click();
      await expect(page.getByText('البريد الإلكتروني مطلوب')).toBeVisible();
    });

    test('should validate email format', async ({ page }) => {
      await page.getByLabel('البريد الإلكتروني').fill('invalid-email');
      await page.getByRole('button', { name: /إرسال رابط إعادة التعيين/ }).click();
      await expect(page.getByText('البريد الإلكتروني غير صحيح')).toBeVisible();
    });

    test('should show success message after submission', async ({ page }) => {
      await page.getByLabel('البريد الإلكتروني').fill('test@example.com');
      await page.getByRole('button', { name: /إرسال رابط إعادة التعيين/ }).click();

      await expect(page.getByText('تم إرسال الرابط!')).toBeVisible();
    });

    test('should navigate to login page', async ({ page }) => {
      await page.getByText('تسجيل الدخول').click();
      await expect(page).toHaveURL('/login');
    });
  });

  test.describe('Reset Password Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/reset-password');
    });

    test('should display reset password form correctly', async ({ page }) => {
      await expect(page.getByText('إعادة تعيين كلمة المرور')).toBeVisible();
      await expect(page.getByText('أدخل كلمة المرور الجديدة')).toBeVisible();
      await expect(page.getByLabel('كلمة المرور الجديدة')).toBeVisible();
      await expect(page.getByLabel('تأكيد كلمة المرور')).toBeVisible();
      await expect(page.getByRole('button', { name: /تغيير كلمة المرور/ })).toBeVisible();
    });

    test('should validate password fields', async ({ page }) => {
      await page.getByRole('button', { name: /تغيير كلمة المرور/ }).click();
      await expect(page.getByText('كلمة المرور مطلوبة')).toBeVisible();
    });

    test('should validate password length', async ({ page }) => {
      await page.getByLabel('كلمة المرور الجديدة').fill('123');
      await page.getByRole('button', { name: /تغيير كلمة المرور/ }).click();
      await expect(page.getByText('كلمة المرور يجب أن تكون 6 أحرف على الأقل')).toBeVisible();
    });

    test('should validate password confirmation', async ({ page }) => {
      await page.getByLabel('كلمة المرور الجديدة').fill('password123');
      await page.getByLabel('تأكيد كلمة المرور').fill('different123');
      await page.getByRole('button', { name: /تغيير كلمة المرور/ }).click();
      await expect(page.getByText('كلمة المرور غير متطابقة')).toBeVisible();
    });

    test('should show success message after reset', async ({ page }) => {
      await page.getByLabel('كلمة المرور الجديدة').fill('newpassword123');
      await page.getByLabel('تأكيد كلمة المرور').fill('newpassword123');
      await page.getByRole('button', { name: /تغيير كلمة المرور/ }).click();

      await expect(page.getByText('تم تغيير كلمة المرور!')).toBeVisible();
    });

    test('should navigate to login page', async ({ page }) => {
      await page.getByText('تسجيل الدخول').click();
      await expect(page).toHaveURL('/login');
    });
  });

  test.describe('Authentication Flow', () => {
    test('should complete full registration to login flow', async ({ page }) => {
      // Start at register page
      await page.goto('/register');
      
      // Fill registration form
      await page.getByLabel('الاسم الكامل').fill('Test User');
      await page.getByLabel('البريد الإلكتروني').fill('testuser@example.com');
      await page.getByLabel('كلمة المرور').first().fill('password123');
      await page.getByLabel('تأكيد كلمة المرور').fill('password123');
      await page.getByLabel('أوافق على').check();
      
      // Submit registration
      await page.getByRole('button', { name: /إنشاء الحساب/ }).click();
      
      // Should show success message
      await expect(page.getByText('تم إنشاء الحساب بنجاح!')).toBeVisible();
      
      // Click login button
      await page.getByText('تسجيل الدخول').click();
      
      // Should be on login page
      await expect(page).toHaveURL('/login');
    });

    test('should handle forgot password to reset password flow', async ({ page }) => {
      // Start at forgot password page
      await page.goto('/forgot-password');
      
      // Submit email
      await page.getByLabel('البريد الإلكتروني').fill('test@example.com');
      await page.getByRole('button', { name: /إرسال رابط إعادة التعيين/ }).click();
      
      // Should show success message
      await expect(page.getByText('تم إرسال الرابط!')).toBeVisible();
      
      // Click to send another email
      await page.getByText('إرسال رابط آخر').click();
      
      // Should be back to form
      await expect(page.getByText('نسيان كلمة المرور')).toBeVisible();
    });
  });
});

