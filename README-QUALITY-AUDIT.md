# 🔍 Hybrid Quality Audit System

نظام فحص شامل ومتقدم لجودة المشروع يتكون من 3 طبقات مترابطة:

---

## 🧩 المكونات

### 1️⃣ **Playwright - فحص End-to-End**
- التحقق من عمل جميع الصفحات والتوجيه
- فحص الأزرار والنوافذ المنبثقة
- اختبار استدعاءات API
- تقارير UI مع لقطات شاشة (screenshots + traces)
- دعم وضع headless و headed

### 2️⃣ **Lighthouse - فحص الأداء و SEO**
- قياس سرعة التحميل والكفاءة
- تحسينات SEO
- إمكانية الوصول (Accessibility)
- تقرير HTML مفصل مع تقييمات
  - Performance (الأداء)
  - Accessibility (إمكانية الوصول)
  - Best Practices (أفضل الممارسات)
  - SEO (محركات البحث)

### 3️⃣ **Bundle Analyzer - تحليل حجم المشروع**
- فحص جميع ملفات Next.js (JS, CSS)
- كشف الملفات الثقيلة والثابتة
- مساعدة في تقليل وقت التحميل
- تحسين بنية المشروع

---

## 🚀 الاستخدام

### الطريقة السريعة (الموصى بها)

```bash
npm run audit:quality
```

هذا الأمر سيقوم بـ:
1. ✅ تثبيت جميع المتطلبات تلقائياً
2. 🔨 بناء المشروع
3. 🚀 تشغيل الخادم
4. 🧪 تنفيذ اختبارات Playwright
5. 📊 تشغيل Lighthouse
6. 📦 تحليل حجم الحزم
7. 📝 إنشاء تقرير شامل

### الطريقة اليدوية

```bash
# 1. التأكد من تحديث المشروع
git pull
npm install

# 2. تشغيل السكربت
bash scripts/quality-audit.sh

# أو بتصريح
chmod +x scripts/quality-audit.sh
./scripts/その後audit.sh
```

---

## 📊 التقارير المُنشأة

بعد تشغيل النظام، ستجد التقارير التالية:

```
/reports/
 ├── lighthouse-report.html     # تقرير Lighthouse الكامل
 ├── lighthouse-report.json     # بيانات JSON للتقرير
 ├── lighthouse-report.csv      # بيانات CSV للتقرير
 ├── quality-audit-summary.txt  # ملخص شامل
 └── bundle-analyzer.log        # سجل تحليل الحزم

/playwright-report/
 └── index.html                 # تقرير Playwright الكامل

/.next/analyze/
 └── index.html                 # تحليل حجم الحزم
```

---

## 🎯 فتح التقارير

### تقرير Playwright
```bash
npx playwright show-report
```

### تقرير Lighthouse
```bash
# Linux/Mac
open ./reports/lighthouse-report.html

# Windows
start ./reports/lighthouse-report.html
```

### تحليل Bundle
```bash
# Linux/Mac
open .next/analyze/index.html

# Windows
start .next/analyze/index.html
```

---

## 📈 فهم النتائج

### Playwright
- **Passed**: جميع الاختبارات نجحت ✅
- **Failed**: بعض الاختبارات فشلت ❌
- **Skipped**: اختبارات تم تخطيها ⏭️

### Lighthouse Scores
- **90-100**: ممتاز 🟢
- **50-89**: جيد 🟡
- **0-49**: يحتاج تحسين 🔴

**الفئات:**
- Performance (الأداء): سرعة التحميل والتفاعل
- Accessibility (إمكانية الوصول): سهولة الاستخدام
- Best Practices (أفضل الممارسات): الأمان والجودة
- SEO (محركات البحث): تحسين محركات البحث

### Bundle Analyzer
- **الملفات الكبيرة**: تحقق من إمكانية تقسيمها أو تحسينها
- **الأحجام المثالية**:
  - Individual bundles: < 244KB
  - Total initial load: < 500KB

---

## 🔧 تخصيص النظام

### تكوين Playwright
عدّل `playwright.config.ts` لتغيير:
- المتصفحات المستخدمة
- مهلة الانتظار
- الاتصالات (reporters)

### تكوين Lighthouse
عدّل `lighthouse.config.js` لتغيير:
- المعايير المستخدمة
- الصفحات المستهدفة
- إعدادات الأداء

### تكوين Bundle Analyzer
عدّل `next.config.js` لتغيير:
- تقسيم الحزم (chunk splitting)
- حجم الحزم (bundle size)
- التحسينات

---

## 🛠️ متطلبات النظام

- Node.js 18+ 
- npm أو yarn
- Chrome/Chromium (لـ Lighthouse و Playwright)
- 4GB RAM على الأقل

---

## ⚠️ استكشاف الأخطاء

### المشكلة: السكربت لا يعمل
```bash
# تأكد من الصلاحيات
chmod +x scripts/quality-audit.sh

# تأكد من تثبيت المتطلبات
npm install
```

### المشكلة: Lighthouse يعطي خطأ
```bash
# تأكد من تثبيت Chrome
npx playwright install chromium
```

### المشكلة: البناء فشل
```bash
# نظف المشروع وأعد بناءه
rm -rf .next node_modules
npm install
npm run build
```

---

## 📝 ملاحظات

- ✅ السكربت آمن للتشغيل في CI/CD
- ✅ لا يحتاج تدخل المستخدم
- ✅ يعمل تلقائياً على جميع الأنظمة (Linux, Mac, Windows)
- ✅ يتعامل مع الأخطاء بشكل صحيح
- ✅ يشغل الخادم ويوقفه تلقائياً

---

## 🎉 النتيجة النهائية

بعد تشغيل النظام، ستحصل على:
- 🔹 تقرير Playwright: دقة التنفيذ وسلامة الصفحات
- 🔹 تقرير Lighthouse: السرعة و SEO والأداء
- 🔹 تحليل Bundle: كشف الملفات الثقيلة
- 🔹 نسب نجاح ودرجات شاملة لمستوى جودة المشروع

---

تم البناء بـ ❤️ للجودة المهنية



