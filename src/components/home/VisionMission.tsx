'use client';

import { Card } from '@/components/ui/Card';
import { Heart, Lightbulb, Target, Trophy } from 'lucide-react';
import { memo } from 'react';

const VisionMission = memo(function VisionMission() {
  return (
    <section className='py-20 relative overflow-hidden'>
      {/* Background Pattern */}
      <div className='absolute inset-0 opacity-5'>
        <div className='absolute inset-0' style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className='container-app relative z-10'>
        <div className='text-center mb-16'>
          <h2 className='text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4'>
            رؤيتنا ورسالتنا
          </h2>
          <p className='text-xl text-[var(--text-secondary)] max-w-3xl mx-auto'>
            نؤمن بأن كل فرد يستحق فرصة للحياة الكريمة والاستقلالية
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16'>
          {/* Vision */}
          <Card className='p-8 bg-gradient-to-br from-[var(--brand-primary)]/10 to-[var(--brand-primary)]/5 border-2 border-[var(--brand-primary)]/20 hover:shadow-xl transition-all'>
            <div className='flex items-start gap-6'>
              <div className='w-16 h-16 bg-[var(--brand-primary)] rounded-2xl flex items-center justify-center flex-shrink-0'>
                <Target className='w-8 h-8 text-white' />
              </div>
              <div>
                <h3 className='text-2xl font-bold text-[var(--text-primary)] mb-4'>
                  رؤيتنا
                </h3>
                <p className='text-lg text-[var(--text-secondary)] leading-relaxed'>
                  أن نكون الرائدين في جدة ومنطقة مكة المكرمة في توفير خدمات تأهيلية
                  متكاملة وشاملة لذوي الاحتياجات الخاصة، وأن نساهم في بناء مجتمع
                  شامل يعزز من قدراتهم ويدعم استقلاليتهم ويحسن جودة حياتهم.
                </p>
              </div>
            </div>
          </Card>

          {/* Mission */}
          <Card className='p-8 bg-gradient-to-br from-[var(--brand-info)]/10 to-[var(--brand-info)]/5 border-2 border-[var(--brand-info)]/20 hover:shadow-xl transition-all'>
            <div className='flex items-start gap-6'>
              <div className='w-16 h-16 bg-[var(--brand-info)] rounded-2xl flex items-center justify-center flex-shrink-0'>
                <Lightbulb className='w-8 h-8 text-white' />
              </div>
              <div>
                <h3 className='text-2xl font-bold text-[var(--text-primary)] mb-4'>
                  رسالتنا
                </h3>
                <p className='text-lg text-[var(--text-secondary)] leading-relaxed'>
                  تقديم خدمات طبية وتأهيلية عالية الجودة باستخدام أحدث التقنيات
                  والأساليب العلمية، مع التركيز على تطوير قدرات كل مريض بشكل
                  فردي ومخصص لتحقيق أقصى قدر من الاستقلالية والجودة في الحياة.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Values */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {[
            {
              icon: Heart,
              title: 'الرعاية المتخصصة',
              description: 'فريق طبي متخصص ومؤهل',
              color: 'from-red-500 to-pink-500',
            },
            {
              icon: Trophy,
              title: 'الجودة والتميز',
              description: 'أعلى معايير الجودة الطبية',
              color: 'from-yellow-500 to-orange-500',
            },
            {
              icon: Target,
              title: 'الشمولية',
              description: 'رعاية متكاملة لجميع الجوانب',
              color: 'from-blue-500 to-cyan-500',
            },
            {
              icon: Lightbulb,
              title: 'الابتكار',
              description: 'أحدث التقنيات والأساليب',
              color: 'from-green-500 to-emerald-500',
            },
          ].map((value, index) => (
            <Card
              key={index}
              className='p-6 text-center hover:shadow-lg transition-all transform hover:-translate-y-1'
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                <value.icon className='w-8 h-8 text-white' />
              </div>
              <h4 className='text-lg font-bold text-[var(--text-primary)] mb-2'>
                {value.title}
              </h4>
              <p className='text-sm text-[var(--text-secondary)]'>
                {value.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
});

VisionMission.displayName = 'VisionMission';
export default VisionMission;

