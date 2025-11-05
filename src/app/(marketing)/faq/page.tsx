'use client';
import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

const faqCategories = [
  { id: 'general', name: 'عام', icon: 'ℹ️' },
  { id: 'technical', name: 'تقني', icon: '🔧' },
  { id: 'billing', name: 'الفوترة', icon: '💳' },
  { id: 'support', name: 'الدعم', icon: '🛠️' },
];

const faqs = [
  {
    id: 1,
    category: 'general',
    question: 'ما هو مُعين؟',
    answer:
      'مُعين هو منصة شاملة لإدارة المراكز الصحية، مصممة خصيصاً لمراكز العلاج الطبيعي والوظيفي. نقدم حلولاً متكاملة لإدارة المرضى والمواعيد والمطالبات التأمينية مع دعم الذكاء الاصطناعي.',
  },
  {
    id: 2,
    category: 'general',
    question: 'هل منصة مُعين آمنة؟',
    answer:
      'نعم، نحن نتبع أعلى معايير الأمان في الصناعة. جميع البيانات مشفرة ومحمية، ونلتزم بمعايير HIPAA وGDPR لحماية خصوصية المرضى.',
  },
  {
    id: 3,
    category: 'technical',
    question: 'هل يمكنني الوصول إلى منصة مُعين من أي جهاز؟',
    answer:
      'نعم، منصة مُعين متوافقة مع جميع الأجهزة - أجهزة الكمبيوتر، الأجهزة اللوحية، والهواتف الذكية. يمكنك الوصول إلى جميع المميزات من أي مكان وفي أي وقت.',
  },
  {
    id: 4,
    category: 'technical',
    question: 'هل يمكنني تخصيص المنصة حسب احتياجاتي؟',
    answer:
      'نعم، نقدم خيارات تخصيص واسعة. يمكنك تخصيص النماذج، التقارير، والواجهات حسب احتياجات مركزك الصحي. كما نقدم API مخصص للخطة المؤسسية.',
  },
  {
    id: 5,
    category: 'billing',
    question: 'ما هي طرق الدفع المتاحة؟',
    answer:
      'نقبل جميع طرق الدفع الرئيسية بما في ذلك البطاقات الائتمانية، التحويل البنكي، والدفع الإلكتروني. كما نقدم خصم 20% للدفع السنوي.',
  },
  {
    id: 6,
    category: 'billing',
    question: 'هل يمكنني إلغاء الاشتراك في أي وقت؟',
    answer:
      'نعم، يمكنك إلغاء الاشتراك في أي وقت. لا توجد عقود طويلة الأجل، ويمكنك تصدير جميع بياناتك قبل الإلغاء.',
  },
  {
    id: 7,
    category: 'support',
    question: 'ما نوع الدعم الفني المتاح؟',
    answer:
      'نقدم دعم فني شامل عبر البريد الإلكتروني، الهاتف، والدردشة المباشرة. كما نقدم تدريب مجاني ومواد تعليمية شاملة لجميع المستخدمين.',
  },
  {
    id: 8,
    category: 'support',
    question: 'كم من الوقت يستغرق إعداد المنصة؟',
    answer:
      'يمكنك البدء في استخدام المنصة خلال دقائق من التسجيل. الإعداد الكامل والتدريب يستغرق عادة 1-2 أسبوع حسب حجم مركزك الصحي.',
  },
  {
    id: 9,
    category: 'general',
    question: 'هل يمكنني تجربة المنصة قبل الاشتراك؟',
    answer:
      'نعم، نقدم فترة تجريبية مجانية لمدة 14 يوم لجميع الخطط المدفوعة. يمكنك استكشاف جميع المميزات بدون الحاجة لبطاقة ائتمان.',
  },
  {
    id: 10,
    category: 'technical',
    question: 'هل يمكنني تصدير بياناتي؟',
    answer:
      'نعم، يمكنك تصدير جميع بياناتك في أي وقت بصيغ مختلفة (CSV, PDF, Excel). كما نقدم خدمة نقل البيانات المجانية عند الانتقال من منصة أخرى.',
  },
];

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const filteredFAQs =
    selectedCategory === 'all'
      ? faqs
      : faqs.filter(faq => faq.category === selectedCategory);

  const toggleFAQ = (id: number) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <div className='min-h-screen bg-background text-foreground'>
      {/* Header */}
      <div className='bg-gradient-to-r from-[var(--default-default)] to-[var(--default-info)] py-20'>
        <div className='container-app text-center'>
          <h1 className='text-5xl font-bold text-white mb-6'>
            الأسئلة الشائعة
          </h1>
          <p className='text-xl text-white/90 max-w-3xl mx-auto'>
            ابحث عن إجابات لأسئلتك حول منصة مُعين وكيف يمكنها مساعدة مركزك الصحي
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className='py-12 bg-[var(--default-surface)]'>
        <div className='container-app'>
          <div className='flex flex-wrap justify-center gap-4'>
            <Button
              onClick={() => setSelectedCategory('all')}
              className={`btn ${
                selectedCategory === 'all' ? 'btn-default' : 'btn-ghost'
              }`}
            >
              جميع الأسئلة
            </Button>
            {faqCategories.map(category => (
              <Button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`btn ${
                  selectedCategory === category.id ? 'btn-default' : 'btn-ghost'
                }`}
              >
                <span className='mr-2'>{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ List */}
      <div className='py-20'>
        <div className='container-app'>
          <div className='max-w-4xl mx-auto space-y-6'>
            {filteredFAQs.map(faq => (
              <Card key={faq.id} className='p-6'>
                <button
                  onClick={() => { toggleFAQ(faq.id) }}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleFAQ(faq.id); } }}
                  aria-label={`${faq.question} - اضغط للفتح/الإغلاق`}
                  className='w-full text-left flex items-center justify-between'
                >
                  <h3 className='text-lg font-semibold text-foreground pr-4'>
                    {faq.question}
                  </h3>
                  <div className='flex items-center gap-2'>
                    <Badge className='badge-info'>
                      {faqCategories.find(cat => cat.id === faq.category)?.name}
                    </Badge>
                    <span className='text-2xl text-[var(--default-default)]'>
                      {openFAQ === faq.id ? '−' : '+'}
                    </span>
                  </div>
                </button>

                {openFAQ === faq.id && (
                  <div className='mt-4 pt-4 border-t border-gray-200 dark:border-gray-700'>
                    <p className='text-muted-foreground leading-relaxed'>
                      {faq.answer}
                    </p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Support */}
      <div className='py-20 bg-[var(--default-surface)]'>
        <div className='container-app text-center'>
          <h2 className='text-4xl font-bold text-foreground mb-6'>
            لم تجد إجابتك؟
          </h2>
          <p className='text-xl text-muted-foreground mb-8 max-w-2xl mx-auto'>
            فريق الدعم الفني لدينا جاهز لمساعدتك في أي وقت. تواصل معنا وسنرد
            عليك خلال 24 ساعة
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Button className='btn-default btn-lg'>تواصل مع الدعم</Button>
            <Button className='btn-outline btn-lg'>جدولة مكالمة</Button>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className='py-20'>
        <div className='container-app'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold text-foreground mb-4'>
              روابط مفيدة
            </h2>
            <p className='text-muted-foreground'>
              موارد إضافية لمساعدتك في الاستفادة القصوى من منصة مُعين
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <Card className='p-6 text-center'>
              <div className='h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <span className='text-2xl'>📚</span>
              </div>
              <h3 className='text-xl font-bold text-foreground mb-2'>
                دليل المستخدم
              </h3>
              <p className='text-muted-foreground mb-4'>
                دليل شامل لاستخدام جميع مميزات المنصة
              </p>
              <Button className='btn-outline'>اقرأ الدليل</Button>
            </Card>

            <Card className='p-6 text-center'>
              <div className='h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <span className='text-2xl'>🎥</span>
              </div>
              <h3 className='text-xl font-bold text-foreground mb-2'>
                فيديوهات تعليمية
              </h3>
              <p className='text-muted-foreground mb-4'>
                شروحات مرئية لجميع المميزات والإعدادات
              </p>
              <Button className='btn-outline'>شاهد الفيديوهات</Button>
            </Card>

            <Card className='p-6 text-center'>
              <div className='h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <span className='text-2xl'>💬</span>
              </div>
              <h3 className='text-xl font-bold text-foreground mb-2'>
                مجتمع المستخدمين
              </h3>
              <p className='text-muted-foreground mb-4'>
                انضم إلى مجتمع المستخدمين وشارك تجربتك
              </p>
              <Button className='btn-outline'>انضم للمجتمع</Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
