# ⚡ إعداد سريع لـ Cursor Cloud Entities

## 🎯 نظرة سريعة

هذا الدليل يساعدك على إعداد والتحكم في **4 كيانات** في Cursor Cloud:

1. 🤖 **Background Agents**
2. 📜 **Rules**
3. 🎨 **Composer**
4. 📝 **Composer Rules**

---

## 🚀 البدء السريع (5 دقائق)

### الخطوة 1: إعداد متغيرات البيئة

```bash
# إنشاء ملف .env.local
cp env.example .env.local

# إضافة API Key
echo "CURSOR_API_KEY=your_api_key_here" >> .env.local
```

### الخطوة 2: إعداد ملف الإعدادات

```bash
# الملف موجود بالفعل: cursor-cloud-config.json
# تحقق من الإعدادات
cat cursor-cloud-config.json
```

### الخطوة 3: إنشاء ملف Composer Rules (اختياري)

```bash
# إنشاء المجلد
mkdir -p .cursor

# نسخ الملف النموذجي
cp .cursor/composer-rules.json.example .cursor/composer-rules.json

# تعديل الإعدادات حسب احتياجك
nano .cursor/composer-rules.json
```

### الخطوة 4: اختبار التكامل

```bash
# استخدام TypeScript
npx tsx scripts/cursor-cloud-integration.ts

# أو استخدام Node.js بعد التجميع
npm run build
node dist/scripts/cursor-cloud-integration.js
```

---

## 📚 الاستخدام البرمجي

### مثال 1: التحكم في Background Agent

```typescript
import CursorCloudManager from './scripts/cursor-cloud-integration';

const manager = new CursorCloudManager();

// بدء الوكيل
await manager.controlBackgroundAgent('start');

// إيقاف الوكيل
await manager.controlBackgroundAgent('stop');

// الحصول على الحالة
const status = await manager.controlBackgroundAgent('status');
console.log(status);
```

### مثال 2: التواصل عبر الأحداث

```typescript
// إعداد معالج الأحداث
manager.on('component_created', (data) => {
  console.log('تم إنشاء مكون جديد:', data);
  
  // يمكنك هنا إرسال إشعار أو تحديث قاعدة بيانات
});

// إرسال حدث
manager.emit('component_created', {
  type: 'button',
  id: 'btn-1',
  props: { label: 'Click me' }
});
```

### مثال 3: مزامنة Rules

```typescript
// قراءة Rules
const rules = await manager.controlRules('read');
console.log(rules);

// مزامنة Rules مع Composer Rules
await manager.controlRules('sync');
```

### مثال 4: استخدام Composer

```typescript
// إنشاء مكون جديد
const component = await manager.controlComposer('create', {
  type: 'button',
  props: {
    label: 'Save',
    variant: 'primary'
  }
});

console.log('المكون المُنشأ:', component);
```

### مثال 5: الحصول على حالة جميع الكيانات

```typescript
const allStatus = await manager.getAllEntitiesStatus();
console.log('حالة جميع الكيانات:', allStatus);
```

---

## 🔗 التواصل بين الكيانات

### كيف يعمل التواصل؟

```typescript
// 1. Background Agent ينشئ مكونًا
manager.emit('component_created', { id: 'comp-1' });

// 2. Composer Rules تستقبل الحدث وتحقق
manager.on('component_created', (data) => {
  // التحقق من القواعد
  const isValid = validateAgainstRules(data);
  
  // إذا كان صحيحًا، تحديث Composer
  if (isValid) {
    manager.emit('component_validated', data);
  }
});

// 3. Composer يستقبل الحدث ويحدث الواجهة
manager.on('component_validated', (data) => {
  updateComposerUI(data);
});
```

---

## 🎛️ لوحة التحكم

### الوصول إلى Dashboard

```
https://cursor.com/dashboard
```

### التبويبات المتاحة:

- **Background Agents** → إدارة الوكلاء
  - تشغيل/إيقاف
  - مراقبة الحالة
  - عرض السجلات

