# 🤖 دليل Cursor Background Agent مع AI Self-Healing CI/CD v3.0

## نظرة عامة

هذا النظام يدمج **Cursor Background Agent (Pro)** مع نظام **AI Self-Healing CI/CD v3.0** لإنشاء وكيل ذكي يعمل في الخلفية ويقوم بـ:
- فحص الكود تلقائياً
- إصلاح الأخطاء باستخدام LLM
- تشغيل اختبارات شاملة (Playwright + Supawright)
- إنشاء PRs تلقائياً
- مراقبة مستمرة للمشروع

## المتغيرات البيئية المطلوبة

### في GitHub Secrets:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
CURSOR_API_KEY=your_cursor_api_key
```

### في .env المحلي:
```bash
# نسخ من env.example
cp env.example .env
# ثم تعديل القيم
```

## التشغيل

### 1. إعداد البيئة
```bash
npm run setup:env
```

### 2. تشغيل الوكيل
```bash
# وضع تلقائي
npm run agent:auto

# وضع Cursor Background Agent
npm run agent:cursor

# وضع OpenAI
npm run agent:openai

# وضع Ollama محلي
npm run agent:ollama

# وضع الخلفية المستمر
npm run agent:background

# إصلاح شامل
npm run agent:heal
```

### 3. اختبارات منفصلة
```bash
# اختبارات الوحدة
npm run test:unit

# اختبارات التكامل
npm run test:integration

# اختبارات E2E
npm run test:e2e

# اختبارات Playwright
npx playwright test

# اختبارات Supawright
npx supawright test

# جميع الاختبارات
npm run test:full-suite
```

## الملفات الرئيسية

### 1. `cursor.agent.json`
تكوين Cursor Background Agent مع:
- Triggers (on_push, on_schedule, manual)
- Commands (run_ai_agent, run_tests, etc.)
- Environment variables
- Safety settings

### 2. `scripts/ai_self_test_and_fix.mjs`
السكريبت الرئيسي الذي:
- يحلل حالة المشروع
- يصلح الأخطاء باستخدام LLM
- يشغل الاختبارات
- ينشئ التقارير
- يلتزم التغييرات

### 3. `.github/workflows/ai-self-healing.yml`
GitHub Action للـ workflow الرئيسي

### 4. `.github/workflows/ai-call-cursor-agent.yml`
GitHub Action لاستدعاء Cursor Background Agent

## ميزات الأمان

- **نسخ احتياطي**: نسخ الملفات قبل التعديل
- **حدود التغيير**: حد أقصى 50 ملف و 1000 سطر
- **فرع منفصل**: إنشاء `ai-auto-fixes` branch
- **مراجعة PR**: تتطلب موافقة قبل الدمج
- **استرداد**: إمكانية استرداد التغييرات عند الفشل

## التقارير

### 1. تقارير مفصلة
- `reports/ai-report.md` - تقرير كل دورة
- `reports/final_summary.md` - ملخص نهائي
- `logs/ai-agent.log` - سجل مفصل

### 2. نسخ احتياطية
- `reports/backups/` - نسخ احتياطية مع طابع زمني

## استكشاف الأخطاء

### 1. مشاكل البيئة
```bash
# فحص المتغيرات
npm run setup:env

# فحص التبعيات
npm install
npx playwright install --with-deps
```

### 2. مشاكل الاختبارات
```bash
# تشغيل اختبارات منفصلة
npm run test:unit
npm run test:integration
npm run test:e2e
```

### 3. مشاكل LLM
- تأكد من صحة `CURSOR_API_KEY`
- للـ OpenAI: تأكد من `OPENAI_API_KEY`
- للـ Ollama: تأكد من تشغيل الخادم محلياً

## التخصيص

### 1. تعديل عدد الدورات
في `scripts/ai_self_test_and_fix.mjs`:
```javascript
const MAX_CYCLES = 10; // غير هذا الرقم
```

### 2. تعديل مدة الانتظار
```javascript
const CYCLE_DELAY_SECONDS = 5; // غير هذا الرقم
```

### 3. إضافة اختبارات جديدة
في `tests/comprehensive/`:
- `frontend.spec.js` - اختبارات الواجهة
- `api.spec.js` - اختبارات API
- `database.spec.js` - اختبارات قاعدة البيانات

## المراقبة

### 1. GitHub Actions
- مراقبة الـ workflows في GitHub
- فحص الـ artifacts والنتائج

### 2. التقارير المحلية
- فحص `reports/` للملفات
- فحص `logs/` للسجلات

### 3. Cursor Extension
- مراقبة Background Agent من Cursor
- فحص السجلات والنتائج

## الدعم

للحصول على المساعدة:
1. راجع السجلات في `logs/ai-agent.log`
2. فحص التقارير في `reports/`
3. مراجعة GitHub Actions logs
4. فحص Cursor Background Agent logs

---

*تم إنشاء هذا الدليل بواسطة AI Self-Healing CI/CD v3.0*
