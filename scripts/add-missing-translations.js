/**
 * Add Missing Translation Keys Script
 * Adds comprehensive translation keys for all UI components
 */

const { () => ({} as any) } = require('@supabase/supabase-js');
require('dotenv').config();

let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  // console.error('Missing Supabase credentials');
  process.exit(1);
}

let supabase = () => ({} as any)(supabaseUrl, supabaseKey);

// Comprehensive translation keys based on discovered UI text
let translations = {
  // ============= COMMON (عام) =============
  'common.loading': { ar: 'جاري التحميل...', en: 'Loading...' },
  'common.save': { ar: 'حفظ', en: 'Save' },
  'common.cancel': { ar: 'إلغاء', en: 'Cancel' },
  'common.delete': { ar: 'حذف', en: 'Delete' },
  'common.edit': { ar: 'تعديل', en: 'Edit' },
  'common.add': { ar: 'إضافة', en: 'Add' },
  'common.search': { ar: 'بحث', en: 'Search' },
  'common.filter': { ar: 'تصفية', en: 'Filter' },
  'common.print': { ar: 'طباعة', en: 'Print' },
  'common.update': { ar: 'تحديث', en: 'Update' },
  'common.close': { ar: 'إغلاق', en: 'Close' },
  'common.back': { ar: 'رجوع', en: 'Back' },
  'common.next': { ar: 'التالي', en: 'Next' },
  'common.previous': { ar: 'السابق', en: 'Previous' },
  'common.submit': { ar: 'إرسال', en: 'Submit' },
  'common.reset': { ar: 'إعادة تعيين', en: 'Reset' },
  'common.confirm': { ar: 'تأكيد', en: 'Confirm' },
  'common.yes': { ar: 'نعم', en: 'Yes' },
  'common.no': { ar: 'لا', en: 'No' },
  'common.ok': { ar: 'موافق', en: 'OK' },
  'common.error': { ar: 'خطأ', en: 'Error' },
  'common.success': { ar: 'نجح', en: 'Success' },
  'common.warning': { ar: 'تحذير', en: 'Warning' },
  'common.info': { ar: 'معلومات', en: 'Info' },

  // ============= STATUS (الحالة) =============
  'status.active': { ar: 'نشط', en: 'Active' },
  'status.inactive': { ar: 'غير نشط', en: 'Inactive' },
  'status.blocked': { ar: 'محظور', en: 'Blocked' },
  'status.pending': { ar: 'قيد الانتظار', en: 'Pending' },
  'status.approved': { ar: 'موافق عليه', en: 'Approved' },
  'status.rejected': { ar: 'مرفوض', en: 'Rejected' },
  'status.completed': { ar: 'مكتملة', en: 'Completed' },
  'status.cancelled': { ar: 'ملغية', en: 'Cancelled' },
  'status.upcoming': { ar: 'قادمة', en: 'Upcoming' },
  'status.under_review': { ar: 'قيد التدقيق', en: 'Under Review' },
  'status.draft': { ar: 'مسودة', en: 'Draft' },
  'status.published': { ar: 'منشور', en: 'Published' },

  // ============= BUTTONS (الأزرار) =============
  'button.save': { ar: 'حفظ', en: 'Save' },
  'button.cancel': { ar: 'إلغاء', en: 'Cancel' },
  'button.delete': { ar: 'حذف', en: 'Delete' },
  'button.edit': { ar: 'تعديل', en: 'Edit' },
  'button.add': { ar: 'إضافة', en: 'Add' },
  'button.search': { ar: 'بحث', en: 'Search' },
  'button.filter': { ar: 'تصفية', en: 'Filter' },
  'button.print': { ar: 'طباعة', en: 'Print' },
  'button.update': { ar: 'تحديث', en: 'Update' },
  'button.close': { ar: 'إغلاق', en: 'Close' },
  'button.back': { ar: 'رجوع', en: 'Back' },
  'button.next': { ar: 'التالي', en: 'Next' },
  'button.previous': { ar: 'السابق', en: 'Previous' },
  'button.submit': { ar: 'إرسال', en: 'Submit' },
  'button.reset': { ar: 'إعادة تعيين', en: 'Reset' },
  'button.confirm': { ar: 'تأكيد', en: 'Confirm' },
  'button.login': { ar: 'تسجيل الدخول', en: 'Login' },
  'button.logout': { ar: 'تسجيل الخروج', en: 'Logout' },
  'button.register': { ar: 'تسجيل', en: 'Register' },
  'button.forgot_password': { ar: 'نسيت كلمة المرور؟', en: 'Forgot Password?' },
  'button.reset_password': { ar: 'إعادة تعيين كلمة المرور', en: 'Reset Password' },
  'button.verify_email': { ar: 'تأكيد البريد الإلكتروني', en: 'Verify Email' },
  'button.create_account': { ar: 'إنشاء حساب', en: 'Create Account' },
  'button.add_claim': { ar: 'إضافة مطالبة', en: 'Add Claim' },
  'button.update_status': { ar: 'تحديث الحالة', en: 'Update Status' },
  'button.print_file': { ar: 'طباعة الملف', en: 'Print File' },
  'button.update_file': { ar: 'تحديث الملف', en: 'Update File' },

  // ============= FORMS (النماذج) =============
  'form.email': { ar: 'البريد الإلكتروني', en: 'Email' },
  'form.password': { ar: 'كلمة المرور', en: 'Password' },
  'form.confirm_password': { ar: 'تأكيد كلمة المرور', en: 'Confirm Password' },
  'form.name': { ar: 'الاسم', en: 'Name' },
  'form.phone': { ar: 'رقم الهاتف', en: 'Phone' },
  'form.address': { ar: 'العنوان', en: 'Address' },
  'form.date': { ar: 'التاريخ', en: 'Date' },
  'form.time': { ar: 'الوقت', en: 'Time' },
  'form.description': { ar: 'الوصف', en: 'Description' },
  'form.notes': { ar: 'ملاحظات', en: 'Notes' },
  'form.required': { ar: 'مطلوب', en: 'Required' },
  'form.optional': { ar: 'اختياري', en: 'Optional' },
  'form.invalid_email': { ar: 'البريد الإلكتروني غير صحيح', en: 'Invalid email format' },
  'form.password_too_short': { ar: 'كلمة المرور قصيرة جداً', en: 'Password too short' },
  'form.passwords_dont_match': { ar: 'كلمات المرور غير متطابقة', en: 'Passwords do not match' },
  'form.field_required': { ar: 'هذا الحقل مطلوب', en: 'This field is required' },

  // ============= PAGES (الصفحات) =============
  'page.patients.title': { ar: 'المرضى', en: 'Patients' },
  'page.patients.description': { ar: 'إدارة بيانات المرضى', en: 'Manage patient data' },
  'page.insurance.title': { ar: 'المطالبات التأمينية', en: 'Insurance Claims' },
  'page.insurance.description': { ar: 'إدارة وتتبع المطالبات', en: 'Manage and track claims' },
  'page.medical_file.title': { ar: 'الملف الطبي', en: 'Medical File' },
  'page.medical_file.description': { ar: 'عرض وتحديث الملف الطبي', en: 'View and update medical file' },
  'page.appointments.title': { ar: 'المواعيد', en: 'Appointments' },
  'page.appointments.description': { ar: 'إدارة المواعيد', en: 'Manage appointments' },
  'page.dashboard.title': { ar: 'لوحة التحكم', en: 'Dashboard' },
  'page.dashboard.description': { ar: 'نظرة عامة على النظام', en: 'System overview' },
  'page.admin.title': { ar: 'الإدارة', en: 'Admin' },
  'page.admin.description': { ar: 'إدارة النظام', en: 'System administration' },

  // ============= NAVIGATION (التنقل) =============
  'nav.home': { ar: 'الرئيسية', en: 'Home' },
  'nav.patients': { ar: 'المرضى', en: 'Patients' },
  'nav.appointments': { ar: 'المواعيد', en: 'Appointments' },
  'nav.medical_records': { ar: 'السجلات الطبية', en: 'Medical Records' },
  'nav.insurance': { ar: 'التأمين', en: 'Insurance' },
  'nav.payments': { ar: 'المدفوعات', en: 'Payments' },
  'nav.dashboard': { ar: 'لوحة التحكم', en: 'Dashboard' },
  'nav.admin': { ar: 'الإدارة', en: 'Admin' },
  'nav.settings': { ar: 'الإعدادات', en: 'Settings' },
  'nav.profile': { ar: 'الملف الشخصي', en: 'Profile' },
  'nav.logout': { ar: 'تسجيل الخروج', en: 'Logout' },

  // ============= MESSAGES (الرسائل) =============
  'message.login_success': { ar: 'تم تسجيل الدخول بنجاح', en: 'Login successful' },
  'message.login_failed': { ar: 'بيانات الدخول غير صحيحة', en: 'Invalid credentials' },
  'message.account_locked': { ar: 'الحساب مقفل', en: 'Account locked' },
  'message.email_required': { ar: 'البريد الإلكتروني وكلمة المرور مطلوبان', en: 'Email and password are required' },
  'message.invalid_email_format': { ar: 'البريد الإلكتروني غير صحيح', en: 'Invalid email format' },
  'message.save_success': { ar: 'تم الحفظ بنجاح', en: 'Saved successfully' },
  'message.delete_success': { ar: 'تم الحذف بنجاح', en: 'Deleted successfully' },
  'message.update_success': { ar: 'تم التحديث بنجاح', en: 'Updated successfully' },
  'message.error_occurred': { ar: 'حدث خطأ', en: 'An error occurred' },
  'message.confirm_delete': { ar: 'هل أنت متأكد من الحذف؟', en: 'Are you sure you want to delete?' },
  'message.no_data': { ar: 'لا توجد بيانات', en: 'No data available' },
  'message.loading_data': { ar: 'جاري تحميل البيانات...', en: 'Loading data...' },

  // ============= MEDICAL TERMS (المصطلحات الطبية) =============
  'medical.patient_id': { ar: 'رقم المريض', en: 'Patient ID' },
  'medical.patient_name': { ar: 'اسم المريض', en: 'Patient Name' },
  'medical.diagnosis': { ar: 'التشخيص', en: 'Diagnosis' },
  'medical.treatment': { ar: 'العلاج', en: 'Treatment' },
  'medical.prescription': { ar: 'الوصفة الطبية', en: 'Prescription' },
  'medical.symptoms': { ar: 'الأعراض', en: 'Symptoms' },
  'medical.allergies': { ar: 'الحساسية', en: 'Allergies' },
  'medical.medications': { ar: 'الأدوية', en: 'Medications' },
  'medical.vital_signs': { ar: 'العلامات الحيوية', en: 'Vital Signs' },
  'medical.blood_pressure': { ar: 'ضغط الدم', en: 'Blood Pressure' },
  'medical.heart_rate': { ar: 'معدل النبض', en: 'Heart Rate' },
  'medical.temperature': { ar: 'درجة الحرارة', en: 'Temperature' },
  'medical.weight': { ar: 'الوزن', en: 'Weight' },
  'medical.height': { ar: 'الطول', en: 'Height' },
  'medical.notes': { ar: 'ملاحظات طبية', en: 'Medical Notes' },

  // ============= INSURANCE TERMS (مصطلحات التأمين) =============
  'insurance.claim_number': { ar: 'رقم المطالبة', en: 'Claim Number' },
  'insurance.insurance_provider': { ar: 'مقدم التأمين', en: 'Insurance Provider' },
  'insurance.policy_number': { ar: 'رقم البوليصة', en: 'Policy Number' },
  'insurance.claim_amount': { ar: 'مبلغ المطالبة', en: 'Claim Amount' },
  'insurance.approved_amount': { ar: 'المبلغ المعتمد', en: 'Approved Amount' },
  'insurance.outstanding_balance': { ar: 'الرصيد المستحق', en: 'Outstanding Balance' },
  'insurance.rejection_reason': { ar: 'سبب الرفض', en: 'Rejection Reason' },
  'insurance.block_status': { ar: 'حالة الحظر', en: 'Block Status' },
  'insurance.no_outstanding_balance': { ar: 'لا يوجد رصيد مستحق', en: 'No Outstanding Balance' },

  // ============= APPOINTMENT TERMS (مصطلحات المواعيد) =============
  'appointment.scheduled_at': { ar: 'موعد الحجز', en: 'Scheduled At' },
  'appointment.duration': { ar: 'المدة', en: 'Duration' },
  'appointment.type': { ar: 'نوع الموعد', en: 'Appointment Type' },
  'appointment.consultation': { ar: 'استشارة', en: 'Consultation' },
  'appointment.follow_up': { ar: 'متابعة', en: 'Follow Up' },
  'appointment.emergency': { ar: 'طوارئ', en: 'Emergency' },
  'appointment.doctor': { ar: 'الطبيب', en: 'Doctor' },
  'appointment.speciality': { ar: 'التخصص', en: 'Speciality' },
  'appointment.room': { ar: 'الغرفة', en: 'Room' },
  'appointment.notes': { ar: 'ملاحظات الموعد', en: 'Appointment Notes' },

  // ============= DASHBOARD TERMS (مصطلحات لوحة التحكم) =============
  'dashboard.total_patients': { ar: 'إجمالي المرضى', en: 'Total Patients' },
  'dashboard.total_appointments': { ar: 'إجمالي المواعيد', en: 'Total Appointments' },
  'dashboard.today_appointments': { ar: 'مواعيد اليوم', en: 'Today\'s Appointments' },
  'dashboard.pending_claims': { ar: 'المطالبات المعلقة', en: 'Pending Claims' },
  'dashboard.recent_activity': { ar: 'النشاط الأخير', en: 'Recent Activity' },
  'dashboard.statistics': { ar: 'الإحصائيات', en: 'Statistics' },
  'dashboard.quick_actions': { ar: 'إجراءات سريعة', en: 'Quick Actions' },
  'dashboard.notifications': { ar: 'الإشعارات', en: 'Notifications' },

  // ============= ADMIN TERMS (مصطلحات الإدارة) =============
  'admin.users': { ar: 'المستخدمون', en: 'Users' },
  'admin.roles': { ar: 'الأدوار', en: 'strings' },
  'admin.permissions': { ar: 'الصلاحيات', en: 'Permissions' },
  'admin.audit_logs': { ar: 'سجلات التدقيق', en: 'Audit Logs' },
  'admin.system_settings': { ar: 'إعدادات النظام', en: 'System Settings' },
  'admin.backup': { ar: 'النسخ الاحتياطي', en: 'Backup' },
  'admin.maintenance': { ar: 'الصيانة', en: 'Maintenance' },
  'admin.reports': { ar: 'التقارير', en: 'Reports' },
  'admin.analytics': { ar: 'التحليلات', en: 'Analytics' },
  'admin.integrations': { ar: 'التكاملات', en: 'Integrations' }
};

