'use client';

import { CONTACT_INFO } from '@/lib/constants/ui';
import { toArabicNumbers } from '@/lib/utils/numbers';
import { Clock, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import { useState } from 'react';

export default function ContactFormWithMap() {
  const [isSending, setIsSending] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
        setTimeout(() => setIsSubmitted(false), 5000);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSending(false);
    }
  };

  // Google Maps embed URL and links
  const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONTACT_INFO.ADDRESS)}`;
  const whatsappLink = `https://wa.me/966555381558`;

  const contactInfo = [
    {
      icon: <MapPin className='h-6 w-6' />,
      title: 'العنوان',
      value: CONTACT_INFO.ADDRESS,
      link: googleMapsLink,
      description: 'انقر للفتح في خرائط جوجل',
    },
    {
      icon: <Mail className='h-6 w-6' />,
      title: 'البريد الإلكتروني',
      value: CONTACT_INFO.EMAIL,
      link: `mailto:${CONTACT_INFO.EMAIL}`,
      description: 'انقر لإرسال بريد إلكتروني',
    },
    {
      icon: <Phone className='h-6 w-6' />,
      title: 'الهاتف',
      value: toArabicNumbers(CONTACT_INFO.PHONE),
      link: `tel:+966126173693`,
      description: 'انقر للاتصال',
    },
    {
      icon: <Phone className='h-6 w-6' />,
      title: 'الجوال',
      value: toArabicNumbers(CONTACT_INFO.MOBILE),
      link: `tel:+966555381558`,
      description: 'انقر للاتصال',
    },
    {
      icon: <MessageCircle className='h-6 w-6' />,
      title: 'واتساب',
      value: toArabicNumbers(CONTACT_INFO.MOBILE),
      link: whatsappLink,
      description: 'انقر للتواصل عبر واتساب',
    },
    {
      icon: <Clock className='h-6 w-6' />,
      title: 'ساعات العمل',
      value: `الأحد - الخميس: ${toArabicNumbers('8:00')} - ${toArabicNumbers('17:00')}`,
      link: '#',
      description: '',
    },
  ];

  return (
    <div className='space-y-12'>
      {/* Google Maps Section */}
      <div>
        <div className='mb-6 text-center'>
          <h3 className='mb-2 text-2xl font-bold text-[var(--text-primary)]'>
            موقعنا على الخريطة
          </h3>
          <p className='text-[var(--text-secondary)]'>
            يمكنك الوصول إلينا بسهولة من خلال الخريطة أدناه
          </p>
        </div>
        <div className='overflow-hidden rounded-2xl shadow-xl border border-[var(--brand-border)]'>
          <div className='relative w-full' style={{ height: '400px' }}>
            <iframe
              src={`https://maps.google.com/maps?q=${encodeURIComponent(CONTACT_INFO.ADDRESS)}&output=embed&hl=ar&z=15&iwloc=near`}
              width='100%'
              height='100%'
              style={{ border: 0 }}
              allowFullScreen={true}
              loading='lazy'
              referrerPolicy='no-referrer-when-downgrade'
              className='absolute inset-0 w-full h-full'
              title='موقع مركز الهمم على الخريطة'
            />
          </div>
          <div
            className='p-4'
            style={{
              backgroundColor: 'var(--panel, var(--background))',
              borderTop: '1px solid var(--brand-border)',
            }}
          >
            <a
              href={googleMapsLink}
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center justify-center gap-2 text-[var(--brand-primary)] hover:text-[var(--brand-primary-hover)] hover:underline transition-colors font-medium'
            >
              <MapPin className='h-5 w-5' />
              فتح في خرائط جوجل
            </a>
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className='grid gap-12 lg:grid-cols-2'>
        <div>
          <h2 className='mb-6 text-3xl font-bold text-[var(--text-primary)]'>
            أرسل لنا رسالة
          </h2>
          <p className='mb-8 text-lg text-[var(--text-secondary)]'>
            املأ النموذج أدناه وسنرد عليك في أقرب وقت ممكن. نحن نقدر تواصلك
            معنا ونعمل على تقديم أفضل خدمة ممكنة.
          </p>

          {isSubmitted ? (
            <div className='rounded-xl border border-[var(--brand-success)] bg-[var(--brand-success)]/10 p-6 text-center'>
              <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--brand-success)]/20'>
                <Send className='h-8 w-8 text-[var(--brand-success)]' />
              </div>
              <h3 className='mb-2 text-lg font-semibold text-[var(--text-primary)]'>
                تم إرسال رسالتك بنجاح!
              </h3>
              <p className='text-[var(--text-secondary)]'>
                شكراً لتواصلك معنا. سنرد عليك في أقرب وقت ممكن.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} className='space-y-6'>
              <div className='grid gap-6 md:grid-cols-2'>
                <div>
                  <label
                    htmlFor='home-name'
                    className='mb-2 block text-sm font-medium text-[var(--text-primary)]'
                  >
                    الاسم الكامل
                  </label>
                  <input
                    type='text'
                    id='home-name'
                    name='name'
                    value={formData.name}
                    onChange={handleChange}
                    placeholder='اسمك الكامل'
                    className='w-full rounded-lg border border-[var(--brand-border)] bg-[var(--background)] px-4 py-3 text-[var(--text-primary)] focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)] transition-all'
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor='home-email'
                    className='mb-2 block text-sm font-medium text-[var(--text-primary)]'
                  >
                    البريد الإلكتروني
                  </label>
                  <input
                    type='email'
                    id='home-email'
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    placeholder='name@example.com'
                    className='w-full rounded-lg border border-[var(--brand-border)] bg-[var(--background)] px-4 py-3 text-[var(--text-primary)] focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)] transition-all'
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor='home-subject'
                  className='mb-2 block text-sm font-medium text-[var(--text-primary)]'
                >
                  الموضوع
                </label>
                <input
                  type='text'
                  id='home-subject'
                  name='subject'
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder='موضوع الرسالة'
                  className='w-full rounded-lg border border-[var(--brand-border)] bg-[var(--background)] px-4 py-3 text-[var(--text-primary)] focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)] transition-all'
                  required
                />
              </div>

              <div>
                <label
                  htmlFor='home-message'
                  className='mb-2 block text-sm font-medium text-[var(--text-primary)]'
                >
                  الرسالة
                </label>
                <textarea
                  id='home-message'
                  name='message'
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder='نص الرسالة'
                  className='w-full rounded-lg border border-[var(--brand-border)] bg-[var(--background)] px-4 py-3 text-[var(--text-primary)] focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)] transition-all'
                  required
                />
              </div>

              <button
                type='submit'
                disabled={isSending}
                className='flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--brand-primary)] px-6 py-3 text-white transition-all hover:bg-[var(--brand-primary-hover)] disabled:cursor-not-allowed disabled:opacity-50 shadow-lg hover:shadow-xl hover:scale-105'
              >
                {isSending ? (
                  <>
                    <div className='h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent'></div>
                    جارٍ الإرسال...
                  </>
                ) : (
                  <>
                    <Send className='h-5 w-5' />
                    إرسال الرسالة
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        <div className='rounded-xl bg-[var(--panel)] p-8 border border-[var(--brand-border)]'>
          <h3 className='mb-6 text-2xl font-bold text-[var(--text-primary)]'>
            معلومات التواصل
          </h3>
          <div className='space-y-4'>
            {contactInfo.map((info, index) => (
              <a
                key={index}
                href={info.link}
                target={info.link.startsWith('http') ? '_blank' : '_self'}
                rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                className='group flex items-start gap-4 rounded-lg p-4 transition-all hover:bg-[var(--brand-primary)]/10 hover:shadow-md'
              >
                <div className='mt-1 text-[var(--brand-primary)] transition-transform group-hover:scale-110'>
                  {info.icon}
                </div>
                <div className='flex-1'>
                  <h4 className='mb-1 font-semibold text-[var(--text-primary)] transition-colors group-hover:text-[var(--brand-primary)]'>
                    {info.title}
                  </h4>
                  <p className='mb-1 text-[var(--text-secondary)] transition-colors group-hover:text-[var(--brand-primary)]'>
                    {info.value}
                  </p>
                  {info.description && info.link !== '#' && (
                    <p className='text-xs text-[var(--text-muted)] group-hover:text-[var(--brand-primary)]'>
                      {info.description}
                    </p>
                  )}
                </div>
              </a>
            ))}
          </div>

          <div className='mt-8 rounded-lg bg-[var(--brand-primary)]/10 p-6 border border-[var(--brand-primary)]/20'>
            <h4 className='mb-2 font-semibold text-[var(--text-primary)]'>
              أوقات الاستجابة
            </h4>
            <p className='text-sm text-[var(--text-secondary)]'>
              نحن نرد على جميع الرسائل خلال 24 ساعة في أيام العمل.
              للاستفسارات العاجلة، يرجى الاتصال بنا مباشرة.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

