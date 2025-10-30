'use client';

import { useState, useEffect } from 'react';
import { AdminCard } from '@/components/admin/ui';
import { Switch } from '@/components/ui/Switch';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { Bell, Mail, Smartphone } from 'lucide-react';

interface NotificationConfig {
  email: {
    enabled: boolean;
    appointmentReminder: string;
    appointmentConfirmation: string;
    paymentReceipt: string;
  };
  sms: {
    enabled: boolean;
    appointmentReminder: string;
    appointmentConfirmation: string;
  };
  push: {
    enabled: boolean;
    newAppointment: boolean;
    paymentReceived: boolean;
    systemAlerts: boolean;
  };
}

interface NotificationSettingsProps {
  onChange: () => void;
}

const defaultConfig: NotificationConfig = {
  email: {
    enabled: true,
    appointmentReminder: 'مرحباً {patientName}, نذكرك بموعدك غداً في {appointmentTime}',
    appointmentConfirmation: 'تم تأكيد موعدك في {appointmentTime}. نتطلع لرؤيتك!',
    paymentReceipt: 'تم استلام دفعتك بقيمة {amount} ريال. شكراً لك!'
  },
  sms: {
    enabled: true,
    appointmentReminder: 'موعدك غداً في {appointmentTime} - مركز الهمم',
    appointmentConfirmation: 'تم تأكيد موعدك - مركز الهمم'
  },
  push: {
    enabled: true,
    newAppointment: true,
    paymentReceived: true,
    systemAlerts: true
  }
};

export default function NotificationSettings({ onChange }: NotificationSettingsProps) {
  const [config, setConfig] = useState<NotificationConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);

  const updateConfig = (section: keyof NotificationConfig, updates: any) => {
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
      {/* Email Templates */}
      <AdminCard className='space-y-6'>
        <div className='flex items-center gap-3 pb-4 border-b border-[var(--brand-border)]'>
          <Mail className='w-6 h-6 text-[var(--brand-primary)]' />
          <h3 className='text-lg font-semibold text-[var(--text-primary)]'>قوالب البريد الإلكتروني</h3>
        </div>

        <div className='space-y-6'>
          <div className='space-y-2'>
            <Label>رسالة تذكير الموعد</Label>
            <Textarea
              value={config.email.appointmentReminder}
              onChange={(e) => updateConfig('email', { appointmentReminder: e.target.value })}
              rows={3}
              placeholder='استخدم {patientName}, {appointmentTime}, {doctorName}'
            />
          </div>

          <div className='space-y-2'>
            <Label>رسالة تأكيد الموعد</Label>
            <Textarea
              value={config.email.appointmentConfirmation}
              onChange={(e) => updateConfig('email', { appointmentConfirmation: e.target.value })}
              rows={3}
            />
          </div>
        </div>
      </AdminCard>

      {/* SMS Templates */}
      <AdminCard className='space-y-6'>
        <div className='flex items-center gap-3 pb-4 border-b border-[var(--brand-border)]'>
          <Smartphone className='w-6 h-6 text-[var(--brand-primary)]' />
          <h3 className='text-lg font-semibold text-[var(--text-primary)]'>قوالب الرسائل النصية</h3>
        </div>

        <div className='space-y-6'>
          <div className='space-y-2'>
            <Label>رسالة تذكير SMS</Label>
            <Textarea
              value={config.sms.appointmentReminder}
              onChange={(e) => updateConfig('sms', { appointmentReminder: e.target.value })}
              rows={2}
            />
          </div>
        </div>
      </AdminCard>
    </div>
  );
}

