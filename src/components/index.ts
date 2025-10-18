
/**
 * Components Central Export - التصدير المركزي للمكونات
 * 
 * SINGLE SOURCE OF TRUTH for all component imports
 * Following industry best practices for component libraries
 */

// ============================================
// UI COMPONENTS - المكونات الأساسية
// ============================================

// ============================================
// COMMON COMPONENTS - المكونات المشتركة
// ============================================

// ============================================
// LAYOUT COMPONENTS - مكونات التخطيط
// ============================================

// ============================================
// FEATURE COMPONENTS - مكونات الميزات
// ============================================

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

// ============================================
// SHARED - مشتركة
// ============================================

// ============================================
// LAZY LOADED - التحميل الكسول
// ============================================
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


// Exports

// Exports

// Exports

// Exports

// Exports

// Exports

// Exports

// Exports

// Exports
export * from './ui';
export * from './common';
export { default as Sidebar } from './shell/Sidebar';
export { default as HeaderSimple } from './shell/HeaderSimple';
export { default as GlobalHeader } from './layout/GlobalHeader';
export { default as SmartHeader } from './layout/SmartHeader';
export { default as ProtectedRoute } from './auth/ProtectedRoute';
export { default as KpiCard } from './dashboard/KpiCard';
export { default as Charts } from './dashboard/Charts';
export { LineChart } from './charts/LineChart';
export { BarChart } from './charts/BarChart';
export { AreaChart } from './charts/AreaChart';
export { default as AppointmentManager } from './appointments/AppointmentManager';
export { default as PatientRecords } from './patients/PatientRecords';
export { default as PreVisitChecklist } from './patient/PreVisitChecklist';
export { default as ActivationFlow } from './patient/ActivationFlow';
export { default as ClaimsManager } from './insurance/ClaimsManager';
export { default as SettingsTabs } from './settings/SettingsTabs';
export { default as KeywordEditor } from './settings/KeywordEditor';
export { default as AccessibilitySettings } from './accessibility/AccessibilitySettings';
export { default as MoainChatbot } from './chatbot/MoainChatbot';
export { default as UIProvider } from './providers/UIProvider';
export { default as I18nProvider } from './providers/I18nProvider';
export { default as DataTable } from './shared/DataTable';
export { default as Modal } from './shared/Modal';
export { default as Tabs } from './shared/Tabs';
export { default as EmptyState } from './shared/EmptyState';
export { default as LiveRegion } from './shared/LiveRegion';
export { default as ScreenReaderOnly } from './shared/ScreenReaderOnly';