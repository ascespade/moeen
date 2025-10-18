# 🌐 نظام الترجمات - Translation System

## ⚠️ خطوات التطبيق

### 1. تطبيق Migration في Supabase

**افتح Supabase Studio:**
```
https://supabase.com/dashboard/project/YOUR_PROJECT/sql
```

**انسخ والصق هذا الـ SQL:**

```sql
-- Create languages table
CREATE TABLE IF NOT EXISTS languages (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  direction TEXT DEFAULT 'rtl',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create translations table
CREATE TABLE IF NOT EXISTS translations (
  id SERIAL PRIMARY KEY,
  lang_code TEXT REFERENCES languages(code) ON DELETE CASCADE,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  namespace TEXT DEFAULT 'common',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(lang_code, key, namespace)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_translations_lookup ON translations(lang_code, namespace, key);

-- Insert default languages
INSERT INTO languages (code, name, is_default, direction) VALUES
  ('ar', 'العربية', true, 'rtl'),
  ('en', 'English', false, 'ltr')
ON CONFLICT (code) DO NOTHING;
```

**اضغط RUN** ✅

---

### 2. تعبئة الترجمات

بعد تطبيق الـ migration، شغّل:

```bash
node scripts/seed-translations.js
```

سيضيف **60+ ترجمة** للمفاتيح الأساسية.

---

## 📋 المفاتيح المتوفرة

### Common (عام)
```
common.loading          → "جاري التحميل..." / "Loading..."
common.save             → "حفظ" / "Save"
common.cancel           → "إلغاء" / "Cancel"
common.delete           → "حذف" / "Delete"
common.edit             → "تعديل" / "Edit"
common.search           → "بحث" / "Search"
common.welcome          → "مرحباً" / "Welcome"
```

### Auth (المصادقة)
```
auth.login              → "تسجيل الدخول" / "Login"
auth.register           → "إنشاء حساب" / "Register"
auth.email              → "البريد الإلكتروني" / "Email"
auth.password           → "كلمة المرور" / "Password"
auth.welcomeBack        → "مرحباً بعودتك" / "Welcome back"
auth.loginMessage       → "سجل دخولك..." / "Login to access..."
```

### Navigation (التنقل)
```
nav.services            → "الخدمات" / "Services"
nav.about               → "عن معين" / "About"
nav.dashboard           → "لوحة التحكم" / "Dashboard"
```

### Dashboard (لوحة التحكم)
```
dashboard.title         → "لوحة التحكم" / "Dashboard"
dashboard.welcome       → "مرحباً" / "Welcome"
dashboard.stats.appointments → "المواعيد القادمة" / "Upcoming Appointments"
```

### Roles (الأدوار)
```
role.admin              → "مدير" / "Admin"
role.supervisor         → "مشرف" / "Supervisor"
role.patient            → "مريض" / "Patient"
role.doctor             → "طبيب" / "Doctor"
```

---

## 🔧 الاستخدام في الكود

### في Component:

```tsx
import { useT } from '@/components/providers/I18nProvider';

export default function MyComponent() {
  const { t } = useT();
  
  return (
    <div>
      <h1>{t('common.welcome')}</h1>
      <button>{t('auth.login')}</button>
    </div>
  );
}
```

### مع Fallback:

```tsx
<p>{t('auth.welcomeBack', 'مرحباً بعودتك')}</p>
```

---

## ✅ الحالة

```
✅ Migration SQL: جاهز
✅ Seed Script: جاهز
✅ 60+ Translation Keys: جاهزة
⏳ تطبيق على الصفحات: قيد العمل
```

---

## 📂 الملفات

```
scripts/seed-translations.js    → Script تعبئة الترجمات
src/hooks/useI18n.ts            → Hook الترجمة
src/components/providers/I18nProvider.tsx → Provider
apply-translations-migration.sql → SQL Migration
```

---

## 🚀 الخطوة التالية

بعد تطبيق Migration + Seed:

1. ✅ استبدال النصوص الثابتة بـ `t()` function
2. ✅ إضافة مفاتيح جديدة حسب الحاجة
3. ✅ اختبار تبديل اللغة

---

**الحالة:** ⏳ جاهز للتطبيق اليدوي في Supabase
