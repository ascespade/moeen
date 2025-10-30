'use client';

import { useState, useEffect } from 'react';
import { AdminCard } from '@/components/admin/ui';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Switch } from '@/components/ui/Switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { 
  Zap, 
  Smartphone, 
  Mail, 
  CreditCard, 
  CheckCircle, 
  AlertTriangle,
  RefreshCw,
  TestTube
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface IntegrationConfig {
  whatsapp: {
    enabled: boolean;
    businessAccountId: string;
    accessToken: string;
    webhookUrl: string;
    verified: boolean;
  };
  sms: {
    enabled: boolean;
    provider: string;
    apiKey: string;
    senderId: string;
  };
  email: {
    enabled: boolean;
    provider: string;
    smtpHost: string;
    smtpPort: number;
    username: string;
    password: string;
  };
  payment: {
    enabled: boolean;
    gateway: string;
    merchantId: string;
    apiKey: string;
    testMode: boolean;
  };
}

interface IntegrationSettingsProps {
  onChange: () => void;
}

const defaultConfig: IntegrationConfig = {
  whatsapp: {
    enabled: true,
    businessAccountId: '',
    accessToken: '',
    webhookUrl: '',
    verified: false
  },
  sms: {
    enabled: true,
    provider: 'taqnyat',
    apiKey: '',
    senderId: 'HEMAM'
  },
  email: {
    enabled: true,
    provider: 'smtp',
    smtpHost: '',
    smtpPort: 587,
    username: '',
    password: ''
  },
  payment: {
    enabled: true,
    gateway: 'moyasar',
    merchantId: '',
    apiKey: '',
    testMode: true
  }
};

const smsProviders = [
  { value: 'taqnyat', label: 'تقنيات' },
  { value: 'jawal', label: 'جوال' },
  { value: 'zain', label: 'زين' }
];

const paymentGateways = [
  { value: 'moyasar', label: 'ميسر' },
  { value: 'hyperpay', label: 'هايبر باي' },
  { value: 'tap', label: 'تاب' }
];

