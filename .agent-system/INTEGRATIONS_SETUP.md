# 🔌 دليل إعداد التكاملات الخارجية

## نظرة عامة

هذا المستند يوضح كيفية إعداد واختبار التكاملات الخارجية في نظام مُعين.

## 📋 قاعدة البيانات

### الجداول الجديدة:

1. **`integration_configs`** - إعدادات التكاملات
2. **`integration_test_logs`** - سجلات اختبار التكاملات
3. **`crm_contacts`** - جهات اتصال CRM
4. **`crm_leads`** - عملاء محتملون
5. **`crm_deals`** - صفقات
6. **`progress_goals`** - أهداف التقدم
7. **`training_programs`** - برامج التدريب

### تطبيق الـ Migrations:

```bash
# استخدام Supabase CLI
supabase db push

# أو استخدام SQL مباشرة
psql -h <host> -U <user> -d <database> -f supabase/migrations/053_integration_configs.sql
psql -h <host> -U <user> -d <database> -f supabase/migrations/054_crm_and_health_tables.sql
```

## 🔧 التكاملات المتاحة

### 1. WhatsApp Business API
```typescript
{
  "api_url": "https://graph.facebook.com/v17.0",
  "access_token": "YOUR_ACCESS_TOKEN",
  "phone_number_id": "YOUR_PHONE_NUMBER_ID",
  "webhook_verify_token": "YOUR_VERIFY_TOKEN"
}
```

### 2. SMS (Twilio)
```typescript
{
  "account_sid": "YOUR_ACCOUNT_SID",
  "auth_token": "YOUR_AUTH_TOKEN",
  "from_number": "+1234567890"
}
```

### 3. Email (SendGrid)
```typescript
{
  "api_key": "YOUR_SENDGRID_API_KEY",
  "from_email": "noreply@yourdomain.com",
  "from_name": "مركز الهمم"
}
```

### 4. Google Calendar
```typescript
{
  "client_id": "YOUR_CLIENT_ID",
  "client_secret": "YOUR_CLIENT_SECRET",
  "refresh_token": "YOUR_REFRESH_TOKEN",
  "calendar_id": "primary"
}
```

### 5. Slack
```typescript
{
  "webhook_url": "https://hooks.slack.com/services/YOUR/WEBHOOK/URL",
  "channel": "#notifications"
}
```

### 6. Seha Platform
```typescript
{
  "api_url": "https://api.seha.sa",
  "api_key": "YOUR_API_KEY",
  "facility_id": "YOUR_FACILITY_ID"
}
```

### 7. Tatman Insurance
```typescript
{
  "api_url": "https://api.tatman.com.sa",
  "api_key": "YOUR_API_KEY",
  "provider_id": "YOUR_PROVIDER_ID"
}
```

## 🔐 الأمان

⚠️ **مهم جداً:**
- لا تحفظ المفاتيح والأسرار في الكود
- استخدم متغيرات البيئة أو خدمة إدارة المفاتيح
- الملف `src/lib/encryption.ts` الحالي هو **placeholder فقط**
- في الإنتاج، استخدم:
  - AWS KMS
  - Azure Key Vault
  - HashiCorp Vault
  - أو خدمة تشفير محترفة

## 🧪 الاختبار

### من واجهة الإدارة:
1. اذهب إلى `/settings` → تبويب "التكاملات"
2. أدخل إعدادات التكامل
3. اضغط "اختبار الاتصال"

### من API مباشرة:
```bash
curl -X POST http://localhost:3000/api/integrations/test \
  -H "Content-Type: application/json" \
  -d '{
    "integration_config_id": "UUID",
    "integration_type": "whatsapp",
    "config": { ... }
  }'
```

## 📝 ملاحظات

1. **البيانات الوهمية محذوفة:** جميع التكاملات الآن تتصل بخدمات حقيقية
2. **قاعدة البيانات:** كل التكاملات مخزنة في `integration_configs`
3. **السجلات:** كل الاختبارات مسجلة في `integration_test_logs`
4. **الصحة:** يتم تتبع `health_score` لكل تكامل

## 🚀 الخطوات التالية

1. ✅ تطبيق الـ migrations
2. ✅ إعداد متغيرات البيئة
3. ⚠️ تنفيذ التشفير الحقيقي (استبدال `encryption.ts`)
4. ⚠️ إضافة Webhook handlers
5. ⚠️ تنفيذ retry logic
6. ⚠️ إضافة rate limiting
7. ⚠️ إعداد monitoring & alerting

## 📚 المراجع

- [WhatsApp Business API Docs](https://developers.facebook.com/docs/whatsapp)
- [Twilio SMS Docs](https://www.twilio.com/docs/sms)
- [SendGrid API Docs](https://docs.sendgrid.com/)
- [Google Calendar API](https://developers.google.com/calendar)
