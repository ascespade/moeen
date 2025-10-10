# Dynamic Content & Translation System

This guide explains how to use the dynamic content and translation system that eliminates all hardcoded values and ensures database-driven content.

## 🎯 Overview

The system enforces:
- **No hardcoded strings** - All text comes from translation tables
- **No static data arrays** - All content comes from database
- **No mock files** - All data is live and dynamic
- **No fallback functions** - Empty content instead of hardcoded defaults
- **Dynamic theming** - Theme preferences stored in database
- **Real-time translations** - Language switching with database updates

## 🏗️ Architecture

### Core Components

1. **Dynamic Content Manager** (`src/lib/dynamic-content-manager.ts`)
   - Manages homepage content from database
   - Handles translations with caching
   - Provides CRUD operations for content

2. **Dynamic Theme Manager** (`src/lib/dynamic-theme-manager.ts`)
   - Manages user preferences
   - Handles theme configuration
   - Applies themes dynamically

3. **Enhanced i18n Hook** (`src/hooks/useI18n.ts`)
   - Integrates with dynamic content manager
   - Provides translation function with fallbacks

4. **Cursor Configuration** (`.cursor-config.json`)
   - Enforces dynamic content rules
   - Auto-fixes violations
   - Blocks builds on violations

## 📊 Database Schema

### Tables

```sql
-- User preferences
user_preferences (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  theme VARCHAR(20) DEFAULT 'system',
  language VARCHAR(5) DEFAULT 'ar',
  font_size VARCHAR(10) DEFAULT 'md',
  direction VARCHAR(3) DEFAULT 'rtl'
);

-- Translations
translations (
  id BIGSERIAL PRIMARY KEY,
  locale TEXT CHECK (locale IN ('ar','en')),
  namespace TEXT DEFAULT 'common',
  key TEXT,
  value TEXT,
  UNIQUE(locale, namespace, key)
);

-- Settings (for homepage content)
settings (
  id UUID PRIMARY KEY,
  key VARCHAR(255) UNIQUE,
  value JSONB,
  category VARCHAR(100),
  is_public BOOLEAN DEFAULT false
);
```

## 🚀 Usage

### 1. Homepage Content

```tsx
import { dynamicContentManager, type HomepageContent } from "@/lib/dynamic-content-manager";

export default function HomePage() {
  const [content, setContent] = useState<HomepageContent>({
    heroSlides: [],
    services: [],
    testimonials: [],
    galleryImages: [],
    faqs: []
  });

  useEffect(() => {
    const loadContent = async () => {
      const homepageContent = await dynamicContentManager.getHomepageContent();
      setContent(homepageContent);
    };
    loadContent();
  }, []);

  return (
    <div>
      {content.heroSlides.map(slide => (
        <div key={slide.id}>
          <h1>{slide.title}</h1>
          <p>{slide.description}</p>
        </div>
      ))}
    </div>
  );
}
```

### 2. Translations

```tsx
import { useI18n } from "@/hooks/useI18n";
import { I18N_KEYS } from "@/constants/i18n-keys";

export default function MyComponent() {
  const { t } = useI18n();

  return (
    <div>
      <h1>{t(I18N_KEYS.HOMEPAGE.SERVICES.TITLE, "خدماتنا")}</h1>
      <p>{t(I18N_KEYS.HOMEPAGE.SERVICES.SUBTITLE, "نقدم أفضل الخدمات")}</p>
    </div>
  );
}
```

### 3. Theme Management

```tsx
import { dynamicThemeManager } from "@/lib/dynamic-theme-manager";

// Get user preferences
const preferences = await dynamicThemeManager.getUserPreferences();

// Update theme
await dynamicThemeManager.updateUserPreferences("user_id", { 
  theme: "dark" 
});

// Apply theme
const themeConfig = await dynamicThemeManager.getThemeConfig();
dynamicThemeManager.applyTheme("dark", themeConfig);
```

## 🔧 Configuration

### Cursor Rules

The `.cursor-config.json` enforces these rules:

