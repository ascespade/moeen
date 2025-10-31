/**
 * Translation Service - خدمة الترجمة
 * DB-driven translation system with caching and missing key logging
 */

interface TranslationCache {
  [language: string]: {
    [key: string]: string | number;
    timestamp: number;
  };
}

interface MissingTranslation {
  language: string;
  key: string;
  requestedAt: Date;
}

class TranslationService {
  private cache: TranslationCache = {};
  private cacheExpiry = 3600000; // 1 hour in milliseconds
  private missingKeys: MissingTranslation[] = [];
  private isLoggingMissing = false;

  /**
   * Fetch translations from API and cache them
   */
  async fetchTranslations(
    language: string
  ): Promise<{ [key: string]: string }> {
    try {
      // Check cache first
      if (this.cache[language] && this.isCacheValid(language)) {
        const cached = this.cache[language];
        const translations: { [key: string]: string } = {};
        for (const key in cached) {
          if (key !== 'timestamp') {
            translations[key] = cached[key] as string;
          }
        }
        return translations;
      }

      // Fetch from API
      const response = await fetch(`/api/translations/${language}`, {
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch translations for ${language}`);
      }

      const translations = await response.json();

      // Cache the translations
      this.cache[language] = {
        ...translations,
        timestamp: Date.now(),
      };

      // Store in localStorage for offline access
      try {
        localStorage.setItem(
          `translations_${language}`,
          JSON.stringify(this.cache[language])
        );
      } catch (error) {}

      return translations;
    } catch (error) {
      // Try to load from localStorage as fallback
      try {
        const cached = localStorage.getItem(`translations_${language}`);
        if (cached) {
          const parsed = JSON.parse(cached);
          this.cache[language] = parsed;
          return parsed;
        }
      } catch (localError) {}

      // Return default translations
      return this.getDefaultTranslations(language);
    }
  }

  /**
   * Get translation by key with fallback
   */
  async get(key: string, language: string = 'ar'): Promise<string> {
    try {
      // Ensure translations are loaded
      if (!this.cache[language] || !this.isCacheValid(language)) {
        await this.fetchTranslations(language);
      }

      const translation = this.cache[language]?.[key];

      if (translation && typeof translation === 'string') {
        return translation;
      }

      // Log missing key
      this.logMissingKey(key, language);

      // Try fallback language (English)
      if (language !== 'en') {
        const fallbackTranslation = this.cache['en']?.[key];
        if (fallbackTranslation && typeof fallbackTranslation === 'string') {
          return fallbackTranslation;
        }
      }

      // Return key as fallback
      return key;
    } catch (error) {
      return key;
    }
  }

  /**
   * Get multiple translations at once
   */
  async getMultiple(
    keys: string[],
    language: string = 'ar'
  ): Promise<{ [key: string]: string }> {
    const translations: { [key: string]: string } = {};

    for (const key of keys) {
      translations[key] = await this.get(key, language);
    }

    return translations;
  }

  /**
   * Check if cache is valid
   */
  private isCacheValid(language: string): boolean {
    const cached = this.cache[language];
    if (!cached) return false;

    return Date.now() - cached.timestamp < this.cacheExpiry;
  }

  /**
   * Log missing translation key
   */
  private async logMissingKey(key: string, language: string): Promise<void> {
    if (this.isLoggingMissing) return;

    this.isLoggingMissing = true;

    try {
      // Add to local missing keys array
      this.missingKeys.push({
        language,
        key,
        requestedAt: new Date(),
      });

      // Send to API for logging
      await fetch('/api/translations/missing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language,
          key,
          requestedAt: new Date().toISOString(),
        }),
      });
    } catch (error) {
    } finally {
      this.isLoggingMissing = false;
    }
  }

  /**
   * Get default translations
   */
  private getDefaultTranslations(language: string): { [key: string]: string } {
    const defaultTranslations = {
      ar: {
        'common.welcome': 'مرحباً',
        'common.hello': 'أهلاً وسهلاً',
        'common.goodbye': 'وداعاً',
        'common.yes': 'نعم',
        'common.no': 'لا',
        'common.save': 'حفظ',
        'common.cancel': 'إلغاء',
        'common.edit': 'تعديل',
        'common.delete': 'حذف',
        'common.search': 'بحث',
        'common.searchPlaceholder': 'ابحث في النظام...',
        'common.systemName': 'مركز الهمم',
        'common.openMenu': 'فتح القائمة',
        'common.loading': 'جاري التحميل...',
        'common.error': 'حدث خطأ',
        'common.success': 'تم بنجاح',
        'header.welcome': 'مرحباً',
        'header.profile': 'الملف الشخصي',
        'header.settings': 'الإعدادات',
        'header.logout': 'تسجيل الخروج',
        'header.notifications': 'الإشعارات',
        'header.noNotifications': 'لا توجد إشعارات',
        'header.notification': 'إشعار {number}',
        'header.markAsRead': 'تعليم كمقروء',
        'header.aiFeatures': 'ميزات الذكاء الاصطناعي',
        'header.chatbot': 'المساعد الذكي',
        'header.chatbotStatus': 'نشط',
        'header.voiceBot': 'المساعد الصوتي',
        'header.voiceBotStatus': 'نشط',
        'header.emotionAnalytics': 'تحليل المشاعر',
        'header.emotionAnalyticsStatus': 'نشط',
        'header.earlyDiagnosis': 'التشخيص المبكر',
        'header.earlyDiagnosisStatus': 'نشط',
        'dashboard.title': 'لوحة التحكم',
        'dashboard.overview': 'نظرة عامة',
        'dashboard.metrics': 'المقاييس',
        'theme.light': 'الوضع المضيء',
        'theme.dark': 'الوضع المظلم',
        'theme.system': 'النظام',
        'language.arabic': 'العربية',
        'language.english': 'الإنجليزية',
        'patient.title': 'المريض',
        'doctor.title': 'الطبيب',
        'staff.title': 'الموظف',
        'admin.title': 'المدير',
        'appointment.title': 'الموعد',
        'payment.title': 'الدفع',
        'insurance.title': 'التأمين',
      },
      en: {
        'common.welcome': 'Welcome',
        'common.hello': 'Hello',
        'common.goodbye': 'Goodbye',
        'common.yes': 'Yes',
        'common.no': 'No',
        'common.save': 'Save',
        'common.cancel': 'Cancel',
        'common.edit': 'Edit',
        'common.delete': 'Delete',
        'common.search': 'Search',
        'common.searchPlaceholder': 'Search in system...',
        'common.systemName': 'Al-Himam Center',
        'common.openMenu': 'Open Menu',
        'common.loading': 'Loading...',
        'common.error': 'An error occurred',
        'common.success': 'Success',
        'header.welcome': 'Welcome',
        'header.profile': 'Profile',
        'header.settings': 'Settings',
        'header.logout': 'Logout',
        'header.notifications': 'Notifications',
        'header.noNotifications': 'No notifications',
        'header.notification': 'Notification {number}',
        'header.markAsRead': 'Mark as read',
        'header.aiFeatures': 'AI Features',
        'header.chatbot': 'Chatbot',
        'header.chatbotStatus': 'Active',
        'header.voiceBot': 'Voice Bot',
        'header.voiceBotStatus': 'Active',
        'header.emotionAnalytics': 'Emotion Analytics',
        'header.emotionAnalyticsStatus': 'Active',
        'header.earlyDiagnosis': 'Early Diagnosis',
        'header.earlyDiagnosisStatus': 'Active',
        'dashboard.title': 'Dashboard',
        'dashboard.overview': 'Overview',
        'dashboard.metrics': 'Metrics',
        'theme.light': 'Light Mode',
        'theme.dark': 'Dark Mode',
        'theme.system': 'System',
        'language.arabic': 'Arabic',
        'language.english': 'English',
        'patient.title': 'Patient',
        'doctor.title': 'Doctor',
        'staff.title': 'Staff',
        'admin.title': 'Admin',
        'supervisor.title': 'Supervisor',
        'appointment.title': 'Appointment',
        'payment.title': 'Payment',
        'insurance.title': 'Insurance',
        // Supervisor Dashboard
        'supervisor.dashboard.welcome': 'Welcome',
        'supervisor.dashboard.subtitle': 'Supervisor Dashboard',
        'supervisor.dashboard.total_patients': 'Total Patients',
        'supervisor.dashboard.total_appointments': 'Total Appointments',
        'supervisor.dashboard.revenue': 'Revenue',
        'supervisor.dashboard.claims_processed': 'Claims Processed',
        'supervisor.dashboard.staff_performance': 'Staff Performance',
        'supervisor.dashboard.system_alerts': 'System Alerts',
        'supervisor.dashboard.no_alerts': 'No alerts',
        'supervisor.dashboard.no_staff_data': 'No staff data',
        'supervisor.dashboard.reports': 'Reports',
        'supervisor.dashboard.tasks': 'Tasks',
        'supervisor.dashboard.efficiency': 'Efficiency',
        'supervisor.dashboard.recent_reports': 'Recent Reports',
        'supervisor.actions.daily_report': 'Daily Report',
        'supervisor.actions.monthly_report': 'Monthly Report',
        'supervisor.actions.staff_report': 'Staff Report',
        'common.excellent': 'Excellent',
        'common.good': 'Good',
        'common.needs_improvement': 'Needs Improvement',
        'report.status.ready': 'Ready',
        'report.status.processing': 'Processing',
        'report.status.failed': 'Failed',
      },
    };

    return (
      defaultTranslations[language as keyof typeof defaultTranslations] ||
      defaultTranslations.en
    );
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache = {};
  }

  /**
   * Get cached translations
   */
  getCachedTranslations(language: string): { [key: string]: string } | null {
    if (this.cache[language] && this.isCacheValid(language)) {
      const cached = this.cache[language];
      const translations: { [key: string]: string } = {};
      for (const key in cached) {
        if (key !== 'timestamp') {
          translations[key] = cached[key] as string;
        }
      }
      return translations;
    }
    return null;
  }

  /**
   * Get missing keys count
   */
  getMissingKeysCount(): number {
    return this.missingKeys.length;
  }

  /**
   * Get missing keys
   */
  getMissingKeys(): MissingTranslation[] {
    return [...this.missingKeys];
  }
}

// Export singleton instance
export const translationService = new TranslationService();
export default translationService;
