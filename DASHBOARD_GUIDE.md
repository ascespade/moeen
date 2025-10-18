# Healthcare Dashboard Guide - دليل لوحة التحكم الصحية

## Overview - نظرة عامة

This guide covers the comprehensive healthcare dashboard system with role-based access control, dynamic translations, theme management, and RTL support.

## Features - الميزات

### 1. Role-Based Access Control (RBAC) - نظام التحكم في الوصول القائم على الأدوار

The system supports five distinct user roles:

- **Patient** - المريض: Access to personal dashboard, appointments, and medical records
- **Doctor** - الطبيب: Access to patient files, medical records, and appointment management
- **Staff** - الموظف: Patient registration, appointment scheduling, and basic operations
- **Supervisor** - المشرف: Staff management, reports, and oversight functions
- **Admin** - المدير: Full system access and administration

### 2. Dynamic Translation System - نظام الترجمة الديناميكي

- **Database-driven translations** with caching
- **Automatic fallback** to default language
- **Missing key logging** for translation management
- **RTL/LTR support** for Arabic and English
- **useT() hook** for easy component integration

#### Usage - الاستخدام

```tsx
import { useT } from '@/hooks/useT';

function MyComponent() {
  const { t, language, setLanguage } = useT();

  return (
    <div>
      <h1>{t('dashboard.title')}</h1>
      <button onClick={() => setLanguage('en')}>{t('language.english')}</button>
    </div>
  );
}
```

### 3. Theme System - نظام الثيم

- **Light/Dark/System** theme support
- **RTL compatibility** for Arabic interface
- **CSS variables** for consistent theming
- **Persistent preferences** in localStorage

#### Usage - الاستخدام

```tsx
import { useTheme } from '@/context/ThemeContext';
import ThemeSwitcher from '@/components/ThemeSwitcher';

function MyComponent() {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <div>
      <ThemeSwitcher />
      <p>Current theme: {theme}</p>
    </div>
  );
}
```

### 4. Chart Components - مكونات الرسوم البيانية

RTL-compatible charts with brand colors and theme support:

- **AreaChart** - الرسم البياني المساحي
- **BarChart** - الرسم البياني العمودي
- **PieChart** - الرسم البياني الدائري
- **LineChart** - الرسم البياني الخطي

#### Usage - الاستخدام

```tsx
import { AreaChart, BarChart, PieChart, LineChart } from '@/components/charts';

const data = [
  { month: 'Jan', patients: 100, revenue: 5000 },
  { month: 'Feb', patients: 120, revenue: 6000 },
];

<AreaChart
  data={data}
  dataKey='patients'
  xAxisKey='month'
  areas={[
    { dataKey: 'patients', color: 'var(--brand-primary)', name: 'Patients' },
    { dataKey: 'revenue', color: 'var(--brand-accent)', name: 'Revenue' },
  ]}
/>;
```

### 5. Design System - نظام التصميم

- **Solid brand colors** with minimal gradients
- **Consistent spacing** and typography
- **RTL support** throughout
- **Dark mode** compatibility

#### Brand Colors - الألوان الأساسية

- **Primary Orange**: #E46C0A
- **Secondary Brown**: #6B4E16
- **Neutral Beige**: #F2E7DC
- **Accent Deep**: #C93C00

## API Endpoints - نقاط النهاية

### Dashboard Metrics

- `GET /api/dashboard/metrics` - System health and metrics
- `GET /api/dashboard/health` - Health check endpoint

### Translations

- `GET /api/translations/[lang]` - Get translations for language
- `POST /api/translations/missing` - Log missing translation keys

### Healthcare

- `GET /api/healthcare/patients` - Patient management
- `GET /api/healthcare/appointments` - Appointment management

## Database Schema - مخطط قاعدة البيانات

### Core Tables - الجداول الأساسية

- **users** - User accounts with roles
- **roles** - System roles and permissions
- **patients** - Patient records
- **doctors** - Doctor profiles
- **appointments** - Appointment bookings
- **insurance_claims** - Insurance claims
- **payments** - Payment records
- **translations** - Dynamic translations
- **languages** - Supported languages
- **reports_admin** - Administrative reports
- **system_metrics** - System performance metrics

## Setup Instructions - تعليمات الإعداد

1. **Install dependencies**:

   ```bash
   npm ci
   ```

2. **Set up environment variables**:

   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Run database migrations**:

   ```bash
   # Migrations are in supabase/migrations/
   # Apply them through Supabase dashboard or CLI
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

## RTL Support - دعم الكتابة من اليمين لليسار

The system fully supports RTL (Right-to-Left) text direction for Arabic:

- **Automatic direction detection** based on language
- **Chart components** adapt to RTL layout
- **CSS logical properties** for consistent spacing
- **Icon and layout mirroring** for RTL interface

## Performance Considerations - اعتبارات الأداء

- **Translation caching** with 1-hour expiry
- **Chart virtualization** for large datasets
- **Lazy loading** of non-critical components
- **Image optimization** with fallback placeholders

## Security - الأمان

- **Row Level Security (RLS)** on all database tables
- **Role-based access control** at API and UI levels
- **Input validation** and sanitization
- **CSRF protection** on all forms

## Troubleshooting - استكشاف الأخطاء وإصلاحها

### Common Issues - المشاكل الشائعة

1. **Translations not loading**: Check API endpoint and database connection
2. **Theme not persisting**: Verify localStorage is enabled
3. **Charts not rendering**: Ensure Recharts is properly installed
4. **RTL layout issues**: Check document direction attribute

### Debug Mode - وضع التصحيح

Enable debug mode by setting `NEXT_PUBLIC_ENABLE_DEBUG=true` in environment variables.

## Support - الدعم

For technical support and questions, please refer to the project documentation or contact the development team.
