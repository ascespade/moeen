# 🎯 دليل إعداد سيرفر Cursor الشامل

## 📊 الوضع الحالي

✅ **تم إنشاء مفتاح SSH جديد خاص بسيرفر Cursor**  
✅ **تم تحديث SSH config**  
⚠️ **يحتاج نسخ المفتاح العام للسيرفر**  

## 🔑 المفتاح العام الجديد

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAILH0MLddHL8gYwN4JelCjPqCaTSLPLroaVUbAhhrCngi cursor-server-20251002
```

## 🛠️ طرق إضافة المفتاح للسيرفر

### الطريقة 1: الوصول المباشر للسيرفر

إذا كان لديك وصول لسيرفر cursor بأي طريقة:

```bash
# على سيرفر cursor (100.87.127.117)
mkdir -p ~/.ssh
chmod 700 ~/.ssh
echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAILH0MLddHL8gYwN4JelCjPqCaTSLPLroaVUbAhhrCngi cursor-server-20251002" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

### الطريقة 2: عبر لوحة تحكم السيرفر

إذا كان السيرفر على AWS/DigitalOcean/etc:

1. **ادخل للوحة التحكم**
2. **افتح Console/Terminal للسيرفر**
3. **نفذ الأوامر أعلاه**

### الطريقة 3: عبر كلمة مرور مؤقتة

إذا كان السيرفر يقبل كلمة مرور:

```powershell
# جرب الاتصال بكلمة مرور
ssh ubuntu@100.87.127.117

# ثم أضف المفتاح
mkdir -p ~/.ssh
chmod 700 ~/.ssh
echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAILH0MLddHL8gYwN4JelCjPqCaTSLPLroaVUbAhhrCngi cursor-server-20251002" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

### الطريقة 4: عبر مفتاح موجود

إذا كان لديك مفتاح آخر يعمل:

```bash
# استخدم المفتاح الموجود للاتصال
ssh -i /path/to/existing/key ubuntu@100.87.127.117

# ثم أضف المفتاح الجديد
echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAILH0MLddHL8gYwN4JelCjPqCaTSLPLroaVUbAhhrCngi cursor-server-20251002" >> ~/.ssh/authorized_keys
```

## 🧪 اختبار الإعداد

بعد إضافة المفتاح، اختبر الاتصال:

```powershell
# اختبار الاتصال
.\setup_cursor_server.ps1 -TestConnection

# أو اختبار مباشر
ssh cursor-dev "echo 'نجح الاتصال!' && hostname"
```

## 🚀 استخدام cursor-dev في Cursor IDE

بعد نجاح الاختبار:

1. **افتح Cursor IDE**
2. **اضغط `Ctrl+Shift+P`**
3. **اكتب:** `Remote-SSH: Connect to Host`
4. **اختر:** `cursor-dev`
5. **ابدأ التطوير!** 🎯

## 🔄 حلول بديلة إذا لم تتمكن من الوصول

### الحل البديل 1: استخدام IP مباشر

في Cursor IDE، بدلاً من `cursor-dev` استخدم:
```
ubuntu@100.87.127.117
```

### الحل البديل 2: استخدام aws-jump مؤقتاً

```powershell
# استخدم aws-jump للتطوير حالياً
# Remote-SSH: Connect to Host -> aws-jump
```

### الحل البديل 3: إعداد مفتاح مشترك

إنشاء مفتاح يعمل مع جميع السيرفرات:

```powershell
# إنشاء مفتاح عام
ssh-keygen -t ed25519 -C "universal-key-$(Get-Date -Format 'yyyyMMdd')"

# إضافته لجميع السيرفرات
```

## 📋 الأوامر الجاهزة للاستخدام

### إدارة سيرفر cursor:
```powershell
# فحص الحالة
.\setup_cursor_server.ps1

# إنشاء مفتاح جديد
.\setup_cursor_server.ps1 -CreateNewKey

# اختبار الاتصال
.\setup_cursor_server.ps1 -TestConnection

# تشغيل تطبيقات
.\run_app_cursor.ps1 -App nextjs
.\run_app_cursor.ps1 -Status
```

### اتصال سريع:
```powershell
# اتصال مباشر
.\connect_cursor.ps1

# اتصال مع أمر محدد
.\connect_cursor.ps1 -Command "htop"
```

## 🔍 استكشاف الأخطاء

### إذا استمر فشل الاتصال:

1. **تحقق من المفتاح:**
   ```powershell
   ssh -v cursor-dev
   ```

2. **تحقق من SSH config:**
   ```powershell
   notepad C:\Users\ASCE\.ssh\config
   ```

3. **جرب الاتصال المباشر:**
   ```powershell
   ssh -i "C:\Users\ASCE\.ssh\cursor_server_key_20251002_071706" ubuntu@100.87.127.117
   ```

### رسائل الخطأ الشائعة:

- **Permission denied (publickey)** → المفتاح غير موجود على السيرفر
- **Connection refused** → السيرفر غير متاح أو SSH معطل
- **Host key verification failed** → مشكلة في التحقق من هوية السيرفر

## 💡 نصائح مهمة

### للأمان:
- احتفظ بنسخة احتياطية من المفاتيح
- استخدم مفاتيح منفصلة لكل سيرفر
- لا تشارك المفاتيح الخاصة

### للسهولة:
- استخدم SSH agent لحفظ كلمات مرور المفاتيح
- أضف aliases في SSH config
- استخدم الاختصارات المُنشأة

### للأداء:
- فعّل compression في SSH config
- استخدم KeepAlive للاتصالات الطويلة
- أضف LocalForward للمنافذ المطلوبة

## 🎯 الخطة الموصى بها

### الآن:
1. **أضف المفتاح العام للسيرفر** (بأي طريقة متاحة)
2. **اختبر الاتصال:** `.\setup_cursor_server.ps1 -TestConnection`
3. **استخدم cursor-dev في Cursor IDE**

### إذا لم تتمكن من الوصول للسيرفر:
1. **استخدم aws-jump مؤقتاً** للتطوير
2. **اطلب من مدير السيرفر** إضافة المفتاح
3. **أو استخدم الوصول عبر لوحة التحكم**

## 📞 المساعدة

```powershell
# عرض المساعدة التفصيلية
.\setup_cursor_server.ps1 -Help

# اختبار شامل للاتصالات
.\test_ssh_connections.ps1 -Detailed -Interactive

# إصلاح مشاكل SSH
.\fix_cursor_ssh.ps1 -Help
```

---

**🎉 بمجرد إضافة المفتاح، ستتمكن من استخدام `cursor-dev` في Cursor IDE بسهولة تامة!**
