# 🚀 Cursor Dev Platform

## منصة التطوير المتكاملة مع أفضل أداء ممكن

منصة تطوير شاملة تجمع بين قوة **Code Server** وتحسينات الأداء المتقدمة مع الحفاظ على **Cursor Agent** للحصول على تجربة تطوير استثنائية.

---

## ✨ المميزات الرئيسية

### 🎯 الأداء العالي
- **تحسينات النظام**: إعدادات kernel محسنة للتطوير
- **إدارة الذاكرة**: تخصيص ذكي للموارد حسب إمكانيات السيرفر
- **تسريع الشبكة**: BBR congestion control و TCP optimizations
- **تحسين I/O**: File watchers محسنة و disk caching متقدم

### 🔒 الأمان المتقدم
- **SSL تلقائي**: Let's Encrypt مع تجديد تلقائي
- **Fail2ban**: حماية من الهجمات الآلية
- **Firewall**: إعدادات أمان صارمة
- **Rate Limiting**: حماية من الإفراط في الطلبات

### 📊 المراقبة الشاملة
- **لوحة تحكم تفاعلية**: مراقبة مباشرة للنظام
- **تنبيهات ذكية**: إشعارات عند تجاوز الحدود
- **سجلات مفصلة**: تتبع شامل للأحداث
- **تقارير الأداء**: تحليل دوري للاستخدام

### 💾 النسخ الاحتياطي الذكي
- **نسخ تلقائية**: يومية وأسبوعية وشهرية
- **ضغط متقدم**: توفير مساحة التخزين
- **التحقق من السلامة**: فحص تلقائي للنسخ
- **استرداد سريع**: استعادة فورية عند الحاجة

---

## 🛠️ متطلبات النظام

### السيرفر
- **نظام التشغيل**: Ubuntu 20.04+ / Debian 11+
- **المعالج**: 2+ cores (4+ مُوصى به)
- **الذاكرة**: 4GB+ RAM (8GB+ مُوصى به)
- **التخزين**: 20GB+ مساحة حرة
- **الشبكة**: اتصال إنترنت مستقر

### العميل (Windows)
- **PowerShell**: 5.0+
- **OpenSSH Client**: مثبت ومُعد
- **متصفح حديث**: Chrome, Firefox, Edge

---

## ⚡ التثبيت السريع

### 1. تحضير السيرفر
```bash
# تحديث النظام
sudo apt update && sudo apt upgrade -y

# تثبيت SSH (إذا لم يكن مثبت)
sudo apt install openssh-server -y
sudo systemctl enable --now ssh

# إعداد مستخدم sudo (اختياري)
sudo adduser cursor-admin
sudo usermod -aG sudo cursor-admin
```

### 2. إعداد مفاتيح SSH (مُوصى به)
```powershell
# على Windows - إنشاء مفتاح SSH
ssh-keygen -t rsa -b 4096 -C "cursor-dev@yourdomain.com"

# نسخ المفتاح للسيرفر
ssh-copy-id root@YOUR_SERVER_IP
```

### 3. تشغيل الإعداد السريع
```powershell
# الانتقال لمجلد المشروع
cd "D:\Cursor-Dev-Platform"

# تشغيل الإعداد السريع
.\scripts\quick-setup.ps1 -ServerIP "YOUR_SERVER_IP" -Domain "dev.yourdomain.com" -Email "your@email.com"
```

### 4. الإعداد المتقدم (اختياري)
```powershell
# مع تخطي التحسينات
.\scripts\quick-setup.ps1 -ServerIP "192.168.1.100" -SkipOptimization

# بدون مراقبة
.\scripts\quick-setup.ps1 -ServerIP "192.168.1.100" -EnableMonitoring:$false

# بدون نسخ احتياطي أولي
.\scripts\quick-setup.ps1 -ServerIP "192.168.1.100" -CreateBackup:$false
```

---

## 🎮 الاستخدام

