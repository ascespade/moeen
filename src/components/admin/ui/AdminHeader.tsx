'use client';

import Image from 'next/image';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AdminHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
  gradient?: boolean;
}

export default function AdminHeader({ 
  title, 
  description, 
  children,
  className,
  gradient = true
}: AdminHeaderProps) {
  return (
    <section className={cn(
      'relative py-12 overflow-hidden',
      gradient && 'bg-gradient-to-br from-[var(--brand-primary)]/10 via-transparent to-[var(--brand-surface)]',
      className
    )}>
      {/* Decorative background pattern */}
      {gradient && (
        <div className='absolute inset-0 opacity-5 pointer-events-none'>
          <div 
            className='absolute inset-0' 
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, var(--brand-primary) 1px, transparent 0)',
              backgroundSize: '40px 40px',
            }} 
          />
        </div>
      )}
      
      <div className='container-app relative z-10'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-6'>
            <div className='flex items-center gap-4'>
              <div className='relative'>
                <div className='w-16 h-16 rounded-xl bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/20 flex items-center justify-center overflow-hidden'>
                  <Image
                    src='/logo.png'
                    alt='مركز الهمم'
                    width={40}
                    height={40}
                    className='object-contain'
                  />
                </div>
                {/* Subtle glow effect */}
                <div className='absolute inset-0 rounded-xl bg-[var(--brand-primary)]/5 animate-pulse' />
              </div>
              
              <div>
                <h1 className='text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2 animate-fadeInUp'>
                  {title}
                </h1>
                {description && (
                  <p className='text-lg text-[var(--text-secondary)] animate-fadeInUp' style={{ animationDelay: '0.1s' }}>
                    {description}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {children && (
            <div className='flex items-center gap-3 animate-fadeInUp' style={{ animationDelay: '0.2s' }}>
              {children}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export { AdminHeader };
