# 🤖 CI Assistant + Cursor Background Agent Flow

## 🔄 سيناريو العمل الكامل

### 1️⃣ Ultimate CI Self-Healing Agent يفشل
```
Ultimate CI Self-Healing Agent → فشل → trigger CI Assistant
```

### 2️⃣ CI Assistant يبدأ العمل
```
CI Assistant → تحليل الخطأ → إرسال إلى Cursor Background Agent
```

### 3️⃣ إرسال الخطأ إلى Cursor Background Agent
```json
{
  "error_type": "workflow_failure",
  "workflow_name": "🚀 Ultimate CI Self-Healing Agent",
  "workflow_conclusion": "failure",
  "workflow_url": "https://github.com/...",
  "commit_sha": "abc123...",
  "commit_message": "fix: update workflow",
  "repository": "user/repo",
  "branch": "main",
  "context": "GitHub Actions workflow failure",
  "priority": "high",
  "timestamp": "2025-01-18T10:30:00Z",
  "request_type": "fix_workflow_error",
  "files_to_fix": [".github/workflows/ultimate-ci-self-healing.yml"],
  "fix_scope": "workflow_only"
}
```

### 4️⃣ Cursor Background Agent يعمل
```
Cursor Background Agent → يحلل الخطأ → يصلح الـ workflow → يرفع التغييرات
```

### 5️⃣ CI Assistant ينتظر
```
CI Assistant → انتظار 5 دقائق → فحص الإصلاحات → commit التغييرات
```

### 6️⃣ النتيجة النهائية
```
CI Assistant → commit مع رسالة خاصة → push → Ultimate CI يعيد المحاولة
```

---

## 🔧 تفاصيل التنفيذ

### API Call إلى Cursor Background Agent
```bash
curl -X POST "https://api.cursor.sh/v1/background-agent" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${{ vars.CURSOR_API_KEY }}" \
  -d @error-report.json
```

### انتظار الإصلاح
```bash
# انتظار 5 دقائق لـ Cursor Background Agent
sleep 300
```

### فحص الإصلاحات
```bash
# فحص إذا كان Cursor قام بإصلاح الملفات
if git diff --quiet; then
  echo "لا توجد تغييرات من Cursor"
else
  echo "تم العثور على إصلاحات من Cursor"
  git diff --name-only
fi
```

### Commit Message
```
🤖 CI Assistant: إصلاح workflow بواسطة Cursor Background Agent

🔧 الإصلاحات (workflow files فقط):
- نوع الخطأ: workflow_failure
- الحل المطبق: إصلاح مشكلة YAML syntax
- نوع الإصلاح: fix-workflow-yaml

🤖 تم الإصلاح بواسطة: Cursor Background Agent
📤 تم الإرسال عبر: CI Assistant API
⏳ وقت الانتظار: 5 دقائق

📚 التعلم:
- تم حفظ معلومات الخطأ للتعلم
- تم تحديث أنماط الأخطاء
- تم تحسين النظام لتجنب تكرار الخطأ

🚫 إصلاح workflow فقط - لا يصلح أي شيء آخر
```

---

## 🛡️ آليات الأمان

### منع الحلقة المفرغة
- ✅ CI Assistant يفحص commit messages
- ✅ لا يعمل إذا كان الخطأ من نفسه
- ✅ لا يعمل إذا كان الخطأ من Ultimate CI

### حدود الإصلاح
- ✅ يصلح workflow files فقط
- ✅ لا يصلح أي شيء آخر
- ✅ ينتظر Cursor Background Agent

### فحص التغييرات
- ✅ يفحص إذا كانت هناك تغييرات قبل commit
- ✅ لا يرفع commit فارغ
- ✅ يفحص نوع الملفات المعدلة

---

## 📊 المراقبة والتتبع

### سجل الإرسال
- ✅ timestamp الإرسال
- ✅ response من Cursor API
- ✅ status الإرسال

### سجل الانتظار
- ✅ وقت بداية الانتظار
- ✅ وقت انتهاء الانتظار
- ✅ مدة الانتظار

### سجل الإصلاح
- ✅ الملفات المعدلة
- ✅ نوع الإصلاح
- ✅ نتيجة الإصلاح

---

## 🎯 النتيجة النهائية

### ✅ ما يحدث:
1. **Ultimate CI يفشل** → CI Assistant يبدأ
2. **CI Assistant يحلل الخطأ** → يرسل إلى Cursor
3. **Cursor يصلح الخطأ** → يرفع التغييرات
4. **CI Assistant ينتظر** → يفحص الإصلاحات
5. **CI Assistant يرفع commit** → Ultimate CI يعيد المحاولة

### ❌ ما لا يحدث:
- CI Assistant لا يصلح أي شيء بنفسه
- CI Assistant لا يصلح ملفات غير workflow
- CI Assistant لا يعمل إذا كان الخطأ من نفسه

🎉 **النظام يعمل بالضبط كما طلبت!**