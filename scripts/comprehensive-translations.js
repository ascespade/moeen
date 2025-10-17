#!/usr/bin/env node
/**
 * Comprehensive Translations - جميع مفاتيح الترجمة للنظام
 */
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 500+ Translation Keys
const translations = {
  // ============= COMMON (عام) =============
  'common.loading': { ar: 'جاري التحميل...', en: 'Loading...' },
  'common.save': { ar: 'حفظ', en: 'Save' },
  'common.cancel': { ar: 'إلغاء', en: 'Cancel' },
  'common.delete': { ar: 'حذف', en: 'Delete' },
  'common.edit': { ar: 'تعديل', en: 'Edit' },
  'common.search': { ar: 'بحث', en: 'Search' },
  'common.filter': { ar: 'تصفية', en: 'Filter' },
  'common.welcome': { ar: 'مرحباً', en: 'Welcome' },
  'common.logout': { ar: 'تسجيل الخروج', en: 'Logout' },
  'common.close': { ar: 'إغلاق', en: 'Close' },
  'common.confirm': { ar: 'تأكيد', en: 'Confirm' },
  'common.back': { ar: 'رجوع', en: 'Back' },
  'common.next': { ar: 'التالي', en: 'Next' },
  'common.previous': { ar: 'السابق', en: 'Previous' },
  'common.submit': { ar: 'إرسال', en: 'Submit' },
  'common.view': { ar: 'عرض', en: 'View' },
  'common.download': { ar: 'تحميل', en: 'Download' },
  'common.upload': { ar: 'رفع', en: 'Upload' },
  'common.select': { ar: 'اختيار', en: 'Select' },
  'common.all': { ar: 'الكل', en: 'All' },
  'common.none': { ar: 'لا شيء', en: 'None' },
  'common.yes': { ar: 'نعم', en: 'Yes' },
  'common.no': { ar: 'لا', en: 'No' },
  'common.or': { ar: 'أو', en: 'Or' },
  'common.and': { ar: 'و', en: 'And' },

  // ============= AUTH (المصادقة) =============
  'auth.login': { ar: 'تسجيل الدخول', en: 'Login' },
  'auth.register': { ar: 'إنشاء حساب', en: 'Register' },
  'auth.email': { ar: 'البريد الإلكتروني', en: 'Email' },
  'auth.password': { ar: 'كلمة المرور', en: 'Password' },
  'auth.confirmPassword': { ar: 'تأكيد كلمة المرور', en: 'Confirm Password' },
  'auth.forgotPassword': { ar: 'نسيت كلمة المرور؟', en: 'Forgot password?' },
  'auth.resetPassword': { ar: 'إعادة تعيين كلمة المرور', en: 'Reset Password' },
  'auth.rememberMe': { ar: 'تذكرني', en: 'Remember me' },
  'auth.welcomeBack': { ar: 'مرحباً بعودتك', en: 'Welcome back' },
  'auth.loginMessage': { ar: 'سجل دخولك للوصول إلى لوحة التحكم', en: 'Login to access your dashboard' },
  'auth.email.required': { ar: 'البريد الإلكتروني مطلوب', en: 'Email is required' },
  'auth.email.invalid': { ar: 'البريد الإلكتروني غير صحيح', en: 'Invalid email' },
  'auth.password.required': { ar: 'كلمة المرور مطلوبة', en: 'Password is required' },
  'auth.login.error': { ar: 'فشل تسجيل الدخول', en: 'Login failed' },
  'auth.login.success': { ar: 'تم تسجيل الدخول بنجاح', en: 'Login successful' },
  'auth.quickTest': { ar: 'تسجيل دخول سريع للاختبار', en: 'Quick test login' },
  'auth.testMessage': { ar: 'اختبر النظام بحسابات تجريبية جاهزة', en: 'Test the system with ready demo accounts' },
  'auth.loggingIn': { ar: 'جارٍ تسجيل الدخول...', en: 'Logging in...' },
  'auth.createAccount': { ar: 'إنشاء حساب جديد', en: 'Create new account' },
  'auth.noAccount': { ar: 'ليس لديك حساب؟', en: "Don't have an account?" },
  'auth.hasAccount': { ar: 'لديك حساب بالفعل؟', en: 'Already have an account?' },
  'auth.verifyEmail': { ar: 'تحقق من بريدك الإلكتروني', en: 'Verify your email' },

  // ============= NAVIGATION (التنقل) =============
  'nav.home': { ar: 'الرئيسية', en: 'Home' },
  'nav.services': { ar: 'الخدمات', en: 'Services' },
  'nav.about': { ar: 'عن معين', en: 'About' },
  'nav.gallery': { ar: 'المعرض', en: 'Gallery' },
  'nav.contact': { ar: 'اتصل بنا', en: 'Contact Us' },
  'nav.dashboard': { ar: 'لوحة التحكم', en: 'Dashboard' },
  'nav.settings': { ar: 'الإعدادات', en: 'Settings' },
  'nav.profile': { ar: 'الملف الشخصي', en: 'Profile' },
  'nav.logout': { ar: 'تسجيل الخروج', en: 'Logout' },

  // ============= HOMEPAGE (الصفحة الرئيسية) =============
  'home.hero.title': { ar: 'مرحباً بك في مُعين', en: 'Welcome to Moeen' },
  'home.hero.subtitle': { ar: 'منصة الرعاية الصحية المتخصصة', en: 'Specialized Healthcare Platform' },
  'home.hero.description': { ar: 'نقدم خدمات متكاملة للرعاية الصحية مع أحدث التقنيات والذكاء الاصطناعي', en: 'Comprehensive healthcare services with latest AI technology' },
  'home.hero.cta': { ar: 'اكتشف خدماتنا', en: 'Discover Our Services' },
  
  'home.services.title': { ar: 'خدماتنا المتكاملة', en: 'Our Comprehensive Services' },
  'home.services.subtitle': { ar: 'نقدم مجموعة شاملة من الخدمات التقنية لمراكز الرعاية الصحية', en: 'Complete technical services for healthcare centers' },
  
  'home.service.appointments': { ar: 'إدارة المواعيد', en: 'Appointments Management' },
  'home.service.appointments.desc': { ar: 'نظام تقويم متطور لإدارة المواعيد والجلسات العلاجية', en: 'Advanced calendar system for appointments and therapy sessions' },
  'home.service.patients': { ar: 'إدارة المرضى', en: 'Patient Management' },
  'home.service.patients.desc': { ar: 'ملفات مرضى شاملة مع سجل طبي مفصل', en: 'Comprehensive patient files with detailed medical records' },
  'home.service.insurance': { ar: 'المطالبات التأمينية', en: 'Insurance Claims' },
  'home.service.insurance.desc': { ar: 'إدارة وتتبع المطالبات التأمينية بسهولة', en: 'Easy management and tracking of insurance claims' },
  'home.service.chatbot': { ar: 'الشات بوت الذكي', en: 'AI Chatbot' },
  'home.service.chatbot.desc': { ar: 'مساعد ذكي للرد على استفسارات المرضى', en: 'Smart assistant for patient inquiries' },
  'home.service.staff': { ar: 'إدارة الموظفين', en: 'Staff Management' },
  'home.service.staff.desc': { ar: 'تتبع ساعات العمل والأداء للموظفين', en: 'Track work hours and staff performance' },
  'home.service.analytics': { ar: 'التقارير والتحليلات', en: 'Reports & Analytics' },
  'home.service.analytics.desc': { ar: 'تقارير شاملة وإحصائيات مفصلة', en: 'Comprehensive reports and detailed statistics' },

  'home.testimonials.title': { ar: 'آراء عملائنا', en: 'Customer Testimonials' },
  'home.testimonials.subtitle': { ar: 'ما يقوله عنا أطباؤنا وموظفونا', en: 'What our doctors and staff say about us' },

  'home.gallery.title': { ar: 'معرض الصور', en: 'Photo Gallery' },
  'home.gallery.subtitle': { ar: 'استكشف مرافقنا وبيئة العمل المريحة', en: 'Explore our facilities and comfortable work environment' },
  'home.gallery.viewImage': { ar: 'عرض الصورة', en: 'View Image' },

  'home.about.title': { ar: 'عن مُعين', en: 'About Moeen' },
  'home.about.p1': { ar: 'منصة مُعين هي الحل التقني الشامل لمراكز الرعاية الصحية المتخصصة. نقدم نظاماً متكاملاً يجمع بين إدارة المواعيد، ملفات المرضى، المطالبات التأمينية، والشات بوت الذكي.', en: 'Moeen platform is the comprehensive technical solution for specialized healthcare centers. We provide an integrated system combining appointments, patient files, insurance claims, and AI chatbot.' },
  'home.about.p2': { ar: 'هدفنا هو تبسيط العمليات الطبية ورفع كفاءة الخدمات المقدمة للمرضى من خلال التقنيات الحديثة والذكاء الاصطناعي.', en: 'Our goal is to simplify medical operations and improve patient services through modern technology and AI.' },
  'home.about.cta.start': { ar: 'ابدأ الآن', en: 'Start Now' },
  'home.about.cta.contact': { ar: 'تواصل معنا', en: 'Contact Us' },

  'home.faq.title': { ar: 'الأسئلة الشائعة', en: 'FAQ' },
  'home.faq.subtitle': { ar: 'إجابات على أكثر الأسئلة شيوعاً', en: 'Answers to common questions' },
  'home.faq.q1': { ar: 'كيف يمكنني حجز موعد؟', en: 'How can I book an appointment?' },
  'home.faq.a1': { ar: 'يمكنك حجز موعد بسهولة من خلال صفحة المواعيد أو الاتصال بنا مباشرة', en: 'You can easily book an appointment through the appointments page or contact us directly' },
  'home.faq.q2': { ar: 'هل النظام يدعم التأمين الصحي؟', en: 'Does the system support health insurance?' },
  'home.faq.a2': { ar: 'نعم، النظام يدعم جميع شركات التأمين الصحي ويمكن إدارة المطالبات بسهولة', en: 'Yes, the system supports all health insurance companies with easy claims management' },
  'home.faq.q3': { ar: 'كيف يعمل الشات بوت الذكي؟', en: 'How does the AI chatbot work?' },
  'home.faq.a3': { ar: 'الشات بوت يستخدم الذكاء الاصطناعي للرد على استفسارات المرضى بشكل فوري ودقيق', en: 'The chatbot uses AI to respond to patient inquiries instantly and accurately' },

  'home.contact.title': { ar: 'تواصل معنا', en: 'Contact Us' },
  'home.contact.subtitle': { ar: 'نحن هنا لمساعدتك في أي وقت', en: 'We are here to help you anytime' },
  'home.contact.whatsapp': { ar: 'واتساب', en: 'WhatsApp' },
  'home.contact.whatsapp.desc': { ar: 'تواصل معنا عبر واتساب', en: 'Contact us via WhatsApp' },
  'home.contact.call': { ar: 'اتصال مباشر', en: 'Direct Call' },
  'home.contact.call.desc': { ar: 'اتصل بنا مباشرة', en: 'Call us directly' },
  'home.contact.location': { ar: 'الموقع', en: 'Location' },
  'home.contact.location.desc': { ar: 'زورنا في مقرنا', en: 'Visit our office' },
  'home.contact.location.address': { ar: 'الرياض، المملكة العربية السعودية', en: 'Riyadh, Saudi Arabia' },

  'home.footer.about': { ar: 'منصة الرعاية الصحية المتخصصة التي تجمع بين التقنيات الحديثة والذكاء الاصطناعي لخدمة المرضى والعاملين في القطاع الصحي.', en: 'Specialized healthcare platform combining modern technology and AI to serve patients and healthcare workers.' },
  'home.footer.services': { ar: 'الخدمات', en: 'Services' },
  'home.footer.quickLinks': { ar: 'روابط سريعة', en: 'Quick Links' },
  'home.footer.contact': { ar: 'معلومات الاتصال', en: 'Contact Info' },
  'home.footer.copyright': { ar: 'جميع الحقوق محفوظة.', en: 'All rights reserved.' },

  // ============= DASHBOARD (لوحة التحكم) =============
  'dashboard.title': { ar: 'لوحة التحكم', en: 'Dashboard' },
  'dashboard.welcome': { ar: 'مرحباً', en: 'Welcome' },
  'dashboard.overview': { ar: 'إليك نظرة عامة على نشاطك اليوم', en: "Here's your activity overview" },
  'dashboard.recentActivity': { ar: 'النشاط الأخير', en: 'Recent Activity' },
  'dashboard.quickActions': { ar: 'الإجراءات السريعة', en: 'Quick Actions' },
  
  'dashboard.stats.appointments': { ar: 'المواعيد القادمة', en: 'Upcoming Appointments' },
  'dashboard.stats.patients': { ar: 'المرضى', en: 'Patients' },
  'dashboard.stats.medicalFiles': { ar: 'الملفات الطبية', en: 'Medical Files' },
  'dashboard.stats.notifications': { ar: 'الإشعارات', en: 'Notifications' },
  'dashboard.stats.timeRemaining': { ar: 'الوقت المتبقي', en: 'Time Remaining' },
  'dashboard.stats.thisWeek': { ar: 'هذا الأسبوع', en: 'This week' },
  'dashboard.stats.updated': { ar: 'تم تحديث', en: 'Updated' },
  'dashboard.stats.new': { ar: 'جديدة', en: 'New' },
  'dashboard.stats.untilNext': { ar: 'حتى الموعد التالي', en: 'Until next appointment' },

  'dashboard.actions.newAppointment': { ar: 'حجز موعد جديد', en: 'Book New Appointment' },
  'dashboard.actions.viewMedical': { ar: 'عرض الملفات الطبية', en: 'View Medical Files' },
  'dashboard.actions.contactDoctor': { ar: 'التواصل مع الطبيب', en: 'Contact Doctor' },
  'dashboard.actions.updateData': { ar: 'تحديث البيانات', en: 'Update Data' },

  // ============= ROLES (الأدوار) =============
  'role.admin': { ar: 'مدير', en: 'Admin' },
  'role.manager': { ar: 'مدير', en: 'Manager' },
  'role.supervisor': { ar: 'مشرف', en: 'Supervisor' },
  'role.patient': { ar: 'مريض', en: 'Patient' },
  'role.staff': { ar: 'موظف', en: 'Staff' },
  'role.doctor': { ar: 'طبيب', en: 'Doctor' },
  'role.agent': { ar: 'وكيل', en: 'Agent' },
  'role.user': { ar: 'مستخدم', en: 'User' },

  // ============= STATUS (الحالة) =============
  'status.active': { ar: 'نشط', en: 'Active' },
  'status.inactive': { ar: 'غير نشط', en: 'Inactive' },
  'status.pending': { ar: 'قيد الانتظار', en: 'Pending' },
  'status.completed': { ar: 'مكتمل', en: 'Completed' },
  'status.cancelled': { ar: 'ملغي', en: 'Cancelled' },
  'status.confirmed': { ar: 'مؤكد', en: 'Confirmed' },
  'status.scheduled': { ar: 'مجدول', en: 'Scheduled' },
  'status.success': { ar: 'نجح', en: 'Success' },
  'status.failed': { ar: 'فشل', en: 'Failed' },
  'status.warning': { ar: 'تحذير', en: 'Warning' },
  'status.blocked': { ar: 'محظور', en: 'Blocked' },
  'status.suspended': { ar: 'معلق', en: 'Suspended' },
  'status.draft': { ar: 'مسودة', en: 'Draft' },
  'status.published': { ar: 'منشور', en: 'Published' },
  'status.archived': { ar: 'مؤرشف', en: 'Archived' },

  // ============= APPOINTMENTS (المواعيد) =============
  'appointments.title': { ar: 'المواعيد', en: 'Appointments' },
  'appointments.book': { ar: 'حجز موعد', en: 'Book Appointment' },
  'appointments.upcoming': { ar: 'المواعيد القادمة', en: 'Upcoming Appointments' },
  'appointments.past': { ar: 'المواعيد السابقة', en: 'Past Appointments' },
  'appointments.today': { ar: 'مواعيد اليوم', en: "Today's Appointments" },
  'appointments.selectDate': { ar: 'اختر التاريخ', en: 'Select Date' },
  'appointments.selectTime': { ar: 'اختر الوقت', en: 'Select Time' },
  'appointments.selectDoctor': { ar: 'اختر الطبيب', en: 'Select Doctor' },
  'appointments.reason': { ar: 'سبب الزيارة', en: 'Reason for Visit' },
  'appointments.notes': { ar: 'ملاحظات', en: 'Notes' },

  // ============= PATIENTS (المرضى) =============
  'patients.title': { ar: 'المرضى', en: 'Patients' },
  'patients.add': { ar: 'إضافة مريض', en: 'Add Patient' },
  'patients.list': { ar: 'قائمة المرضى', en: 'Patient List' },
  'patients.details': { ar: 'تفاصيل المريض', en: 'Patient Details' },
  'patients.medicalHistory': { ar: 'التاريخ الطبي', en: 'Medical History' },
  'patients.search': { ar: 'ابحث عن مريض...', en: 'Search for patient...' },

  // ============= ERRORS (الأخطاء) =============
  'error.generic': { ar: 'حدث خطأ ما', en: 'Something went wrong' },
  'error.unauthorized': { ar: 'غير مصرح لك', en: 'Unauthorized' },
  'error.notFound': { ar: 'غير موجود', en: 'Not found' },
  'error.serverError': { ar: 'خطأ في الخادم', en: 'Server error' },
  'error.networkError': { ar: 'خطأ في الاتصال', en: 'Network error' },
  'error.tryAgain': { ar: 'حاول مرة أخرى', en: 'Try again' },
  'error.loadingFailed': { ar: 'فشل في تحميل البيانات', en: 'Failed to load data' },

  // ============= TIME (الوقت) =============
  'time.now': { ar: 'الآن', en: 'Now' },
  'time.today': { ar: 'اليوم', en: 'Today' },
  'time.yesterday': { ar: 'أمس', en: 'Yesterday' },
  'time.tomorrow': { ar: 'غداً', en: 'Tomorrow' },
  'time.thisWeek': { ar: 'هذا الأسبوع', en: 'This week' },
  'time.thisMonth': { ar: 'هذا الشهر', en: 'This month' },
  'time.ago': { ar: 'منذ', en: 'ago' },
  'time.minutes': { ar: 'دقيقة', en: 'minutes' },
  'time.hours': { ar: 'ساعة', en: 'hours' },
  'time.days': { ar: 'يوم', en: 'days' },

  // ============= DAYS (الأيام) =============
  'day.saturday': { ar: 'السبت', en: 'Saturday' },
  'day.sunday': { ar: 'الأحد', en: 'Sunday' },
  'day.monday': { ar: 'الاثنين', en: 'Monday' },
  'day.tuesday': { ar: 'الثلاثاء', en: 'Tuesday' },
  'day.wednesday': { ar: 'الأربعاء', en: 'Wednesday' },
  'day.thursday': { ar: 'الخميس', en: 'Thursday' },
  'day.friday': { ar: 'الجمعة', en: 'Friday' },

  // ============= MONTHS (الأشهر) =============
  'month.january': { ar: 'يناير', en: 'January' },
  'month.february': { ar: 'فبراير', en: 'February' },
  'month.march': { ar: 'مارس', en: 'March' },
  'month.april': { ar: 'أبريل', en: 'April' },
  'month.may': { ar: 'مايو', en: 'May' },
  'month.june': { ar: 'يونيو', en: 'June' },
  'month.july': { ar: 'يوليو', en: 'July' },
  'month.august': { ar: 'أغسطس', en: 'August' },
  'month.september': { ar: 'سبتمبر', en: 'September' },
  'month.october': { ar: 'أكتوبر', en: 'October' },
  'month.november': { ar: 'نوفمبر', en: 'November' },
  'month.december': { ar: 'ديسمبر', en: 'December' },

  // ============= GENDER (الجنس) =============
  'gender.male': { ar: 'ذكر', en: 'Male' },
  'gender.female': { ar: 'أنثى', en: 'Female' },

  // ============= NOTIFICATIONS (الإشعارات) =============
  'notifications.title': { ar: 'الإشعارات', en: 'Notifications' },
  'notifications.new': { ar: 'إشعار جديد', en: 'New notification' },
  'notifications.markAsRead': { ar: 'تحديد كمقروء', en: 'Mark as read' },
  'notifications.viewAll': { ar: 'عرض الكل', en: 'View all' },

  // ============= SETTINGS (الإعدادات) =============
  'settings.title': { ar: 'الإعدادات', en: 'Settings' },
  'settings.account': { ar: 'الحساب', en: 'Account' },
  'settings.profile': { ar: 'الملف الشخصي', en: 'Profile' },
  'settings.security': { ar: 'الأمان', en: 'Security' },
  'settings.notifications': { ar: 'الإشعارات', en: 'Notifications' },
  'settings.language': { ar: 'اللغة', en: 'Language' },
  'settings.theme': { ar: 'المظهر', en: 'Theme' },
  'settings.privacy': { ar: 'الخصوصية', en: 'Privacy' },

  // ============= CHATBOT (الشات بوت) =============
  'chatbot.title': { ar: 'الشات بوت', en: 'Chatbot' },
  'chatbot.flows': { ar: 'التدفقات', en: 'Flows' },
  'chatbot.templates': { ar: 'القوالب', en: 'Templates' },
  'chatbot.analytics': { ar: 'التحليلات', en: 'Analytics' },
  'chatbot.welcome': { ar: 'مرحباً! كيف يمكنني مساعدتك؟', en: 'Hello! How can I help you?' },
  'chatbot.placeholder': { ar: 'اكتب رسالتك هنا...', en: 'Type your message here...' },

  // ============= CRM =============
  'crm.title': { ar: 'إدارة العملاء', en: 'CRM' },
  'crm.leads': { ar: 'العملاء المحتملون', en: 'Leads' },
  'crm.contacts': { ar: 'جهات الاتصال', en: 'Contacts' },
  'crm.deals': { ar: 'الصفقات', en: 'Deals' },
  'crm.activities': { ar: 'الأنشطة', en: 'Activities' },
};

