# 🤖 AI Intelligent CI/CD System

نظام متقدم للاختبار الذكي والإصلاح الذاتي مع التعلم المستمر.

## 📋 المحتويات

```
ai-intelligent-ci/
├── ai-intelligent-orchestrator.mjs  # المنسق الرئيسي
├── ai_agent_config.json             # تكوين الوكيل
├── ai_training_cache.json           # ذاكرة التعلم
├── ai_logs.db                       # قاعدة بيانات السجلات
├── cursor.agent.json                # تكوين Cursor Agent
├── package.json                     # التبعيات
├── scripts/                         # السكريبتات المساعدة
│   ├── ai_diff_analyzer.mjs        # محلل الفروقات
│   ├── ai_scenario_generator.mjs   # مولد السيناريوهات
│   ├── ai_logger.mjs               # نظام التسجيل
│   ├── ai_self_test_and_fix.mjs   # الإصلاح الذاتي
│   └── helpers.mjs                 # وظائف مساعدة
├── tests/                           # الاختبارات
│   ├── base/                       # اختبارات أساسية
│   ├── generated/                  # اختبارات مولدة تلقائياً
│   └── regression/                 # اختبارات الانحدار
├── dashboard/                       # لوحة المراقبة
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── logs.json
└── reports/                         # التقارير
    └── final_summary.md

```

## ✨ الميزات الرئيسية

### 1. 🔍 تحليل الفروقات الذكي
- تحديد الملفات المتغيرة تلقائياً
- استخراج الموديولات المتأثرة
- تحليل التأثير المحتمل

### 2. 🧪 توليد الاختبارات الذكية
- توليد اختبارات مستهدفة للموديولات المتأثرة فقط
- استخدام التاريخ السابق لتحسين الاختبارات
- دعم Playwright و Supawright

### 3. 🔧 الإصلاح الذاتي
- محاولات متعددة لإصلاح الأخطاء
- تطبيق ESLint و Prettier تلقائياً
- إعادة تشغيل الاختبارات بعد الإصلاح

### 4. 🧠 التعلم المستمر
- حفظ الأنماط المتعلمة
- تتبع تاريخ الاختبارات
- تحسين الاختبارات بناءً على الفشل السابق

### 5. 📊 التقارير الشاملة
- تقارير JSON مفصلة
- تقارير Markdown قابلة للقراءة
- لوحة مراقبة تفاعلية

## 🚀 التثبيت والإعداد

### 1. تثبيت التبعيات

```bash
cd ai-intelligent-ci
npm install
npx playwright install
```

### 2. إعداد المتغيرات البيئية

```bash
# إضافة إلى .env في جذر المشروع
OPENAI_API_KEY=your_openai_api_key_here
LLM_PROVIDER=openai
DIFF_FROM=HEAD~1
DIFF_TO=HEAD
```

### 3. تكوين الوكيل

عدل `ai_agent_config.json` حسب احتياجاتك:

```json
{
  "agent_mode": "background",
  "autonomy_level": "maximum",
  "parallelism": { "enabled": true, "max_workers": 4 },
  "automation": { 
    "auto_commit_fixes": true, 
    "auto_pr_creation": true 
  }
}
```

## 📖 الاستخدام

### التشغيل المحلي

```bash
# تشغيل المنسق الكامل
node ai-intelligent-orchestrator.mjs

# أو من جذر المشروع
node ai-intelligent-ci/ai-intelligent-orchestrator.mjs
```

### التشغيل مع GitHub Actions

أضف إلى `.github/workflows/intelligent-ci.yml`:

```yaml
name: 🤖 AI Intelligent CI

on:
  push:
    branches: [ main, develop ]
  pull_request:

jobs:
  intelligent-ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 2
      
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd ai-intelligent-ci
          npm install
          npx playwright install
      
      - name: Run Intelligent CI
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
        run: node ai-intelligent-ci/ai-intelligent-orchestrator.mjs
```

### التشغيل مع Cursor Agent

استخدم `cursor.agent.json` الموجود في المجلد:

```bash
# ربط المجلد مع Cursor
cursor --add-folder ai-intelligent-ci
```

## 🔄 سير العمل

