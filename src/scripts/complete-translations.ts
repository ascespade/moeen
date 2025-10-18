import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';

// Comprehensive translation keys for the entire system
const translationKeys = {
  // Common
  common: {
    loading: 'جاري التحميل...',
    saving: 'جاري الحفظ...',
    submitting: 'جاري الإرسال...',
    processing: 'جاري المعالجة...',
    creating: 'جاري الإنشاء...',
    updating: 'جاري التحديث...',
    deleting: 'جاري الحذف...',
    activating: 'جاري التفعيل...',
    cancel: 'إلغاء',
    confirm: 'تأكيد',
    save: 'حفظ',
    edit: 'تعديل',
    delete: 'حذف',
    view: 'عرض',
    back: 'رجوع',
    next: 'التالي',
    previous: 'السابق',
    submit: 'إرسال',
    search: 'بحث',
    filter: 'تصفية',
    clear: 'مسح',
    reset: 'إعادة تعيين',
    close: 'إغلاق',
    open: 'فتح',
    yes: 'نعم',
    no: 'لا',
    ok: 'موافق',
    error: 'خطأ',
    success: 'نجح',
    warning: 'تحذير',
    info: 'معلومات',
    required: 'مطلوب',
    optional: 'اختياري',
    all: 'الكل',
    none: 'لا شيء',
    select: 'اختر',
    select_all: 'اختيار الكل',
    deselect_all: 'إلغاء اختيار الكل',
    activated: 'مفعل',
    pending: 'معلق',
    completed: 'مكتمل',
    failed: 'فشل',
    unknown: 'غير معروف',
    excellent: 'ممتاز',
    good: 'جيد',
    needs_improvement: 'يحتاج تحسين',
  },

  // Authentication
  auth: {
    login: 'تسجيل الدخول',
    logout: 'تسجيل الخروج',
    register: 'إنشاء حساب',
    forgot_password: 'نسيت كلمة المرور',
    reset_password: 'إعادة تعيين كلمة المرور',
    verify_email: 'تأكيد البريد الإلكتروني',
    welcome: 'مرحباً',
    unauthorized: 'غير مصرح',
    insufficient_permissions: 'صلاحيات غير كافية',
    back_to_login: 'العودة لتسجيل الدخول',
    login_required: 'يجب تسجيل الدخول',
    session_expired: 'انتهت صلاحية الجلسة',
  },

  // Patient Dashboard
  patient: {
    dashboard: {
      welcome: 'مرحباً بك في لوحة التحكم',
      subtitle: 'إدارة مواعيدك وملفك الطبي',
      next_appointment: 'الموعد القادم',
      with_doctor: 'مع الطبيب',
      no_appointments: 'لا توجد مواعيد',
      account_status: 'حالة الحساب',
      activation_status: 'حالة التفعيل',
      insurance_status: 'حالة التأمين',
      quick_stats: 'إحصائيات سريعة',
      total_appointments: 'إجمالي المواعيد',
      outstanding_payment: 'المبلغ المستحق',
    },
    actions: {
      book_appointment: 'حجز موعد',
      book_description: 'احجز موعداً جديداً',
      book_now: 'احجز الآن',
      view_file: 'عرض الملف',
      file_description: 'عرض ملفك الطبي',
      open_file: 'فتح الملف',
      file_locked: 'الملف مقفل',
      payments: 'المدفوعات',
      payments_description: 'إدارة مدفوعاتك',
      view_payments: 'عرض المدفوعات',
      insurance: 'التأمين',
      insurance_description: 'إدارة تأمينك الصحي',
      view_insurance: 'عرض التأمين',
    },
    activation: {
      title: 'تفعيل الحساب',
      description: 'يجب إكمال الخطوات التالية لتفعيل حسابك',
      progress: 'التقدم',
      ready_to_activate: 'جاهز للتفعيل',
      activate_account: 'تفعيل الحساب',
      complete_step: 'إكمال الخطوة',
      steps: {
        profile_complete: 'إكمال الملف الشخصي',
        profile_complete_desc: 'تأكد من اكتمال جميع البيانات الشخصية',
        insurance_verified: 'التحقق من التأمين',
        insurance_verified_desc: 'التحقق من صحة بيانات التأمين الصحي',
        payment_settled: 'تسوية المدفوعات',
        payment_settled_desc: 'تسوية جميع المبالغ المستحقة',
        first_visit: 'إكمال الزيارة الأولى',
        first_visit_desc: 'إكمال الزيارة الأولى مع الطبيب',
      },
    },
    checklist: {
      title: 'قائمة التحقق قبل الزيارة',
      description: 'يرجى إكمال العناصر التالية قبل موعدك',
      progress: 'التقدم',
      required_completed: 'المطلوب مكتمل',
      required_warning: 'يجب إكمال جميع العناصر المطلوبة',
      submit: 'إرسال القائمة',
      categories: {
        documents: 'المستندات',
        payment: 'الدفع',
        health: 'الصحة',
        appointment: 'الموعد',
      },
    },
  },

  // Doctor Dashboard
  doctor: {
    dashboard: {
      welcome: 'مرحباً بك دكتور',
      subtitle: 'إدارة مرضاك ومواعيدك',
      today_appointments: 'مواعيد اليوم',
      total_patients: 'إجمالي المرضى',
      pending_appointments: 'المواعيد المعلقة',
      completed_today: 'مكتمل اليوم',
      today_schedule: 'جدول اليوم',
      no_appointments_today: 'لا توجد مواعيد اليوم',
      recent_patients: 'المرضى الأخيرون',
      last_visit: 'آخر زيارة',
      no_recent_patients: 'لا توجد مرضى حديثون',
      quick_actions: 'إجراءات سريعة',
    },
    actions: {
      start_appointment: 'بدء الموعد',
      view_file: 'عرض الملف',
      add_notes: 'إضافة ملاحظات',
      view_all_patients: 'عرض جميع المرضى',
      manage_schedule: 'إدارة الجدول',
    },
  },

  // Staff Dashboard
  staff: {
    dashboard: {
      welcome: 'مرحباً بك',
      subtitle: 'إدارة المرضى والمواعيد',
      today_registrations: 'تسجيلات اليوم',
      pending_payments: 'المدفوعات المعلقة',
      pending_claims: 'المطالبات المعلقة',
      today_activity: 'نشاط اليوم',
      pending_tasks: 'المهام المعلقة',
      no_pending_payments: 'لا توجد مدفوعات معلقة',
      no_pending_claims: 'لا توجد مطالبات معلقة',
      no_recent_activity: 'لا يوجد نشاط حديث',
      quick_actions: 'إجراءات سريعة',
    },
    actions: {
      process_payment: 'معالجة الدفع',
      submit_claim: 'إرسال المطالبة',
      register_patient: 'تسجيل مريض',
      view_patients: 'عرض المرضى',
      upload_claims: 'رفع المطالبات',
      generate_reports: 'إنشاء التقارير',
    },
  },

  // Supervisor Dashboard
  supervisor: {
    dashboard: {
      welcome: 'مرحباً بك',
      subtitle: 'إدارة الفريق والتقارير',
      total_patients: 'إجمالي المرضى',
      total_appointments: 'إجمالي المواعيد',
      revenue: 'الإيرادات',
      claims_processed: 'المطالبات المعالجة',
      staff_performance: 'أداء الفريق',
      tasks: 'المهام',
      efficiency: 'الكفاءة',
      no_staff_data: 'لا توجد بيانات فريق',
      system_alerts: 'تنبيهات النظام',
      no_alerts: 'لا توجد تنبيهات',
      reports: 'التقارير',
      recent_reports: 'التقارير الأخيرة',
      quick_actions: 'إجراءات سريعة',
    },
    actions: {
      daily_report: 'تقرير يومي',
      monthly_report: 'تقرير شهري',
      staff_report: 'تقرير الفريق',
    },
  },

  // Insurance
  insurance: {
    claims: {
      title: 'إدارة المطالبات',
      create_new: 'إنشاء مطالبة جديدة',
      search_placeholder: 'البحث في المطالبات...',
      all_statuses: 'جميع الحالات',
      draft: 'مسودة',
      submitted: 'مرسلة',
      under_review: 'قيد المراجعة',
      approved: 'موافقة',
      rejected: 'مرفوضة',
      provider: 'مقدم الخدمة',
      select_provider: 'اختر مقدم الخدمة',
      amount: 'المبلغ',
      description: 'الوصف',
      description_placeholder: 'وصف الخدمة المطلوبة',
      diagnosis: 'التشخيص',
      diagnosis_placeholder: 'تشخيص الحالة',
      treatment: 'العلاج',
      treatment_placeholder: 'العلاج المقدم',
      reference: 'المرجع',
      no_claims: 'لا توجد مطالبات',
      create: 'إنشاء',
      submit: 'إرسال',
      status: {
        draft: 'مسودة',
        submitted: 'مرسلة',
        under_review: 'قيد المراجعة',
        approved: 'موافقة',
        rejected: 'مرفوضة',
      },
    },
  },

  // Appointments
  appointment: {
    status: {
      pending: 'معلق',
      confirmed: 'مؤكد',
      in_progress: 'قيد التنفيذ',
      completed: 'مكتمل',
      cancelled: 'ملغي',
      no_show: 'لم يحضر',
    },
  },

  // Payments
  payment: {
    status: {
      pending: 'معلق',
      completed: 'مكتمل',
      failed: 'فشل',
      refunded: 'مسترد',
    },
  },

  // Reports
  report: {
    status: {
      ready: 'جاهز',
      processing: 'قيد المعالجة',
      failed: 'فشل',
    },
  },
};

