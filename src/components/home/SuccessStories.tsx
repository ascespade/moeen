'use client';

import { Card, CardContent } from '@/components/ui/Card';
import { Quote, Star } from 'lucide-react';
import Image from 'next/image';
import { memo } from 'react';

interface Story {
  id: number;
  name: string;
  role: string;
  image: string;
  quote: string;
  rating: number;
  achievement: string;
}

const stories: Story[] = [
  {
    id: 1,
    name: 'أم أحمد',
    role: 'والدة مريض',
    image: '/testimonial-1.jpg',
    quote:
      'مركز الهمم غير حياة ابني تماماً. الفريق الطبي متخصص جداً والخدمات ممتازة. ابني الآن يستطيع المشي بشكل مستقل بعد 6 أشهر من العلاج الطبيعي.',
    rating: 5,
    achievement: 'تمكن من المشي بشكل مستقل',
  },
  {
    id: 2,
    name: 'سارة محمد',
    role: 'والدة مريضة',
    image: '/testimonial-2.jpg',
    quote:
      'التقنيات الحديثة والرعاية المتميزة جعلت ابنتي تتحسن بشكل ملحوظ. برنامج علاج النطق والسمع كان رائعاً والآن ابنتي تتفاعل أكثر مع محيطها.',
    rating: 5,
    achievement: 'تحسن كبير في مهارات التواصل',
  },
  {
    id: 3,
    name: 'خالد العتيبي',
    role: 'والد مريض',
    image: '/testimonial-3.jpg',
    quote:
      'فريق العمل محترف جداً والمركز مجهز بأحدث الأجهزة. أنصح به بشدة. البرامج التأهيلية ساعدت ابني في تطوير مهاراته الحياتية بشكل كبير.',
    rating: 5,
    achievement: 'تحسين المهارات الحياتية',
  },
];

const SuccessStories = memo(function SuccessStories() {
  return (
    <section className='py-20 bg-gradient-to-b from-[var(--brand-surface)] to-white'>
      <div className='container-app'>
        <div className='text-center mb-16'>
          <h2 className='text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4'>
            قصص نجاح ملهمة
          </h2>
          <p className='text-xl text-[var(--text-secondary)] max-w-3xl mx-auto'>
            نفتخر بنتائج عملنا ونجاحات مرضانا. كل قصة نجاح هي دافع لنا للاستمرار
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {stories.map((story) => (
            <Card
              key={story.id}
              className='overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white border-0'
            >
              {/* Image */}
              <div className='relative h-64'>
                <Image
                  src={story.image}
                  alt={story.name}
                  fill
                  className='object-cover'
                  sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent' />
                
                {/* Profile Info */}
                <div className='absolute bottom-4 right-4 text-white'>
                  <h4 className='text-xl font-bold mb-1'>{story.name}</h4>
                  <p className='text-sm text-white/90'>{story.role}</p>
                </div>

                {/* Quote Icon */}
                <div className='absolute top-4 left-4 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center'>
                  <Quote className='w-6 h-6 text-white' />
                </div>
              </div>

              <CardContent className='p-6'>
                {/* Rating */}
                <div className='flex items-center gap-1 mb-4'>
                  {[...Array(story.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className='w-5 h-5 text-yellow-400 fill-current'
                    />
                  ))}
                </div>

                {/* Quote */}
                <p className='text-[var(--text-secondary)] leading-relaxed mb-4 italic'>
                  &quot;{story.quote}&quot;
                </p>

                {/* Achievement Badge */}
                <div className='pt-4 border-t border-[var(--brand-border)]'>
                  <div className='inline-flex items-center gap-2 px-4 py-2 bg-[var(--brand-success)]/10 rounded-full'>
                    <div className='w-2 h-2 bg-[var(--brand-success)] rounded-full' />
                    <span className='text-sm font-semibold text-[var(--brand-success)]'>
                      {story.achievement}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
});

SuccessStories.displayName = 'SuccessStories';
export default SuccessStories;

