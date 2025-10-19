'use client';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

const features = [
  {
    id: 1,
    title: 'إدارة المواعيد الذكية',
    description:
      'نظام تقويم متطور لإدارة المواعيد والجلسات العلاجية مع تذكيرات تلقائية',
    icon: '📅',
    color: 'text-[var(--brand-accent)]',
    bgColor: 'bg-[var(--brand-accent)]/10',
    benefits: ['حجز تلقائي', 'تذكيرات ذكية', 'إدارة الجدولة'],
  },
  {
    id: 2,
    title: 'إدارة المرضى الشاملة',
    description: 'ملفات مرضى متكاملة مع سجل طبي مفصل وتتبع التقدم العلاجي',
    icon: '👤',
    color: 'text-[var(--brand-success)]',
    bgColor: 'bg-[var(--brand-success)]/10',
    benefits: ['ملفات رقمية', 'سجل طبي', 'تتبع التقدم'],
  },
  {
    id: 3,
    title: 'المطالبات التأمينية',
    description:
      'إدارة وتتبع المطالبات التأمينية بسهولة مع دعم جميع شركات التأمين',
    icon: '📋',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    benefits: ['تتبع المطالبات', 'دعم التأمين', 'تقارير مالية'],
  },
  {
    id: 4,
    title: 'الشات بوت الذكي',
    description: 'مساعد ذكي للرد على استفسارات المرضى وتقديم المعلومات الطبية',
    icon: '🤖',
    color: 'text-[var(--brand-primary)]',
    bgColor: 'bg-[var(--brand-primary)]/10',
    benefits: ['رد فوري', 'معلومات طبية', 'دعم 24/7'],
  },
  {
    id: 5,
    title: 'إدارة الموظفين',
    description: 'تتبع ساعات العمل والأداء للموظفين مع نظام حضور وانصراف ذكي',
    icon: '👨‍⚕️',
    color: 'text-[var(--brand-error)]',
    bgColor: 'bg-[var(--brand-error)]/10',
    benefits: ['تتبع الحضور', 'تقييم الأداء', 'إدارة الرواتب'],
  },
  {
    id: 6,
    title: 'التقارير والتحليلات',
    description: 'تقارير شاملة وإحصائيات مفصلة لاتخاذ قرارات مدروسة',
    icon: '📊',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    benefits: ['تقارير مالية', 'إحصائيات الأداء', 'تحليلات متقدمة'],
  },
];

export default function FeaturesPage() {
  return (
    <div className='min-h-screen bg-background text-foreground'>
      {/* Header */}
      <div className='bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] py-20'>
        <div className='container-app text-center'>
          <h1 className='text-5xl font-bold text-white mb-6'>
            مميزات منصة مُعين
          </h1>
          <p className='text-xl text-white/90 max-w-3xl mx-auto'>
            اكتشف كيف يمكن لمنصة مُعين أن تحول مركزك الصحي وتجعل إدارة المرضى
            والمواعيد أسهل وأكثر كفاءة
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className='py-20'>
        <div className='container-app'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {features.map(feature => (
              <Card
                key={feature.id}
                className='p-8 text-center group hover:shadow-xl transition-all duration-300'
              >
                <div
                  className={`h-20 w-20 ${feature.bgColor} mx-auto mb-6 flex items-center justify-center rounded-2xl text-4xl transition-transform group-hover:scale-110`}
                >
                  {feature.icon}
                </div>
                <h3 className='text-2xl font-bold text-foreground mb-4'>
                  {feature.title}
                </h3>
                <p className='text-muted-foreground mb-6'>
                  {feature.description}
                </p>
                <div className='space-y-2'>
                  {feature.benefits.map((benefit, index) => (
                    <div
                      key={index}
                      className='flex items-center gap-2 text-sm text-gray-600'
                    >
                      <span className='text-[var(--brand-primary)]'>✓</span>
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
                <Button className='btn-brand mt-6 w-full'>
                  تعرف على المزيد
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className='py-20 bg-[var(--brand-surface)]'>
        <div className='container-app text-center'>
          <h2 className='text-4xl font-bold text-foreground mb-6'>
            جاهز للبدء؟
          </h2>
          <p className='text-xl text-muted-foreground mb-8 max-w-2xl mx-auto'>
            انضم إلى آلاف المراكز الصحية التي تثق في منصة مُعين لإدارة عملياتها
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Button className='btn-brand btn-lg'>ابدأ التجربة المجانية</Button>
            <Button className='btn-outline btn-lg'>تواصل معنا</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
