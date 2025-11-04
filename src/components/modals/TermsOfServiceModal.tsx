'use client';

import { X } from 'lucide-react';
import { memo } from 'react';

interface TermsOfServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsOfServiceModal = memo(function TermsOfServiceModal({
  isOpen,
  onClose,
}: TermsOfServiceModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 z-[1100] flex items-center justify-center p-4 backdrop-blur-sm transition-colors'
      style={{
        backgroundColor: 'var(--modal-backdrop, rgba(0, 0, 0, 0.5))',
      }}
      tabIndex={0} onClick={onClose}
    >
      <div
        className='relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl transition-all'
        style={{
          backgroundColor: 'var(--panel, var(--background))',
          border: '1px solid var(--brand-border)',
        }}
        tabIndex={0} onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className='sticky top-0 z-10 flex items-center justify-between px-6 py-4'
          style={{
            borderBottom: '1px solid var(--brand-border)',
            backgroundColor: 'var(--panel, var(--background))',
          }}
        >
          <h2 className='text-2xl font-bold text-[var(--text-primary)]'>
            شروط الاستخدام
          </h2>
          <buttononClick={onClose} onKeyDown={(e) = aria-label="Button"> { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClose } }}
            className='rounded-full p-2 transition-colors'
            style={{
              backgroundColor: 'transparent',
            }}
            onMouseEnter={e aria-label="Button" {
              e.currentTarget.style.backgroundColor =
                'var(--brand-surface, rgba(0,0,0,0.05))';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            aria-label='إغلاق'
          >
            <X className='h-6 w-6 text-[var(--text-primary)]' />
          </button>
        </div>

        {/* Content */}
        <div className='overflow-y-auto max-h-[calc(90vh-80px)] px-6 py-8'>
          <div className='prose prose-lg max-w-none dark:prose-invert'>
            <div className='space-y-6 text-[var(--text-primary)]'>
              <section>
                <h3 className='text-xl font-bold mb-3 text-[var(--brand-primary)]'>
                  1. قبول الشروط
                </h3>
                <p className='text-[var(--text-secondary)] leading-relaxed'>
                  يرجى قراءة شروط الاستخدام هذه بعناية قبل استخدام موقع مركز
                  الهمم لرعاية ذوي الاحتياجات الخاصة وخدماته. باستخدام موقعنا أو
                  خدماتنا، أنت توافق على الالتزام بهذه الشروط. إذا كنت لا توافق
                  على هذه الشروط، يرجى عدم استخدام موقعنا.
                </p>
              </section>

              <section>
                <h3 className='text-xl font-bold mb-3 text-[var(--brand-primary)]'>
                  2. تعريفات
                </h3>
                <ul className='list-disc list-inside space-y-2 text-[var(--text-secondary)] mr-4'>
                  <li>
                    <strong>المركز:</strong> مركز الهمم لرعاية ذوي الاحتياجات
                    الخاصة في جدة
                  </li>
                  <li>
                    <strong>الموقع:</strong> يشمل موقعنا الإلكتروني وجميع
                    الصفحات والتطبيقات المرتبطة به
                  </li>
                  <li>
                    <strong>الخدمات:</strong> جميع الخدمات الطبية والتأهيلية
                    التي نقدمها
                  </li>
                  <li>
                    <strong>المستخدم:</strong> أي شخص يزور أو يستخدم موقعنا أو
                    خدماتنا
                  </li>
                </ul>
              </section>

              <section>
                <h3 className='text-xl font-bold mb-3 text-[var(--brand-primary)]'>
                  3. استخدام الموقع
                </h3>
                <p className='text-[var(--text-secondary)] leading-relaxed mb-3'>
                  عند استخدام موقعنا، أنت توافق على:
                </p>
                <ul className='list-disc list-inside space-y-2 text-[var(--text-secondary)] mr-4'>
                  <li>
                    تقديم معلومات دقيقة وصحيحة عند التسجيل أو استخدام الخدمات
                  </li>
                  <li>
                    الحفاظ على سرية معلومات تسجيل الدخول والمسؤولية عن جميع
                    الأنشطة التي تتم تحت حسابك
                  </li>
                  <li>
                    عدم استخدام الموقع لأي أغراض غير قانونية أو غير أخلاقية
                  </li>
                  <li>
                    عدم محاولة الوصول غير المصرح به إلى أي جزء من الموقع أو
                    أنظمته
                  </li>
                  <li>عدم إلحاق الضرر أو تعطيل الموقع أو خدماته</li>
                </ul>
              </section>

              <section>
                <h3 className='text-xl font-bold mb-3 text-[var(--brand-primary)]'>
                  4. الخدمات الطبية
                </h3>
                <p className='text-[var(--text-secondary)] leading-relaxed'>
                  نقدم خدمات طبية وتأهيلية متخصصة لذوي الاحتياجات الخاصة. جميع
                  الخدمات مقدمة من قبل أطباء ومختصين معتمدين. نحن نلتزم بأعلى
                  معايير الجودة والرعاية الطبية وفقاً للقوانين واللوائح
                  السعودية. يرجى ملاحظة أن المعلومات على موقعنا لا تشكل استشارة
                  طبية مباشرة ولا تحل محل الاستشارة الطبية الشخصية.
                </p>
              </section>

              <section>
                <h3 className='text-xl font-bold mb-3 text-[var(--brand-primary)]'>
                  5. المواعيد والجلسات
                </h3>
                <p className='text-[var(--text-secondary)] leading-relaxed mb-3'>
                  فيما يتعلق بالمواعيد والجلسات:
                </p>
                <ul className='list-disc list-inside space-y-2 text-[var(--text-secondary)] mr-4'>
                  <li>
                    يجب إلغاء المواعيد قبل 24 ساعة على الأقل لتجنب رسوم الإلغاء
                  </li>
                  <li>
                    عدم الحضور بدون إشعار قد يؤدي إلى فرض رسوم أو تعليق الخدمة
                  </li>
                  <li>
                    نحتفظ بالحق في تغيير أو إعادة جدولة المواعيد عند الحاجة
                  </li>
                  <li>
                    جميع الجلسات تخضع لسياسة الاسترجاع والإلغاء الموضحة عند
                    الحجز
                  </li>
                </ul>
              </section>

              <section>
                <h3 className='text-xl font-bold mb-3 text-[var(--brand-primary)]'>
                  6. الدفع والرسوم
                </h3>
                <p className='text-[var(--text-secondary)] leading-relaxed'>
                  جميع الرسوم والمدفوعات يجب أن تتم وفقاً للأسعار المعلن عنها.
                  نحن نحتفظ بالحق في تغيير الأسعار مع إشعار مسبق. يمكن أن يتم
                  الدفع نقداً أو عبر البطاقات الائتمانية أو التأمين الصحي وفقاً
                  لسياسة المركز.
                </p>
              </section>

              <section>
                <h3 className='text-xl font-bold mb-3 text-[var(--brand-primary)]'>
                  7. الملكية الفكرية
                </h3>
                <p className='text-[var(--text-secondary)] leading-relaxed'>
                  جميع محتويات الموقع، بما في ذلك النصوص، الصور، الشعارات،
                  والتقنيات مملوكة للمركز أو مرخصة له. لا يجوز نسخ، توزيع، أو
                  استخدام أي جزء من المحتوى دون الحصول على إذن كتابي مسبق.
                </p>
              </section>

              <section>
                <h3 className='text-xl font-bold mb-3 text-[var(--brand-primary)]'>
                  8. إخلاء المسؤولية
                </h3>
                <p className='text-[var(--text-secondary)] leading-relaxed'>
                  نقدم الموقع والخدمات "كما هي" و"حسب التوفر". لا نضمن أن الموقع
                  سيكون دائماً متاحاً أو خالياً من الأخطاء. المعلومات الطبية على
                  الموقع هي لأغراض إعلامية فقط ولا تحل محل الاستشارة الطبية
                  المباشرة مع أخصائي مؤهل.
                </p>
              </section>

              <section>
                <h3 className='text-xl font-bold mb-3 text-[var(--brand-primary)]'>
                  9. تحديد المسؤولية
                </h3>
                <p className='text-[var(--text-secondary)] leading-relaxed'>
                  لن نكون مسؤولين عن أي أضرار مباشرة أو غير مباشرة ناتجة عن
                  استخدام موقعنا أو خدماتنا، بما في ذلك على سبيل المثال لا
                  الحصر: فقدان البيانات، الأرباح، أو فرص الأعمال. المسؤولية
                  المحددة في حدود ما يسمح به القانون.
                </p>
              </section>

              <section>
                <h3 className='text-xl font-bold mb-3 text-[var(--brand-primary)]'>
                  10. التعديلات على الشروط
                </h3>
                <p className='text-[var(--text-secondary)] leading-relaxed'>
                  نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم إشعارك بأي
                  تغييرات مهمة عبر الموقع. استمرار استخدامك للموقع بعد التعديلات
                  يعني موافقتك على الشروط المحدثة.
                </p>
              </section>

              <section>
                <h3 className='text-xl font-bold mb-3 text-[var(--brand-primary)]'>
                  11. القانون الحاكم
                </h3>
                <p className='text-[var(--text-secondary)] leading-relaxed'>
                  تخضع هذه الشروط وتفسر وفقاً لقوانين المملكة العربية السعودية.
                  أي نزاعات تنشأ عن هذه الشروط ستخضع للاختصاص القضائي للمحاكم
                  السعودية.
                </p>
              </section>

              <section>
                <h3 className='text-xl font-bold mb-3 text-[var(--brand-primary)]'>
                  12. التواصل
                </h3>
                <p className='text-[var(--text-secondary)] leading-relaxed'>
                  إذا كان لديك أي أسئلة بشأن شروط الاستخدام هذه، يرجى التواصل
                  معنا:
                </p>
                <ul className='list-none space-y-2 text-[var(--text-secondary)] mt-3'>
                  <li>📧 البريد الإلكتروني: info@alhemam.sa</li>
                  <li>📞 الهاتف: 0126173693</li>
                  <li>📱 الجوال: 0555381558</li>
                </ul>
              </section>

              <section className='border-t border-gray-200 dark:border-gray-700 pt-6'>
                <p className='text-sm text-[var(--text-muted)]'>
                  آخر تحديث: {new Date().toLocaleDateString('ar-SA')}
                </p>
              </section>
            </section>
          </section>
        </section>
      </section>
    </section>
  );
});

TermsOfServiceModal.displayName = 'TermsOfServiceModal';
export default TermsOfServiceModal;
