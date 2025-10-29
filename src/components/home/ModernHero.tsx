'use client';

import { Button } from '@/components/ui/Button';
import { useLocalizedNumber } from '@/hooks/useLocalizedNumber';
import { Calendar, Play } from 'lucide-react';
import Image from 'next/image';
import { memo, useEffect, useState } from 'react';

const heroImages = [
  '/hero-1.jpg',
  '/hero-2.jpg',
  '/hero-3.jpg',
];

const ModernHero = memo(function ModernHero({
  onAppointmentClick,
  onLearnMoreClick,
}: {
  onAppointmentClick: () => void;
  onLearnMoreClick: () => void;
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const localizedNumber = useLocalizedNumber();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className='relative min-h-screen flex items-center justify-center overflow-hidden'>
      {/* Background Image Slider */}
      <div className='absolute inset-0'>
        {heroImages.map((img, index) => (
          <div
            key={img}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={img}
              alt={`Hero ${index + 1}`}
              fill
              className='object-cover'
              priority={index === 0}
              sizes='100vw'
            />
            {/* Enhanced overlay with orange gradient for better branding */}
            <div className='absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-[var(--brand-primary)]/20' />
          </div>
        ))}
      </div>


      {/* Content */}
      <div className='container-app relative z-10 py-20'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]'>
          {/* Left: Text Content */}
          <div className='text-white space-y-8 animate-fadeInUp'>
            <div className='inline-block'>
              <span className='px-4 py-2 bg-[var(--brand-primary)]/90 backdrop-blur-sm rounded-full text-sm font-semibold'>
                🏥 جدة - حي الصفا
              </span>
            </div>
            
            <h1 className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight'>
              مركز الهمم
              <span className='block text-[var(--brand-primary)] mt-2'>
                لرعاية ذوي الاحتياجات الخاصة
              </span>
            </h1>
            
            <p className='text-lg sm:text-xl md:text-2xl leading-relaxed text-white/90 max-w-lg'>
              في جدة، نقدم رعاية متخصصة وشاملة لذوي الاحتياجات الخاصة. نوفر خدمات
              تأهيلية عالية الجودة تشمل العلاج الطبيعي والوظيفي والنطق والسمع
              وبرامج التدخل المبكر.
            </p>

            <div className='flex flex-col sm:flex-row gap-4'>
              <Button
                onClick={onAppointmentClick}
                size='lg'
                className='bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white font-semibold px-8 py-6 text-lg shadow-xl hover:scale-105 transition-transform'
              >
                <Calendar className='w-5 h-5 ml-2' />
                احجز موعدك الآن
              </Button>
              <Button
                onClick={onLearnMoreClick}
                variant='outline'
                size='lg'
                className='border-2 border-white text-white hover:bg-white hover:text-[var(--brand-primary)] font-semibold px-8 py-6 text-lg backdrop-blur-sm bg-white/10'
              >
                شاهد قصص النجاح
                <Play className='w-5 h-5 mr-2' />
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className='flex flex-wrap items-center gap-6 md:gap-8 pt-4'>
              <div className='flex-1 min-w-[100px]'>
                <div className='text-2xl md:text-3xl font-bold text-[var(--brand-primary)]'>
                  {localizedNumber('98%')}
                </div>
                <div className='text-xs md:text-sm text-white/80'>معدل الرضا</div>
              </div>
              <div className='flex-1 min-w-[100px]'>
                <div className='text-2xl md:text-3xl font-bold text-[var(--brand-primary)]'>
                  {localizedNumber('1,247+')}
                </div>
                <div className='text-xs md:text-sm text-white/80'>مريض نشط</div>
              </div>
              <div className='flex-1 min-w-[100px]'>
                <div className='text-2xl md:text-3xl font-bold text-[var(--brand-primary)]'>
                  {localizedNumber('24/7')}
                </div>
                <div className='text-xs md:text-sm text-white/80'>دعم مستمر</div>
              </div>
            </div>
          </div>

          {/* Right: Image Showcase */}
          <div className='relative hidden lg:block'>
            <div className='relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl'>
              <Image
                src={heroImages[currentImageIndex]}
                alt='مركز الهمم'
                fill
                className='object-cover'
                sizes='(max-width: 768px) 100vw, 50vw'
              />
              {/* Floating Badge */}
              <div className='absolute top-6 left-6 bg-white/95 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg'>
                <div className='flex items-center gap-3'>
                  <div className='w-3 h-3 bg-green-500 rounded-full animate-pulse' />
                  <span className='font-semibold text-gray-900'>متاح الآن</span>
                </div>
              </div>
            </div>
            
          </div>
        </div>

        {/* Image Slider Indicators */}
        <div className='flex justify-center gap-2 mt-8'>
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentImageIndex
                  ? 'w-8 bg-[var(--brand-primary)]'
                  : 'w-2 bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce'>
        <div className='w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2'>
          <div className='w-1.5 h-1.5 bg-white/70 rounded-full animate-pulse' />
        </div>
      </div>
    </section>
  );
});

ModernHero.displayName = 'ModernHero';
export default ModernHero;

