# 🚀 إعداد البيئة - Environment Setup
## مُعين Healthcare Platform

**تاريخ الإعداد**: 2025-01-17  
**النسخة**: 2.0  
**الحالة**: Production-Ready Setup

---

## 📋 نظرة عامة

هذا الدليل يوضح كيفية إعداد بيئة التطوير والإنتاج للمنصة الصحية مُعين. ستحتاج إلى إعداد البيئة المحلية أولاً، ثم الانتقال إلى بيئة الإنتاج.

---

## 🎯 متطلبات النظام

### الحد الأدنى:
- **OS**: Ubuntu 20.04+ / macOS 12+ / Windows 10+
- **RAM**: 8GB (16GB مفضل)
- **Storage**: 50GB مساحة فارغة
- **CPU**: 4 cores (8 cores مفضل)
- **Network**: اتصال إنترنت مستقر

### البرامج المطلوبة:
- **Node.js**: 18.x أو أحدث
- **npm**: 9.x أو أحدث
- **Git**: 2.30+ أو أحدث
- **Docker**: 20.10+ أو أحدث
- **Docker Compose**: 2.0+ أو أحدث

---

## 🔧 إعداد البيئة المحلية

### 1. **تثبيت Node.js**
```bash
# باستخدام nvm (مستحسن)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18

# أو باستخدام apt (Ubuntu)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# التحقق من التثبيت
node --version  # يجب أن يكون v18.x.x
npm --version   # يجب أن يكون v9.x.x
```

### 2. **تثبيت Docker**
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER

# macOS (باستخدام Homebrew)
brew install docker docker-compose

# التحقق من التثبيت
docker --version
docker-compose --version
```

### 3. **استنساخ المشروع**
```bash
# استنساخ المشروع
git clone https://github.com/ascespade/moeen.git
cd moeen

# تثبيت التبعيات
npm install

# نسخ ملف البيئة
cp .env.example .env.local
```

### 4. **إعداد متغيرات البيئة**
```bash
# .env.local
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/moeen_dev"
POSTGRES_USER="moeen_user"
POSTGRES_PASSWORD="moeen_password"
POSTGRES_DB="moeen_dev"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

# External APIs
WHATSAPP_ACCESS_TOKEN="your-whatsapp-token"
TWILIO_ACCOUNT_SID="your-twilio-sid"
TWILIO_AUTH_TOKEN="your-twilio-token"
SENDGRID_API_KEY="your-sendgrid-key"

# Storage
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="us-east-1"
S3_BUCKET_NAME="moeen-storage"

# Environment
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 🐳 إعداد Docker Environment

### 1. **Docker Compose للبيئة المحلية**
```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    container_name: moeen-postgres
    environment:
      POSTGRES_DB: moeen_dev
      POSTGRES_USER: moeen_user
      POSTGRES_PASSWORD: moeen_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./supabase/migrations:/docker-entrypoint-initdb.d
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U moeen_user -d moeen_dev"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: moeen-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Application
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    container_name: moeen-app
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://moeen_user:moeen_password@postgres:5432/moeen_dev
      - REDIS_URL=redis://redis:6379
    volumes:
      - .:/app
      - /app/node_modules
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    command: npm run dev

volumes:
  postgres_data:
  redis_data:
```

### 2. **Dockerfile للبيئة المحلية**
```dockerfile
# Dockerfile.dev
FROM node:18-alpine

WORKDIR /app

# تثبيت التبعيات
COPY package*.json ./
RUN npm ci

# نسخ الكود
COPY . .

# فتح المنفذ
EXPOSE 3000

# تشغيل التطبيق
CMD ["npm", "run", "dev"]
```

### 3. **تشغيل البيئة المحلية**
```bash
# تشغيل جميع الخدمات
docker-compose -f docker-compose.dev.yml up -d

# عرض السجلات
docker-compose -f docker-compose.dev.yml logs -f

# إيقاف الخدمات
docker-compose -f docker-compose.dev.yml down

# إعادة بناء الصور
docker-compose -f docker-compose.dev.yml up --build
```

---

## 🗄️ إعداد قاعدة البيانات

