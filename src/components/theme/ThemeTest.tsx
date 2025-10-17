/**
 * Theme Test - اختبار الثيم
 * Component to test theme system functionality
 * مكون لاختبار وظائف نظام الثيم
 */

"use client";

import React from 'react';
import { useTheme, useThemeAware, useDesignTokens } from '@/core/theme';
import { ThemeToggle, ThemeStatus } from './ThemeToggle';

export function ThemeTest() {
  const { theme, resolvedTheme, isDark, isLight, isSystem } = useTheme();
  const { getThemeClass, getThemeValue } = useThemeAware();
  const designTokens = useDesignTokens();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary">
          اختبار نظام الثيمات
        </h1>
        <ThemeToggle size="lg" showLabels />
      </div>

      {/* Theme Status */}
      <div className="p-4 bg-panel border border-border rounded-lg">
        <h2 className="text-lg font-semibold text-text-primary mb-2">
          حالة الثيم
        </h2>
        <ThemeStatus />
      </div>

      {/* Color Palette Test */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-text-primary">
          لوحة الألوان
        </h2>
        
        {/* Brand Colors */}
        <div className="space-y-2">
          <h3 className="text-md font-medium text-text-secondary">الألوان الأساسية</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="w-full h-16 bg-brand-primary rounded-lg border border-border"></div>
              <p className="text-sm text-text-secondary">Primary</p>
            </div>
            <div className="space-y-2">
              <div className="w-full h-16 bg-brand-secondary rounded-lg border border-border"></div>
              <p className="text-sm text-text-secondary">Secondary</p>
            </div>
            <div className="space-y-2">
              <div className="w-full h-16 bg-brand-accent rounded-lg border border-border"></div>
              <p className="text-sm text-text-secondary">Accent</p>
            </div>
            <div className="space-y-2">
              <div className="w-full h-16 bg-brand-success rounded-lg border border-border"></div>
              <p className="text-sm text-text-secondary">Success</p>
            </div>
          </div>
        </div>

        {/* Neutral Colors */}
        <div className="space-y-2">
          <h3 className="text-md font-medium text-text-secondary">الألوان المحايدة</h3>
          <div className="grid grid-cols-5 gap-2">
            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
              <div key={shade} className="space-y-1">
                <div 
                  className="w-full h-12 rounded border border-border"
                  style={{ backgroundColor: `var(--neutral-${shade})` }}
                ></div>
                <p className="text-xs text-text-muted text-center">{shade}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Component Test */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-text-primary">
          اختبار المكونات
        </h2>
        
        {/* Buttons */}
        <div className="space-y-2">
          <h3 className="text-md font-medium text-text-secondary">الأزرار</h3>
          <div className="flex flex-wrap gap-3">
            <button className="btn btn-primary">أساسي</button>
            <button className="btn btn-secondary">ثانوي</button>
            <button className="btn btn-outline">محدود</button>
            <button className="btn btn-ghost">شبح</button>
          </div>
        </div>

        {/* Cards */}
        <div className="space-y-2">
          <h3 className="text-md font-medium text-text-secondary">البطاقات</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card p-4">
              <h4 className="font-semibold text-text-primary mb-2">بطاقة عادية</h4>
              <p className="text-text-secondary">هذه بطاقة عادية مع خلفية وحدود</p>
            </div>
            <div className="card-elevated p-4">
              <h4 className="font-semibold text-text-primary mb-2">بطاقة مرتفعة</h4>
              <p className="text-text-secondary">هذه بطاقة مرتفعة مع ظل إضافي</p>
            </div>
            <div className="card p-4">
              <h4 className="font-semibold text-text-primary mb-2">بطاقة مسطحة</h4>
              <p className="text-text-secondary">هذه بطاقة مسطحة بدون ظل</p>
            </div>
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-2">
          <h3 className="text-md font-medium text-text-secondary">حقول الإدخال</h3>
          <div className="space-y-3 max-w-md">
            <input 
              type="text" 
              placeholder="حقل إدخال عادي" 
              className="input"
            />
            <input 
              type="text" 
              placeholder="حقل إدخال مع خطأ" 
              className="input-error"
            />
            <input 
              type="text" 
              placeholder="حقل إدخال معطل" 
              className="input"
              disabled
            />
          </div>
        </div>
      </div>

      {/* Text Test */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-text-primary">
          اختبار النصوص
        </h2>
        <div className="space-y-2">
          <p className="text-text-primary text-lg">نص أساسي - Primary Text</p>
          <p className="text-text-secondary">نص ثانوي - Secondary Text</p>
          <p className="text-text-muted">نص خافت - Muted Text</p>
          <p className="text-brand-primary font-semibold">نص مميز - Accent Text</p>
        </div>
      </div>

      {/* Theme-Aware Test */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-text-primary">
          اختبار الوعي بالثيم
        </h2>
        <div className="p-4 bg-panel border border-border rounded-lg">
          <p className="text-text-primary mb-2">
            هذا النص يتغير تلقائياً حسب الثيم
          </p>
          <div className="flex items-center space-x-2 space-x-reverse">
            <div className="w-4 h-4 bg-brand-primary rounded"></div>
            <span className="text-text-secondary">
              اللون الأساسي يبقى ثابتاً
            </span>
          </div>
        </div>
      </div>

      {/* Design Tokens Info */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-text-primary">
          معلومات رموز التصميم
        </h2>
        <div className="p-4 bg-panel border border-border rounded-lg">
          <pre className="text-sm text-text-secondary overflow-auto">
            {JSON.stringify({
              theme,
              resolvedTheme,
              isDark,
              isLight,
              isSystem,
              brandColors: designTokens.colors.brand,
            }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default ThemeTest;
