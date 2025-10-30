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
  const [isLoaded, setIsLoaded] = useState(false);
  const localizedNumber = useLocalizedNumber();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className='relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900'>
      {/* Enhanced Background with Multiple Layers */}
      <div className='absolute inset-0'>
        {/* Background Images with Smooth Transitions */}
        {heroImages.map((img, index) => (
          <div
            key={img}
            className={`absolute inset-0 transition-all duration-1000 ease-out ${
              index === currentImageIndex ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
            }`}
          >
            <Image
              src={img}
              alt={`مركز الهمم - صورة تعليمية ${index + 1}`}
              fill
              className='object-cover'
              priority={index === 0}
              sizes='100vw'
            />
            {/* Multi-layer Gradient Overlay */}
            <div className='absolute inset-0 bg-gradient-to-br from-primary-900/50 via-primary-800/40 to-primary-600/20 dark:from-neutral-900/60 dark:via-neutral-800/50 dark:to-neutral-700/30' />
          </div>
        ))}

        {/* Decorative Floating Elements */}
        <div className='absolute inset-0 pointer-events-none'>
          <div className='absolute top-20 left-10 w-20 h-20 bg-primary-500/20 rounded-full blur-xl animate-pulse' />
          <div className='absolute top-40 right-20 w-32 h-32 bg-secondary-500/15 rounded-full blur-2xl animate-pulse delay-1000' />
          <div className='absolute bottom-32 left-1/4 w-24 h-24 bg-info-500/15 rounded-full blur-xl animate-pulse delay-2000' />
          <div className='absolute top-1/2 right-10 w-16 h-16 bg-success-500/20 rounded-full blur-lg animate-bounce-gentle delay-3000' />
        </div>

        {/* Pattern Overlay */}
        <div className='absolute inset-0 opacity-5 dark:opacity-10'>
          <div className='absolute inset-0' style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f97316' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
      </div>


      {/* Content */}
      <div className='container-2xl relative z-10 py-20 px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[80vh]'>
          {/* Left: Text Content */}
          <div className={`text-neutral-900 dark:text-white space-y-8 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}>
            {/* Enhanced Badge */}
            <div className='inline-block'>
              <span className='inline-flex items-center gap-2 px-4 py-2 bg-primary-500/90 text-white backdrop-blur-sm rounded-full text-sm font-semibold shadow-lg hover-lift'>
                <span className='w-2 h-2 bg-success-400 rounded-full animate-pulse'></span>
                🏥 جدة - حي الصفا
              </span>
            </div>

            {/* Enhanced Heading */}
            <h1 className='text-display-4xl sm:text-display-5xl md:text-display-6xl lg:text-display-7xl font-black leading-tight tracking-tight'>
              <span className='block mb-2'>مركز الهمم</span>
              <span className='block text-primary-600 dark:text-primary-400 animate-fade-in delay-300'>
                لرعاية ذوي الاحتياجات الخاصة
              </span>
            </h1>

            {/* Enhanced Description */}
            <p className='text-display-lg sm:text-display-xl leading-relaxed text-neutral-700 dark:text-neutral-200 max-w-2xl font-medium'>
              في جدة، نقدم رعاية متخصصة وشاملة لذوي الاحتياجات الخاصة. نوفر خدمات
              <span className='text-primary-600 dark:text-primary-400 font-semibold'> تأهيلية عالية الجودة </span>
              تشمل العلاج الطبيعي والوظيفي والنطق والسمع وبرامج التدخل المبكر.
            </p>

            {/* Enhanced CTA Buttons */}
            <div className='flex flex-col sm:flex-row gap-4 pt-4'>
              <Button
                onClick={onAppointmentClick}
                size='lg'
                className='group bg-primary-600 hover:bg-primary-700 text-white font-bold px-8 py-4 text-lg shadow-xl hover:shadow-2xl hover-scale focus-ring transition-all duration-300'
              >
                <Calendar className='w-5 h-5 ml-2 group-hover:rotate-12 transition-transform' />
                احجز موعدك الآن
                <span className='inline-block ml-2 animate-bounce-gentle'>✨</span>
              </Button>
              <Button
                onClick={onLearnMoreClick}
                variant='outline'
                size='lg'
                className='group border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white font-bold px-8 py-4 text-lg backdrop-blur-sm bg-white/80 dark:bg-neutral-800/80 shadow-lg hover:shadow-xl hover-lift focus-ring transition-all duration-300'
              >
                <span className='group-hover:scale-110 transition-transform inline-block mr-2'>🎯</span>
                شاهد قصص النجاح
                <Play className='w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform' />
              </Button>
            </div>

            {/* Enhanced Trust Indicators */}
            <div className='grid grid-cols-3 gap-4 md:gap-6 pt-6'>
              <div className='group bg-white/10 dark:bg-neutral-800/50 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/20 dark:hover:bg-neutral-800/70 transition-all duration-300 hover-scale border border-white/20 dark:border-neutral-700/50'>
                <div className='text-display-2xl md:text-display-3xl font-black text-primary-400 group-hover:text-primary-300 transition-colors'>
                  {localizedNumber('98%')}
                </div>
                <div className='text-display-xs md:text-display-sm text-neutral-200 group-hover:text-white transition-colors font-medium'>
                  معدل الرضا
                </div>
                <div className='w-full bg-primary-500/30 rounded-full h-1 mt-2 overflow-hidden'>
                  <div className='bg-primary-400 h-full rounded-full animate-pulse' style={{width: '98%'}}></div>
                </div>
              </div>

              <div className='group bg-white/10 dark:bg-neutral-800/50 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/20 dark:hover:bg-neutral-800/70 transition-all duration-300 hover-scale border border-white/20 dark:border-neutral-700/50'>
                <div className='text-display-2xl md:text-display-3xl font-black text-success-400 group-hover:text-success-300 transition-colors'>
                  {localizedNumber('1,247+')}
                </div>
                <div className='text-display-xs md:text-display-sm text-neutral-200 group-hover:text-white transition-colors font-medium'>
                  مريض نشط
                </div>
                <div className='flex items-center gap-1 mt-2'>
                  <div className='w-2 h-2 bg-success-400 rounded-full animate-pulse'></div>
                  <div className='w-2 h-2 bg-success-400 rounded-full animate-pulse delay-100'></div>
                  <div className='w-2 h-2 bg-success-400 rounded-full animate-pulse delay-200'></div>
                </div>
              </div>

              <div className='group bg-white/10 dark:bg-neutral-800/50 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/20 dark:hover:bg-neutral-800/70 transition-all duration-300 hover-scale border border-white/20 dark:border-neutral-700/50'>
                <div className='text-display-2xl md:text-display-3xl font-black text-info-400 group-hover:text-info-300 transition-colors'>
                  {localizedNumber('24/7')}
                </div>
                <div className='text-display-xs md:text-display-sm text-neutral-200 group-hover:text-white transition-colors font-medium'>
                  دعم مستمر
                </div>
                <div className='flex items-center gap-1 mt-2'>
                  <span className='text-info-400 animate-pulse'>💙</span>
                  <span className='text-info-400 animate-pulse delay-300'>💙</span>
                  <span className='text-info-400 animate-pulse delay-600'>💙</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Enhanced Image Showcase */}
          <div className='relative hidden lg:block'>
            <div className='relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 hover-scale group'>
              <Image
                src={heroImages[currentImageIndex]}
                alt='مركز الهمم - رعاية متخصصة لذوي الاحتياجات الخاصة'
                fill
                className='object-cover group-hover:scale-110 transition-transform duration-700'
                sizes='(max-width: 768px) 100vw, 50vw'
              />

              {/* Multi-layer Gradient Overlay */}
              <div className='absolute inset-0 bg-gradient-to-t from-primary-900/30 via-transparent to-transparent' />

              {/* Enhanced Floating Badge */}
              <div className='absolute top-6 left-6 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl rounded-2xl px-4 py-3 shadow-xl hover-lift border border-white/20 dark:border-neutral-700/50'>
                <div className='flex items-center gap-2'>
                  <div className='relative'>
                    <div className='w-3 h-3 bg-success-500 rounded-full animate-pulse' />
                    <div className='absolute inset-0 w-3 h-3 bg-success-400 rounded-full animate-ping opacity-75' />
                  </div>
                  <span className='font-bold text-neutral-900 dark:text-neutral-100 text-sm'>
                    متاح الآن
                  </span>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className='absolute bottom-6 right-6 flex flex-col gap-3'>
                <div className='bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover-lift'>
                  <span className='text-2xl'>🏥</span>
                </div>
                <div className='bg-primary-500/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover-lift'>
                  <span className='text-white text-xl'>❤️</span>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className='absolute bottom-6 left-6 right-24'>
                <div className='bg-black/20 backdrop-blur-sm rounded-full h-1 overflow-hidden'>
                  <div
                    className='bg-primary-400 h-full rounded-full transition-all duration-1000 ease-out'
                    style={{ width: `${((currentImageIndex + 1) / heroImages.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Floating Stats Cards */}
            <div className='absolute -left-8 top-1/4 transform -translate-y-1/2'>
              <div className='bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl rounded-2xl p-4 shadow-xl hover-lift border border-white/20 dark:border-neutral-700/50'>
                <div className='text-center'>
                  <div className='text-2xl font-black text-primary-600'>15+</div>
                  <div className='text-xs font-medium text-neutral-600 dark:text-neutral-300'>سنوات خبرة</div>
                </div>
              </div>
            </div>

            <div className='absolute -right-8 bottom-1/4'>
              <div className='bg-gradient-to-br from-success-500 to-success-600 text-white rounded-2xl p-4 shadow-xl hover-lift'>
                <div className='text-center'>
                  <div className='text-2xl font-black'>24/7</div>
                  <div className='text-xs font-medium opacity-90'>دعم فوري</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Image Slider Indicators */}
        <div className='flex justify-center gap-3 mt-12'>
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`group relative h-3 rounded-full transition-all duration-500 ease-out ${
                index === currentImageIndex
                  ? 'w-12 bg-primary-400 shadow-lg'
                  : 'w-3 bg-white/30 hover:bg-white/50 hover-lift'
              }`}
              aria-label={`عرض الصورة ${index + 1} من ${heroImages.length}`}
            >
              {/* Active indicator glow */}
              {index === currentImageIndex && (
                <div className='absolute inset-0 bg-primary-300 rounded-full animate-pulse opacity-50' />
              )}

              {/* Hover tooltip */}
              <div className='absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
                <div className='bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap'>
                  {index + 1} من {heroImages.length}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2'>
        <div className='group flex flex-col items-center gap-2 animate-bounce'>
          <div className='text-white/60 text-xs font-medium group-hover:text-white/80 transition-colors'>
            استكشف المزيد
          </div>
          <div className='w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-2 group-hover:border-white/60 transition-colors'>
            <div className='w-1.5 h-1.5 bg-white/70 rounded-full animate-pulse group-hover:bg-white transition-colors' />
          </div>
        </div>
      </div>
    </section>
  );
});

ModernHero.displayName = 'ModernHero';
export default ModernHero;

