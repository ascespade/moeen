"use client";
import { useState, useEffect } from "react";
import { ROUTES } from "@/constants/routes";

import Image from "next/image";
import Link from "next/link";

// Hero Slider Data
const heroSlides = [
  {
    id: 1,
    title: "مرحباً بك في مُعين",
    subtitle: "منصة الرعاية الصحية المتخصصة",
    description:
      "نقدم خدمات متكاملة للرعاية الصحية مع أحدث التقنيات والذكاء الاصطناعي",
    image: "/hero-1.jpg",
    cta: "اكتشف خدماتنا",
    ctaLink: "#services",
  },
  {
    id: 2,
    title: "إدارة المواعيد الذكية",
    subtitle: "نظام تقويم متطور",
    description:
      "احجز مواعيدك بسهولة مع نظام التقويم الذكي وإدارة الجلسات العلاجية",
    image: "/hero-2.jpg",
    cta: "احجز موعدك",
    ctaLink: ROUTES.HEALTH.APPOINTMENTS,
  },
  {
    id: 3,
    title: "شات بوت ذكي",
    subtitle: "مساعدك الصحي الشخصي",
    description:
      "احصل على إجابات فورية لاستفساراتك الصحية مع الذكاء الاصطناعي المتقدم",
    image: "/hero-3.jpg",
    cta: "جرب الشات بوت",
    ctaLink: ROUTES.CHATBOT.FLOWS,
  },
];

