# 📘 دليل التنظيم - Agent System v3.0

## 🎯 الأنظمة الجديدة

تم إضافة 3 أنظمة جديدة للتنظيم الآمن:

```
.agent-system/
├── 📁 organize-folders.js    # تنظيم المجلدات
├── 🎨 organize-code.js        # تنظيم الكود
├── 🧹 cleanup-project.js      # تنظيف المشروع
└── 🚀 run-all.js              # تشغيل كل شيء
```

---

## 📁 **1. Organize Folders** - تنظيم المجلدات

### الوظيفة:
ينظم هيكل المشروع ويضع الملفات في أماكنها الصحيحة.

### الاستخدام:
```bash
node .agent-system/organize-folders.js
```

### ما يفعله:

#### ✅ تنظيم Components:
```
قبل:
src/components/
├── Button.tsx
├── LoginForm.tsx
├── PatientCard.tsx
├── Header.tsx
└── ...

بعد:
src/components/
├── ui/
│   └── Button.tsx
├── auth/
│   └── LoginForm.tsx
├── patient/
│   └── PatientCard.tsx
└── layout/
    └── Header.tsx
```

**التصنيفات المدعومة:**
- `ui/` - Button, Input, Modal, Card, Badge
- `forms/` - Form, Field, Select, Checkbox
- `layout/` - Header, Footer, Sidebar, Navigation
- `auth/` - Login, Register, ForgotPassword
- `admin/` - AdminPanel, Dashboard
- `patient/` - PatientCard, PatientList
- `booking/` - BookingForm, Calendar
- `chatbot/` - Chatbot, Message
- `common/` - Loading, Error, NotFound

#### ✅ تنظيم Lib:
```
src/lib/
├── api/           # API clients
├── auth/          # Authentication
├── hooks/         # Custom hooks
├── utils/         # Utilities
├── constants/     # Constants
├── types/         # TypeScript types
├── config/        # Configuration
├── validations/   # Validation schemas
├── helpers/       # Helper functions
├── services/      # Business logic
├── supabase/      # Supabase client
├── monitoring/    # Logging
└── notifications/ # Notifications
```

#### ✅ إنشاء Index Files:
```typescript
// src/components/ui/index.ts
export * from './Button';
export * from './Input';
export * from './Modal';

// الاستخدام:
import { Button, Input } from '@/components/ui';
```

#### ✅ كشف الملفات المكررة:
```
⚠️  Found 2 duplicate files:
    src/lib/utils/helpers.ts
    src/helpers/utils.ts
```

---

## 🎨 **2. Organize Code** - تنظيم الكود

### الوظيفة:
ينظم الكود داخل الملفات: imports, exports, functions.

### الاستخدام:
```bash
node .agent-system/organize-code.js
```

### ما يفعله:

#### ✅ تنظيم Imports:
```typescript
// قبل:
import logger from '@/lib/monitoring/logger';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

// بعد:
import { useState } from 'react';

import Link from 'next/link';

import { createClient } from '@/lib/supabase/client';
import logger from '@/lib/monitoring/logger';
```

**الترتيب:**
1. React imports
2. Next.js imports
3. External libraries
4. Internal imports (@/)
5. Relative imports (./ ../)

#### ✅ تنظيف التعليقات:
```typescript
// قبل:
// TODO: Fix this
// TODO: Fix this  ← مكرر!
const x = 1;


const y = 2;  ← 3 أسطر فارغة!


// بعد:
// TODO: Fix this
const x = 1;

const y = 2;  ← سطرين فقط!
```

#### ✅ تنظيم Exports:
```typescript
// قبل:
export { Button } from './Button';
const MyComponent = () => { ... };
export { Input } from './Input';

// بعد:
const MyComponent = () => { ... };

export { Button } from './Button';
export { Input } from './Input';
```

#### ✅ Prettier:
ينسق كل الملفات باستخدام Prettier.

---

## 🧹 **3. Cleanup Project** - تنظيف المشروع

### الوظيفة:
يحذف الملفات غير الضرورية ويوفر مساحة.

### الاستخدام:
```bash
node .agent-system/cleanup-project.js
```

### ما يفعله:

#### ✅ حذف ملفات البناء:
```
✅ Deleted: .next/ (234 MB)
✅ Deleted: out/ (12 MB)
✅ Deleted: dist/ (45 MB)
```

#### ✅ حذف ملفات مؤقتة:
```
✅ Deleted old backup: backup-1760769796308 (89 MB)
✅ Deleted: *.log files
✅ Deleted: .DS_Store files
```

#### ✅ تنظيف node_modules:
```
Current size: 456 MB
Running npm prune...
✅ Saved: 23 MB
```

