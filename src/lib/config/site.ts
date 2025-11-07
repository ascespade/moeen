/**
 * Site Configuration - إعدادات الموقع
 *
 * Site-wide configuration
 */

export const siteConfig = {
  name: 'مُعين',
  nameEn: 'Mu3een',
  description: 'مركز الهمم لرعاية ذوي الاحتياجات الخاصة',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',

  // Contact
  contact: {
    email: 'info@mu3een.com',
    phone: '+966 12 345 6789',
    address: 'المملكة العربية السعودية',
  },

  // Social Links
  social: {
    twitter: 'https://twitter.com/mu3een',
    facebook: 'https://facebook.com/mu3een',
    instagram: 'https://instagram.com/mu3een',
    linkedin: 'https://linkedin.com/company/mu3een',
  },

  // SEO
  seo: {
    title: 'مُعين - مركز الهمم لرعاية ذوي الاحتياجات الخاصة',
    description: 'مركز متخصص في رعاية ذوي الاحتياجات الخاصة',
    keywords: ['رعاية', 'احتياجات خاصة', 'علاج', 'تأهيل'],
    ogImage: '/og-image.jpg',
  },

  // Language
  defaultLocale: 'ar' as const,
  supportedLocales: ['ar', 'en'] as const,
} as const;

export type SiteConfig = typeof siteConfig;
