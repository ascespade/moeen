'use client';

import { Button } from '@/components/ui/Button';
import { toArabicNumbers } from '@/lib/utils/numbers';
import { Phone, Send } from 'lucide-react';
import { memo, useState } from 'react';

const ContactForm = memo(function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      const formatted = value.replace(/[^\d\s+]/g, '');
      setFormData({
        ...formData,
        [name]: formatted,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

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
          phone: '',
          message: '',
        });
        setTimeout(() => setIsSubmitted(false), 5000);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className='bg-[var(--brand-success)]/10 border border-[var(--brand-success)] rounded-lg p-6 text-center'>
        <div className='w-12 h-12 bg-[var(--brand-success)] rounded-full flex items-center justify-center mx-auto mb-3'>
          <Send className='w-6 h-6 text-white' />
        </div>
        <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-1'>
          تم إرسال رسالتك بنجاح!
        </h3>
        <p className='text-sm text-[var(--text-secondary)]'>
          شكراً لتواصلك معنا. سنرد عليك في أقرب وقت ممكن.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div className='grid gap-4 sm:grid-cols-2'>
        <div>
          <label htmlFor='name' className='sr-only'>
            الاسم الكامل
          </label>
          <div className='relative'>
            <input
              type='text'
              id='name'
              name='name'
              value={formData.name}
              onChange={handleChange}
              required
              className='peer py-3 px-4 pe-11 block w-full border border-[var(--brand-border)] rounded-lg text-sm focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)] disabled:opacity-50 disabled:pointer-events-none bg-[var(--background)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)]'
              placeholder='الاسم الكامل'
            />
            <div className='absolute inset-y-0 end-0 flex items-center pointer-events-none pe-4'>
              <svg
                className='flex-shrink-0 size-4 text-[var(--text-muted)]'
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' />
                <circle cx='12' cy='7' r='4' />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor='email' className='sr-only'>
            البريد الإلكتروني
          </label>
          <div className='relative'>
            <input
              type='email'
              id='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              required
              className='peer py-3 px-4 pe-11 block w-full border border-[var(--brand-border)] rounded-lg text-sm focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)] disabled:opacity-50 disabled:pointer-events-none bg-[var(--background)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)]'
              placeholder='البريد الإلكتروني'
            />
            <div className='absolute inset-y-0 end-0 flex items-center pointer-events-none pe-4'>
              <svg
                className='flex-shrink-0 size-4 text-[var(--text-muted)]'
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <rect width='20' height='16' x='2' y='4' rx='2' />
                <path d='m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7' />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor='phone' className='sr-only'>
          رقم الهاتف
        </label>
        <div className='relative'>
          <input
            type='tel'
            id='phone'
            name='phone'
            value={formData.phone}
            onChange={handleChange}
            className='peer py-3 px-4 pe-11 block w-full border border-[var(--brand-border)] rounded-lg text-sm focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)] disabled:opacity-50 disabled:pointer-events-none bg-[var(--background)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)]'
            placeholder='رقم الهاتف'
            dir='ltr'
          />
          <div className='absolute inset-y-0 end-0 flex items-center pointer-events-none pe-4'>
            <Phone className='flex-shrink-0 size-4 text-[var(--text-muted)]' />
          </div>
        </div>
        {formData.phone && (
          <p className='mt-1 text-xs text-[var(--text-muted)]'>
            {toArabicNumbers(formData.phone)}
          </p>
        )}
      </div>

      <div>
        <label htmlFor='message' className='sr-only'>
          الرسالة
        </label>
        <textarea
          id='message'
          name='message'
          value={formData.message}
          onChange={handleChange}
          required
          rows={4}
          className='py-3 px-4 block w-full border border-[var(--brand-border)] rounded-lg text-sm focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)] disabled:opacity-50 disabled:pointer-events-none bg-[var(--background)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)]'
          placeholder='اكتب رسالتك هنا...'
        />
      </div>

      <div className='grid gap-y-4'>
        <Button
          type='submit'
          disabled={isSubmitting}
          size='lg'
          className='w-full btn-default'
        >
          {isSubmitting ? (
            <>
              <span className='animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent rounded-full ml-2' />
              جارٍ الإرسال...
            </>
          ) : (
            <>
              إرسال الرسالة
              <Send className='w-4 h-4 ml-2' />
            </>
          )}
        </Button>
      </div>
    </form>
  );
});

ContactForm.displayName = 'ContactForm';
export default ContactForm;
