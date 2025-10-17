"use client";
import { useState, useEffect } from "react";
import { ROUTES } from "@/constants/routes";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useT } from "@/components/providers/I18nProvider";
import Image from "next/image";
import Link from "next/link";

// Hero Slider Data
const heroSlides = (t: any) => [
  {
    id: 1,
    title: t('home.hero.title'),
    subtitle: t('home.hero.subtitle'),
    description: t('home.hero.description'),
    image: "/hero-1.jpg",
    cta: t('home.hero.cta'),
    ctaLink: "#services",
  },
  {
    id: 2,
    title: t('home.service.appointments'),
    subtitle: t('dashboard.title'),
    description: t('home.service.appointments.desc'),
    image: "/hero-2.jpg",
    cta: t('appointments.book'),
    ctaLink: ROUTES.HEALTH.APPOINTMENTS,
  },
  {
    id: 3,
    title: t('home.service.chatbot'),
    subtitle: t('chatbot.welcome'),
    description: t('home.service.chatbot.desc'),
    image: "/hero-3.jpg",
    cta: t('chatbot.title'),
    ctaLink: ROUTES.CHATBOT.FLOWS,
  },
];

// Services Data
const getServices = (t: any) => [
  {
    id: 1,
    title: t('home.service.appointments'),
    description: t('home.service.appointments.desc'),
    icon: "📅",
    color: "text-[var(--brand-primary)]",
    bgColor: "bg-blue-50",
  },
  {
    id: 2,
    title: t('home.service.patients'),
    description: t('home.service.patients.desc'),
    icon: "👤",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    id: 3,
    title: t('home.service.insurance'),
    description: t('home.service.insurance.desc'),
    icon: "📋",
    color: "text-orange-600",
    bgColor: "bg-purple-50",
  },
  {
    id: 4,
    title: t('home.service.chatbot'),
    description: t('home.service.chatbot.desc'),
    icon: "🤖",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    id: 5,
    title: t('home.service.staff'),
    description: t('home.service.staff.desc'),
    icon: "👨‍⚕️",
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
  {
    id: 6,
    title: t('home.service.analytics'),
    description: t('home.service.analytics.desc'),
    icon: "📊",
    color: "text-indigo-600",
    bgColor: "bg-orange-50",
  },
];

export default function HomePage() {
  const { t } = useT();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
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
      {/* Navigation - Enhanced Header */}
      <nav className="nav sticky top-0 z-50 shadow-md">
        <div className="container-app py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image
                src="/logo.png"
                alt="مُعين"
                width={60}
                height={60}
                className="rounded-lg"
              />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary-hover)] bg-clip-text text-transparent">
                مُعين
              </h1>
            </div>
            <div className="hidden items-center gap-6 md:flex">
              <Link href="#services" className="nav-link">
                {t('nav.services')}
              </Link>
              <Link href="#about" className="nav-link">
                {t('nav.about')}
              </Link>
              <Link href="#gallery" className="nav-link">
                {t('nav.gallery')}
              </Link>
              <Link href="#contact" className="nav-link">
                {t('nav.contact')}
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <ThemeSwitcher size="sm" />
              <Link href={ROUTES.LOGIN} className="btn btn-outline">
                {t('auth.login')}
              </Link>
              <Link href={ROUTES.REGISTER} className="btn btn-brand">
                {t('auth.register')}
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
          {slides.map((_, index) => (
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
              {t('home.services.title')}
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-300">
              {t('home.services.subtitle')}
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

      {/* About Section */}
      <section id="about" className="bg-[var(--brand-surface)] py-20">
        <div className="container-app">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-4xl font-bold text-gray-900 dark:text-white">
                {t('home.about.title')}
              </h2>
              <p className="mb-6 text-lg text-gray-600 dark:text-gray-300">
                {t('home.about.p1')}
              </p>
              <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
                {t('home.about.p2')}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href={ROUTES.HEALTH.APPOINTMENTS}
                  className="btn-brand rounded-lg px-6 py-3 text-white transition-colors hover:bg-[var(--brand-primary-hover)]"
                >
                  {t('home.about.cta.start')}
                </Link>
                <Link
                  href="#contact"
                  className="border-brand text-brand hover:bg-brand rounded-lg border px-6 py-3 transition-colors hover:text-white"
                >
                  {t('home.about.cta.contact')}
                </Link>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/about-image.jpg"
                alt={t('home.about.title')}
                width={600}
                height={400}
                className="shadow-soft rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-[var(--brand-surface)] py-20">
        <div className="container-app">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
              {t('home.contact.title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {t('home.contact.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="card p-8 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
                📱
              </div>
              <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                {t('home.contact.whatsapp')}
              </h3>
              <p className="mb-4 text-gray-600 dark:text-gray-300">
                {t('home.contact.whatsapp.desc')}
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
                {t('home.contact.call')}
              </h3>
              <p className="mb-4 text-gray-600 dark:text-gray-300">
                {t('home.contact.call.desc')}
              </p>
              <a
                href="tel:+966501234567"
                className="font-semibold text-[var(--brand-primary)] hover:brightness-95"
              >
                +966 50 123 4567
              </a>
            </div>

            <div className="card p-8 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl">
                📍
              </div>
              <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                {t('home.contact.location')}
              </h3>
              <p className="mb-4 text-gray-600 dark:text-gray-300">
                {t('home.contact.location.desc')}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                {t('home.contact.location.address')}
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
                  src="/logo.png"
                  alt="مُعين"
                  width={40}
                  height={40}
                  className="rounded-lg"
                />
                <h3 className="text-2xl font-bold">مُعين</h3>
              </div>
              <p className="mb-6 text-gray-300">
                {t('home.footer.about')}
              </p>
            </div>

            <div>
              <h4 className="mb-6 text-lg font-semibold">{t('home.footer.services')}</h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    href={ROUTES.HEALTH.APPOINTMENTS}
                    className="text-gray-300 transition-colors hover:text-white"
                  >
                    {t('home.service.appointments')}
                  </Link>
                </li>
                <li>
                  <Link
                    href={ROUTES.HEALTH.PATIENTS}
                    className="text-gray-300 transition-colors hover:text-white"
                  >
                    {t('home.service.patients')}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-6 text-lg font-semibold">{t('home.footer.quickLinks')}</h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="#services"
                    className="text-gray-300 transition-colors hover:text-white"
                  >
                    {t('nav.services')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="#about"
                    className="text-gray-300 transition-colors hover:text-white"
                  >
                    {t('nav.about')}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-6 text-lg font-semibold">{t('home.footer.contact')}</h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="ml-2 text-2xl">📱</span>
                  <span className="text-gray-300">+966 50 123 4567</span>
                </div>
                <div className="flex items-center">
                  <span className="ml-2 text-2xl">📧</span>
                  <span className="text-gray-300">info@moeen.com</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-300">© 2024 مُعين. {t('home.footer.copyright')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
