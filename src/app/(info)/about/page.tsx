"use client";

import Image from "next/image";
import Link from "next/link";
import { Users, Target, Heart, Award, Globe, Shield } from "lucide-react";

export default function AboutPage() {

  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "مجتمع متكامل",
      description: "نوفر منصة شاملة تجمع المستفيدين والمتطوعين والمتبرعين في مكان واحد"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "رؤية واضحة",
      description: "نسعى لبناء مجتمع داعم ومتضامن يساعد الجميع على تحقيق أهدافهم"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "قيم إنسانية",
      description: "نؤمن بقوة التضامن والتعاون في بناء مجتمع أفضل للجميع"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "جودة عالية",
      description: "نلتزم بتقديم خدمات عالية الجودة تلبي احتياجات جميع المستخدمين"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "وصول عالمي",
      description: "نعمل على توسيع نطاق خدماتنا لتشمل أكبر عدد ممكن من المحتاجين"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "أمان وخصوصية",
      description: "نضمن أمان وخصوصية جميع البيانات والمعلومات الشخصية"
    }
  ];

  const stats = [
    { number: "10,000+", label: "مستفيد" },
    { number: "5,000+", label: "متطوع" },
    { number: "2,000+", label: "متبرع" },
    { number: "50+", label: "مشروع" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image src="/logo.jpg" alt="Hemam Logo" width={40} height={40} className="rounded" />
              <span className="text-xl font-bold" style={{ color: "var(--brand-primary)" }}>مُعين</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-[var(--brand-primary)]">الرئيسية</Link>
              <Link href="/about" className="text-[var(--brand-primary)] font-medium">من نحن</Link>
              <Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-[var(--brand-primary)]">تواصل</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-secondary)] text-white">
        <div className="max-w-screen-xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">من نحن</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            منصة مُعين - جسر التواصل بين المحتاجين والمتطوعين والمتبرعين
          </p>
          <p className="text-lg opacity-80 max-w-3xl mx-auto">
            نحن نؤمن بقوة التضامن والتعاون في بناء مجتمع أفضل. منصة مُعين تجمع بين المستفيدين والمتطوعين والمتبرعين لتقديم الدعم والمساعدة للجميع.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[var(--brand-primary)] mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              رؤيتنا ورسالتنا
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              نسعى لبناء مجتمع متكامل يجمع بين جميع فئات المجتمع لتحقيق التضامن والتعاون
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="text-[var(--brand-primary)] mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
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
      <section className="py-20 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                مهمتنا
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                نعمل على تسهيل التواصل بين المحتاجين والمتطوعين والمتبرعين من خلال منصة موحدة وآمنة تتيح للجميع المشاركة في بناء مجتمع أفضل.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[var(--brand-primary)] rounded-full mt-2"></div>
                  <p className="text-gray-600 dark:text-gray-400">
                    توفير منصة آمنة وموثوقة للتواصل بين جميع فئات المجتمع
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[var(--brand-primary)] rounded-full mt-2"></div>
                  <p className="text-gray-600 dark:text-gray-400">
                    تسهيل عملية التطوع والتبرع وطلب المساعدة
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[var(--brand-primary)] rounded-full mt-2"></div>
                  <p className="text-gray-600 dark:text-gray-400">
                    بناء مجتمع متضامن ومتعاون يساعد الجميع على تحقيق أهدافهم
                  </p>
                </div>
            </div>
            </div>
            <div className="relative">
              <Image 
                src="/logo.jpg" 
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
      <section className="py-20 bg-[var(--brand-primary)] text-white">
        <div className="max-w-screen-xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            انضم إلينا اليوم
          </h2>
          <p className="text-xl mb-8 opacity-90">
            كن جزءاً من مجتمع مُعين وساعد في بناء عالم أفضل للجميع
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/register"
              className="bg-white text-[var(--brand-primary)] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              انضم الآن
            </Link>
            <Link 
              href="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-[var(--brand-primary)] transition-colors"
            >
              تواصل معنا
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Image src="/logo.jpg" alt="Hemam Logo" width={32} height={32} className="rounded" />
                <span className="text-xl font-bold">مُعين</span>
              </div>
              <p className="text-gray-400">
                منصة شاملة تجمع بين المحتاجين والمتطوعين والمتبرعين لبناء مجتمع أفضل.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">روابط سريعة</h3>
              <div className="space-y-2">
                <Link href="/" className="block text-gray-400 hover:text-white">الرئيسية</Link>
                <Link href="/about" className="block text-gray-400 hover:text-white">من نحن</Link>
                <Link href="/contact" className="block text-gray-400 hover:text-white">تواصل</Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">تواصل معنا</h3>
              <div className="space-y-2 text-gray-400">
                <p>البريد الإلكتروني: info@mu3een.com</p>
                <p>الهاتف: +966 50 123 4567</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 مُعين. جميع الحقوق محفوظة.</p>
        </div>
      </div>
      </footer>
    </div>
  );
}