export default function IntegrationSettings({ onChange }: IntegrationSettingsProps) {
  const [config, setConfig] = useState<IntegrationConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [testingConnections, setTestingConnections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const loadIntegrationSettings = async () => {
      try {
        const response = await fetch('/api/admin/settings/integrations');
        const result = await response.json();
        
        if (result.success && result.data) {
          setConfig(prev => ({ ...prev, ...result.data }));
        }
      } catch (error) {
        console.error('Error loading integration settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadIntegrationSettings();
  }, []);

  const updateConfig = (section: keyof IntegrationConfig, updates: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: { ...prev[section], ...updates }
    }));
    onChange();
  };

  const testConnection = async (service: string) => {
    setTestingConnections(prev => ({ ...prev, [service]: true }));
    try {
      const response = await fetch(`/api/admin/integrations/test/${service}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config[service as keyof IntegrationConfig])
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert(`تم اختبار اتصال ${service} بنجاح! ✅`);
      } else {
        alert(`فشل اختبار اتصال ${service}: ${result.error}`);
      }
    } catch (error) {
      console.error(`Error testing ${service}:`, error);
      alert(`حدث خطأ أثناء اختبار اتصال ${service}`);
    } finally {
      setTestingConnections(prev => ({ ...prev, [service]: false }));
    }
  };

  if (loading) {
    return <div className='h-32 bg-[var(--brand-surface)] rounded-lg animate-pulse' />;
  }

  return (
    <div className='space-y-8'>
      {/* WhatsApp Integration */}
      <AdminCard className='space-y-6'>
        <div className='flex items-center justify-between pb-4 border-b border-[var(--brand-border)]'>
          <div className='flex items-center gap-3'>
            <Smartphone className='w-6 h-6 text-green-600' />
            <div>
              <h3 className='text-lg font-semibold text-[var(--text-primary)]'>واتساب بزنس</h3>
              <p className='text-sm text-[var(--text-secondary)]'>تكامل مع واتساب للرسائل التلقائية</p>
            </div>
          </div>
          <div className='flex items-center gap-3'>
            {config.whatsapp.verified && (
              <Badge className='bg-green-100 text-green-800'>
                <CheckCircle className='w-3 h-3 ml-1' />
                متحقق
              </Badge>
            )}
            <Switch
              checked={config.whatsapp.enabled}
              onCheckedChange={(enabled) => updateConfig('whatsapp', { enabled })}
            />
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='space-y-2'>
            <Label>معرف الحساب التجاري</Label>
            <Input
             ừvalue={config.whatsapp.businessAccountId}
              onChange={(e) => updateConfig('whatsapp', { businessAccountId: e.target.value })}
              disabled={!config.whatsapp.enabled}
              dir='ltr'
            />
          </div>
          
          <div className='space-y-2'>
            <Label>رمز الوصول</Label>
            <Input
              type='password'
              value={config.whatsapp.accessToken}
              onChange={(e) => updateConfig('whatsapp', { accessToken: e.target.value })}
              disabled={!config.whatsapp.enabled}
              dir='ltr'
            />
          </div>

          <div className='space-y-2 md:col-span-2'>
            <Label>Webhook URL</Label>
            <Input
              value={config.whatsapp.webhookUrl}
              onChange={(e) => updateConfig('whatsapp', { webhookUrl: e.target.value })}
              disabled={!config.whatsapp.enabled}
              dir='ltr'
              placeholder='https://your-domain.com/api/webhooks/whatsapp'
            />
          </div>
        </div>

        <Button
          onClick={() => testConnection('whatsapp')}
          disabled={testingConnections.whatsapp || !config.whatsapp.enabled}
          variant='outline'
          className='w-full border-[var(--brand-primary)] text-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/5'
        >
          {testingConnections.whatsapp ? (
            <>
              <RefreshCw className='w-4 h-4 ml-2 animate-spin' />
              جاري الاختبار...
            </>
          ) : (
            <>
              <TestTube className='w-4 h-4 ml-2' />
              اختبار الاتصال
            </>
          )}
        </Button>
      </AdminCard>

      {/* SMS Integration */}
      <AdminCard className='space-y-6'>
        <div className='flex items-center justify-between pb-4 border-b border-[var(--brand-border)]'>
          <div className='flex items-center gap-3'>
            <Smartphone className='w-6 h-6 text-blue-600' />
            <div>
              <h3 className='text-lg font-semibold text-[var(--text-primary)]'>رسائل SMS</h3>
              <p className='text-sm text-[var(--text-secondary)]'>تكامل مع مزودي الرسائل النصية</p>
            </div>
          </div>
          <Switch
            checked={config.sms.enabled}
            onCheckedChange={(enabled) => updateConfig('sms', { enabled })}
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='space-y-2'>
            <Label>المزود</Label>
            <Select 
              value={config.sms.provider} 
              onValueChange={(value) => updateConfig('sms', { provider: value })}
              disabled={!config.sms.enabled}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {smsProviders.map(provider => (
                  <SelectItem key={provider.value} value={provider.value}>
                    {provider.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label>معرف المرسل</Label>
            <Input
              value={config.sms.senderId}
              onChange={(e) => updateConfig('sms', { senderId: e.target.value })}
              disabled={!config.sms.enabled}
              dir='ltr'
            />
          </div>

          <div className='space-y-2 md:col-span-2'>
            <Label>مفتاح API</Label>
            <Input
              type='password'
              value={config.sms.apiKey}
              onChange={(e) => updateConfig('sms', { apiKey: e.target.value })}
              disabled={!config.sms.enabled}
              dir='ltr'
            />
          </div>
        </div>
      </AdminCard>

      {/* Email Integration */}
      <AdminCard className='space-y-6'>
        <div className='flex items-center justify-between pb-4 border-b border-[var(--brand-border)]'>
          <div className='flex items-center gap-3'>
            <Mail className='w-6 h-6 text-purple-600' />
            <div>
              <h3 className='text-lg font-semibold text-[var(--text-primary)]'>البريد الإلكتروني</h3>
              <p className='text-sm text-[var(--text-secondary)]'>إعدادات SMTP للبريد الإلكتروني</p>
            </div>
          </div>
          <Switch
            checked={config.email.enabled}
            onCheckedChange={(enabled) => updateConfig('email', { enabled })}
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='space-y-2'>
            <Label>خادم SMTP</Label>
            <Input
              value={config.email.smtpHost}
              onChange={(e) => updateConfig('email', { smtpHost: e.target.value })}
              disabled={!config.email.enabled}
              dir='ltr'
              placeholder='smtp.example.com'
            />
          </div>

          <div className='space-y-2'>
            <Label>المنفذ</Label>
            <Input
              type='number'
              value={config.email.smtpPort}
              onChange={(e) => updateConfig('email', { smtpPort: parseInt(e.target.value) })}
              disabled={!config.email.enabled}
              min={1}
              max={65535}
            />
          </div>

          <div className='space-y-2'>
            <Label>اسم المستخدم</Label>
            <Input
              value={config.email.username}
              onChange={(e) => updateConfig('email', { username: e.target.value })}
              disabled={!config.email.enabled}
              dir='ltr'
            />
          </div>

          <div className='space-y-2'>
            <Label>كلمة المرور</Label>
            <Input
              type='password'
              value={config.email.password}
              onChange={(e) => updateConfig('email', { password: e.target.value })}
              disabled={!config.email.enabled}
            />
          </div>
        </div>
      </AdminCard>

      {/* Payment Gateway */}
      <AdminCard className='space-y-6'>
        <div className='flex items-center justify-between pb-4 border-b border-[var(--brand-border)]'>
          <div className='flex items-center gap-3'>
            <CreditCard className='w-6 h-6 text-blue-600' />
            <div>
              <h3 className='text-lg font-semibold text-[var(--text-primary)]'>بوابة الدفع</h3>
              <p className='text-sm text-[var(--text-secondary)]'>تكامل مع بوابات الدفع الإلكتروني</p>
            </div>
          </div>
          <Switch
            checked={config.payment.enabled}
            onCheckedChange={(enabled) => updateConfig('payment', { enabled })}
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='space-y-2'>
            <Label>البوابة</Label>
            <Select 
              value={config.payment.gateway} 
              onValueChange={(value) => updateConfig('payment', { gateway: value })}
              disabled={!config.payment.enabled}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {paymentGateways.map(gateway => (
                  <SelectItem key={gateway.value} value={gateway.value}>
                    {gateway.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label>معرف التاجر</Label>
            <Input
              value={config.payment.merchantId}
              onChange={(e) => updateConfig('payment', { merchantId: e.target.value })}
              disabled={!config.payment.enabled}
              dir='ltr'
            />
          </div>

          <div className='space-y-2'>
            <Label>مفتاح API</Label>
            <Input
              type='password'
              value={config.payment.apiKey}
              onChange={(e) => updateConfig('payment', { apiKey: e.target.value })}
              disabled={!config.payment.enabled}
              dir='ltr'
            />
          </div>

          <div className='space-y-2 flex items-end'>
            <div className='flex items-center justify-between w-full p-3 border border-[var(--brand-border)] rounded-lg'>
              <Label htmlFor='testMode' className='cursor-pointer'>
                الوضع التجريبي
              </Label>
              <Switch
                id='testMode'
                checked={config.payment.testMode}
                onCheckedChange={(testMode) => updateConfig('payment', { testMode })}
                disabled={!config.payment.enabled}
              />
            </div>
          </div>
        </div>

        {config.payment.testMode && (
          <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
            <div className='flex items-center gap-2 text-yellow-800'>
              <AlertTriangle className='w-4 h-4' />
              <span className='font-medium'>تنبيه</span>
            </div>
            <p className='text-sm text-yellow-700 mt-1'>
              الوضع التجريبي مفعّل - لن يتم خصم أموال حقيقية من البطاقات
            </p>
          </div>
        )}
      </AdminCard>

      {/* Integration Status */}
      <AdminCard className='bg-gradient-to-r from-blue-50 to-transparent border-blue-200'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <div className='w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center'>
              <Zap className='w-6 h-6 text-blue-600' />
            </div>
            <div>
              <h4 className='font-semibold text-[var(--text-primary)] mb-1'>حالة التكاملات</h4>
              <div className='flex items-center gap-4 text-sm'>
                <div className='flex items-center gap-2'>
                  {config.whatsapp.enabled ? (
                    <CheckCircle className='w-4 h-4 text-green-500' />
                  ) : (
                    <AlertTriangle className='w-4 h-4 text-gray-400' />
                  )}
                  <span className={config.whatsapp.enabled ? 'text-green-700' : 'text-gray-500'}>
                    واتساب
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  {config.sms.enabled ? (
                    <CheckCircle className='w-4 h-4 text-green-500' />
                  ) : (
                    <AlertTriangle className='w-4 h-4 text-gray-400' />
                  )}
                  <span className={config.sms.enabled ? 'text-green-700' : 'text-gray-500'}>
                    SMS
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  {config.payment.enabled ? (
                    <CheckCircle className='w-4 h-4 text-green-500' />
                  ) : (
                    <AlertTriangle className='w-4 h-4 text-gray-400' />
                  )}
                  <span className={config.payment.enabled ? 'text-green-700' : 'text-gray-500'}>
                    الدفع
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminCard>
    </div>
  );
}