### 1. **تشغيل Migrations**
```bash
# باستخدام Supabase CLI
npx supabase db reset

# أو باستخدام Prisma
npx prisma migrate dev

# أو باستخدام SQL مباشرة
psql -h localhost -U moeen_user -d moeen_dev -f supabase/migrations/001_initial_schema.sql
```

### 2. **إدراج البيانات التجريبية**
```bash
# إدراج البيانات الأساسية
psql -h localhost -U moeen_user -d moeen_dev -f supabase/seed/01_users.sql
psql -h localhost -U moeen_user -d moeen_dev -f supabase/seed/02_doctors.sql
psql -h localhost -U moeen_user -d moeen_dev -f supabase/seed/03_patients.sql
```

### 3. **التحقق من قاعدة البيانات**
```bash
# الاتصال بقاعدة البيانات
psql -h localhost -U moeen_user -d moeen_dev

# عرض الجداول
\dt

# عرض البيانات
SELECT * FROM users LIMIT 5;
SELECT * FROM appointments LIMIT 5;

# الخروج
\q
```

---

## 🔧 إعداد التطوير

### 1. **تشغيل التطبيق**
```bash
# تثبيت التبعيات
npm install

# تشغيل قاعدة البيانات
docker-compose -f docker-compose.dev.yml up -d postgres redis

# تشغيل التطبيق
npm run dev

# أو تشغيل كل شيء مع Docker
docker-compose -f docker-compose.dev.yml up
```

### 2. **التحقق من التطبيق**
```bash
# فتح المتصفح
open http://localhost:3000

# أو باستخدام curl
curl http://localhost:3000/api/health

# اختبار API
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@moeen.health","password":"admin123"}'
```

### 3. **تشغيل الاختبارات**
```bash
# اختبارات الوحدة
npm run test

# اختبارات التكامل
npm run test:integration

# اختبارات E2E
npm run test:e2e

# اختبارات شاملة
npm run test:all
```

---

## 🚀 إعداد بيئة الإنتاج

### 1. **متطلبات الخادم**
- **OS**: Ubuntu 22.04 LTS
- **RAM**: 16GB+ (32GB مفضل)
- **Storage**: 100GB+ SSD
- **CPU**: 8+ cores
- **Network**: 1Gbps+

### 2. **تثبيت Docker في الإنتاج**
```bash
# تثبيت Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# تثبيت Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# إضافة المستخدم لمجموعة Docker
sudo usermod -aG docker $USER
```

### 3. **إعداد Nginx**
```bash
# تثبيت Nginx
sudo apt update
sudo apt install nginx

# إعداد SSL
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.moeen.health

# إعداد Load Balancer
sudo nano /etc/nginx/sites-available/moeen
```

```nginx
# /etc/nginx/sites-available/moeen
upstream moeen_backend {
    server 127.0.0.1:3000;
    server 127.0.0.1:3001;
    server 127.0.0.1:3002;
}

server {
    listen 80;
    server_name api.moeen.health;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.moeen.health;
    
    ssl_certificate /etc/letsencrypt/live/api.moeen.health/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.moeen.health/privkey.pem;
    
    location / {
        proxy_pass http://moeen_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 4. **Docker Compose للإنتاج**
```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  # Application
  app:
    build:
      context: .
      dockerfile: Dockerfile.prod
    container_name: moeen-app-prod
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
      - JWT_SECRET=${JWT_SECRET}
    restart: unless-stopped
    deploy:
      replicas: 3
      resources:
        limits:
          memory: 2G
          cpus: '1.0'
        reservations:
          memory: 1G
          cpus: '0.5'

  # PostgreSQL
  postgres:
    image: postgres:15-alpine
    container_name: moeen-postgres-prod
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 4G
          cpus: '2.0'

  # Redis
  redis:
    image: redis:7-alpine
    container_name: moeen-redis-prod
    volumes:
      - redis_data:/data
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '0.5'

  # Monitoring
  prometheus:
    image: prom/prometheus
    container_name: moeen-prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
    restart: unless-stopped

  grafana:
    image: grafana/grafana
    container_name: moeen-grafana
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_PASSWORD}
    volumes:
      - grafana_data:/var/lib/grafana
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
  grafana_data:
