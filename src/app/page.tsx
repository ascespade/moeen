"use client";
import { useState, useEffect } from "react";
import { ROUTES } from "@/constants/routes";
import { usePageI18n } from "@/hooks/usePageI18n";
import { I18N_KEYS } from "@/constants/i18n-keys";
import { createClient } from "@/lib/supabase/client";

import Image from "next/image";
import Link from "next/link";

interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  cta: string;
  ctaLink: string;
}

interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
}

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  image: string;
  rating: number;
}

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
}

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

export default function HomePage() {
  const { t } = usePageI18n();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  // Load homepage content from database
  useEffect(() => {
    const loadHomepageContent = async () => {
      try {
        // Load hero slides from settings
        const { data: heroData } = await supabase
          .from('settings')
          .select('value')
          .eq('key', 'homepage_hero_slides')
          .single();

        // Load services from settings
        const { data: servicesData } = await supabase
          .from('settings')
          .select('value')
          .eq('key', 'homepage_services')
          .single();

        // Load testimonials from settings
        const { data: testimonialsData } = await supabase
          .from('settings')
          .select('value')
          .eq('key', 'homepage_testimonials')
          .single();

        // Load gallery images from settings
        const { data: galleryData } = await supabase
          .from('settings')
          .select('value')
          .eq('key', 'homepage_gallery')
          .single();

        // Load FAQs from settings
        const { data: faqsData } = await supabase
          .from('settings')
          .select('value')
          .eq('key', 'homepage_faqs')
          .single();

        // Set data with fallbacks
        setHeroSlides(heroData?.value || getDefaultHeroSlides());
        setServices(servicesData?.value || getDefaultServices());
        setTestimonials(testimonialsData?.value || getDefaultTestimonials());
        setGalleryImages(galleryData?.value || getDefaultGalleryImages());
        setFaqs(faqsData?.value || getDefaultFAQs());

      } catch (error) {
        console.error('Error loading homepage content:', error);
        // Use fallback data
        setHeroSlides(getDefaultHeroSlides());
        setServices(getDefaultServices());
        setTestimonials(getDefaultTestimonials());
        setGalleryImages(getDefaultGalleryImages());
        setFaqs(getDefaultFAQs());
      } finally {
        setLoading(false);
      }
    };

    loadHomepageContent();
  }, [t]);

  // Default fallback data (only used when DB is unavailable)
  const getDefaultHeroSlides = (): HeroSlide[] => [
    {
      id: 1,
      title: t(I18N_KEYS.HOMEPAGE.HERO.SLIDE1_TITLE, "مرحباً بك في مُعين"),
      subtitle: t(I18N_KEYS.HOMEPAGE.HERO.SLIDE1_SUBTITLE, "منصة الرعاية الصحية المتخصصة"),
      description: t(I18N_KEYS.HOMEPAGE.HERO.SLIDE1_DESCRIPTION, "نقدم خدمات متكاملة للرعاية الصحية مع أحدث التقنيات والذكاء الاصطناعي"),
      image: "/logo.jpg",
      cta: t(I18N_KEYS.HOMEPAGE.HERO.SLIDE1_CTA, "اكتشف خدماتنا"),
      ctaLink: "#services",
    },
    {
      id: 2,
      title: t(I18N_KEYS.HOMEPAGE.HERO.SLIDE2_TITLE, "إدارة المواعيد الذكية"),
      subtitle: t(I18N_KEYS.HOMEPAGE.HERO.SLIDE2_SUBTITLE, "نظام تقويم متطور"),
      description: t(I18N_KEYS.HOMEPAGE.HERO.SLIDE2_DESCRIPTION, "احجز مواعيدك بسهولة مع نظام التقويم الذكي وإدارة الجلسات العلاجية"),
      image: "/logo.jpg",
      cta: t(I18N_KEYS.HOMEPAGE.HERO.SLIDE2_CTA, "احجز موعدك"),
      ctaLink: ROUTES.HEALTH.APPOINTMENTS,
    },
    {
      id: 3,
      title: t(I18N_KEYS.HOMEPAGE.HERO.SLIDE3_TITLE, "شات بوت ذكي"),
      subtitle: t(I18N_KEYS.HOMEPAGE.HERO.SLIDE3_SUBTITLE, "مساعدك الصحي الشخصي"),
      description: t(I18N_KEYS.HOMEPAGE.HERO.SLIDE3_DESCRIPTION, "احصل على إجابات فورية لاستفساراتك الصحية مع الذكاء الاصطناعي المتقدم"),
      image: "/logo.jpg",
      cta: t(I18N_KEYS.HOMEPAGE.HERO.SLIDE3_CTA, "جرب الشات بوت"),
      ctaLink: ROUTES.CHATBOT.FLOWS,
    },
  ];

  const getDefaultServices = (): Service[] => [
    {
      id: 1,
      title: t(I18N_KEYS.HOMEPAGE.SERVICES.APPOINTMENTS_TITLE, "إدارة المواعيد"),
      description: t(I18N_KEYS.HOMEPAGE.SERVICES.APPOINTMENTS_DESCRIPTION, "نظام تقويم متطور لإدارة المواعيد والجلسات العلاجية"),
      icon: "📅",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      id: 2,
      title: t(I18N_KEYS.HOMEPAGE.SERVICES.PATIENTS_TITLE, "إدارة المرضى"),
      description: t(I18N_KEYS.HOMEPAGE.SERVICES.PATIENTS_DESCRIPTION, "ملفات مرضى شاملة مع سجل طبي مفصل"),
      icon: "👤",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      id: 3,
      title: t(I18N_KEYS.HOMEPAGE.SERVICES.INSURANCE_TITLE, "المطالبات التأمينية"),
      description: t(I18N_KEYS.HOMEPAGE.SERVICES.INSURANCE_DESCRIPTION, "إدارة وتتبع المطالبات التأمينية بسهولة"),
      icon: "📋",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      id: 4,
      title: t(I18N_KEYS.HOMEPAGE.SERVICES.CHATBOT_TITLE, "الشات بوت الذكي"),
      description: t(I18N_KEYS.HOMEPAGE.SERVICES.CHATBOT_DESCRIPTION, "مساعد ذكي للرد على استفسارات المرضى"),
      icon: "🤖",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      id: 5,
      title: t(I18N_KEYS.HOMEPAGE.SERVICES.STAFF_TITLE, "إدارة الموظفين"),
      description: t(I18N_KEYS.HOMEPAGE.SERVICES.STAFF_DESCRIPTION, "تتبع ساعات العمل والأداء للموظفين"),
      icon: "👨‍⚕️",
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      id: 6,
      title: t(I18N_KEYS.HOMEPAGE.SERVICES.REPORTS_TITLE, "التقارير والتحليلات"),
      description: t(I18N_KEYS.HOMEPAGE.SERVICES.REPORTS_DESCRIPTION, "تقارير شاملة وإحصائيات مفصلة"),
      icon: "📊",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
  ];

  const getDefaultTestimonials = (): Testimonial[] => [
    {
      id: 1,
      name: "د. أحمد محمد",
      role: "طبيب أسنان",
      content: "منصة مُعين ساعدتني في تنظيم مواعيدي وملفات المرضى بشكل ممتاز",
      image: "/logo.jpg",
      rating: 5,
    },
    {
      id: 2,
      name: "م. فاطمة السعيد",
      role: "مدير عيادة",
      content: "الشات بوت الذكي يوفر وقت كبير في الرد على استفسارات المرضى",
      image: "/logo.jpg",
      rating: 5,
    },
    {
      id: 3,
      name: "د. خالد العتيبي",
      role: "طبيب عام",
      content: "التقارير والإحصائيات تساعدني في اتخاذ قرارات أفضل لمرضاي",
      image: "/logo.jpg",
      rating: 5,
    },
  ];

  const getDefaultGalleryImages = (): GalleryImage[] => [
    { id: 1, src: "/logo.jpg", alt: "عيادة حديثة" },
    { id: 2, src: "/logo.jpg", alt: "معدات طبية" },
    { id: 3, src: "/logo.jpg", alt: "فريق العمل" },
    { id: 4, src: "/logo.jpg", alt: "بيئة مريحة" },
    { id: 5, src: "/logo.jpg", alt: "تقنيات متطورة" },
    { id: 6, src: "/logo.jpg", alt: "خدمة ممتازة" },
  ];

  const getDefaultFAQs = (): FAQ[] => [
    {
      id: 1,
      question: "كيف يمكنني حجز موعد؟",
      answer: "يمكنك حجز موعد بسهولة من خلال الموقع أو التطبيق، أو الاتصال بنا مباشرة",
    },
    {
      id: 2,
      question: "هل الشات بوت متاح 24/7؟",
      answer: "نعم، الشات بوت متاح على مدار الساعة للإجابة على استفساراتكم",
    },
    {
      id: 3,
      question: "كيف يمكنني تتبع مطالباتي التأمينية؟",
      answer: "يمكنك تتبع حالة مطالباتك التأمينية من خلال لوحة التحكم الخاصة بك",
    },
    {
      id: 4,
      question: "هل البيانات محمية؟",
      answer: "نعم، نستخدم أحدث تقنيات التشفير لحماية بياناتكم وخصوصيتكم",
    },
  ];

  // Auto-slide functionality
  useEffect(() => {
    if (heroSlides.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [heroSlides.length]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل المحتوى...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-90" />
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {heroSlides[currentSlide]?.title}
          </h1>
          <h2 className="text-xl md:text-2xl mb-4 text-blue-100">
            {heroSlides[currentSlide]?.subtitle}
          </h2>
          <p className="text-lg mb-8 text-gray-200">
            {heroSlides[currentSlide]?.description}
          </p>
          <Link
            href={heroSlides[currentSlide]?.ctaLink || "#services"}
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            {heroSlides[currentSlide]?.cta}
          </Link>
        </div>
        
        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full ${
                index === currentSlide ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              خدماتنا المتكاملة
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              نقدم مجموعة شاملة من الخدمات الصحية المتطورة لضمان أفضل رعاية لمرضانا
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className={`text-4xl mb-4 ${service.color}`}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              آراء عملائنا
            </h2>
            <p className="text-lg text-gray-600">
              اكتشف ما يقوله عملاؤنا عن خدماتنا
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-gray-50 rounded-lg p-6 text-center"
              >
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  width={80}
                  height={80}
                  className="rounded-full mx-auto mb-4"
                />
                <div className="flex justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">★</span>
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "{testimonial.content}"
                </p>
                <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                <p className="text-gray-500 text-sm">{testimonial.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              معرض الصور
            </h2>
            <p className="text-lg text-gray-600">
              اكتشف بيئة العمل المتطورة في عياداتنا
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {galleryImages.map((image) => (
              <div key={image.id} className="aspect-square overflow-hidden rounded-lg">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              الأسئلة الشائعة
            </h2>
            <p className="text-lg text-gray-600">
              إجابات على أكثر الأسئلة شيوعاً
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            {faqs.map((faq) => (
              <div key={faq.id} className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ابدأ رحلتك الصحية معنا
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            احجز موعدك اليوم واستمتع بأفضل الخدمات الصحية
          </p>
          <Link
            href={ROUTES.HEALTH.APPOINTMENTS}
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            احجز موعدك الآن
          </Link>
        </div>
      </section>
    </div>
  );
}