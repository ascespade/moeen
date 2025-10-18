# 🔗 خريطة العلاقات بين الوحدات

## Module Dependencies Map - مُعين

**التاريخ:** 17 أكتوبر 2025

---

## 📊 العلاقات الأساسية

### Core Flow (التدفق الأساسي)

```
المستخدم
   ↓
🔐 Authentication (المصادقة)
   ↓
👨‍💼 User Dashboard (حسب الدور)
   ↓
📅 Appointments / 🤖 Chatbot / 👥 CRM / 💬 Conversations
```

---

## 🎯 تفاصيل العلاقات بين الوحدات

### 1. المصادقة → جميع الوحدات

```
🔐 Authentication & Security
├──→ 👨‍💼 Admin Module (إدارة)
├──→ 📅 Appointments (المواعيد)
├──→ 🤖 Chatbot & AI (الشات بوت)
├──→ 👥 CRM (إدارة العملاء)
├──→ 💬 Conversations (المحادثات)
├──→ 📋 Medical Records (السجلات الطبية)
├──→ 📊 Analytics (التحليلات)
└──→ 🔔 Notifications (الإشعارات)
```

### 2. المواعيد → وحدات متعددة

```
📅 Appointments Management
├──→ 📋 Patients (المرضى)
├──→ 👨‍⚕️ Doctors (الأطباء)
├──→ 🏥 Insurance Claims (التأمين)
├──→ 💳 Payments (المدفوعات)
├──→ 🔔 Notifications (إشعارات الموعد)
└──→ 📊 Analytics (إحصائيات المواعيد)
```

### 3. الشات بوت → الذكاء الاصطناعي والمحادثات

```
🤖 Chatbot & AI
├──→ 💬 Conversations (المحادثات)
├──→ 💬 Messages (الرسائل)
├──→ 🧠 AI Models (نماذج الذكاء)
├──→ 📅 Appointments (حجز تلقائي)
├──→ 🔔 Notifications (تذكيرات)
└──→ 📊 Analytics (تتبع الأداء)
```

### 4. CRM → إدارة العملاء

```
👥 CRM Module
├──→ 🙋 Customers (العملاء)
├──→ 📋 Patients (المرضى/العملاء)
├──→ 💬 Conversations (تفاعلات)
├──→ 📞 Activities (الأنشطة)
├──→ 💰 Deals (الصفقات)
├──→ 📊 Analytics (تحليل العملاء)
└──→ 🔔 Notifications (تنبيهات)
```

### 5. المحادثات → القنوات المتعددة

```
💬 Conversations & Messaging
├──→ 📱 WhatsApp (واتساب)
├──→ 📱 Telegram (تيليجرام)
├──→ 📱 Facebook (فيسبوك)
├──→ 📱 Instagram (إنستجرام)
├──→ 📧 Email (بريد إلكتروني)
├──→ 🤖 AI Responses (ردود تلقائية)
├──→ 📎 Attachments (مرفقات)
└──→ 📊 Analytics (تحليل المحادثات)
```

### 6. التحليلات ← جميع الوحدات

```
📊 Analytics & Reporting
↑
├── 🔐 Auth (تسجيلات الدخول)
├── 📅 Appointments (المواعيد)
├── 🤖 Chatbot (أداء البوت)
├── 👥 CRM (العملاء)
├── 💬 Conversations (المحادثات)
├── 🏥 Insurance (المطالبات)
├── 💳 Payments (المدفوعات)
└── 📋 Medical Records (السجلات)
```

### 7. الإشعارات ← جميع الوحدات

```
🔔 Notifications
↑
├── 📅 Appointments (تذكيرات المواعيد)
├── 🤖 Chatbot (رسائل البوت)
├── 👥 CRM (تنبيهات العملاء)
├── 💬 Conversations (رسائل جديدة)
├── 🏥 Insurance (حالة المطالبة)
├── 💳 Payments (تأكيد الدفع)
└── 🔐 Auth (أمان الحساب)
```

### 8. سجلات التدقيق ← جميع الوحدات

```
🗂️ Audit Logs (سجلات التدقيق)
↑
├── 🔐 Auth (تسجيل دخول/خروج)
├── 👨‍💼 Admin (تغييرات المستخدمين)
├── 📅 Appointments (إنشاء/تعديل)
├── 👥 CRM (تحديثات العملاء)
├── 💳 Payments (المعاملات)
├── 🏥 Insurance (المطالبات)
└── ⚙️ Settings (تغيير الإعدادات)
```

---

## 🔄 التدفقات الشائعة (Common Flows)

### Flow 1: تسجيل مستخدم جديد

```
1. 🌐 User visits /register
2. 📝 Fills registration form
3. ➡️  POST /api/auth/register
4. ✅ User created in users table
5. 📧 Confirmation email sent
6. 🗂️ Audit log created (user_registered)
7. 🔐 Auto login
8. 🏠 Redirect to dashboard (role-based)
```

