# 📖 دليل الاستخدام الشامل - Cursor Dev Platform

## 🎯 نظرة عامة

هذا الدليل يوضح كيفية استخدام منصة Cursor Dev Platform بكفاءة عالية، من الإعداد الأولي إلى التطوير المتقدم مع الذكاء الاصطناعي.

---

## 🚀 البدء السريع

### 1. الإعداد الأولي

```powershell
# الانتقال لمجلد المشروع
cd "D:\Cursor-Dev-Platform"

# تشغيل الإعداد السريع
.\scripts\quick-setup.ps1 -ServerIP "YOUR_SERVER_IP" -Domain "dev.yourdomain.com"
```

### 2. الوصول للمنصة

بعد الإعداد، ستحصل على:
- **الرابط الرئيسي**: `https://dev.yourdomain.com`
- **كلمة المرور**: ستظهر في نهاية الإعداد
- **لوحة المراقبة**: `http://YOUR_SERVER_IP:3000/monitoring/`

---

## 🛠️ إدارة المنصة

### أوامر الإدارة الأساسية

```powershell
# عرض حالة النظام
.\scripts\cursor-dev-manager.ps1 -Action status -ServerIP "YOUR_SERVER_IP"

# مراقبة مباشرة (اضغط Ctrl+C للخروج)
.\scripts\cursor-dev-manager.ps1 -Action monitor -ServerIP "YOUR_SERVER_IP"

# إنشاء نسخة احتياطية
.\scripts\cursor-dev-manager.ps1 -Action backup -ServerIP "YOUR_SERVER_IP"

# إعادة تشغيل الخدمات
.\scripts\cursor-dev-manager.ps1 -Action restart -ServerIP "YOUR_SERVER_IP"

# فتح المنصة في المتصفح
.\scripts\cursor-dev-manager.ps1 -Action connect -ServerIP "YOUR_SERVER_IP"

# تحديث المنصة
.\scripts\cursor-dev-manager.ps1 -Action update -ServerIP "YOUR_SERVER_IP"
```

### أوامر السيرفر المباشرة

```bash
# الاتصال بالسيرفر
ssh root@YOUR_SERVER_IP

# مراقبة الأداء
sudo /usr/local/bin/cursor-monitor

# عرض السجلات المباشرة
journalctl -u code-server -f

# إعادة تشغيل خدمة معينة
sudo systemctl restart code-server
sudo systemctl restart nginx

# فحص حالة الخدمات
sudo systemctl status code-server nginx postgresql redis-server
```

---

## 📥 إدارة المشاريع

### استيراد مشروع من Git

```bash
# استيراد من GitHub
import-project https://github.com/username/project.git my-project

# استيراد من GitLab
import-project https://gitlab.com/username/project.git my-project

# استيراد من Bitbucket
import-project https://bitbucket.org/username/project.git my-project
```

### استيراد مشروع من أرشيف

```bash
# من ملف ZIP
import-project /path/to/project.zip my-project

# من ملف tar.gz
import-project /path/to/project.tar.gz my-project
```

### إنشاء مشروع جديد

```bash
# مشروع React
git-init-project my-react-app react https://github.com/username/my-react-app.git

# مشروع Django
git-init-project my-django-app django https://github.com/username/my-django-app.git

# مشروع Express
git-init-project my-api express https://github.com/username/my-api.git
```

### عرض المشاريع المتاحة

```bash
# قائمة بجميع المشاريع
list-projects
```

---

## 🔗 إدارة Git

### إعداد Git الشخصي

```bash
# إعداد المعلومات الشخصية
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# عرض مفاتيح SSH
cat ~/.ssh/id_rsa_github.pub
cat ~/.ssh/id_rsa_gitlab.pub
```

### أوامر Git المحسنة

```bash
# تنظيف المستودع
git-cleanup

# مزامنة مع الريموت
git-sync

# عرض السجل بشكل جميل
git lga

# إنشاء commit سريع
git wip

# التراجع عن آخر commit
git unwip
```

### اختبار اتصال SSH

```bash
# اختبار GitHub
ssh -T git@github.com

# اختبار GitLab
ssh -T git@gitlab.com

# اختبار Bitbucket
ssh -T git@bitbucket.org
```

---

## 🤖 استخدام الذكاء الاصطناعي

### تشغيل خادم AI

