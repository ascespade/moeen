/**
 * Error Constants - Centralized Error Definitions
 * ثوابت الأخطاء - تعريفات الأخطاء المركزية
 * 
 * Error codes and default messages
 */

export const ERROR_CODES = {
  // Authentication Errors (1000-1099)
  AUTH_REQUIRED: 'AUTH_1001',
  AUTH_INVALID_TOKEN: 'AUTH_1002',
  AUTH_TOKEN_EXPIRED: 'AUTH_1003',
  AUTH_INVALID_CREDENTIALS: 'AUTH_1004',
  AUTH_EMAIL_NOT_VERIFIED: 'AUTH_1005',
  AUTH_ACCOUNT_LOCKED: 'AUTH_1006',
  AUTH_PERMISSION_DENIED: 'AUTH_1007',

  // Validation Errors (2000-2099)
  VALIDATION_REQUIRED: 'VALID_2001',
  VALIDATION_INVALID_FORMAT: 'VALID_2002',
  VALIDATION_MIN_LENGTH: 'VALID_2003',
  VALIDATION_MAX_LENGTH: 'VALID_2004',
  VALIDATION_INVALID_RANGE: 'VALID_2005',
  VALIDATION_MUST_MATCH: 'VALID_2006',

  // Database Errors (3000-3099)
  DB_NOT_FOUND: 'DB_3001',
  DB_DUPLICATE_ENTRY: 'DB_3002',
  DB_CONSTRAINT_VIOLATION: 'DB_3003',
  DB_CONNECTION_ERROR: 'DB_3004',
  DB_QUERY_ERROR: 'DB_3005',

  // API Errors (4000-4099)
  API_NOT_FOUND: 'API_4001',
  API_METHOD_NOT_ALLOWED: 'API_4002',
  API_RATE_LIMIT_EXCEEDED: 'API_4003',
  API_INVALID_REQUEST: 'API_4004',
  API_SERVER_ERROR: 'API_4005',

  // File Errors (5000-5099)
  FILE_NOT_FOUND: 'FILE_5001',
  FILE_TOO_LARGE: 'FILE_5002',
  FILE_INVALID_TYPE: 'FILE_5003',
  FILE_UPLOAD_ERROR: 'FILE_5004',

  // Business Logic Errors (6000-6099)
  BUSINESS_INVALID_STATE: 'BIZ_6001',
  BUSINESS_OPERATION_FAILED: 'BIZ_6002',
  BUSINESS_RESOURCE_UNAVAILABLE: 'BIZ_6003',
  BUSINESS_CONFLICT: 'BIZ_6004',

  // External Service Errors (7000-7099)
  EXTERNAL_SERVICE_UNAVAILABLE: 'EXT_7001',
  EXTERNAL_SERVICE_ERROR: 'EXT_7002',
  EXTERNAL_API_ERROR: 'EXT_7003',

  // General Errors (9000-9999)
  UNKNOWN_ERROR: 'GEN_9001',
  INTERNAL_ERROR: 'GEN_9002',
  NETWORK_ERROR: 'GEN_9003',
} as const;

export const ERROR_MESSAGES: Record<string, string> = {
  [ERROR_CODES.AUTH_REQUIRED]: 'يجب تسجيل الدخول للوصول إلى هذا المورد',
  [ERROR_CODES.AUTH_INVALID_TOKEN]: 'رمز المصادقة غير صحيح',
  [ERROR_CODES.AUTH_TOKEN_EXPIRED]: 'انتهت صلاحية رمز المصادقة',
  [ERROR_CODES.AUTH_INVALID_CREDENTIALS]: 'بيانات الدخول غير صحيحة',
  [ERROR_CODES.AUTH_EMAIL_NOT_VERIFIED]: 'البريد الإلكتروني غير مفعّل',
  [ERROR_CODES.AUTH_ACCOUNT_LOCKED]: 'الحساب محظور مؤقتاً',
  [ERROR_CODES.AUTH_PERMISSION_DENIED]: 'ليس لديك صلاحية للوصول',

  [ERROR_CODES.VALIDATION_REQUIRED]: 'الحقل مطلوب',
  [ERROR_CODES.VALIDATION_INVALID_FORMAT]: 'تنسيق غير صحيح',
  [ERROR_CODES.VALIDATION_MIN_LENGTH]: 'القيمة قصيرة جداً',
  [ERROR_CODES.VALIDATION_MAX_LENGTH]: 'القيمة طويلة جداً',
  [ERROR_CODES.VALIDATION_INVALID_RANGE]: 'القيمة خارج النطاق المسموح',
  [ERROR_CODES.VALIDATION_MUST_MATCH]: 'القيم غير متطابقة',

  [ERROR_CODES.DB_NOT_FOUND]: 'لم يتم العثور على السجل',
  [ERROR_CODES.DB_DUPLICATE_ENTRY]: 'السجل موجود مسبقاً',
  [ERROR_CODES.DB_CONSTRAINT_VIOLATION]: 'انتهاك قيد قاعدة البيانات',
  [ERROR_CODES.DB_CONNECTION_ERROR]: 'خطأ في الاتصال بقاعدة البيانات',
  [ERROR_CODES.DB_QUERY_ERROR]: 'خطأ في استعلام قاعدة البيانات',

  [ERROR_CODES.API_NOT_FOUND]: 'المسار غير موجود',
  [ERROR_CODES.API_METHOD_NOT_ALLOWED]: 'الطريقة غير مسموحة',
  [ERROR_CODES.API_RATE_LIMIT_EXCEEDED]: 'تم تجاوز حد الطلبات',
  [ERROR_CODES.API_INVALID_REQUEST]: 'طلب غير صحيح',
  [ERROR_CODES.API_SERVER_ERROR]: 'خطأ في الخادم',

  [ERROR_CODES.FILE_NOT_FOUND]: 'الملف غير موجود',
  [ERROR_CODES.FILE_TOO_LARGE]: 'حجم الملف كبير جداً',
  [ERROR_CODES.FILE_INVALID_TYPE]: 'نوع الملف غير مسموح',
  [ERROR_CODES.FILE_UPLOAD_ERROR]: 'فشل رفع الملف',

  [ERROR_CODES.BUSINESS_INVALID_STATE]: 'الحالة غير صحيحة',
  [ERROR_CODES.BUSINESS_OPERATION_FAILED]: 'فشلت العملية',
  [ERROR_CODES.BUSINESS_RESOURCE_UNAVAILABLE]: 'المورد غير متاح',
  [ERROR_CODES.BUSINESS_CONFLICT]: 'تعارض في العملية',

  [ERROR_CODES.EXTERNAL_SERVICE_UNAVAILABLE]: 'الخدمة الخارجية غير متاحة',
  [ERROR_CODES.EXTERNAL_SERVICE_ERROR]: 'خطأ في الخدمة الخارجية',
  [ERROR_CODES.EXTERNAL_API_ERROR]: 'خطأ في API الخارجي',

  [ERROR_CODES.UNKNOWN_ERROR]: 'خطأ غير معروف',
  [ERROR_CODES.INTERNAL_ERROR]: 'خطأ داخلي',
  [ERROR_CODES.NETWORK_ERROR]: 'خطأ في الشبكة',
};

// Helper function to get error message
export function getErrorMessage(code: string): string {
  return ERROR_MESSAGES[code] || ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR];
}

// Type exports
export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];