- **Rules** → إدارة القواعد
  - تعديل القواعد
  - مزامنة القواعد
  - معاينة التغييرات

- **Composer** → المحرر المرئي
  - إنشاء مكونات
  - تعديل الواجهات
  - تصدير الكود

- **Composer Rules** → قواعد الملحن
  - إعدادات التصميم
  - قواعد المكونات
  - المزامنة مع Rules

---

## ⚙️ الإعدادات المتقدمة

### تفعيل/تعطيل كيان معين

```json
// في cursor-cloud-config.json
{
  "entities": {
    "background_agents": {
      "enabled": true  // تغيير إلى false لتعطيل
    }
  }
}
```

### تفعيل التواصل بين كيانين

```json
{
  "integration": {
    "background_agent_to_composer": {
      "enabled": true,
      "on_event": "component_suggestion_needed",
      "action": "suggest_component"
    }
  }
}
```

### إعداد نظام الأحداث

```json
{
  "communication": {
    "events": {
      "enabled": true,
      "channels": [
        "component_created",
        "component_updated",
        "rules_changed",
        "agent_fixed"
      ]
    }
  }
}
```

---

## 🔒 الأمان

### ✅ أفضل الممارسات:

1. **لا ترفع API Keys**
   ```bash
   # تأكد من وجود .env.local في .gitignore
   echo ".env.local" >> .gitignore
   ```

2. **استخدم Environment Variables**
   ```typescript
   const apiKey = process.env.CURSOR_API_KEY;
   ```

3. **تحقق من الصلاحيات**
   ```json
   {
     "security": {
       "validate_requests": true,
       "rate_limiting": {
         "enabled": true,
         "max_requests_per_minute": 60
       }
     }
   }
   ```

---

## 📊 مراقبة الأداء

### تفعيل السجلات

```json
{
  "monitoring": {
    "log_level": "info",
    "log_file": ".cursor_cloud_logs/entities.log",
    "metrics": {
      "track_api_calls": true,
      "track_events": true
    }
  }
}
```

### عرض السجلات

```bash
# عرض السجلات المباشرة
tail -f .cursor_cloud_logs/entities.log

# البحث في السجلات
grep "ERROR" .cursor_cloud_logs/entities.log
```

---

## ❓ الأسئلة الشائعة

### س: هل يمكن التحكم بكل واحد من الـ 4 بشكل منفصل؟
✅ نعم، كل كيان يمكن التحكم به بشكل مستقل عبر:
- Dashboard
- ملفات الإعدادات
- API Calls

### س: هل يستطيعون التواصل بينهم؟
✅ نعم، التواصل ممكن عبر:
- نظام الأحداث (Events)
- API Calls
- السياق المشترك (Shared Context)
- الإعدادات المشتركة

### س: كيف أتحقق من أن التواصل يعمل؟
```typescript
// إعداد معالج حدث
manager.on('test_event', (data) => {
  console.log('✅ التواصل يعمل!', data);
});

// إرسال حدث تجريبي
manager.emit('test_event', { message: 'Hello from entity 1' });
```

### س: ماذا لو فشل التواصل؟
- تحقق من أن `communication.events.enabled = true`
- تحقق من وجود API Key
- راجع السجلات في `.cursor_cloud_logs/`

---

## 📖 المراجع

- [دليل الكيانات الكامل](./docs/CURSOR_CLOUD_ENTITIES_GUIDE.md)
- [Cursor Dashboard](https://cursor.com/dashboard)
- [API Documentation](https://cursor.com/docs/api)

---

## 🆘 الدعم

إذا واجهت مشاكل:
1. راجع ملف السجلات
2. تحقق من الإعدادات في `cursor-cloud-config.json`
3. تأكد من وجود API Key صحيح
4. راجع [دليل الكيانات الكامل](./docs/CURSOR_CLOUD_ENTITIES_GUIDE.md)

---

**تم الإنشاء بواسطة:** Cursor AI Agent 🤖  
**آخر تحديث:** 2025-01-27
