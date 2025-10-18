# 🤝 دليل المساهمة - Contributing Guide

مرحباً بك في **معين - Moeen**! نحن سعداء بمساهمتك في تطوير هذا المشروع.

## 📋 جدول المحتويات

- [البدء السريع](#البدء-السريع)
- [معايير الكود](#معايير-الكود)
- [سير العمل](#سير-العمل)
- [اختبار التغييرات](#اختبار-التغييرات)
- [إرسال Pull Request](#إرسال-pull-request)

---

## 🚀 البدء السريع

### المتطلبات

- Node.js 18+ و npm
- PostgreSQL (أو Supabase)
- Git

### التثبيت

```bash
# Clone the repository
git clone https://github.com/yourusername/moeen.git
cd moeen

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# ثم قم بتعديل .env.local بإضافة مفاتيح API

# Run development server
npm run dev
```

---

## 📝 معايير الكود

### TypeScript

- ✅ **استخدم TypeScript**: كل الكود يجب أن يكون مكتوباً بـ TypeScript
- ✅ **تجنب `any`**: استخدم أنواع محددة دائماً
- ✅ **تفعيل strict mode**: تأكد من أن `strict: true` في tsconfig.json

```typescript
// ❌ خطأ
function getData(id: any): any {
  return data;
}

// ✅ صحيح
function getData(id: string): User | null {
  return users.find(u => u.id === id) ?? null;
}
```

### React Components

- ✅ استخدم Function Components
- ✅ استخدم Hooks بشكل صحيح
- ✅ أضف ARIA attributes للوصولية

```tsx
// ✅ مثال جيد
export function LoginButton({ onLogin }: { onLogin: () => void }) {
  return (
    <button
      onClick={onLogin}
      aria-label='تسجيل الدخول'
      className='btn btn-primary'
    >
      تسجيل الدخول
    </button>
  );
}
```

### Styling

- استخدم **Tailwind CSS** للتنسيق
- استخدم **Design Tokens** من `src/lib/design-tokens.ts`
- استخدم `cn()` utility لدمج الـ classes

```tsx
import { cn } from '@/lib/cn';

<div className={cn('base-classes', isActive && 'active-classes', className)}>
  {children}
</div>;
```

---

## 🔄 سير العمل

### 1. إنشاء Branch جديد

```bash
git checkout -b feature/your-feature-name
# أو
git checkout -b fix/bug-description
```

### تسمية الـ Branches

- `feature/` - للميزات الجديدة
- `fix/` - لإصلاح الأخطاء
- `docs/` - للتوثيق
- `refactor/` - لإعادة الهيكلة
- `test/` - للاختبارات

### 2. قم بالتعديلات

- اتبع معايير الكود أعلاه
- أضف تعليقات JSDoc للدوال المعقدة
- تأكد من عدم وجود `console.log` في الكود

### 3. Commit Message

استخدم [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git commit -m "feat: إضافة صفحة المواعيد"
git commit -m "fix: إصلاح مشكلة تسجيل الدخول"
git commit -m "docs: تحديث دليل المساهمة"
```

الأنواع المتاحة:

- `feat`: ميزة جديدة
- `fix`: إصلاح خطأ
- `docs`: توثيق
- `style`: تنسيق (لا يؤثر على الكود)
- `refactor`: إعادة هيكلة
- `test`: إضافة اختبارات
- `chore`: مهام عامة

---

## 🧪 اختبار التغييرات

### قبل الـ Commit

```bash
# TypeScript check
npm run type-check
# أو
npx tsc --noEmit

# ESLint
npm run lint

# Tests
npm run test
```

### Husky Pre-commit Hook

عند عمل commit، سيتم تشغيل:

- TypeScript check
- ESLint check

إذا فشلت الفحوصات، لن يتم السماح بالـ commit.

---

## 🔐 الأمان

### لا تضع Secrets في الكود

```typescript
// ❌ خطأ - مفاتيح مكشوفة
const apiKey = 'sk_live_xxxxxxxxxxxxx';

// ✅ صحيح - استخدم env
const apiKey = process.env.STRIPE_SECRET_KEY;
```

### استخدم التشفير

```typescript
import { encrypt, decrypt } from '@/lib/encryption';

// تشفير بيانات حساسة
const encrypted = encrypt(sensitiveData);

// فك التشفير
const decrypted = decrypt(encrypted);
```

---

## 📤 إرسال Pull Request

### 1. Push إلى GitHub

```bash
git push origin feature/your-feature-name
```

### 2. إنشاء Pull Request

- اذهب إلى GitHub
- اضغط "New Pull Request"
- اختر branch-ك
- أضف وصف واضح للتغييرات

### 3. Review Process

- سيقوم أحد المراجعين بمراجعة الكود
- قد يطلب منك تعديلات
- بعد الموافقة، سيتم دمج الـ PR

---

## 🎨 UI/UX Guidelines

### Component Structure

```
src/components/
  ├── ui/           # مكونات UI الأساسية (Button, Input, etc.)
  ├── common/       # مكونات مشتركة
  ├── layout/       # مكونات التخطيط
  └── features/     # مكونات الميزات
```

### Imports

```typescript
// ✅ استخدم Central Imports
import { Button, Card, Input } from '@/components/ui';
import { ErrorBoundary } from '@/components/common';

// ❌ تجنب Direct Imports
import Button from '@/components/ui/Button';
```

---

## 📚 الموارد

- [Next.js Docs](https://nextjs.org/docs)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Supabase Docs](https://supabase.com/docs)

---

## 💬 التواصل

- **Issues**: لطلب ميزات أو الإبلاغ عن أخطاء
- **Discussions**: للأسئلة والنقاش
- **Email**: support@moeen.sa

---

## ✅ Checklist قبل الـ PR

- [ ] الكود يعمل بدون أخطاء
- [ ] TypeScript check يمر بنجاح
- [ ] ESLint check يمر بنجاح
- [ ] أضفت ARIA attributes للوصولية
- [ ] أضفت tests (إن أمكن)
- [ ] لا توجد `console.log` statements
- [ ] Commit messages واضحة
- [ ] PR description واضح ومفصل

---

شكراً لمساهمتك في **معين**! 🎉
