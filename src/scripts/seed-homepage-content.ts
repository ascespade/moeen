import { logger } from "@/lib/logger";

import { dynamicContentManager } from "../lib/dynamic-content-manager";

/**
 * Seed homepage content with dynamic data
 * This replaces all hardcoded content with database-driven content
 */
async function seedHomepageContent() {
  try {
    logger.info("🌱 Seeding homepage content...");

    // Hero slides content
    const heroSlides = [
        id: 1,
        title: "مرحباً بك في مُعين",
        subtitle: "منصة الرعاية الصحية المتخصصة",
        description:
          "نقدم خدمات متكاملة للرعاية الصحية مع أحدث التقنيات والذكاء الاصطناعي",
        image: "/logo.jpg",
        cta: "اكتشف خدماتنا",
        ctaLink: "#services",
      },
        id: 2,
        title: "إدارة المواعيد الذكية",
        subtitle: "نظام تقويم متطور",
        description:
          "احجز مواعيدك بسهولة مع نظام التقويم الذكي وإدارة الجلسات العلاجية",
        image: "/logo.jpg",
        cta: "احجز موعدك",
        ctaLink: "/appointments",
      },
        id: 3,
        title: "شات بوت ذكي",
        subtitle: "مساعدك الصحي الشخصي",
        description:
          "احصل على إجابات فورية لاستفساراتك الصحية مع الذكاء الاصطناعي المتقدم",
        image: "/logo.jpg",
        cta: "جرب الشات بوت",
        ctaLink: "/chatbot/flows",
      },
    ];

    // Services content
    const services = [
        id: 1,
        title: "إدارة المواعيد",
        description: "نظام تقويم متطور لإدارة المواعيد والجلسات العلاجية",
        icon: "📅",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
      },
        id: 2,
        title: "إدارة المرضى",
        description: "ملفات مرضى شاملة مع سجل طبي مفصل",
        icon: "👤",
        color: "text-green-600",
        bgColor: "bg-green-50",
      },
        id: 3,
        title: "المطالبات التأمينية",
        description: "إدارة وتتبع المطالبات التأمينية بسهولة",
        icon: "📋",
        color: "text-purple-600",
        bgColor: "bg-purple-50",
      },
        id: 4,
        title: "الشات بوت الذكي",
        description: "مساعد ذكي للرد على استفسارات المرضى",
        icon: "🤖",
        color: "text-orange-600",
        bgColor: "bg-orange-50",
      },
        id: 5,
        title: "إدارة الموظفين",
        description: "تتبع ساعات العمل والأداء للموظفين",
        icon: "👨‍⚕️",
        color: "text-red-600",
        bgColor: "bg-red-50",
      },
        id: 6,
        title: "التقارير والتحليلات",
        description: "تقارير شاملة وإحصائيات مفصلة",
        icon: "📊",
        color: "text-indigo-600",
        bgColor: "bg-indigo-50",
      },
    ];

    // Testimonials content
    const testimonials = [
        id: 1,
        name: "د. أحمد محمد",
        role: "طبيب أسنان",
        content: "منصة مُعين ساعدتني في تنظيم مواعيدي وملفات المرضى بشكل ممتاز",
        image: "/logo.jpg",
        rating: 5,
      },
        id: 2,
        name: "م. فاطمة السعيد",
        role: "مدير عيادة",
        content: "الشات بوت الذكي يوفر وقت كبير في الرد على استفسارات المرضى",
        image: "/logo.jpg",
        rating: 5,
      },
        id: 3,
        name: "د. خالد العتيبي",
        role: "طبيب عام",
        content: "التقارير والإحصائيات تساعدني في اتخاذ قرارات أفضل لمرضاي",
        image: "/logo.jpg",
        rating: 5,
      },
    ];

    // Gallery images content
    const galleryImages = [
      { id: 1, src: "/logo.jpg", alt: "عيادة حديثة" },
      { id: 2, src: "/logo.jpg", alt: "معدات طبية" },
      { id: 3, src: "/logo.jpg", alt: "فريق العمل" },
      { id: 4, src: "/logo.jpg", alt: "بيئة مريحة" },
      { id: 5, src: "/logo.jpg", alt: "تقنيات متطورة" },
      { id: 6, src: "/logo.jpg", alt: "خدمة ممتازة" },
    ];

    // FAQ content
    const faqs = [
        id: 1,
        question: "كيف يمكنني حجز موعد؟",
        answer:
          "يمكنك حجز موعد بسهولة من خلال الموقع أو التطبيق، أو الاتصال بنا مباشرة",
      },
        id: 2,
        question: "هل الشات بوت متاح 24/7؟",
        answer: "نعم، الشات بوت متاح على مدار الساعة للإجابة على استفساراتكم",
      },
        id: 3,
        question: "كيف يمكنني تتبع مطالباتي التأمينية؟",
        answer:
          "يمكنك تتبع حالة مطالباتك التأمينية من خلال لوحة التحكم الخاصة بك",
      },
        id: 4,
        question: "هل البيانات محمية؟",
        answer: "نعم، نستخدم أحدث تقنيات التشفير لحماية بياناتكم وخصوصيتكم",
      },
    ];

    // Update homepage content
    await dynamicContentManager.updateHomepageContent({
      heroSlides,
      services,
      testimonials,
      galleryImages,
      faqs,
    });

    logger.info("✅ Homepage content seeded successfully!");

    // Also seed translations for the homepage
    const translations = [
      // Arabic translations
        locale: "ar",
        namespace: "common",
        key: "homepage.services.title",
        value: "خدماتنا المتكاملة",
      },
  {
    locale: "ar",
        namespace: "common",
        key: "homepage.services.subtitle",
        value:
          "نقدم مجموعة شاملة من الخدمات الصحية المتطورة لضمان أفضل رعاية لمرضانا",
      },
  {
    locale: "ar",
        namespace: "common",
        key: "homepage.testimonials.title",
        value: "آراء عملائنا",
      },
  {
    locale: "ar",
        namespace: "common",
        key: "homepage.testimonials.subtitle",
        value: "اكتشف ما يقوله عملاؤنا عن خدماتنا",
      },
  {
    locale: "ar",
        namespace: "common",
        key: "homepage.gallery.title",
        value: "معرض الصور",
      },
  {
    locale: "ar",
        namespace: "common",
        key: "homepage.gallery.subtitle",
        value: "اكتشف بيئة العمل المتطورة في عياداتنا",
      },
  {
    locale: "ar",
        namespace: "common",
        key: "homepage.faq.title",
        value: "الأسئلة الشائعة",
      },
  {
    locale: "ar",
        namespace: "common",
        key: "homepage.faq.subtitle",
        value: "إجابات على أكثر الأسئلة شيوعاً",
      },
  {
    locale: "ar",
        namespace: "common",
        key: "homepage.contact.title",
        value: "ابدأ رحلتك الصحية معنا",
      },
  {
    locale: "ar",
        namespace: "common",
        key: "homepage.contact.subtitle",
        value: "احجز موعدك اليوم واستمتع بأفضل الخدمات الصحية",
      },

      // English translations
        locale: "en",
        namespace: "common",
        key: "homepage.services.title",
        value: "Our Integrated Services",
      },
  {
    locale: "en",
        namespace: "common",
        key: "homepage.services.subtitle",
        value:
          "We provide a comprehensive range of advanced healthcare services to ensure the best care for our patients",
      },
  {
    locale: "en",
        namespace: "common",
        key: "homepage.testimonials.title",
        value: "Client Testimonials",
      },
  {
    locale: "en",
        namespace: "common",
        key: "homepage.testimonials.subtitle",
        value: "Discover what our clients say about our services",
      },
  {
    locale: "en",
        namespace: "common",
        key: "homepage.gallery.title",
        value: "Photo Gallery",
      },
  {
    locale: "en",
        namespace: "common",
        key: "homepage.gallery.subtitle",
        value: "Discover the advanced work environment in our clinics",
      },
  {
    locale: "en",
        namespace: "common",
        key: "homepage.faq.title",
        value: "Frequently Asked Questions",
      },
  {
    locale: "en",
        namespace: "common",
        key: "homepage.faq.subtitle",
        value: "Answers to the most common questions",
      },
  {
    locale: "en",
        namespace: "common",
        key: "homepage.contact.title",
        value: "Start Your Health Journey With Us",
      },
  {
    locale: "en",
        namespace: "common",
        key: "homepage.contact.subtitle",
        value:
          "Book your appointment today and enjoy the best healthcare services",
      },
    ];

    await dynamicContentManager.updateTranslations(translations);

    logger.info("✅ Translations seeded successfully!");
    logger.info("🎉 All dynamic content has been seeded!");
  } catch (error) {
    logger.error("❌ Error seeding homepage content:", error);
    throw error;

// Run the seeding if this file is executed directly
if (require.main === module) {
  seedHomepageContent()
    .then(() => {
      logger.info("✅ Seeding completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      logger.error("❌ Seeding failed:", error);
      process.exit(1);
    });

export default seedHomepageContent;
