
/**
 * Core Module - الوحدة الأساسية
 * Main entry point for the core system
 */

// Types

// Configuration

// Utilities

// Constants

// Error Handling

// Validation

// Design System

// Store

// Hooks

// API

// Re-export commonly used items

// Exports

// Exports

// Exports

// Exports

// Exports

// Exports

// Exports

// Exports

// Exports
export * from './types';
export * from './config';
export * from './utils';
export * from './constants';
export * from './errors';
export * from './validation';
export * from './design-system';
export * from './store';
export * from './hooks';
export * from './api/client';
export * from './api/base-handler';
export { apiClient } from './api/client';
export { baseApiHandler, createApiHandler } from './api/base-handler';
export { ErrorHandler, ErrorFactory } from './errors';
export { ValidationHelper } from './validation';
export { useAuth, useTheme, useLanguage, useNotifications } from './hooks';
export { useAuthStore, useUIStore, useDataStore } from './store';