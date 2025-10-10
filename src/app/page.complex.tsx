import { ROUTES } from '@/constants/routes';
import { Heart, Users, Stethoscope, ShieldCheck, MessageSquare, Calendar, Phone, MapPin, Clock, ArrowRight, CheckCircle, Brain, Activity } from 'lucide-react';
"use client";

// Removed unused Image import to fix type error and reduce bundle size
import Link from "next/link";


import DirectionToggle from "@/components/common/DirectionToggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/70 backdrop-blur dark:border-gray-800 dark:bg-gray-900/70">
        <div className="mx-auto max-w-screen-xl px-4 py-3">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-blue-600">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900 md:text-xl dark:text-white">
                مركز الهمم
              </span>
            </div>
            <div className="hidden items-center gap-6 text-sm md:flex">
              <Link
                href="#services"
                className="text-gray-700 hover:opacity-80 dark:text-gray-300"
              >
                خدماتنا
              </Link>
              <Link
                href="#about"
                className="text-gray-700 hover:opacity-80 dark:text-gray-300"
              >
                من نحن
              </Link>
              <Link
                href="#contact"
                className="text-gray-700 hover:opacity-80 dark:text-gray-300"
              >
                تواصل معنا
              </Link>
              <Link
                href={ROUTES.LOGIN}
                className="text-gray-700 hover:opacity-80 dark:text-gray-300"
              >
                تسجيل الدخول
              </Link>
              <Link
                href={ROUTES.REGISTER}
                className="inline-flex h-10 items-center justify-center rounded-md bg-gradient-to-r from-orange-500 to-blue-600 px-4 font-medium text-white shadow transition hover:opacity-90"
              >
                احجز موعد
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-blue-600/10" />
        <div className="mx-auto max-w-screen-xl px-4 py-16 md:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-gray-900 md:text-6xl dark:text-white">
                مركز الهمم
                <span className="block bg-gradient-to-r from-orange-500 to-blue-600 bg-clip-text text-3xl text-transparent md:text-5xl">
                  للرعاية الصحية
                </span>
              </h1>
              <p className="mt-6 text-xl leading-relaxed text-gray-600 dark:text-gray-300">
                نقدم رعاية صحية شاملة ومتخصصة مع أحدث التقنيات والذكاء الاصطناعي
                لضمان أفضل النتائج العلاجية
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href={ROUTES.REGISTER}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-gradient-to-r from-orange-500 to-blue-600 px-8 font-semibold text-white shadow-lg transition hover:opacity-90"
                >
                  احجز موعد الآن <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="#services"
                  className="inline-flex h-12 items-center justify-center rounded-md border-2 border-gray-300 bg-white px-8 transition hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-900 dark:hover:bg-gray-800"
                >
                  اكتشف خدماتنا
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="flex h-96 w-full items-center justify-center rounded-2xl bg-gradient-to-br from-orange-100 to-blue-100 dark:from-gray-800 dark:to-gray-700">
                <div className="text-center">
                  <Stethoscope className="mx-auto mb-4 h-24 w-24 text-orange-500" />
                  <p className="text-gray-600 dark:text-gray-300">
                    صورة المركز
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="bg-white py-16 dark:bg-gray-900">
        <div className="mx-auto max-w-screen-xl px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl dark:text-white">
              خدماتنا المتخصصة
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              نقدم مجموعة شاملة من الخدمات الصحية مع أحدث التقنيات والذكاء
              الاصطناعي
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <Stethoscope className="h-8 w-8" />,
                title: "العلاج الطبيعي",
                desc: "برامج علاج طبيعي متخصصة مع متابعة ذكية للحالة",
                features: ["تقييم شامل", "برامج مخصصة", "متابعة ذكية"],
              },
              {
                icon: <Brain className="h-8 w-8" />,
                title: "العلاج النفسي",
                desc: "جلسات علاج نفسي مع مساعد ذكي للدعم المستمر",
                features: ["جلسات فردية", "مجموعات دعم", "مساعد ذكي"],
              },
              {
                icon: <Activity className="h-8 w-8" />,
                title: "العلاج الوظيفي",
                desc: "تحسين المهارات الوظيفية مع تقنيات متقدمة",
                features: ["تقييم المهارات", "برامج تطوير", "متابعة النتائج"],
              },
              {
                icon: <Users className="h-8 w-8" />,
                title: "الاستشارات الأسرية",
                desc: "دعم شامل للأسر مع برامج متخصصة",
                features: ["استشارات أسرية", "برامج تدريب", "دعم مستمر"],
              },
              {
                icon: <MessageSquare className="h-8 w-8" />,
                title: "المساعد الذكي",
                desc: "مساعد ذكي متاح 24/7 للدعم والإرشاد",
                features: ["دعم فوري", "إرشادات مخصصة", "متابعة الحالة"],
              },
              {
                icon: <Calendar className="h-8 w-8" />,
                title: "إدارة المواعيد",
                desc: "نظام ذكي لإدارة المواعيد والمتابعة",
                features: ["حجز سهل", "تذكيرات ذكية", "متابعة تلقائية"],
              },
            ].map((service, i) => (
              <div
                key={i}
                className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-blue-600 text-white transition-transform group-hover:scale-110">
                  {service.icon}
                </div>
                <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">
                  {service.title}
                </h3>
                <p className="mb-4 text-gray-600 dark:text-gray-300">
                  {service.desc}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature, j) => (
                    <li
                      key={j}
                      className="flex items-center text-sm text-gray-500 dark:text-gray-400"
                    >
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16 dark:bg-gray-800">
        <div className="mx-auto max-w-screen-xl px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl dark:text-white">
              مميزاتنا التقنية
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              نستخدم أحدث التقنيات والذكاء الاصطناعي لتقديم أفضل الخدمات
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: <ShieldCheck className="h-6 w-6" />,
                title: "أمان متقدم",
                desc: "حماية كاملة للبيانات مع تشفير متقدم",
              },
              {
                icon: <MessageSquare className="h-6 w-6" />,
                title: "دردشة ذكية",
                desc: "مساعد ذكي متاح 24/7 للدعم الفوري",
              },
              {
                icon: <Calendar className="h-6 w-6" />,
                title: "مواعيد ذكية",
                desc: "نظام حجز ذكي مع تذكيرات تلقائية",
              },
              {
                icon: <Activity className="h-6 w-6" />,
                title: "متابعة مستمرة",
                desc: "تتبع التقدم مع تقارير مفصلة",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-blue-600 text-white">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-white py-16 dark:bg-gray-900">
        <div className="mx-auto max-w-screen-xl px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl dark:text-white">
                من نحن
              </h2>
              <p className="mb-6 text-lg text-gray-600 dark:text-gray-300">
                مركز الهمم هو مركز رعاية صحية متخصص يهدف إلى تقديم أفضل الخدمات
                العلاجية باستخدام أحدث التقنيات والذكاء الاصطناعي لضمان أفضل
                النتائج للمرضى.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="mr-3 h-5 w-5 text-green-500" />
                  <span className="text-gray-700 dark:text-gray-300">
                    فريق طبي متخصص وذو خبرة عالية
                  </span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="mr-3 h-5 w-5 text-green-500" />
                  <span className="text-gray-700 dark:text-gray-300">
                    أحدث التقنيات والذكاء الاصطناعي
                  </span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="mr-3 h-5 w-5 text-green-500" />
                  <span className="text-gray-700 dark:text-gray-300">
                    رعاية شاملة ومتابعة مستمرة
                  </span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="flex h-96 w-full items-center justify-center rounded-2xl bg-gradient-to-br from-orange-100 to-blue-100 dark:from-gray-800 dark:to-gray-700">
                <div className="text-center">
                  <Users className="mx-auto mb-4 h-24 w-24 text-blue-500" />
                  <p className="text-gray-600 dark:text-gray-300">
                    فريق المركز
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-gray-50 py-16 dark:bg-gray-800">
        <div className="mx-auto max-w-screen-xl px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl dark:text-white">
              تواصل معنا
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              نحن هنا لمساعدتك في أي وقت
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-blue-600 text-white">
                <Phone className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                اتصل بنا
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                +966 50 123 4567
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-blue-600 text-white">
                <MapPin className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                موقعنا
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                جدة، المملكة العربية السعودية
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-blue-600 text-white">
                <Clock className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                ساعات العمل
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                الأحد - الخميس: 8:00 - 20:00
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-orange-500 to-blue-600 py-16">
        <div className="mx-auto max-w-screen-xl px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            ابدأ رحلتك نحو الشفاء
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-white/90">
            احجز موعدك الآن واستفد من خدماتنا المتخصصة مع أحدث التقنيات
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href={ROUTES.REGISTER}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-white px-8 font-semibold text-gray-900 shadow-lg transition hover:bg-gray-100"
            >
              احجز موعد الآن <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href={ROUTES.LOGIN}
              className="inline-flex h-12 items-center justify-center rounded-md border-2 border-white px-8 text-white transition hover:bg-white/10"
            >
              تسجيل الدخول
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="mx-auto max-w-screen-xl px-4 py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-blue-600">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">مركز الهمم</span>
              </div>
              <p className="text-gray-400">
                مركز رعاية صحية متخصص يهدف إلى تقديم أفضل الخدمات العلاجية
              </p>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold">خدماتنا</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="transition hover:text-white">
                    العلاج الطبيعي
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition hover:text-white">
                    العلاج النفسي
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition hover:text-white">
                    العلاج الوظيفي
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition hover:text-white">
                    الاستشارات الأسرية
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold">روابط سريعة</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href={"/about"} className="transition hover:text-white">
                    من نحن
                  </Link>
                </li>
                <li>
                  <Link
                    href={"/contact"}
                    className="transition hover:text-white"
                  >
                    تواصل معنا
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="transition hover:text-white">
                    الخصوصية
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="transition hover:text-white">
                    الشروط
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold">تواصل معنا</h3>
              <div className="space-y-2 text-gray-400">
                <p>+966 50 123 4567</p>
                <p>info@alhemam.sa</p>
                <p>جدة، المملكة العربية السعودية</p>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 مركز الهمم. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>

      {/* Direction Toggle */}
      <DirectionToggle />
    </div>
  );
}
