"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface I18nContextType {
  t: (key: string, fallback?: string) => string;
  locale: string;
  setLocale: (locale: string) => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Default translations
const translations: Record<string, Record<string, string>> = {
  ar: {
    'nav.dashboard': 'لوحة التحكم',
    'nav.conversations': 'المحادثات',
    'nav.flow': 'منشئ التدفق',
    'nav.users': 'المستخدمين',
    'nav.settings': 'الإعدادات',
    'nav.logs': 'السجلات',
    'nav.review': 'المراجعة',
    'nav.channels': 'القنوات',
    'conv.subtitle': 'إدارة جميع المحادثات',
    'conv.new': 'محادثة جديدة',
    'conv.search': 'البحث في المحادثات...',
    'conv.filter.all': 'الكل',
    'conv.filter.active': 'نشط',
    'conv.filter.pending': 'معلق',
    'conv.filter.resolved': 'تم الحل',
    'flow.subtitle': 'إنشاء وإدارة تدفقات المحادثة',
    'flow.new': 'تدفق جديد',
    'flow.templates': 'القوالب الجاهزة',
    'ui.preview': 'معاينة',
    'ui.save': 'حفظ',
    'features.title': 'المميزات',
    'home.features.unifiedChat': 'دردشة موحّدة',
    'home.features.unifiedChat.desc': 'إدارة كل القنوات من واجهة واحدة',
    'home.features.reports': 'تقارير لحظية',
    'home.features.reports.desc': 'لوحات ذكية ومؤشرات أداء',
    'home.hero.subtitle': 'تلقائية وذكاء',
    'pricing.title': 'الأسعار',
    'pricing.basic': 'أساسي',
    'pricing.free': 'مجاني',
    'pricing.f1': 'قناة واحدة',
    'pricing.f2': 'محادثات محدودة',
    'pricing.pro': 'محترف',
    'pricing.enterprise': 'مؤسسات',
    'pricing.custom': 'مخصص',
    'pricing.f3': '3 قنوات',
    'pricing.f4': 'تقارير أساسية',
    'pricing.f5': 'قنوات غير محدودة',
    'pricing.f6': 'دعم مخصص',
    'faq.title': 'الأسئلة الشائعة',
    'faq.q1': 'هل تدعمون RTL؟',
    'faq.a1': 'نعم، دعم كامل للعربية مع تبديل تلقائي للاتجاه.',
    'faq.q2': 'هل يوجد نسخة مجانية؟',
    'faq.a2': 'نعم، خطة أساسية مجانية للبدء السريع.',
    'faq.q3': 'كيف أفعّل القنوات؟',
    'faq.a3': 'من صفحة القنوات داخل لوحة التحكم.',
    'privacy.title': 'الخصوصية',
    'privacy.desc': 'نلتزم بحماية بياناتك وفق أفضل الممارسات.',
    'terms.title': 'الشروط والأحكام',
    'terms.desc': 'باستخدامك للمنصة فأنت توافق على الشروط القياسية للاستخدام.',
  },
  en: {
    'nav.dashboard': 'Dashboard',
    'nav.conversations': 'Conversations',
    'nav.flow': 'Flow Builder',
    'nav.users': 'Users',
    'nav.settings': 'Settings',
    'nav.logs': 'Logs',
    'nav.review': 'Review',
    'nav.channels': 'Channels',
    'conv.subtitle': 'Manage all conversations',
    'conv.new': 'New Conversation',
    'conv.search': 'Search conversations...',
    'conv.filter.all': 'All',
    'conv.filter.active': 'Active',
    'conv.filter.pending': 'Pending',
    'conv.filter.resolved': 'Resolved',
    'flow.subtitle': 'Create and manage conversation flows',
    'flow.new': 'New Flow',
    'flow.templates': 'Ready Templates',
    'ui.preview': 'Preview',
    'ui.save': 'Save',
    'features.title': 'Features',
    'home.features.unifiedChat': 'Unified Chat',
    'home.features.unifiedChat.desc': 'Manage all channels from one interface',
    'home.features.reports': 'Real-time Reports',
    'home.features.reports.desc': 'Smart dashboards and performance indicators',
    'home.hero.subtitle': 'Automated and Smart',
    'pricing.title': 'Pricing',
    'pricing.basic': 'Basic',
    'pricing.free': 'Free',
    'pricing.f1': 'Single channel',
    'pricing.f2': 'Limited conversations',
    'pricing.pro': 'Professional',
    'pricing.enterprise': 'Enterprise',
    'pricing.custom': 'Custom',
    'pricing.f3': '3 channels',
    'pricing.f4': 'Basic reports',
    'pricing.f5': 'Unlimited channels',
    'pricing.f6': 'Custom support',
    'faq.title': 'Frequently Asked Questions',
    'faq.q1': 'Do you support RTL?',
    'faq.a1': 'Yes, full Arabic support with automatic direction switching.',
    'faq.q2': 'Is there a free version?',
    'faq.a2': 'Yes, a basic free plan to get started quickly.',
    'faq.q3': 'How do I activate channels?',
    'faq.a3': 'From the channels page in the control panel.',
    'privacy.title': 'Privacy',
    'privacy.desc': 'We are committed to protecting your data according to best practices.',
    'terms.title': 'Terms and Conditions',
    'terms.desc': 'By using the platform, you agree to the standard terms of use.',
  }
};

interface I18nProviderProps {
  children: React.ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [locale, setLocale] = useState('ar');

  useEffect(() => {
    // Load saved locale from localStorage
    const savedLocale = localStorage.getItem('muayin_locale');
    if (savedLocale && translations[savedLocale]) {
      setLocale(savedLocale);
    }
  }, []);

  const t = (key: string, fallback?: string): string => {
    const translation = translations[locale]?.[key];
    if (translation) {
      return translation;
    }
    
    // Fallback to English if Arabic translation not found
    if (locale === 'ar') {
      const englishTranslation = translations['en']?.[key];
      if (englishTranslation) {
        return englishTranslation;
      }
    }
    
    return fallback || key;
  };

  const handleSetLocale = (newLocale: string) => {
    setLocale(newLocale);
    localStorage.setItem('muayin_locale', newLocale);
  };

  const value: I18nContextType = {
    t,
    locale,
    setLocale: handleSetLocale,
  };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useT() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useT must be used within an I18nProvider');
  }
  return context;
}