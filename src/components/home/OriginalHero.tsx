/**
 * Original Hero Section - Exact Design Match
 * قسم Hero الأصلي - مطابق للتصميم الأصلي
 */

'use client';

import { Button } from '@/components/ui/Button';
import { useLocalizedNumber } from '@/hooks/useLocalizedNumber';
import { Calendar, Play, MapPin, Star, Heart } from 'lucide-react';
// Image removed - not needed for original design
import { memo } from 'react';

const OriginalHero = memo(function OriginalHero({
  onAppointmentClick,
  onLearnMoreClick,
}: {
  onAppointmentClick: () => void;
  onLearnMoreClick: () => void;
}) {
  const localizedNumber = useLocalizedNumber();

  return (
    <section className='relative min-h-screen flex items-center justify-center bg-[var(--background)] py-20'>
      <div className='container-app'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
          {/* Left: Logo Card */}
          <div className='relative'>
            {/* Main Logo Card */}
            <div className='card p-8 lg:p-12 relative'>
              {/* Logo */}
              <div className='mb-6 flex justify-center lg:justify-start'>
                <div className='w-24 h-24 relative'>
                  {/* Logo with colorful design - Using CSS Variables */}
                  <div className='absolute inset-0 bg-gradient-to-br from-[var(--feature-innovation)] via-[var(--feature-inclusivity)] to-gray-700 rounded-2xl flex items-center justify-center'>
                    <div className='text-white text-4xl font-bold'>م</div>
                    {/* C-shaped orange arc */}
                    <div className='absolute -top-2 -right-2 w-8 h-8 border-4 border-[var(--brand-primary)] rounded-full border-t-transparent border-r-transparent'></div>
                  </div>
                </div>
              </div>

              {/* Title - Arabic */}
              <h1 className='text-4xl lg:text-5xl font-bold text-[var(--text-primary)] mb-2'>
                مركز الهمم
              </h1>

              {/* Title - English */}
              <p className='text-xl text-[var(--text-secondary)] mb-6'>
                Alhimam Center
              </p>

              {/* Divider */}
              <div className='h-px bg-[var(--brand-border)] mb-6'></div>

              {/* Location Button */}
              <div className='flex items-center gap-4'>
                <button className='w-12 h-12 rounded-full bg-[var(--panel)] border border-[var(--brand-border)] flex items-center justify-center hover:bg-[var(--brand-surface)] transition-colors'>
                  <MapPin className='w-5 h-5 text-[var(--brand-primary)]' />
                </button>
              </div>

              {/* 24/7 Support Card - Floating */}
              <div className='absolute top-4 right-4 bg-[var(--background)]/95 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-[var(--brand-border)]'>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-[var(--text-primary)]'>
                    24/7
                  </div>
                  <div className='text-xs text-[var(--text-secondary)]'>
                    دعم فوري
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Action Buttons & Stats */}
          <div className='space-y-8'>
            {/* Action Buttons */}
            <div className='flex flex-col sm:flex-row gap-4'>
              {/* Watch Success Stories Button */}
              <Button
                onClick={onLearnMoreClick}
                variant='outline'
                size='lg'
                className='flex-1 border-2 border-[var(--brand-primary)] text-[var(--brand-primary)] hover:bg-[var(--brand-primary)] hover:text-white font-bold px-6 py-4 text-lg transition-all duration-300'
              >
                <Star className='w-5 h-5 mr-2' />
                شاهد قصص النجاح
                <Play className='w-5 h-5 ml-2' />
              </Button>

              {/* Book Appointment Button */}
              <Button
                onClick={onAppointmentClick}
                size='lg'
                className='flex-1 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white font-bold px-6 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300'
              >
                <Star className='w-5 h-5 mr-2' />
                احجز موعدك الآن
                <Calendar className='w-5 h-5 ml-2' />
              </Button>
            </div>

            {/* Stats Cards */}
            <div className='grid grid-cols-3 gap-4'>
              {/* 24/7 Support */}
              <div className='card p-4 text-center'>
                <div className='text-2xl font-bold text-[var(--text-primary)] mb-1'>
                  {localizedNumber('24/7')}
                </div>
                <div className='text-sm text-[var(--text-secondary)] mb-2'>
                  دعم مستمر
                </div>
                <div className='flex justify-center gap-1'>
                  <Heart className='w-4 h-4 text-[var(--brand-accent)] fill-current' />
                  <Heart className='w-4 h-4 text-[var(--brand-accent)] fill-current' />
                  <Heart className='w-4 h-4 text-[var(--brand-accent)] fill-current' />
                </div>
              </div>

              {/* Active Patients */}
              <div className='card p-4 text-center'>
                <div className='text-2xl font-bold text-[var(--text-primary)] mb-1'>
                  {localizedNumber('+1,247')}
                </div>
                <div className='text-sm text-[var(--text-secondary)]'>
                  مريض نشط
                </div>
              </div>

              {/* Satisfaction Rate */}
              <div className='card p-4 text-center'>
                <div className='text-2xl font-bold text-[var(--text-primary)] mb-1'>
                  {localizedNumber('98%')}
                </div>
                <div className='text-sm text-[var(--text-secondary)]'>
                  معدل الرضا
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

OriginalHero.displayName = 'OriginalHero';
export default OriginalHero;