```bash
# بدء خادم AI API
cd /home/codeserver/ai-api-server
python main.py
```

### أوامر AI من سطر الأوامر

```bash
# محادثة مع AI
ai-chat "How to optimize React performance?"

# توليد كود
ai-code "Create a REST API for user authentication" python

# مراجعة كود
ai-review "path/to/your/code.py"
```

### استخدام قوالب AI

```bash
# إنشاء مشروع FastAPI + AI
cp -r /home/codeserver/workspace/ai-templates/fastapi-openai ./my-ai-project
cd my-ai-project
pip install -r requirements.txt
python main.py
```

### لوحة تحكم Streamlit

```bash
# تشغيل لوحة AI
cd /home/codeserver/workspace/ai-templates/streamlit-ai-dashboard
streamlit run app.py --server.port 8501
```

---

## 🔧 التطوير المتقدم

### إعداد بيئات متعددة

```bash
# بيئة التطوير
export NODE_ENV=development
export DEBUG=true

# بيئة الإنتاج
export NODE_ENV=production
export DEBUG=false
```

### استخدام Docker

```bash
# بناء صورة Docker
docker build -t my-app .

# تشغيل الحاوية
docker run -p 3000:3000 my-app

# استخدام Docker Compose
docker-compose up -d
```

### إعداد قواعد البيانات

```bash
# PostgreSQL
sudo -u postgres createdb myproject
sudo -u postgres createuser myuser

# Redis
redis-cli ping

# MongoDB (إذا كان مثبت)
mongo --eval "db.stats()"
```

---

## 📊 المراقبة والتحليل

### لوحة المراقبة الويب

افتح `http://YOUR_SERVER_IP:3000/monitoring/` لعرض:
- استخدام المعالج والذاكرة
- حالة الخدمات
- إحصائيات الشبكة
- السجلات المباشرة

### مراقبة الأداء

```bash
# استخدام الموارد
htop
iotop
nethogs

# مساحة القرص
df -h
du -sh /home/codeserver/workspace/*

# حالة الخدمات
systemctl status code-server nginx postgresql
```

### تحليل السجلات

```bash
# سجلات Code Server
journalctl -u code-server -n 100

# سجلات Nginx
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# سجلات النظام
dmesg | tail
```

---

## 💾 النسخ الاحتياطي والاستعادة

### إنشاء نسخة احتياطية

```bash
# نسخة احتياطية يدوية
sudo /usr/local/bin/cursor-smart-backup

# نسخة احتياطية من Windows
.\scripts\cursor-dev-manager.ps1 -Action backup -ServerIP "YOUR_SERVER_IP"
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

### جدولة النسخ الاحتياطي

```bash
# عرض المهام المجدولة
crontab -l

# تعديل الجدولة
crontab -e
```

---

## 🔒 الأمان والصيانة

### إدارة SSL

```bash
# فحص الشهادة
sudo certbot certificates

# تجديد الشهادة
sudo certbot renew

# اختبار التجديد
sudo certbot renew --dry-run
```

### إدارة Firewall

```bash
# حالة الجدار الناري
sudo ufw status

# فتح منفذ جديد
sudo ufw allow 8080

# إغلاق منفذ
sudo ufw deny 8080
```

### مراقبة الأمان

```bash
# حالة Fail2ban
sudo fail2ban-client status

# عرض IPs المحظورة
sudo fail2ban-client status nginx-http-auth

# إلغاء حظر IP
sudo fail2ban-client set nginx-http-auth unbanip IP_ADDRESS
```

---

## 🚨 استكشاف الأخطاء

### مشاكل شائعة وحلولها

#### 1. Code Server لا يعمل

```bash
# فحص الحالة
sudo systemctl status code-server

# إعادة التشغيل
sudo systemctl restart code-server

# فحص السجلات
journalctl -u code-server -f
```

#### 2. مشاكل SSL

```bash
# فحص تكوين Nginx
sudo nginx -t

# إعادة تحميل Nginx
sudo systemctl reload nginx

# فحص الشهادة
openssl x509 -in /etc/letsencrypt/live/yourdomain.com/fullchain.pem -text -noout
```

#### 3. مشاكل الأداء

```bash
# فحص استخدام الموارد
top
free -h
df -h

# تحسين الأداء
sudo /tmp/performance-optimizer.sh
```

#### 4. مشاكل Git

```bash
# فحص تكوين Git
git config --list

