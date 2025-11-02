# دليل البدء السريع - Remote Development Server

## ✅ ما تم إنجازه

تم إعداد السيرفر بنجاح! جميع المكونات الرئيسية جاهزة للاستخدام.

## 🚀 البدء السريع

### 1. تشغيل جميع الخدمات
```bash
bash /workspace/start-services.sh
```

### 2. إضافة SSH Key (للاتصال بدون باسورد)
```bash
# على جهاز Windows:
ssh-keygen -t ed25519

# عرض المفتاح العام:
cat ~/.ssh/id_ed25519.pub

# على السيرفر:
bash /workspace/setup-ssh-keys.sh
# أو أضف المفتاح يدوياً:
echo "YOUR_PUBLIC_KEY" >> ~/.ssh/authorized_keys
```

### 3. الاتصال بالسيرفر

**SSH (من Windows PowerShell):**
```powershell
ssh ubuntu@SERVER_IP
```

**Remote Desktop (من Windows):**
- افتح "Remote Desktop Connection"
- أدخل: `SERVER_IP:3389`
- استخدم اسم المستخدم والباسورد

### 4. تثبيت Cursor IDE (اختياري)
```bash
# 1. حمّل الملف من https://cursor.sh على جهازك
# 2. انقله للسيرفر:
#    scp cursor.deb ubuntu@SERVER_IP:/tmp/cursor.deb

# 3. ثبتّه:
bash /workspace/install-cursor.sh
```

## 📋 الملفات المتاحة

- `start-services.sh` - تشغيل جميع الخدمات
- `monitor-services.sh` - مراقبة وإعادة تشغيل الخدمات
- `prevent-sleep.sh` - منع النوم
- `setup-ssh-keys.sh` - إعداد SSH keys
- `install-cursor.sh` - تثبيت Cursor IDE
- `README-SSH-KEYS.md` - دليل SSH Keys
- `SETUP_COMPLETE.md` - التقرير الكامل

## ⚠️ ملاحظات مهمة

1. **Tailscale**: مثبت لكن يحتاج kernel module (غير متوفر في البيئة الحالية)
2. **Cursor IDE**: يحتاج تنزيل يدوي
3. **الخدمات**: تحتاج إعادة تشغيل يدوي بعد إعادة تشغيل السيرفر

## 📞 المساعدة

راجع `SETUP_COMPLETE.md` للتفاصيل الكاملة والاستكشاف.
