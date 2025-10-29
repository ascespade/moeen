'use client';
import MoeenChatbot from '@/components/chatbot/MoeenChatbot';
import DynamicContactInfo from '@/components/dynamic-contact-info';
import BusinessSection from '@/components/home/BusinessSection';
import ContactFormWithMap from '@/components/home/ContactFormWithMap';
import ModernHero from '@/components/home/ModernHero';
import ServicesWithImages from '@/components/home/ServicesWithImages';
import Footer from '@/components/layout/Footer';
import GlobalHeader from '@/components/layout/GlobalHeader';
import { useLocalizedNumber } from '@/hooks/useLocalizedNumber';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  MessageCircle,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { lazy, memo, Suspense, useCallback } from 'react';

// Lazy load heavy components for better performance
const InteractiveGallery = lazy(() => import('@/components/home/InteractiveGallery'));
const InteractiveStats = lazy(() => import('@/components/home/InteractiveStats'));
const SuccessStories = lazy(() => import('@/components/home/SuccessStories'));
const VideoStorySection = lazy(() => import('@/components/home/VideoStorySection'));
const VisionMission = lazy(() => import('@/components/home/VisionMission'));

const HomePage = memo(function HomePage() {
  const [isReady, setIsReady] = React.useState(false);
  const router = useRouter();
  const localizedNumber = useLocalizedNumber();

  React.useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 200);
    return () => clearTimeout(timer);
  }, []);

  // Performance: Preload critical resources
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Preload hero images
    const heroImages = ['/hero-1.jpg', '/hero-2.jpg', '/hero-3.jpg'];
    heroImages.forEach(img => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = img;
      document.head.appendChild(link);
    });

    // Preload about image
    const aboutLink = document.createElement('link');
    aboutLink.rel = 'preload';
    aboutLink.as = 'image';
    aboutLink.href = '/about-image.jpg';
    document.head.appendChild(aboutLink);
  }, []);

  const handleNavigation = useCallback(
    (path: string) => {
      router.push(path);
    },
    [router]
  );

  const handleAppointmentBooking = useCallback(() => {
    // Try to find chatbot button and open it
    const chatbotButton = document.querySelector('[aria-label*="مساعد"]') as HTMLButtonElement || 
                         document.querySelector('button[class*="chatbot"]') as HTMLButtonElement ||
                         document.querySelector('[data-chatbot-trigger]') as HTMLButtonElement;
    
    if (chatbotButton) {
      chatbotButton.click();
      // Wait for chatbot to open, then trigger appointment booking
      setTimeout(() => {
        // Try to find and click the quick action button for booking
        const quickActionButton = Array.from(document.querySelectorAll('button')).find(
          btn => btn.textContent?.includes('احجز موعد') || btn.textContent?.includes('حجز موعد')
        );
        
        if (quickActionButton) {
          quickActionButton.click();
        } else {
          // Fallback: try to send message directly
          const input = document.querySelector('input[placeholder*="رسال"], textarea[placeholder*="رسال"]') as HTMLInputElement | HTMLTextAreaElement;
          if (input) {
            input.focus();
            input.value = 'أريد حجز موعد';
            input.dispatchEvent(new Event('input', { bubbles: true }));
            // Try to find send button
            setTimeout(() => {
              const sendButton = document.querySelector('button[type="submit"]') as HTMLButtonElement ||
                               document.querySelector('[aria-label*="إرسال"]') as HTMLButtonElement;
              if (sendButton) {
                sendButton.click();
              }
            }, 300);
          }
        }
      }, 800);
    } else {
      // If chatbot button not found, navigate to booking page directly
      router.push('/health/sessions/book');
    }
  }, [router]);

  if (!isReady) {
    return (
      <div className='min-h-screen bg-[var(--background)] flex items-center justify-center relative overflow-hidden'>

        <div className='relative z-10 text-center'>
          {/* Rotating Circles Around Logo */}
          <div className='relative w-64 h-64 mx-auto mb-8'>
            {/* Logo in Center - Circular */}
            <div className='absolute inset-0 flex items-center justify-center z-20'>
              <div className='relative w-36 h-36 rounded-full bg-white shadow-2xl flex items-center justify-center overflow-hidden border-4 border-[var(--brand-primary)]/30 ring-4 ring-[var(--brand-primary)]/10'>
                <Image
                  src='/logo.png'
                  alt='مركز الهمم'
                  width={112}
                  height={112}
                  className='object-contain p-4'
                  priority
                />
              </div>
            </div>

            {/* Outer Rotating Circle 1 - Fast (Inner) */}
            <div className='absolute inset-4 border-3 border-transparent border-t-[var(--brand-primary)] rounded-full animate-spin' style={{ animationDuration: '1.2s' }} />

            {/* Outer Rotating Circle 2 - Medium */}
            <div className='absolute inset-0 border-4 border-transparent border-r-[var(--brand-primary)]/90 rounded-full animate-spin' style={{ animationDuration: '2s', animationDirection: 'reverse' }} />

            {/* Outer Rotating Circle 3 - Slow (Outer) */}
            <div className='absolute inset-[-16px] border-3 border-transparent border-b-[var(--brand-primary)]/70 rounded-full animate-spin' style={{ animationDuration: '3s' }} />

            {/* Orbiting Dots - Top */}
            <div 
              className='absolute w-5 h-5 bg-[var(--brand-primary)] rounded-full shadow-xl z-10'
              style={{
                top: '0%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                animation: 'loadingOrbit 2.5s linear infinite',
              }}
            />
            {/* Orbiting Dot - Bottom */}
            <div 
              className='absolute w-4 h-4 bg-[var(--brand-primary)]/90 rounded-full shadow-lg z-10'
              style={{
                bottom: '0%',
                left: '50%',
                transform: 'translate(-50%, 50%)',
                animation: 'loadingOrbit 3.2s linear infinite reverse',
              }}
            />
            {/* Orbiting Dot - Right */}
            <div 
              className='absolute w-4 h-4 bg-[var(--brand-primary)]/85 rounded-full shadow-lg z-10'
              style={{
                right: '0%',
                top: '50%',
                transform: 'translate(50%, -50%)',
                animation: 'loadingOrbit 2.8s linear infinite',
              }}
            />
            {/* Orbiting Dot - Left */}
            <div 
              className='absolute w-4 h-4 bg-[var(--brand-primary)]/95 rounded-full shadow-lg z-10'
              style={{
                left: '0%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                animation: 'loadingOrbit 3s linear infinite reverse',
              }}
            />
          </div>

          {/* Loading Text */}
          <div className='space-y-4'>
            <p className='text-2xl font-bold text-[var(--brand-primary)] animate-pulse'>
              جاري التحميل...
            </p>
            <div className='flex justify-center gap-2'>
              <div className='w-3 h-3 bg-[var(--brand-primary)] rounded-full animate-bounce' style={{ animationDelay: '0s', animationDuration: '1s' }} />
              <div className='w-3 h-3 bg-[var(--brand-primary)] rounded-full animate-bounce' style={{ animationDelay: '0.2s', animationDuration: '1s' }} />
              <div className='w-3 h-3 bg-[var(--brand-primary)] rounded-full animate-bounce' style={{ animationDelay: '0.4s', animationDuration: '1s' }} />
            </div>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-background text-foreground font-sans antialiased'>
      {/* Header */}
      <GlobalHeader />

      {/* Modern Hero Section with Images */}
      <ModernHero
        onAppointmentClick={handleAppointmentBooking}
        onLearnMoreClick={() => handleNavigation('#stories')}
      />

      {/* Services Section with Real Images - Enhanced */}
      <section id='services' className='py-20 bg-[var(--background)] relative overflow-hidden'>
        {/* Decorative gradient background */}
        <div className='absolute inset-0 bg-gradient-to-br from-[var(--brand-primary)]/5 via-transparent to-[var(--brand-secondary)]/5 pointer-events-none' />
        
        <div className='container-app relative z-10'>
          <div className='text-center mb-16'>
            <Badge variant='primary' className='mb-4 animate-fadeIn'>
              خدماتنا المتخصصة
            </Badge>
            <h2 className='text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4 animate-fadeInUp' style={{ animationDelay: '0.1s' }}>
              خدماتنا المتكاملة
            </h2>
            <p className='text-xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed animate-fadeInUp' style={{ animationDelay: '0.2s' }}>
              في جدة - حي الصفا، نقدم مجموعة شاملة من خدمات التأهيل المتخصصة لذوي
              الاحتياجات الخاصة باستخدام أحدث التقنيات والأساليب العلمية الحديثة
            </p>
          </div>
          <ServicesWithImages />
        </div>
      </section>

      {/* Interactive Stats Section */}
      <Suspense fallback={
        <section className='py-20 bg-[var(--background)]'>
          <div className='container-app'>
            <div className='text-center'>
              <div className='h-32 bg-[var(--brand-surface)] rounded-lg animate-pulse' />
            </div>
          </div>
        </section>
      }>
      <InteractiveStats />
      </Suspense>

      {/* Video Story Section */}
      <Suspense fallback={
        <section className='py-20 bg-[var(--background)]'>
          <div className='container-app'>
            <div className='h-64 bg-[var(--brand-surface)] rounded-lg animate-pulse' />
          </div>
        </section>
      }>
      <VideoStorySection />
      </Suspense>

      {/* Vision & Mission Section */}
      <Suspense fallback={
        <section className='py-20 bg-[var(--background)]'>
          <div className='container-app'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              <div className='h-64 bg-[var(--brand-surface)] rounded-lg animate-pulse' />
              <div className='h-64 bg-[var(--brand-surface)] rounded-lg animate-pulse' />
            </div>
          </div>
        </section>
      }>
      <VisionMission />
      </Suspense>

      {/* Business Section */}
      <BusinessSection />

      {/* Success Stories with Images */}
      <Suspense fallback={
        <section className='py-20 bg-[var(--background)]'>
          <div className='container-app'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              {[1, 2, 3].map(i => (
                <div key={i} className='h-64 bg-[var(--brand-surface)] rounded-lg animate-pulse' />
              ))}
            </div>
          </div>
        </section>
      }>
      <SuccessStories />
      </Suspense>

      {/* Interactive Gallery */}
      <Suspense fallback={
        <section className='py-20 bg-[var(--background)]'>
          <div className='container-app'>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              {[1, 2, 3, 4].map(i => (
                <div key={i} className='aspect-square bg-[var(--brand-surface)] rounded-lg animate-pulse' />
              ))}
            </div>
          </div>
        </section>
      }>
      <InteractiveGallery />
      </Suspense>

      {/* CTA Section - Enhanced with Orange Gradient */}
      <section className='relative py-24 overflow-hidden bg-gradient-to-br from-[var(--brand-primary)] via-[var(--brand-primary-hover)] to-[var(--brand-secondary)]'>
        {/* Animated background pattern */}
        <div className='absolute inset-0 opacity-10 pointer-events-none'>
          <div className='absolute inset-0' style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }} />
        </div>
        
        <div className='container-app relative z-10 text-center'>
          <h2 className='text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-lg animate-fadeInUp'>
            ابدأ رحلتك معنا اليوم
          </h2>
          <p className='text-xl md:text-2xl text-white/95 mb-12 max-w-3xl mx-auto leading-relaxed animate-fadeInUp' style={{ animationDelay: '0.1s' }}>
            انضم إلى آلاف العائلات التي تثق في مركز الهمم للرعاية الصحية
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Button
              asChild
              size='lg'
              className='bg-white text-[var(--brand-primary)] hover:bg-gray-50 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl font-semibold px-8 py-6 text-lg animate-fadeInUp'
              style={{ animationDelay: '0.2s' }}
            >
              <Link href='/register' data-testid='create-account-button'>
                <Users className='w-5 h-5 ml-2' />
                إنشاء حساب مجاني
              </Link>
            </Button>
            <Button
              asChild
              variant='outline'
              size='lg'
              className='border-2 border-white text-white hover:bg-white hover:text-[var(--brand-primary)] hover:scale-105 transition-all duration-300 font-semibold px-8 py-6 text-lg backdrop-blur-sm bg-white/10 animate-fadeInUp'
              style={{ animationDelay: '0.3s' }}
            >
              <Link href='#contact' data-testid='contact-us-button'>
                <MessageCircle className='w-5 h-5 ml-2' />
                تواصل معنا
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Enhanced About Section */}
      <section id='about' className='py-20 bg-[var(--background)] relative'>
        {/* Subtle background decoration */}
        <div className='absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-[var(--brand-primary)]/5 to-transparent pointer-events-none' />

        <div className='container-app relative z-10'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>
            {/* Image Side */}
            <div className='relative order-2 lg:order-1'>
              <div className='relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl'>
                <Image
                  src='/about-image.jpg'
                  alt='مركز الهمم'
                  fill
                  className='object-cover'
                  sizes='(max-width: 1024px) 100vw, 50vw'
                  priority
                />
              </div>
              
              {/* Floating Achievement Cards */}
              <div className='absolute -top-8 -right-8 bg-[var(--panel)] rounded-2xl shadow-lg p-6 z-10 transform hover:scale-105 transition-transform border border-[var(--brand-border)]'>
                <div className='flex items-center gap-4'>
                  <div className='w-16 h-16 rounded-lg flex items-center justify-center' style={{ backgroundColor: 'var(--brand-success)' }}>
                    <Award className='w-8 h-8 text-white' />
                  </div>
                  <div>
                    <div className='text-2xl font-bold text-[var(--text-primary)]'>
                      {localizedNumber('98%')}
                    </div>
                    <div className='text-sm text-[var(--text-secondary)]'>معدل الرضا</div>
                  </div>
                </div>
              </div>

              <div className='absolute -bottom-8 -left-8 bg-[var(--panel)] rounded-2xl shadow-lg p-6 z-10 transform hover:scale-105 transition-transform border border-[var(--brand-border)]'>
                <div className='flex items-center gap-4'>
                  <div className='w-16 h-16 rounded-lg flex items-center justify-center' style={{ backgroundColor: 'var(--brand-primary)' }}>
                    <Users className='w-8 h-8 text-white' />
                  </div>
                  <div>
                    <div className='text-2xl font-bold text-[var(--text-primary)]'>
                      {localizedNumber('1,247+')}
                    </div>
                    <div className='text-sm text-[var(--text-secondary)]'>مريض نشط</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Side */}
            <div className='space-y-6 order-1 lg:order-2'>
              <Badge variant='primary' className='mb-4'>
                عن المركز
              </Badge>
              
              <h2 className='text-4xl md:text-5xl font-bold text-[var(--text-primary)] leading-tight'>
                مركز الهمم
                <span className='block text-[var(--brand-primary)] mt-2'>
                  لرعاية ذوي الاحتياجات الخاصة
                </span>
              </h2>
              
              <p className='text-lg text-[var(--text-secondary)] leading-relaxed'>
                يقع مركز الهمم في جدة - حي الصفا، شارع الأمير محمد بن عبدالعزيز (التحلية).
                نقدم خدمات تأهيلية متخصصة وشاملة لذوي الاحتياجات الخاصة تشمل جلسات
                التخاطب وعلاج التأتأة، التأهيل السمعي، تعديل السلوك، العلاج الوظيفي،
                التكامل الحسي، وبرامج التدخل المبكر.
              </p>
              
              <p className='text-lg text-[var(--text-secondary)] leading-relaxed'>
                نسعى لتحقيق رؤيتنا في تحسين جودة الحياة وتعزيز الاستقلالية لذوي
                الاحتياجات الخاصة من خلال فريق طبي متخصص ومؤهل وبرامج تأهيلية مخصصة
                لكل حالة على حدة.
              </p>

              {/* Key Features */}
              <div className='grid grid-cols-2 gap-4 pt-4'>
                {[
                  { icon: CheckCircle2, text: 'فريق طبي متخصص' },
                  { icon: CheckCircle2, text: 'أحدث التقنيات' },
                  { icon: CheckCircle2, text: 'برامج مخصصة' },
                  { icon: CheckCircle2, text: 'دعم شامل' },
                ].map((feature, index) => (
                  <div key={index} className='flex items-center gap-3'>
                    <feature.icon className='w-5 h-5 text-[var(--brand-success)] flex-shrink-0' />
                    <span className='text-[var(--text-secondary)] font-medium'>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              <Button asChild size='lg' className='btn-default mt-6 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl'>
                <Link href='/about' data-testid='learn-about-button'>
                  تعرف على المزيد
                  <ArrowRight className='w-5 h-5 mr-2' />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section - Enhanced */}
      <section id='contact' className='py-20 bg-gradient-to-b from-[var(--brand-surface)] to-[var(--background)] relative'>
        {/* Subtle decoration */}
        <div className='absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[var(--brand-primary)]/10 to-transparent pointer-events-none' />
        
        <div className='container-app relative z-10'>
          <div className='text-center mb-16'>
            <Badge variant='primary' className='mb-4'>
              تواصل معنا
            </Badge>
            <h2 className='text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4'>
              نحن هنا لمساعدتك
            </h2>
            <p className='text-xl text-[var(--text-secondary)] max-w-2xl mx-auto'>
              تواصل معنا في أي وقت للحصول على استشارة مجانية
            </p>
          </div>

          <div className='max-w-7xl mx-auto'>
            <div className='bg-[var(--panel)] rounded-2xl p-8 md:p-12 border border-[var(--brand-border)] shadow-lg'>
              <ContactFormWithMap />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Floating Chatbot */}
      <MoeenChatbot position='bottom-left' />
      
    </div>
  );
});

export default HomePage;
