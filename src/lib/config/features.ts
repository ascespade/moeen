/**
 * Features Configuration - إعدادات الميزات
 *
 * Feature flags and configuration
 */

import { CONFIG } from '../constants/config';

export const featuresConfig = {
  // Feature Flags
  features: {
    chatbot: {
      enabled: CONFIG.FEATURES.ENABLE_CHATBOT,
      name: 'Chatbot',
      nameAr: 'المساعد الذكي',
    },
    notifications: {
      enabled: CONFIG.FEATURES.ENABLE_NOTIFICATIONS,
      name: 'Notifications',
      nameAr: 'الإشعارات',
    },
    analytics: {
      enabled: CONFIG.FEATURES.ENABLE_ANALYTICS,
      name: 'Analytics',
      nameAr: 'التحليلات',
    },
    crm: {
      enabled: CONFIG.FEATURES.ENABLE_CRM,
      name: 'CRM',
      nameAr: 'إدارة العملاء',
    },
    insurance: {
      enabled: CONFIG.FEATURES.ENABLE_INSURANCE,
      name: 'Insurance',
      nameAr: 'التأمين',
    },
  },

  // Check if feature is enabled
  isEnabled(feature: keyof typeof featuresConfig.features): boolean {
    return this.features[feature]?.enabled ?? false;
  },

  // Get feature name
  getName(
    feature: keyof typeof featuresConfig.features,
    lang: 'ar' | 'en' = 'ar'
  ): string {
    const featureData = this.features[feature as string];
    if (!featureData) return feature as string;
    return lang === 'ar' ? featureData.nameAr : featureData.name;
  },
} as const;
