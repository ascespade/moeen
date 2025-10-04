# مُعين - المساعد الذكي لمركز الهمم

## 🌟 نظرة عامة

**مُعين** هو مساعد ذكي متطور مصمم خصيصاً لمركز الهمم، يجمع بين التكنولوجيا المتقدمة والرعاية الإنسانية لتقديم دعم شامل للمستفيدين والطاقم الطبي.

## 🎯 الهدف

أن يكون المساعد الرقمي نقطة الاتصال الأولى والأكثر موثوقية لمجتمع "مركز الهمم"، حيث يقدم:
- دعم إداري ونفسي أولي
- تسهيل رحلة المستفيد من الاستفسار الأول وحتى تلقي الرعاية
- تحسين كفاءة وتنسيق عمل الفريق الطبي

## 🚀 الميزات الرئيسية

### 🤖 مساعد ذكي متعاطف
- شخصية "مُعين" المصممة للدعم والمساندة
- نبرة هادئة ومطمئنة
- تجنب المصطلحات الطبية المعقدة
- لغة بسيطة ومباشرة

### 🔒 أمان وخصوصية مطلقة
- تشفير كامل للمحادثات
- سياسة خصوصية صارمة
- عدم مشاركة المعلومات إلا بعد التحقق الآمن
- بروتوكول طوارئ للأزمات

### ⚡ معالجة ذكية
- نظام Hybrid Processing يجمع بين القواعد والذكاء الاصطناعي
- تكامل مع Gemini Pro و Flash 2.5
- خيار التبديل إلى OpenAI Whisper
- معالجة تلقائية للأخطاء

### 📱 تكامل WhatsApp
- واجهة مألوفة عبر WhatsApp Business API
- دعم الرسائل النصية والصوتية
- إدارة الجلسات والرموز تلقائياً

### 👥 إدارة الفريق
- لوحة تحكم متقدمة للطاقم الطبي
- تكامل مع Slack
- إحصائيات مفصلة عن التقدم
- إدارة المواعيد الذكية

## 🛠 المكدس التقني

### Frontend
- **Next.js 14** - إطار عمل React مع App Router
- **TypeScript** - أمان الأنواع
- **Tailwind CSS** - تصميم سريع ومتجاوب
- **Preline UI** - مكونات جاهزة
- **next-themes** - دعم الوضع المظلم/الفاتح
- **next-intl** - دعم متعدد اللغات (عربي/إنجليزي)

### Backend
- **Supabase** - قاعدة بيانات وخدمات خلفية
- **PostgreSQL** - قاعدة بيانات علائقية
- **Edge Functions** - معالجة سريعة
- **RLS** - أمان على مستوى الصفوف

### AI & ML
- **Gemini Pro** - نموذج ذكي متقدم
- **Gemini Flash 2.5** - معالجة سريعة
- **OpenAI Whisper** - تحويل الصوت إلى نص
- **Custom Models** - نماذج مخصصة

### Communication
- **WhatsApp Business API** - واجهة مألوفة
- **Slack Integration** - تكامل مع الفريق
- **Email Automation** - أتمتة البريد الإلكتروني
- **Push Notifications** - إشعارات فورية

### DevOps
- **Vercel** - نشر سريع
- **GitHub Actions** - CI/CD
- **Sentry** - مراقبة الأخطاء
- **Analytics** - تحليلات متقدمة

## 📋 مراحل التطوير

### المرحلة 0: التأسيس والبنية التحتية ✅
- [x] إنشاء مشروع Next.js مع TypeScript
- [x] دمج Tailwind CSS و Preline UI
- [x] إعداد Supabase
- [x] إدارة المتغيرات والأمان
- [x] إعداد Prettier و ESLint

### المرحلة 1: الواجهة الخلفية والأمان 🔄
- [ ] تصميم مخطط قاعدة البيانات
- [ ] تفعيل RLS للأمان
- [ ] نظام Auth مع Magic Links
- [ ] تأمين الجلسات
- [ ] Edge Function لـ WhatsApp

### المرحلة 2: لوحة التحكم 📊
- [ ] تنظيم هيكل المجلدات
- [ ] بناء Layout مع Sidebar + Header
- [ ] صفحة تسجيل الدخول
- [ ] صفحات Dashboard و Conversations
- [ ] تفعيل Realtime Subscriptions

### المرحلة 3: الميزات المتقدمة 🧠
- [ ] Flow Builder للمسارات
- [ ] Review Hub للمراجعة
- [ ] Hybrid Processing الذكي
- [ ] تكامل LLMs

### المرحلة 4: الاختبار والنشر 🚀
- [ ] Unit Tests + E2E Tests
- [ ] إعداد CI/CD
- [ ] إدارة قاعدة البيانات
- [ ] مراقبة وأخطاء

### WhatsApp Business API 📱
- [ ] تسجيل حساب WhatsApp Business
- [ ] الحصول على رقم هاتف مخصص
- [ ] إعداد App على Meta
- [ ] ربط Webhook
- [ ] إدارة Sessions & Tokens

## 🚀 البدء السريع

### 1. تثبيت التبعيات
```bash
npm install
```

### 2. إعداد البيئة
```bash
cp env.example .env.local
# قم بتعديل المتغيرات في .env.local
```

### 3. تشغيل المشروع
```bash
npm run dev
```

### 4. إعداد قاعدة البيانات
```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

## 📁 هيكل المشروع

```
muayin-assistant/
├── src/
│   ├── app/                 # صفحات Next.js
│   ├── components/          # مكونات React
│   ├── lib/                 # مكتبات مساعدة
│   ├── types/               # تعريفات TypeScript
│   ├── utils/               # وظائف مساعدة
│   └── middleware.ts        # middleware
├── scripts/                 # سكريبتات مساعدة
├── tests/                   # اختبارات
└── docs/                    # الوثائق
```

## 🧪 الاختبار

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

### Cypress Tests
```bash
npm run test:cypress
```

## 📊 المراقبة

- **Sentry** - مراقبة الأخطاء
- **Vercel Analytics** - تحليلات الأداء
- **Custom Dashboard** - لوحة تحكم مخصصة

## 🤝 المساهمة

1. Fork المشروع
2. إنشاء فرع للميزة الجديدة
3. Commit التغييرات
4. Push إلى الفرع
5. إنشاء Pull Request

## 📄 الترخيص

هذا المشروع مرخص تحت رخصة MIT - راجع ملف [LICENSE](LICENSE) للتفاصيل.

## 📞 الدعم

للحصول على الدعم أو الاستفسارات:
- البريد الإلكتروني: support@alhemamcenter.com
- الموقع: https://alhemamcenter.com
- Instagram: [@alhemamcenter](https://www.instagram.com/alhemamcenter/)

---

**مُعين** - لأن كل خطوة مهمة في رحلة التعافي 🌟
