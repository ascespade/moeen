"use client";

import Image from "next/image";
import Link from "next/link";

import { Users, Target, Heart, Award, Globe, Shield } from "lucide-react";

export default function AboutPage() {
  const features = [
  {
    icon: <Users className="h-8 w-8" />,
      title: "مجتمع متكامل",
      description:
        "نوفر منصة شاملة تجمع المستفيدين والمتطوعين والمتبرعين في مكان واحد",
    },
      icon: <Target className="h-8 w-8" />,
      title: "رؤية واضحة",
      description:
        "نسعى لبناء مجتمع داعم ومتضامن يساعد الجميع على تحقيق أهدافهم",
    },
      icon: <Heart className="h-8 w-8" />,
      title: "قيم إنسانية",
      description: "نؤمن بقوة التضامن والتعاون في بناء مجتمع أفضل للجميع",
    },
      icon: <Award className="h-8 w-8" />,
      title: "جودة عالية",
      description:
        "نلتزم بتقديم خدمات عالية الجودة تلبي احتياجات جميع المستخدمين",
    },
      icon: <Globe className="h-8 w-8" />,
      title: "وصول عالمي",
      description:
        "نعمل على توسيع نطاق خدماتنا لتشمل أكبر عدد ممكن من المحتاجين",
    },
      icon: <Shield className="h-8 w-8" />,
      title: "أمان وخصوصية",
      description: "نضمن أمان وخصوصية جميع البيانات والمعلومات الشخصية",
    },
  ];

  const stats = [
    { number: "10,000+", label: "مستفيد" },
    { number: "5,000+", label: "متطوع" },
    { number: "2,000+", label: "متبرع" },
    { number: "50+", label: "مشروع" },
  ];

  return (
    <div className="min-h-screen bg-surface dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white shadow-sm dark:bg-gray-800">
        <div className="mx-auto max-w-screen-xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Hemam Logo"
                width={40}
                height={40}
                className="rounded"
              />
              <span
                className="text-xl font-bold"
                style={{ color: "var(--brand-primary)" }}
              >
                مُعين
              </span>
            </div>
            <nav className="hidden items-center gap-6 md:flex">
              <Link
                href="/"
                className="text-gray-600 hover:text-[var(--brand-primary)] dark:text-gray-400"
              >
                الرئيسية
              </Link>
              <Link
                href="/about"
                className="font-medium text-[var(--brand-primary)]"
              >
                من نحن
              </Link>
              <Link
                href="/contact"
                className="text-gray-600 hover:text-[var(--brand-primary)] dark:text-gray-400"
              >
                تواصل
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-secondary)] py-20 text-white">
        <div className="mx-auto max-w-screen-xl px-4 text-center">
          <h1 className="mb-6 text-4xl font-bold md:text-6xl">من نحن</h1>
          <p className="mb-8 text-xl opacity-90 md:text-2xl">
            منصة مُعين - جسر التواصل بين المحتاجين والمتطوعين والمتبرعين
          </p>
          <p className="mx-auto max-w-3xl text-lg opacity-80">
            نحن نؤمن بقوة التضامن والتعاون في بناء مجتمع أفضل. منصة مُعين تجمع
            بين المستفيدين والمتطوعين والمتبرعين لتقديم الدعم والمساعدة للجميع.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16 dark:bg-gray-800">
        <div className="mx-auto max-w-screen-xl px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="mb-2 text-3xl font-bold text-[var(--brand-primary)] md:text-4xl">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="mx-auto max-w-screen-xl px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl dark:text-white">
              رؤيتنا ورسالتنا
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-gray-600 dark:text-gray-400">
              نسعى لبناء مجتمع متكامل يجمع بين جميع فئات المجتمع لتحقيق التضامن
              والتعاون
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="mb-4 text-[var(--brand-primary)]">
                  {feature.icon}
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-surface py-20 dark:bg-gray-800">
        <div className="mx-auto max-w-screen-xl px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl dark:text-white">
                مهمتنا
              </h2>
              <p className="mb-6 text-lg text-gray-600 dark:text-gray-400">
                نعمل على تسهيل التواصل بين المحتاجين والمتطوعين والمتبرعين من
                خلال منصة موحدة وآمنة تتيح للجميع المشاركة في بناء مجتمع أفضل.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-2 h-2 w-2 rounded-full bg-[var(--brand-primary)]"></div>
                  <p className="text-gray-600 dark:text-gray-400">
                    توفير منصة آمنة وموثوقة للتواصل بين جميع فئات المجتمع
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-2 h-2 w-2 rounded-full bg-[var(--brand-primary)]"></div>
                  <p className="text-gray-600 dark:text-gray-400">
                    تسهيل عملية التطوع والتبرع وطلب المساعدة
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-2 h-2 w-2 rounded-full bg-[var(--brand-primary)]"></div>
                  <p className="text-gray-600 dark:text-gray-400">
                    بناء مجتمع متضامن ومتعاون يساعد الجميع على تحقيق أهدافهم
                  </p>
                </div>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/logo.png"
                alt="Hemam Logo"
                width={400}
                height={400}
                className="rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[var(--brand-primary)] py-20 text-white">
        <div className="mx-auto max-w-screen-xl px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">
            انضم إلينا اليوم
          </h2>
          <p className="mb-8 text-xl opacity-90">
            كن جزءاً من مجتمع مُعين وساعد في بناء عالم أفضل للجميع
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="rounded-lg bg-white px-8 py-3 font-semibold text-[var(--brand-primary)] transition-colors hover:bg-surface"
            >
              انضم الآن
            </Link>
            <Link
              href="/contact"
              className="rounded-lg border-2 border-white px-8 py-3 font-semibold text-white transition-colors hover:bg-white hover:text-[var(--brand-primary)]"
            >
              تواصل معنا
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 text-white">
        <div className="mx-auto max-w-screen-xl px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <Image
                  src="/logo.png"
                  alt="Hemam Logo"
                  width={32}
                  height={32}
                  className="rounded"
                />
                <span className="text-xl font-bold">مُعين</span>
              </div>
              <p className="text-gray-400">
                منصة شاملة تجمع بين المحتاجين والمتطوعين والمتبرعين لبناء مجتمع
                أفضل.
              </p>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">روابط سريعة</h3>
              <div className="space-y-2">
                <Link href="/" className="block text-gray-400 hover:text-white">
                  الرئيسية
                </Link>
                <Link
                  href="/about"
                  className="block text-gray-400 hover:text-white"
                >
                  من نحن
                </Link>
                <Link
                  href="/contact"
                  className="block text-gray-400 hover:text-white"
                >
                  تواصل
                </Link>
              </div>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">تواصل معنا</h3>
              <div className="space-y-2 text-gray-400">
                <p>البريد الإلكتروني: info@mu3een.com</p>
                <p>الهاتف: +966 50 123 4567</p>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 مُعين. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );