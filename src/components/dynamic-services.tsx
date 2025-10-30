'use client';
import { memo, useEffect, useState } from 'react';
import {
  Calendar,
  User,
  Clipboard,
  MessageCircle,
  Users,
  BarChart3,
} from 'lucide-react';
import React from 'react';

interface DynamicService {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const defaultServices: DynamicService[] = [
  {
    id: 1,
    title: 'إدارة المواعيد',
    description: 'نظام تقويم متطور لإدارة المواعيد والجلسات العلاجية',
    icon: <Calendar className='w-6 h-6' />,
    color: 'text-[var(--brand-accent)]',
    bgColor: 'bg-[var(--brand-accent)]/10',
  },
  {
    id: 2,
    title: 'إدارة المرضى',
    description: 'ملفات مرضى شاملة مع سجل طبي مفصل',
    icon: <User className='w-6 h-6' />,
    color: 'text-[var(--brand-success)]',
    bgColor: 'bg-[var(--brand-success)]/10',
  },
  {
    id: 3,
    title: 'المطالبات التأمينية',
    description: 'إدارة وتتبع المطالبات التأمينية بسهولة',
    icon: <Clipboard className='w-6 h-6' />,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    id: 4,
    title: 'الشات بوت الذكي',
    description: 'مساعد ذكي للرد على استفسارات المرضى',
    icon: <MessageCircle className='w-6 h-6' />,
    color: 'text-[var(--brand-primary)]',
    bgColor: 'bg-[var(--brand-primary)]/10',
  },
  {
    id: 5,
    title: 'إدارة الموظفين',
    description: 'تتبع ساعات العمل والأداء للموظفين',
    icon: <Users className='w-6 h-6' />,
    color: 'text-[var(--brand-error)]',
    bgColor: 'bg-[var(--brand-error)]/10',
  },
  {
    id: 6,
    title: 'التقارير والتحليلات',
    description: 'تقارير شاملة وإحصائيات مفصلة',
    icon: <BarChart3 className='w-6 h-6' />,
    color: 'text-[var(--brand-accent)]',
    bgColor: 'bg-[var(--brand-accent)]/10',
  },
];

const DynamicServices = memo(function DynamicServices() {
  const [services, setServices] = useState<DynamicService[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      // Only fetch once
      if (hasFetched) return;
      setHasFetched(true);

      try {
        const response = await fetch('/api/dynamic-data?type=services');
        const data = await response.json();

        if (data.services && Array.isArray(data.services)) {
          setServices(data.services);
        } else {
          setServices(defaultServices);
        }
      } catch (error) {
        // Silently fail - use default services
        setServices(defaultServices);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [hasFetched]);

  if (loading) {
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div
            key={i}
            className='card card-interactive p-8 text-center animate-pulse'
          >
            <div className='h-16 w-16 bg-gray-200 rounded-full mx-auto mb-6'></div>
            <div className='h-6 bg-gray-200 rounded mb-4'></div>
            <div className='h-4 bg-gray-200 rounded'></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
      {services.map(service => (
        <div
          key={service.id}
          className='card card-interactive p-8 text-center group'
        >
          <div
            className={`h-16 w-16 ${service.bgColor} mx-auto mb-6 flex items-center justify-center rounded-full transition-transform group-hover:scale-110 ${service.color}`}
          >
            {service.icon}
          </div>
          <h3 className='text-xl font-bold text-foreground mb-4'>
            {service.title}
          </h3>
          <p className='text-muted-foreground'>{service.description}</p>
        </div>
      ))}
    </div>
  );
});

export default DynamicServices;
