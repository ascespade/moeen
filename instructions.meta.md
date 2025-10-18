# 🤖 إرشادات الـ Agent الذكي

## 📋 نظرة عامة
هذا الملف يحتوي على جميع الإرشادات والاستراتيجيات التي يجب على الـ Agent اتباعها عند العمل على المشروع.

## 🎯 الأهداف الرئيسية
1. **التحسين المستمر**: فحص وتحسين الكود تلقائيًا
2. **جودة عالية**: الحفاظ على معايير الكود والاختبارات
3. **الأمان**: فحص الثغرات الأمنية وإصلاحها
4. **الأداء**: تحسين سرعة التطبيق وموارده
5. **التوثيق**: الحفاظ على التوثيق محدثًا

## 🔄 دورة العمل (Workflow)

### 1. فحص التغييرات
```bash
# فحص الملفات المعدلة
git diff --name-only HEAD~1 HEAD

# فحص حالة Git
git status --porcelain
```

### 2. تحليل الكود
- فحص ESLint errors
- فحص TypeScript errors
- فحص test coverage
- فحص security vulnerabilities
- فحص performance issues

### 3. الإصلاح التلقائي
- إصلاح ESLint errors البسيطة
- إصلاح TypeScript errors
- إضافة tests للكود الجديد
- تحسين performance
- إصلاح security issues

### 4. التحسين
- إزالة الكود غير المستخدم
- دمج الكود المكرر
- تحسين naming conventions
- تحسين file structure
- تحسين imports/exports

### 5. الاختبار
```bash
# تشغيل جميع الاختبارات
npm run test:full-suite

# فحص coverage
npm run test:coverage

# فحص linting
npm run lint:check

# فحص types
npm run type:check
```

## 📁 إدارة الملفات

### الملفات الجديدة
- يجب أن تكون في المجلد المناسب حسب النوع
- يجب أن تحتوي على JSDoc comments
- يجب أن تحتوي على tests
- يجب أن تتبع naming conventions

### الملفات المحذوفة
- نقل إلى `__deprecated__/` بدلاً من الحذف المباشر
- إضافة comment يوضح سبب الإزالة
- تحديث imports في الملفات الأخرى

### الملفات المعدلة
- الحفاظ على backward compatibility
- إضافة tests للوظائف الجديدة
- تحديث التوثيق
- فحص تأثير التغيير على الملفات الأخرى

## 🧪 معايير الاختبار

### Coverage Requirements
- **Minimum**: 80% overall coverage
- **Critical files**: 95% coverage
- **New code**: 100% coverage

### Test Types
1. **Unit Tests**: لكل function/component
2. **Integration Tests**: للتفاعل بين المكونات
3. **E2E Tests**: للـ user flows المهمة
4. **Performance Tests**: للـ critical paths

### Test Naming
```javascript
// ✅ Good
describe('UserService', () => {
  describe('createUser', () => {
    it('should create user with valid data', () => {})
    it('should throw error with invalid email', () => {})
  })
})

// ❌ Bad
describe('test', () => {
  it('works', () => {})
})
```

## 🔒 معايير الأمان

### Data Validation
- تحقق من جميع user inputs
- استخدام proper sanitization
- تجنب SQL injection
- تجنب XSS attacks

### Authentication & Authorization
- فحص JWT tokens
- فحص user permissions
- فحص rate limiting
- فحص CORS settings

### Dependencies
- فحص security vulnerabilities
- تحديث dependencies القديمة
- إزالة unused dependencies

## ⚡ معايير الأداء

### Frontend
- تحسين bundle size
- استخدام lazy loading
- تحسين images
- تحسين CSS
- تحسين JavaScript execution

### Backend
- تحسين database queries
- استخدام caching
- تحسين API responses
- تحسين memory usage

### General
- فحص Core Web Vitals
- تحسين loading times
- تحسين resource usage

## 📝 معايير التوثيق

