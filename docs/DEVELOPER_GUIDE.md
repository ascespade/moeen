# 👨‍💻 Developer Guide - دليل المطور

## Getting Started - البداية

### Prerequisites - المتطلبات

- Node.js 18+
- npm or yarn
- Git
- Supabase account

### Installation - التثبيت

```bash
# Clone the repository
git clone <repository-url>
cd healthcare-system

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Run the development server
npm run dev
```

## Project Structure - هيكل المشروع

```
src/
├── core/                   # Core system modules
│   ├── types/             # TypeScript definitions
│   ├── config/            # Configuration
│   ├── validation/        # Data validation
│   ├── errors/            # Error handling
│   ├── utils/             # Utility functions
│   ├── store/             # State management
│   ├── hooks/             # Custom hooks
│   └── api/               # API client
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── forms/            # Form components
│   ├── charts/           # Chart components
│   └── layout/           # Layout components
├── app/                   # Next.js App Router
│   ├── (auth)/           # Auth pages
│   ├── (patient)/        # Patient dashboard
│   ├── (doctor)/         # Doctor dashboard
│   ├── (staff)/          # Staff dashboard
│   ├── (admin)/          # Admin dashboard
│   └── api/              # API routes
└── lib/                   # External libraries
    ├── supabase/         # Database client
    ├── auth/             # Authentication
    ├── payments/         # Payment processing
    └── notifications/    # Notification services
```

## Coding Standards - معايير البرمجة

### TypeScript Guidelines

```typescript
// Use strict typing
interface User {
  id: string;
  email: string;
  role: UserRole;
}

// Use enums for constants
enum UserRole {
  PATIENT = "patient",
  DOCTOR = "doctor",
  STAFF = "staff",
  ADMIN = "admin",
}

// Use generics for reusable components
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

### Component Guidelines

```typescript
// Use functional components with TypeScript
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  ...props
}) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size }))}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};
```

### API Guidelines

```typescript
// Use the base API handler
export const GET = createApiHandler(
  async (req: NextRequest, context: any) => {
    const supabase = await baseApiHandler.getSupabaseClient();
    const { data, error } = await supabase.from("users").select("*");

    if (error) {
      throw ErrorFactory.createDatabaseError(error.message);
    }

    return baseApiHandler.createSuccessResponse(data);
  },
  {
    method: "GET",
    auth: true,
    roles: ["admin", "staff"],
  },
);
```

## State Management - إدارة الحالة

### Using Zustand Store

```typescript
// Access store in components
const { user, isAuthenticated, login, logout } = useAuthStore();

// Update state
const updateUser = useAuthStore((state) => state.updateUser);
updateUser({ name: "New Name" });
```

### Using Custom Hooks

```typescript
// Use custom hooks for data fetching
const { patients, fetchPatients, createPatient } = usePatients();

// Fetch data on component mount
useEffect(() => {
  fetchPatients({ page: 1, limit: 10 });
}, []);
```

## API Development - تطوير API

### Creating API Routes

```typescript
// src/app/api/users/route.ts
import { createApiHandler } from "@/core";
import { userSchemas } from "@/core/validation";

export const GET = createApiHandler(
  async (req: NextRequest, context: any) => {
    const supabase = await baseApiHandler.getSupabaseClient();
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .range(
        context.validatedQuery.page * context.validatedQuery.limit,
        (context.validatedQuery.page + 1) * context.validatedQuery.limit - 1,
      );

    if (error) {
      throw ErrorFactory.createDatabaseError(error.message);
    }

    return baseApiHandler.createPaginatedResponse(
      data,
      context.validatedQuery.page,
      context.validatedQuery.limit,
      data.length,
    );
  },
  {
    method: "GET",
    auth: true,
    roles: ["admin", "staff"],
    validation: {
      query: userSchemas.query,
    },
  },
);
```

### Error Handling

```typescript
// Use error factory for consistent errors
throw ErrorFactory.createValidationError("Email is required", "email");
throw ErrorFactory.createNotFoundError("User not found");
throw ErrorFactory.createBusinessLogicError("Appointment conflict detected");
```

## Database Operations - عمليات قاعدة البيانات

### Using Supabase Client

```typescript
// Get client
const supabase = await baseApiHandler.getSupabaseClient();

// Query data
const { data, error } = await supabase
  .from("users")
  .select("id, email, name")
  .eq("role", "patient")
  .order("created_at", { ascending: false });

// Insert data
const { data, error } = await supabase.from("appointments").insert({
  patient_id: patientId,
  doctor_id: doctorId,
  scheduled_at: scheduledAt,
  status: "scheduled",
});

// Update data
const { data, error } = await supabase
  .from("appointments")
  .update({ status: "confirmed" })
  .eq("id", appointmentId);
```

## Component Development - تطوير المكونات

### Creating UI Components

```typescript
// src/components/ui/Input.tsx
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'flex h-10 w-full rounded-md border border-gray-300 px-3 py-2',
            error && 'border-red-500 focus:border-red-500'
          )}
          {...props}
        />
        {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
        {helperText && !error && (
          <p className="text-gray-500 text-sm mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);
```

### Using Design System

```typescript
// Use design system tokens
import { colors, typography, spacing } from "@/core/design-system";

const styles = {
  container: "bg-white rounded-lg shadow-md p-6",
  title: "text-2xl font-bold text-gray-900 mb-4",
  button: "bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-600",
};
```

## Testing - الاختبار

### Unit Testing

```typescript
// src/components/__tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### API Testing

```typescript
// src/app/api/__tests__/users.test.ts
import { GET } from "../users/route";
import { NextRequest } from "next/server";

describe("/api/users", () => {
  it("returns users list", async () => {
    const request = new NextRequest("http://localhost:3000/api/users");
    const response = await GET(request, {});
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
  });
});
```

## Deployment - النشر

### Environment Setup

```bash
# Production environment variables
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DATABASE_URL=your_database_url
```

### Build and Deploy

```bash
# Build the application
npm run build

# Deploy to Vercel
vercel --prod

# Run database migrations
npm run migrate
```

## Troubleshooting - استكشاف الأخطاء

### Common Issues

#### 1. **Build Errors**

```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

#### 2. **Database Connection Issues**

- Check Supabase credentials
- Verify network connectivity
- Check RLS policies

#### 3. **Authentication Issues**

- Verify JWT configuration
- Check token expiration
- Validate user permissions

### Debug Mode

```typescript
// Enable debug logging
const debug = process.env.NODE_ENV === "development";

if (debug) {
  console.log("Debug info:", { user, data, error });
}
```

## Best Practices - أفضل الممارسات

### 1. **Code Organization**

- Keep components small and focused
- Use custom hooks for reusable logic
- Separate concerns properly
- Follow naming conventions

### 2. **Performance**

- Use React.memo for expensive components
- Implement proper loading states
- Optimize database queries
- Use pagination for large datasets

### 3. **Security**

- Validate all inputs
- Use parameterized queries
- Implement proper error handling
- Follow OWASP guidelines

### 4. **Accessibility**

- Use semantic HTML
- Provide proper ARIA labels
- Ensure keyboard navigation
- Test with screen readers

## Resources - الموارد

### Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

### Tools

- [VS Code](https://code.visualstudio.com/)
- [Supabase Studio](https://supabase.com/dashboard)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Postman](https://www.postman.com/)

## Support - الدعم

For questions and support:

- Create an issue in the repository
- Contact the development team
- Check the documentation
- Review existing issues

---

Happy coding! 🚀
