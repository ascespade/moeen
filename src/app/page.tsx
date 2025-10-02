"use client";

import Image from "next/image";
import Link from "next/link";
import { MessageSquare, Users, BarChart3, ShieldCheck, Globe, Zap, ArrowRight } from "lucide-react";
import { useT } from "@/components/providers/I18nProvider";

export default function Home() {
  const { t } = useT();
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navbar */}
      <header className="sticky top-0 z-40 backdrop-blur bg-white/70 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-screen-xl mx-auto px-4 py-3">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image src="/hemam-logo.jpg" alt="Hemam Logo" width={36} height={36} className="rounded" priority unoptimized />
              <span className="text-lg md:text-xl font-bold" style={{ color: "var(--brand-primary)" }}>مُعين</span>
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm">
              <Link href="#features" className="hover:opacity-80" style={{ color: "var(--brand-primary)" }}>المميزات</Link>
              <Link href="#pricing" className="hover:opacity-80 text-gray-700 dark:text-gray-300">الأسعار</Link>
              <Link href="#contact" className="hover:opacity-80 text-gray-700 dark:text-gray-300">تواصل</Link>
              <Link href="/login" className="text-gray-700 dark:text-gray-300 hover:opacity-80">تسجيل الدخول</Link>
              <Link href="/register" className="hs-btn px-4 h-10 inline-flex items-center justify-center rounded-md text-white font-medium shadow" style={{ background: "var(--brand-primary)" }}>ابدأ الآن</Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10" style={{ background: "var(--brand-gradient)" }} />
        <div className="absolute -top-20 -start-20 size-[420px] rounded-full blur-3xl opacity-30 -z-10" style={{ background: "var(--brand-gradient-3)" }} />
        <div className="max-w-screen-xl mx-auto px-4 py-16 md:py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
            {t('home.hero.title','منصة دردشة متعددة القنوات')}
          </h1>
          <p className="mt-4 text-2xl font-semibold" style={{ color: "var(--brand-primary)" }}>{t('home.hero.subtitle','مدعومة بالذكاء الاصطناعي')}</p>
          <p className="mt-4 text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            واجهة احترافية موحّدة لإدارة محادثات واتساب وتليجرام وفيسبوك والقنوات الأخرى بكفاءة عالية.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register" className="px-8 h-12 inline-flex items-center justify-center gap-2 rounded-md text-white font-semibold shadow-sm hover:opacity-95 transition" style={{ background: "var(--brand-primary)" }}>
              {t('home.hero.ctaPrimary','جرب الآن مجانًا')} <ArrowRight className="h-5 w-5" />
            </Link>
            <Link href="/features" className="px-8 h-12 inline-flex items-center justify-center rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
              {t('home.hero.ctaSecondary','اكتشف المميزات')}
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-screen-xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: <MessageSquare className="h-6 w-6" />, title: t('home.features.unifiedChat','دردشة موحدة'), desc: t('home.features.unifiedChat.desc','كل محادثاتك في واجهة واحدة مع بحث وفلاتر ذكية.') },
            { icon: <Users className="h-6 w-6" />, title: t('home.features.customers','إدارة العملاء'), desc: t('home.features.customers.desc','ملفات تعريف غنية وسجل كامل للتفاعل.') },
            { icon: <BarChart3 className="h-6 w-6" />, title: t('home.features.reports','تقارير ذكية'), desc: t('home.features.reports.desc','لوحات تحكم ومؤشرات أداء لحظية.') },
            { icon: <ShieldCheck className="h-6 w-6" />, title: "أمان متقدم", desc: "رؤوس أمان، تشفير، ووضع صارم." },
            { icon: <Globe className="h-6 w-6" />, title: "RTL / LTR", desc: "دعم لغوي كامل مع تبديل فوري." },
            { icon: <Zap className="h-6 w-6" />, title: "أداء فائق", desc: "CSS مُحسّن، صور WebP/AVIF وتحميل كسول." },
          ].map((f, i) => (
            <div key={i} className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-md text-white" style={{ background: "var(--brand-primary)" }}>{f.icon}</div>
              <h3 className="mt-3 text-lg font-semibold text-gray-900 dark:text-white">{f.title}</h3>
              <p className="mt-1 text-gray-600 dark:text-gray-300">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-screen-xl mx-auto px-4 py-16">
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 md:p-12 text-center shadow-sm">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">{t('home.cta.title','ابدأ اليوم')}</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">انطلق بخطوات بسيطة ووسّع قنواتك بثقة.</p>
          <Link href="/register" className="px-8 h-12 inline-flex items-center justify-center rounded-md text-white font-semibold shadow-sm hover:opacity-95 transition" style={{ background: "var(--brand-primary)" }}>{t('home.cta.button','إنشاء حساب')}</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-screen-xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image src="/hemam-logo.jpg" alt="Hemam Logo" width={28} height={28} className="rounded" unoptimized />
            <span className="text-sm font-semibold" style={{ color: "var(--brand-primary)" }}>مُعين</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
            <Link href="/privacy" className="hover:opacity-80" style={{ color: "var(--brand-primary)" }}>الخصوصية</Link>
            <Link href="/terms" className="hover:opacity-80" style={{ color: "var(--brand-primary)" }}>الشروط</Link>
            <Link href="/contact" className="hover:opacity-80" style={{ color: "var(--brand-primary)" }}>اتصل بنا</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
