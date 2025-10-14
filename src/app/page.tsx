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
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <header style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1
          style={{ color: "#2563eb", fontSize: "2.5rem", margin: "0 0 10px 0" }}
        >
          مركز الهمم
        </h1>
        <p style={{ fontSize: "1.2rem", color: "#666" }}>
          للرعاية الصحية المتخصصة
        </p>
      </header>

      <nav style={{ textAlign: "center", marginBottom: "40px" }}>
        <a
          href="/login"
          style={{
            margin: "0 10px",
            padding: "10px 20px",
            background: "#f3f4f6",
            color: "#374151",
            textDecoration: "none",
            borderRadius: "5px",
            display: "inline-block",
          }}
        >
          تسجيل الدخول
        </a>
        <a
          href="/register"
          style={{
            margin: "0 10px",
            padding: "10px 20px",
            background: "#2563eb",
            color: "white",
            textDecoration: "none",
            borderRadius: "5px",
            display: "inline-block",
          }}
        >
          احجز موعد
        </a>
      </nav>

      <main>
        <section style={{ textAlign: "center", marginBottom: "50px" }}>
          <h2 style={{ fontSize: "2rem", marginBottom: "20px" }}>
            خدماتنا المتخصصة
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "20px",
              marginTop: "30px",
            }}
          >
            <div
              style={{
                padding: "20px",
                background: "#f9fafb",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
              }}
            >
              <h3 style={{ color: "#2563eb", marginBottom: "10px" }}>
                العلاج الطبيعي
              </h3>
              <p style={{ color: "#666" }}>
                برامج علاج طبيعي متخصصة مع متابعة ذكية
              </p>
            </div>
            <div
              style={{
                padding: "20px",
                background: "#f9fafb",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
              }}
            >
              <h3 style={{ color: "#2563eb", marginBottom: "10px" }}>
                العلاج النفسي
              </h3>
              <p style={{ color: "#666" }}>جلسات علاج نفسي مع دعم متخصص</p>
            </div>
            <div
              style={{
                padding: "20px",
                background: "#f9fafb",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
              }}
            >
              <h3 style={{ color: "#2563eb", marginBottom: "10px" }}>
                العلاج الوظيفي
              </h3>
              <p style={{ color: "#666" }}>تحسين المهارات الوظيفية والحياتية</p>
            </div>
          </div>
        </section>

        <section
          style={{
            textAlign: "center",
            background: "#f3f4f6",
            padding: "30px",
            borderRadius: "8px",
          }}
        >
          <h2 style={{ marginBottom: "20px" }}>تواصل معنا</h2>
          <p style={{ fontSize: "1.1rem", margin: "10px 0" }}>
            📞 +966 50 123 4567
          </p>
          <p style={{ fontSize: "1.1rem", margin: "10px 0" }}>
            📍 جدة، المملكة العربية السعودية
          </p>
          <p style={{ fontSize: "1.1rem", margin: "10px 0" }}>
            ✉️ info@alhemam.sa
          </p>
        </section>
      </main>
    </div>
  );
}