async function addMissingTranslations() {
  // console.log('🚀 Starting to add missing translation keys...');

  let addedCount = 0;
  let errorCount = 0;

  for (const key in translations) {
    if (Object.prototype.hasOwnProperty.call(translations, key)) {
      for (const lang in translations[key]) {
        if (Object.prototype.hasOwnProperty.call(translations[key], lang)) {
          let value = translations[key][lang];
          let namespace = key.split('.')[0];

          try {
            const error = await supabase
              .from('translations')
              .upsert({
                locale: lang,
                key: key,
                value: value,
                namespace: namespace
              }, {
                onConflict: 'locale,key,namespace',
                ignoreDuplicates: true
              });

            if (error) {
              // console.error(`❌ Error adding translation for key '${key}' (${lang}):`
              errorCount++;
            } else {
              addedCount++;
              // // console.log(`✅ Added translation for key '${key}' (${lang})`
            }
          } catch (err) {
            // console.error(`❌ Exception adding translation for key '${key}' (${lang}):`
            errorCount++;
          }
        }
      }
    }
  }

  // console.log('\n📊 Translation Addition Summary:');
  // console.log(`✅ Successfully added: ${addedCount} translations`
  // console.log(`❌ Errors: ${errorCount} translations`
  // console.log(`📝 Total keys processed: ${Object.keys(translations).length * 2}`

  if (errorCount === 0) {
    // console.log('🎉 All translations added successfully!');
  } else {
    // console.log('⚠️ Some translations failed to add. Check the errors above.');
  }
}

// Run the script
addMissingTranslations().catch(console.error);
