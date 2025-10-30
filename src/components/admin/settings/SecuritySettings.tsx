'use client';

import { AdminCard } from '@/components/admin/ui';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Switch } from '@/components/ui/Switch';
import { Key, Lock, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SecurityConfig {
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    maxAge: number;
  };
  sessionManagement: {
    maxDuration: number;
    idleTimeout: number;
    maxConcurrentSessions: number;
  };
  twoFactorAuth: {
    enabled: boolean;
    required: boolean;
    methods: string[];
  };
  ipWhitelist: {
    enabled: boolean;
    allowedIps: string[];
  };
}

interface SecuritySettingsProps {
  onChange: () => void;
}

const defaultConfig: SecurityConfig = {
  passwordPolicy: {
    minLength: 8,
    requireUppercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    maxAge: 90
  },
  sessionManagement: {
    maxDuration: 480,
    idleTimeout: 30,
    maxConcurrentSessions: 3
  },
  twoFactorAuth: {
    enabled: true,
    required: false,
    methods: ['sms', 'email']
  },
  ipWhitelist: {
    enabled: false,
    allowedIps: []
  }
};

export default function SecuritySettings({ onChange }: SecuritySettingsProps) {
  const [config, setConfig] = useState<SecurityConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSecuritySettings = async () => {
      try {
        const response = await fetch('/api/admin/settings/security');
        const result = await response.json();
        
        if (result.success && result.data) {
          setConfig(prev => ({ ...prev, ...result.data }));
        }
      } catch (error) {
        console.error('Error loading security settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSecuritySettings();
  }, []);

  const updateConfig = (section: keyof SecurityConfig, updates: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: { ...prev[section], ...updates }
    }));
    onChange();
  };

  if (loading) {
    return <div className='h-32 bg-[var(--brand-surface)] rounded-lg animate-pulse' />;
  }

  return (
    <div className='space-y-8'>
      {/* Password Policy */}
      <AdminCard className='space-y-6'>
        <div className='flex items-center gap-3 pb-4 border-b border-[var(--brand-border)]'>
          <Lock className='w-6 h-6 text-[var(--brand-primary)]' />
          <h3 className='text-lg font-semibold text-[var(--text-primary)]'>سياسة كلمات المرور</h3>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='space-y-2'>
            <Label>الحد الأدنى للطول</Label>
            <Input
              type='number'
              value={config.passwordPolicy.minLength}
              onChange={(e) => updateConfig('passwordPolicy', { minLength: parseInt(e.target.value) })}
              min={6}
              max={128}
            />
          </div>

          <div className='space-y-2'>
            <Label>انتهاء صلاحية كلمة المرور (أيام)</Label>
            <Input
              type='number'
              value={config.passwordPolicy.maxAge}
              onChange={(e) => updateConfig('passwordPolicy', { maxAge: parseInt(e.target.value) })}
              min={30}
              max={365}
            />
          </div>

          <div className='space-y-4 md:col-span-2'>
            {[
              { key: 'requireUppercase', label: 'يتطلب أحرف كبيرة' },
              { key: 'requireNumbers', label: 'يتطلب أرقام' },
              { key: 'requireSpecialChars', label: 'يتطلب رموز خاصة' }
            ].map(({ key, label }) => (
              <div key={key} className='flex items-center justify-between'>
                <Label>{label}</Label>
                <Switch
                  checked={config.passwordPolicy[key as keyof typeof config.passwordPolicy] as boolean}
                  onCheckedChange={(enabled) => updateConfig('passwordPolicy', { [key]: enabled })}
                />
              </div>
            ))}
          </div>
        </div>
      </AdminCard>

      {/* Two Factor Authentication */}
      <AdminCard className='space-y-6'>
        <div className='flex items-center gap-3 pb-4 border-b border-[var(--brand-border)]'>
          <Key className='w-6 h-6 text-[var(--brand-primary)]' />
          <h3 className='text-lg font-semibold text-[var(--text-primary)]'>المصادقة الثنائية</h3>
        </div>

        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <Label>تفعيل المصادقة الثنائية</Label>
            <Switch
              checked={config.twoFactorAuth.enabled}
              onCheckedChange={(enabled) => updateConfig('twoFactorAuth', { enabled })}
            />
          </div>

          {config.twoFactorAuth.enabled && (
            <div className='flex items-center justify-between'>
              <Label>إجباري لجميع المستخدمين</Label>
              <Switch
                checked={config.twoFactorAuth.required}
                onCheckedChange={(required) => updateConfig('twoFactorAuth', { required })}
              />
            </div>
          )}
        </div>
      </AdminCard>

      {/* Security Status */}
      <AdminCard className='bg-gradient-to-r from-green-50 to-transparent border-green-200'>
        <div className='flex items-center gap-4'>
          <div className='w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center'>
            <Shield className='w-6 h-6 text-green-600' />
          </div>
          <div>
            <h4 className='font-semibold text-green-800 mb-1'>حالة الأمان</h4>
            <p className='text-sm text-green-600'>النظام محمي ومؤمن بالكامل</p>
          </div>
        </div>
      </AdminCard>
    </div>
  );
}

