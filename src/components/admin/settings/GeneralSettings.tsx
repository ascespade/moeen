'use client';

import { AdminCard } from '@/components/admin/ui';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import {
    Building2,
    Calendar,
    Clock,
    DollarSign,
    Globe,
    Mail,
    MapPin,
    Phone
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface GeneralConfig {
  centerName: string;
  centerNameEn: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  description: string;
  businessHours: {
    start: string;
    end: string;
    days: string[];
  };
  timezone: string;
  locale: string;
  currency: string;
  dateFormat: string;
  timeFormat: string;
}

interface GeneralSettingsProps {
  onChange: () => void;
  onSave?: (data: GeneralConfig) => Promise<void>;
}

const defaultConfig: GeneralConfig = {
  centerName: 'مركز الهمم للرعاية الصحية المتخصصة',
  centerNameEn: 'Hemam Specialized Healthcare Center',
  address: 'جدة، حي الصفا، شارع الأمير محمد بن عبدالعزيز (التحلية)',
  phone: '+966 12 234 5678',
  email: 'info@hemam.com',
  website: 'https://hemam.com',
  description: 'مركز متخصص في رعاية ذوي الاحتياجات الخاصة يقدم خدمات تأهيلية شاملة',
  businessHours: {
    start: '08:00',
    end: '18:00',
    days: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday']
  },
  timezone: 'Asia/Riyadh',
  locale: 'ar-SA',
  currency: 'SAR',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '24'
};

const weekDays = [
  { id: 'sunday', label: 'الأحد', labelEn: 'Sunday' },
  { id: 'monday', label: 'الإثنين', labelEn: 'Monday' },
  { id: 'tuesday', label: 'الثلاثاء', labelEn: 'Tuesday' },
  { id: 'wednesday', label: 'الأربعاء', labelEn: 'Wednesday' },
  { id: 'thursday', label: 'الخميس', labelEn: 'Thursday' },
  { id: 'friday', label: 'الجمعة', labelEn: 'Friday' },
  { id: 'saturday', label: 'السبت', labelEn: 'Saturday' }
];

const timezones = [
  { value: 'Asia/Riyadh', label: 'توقيت الرياض (GMT+3)' },
  { value: 'Asia/Dubai', label: 'توقيت دبي (GMT+4)' },
  { value: 'Asia/Kuwait', label: 'توقيت الكويت (GMT+3)' }
];

const currencies = [
  { value: 'SAR', label: 'ريال سعودي (SAR)', symbol: 'ر.س' },
  { value: 'AED', label: 'درهم إماراتي (AED)', symbol: 'د.إ' },
  { value: 'USD', label: 'دولار أمريكي (USD)', symbol: '$' }
];

export default function GeneralSettings({ onChange }: GeneralSettingsProps) {
  const [config, setConfig] = useState<GeneralConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGeneralSettings = async () => {
      try {
        const response = await fetch('/api/admin/settings/general');
        const result = await response.json();
        
        if (result.success && result.data) {
          setConfig(prev => ({ ...prev, ...result.data }));
        }
      } catch (error) {
        console.error('Error loading general settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGeneralSettings();
  }, []);

  const updateConfig = (updates: Partial<GeneralConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
    onChange();
  };

  const updateBusinessHours = (updates: Partial<GeneralConfig['businessHours']>) => {
    setConfig(prev => ({
      ...prev,
      businessHours: { ...prev.businessHours, ...updates }
    }));
    onChange();
  };

  const saveSettings = async () => {
    if (onSave) {
      await onSave(config);
    } else {
      // Default save to API
      try {
        const response = await fetch('/api/admin/settings/general', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(config)
        });
        
        if (!response.ok) {
          throw new Error('Failed to save settings');
        }
      } catch (error) {
        console.error('Error saving general settings:', error);
        throw error;
      }
    }
  };

  const toggleWorkDay = (day: string) => {
    const newDays = config.businessHours.days.includes(day)
      ? config.businessHours.days.filter(d => d !== day)
      : [...config.businessHours.days, day];
    
    updateBusinessHours({ days: newDays });
  };

  if (loading) {
    return (
      <div className='space-y-6'>
        {[1, 2, 3].map(i => (
          <div key={i} className='h-20 bg-[var(--brand-surface)] rounded-lg animate-pulse' />
        ))}
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      {/* Center Information */}
      <AdminCard className='space-y-6'>
        <div className='flex items-center gap-3 mb-6'>
          <Building2 className='w-6 h-6 text-[var(--brand-primary)]' />
          <h3 className='text-xl font-semibold text-[var(--text-primary)]'>معلومات المركز</h3>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='space-y-2'>
            <Label htmlFor='centerName'>اسم المركز (عربي)</Label>
            <Input
              id='centerName'
              value={config.centerName}
              onChange={(e) => updateConfig({ centerName: e.target.value })}
              className='text-right'
            />
          </div>
          
          <div className='space-y-2'>
            <Label htmlFor='centerNameEn'>اسم المركز (إنجليزي)</Label>
            <Input
              id='centerNameEn'
              value={config.centerNameEn}
              onChange={(e) => updateConfig({ centerNameEn: e.target.value })}
              className='text-left'
              dir='ltr'
            />
          </div>

          <div className='space-y-2 md:col-span-2'>
            <Label htmlFor='description'>وصف المركز</Label>
            <Textarea
              id='description'
              value={config.description}
              onChange={(e) => updateConfig({ description: e.target.value })}
              rows={3}
              className='text-right'
            />
          </div>

          <div className='space-y-2 md:col-span-2'>
            <Label htmlFor='address'>
              <MapPin className='w-4 h-4 inline ml-2' />
              العنوان
            </Label>
            <Textarea
              id='address'
              value={config.address}
              onChange={(e) => updateConfig({ address: e.target.value })}
              rows={2}
              className='text-right'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='phone'>
              <Phone className='w-4 h-4 inline ml-2' />
              رقم الهاتف
            </Label>
            <Input
              id='phone'
              value={config.phone}
              onChange={(e) => updateConfig({ phone: e.target.value })}
              dir='ltr'
              className='text-left'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='email'>
              <Mail className='w-4 h-4 inline ml-2' />
              البريد الإلكتروني
            </Label>
            <Input
              id='email'
              type='email'
              value={config.email}
              onChange={(e) => updateConfig({ email: e.target.value })}
              dir='ltr'
              className='text-left'
            />
          </div>

          <div className='space-y-2 md:col-span-2'>
            <Label htmlFor='website'>
              <Globe className='w-4 h-4 inline ml-2' />
              الموقع الإلكتروني
            </Label>
            <Input
              id='website'
              value={config.website}
              onChange={(e) => updateConfig({ website: e.target.value })}
              dir='ltr'
              className='text-left'
            />
          </div>
        </div>
      </AdminCard>

      {/* Business Hours */}
      <AdminCard className='space-y-6'>
        <div className='flex items-center gap-3 mb-6'>
          <Clock className='w-6 h-6 text-[var(--brand-primary)]' />
          <h3 className='text-xl font-semibold text-[var(--text-primary)]'>ساعات العمل</h3>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='space-y-2'>
            <Label htmlFor='startTime'>وقت البداية</Label>
            <Input
              id='startTime'
              type='time'
              value={config.businessHours.start}
              onChange={(e) => updateBusinessHours({ start: e.target.value })}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='endTime'>وقت النهاية</Label>
            <Input
              id='endTime'
              type='time'
              value={config.businessHours.end}
              onChange={(e) => updateBusinessHours({ end: e.target.value })}
            />
          </div>

          <div className='space-y-3 md:col-span-2'>
            <Label>أيام العمل</Label>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
              {weekDays.map(day => (
                <button
                  key={day.id}
                  onClick={() => toggleWorkDay(day.id)}
                  className={cn(
                    'p-3 rounded-lg border transition-all duration-200 text-sm font-medium',
                    config.businessHours.days.includes(day.id)
                      ? 'bg-[var(--brand-primary)] text-white border-[var(--brand-primary)]'
                      : 'bg-[var(--panel)] text-[var(--text-primary)] border-[var(--brand-border)] hover:bg-[var(--brand-primary)]/5'
                  )}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </AdminCard>

      {/* Localization */}
      <AdminCard className='space-y-6'>
        <div className='flex items-center gap-3 mb-6'>
          <Globe className='w-6 h-6 text-[var(--brand-primary)]' />
          <h3 className='text-xl font-semibold text-[var(--text-primary)]'>الموقع والعملة</h3>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='space-y-2'>
            <Label htmlFor='timezone'>المنطقة الزمنية</Label>
            <Select value={config.timezone} onValueChange={(value) => updateConfig({ timezone: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timezones.map(tz => (
                  <SelectItem key={tz.value} value={tz.value}>
                    {tz.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='currency'>
              <DollarSign className='w-4 h-4 inline ml-2' />
              العملة
            </Label>
            <Select value={config.currency} onValueChange={(value) => updateConfig({ currency: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map(curr => (
                  <SelectItem key={curr.value} value={curr.value}>
                    {curr.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='dateFormat'>
              <Calendar className='w-4 h-4 inline ml-2' />
              تنسيق التاريخ
            </Label>
            <Select value={config.dateFormat} onValueChange={(value) => updateConfig({ dateFormat: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='DD/MM/YYYY'>يوم/شهر/سنة</SelectItem>
                <SelectItem value='MM/DD/YYYY'>شهر/يوم/سنة</SelectItem>
                <SelectItem value='YYYY-MM-DD'>سنة-شهر-يوم</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </AdminCard>

      {/* Preview Card */}
      <AdminCard className='bg-gradient-to-r from-[var(--brand-primary)]/5 to-transparent border border-[var(--brand-primary)]/20'>
        <div className='flex items-center gap-3 mb-4'>
          <div className='w-8 h-8 rounded-lg bg-[var(--brand-primary)]/10 flex items-center justify-center'>
            <Building2 className='w-4 h-4 text-[var(--brand-primary)]' />
          </div>
          <h4 className='text-lg font-semibold text-[var(--text-primary)]'>معاينة</h4>
        </div>
        
        <div className='space-y-3 text-sm'>
          <div className='flex justify-between'>
            <span className='text-[var(--text-secondary)]'>اسم المركز:</span>
            <span className='text-[var(--text-primary)] font-medium'>{config.centerName}</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-[var(--text-secondary)]'>العنوان:</span>
            <span className='text-[var(--text-primary)] font-medium text-right max-w-xs'>{config.address}</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-[var(--text-secondary)]'>الهاتف:</span>
            <span className='text-[var(--text-primary)] font-medium' dir='ltr'>{config.phone}</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-[var(--text-secondary)]'>ساعات العمل:</span>
            <span className='text-[var(--text-primary)] font-medium'>
              {config.businessHours.start} - {config.businessHours.end}
            </span>
          </div>
          <div className='flex justify-between'>
            <span className='text-[var(--text-secondary)]'>أيام العمل:</span>
            <span className='text-[var(--text-primary)] font-medium'>
              {config.businessHours.days.length} أيام أسبوعياً
            </span>
          </div>
        </div>
      </AdminCard>
    </div>
  );
}

