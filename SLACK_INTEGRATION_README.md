# تكامل Slack مع نظام الشات بوت الطبي

## نظرة عامة

تم تطوير نظام تكامل Slack متكامل مع نظام الشات بوت الطبي لمركز الهمم، مما يتيح التواصل الفوري بين الأطباء والمرضى وإدارة المواعيد بكفاءة.

## الميزات الرئيسية

### 1. إشعارات المواعيد التلقائية

- إشعارات فورية عند حجز موعد جديد
- تأكيد المواعيد عبر Slack
- تذكيرات المواعيد
- إشعارات إلغاء المواعيد

### 2. التواصل بين الأطباء والمرضى

- إرسال استفسارات المرضى للطاقم الطبي عبر Slack
- ردود الأطباء على استفسارات المرضى
- تتبع المحادثات في threads منفصلة

### 3. نظام الطوارئ

- تنبيهات فورية للحالات الطارئة
- إشعارات في قناة الطوارئ المخصصة
- ربط مع أرقام الطوارئ

### 4. إدارة الـ Flows

- واجهة إدارة سيناريوهات المحادثة
- تخصيص الـ Flows حسب الحاجة
- دعم Slack notifications في الـ Flows

## التكوين المطلوب

### متغيرات البيئة

```env
# Slack Configuration
SLACK_BOT_TOKEN=xoxb-your-slack-bot-token
SLACK_APP_TOKEN=xapp-your-slack-app-token
SLACK_SIGNING_SECRET=your_slack_signing_secret
SLACK_APPOINTMENTS_CHANNEL=appointments
SLACK_EMERGENCY_CHANNEL=emergency

# WhatsApp Configuration
WHATSAPP_ACCESS_TOKEN=your_whatsapp_access_token
WHATSAPP_PHONE_NUMBER_ID=your_whatsapp_phone_number_id
WHATSAPP_WEBHOOK_VERIFY_TOKEN=your_webhook_verify_token
```

### إعداد Slack App

1. إنشاء Slack App جديد في [api.slack.com](https://api.slack.com)
2. تفعيل Bot Token Scopes:
   - `chat:write`
   - `conversations:read`
   - `conversations:write`
   - `users:read`
   - `channels:read`
3. تفعيل Event Subscriptions:
   - `message.channels`
   - `message.groups`
   - `message.im`
   - `app_mention`
4. إضافة Interactive Components للتفاعل مع الأزرار

## هيكل النظام

### الملفات الرئيسية

```
src/
├── lib/
│   ├── slack-integration.ts          # تكامل Slack الرئيسي
│   └── conversation-flows.ts         # نظام إدارة الـ Flows
├── app/api/slack/
│   ├── webhook/route.ts             # webhook لاستقبال أحداث Slack
│   └── notify/route.ts              # API لإرسال الإشعارات
└── app/(admin)/crm/flows/
    └── page.tsx                     # واجهة إدارة الـ Flows
```

### قواعد البيانات

تم إنشاء جداول جديدة لدعم التكامل:

- `slack_channels`: قنوات Slack المرتبطة بالأطباء
- `slack_notifications`: سجل الإشعارات المرسلة
- `chatbot_flows`: إدارة سيناريوهات المحادثة
- `chatbot_flow_steps`: خطوات كل سيناريو

## الاستخدام

### 1. إرسال إشعار موعد جديد

```typescript
await fetch('/api/slack/notify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'appointment_created',
    appointmentId: 'apt-123',
    doctorId: 'doc-456',
    patientId: 'pat-789',
  }),
});
```

### 2. إرسال رسالة مريض للطبيب

```typescript
await fetch('/api/slack/notify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'patient_message',
    patientId: 'pat-123',
    doctorId: 'doc-456',
    message: 'سؤال من المريض',
    channel: 'whatsapp',
  }),
});
```

### 3. إنشاء Flow جديد مع Slack

```typescript
const flow = {
  id: 'custom_flow',
  name: 'Flow مخصص',
  steps: [
    {
      id: 'step1',
      type: 'question',
      content: 'ما هو سؤالك؟',
      nextStep: 'notify_doctor',
    },
    {
      id: 'notify_doctor',
      type: 'slack_notify',
      content: 'تم إرسال السؤال للطبيب',
      slackChannel: 'general',
      notificationType: 'general',
    },
  ],
};
```

## الأمان

- جميع الطلبات محمية بـ RLS (Row Level Security)
- التحقق من توقيع Slack webhooks
- تشفير البيانات الحساسة
- تسجيل جميع العمليات للمراجعة

## المراقبة والتحليل

- تتبع حالة الإشعارات
- إحصائيات الاستخدام
- سجل الأخطاء والاستثناءات
- تقارير الأداء

## التطوير المستقبلي

- [ ] واجهة تحرير الـ Flows بصرياً
- [ ] دعم الملفات والصور في Slack
- [ ] تكامل مع تقويم Google
- [ ] إشعارات SMS احتياطية
- [ ] تحليل المشاعر للمحادثات
- [ ] دعم اللغات المتعددة

## الدعم الفني

للحصول على الدعم الفني أو الإبلاغ عن مشاكل:

- إنشاء issue في GitHub
- التواصل عبر Slack في قناة #tech-support
- إرسال بريد إلكتروني إلى: tech@hemamcenter.com
