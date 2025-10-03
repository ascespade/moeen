# دليل رفع المشروع على GitHub Pages

## 🚀 خطوات النشر على GitHub

### الخطوة 1: إنشاء مستودع على GitHub
1. اذهب إلى [GitHub.com](https://github.com)
2. انقر على "New repository" أو "مستودع جديد"
3. اختر اسم المستودع مثل: `al-hemam-center-proposal`
4. اجعل المستودع **Public** (عام)
5. **لا تضع** علامة على "Add a README file"
6. انقر "Create repository"

### الخطوة 2: ربط المشروع المحلي بـ GitHub
```bash
# في مجلد المشروع
cd /home/ubuntu/moeen/مشروع_مركز_الهمم

# ربط المستودع البعيد (استبدل USERNAME بحسابك)
git remote add origin https://github.com/USERNAME/al-hemam-center-proposal.git

# رفع الملفات
git branch -M main
git push -u origin main
```

### الخطوة 3: تفعيل GitHub Pages
1. اذهب إلى صفحة المستودع على GitHub
2. انقر على "Settings" (الإعدادات)
3. انتقل إلى قسم "Pages" في القائمة الجانبية
4. في "Source" اختر "Deploy from a branch"
5. في "Branch" اختر "main"
6. في "Folder" اختر "/ (root)"
7. انقر "Save"

### الخطوة 4: الوصول للموقع
بعد بضع دقائق، سيكون الموقع متاح على:
```
https://USERNAME.github.io/al-hemam-center-proposal/
```

## 🔗 الروابط المباشرة بعد النشر

### الصفحة الرئيسية:
```
https://USERNAME.github.io/al-hemam-center-proposal/
```

### العرض الشامل:
```
https://USERNAME.github.io/al-hemam-center-proposal/الموقع_الاحترافي/public/index.html
```

### تفاصيل الشات بوت:
```
https://USERNAME.github.io/al-hemam-center-proposal/الموقع_الاحترافي/public/chatbot_details.html
```

### مستند المشروع التقني:
```
https://USERNAME.github.io/al-hemam-center-proposal/الموقع_الاحترافي/public/project_overview.html
```

## 📱 مشاركة الروابط

### للعميل:
```
السلام عليكم،

يسعدني أن أقدم لكم العرض الشامل لمشروع مركز الهمم:

🌐 العرض الرئيسي:
https://USERNAME.github.io/al-hemam-center-proposal/

🤖 تفاصيل الشات بوت الذكي:
https://USERNAME.github.io/al-hemam-center-proposal/الموقع_الاحترافي/public/chatbot_details.html

📋 المستند التقني الشامل:
https://USERNAME.github.io/al-hemam-center-proposal/الموقع_الاحترافي/public/project_overview.html

العرض يتضمن جميع التفاصيل والأسعار والجداول الزمنية.

في انتظار ملاحظاتكم الكريمة.

خالد جمال عبدالناصر
+966581421483
```

## 🔄 تحديث المشروع

عند إجراء تعديلات:
```bash
# إضافة التغييرات
git add .

# إنشاء commit جديد
git commit -m "وصف التحديث"

# رفع التحديثات
git push origin main
```

سيتم تحديث الموقع تلقائياً خلال دقائق.

## ⚠️ ملاحظات مهمة

1. **الأسماء العربية:** GitHub Pages يدعم الأسماء العربية في المجلدات
2. **وقت النشر:** قد يستغرق 5-10 دقائق للظهور أول مرة
3. **التحديثات:** التحديثات تظهر خلال 1-2 دقيقة
4. **الأمان:** المستودع العام يعني أن الجميع يمكنهم رؤية الكود
5. **النطاق المخصص:** يمكن ربط نطاق مخصص لاحقاً

## 🎯 فوائد GitHub Pages

✅ **مجاني تماماً**  
✅ **سريع وموثوق**  
✅ **تحديث تلقائي**  
✅ **شهادة SSL مجانية**  
✅ **إحصائيات مدمجة**  
✅ **نسخ احتياطية تلقائية**  

## 📞 الدعم

إذا واجهت أي مشكلة:
- راجع [دليل GitHub Pages](https://docs.github.com/en/pages)
- تواصل معي على واتساب: +966581421483

---

**نصيحة:** احفظ رابط المستودع ورابط الموقع في مكان آمن للرجوع إليهما لاحقاً.
