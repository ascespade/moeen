# 🚀 دليل سريع: Cursor Cloud Entities

## ✅ الإجابة على أسئلتك:

### 1. هل هناك طريقة للتحكم بكل واحد من الـ 4 في Cursor Cloud؟
**نعم! ✅** يمكنك التحكم في كل Entity بشكل منفصل.

### 2. هل يستطيعون التواصل بينهم؟
**نعم! ✅** Entities يمكنها التواصل مع بعضها البعض عبر نظام الرسائل والأحداث.

---

## ⚡ البدء السريع

### 1. إنشاء ملف الإعدادات
```bash
./scripts/create_entities_config.sh
```

### 2. تشغيل جميع Entities
```bash
./scripts/manage_cursor_entities.sh start all
```

### 3. أو تشغيل Entity واحد فقط
```bash
# Code Agent
./scripts/manage_cursor_entities.sh start code

# Documentation Agent
./scripts/manage_cursor_entities.sh start docs

# Testing Agent
./scripts/manage_cursor_entities.sh start test

# Audit Agent
./scripts/manage_cursor_entities.sh start audit
```

---

## 💬 التواصل بين Entities

### إرسال رسالة
```bash
# من Code Agent إلى Docs Agent
python3 scripts/entity_communication.py send \
  --from entity_001 \
  --to entity_002 \
  --type task_complete \
  --content "تم إصلاح الأخطاء في Button.tsx"
```

### بث حدث لجميع Entities
```bash
python3 scripts/entity_communication.py broadcast \
  --source entity_001 \
  --type refactoring_complete \
  --data '{"file": "Button.tsx", "changes": "optimized"}' \
  --subscribers entity_002,entity_003,entity_004
```

### عرض الرسائل
```bash
# عرض رسائل Entity معين
python3 scripts/entity_communication.py messages entity_002

# عرض الأحداث
python3 scripts/entity_communication.py events
```

---

## 📊 المراقبة

### عرض حالة جميع Entities
```bash
./scripts/manage_cursor_entities.sh status
```

### عرض حالة Entity واحد
```bash
./scripts/manage_cursor_entities.sh status code
```

---

## 🎮 الوضع التفاعلي

```bash
./scripts/manage_cursor_entities.sh
```

سيفتح قائمة تفاعلية لإدارة Entities.

---

## 📚 للمزيد من التفاصيل

اقرأ الدليل الشامل: [`docs/CURSOR_CLOUD_ENTITIES_GUIDE.md`](docs/CURSOR_CLOUD_ENTITIES_GUIDE.md)

---

## 🎯 Entities الأربعة

1. **🔧 Code Agent** (`entity_001`) - للبرمجة والإصلاحات
2. **📝 Documentation Agent** (`entity_002`) - للتوثيق
3. **🧪 Testing Agent** (`entity_003`) - للاختبارات
4. **🔍 Audit Agent** (`entity_004`) - للمراجعة والتدقيق

---

## 📝 ملاحظات

- ملف الرسائل موجود في: `.cursor/entity_messages.json`
- ملف الإعدادات: `cursor_cloud_entities.json`
- ملفات السجلات: `.cursor_entities_logs/`

---

**تم إنشاءه:** 2025-01-20