### إدارة المنصة
```powershell
# عرض حالة النظام
.\scripts\cursor-dev-manager.ps1 -Action status -ServerIP "YOUR_SERVER_IP"

# مراقبة مباشرة
.\scripts\cursor-dev-manager.ps1 -Action monitor -ServerIP "YOUR_SERVER_IP"

# إنشاء نسخة احتياطية
.\scripts\cursor-dev-manager.ps1 -Action backup -ServerIP "YOUR_SERVER_IP"

# إعادة تشغيل الخدمات
.\scripts\cursor-dev-manager.ps1 -Action restart -ServerIP "YOUR_SERVER_IP"

# فتح المنصة في المتصفح
.\scripts\cursor-dev-manager.ps1 -Action connect -ServerIP "YOUR_SERVER_IP"
```

### الوصول للمنصة
- **الرابط الرئيسي**: `https://your-domain.com`
- **رابط IP مباشر**: `http://YOUR_SERVER_IP:8080`
- **لوحة المراقبة**: `http://YOUR_SERVER_IP:3000/monitoring/`

### أوامر السيرفر المفيدة
```bash
# مراقبة الأداء
sudo /usr/local/bin/cursor-monitor

# إنشاء نسخة احتياطية
sudo /usr/local/bin/cursor-smart-backup

# عرض السجلات
journalctl -u code-server -f

# إعادة تشغيل الخدمات
sudo systemctl restart code-server nginx
```

---

## 📁 هيكل المشروع

```
D:\Cursor-Dev-Platform\
├── scripts/                    # سكريبتات الإدارة
│   ├── install-code-server.sh  # سكريبت التثبيت الرئيسي
│   ├── performance-optimizer.sh # تحسينات الأداء
│   ├── cursor-dev-manager.ps1  # مدير المنصة
│   └── quick-setup.ps1         # الإعداد السريع
├── configs/                    # ملفات التكوين
│   ├── platform-config.json   # التكوين الرئيسي
│   └── server-config.json     # معلومات السيرفر
├── monitoring/                 # نظام المراقبة
│   ├── dashboard.html         # لوحة التحكم
│   └── setup.log             # سجلات الإعداد
├── ssl/                       # شهادات SSL
├── backups/                   # النسخ الاحتياطية
├── extensions/                # إضافات VSCode
└── docs/                     # الوثائق
```

---

## 🔧 التكوين المتقدم

### إعدادات الأداء
يمكن تعديل إعدادات الأداء في `configs/platform-config.json`:

```json
{
  "performance": {
    "code_server": {
      "max_memory_mb": 4096,
      "max_old_space_size": 4096,
      "worker_processes": "auto"
    },
    "nginx": {
      "worker_processes": "auto",
      "worker_connections": 2048,
      "keepalive_timeout": 65
    }
  }
}
```

### إعدادات الأمان
```json
{
  "security": {
    "fail2ban": {
      "ban_time": 3600,
      "max_retry": 5
    },
    "ssl_security": {
      "protocols": ["TLSv1.2", "TLSv1.3"],
      "hsts_enabled": true
    }
  }
}
```

### إعدادات المراقبة
```json
{
  "monitoring": {
    "interval_seconds": 300,
    "alerts": {
      "cpu_threshold": 90,
      "memory_threshold": 85,
      "disk_threshold": 90
    }
  }
}
```

---

## 🚨 استكشاف الأخطاء

### مشاكل الاتصال
```bash
# فحص حالة الخدمات
sudo systemctl status code-server nginx

# فحص المنافذ
sudo netstat -tlnp | grep -E ':(80|443|8080)'

# فحص السجلات
sudo journalctl -u code-server -n 50
sudo tail -f /var/log/nginx/error.log
```

### مشاكل الأداء
```bash
# مراقبة الموارد
htop
iotop
nethogs

# فحص استخدام القرص
df -h
du -sh /home/codeserver/*

# تحليل الذاكرة
free -h
cat /proc/meminfo
```

### مشاكل SSL
```bash
# فحص الشهادة
sudo certbot certificates

# تجديد الشهادة
sudo certbot renew --dry-run

# اختبار SSL
openssl s_client -connect your-domain.com:443
```

