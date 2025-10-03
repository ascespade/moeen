# 🚀 اختبار Live Preview على مشروع مركز الهمم

## ✅ المشروع يعمل بنجاح!

### 🌐 **المشروع الرئيسي**:
- **الرابط**: http://localhost:3000
- **التقنيات**: Next.js, React, TypeScript, Tailwind CSS
- **الحالة**: يعمل بنجاح ✅

### 🎯 **كيفية اختبار Live Preview**:

#### **الطريقة الأولى: اختبار الملفات الثابتة**

1. **افتح الملف التجريبي**:
   ```bash
   cursor /home/ubuntu/moeen/live-preview-test.html
   ```

2. **تشغيل Live Preview**:
   - اضغط `Ctrl+Shift+P`
   - اكتب "Open Live Preview"
   - ستظهر نافذة split view مع الـ preview

3. **تجربة التعديل**:
   - عدّل أي شيء في الملف
   - احفظ الملف (`Ctrl+S`)
   - ستشاهد التغييرات فوراً في الـ preview

#### **الطريقة الثانية: اختبار Web Live Preview**

1. **فتح المشروع**:
   ```bash
   cursor /home/ubuntu/moeen
   ```

2. **تشغيل Web Live Preview**:
   - اضغط `Ctrl+Shift+P`
   - اكتب "Open Web Live Preview"
   - ستظهر واجهة إدارة المشاريع

3. **بدء المشروع**:
   - اضغط "Start Next.js" أو "Start Detected Framework"
   - انتظر حتى يبدأ الخادم
   - ستظهر نافذة split view مع الـ preview

## 🎮 **الأوامر المتاحة**:

### **Live Preview (الملفات الثابتة)**:
- `Ctrl+Shift+P` → "Open Live Preview"
- `Ctrl+Shift+P` → "Toggle Live Preview"
- `Ctrl+Shift+P` → "Refresh Preview"

### **Web Live Preview (مشاريع الويب)**:
- `Ctrl+Shift+P` → "Open Web Live Preview"
- `Ctrl+Shift+P` → "Toggle Web Live Preview"
- `Ctrl+Shift+P` → "Start Web Project"
- `Ctrl+Shift+P` → "Stop Web Project"

## 🔧 **إعدادات الـ Extension**:

1. اضغط `Ctrl+,` (الإعدادات)
2. ابحث عن "Live Preview"
3. اضبط الإعدادات:
   - **Auto Refresh**: `true`
   - **Port**: `3000`
   - **Hot Reload**: `true`

## 🎨 **واجهة المستخدم**:

### **Live Preview (الملفات الثابتة)**:
- **Sidebar**: معلومات الملف + أزرار التحكم
- **Preview Area**: عرض مباشر للملف
- **Controls**: Refresh, Fullscreen, Dev Tools

### **Web Live Preview (مشاريع الويب)**:
- **Project Management**: إدارة المشاريع
- **Available Frameworks**: المنصات المتاحة
- **Active Projects**: المشاريع النشطة
- **Preview Area**: عرض مباشر للمشروع

## 🚀 **أمثلة عملية**:

### **مثال 1: اختبار HTML بسيط**
```bash
# 1. افتح الملف
cursor /home/ubuntu/moeen/live-preview-test.html

# 2. اضغط Ctrl+Shift+P
# 3. اكتب "Open Live Preview"
# 4. ستظهر نافذة split view مع الـ preview
# 5. عدّل الملف وستشاهد التغييرات فوراً
```

### **مثال 2: اختبار Next.js**
```bash
# 1. افتح المشروع
cursor /home/ubuntu/moeen

# 2. اضغط Ctrl+Shift+P
# 3. اكتب "Open Web Live Preview"
# 4. اضغط "Start Next.js"
# 5. انتظر حتى يبدأ الخادم
# 6. ستظهر نافذة split view مع الـ preview
```

## 🎯 **نصائح للاستخدام**:

1. **ابدأ بالملفات البسيطة**: جرب `live-preview-test.html` أولاً
2. **استخدم Auto Detection**: للكشف التلقائي للـ framework
3. **تحقق من التبعيات**: تأكد من `npm install`
4. **استخدم Fullscreen**: للعرض الكامل
5. **راقب الـ Console**: للأخطاء والتحذيرات

## 🔍 **استكشاف الأخطاء**:

### **المشكلة: لا يظهر الأمر في Ctrl+Shift+P**
**الحل**:
1. أعد تشغيل Cursor
2. تأكد من تثبيت الـ extension
3. تحقق من وجود الملفات في `/home/ubuntu/cursor-live-preview-extension/`

### **المشكلة: فشل في بدء المشروع**
**الحل**:
1. تأكد من تشغيل خادم التطوير (`npm run dev`)
2. تحقق من وجود `package.json`
3. تأكد من الأوامر في `package.json`

### **المشكلة: لا يظهر الـ preview**
**الحل**:
1. تأكد من تشغيل خادم التطوير
2. تحقق من المنفذ (port 3000)
3. تأكد من وجود ملف `index.html` أو `package.json`

## 🎉 **المميزات المتاحة**:

### **Live Preview (الملفات الثابتة)**:
- ✅ HTML, CSS, JS
- ✅ Live Reload
- ✅ Fullscreen Mode
- ✅ Dev Tools
- ✅ Auto Refresh

### **Web Live Preview (مشاريع الويب)**:
- ✅ Next.js, React, Vue, SvelteKit
- ✅ Auto Detection
- ✅ Project Management
- ✅ Hot Reload
- ✅ Dev Server Integration
- ✅ Create Projects
- ✅ Install Dependencies

## 📞 **الدعم**:

إذا واجهت مشاكل:
1. تحقق من الـ Console في Cursor
2. تأكد من تثبيت الـ extension
3. أعد تشغيل Cursor
4. تحقق من وجود الملفات

---

**استمتع بتجربة Cursor Live Preview على مشروع مركز الهمم! 🎉**
