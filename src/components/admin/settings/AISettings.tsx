'use client';

import { AdminCard } from '@/components/admin/ui';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Switch } from '@/components/ui/Switch';
import { Textarea } from '@/components/ui/Textarea';
import {
    BarChart3,
    BookOpen,
    Brain,
    Calendar,
    CheckCircle,
    FileText,
    MessageCircle,
    Pause,
    Play,
    RefreshCw,
    Bot as Robot,
    Share2 as Share,
    Users,
    Zap
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface AIConfig {
  chatbot: {
    enabled: boolean;
    name: string;
    welcomeMessage: string;
    language: string;
    responseDelay: number;
    maxConversationLength: number;
    enableLearning: boolean;
    enableAnalytics: boolean;
    fallbackToHuman: boolean;
    workingHours: {
      enabled: boolean;
      start: string;
      end: string;
    };
  };
  automation: {
    enabled: boolean;
    appointmentReminders: boolean;
    followUpMessages: boolean;
    reportGeneration: boolean;
    socialMediaPosts: boolean;
    weeklyLearningReport: boolean;
  };
  learning: {
    enabled: boolean;
    dataCollection: boolean;
    conversationAnalysis: boolean;
    performanceOptimization: boolean;
    userBehaviorAnalysis: boolean;
  };
  integrations: {
    openai: {
      enabled: boolean;
      apiKey: string;
      model: string;
      maxTokens: number;
    };
    whatsapp: {
      enabled: boolean;
      businessAccountId: string;
      accessToken: string;
    };
  };
}

interface AISettingsProps {
  onChange: () => void;
}

const defaultAIConfig: AIConfig = {
  chatbot: {
    enabled: true,
    name: 'مساعد الهمم',
    welcomeMessage: 'مرحباً بك في مركز الهمم! كيف يمكنني مساعدتك اليوم؟',
    language: 'ar',
    responseDelay: 1000,
    maxConversationLength: 50,
    enableLearning: true,
    enableAnalytics: true,
    fallbackToHuman: true,
    workingHours: {
      enabled: true,
      start: '08:00',
      end: '18:00'
    }
  },
  automation: {
    enabled: true,
    appointmentReminders: true,
    followUpMessages: true,
    reportGeneration: true,
    socialMediaPosts: false,
    weeklyLearningReport: true
  },
  learning: {
    enabled: true,
    dataCollection: true,
    conversationAnalysis: true,
    performanceOptimization: true,
    userBehaviorAnalysis: false
  },
  integrations: {
    openai: {
      enabled: true,
      apiKey: '',
      model: 'gpt-4',
      maxTokens: 1000
    },
    whatsapp: {
      enabled: true,
      businessAccountId: '',
      accessToken: ''
    }
  }
};

const languages = [
  { value: 'ar', label: 'العربية' },
  { value: 'en', label: 'English' },
  { value: 'both', label: 'ثنائي اللغة' }
];

const openaiModels = [
  { value: 'gpt-4', label: 'GPT-4 (الأكثر ذكاءً)' },
  { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo (سريع)' },
  { value: 'gpt-3.5-turbo-16k', label: 'GPT-3.5 Turbo 16K (محادثات طويلة)' }
];

export default function AISettings({ onChange }: AISettingsProps) {
  const [config, setConfig] = useState<AIConfig>(defaultAIConfig);
  const [loading, setLoading] = useState(true);
  const [testingChatbot, setTestingChatbot] = useState(false);

  useEffect(() => {
    const loadAISettings = async () => {
      try {
        const response = await fetch('/api/admin/settings/ai');
        const result = await response.json();
        
        if (result.success && result.data) {
          setConfig(prev => ({ ...prev, ...result.data }));
        }
      } catch (error) {
        console.error('Error loading AI settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAISettings();
  }, []);

  const updateConfig = (section: keyof AIConfig, updates: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: { ...prev[section], ...updates }
    }));
    onChange();
  };

  const testChatbot = async () => {
    setTestingChatbot(true);
    try {
      const response = await fetch('/api/chatbot/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'مرحبا، هذا اختبار للشات بوت',
          config: config.chatbot
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert('تم اختبار الشات بوت بنجاح! ✅');
      } else {
        alert('فشل اختبار الشات بوت: ' + result.error);
      }
    } catch (error) {
      console.error('Error testing chatbot:', error);
      alert('حدث خطأ أثناء اختبار الشات بوت');
    } finally {
      setTestingChatbot(false);
    }
  };

  if (loading) {
    return (
      <div className='space-y-6'>
        {[1, 2, 3].map(i => (
          <div key={i} className='h-32 bg-[var(--brand-surface)] rounded-lg animate-pulse' />
        ))}
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      {/* Chatbot Settings */}
      <AdminCard className='space-y-6'>
        <div className='flex items-center justify-between pb-4 border-b border-[var(--brand-border)]'>
          <div className='flex items-center gap-3'>
            <MessageCircle className='w-6 h-6 text-[var(--brand-primary)]' />
            <div>
              <h3 className='text-lg font-semibold text-[var(--text-primary)]'>إعدادات الشات بوت</h3>
              <p className='text-sm text-[var(--text-secondary)]'>تخصيص مساعد الهمم الذكي</p>
            </div>
          </div>
          
          <div className='flex items-center gap-3'>
            <Badge 
              variant={config.chatbot.enabled ? 'default' : 'outline'}
              className={config.chatbot.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}
            >
              {config.chatbot.enabled ? 'نشط' : 'متوقف'}
            </Badge>
            <Switch
              checked={config.chatbot.enabled}
              onCheckedChange={(enabled) => updateConfig('chatbot', { enabled })}
            />
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='space-y-2'>
            <Label htmlFor='botName'>اسم المساعد</Label>
            <Input
              id='botName'
              value={config.chatbot.name}
              onChange={(e) => updateConfig('chatbot', { name: e.target.value })}
              disabled={!config.chatbot.enabled}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='language'>اللغة</Label>
            <Select 
              value={config.chatbot.language} 
              onValueChange={(value) => updateConfig('chatbot', { language: value })}
              disabled={!config.chatbot.enabled}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map(lang => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2 md:col-span-2'>
            <Label htmlFor='welcomeMessage'>رسالة الترحيب</Label>
            <Textarea
              id='welcomeMessage'
              value={config.chatbot.welcomeMessage}
              onChange={(e) => updateConfig('chatbot', { welcomeMessage: e.target.value })}
              disabled={!config.chatbot.enabled}
              rows={3}
              className='text-right'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='responseDelay'>تأخير الاستجابة (مللي ثانية)</Label>
            <Input
              id='responseDelay'
              type='number'
              value={config.chatbot.responseDelay}
              onChange={(e) => updateConfig('chatbot', { responseDelay: parseInt(e.target.value) })}
              disabled={!config.chatbot.enabled}
              min={0}
              max={5000}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='maxConversationLength'>طول المحادثة الأقصى</Label>
            <Input
              id='maxConversationLength'
              type='number'
              value={config.chatbot.maxConversationLength}
              onChange={(e) => updateConfig('chatbot', { maxConversationLength: parseInt(e.target.value) })}
              disabled={!config.chatbot.enabled}
              min={10}
              max={100}
            />
          </div>
        </div>

        {/* Chatbot Options */}
        <div className='space-y-4 pt-4 border-t border-[var(--brand-border)]'>
          <div className='flex items-center justify-between'>
            <Label htmlFor='enableLearning' className='flex items-center gap-2'>
              <BookOpen className='w-4 h-4' />
              تفعيل التعلم من المحادثات
            </Label>
            <Switch
              id='enableLearning'
              checked={config.chatbot.enableLearning}
              onCheckedChange={(enabled) => updateConfig('chatbot', { enableLearning: enabled })}
              disabled={!config.chatbot.enabled}
            />
          </div>

          <div className='flex items-center justify-between'>
            <Label htmlFor='enableAnalytics' className='flex items-center gap-2'>
              <BarChart3 className='w-4 h-4' />
              تفعيل تحليلات المحادثات
            </Label>
            <Switch
              id='enableAnalytics'
              checked={config.chatbot.enableAnalytics}
              onCheckedChange={(enabled) => updateConfig('chatbot', { enableAnalytics: enabled })}
              disabled={!config.chatbot.enabled}
            />
          </div>

          <div className='flex items-center justify-between'>
            <Label htmlFor='fallbackToHuman' className='flex items-center gap-2'>
              <Users className='w-4 h-4' />
              التحويل للمساعد البشري عند الحاجة
            </Label>
            <Switch
              id='fallbackToHuman'
              checked={config.chatbot.fallbackToHuman}
              onCheckedChange={(enabled) => updateConfig('chatbot', { fallbackToHuman: enabled })}
              disabled={!config.chatbot.enabled}
            />
          </div>
        </div>

        {/* Test Chatbot */}
        <div className='pt-4 border-t border-[var(--brand-border)]'>
          <Button
            onClick={testChatbot}
            disabled={!config.chatbot.enabled || testingChatbot}
            variant='outline'
            className='w-full border-[var(--brand-primary)] text-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/5'
          >
            {testingChatbot ? (
              <>
                <RefreshCw className='w-4 h-4 ml-2 animate-spin' />
                جاري الاختبار...
              </>
            ) : (
              <>
                <Play className='w-4 h-4 ml-2' />
                اختبار الشات بوت
              </>
            )}
          </Button>
        </div>
      </AdminCard>

      {/* Automation Settings */}
      <AdminCard className='space-y-6'>
        <div className='flex items-center gap-3 pb-4 border-b border-[var(--brand-border)]'>
          <Zap className='w-6 h-6 text-[var(--brand-primary)]' />
          <div>
            <h3 className='text-lg font-semibold text-[var(--text-primary)]'>الأتمتة الذكية</h3>
            <p className='text-sm text-[var(--text-secondary)]'>تفعيل العمليات التلقائية</p>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='space-y-4'>
            {[
              { key: 'appointmentReminders', label: 'تذكير المواعيد التلقائي', icon: Calendar },
              { key: 'followUpMessages', label: 'رسائل المتابعة', icon: MessageCircle },
              { key: 'reportGeneration', label: 'إنشاء التقارير التلقائي', icon: FileText }
            ].map(({ key, label, icon: Icon }) => (
              <div key={key} className='flex items-center justify-between p-4 border border-[var(--brand-border)] rounded-lg'>
                <Label htmlFor={key} className='flex items-center gap-3 cursor-pointer'>
                  <Icon className='w-4 h-4 text-[var(--brand-primary)]' />
                  {label}
                </Label>
                <Switch
                  id={key}
                  checked={config.automation[key as keyof typeof config.automation] as boolean}
                  onCheckedChange={(enabled) => updateConfig('automation', { [key]: enabled })}
                  disabled={!config.automation.enabled}
                />
              </div>
            ))}
          </div>

          <div className='space-y-4'>
            {[
              { key: 'socialMediaPosts', label: 'منشورات وسائل التواصل', icon: Share },
              { key: 'weeklyLearningReport', label: 'تقرير التعلم الأسبوعي', icon: BookOpen }
            ].map(({ key, label, icon: Icon }) => (
              <div key={key} className='flex items-center justify-between p-4 border border-[var(--brand-border)] rounded-lg'>
                <Label htmlFor={key} className='flex items-center gap-3 cursor-pointer'>
                  <Icon className='w-4 h-4 text-[var(--brand-primary)]' />
                  {label}
                </Label>
                <Switch
                  id={key}
                  checked={config.automation[key as keyof typeof config.automation] as boolean}
                  onCheckedChange={(enabled) => updateConfig('automation', { [key]: enabled })}
                  disabled={!config.automation.enabled}
                />
              </div>
            ))}
          </div>
        </div>
      </AdminCard>

      {/* OpenAI Integration */}
      <AdminCard className='space-y-6'>
        <div className='flex items-center gap-3 pb-4 border-b border-[var(--brand-border)]'>
          <Brain className='w-6 h-6 text-[var(--brand-primary)]' />
          <div>
            <h3 className='text-lg font-semibold text-[var(--text-primary)]'>تكامل OpenAI</h3>
            <p className='text-sm text-[var(--text-secondary)]'>إعدادات API الذكاء الاصطناعي</p>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='space-y-2'>
            <Label htmlFor='openaiModel'>نموذج GPT</Label>
            <Select 
              value={config.integrations.openai.model} 
              onValueChange={(value) => updateConfig('integrations', {
                openai: { ...config.integrations.openai, model: value }
              })}
              disabled={!config.integrations.openai.enabled}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {openaiModels.map(model => (
                  <SelectItem key={model.value} value={model.value}>
                    {model.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='maxTokens'>الحد الأقصى للنصوص</Label>
            <Input
              id='maxTokens'
              type='number'
              value={config.integrations.openai.maxTokens}
              onChange={(e) => updateConfig('integrations', {
                openai: { ...config.integrations.openai, maxTokens: parseInt(e.target.value) }
              })}
              disabled={!config.integrations.openai.enabled}
              min={100}
              max={4000}
            />
          </div>

          <div className='space-y-2 md:col-span-2'>
            <Label htmlFor='openaiKey'>مفتاح API OpenAI</Label>
            <Input
              id='openaiKey'
              type='password'
              value={config.integrations.openai.apiKey}
              onChange={(e) => updateConfig('integrations', {
                openai: { ...config.integrations.openai, apiKey: e.target.value }
              })}
              disabled={!config.integrations.openai.enabled}
              placeholder='sk-...'
              dir='ltr'
              className='text-left'
            />
          </div>
        </div>
      </AdminCard>

      {/* AI Performance Status */}
      <AdminCard className='bg-gradient-to-r from-blue-50 to-transparent border-blue-200'>
        <div className='flex items-center gap-4'>
          <div className='w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center'>
            <Robot className='w-6 h-6 text-blue-600' />
          </div>
          <div className='flex-1'>
            <h4 className='font-semibold text-[var(--text-primary)] mb-1'>حالة الذكاء الاصطناعي</h4>
            <div className='flex items-center gap-4 text-sm'>
              <div className='flex items-center gap-2'>
                <CheckCircle className='w-4 h-4 text-green-500' />
                <span className='text-green-700'>متصل</span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
                <span className='text-[var(--text-secondary)]'>97% جاهزية</span>
              </div>
              <div className='text-[var(--text-secondary)]'>
                آخر استجابة: 0.8 ثانية
              </div>
            </div>
          </div>
          
          <Button
            onClick={testChatbot}
            disabled={testingChatbot || !config.chatbot.enabled}
            size='sm'
            className='bg-blue-600 hover:bg-blue-700 text-white'
          >
            {testingChatbot ? <Pause className='w-4 h-4' /> : <Play className='w-4 h-4' />}
          </Button>
        </div>
      </AdminCard>
    </div>
  );
}