// Services Data
const services = [
  {
    id: 1,
    title: "إدارة المواعيد",
    description: "نظام تقويم متطور لإدارة المواعيد والجلسات العلاجية",
    icon: "📅",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    id: 2,
    title: "إدارة المرضى",
    description: "ملفات مرضى شاملة مع سجل طبي مفصل",
    icon: "👤",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    id: 3,
    title: "المطالبات التأمينية",
    description: "إدارة وتتبع المطالبات التأمينية بسهولة",
    icon: "📋",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    id: 4,
    title: "الشات بوت الذكي",
    description: "مساعد ذكي للرد على استفسارات المرضى",
    icon: "🤖",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    id: 5,
    title: "إدارة الموظفين",
    description: "تتبع ساعات العمل والأداء للموظفين",
    icon: "👨‍⚕️",
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
  {
    id: 6,
    title: "التقارير والتحليلات",
    description: "تقارير شاملة وإحصائيات مفصلة",
    icon: "📊",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
  },
];

// Testimonials Data
const testimonials = [
  {
    id: 1,
    name: "د. أحمد العتيبي",
    position: "طبيب علاج طبيعي",
    content: "منصة مُعين ساعدتني في تنظيم مواعيدي وإدارة مرضاي بكفاءة عالية",
    rating: 5,
    image: "/testimonial-1.jpg",
  },
  {
    id: 2,
    name: "أ. فاطمة السعيد",
    position: "ممرضة",
    content:
      "النظام سهل الاستخدام ويوفر جميع الأدوات التي نحتاجها في العمل اليومي",
    rating: 5,
    image: "/testimonial-2.jpg",
  },
  {
    id: 3,
    name: "د. محمد القحطاني",
    position: "طبيب نفسي",
    content: "الشات بوت الذكي يساعد المرضى في الحصول على إجابات سريعة ودقيقة",
    rating: 5,
    image: "/testimonial-3.jpg",
  },
];

// Gallery Data
const galleryImages = [
  { id: 1, src: "/gallery-1.jpg", alt: "مركز العلاج الطبيعي" },
  { id: 2, src: "/gallery-2.jpg", alt: "قاعة العلاج الوظيفي" },
  { id: 3, src: "/gallery-3.jpg", alt: "عيادة العلاج النفسي" },
  { id: 4, src: "/gallery-4.jpg", alt: "مكتبة العلاج" },
  { id: 5, src: "/gallery-5.jpg", alt: "قاعة التدريب" },
  { id: 6, src: "/gallery-6.jpg", alt: "منطقة الاستقبال" },
];

// FAQ Data
const faqs = [
  {
    id: 1,
    question: "كيف يمكنني حجز موعد؟",
    answer: "يمكنك حجز موعد بسهولة من خلال صفحة المواعيد أو الاتصال بنا مباشرة",
  },
  {
    id: 2,
    question: "هل النظام يدعم التأمين الصحي؟",
    answer:
      "نعم، النظام يدعم جميع شركات التأمين الصحي ويمكن إدارة المطالبات بسهولة",
  },
  {
    id: 3,
    question: "كيف يعمل الشات بوت الذكي؟",
    answer:
      "الشات بوت يستخدم الذكاء الاصطناعي للرد على استفسارات المرضى بشكل فوري ودقيق",
  },
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
              <h1 className="text-brand text-2xl font-bold">مُعين</h1>
            </div>
            <div className="hidden items-center gap-6 md:flex">
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
              <Link href={ROUTES.LOGIN} className="btn btn-outline">
                تسجيل الدخول
              </Link>
              <Link href={ROUTES.REGISTER} className="btn btn-brand">
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
            <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/50 to-transparent"></div>
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="container-app relative z-20 flex h-full items-center">
              <div className="max-w-2xl text-white">
                <h2 className="animate-fadeInUp mb-4 text-5xl font-bold">
                  {slide.title}
                </h2>
                <h3 className="animate-fadeInUp mb-4 text-2xl text-[var(--brand-primary)]">
                  {slide.subtitle}
                </h3>
                <p className="animate-fadeInUp mb-8 text-lg">
                  {slide.description}
                </p>
                <Link
                  href={slide.ctaLink}
                  className="btn-brand animate-fadeInUp transform rounded-lg px-8 py-3 text-lg font-semibold transition-all hover:-translate-y-1 hover:bg-[var(--brand-primary-hover)] hover:shadow-lg"
                >
                  {slide.cta}
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Slider Controls */}
        <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 transform gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-3 w-3 rounded-full transition-all ${
                index === currentSlide
                  ? "bg-[var(--brand-primary)]"
                  : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="bg-white py-20 dark:bg-gray-900">
        <div className="container-app">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
              خدماتنا المتكاملة
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-300">
              نقدم مجموعة شاملة من الخدمات التقنية لمراكز الرعاية الصحية
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.id}
                className="card hover:shadow-soft group p-8 text-center transition-all duration-300"
              >
                <div
                  className={`h-16 w-16 ${service.bgColor} mx-auto mb-6 flex items-center justify-center rounded-full text-3xl transition-transform group-hover:scale-110`}
                >
                  {service.icon}
                </div>
                <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
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
      <section className="bg-[var(--brand-surface)] py-20">
        <div className="container-app">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
              آراء عملائنا
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              ما يقوله عنا أطباؤنا وموظفونا
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="card p-8 text-center">
                <div className="mx-auto mb-6 h-20 w-20 overflow-hidden rounded-full">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={80}
                    height={80}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="mb-4 flex justify-center">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-xl text-yellow-400">
                      ★
                    </span>
                  ))}
                </div>
                <p className="mb-6 italic text-gray-600 dark:text-gray-300">
                  &quot;{testimonial.content}&quot;
                </p>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {testimonial.name}
                </h4>
                <p className="text-sm text-gray-500">{testimonial.position}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="bg-white py-20 dark:bg-gray-900">
        <div className="container-app">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
              معرض الصور
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              استكشف مرافقنا وبيئة العمل المريحة
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {galleryImages.map((image) => (
              <div
                key={image.id}
                className="group relative cursor-pointer overflow-hidden rounded-lg"
                onClick={() => setSelectedImage(image.src)}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={400}
                  height={300}
                  className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="text-lg font-semibold text-white">
                    عرض الصورة
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-[var(--brand-surface)] py-20">
        <div className="container-app">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-4xl font-bold text-gray-900 dark:text-white">
                عن مُعين
              </h2>
              <p className="mb-6 text-lg text-gray-600 dark:text-gray-300">
                منصة مُعين هي الحل التقني الشامل لمراكز الرعاية الصحية المتخصصة.
                نقدم نظاماً متكاملاً يجمع بين إدارة المواعيد، ملفات المرضى،
                المطالبات التأمينية، والشات بوت الذكي.
              </p>
              <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
                هدفنا هو تبسيط العمليات الطبية ورفع كفاءة الخدمات المقدمة للمرضى
                من خلال التقنيات الحديثة والذكاء الاصطناعي.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href={ROUTES.HEALTH.APPOINTMENTS}
                  className="btn-brand rounded-lg px-6 py-3 text-white transition-colors hover:bg-[var(--brand-primary-hover)]"
                >
                  ابدأ الآن
                </Link>
                <Link
                  href="#contact"
                  className="border-brand text-brand hover:bg-brand rounded-lg border px-6 py-3 transition-colors hover:text-white"
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
                className="shadow-soft rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-20 dark:bg-gray-900">
        <div className="container-app">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
              الأسئلة الشائعة
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              إجابات على أكثر الأسئلة شيوعاً
            </p>
          </div>

          <div className="mx-auto max-w-3xl space-y-6">
            {faqs.map((faq) => (
              <div key={faq.id} className="card p-6">
                <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                  {faq.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-[var(--brand-surface)] py-20">
        <div className="container-app">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
              تواصل معنا
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              نحن هنا لمساعدتك في أي وقت
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="card p-8 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
                📱
              </div>
              <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                واتساب
              </h3>
              <p className="mb-4 text-gray-600 dark:text-gray-300">
                تواصل معنا عبر واتساب
              </p>
              <a
                href="https://wa.me/966501234567"
                className="font-semibold text-green-600 hover:text-green-700"
              >
                +966 50 123 4567
              </a>
            </div>

            <div className="card p-8 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-3xl">
                📞
              </div>
              <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                اتصال مباشر
              </h3>
              <p className="mb-4 text-gray-600 dark:text-gray-300">
                اتصل بنا مباشرة
              </p>
              <a
                href="tel:+966501234567"
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                +966 50 123 4567
              </a>
            </div>

            <div className="card p-8 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl">
                📍
              </div>
              <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                الموقع
              </h3>
              <p className="mb-4 text-gray-600 dark:text-gray-300">
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
      <footer className="bg-gray-900 py-16 text-white">
        <div className="container-app">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div>
              <div className="mb-6 flex items-center gap-3">
                <Image
                  src="/logo.jpg"
                  alt="مُعين"
                  width={40}
                  height={40}
                  className="rounded-lg"
                />
                <h3 className="text-2xl font-bold">مُعين</h3>
              </div>
              <p className="mb-6 text-gray-300">
                منصة الرعاية الصحية المتخصصة التي تجمع بين التقنيات الحديثة
                والذكاء الاصطناعي لخدمة المرضى والعاملين في القطاع الصحي.
              </p>
            </div>

            <div>
              <h4 className="mb-6 text-lg font-semibold">الخدمات</h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    href={ROUTES.HEALTH.APPOINTMENTS}
                    className="text-gray-300 transition-colors hover:text-white"
                  >
                    إدارة المواعيد
                  </Link>
                </li>
                <li>
                  <Link
                    href={ROUTES.HEALTH.PATIENTS}
                    className="text-gray-300 transition-colors hover:text-white"
                  >
                    إدارة المرضى
                  </Link>
                </li>
                <li>
                  <Link
                    href={ROUTES.HEALTH.INSURANCE_CLAIMS}
                    className="text-gray-300 transition-colors hover:text-white"
                  >
                    المطالبات التأمينية
                  </Link>
                </li>
                <li>
                  <Link
                    href={ROUTES.CHATBOT.FLOWS}
                    className="text-gray-300 transition-colors hover:text-white"
                  >
                    الشات بوت الذكي
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-6 text-lg font-semibold">روابط سريعة</h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="#about"
                    className="text-gray-300 transition-colors hover:text-white"
                  >
                    عن معين
                  </Link>
                </li>
                <li>
                  <Link
                    href="#gallery"
                    className="text-gray-300 transition-colors hover:text-white"
                  >
                    المعرض
                  </Link>
                </li>
                <li>
                  <Link
                    href="#contact"
                    className="text-gray-300 transition-colors hover:text-white"
                  >
                    اتصل بنا
                  </Link>
                </li>
                <li>
                  <Link
                    href={ROUTES.LOGIN}
                    className="text-gray-300 transition-colors hover:text-white"
                  >
                    تسجيل الدخول
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-6 text-lg font-semibold">تواصل معنا</h4>
              <div className="space-y-3">
                <p className="text-gray-300">📱 +966 50 123 4567</p>
                <p className="text-gray-300">📧 info@moeen.com</p>
                <p className="text-gray-300">
                  📍 الرياض، المملكة العربية السعودية
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400">© 2024 مُعين. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-h-full max-w-4xl">
            <Image
              src={selectedImage}
              alt="معرض الصور"
              width={800}
              height={600}
              className="rounded-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute right-4 top-4 text-2xl text-white hover:text-gray-300"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
