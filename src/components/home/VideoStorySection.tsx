'use client';

import { Button } from '@/components/ui/Button';
import { useLocalizedNumber } from '@/hooks/useLocalizedNumber';
import { ArrowRight, Award, Heart, Play, Users } from 'lucide-react';
import Image from 'next/image';
import { memo, useState } from 'react';

const VideoStorySection = memo(function VideoStorySection() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const localizedNumber = useLocalizedNumber();

  return (
    <section className='py-20 relative overflow-hidden bg-gradient-to-br from-white via-[var(--brand-surface)] to-white'>
      <div className='container-app'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
          {/* Left: Video/Image */}
          <div className='relative group'>
            <div className='relative aspect-video rounded-3xl overflow-hidden shadow-2xl'>
              <Image
                src='/about-image.jpg'
                alt='قصة مركز الهمم'
                fill
                className='object-cover'
                sizes='(max-width: 1024px) 100vw, 50vw'
              />
              
              {/* Play Button Overlay */}
              <div className='absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center'>
                <button
                  onClick={() => setIsVideoPlaying(true)}
                  className='w-20 h-20 bg-[var(--brand-primary)] rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform group-hover:scale-110'
                  aria-label='تشغيل الفيديو'
                >
                  <Play className='w-10 h-10 text-white mr-1' fill='white' />
                </button>
              </div>

              {/* Decorative Elements */}
              <div className='absolute -top-6 -right-6 w-32 h-32 bg-[var(--brand-primary)]/20 rounded-full blur-2xl -z-10' />
              <div className='absolute -bottom-6 -left-6 w-40 h-40 bg-[var(--brand-info)]/20 rounded-full blur-2xl -z-10' />
            </div>

            {/* Stats Overlay */}
            <div className='absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-2xl shadow-xl p-6 grid grid-cols-3 gap-6 w-11/12'>
              {[
                { icon: Users, value: '1,247', label: 'مريض' },
                { icon: Award, value: '98%', label: 'رضا' },
                { icon: Heart, value: '24/7', label: 'دعم' },
              ].map((stat, index) => (
                <div key={index} className='text-center'>
                  <stat.icon className='w-6 h-6 text-[var(--brand-primary)] mx-auto mb-2' />
                  <div className='text-2xl font-bold text-[var(--text-primary)]'>
                    {localizedNumber(stat.value)}
                  </div>
                  <div className='text-xs text-[var(--text-secondary)]'>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Content */}
          <div className='space-y-6'>
            <div className='inline-block'>
              <span className='px-4 py-2 bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] rounded-full text-sm font-semibold'>
                قصة نجاحنا
              </span>
            </div>
            
            <h2 className='text-4xl md:text-5xl font-bold text-[var(--text-primary)] leading-tight'>
              نحن هنا من أجلك
              <span className='block text-[var(--brand-primary)] mt-2'>
                وهدفنا نجاحك
              </span>
            </h2>
            
            <p className='text-lg text-[var(--text-secondary)] leading-relaxed'>
              مركز الهمم لرعاية ذوي الاحتياجات الخاصة في جدة - حي الصفا. نعمل
              بتفانٍ لتوفير أفضل خدمات تأهيلية متخصصة تشمل جلسات التخاطب، التأهيل
              السمعي، تعديل السلوك، العلاج الوظيفي، والتكامل الحسي. فريقنا المتخصص
              يسعى دائماً لتحقيق نتائج إيجابية في حياة مرضانا وعائلاتهم.
            </p>

            <div className='space-y-4 pt-4'>
              {[
                {
                  title: `خبرة ${localizedNumber('15+')} سنة`,
                  description: 'سنوات من الخبرة في الرعاية المتخصصة',
                },
                {
                  title: 'فريق متكامل',
                  description: 'أطباء ومختصين من أفضل التخصصات',
                },
                {
                  title: 'تقنيات حديثة',
                  description: 'أحدث الأجهزة والبرامج العلاجية',
                },
              ].map((item, index) => (
                <div key={index} className='flex items-start gap-4'>
                  <div className='w-2 h-2 bg-[var(--brand-primary)] rounded-full mt-2 flex-shrink-0' />
                  <div>
                    <h4 className='font-bold text-[var(--text-primary)] mb-1'>
                      {item.title}
                    </h4>
                    <p className='text-[var(--text-secondary)] text-sm'>
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Button size='lg' className='btn-default mt-6'>
              تعرف على المزيد
              <ArrowRight className='w-5 h-5 mr-2' />
            </Button>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {isVideoPlaying && (
        <div
          className='fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4'
          onClick={() => setIsVideoPlaying(false)}
        >
          <div
            className='relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden'
            onClick={(e) => e.stopPropagation()}
          >
            {/* Video would go here */}
            <div className='absolute inset-0 flex items-center justify-center'>
              <p className='text-white'>سيتم إضافة الفيديو قريباً</p>
            </div>
            <button
              onClick={() => setIsVideoPlaying(false)}
              className='absolute top-4 left-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70'
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </section>
  );
});

VideoStorySection.displayName = 'VideoStorySection';
export default VideoStorySection;

