'use client';

import React from 'react';
import CTAButton from './CTAButton';
import FeatureCard from './FeatureCard';
import StatCard from './StatCard';
// import ThemeToggle from './ThemeToggle';
import RTLToggle from './RTLToggle';
import { cn } from '@/lib/cn';

export default function DesignSystemDemo() {
  return (
    <div className='ds-container mx-auto py-8'>
      {/* Header */}
      <div className='ds-card ds-card-elevated ds-card-lg mb-8'>
        <div className='ds-card-header'>
          <h1 className='ds-card-title text-4xl font-bold text-center'>
            Dynamic Design System Demo
          </h1>
          <p className='ds-card-subtitle text-center'>
            نظام التصميم الديناميكي الشامل - كل شيء مركزي وقابل للتخصيص
          </p>
        </div>

        <div className='ds-card-content'>
          <div className='ds-flex ds-justify-center ds-gap-4 mb-6'>
            {/* <ThemeToggle showLabel={true} /> */}
            <RTLToggle showLabel={true} />
          </div>
        </div>
      </div>

      {/* Buttons Section */}
      <section className='mb-12'>
        <h2 className='text-2xl font-bold mb-6 text-center'>
          Buttons - الأزرار
        </h2>
        <div className='ds-grid ds-grid-cols-2 md:ds-grid-cols-3 lg:ds-grid-cols-6 ds-gap-4'>
          <CTAButton variant='primary' size='sm'>
            Primary
          </CTAButton>
          <CTAButton variant='secondary' size='sm'>
            Secondary
          </CTAButton>
          <CTAButton variant='outline' size='sm'>
            Outline
          </CTAButton>
          <CTAButton variant='outline' size='sm'>
            Ghost
          </CTAButton>
          <CTAButton variant='outline' size='sm'>
            Danger
          </CTAButton>
          <CTAButton variant='primary' size='sm'>
            Success
          </CTAButton>
        </div>

        <div className='ds-flex ds-justify-center ds-gap-4 mt-6'>
          <CTAButton variant='primary' size='sm'>
            XS
          </CTAButton>
          <CTAButton variant='primary' size='sm'>
            SM
          </CTAButton>
          <CTAButton variant='primary' size='md'>
            MD
          </CTAButton>
          <CTAButton variant='primary' size='lg'>
            LG
          </CTAButton>
          <CTAButton variant='primary' size='lg'>
            XL
          </CTAButton>
        </div>

        <div className='ds-flex ds-justify-center ds-gap-4 mt-6'>
          <CTAButton variant='primary'>Loading</CTAButton>
          <CTAButton variant='primary'>Disabled</CTAButton>
          <CTAButton variant='primary'>Full Width</CTAButton>
        </div>
      </section>

      {/* Cards Section */}
      <section className='mb-12'>
        <h2 className='text-2xl font-bold mb-6 text-center'>
          Cards - البطاقات
        </h2>
        <div className='ds-grid ds-grid-cols-1 md:ds-grid-cols-2 lg:ds-grid-cols-3 ds-gap-6'>
          <FeatureCard
            icon='🚀'
            title='Performance'
            description='Lightning fast performance with optimized rendering and minimal bundle size.'
            gradient='bg-gradient-to-br from-blue-500 to-purple-600'
          />
          <FeatureCard
            icon='🎨'
            title='Customizable'
            description='Fully customizable design system with dynamic theming and responsive layouts.'
            gradient='bg-gradient-to-br from-green-500 to-teal-600'
          />
          <FeatureCard
            icon='🔧'
            title='Developer Experience'
            description='Built with TypeScript, comprehensive documentation, and excellent tooling.'
            gradient='bg-gradient-to-br from-orange-500 to-red-600'
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className='mb-12'>
        <h2 className='text-2xl font-bold mb-6 text-center'>
          Statistics - الإحصائيات
        </h2>
        <div className='ds-grid ds-grid-cols-2 md:ds-grid-cols-4 ds-gap-6'>
          <StatCard
            value='99.9%'
            label='Uptime'
            gradient='bg-gradient-to-r from-green-500 to-emerald-600'
          />
          <StatCard
            value='1M+'
            label='Users'
            gradient='bg-gradient-to-r from-blue-500 to-cyan-600'
          />
          <StatCard
            value='50+'
            label='Components'
            gradient='bg-gradient-to-r from-purple-500 to-pink-600'
          />
          <StatCard
            value='24/7'
            label='Support'
            gradient='bg-gradient-to-r from-orange-500 to-yellow-600'
          />
        </div>
      </section>

      {/* Color Palette Section */}
      <section className='mb-12'>
        <h2 className='text-2xl font-bold mb-6 text-center'>
          Color Palette - لوحة الألوان
        </h2>
        <div className='ds-grid ds-grid-cols-2 md:ds-grid-cols-4 lg:ds-grid-cols-6 ds-gap-4'>
          <div className='ds-card ds-card-sm text-center'>
            <div className='w-full h-16 bg-brand-primary rounded-lg mb-2'></div>
            <p className='text-sm font-medium'>Primary</p>
          </div>
          <div className='ds-card ds-card-sm text-center'>
            <div className='w-full h-16 bg-brand-secondary rounded-lg mb-2'></div>
            <p className='text-sm font-medium'>Secondary</p>
          </div>
          <div className='ds-card ds-card-sm text-center'>
            <div className='w-full h-16 bg-brand-accent rounded-lg mb-2'></div>
            <p className='text-sm font-medium'>Accent</p>
          </div>
          <div className='ds-card ds-card-sm text-center'>
            <div className='w-full h-16 bg-semantic-success rounded-lg mb-2'></div>
            <p className='text-sm font-medium'>Success</p>
          </div>
          <div className='ds-card ds-card-sm text-center'>
            <div className='w-full h-16 bg-semantic-warning rounded-lg mb-2'></div>
            <p className='text-sm font-medium'>Warning</p>
          </div>
          <div className='ds-card ds-card-sm text-center'>
            <div className='w-full h-16 bg-semantic-error rounded-lg mb-2'></div>
            <p className='text-sm font-medium'>Error</p>
          </div>
        </div>
      </section>

      {/* Typography Section */}
      <section className='mb-12'>
        <h2 className='text-2xl font-bold mb-6 text-center'>
          Typography - الطباعة
        </h2>
        <div className='ds-card ds-card-lg'>
          <div className='ds-card-content space-y-4'>
            <h1 className='text-4xl font-bold'>Heading 1 - العنوان الرئيسي</h1>
            <h2 className='text-3xl font-semibold'>
              Heading 2 - العنوان الثانوي
            </h2>
            <h3 className='text-2xl font-medium'>Heading 3 - العنوان الفرعي</h3>
            <h4 className='text-xl font-medium'>Heading 4 - العنوان الصغير</h4>
            <p className='text-base leading-relaxed'>
              This is a paragraph with normal text. It demonstrates the default
              typography settings and how text flows naturally in the design
              system.
            </p>
            <p className='text-sm text-text-secondary'>
              This is small text used for captions, labels, and secondary
              information.
            </p>
            <p className='text-xs text-text-muted'>
              This is extra small text for fine print and legal information.
            </p>
          </div>
        </div>
      </section>

      {/* Spacing Section */}
      <section className='mb-12'>
        <h2 className='text-2xl font-bold mb-6 text-center'>
          Spacing - المسافات
        </h2>
        <div className='ds-card ds-card-lg'>
          <div className='ds-card-content'>
            <div className='space-y-4'>
              <div className='ds-flex ds-items-center ds-gap-4'>
                <div className='w-4 h-4 bg-brand-primary rounded'></div>
                <span>4px - Extra Small</span>
              </div>
              <div className='ds-flex ds-items-center ds-gap-4'>
                <div className='w-8 h-8 bg-brand-primary rounded'></div>
                <span>8px - Small</span>
              </div>
              <div className='ds-flex ds-items-center ds-gap-4'>
                <div className='w-12 h-12 bg-brand-primary rounded'></div>
                <span>12px - Medium</span>
              </div>
              <div className='ds-flex ds-items-center ds-gap-4'>
                <div className='w-16 h-16 bg-brand-primary rounded'></div>
                <span>16px - Large</span>
              </div>
              <div className='ds-flex ds-items-center ds-gap-4'>
                <div className='w-24 h-24 bg-brand-primary rounded'></div>
                <span>24px - Extra Large</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='ds-card ds-card-elevated ds-card-lg text-center'>
        <div className='ds-card-content'>
          <h3 className='text-xl font-semibold mb-2'>Dynamic Design System</h3>
          <p className='text-text-secondary mb-4'>
            نظام تصميم مركزي شامل يدعم التخصيص الديناميكي والاستجابة والوصولية
          </p>
          <div className='ds-flex ds-justify-center ds-gap-4'>
            <CTAButton variant='primary' size='sm'>
              Get Started
            </CTAButton>
            <CTAButton variant='outline' size='sm'>
              Documentation
            </CTAButton>
          </div>
        </div>
      </footer>
    </div>
  );
}
