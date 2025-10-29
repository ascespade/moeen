'use client';

import { X } from 'lucide-react';
import { memo } from 'react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyPolicyModal = memo(function PrivacyPolicyModal({
  isOpen,
  onClose,
}: PrivacyPolicyModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 z-[1100] flex items-center justify-center p-4 backdrop-blur-sm transition-colors'
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backgroundColor: 'var(--modal-backdrop, rgba(0, 0, 0, 0.5))',
      }}
      onClick={onClose}
    >
      <div
        className='relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl transition-all'
        style={{
          backgroundColor: 'var(--panel, var(--background))',
          border: '1px solid var(--brand-border)',
        }}
        onClick={(e) => e.stopPropagation()}
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
            سياسة الخصوصية
          </h2>
          <button
            onClick={onClose}
            className='rounded-full p-2 transition-colors'
            style={{
              backgroundColor: 'transparent',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--brand-surface, rgba(0,0,0,0.05))';
            }}
            onMouseLeave={(e) => {
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
                  1. مقدمة
                </h3>
                <p className='text-[var(--text-secondary)] leading-relaxed'>
                  نحن في مركز الهمم لرعاية ذوي الاحتياجات الخاصة في جدة نلتزم بحماية
                  خصوصيتك وسرية معلوماتك الشخصية. تشرح سياسة الخصوصية هذه كيفية جمع
                  واستخدام وحماية معلوماتك عند استخدام موقعنا الإلكتروني وخدماتنا.
                </p>
              </section>

              <section>
                <h3 className='text-xl font-bold mb-3 text-[var(--brand-primary)]'>
                  2. المعلومات التي نجمعها
                </h3>
                <p className='text-[var(--text-secondary)] leading-relaxed mb-3'>
                  قد نجمع أنواعاً مختلفة من المعلومات، بما في ذلك:
                </p>
                <ul className='list-disc list-inside space-y-2 text-[var(--text-secondary)] mr-4'>
                  <li>
                    المعلومات الشخصية: الاسم، رقم الهاتف، العنوان البريدي، البريد
                    الإلكتروني
                  </li>
                  <li>
                    المعلومات الطبية: السجلات الطبية، التاريخ المرضي، معلومات
                    التأمين الصحي
                  </li>
                  <li>
                    معلومات الاستخدام: بيانات الاستخدام، معلومات الجهاز، عنوان IP
                  </li>
                  <li>
                    ملفات تعريف الارتباط: لتحسين تجربة المستخدم وتتبع النشاط
                  </li>
                </ul>
              </section>

              <section>
                <h3 className='text-xl font-bold mb-3 text-[var(--brand-primary)]'>
                  3. كيفية استخدام المعلومات
                </h3>
                <p className='text-[var(--text-secondary)] leading-relaxed mb-3'>
                  نستخدم المعلومات التي نجمعها لـ:
                </p>
                <ul className='list-disc list-inside space-y-2 text-[var(--text-secondary)] mr-4'>
                  <li>تقديم الخدمات الطبية والتأهيلية</li>
                  <li>إدارة المواعيد والجلسات العلاجية</li>
                  <li>التواصل مع المرضى وأسرهم</li>
                  <li>تحسين جودة الخدمات</li>
                  <li>الامتثال للالتزامات القانونية والتنظيمية</li>
                  <li>إرسال الإشعارات والتحديثات</li>
                </ul>
              </section>

              <section>
                <h3 className='text-xl font-bold mb-3 text-[var(--brand-primary)]'>
                  4. حماية المعلومات
                </h3>
                <p className='text-[var(--text-secondary)] leading-relaxed'>
                  نستخدم معايير أمنية متقدمة لحماية معلوماتك الشخصية والطبية، بما في
                  ذلك التشفير، جدران الحماية، والوصول المحدود للمعلومات فقط للأشخاص
                  المصرح لهم. نلتزم بمعايير حماية البيانات الصحية (HIPAA) ولوائح
                  حماية البيانات في المملكة العربية السعودية.
                </p>
              </section>

              <section>
                <h3 className='text-xl font-bold mb-3 text-[var(--brand-primary)]'>
                  5. مشاركة المعلومات
                </h3>
                <p className='text-[var(--text-secondary)] leading-relaxed'>
                  نحن لا نبيع أو نؤجر معلوماتك الشخصية لأطراف ثالثة. قد نشارك
                  المعلومات فقط مع مقدمي الخدمات الموثوق بهم، أو عند الطلب القانوني،
                  أو لحماية حقوقنا وسلامة مرضانا.
                </p>
              </section>

              <section>
                <h3 className='text-xl font-bold mb-3 text-[var(--brand-primary)]'>
                  6. حقوقك
                </h3>
                <p className='text-[var(--text-secondary)] leading-relaxed mb-3'>
                  لديك الحق في:
                </p>
                <ul className='list-disc list-inside space-y-2 text-[var(--text-secondary)] mr-4'>
                  <li>الوصول إلى معلوماتك الشخصية</li>
                  <li>طلب تصحيح أو تحديث معلوماتك</li>
                  <li>طلب حذف معلوماتك في حالات معينة</li>
                  <li>الاعتراض على معالجة معلوماتك</li>
                  <li>سحب الموافقة على استخدام معلوماتك</li>
                </ul>
              </section>

              <section>
                <h3 className='text-xl font-bold mb-3 text-[var(--brand-primary)]'>
                  7. ملفات تعريف الارتباط
                </h3>
                <p className='text-[var(--text-secondary)] leading-relaxed'>
                  نستخدم ملفات تعريف الارتباط (Cookies) لتحسين تجربتك على موقعنا.
                  يمكنك التحكم في ملفات تعريف الارتباط من خلال إعدادات المتصفح الخاص
                  بك.
                </p>
              </section>

              <section>
                <h3 className='text-xl font-bold mb-3 text-[var(--brand-primary)]'>
                  8. التغييرات على سياسة الخصوصية
                </h3>
                <p className='text-[var(--text-secondary)] leading-relaxed'>
                  قد نحدث سياسة الخصوصية هذه من وقت لآخر. سنقوم بإشعارك بأي تغييرات
                  مهمة عن طريق نشر السياسة المحدثة على موقعنا.
                </p>
              </section>

              <section>
                <h3 className='text-xl font-bold mb-3 text-[var(--brand-primary)]'>
                  9. التواصل معنا
                </h3>
                <p className='text-[var(--text-secondary)] leading-relaxed'>
                  إذا كان لديك أي أسئلة أو مخاوف بشأن سياسة الخصوصية هذه، يرجى
                  التواصل معنا عبر:
                </p>
                <ul className='list-none space-y-2 text-[var(--text-secondary)] mt-3'>
                  <li>📧 البريد الإلكتروني: info@alhemam.sa</li>
                  <li>📞 الهاتف: 0126173693</li>
                  <li>📱 الجوال: 0555381558</li>
                  <li>
                    📍 العنوان: جدة، شارع الأمير محمد بن عبدالعزيز (التحلية)، فندق
                    دبليو إيه، الدور الثامن، حي الصفا
                  </li>
                </ul>
              </section>

              <section className='border-t border-gray-200 dark:border-gray-700 pt-6'>
                <p className='text-sm text-[var(--text-muted)]'>
                  آخر تحديث: {new Date().toLocaleDateString('ar-SA')}
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

PrivacyPolicyModal.displayName = 'PrivacyPolicyModal';
export default PrivacyPolicyModal;

