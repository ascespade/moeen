/**
 * Components Central Export - التصدير المركزي للمكونات
 * 
 * SINGLE SOURCE OF TRUTH for all component imports
 * Following industry best practices for component libraries
 */

// ============================================
// UI COMPONENTS - المكونات الأساسية
// ============================================
export * from './ui';

// ============================================
// COMMON COMPONENTS - المكونات المشتركة
// ============================================
export * from './common';

// ============================================
// LAYOUT COMPONENTS - مكونات التخطيط
// ============================================
export { default as Sidebar } from './shell/Sidebar';
export { default as HeaderSimple } from './shell/HeaderSimple';
export { default as GlobalHeader } from './layout/GlobalHeader';
export { default as SmartHeader } from './layout/SmartHeader';

// ============================================
// FEATURE COMPONENTS - مكونات الميزات
// ============================================

// Auth
export { default as ProtectedRoute } from './auth/ProtectedRoute';

// Dashboard
export { default as KpiCard } from './dashboard/KpiCard';
export { default as Charts } from './dashboard/Charts';

// Charts
export { LineChart } from './charts/LineChart';
export { BarChart } from './charts/BarChart';
export { AreaChart } from './charts/AreaChart';

// Appointments
export { default as AppointmentManager } from './appointments/AppointmentManager';

// Patients
export { default as PatientRecords } from './patients/PatientRecords';
export { default as PreVisitChecklist } from './patient/PreVisitChecklist';
export { default as ActivationFlow } from './patient/ActivationFlow';

// Insurance
export { default as ClaimsManager } from './insurance/ClaimsManager';

// Settings
export { default as SettingsTabs } from './settings/SettingsTabs';
export { default as KeywordEditor } from './settings/KeywordEditor';

// Accessibility
export { default as AccessibilitySettings } from './accessibility/AccessibilitySettings';

// Chatbot
export { default as MoainChatbot } from './chatbot/MoainChatbot';

// ============================================
// PROVIDERS - الموفرون
// ============================================
export { default as UIProvider } from './providers/UIProvider';
export { default as I18nProvider } from './providers/I18nProvider';
export { default as DesignSystemProvider } from './providers/DesignSystemProvider';

// ============================================
// SHARED - مشتركة
// ============================================
export { default as Form } from './shared/Form';
export { default as DataTable } from './shared/DataTable';
export { default as Modal } from './shared/Modal';
export { default as Tabs } from './shared/Tabs';
export { default as EmptyState } from './shared/EmptyState';
export { default as LiveRegion } from './shared/LiveRegion';
export { default as ScreenReaderOnly } from './shared/ScreenReaderOnly';

// ============================================
// LAZY LOADED - التحميل الكسول
// ============================================
export { default as LazyComponents } from './lazy/LazyComponents';

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
