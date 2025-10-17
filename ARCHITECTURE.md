# 🏗️ معمارية النظام - System Architecture

## نظرة عامة

**معين - Moeen** هو نظام متكامل لإدارة المراكز الصحية مبني بأحدث التقنيات.

---

## 📚 التقنيات المستخدمة

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS
- **Zustand / Jotai** - State management

### Backend
- **Next.js API Routes** - Server-side API
- **Supabase** - PostgreSQL + Auth + Realtime
- **Row Level Security (RLS)** - Database security

### Authentication
- **Supabase Auth** - JWT-based authentication
- **Role-based access control (RBAC)**

### Security
- **AES-256 Encryption** (crypto-js)
- **HTTPS** enforced
- **Content Security Policy (CSP)**
- **Row Level Security (RLS)**

---

## 🗂️ هيكل المشروع

```
moeen/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Authentication pages
│   │   ├── (admin)/           # Admin pages
│   │   ├── (health)/          # Health pages
│   │   ├── (marketing)/       # Public pages
│   │   ├── api/               # API routes
│   │   └── layout.tsx         # Root layout
│   │
│   ├── components/             # React components
│   │   ├── ui/                # Base UI components
│   │   ├── common/            # Shared components
│   │   ├── layout/            # Layout components
│   │   └── features/          # Feature components
│   │
│   ├── lib/                    # Utilities & helpers
│   │   ├── supabase/          # Supabase client
│   │   ├── encryption.ts      # Encryption utilities
│   │   ├── design-tokens.ts   # Design system
│   │   ├── seo/               # SEO utilities
│   │   └── accessibility/     # A11y utilities
│   │
│   ├── hooks/                  # Custom React hooks
│   ├── context/                # React contexts
│   ├── core/                   # Core business logic
│   │   ├── api/               # API client
│   │   ├── validation/        # Zod schemas
│   │   └── utils/             # Core utilities
│   │
│   └── styles/                 # Global styles
│
├── supabase/
│   └── migrations/             # Database migrations
│
├── public/                     # Static assets
├── tests/                      # Test files
└── docs/                       # Documentation
```

---

## 🔄 Data Flow

```
User Interface (Components)
         ↓
    React Hooks (useAuth, useData)
         ↓
    API Client (src/core/api)
         ↓
    Next.js API Routes (/api)
         ↓
    Supabase Client
         ↓
    PostgreSQL Database (with RLS)
```

---

## 🔐 Security Architecture

### 1. Authentication Flow

```
Client → Login Request → API Route → Supabase Auth
                              ↓
                         JWT Token
                              ↓
                         Client Storage (httpOnly cookie)
                              ↓
                    Subsequent requests (with JWT)
```

### 2. Authorization (RLS)

```sql
-- Example RLS Policy
CREATE POLICY "users_select_own" ON users
  FOR SELECT USING (auth.uid() = id);
```

كل جدول محمي بـ RLS policies:
- Users can only see their own data
- Admins have full access
- Doctors can see their patients
- Staff have read access

### 3. Data Encryption

- **API Keys**: Encrypted with AES-256
- **Passwords**: Hashed by Supabase Auth
- **Sensitive Data**: Encrypted before storage

---

## 📡 API Architecture

### RESTful Endpoints

```
/api/auth/
  - POST /login
  - POST /register
  - POST /logout
  - POST /forgot-password

/api/appointments/
  - GET /             (list)
  - POST /            (create)
  - GET /:id          (read)
  - PUT /:id          (update)
  - DELETE /:id       (delete)

/api/patients/
  - GET /
  - POST /
  - GET /:id
  - PUT /:id

... (similar pattern for all resources)
```

### Response Format

```typescript
// Success
{
  "success": true,
  "data": { ... },
  "message": "عملية ناجحة"
}

// Error
{
  "success": false,
  "error": "رسالة الخطأ",
  "code": "ERROR_CODE"
}
```

---

## 🎨 Design System

### Design Tokens

```typescript
// src/lib/design-tokens.ts
export const tokens = {
  colors: {
    brand: {
      primary: 'var(--brand-primary)',
      secondary: 'var(--brand-secondary)',
      // ...
    },
  },
  spacing: { ... },
  typography: { ... },
  // ...
};
```

### Component Library

```
src/components/ui/
  - Button.tsx
  - Input.tsx
  - Card.tsx
  - Modal.tsx
  - ... (30+ components)
```

---

## 🗃️ Database Schema

### Core Tables

```sql
users
  - id (UUID, PK)
  - email (VARCHAR)
  - name (VARCHAR)
  - created_at (TIMESTAMP)

patients
  - id (UUID, PK)
  - user_id (UUID, FK → users)
  - medical_number (VARCHAR)
  - insurance_id (UUID, FK → insurance_companies)

appointments
  - id (UUID, PK)
  - patient_id (UUID, FK → patients)
  - doctor_id (UUID, FK → doctors)
  - date (TIMESTAMP)
  - status (ENUM)

... (23 total tables)
```

### Relationships

```
users ←→ patients (1:1)
users ←→ doctors (1:1)
patients ←→ appointments (1:N)
doctors ←→ appointments (1:N)
patients ←→ medical_records (1:N)
... (complex relationships)
```

---

## 🔌 Integrations

### WhatsApp Business API

```typescript
// src/lib/api/whatsapp.ts
async function sendMessage(to: string, message: string) {
  const response = await fetch(
    `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to,
        text: { body: message },
      }),
    }
  );
  return response.json();
}
```

### Google Calendar

- OAuth 2.0 authentication
- Bidirectional sync
- Automatic reminders

### Stripe Payments

- Payment processing
- Subscription management
- Webhooks for events

---

## 🧪 Testing Strategy

### Unit Tests

```typescript
// __tests__/components/Button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui';

test('renders button with text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

### E2E Tests (Playwright)

```typescript
// tests/auth/login.spec.ts
test('user can login', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[name="email"]', 'user@example.com');
  await page.fill('[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/dashboard');
});
```

---

## 📊 Performance Optimization

### Bundle Splitting

```javascript
// next.config.js
module.exports = {
  webpack: (config) => {
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        react: { /* React bundle */ },
        ui: { /* UI components bundle */ },
        vendor: { /* Other vendors */ },
      },
    };
    return config;
  },
};
```

### Image Optimization

- Next.js Image component
- WebP/AVIF support
- Lazy loading

### Code Splitting

```typescript
// Lazy load heavy components
const HeavyChart = dynamic(() => import('@/components/HeavyChart'), {
  loading: () => <Skeleton />,
  ssr: false,
});
```

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables

```bash
# Production .env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE=eyJ...
ENCRYPTION_KEY=your-32-char-encryption-key
```

---

## 📈 Monitoring & Logging

### Logging

```typescript
// src/lib/monitoring/logger.ts
import { logger } from '@/lib/monitoring/logger';

logger.info('User logged in', { userId: user.id });
logger.error('Payment failed', error, 'payments');
```

### Error Tracking

- Sentry (recommended)
- Custom error boundary
- API error logging

---

## 🔄 CI/CD Pipeline

### GitHub Actions

```yaml
name: CI/CD
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install
        run: npm ci
      - name: TypeScript
        run: npm run type-check
      - name: Lint
        run: npm run lint
      - name: Test
        run: npm run test
```

---

## 📞 Support & Maintenance

- **Issues**: GitHub Issues
- **Security**: security@moeen.sa
- **Support**: support@moeen.sa

---

**Version**: 1.0.0  
**Last Updated**: 2025-10-17