#### ✅ كشف الملفات غير المستخدمة:
```
⚠️  Found 5 potential unused files:
    src/components/old/Button.test.tsx
    src/lib/utils.example.ts
    src/pages/test.tsx
    
💡 Review these files manually
```

#### ✅ تحليل الحجم:
```
Project size breakdown:
    src             12.3 MB    (2.1%)
    node_modules    456 MB     (78.4%)
    .next           89 MB      (15.3%)
    public          25 MB      (4.2%)
    TOTAL           582 MB
```

#### ✅ فحص package.json:
```
⚠️  Found 2 duplicate dependencies:
    typescript (in both dependencies and devDependencies)
    eslint

💡 Consider moving to devDependencies
```

---

## 🚀 **4. Run All** - تشغيل كل شيء

### الوظيفة:
يشغل كل الأنظمة بالترتيب.

### الاستخدام:
```bash
node .agent-system/run-all.js
```

### الترتيب:
1. 🤖 Auto-Fix (إصلاح الأخطاء)
2. 🧠 Smart-Fix (إصلاحات ذكية)
3. 📁 Organize Folders (تنظيم المجلدات)
4. 🎨 Organize Code (تنظيم الكود)
5. 🧹 Cleanup Project (تنظيف المشروع)

### النتيجة:
```
📊 Final Summary:

   ✅ 🤖 Auto-Fix
   ✅ 🧠 Smart-Fix
   ✅ 📁 Organize Folders
   ✅ 🎨 Organize Code
   ✅ 🧹 Cleanup Project

   Success Rate: 100% (5/5)
   Duration: 127s

🎉 All systems completed successfully!
```

---

## 🛡️ الأمان

### النسخ الاحتياطية:
كل نظام ينشئ نسخة احتياطية:
```
tmp/
├── backup-folders-[timestamp]/
├── backup-code-[timestamp]/
└── backup-cleanup-[timestamp]/
```

### الاستعادة:
```bash
# إذا حصلت مشكلة
cp -r tmp/backup-folders-1760769796308/src/* src/
```

### السجلات:
```
tmp/
├── organize-folders.log
├── organize-code.log
└── cleanup-project.log
```

---

## 📊 التقارير

بعد كل تشغيل:
```
tmp/
├── organize-folders-report.json
├── organize-code-report.json
└── cleanup-project-report.json
```

### مثال تقرير:
```json
{
  "timestamp": "2025-10-18T07:30:00.000Z",
  "results": {
    "components": 15,
    "lib": 12,
    "duplicates": 2,
    "indexFiles": 6
  },
  "total": 33
}
```

---

## 🎯 حالات الاستخدام

### السيناريو 1: بعد Pull من Git
```bash
# تنظيف وتنظيم
node .agent-system/organize-folders.js
node .agent-system/organize-code.js
```

### السيناريو 2: قبل Deploy
```bash
# كل شيء
node .agent-system/run-all.js
```

### السيناريو 3: المشروع بطيء
```bash
# تنظيف فقط
node .agent-system/cleanup-project.js
```

### السيناريو 4: الكود فوضوي
```bash
# تنظيم الكود
node .agent-system/organize-code.js
```

---

## 💡 نصائح

### 1️⃣ شغّله دورياً:
```bash
# كل أسبوع
node .agent-system/run-all.js
```

### 2️⃣ قبل Commit كبير:
```bash
node .agent-system/organize-code.js
git add .
git commit -m "refactor: organized code"
```

### 3️⃣ بعد إضافة مكونات جديدة:
```bash
node .agent-system/organize-folders.js
```

---

## 📈 الفوائد

### ⚡ الأداء:
- تنظيف .next/ → بناء أسرع
- npm prune → تثبيت أسرع
- حذف ملفات مؤقتة → قراءة أسرع

### 📦 الحجم:
- توفير 100-500 MB
- node_modules أصغر
- backup أنظف

### 🧹 النظافة:
- كود منظم
- imports مرتبة
- لا مكررات
- لا ملفات غير مستخدمة

### 🚀 الإنتاجية:
- سهولة إيجاد الملفات
- import واضحة
- كود قابل للصيانة

---

## 🆕 الجديد في v3.0

```
✨ 3 أنظمة جديدة:
   - Organize Folders
   - Organize Code
   - Cleanup Project

✨ Run All:
   - تشغيل كل شيء بأمر واحد

✨ تحسينات:
   - نسخ احتياطية أفضل
   - تقارير أكثر تفصيلاً
   - كشف مكررات
   - تحليل الحجم

✨ الأمان:
   - لا حذف بدون backup
   - سجلات مفصلة
   - تأكيد قبل الحذف
```

---

**الإصدار**: 3.0.0  
**تاريخ التحديث**: 2025-10-18  
**الحالة**: ✅ جاهز للاستخدام
