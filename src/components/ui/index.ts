
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

  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "./Card";
  CardProps,
  CardHeaderProps,
  CardContentProps,
  CardFooterProps,
} from "./Card";

// Loading & Skeleton

// Theme
  default as ThemeSwitch,
  default as ThemeToggle,
  default as ThemeSwitcher,
} from "./ThemeSwitch";

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

 from "./Button";
 from "./Input";
 from "./Label";
 from "./Textarea";
 from "./Badge";
 from "./Table";
 from "./Modal";
 from "./Toast";
 from "./Tooltip";
 from "./Tabs";
 from "./Select";
 from "./Checkbox";
 from "./Switch";
 from "./ScrollArea";
 from "./DataTable";
 from "./LoadingSpinner";
 from "./Skeleton";



export type { ButtonProps } from "./Button";
export { Button }