"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import DynamicContactInfo from "@/components/dynamic-contact-info";

// Hero Slider Data
const heroSlides = [
  {
    id: 1,
    title: "مرحباً بك في مُعين",
    subtitle: "منصة الرعاية الصحية المتخصصة",
    description:
      "نقدم خدمات متكاملة للرعاية الصحية مع أحدث التقنيات والذكاء الاصطناعي",
    cta: "اكتشف خدماتنا",
    ctaLink: "#services",
  },
  {
    id: 2,
    title: "إدارة المواعيد الذكية",
    subtitle: "نظام تقويم متطور",
    description:
      "احجز مواعيدك بسهولة مع نظام التقويم الذكي وإدارة الجلسات العلاجية",
    cta: "احجز موعدك",
    ctaLink: "/appointments",
  },
  {
    id: 3,
    title: "شات بوت ذكي",
    subtitle: "مساعدك الصحي الشخصي",
    description:
      "احصل على إجابات فورية لاستفساراتك الصحية مع الذكاء الاصطناعي المتقدم",
    cta: "جرب الشات بوت",
    ctaLink: "/chatbot",
  },
];

// Services Data
const services = [
  {
    id: 1,
    title: "إدارة المواعيد",
    description: "نظام تقويم متطور لإدارة المواعيد والجلسات العلاجية",
    icon: "📅",
    color: "text-[var(--brand-accent)]",
    bgColor: "bg-[var(--brand-accent)]/10",
  },
  {
    id: 2,
    title: "إدارة المرضى",
    description: "ملفات مرضى شاملة مع سجل طبي مفصل",
    icon: "👤",
    color: "text-[var(--brand-success)]",
    bgColor: "bg-[var(--brand-success)]/10",
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
    color: "text-[var(--brand-primary)]",
    bgColor: "bg-[var(--brand-primary)]/10",
  },
  {
    id: 5,
    title: "إدارة الموظفين",
    description: "تتبع ساعات العمل والأداء للموظفين",
    icon: "👨‍⚕️",
    color: "text-[var(--brand-error)]",
    bgColor: "bg-[var(--brand-error)]/10",
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

// Stats Data
const stats = [
  { id: 1, value: "1,247", label: "مريض نشط", icon: "👥" },
  { id: 2, value: "3,421", label: "موعد مكتمل", icon: "📅" },
  { id: 3, value: "98%", label: "معدل الرضا", icon: "⭐" },
  { id: 4, value: "24/7", label: "دعم فني", icon: "🛠️" },
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [centerInfo, setCenterInfo] = useState<any>(null);
  const [stats, setStats] = useState<any[]>([]);

  // Auto-rotate hero slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // جلب البيانات الديناميكية
  useEffect(() => {
    fetchDynamicData();
  }, []);

  const fetchDynamicData = async () => {
    try {
      // جلب معلومات المركز والإحصائيات
      const response = await fetch('/api/dynamic-data?type=all');
      const data = await response.json();

      if (data.center_info) {
        setCenterInfo(data.center_info);
      }

      // إنشاء إحصائيات ديناميكية
      const dynamicStats = [
        { id: 1, value: data.patients?.length || "0", label: "مريض نشط", icon: "👥" },
        { id: 2, value: data.doctors?.length || "0", label: "طبيب متخصص", icon: "👨‍⚕️" },
        { id: 3, value: "98%", label: "معدل الرضا", icon: "⭐" },
        { id: 4, value: "24/7", label: "دعم فني", icon: "🛠️" },
      ];
      setStats(dynamicStats);
    } catch (error) {
      console.error('Error fetching dynamic data:', error);
      // استخدام الإحصائيات الافتراضية في حالة الخطأ
      setStats([
        { id: 1, value: "1,247", label: "مريض نشط", icon: "👥" },
        { id: 2, value: "3,421", label: "موعد مكتمل", icon: "📅" },
        { id: 3, value: "98%", label: "معدل الرضا", icon: "⭐" },
        { id: 4, value: "24/7", label: "دعم فني", icon: "🛠️" },
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-[var(--brand-primary)]/5"></div>
        <div className="absolute top-20 left-20 w-72 h-72 bg-[var(--brand-primary)]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[var(--brand-secondary)]/10 rounded-full blur-3xl"></div>
        
        <div className="container-app relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6">
              {heroSlides[currentSlide].title}
          </h1>
            <h2 className="text-2xl md:text-3xl text-[var(--brand-primary)] mb-6">
              {heroSlides[currentSlide].subtitle}
          </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {heroSlides[currentSlide].description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={heroSlides[currentSlide].ctaLink}
                className="btn btn-brand btn-lg"
              >
                {heroSlides[currentSlide].cta}
              </Link>
              <Link
                href="/features"
                className="btn btn-outline btn-lg"
              >
                تعرف على المزيد
              </Link>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide
                  ? 'bg-[var(--brand-primary)]'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
            </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-[var(--brand-surface)]">
        <div className="container-app">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              خدماتنا المتكاملة
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              نقدم حلولاً شاملة لإدارة المراكز الصحية مع أحدث التقنيات
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="card card-interactive p-8 text-center group"
              >
                <div className={`h-16 w-16 ${service.bgColor} mx-auto mb-6 flex items-center justify-center rounded-full text-3xl transition-transform group-hover:scale-110 ${service.color}`}>
                  {service.icon}
            </div>
                <h3 className="text-xl font-bold text-foreground mb-4">
                  {service.title}
            </h3>
                <p className="text-muted-foreground">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container-app">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {(stats.length > 0 ? stats : [
              { id: 1, value: "1,247", label: "مريض نشط", icon: "👥" },
              { id: 2, value: "3,421", label: "موعد مكتمل", icon: "📅" },
              { id: 3, value: "98%", label: "معدل الرضا", icon: "⭐" },
              { id: 4, value: "24/7", label: "دعم فني", icon: "🛠️" },
            ]).map((stat) => (
              <div key={stat.id} className="text-center">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold text-[var(--brand-primary)] mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)]">
        <div className="container-app text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            ابدأ رحلتك معنا اليوم
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            انضم إلى آلاف الأطباء والمراكز الصحية الذين يثقون في منصة مُعين
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="btn btn-lg bg-white text-[var(--brand-primary)] hover:bg-gray-100"
            >
              إنشاء حساب مجاني
            </Link>
            <Link
              href="/contact"
              className="btn btn-outline btn-lg border-white text-white hover:bg-white hover:text-[var(--brand-primary)]"
            >
              تواصل معنا
            </Link>
          </div>
        </div>
      </section>

      {/* About Moeen Section */}
      <section className="py-20">
        <div className="container-app">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-6">
                عن مُعين
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                مُعين هو مساعدك الذكي في الرعاية الصحية، مصمم خصيصاً لمراكز العلاج الطبيعي 
                والوظيفي في المملكة العربية السعودية. نحن نقدم حلولاً متكاملة لإدارة المرضى 
                والمواعيد والمطالبات التأمينية.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                مع أكثر من 1000 مريض نشط و 98% معدل رضا، نحن نثق في قدرتنا على 
                تحسين جودة الرعاية الصحية التي تقدمها.
              </p>
              <Link
                href="/about"
                className="btn btn-brand btn-lg"
              >
                ابدأ الآن
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-[var(--brand-primary)]/20 to-[var(--brand-secondary)]/20 rounded-2xl flex items-center justify-center">
                <div className="text-8xl">🤖</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section - Dynamic */}
      <section className="py-20 bg-[var(--brand-surface)]">
        <div className="container-app">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              تواصل معنا
            </h2>
            <p className="text-xl text-muted-foreground">
              نحن هنا لمساعدتك في أي وقت
            </p>
          </div>

          {/* استخدام المكون الديناميكي */}
          <DynamicContactInfo />
        </div>
      </section>
    </div>
  );
}