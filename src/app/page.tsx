/**
 * Enhanced Homepage
 * الصفحة الرئيسية المحسّنة
 */

'use client';

import React from 'react';
import GlobalHeader from '@/components/layout/GlobalHeader';
import OriginalHero from '@/components/home/OriginalHero';
import OriginalFeatures from '@/components/home/OriginalFeatures';
import ServicesWithImages from '@/components/home/ServicesWithImages';
import SuccessStories from '@/components/home/SuccessStories';
import InteractiveGallery from '@/components/home/InteractiveGallery';
import VisionMission from '@/components/home/VisionMission';
import BusinessSection from '@/components/home/BusinessSection';
import ContactFormWithMap from '@/components/home/ContactFormWithMap';

export default function HomePage() {
  const handleAppointmentClick = () => {
    // Navigate to appointment booking
    window.location.href = '/register';
  };

  const handleLearnMoreClick = () => {
    // Scroll to about section
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className='min-h-screen bg-[var(--background)]' role='application'>
      {/* Skip Link */}
      <a
        href='#main-content'
        className='sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--brand-primary)] focus:text-white focus:rounded'
        aria-label='التخطي للمحتوى الرئيسي'
      >
        التخطي للمحتوى الرئيسي
      </a>

      {/* Header */}
      <GlobalHeader />

      {/* Main Content */}
      <main id='main-content' role='main'>
        {/* Hero Section - Original Design */}
        <OriginalHero
          onAppointmentClick={handleAppointmentClick}
          onLearnMoreClick={handleLearnMoreClick}
        />

        {/* Features Section - Original 4 Cards */}
        <OriginalFeatures />

        {/* Business Stats Section */}
        <section id='stats' className='py-16 bg-[var(--panel)]'>
          <div className='container-app'>
            <BusinessSection />
          </div>
        </section>

        {/* Services Section */}
        <section id='services' className='py-20'>
          <div className='container-app'>
            <div className='text-center mb-16'>
              <h2 className='text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4'>
                خدماتنا
              </h2>
              <p className='text-xl text-[var(--text-secondary)] max-w-3xl mx-auto'>
                نقدم مجموعة شاملة من الخدمات التأهيلية المتخصصة
              </p>
            </div>
            <ServicesWithImages />
          </div>
        </section>

        {/* Vision & Mission Section */}
        <section id='about' className='py-20'>
          <div className='container-app'>
            <VisionMission />
          </div>
        </section>

        {/* Success Stories Section */}
        <section id='testimonials' className='py-20 bg-[var(--panel)]'>
          <div className='container-app'>
            <SuccessStories />
          </div>
        </section>

        {/* Gallery Section */}
        <InteractiveGallery />

        {/* Contact Section */}
        <section id='contact' className='py-20'>
          <div className='container-app'>
            <ContactFormWithMap />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className='nav mt-20' role='contentinfo'>
        <div className='container-app py-8 text-center text-[var(--text-secondary)]'>
          <p>&copy; 2024 Mu3een. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
}
