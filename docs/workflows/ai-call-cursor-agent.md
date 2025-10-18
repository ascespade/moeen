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