---

## 📈 تحسين الأداء

### للسيرفرات الصغيرة (2GB RAM)
```bash
# تقليل استخدام الذاكرة
echo 'NODE_OPTIONS="--max-old-space-size=1024"' >> /home/codeserver/.bashrc

# تحسين Swap
sudo sysctl vm.swappiness=60
```

### للسيرفرات الكبيرة (16GB+ RAM)
```bash
# زيادة حدود الذاكرة
echo 'NODE_OPTIONS="--max-old-space-size=8192"' >> /home/codeserver/.bashrc

# تحسين Cache
sudo sysctl vm.vfs_cache_pressure=10
```

### تحسين SSD
```bash
# تفعيل TRIM
sudo systemctl enable fstrim.timer

# تحسين I/O Scheduler
echo 'mq-deadline' | sudo tee /sys/block/sda/queue/scheduler
```

---

## 🔄 النسخ الاحتياطي والاستعادة

### إنشاء نسخة احتياطية يدوية
```bash
sudo /usr/local/bin/cursor-smart-backup
```

### استعادة من نسخة احتياطية
```bash
# عرض النسخ المتاحة
ls -la /home/codeserver/backups/

# استعادة نسخة معينة
cd /home/codeserver
sudo tar -xzf backups/cursor-backup-20241002_140000.tar.gz
sudo chown -R codeserver:codeserver workspace .config
```

### النسخ الاحتياطي التلقائي
النظام يقوم بإنشاء نسخ احتياطية تلقائياً:
- **يومياً**: الساعة 2:00 صباحاً
- **أسبوعياً**: كل يوم أحد
- **الاحتفاظ**: 7 أيام للنسخ اليومية، 4 أسابيع للأسبوعية

---

## 🔌 الإضافات المُوصى بها

### إضافات أساسية
- `ms-python.python` - دعم Python
- `ms-vscode.vscode-typescript-next` - TypeScript
- `esbenp.prettier-vscode` - تنسيق الكود
- `bradlc.vscode-tailwindcss` - Tailwind CSS
- `ms-vscode.vscode-eslint` - ESLint

### إضافات متقدمة
- `github.copilot` - GitHub Copilot
- `ms-vscode.vscode-docker` - Docker
- `hashicorp.terraform` - Terraform
- `ms-kubernetes-tools.vscode-kubernetes-tools` - Kubernetes

---

## 🤝 المساهمة

نرحب بمساهماتكم! يرجى:

1. Fork المشروع
2. إنشاء branch للميزة الجديدة
3. Commit التغييرات
4. Push للـ branch
5. إنشاء Pull Request

---

## 📞 الدعم

### الحصول على المساعدة
- **GitHub Issues**: لتقارير الأخطاء والاقتراحات
- **المجتمع**: منتدى المطورين العرب
- **الوثائق**: دليل المستخدم المفصل

### معلومات مفيدة
- **الإصدار الحالي**: 1.0.0
- **متطلبات النظام**: Ubuntu 20.04+
- **الترخيص**: MIT License

---

## 📝 سجل التغييرات

### الإصدار 1.0.0 (2024-10-02)
- ✨ إطلاق المنصة الأولي
- 🚀 تحسينات الأداء المتقدمة
- 🔒 نظام أمان شامل
- 📊 لوحة مراقبة تفاعلية
- 💾 نظام نسخ احتياطي ذكي

---

## ⚖️ الترخيص

هذا المشروع مرخص تحت رخصة MIT - راجع ملف [LICENSE](LICENSE) للتفاصيل.

---

## 🙏 شكر خاص

- **Code Server Team** - للمنصة الأساسية الرائعة
- **Nginx Team** - لخادم الويب القوي
- **Let's Encrypt** - لشهادات SSL المجانية
- **المجتمع العربي** - للدعم والمساهمات

---

<div align="center">

**🚀 ابدأ رحلة التطوير الاحترافية اليوم!**

[التثبيت السريع](#-التثبيت-السريع) • [الوثائق](docs/) • [الدعم](#-الدعم)

</div>
