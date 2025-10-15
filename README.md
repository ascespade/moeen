# 🏥 Healthcare Management System - نظام إدارة الرعاية الصحية

A comprehensive, modern healthcare management system built with Next.js 14, TypeScript, and Supabase. Designed for medical centers to manage patients, appointments, payments, and insurance claims efficiently.

## ✨ Features - المميزات

### 🏗️ **Core System**
- **Multi-role Dashboard** - لوحات تحكم متعددة الأدوار
- **Patient Management** - إدارة المرضى
- **Appointment Scheduling** - جدولة المواعيد
- **Payment Processing** - معالجة المدفوعات
- **Insurance Claims** - مطالبات التأمين
- **Real-time Notifications** - إشعارات فورية
- **Comprehensive Reporting** - تقارير شاملة

### 🎨 **User Experience**
- **RTL Support** - دعم اللغة العربية
- **Dark/Light Theme** - ثيم فاتح وداكن
- **Responsive Design** - تصميم متجاوب
- **Accessibility** - إمكانية الوصول
- **Multi-language** - متعدد اللغات

### 🔒 **Security & Compliance**
- **Role-based Access Control** - تحكم في الوصول
- **Data Encryption** - تشفير البيانات
- **Audit Logging** - تسجيل العمليات
- **GDPR Compliance** - امتثال GDPR
- **HIPAA Ready** - جاهز لـ HIPAA

## 🚀 Quick Start - البدء السريع

### Prerequisites - المتطلبات
- Node.js 18+
- npm or yarn
- Supabase account

### Installation - التثبيت

```bash
# Clone the repository
git clone https://github.com/your-org/healthcare-system.git
cd healthcare-system

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Configure your environment variables
# Edit .env.local with your Supabase credentials

# Run database migrations
npm run migrate

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🏗️ Architecture - البنية المعمارية

### Technology Stack - التقنيات المستخدمة

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 14, React, TypeScript | User interface |
| **Styling** | Tailwind CSS, CSS Modules | Styling and theming |
| **State** | Zustand, React Query | State management |
| **Backend** | Next.js API Routes | Server-side logic |
| **Database** | Supabase (PostgreSQL) | Data storage |
| **Auth** | Supabase Auth | Authentication |
| **Payments** | Stripe, Moyasar | Payment processing |
| **Deployment** | Vercel | Hosting and CI/CD |

### Project Structure - هيكل المشروع

```
src/
├── core/                   # Core system modules
│   ├── types/             # TypeScript definitions
│   ├── config/            # Configuration management
│   ├── validation/        # Data validation schemas
│   ├── errors/            # Error handling system
│   ├── utils/             # Utility functions
│   ├── store/             # State management (Zustand)
│   ├── hooks/             # Custom React hooks
│   └── api/               # API client and handlers
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── forms/            # Form components
│   ├── charts/           # Chart components
│   └── layout/           # Layout components
├── app/                   # Next.js App Router
│   ├── (auth)/           # Authentication pages
│   ├── (patient)/        # Patient dashboard
│   ├── (doctor)/         # Doctor dashboard
│   ├── (staff)/          # Staff dashboard
│   ├── (admin)/          # Admin dashboard
│   └── api/              # API routes
└── lib/                   # External libraries
    ├── supabase/         # Database client
    ├── auth/             # Authentication logic
    ├── payments/         # Payment processing
    └── notifications/    # Notification services
```

## 🎯 User Roles - أدوار المستخدمين

### 👤 **Patient - المريض**
- View personal medical records
- Schedule appointments
- Track payment status
- Manage insurance claims
- Receive notifications

### 👨‍⚕️ **Doctor - الطبيب**
- View patient records
- Manage appointments
- Add medical notes
- Prescribe medications
- Access patient history

### 👩‍💼 **Staff - الموظف**
- Register new patients
- Process payments
- Manage appointments
- Handle insurance claims
- Generate reports

### 👨‍💻 **Supervisor - المشرف**
- Oversee staff activities
- Approve insurance claims
- Monitor system performance
- Generate analytics
- Manage user permissions

### 🔧 **Admin - المدير**
- Full system access
- User management
- System configuration
- Database management
- Security monitoring

## 🔧 Configuration - التكوين

### Environment Variables - متغيرات البيئة

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Database
DATABASE_URL=your_database_url

# Authentication
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h

# Payment Gateways
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
MOYASAR_SECRET_KEY=your_moyasar_secret_key

# Insurance Providers
SEHA_API_URL=your_seha_api_url
SEHA_API_KEY=your_seha_api_key
SHOON_API_URL=your_shoon_api_url
SHOON_API_KEY=your_shoon_api_key

# Notifications
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
SMS_API_KEY=your_sms_api_key

# File Upload
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,application/pdf
```

## 📊 Database Schema - مخطط قاعدة البيانات

### Core Tables - الجداول الأساسية

