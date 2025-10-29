'use client';

import { CONTACT_INFO } from '@/lib/constants/ui';
import { toArabicNumbers } from '@/lib/utils/numbers';
import { Mail, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';
import { memo, useEffect, useState } from 'react';

interface ContactInfo {
  id: number;
  type: 'phone' | 'email' | 'location';
  title: string;
  value: string;
  icon: React.ReactNode;
  link: string;
  color: string;
}

const defaultContactInfo: ContactInfo[] = [
  {
    id: 1,
    type: 'phone',
    title: 'اتصال مباشر',
    value: toArabicNumbers(`${CONTACT_INFO.PHONE} / ${CONTACT_INFO.MOBILE}`),
    icon: <Phone className='w-6 h-6' />,
    link: `tel:+966126173693`,
    color: 'var(--brand-primary)',
  },
  {
    id: 2,
    type: 'email',
    title: 'البريد الإلكتروني',
    value: CONTACT_INFO.EMAIL,
    icon: <Mail className='w-6 h-6' />,
    link: `mailto:${CONTACT_INFO.EMAIL}`,
    color: 'var(--brand-info)',
  },
  {
    id: 3,
    type: 'location',
    title: 'الموقع',
    value: CONTACT_INFO.ADDRESS,
    icon: <MapPin className='w-6 h-6' />,
    link: '/contact',
    color: 'var(--brand-accent)',
  },
];

const DynamicContactInfo = memo(function DynamicContactInfo() {
  const [contactInfo, setContactInfo] = useState<ContactInfo[]>(defaultContactInfo);
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    const fetchContactInfo = async () => {
      if (hasFetched) return;
      setHasFetched(true);

      try {
        const response = await fetch('/api/dynamic-data?type=contact');
        const data = await response.json();

        if (data.contact_info && Array.isArray(data.contact_info)) {
          setContactInfo(
            data.contact_info.map((item: any) => ({
              ...item,
              icon:
                item.type === 'phone' ? (
                  <Phone className='w-6 h-6' />
                ) : item.type === 'email' ? (
                  <Mail className='w-6 h-6' />
                ) : (
                  <MapPin className='w-6 h-6' />
                ),
            }))
          );
        }
      } catch (error) {
        console.error('Error fetching contact info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, [hasFetched]);

  if (loading) {
    return (
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className='bg-[var(--panel)] p-8 text-center animate-pulse rounded-lg border border-[var(--brand-border)]'
          >
            <div className='h-16 w-16 bg-[var(--brand-surface)] rounded-lg mx-auto mb-4'></div>
            <div className='h-6 bg-[var(--brand-surface)] rounded mb-2'></div>
            <div className='h-4 bg-[var(--brand-surface)] rounded mb-4'></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
      {contactInfo.map(contact => (
        <Link
          key={contact.id}
          href={contact.link}
          className='group bg-[var(--panel)] p-8 text-center rounded-lg border border-[var(--brand-border)] hover:shadow-lg transition-all duration-300 hover:-translate-y-1'
        >
          <div
            className='h-16 w-16 rounded-lg flex items-center justify-center mx-auto mb-4 text-white transition-transform group-hover:scale-110'
            style={{ backgroundColor: contact.color }}
          >
            {contact.icon}
          </div>
          <h3 className='text-xl font-bold text-[var(--text-primary)] mb-2 group-hover:text-[var(--brand-primary)] transition-colors'>
            {contact.title}
          </h3>
          <p className='text-[var(--text-secondary)] mb-4'>{contact.value}</p>
          <span className='inline-flex items-center text-sm font-medium text-[var(--brand-primary)] group-hover:underline'>
            {contact.type === 'phone'
              ? 'اتصل الآن'
              : contact.type === 'email'
                ? 'أرسل رسالة'
                : 'اعرف المزيد'}
          </span>
        </Link>
      ))}
    </div>
  );
});

DynamicContactInfo.displayName = 'DynamicContactInfo';
export default DynamicContactInfo;
