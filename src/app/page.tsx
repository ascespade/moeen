"use client";
import { useState, useEffect } from "react";
import { ROUTES } from "@/constants/routes";
import { ThemeSwitch as ThemeSwitcher } from '@/components/ui';
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useT } from "@/components/providers/I18nProvider";
import Image from "next/image";
import Link from "next/link";

// Hero Slider Data - مركز الهمم
const heroSlides = (t: any) => [
  {
    id: 1,
    title: "مركز الهمم",
    subtitle: "طاقات تتجدد، أحلام تتحقق، مستقبل واعد",
    description: "نؤمن بقدراتهم، ونعمل لتمكينهم - مركز رائد في رعاية وتأهيل أصحاب الهمم",
    image: "/hero-1.jpg",
    cta: "احجز موعد تقييم مجاني",
    ctaLink: ROUTES.HEALTH.APPOINTMENTS,
  },
  {
    id: 2,
    title: "برامج تأهيلية متكاملة",
    subtitle: "علاج نطق - علاج وظيفي - تعديل سلوك",
    description: "فريق متخصص وخبرات عالمية لضمان أفضل النتائج",
    image: "/hero-2.jpg",
    cta: "تعرف على خدماتنا",
    ctaLink: "#services",
  },
  {
    id: 3,
    title: "دعم أسري شامل",
    subtitle: "لأن الأسرة شريك أساسي في رحلة التأهيل",
    description: "برامج إرشاد وتدريب أسري مستمرة",
    image: "/hero-3.jpg",
    cta: "تواصل معنا",
    ctaLink: "#contact",
  },
];

