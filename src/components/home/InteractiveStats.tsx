'use client';

import { memo, useEffect, useRef, useState } from 'react';
import { useLocalizedNumber } from '@/hooks/useLocalizedNumber';
import { Users, Calendar, Star, Clock } from 'lucide-react';

interface Stat {
  id: number;
  value: number;
  label: string;
  icon: React.ElementType;
  suffix: string;
  color: string;
}

const stats: Stat[] = [
  {
    id: 1,
    value: 1247,
    label: 'مريض نشط',
    icon: Users,
    suffix: '+',
    color: 'text-[var(--brand-primary)]',
  },
  {
    id: 2,
    value: 3421,
    label: 'موعد مكتمل',
    icon: Calendar,
    suffix: '+',
    color: 'text-[var(--brand-info)]',
  },
  {
    id: 3,
    value: 98,
    label: 'معدل الرضا',
    icon: Star,
    suffix: '%',
    color: 'text-yellow-500',
  },
  {
    id: 4,
    value: 24,
    label: 'ساعة الدعم',
    icon: Clock,
    suffix: '/7',
    color: 'text-[var(--brand-success)]',
  },
];

const InteractiveStats = memo(function InteractiveStats() {
  const [counters, setCounters] = useState(stats.map(() => 0));
  const [hasStarted, setHasStarted] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const localizedNumber = useLocalizedNumber();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasStarted) {
            setHasStarted(true);
            stats.forEach((stat, index) => {
              const duration = 2000;
              const steps = 60;
              const increment = stat.value / steps;
              let current = 0;

              const timer = setInterval(() => {
                current += increment;
                if (current >= stat.value) {
                  setCounters((prev) => {
                    const newCounters = [...prev];
                    newCounters[index] = stat.value;
                    return newCounters;
                  });
                  clearInterval(timer);
                } else {
                  setCounters((prev) => {
                    const newCounters = [...prev];
                    newCounters[index] = Math.floor(current);
                    return newCounters;
                  });
                }
              }, duration / steps);
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [hasStarted]);

  return (
    <section
      ref={sectionRef}
      className='py-20 bg-gradient-to-br from-[var(--brand-primary)] via-[var(--brand-primary-hover)] to-[var(--brand-primary)] relative overflow-hidden'
    >
      {/* Animated Background */}
      <div className='absolute inset-0 opacity-10'>
        <div className='absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse' />
        <div className='absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse' style={{ animationDelay: '1s' }} />
      </div>

      <div className='container-app relative z-10'>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.id}
                className='text-center text-white group'
              >
                <div className='inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl mb-6 group-hover:bg-white/30 transition-all transform group-hover:scale-110'>
                  <Icon className='w-10 h-10' />
                </div>
                <div className={`text-5xl md:text-6xl font-bold mb-3 ${stat.color === 'text-yellow-500' ? 'text-yellow-300' : 'text-white'}`}>
                  {localizedNumber(`${counters[index]}${stat.suffix}`)}
                </div>
                <div className='text-lg text-white/90 font-medium'>
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
});

InteractiveStats.displayName = 'InteractiveStats';
export default InteractiveStats;

