/**
 * UI Components Library - مكتبة المكونات المركزية
 *
 * Central export for all UI components following best practices:
 * - Single source of truth
 * - Consistent API
 * - Easy imports
 * - Tree-shakeable
 */

// Base UI Components
export { Button } from './Button';
export type { ButtonProps } from './Button';

export {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from './Card';
export type {
  CardProps,
  CardHeaderProps,
  CardContentProps,
  CardFooterProps,
} from './Card';

export { Input } from './Input';
export { Label } from './Label';
export { Textarea } from './Textarea';
export { Badge } from './Badge';
export { Table } from './Table';
export { Modal } from './Modal';
export { Toast } from './Toast';
export { Tooltip } from './Tooltip';
export { Tabs } from './Tabs';
export { Select } from './Select';
export { Checkbox } from './Checkbox';
export { default as Switch } from './Switch';
export { ScrollArea } from './ScrollArea';
export { DataTable } from './DataTable';

// Loading & Skeleton
export { LoadingSpinner, LoadingScreen } from './LoadingSpinner';
export { Skeleton } from './Skeleton';

// Theme
export {
  default as ThemeSwitch,
  default as ThemeToggle,
  default as ThemeSwitcher,
} from './ThemeSwitch';

/**
 * Usage Examples:
 *
 * // ✅ CORRECT - Import from central location:
 * import { Button, Card, LoadingSpinner } from '@/components/ui';
 *
 * // ❌ WRONG - Don't import from individual files:
 * import Button from '@/components/ui/Button';
 * import LoadingSpinner from '@/components/common/LoadingSpinner';
 */
