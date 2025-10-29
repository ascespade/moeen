'use client';

import { useEffect, useState } from 'react';

// Updated to use centralized CSS variables from centralized.css
const colorPalette = [
  {
    name: 'البرتقالي الأساسي',
    value: 'var(--brand-primary)',
    description: 'اللون الرئيسي للمنصة',
    usage: 'الأزرار، الروابط، العناصر التفاعلية',
    cssVar: '--brand-primary',
  },
  {
    name: 'البرتقالي الثانوي',
    value: 'var(--brand-secondary)',
    description: 'لون ثانوي للتمييز',
    usage: 'الخلفيات الثانوية، التباين',
    cssVar: '--brand-secondary',
  },
  {
    name: 'الأزرق المميز',
    value: 'var(--brand-accent)',
    description: 'لون مميز للمعلومات',
    usage: 'الروابط، المعلومات المهمة',
    cssVar: '--brand-accent',
  },
  {
    name: 'الأخضر للنجاح',
    value: 'var(--brand-success)',
    description: 'لون النجاح والموافقة',
    usage: 'رسائل النجاح، حالات الإكمال',
    cssVar: '--brand-success',
  },
  {
    name: 'الأصفر للتحذير',
    value: 'var(--brand-warning)',
    description: 'لون التحذير والتنبيه',
    usage: 'رسائل التحذير، التنبيهات',
    cssVar: '--brand-warning',
  },
  {
    name: 'الأحمر للخطأ',
    value: 'var(--brand-error)',
    description: 'لون الخطأ والرفض',
    usage: 'رسائل الخطأ، حالات الفشل',
    cssVar: '--brand-error',
  },
  {
    name: 'الأزرق للمعلومات',
    value: 'var(--brand-info)',
    description: 'لون المعلومات العامة',
    usage: 'التلميحات، المعلومات الإضافية',
    cssVar: '--brand-info',
  },
];

export default function ColorPalettePage() {
  const [computedColors, setComputedColors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Get computed values of CSS variables
    const root = document.documentElement;
    const computed: Record<string, string> = {};
    
    colorPalette.forEach(color => {
      if (color.cssVar) {
        const computedValue = getComputedStyle(root).getPropertyValue(color.cssVar).trim();
        computed[color.cssVar] = computedValue || color.value;
      }
    });
    
    setComputedColors(computed);
  }, []);

  return (
    <div className='min-h-screen bg-background text-foreground'>
      {/* Header */}
      <div className='bg-gradient-to-r from-[var(--default-default)] to-[var(--default-info)] py-20'>
        <div className='container-app text-center'>
          <h1 className='text-5xl font-bold text-white mb-6'>لوحة الألوان</h1>
          <p className='text-xl text-white/90 max-w-3xl mx-auto'>
            نظام الألوان المستخدم في منصة مُعين - مركز الهمم
          </p>
        </div>
      </div>

      {/* Color Palette */}
      <div className='py-20'>
        <div className='container-app'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {colorPalette.map((color, index) => (
              <div
                key={index}
                className='card p-6 group hover:shadow-xl transition-all duration-300'
              >
                <div className='flex items-center gap-4 mb-4'>
                  <div
                    className='w-16 h-16 rounded-lg shadow-md'
                    style={{ backgroundColor: color.cssVar ? computedColors[color.cssVar] || color.value : color.value }}
                  ></div>
                  <div>
                    <h3 className='text-lg font-bold text-foreground'>
                      {color.name}
                    </h3>
                    <p className='text-xs text-muted-foreground font-mono mb-1'>
                      {color.cssVar || 'N/A'}
                    </p>
                    <p className='text-sm text-muted-foreground font-mono'>
                      {color.cssVar ? computedColors[color.cssVar] || 'جاري التحميل...' : color.value}
                    </p>
                  </div>
                </div>

                <p className='text-muted-foreground mb-3'>
                  {color.description}
                </p>

                <div className='text-sm'>
                  <p className='font-medium text-foreground mb-1'>الاستخدام:</p>
                  <p className='text-muted-foreground'>{color.usage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Usage Guidelines */}
      <div className='py-20 bg-[var(--default-surface)]'>
        <div className='container-app'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl font-bold text-foreground mb-4'>
              إرشادات الاستخدام
            </h2>
            <p className='text-xl text-muted-foreground'>
              كيفية استخدام نظام الألوان بشكل صحيح
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <div className='card p-8'>
              <h3 className='text-2xl font-bold text-foreground mb-4'>
                الألوان الأساسية
              </h3>
              <ul className='space-y-3 text-muted-foreground'>
                <li className='flex items-center gap-2'>
                  <div className='w-4 h-4 rounded bg-[var(--default-default)]'></div>
                  <span>استخدم البرتقالي للأزرار والروابط الرئيسية</span>
                </li>
                <li className='flex items-center gap-2'>
                  <div className='w-4 h-4 rounded bg-[var(--default-info)]'></div>
                  <span>استخدم الأخضر للحالات الإيجابية</span>
                </li>
                <li className='flex items-center gap-2'>
                  <div className='w-4 h-4 rounded bg-[var(--default-accent)]'></div>
                  <span>استخدم الأزرق للمعلومات المهمة</span>
                </li>
              </ul>
            </div>

            <div className='card p-8'>
              <h3 className='text-2xl font-bold text-foreground mb-4'>
                الألوان الدلالية
              </h3>
              <ul className='space-y-3 text-muted-foreground'>
                <li className='flex items-center gap-2'>
                  <div className='w-4 h-4 rounded bg-green-500'></div>
                  <span>الأخضر للنجاح والموافقة</span>
                </li>
                <li className='flex items-center gap-2'>
                  <div className='w-4 h-4 rounded bg-yellow-500'></div>
                  <span>الأصفر للتحذير والتنبيه</span>
                </li>
                <li className='flex items-center gap-2'>
                  <div className='w-4 h-4 rounded bg-red-500'></div>
                  <span>الأحمر للخطأ والرفض</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Variables */}
      <div className='py-20'>
        <div className='container-app'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl font-bold text-foreground mb-4'>
              متغيرات CSS
            </h2>
            <p className='text-xl text-muted-foreground'>
              كيفية استخدام الألوان في CSS
            </p>
          </div>

          <div className='card p-8'>
            <h3 className='text-2xl font-bold text-foreground mb-6'>
              أمثلة على الاستخدام
            </h3>
            <div className='space-y-4'>
              <div className='bg-gray-100 dark:bg-gray-800 p-4 rounded-lg'>
                <code className='text-sm text-gray-800 dark:text-gray-200'>
                  {`/* استخدام الألوان في CSS */
.btn-default {
  background-color: var(--default-default);
  color: white;
}

.text-success {
  color: var(--semantic-success);
}

.bg-warning {
  background-color: var(--semantic-warning);
}`}
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
