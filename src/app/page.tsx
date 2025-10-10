"use client";
import { useState, useEffect } from "react";
import { ROUTES } from "@/constants/routes";
import { usePageI18n } from "@/hooks/usePageI18n";
import { I18N_KEYS } from "@/constants/i18n-keys";
import { dynamicContentManager, type HomepageContent } from "@/lib/dynamic-content-manager";

import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  const { t } = usePageI18n();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [content, setContent] = useState<HomepageContent>({
    heroSlides: [],
    services: [],
    testimonials: [],
    galleryImages: [],
    faqs: []
  });
  const [loading, setLoading] = useState(true);

  // Load homepage content from database using dynamic content manager
  useEffect(() => {
    const loadHomepageContent = async () => {
      try {
        const homepageContent = await dynamicContentManager.getHomepageContent();
        setContent(homepageContent);
      } catch (error) {
        console.error('Error loading homepage content:', error);
        // Set empty content instead of hardcoded fallbacks
        setContent({
          heroSlides: [],
          services: [],
          testimonials: [],
          galleryImages: [],
          faqs: []
        });
      } finally {
        setLoading(false);
      }
    };

    loadHomepageContent();
  }, [t]);


  // Auto-slide functionality
  useEffect(() => {
    if (content.heroSlides.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % content.heroSlides.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [content.heroSlides.length]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t(I18N_KEYS.COMMON.LOADING, "جاري التحميل...")}</p>
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
            {content.heroSlides[currentSlide]?.title}
          </h1>
          <h2 className="text-xl md:text-2xl mb-4 text-blue-100">
            {content.heroSlides[currentSlide]?.subtitle}
          </h2>
          <p className="text-lg mb-8 text-gray-200">
            {content.heroSlides[currentSlide]?.description}
          </p>
          <Link
            href={content.heroSlides[currentSlide]?.ctaLink || "#services"}
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            {content.heroSlides[currentSlide]?.cta}
          </Link>
        </div>
        
        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {content.heroSlides.map((_, index) => (
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
              {t(I18N_KEYS.HOMEPAGE.SERVICES.TITLE, "خدماتنا المتكاملة")}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t(I18N_KEYS.HOMEPAGE.SERVICES.SUBTITLE, "نقدم مجموعة شاملة من الخدمات الصحية المتطورة لضمان أفضل رعاية لمرضانا")}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {content.services.map((service) => (
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
              {t(I18N_KEYS.HOMEPAGE.TESTIMONIALS.TITLE, "آراء عملائنا")}
            </h2>
            <p className="text-lg text-gray-600">
              {t(I18N_KEYS.HOMEPAGE.TESTIMONIALS.SUBTITLE, "اكتشف ما يقوله عملاؤنا عن خدماتنا")}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.testimonials.map((testimonial) => (
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
              {t(I18N_KEYS.HOMEPAGE.GALLERY.TITLE, "معرض الصور")}
            </h2>
            <p className="text-lg text-gray-600">
              {t(I18N_KEYS.HOMEPAGE.GALLERY.SUBTITLE, "اكتشف بيئة العمل المتطورة في عياداتنا")}
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {content.galleryImages.map((image) => (
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
              {t(I18N_KEYS.HOMEPAGE.FAQ.TITLE, "الأسئلة الشائعة")}
            </h2>
            <p className="text-lg text-gray-600">
              {t(I18N_KEYS.HOMEPAGE.FAQ.SUBTITLE, "إجابات على أكثر الأسئلة شيوعاً")}
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            {content.faqs.map((faq) => (
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
            {t(I18N_KEYS.HOMEPAGE.CONTACT.TITLE, "ابدأ رحلتك الصحية معنا")}
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            {t(I18N_KEYS.HOMEPAGE.CONTACT.SUBTITLE, "احجز موعدك اليوم واستمتع بأفضل الخدمات الصحية")}
          </p>
          <Link
            href={ROUTES.HEALTH.APPOINTMENTS}
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            {t(I18N_KEYS.APPOINTMENTS.BOOK_APPOINTMENT, "احجز موعدك الآن")}
          </Link>
        </div>
      </section>
    </div>
  );
}