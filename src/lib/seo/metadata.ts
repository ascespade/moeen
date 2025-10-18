import { Metadata } from "next";

/**
 * SEO Metadata Generator
 * Professional metadata for all pages
 */

interface PageMetadata {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  noIndex?: boolean;

}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://moeen.sa";
const appName = "معين - Moeen";
const defaultImage = `${baseUrl}/og-image.png`;

/**
 * Generate complete metadata for a page
 */
export function generateMetadata(config: PageMetadata): Metadata {
  const {
    title,
    description,
    keywords = [],
    image = defaultImage,
    noIndex = false,
  } = config;

  const fullTitle = title.includes(appName) ? title : `${title} | ${appName}`;

  return {
    title: fullTitle,
    description,
    keywords: [
      ...keywords,
      "معين",
      "مركز صحي",
      "عيادة",
      "تطبيب",
      "مواعيد",
    ].join(", "),

    // Open Graph
    openGraph: {
      title: fullTitle,
      description,
      url: baseUrl,
      siteName: appName,
      images: [
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "ar_SA",
      type: "website",
    },

    // Twitter Card
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
      creator: "@moeen_health",
    },

    // Robots
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
      },

    // Additional
    alternates: {
      canonical: baseUrl,
      languages: {
        "ar-SA": baseUrl,
        "en-US": `${baseUrl}/en`,
      },

    // App links
    appleWebApp: {
      capable: true,
      title: appName,
      statusBarStyle: "default",
    },

    // Verification
    verification: {
      google: "your-google-verification-code",
      // Add other verifications as needed
    },
  };

/**
 * Predefined metadata for common pages
 */
export const pageMetadata = {
  home: {
    title: "معين - نظام إدارة المراكز الصحية",
    description:
      "نظام متكامل لإدارة المراكز الصحية والعيادات - حجز المواعيد، السجلات الطبية، إدارة المرضى",
    keywords: ["نظام صحي", "عيادات", "مواعيد", "سجلات طبية", "مركز صحي"],
  },

  login: {
    title: "تسجيل الدخول",
    description: "سجل دخولك للوصول إلى لوحة التحكم في معين",
    noIndex: true,
  },

  register: {
    title: "إنشاء حساب جديد",
    description: "انضم إلى معين - نظام إدارة المراكز الصحية",
    noIndex: true,
  },

  dashboard: {
    title: "لوحة التحكم",
    description: "لوحة التحكم الرئيسية - معين",
    noIndex: true,
  },

  appointments: {
    title: "المواعيد",
    description: "إدارة وحجز المواعيد الطبية",
    keywords: ["مواعيد طبية", "حجز موعد", "عيادة"],
  },

  patients: {
    title: "المرضى",
    description: "إدارة بيانات المرضى والسجلات الطبية",
    keywords: ["مرضى", "سجلات طبية", "ملفات طبية"],
    noIndex: true,
  },

  doctors: {
    title: "الأطباء",
    description: "إدارة الأطباء ومواعيد العمل",
    keywords: ["أطباء", "أخصائيون", "عيادات"],
  },

  insurance: {
    title: "التأمين الصحي",
    description: "إدارة شركات التأمين والمطالبات",
    keywords: ["تأمين صحي", "مطالبات", "تغطية"],
  },

  reports: {
    title: "التقارير والإحصائيات",
    description: "تقارير وإحصائيات مفصلة عن المركز الصحي",
    keywords: ["تقارير", "إحصائيات", "تحليلات"],
    noIndex: true,
  },

  settings: {
    title: "الإعدادات",
    description: "إعدادات النظام والتخصيص",
    noIndex: true,
  },

  about: {
    title: "من نحن",
    description: "تعرف على معين - نظام إدارة المراكز الصحية",
    keywords: ["من نحن", "معين", "نظام صحي"],
  },

  contact: {
    title: "اتصل بنا",
    description: "تواصل معنا للاستفسارات والدعم الفني",
    keywords: ["اتصل بنا", "دعم فني", "استفسارات"],
  },

  features: {
    title: "المميزات",
    description: "اكتشف مميزات معين لإدارة المراكز الصحية",
    keywords: ["مميزات", "خصائص", "نظام صحي"],
  },

  pricing: {
    title: "الأسعار والباقات",
    description: "اختر الباقة المناسبة لمركزك الصحي",
    keywords: ["أسعار", "باقات", "اشتراكات"],
  },

  faq: {
    title: "الأسئلة الشائعة",
    description: "إجابات عن الأسئلة الأكثر شيوعاً حول معين",
    keywords: ["أسئلة", "استفسارات", "مساعدة"],
  },

  privacy: {
    title: "سياسة الخصوصية",
    description: "سياسة الخصوصية وحماية البيانات",
    keywords: ["خصوصية", "حماية بيانات", "سرية"],
  },

  terms: {
    title: "شروط الاستخدام",
    description: "شروط وأحكام استخدام معين",
    keywords: ["شروط", "أحكام", "استخدام"],
  },
};

/**
 * Generate JSON-LD structured data
 */
export function generateStructuredData(
  type: "organization" | "website" | "healthClinic",
) {
  const baseData = {
    "@context": "https://schema.org",
  };

  switch (type) {
    case "organization":
      return {
        ...baseData,
        "@type": "Organization",
        name: appName,
        url: baseUrl,
        logo: `${baseUrl}/logo.png`,
        description: "نظام متكامل لإدارة المراكز الصحية",
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+966-XX-XXX-XXXX",
          contactType: "customer service",
          availableLanguage: ["Arabic", "English"],
        },
      };

    case "website":
      return {
        ...baseData,
        "@type": "WebSite",
        name: appName,
        url: baseUrl,
        potentialAction: {
          "@type": "SearchAction",
          target: `${baseUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      };

    case "healthClinic":
      return {
        ...baseData,
        "@type": "MedicalClinic",
        name: appName,
        url: baseUrl,
        address: {
          "@type": "PostalAddress",
          addressCountry: "SA",
          addressLocality: "Riyadh",
        },
  {
    medicalSpecialty: "General Practice",
      };

    default:
      return baseData;
  }

const metadata = {
  generateMetadata,
  pageMetadata,
  generateStructuredData,
};

export default metadata;
}}
}}
