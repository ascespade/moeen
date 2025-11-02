# 🎯 دليل التحكم والتواصل بين كيانات Cursor Cloud

## 📋 نظرة عامة

في **Cursor Cloud**، يمكنك التحكم بـ 4 كيانات رئيسية والتواصل بينهم:

### 🎭 الكيانات الأربعة (4 Entities)

1. **🤖 Background Agents** - وكلاء الخلفية
2. **📜 Rules** - القواعد العامة
3. **🎨 Composer** - الملحن/المحرر المرئي
4. **📝 Composer Rules** - قواعد الملحن الخاصة

---

## 1️⃣ 🤖 Background Agents (وكلاء الخلفية)

### ما هي؟
وكلاء ذكية تعمل في الخلفية بشكل مستقل لمراقبة وإصلاح المشروع تلقائياً.

### كيفية التحكم بها:

#### أ) عبر Dashboard
```
https://cursor.com/dashboard?tab=background-agents
```

#### ب) عبر ملف الإعدادات (JSON)
```json
{
  "name": "My Background Agent",
  "version": "1.0.0",
  "mode": "aggressive",
  "execution": {
    "parallel": true,
    "self_healing": true,
    "auto_commit": true
  }
}
```

#### ج) عبر API
```javascript
// مثال من scripts/cursor-agent-integration.js
const agent = new CursorAgentIntegration(apiKey);
await agent.testConnection();
await agent.getFixSuggestions(errorData);
```

### الإعدادات المتاحة:
- ✅ `mode`: `aggressive` | `conservative` | `balanced`
- ✅ `parallel`: تشغيل متوازي
- ✅ `self_healing`: الإصلاح التلقائي
- ✅ `auto_commit`: الالتزام التلقائي
- ✅ `max_iterations`: عدد المحاولات

---

## 2️⃣ 📜 Rules (القواعد العامة)

### ما هي؟
قواعد عامة تطبق على جميع الوكيل في المشروع.

### كيفية التحكم بها:

#### أ) ملف `.cursorrules`
```markdown
# Cursor AI Agent Rules

## STRICT PROJECT RULES
### 1. No Fake Data
❌ FORBIDDEN: Hardcoded data
✅ REQUIRED: Real database queries

### 2. Preserve Primary Colors
❌ FORBIDDEN: Changing --brand-primary
```

#### ب) عبر Dashboard
```
https://cursor.com/dashboard?tab=rules
```

### الإعدادات المتاحة:
- ✅ قواعد مشروع محددة
- ✅ قواعد أمان
- ✅ قواعد جودة الكود
- ✅ قواعد التصميم

---

## 3️⃣ 🎨 Composer (الملحن)

### ما هي؟
أداة تحرير مرئية لبناء الواجهات باستخدام AI.

### كيفية التحكم بها:

#### أ) عبر Dashboard
```
https://cursor.com/dashboard?tab=composer
```

#### ب) عبر API
```typescript
// مثال على استخدام Composer
const composer = new CursorComposer({
  apiKey: process.env.CURSOR_API_KEY,
  projectId: "your-project-id"
});

await composer.createComponent({
  type: "button",
  props: { label: "Click me" }
});
```

### الإعدادات المتاحة:
- ✅ مكونات مخصصة
- ✅ قوالب جاهزة
- ✅ معاينة مباشرة
- ✅ تصدير الكود

---

## 4️⃣ 📝 Composer Rules (قواعد الملحن)

### ما هي؟
قواعد خاصة بالـ Composer تحدد كيفية إنشاء المكونات.

### كيفية التحكم بها:

#### أ) ملف `.cursor/composer-rules.json`
```json
{
  "component_guidelines": {
    "prefer_shadcn": true,
    "color_system": "centralized",
    "responsive": true
  },
  "code_style": {
    "framework": "nextjs",
    "language": "typescript"
  }
}
```

#### ب) عبر Dashboard
```
https://cursor.com/dashboard?tab=composer-rules
```

---

## 🔗 التواصل بين الكيانات (Communication)

### ✅ نعم، يمكنهم التواصل بينهم!

### طرق التواصل:

#### 1️⃣ عبر Shared Context (السياق المشترك)
```typescript
// Background Agent يقرأ Rules
const rules = await readCursorRules('.cursorrules');

// Composer يستخدم Rules
const component = composer.createComponent({
  ...rules.component_guidelines
});
```

#### 2️⃣ عبر Events System (نظام الأحداث)
```typescript
// Background Agent يرسل حدث
backgroundAgent.emit('component_created', {
  type: 'button',
  location: 'src/components/ui/button.tsx'
});

// Composer Rules تستقبل الحدث
composerRules.on('component_created', (data) => {
  updateComponentRegistry(data);
});
```

#### 3️⃣ عبر API Calls (استدعاءات API)
```typescript
// Background Agent يستدعي Composer API
const suggestion = await composerAPI.getComponentSuggestion({
  context: 'login page',
  rules: composerRules
});
```

