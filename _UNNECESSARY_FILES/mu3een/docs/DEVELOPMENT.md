# Development Guide

This guide provides detailed information for developers working on the Mu3een project.

## Table of Contents

- [Development Setup](#development-setup)
- [Code Standards](#code-standards)
- [Architecture](#architecture)
- [Testing](#testing)
- [Performance](#performance)
- [Debugging](#debugging)
- [Troubleshooting](#troubleshooting)

## Development Setup

### Prerequisites

- Node.js 18.0.0 or higher
- npm 8.0.0 or higher
- Git
- VS Code (recommended)

### VS Code Extensions

Install the following extensions for the best development experience:

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json"
  ]
}
```

### Environment Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd mu3een
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment file:
```bash
cp .env.example .env.local
```

4. Configure environment variables in `.env.local`

5. Start the development server:
```bash
npm run dev
```

## Code Standards

### TypeScript

- Use strict TypeScript configuration
- Define interfaces for all data structures
- Use type guards for runtime type checking
- Avoid `any` type - use `unknown` instead
- Use generic types for reusable components

### React

- Use functional components with hooks
- Extract custom hooks for reusable logic
- Use proper dependency arrays in useEffect
- Implement proper error boundaries
- Use React.memo for performance optimization

### Styling

- Use Tailwind CSS utility classes
- Create component-specific styles when needed
- Use CSS custom properties for theming
- Follow mobile-first responsive design
- Use semantic class names

### File Organization

```
src/
├── components/
│   ├── common/           # Reusable components
│   ├── features/         # Feature-specific components
│   └── layout/           # Layout components
├── hooks/                # Custom React hooks
├── utils/                # Utility functions
├── types/                # TypeScript types
├── constants/            # Application constants
└── styles/               # Styling files
```

### Naming Conventions

- **Components**: PascalCase (`UserProfile.tsx`)
- **Hooks**: camelCase starting with `use` (`useAuth.ts`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Types**: PascalCase (`User`, `ApiResponse`)
- **Constants**: UPPER_SNAKE_CASE (`API_ENDPOINTS`)
- **Files**: kebab-case for pages (`user-settings.tsx`)

## Architecture

### Project Structure

The project follows a feature-based architecture with clear separation of concerns:

- **App Router**: Next.js 13+ app directory structure
- **Components**: Reusable UI components
- **Hooks**: Custom React hooks for state management
- **Utils**: Pure utility functions
- **Types**: TypeScript type definitions
- **Constants**: Application constants and configuration

### State Management

- Use React hooks for local state
- Use Context API for global state
- Use custom hooks for complex state logic
- Avoid prop drilling with proper component composition

### Data Flow

1. **API Layer**: Centralized API calls with error handling
2. **Hooks Layer**: Custom hooks for data fetching and state management
3. **Component Layer**: UI components that consume hooks
4. **Context Layer**: Global state management

### Error Handling

- Use Error Boundaries for component-level errors
- Implement proper error states in components
- Use try-catch blocks for async operations
- Provide meaningful error messages to users

## Testing

### Test Structure

```
src/
├── __tests__/             # Test files
│   ├── components/        # Component tests
│   ├── hooks/            # Hook tests
│   ├── utils/            # Utility tests
│   └── pages/            # Page tests
├── __mocks__/            # Mock files
└── test-utils/           # Test utilities
```

### Writing Tests

- Write unit tests for utilities and hooks
- Write integration tests for components
- Write end-to-end tests for critical user flows
- Aim for 80% code coverage
- Use descriptive test names

### Test Examples

```typescript
// Component test
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/common/Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    screen.getByText('Click me').click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

// Hook test
import { renderHook, act } from '@testing-library/react';
import { useCounter } from '@/hooks/useCounter';

describe('useCounter', () => {
  it('should increment counter', () => {
    const { result } = renderHook(() => useCounter(0));
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test Button.test.tsx
```

## Performance

### Optimization Strategies

1. **Code Splitting**: Use dynamic imports for large components
2. **Lazy Loading**: Implement lazy loading for images and components
3. **Memoization**: Use React.memo and useMemo for expensive calculations
4. **Bundle Analysis**: Regular bundle size monitoring
5. **Image Optimization**: Use Next.js Image component

### Performance Monitoring

- Use React DevTools Profiler
- Monitor Core Web Vitals
- Use Lighthouse for performance audits
- Implement performance budgets

### Bundle Optimization

```typescript
// Dynamic imports
const LazyComponent = dynamic(() => import('./LazyComponent'), {
  loading: () => <div>Loading...</div>,
});

// Tree shaking
import { specificFunction } from 'large-library';
// Instead of: import * as library from 'large-library';
```

## Debugging

### Development Tools

1. **React DevTools**: Component inspection and profiling
2. **Redux DevTools**: State management debugging
3. **Network Tab**: API call monitoring
4. **Console**: Error logging and debugging

### Debugging Techniques

```typescript
// Console logging
console.log('Debug info:', { data, error });

// Error boundaries
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }
}

// Debug mode
if (process.env.NODE_ENV === 'development') {
  console.log('Debug information');
}
```

### Common Issues

1. **Hydration Mismatch**: Ensure server and client render the same content
2. **Memory Leaks**: Clean up event listeners and subscriptions
3. **Infinite Loops**: Check useEffect dependencies
4. **Type Errors**: Use proper TypeScript types

## Troubleshooting

### Common Problems

#### Build Errors

```bash
# Clear Next.js cache
rm -rf .next
npm run build

# Clear node_modules
rm -rf node_modules package-lock.json
npm install
```

#### TypeScript Errors

```bash
# Check TypeScript configuration
npm run type-check

# Restart TypeScript server in VS Code
Ctrl+Shift+P -> "TypeScript: Restart TS Server"
```

#### Styling Issues

```bash
# Check Tailwind CSS configuration
npx tailwindcss --init

# Purge unused styles
npm run build
```

#### Test Failures

```bash
# Clear Jest cache
npm test -- --clearCache

# Run tests with verbose output
npm test -- --verbose
```

### Getting Help

1. Check the documentation
2. Search existing issues
3. Create a new issue with:
   - Clear description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details

### Development Workflow

1. **Feature Development**:
   - Create feature branch
   - Write tests first (TDD)
   - Implement feature
   - Run tests and linting
   - Create pull request

2. **Bug Fixes**:
   - Reproduce the bug
   - Write failing test
   - Fix the bug
   - Ensure test passes
   - Update documentation if needed

3. **Code Review**:
   - Review code for standards compliance
   - Check test coverage
   - Verify performance impact
   - Test functionality manually

### Best Practices

1. **Write Clean Code**: Readable, maintainable, and well-documented
2. **Test Everything**: Unit, integration, and e2e tests
3. **Optimize Performance**: Monitor and optimize continuously
4. **Document Changes**: Update documentation with code changes
5. **Follow Standards**: Consistent code style and patterns
6. **Security First**: Consider security implications of changes
7. **Accessibility**: Ensure features are accessible to all users
