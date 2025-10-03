# 🚀 دليل الاتصال بالسيرفرات من Cursor IDE

## ✅ تم الإعداد بنجاح!

تم إنشاء اختصارات للاتصال بسيرفراتك بدلاً من استخدام connection strings معقدة.

## 🔧 الاختصارات المتاحة

### بدلاً من كتابة:
```
ssh://ubuntu@100.87.127.117:22
ssh://ubuntu@100.97.57.53:22
```

### الآن يمكنك استخدام:
```
cursor-dev    # للاتصال بسيرفر Cursor
aws-jump      # للاتصال بسيرفر Amazon
```

## 📋 كيفية الاستخدام في Cursor IDE

### الطريقة 1: Remote SSH Extension
1. **افتح Cursor IDE**
2. **ثبت Remote-SSH extension** (إذا لم يكن مثبتاً)
3. **اضغط `Ctrl+Shift+P`**
4. **اكتب:** `Remote-SSH: Connect to Host`
5. **اختر أحد الخيارات:**
   - `cursor-dev` ← للتطوير على سيرفر Cursor
   - `aws-jump` ← للعمل على سيرفر Amazon

### الطريقة 2: استخدام الاختصارات المباشرة

#### للاتصال بسيرفر Cursor:
```powershell
# اتصال عادي
.\connect_cursor.ps1

# تشغيل Next.js مباشرة
.\run_app_cursor.ps1 -App nextjs

# فحص حالة السيرفر
.\run_app_cursor.ps1 -Status
```

#### للاتصال بسيرفر Amazon:
```powershell
# اتصال عادي  
.\connect_aws.ps1

# تشغيل خادم الويب
.\run_app_aws.ps1 -App nginx

# فتح الموقع في المتصفح
.\connect_aws.ps1 -Web
```

## 🎯 سيناريوهات الاستخدام

### سيناريو 1: تطوير Next.js على Cursor
```powershell
# 1. تشغيل Next.js على السيرفر
.\run_app_cursor.ps1 -App nextjs

# 2. فتح Cursor IDE
# 3. Ctrl+Shift+P -> Remote-SSH: Connect to Host
# 4. اختيار cursor-dev
# 5. فتح مجلد /var/www/html
# 6. بدء التطوير!
```

### سيناريو 2: إدارة خادم الويب
```powershell
# 1. تشغيل Nginx على Amazon
.\run_app_aws.ps1 -App nginx

# 2. فتح Cursor IDE
# 3. الاتصال بـ aws-jump
# 4. إدارة ملفات الموقع
```

### سيناريو 3: تطوير Full-Stack
```powershell
# Backend على Cursor
.\run_app_cursor.ps1 -App "cd /var/www/backend && npm start" -Port 5000

# Frontend على Amazon
.\run_app_aws.ps1 -App "cd /var/www/frontend && npm start" -Port 3000

# الآن يمكنك التطوير على كلا السيرفرين من Cursor
```

## 🔑 إعداد المصادقة (مطلوب للاتصال الفعلي)

### الخيار 1: استخدام مفتاح SSH (موصى به)
```powershell
# إنشاء مفتاح SSH
ssh-keygen -t ed25519 -C "your-email@example.com"

# نسخ المفتاح للسيرفرات
ssh-copy-id -i ~/.ssh/id_ed25519.pub ubuntu@100.87.127.117
ssh-copy-id -i ~/.ssh/id_ed25519.pub ubuntu@100.97.57.53
```

### الخيار 2: استخدام مفتاح موجود
```powershell
# إذا كان لديك مفتاح .pem
.\connect_cursor.ps1 -KeyFile "C:\path\to\your\key.pem"
.\connect_aws.ps1 -KeyFile "C:\path\to\your\aws\key.pem"
```

### الخيار 3: تحديث SSH Config
عدّل الملف `~/.ssh/config` وأضف مسار المفتاح:
```
Host cursor-dev
    HostName 100.87.127.117
    User ubuntu
    IdentityFile ~/.ssh/your-cursor-key.pem

Host aws-jump
    HostName 100.97.57.53
    User ubuntu  
    IdentityFile ~/.ssh/your-aws-key.pem
```

## 🛠️ أوامر الاختبار والصيانة

### اختبار الاتصالات:
```powershell
# اختبار شامل
.\quick_connect.bat test

# اختبار سيرفر محدد
.\connect_cursor.ps1 -Test
.\connect_aws.ps1 -Test

# اختبار SSH المتقدم
.\test_ssh_connections.ps1 -Detailed -Interactive
```

### إدارة التطبيقات:
```powershell
# عرض التطبيقات المتاحة
.\run_app_cursor.ps1 -List
.\run_app_aws.ps1 -List

# فحص حالة التطبيقات
.\run_app_cursor.ps1 -Status
.\run_app_aws.ps1 -Status

# إيقاف تطبيق
.\run_app_cursor.ps1 -Stop -App nextjs
```

## 📊 ملخص الملفات المُنشأة

| الملف | الوظيفة |
|-------|---------|
| `connect_cursor.ps1` | اتصال بسيط بسيرفر Cursor |
| `connect_aws.ps1` | اتصال بسيط بسيرفر Amazon |
| `run_app_cursor.ps1` | تشغيل التطبيقات على Cursor |
| `run_app_aws.ps1` | تشغيل التطبيقات على Amazon |
| `quick_connect.bat` | اختصارات سريعة لجميع العمليات |
| `setup_cursor_ssh.ps1` | إعداد SSH config للـ IDE |
| `test_ssh_connections.ps1` | اختبار شامل للاتصالات |
| `~/.ssh/config` | إعدادات SSH للاختصارات |

## 🎉 الخلاصة

**بدلاً من:**
```
Remote-SSH: Connect to Host -> ubuntu@100.87.127.117
```

**الآن:**
```
Remote-SSH: Connect to Host -> cursor-dev
```

**أو استخدم الاختصارات المباشرة:**
```powershell
.\connect_cursor.ps1    # اتصال فوري
.\run_app_cursor.ps1 -App nextjs    # تشغيل + اتصال
```

🚀 **استمتع بالتطوير السريع والسهل!**