# إعادة إعداد SSH
ssh-keygen -t rsa -b 4096 -C "your@email.com"
ssh-add ~/.ssh/id_rsa
```

---

## 📈 نصائح للأداء الأمثل

### 1. تحسين Code Server

```bash
# زيادة حد الذاكرة
export NODE_OPTIONS="--max-old-space-size=4096"

# تحسين إعدادات VS Code
# في settings.json
{
    "files.watcherExclude": {
        "**/node_modules/**": true,
        "**/.git/**": true,
        "**/dist/**": true
    }
}
```

### 2. تحسين قاعدة البيانات

```bash
# PostgreSQL
sudo -u postgres psql -c "VACUUM ANALYZE;"

# Redis
redis-cli FLUSHDB
```

### 3. تنظيف النظام

```bash
# تنظيف الحزم
sudo apt autoremove
sudo apt autoclean

# تنظيف السجلات
sudo journalctl --vacuum-time=7d

# تنظيف ملفات مؤقتة
sudo find /tmp -type f -atime +7 -delete
```

---

## 🔌 الإضافات المُوصى بها

### إضافات VS Code الأساسية

```json
{
    "recommendations": [
        "ms-python.python",
        "ms-vscode.vscode-typescript-next",
        "esbenp.prettier-vscode",
        "bradlc.vscode-tailwindcss",
        "ms-vscode.vscode-eslint",
        "github.copilot",
        "ms-vscode.vscode-docker",
        "hashicorp.terraform"
    ]
}
```

### تثبيت الإضافات تلقائياً

```bash
# قائمة الإضافات المطلوبة
extensions=(
    "ms-python.python"
    "ms-vscode.vscode-typescript-next"
    "esbenp.prettier-vscode"
    "github.copilot"
)

# تثبيت الإضافات
for ext in "${extensions[@]}"; do
    code-server --install-extension "$ext"
done
```

---

## 📞 الحصول على المساعدة

### الموارد المفيدة

- **الوثائق الرسمية**: [Code Server Docs](https://coder.com/docs/code-server)
- **مجتمع GitHub**: [Issues & Discussions](https://github.com/coder/code-server)
- **الدعم الفني**: راجع ملف README.md

### تقارير الأخطاء

عند مواجهة مشكلة، اجمع المعلومات التالية:

```bash
# معلومات النظام
uname -a
lsb_release -a

# حالة الخدمات
systemctl status code-server nginx

# السجلات الأخيرة
journalctl -u code-server -n 50

# استخدام الموارد
free -h
df -h
```

---

## 🎓 أمثلة عملية

### مثال 1: إنشاء API بـ FastAPI

```bash
# إنشاء المشروع
git-init-project my-fastapi-project python

# الانتقال للمشروع
cd /home/codeserver/workspace/my-fastapi-project

# إنشاء بيئة افتراضية
python3 -m venv venv
source venv/bin/activate

# تثبيت FastAPI
pip install fastapi uvicorn

# إنشاء الملف الرئيسي
cat > main.py << 'EOF'
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}
EOF

# تشغيل الخادم
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### مثال 2: إنشاء تطبيق React

```bash
# إنشاء المشروع
git-init-project my-react-app react

# الانتقال للمشروع
cd /home/codeserver/workspace/my-react-app

# إنشاء تطبيق React
npx create-react-app . --template typescript

# تثبيت التبعيات الإضافية
npm install axios @mui/material @emotion/react @emotion/styled

# تشغيل خادم التطوير
npm start
```

### مثال 3: مشروع Full-Stack

```bash
# إنشاء مجلد المشروع
mkdir /home/codeserver/workspace/fullstack-app
cd /home/codeserver/workspace/fullstack-app

# إنشاء Backend (FastAPI)
mkdir backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install fastapi uvicorn sqlalchemy psycopg2-binary

# إنشاء Frontend (React)
cd ..
npx create-react-app frontend --template typescript
cd frontend
npm install axios @types/axios

# إنشاء Docker Compose
cd ..
cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    depends_on:
      - db
  
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
  
  db:
    image: postgres:13
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
EOF

# تشغيل المشروع
docker-compose up -d
```

---

هذا الدليل يغطي جميع جوانب استخدام منصة Cursor Dev Platform. للمزيد من التفاصيل، راجع الملفات الأخرى في مجلد `docs/`.