```
1. تحليل الفروقات (Diff Analysis)
   ↓
2. تحديد الموديولات المتأثرة
   ↓
3. توليد اختبارات ذكية مستهدفة
   ↓
4. تشغيل الاختبارات
   ↓
5. حلقة الإصلاح الذاتي (إذا فشلت)
   ↓
6. التعلم من النتائج
   ↓
7. إنشاء تقارير شاملة
   ↓
8. تسجيل في قاعدة البيانات
```

## 📊 المخرجات

### التقارير

- `reports/intelligent-ci-report.json` - تقرير JSON كامل
- `reports/intelligent-ci-report.md` - تقرير Markdown
- `diff_map.json` - خريطة الفروقات
- `ai_training_cache.json` - الذاكرة المتعلمة

### السجلات

- `ai_logs.db` - قاعدة بيانات SQLite
- `dashboard/logs.json` - بيانات لوحة التحكم

## 🔧 التخصيص

### تعديل عدد المحاولات

في `ai_agent_config.json`:

```json
{
  "safety_measures": {
    "max_retries_per_test": 6
  }
}
```

### تعديل التوازي

```json
{
  "parallelism": {
    "enabled": true,
    "max_workers": 8
  }
}
```

### تعديل مزود LLM

```bash
# في .env
LLM_PROVIDER=openai  # أو cursor أو ollama
```

## 🧪 الاختبارات

### تشغيل الاختبارات المولدة

```bash
# جميع الاختبارات المولدة
npx playwright test tests/generated/

# اختبار موديول محدد
npx playwright test tests/generated/auth.spec.js
```

### تشغيل اختبارات الانحدار

```bash
npx playwright test tests/regression/
```

## 📈 لوحة المراقبة

### عرض محلي

```bash
# تشغيل سيرفر بسيط
cd dashboard
python3 -m http.server 8080

# أو
npx serve dashboard
```

ثم افتح: `http://localhost:8080`

## 🔐 الأمان

- ✅ النسخ الاحتياطي قبل التعديل
- ✅ الاسترداد التلقائي عند الفشل
- ✅ حدود للتغييرات
- ✅ مراجعة PR مطلوبة

## 🐛 استكشاف الأخطاء

### المشكلة: لا توجد فروقات

```bash
# تأكد من وجود commits
git log --oneline -5

# تعيين النطاق يدوياً
export DIFF_FROM=HEAD~2
export DIFF_TO=HEAD
```

### المشكلة: فشل توليد الاختبارات

```bash
# تحقق من مفتاح OpenAI
echo $OPENAI_API_KEY

# أو استخدم وضع placeholder
LLM_PROVIDER=placeholder node ai-intelligent-orchestrator.mjs
```

### المشكلة: فشل الاختبارات

```bash
# تشغيل مع تفاصيل
npx playwright test --debug

# عرض السجلات
cat reports/intelligent-ci-report.md
```

## 🔗 التكامل مع النظام الرئيسي

### إضافة إلى package.json الرئيسي

```json
{
  "scripts": {
    "ci:intelligent": "node ai-intelligent-ci/ai-intelligent-orchestrator.mjs",
    "ci:diff": "node ai-intelligent-ci/scripts/ai_diff_analyzer.mjs",
    "ci:generate": "node ai-intelligent-ci/scripts/ai_scenario_generator.mjs"
  }
}
```

### الاستخدام

```bash
npm run ci:intelligent
```

## 📚 الموارد

- [Playwright Docs](https://playwright.dev/)
- [OpenAI API](https://platform.openai.com/docs)
- [Cursor Agent Guide](../CURSOR_AGENT_GUIDE.md)

## 🤝 المساهمة

هذا النظام قابل للتخصيص والتوسع. يمكنك:

1. إضافة مولدات اختبارات جديدة
2. تحسين خوارزميات التعلم
3. إضافة دعم لأدوات CI/CD أخرى
4. تحسين لوحة المراقبة

## 📄 الترخيص

MIT License

---

## 🎯 الخطوات السريعة

```bash
# 1. التثبيت
cd ai-intelligent-ci && npm install

# 2. التشغيل
node ai-intelligent-orchestrator.mjs

# 3. عرض النتائج
cat reports/intelligent-ci-report.md

# 4. عرض لوحة التحكم
npx serve dashboard
```

---

*تم إنشاء هذا النظام بواسطة AI Intelligent CI/CD v3.1* 🤖