#### 4️⃣ عبر Shared Configuration (الإعدادات المشتركة)
```json
{
  "shared": {
    "color_system": "centralized",
    "theme": "light",
    "rtl_support": true
  },
  "background_agent": {
    "uses": ["shared.color_system", "shared.theme"]
  },
  "composer": {
    "uses": ["shared.color_system", "shared.rtl_support"]
  }
}
```

---

## 🎛️ لوحة التحكم الشاملة

### الوصول إلى جميع الكيانات:
```
https://cursor.com/dashboard
```

### التبويبات:
- **Background Agents** → إدارة الوكلاء
- **Rules** → إدارة القواعد
- **Composer** → المحرر المرئي
- **Composer Rules** → قواعد الملحن
- **Projects** → إدارة المشاريع

---

## 📊 مثال عملي: تكامل الكيانات الأربعة

### السيناريو: إنشاء زر جديد

```typescript
// 1️⃣ Rules تحدد القواعد
const rules = {
  no_fake_data: true,
  use_centralized_colors: true
};

// 2️⃣ Composer Rules تحدد نمط المكون
const composerRules = {
  use_shadcn: true,
  responsive: true
};

// 3️⃣ Composer ينشئ المكون
const button = await composer.createComponent({
  type: 'button',
  rules: rules,
  style: composerRules
});

// 4️⃣ Background Agent يراقب الجودة
backgroundAgent.monitor({
  component: button,
  checks: [
    'no_fake_data',
    'uses_centralized_colors',
    'responsive'
  ]
});
```

---

## 🔧 إعدادات التكامل في المشروع

### ملف `cursor-cloud-config.json` (اقتراح)
```json
{
  "project": {
    "id": "hemam-center",
    "name": "Hemam Center Healthcare"
  },
  "entities": {
    "background_agents": {
      "enabled": true,
      "config_file": "./cursor_background_agent.json",
      "api_key_env": "CURSOR_API_KEY"
    },
    "rules": {
      "enabled": true,
      "file": ".cursorrules",
      "shared_with_composer": true
    },
    "composer": {
      "enabled": true,
      "api_key_env": "CURSOR_API_KEY",
      "use_rules": true
    },
    "composer_rules": {
      "enabled": true,
      "file": ".cursor/composer-rules.json",
      "sync_with_rules": true
    }
  },
  "communication": {
    "shared_context": true,
    "events": true,
    "api_sync": true
  }
}
```

---

## 🚀 خطوات البدء السريع

### 1. إعداد Background Agent
```bash
# إنشاء ملف الإعدادات
cp cursor_background_agent.json.example cursor_background_agent.json

# تشغيل الوكيل
npm run cursor:agent
```

### 2. إعداد Rules
```bash
# إنشاء ملف القواعد
touch .cursorrules
# أو تعديل الموجود
```

### 3. إعداد Composer
```typescript
// في كود المشروع
import { CursorComposer } from '@cursor/composer';

const composer = new CursorComposer({
  apiKey: process.env.CURSOR_API_KEY
});
```

### 4. إعداد Composer Rules
```bash
# إنشاء ملف القواعد
mkdir -p .cursor
touch .cursor/composer-rules.json
```

---

## 📝 ملاحظات مهمة

### ✅ المميزات:
- جميع الكيانات يمكن التحكم بها برمجياً
- التواصل ممكن عبر API و Events
- الإعدادات قابلة للتخصيص بالكامل

### ⚠️ القيود:
- بعض الميزات تحتاج إلى Cursor Cloud Pro
- API Keys مطلوبة للتواصل
- بعض الميزات تجريبية

### 🔒 الأمان:
- استخدم Environment Variables للـ API Keys
- لا ترفع ملفات الإعدادات الحساسة لـ Git
- استخدم `.env.local` للمفاتيح

---

## 📚 موارد إضافية

- [Cursor Dashboard](https://cursor.com/dashboard)
- [Background Agents Docs](https://cursor.com/docs/background-agents)
- [Composer Docs](https://cursor.com/docs/composer)
- [Rules Configuration](https://cursor.com/docs/rules)

---

## 🎯 الخلاصة

### ✅ الإجابة على سؤالك:

**هل هناك طريقة للتحكم بكل واحد من الـ 4 في Cursor Cloud؟**
- ✅ نعم! يمكن التحكم بكل واحد عبر:
  - Dashboard (واجهة الويب)
  - ملفات الإعدادات (JSON/Markdown)
  - API Calls (برمجياً)

**هل يستطيعون التواصل بينهم؟**
- ✅ نعم! يمكن التواصل عبر:
  - Shared Context (السياق المشترك)
  - Events System (نظام الأحداث)
  - API Calls (استدعاءات API)
  - Shared Configuration (الإعدادات المشتركة)

---

**تم الإنشاء بواسطة:** Cursor AI Agent 🤖  
**التاريخ:** 2025-01-27  
**الإصدار:** 1.0.0
