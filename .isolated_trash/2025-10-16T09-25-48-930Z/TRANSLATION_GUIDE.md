# Translation System Guide - دليل نظام الترجمة

## Overview - نظرة عامة

The dynamic translation system provides database-driven internationalization with caching, fallback support, and missing key logging for the healthcare dashboard.

## Architecture - المعمارية

### Components - المكونات

1. **TranslationService** - خدمة الترجمة
   - Fetches translations from API
   - Caches translations in memory and localStorage
   - Handles missing key logging
   - Provides fallback translations

2. **useT Hook** - خطاف الترجمة
   - React hook for accessing translations
   - Automatic re-rendering on language changes
   - Context-based state management

3. **TranslationProvider** - موفر الترجمة
   - Context provider for translation state
   - Language switching functionality
   - Translation loading management

4. **API Endpoints** - نقاط النهاية
   - `/api/translations/[lang]` - Get translations
   - `/api/translations/missing` - Log missing keys

## Usage - الاستخدام

### Basic Usage - الاستخدام الأساسي

```tsx
import { useT } from "@/hooks/useT";

function MyComponent() {
  const { t, language, setLanguage, isLoading } = useT();

  return (
    <div>
      <h1>{t("dashboard.title")}</h1>
      <p>{t("dashboard.welcome")}</p>

      {isLoading && <p>Loading translations...</p>}

      <button onClick={() => setLanguage("en")}>English</button>
      <button onClick={() => setLanguage("ar")}>العربية</button>
    </div>
  );
}
```

### Advanced Usage - الاستخدام المتقدم

```tsx
import { useT } from "@/hooks/useT";
import translationService from "@/lib/i18n/translationService";

function AdvancedComponent() {
  const { t, language } = useT();

  // Get multiple translations at once
  const handleLoadTranslations = async () => {
    const translations = await translationService.getMultiple(
      ["dashboard.title", "dashboard.subtitle", "dashboard.metrics"],
      language,
    );

    console.log(translations);
  };

  // Check missing keys
  const missingCount = translationService.getMissingKeysCount();

  return (
    <div>
      <h1>{t("dashboard.title")}</h1>
      <p>Missing translations: {missingCount}</p>
      <button onClick={handleLoadTranslations}>Load Translations</button>
    </div>
  );
}
```

## Translation Keys - مفاتيح الترجمة

### Naming Convention - اتفاقية التسمية

Use dot notation for hierarchical organization:

```
common.welcome
common.hello
common.goodbye
dashboard.title
dashboard.overview
dashboard.metrics
theme.light
theme.dark
theme.system
language.arabic
language.english
patient.title
doctor.title
staff.title
admin.title
appointment.title
payment.title
insurance.title
```

### Key Structure - هيكل المفاتيح

- **common.** - Common UI elements
- **dashboard.** - Dashboard-specific content
- **theme.** - Theme-related labels
- **language.** - Language selection
- **patient.** - Patient-related content
- **doctor.** - Doctor-related content
- **staff.** - Staff-related content
- **admin.** - Admin-related content
- **appointment.** - Appointment-related content
- **payment.** - Payment-related content
- **insurance.** - Insurance-related content

## Database Schema - مخطط قاعدة البيانات

### Tables - الجداول

#### translations

```sql
CREATE TABLE translations (
  id BIGSERIAL PRIMARY KEY,
  locale TEXT NOT NULL CHECK (locale IN ('ar','en')),
  namespace TEXT NOT NULL DEFAULT 'common',
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(locale, namespace, key)
);
```

#### missing_translations