```

---

## 🔐 إعداد الأمان

### 1. **إعداد Firewall**
```bash
# تثبيت UFW
sudo apt install ufw

# إعداد القواعد
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 3000

# تفعيل Firewall
sudo ufw enable
```

### 2. **إعداد SSL/TLS**
```bash
# تثبيت Certbot
sudo apt install certbot python3-certbot-nginx

# الحصول على شهادة SSL
sudo certbot --nginx -d api.moeen.health -d www.api.moeen.health

# تجديد تلقائي
sudo crontab -e
# إضافة: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 3. **إعداد Monitoring**
```bash
# تثبيت Prometheus
wget https://github.com/prometheus/prometheus/releases/download/v2.45.0/prometheus-2.45.0.linux-amd64.tar.gz
tar xvfz prometheus-2.45.0.linux-amd64.tar.gz
sudo mv prometheus-2.45.0.linux-amd64 /opt/prometheus

# إعداد Grafana
wget https://dl.grafana.com/oss/release/grafana-10.0.0.linux-amd64.tar.gz
tar -zxvf grafana-10.0.0.linux-amd64.tar.gz
sudo mv grafana-10.0.0 /opt/grafana
```

---

## 📊 إعداد النسخ الاحتياطي

### 1. **نسخ احتياطي لقاعدة البيانات**
```bash
#!/bin/bash
# backup-db.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_NAME="moeen_prod"

# إنشاء النسخة الاحتياطية
pg_dump -h localhost -U moeen_user -d $DB_NAME > $BACKUP_DIR/moeen_$DATE.sql

# ضغط الملف
gzip $BACKUP_DIR/moeen_$DATE.sql

# حذف النسخ القديمة (أكثر من 30 يوم)
find $BACKUP_DIR -name "moeen_*.sql.gz" -mtime +30 -delete

echo "Backup completed: moeen_$DATE.sql.gz"
```

### 2. **جدولة النسخ الاحتياطية**
```bash
# إضافة للمهام المجدولة
crontab -e

# نسخ احتياطي يومي في الساعة 2 صباحاً
0 2 * * * /path/to/backup-db.sh

# نسخ احتياطي أسبوعي يوم الأحد
0 3 * * 0 /path/to/backup-weekly.sh
```

---

## 🚀 النشر

### 1. **نشر التطبيق**
```bash
# استنساخ المشروع
git clone https://github.com/ascespade/moeen.git
cd moeen

# نسخ ملف البيئة
cp .env.production.example .env.production

# تشغيل التطبيق
docker-compose -f docker-compose.prod.yml up -d

# التحقق من الحالة
docker-compose -f docker-compose.prod.yml ps
```

### 2. **التحقق من النشر**
```bash
# فحص الصحة
curl https://api.moeen.health/api/health

# فحص قاعدة البيانات
docker-compose -f docker-compose.prod.yml exec postgres psql -U moeen_user -d moeen_prod -c "SELECT COUNT(*) FROM users;"

# فحص Redis
docker-compose -f docker-compose.prod.yml exec redis redis-cli ping
```

---

## 🔧 استكشاف الأخطاء

### 1. **مشاكل شائعة**
```bash
# فحص السجلات
docker-compose logs -f app

# فحص استخدام الموارد
docker stats

# فحص الاتصال بقاعدة البيانات
docker-compose exec app npm run db:test

# إعادة تشغيل الخدمة
docker-compose restart app
```

### 2. **أدوات التشخيص**
```bash
# فحص الأداء
npm run analyze

# فحص الأمان
npm audit

# فحص الجودة
npm run lint
npm run type-check
```

---

## 📞 الدعم

### في حالة المشاكل:
1. راجع السجلات: `docker-compose logs -f`
2. تحقق من الحالة: `docker-compose ps`
3. راجع الدليل: `docs/troubleshooting.md`
4. تواصل مع الفريق: support@moeen.health

---

*تم إعداد هذا الدليل بتاريخ: 2025-01-17*  
*النسخة: 2.0*  
*الحالة: Production-Ready Setup*