### Flow 2: حجز موعد عبر الشات بوت

```
1. 💬 User sends WhatsApp message
2. 🤖 Chatbot receives via webhook
3. 🧠 AI processes intent
4. 📅 Chatbot asks for date/time
5. 👨‍⚕️ Chatbot shows available doctors
6. ✅ User confirms booking
7. 💾 Appointment saved in DB
8. 🔔 Confirmation notification sent
9. 📧 Email/SMS reminder scheduled
10. 📊 Analytics updated
```

### Flow 3: تسجيل دخول ومشاهدة المواعيد

```
1. 🌐 User visits /login
2. 🔐 POST /api/auth/login
3. ✅ Authentication successful
4. 🍪 Session cookie set
5. 🗂️ Audit log (user_login)
6. 🏠 Redirect to /dashboard/[role]
7. 📅 Fetch appointments
8. 📊 Fetch analytics
9. 🔔 Fetch notifications
10. 🖼️  Display dashboard
```

### Flow 4: معالجة مطالبة تأمين

```
1. 👨‍💼 Staff creates claim
2. 💾 POST /api/insurance/claims
3. 📋 Links to patient & appointment
4. 📄 Upload documents
5. 🏥 Submit to insurance provider
6. ⏳ Status: pending
7. 🔔 Notification to admin
8. 📊 Analytics updated
9. ✅ Approval received
10. 💳 Payment processed
```

### Flow 5: تحليل أداء النظام

```
1. 👨‍💼 Admin visits /admin/analytics
2. 📊 GET /api/analytics/metrics
3. 📅 Fetch appointment stats
4. 💬 Fetch conversation stats
5. 🤖 Fetch chatbot performance
6. 👥 Fetch CRM metrics
7. 📈 Generate charts
8. 📄 Export report option
9. 🖼️  Display dashboard
```

---

## 🔐 اعتماديات الأمان (Security Dependencies)

### Authentication Chain

```
Request
  ↓
Middleware
  ├─ CORS Check
  ├─ Rate Limiting
  └─ Security Headers
     ↓
Authentication
  ├─ JWT Validation
  ├─ Session Check
  └─ User Lookup
     ↓
Authorization
  ├─ Role Check
  ├─ Permission Check
  └─ Resource Access
     ↓
Audit Logging
  ├─ Log Action
  ├─ IP Tracking
  └─ User Agent
     ↓
Response
```

---

## 📊 اعتماديات قاعدة البيانات

### Primary Tables & Foreign Keys

```
users (30 records)
  ├→ user_roles
  ├→ user_preferences
  ├→ conversations (created_by, assigned_to)
  ├→ messages (sender_id)
  ├→ appointments (via doctors)
  ├→ audit_logs (user_id)
  └→ notifications (user_id)

patients (8 records)
  ├→ appointments (patient_id)
  ├→ sessions (patient_id)
  ├→ insurance_claims (patient_id)
  └→ crm_deals (contact_id)

doctors (24 records)
  ├→ users (user_id)
  ├→ appointments (doctor_id)
  ├→ sessions (doctor_id)
  └→ chatbot_appointments (doctor_id)

appointments (33 records)
  ├→ patients (patient_id)
  ├→ doctors (doctor_id)
  ├→ sessions (appointment_id)
  └→ insurance_claims (appointment_id)

conversations (6 records)
  ├→ users (user_id, assigned_to)
  ├→ customers (customer_id)
  ├→ messages (conversation_id)
  ├→ reviews (conversation_id)
  └→ analytics (conversation_id)
```

---

## 🎯 التوصيات للتطوير

### 1. تحسين التكامل بين الوحدات

- ✅ إضافة event bus للتواصل بين الوحدات
- ✅ استخدام Supabase Realtime لتحديثات فورية
- ✅ تطبيق microservices architecture لوحدات كبيرة

### 2. تحسين الأداء

- ✅ إضافة caching layer (Redis)
- ✅ تحسين الاستعلامات (Query Optimization)
- ✅ إضافة pagination لجميع القوائم

### 3. تحسين الأمان

- ✅ إضافة 2FA لجميع المستخدمين
- ✅ تشفير البيانات الحساسة
- ✅ مراجعة دورية للصلاحيات

---

## ✅ الخلاصة

**النظام مُنظم بشكل احترافي مع:**

- 13 وحدة رئيسية متكاملة
- علاقات واضحة ومنطقية
- تدفقات محددة ومُوثقة
- أمان متعدد الطبقات
- قابلية للتوسع

**الحالة:** ✅ بنية قوية - جاهز للإنتاج 🚀

---

_تم الإنشاء: 17 أكتوبر 2025_  
_النسخة: 1.0_
