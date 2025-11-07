# نظام معين - نظام إدارة الرعاية الصحية

نظام متكامل لإدارة الرعاية الصحية والمعلومات الطبية.

## المتطلبات الأساسية

### المتطلبات

- Node.js 18+
- npm أو yarn
- Supabase account

### التثبيت

```bash
# تثبيت dependencies
npm install

# نسخ ملف البيئة
cp env.example .env.local

# تشغيل المشروع
npm run dev
```

## هيكل المشروع

```
/
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # مكونات React
│   ├── lib/              # مكتبات و utilities
│   ├── hooks/            # React hooks
│   ├── styles/           # ملفات CSS
│   └── types/            # TypeScript types
├── public/               # الملفات الثابتة
├── supabase/            # Supabase migrations
└── migrations/          # Database migrations
```

## الأوامر المتاحة

```bash
# التطوير
npm run dev              # تشغيل development server
npm run build            # بناء المشروع للإنتاج
npm run start            # تشغيل production server

# الجودة
npm run lint             # فحص الكود
npm run type:check       # فحص TypeScript types

# الاختبارات
npm run test             # تشغيل جميع الاختبارات
npm run test:unit        # الاختبارات الوحيدة
npm run test:e2e         # الاختبارات End-to-End
```

## المزيد من المعلومات

- [دليل البدء السريع](./docs/essential/README.md)
- [توثيق API](./docs/essential/API.md)
- [دليل التصميم](./docs/essential/ARCHITECTURE.md)

## المميزات

- نظام Supabase Auth المتكامل
- واجهات API routes
- نظام الصلاحيات المتقدم (RBAC)

## التقنيات المستخدمة

- Tailwind CSS
- نظام التصميم المركزي
- دعم RTL
- Dark/Light mode

## الترخيص

نظام معين © 2024 جميع الحقوق محفوظة
