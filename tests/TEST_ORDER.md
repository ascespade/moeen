# 🎯 ترتيب الاختبارات - Test Execution Order

## ✅ الترتيب المطلوب للتنفيذ (Execution Order)

### 🚀 Cumulative Tests (تابعي - يعتمد كل واحد على الآخر)

```bash
# الترتيب الصحيح للتنفيذ:
1. tests/modules/cumulative-test-suite.spec.ts  # النظام الكامل متتابع
```

---

## 📁 تنظيم الاختبارات حسب الـ Modules

### Core Modules (الأساسية)

1. **Authentication** (`tests/modules/authentication/`)
   - User registration
   - Login
   - Session management
   - Role-based access

2. **Users** (`tests/modules/users/`)
   - User management
   - Profile updates
   - User roles

3. **Patients** (`tests/modules/patients/`)
   - Patient creation
   - Patient management (manage.spec.ts)

4. **Doctors** (`tests/modules/doctors/`)
   - Doctor availability (availability.spec.ts)
   - Doctor scheduling

5. **Appointments** (`tests/modules/appointments/`)
   - Appointment scheduling (scheduling.spec.ts)
   - Booking system
   - Rescheduling

### Medical Modules

6. **Medical Records** (`tests/modules/medical-records/`)
   - Record creation (records.spec.ts)
   - File uploads
   - Record viewing

7. **Billing** (`tests/modules/billing/`)
   - Payment processing
   - Invoice generation

8. **Insurance** (`tests/modules/insurance/`)
   - Claims creation (insurance-claims.spec.ts)
   - Insurance processing
   - Additional: insurance.spec.ts

### Advanced Modules

9. **CRM** (`tests/modules/crm/`)
   - Lead management (leads.spec.ts)
   - Contact management
   - Deal tracking

10. **Chatbot** (`tests/modules/chatbot/`)
    - Conversations (conversations.spec.ts)
    - Flow management (flows.spec.ts)

11. **Analytics** (`tests/modules/analytics/`)
    - Dashboard metrics (dashboard.spec.ts)
    - Analytics data

12. **Dynamic Data** (`tests/modules/dynamic-data/`)
    - Contact info (contact-info.spec.ts)
    - Stats management (stats.spec.ts)
    - Additional: dynamic-data.spec.ts

13. **Family Support** (`tests/modules/family-support/`)
    - family-support.spec.ts

14. **Therapy & Training** (`tests/modules/`)
    - therapy-training.spec.ts

15. **Progress Tracking** (`tests/modules/`)
    - progress-tracking.spec.ts

16. **Security & Audit** (`tests/modules/security-audit/`)
    - audit-logs.spec.ts

17. **WhatsApp Integration** (`tests/modules/whatsapp-integration/`)
    - webhook.spec.ts

18. **Dashboard** (`tests/modules/dashboard/`)
    - admin-dashboard.spec.ts

19. **Payments** (`tests/modules/payments/`)
    - payment-processing.spec.ts

20. **Database Integration** (`tests/modules/`)
    - database-integration.spec.ts

21. **Owners** (`tests/modules/`)
    - owners.spec.ts

---

## 🏃 كيفية تشغيل الاختبارات

### Option 1: تشغيل الـ Cumulative Suite (الموصى به)

```bash
npx playwright test tests/modules/cumulative-test-suite.spec.ts --headed
```

### Option 2: تشغيل حسب Module

```bash
# Patients
npx playwright test tests/modules/patients/

# Appointments
npx playwright test tests/modules/appointments/

# Insurance
npx playwright test tests/modules/insurance/
```

### Option 3: تشغيل جميع الاختبارات

```bash
npx playwright test tests/modules/ --headed
```

---

## 📊 الإحصائيات

- **إجمالي الاختبارات**: 138 ملف
- **Cumulative Tests**: 1 suite متكامل
- **Modules**: 21 module مغطاة
- **Components**: 3 مجموعات
- **API Routes**: 6 مجموعات

---

_Last updated: October 28, 2025_
