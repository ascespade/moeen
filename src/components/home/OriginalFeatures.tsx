/**
 * Original Features Section - 4 Cards Design
 * قسم المميزات الأصلي - 4 بطاقات
 */

'use client';

import { Card } from '@/components/ui/Card';
import { Heart, Lightbulb, Target, Trophy } from 'lucide-react';
import { memo } from 'react';

const OriginalFeatures = memo(function OriginalFeatures() {
  const features = [
    {
      icon: Lightbulb,
      title: 'الابتكار',
      description: 'أحدث التقنيات والأساليب',
      bgColor: 'bg-[var(--feature-innovation)]',
    },
    {
      icon: Target,
      title: 'الشمولية',
      description: 'رعاية متكاملة لجميع الجوانب',
      bgColor: 'bg-[var(--feature-inclusivity)]',
    },
    {
      icon: Trophy,
      title: 'الجودة والتميز',
      description: 'أعلى معايير الجودة الطبية',
      bgColor: 'bg-gradient-to-br from-[var(--feature-quality-start)] to-[var(--feature-quality-end)]',
    },
    {
      icon: Heart,
      title: 'الرعاية المتخصصة',
      description: 'فريق طبي متخصص ومؤهل',
      bgColor: 'bg-gradient-to-br from-[var(--feature-care-start)] to-[var(--feature-care-end)]',
    },
  ];

  return (
    <section className='py-20 bg-[var(--background)] relative overflow-hidden'>
      {/* Background Pattern */}
      <div className='absolute inset-0 opacity-5'>
        <div
          className='absolute inset-0'
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className='container-app relative z-10'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className='p-6 text-center hover:shadow-lg transition-all transform hover:-translate-y-1'
              >
                {/* Icon */}
                <div
                  className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}
                >
                  <Icon className='w-8 h-8 text-white' />
                </div>

                {/* Title */}
                <h3 className='text-lg font-bold text-[var(--text-primary)] mb-2'>
                  {feature.title}
                </h3>

                {/* Description */}
                <p className='text-sm text-[var(--text-secondary)]'>
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
});

OriginalFeatures.displayName = 'OriginalFeatures';
export default OriginalFeatures;