```sql
-- Users and Authentication
users (id, email, role, profile, preferences, created_at)
roles (role, description, permissions)

-- Medical Records
patients (id, user_id, medical_record_number, insurance_info, emergency_contact)
doctors (id, user_id, speciality, license_number, schedule, experience)
medical_records (id, patient_id, record_type, content, attachments)

-- Appointments and Scheduling
appointments (id, patient_id, doctor_id, scheduled_at, status, notes)
doctor_availability (id, doctor_id, date, time_slots)

-- Financial Management
payments (id, appointment_id, amount, method, status, transaction_id)
insurance_claims (id, patient_id, provider, status, amount, documents)

-- System Management
notifications (id, user_id, type, message, channels, status)
audit_logs (id, action, user_id, resource_type, resource_id, metadata)
system_config (id, key, value, category, description)
```

## 🚀 Deployment - النشر

### Vercel Deployment - النشر على Vercel

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel --prod
   ```

2. **Configure Environment Variables**
   - Add all required environment variables in Vercel dashboard
   - Set up Supabase project
   - Configure payment gateways

3. **Database Setup**
   ```bash
   # Run migrations
   npm run migrate
   
   # Seed initial data
   npm run seed
   ```

### Docker Deployment - النشر باستخدام Docker

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

```bash
# Build and run
docker build -t healthcare-system .
docker run -p 3000:3000 healthcare-system
```

## 🧪 Testing - الاختبار

### Running Tests - تشغيل الاختبارات

```bash
# Unit tests
npm run test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

### Test Structure - هيكل الاختبارات

```
tests/
├── unit/                  # Unit tests
│   ├── components/       # Component tests
│   ├── hooks/           # Hook tests
│   └── utils/           # Utility tests
├── integration/          # Integration tests
│   ├── api/             # API tests
│   └── database/        # Database tests
└── e2e/                 # End-to-end tests
    ├── auth/            # Authentication flows
    ├── appointments/    # Appointment flows
    └── payments/        # Payment flows
```

## 📈 Performance - الأداء

### Optimization Strategies - استراتيجيات التحسين

- **Code Splitting** - تقسيم الكود
- **Image Optimization** - تحسين الصور
- **Database Indexing** - فهرسة قاعدة البيانات
- **Caching** - التخزين المؤقت
- **CDN Integration** - تكامل CDN

### Monitoring - المراقبة

- **Error Tracking** - تتبع الأخطاء
- **Performance Metrics** - مقاييس الأداء
- **User Analytics** - تحليلات المستخدم
- **Database Performance** - أداء قاعدة البيانات

## 🔒 Security - الأمان

### Security Features - المميزات الأمنية

- **Authentication** - المصادقة
- **Authorization** - التفويض
- **Data Encryption** - تشفير البيانات
- **Input Validation** - التحقق من المدخلات
- **SQL Injection Prevention** - منع حقن SQL
- **XSS Protection** - حماية XSS
- **CSRF Protection** - حماية CSRF

### Compliance - الامتثال

- **GDPR** - اللائحة العامة لحماية البيانات
- **HIPAA** - قانون قابلية النقل والمساءلة للتأمين الصحي
- **SOC 2** - معيار أمان الخدمة
- **ISO 27001** - معيار أمان المعلومات

## 🤝 Contributing - المساهمة

### Development Workflow - سير عمل التطوير

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Write tests**
5. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Code Standards - معايير الكود

- Follow TypeScript best practices
- Use ESLint and Prettier
- Write comprehensive tests
- Document your code
- Follow naming conventions

## 📚 Documentation - الوثائق

### Available Documentation - الوثائق المتاحة

- [Architecture Guide](docs/ARCHITECTURE.md) - دليل البنية المعمارية
- [Developer Guide](docs/DEVELOPER_GUIDE.md) - دليل المطور
- [API Documentation](docs/API.md) - وثائق API
- [Deployment Guide](docs/DEPLOYMENT.md) - دليل النشر
- [User Manual](docs/USER_MANUAL.md) - دليل المستخدم

## 🐛 Troubleshooting - استكشاف الأخطاء

### Common Issues - المشاكل الشائعة

#### Build Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

#### Database Connection
- Check Supabase credentials
- Verify network connectivity
- Check RLS policies

#### Authentication Issues
- Verify JWT configuration
- Check token expiration
- Validate user permissions

## 📞 Support - الدعم

### Getting Help - الحصول على المساعدة

- **Documentation** - Check the docs first
- **Issues** - Create a GitHub issue
- **Discussions** - Use GitHub discussions
- **Email** - Contact support team

### Community - المجتمع

- **GitHub** - [Repository](https://github.com/your-org/healthcare-system)
- **Discord** - [Community Server](https://discord.gg/your-server)
- **Twitter** - [@YourHandle](https://twitter.com/yourhandle)

## 📄 License - الترخيص

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments - الشكر والتقدير

- **Next.js Team** - For the amazing framework
- **Supabase Team** - For the backend platform
- **Tailwind CSS Team** - For the utility-first CSS
- **Open Source Community** - For the amazing tools and libraries

---

**Built with ❤️ for the healthcare community**

For more information, visit our [website](https://your-website.com) or contact us at [support@your-domain.com](mailto:support@your-domain.com).