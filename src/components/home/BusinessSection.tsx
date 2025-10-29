'use client';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import {
    Award,
    BarChart3,
    CheckCircle2,
    Shield,
    TrendingUp,
    Users,
    Zap
} from 'lucide-react';
import Link from 'next/link';
import { memo } from 'react';

const features = [
  {
    icon: Shield,
    title: 'معتمد من وزارة الصحة',
    description: 'نحمل شهادات اعتماد من الجهات الصحية المعنية',
    color: 'var(--brand-primary)',
  },
  {
    icon: Award,
    title: 'خبرة أكثر من 15 عام',
    description: 'سنوات من الخبرة في رعاية ذوي الاحتياجات الخاصة',
    color: 'var(--brand-success)',
  },
  {
    icon: TrendingUp,
    title: 'نسبة نجاح 98%',
    description: 'نسبة رضا عالية من الأسر والعائلات',
    color: 'var(--brand-info)',
  },
  {
    icon: Users,
    title: 'فريق متخصص',
    description: 'فريق طبي متعدد التخصصات معتمد دولياً',
    color: 'var(--brand-primary)',
  },
  {
    icon: BarChart3,
    title: 'نتائج ملموسة',
    description: 'تتبع وتحليل مستمر لنتائج العلاج والتأهيل',
    color: 'var(--brand-accent)',
  },
  {
    icon: Zap,
    title: 'تقنيات حديثة',
    description: 'أحدث الأجهزة والبرامج العلاجية المتطورة',
    color: 'var(--brand-warning)',
  },
];

const BusinessSection = memo(function BusinessSection() {
  return (
    <section className='py-20 bg-[var(--background)]'>
      <div className='container-app'>
        <div className='text-center mb-16'>
          <Badge variant='primary' className='mb-4'>
            تميزنا المهني
          </Badge>
          <h2 className='text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4'>
            لماذا تختار مركز الهمم؟
          </h2>
          <p className='text-xl text-[var(--text-secondary)] max-w-3xl mx-auto'>
            نقدم خدمات متخصصة وعالية الجودة مع التزام بأعلى معايير الرعاية الصحية
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 reminders-8 mb-16'>
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className='border border-[var(--brand-border)] hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-[var(--panel)]'
              >
                <CardContent className='p-6'>
                  <div 
                    className='w-12 h-12 rounded-lg flex items-center justify-center mb-4'
                    style={{ backgroundColor: `${feature.color}15` }}
                  >
                    <Icon 
                      className='w-6 h-6'
                      style={{ color: feature.color }}
                    />
                  </div>
                  <h3 className='text-xl font-bold text-[var(--text-primary)] mb-2'>
                    {feature.title}
                  </h3>
                  <p className='text-[var(--text-secondary)]'>
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className='bg-[var(--brand-surface)] rounded-2xl p-8 md:p-12'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8 items-center'>
            <div>
              <h3 className='text-3xl font-bold text-[var(--text-primary)] mb-4'>
                التزامنا بالجودة والتميز
              </h3>
              <p className='text-lg text-[var(--text-secondary)] mb-6 leading-relaxed'>
                في مركز الهمم، نؤمن بأن كل فرد يستحق أفضل رعاية صحية ممكنة. لذلك نلتزم
                بتقديم خدمات عالية الجودة تعتمد على أحدث الأبحاث والدراسات العلمية.
              </p>
              <div className='space-y-3 mb-6'>
                {[
                  'معايير جودة عالمية',
                  'تدريب مستمر للفريق',
                  'تطوير مستمر للخدمات',
                  'رضا المرضى أولويتنا',
                ].map((item, idx) => (
                  <div key={idx} className='flex items-center gap-3'>
                    <CheckCircle2 className='w-5 h-5 text-[var(--brand-success)] flex-shrink-0' />
                    <span className='text-[var(--text-secondary)]'>{item}</span>
                  </div>
                ))}
              </div>
              <Button asChild size='lg' className='btn-default'>
                <Link href='/about'>
                  تعرف على المزيد
                </Link>
              </Button>
            </div>
            <div className='grid grid-cols-2 gap-6'>
              <div className='bg-[var(--panel)] rounded-xl p-6 text-center border border-[var(--brand-border)]'>
                <div className='text-4xl font-bold text-[var(--brand-primary)] mb-2'>15+</div>
                <div className='text-[var(--text-secondary)]'>سنة خبرة</div>
              </div>
              <div className='bg-[var(--panel)] rounded-xl p-6 text-center border border-[var(--brand-border)]'>
                <div className='text-4xl font-bold text-[var(--brand-success)] mb-2'>98%</div>
                <div className='text-[var(--text-secondary)]'>معدل الرضا</div>
              </div>
              <div className='bg-[var(--panel)] rounded-xl p-6 text-center border border-[var(--brand-border)]'>
                <div className='text-4xl font-bold text-[var(--brand-info)] mb-2'>50+</div>
                <div className='text-[var(--text-secondary)]'>متخصص</div>
              </div>
              <div className='bg-[var(--panel)] rounded-xl p-6 text-center border border-[var(--brand-border)]'>
                <div className='text-4xl font-bold text-[var(--brand-accent)] mb-2'>1K+</div>
                <div className='text-[var(--text-secondary)]'>مريض نشط</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

BusinessSection.displayName = 'BusinessSection';
export default BusinessSection;