### Code Comments
```javascript
/**
 * Creates a new user with the provided data
 * @param {Object} userData - User information
 * @param {string} userData.email - User email address
 * @param {string} userData.name - User full name
 * @param {string} userData.password - User password (will be hashed)
 * @returns {Promise<Object>} Created user object
 * @throws {ValidationError} When user data is invalid
 * @throws {ConflictError} When user already exists
 */
async function createUser(userData) {
  // Implementation
}
```

### README Files
- تحديث installation instructions
- تحديث usage examples
- تحديث API documentation
- تحديث troubleshooting guide

## 🚨 معالجة الأخطاء

### Error Handling Strategy
1. **Log the error** with proper context
2. **Notify the user** with helpful message
3. **Attempt recovery** if possible
4. **Report to monitoring** if critical
5. **Update documentation** if needed

### Error Types
- **ValidationError**: User input errors
- **AuthenticationError**: Auth failures
- **AuthorizationError**: Permission denied
- **NetworkError**: API/Network issues
- **SystemError**: Internal system errors

## 🔄 Git Workflow

### Branch Strategy
- `main`: Production-ready code
- `develop`: Integration branch
- `feature/*`: New features
- `hotfix/*`: Critical fixes
- `release/*`: Release preparation

### Commit Messages
```
type(scope): description

feat(auth): add JWT token validation
fix(api): resolve user creation bug
docs(readme): update installation guide
test(user): add unit tests for user service
refactor(utils): simplify date formatting
```

### Pull Request Process
1. Create feature branch
2. Make changes with tests
3. Run all checks locally
4. Create PR with description
5. Wait for CI/CD approval
6. Merge after review

## 📊 Monitoring & Metrics

### Key Metrics
- **Performance**: Response time, throughput
- **Quality**: Test coverage, bug count
- **Security**: Vulnerability count, failed auths
- **Usage**: User activity, feature adoption

### Alerts
- Test failures
- Security vulnerabilities
- Performance degradation
- Error rate increase
- Coverage drop

## 🎨 Code Style Guidelines

### JavaScript/TypeScript
- استخدام const/let بدلاً من var
- استخدام arrow functions عند المناسب
- استخدام template literals
- استخدام destructuring
- تجنب nested callbacks

### React Components
- استخدام functional components
- استخدام hooks بدلاً من class components
- استخدام proper prop types
- تجنب inline styles
- استخدام proper key props

### CSS/Styling
- استخدام CSS modules أو styled-components
- تجنب inline styles
- استخدام semantic class names
- تجنب !important
- استخدام responsive design

## 🔧 Tools Integration

### ESLint Rules
- استخدام recommended rules
- إضافة custom rules للمشروع
- فحص accessibility
- فحص performance

### Prettier Configuration
- استخدام consistent formatting
- تجنب conflicts مع ESLint
- استخدام proper line endings

### TypeScript Configuration
- استخدام strict mode
- فحص all files
- استخدام proper types
- تجنب any type

## 📈 Continuous Improvement

### Weekly Tasks
- فحص dependencies updates
- تحليل performance metrics
- مراجعة error logs
- تحديث documentation
- تحسين test coverage

### Monthly Tasks
- مراجعة architecture
- تحليل user feedback
- تحديث security policies
- تحسين monitoring
- تدريب team على best practices

## 🚀 Deployment Strategy

### Pre-deployment
- تشغيل جميع الاختبارات
- فحص security scan
- فحص performance test
- مراجعة configuration
- إعداد rollback plan

### Post-deployment
- مراقبة metrics
- فحص error logs
- مراجعة user feedback
- تحديث documentation
- إعداد next iteration

---

## 📞 Emergency Procedures

### Critical Bug
1. إنشاء hotfix branch
2. إصلاح المشكلة
3. تشغيل tests
4. deploy فوري
5. مراقبة النتائج

### Security Issue
1. تقييم الخطر
2. إصلاح فوري
3. إشعار المستخدمين
4. تحديث security policies
5. مراجعة شاملة

### Performance Issue
1. تحديد السبب
2. تطبيق quick fix
3. مراقبة التحسن
4. تطبيق permanent solution
5. تحسين monitoring

---

*آخر تحديث: ${new Date().toISOString()}*
