# Module-Based Tests Directory

هذا المجلد يحتوي على اختبارات منظمة حسب الـ Modules في المشروع.

## 📋 قائمة الـ Modules والاختبارات

### Core Modules (13 modules)

| Module              | Test File          | Status     |
| ------------------- | ------------------ | ---------- |
| **Authentication**  | `authentication/`  | ✅ Created |
| **Users**           | `users/`           | ✅ Created |
| **Patients**        | `patients/`        | ✅ Created |
| **Appointments**    | `appointments/`    | ✅ Created |
| **Medical Records** | `medical-records/` | ✅ Created |
| **Billing**         | `billing/`         | ✅ Created |
| **Notifications**   | `notifications/`   | ✅ Created |
| **Reports**         | `reports/`         | ✅ Created |
| **Settings**        | `settings/`        | ✅ Created |
| **Files**           | `files/`           | ✅ Created |
| **Dashboard**       | `dashboard/`       | ✅ Created |
| **Admin**           | `admin/`           | ✅ Created |
| **Integration**     | `integration/`     | ✅ Created |

### Advanced Modules (7+ modules)

| Module           | Test File       | Status     |
| ---------------- | --------------- | ---------- |
| **CRM**          | `crm/`          | ✅ Created |
| **Chatbot**      | `chatbot/`      | ✅ Created |
| **Insurance**    | `insurance/`    | ✅ Created |
| **Dynamic Data** | `dynamic-data/` | ✅ Created |
| **Doctors**      | `doctors/`      | ✅ Created |
| **Payments**     | `payments/`     | ✅ Created |
| **Analytics**    | `analytics/`    | ✅ Created |

## 🏃 كيفية تشغيل الاختبارات

```bash
# تشغيل اختبارات module واحد
npx playwright test tests/modules/authentication/

# تشغيل مايوماياتاختبارات أحد الموديلز
npx playwright test tests/modules/crm/ --headed

# تشغيل جميع الاختبارات
npx playwright test tests/modules/

# تشغيل مع التقرير
npx playwright test tests/modules/ --reporter=html
```

## 📁 البنية المقترحة لكل Module

كل module يجب أن يحتوي على:

```
module-name/
├── auth.test.ts        # Authentication tests
├── api.test.ts         # API endpoint tests
├── ui.test.ts          # UI component tests
├── integration.test.ts # Integration tests
└── README.md           # Module-specific docs
```

## ✅ Status Legend

- ✅ Created - المجلد موجود
- 🟡 In Progress - قيد التنفيذ
- ❌ Not Started - لم يبدأ
- ✅ Complete - مكتمل

## 📊 Test Coverage

الهدف هو تحقيق 95%+ coverage لكل module.

---

_Last updated: October 2024_
