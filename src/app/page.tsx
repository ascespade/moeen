"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

// Hero Slider Data
const heroSlides = [
  {
    id: 1,
    title: "مرحباً بك في مُعين",
    subtitle: "منصة الرعاية الصحية المتخصصة",
    description: "نقدم خدمات متكاملة للرعاية الصحية مع أحدث التقنيات والذكاء الاصطناعي",
    image: "/hero-1.jpg",
    cta: "اكتشف خدماتنا",
    ctaLink: "#services"
  },
  {
    id: 2,
    title: "إدارة المواعيد الذكية",
    subtitle: "نظام تقويم متطور",
    description: "احجز مواعيدك بسهولة مع نظام التقويم الذكي وإدارة الجلسات العلاجية",
    image: "/hero-2.jpg",
    cta: "احجز موعدك",
    ctaLink: ROUTES.HEALTH.APPOINTMENTS
  },
  {
    id: 3,
    title: "شات بوت ذكي",
    subtitle: "مساعدك الصحي الشخصي",
    description: "احصل على إجابات فورية لاستفساراتك الصحية مع الذكاء الاصطناعي المتقدم",
    image: "/hero-3.jpg",
    cta: "جرب الشات بوت",
    ctaLink: ROUTES.CHATBOT.FLOWS
  }
];

// Services Data
const services = [
  {
    id: 1,
    title: "إدارة المواعيد",
    description: "نظام تقويم متطور لإدارة المواعيد والجلسات العلاجية",
    icon: "📅",
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    id: 2,
    title: "إدارة المرضى",
    description: "ملفات مرضى شاملة مع سجل طبي مفصل",
    icon: "👤",
    color: "text-green-600",
    bgColor: "bg-green-50"
  },
  {
    id: 3,
    title: "المطالبات التأمينية",
    description: "إدارة وتتبع المطالبات التأمينية بسهولة",
    icon: "📋",
    color: "text-purple-600",
    bgColor: "bg-purple-50"
  },
  {
    id: 4,
    title: "الشات بوت الذكي",
    description: "مساعد ذكي للرد على استفسارات المرضى",
    icon: "🤖",
    color: "text-orange-600",
    bgColor: "bg-orange-50"
  },
  {
    id: 5,
    title: "إدارة الموظفين",
    description: "تتبع ساعات العمل والأداء للموظفين",
    icon: "👨‍⚕️",
    color: "text-red-600",
    bgColor: "bg-red-50"
  },
  {
    id: 6,
    title: "التقارير والتحليلات",
    description: "تقارير شاملة وإحصائيات مفصلة",
    icon: "📊",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50"
  }
];

// Testimonials Data
const testimonials = [
  {
    id: 1,
    name: "د. أحمد العتيبي",
    position: "طبيب علاج طبيعي",
    content: "منصة مُعين ساعدتني في تنظيم مواعيدي وإدارة مرضاي بكفاءة عالية",
    rating: 5,
    image: "/testimonial-1.jpg"
  },
  {
    id: 2,
    name: "أ. فاطمة السعيد",
    position: "ممرضة",
    content: "النظام سهل الاستخدام ويوفر جميع الأدوات التي نحتاجها في العمل اليومي",
    rating: 5,
    image: "/testimonial-2.jpg"
  },
  {
    id: 3,
    name: "د. محمد القحطاني",
    position: "طبيب نفسي",
    content: "الشات بوت الذكي يساعد المرضى في الحصول على إجابات سريعة ودقيقة",
    rating: 5,
    image: "/testimonial-3.jpg"
  }
];

// Gallery Data
const galleryImages = [
  { id: 1, src: "/gallery-1.jpg", alt: "مركز العلاج الطبيعي" },
  { id: 2, src: "/gallery-2.jpg", alt: "قاعة العلاج الوظيفي" },
  { id: 3, src: "/gallery-3.jpg", alt: "عيادة العلاج النفسي" },
  { id: 4, src: "/gallery-4.jpg", alt: "مكتبة العلاج" },
  { id: 5, src: "/gallery-5.jpg", alt: "قاعة التدريب" },
  { id: 6, src: "/gallery-6.jpg", alt: "منطقة الاستقبال" }
];

