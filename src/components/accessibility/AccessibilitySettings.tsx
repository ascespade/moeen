'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Switch } from '@/components/ui/Switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import {
  Settings,
  Eye,
  Volume2,
  Keyboard,
  Mouse,
  Palette,
  Type,
  Globe,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { useAccessibility } from '@/lib/accessibility';

const AccessibilitySettings: React.FC = () => {
  const { settings, updateSettings } = useAccessibility();
  const [isOpen, setIsOpen] = useState(false);

  const handleSettingChange = (key: keyof typeof settings, value: any) => {
    updateSettings({ [key]: value });
  };

  return (
    <>
      {/* Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant='outline'
        size='sm'
        className='fixed bottom-4 left-4 z-50'
        aria-label='فتح إعدادات إمكانية الوصول'
      >
        <Settings className='w-4 h-4 mr-2' />
        إمكانية الوصول
      </Button>

      {/* Settings Panel */}
      {isOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4'>
          <Card className='w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <CardTitle className='flex items-center gap-2'>
                  <Settings className='w-5 h-5' />
                  إعدادات إمكانية الوصول
                </CardTitle>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setIsOpen(false)}
                  aria-label='إغلاق الإعدادات'
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className='space-y-6'>
              {/* Visual Settings */}
              <div className='space-y-4'>
                <h3 className='text-lg font-semibold flex items-center gap-2'>
                  <Eye className='w-5 h-5' />
                  الإعدادات البصرية
                </h3>

                {/* Font Size */}
                <div className='flex items-center justify-between'>
                  <div>
                    <label className='text-sm font-medium'>حجم الخط</label>
                    <p className='text-xs text-gray-600'>
                      اختر حجم الخط المناسب لك
                    </p>
                  </div>
                  <Select
                    value={settings.fontSize}
                    onValueChange={value =>
                      handleSettingChange('fontSize', value)
                    }
                  >
                    <SelectTrigger className='w-32'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='small'>صغير</SelectItem>
                      <SelectItem value='medium'>متوسط</SelectItem>
                      <SelectItem value='large'>كبير</SelectItem>
                      <SelectItem value='extra-large'>كبير جداً</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Contrast */}
                <div className='flex items-center justify-between'>
                  <div>
                    <label className='text-sm font-medium'>التباين</label>
                    <p className='text-xs text-gray-600'>
                      تحسين التباين للرؤية الأفضل
                    </p>
                  </div>
                  <Select
                    value={settings.contrast}
                    onValueChange={value =>
                      handleSettingChange('contrast', value)
                    }
                  >
                    <SelectTrigger className='w-32'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='normal'>عادي</SelectItem>
                      <SelectItem value='high'>عالي</SelectItem>
                      <SelectItem value='extra-high'>عالي جداً</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Color Blind Support */}
                <div className='flex items-center justify-between'>
                  <div>
                    <label className='text-sm font-medium'>
                      دعم عمى الألوان
                    </label>
                    <p className='text-xs text-gray-600'>
                      تحسين الألوان لذوي عمى الألوان
                    </p>
                  </div>
                  <Switch
                    checked={settings.colorBlindSupport}
                    onCheckedChange={checked =>
                      handleSettingChange('colorBlindSupport', checked)
                    }
                  />
                </div>

                {/* Dyslexia Support */}
                <div className='flex items-center justify-between'>
                  <div>
                    <label className='text-sm font-medium'>
                      دعم عسر القراءة
                    </label>
                    <p className='text-xs text-gray-600'>
                      تحسين الخطوط لذوي عسر القراءة
                    </p>
                  </div>
                  <Switch
                    checked={settings.dyslexiaSupport}
                    onCheckedChange={checked =>
                      handleSettingChange('dyslexiaSupport', checked)
                    }
                  />
                </div>
              </div>

              {/* Interaction Settings */}
              <div className='space-y-4'>
                <h3 className='text-lg font-semibold flex items-center gap-2'>
                  <Mouse className='w-5 h-5' />
                  إعدادات التفاعل
                </h3>

                {/* Keyboard Navigation */}
                <div className='flex items-center justify-between'>
                  <div>
                    <label className='text-sm font-medium'>
                      التنقل بالكيبورد
                    </label>
                    <p className='text-xs text-gray-600'>
                      استخدام Tab للتنقل بين العناصر
                    </p>
                  </div>
                  <Switch
                    checked={settings.keyboardNavigation}
                    onCheckedChange={checked =>
                      handleSettingChange('keyboardNavigation', checked)
                    }
                  />
                </div>

                {/* Focus Indicators */}
                <div className='flex items-center justify-between'>
                  <div>
                    <label className='text-sm font-medium'>
                      مؤشرات التركيز
                    </label>
                    <p className='text-xs text-gray-600'>
                      إظهار حدود العناصر المحددة
                    </p>
                  </div>
                  <Switch
                    checked={settings.focusIndicators}
                    onCheckedChange={checked =>
                      handleSettingChange('focusIndicators', checked)
                    }
                  />
                </div>

                {/* Voice Control */}
                <div className='flex items-center justify-between'>
                  <div>
                    <label className='text-sm font-medium'>التحكم الصوتي</label>
                    <p className='text-xs text-gray-600'>
                      استخدام الأوامر الصوتية
                    </p>
                  </div>
                  <Switch
                    checked={settings.voiceControl}
                    onCheckedChange={checked =>
                      handleSettingChange('voiceControl', checked)
                    }
                  />
                </div>
              </div>

              {/* Motion Settings */}
              <div className='space-y-4'>
                <h3 className='text-lg font-semibold flex items-center gap-2'>
                  <Type className='w-5 h-5' />
                  إعدادات الحركة
                </h3>

                {/* Reduced Motion */}
                <div className='flex items-center justify-between'>
                  <div>
                    <label className='text-sm font-medium'>تقليل الحركة</label>
                    <p className='text-xs text-gray-600'>
                      تقليل الرسوم المتحركة والانتقالات
                    </p>
                  </div>
                  <Switch
                    checked={settings.reducedMotion}
                    onCheckedChange={checked =>
                      handleSettingChange('reducedMotion', checked)
                    }
                  />
                </div>
              </div>

              {/* Language Settings */}
              <div className='space-y-4'>
                <h3 className='text-lg font-semibold flex items-center gap-2'>
                  <Globe className='w-5 h-5' />
                  إعدادات اللغة
                </h3>

                {/* Language */}
                <div className='flex items-center justify-between'>
                  <div>
                    <label className='text-sm font-medium'>اللغة</label>
                    <p className='text-xs text-gray-600'>اختر لغة الواجهة</p>
                  </div>
                  <Select
                    value={settings.language}
                    onValueChange={value =>
                      handleSettingChange('language', value)
                    }
                  >
                    <SelectTrigger className='w-32'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='ar'>العربية</SelectItem>
                      <SelectItem value='en'>English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Screen Reader Settings */}
              <div className='space-y-4'>
                <h3 className='text-lg font-semibold flex items-center gap-2'>
                  <Volume2 className='w-5 h-5' />
                  قارئ الشاشة
                </h3>

                {/* Screen Reader Mode */}
                <div className='flex items-center justify-between'>
                  <div>
                    <label className='text-sm font-medium'>
                      وضع قارئ الشاشة
                    </label>
                    <p className='text-xs text-gray-600'>
                      تحسين الواجهة لقارئ الشاشة
                    </p>
                  </div>
                  <Switch
                    checked={settings.screenReader}
                    onCheckedChange={checked =>
                      handleSettingChange('screenReader', checked)
                    }
                  />
                </div>
              </div>

              {/* Quick Actions */}
              <div className='pt-4 border-t'>
                <div className='flex gap-2'>
                  <Button
                    onClick={() => {
                      updateSettings({
                        fontSize: 'large',
                        contrast: 'high',
                        focusIndicators: true,
                        keyboardNavigation: true,
                      });
                    }}
                    variant='outline'
                    size='sm'
                  >
                    إعدادات سريعة
                  </Button>
                  <Button
                    onClick={() => {
                      updateSettings({
                        contrast: 'normal',
                        fontSize: 'medium',
                        screenReader: false,
                      });
                    }}
                    variant='outline'
                    size='sm'
                  >
                    إعادة تعيين
                  </Button>
                </div>
              </div>

              {/* Status Indicators */}
              <div className='pt-4 border-t'>
                <div className='space-y-2'>
                  <div className='flex items-center gap-2 text-sm'>
                    {settings.keyboardNavigation ? (
                      <CheckCircle className='w-4 h-4 text-primary-success' />
                    ) : (
                      <AlertCircle className='w-4 h-4 text-gray-400' />
                    )}
                    <span>
                      التنقل بالكيبورد{' '}
                      {settings.keyboardNavigation ? 'مفعل' : 'معطل'}
                    </span>
                  </div>
                  <div className='flex items-center gap-2 text-sm'>
                    {settings.screenReader ? (
                      <CheckCircle className='w-4 h-4 text-primary-success' />
                    ) : (
                      <AlertCircle className='w-4 h-4 text-gray-400' />
                    )}
                    <span>
                      قارئ الشاشة {settings.screenReader ? 'مفعل' : 'معطل'}
                    </span>
                  </div>
                  <div className='flex items-center gap-2 text-sm'>
                    {settings.voiceControl ? (
                      <CheckCircle className='w-4 h-4 text-primary-success' />
                    ) : (
                      <AlertCircle className='w-4 h-4 text-gray-400' />
                    )}
                    <span>
                      التحكم الصوتي {settings.voiceControl ? 'مفعل' : 'معطل'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default AccessibilitySettings;
