
/**
 * Components Central Export - التصدير المركزي للمكونات
 *
 * SINGLE SOURCE OF TRUTH for all component imports
 * Following industry best practices for component libraries
 */

// ============================================
// UI COMPONENTS - المكونات الأساسية
export * from "./ui";

// ============================================
// COMMON COMPONENTS - المكونات المشتركة
export * from "./common";

// ============================================
// LAYOUT COMPONENTS - مكونات التخطيط

// ============================================
// FEATURE COMPONENTS - مكونات الميزات

// Auth

// Dashboard

// Charts

// Appointments

// Patients

// Insurance

// Settings

// Accessibility

// Chatbot

// ============================================
// PROVIDERS - الموفرون

// ============================================
// SHARED - مشتركة

// ============================================
// LAZY LOADED - التحميل الكسول
// LazyComponents removed - not needed with app router

/**
 * USAGE EXAMPLES:
 *
 * // ✅ RECOMMENDED: Named imports from central location
 * import { Button, Card, LoadingSpinner, ErrorBoundary } from '@/components';
 *
 * // ✅ ALTERNATIVE: Category-specific imports
 * import { Button, Card } from '@/components/ui';
 * import { ErrorBoundary } from '@/components/common';
 *
 * // ❌ AVOID: Individual file imports
 * import Button from '@/components/ui/Button';
 * import ErrorBoundary from '@/components/common/ErrorBoundary';
 */

 from "./shell/Sidebar";
 from "./shell/HeaderSimple";
 from "./layout/GlobalHeader";
 from "./layout/SmartHeader";
 from "./auth/ProtectedRoute";
 from "./dashboard/KpiCard";
 from "./dashboard/Charts";
 from "./charts/LineChart";
 from "./charts/BarChart";
 from "./charts/AreaChart";
 from "./appointments/AppointmentManager";
 from "./patients/PatientRecords";
 from "./patient/PreVisitChecklist";
 from "./patient/ActivationFlow";
 from "./insurance/ClaimsManager";
 from "./settings/SettingsTabs";
 from "./settings/KeywordEditor";
 from "./accessibility/AccessibilitySettings";
 from "./chatbot/MoainChatbot";
 from "./providers/UIProvider";
 from "./providers/I18nProvider";
 from "./shared/DataTable";
 from "./shared/Modal";
 from "./shared/Tabs";
 from "./shared/EmptyState";
 from "./shared/LiveRegion";
 from "./shared/ScreenReaderOnly";


export { default as Sidebar }