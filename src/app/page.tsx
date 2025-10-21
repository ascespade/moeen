'use client';
import React from 'react';
import Link from 'next/link';
import DynamicContactInfo from '@/components/dynamic-contact-info';
import DynamicStats from '@/components/dynamic-stats';
import DynamicServices from '@/components/dynamic-services';

export default function HomePage() {
  return (
    <div className='min-h-screen bg-background text-foreground'>
      {/* Hero Section */}
      <section className='relative min-h-screen flex items-center justify-center overflow-hidden'>
        {/* Background Elements */}
        <div className='absolute inset-0 bg-gradient-to-br from-background via-background to-[var(--brand-primary)]/5'></div>
        <div className='absolute top-20 left-20 w-72 h-72 bg-[var(--brand-primary)]/10 rounded-full blur-3xl'></div>
        <div className='absolute bottom-20 right-20 w-96 h-96 bg-[var(--brand-secondary)]/10 rounded-full blur-3xl'></div>

        <div className='container-app relative z-10'>
          <div className='text-center max-w-4xl mx-auto'>
            <h1 className='text-5xl md:text-7xl font-bold text-foreground mb-6'>
              مركز الهمم للرعاية الصحية
            </h1>
            <h2 className='text-2xl md:text-3xl text-[var(--brand-primary)] mb-6'>
              رعاية شاملة لذوي الاحتياجات الخاصة
            </h2>
            <p className='text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto'>
              نقدم خدمات طبية متخصصة وبرامج تأهيلية شاملة لضمان حياة أفضل لذوي
              الاحتياجات الخاصة
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Link href='/appointments' className='btn btn-brand btn-lg'>
                احجز موعدك الآن
              </Link>
              <Link href='/features' className='btn btn-outline btn-lg'>
                تعرف على المزيد
              </Link>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2'>
          <button className='w-3 h-3 rounded-full bg-[var(--brand-primary)]' />
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
