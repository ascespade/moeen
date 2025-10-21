'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import DynamicContactInfo from '@/components/dynamic-contact-info';
import DynamicStats from '@/components/dynamic-stats';
import DynamicServices from '@/components/dynamic-services';

// Hero slides data
const heroSlides = [
  {
    title: 'مرحباً بك في مُعين',
    subtitle: 'مساعدك الذكي في الرعاية الصحية',
    description: 'نقدم حلولاً متكاملة لإدارة المراكز الصحية مع أحدث التقنيات والذكاء الاصطناعي',
    cta: 'ابدأ الآن',
    ctaLink: '/register'
  },
  {
    title: 'إدارة المرضى الذكية',
    subtitle: 'نظام متطور لإدارة الملفات الطبية',
    description: 'إدارة شاملة لملفات المرضى والمواعيد والمطالبات التأمينية بسهولة وأمان',
    cta: 'اكتشف المزيد',
    ctaLink: '/features'
  },
  {
    title: 'تقارير ذكية',
    subtitle: 'تحليلات متقدمة لأداء المركز',
    description: 'احصل على تقارير مفصلة وإحصائيات دقيقة لتحسين جودة الخدمات المقدمة',
    cta: 'عرض التقارير',
    ctaLink: '/reports'
  }
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)]">
      {/* Header */}
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-bg-secondary)] via-white to-[var(--color-primary-500)]/5"></div>
        <div className="absolute top-20 left-20 w-72 h-72 bg-[var(--color-primary-500)]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[var(--color-secondary-500)]/10 rounded-full blur-3xl"></div>

        <div className="container-app relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-[var(--color-text-primary)] mb-6">
              {heroSlides[currentSlide]?.title || 'مرحباً بك في مُعين'}
            </h1>
            <h2 className="text-2xl md:text-3xl text-[var(--color-primary-500)] mb-6">
              {heroSlides[currentSlide]?.subtitle || 'مساعدك الذكي في الرعاية الصحية'}
            </h2>
            <p className="text-lg md:text-xl text-[var(--color-text-secondary)] mb-8 max-w-2xl mx-auto">
              {heroSlides[currentSlide]?.description || 'نقدم حلولاً متكاملة لإدارة المراكز الصحية مع أحدث التقنيات والذكاء الاصطناعي'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={heroSlides[currentSlide]?.ctaLink || '/register'}
                className="inline-flex items-center justify-center px-6 py-3 text-lg font-semibold text-white bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)] rounded-lg transition-colors duration-200"
              >
                {heroSlides[currentSlide]?.cta || 'ابدأ الآن'}
              </Link>
              <Link 
                href="/features" 
                className="inline-flex items-center justify-center px-6 py-3 text-lg font-semibold text-[var(--color-primary-500)] border-2 border-[var(--color-primary-500)] hover:bg-[var(--color-primary-500)] hover:text-white rounded-lg transition-colors duration-200"
              >
                تعرف على المزيد
              </Link>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2'>
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
      <section id='services' className='py-20 bg-[var(--brand-surface)]'>
        <div className='container-app'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl font-bold text-foreground mb-4'>
              خدماتنا المتكاملة
            </h2>
            <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
              نقدم حلولاً شاملة لإدارة المراكز الصحية مع أحدث التقنيات
            </p>
          </div>

          <DynamicServices />
        </div>
      </section>

      {/* Stats Section */}
      <section className='py-20'>
        <div className='container-app'>
          <DynamicStats />
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-20 bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)]'>
        <div className='container-app text-center'>
          <h2 className='text-4xl font-bold text-white mb-4'>
            ابدأ رحلتك معنا اليوم
          </h2>
          <p className='text-xl text-white/90 mb-8 max-w-2xl mx-auto'>
            انضم إلى آلاف الأطباء والمراكز الصحية الذين يثقون في منصة مُعين
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link
              href='/register'
              className='btn btn-lg bg-white text-[var(--brand-primary)] hover:bg-gray-100'
            >
              إنشاء حساب مجاني
            </Link>
            <Link
              href='/contact'
              className='btn btn-outline btn-lg border-white text-white hover:bg-white hover:text-[var(--brand-primary)]'
            >
              تواصل معنا
            </Link>
          </div>
        </div>
      </section>

      {/* About Moeen Section */}
      <section className='py-20'>
        <div className='container-app'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
            <div>
              <h2 className='text-4xl font-bold text-foreground mb-6'>
                عن مُعين
              </h2>
              <p className='text-lg text-muted-foreground mb-6'>
                مُعين هو مساعدك الذكي في الرعاية الصحية، مصمم خصيصاً لمراكز
                العلاج الطبيعي والوظيفي في المملكة العربية السعودية. نحن نقدم
                حلولاً متكاملة لإدارة المرضى والمواعيد والمطالبات التأمينية.
              </p>
              <p className='text-lg text-muted-foreground mb-8'>
                مع أكثر من 1000 مريض نشط و 98% معدل رضا، نحن نثق في قدرتنا على
                تحسين جودة الرعاية الصحية التي تقدمها.
              </p>
              <Link href='/about' className='btn btn-brand btn-lg'>
                ابدأ الآن
              </Link>
            </div>
            <div className='relative'>
              <div className='aspect-square bg-gradient-to-br from-[var(--brand-primary)]/20 to-[var(--brand-secondary)]/20 rounded-2xl flex items-center justify-center'>
                <div className='text-8xl'>🤖</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section - Dynamic */}
      <section className='py-20 bg-[var(--brand-surface)]'>
        <div className='container-app'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl font-bold text-foreground mb-4'>
              تواصل معنا
            </h2>
            <p className='text-xl text-muted-foreground'>
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
