'use client';
import React, { useState, useEffect } from 'react';

interface DynamicService {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
}

export default function DynamicServices() {
  const [services, setServices] = useState<DynamicService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/dynamic-data?type=services');
      const data = await response.json();

      if (data.services && Array.isArray(data.services)) {
        setServices(data.services);
      } else {
        // استخدام البيانات الافتراضية
        setServices([
          {
            id: 1,
            title: 'إدارة المواعيد',
            description: 'نظام تقويم متطور لإدارة المواعيد والجلسات العلاجية',
            icon: '📅',
            color: 'text-[var(--primary-accent)]',
            bgColor: 'bg-[var(--primary-accent)]/10',
          },
          {
            id: 2,
            title: 'إدارة المرضى',
            description: 'ملفات مرضى شاملة مع سجل طبي مفصل',
            icon: '👤',
            color: 'text-[var(--primary-success)]',
            bgColor: 'bg-[var(--primary-success)]/10',
          },
          {
            id: 3,
            title: 'المطالبات التأمينية',
            description: 'إدارة وتتبع المطالبات التأمينية بسهولة',
            icon: '📋',
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
          },
          {
            id: 4,
            title: 'الشات بوت الذكي',
            description: 'مساعد ذكي للرد على استفسارات المرضى',
            icon: '🤖',
            color: 'text-[var(--primary-primary)]',
            bgColor: 'bg-[var(--primary-primary)]/10',
          },
          {
            id: 5,
            title: 'إدارة الموظفين',
            description: 'تتبع ساعات العمل والأداء للموظفين',
            icon: '👨‍⚕️',
            color: 'text-[var(--primary-error)]',
            bgColor: 'bg-[var(--primary-error)]/10',
          },
          {
            id: 6,
            title: 'التقارير والتحليلات',
            description: 'تقارير شاملة وإحصائيات مفصلة',
            icon: '📊',
            color: 'text-indigo-600',
            bgColor: 'bg-indigo-50',
          },
        ]);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      // استخدام البيانات الافتراضية في حالة الخطأ
      setServices([
        {
          id: 1,
          title: 'إدارة المواعيد',
          description: 'نظام تقويم متطور لإدارة المواعيد والجلسات العلاجية',
          icon: '📅',
          color: 'text-[var(--primary-accent)]',
          bgColor: 'bg-[var(--primary-accent)]/10',
        },
        {
          id: 2,
          title: 'إدارة المرضى',
          description: 'ملفات مرضى شاملة مع سجل طبي مفصل',
          icon: '👤',
          color: 'text-[var(--primary-success)]',
          bgColor: 'bg-[var(--primary-success)]/10',
        },
        {
          id: 3,
          title: 'المطالبات التأمينية',
          description: 'إدارة وتتبع المطالبات التأمينية بسهولة',
          icon: '📋',
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
        },
        {
          id: 4,
          title: 'الشات بوت الذكي',
          description: 'مساعد ذكي للرد على استفسارات المرضى',
          icon: '🤖',
          color: 'text-[var(--primary-primary)]',
          bgColor: 'bg-[var(--primary-primary)]/10',
        },
        {
          id: 5,
          title: 'إدارة الموظفين',
          description: 'تتبع ساعات العمل والأداء للموظفين',
          icon: '👨‍⚕️',
          color: 'text-[var(--primary-error)]',
          bgColor: 'bg-[var(--primary-error)]/10',
        },
        {
          id: 6,
          title: 'التقارير والتحليلات',
          description: 'تقارير شاملة وإحصائيات مفصلة',
          icon: '📊',
          color: 'text-indigo-600',
          bgColor: 'bg-indigo-50',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

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
            className={`h-16 w-16 ${service.bgColor} mx-auto mb-6 flex items-center justify-center rounded-full text-3xl transition-transform group-hover:scale-110 ${service.color}`}
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
}
