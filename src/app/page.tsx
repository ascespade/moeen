"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      id: 1,
      title: "مرحباً بك في مُعين",
      subtitle: "منصة الرعاية الصحية المتخصصة",
      description: "نقدم خدمات متكاملة للرعاية الصحية مع أحدث التقنيات والذكاء الاصطناعي",
      image: "/hero-1.jpg",
      cta: "اكتشف خدماتنا"
    },
    {
      id: 2,
      title: "إدارة المواعيد الذكية",
      subtitle: "نظام تقويم متطور",
      description: "احجز مواعيدك بسهولة مع نظام التقويم الذكي وإدارة الجلسات العلاجية",
      image: "/hero-2.jpg",
      cta: "احجز موعدك"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--background)' }}>
      {/* Navigation */}
      <nav style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 50, 
        backgroundColor: 'white', 
        borderBottom: '1px solid #e5e7eb',
        padding: '1rem 0'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Image
                src="/logo.jpg"
                alt="مُعين"
                width={50}
                height={50}
                style={{ borderRadius: '0.5rem' }}
              />
              <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>مُعين</h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link href="/login" className="btn btn-secondary">
                تسجيل الدخول
              </Link>
              <Link href="/register" className="btn btn-primary">
                إنشاء حساب
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ 
        height: '80vh', 
        position: 'relative', 
        overflow: 'hidden',
        backgroundImage: `url(${heroSlides[currentSlide].image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          background: 'linear-gradient(to right, rgba(0,0,0,0.5), transparent)',
          zIndex: 10
        }}></div>
        <div style={{ 
          position: 'relative', 
          zIndex: 20, 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '0 1rem',
          height: '100%',
          display: 'flex',
          alignItems: 'center'
        }}>
          <div style={{ maxWidth: '32rem', color: 'white' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              {heroSlides[currentSlide].title}
            </h2>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>
              {heroSlides[currentSlide].subtitle}
            </h3>
            <p style={{ fontSize: '1.125rem', marginBottom: '2rem' }}>
              {heroSlides[currentSlide].description}
            </p>
            <button className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1.125rem' }}>
              {heroSlides[currentSlide].cta}
            </button>
          </div>
        </div>
        
        {/* Slider Controls */}
        <div style={{ 
          position: 'absolute', 
          bottom: '2rem', 
          left: '50%', 
          transform: 'translateX(-50%)',
          zIndex: 20,
          display: 'flex',
          gap: '0.5rem'
        }}>
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              style={{
                width: '0.75rem',
                height: '0.75rem',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: index === currentSlide ? 'var(--primary)' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer'
              }}
            />
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section style={{ padding: '5rem 0', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--foreground)' }}>
              خدماتنا المتكاملة
            </h2>
            <p style={{ fontSize: '1.25rem', color: 'var(--secondary)', maxWidth: '48rem', margin: '0 auto' }}>
              نقدم مجموعة شاملة من الخدمات التقنية لمراكز الرعاية الصحية
            </p>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '2rem' 
          }}>
            {[
              { title: "إدارة المواعيد", description: "نظام تقويم متطور لإدارة المواعيد والجلسات العلاجية", icon: "📅" },
              { title: "إدارة المرضى", description: "ملفات مرضى شاملة مع سجل طبي مفصل", icon: "👤" },
              { title: "المطالبات التأمينية", description: "إدارة وتتبع المطالبات التأمينية بسهولة", icon: "📋" },
              { title: "الشات بوت الذكي", description: "مساعد ذكي للرد على استفسارات المرضى", icon: "🤖" }
            ].map((service, index) => (
              <div key={index} className="card" style={{ textAlign: 'center' }}>
                <div style={{ 
                  width: '4rem', 
                  height: '4rem', 
                  backgroundColor: '#f3f4f6', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '2rem', 
                  margin: '0 auto 1.5rem' 
                }}>
                  {service.icon}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--foreground)' }}>
                  {service.title}
                </h3>
                <p style={{ color: 'var(--secondary)' }}>
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#1f2937', color: 'white', padding: '4rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <Image
                src="/logo.jpg"
                alt="مُعين"
                width={40}
                height={40}
                style={{ borderRadius: '0.5rem' }}
              />
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>مُعين</h3>
            </div>
            <p style={{ color: '#d1d5db', marginBottom: '2rem' }}>
              منصة الرعاية الصحية المتخصصة التي تجمع بين التقنيات الحديثة والذكاء الاصطناعي
            </p>
            <div style={{ borderTop: '1px solid #374151', paddingTop: '2rem' }}>
              <p style={{ color: '#9ca3af' }}>
                © 2024 مُعين. جميع الحقوق محفوظة.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}