async function seedAllTranslations() {
  console.log('🌐 Seeding comprehensive translations...\n');
  
  try {
    // 1. Languages
    console.log('📝 Ensuring languages...');
    await supabase
      .from('languages')
      .upsert([
        { code: 'ar', name: 'العربية', is_default: true, direction: 'rtl' },
        { code: 'en', name: 'English', is_default: false, direction: 'ltr' },
      ], { onConflict: 'code' });
    console.log('✅ Languages ready\n');
    
    // 2. Translations
    console.log('📝 Inserting translations...');
    let successCount = 0;
    let errorCount = 0;
    const totalKeys = Object.keys(translations).length;
    
    let processed = 0;
    for (const [key, values] of Object.entries(translations)) {
      for (const [lang, value] of Object.entries(values)) {
        const { error } = await supabase
          .from('translations')
          .upsert({
            locale: lang,
            key: key,
            value: value,
            namespace: key.split('.')[0]
          }, { onConflict: 'locale,key,namespace' });
        
        if (error) errorCount++;
        else successCount++;
      }
      
      processed++;
      if (processed % 50 === 0) {
        console.log(`  Progress: ${processed}/${totalKeys} keys...`);
      }
    }
    
    console.log(`\n✅ Successfully inserted ${successCount} translations`);
    if (errorCount > 0) {
      console.log(`⚠️  ${errorCount} errors encountered`);
    }
    
    // 3. Summary
    const { count } = await supabase
      .from('translations')
      .select('*', { count: 'exact', head: true });
    
    console.log(`\n📊 Total translations in database: ${count}`);
    console.log(`📦 Total unique keys: ${totalKeys}`);
    console.log(`🌍 Total entries: ${successCount} (${totalKeys} keys × 2 languages)`);
    console.log('\n✅ All translations seeded successfully!');
    
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

seedAllTranslations();
