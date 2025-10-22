# 🔐 SSH Setup Complete Guide

## ✅ **ما تم إنجازه:**

### 1. **إنشاء مفاتيح SSH:**

```bash
# تم إنشاء المفتاح الخاص والعام
~/.ssh/id_rsa (Private Key)
~/.ssh/id_rsa.pub (Public Key)
```

### 2. **إعداد SSH Config:**

```bash
# تم إعداد ملف ~/.ssh/config
Host *
    StrictHostKeyChecking no
    UserKnownHostsFile /dev/null
    ServerAliveInterval 60
    ServerAliveCountMax 3
    TCPKeepAlive yes
    Compression yes
    ControlMaster auto
    ControlPath ~/.ssh/master-%r@%h:%p
    ControlPersist 10m
    IdentitiesOnly yes
    IdentityFile ~/.ssh/id_rsa
    PasswordAuthentication no
    PubkeyAuthentication yes
    PreferredAuthentications publickey
```

## 🚀 **خطوات الاتصال:**

### **من Cursor المحلي:**

1. افتح Cursor
2. اضغط `Ctrl+Shift+P` (أو `Cmd+Shift+P` على Mac)
3. اكتب "Remote-SSH: Connect to Host"
4. اختر "Add New SSH Host"
5. أدخل: `ssh ubuntu@YOUR_SERVER_IP`
6. اختر ملف config: `~/.ssh/config`

### **من Terminal:**

```bash
# اختبار الاتصال
ssh ubuntu@YOUR_SERVER_IP

# أو باستخدام config
ssh prod-your-server
```

## 🔧 **إصلاح مشاكل Cursor Background Agent:**

### **1. تشغيل Background Agent:**

```bash
# من مجلد المشروع
./.cursor/agent-startup.sh
```

### **2. إعدادات Cursor:**

- افتح Cursor Settings
- ابحث عن "Background Agent"
- فعّل "Enable Background Agent"
- اختر "Auto-start on project open"

### **3. إعدادات المشروع:**

```json
// .cursor/background-agent-config.json
{
  "backgroundAgent": {
    "enabled": true,
    "autoStart": true,
    "maxConcurrentTasks": 3,
    "taskTimeout": 300000,
    "retryAttempts": 3
  }
}
```

## 📋 **الخطوات التالية:**

1. **انسخ المفتاح العام** إلى الخادم المستهدف
2. **اختبر الاتصال** من Cursor
3. **فعّل Background Agent** في إعدادات Cursor
4. **أعد تشغيل Cursor** للتأكد من عمل الإعدادات

## 🔍 **استكشاف الأخطاء:**

### **إذا فشل SSH:**

```bash
# تحقق من المفاتيح
ls -la ~/.ssh/

# اختبر الاتصال مع تفاصيل
ssh -v ubuntu@YOUR_SERVER_IP

# تحقق من الصلاحيات
chmod 600 ~/.ssh/id_rsa
chmod 644 ~/.ssh/id_rsa.pub
```

### **إذا فشل Background Agent:**

```bash
# تحقق من Node.js
node --version
npm --version

# تحقق من التبعيات
npm install

# شغل Agent يدوياً
./.cursor/agent-startup.sh
```

## ✅ **النتيجة:**

- SSH Remote: ✅ جاهز
- Background Agent: ✅ مُعد
- المفاتيح: ✅ مُنشأة
- الإعدادات: ✅ مُحسنة

**المشروع الآن جاهز للعمل مع Cursor Remote SSH و Background Agent!**
