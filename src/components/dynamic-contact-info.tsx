'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ContactInfo {
  id: number;
  type: 'phone' | 'email' | 'location';
  title: string;
  value: string;
  icon: string;
  link: string;
  color: string;
}

export default function DynamicContactInfo() {
  const [contactInfo, setContactInfo] = useState<ContactInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const response = await fetch('/api/dynamic-data?type=contact');
      const data = await response.json();

      if (data.contact_info && Array.isArray(data.contact_info)) {
        setContactInfo(data.contact_info);
      } else {
        // استخدام البيانات الافتراضية
        setContactInfo([
          {
            id: 1,
            type: 'phone',
            title: 'اتصال مباشر',
            value: '+966 50 123 4567',
            icon: '📞',
            link: 'tel:+966501234567',
            color: 'bg-[var(--default-default)]',
          },
          {
            id: 2,
            type: 'email',
            title: 'البريد الإلكتروني',
            value: 'info@moeen.com',
            icon: '📧',
            link: 'mailto:info@moeen.com',
            color: 'bg-[var(--default-info)]',
          },
          {
            id: 3,
            type: 'location',
            title: 'الموقع',
            value: 'الرياض، المملكة العربية السعودية',
            icon: '📍',
            link: '/contact',
            color: 'bg-[var(--default-accent)]',
          },
        ]);
      }
    } catch (error) {
      console.error('Error fetching contact info:', error);
      // استخدام البيانات الافتراضية في حالة الخطأ
      setContactInfo([
        {
          id: 1,
          type: 'phone',
          title: 'اتصال مباشر',
          value: '+966 50 123 4567',
          icon: '📞',
          link: 'tel:+966501234567',
          color: 'bg-[var(--default-default)]',
        },
        {
          id: 2,
          type: 'email',
          title: 'البريد الإلكتروني',
          value: 'info@moeen.com',
          icon: '📧',
          link: 'mailto:info@moeen.com',
          color: 'bg-[var(--default-info)]',
        },
        {
          id: 3,
          type: 'location',
          title: 'الموقع',
          value: 'الرياض، المملكة العربية السعودية',
          icon: '📍',
          link: '/contact',
          color: 'bg-[var(--default-accent)]',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
        {[1, 2, 3].map(i => (
          <div key={i} className='card p-8 text-center animate-pulse'>
            <div className='h-16 w-16 bg-gray-200 rounded-full mx-auto mb-4'></div>
            <div className='h-6 bg-gray-200 rounded mb-2'></div>
            <div className='h-4 bg-gray-200 rounded mb-4'></div>
            <div className='h-10 bg-gray-200 rounded'></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
      {contactInfo.map(contact => (
        <div key={contact.id} className='card p-8 text-center'>
          <div
            className={`h-16 w-16 ${contact.color} text-white rounded-full flex items-center justify-center mx-auto mb-4`}
          >
            {contact.icon}
          </div>
          <h3 className='text-xl font-bold text-foreground mb-2'>
            {contact.title}
          </h3>
          <p className='text-muted-foreground mb-4'>{contact.value}</p>
          <Link href={contact.link} className='btn btn-outline'>
            {contact.type === 'phone'
              ? 'اتصل الآن'
              : contact.type === 'email'
                ? 'أرسل رسالة'
                : 'اعرف المزيد'}
          </Link>
        </div>
      ))}
    </div>
  );
}
