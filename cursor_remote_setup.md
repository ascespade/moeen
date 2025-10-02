# إعداد الاتصال البعيد في Cursor IDE
# Remote Connection Setup for Cursor IDE

## 🎯 استخدام الاختصارات مع Cursor

### الطريقة الأولى: SSH Config File
أنشئ ملف SSH config لاستخدامه في Cursor:

```bash
# إنشاء ملف SSH config
mkdir -p ~/.ssh
notepad ~/.ssh/config
```

أضف هذا المحتوى في الملف:

```
# Cursor Development Server
Host cursor-dev
    HostName 100.87.127.117
    User ubuntu
    Port 22
    StrictHostKeyChecking no
    UserKnownHostsFile /dev/null
    # IdentityFile ~/.ssh/your-key.pem  # إذا كان لديك مفتاح SSH

# Amazon EC2 Jump Server  
Host aws-jump
    HostName 100.97.57.53
    User ubuntu
    Port 22
    StrictHostKeyChecking no
    UserKnownHostsFile /dev/null
    # IdentityFile ~/.ssh/your-aws-key.pem
```

### الطريقة الثانية: استخدام الاختصارات المباشرة

#### للاتصال بسيرفر Cursor:
```powershell
# اتصال عادي
.\connect_cursor.ps1

# تشغيل تطبيق Next.js
.\run_app_cursor.ps1 -App nextjs

# فحص حالة السيرفر
.\run_app_cursor.ps1 -Status
```

#### للاتصال بسيرفر Amazon:
```powershell
# اتصال عادي
.\connect_aws.ps1

# تشغيل Nginx
.\run_app_aws.ps1 -App nginx

# فحص حالة السيرفر
.\run_app_aws.ps1 -Status
```

## 🔧 إعداد Cursor IDE للاتصال البعيد

### الخطوة 1: تثبيت Remote SSH Extension
1. افتح Cursor IDE
2. اذهب إلى Extensions (Ctrl+Shift+X)
3. ابحث عن "Remote - SSH"
4. ثبت الإضافة

### الخطوة 2: الاتصال بالسيرفر
1. اضغط `Ctrl+Shift+P`
2. اكتب "Remote-SSH: Connect to Host"
3. اختر أحد الخيارات:
   - `cursor-dev` (للاتصال بسيرفر Cursor)
   - `aws-jump` (للاتصال بسيرفر Amazon)
   - أو أدخل `ubuntu@100.87.127.117` مباشرة

### الخطوة 3: فتح المجلد البعيد
بعد الاتصال:
1. اختر "Open Folder"
2. اختر مجلد المشروع على السيرفر (مثل `/var/www/html`)

## 📋 أوامر سريعة للاستخدام

### اختبار الاتصال قبل استخدام Cursor:
```powershell
# اختبار سريع لجميع الاتصالات
.\quick_connect.bat test

# اختبار سيرفر Cursor فقط
.\connect_cursor.ps1 -Test

# اختبار سيرفر Amazon فقط
.\connect_aws.ps1 -Test
```

### تشغيل التطبيقات قبل التطوير:
```powershell
# تشغيل Next.js على سيرفر Cursor
.\run_app_cursor.ps1 -App nextjs

# تشغيل خادم الويب على Amazon
.\run_app_aws.ps1 -App nginx
```

## 🌐 استخدام Connection Strings في Cursor

بدلاً من كتابة connection string طويل، استخدم:

### الطريقة القديمة (معقدة):
```
ssh://ubuntu@100.87.127.117:22
```

### الطريقة الجديدة (بسيطة):
```
cursor-dev
```
أو
```
aws-jump
```

## 💡 نصائح للاستخدام الأمثل

### 1. إعداد مفاتيح SSH (موصى به):
```powershell
# إنشاء مفتاح SSH جديد
ssh-keygen -t ed25519 -C "your-email@example.com"

# نسخ المفتاح للسيرفر
ssh-copy-id -i ~/.ssh/id_ed25519.pub ubuntu@100.87.127.117
```

### 2. استخدام Port Forwarding:
```powershell
# إعادة توجيه منفذ Next.js محلياً
ssh -L 3000:localhost:3000 cursor-dev

# إعادة توجيه منفذ الويب من Amazon
ssh -L 8080:localhost:80 aws-jump
```

### 3. تشغيل عدة تطبيقات:
```powershell
# تشغيل Next.js على Cursor
.\run_app_cursor.ps1 -App nextjs -Background

# تشغيل API server
.\run_app_cursor.ps1 -App "cd /var/www/api && npm start" -Port 5000 -Background
```

## 🔍 استكشاف الأخطاء

### مشكلة: فشل الاتصال
```powershell
# فحص الاتصال
ping 100.87.127.117

# اختبار SSH
.\connect_cursor.ps1 -Test
```

### مشكلة: رفض المصادقة
```powershell
# استخدام مفتاح SSH محدد
.\connect_cursor.ps1 -KeyFile "C:\path\to\your\key.pem"
```

### مشكلة: المنفذ غير متاح
```powershell
# فحص حالة التطبيقات
.\run_app_cursor.ps1 -Status

# إعادة تشغيل التطبيق
.\run_app_cursor.ps1 -Stop -App nextjs
.\run_app_cursor.ps1 -App nextjs
```

## 📚 أمثلة عملية

### سيناريو 1: تطوير Next.js
```powershell
# 1. اختبار الاتصال
.\connect_cursor.ps1 -Test

# 2. تشغيل Next.js
.\run_app_cursor.ps1 -App nextjs

# 3. فتح Cursor والاتصال بـ cursor-dev
# 4. فتح مجلد /var/www/html
# 5. بدء التطوير!
```

### سيناريو 2: إعداد خادم ويب
```powershell
# 1. اختبار اتصال Amazon
.\connect_aws.ps1 -Test

# 2. تشغيل Nginx
.\run_app_aws.ps1 -App nginx

# 3. فتح الموقع في المتصفح
.\connect_aws.ps1 -Web
```

### سيناريو 3: تطوير متعدد السيرفرات
```powershell
# تشغيل Backend على Cursor
.\run_app_cursor.ps1 -App "cd /var/www/backend && npm start" -Port 5000

# تشغيل Frontend على Amazon  
.\run_app_aws.ps1 -App "cd /var/www/frontend && npm start" -Port 3000

# الآن يمكنك التطوير على كلا السيرفرين من Cursor
```
