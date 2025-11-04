/**
 * Translation Seeder - مولد الترجمات
 * Seeds the database with all required translations
 */

import { realDB } from '@/lib/supabase-real';

interface TranslationData {
  key: string;
  ar: string;
  en: string;
  context?: string;
  module?: string;
}

class TranslationSeeder {
  private translations: TranslationData[] = [];

  constructor() {
    this.initializeTranslations();
  }

  private initializeTranslations() {
    // Authentication Module
    this.addTranslations([
      {
        key: 'auth.login.title',
        ar: 'تسجيل الدخول',
        en: 'Login',
        module: 'auth',
      },
      {
        key: 'auth.login.email',
        ar: 'البريد الإلكتروني',
        en: 'Email',
        module: 'auth',
      },
      {
        key: 'auth.login.password',
        ar: 'كلمة المرور',
        en: 'Password',
        module: 'auth',
      },
      { key: 'auth.login.submit', ar: 'دخول', en: 'Login', module: 'auth' },
      {
        key: 'auth.login.forgot',
        ar: 'نسيت كلمة المرور؟',
        en: 'Forgot Password?',
        module: 'auth',
      },
      {
        key: 'auth.register.title',
        ar: 'إنشاء حساب جديد',
        en: 'Create New Account',
        module: 'auth',
      },
      {
        key: 'auth.register.name',
        ar: 'الاسم الكامل',
        en: 'Full Name',
        module: 'auth',
      },
      {
        key: 'auth.register.phone',
        ar: 'رقم الهاتف',
        en: 'Phone Number',
        module: 'auth',
      },
      {
        key: 'auth.register.submit',
        ar: 'إنشاء حساب',
        en: 'Create Account',
        module: 'auth',
      },
      { key: 'auth.logout', ar: 'تسجيل الخروج', en: 'Logout', module: 'auth' },
      {
        key: 'auth.errors.invalid_credentials',
        ar: 'بيانات الدخول غير صحيحة',
        en: 'Invalid credentials',
        module: 'auth',
      },
      {
        key: 'auth.errors.email_required',
        ar: 'البريد الإلكتروني مطلوب',
        en: 'Email is required',
        module: 'auth',
      },
      {
        key: 'auth.errors.password_required',
        ar: 'كلمة المرور مطلوبة',
        en: 'Password is required',
        module: 'auth',
      },
    ]);

    // Patients Module
    this.addTranslations([
      {
        key: 'patients.title',
        ar: 'إدارة المرضى',
        en: 'Patients Management',
        module: 'patients',
      },
      {
        key: 'patients.add',
        ar: 'إضافة مريض جديد',
        en: 'Add New Patient',
        module: 'patients',
      },
      {
        key: 'patients.name',
        ar: 'اسم المريض',
        en: 'Patient Name',
        module: 'patients',
      },
      {
        key: 'patients.phone',
        ar: 'رقم الهاتف',
        en: 'Phone Number',
        module: 'patients',
      },
      {
        key: 'patients.email',
        ar: 'البريد الإلكتروني',
        en: 'Email',
        module: 'patients',
      },
      { key: 'patients.age', ar: 'العمر', en: 'Age', module: 'patients' },
      { key: 'patients.gender', ar: 'الجنس', en: 'Gender', module: 'patients' },
      {
        key: 'patients.gender.male',
        ar: 'ذكر',
        en: 'Male',
        module: 'patients',
      },
      {
        key: 'patients.gender.female',
        ar: 'أنثى',
        en: 'Female',
        module: 'patients',
      },
      {
        key: 'patients.address',
        ar: 'العنوان',
        en: 'Address',
        module: 'patients',
      },
      {
        key: 'patients.emergency_contact',
        ar: 'جهة الاتصال في الطوارئ',
        en: 'Emergency Contact',
        module: 'patients',
      },
      {
        key: 'patients.medical_history',
        ar: 'التاريخ المرضي',
        en: 'Medical History',
        module: 'patients',
      },
      {
        key: 'patients.allergies',
        ar: 'الحساسية',
        en: 'Allergies',
        module: 'patients',
      },
      {
        key: 'patients.medications',
        ar: 'الأدوية',
        en: 'Medications',
        module: 'patients',
      },
      {
        key: 'patients.insurance_provider',
        ar: 'مقدم التأمين',
        en: 'Insurance Provider',
        module: 'patients',
      },
      {
        key: 'patients.insurance_number',
        ar: 'رقم التأمين',
        en: 'Insurance Number',
        module: 'patients',
      },
      {
        key: 'patients.actions.edit',
        ar: 'تعديل',
        en: 'Edit',
        module: 'patients',
      },
      {
        key: 'patients.actions.delete',
        ar: 'حذف',
        en: 'Delete',
        module: 'patients',
      },
      {
        key: 'patients.actions.view',
        ar: 'عرض',
        en: 'View',
        module: 'patients',
      },
      {
        key: 'patients.status.active',
        ar: 'نشط',
        en: 'Active',
        module: 'patients',
      },
      {
        key: 'patients.status.inactive',
        ar: 'غير نشط',
        en: 'Inactive',
        module: 'patients',
      },
    ]);

    // Appointments Module
    this.addTranslations([
      {
        key: 'appointments.title',
        ar: 'إدارة المواعيد',
        en: 'Appointments Management',
        module: 'appointments',
      },
      {
        key: 'appointments.book',
        ar: 'حجز موعد',
        en: 'Book Appointment',
        module: 'appointments',
      },
      {
        key: 'appointments.date',
        ar: 'التاريخ',
        en: 'Date',
        module: 'appointments',
      },
      {
        key: 'appointments.time',
        ar: 'الوقت',
        en: 'Time',
        module: 'appointments',
      },
      {
        key: 'appointments.doctor',
        ar: 'الطبيب',
        en: 'Doctor',
        module: 'appointments',
      },
      {
        key: 'appointments.patient',
        ar: 'المريض',
        en: 'Patient',
        module: 'appointments',
      },
      {
        key: 'appointments.type',
        ar: 'نوع الموعد',
        en: 'Appointment Type',
        module: 'appointments',
      },
      {
        key: 'appointments.type.consultation',
        ar: 'استشارة',
        en: 'Consultation',
        module: 'appointments',
      },
      {
        key: 'appointments.type.therapy',
        ar: 'علاج',
        en: 'Therapy',
        module: 'appointments',
      },
      {
        key: 'appointments.type.follow_up',
        ar: 'متابعة',
        en: 'Follow-up',
        module: 'appointments',
      },
      {
        key: 'appointments.status.pending',
        ar: 'معلق',
        en: 'Pending',
        module: 'appointments',
      },
      {
        key: 'appointments.status.confirmed',
        ar: 'مؤكد',
        en: 'Confirmed',
        module: 'appointments',
      },
      {
        key: 'appointments.status.completed',
        ar: 'مكتمل',
        en: 'Completed',
        module: 'appointments',
      },
      {
        key: 'appointments.status.cancelled',
        ar: 'ملغي',
        en: 'Cancelled',
        module: 'appointments',
      },
      {
        key: 'appointments.actions.confirm',
        ar: 'تأكيد',
        en: 'Confirm',
        module: 'appointments',
      },
      {
        key: 'appointments.actions.cancel',
        ar: 'إلغاء',
        en: 'Cancel',
        module: 'appointments',
      },
      {
        key: 'appointments.actions.reschedule',
        ar: 'إعادة جدولة',
        en: 'Reschedule',
        module: 'appointments',
      },
    ]);

    // Medical Records Module
    this.addTranslations([
      {
        key: 'medical_records.title',
        ar: 'السجلات الطبية',
        en: 'Medical Records',
        module: 'medical_records',
      },
      {
        key: 'medical_records.add',
        ar: 'إضافة سجل طبي',
        en: 'Add Medical Record',
        module: 'medical_records',
      },
      {
        key: 'medical_records.type',
        ar: 'نوع السجل',
        en: 'Record Type',
        module: 'medical_records',
      },
      {
        key: 'medical_records.type.consultation',
        ar: 'استشارة',
        en: 'Consultation',
        module: 'medical_records',
      },
      {
        key: 'medical_records.type.therapy_session',
        ar: 'جلسة علاج',
        en: 'Therapy Session',
        module: 'medical_records',
      },
      {
        key: 'medical_records.type.diagnosis',
        ar: 'تشخيص',
        en: 'Diagnosis',
        module: 'medical_records',
      },
      {
        key: 'medical_records.title_field',
        ar: 'عنوان السجل',
        en: 'Record Title',
        module: 'medical_records',
      },
      {
        key: 'medical_records.content',
        ar: 'المحتوى',
        en: 'Content',
        module: 'medical_records',
      },
      {
        key: 'medical_records.diagnosis',
        ar: 'التشخيص',
        en: 'Diagnosis',
        module: 'medical_records',
      },
      {
        key: 'medical_records.treatment',
        ar: 'العلاج',
        en: 'Treatment',
        module: 'medical_records',
      },
      {
        key: 'medical_records.medications',
        ar: 'الأدوية',
        en: 'Medications',
        module: 'medical_records',
      },
      {
        key: 'medical_records.attachments',
        ar: 'المرفقات',
        en: 'Attachments',
        module: 'medical_records',
      },
    ]);

    // Doctors Module
    this.addTranslations([
      {
        key: 'doctors.title',
        ar: 'إدارة الأطباء',
        en: 'Doctors Management',
        module: 'doctors',
      },
      {
        key: 'doctors.add',
        ar: 'إضافة طبيب جديد',
        en: 'Add New Doctor',
        module: 'doctors',
      },
      {
        key: 'doctors.name',
        ar: 'اسم الطبيب',
        en: 'Doctor Name',
        module: 'doctors',
      },
      {
        key: 'doctors.speciality',
        ar: 'التخصص',
        en: 'Speciality',
        module: 'doctors',
      },
      {
        key: 'doctors.license_number',
        ar: 'رقم الترخيص',
        en: 'License Number',
        module: 'doctors',
      },
      {
        key: 'doctors.experience_years',
        ar: 'سنوات الخبرة',
        en: 'Years of Experience',
        module: 'doctors',
      },
      {
        key: 'doctors.qualifications',
        ar: 'المؤهلات',
        en: 'Qualifications',
        module: 'doctors',
      },
      {
        key: 'doctors.languages',
        ar: 'اللغات',
        en: 'Languages',
        module: 'doctors',
      },
      {
        key: 'doctors.bio',
        ar: 'السيرة الذاتية',
        en: 'Biography',
        module: 'doctors',
      },
      {
        key: 'doctors.working_hours',
        ar: 'ساعات العمل',
        en: 'Working Hours',
        module: 'doctors',
      },
      { key: 'doctors.rating', ar: 'التقييم', en: 'Rating', module: 'doctors' },
      {
        key: 'doctors.status.active',
        ar: 'نشط',
        en: 'Active',
        module: 'doctors',
      },
      {
        key: 'doctors.status.inactive',
        ar: 'غير نشط',
        en: 'Inactive',
        module: 'doctors',
      },
    ]);

    // Dashboard Module
    this.addTranslations([
      {
        key: 'dashboard.title',
        ar: 'لوحة التحكم',
        en: 'Dashboard',
        module: 'dashboard',
      },
      {
        key: 'dashboard.welcome',
        ar: 'مرحباً',
        en: 'Welcome',
        module: 'dashboard',
      },
      {
        key: 'dashboard.overview',
        ar: 'نظرة عامة',
        en: 'Overview',
        module: 'dashboard',
      },
      {
        key: 'dashboard.statistics',
        ar: 'الإحصائيات',
        en: 'Statistics',
        module: 'dashboard',
      },
      {
        key: 'dashboard.recent_activities',
        ar: 'الأنشطة الأخيرة',
        en: 'Recent Activities',
        module: 'dashboard',
      },
      {
        key: 'dashboard.notifications',
        ar: 'الإشعارات',
        en: 'Notifications',
        module: 'dashboard',
      },
      {
        key: 'dashboard.quick_actions',
        ar: 'الإجراءات السريعة',
        en: 'Quick Actions',
        module: 'dashboard',
      },
      {
        key: 'dashboard.system_health',
        ar: 'صحة النظام',
        en: 'System Health',
        module: 'dashboard',
      },
    ]);

    // Insurance Module
    this.addTranslations([
      {
        key: 'insurance.title',
        ar: 'إدارة التأمين',
        en: 'Insurance Management',
        module: 'insurance',
      },
      {
        key: 'insurance.claims',
        ar: 'المطالبات',
        en: 'Claims',
        module: 'insurance',
      },
      {
        key: 'insurance.add_claim',
        ar: 'إضافة مطالبة جديدة',
        en: 'Add New Claim',
        module: 'insurance',
      },
      {
        key: 'insurance.claim_number',
        ar: 'رقم المطالبة',
        en: 'Claim Number',
        module: 'insurance',
      },
      {
        key: 'insurance.amount',
        ar: 'المبلغ',
        en: 'Amount',
        module: 'insurance',
      },
      {
        key: 'insurance.provider',
        ar: 'مقدم التأمين',
        en: 'Insurance Provider',
        module: 'insurance',
      },
      {
        key: 'insurance.policy_number',
        ar: 'رقم البوليصة',
        en: 'Policy Number',
        module: 'insurance',
      },
      {
        key: 'insurance.treatment_type',
        ar: 'نوع العلاج',
        en: 'Treatment Type',
        module: 'insurance',
      },
      {
        key: 'insurance.status.pending',
        ar: 'معلق',
        en: 'Pending',
        module: 'insurance',
      },
      {
        key: 'insurance.status.approved',
        ar: 'موافق عليه',
        en: 'Approved',
        module: 'insurance',
      },
      {
        key: 'insurance.status.rejected',
        ar: 'مرفوض',
        en: 'Rejected',
        module: 'insurance',
      },
    ]);

    // Notifications Module
    this.addTranslations([
      {
        key: 'notifications.title',
        ar: 'الإشعارات',
        en: 'Notifications',
        module: 'notifications',
      },
      {
        key: 'notifications.create',
        ar: 'إنشاء إشعار',
        en: 'Create Notification',
        module: 'notifications',
      },
      {
        key: 'notifications.type',
        ar: 'نوع الإشعار',
        en: 'Notification Type',
        module: 'notifications',
      },
      {
        key: 'notifications.priority',
        ar: 'الأولوية',
        en: 'Priority',
        module: 'notifications',
      },
      {
        key: 'notifications.priority.low',
        ar: 'منخفضة',
        en: 'Low',
        module: 'notifications',
      },
      {
        key: 'notifications.priority.medium',
        ar: 'متوسطة',
        en: 'Medium',
        module: 'notifications',
      },
      {
        key: 'notifications.priority.high',
        ar: 'عالية',
        en: 'High',
        module: 'notifications',
      },
      {
        key: 'notifications.priority.critical',
        ar: 'حرجة',
        en: 'Critical',
        module: 'notifications',
      },
      {
        key: 'notifications.title_field',
        ar: 'عنوان الإشعار',
        en: 'Notification Title',
        module: 'notifications',
      },
      {
        key: 'notifications.message',
        ar: 'الرسالة',
        en: 'Message',
        module: 'notifications',
      },
      {
        key: 'notifications.status.read',
        ar: 'مقروء',
        en: 'Read',
        module: 'notifications',
      },
      {
        key: 'notifications.status.unread',
        ar: 'غير مقروء',
        en: 'Unread',
        module: 'notifications',
      },
    ]);

    // Admin Module
    this.addTranslations([
      {
        key: 'admin.title',
        ar: 'الإدارة',
        en: 'Administration',
        module: 'admin',
      },
      { key: 'admin.users', ar: 'المستخدمون', en: 'Users', module: 'admin' },
      {
        key: 'admin.settings',
        ar: 'الإعدادات',
        en: 'Settings',
        module: 'admin',
      },
      {
        key: 'admin.logs',
        ar: 'سجلات النظام',
        en: 'System Logs',
        module: 'admin',
      },
      {
        key: 'admin.backup',
        ar: 'النسخ الاحتياطي',
        en: 'Backup',
        module: 'admin',
      },
      {
        key: 'admin.system_health',
        ar: 'صحة النظام',
        en: 'System Health',
        module: 'admin',
      },
      {
        key: 'admin.performance',
        ar: 'الأداء',
        en: 'Performance',
        module: 'admin',
      },
    ]);

    // Common UI Elements
    this.addTranslations([
      { key: 'common.save', ar: 'حفظ', en: 'Save', module: 'common' },
      { key: 'common.cancel', ar: 'إلغاء', en: 'Cancel', module: 'common' },
      { key: 'common.delete', ar: 'حذف', en: 'Delete', module: 'common' },
      { key: 'common.edit', ar: 'تعديل', en: 'Edit', module: 'common' },
      { key: 'common.view', ar: 'عرض', en: 'View', module: 'common' },
      { key: 'common.add', ar: 'إضافة', en: 'Add', module: 'common' },
      { key: 'common.search', ar: 'بحث', en: 'Search', module: 'common' },
      { key: 'common.filter', ar: 'تصفية', en: 'Filter', module: 'common' },
      { key: 'common.clear', ar: 'مسح', en: 'Clear', module: 'common' },
      {
        key: 'common.loading',
        ar: 'جاري التحميل...',
        en: 'Loading...',
        module: 'common',
      },
      {
        key: 'common.success',
        ar: 'تم بنجاح',
        en: 'Success',
        module: 'common',
      },
      { key: 'common.error', ar: 'خطأ', en: 'Error', module: 'common' },
      { key: 'common.warning', ar: 'تحذير', en: 'Warning', module: 'common' },
      { key: 'common.info', ar: 'معلومات', en: 'Info', module: 'common' },
      { key: 'common.confirm', ar: 'تأكيد', en: 'Confirm', module: 'common' },
      { key: 'common.yes', ar: 'نعم', en: 'Yes', module: 'common' },
      { key: 'common.no', ar: 'لا', en: 'No', module: 'common' },
      { key: 'common.close', ar: 'إغلاق', en: 'Close', module: 'common' },
      { key: 'common.back', ar: 'رجوع', en: 'Back', module: 'common' },
      { key: 'common.next', ar: 'التالي', en: 'Next', module: 'common' },
      {
        key: 'common.previous',
        ar: 'السابق',
        en: 'Previous',
        module: 'common',
      },
      {
        key: 'common.excellent',
        ar: 'ممتاز',
        en: 'Excellent',
        module: 'common',
      },
      { key: 'common.good', ar: 'جيد', en: 'Good', module: 'common' },
      {
        key: 'common.needs_improvement',
        ar: 'يحتاج تحسين',
        en: 'Needs Improvement',
        module: 'common',
      },
      {
        key: 'common.searchPlaceholder',
        ar: 'ابحث في النظام...',
        en: 'Search in system...',
        module: 'common',
      },
      {
        key: 'common.systemName',
        ar: 'مركز الهمم',
        en: 'Al-Himam Center',
        module: 'common',
      },
      {
        key: 'common.openMenu',
        ar: 'فتح القائمة',
        en: 'Open Menu',
        module: 'common',
      },
    ]);

    // Supervisor Dashboard Module
    this.addTranslations([
      {
        key: 'supervisor.dashboard.welcome',
        ar: 'مرحباً',
        en: 'Welcome',
        module: 'supervisor',
      },
      {
        key: 'supervisor.dashboard.subtitle',
        ar: 'لوحة تحكم المشرف',
        en: 'Supervisor Dashboard',
        module: 'supervisor',
      },
      {
        key: 'supervisor.dashboard.total_patients',
        ar: 'إجمالي المرضى',
        en: 'Total Patients',
        module: 'supervisor',
      },
      {
        key: 'supervisor.dashboard.total_appointments',
        ar: 'إجمالي المواعيد',
        en: 'Total Appointments',
        module: 'supervisor',
      },
      {
        key: 'supervisor.dashboard.revenue',
        ar: 'الإيرادات',
        en: 'Revenue',
        module: 'supervisor',
      },
      {
        key: 'supervisor.dashboard.claims_processed',
        ar: 'المطالبات المعالجة',
        en: 'Claims Processed',
        module: 'supervisor',
      },
      {
        key: 'supervisor.dashboard.staff_performance',
        ar: 'أداء الموظفين',
        en: 'Staff Performance',
        module: 'supervisor',
      },
      {
        key: 'supervisor.dashboard.system_alerts',
        ar: 'تنبيهات النظام',
        en: 'System Alerts',
        module: 'supervisor',
      },
      {
        key: 'supervisor.dashboard.no_alerts',
        ar: 'لا توجد تنبيهات',
        en: 'No alerts',
        module: 'supervisor',
      },
      {
        key: 'supervisor.dashboard.no_staff_data',
        ar: 'لا توجد بيانات للموظفين',
        en: 'No staff data',
        module: 'supervisor',
      },
      {
        key: 'supervisor.dashboard.reports',
        ar: 'التقارير',
        en: 'Reports',
        module: 'supervisor',
      },
      {
        key: 'supervisor.dashboard.tasks',
        ar: 'المهام',
        en: 'Tasks',
        module: 'supervisor',
      },
      {
        key: 'supervisor.dashboard.efficiency',
        ar: 'الكفاءة',
        en: 'Efficiency',
        module: 'supervisor',
      },
      {
        key: 'supervisor.dashboard.recent_reports',
        ar: 'التقارير الأخيرة',
        en: 'Recent Reports',
        module: 'supervisor',
      },
      {
        key: 'supervisor.actions.daily_report',
        ar: 'تقرير يومي',
        en: 'Daily Report',
        module: 'supervisor',
      },
      {
        key: 'supervisor.actions.monthly_report',
        ar: 'تقرير شهري',
        en: 'Monthly Report',
        module: 'supervisor',
      },
      {
        key: 'supervisor.actions.staff_report',
        ar: 'تقرير الموظفين',
        en: 'Staff Report',
        module: 'supervisor',
      },
      {
        key: 'report.status.ready',
        ar: 'جاهز',
        en: 'Ready',
        module: 'supervisor',
      },
      {
        key: 'report.status.processing',
        ar: 'قيد المعالجة',
        en: 'Processing',
        module: 'supervisor',
      },
      {
        key: 'report.status.failed',
        ar: 'فشل',
        en: 'Failed',
        module: 'supervisor',
      },
    ]);

    // Header Module
    this.addTranslations([
      {
        key: 'header.welcome',
        ar: 'مرحباً',
        en: 'Welcome',
        module: 'common',
      },
      {
        key: 'header.profile',
        ar: 'الملف الشخصي',
        en: 'Profile',
        module: 'common',
      },
      {
        key: 'header.settings',
        ar: 'الإعدادات',
        en: 'Settings',
        module: 'common',
      },
      {
        key: 'header.logout',
        ar: 'تسجيل الخروج',
        en: 'Logout',
        module: 'common',
      },
      {
        key: 'header.notifications',
        ar: 'الإشعارات',
        en: 'Notifications',
        module: 'common',
      },
      {
        key: 'header.noNotifications',
        ar: 'لا توجد إشعارات',
        en: 'No notifications',
        module: 'common',
      },
      {
        key: 'header.notification',
        ar: 'إشعار {number}',
        en: 'Notification {number}',
        module: 'common',
      },
      {
        key: 'header.markAsRead',
        ar: 'تعليم كمقروء',
        en: 'Mark as read',
        module: 'common',
      },
      {
        key: 'header.aiFeatures',
        ar: 'ميزات الذكاء الاصطناعي',
        en: 'AI Features',
        module: 'common',
      },
      {
        key: 'header.chatbot',
        ar: 'المساعد الذكي',
        en: 'Chatbot',
        module: 'common',
      },
      {
        key: 'header.chatbotStatus',
        ar: 'نشط',
        en: 'Active',
        module: 'common',
      },
      {
        key: 'header.voiceBot',
        ar: 'المساعد الصوتي',
        en: 'Voice Bot',
        module: 'common',
      },
      {
        key: 'header.voiceBotStatus',
        ar: 'نشط',
        en: 'Active',
        module: 'common',
      },
      {
        key: 'header.emotionAnalytics',
        ar: 'تحليل المشاعر',
        en: 'Emotion Analytics',
        module: 'common',
      },
      {
        key: 'header.emotionAnalyticsStatus',
        ar: 'نشط',
        en: 'Active',
        module: 'common',
      },
      {
        key: 'header.earlyDiagnosis',
        ar: 'التشخيص المبكر',
        en: 'Early Diagnosis',
        module: 'common',
      },
      {
        key: 'header.earlyDiagnosisStatus',
        ar: 'نشط',
        en: 'Active',
        module: 'common',
      },
    ]);
  }