// FAQ Data
const faqs = [
  {
    id: 1,
    question: "كيف يمكنني حجز موعد؟",
    answer: "يمكنك حجز موعد بسهولة من خلال صفحة المواعيد أو الاتصال بنا مباشرة"
  },
  {
    id: 2,
    question: "هل النظام يدعم التأمين الصحي؟",
    answer: "نعم، النظام يدعم جميع شركات التأمين الصحي ويمكن إدارة المطالبات بسهولة"
  },
  {
    id: 3,
    question: "كيف يعمل الشات بوت الذكي؟",
    answer: "الشات بوت يستخدم الذكاء الاصطناعي للرد على استفسارات المرضى بشكل فوري ودقيق"
  }
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Auto-slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--brand-surface)]">
      {/* Navigation */}
      <nav className="nav sticky top-0 z-50">
        <div className="container-app py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image
                src="/logo.jpg"
                alt="مُعين"
                width={50}
                height={50}
                className="rounded-lg"
              />
              <h1 className="text-2xl font-bold text-brand">مُعين</h1>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <Link href="#services" className="nav-link">
                الخدمات
              </Link>
              <Link href="#about" className="nav-link">
                عن معين
              </Link>
              <Link href="#gallery" className="nav-link">
                المعرض
              </Link>
              <Link href="#contact" className="nav-link">
                اتصل بنا
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href={ROUTES.LOGIN}
                className="btn btn-outline"
              >
                تسجيل الدخول
              </Link>
              <Link
                href={ROUTES.REGISTER}
                className="btn btn-brand"
              >
                إنشاء حساب
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Slider */}
      <section className="relative h-[80vh] overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent z-10"></div>
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="relative z-20 container-app h-full flex items-center">
              <div className="max-w-2xl text-white">
                <h2 className="text-5xl font-bold mb-4 animate-fadeInUp">
                  {slide.title}
                </h2>
                <h3 className="text-2xl mb-4 text-[var(--brand-primary)] animate-fadeInUp">
                  {slide.subtitle}
                </h3>
                <p className="text-lg mb-8 animate-fadeInUp">
                  {slide.description}
                </p>
                <Link
                  href={slide.ctaLink}
                  className="btn-brand px-8 py-3 rounded-lg text-lg font-semibold hover:bg-[var(--brand-primary-hover)] transition-all transform hover:-translate-y-1 hover:shadow-lg animate-fadeInUp"
                >
                  {slide.cta}
                </Link>
              </div>
            </div>
          </div>
        ))}
        
        {/* Slider Controls */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? "bg-[var(--brand-primary)]" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white dark:bg-gray-900">
        <div className="container-app">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              خدماتنا المتكاملة
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              نقدم مجموعة شاملة من الخدمات التقنية لمراكز الرعاية الصحية
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="card p-8 text-center hover:shadow-soft transition-all duration-300 group"
              >
                <div className={`w-16 h-16 ${service.bgColor} rounded-full flex items-center justify-center text-3xl mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-[var(--brand-surface)]">
        <div className="container-app">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              آراء عملائنا
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              ما يقوله عنا أطباؤنا وموظفونا
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="card p-8 text-center">
                <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-6">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">★</span>
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6 italic">
                  "{testimonial.content}"
                </p>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {testimonial.name}
                </h4>
                <p className="text-sm text-gray-500">
                  {testimonial.position}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 bg-white dark:bg-gray-900">
        <div className="container-app">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              معرض الصور
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              استكشف مرافقنا وبيئة العمل المريحة
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image) => (
              <div
                key={image.id}
                className="relative group cursor-pointer overflow-hidden rounded-lg"
                onClick={() => setSelectedImage(image.src)}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={400}
                  height={300}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white text-lg font-semibold">عرض الصورة</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-[var(--brand-surface)]">
        <div className="container-app">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                عن مُعين
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                منصة مُعين هي الحل التقني الشامل لمراكز الرعاية الصحية المتخصصة. 
                نقدم نظاماً متكاملاً يجمع بين إدارة المواعيد، ملفات المرضى، 
                المطالبات التأمينية، والشات بوت الذكي.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                هدفنا هو تبسيط العمليات الطبية ورفع كفاءة الخدمات المقدمة للمرضى 
                من خلال التقنيات الحديثة والذكاء الاصطناعي.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href={ROUTES.HEALTH.APPOINTMENTS}
                  className="btn-brand px-6 py-3 rounded-lg text-white hover:bg-[var(--brand-primary-hover)] transition-colors"
                >
                  ابدأ الآن
                </Link>
                <Link
                  href="#contact"
                  className="px-6 py-3 border border-brand text-brand rounded-lg hover:bg-brand hover:text-white transition-colors"
                >
                  تواصل معنا
                </Link>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/about-image.jpg"
                alt="عن مُعين"
                width={600}
                height={400}
                className="rounded-lg shadow-soft"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container-app">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              الأسئلة الشائعة
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              إجابات على أكثر الأسئلة شيوعاً
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq) => (
              <div key={faq.id} className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-[var(--brand-surface)]">
        <div className="container-app">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              تواصل معنا
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              نحن هنا لمساعدتك في أي وقت
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
                📱
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                واتساب
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                تواصل معنا عبر واتساب
              </p>
              <a
                href="https://wa.me/966501234567"
                className="text-green-600 hover:text-green-700 font-semibold"
              >
                +966 50 123 4567
              </a>
            </div>
            
            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
                📞
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                اتصال مباشر
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                اتصل بنا مباشرة
              </p>
              <a
                href="tel:+966501234567"
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                +966 50 123 4567
              </a>
            </div>
            
            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
                📍
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                الموقع
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                زورنا في مقرنا
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                الرياض، المملكة العربية السعودية
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container-app">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Image
                  src="/logo.jpg"
                  alt="مُعين"
                  width={40}
                  height={40}
                  className="rounded-lg"
                />
                <h3 className="text-2xl font-bold">مُعين</h3>
              </div>
              <p className="text-gray-300 mb-6">
                منصة الرعاية الصحية المتخصصة التي تجمع بين التقنيات الحديثة 
                والذكاء الاصطناعي لخدمة المرضى والعاملين في القطاع الصحي.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6">الخدمات</h4>
              <ul className="space-y-3">
                <li><Link href={ROUTES.HEALTH.APPOINTMENTS} className="text-gray-300 hover:text-white transition-colors">إدارة المواعيد</Link></li>
                <li><Link href={ROUTES.HEALTH.PATIENTS} className="text-gray-300 hover:text-white transition-colors">إدارة المرضى</Link></li>
                <li><Link href={ROUTES.HEALTH.INSURANCE_CLAIMS} className="text-gray-300 hover:text-white transition-colors">المطالبات التأمينية</Link></li>
                <li><Link href={ROUTES.CHATBOT.FLOWS} className="text-gray-300 hover:text-white transition-colors">الشات بوت الذكي</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6">روابط سريعة</h4>
              <ul className="space-y-3">
                <li><Link href="#about" className="text-gray-300 hover:text-white transition-colors">عن معين</Link></li>
                <li><Link href="#gallery" className="text-gray-300 hover:text-white transition-colors">المعرض</Link></li>
                <li><Link href="#contact" className="text-gray-300 hover:text-white transition-colors">اتصل بنا</Link></li>
                <li><Link href={ROUTES.LOGIN} className="text-gray-300 hover:text-white transition-colors">تسجيل الدخول</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6">تواصل معنا</h4>
              <div className="space-y-3">
                <p className="text-gray-300">📱 +966 50 123 4567</p>
                <p className="text-gray-300">📧 info@moeen.com</p>
                <p className="text-gray-300">📍 الرياض، المملكة العربية السعودية</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 مُعين. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </footer>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <Image
              src={selectedImage}
              alt="معرض الصور"
              width={800}
              height={600}
              className="rounded-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}