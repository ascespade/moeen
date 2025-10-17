# 🔐 إعداد SSH على Windows للاتصال بخادم Cursor

## 📋 المتطلبات
- Windows 10/11
- PowerShell (مثبت مسبقاً)
- صلاحيات المدير (Administrator)
- اتصال بالإنترنت

## 🚀 التثبيت السريع

### الطريقة الأولى: تشغيل السكريبت
1. **انقر بزر الماوس الأيمن** على PowerShell
2. اختر **"Run as Administrator"**
3. نفذ الأمر التالي:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/your-repo/setup-windows-ssh.ps1" -OutFile "setup-windows-ssh.ps1"
.\setup-windows-ssh.ps1
```

### الطريقة الثانية: تحميل وتشغيل محلي
1. احفظ ملف `setup-windows-ssh.ps1` على سطح المكتب
2. انقر بزر الماوس الأيمن على الملف
3. اختر **"Run with PowerShell"** أو **"Run as Administrator"**

## 📁 الملفات التي سيتم إنشاؤها

```
C:\Users\[YourUsername]\.ssh\
├── dev_key              # المفتاح الخاص
├── config               # إعدادات SSH
└── known_hosts          # (سيتم إنشاؤه تلقائياً)

C:\Users\[YourUsername]\Desktop\
├── SSH to Cursor Dev.lnk        # اختصار SSH
├── VS Code Server.lnk           # اختصار VS Code
├── Cursor Server.lnk            # اختصار Cursor
├── Connect-to-Cursor-Dev.bat    # ملف Batch
└── Connect-to-Cursor-Dev.ps1    # سكريبت PowerShell
```

## 🔗 معلومات الاتصال

### SSH Connection
- **Host:** `100.98.137.52` (Tailscale IP)
- **Hostname:** `cursor-2.tail31ce5f.ts.net`
- **User:** `dev`
- **Port:** `22`
- **Key:** `~/.ssh/dev_key`

### Web Access
- **VS Code Server:** http://100.98.137.52:8081
- **Cursor Server:** http://100.98.137.52:26054
- **VS Code Password:** `devpassword123`

## 🎯 طرق الاتصال

### 1. استخدام الاختصارات
- انقر مرتين على **"SSH to Cursor Dev"** على سطح المكتب

### 2. استخدام Command Prompt/PowerShell
```cmd
ssh cursor-dev
```

### 3. استخدام PowerShell Script
```powershell
.\Connect-to-Cursor-Dev.ps1
```

### 4. الاتصال المباشر
```cmd
ssh -i %USERPROFILE%\.ssh\dev_key dev@100.98.137.52
```

## ⚙️ إعدادات SSH Config

سيتم إنشاء ملف `~/.ssh/config` مع الإعدادات التالية:

```
Host cursor-dev
    HostName 100.98.137.52
    User dev
    IdentityFile ~/.ssh/dev_key
    Port 22
    ServerAliveInterval 60
    ServerAliveCountMax 3
    StrictHostKeyChecking no
    UserKnownHostsFile /dev/null
```

## 🔧 استكشاف الأخطاء

### مشكلة: "Permission denied"
```powershell
# تأكد من صلاحيات الملف
icacls "%USERPROFILE%\.ssh\dev_key" /inheritance:r /grant:r "%USERNAME%:F"
```

### مشكلة: "Host key verification failed"
```powershell
# امسح known_hosts
Remove-Item "$env:USERPROFILE\.ssh\known_hosts" -ErrorAction SilentlyContinue
```

### مشكلة: "Connection refused"
- تأكد من أن Tailscale يعمل على جهازك
- تحقق من اتصال الإنترنت
- جرب الاتصال بـ hostname بدلاً من IP

## 🌐 إعداد Tailscale (إذا لم يكن مثبتاً)

1. اذهب إلى: https://tailscale.com/download
2. حمل وثبت Tailscale
3. سجل دخول بحسابك
4. تأكد من أن الجهاز متصل بالشبكة

## 📱 استخدام على الهاتف المحمول

### Android (Termux)
```bash
# تثبيت OpenSSH
pkg install openssh

# نسخ المفتاح
cp /sdcard/dev_key ~/.ssh/
chmod 600 ~/.ssh/dev_key

# الاتصال
ssh -i ~/.ssh/dev_key dev@100.98.137.52
```

### iOS (iSH/Blink)
```bash
# تثبيت OpenSSH
apk add openssh-client

# نسخ المفتاح
cp /path/to/dev_key ~/.ssh/
chmod 600 ~/.ssh/dev_key

# الاتصال
ssh -i ~/.ssh/dev_key dev@100.98.137.52
```

## 🔒 الأمان

- المفتاح الخاص محمي بصلاحيات مقيدة
- الاتصال مشفر عبر SSH
- لا تشارك المفتاح الخاص مع أحد
- استخدم Tailscale للحصول على اتصال آمن

## 📞 الدعم

إذا واجهت أي مشاكل:
1. تأكد من تشغيل السكريبت كمدير
2. تحقق من اتصال Tailscale
3. جرب إعادة تشغيل PowerShell
4. تأكد من أن الخادم يعمل

## 🎉 مبروك!

الآن يمكنك:
- ✅ الاتصال بـ SSH بدون كلمة مرور
- ✅ فتح VS Code Server في المتصفح
- ✅ فتح Cursor Server في المتصفح
- ✅ التطوير عن بُعد بسهولة

**استمتع بالتطوير! 🚀**