// Services Data - الخدمات الفعلية لمركز الهمم
const getServices = (t: any) => [
  {
    id: 1,
    title: "التشخيص والتقييم الشامل",
    description: "تقييمات دقيقة باستخدام مقاييس عالمية (ADOS/ADIR) لاضطرابات التوحد والتأخر النمائي",
    icon: "🔍",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    id: 2,
    title: "علاج النطق والتخاطب",
    description: "جلسات فردية لعلاج التلعثم، اللدغات، تأخر النطق، والتواصل البديل (AAC)",
    icon: "🗣️",
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    id: 3,
    title: "العلاج الوظيفي والتكامل الحسي",
    description: "تحسين المهارات الحركية والاعتماد على الذات في بيئة آمنة ومحفزة",
    icon: "🎯",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    id: 4,
    title: "تعديل السلوك (ABA)",
    description: "خطط سلوكية فردية مبنية على منهج تحليل السلوك التطبيقي",
    icon: "🧩",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
  {
    id: 5,
    title: "الدعم النفسي والإرشاد الأسري",
    description: "توعية وتمكين الأسر لتكون شريكاً فعالاً في رحلة التأهيل",
    icon: "💚",
    color: "text-pink-600",
    bgColor: "bg-pink-100",
  },
  {
    id: 6,
    title: "برامج الرعاية النهارية والدمج",
    description: "إعداد الأطفال للبيئة المدرسية والدمج المجتمعي الفعّال",
    icon: "🏫",
    color: "text-indigo-600",
    bgColor: "bg-indigo-100",
  },
];

// المميزات التنافسية
const features = [
  {
    id: 1,
    icon: "⭐",
    title: "فريق عمل مؤهل",
    description: "أخصائيون مرخصون وذوو خبرة عالية في مختلف التخصصات العلاجية",
  },
  {
    id: 2,
    icon: "📚",
    title: "منهجيات علمية حديثة",
    description: "الاعتماد على ممارسات مبنية على الأدلة (Evidence-Based Practices)",
  },
  {
    id: 3,
    icon: "📋",
    title: "خطط علاج فردية (IEPs)",
    description: "كل طفل يحصل على خطة مخصصة تلبي احتياجاته الدقيقة",
  },
  {
    id: 4,
    title: "مرافق متطورة",
    description: "بيئة آمنة، محفزة، ومجهزة بأحدث التقنيات العلاجية",
    icon: "🏥",
  },
];

export default function HomePage() {
  const { t } = useT();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = heroSlides(t);
  const services = getServices(t);

  // Auto-slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="min-h-screen bg-[var(--brand-surface)]">
      {/* Navigation */}
      <nav className="nav sticky top-0 z-50 shadow-md bg-white dark:bg-gray-900">
        <div className="container-app py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image
                src="/logo.png"
                alt="مركز الهمم"
                width={60}
                height={60}
                className="rounded-lg"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  مركز الهمم
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Al Hemam Center
                </p>
              </div>
            </div>
            <div className="hidden items-center gap-6 md:flex">
              <Link href="#services" className="nav-link">
                الخدمات
              </Link>
              <Link href="#about" className="nav-link">
                عن المركز
              </Link>
              <Link href="#features" className="nav-link">
                مميزاتنا
              </Link>
              <Link href="#contact" className="nav-link">
                تواصل معنا
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <ThemeSwitcher size="sm" />
              <Link href={ROUTES.LOGIN} className="btn btn-outline">
                دخول
              </Link>
              <Link href={ROUTES.REGISTER} className="btn btn-brand">
                تسجيل
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Slider */}
      <section className="relative h-[80vh] overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/60 to-transparent"></div>
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="container-app relative z-20 flex h-full items-center">
              <div className="max-w-3xl text-white">
                <h2 className="animate-fadeInUp mb-4 text-6xl font-bold">
                  {slide.title}
                </h2>
                <h3 className="animate-fadeInUp mb-6 text-3xl font-semibold text-[var(--brand-primary)]">
                  {slide.subtitle}
                </h3>
                <p className="animate-fadeInUp mb-8 text-xl leading-relaxed">
                  {slide.description}
                </p>
                <Link
                  href={slide.ctaLink}
                  className="btn-brand animate-fadeInUp inline-block transform rounded-lg px-10 py-4 text-lg font-semibold transition-all hover:-translate-y-1 hover:shadow-2xl"
                >
                  {slide.cta}
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Slider Controls */}
        <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 transform gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-3 w-3 rounded-full transition-all ${
                index === currentSlide
                  ? "bg-[var(--brand-primary)] w-8"
                  : "bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="bg-white py-20 dark:bg-gray-900">
        <div className="container-app">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-5xl font-bold text-gray-900 dark:text-white">
              خدماتنا المتخصصة
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-300">
              حلول شاملة ومتكاملة تجمع بين أحدث المنهجيات العلاجية العالمية
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.id}
                className="card hover:shadow-2xl group p-8 transition-all duration-300 hover:-translate-y-2"
              >
                <div
                  className={`h-20 w-20 ${service.bgColor} mx-auto mb-6 flex items-center justify-center rounded-2xl text-4xl transition-transform group-hover:scale-110 group-hover:rotate-6`}
                >
                  {service.icon}
                </div>
                <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                  {service.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section - رؤية ورسالة المركز */}
      <section id="about" className="bg-gradient-to-br from-[var(--brand-primary)]/10 to-purple-100/20 dark:from-gray-800 dark:to-gray-900 py-20">
        <div className="container-app">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-5xl font-bold text-gray-900 dark:text-white">
                مركز الهمم
              </h2>
              <h3 className="mb-6 text-2xl font-semibold text-[var(--brand-primary)]">
                "نؤمن بقدراتهم، ونعمل لتمكينهم"
              </h3>
              
              <div className="mb-6 rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg">
                <h4 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">🎯 رؤيتنا</h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  أن نكون المركز الرائد في تقديم خدمات تأهيلية متكاملة تضمن دمجاً مجتمعياً فعالاً لأصحاب الهمم في المملكة.
                </p>
              </div>

              <div className="mb-8 rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg">
                <h4 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">💫 رسالتنا</h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  تقديم أعلى معايير الرعاية والتدريب باستخدام منهجيات علمية متقدمة وفريق متخصص لدعم الأفراد والأسر.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  href={ROUTES.HEALTH.APPOINTMENTS}
                  className="btn-brand rounded-lg px-8 py-4 text-lg font-semibold shadow-lg transition-all hover:shadow-2xl"
                >
                  احجز موعد الآن
                </Link>
                <Link
                  href="#contact"
                  className="rounded-lg border-2 border-[var(--brand-primary)] px-8 py-4 text-lg font-semibold text-[var(--brand-primary)] transition-all hover:bg-[var(--brand-primary)] hover:text-white"
                >
                  تواصل معنا
                </Link>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/about-image.jpg"
                alt="مركز الهمم"
                width={600}
                height={400}
                className="shadow-2xl rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - المميزات التنافسية */}
      <section id="features" className="bg-white dark:bg-gray-900 py-20">
        <div className="container-app">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-5xl font-bold text-gray-900 dark:text-white">
              لماذا تختار مركز الهمم؟
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-300">
              مميزاتنا التي تجعلنا الخيار الأول للأسر
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="card p-8 text-center transition-all hover:shadow-2xl hover:-translate-y-2"
              >
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[var(--brand-primary)] to-purple-600 text-4xl">
                  {feature.icon}
                </div>
                <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 py-20">
        <div className="container-app">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-5xl font-bold text-gray-900 dark:text-white">
              من نخدم؟
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="card p-8 text-center">
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 text-5xl">
                👶
              </div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                الأطفال والشباب
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                من التشخيص المبكر وحتى سن 18 عاماً - التوحد، متلازمة داون، صعوبات التعلم، اضطرابات النطق
              </p>
            </div>

            <div className="card p-8 text-center">
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-5xl">
                👨‍👩‍👧‍👦
              </div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                الأسر والأهالي
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                الباحثون عن الدعم والإرشاد والتدريب العملي للتعامل مع أبنائهم
              </p>
            </div>

            <div className="card p-8 text-center">
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-purple-100 text-5xl">
                🏫
              </div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                المدارس والمؤسسات
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                الشركاء في برامج الدمج وتقديم الاستشارات والتوصيات
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-white dark:bg-gray-900 py-20">
        <div className="container-app">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-5xl font-bold text-gray-900 dark:text-white">
              تواصل معنا
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              نحن هنا لخدمتكم ودعمكم
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="card p-8 text-center hover:shadow-2xl transition-all">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
                📱
              </div>
              <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                واتساب
              </h3>
              <a
                href="https://wa.me/966555381558"
                className="block font-bold text-green-600 hover:text-green-700 text-lg"
                target="_blank"
                rel="noopener noreferrer"
              >
                +966 55 538 1558
              </a>
            </div>

            <div className="card p-8 text-center hover:shadow-2xl transition-all">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-3xl">
                📞
              </div>
              <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                هاتف المركز
              </h3>
              <a
                href="tel:+966126173693"
                className="block font-bold text-[var(--brand-primary)] hover:brightness-95 text-lg"
              >
                +966 12 617 3693
              </a>
            </div>

            <div className="card p-8 text-center hover:shadow-2xl transition-all">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl">
                📧
              </div>
              <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                البريد الإلكتروني
              </h3>
              <a
                href="mailto:info@alhemam.sa"
                className="block font-bold text-red-600 hover:text-red-700 text-lg"
              >
                info@alhemam.sa
              </a>
            </div>

            <div className="card p-8 text-center hover:shadow-2xl transition-all">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-3xl">
                🌐
              </div>
              <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                الموقع الإلكتروني
              </h3>
              <a
                href="http://alhemam.sa"
                className="block font-bold text-purple-600 hover:text-purple-700 text-lg"
                target="_blank"
                rel="noopener noreferrer"
              >
                alhemam.sa
              </a>
            </div>
          </div>

          {/* Location */}
          <div className="mt-12 card p-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div>
                <h3 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <span className="text-4xl">📍</span>
                  موقعنا
                </h3>
                <div className="space-y-4 text-gray-700 dark:text-gray-300">
                  <p className="text-xl font-semibold">جدة، المملكة العربية السعودية</p>
                  <p className="text-lg">شارع الأمير محمد بن عبد العزيز (التحلية)</p>
                  <p className="text-lg">حي الصفا</p>
                  <p className="text-lg">فندق "دبليو إيه" (WA Hotel) - الدور الثامن</p>
                </div>
              </div>

              <div>
                <h3 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <span className="text-4xl">🕐</span>
                  ساعات العمل
                </h3>
                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                  <div className="flex justify-between items-center bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <span className="text-lg font-semibold">الأحد - الخميس</span>
                    <span className="text-lg font-bold text-green-600">7 صباحاً - 7 مساءً</span>
                  </div>
                  <div className="flex justify-between items-center bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                    <span className="text-lg font-semibold">الجمعة والسبت</span>
                    <span className="text-lg font-bold text-red-600">مغلق</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-16 text-white">
        <div className="container-app">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
            <div>
              <div className="mb-6 flex items-center gap-3">
                <Image
                  src="/logo.png"
                  alt="مركز الهمم"
                  width={50}
                  height={50}
                  className="rounded-lg"
                />
                <div>
                  <h3 className="text-2xl font-bold">مركز الهمم</h3>
                  <p className="text-sm text-gray-400">Al Hemam Center</p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed">
                مركز رائد في تأهيل وتمكين أصحاب الهمم بأحدث المنهجيات العلمية
              </p>
            </div>

            <div>
              <h4 className="mb-6 text-xl font-bold">خدماتنا</h4>
              <ul className="space-y-3">
                <li className="text-gray-300 hover:text-white transition-colors">التشخيص والتقييم</li>
                <li className="text-gray-300 hover:text-white transition-colors">علاج النطق</li>
                <li className="text-gray-300 hover:text-white transition-colors">العلاج الوظيفي</li>
                <li className="text-gray-300 hover:text-white transition-colors">تعديل السلوك</li>
                <li className="text-gray-300 hover:text-white transition-colors">الدعم الأسري</li>
              </ul>
            </div>

            <div>
              <h4 className="mb-6 text-xl font-bold">روابط سريعة</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="#services" className="text-gray-300 hover:text-white transition-colors">
                    الخدمات
                  </Link>
                </li>
                <li>
                  <Link href="#about" className="text-gray-300 hover:text-white transition-colors">
                    عن المركز
                  </Link>
                </li>
                <li>
                  <Link href={ROUTES.LOGIN} className="text-gray-300 hover:text-white transition-colors">
                    تسجيل الدخول
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-6 text-xl font-bold">تواصل معنا</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📱</span>
                  <div>
                    <p className="text-sm text-gray-400">واتساب</p>
                    <p className="font-semibold">+966 55 538 1558</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📞</span>
                  <div>
                    <p className="text-sm text-gray-400">هاتف</p>
                    <p className="font-semibold">+966 12 617 3693</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📧</span>
                  <div>
                    <p className="text-sm text-gray-400">بريد</p>
                    <p className="font-semibold">info@alhemam.sa</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-12 pt-8">
            <div className="text-center">
              <p className="text-gray-400 mb-2">
                جميع الحقوق محفوظة © 2024 مركز الهمم
              </p>
              <p className="text-sm text-gray-500">
                نظام معين - مساعدك الرقمي المتخصص
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
