# 🛡️ Tailscale Guardian Script

سكربت ذكي لمراقبة وإدارة اتصال Tailscale تلقائياً.

## ✨ المميزات

- ✅ يتأكد من تشغيل خدمة `tailscaled`
- ✅ يشغل `tailscaled` تلقائياً إذا توقف
- ✅ يشغل `tailscale up` تلقائياً إذا انقطع الاتصال
- ✅ يعمل في الخلفية حتى لو أغلقت التيرمنال
- ✅ يعيد المحاولة كل دقيقة تلقائياً
- ✅ يسجل جميع العمليات في ملف اللوق
- ✅ معالجة نظيفة للإشارات (SIGTERM, SIGINT)

## 🚀 التثبيت

### 1. إعداد متغيرات البيئة

قبل تشغيل السكربت، تحتاج لتعديل المتغيرات التالية:

```bash
sudo nano /usr/local/bin/tailscale-guardian.sh
```

غيّر هذه القيم:
- `AUTH_KEY`: مفتاح التوثيق من Tailscale Admin Console
- `HOSTNAME`: اسم الجهاز في شبكة Tailscale

### 2. تشغيل السكربت

```bash
# تشغيل في الخلفية
nohup /usr/local/bin/tailscale-guardian.sh > /dev/null 2>&1 &

# أو تشغيل مباشر (للمراقبة)
/usr/local/bin/tailscale-guardian.sh
```

### 3. تشغيل تلقائي عند الإقلاع

```bash
# فتح crontab
crontab -e

# إضافة السطر التالي
@reboot nohup /usr/local/bin/tailscale-guardian.sh > /dev/null 2>&1 &
```

## 📊 المراقبة

### عرض اللوق
```bash
# عرض آخر 50 سطر
tail -50 /var/log/tailscale-guardian.log

# مراقبة اللوق مباشرة
tail -f /var/log/tailscale-guardian.log
```

### فحص حالة السكربت
```bash
# فحص إذا كان السكربت يعمل
pgrep -f tailscale-guardian

# عرض معلومات العملية
ps aux | grep tailscale-guardian
```

### فحص حالة Tailscale
```bash
# حالة الاتصال
tailscale status

# معلومات الشبكة
tailscale netcheck
```

## 🧪 الاختبار

### اختبار إعادة التشغيل التلقائي
```bash
# إيقاف tailscaled يدوياً
sudo pkill tailscaled

# السكربت سيعيد تشغيله خلال دقيقة
```

### اختبار إعادة الاتصال
```bash
# إيقاف الاتصال
tailscale down

# السكربت سيعيد الاتصال تلقائياً
```

## 🛑 الإيقاف

```bash
# إيقاف السكربت
sudo pkill -f tailscale-guardian

# أو إيقاف نظيف
sudo kill -TERM $(pgrep -f tailscale-guardian)
```

## 📁 الملفات

- **السكربت**: `/usr/local/bin/tailscale-guardian.sh`
- **اللوق**: `/var/log/tailscale-guardian.log`
- **حالة Tailscale**: `/var/lib/tailscale/tailscaled.state`
- **Socket**: `/var/run/tailscale/tailscaled.sock`

## 🔧 استكشاف الأخطاء

### مشاكل شائعة

1. **خطأ في الصلاحيات**:
   ```bash
   sudo chmod +x /usr/local/bin/tailscale-guardian.sh
   ```

2. **مجلدات غير موجودة**:
   ```bash
   sudo mkdir -p /var/lib/tailscale /var/run/tailscale
   ```

3. **مشكلة في AUTH_KEY**:
   - تأكد من صحة المفتاح
   - تأكد من أن المفتاح لم ينته صلاحيته
   - تأكد من أن المفتاح له صلاحيات كافية

4. **مشكلة في الاتصال**:
   ```bash
   # فحص إعدادات الشبكة
   tailscale netcheck
   
   # فحص حالة الخدمة
   systemctl status tailscaled
   ```

## 📝 ملاحظات مهمة

- تأكد من تثبيت Tailscale قبل تشغيل السكربت
- السكربت يحتاج صلاحيات root للوصول لملفات النظام
- يمكن تخصيص فترة الفحص بتغيير قيمة `sleep 60`
- السكربت آمن للتشغيل على خوادم الإنتاج

## 🆘 الدعم

إذا واجهت مشاكل:
1. راجع ملف اللوق: `/var/log/tailscale-guardian.log`
2. تأكد من إعدادات AUTH_KEY و HOSTNAME
3. تأكد من تثبيت Tailscale بشكل صحيح