```sql
CREATE TABLE missing_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  language TEXT NOT NULL,
  key TEXT NOT NULL,
  requested_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### languages

```sql
CREATE TABLE languages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  direction TEXT DEFAULT 'rtl' CHECK (direction IN ('ltr', 'rtl')),
  created_at TIMESTAMP DEFAULT NOW()
);
```

## API Reference - مرجع API

### GET /api/translations/[lang]

Get translations for a specific language.

**Parameters:**

- `lang` (string): Language code (ar, en)

**Response:**

```json
{
  "common.welcome": "مرحباً",
  "common.hello": "أهلاً وسهلاً",
  "dashboard.title": "لوحة التحكم"
}
```

**Headers:**

- `Cache-Control: public, max-age=3600, stale-while-revalidate=86400`

### POST /api/translations/missing

Log missing translation keys.

**Body:**

```json
{
  "language": "ar",
  "key": "dashboard.new_feature",
  "requestedAt": "2025-10-15T12:00:00Z"
}
```

**Response:**

```json
{
  "success": true,
  "data": { "id": "uuid" }
}
```

## Caching Strategy - استراتيجية التخزين المؤقت

### Memory Cache - التخزين المؤقت في الذاكرة

- **Expiry**: 1 hour (3600000ms)
- **Storage**: In-memory object
- **Key**: Language code
- **Value**: Translations object with timestamp

### localStorage Cache - التخزين المؤقت في localStorage

- **Key**: `translations_${language}`
- **Value**: JSON string of cached translations
- **Fallback**: Used when API is unavailable
- **Cleanup**: Automatic on cache expiry

## Error Handling - معالجة الأخطاء

### Fallback Chain - سلسلة الاحتياط

1. **Cached translations** (memory)
2. **localStorage translations** (offline)
3. **Default translations** (hardcoded)
4. **Translation key** (final fallback)

### Error Scenarios - سيناريوهات الخطأ

1. **API unavailable**: Use localStorage cache
2. **Invalid language**: Fallback to default language
3. **Missing key**: Log and return key as fallback
4. **Cache corruption**: Clear cache and reload

## RTL Support - دعم الكتابة من اليمين لليسار

### Language Direction - اتجاه اللغة

- **Arabic (ar)**: RTL (right-to-left)
- **English (en)**: LTR (left-to-right)

### Implementation - التنفيذ

```tsx
// Automatic direction detection
const isRTL = language === "ar";
document.documentElement.setAttribute("dir", isRTL ? "rtl" : "ltr");
```

## Performance Optimization - تحسين الأداء

### Best Practices - أفضل الممارسات

1. **Batch translations**: Use `getMultiple()` for multiple keys
2. **Lazy loading**: Load translations only when needed
3. **Cache management**: Clear cache when switching users
4. **Key optimization**: Use short, descriptive keys

### Monitoring - المراقبة

- **Missing key count**: Track untranslated content
- **Cache hit rate**: Monitor translation loading performance
- **API response time**: Track translation API performance

## Development Workflow - سير عمل التطوير

### Adding New Translations - إضافة ترجمات جديدة

1. **Add key to component**:

   ```tsx
   <h1>{t("new.feature.title")}</h1>
   ```

2. **Key will be logged** as missing automatically

3. **Add translation to database**:

   ```sql
   INSERT INTO translations (locale, key, value) VALUES
   ('ar', 'new.feature.title', 'الميزة الجديدة'),
   ('en', 'new.feature.title', 'New Feature');
   ```

4. **Translation will be cached** on next load

### Testing Translations - اختبار الترجمات

```tsx
// Test component with different languages
function TestTranslations() {
  const { t, setLanguage } = useT();

  return (
    <div>
      <h1>{t("dashboard.title")}</h1>
      <button onClick={() => setLanguage("ar")}>عربي</button>
      <button onClick={() => setLanguage("en")}>English</button>
    </div>
  );
}
```

## Troubleshooting - استكشاف الأخطاء وإصلاحها

### Common Issues - المشاكل الشائعة

1. **Translations not loading**:
   - Check API endpoint availability
   - Verify database connection
   - Check browser console for errors

2. **Missing translations**:
   - Check missing_translations table
   - Verify key naming convention
   - Ensure translations are in database

3. **RTL layout issues**:
   - Check document direction attribute
   - Verify language setting
   - Test with different browsers

4. **Cache issues**:
   - Clear localStorage
   - Restart application
   - Check cache expiry settings

### Debug Mode - وضع التصحيح

Enable debug logging:

```tsx
// In development
if (process.env.NODE_ENV === "development") {
  console.log("Translation service debug:", {
    language,
    cached: translationService.getCachedTranslations(language),
    missing: translationService.getMissingKeys(),
  });
}
```

## Migration Guide - دليل الترحيل

### From Static Translations - من الترجمات الثابتة

1. **Replace static strings**:

   ```tsx
   // Before
   <h1>Dashboard</h1>

   // After
   <h1>{t('dashboard.title')}</h1>
   ```

2. **Wrap components** with TranslationProvider:

   ```tsx
   <TranslationProvider>
     <App />
   </TranslationProvider>
   ```

3. **Update imports**:
   ```tsx
   import { useT } from "@/hooks/useT";
   ```

## Support - الدعم

For technical support and questions about the translation system, please refer to the project documentation or contact the development team.
