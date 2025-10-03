# 🔧 حل مشكلة SSH مع cursor-dev في Cursor IDE

## 🚨 المشكلة الحالية

```
Permission denied (publickey)
```

**السبب:** سيرفر cursor (100.87.127.117) يتطلب مفتاح SSH للمصادقة ولا يقبل كلمات المرور.

## ✅ الحلول المتاحة

### الحل 1: استخدام مفتاح SSH موجود (الأسرع)

إذا كان لديك مفتاح SSH يعمل مع السيرفر:

```powershell
# تحديث SSH config لاستخدام المفتاح
.\fix_cursor_ssh.ps1 -KeyFile "مسار\المفتاح\الخاص\بك.pem"
```

### الحل 2: إنشاء مفتاح SSH جديد

```powershell
# إنشاء مفتاح جديد
.\fix_cursor_ssh.ps1 -CreateKey

# ثم نسخ المفتاح العام للسيرفر (ستحتاج الوصول للسيرفر)
```

### الحل 3: استخدام اتصال مؤقت (للاختبار)

إذا كان لديك وصول للسيرفر بطريقة أخرى، يمكنك إعداد المفتاح:

```bash
# على السيرفر، أضف مفتاحك العام إلى:
echo "your-public-key-here" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

## 🛠️ الحل العملي الفوري

بما أن السيرفر يتطلب مفتاح SSH، إليك أسهل طريقة:

### الخطوة 1: تحقق من المفاتيح الموجودة
```powershell
# عرض المفاتيح المتاحة
ls C:\Users\ASCE\.ssh\*.pem
ls C:\Users\ASCE\.ssh\id_*
```

### الخطوة 2: جرب المفاتيح الموجودة
```powershell
# جرب مفتاح EC2 الموجود
.\fix_cursor_ssh.ps1 -KeyFile "C:\Users\ASCE\.ssh\id_ed25519_cursor_20251002_051254"

# أو جرب مفتاح آخر
.\fix_cursor_ssh.ps1 -KeyFile "D:\vm\my-dev-key.pem"
```

### الخطوة 3: إذا لم تعمل المفاتيح، أنشئ مفتاح جديد
```powershell
.\fix_cursor_ssh.ps1 -CreateKey
```

## 🔄 حل بديل: استخدام اتصال مختلف

إذا لم تتمكن من حل مشكلة cursor-dev، يمكنك:

### استخدام aws-jump بدلاً من cursor-dev
```powershell
# اختبار اتصال AWS (قد يعمل بشكل أفضل)
.\connect_aws.ps1 -Test

# إذا عمل، استخدمه في Cursor IDE:
# Remote-SSH: Connect to Host -> aws-jump
```

### أو استخدام IP مباشرة
في Cursor IDE، بدلاً من `cursor-dev` استخدم:
```
ubuntu@100.87.127.117
```

## 📋 خطوات الإصلاح التفصيلية

### 1. تشخيص المشكلة
```powershell
# فحص SSH config الحالي
notepad C:\Users\ASCE\.ssh\config

# اختبار الاتصال
ssh -v cursor-dev
```

### 2. إصلاح SSH config
```powershell
# إضافة مفتاح للإعدادات
.\fix_cursor_ssh.ps1 -KeyFile "مسار_المفتاح"

# أو إنشاء مفتاح جديد
.\fix_cursor_ssh.ps1 -CreateKey
```

### 3. اختبار الإصلاح
```powershell
# اختبار الاتصال
ssh cursor-dev "echo 'نجح الاتصال!' && hostname"

# اختبار في Cursor IDE
# Ctrl+Shift+P -> Remote-SSH: Connect to Host -> cursor-dev
```

## 🚀 الحل السريع الموصى به

```powershell
# 1. جرب المفتاح الموجود أولاً
.\fix_cursor_ssh.ps1 -KeyFile "C:\Users\ASCE\.ssh\id_ed25519_cursor_20251002_051254"

# 2. إذا لم يعمل، أنشئ مفتاح جديد
.\fix_cursor_ssh.ps1 -CreateKey

# 3. اختبر الاتصال
ssh cursor-dev "whoami"

# 4. استخدم في Cursor IDE
# Remote-SSH: Connect to Host -> cursor-dev
```

## 🔍 استكشاف الأخطاء

### إذا استمرت المشكلة:

1. **تحقق من صلاحيات المفتاح:**
   ```powershell
   icacls C:\Users\ASCE\.ssh\id_ed25519_cursor
   ```

2. **اختبار مع verbose:**
   ```powershell
   ssh -v cursor-dev
   ```

3. **استخدام IP مباشرة:**
   ```powershell
   ssh -i "مسار_المفتاح" ubuntu@100.87.127.117
   ```

## 💡 نصائح إضافية

- **للأمان:** استخدم مفاتيح SSH منفصلة لكل سيرفر
- **للسهولة:** احتفظ بنسخة احتياطية من المفاتيح
- **للسرعة:** استخدم SSH agent لحفظ كلمات مرور المفاتيح

## 📞 إذا احتجت مساعدة

```powershell
# عرض المساعدة
.\fix_cursor_ssh.ps1 -Help

# اختبار شامل للاتصالات
.\test_ssh_connections.ps1 -Detailed -Interactive
```
