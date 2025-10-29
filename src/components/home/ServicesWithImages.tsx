'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { memo } from 'react';

interface Service {
  id: number;
  title: string;
  description: string;
  image: string;
  gradient: string;
  link?: string;
}

const services: Service[] = [
  {
    id: 1,
    title: 'جلسات التخاطب وعلاج التأتأة',
    description: 'برامج متخصصة لعلاج مشاكل النطق والتأتأة وتحسين مهارات التواصل لدى الأطفال والكبار',
    image: '/gallery-1.jpg',
    gradient: 'from-[var(--brand-primary)]/20 to-[var(--brand-secondary)]/20',
  },
  {
    id: 2,
    title: 'التأهيل السمعي',
    description: 'خدمات متخصصة لعلاج مشاكل الصوت والتأهيل السمعي باستخدام أحدث التقنيات',
    image: '/gallery-2.jpg',
    gradient: 'from-[var(--brand-secondary)]/20 to-[var(--brand-primary)]/20',
  },
  {
    id: 3,
    title: 'العلاج الوظيفي',
    description: 'برامج علاج وظيفي متخصصة لتحسين المهارات الحياتية اليومية والاستقلالية',
    image: '/gallery-3.jpg',
    gradient: 'from-[var(--brand-success)]/20 to-[var(--brand-primary)]/20',
  },
  {
    id: 4,
    title: 'تعديل السلوك',
    description: 'برامج شاملة ومتخصصة لتعديل السلوك وتحسين التفاعل الاجتماعي',
    image: '/gallery-4.jpg',
    gradient: 'from-[var(--brand-primary)]/20 to-[var(--brand-accent-deep)]/20',
  },
  {
    id: 5,
    title: 'التكامل الحسي',
    description: 'جلسات تكامل حسي متخصصة لتنمية المهارات الحسية والحركية',
    image: '/gallery-5.jpg',
    gradient: 'from-[var(--brand-secondary)]/20 to-[var(--brand-primary)]/20',
  },
  {
    id: 6,
    title: 'برامج التدخل المبكر',
    description: 'برامج تدخل مبكر متخصصة للأطفال لتحقيق أفضل النتائج في مراحل النمو الأولى',
    image: '/gallery-6.jpg',
    gradient: 'from-[var(--brand-primary)]/20 to-[var(--brand-secondary)]/20',
  },
];

const ServicesWithImages = memo(function ServicesWithImages() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
      {services.map((service, index) => (
        <Link
          key={service.id}
          href={service.link || '#services'}
          className='group block'
        >
          <Card className='overflow-hidden h-full hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white'>
            <div className='relative h-64 overflow-hidden'>
              <Image
                src={service.image}
                alt={service.title}
                fill
                className='object-cover transition-transform duration-500 group-hover:scale-110'
                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
              />
              <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              
              {/* Badge */}
              <div className='absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg'>
                <span className='text-sm font-semibold text-gray-900'>
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>

              {/* Hover Overlay */}
              <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center'>
                <div className='text-white text-center'>
                  <ArrowLeft className='w-8 h-8 mx-auto mb-2 transform group-hover:translate-x-2 transition-transform' />
                  <span className='font-semibold'>اكتشف المزيد</span>
                </div>
              </div>
            </div>
            
            <CardHeader className='p-6'>
              <CardTitle className='text-xl font-bold text-[var(--text-primary)] mb-2 group-hover:text-[var(--brand-primary)] transition-colors'>
                {service.title}
              </CardTitle>
            </CardHeader>
            
            <CardContent className='p-6 pt-0'>
              <p className='text-[var(--text-secondary)] leading-relaxed'>
                {service.description}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
});

ServicesWithImages.displayName = 'ServicesWithImages';
export default ServicesWithImages;

