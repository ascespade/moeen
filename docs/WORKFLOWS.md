# 🤖 GitHub Actions Workflows Documentation

This document provides comprehensive documentation for all GitHub Actions workflows in this repository.

**Generated on:** 10/18/2025, 3:08:37 PM

## 📊 Summary

- **Total Workflows:** 4
- **Total Jobs:** 15
- **Total Steps:** 86

## 📋 Workflow List

1. [🤖 AI via Cursor Background Agent](#-ai-via-cursor-background-agent) - `.github/workflows/ai-call-cursor-agent.yml`
2. [🤖 AI Self-Healing CI/CD v3.0](#-ai-self-healing-ci-cd-v3-0) - `.github/workflows/ai-self-healing.yml`
3. [📊 Update Dashboard](#-update-dashboard) - `.github/workflows/update-dashboard.yml`
4. [🧪 Workflow Testing & Validation](#-workflow-testing-validation) - `.github/workflows/workflow-testing.yml`

---

# 🤖 AI via Cursor Background Agent

**File:** `.github/workflows/ai-call-cursor-agent.yml`

**Description:** No description available

## 🚀 Triggers

- **push:** `{"branches":["main","develop"]}`
- **pull_request:** `{"branches":["main","develop"]}`
- **schedule:** `[{"cron":"0 */6 * * *"}]`
- **workflow_dispatch:** `{"inputs":{"mode":{"description":"وضع التشغيل","required":true,"default":"auto","type":"choice","options":["auto","fix-only","test-only","optimize-only","refactor","background","monitor","heal"]}}}`

## 🌍 Environment Variables

- **NODE_VERSION:** `20`
- **NPM_VERSION:** `10`
- **CI:** `true`

## 🔒 Permissions

- **contents:** `read`
- **actions:** `read`
- **checks:** `write`
- **statuses:** `write`
- **NODE_VERSION:** `20`
- **NPM_VERSION:** `8`

## 📋 Jobs

### 🤖 استدعاء Cursor Background Agent

- **Runs on:** `ubuntu-latest`
- **Needs:** None
- **Condition:** `always`
- **Timeout:** Default (6 hours)
- **Steps:** 7

#### Steps

1. **📥 تحميل الكود**
   - Uses: `actions/checkout@v4`

2. **📦 إعداد Node.js**
   - Uses: `actions/setup-node@v4`

3. **📥 تثبيت التبعيات**
   - Run: `npm ci...`

4. **🤖 استدعاء Cursor Background Agent API**
   - Run: `echo "🤖 استدعاء Cursor Background Agent..."...`

5. **📊 حفظ النتائج**
   - Uses: `actions/upload-artifact@v4`
   - Condition: `always()`

6. **📊 إنشاء التقرير**
   - Run: `echo "📊 إنشاء تقرير Cursor Agent..."...`

7. **📧 إرسال التنبيهات**
   - Run: `echo "📧 إرسال تنبيهات الفشل..."...`
   - Condition: `failure()`

---

# 🤖 AI Self-Healing CI/CD v3.0

**File:** `.github/workflows/ai-self-healing.yml`

**Description:** No description available

## 🚀 Triggers

- **push:** `{"branches":["main","develop"]}`
- **pull_request:** `{"branches":["main","develop"]}`
- **schedule:** `[{"cron":"0 */4 * * *"}]`
- **workflow_dispatch:** `{"inputs":{"mode":{"description":"وضع التشغيل","required":true,"default":"auto","type":"choice","options":["auto","fix-only","test-only","optimize-only","refactor","background","monitor","heal"]}}}`

## 🌍 Environment Variables

- **NODE_VERSION:** `20`
- **NPM_VERSION:** `10`
- **CI:** `true`
- **NODE_ENV:** `production`

## 🔒 Permissions

- **contents:** `write`
- **pull-requests:** `write`
- **issues:** `write`
- **checks:** `write`
- **statuses:** `write`

## 📋 Jobs

### 🔍 تحليل الكود

- **Runs on:** `ubuntu-latest`
- **Needs:** None
- **Condition:** `always`
- **Timeout:** Default (6 hours)
- **Steps:** 7

#### Steps

1. **📥 تحميل الكود**
   - Uses: `actions/checkout@v4`

2. **📦 إعداد Node.js**
   - Uses: `actions/setup-node@v4`

3. **📥 تثبيت التبعيات**
   - Run: `echo "📦 Installing dependencies..."...`

4. **🔍 فحص ESLint**
   - Run: `echo "🔍 فحص ESLint..."...`

5. **🔍 فحص TypeScript**
   - Run: `echo "🔍 فحص TypeScript..."...`

6. **🔍 فحص الأمان**
   - Run: `echo "🔍 فحص الأمان..."...`

7. **📊 تحليل الجودة**
   - Run: `echo "📊 تحليل جودة الكود..."...`

### 🧪 الاختبارات

- **Runs on:** `ubuntu-latest`
- **Needs:** None
- **Condition:** `always`
- **Timeout:** Default (6 hours)
- **Steps:** 9

#### Steps

1. **📥 تحميل الكود**
   - Uses: `actions/checkout@v4`

2. **📦 إعداد Node.js**
   - Uses: `actions/setup-node@v4`

3. **📥 تثبيت التبعيات**
   - Run: `npm ci`

4. **🧪 تشغيل اختبارات الوحدة**
   - Run: `echo "🧪 تشغيل اختبارات الوحدة..."...`
   - Condition: `matrix.test-type == 'unit'`

5. **🧪 تشغيل اختبارات التكامل**
   - Run: `echo "🧪 تشغيل اختبارات التكامل..."...`
   - Condition: `matrix.test-type == 'integration'`

6. **🧪 تشغيل اختبارات E2E**
   - Run: `echo "🧪 تشغيل اختبارات E2E..."...`
   - Condition: `matrix.test-type == 'e2e'`

7. **🎭 تشغيل اختبارات Playwright**
   - Run: `echo "🎭 تشغيل اختبارات Playwright..."...`
   - Condition: `matrix.test-type == 'e2e'`

8. **🔍 تشغيل اختبارات Supawright**
   - Run: `echo "🔍 تشغيل اختبارات Supawright..."...`
   - Condition: `matrix.test-type == 'e2e'`

9. **📊 فحص التغطية**
   - Run: `echo "📊 فحص تغطية الاختبارات..."...`

### 🤖 الـ Agent الذكي

- **Runs on:** `ubuntu-latest`
- **Needs:** `code-analysis`, `testing`
- **Condition:** `always()`
- **Timeout:** Default (6 hours)
- **Steps:** 10

#### Steps

1. **📥 تحميل الكود**
   - Uses: `actions/checkout@v4`

2. **📦 إعداد Node.js**
   - Uses: `actions/setup-node@v4`

3. **📥 تثبيت التبعيات**
   - Run: `npm ci...`

4. **🤖 تشغيل الـ Agent**
   - Run: `echo "🤖 تشغيل Smart Bootloader Agent..."...`

5. **🤖 تفعيل الباكجراوند ايجنت**
   - Run: `echo "🤖 تفعيل الباكجراوند ايجنت..."...`

6. **🔄 حلقة الإصلاح المستمرة**
   - Run: `echo "🔄 بدء حلقة الإصلاح المستمرة..."...`

7. **🧪 إنشاء اختبارات شاملة**
   - Run: `echo "🧪 إنشاء اختبارات شاملة ومفصلة..."...`

8. **📊 تحديث التقارير**
   - Run: `echo "📊 تحديث التقارير..."...`

9. **📁 إعداد مجلدات النتائج**
   - Run: `echo "📁 إعداد مجلدات النتائج..."...`

10. **💾 حفظ النتائج**
   - Uses: `actions/upload-artifact@v4`
   - Condition: `always()`

### 🔧 الإصلاح التلقائي

- **Runs on:** `ubuntu-latest`
- **Needs:** None
- **Condition:** `failure() && github.event_name == 'push'`
- **Timeout:** Default (6 hours)
- **Steps:** 7

#### Steps

1. **📥 تحميل الكود**
   - Uses: `actions/checkout@v4`

2. **📦 إعداد Node.js**
   - Uses: `actions/setup-node@v4`

3. **📥 تثبيت التبعيات**
   - Run: `npm ci...`

4. **🔧 إصلاح ESLint**
   - Run: `echo "🔧 إصلاح ESLint errors..."...`

5. **🔧 إصلاح TypeScript**
   - Run: `echo "🔧 إصلاح TypeScript errors..."...`

6. **🔧 إصلاح الأمان**
   - Run: `echo "🔧 إصلاح security issues..."...`

7. **📝 إنشاء commit للإصلاحات**
   - Run: `git config --local user.email "action@github.com"...`

### 📊 تقرير النتائج

- **Runs on:** `ubuntu-latest`
- **Needs:** `code-analysis`, `testing`, `smart-agent`, `auto-fix`
- **Condition:** `always()`
- **Timeout:** Default (6 hours)
- **Steps:** 4

#### Steps

1. **📥 تحميل النتائج**
   - Uses: `actions/download-artifact@v4`
   - Condition: `needs.smart-agent.result == 'success'`

2. **📥 إنشاء مجلد النتائج البديل**
   - Run: `echo "📁 إنشاء مجلد النتائج البديل..."...`
   - Condition: `needs.smart-agent.result != 'success'`

3. **📊 إنشاء التقرير**
   - Run: `echo "📊 إنشاء تقرير النتائج..."...`

4. **📧 إرسال التنبيهات**
   - Run: `echo "📧 إرسال تنبيهات الفشل..."...`
   - Condition: `failure()`

### 🚀 النشر التلقائي

- **Runs on:** `ubuntu-latest`
- **Needs:** `code-analysis`, `testing`, `smart-agent`
- **Condition:** `success() && github.ref == 'refs/heads/main'`
- **Timeout:** Default (6 hours)
- **Steps:** 6

#### Steps

1. **📥 تحميل الكود**
   - Uses: `actions/checkout@v4`

2. **📦 إعداد Node.js**
   - Uses: `actions/setup-node@v4`

3. **📥 تثبيت التبعيات**
   - Run: `npm ci...`

4. **🏗️ بناء المشروع**
   - Run: `npm run build`

5. **🚀 النشر**
   - Run: `echo "🚀 نشر المشروع..."...`

6. **📊 تحديث الإحصائيات**
   - Run: `echo "📊 تحديث الإحصائيات..."...`

### 🧹 تنظيف

- **Runs on:** `ubuntu-latest`
- **Needs:** `report`, `deploy`
- **Condition:** `always()`
- **Timeout:** Default (6 hours)
- **Steps:** 2

#### Steps

1. **🧹 تنظيف الملفات المؤقتة**
   - Run: `echo "🧹 تنظيف الملفات المؤقتة..."...`

2. **📊 تحديث السجلات**
   - Run: `echo "📊 تحديث سجلات النظام..."...`

---

# 📊 Update Dashboard

**File:** `.github/workflows/update-dashboard.yml`

**Description:** No description available

## 🚀 Triggers

- **workflow_run:** `{"workflows":["🤖 AI Self-Healing CI/CD v3.0"],"types":["completed"]}`
- **workflow_dispatch:** `null`

## 🔒 Permissions

- **contents:** `write`
- **pages:** `write`
- **id-token:** `write`

## 📋 Jobs

### 📊 تحديث لوحة التحكم

- **Runs on:** `ubuntu-latest`
- **Needs:** None
- **Condition:** `always`
- **Timeout:** Default (6 hours)
- **Steps:** 7

#### Steps

1. **📥 تحميل الكود**
   - Uses: `actions/checkout@v4`

2. **📦 إعداد Node.js**
   - Uses: `actions/setup-node@v4`

3. **📥 تثبيت التبعيات**
   - Run: `npm install...`

4. **📊 تصدير السجلات إلى JSON**
   - Run: `echo "📊 تصدير السجلات من SQLite إلى JSON..."...`

5. **📁 إعداد مجلد gh-pages**
   - Run: `echo "📁 إعداد مجلد gh-pages..."...`

6. **💾 حفظ التغييرات**
   - Run: `echo "💾 حفظ التغييرات..."...`

7. **📊 إنشاء تقرير**
   - Run: `echo "📊 إنشاء تقرير التحديث..."...`

### 🚀 نشر GitHub Pages

- **Runs on:** `ubuntu-latest`
- **Needs:** None
- **Condition:** `always`
- **Timeout:** Default (6 hours)
- **Steps:** 3

#### Steps

1. **📥 تحميل الكود من gh-pages**
   - Uses: `actions/checkout@v4`

2. **🚀 نشر إلى GitHub Pages**
   - Uses: `peaceiris/actions-gh-pages@v3`

3. **📊 تقرير النشر**
   - Run: `echo "## 🚀 GitHub Pages Deployment" >> $GITHUB_STEP_SUMMARY...`

---

# 🧪 Workflow Testing & Validation

**File:** `.github/workflows/workflow-testing.yml`

**Description:** No description available

## 🚀 Triggers

- **workflow_dispatch:** `{"inputs":{"test-type":{"description":"نوع الاختبار","required":true,"default":"all","type":"choice","options":["all","syntax","execution","performance","security"]}}}`
- **schedule:** `[{"cron":"0 2 * * 0"}]`

## 🌍 Environment Variables

- **NODE_VERSION:** `20`
- **NPM_VERSION:** `10`
- **CI:** `true`

## 🔒 Permissions

- **contents:** `read`
- **actions:** `read`
- **checks:** `write`
- **statuses:** `write`

## 📋 Jobs

### 🔍 فحص صحة Workflows

- **Runs on:** `ubuntu-latest`
- **Needs:** None
- **Condition:** `always`
- **Timeout:** Default (6 hours)
- **Steps:** 6

#### Steps

1. **📥 تحميل الكود**
   - Uses: `actions/checkout@v4`

2. **📦 إعداد Node.js**
   - Uses: `actions/setup-node@v4`

3. **📥 تثبيت التبعيات**
   - Run: `npm ci...`

4. **🔍 فحص صحة YAML**
   - Run: `echo "🔍 فحص صحة ملفات YAML..."...`

5. **🧪 تشغيل Workflow Validator**
   - Run: `echo "🧪 تشغيل Workflow Validator..."...`

6. **📊 تقرير النتائج**
   - Run: `echo "## 🔍 Workflow Syntax Validation" >> $GITHUB_STEP_SUMMARY...`

### 🚀 اختبار تنفيذ Workflows

- **Runs on:** `ubuntu-latest`
- **Needs:** None
- **Condition:** `github.event.inputs.test-type == 'all' || github.event.inputs.test-type == 'execution'`
- **Timeout:** Default (6 hours)
- **Steps:** 5

#### Steps

1. **📥 تحميل الكود**
   - Uses: `actions/checkout@v4`

2. **📦 إعداد Node.js**
   - Uses: `actions/setup-node@v4`

3. **📥 تثبيت التبعيات**
   - Run: `npm ci...`

4. **🧪 محاكاة تنفيذ Workflow**
   - Run: `echo "🧪 محاكاة تنفيذ ${{ matrix.workflow }}..."...`

5. **📊 تقرير النتائج**
   - Run: `echo "## 🚀 Workflow Execution Test - ${{ matrix.workflow }}" >> $GITHUB_STEP_SUMMARY...`

### ⚡ اختبار الأداء

- **Runs on:** `ubuntu-latest`
- **Needs:** None
- **Condition:** `github.event.inputs.test-type == 'all' || github.event.inputs.test-type == 'performance'`
- **Timeout:** Default (6 hours)
- **Steps:** 7

#### Steps

1. **📥 تحميل الكود**
   - Uses: `actions/checkout@v4`

2. **📦 إعداد Node.js**
   - Uses: `actions/setup-node@v4`

3. **📥 تثبيت التبعيات**
   - Run: `npm ci...`

4. **⚡ قياس أداء التثبيت**
   - Run: `echo "⚡ قياس أداء تثبيت التبعيات..."...`

5. **⚡ قياس أداء البناء**
   - Run: `echo "⚡ قياس أداء بناء المشروع..."...`

6. **⚡ قياس أداء الاختبارات**
   - Run: `echo "⚡ قياس أداء الاختبارات..."...`

7. **📊 تحليل الأداء**
   - Run: `echo "## ⚡ Performance Analysis" >> $GITHUB_STEP_SUMMARY...`

### 🔒 اختبار الأمان

- **Runs on:** `ubuntu-latest`
- **Needs:** None
- **Condition:** `github.event.inputs.test-type == 'all' || github.event.inputs.test-type == 'security'`
- **Timeout:** Default (6 hours)
- **Steps:** 5

#### Steps

1. **📥 تحميل الكود**
   - Uses: `actions/checkout@v4`

2. **📦 إعداد Node.js**
   - Uses: `actions/setup-node@v4`

3. **🔒 فحص أمان التبعيات**
   - Run: `echo "🔒 فحص أمان التبعيات..."...`

4. **🔒 فحص أمان Workflows**
   - Run: `echo "🔒 فحص أمان Workflows..."...`

5. **📊 تقرير الأمان**
   - Run: `echo "## 🔒 Security Analysis" >> $GITHUB_STEP_SUMMARY...`

### 📊 تقرير شامل

- **Runs on:** `ubuntu-latest`
- **Needs:** `validate-syntax`, `test-execution`, `test-performance`, `test-security`
- **Condition:** `always()`
- **Timeout:** Default (6 hours)
- **Steps:** 1

#### Steps

1. **📊 إنشاء التقرير الشامل**
   - Run: `echo "## 🧪 Workflow Testing & Validation Report" >> $GITHUB_STEP_SUMMARY...`

---

## 🏆 Best Practices

### ✅ Do's
- Use explicit permissions for security
- Set appropriate timeouts for jobs
- Use caching for dependencies
- Add error handling with `continue-on-error`
- Use latest action versions
- Add meaningful step names
- Use matrix strategies for parallel jobs
- Clean up artifacts and temporary files

### ❌ Don'ts
- Don't use deprecated runners (ubuntu-18.04)
- Don't hardcode secrets in workflows
- Don't skip error handling
- Don't use outdated Node.js versions
- Don't create jobs without timeouts
- Don't ignore security warnings

## 🔧 Troubleshooting

### Common Issues

1. **Artifact not found errors**
   - Check if the artifact was uploaded successfully
   - Verify artifact names match exactly
   - Ensure jobs run in correct order

2. **Permission denied errors**
   - Add explicit permissions to workflow
   - Check if GITHUB_TOKEN has required permissions

3. **Timeout errors**
   - Add `timeout-minutes` to jobs
   - Optimize long-running steps
   - Use caching to speed up builds

4. **Dependency installation failures**
   - Use `npm ci` instead of `npm install`
   - Add caching for node_modules
   - Check package-lock.json is committed

