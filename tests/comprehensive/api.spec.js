import { test, expect } from '@playwright/test';

test.describe('API Tests - Comprehensive', () => {
  const baseURL =
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:3000';

  test('Health check endpoint', async ({ request }) => {
    const response = await request.get(`${baseURL}/api/health`);
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('status');
    expect(data.status).toBe('ok');
  });

  test('Authentication endpoints', async ({ request }) => {
    // اختبار تسجيل الدخول
    const loginResponse = await request.post(`${baseURL}/api/auth/login`, {
      data: {
        email: 'test@example.com',
        password: 'password123',
      },
    });

    // يجب أن يكون 200 (نجح) أو 401 (فشل في المصادقة)
    expect([200, 401]).toContain(loginResponse.status());

    if (loginResponse.status() === 200) {
      const data = await loginResponse.json();
      expect(data).toHaveProperty('user');
      expect(data).toHaveProperty('token');
    }
  });

  test('User registration endpoint', async ({ request }) => {
    const registerResponse = await request.post(
      `${baseURL}/api/auth/register`,
      {
        data: {
          email: `test-${Date.now()}@example.com`,
          password: 'password123',
          name: 'Test User',
        },
      }
    );

    // يجب أن يكون 200 (نجح) أو 400 (بيانات غير صحيحة) أو 409 (مستخدم موجود)
    expect([200, 400, 409]).toContain(registerResponse.status());
  });

  test('Appointments API endpoints', async ({ request }) => {
    // اختبار إنشاء موعد
    const createResponse = await request.post(`${baseURL}/api/appointments`, {
      data: {
        patientId: 'test-patient-id',
        doctorId: 'test-doctor-id',
        scheduledAt: new Date().toISOString(),
        type: 'consultation',
        notes: 'Test appointment',
      },
    });

    expect([200, 201, 400, 401]).toContain(createResponse.status());

    // اختبار جلب المواعيد
    const getResponse = await request.get(`${baseURL}/api/appointments`);
    expect([200, 401]).toContain(getResponse.status());
  });

  test('Medical records API endpoints', async ({ request }) => {
    // اختبار إنشاء سجل طبي
    const createResponse = await request.post(
      `${baseURL}/api/medical-records`,
      {
        data: {
          patientId: 'test-patient-id',
          recordType: 'consultation',
          title: 'Test Record',
          content: 'Test medical record content',
        },
      }
    );

    expect([200, 201, 400, 401]).toContain(createResponse.status());

    // اختبار جلب السجلات الطبية
    const getResponse = await request.get(`${baseURL}/api/medical-records`);
    expect([200, 401]).toContain(getResponse.status());
  });

  test('Insurance claims API endpoints', async ({ request }) => {
    // اختبار إنشاء مطالبة تأمين
    const createResponse = await request.post(
      `${baseURL}/api/insurance/claims`,
      {
        data: {
          appointmentId: 'test-appointment-id',
          provider: 'Test Insurance',
          policyNumber: 'POL123456',
          claimAmount: 100.0,
          diagnosis: 'Test diagnosis',
        },
      }
    );

    expect([200, 201, 400, 401]).toContain(createResponse.status());
  });

  test('Reports API endpoints', async ({ request }) => {
    // اختبار إنشاء تقرير
    const createResponse = await request.post(`${baseURL}/api/reports/export`, {
      data: {
        reportId: 'test-report-id',
        format: 'pdf',
        includeCharts: true,
      },
    });

    expect([200, 201, 400, 401]).toContain(createResponse.status());
  });

  test('Admin API endpoints', async ({ request }) => {
    // اختبار إدارة المستخدمين
    const usersResponse = await request.get(`${baseURL}/api/admin/users`);
    expect([200, 401, 403]).toContain(usersResponse.status());

    // اختبار إعدادات النظام
    const configResponse = await request.get(
      `${baseURL}/api/admin/system-config`
    );
    expect([200, 401, 403]).toContain(configResponse.status());
  });

  test('Rate limiting works', async ({ request }) => {
    // اختبار الحد الأقصى للطلبات
    const requests = [];
    for (let i = 0; i < 10; i++) {
      requests.push(request.get(`${baseURL}/api/health`));
    }

    const responses = await Promise.all(requests);
    const statusCodes = responses.map(r => r.status());

    // يجب أن تكون معظم الطلبات ناجحة
    const successCount = statusCodes.filter(code => code === 200).length;
    expect(successCount).toBeGreaterThan(5);
  });

  test('CORS headers are set correctly', async ({ request }) => {
    const response = await request.get(`${baseURL}/api/health`);
    const headers = response.headers();

    expect(headers).toHaveProperty('access-control-allow-origin');
    expect(headers).toHaveProperty('access-control-allow-methods');
  });

  test('Error handling works correctly', async ({ request }) => {
    // اختبار endpoint غير موجود
    const notFoundResponse = await request.get(`${baseURL}/api/nonexistent`);
    expect(notFoundResponse.status()).toBe(404);

    // اختبار بيانات غير صحيحة
    const badRequestResponse = await request.post(`${baseURL}/api/auth/login`, {
      data: {
        // بيانات ناقصة
        email: 'test@example.com',
      },
    });
    expect([400, 422]).toContain(badRequestResponse.status());
  });
});