  private addTranslations(translations: TranslationData[]) {
    this.translations.push(...translations);
  }

  async seedTranslations() {
    console.log('🌱 Seeding translations...');

    let successCount = 0;
    let errorCount = 0;

    for (const translation of this.translations) {
      try {
        await realDB.createTranslation(translation);
        successCount++;
      } catch (error) {
        console.error(`Failed to seed translation: ${translation.key}`, error);
        errorCount++;
      }
    }

    console.log(`✅ Seeded ${successCount} translations successfully`);
    if (errorCount > 0) {
      console.log(`❌ Failed to seed ${errorCount} translations`);
    }
  }

  async validateTranslations() {
    console.log('🔍 Validating translations...');

    const missingKeys: string[] = [];
    const duplicateKeys: string[] = [];
    const keyCounts = new Map<string, number>();

    // Check for duplicates
    for (const translation of this.translations) {
      const count = keyCounts.get(translation.key) || 0;
      keyCounts.set(translation.key, count + 1);

      if (count > 0) {
        duplicateKeys.push(translation.key);
      }
    }

    // Check for missing translations
    const requiredKeys = [
      'auth.login.title',
      'patients.title',
      'appointments.title',
      'medical_records.title',
      'doctors.title',
      'dashboard.title',
      'insurance.title',
      'notifications.title',
      'admin.title',
    ];

    for (const key of requiredKeys) {
      if (!this.translations.find(t => t.key === key)) {
        missingKeys.push(key);
      }
    }

    console.log(`📊 Translation Validation Results:`);
    console.log(`   Total translations: ${this.translations.length}`);
    console.log(`   Duplicate keys: ${duplicateKeys.length}`);
    console.log(`   Missing required keys: ${missingKeys.length}`);

    if (duplicateKeys.length > 0) {
      console.log(`   Duplicate keys: ${duplicateKeys.join(', ')}`);
    }

    if (missingKeys.length > 0) {
      console.log(`   Missing keys: ${missingKeys.join(', ')}`);
    }

    return {
      total: this.translations.length,
      duplicates: duplicateKeys.length,
      missing: missingKeys.length,
      isValid: duplicateKeys.length === 0 && missingKeys.length === 0,
    };
  }
}

export { TranslationSeeder };

// Run if called directly
if (require.main === module) {
  const seeder = new TranslationSeeder();

  seeder
    .validateTranslations()
    .then(async validation => {
      if (validation.isValid) {
        await seeder.seedTranslations();
      } else {
        console.log(
          '❌ Translation validation failed. Please fix issues before seeding.'
        );
      }
    })
    .catch(console.error);
}