async function seedTranslations() {
  const supabase = await createClient();

  try {
    logger.info('🌱 Starting comprehensive translation seeding...');

    const translations = [];

    // Flatten the nested translation keys
    function flattenKeys(
      obj: any,
      prefix = ''
    ): Array<{ key: string; value: string }> {
      const result: Array<{ key: string; value: string }> = [];

      for (const [key, value] of Object.entries(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;

        if (typeof value === 'object' && value !== null) {
          result.push(...flattenKeys(value, fullKey));
        } else {
          result.push({ key: fullKey, value: value as string });
        }
      }

      return result;
    }

    const flatTranslations = flattenKeys(translationKeys);

    // Insert Arabic translations
    for (const translation of flatTranslations) {
      translations.push({
        lang_code: 'ar',
        key: translation.key,
        value: translation.value,
      });
    }

    // Insert English translations (basic fallbacks)
    for (const translation of flatTranslations) {
      const englishValue =
        translation.key.split('.').pop() || translation.value;
      translations.push({
        lang_code: 'en',
        key: translation.key,
        value: englishValue,
      });
    }

    logger.info(`📊 Total translations to insert: ${translations.length}`);

    // Insert translations in batches
    const batchSize = 100;
    for (let i = 0; i < translations.length; i += batchSize) {
      const batch = translations.slice(i, i + batchSize);

      const { error } = await supabase
        .from('translations')
        .upsert(batch, { onConflict: 'lang_code,key' });

      if (error) {
        logger.error(`Error inserting batch ${i / batchSize + 1}:`, error);
      } else {
        logger.info(
          `✅ Inserted batch ${i / batchSize + 1}/${Math.ceil(translations.length / batchSize)}`
        );
      }
    }

    logger.info('🎉 Comprehensive translation seeding completed!');
  } catch (error) {
    logger.error('❌ Translation seeding failed:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  seedTranslations()
    .then(() => {
      logger.info('✅ Translation seeding completed successfully!');
      process.exit(0);
    })
    .catch(error => {
      logger.error('💥 Translation seeding failed:', error);
      process.exit(1);
    });
}

export { seedTranslations };