```json
{
  "rules": {
    "disallowedPatterns": [
      "mock", "fixture", "simulation", "sampleData",
      "const data =", "export const data =",
      "require\\(.+\\.json\\)", "import .+ from .+\\.json",
      "[\"'][^\"']*[\"']\\s*[,;]",
      "getDefault.*\\(\\)", "fallback.*=.*\\["
    ],
    "allowedDataSources": [
      "supabase", "env", "process.env",
      "i18next", "translationsTable",
      "useI18n", "usePageI18n", "t\\(",
      "createClient", "from\\('settings'\\)"
    ]
  }
}
```

## 🛠️ Development Workflow

### 1. Adding New Content

```typescript
// Add to database via dynamic content manager
await dynamicContentManager.updateHomepageContent({
  heroSlides: [...newSlides],
  services: [...newServices]
});
```

### 2. Adding Translations

```typescript
// Add translations
await dynamicContentManager.updateTranslations([
  { locale: "ar", namespace: "common", key: "new.key", value: "قيمة جديدة" },
  { locale: "en", namespace: "common", key: "new.key", value: "New Value" }
]);
```

### 3. Validation

```bash
# Run validation script
npm run validate-dynamic-content

# This will check for violations and block build if found
```

## 📝 Migration Scripts

### Seed Homepage Content

```bash
npm run seed-homepage-content
```

### Apply Database Migrations

```bash
npm run migrate
```

## 🚨 Violations & Fixes

### Common Violations

1. **Hardcoded Strings**
   ```tsx
   // ❌ Bad
   <h1>Welcome to our site</h1>
   
   // ✅ Good
   <h1>{t(I18N_KEYS.WELCOME.TITLE, "Welcome to our site")}</h1>
   ```

2. **Static Arrays**
   ```tsx
   // ❌ Bad
   const services = [
     { id: 1, title: "Service 1" },
     { id: 2, title: "Service 2" }
   ];
   
   // ✅ Good
   const [services, setServices] = useState([]);
   useEffect(() => {
     dynamicContentManager.getHomepageContent().then(setServices);
   }, []);
   ```

3. **Mock Data**
   ```tsx
   // ❌ Bad
   const mockData = { users: [...] };
   
   // ✅ Good
   const { data } = await supabase.from('users').select('*');
   ```

### Auto-Fix Suggestions

The system can automatically:
- Convert hardcoded strings to translation keys
- Replace static arrays with database queries
- Add missing imports for dynamic content
- Suggest dynamic alternatives

## 🔍 Monitoring

### Validation Report

The validation script provides:
- File-by-file violation report
- Violation type categorization
- Severity levels (error/warning)
- Build blocking on violations

### Cursor Integration

Cursor will:
- Highlight violations in real-time
- Suggest fixes automatically
- Block builds on critical violations
- Provide inline documentation

## 🎯 Best Practices

1. **Always use translation keys** for any user-facing text
2. **Load content from database** instead of hardcoded arrays
3. **Use dynamic content manager** for homepage content
4. **Store user preferences** in database, not localStorage
5. **Validate before building** to catch violations early
6. **Use environment variables** for configuration
7. **Cache database queries** for performance
8. **Handle loading states** gracefully
9. **Provide empty states** instead of hardcoded fallbacks
10. **Test with different languages** and themes

## 🚀 Deployment

### Pre-deployment Checklist

- [ ] Run validation script
- [ ] Ensure no hardcoded content
- [ ] Test language switching
- [ ] Test theme switching
- [ ] Verify database connections
- [ ] Check translation completeness
- [ ] Validate user preferences

### Production Considerations

- Database connection pooling
- Translation caching
- Theme configuration caching
- Error handling for database failures
- Fallback strategies for offline scenarios

## 📚 Examples

See the updated `src/app/page.tsx` for a complete example of dynamic content implementation.

## 🤝 Contributing

When adding new features:
1. Use dynamic content manager for data
2. Add translation keys for text
3. Store preferences in database
4. Run validation before committing
5. Update documentation

## 🐛 Troubleshooting

### Common Issues

1. **Translation not loading**: Check database connection and translation keys
2. **Theme not applying**: Verify user preferences and theme configuration
3. **Content not updating**: Clear cache and check database queries
4. **Build failing**: Run validation script to identify violations

### Debug Mode

Enable debug logging:
```typescript
// In development
process.env.NODE_ENV = 'development';
// This will show detailed logs for debugging
```

---

This system ensures your application is fully dynamic, maintainable, and scalable while providing excellent user experience across different languages and themes.