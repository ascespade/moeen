/**
 * Messages - Centralized User Messages
 * الرسائل - رسائل المستخدم المركزية
 *
 * All user-facing messages (success, error, info, confirmation)
 */

export const MESSAGES = {
  // Success Messages
  SUCCESS: {
    LOGIN: 'تم تسجيل الدخول بنجاح',
    LOGOUT: 'تم تسجيل الخروج بنجاح',
    REGISTER: 'تم إنشاء الحساب بنجاح',
    UPDATE: 'تم التحديث بنجاح',
    DELETE: 'تم الحذف بنجاح',
    CREATE: 'تم الإنشاء بنجاح',
    SAVE: 'تم الحفظ بنجاح',
    SEND: 'تم الإرسال بنجاح',
    UPLOAD: 'تم الرفع بنجاح',
    RESET_PASSWORD: 'تم إعادة تعيين كلمة المرور بنجاح',
    VERIFY_EMAIL: 'تم التحقق من البريد الإلكتروني بنجاح',
    BOOK_APPOINTMENT: 'تم حجز الموعد بنجاح',
    SUBMIT_FORM: 'تم إرسال النموذج بنجاح',
  },

  // Error Messages
  ERROR: {
    LOGIN_FAILED: 'فشل تسجيل الدخول. يرجى التحقق من البيانات',
    REGISTER_FAILED: 'فشل إنشاء الحساب. يرجى المحاولة مرة أخرى',
    UNAUTHORIZED: 'غير مصرح لك بالوصول إلى هذه الصفحة',
    FORBIDDEN: 'ليس لديك صلاحية للوصول إلى هذا المورد',
    NOT_FOUND: 'لم يتم العثور على المورد المطلوب',
    SERVER_ERROR: 'حدث خطأ في الخادم. يرجى المحاولة لاحقاً',
    NETWORK_ERROR: 'خطأ في الاتصال بالخادم',
    VALIDATION_ERROR: 'يرجى التحقق من البيانات المدخلة',
    REQUIRED_FIELD: 'هذا الحقل مطلوب',
    INVALID_EMAIL: 'البريد الإلكتروني غير صحيح',
    INVALID_PASSWORD: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
    PASSWORD_MISMATCH: 'كلمة المرور غير متطابقة',
    INVALID_PHONE: 'رقم الهاتف غير صحيح',
    LOAD_ERROR: 'فشل تحميل البيانات',
    SAVE_ERROR: 'فشل حفظ البيانات',
    DELETE_ERROR: 'فشل حذف البيانات',
    UPLOAD_ERROR: 'فشل رفع الملف',
    SESSION_EXPIRED: 'انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى',
  },

  // Info Messages
  INFO: {
    LOADING: 'جاري التحميل...',
    PROCESSING: 'جاري المعالجة...',
    SAVING: 'جاري الحفظ...',
    DELETING: 'جاري الحذف...',
    UPLOADING: 'جاري الرفع...',
    SENDING: 'جاري الإرسال...',
    NO_DATA: 'لا توجد بيانات',
    NO_RESULTS: 'لا توجد نتائج',
    SELECT_ITEM: 'يرجى اختيار عنصر',
    CONFIRM_ACTION: 'هل أنت متأكد من تنفيذ هذا الإجراء؟',
  },

  // Confirmation Messages
  CONFIRM: {
    DELETE: 'هل أنت متأكد من حذف هذا العنصر؟',
    DELETE_PERMANENT:
      'هل أنت متأكد من الحذف الدائم؟ لا يمكن التراجع عن هذا الإجراء',
    LOGOUT: 'هل أنت متأكد من تسجيل الخروج؟',
    RESET: 'هل أنت متأكد من إعادة تعيين النموذج؟ ستفقد جميع التغييرات',
    CANCEL: 'هل أنت متأكد من إلغاء العملية؟',
    SAVE_CHANGES: 'هل تريد حفظ التغييرات؟',
    DISCARD_CHANGES: 'هل تريد تجاهل التغييرات؟',
  },

  // Validation Messages
  VALIDATION: {
    REQUIRED: (field: string) => `${field} مطلوب`,
    MIN_LENGTH: (field: string, min: number) =>
      `${field} يجب أن يكون ${min} أحرف على الأقل`,
    MAX_LENGTH: (field: string, max: number) =>
      `${field} يجب أن لا يتجاوز ${max} حرف`,
    INVALID_FORMAT: (field: string) => `تنسيق ${field} غير صحيح`,
    MUST_MATCH: (field: string, matchField: string) =>
      `${field} يجب أن يتطابق مع ${matchField}`,
    INVALID_RANGE: (field: string, min: number, max: number) =>
      `${field} يجب أن يكون بين ${min} و ${max}`,
  },

  // Form Labels
  FORM: {
    NAME: 'الاسم',
    EMAIL: 'البريد الإلكتروني',
    PASSWORD: 'كلمة المرور',
    CONFIRM_PASSWORD: 'تأكيد كلمة المرور',
    PHONE: 'رقم الهاتف',
    MESSAGE: 'الرسالة',
    SUBJECT: 'الموضوع',
    SEARCH: 'بحث',
    FILTER: 'تصفية',
    SORT: 'ترتيب',
    SUBMIT: 'إرسال',
    CANCEL: 'إلغاء',
    SAVE: 'حفظ',
    DELETE: 'حذف',
    EDIT: 'تعديل',
    VIEW: 'عرض',
    CLOSE: 'إغلاق',
    BACK: 'رجوع',
    NEXT: 'التالي',
    PREVIOUS: 'السابق',
    CONFIRM: 'تأكيد',
    RESET: 'إعادة تعيين',
  },
} as const;

// Helper function to get message
export function getMessage(
  category: keyof typeof MESSAGES,
  key: string
): string {
  const categoryMessages = MESSAGES[category] as Record<
    string,
    string | ((...args: unknown[]) => string)
  >;
  const message = categoryMessages[key];

  if (typeof message === 'function') {
    return message as unknown as string;
  }

  return message || '';
}

// Type exports
export type MessageCategory = keyof typeof MESSAGES;
export type SuccessMessage = keyof typeof MESSAGES.SUCCESS;
export type ErrorMessage = keyof typeof MESSAGES.ERROR;
export type InfoMessage = keyof typeof MESSAGES.INFO;
export type ConfirmMessage = keyof typeof MESSAGES.CONFIRM;
