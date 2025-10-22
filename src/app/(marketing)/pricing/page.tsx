'use client';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

const pricingPlans = [
  {
    id: 1,
    name: 'الخطة الأساسية',
    price: 'مجاني',
    period: 'للبدء',
    description: 'مثالية للعيادات الصغيرة والممارسين الأفراد',
    features: [
      'حتى 50 مريض',
      'إدارة المواعيد الأساسية',
      'ملفات المرضى الرقمية',
      'دعم فني عبر البريد الإلكتروني',
      'تقارير أساسية',
    ],
    cta: 'ابدأ مجاناً',
    popular: false,
    color: 'text-[var(--primary-accent)]',
    bgColor: 'bg-[var(--primary-accent)]/10',
  },
  {
    id: 2,
    name: 'الخطة المهنية',
    price: '299',
    period: 'ريال/شهر',
    description: 'الأكثر شعبية للمراكز الصحية المتوسطة',
    features: [
      'حتى 500 مريض',
      'جميع مميزات الخطة الأساسية',
      'إدارة المطالبات التأمينية',
      'الشات بوت الذكي',
      'إدارة الموظفين',
      'تقارير متقدمة',
      'دعم فني هاتفي',
      'تدريب مجاني',
    ],
    cta: 'جرب مجاناً لمدة 14 يوم',
    popular: true,
    color: 'text-[var(--primary-primary)]',
    bgColor: 'bg-[var(--primary-primary)]/10',
  },
  {
    id: 3,
    name: 'الخطة المؤسسية',
    price: 'مخصص',
    period: 'اتصل بنا',
    description: 'للمراكز الكبيرة والمستشفيات',
    features: [
      'مرضى غير محدود',
      'جميع مميزات الخطة المهنية',
      'API مخصص',
      'تكامل مع أنظمة المستشفى',
      'مدير حساب مخصص',
      'دعم 24/7',
      'تدريب شامل',
      'تخصيص متقدم',
    ],
    cta: 'تواصل معنا',
    popular: false,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
];

const faqs = [
  {
    id: 1,
    question: 'هل يمكنني تغيير الخطة في أي وقت؟',
    answer:
      'نعم، يمكنك ترقية أو تخفيض خطتك في أي وقت. التغييرات ستصبح فعالة في بداية دورة الفوترة التالية.',
  },
  {
    id: 2,
    question: 'ماذا يحدث لبياناتي إذا ألغيت الاشتراك؟',
    answer:
      'بياناتك آمنة معنا. يمكنك تصدير جميع بياناتك قبل الإلغاء، وسنحتفظ بها لمدة 30 يوم إضافي.',
  },
  {
    id: 3,
    question: 'هل هناك فترة تجريبية مجانية؟',
    answer:
      'نعم، نقدم فترة تجريبية مجانية لمدة 14 يوم لجميع الخطط المدفوعة بدون الحاجة لبطاقة ائتمان.',
  },
  {
    id: 4,
    question: 'هل يمكنني الحصول على خصم للدفع السنوي؟',
    answer: 'نعم، نقدم خصم 20% عند الدفع سنوياً لجميع الخطط المدفوعة.',
  },
];

export default function PricingPage() {
  return (
    <div className='min-h-screen bg-background text-foreground'>
      {/* Header */}
      <div className='bg-gradient-to-r from-[var(--primary-primary)] to-[var(--primary-secondary)] py-20'>
        <div className='container-app text-center'>
          <h1 className='text-5xl font-bold text-white mb-6'>خطط الأسعار</h1>
          <p className='text-xl text-white/90 max-w-3xl mx-auto'>
            اختر الخطة المناسبة لمركزك الصحي. جميع الخطط تشمل دعم فني ممتاز
            وضمان استرداد الأموال
          </p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className='py-20'>
        <div className='container-app'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {pricingPlans.map(plan => (
              <Card
                key={plan.id}
                className={`p-8 relative ${
                  plan.popular
                    ? 'ring-2 ring-[var(--primary-primary)] shadow-xl scale-105'
                    : ''
                }`}
              >
                {plan.popular && (
                  <div className='absolute -top-4 left-1/2 transform -translate-x-1/2'>
                    <Badge className='badge-primary px-4 py-2'>
                      الأكثر شعبية
                    </Badge>
                  </div>
                )}

                <div className='text-center mb-8'>
                  <h3 className='text-2xl font-bold text-foreground mb-2'>
                    {plan.name}
                  </h3>
                  <p className='text-muted-foreground mb-4'>
                    {plan.description}
                  </p>
                  <div className='mb-4'>
                    <span className='text-5xl font-bold text-[var(--primary-primary)]'>
                      {plan.price}
                    </span>
                    <span className='text-muted-foreground ml-2'>
                      {plan.period}
                    </span>
                  </div>
                </div>

                <div className='space-y-4 mb-8'>
                  {plan.features.map((feature, index) => (
                    <div key={index} className='flex items-center gap-3'>
                      <div className='h-5 w-5 rounded-full bg-green-100 flex items-center justify-center'>
                        <span className='text-green-600 text-sm'>✓</span>
                      </div>
                      <span className='text-foreground'>{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  className={`w-full ${
                    plan.popular ? 'btn-primary' : 'btn-outline'
                  }`}
                >
                  {plan.cta}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className='py-20 bg-[var(--primary-surface)]'>
        <div className='container-app'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl font-bold text-foreground mb-4'>
              الأسئلة الشائعة
            </h2>
            <p className='text-xl text-muted-foreground'>
              إجابات على أكثر الأسئلة شيوعاً حول خطط الأسعار
            </p>
          </div>

          <div className='max-w-3xl mx-auto space-y-6'>
            {faqs.map(faq => (
              <Card key={faq.id} className='p-6'>
                <h3 className='text-lg font-semibold text-foreground mb-3'>
                  {faq.question}
                </h3>
                <p className='text-muted-foreground'>{faq.answer}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className='py-20'>
        <div className='container-app text-center'>
          <h2 className='text-4xl font-bold text-foreground mb-6'>
            جاهز للبدء؟
          </h2>
          <p className='text-xl text-muted-foreground mb-8 max-w-2xl mx-auto'>
            ابدأ رحلتك مع منصة مُعين اليوم واستمتع بفترة تجريبية مجانية لمدة 14
            يوم
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Button className='btn-primary btn-lg'>
              ابدأ التجربة المجانية
            </Button>
            <Button className='btn-outline btn-lg'>تواصل معنا</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
