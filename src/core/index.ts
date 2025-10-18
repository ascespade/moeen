
/**
 * Core Module - الوحدة الأساسية
 * Main entry point for the core system
 */

// Types
export * from "./types";

// Configuration
export * from "./config";

// Utilities
export * from "./utils";

// Constants
export * from "./constants";

// Error Handling
export * from "./errors";

// Validation
export * from "./validation";

// Design System
export * from "./design-system";

// Store
export * from "./store";

// Hooks
export * from "./hooks";

// API
export * from "./api/client";
export * from "./api/base-handler";

// Re-export commonly used items

 from "./api/client";
 from "./api/base-handler";
 from "./errors";
 from "./validation";
 from "./hooks";
 from "./store";


export { apiClient }