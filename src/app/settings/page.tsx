"use client";

import { useState, useEffect } from 'react';
// import { ROUTES } from '@/constants/routes';
import Image from "next/image";

interface ChatbotConfig {
  id: string;
  name: string;
  whatsapp_api_url: string;
  whatsapp_token: string;
  webhook_url: string;
  is_active: boolean;
  ai_model: string;
  language: string;
  timezone: string;
  business_hours: any;
  auto_reply_enabled: boolean;
  auto_reply_message: string;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [chatbotConfig, setChatbotConfig] = useState<ChatbotConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadChatbotConfig();
  }, []);

  const loadChatbotConfig = async () => {
    try {
      const response = await fetch('/api/chatbot/config');
      if (response.ok) {
        const data = await response.json();
        setChatbotConfig(data.config);
      }
    } catch (error) {
      console.error('Error loading config:', error);
    }
  };

  const saveChatbotConfig = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/chatbot/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(chatbotConfig)
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error('Error saving config:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'general', name: 'عام', icon: '⚙️' },
    { id: 'chatbot', name: 'الشات بوت', icon: '🤖' },
    { id: 'whatsapp', name: 'واتساب', icon: '📱' },
    { id: 'ai', name: 'الذكاء الاصطناعي', icon: '🧠' },
    { id: 'notifications', name: 'الإشعارات', icon: '🔔' },
    { id: 'integrations', name: 'التكاملات', icon: '🔗' },
  ];

  return (
    <div className="min-h-screen bg-[var(--brand-surface)]">
      {/* Header */}
      <header className="border-brand sticky top-0 z-10 border-b bg-white dark:bg-gray-900">
        <div className="container-app py-6">
          <div className="flex items-center gap-4">
            <Image
              src="/logo.png"
              alt="مُعين"
              width={50}
              height={50}
              className="rounded-lg"
            />
            <div>
              <h1 className="text-brand text-2xl font-bold">الإعدادات</h1>
              <p className="text-gray-600 dark:text-gray-300">
                إدارة إعدادات النظام والتكاملات
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container-app py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 rounded-lg px-4 py-3 text-right transition-colors ${
                      activeTab === tab.id
                        ? 'bg-[var(--brand-primary)] text-white'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span className="font-medium">{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="card p-8">
              {/* General Settings */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">الإعدادات العامة</h2>
                  
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        اسم المركز
                      </label>
                      <input
                        type="text"
                        defaultValue="مركز الهمم للرعاية الصحية"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        البريد الإلكتروني
                      </label>
                      <input
                        type="email"
                        defaultValue="info@moeen.com"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        رقم الهاتف
                      </label>
                      <input
                        type="tel"
                        defaultValue="+966501234567"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        العنوان
                      </label>
                      <input
                        type="text"
                        defaultValue="شارع الملك فهد، حي النخيل، الرياض"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      وصف المركز
                    </label>
                    <textarea
                      rows={4}
                      defaultValue="مركز متخصص في الرعاية الصحية والعلاج الطبيعي والنفسي"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                    />
                  </div>
                </div>
              )}

              {/* Chatbot Settings */}
              {activeTab === 'chatbot' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">إعدادات الشات بوت</h2>
                  
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        اسم الشات بوت
                      </label>
                      <input
                        type="text"
                        value={chatbotConfig?.name || ''}
                        onChange={(e) => setChatbotConfig(prev => prev ? {...prev, name: e.target.value} : null)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        اللغة
                      </label>
                      <select
                        value={chatbotConfig?.language || 'ar'}
                        onChange={(e) => setChatbotConfig(prev => prev ? {...prev, language: e.target.value} : null)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                      >
                        <option value="ar">العربية</option>
                        <option value="en">English</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        المنطقة الزمنية
                      </label>
                      <select
                        value={chatbotConfig?.timezone || 'Asia/Riyadh'}
                        onChange={(e) => setChatbotConfig(prev => prev ? {...prev, timezone: e.target.value} : null)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                      >
                        <option value="Asia/Riyadh">الرياض (GMT+3)</option>
                        <option value="Asia/Dubai">دبي (GMT+4)</option>
                        <option value="Europe/London">لندن (GMT+0)</option>
                      </select>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={chatbotConfig?.is_active || false}
                        onChange={(e) => setChatbotConfig(prev => prev ? {...prev, is_active: e.target.checked} : null)}
                        className="rounded border-gray-300"
                      />
                      <label className="mr-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        تفعيل الشات بوت
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      رسالة الترحيب التلقائية
                    </label>
                    <textarea
                      rows={4}
                      value={chatbotConfig?.auto_reply_message || ''}
                      onChange={(e) => setChatbotConfig(prev => prev ? {...prev, auto_reply_message: e.target.value} : null)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                      placeholder="مرحباً بك في مركز الهمم! كيف يمكنني مساعدتك؟"
                    />
                  </div>
                </div>
              )}

              {/* WhatsApp Settings */}
              {activeTab === 'whatsapp' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">إعدادات واتساب</h2>
                  
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        WhatsApp API URL
                      </label>
                      <input
                        type="url"
                        value={chatbotConfig?.whatsapp_api_url || ''}
                        onChange={(e) => setChatbotConfig(prev => prev ? {...prev, whatsapp_api_url: e.target.value} : null)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                        placeholder="https://graph.facebook.com/v18.0"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Access Token
                      </label>
                      <input
                        type="password"
                        value={chatbotConfig?.whatsapp_token || ''}
                        onChange={(e) => setChatbotConfig(prev => prev ? {...prev, whatsapp_token: e.target.value} : null)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                        placeholder="EAAxxxxxxxxxxxxx"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Webhook URL
                      </label>
                      <input
                        type="url"
                        value={chatbotConfig?.webhook_url || ''}
                        onChange={(e) => setChatbotConfig(prev => prev ? {...prev, webhook_url: e.target.value} : null)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                        placeholder="https://your-domain.com/api/webhook/whatsapp"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Phone Number ID
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                        placeholder="123456789012345"
                      />
                    </div>
                  </div>

                  <div className="rounded-lg bg-blue-50 p-4">
                    <h3 className="font-semibold text-blue-900">تعليمات التكوين</h3>
                    <ol className="mt-2 list-decimal list-inside space-y-1 text-sm text-blue-800">
                      <li>أنشئ تطبيق في Facebook Developers</li>
                      <li>أضف منتج WhatsApp Business API</li>
                      <li>انسخ Access Token و Phone Number ID</li>
                      <li>أضف Webhook URL في إعدادات التطبيق</li>
                      <li>استخدم Verify Token: moeen_verify_2024</li>
                    </ol>
                  </div>
                </div>
              )}

              {/* AI Settings */}
              {activeTab === 'ai' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">إعدادات الذكاء الاصطناعي</h2>
                  
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        نموذج AI
                      </label>
                      <select
                        value={chatbotConfig?.ai_model || 'gemini_pro'}
                        onChange={(e) => setChatbotConfig(prev => prev ? {...prev, ai_model: e.target.value} : null)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                      >
                        <option value="gemini_pro">Google Gemini Pro</option>
                        <option value="gpt-4">OpenAI GPT-4</option>
                        <option value="gpt-3.5-turbo">OpenAI GPT-3.5 Turbo</option>
                        <option value="claude">Anthropic Claude</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        API Key
                      </label>
                      <input
                        type="password"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--brand-primary)]"
                        placeholder="أدخل مفتاح API"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      مستوى الإبداع (0-1)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      defaultValue="0.7"
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>محافظ</span>
                      <span>متوازن</span>
                      <span>إبداعي</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Settings */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">إعدادات الإشعارات</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">إشعارات البريد الإلكتروني</h3>
                        <p className="text-sm text-gray-600">تلقي إشعارات على البريد الإلكتروني</p>
                      </div>
                      <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">إشعارات واتساب</h3>
                        <p className="text-sm text-gray-600">تلقي إشعارات على واتساب</p>
                      </div>
                      <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">إشعارات المواعيد</h3>
                        <p className="text-sm text-gray-600">تذكير بالمواعيد القادمة</p>
                      </div>
                      <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">إشعارات الرسائل الجديدة</h3>
                        <p className="text-sm text-gray-600">عند وصول رسائل جديدة</p>
                      </div>
                      <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                    </div>
                  </div>
                </div>
              )}

              {/* Integrations Settings */}
              {activeTab === 'integrations' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">التكاملات</h2>
                  
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="card p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <span className="text-green-600 text-xl">📱</span>
                        </div>
                        <div>
                          <h3 className="font-semibold">واتساب</h3>
                          <p className="text-sm text-gray-600">متصل</p>
                        </div>
                      </div>
                      <button className="w-full rounded-lg bg-red-100 px-4 py-2 text-red-600 hover:bg-red-200">
                        قطع الاتصال
                      </button>
                    </div>

                    <div className="card p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-blue-600 text-xl">🧠</span>
                        </div>
                        <div>
                          <h3 className="font-semibold">Google Gemini</h3>
                          <p className="text-sm text-gray-600">متصل</p>
                        </div>
                      </div>
                      <button className="w-full rounded-lg bg-red-100 px-4 py-2 text-red-600 hover:bg-red-200">
                        قطع الاتصال
                      </button>
                    </div>

                    <div className="card p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-gray-600 text-xl">📧</span>
                        </div>
                        <div>
                          <h3 className="font-semibold">SMTP</h3>
                          <p className="text-sm text-gray-600">غير متصل</p>
                        </div>
                      </div>
                      <button className="w-full rounded-lg bg-green-100 px-4 py-2 text-green-600 hover:bg-green-200">
                        إعداد
                      </button>
                    </div>

                    <div className="card p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-gray-600 text-xl">📊</span>
                        </div>
                        <div>
                          <h3 className="font-semibold">Google Analytics</h3>
                          <p className="text-sm text-gray-600">غير متصل</p>
                        </div>
                      </div>
                      <button className="w-full rounded-lg bg-green-100 px-4 py-2 text-green-600 hover:bg-green-200">
                        إعداد
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="flex justify-end pt-6 border-t border-gray-200">
                <button
                  onClick={saveChatbotConfig}
                  disabled={loading}
                  className="btn-brand rounded-lg px-8 py-3 text-white transition-colors hover:bg-[var(--brand-primary-hover)] disabled:opacity-50"
                >
                  {loading ? 'جاري الحفظ...' : saved ? 'تم الحفظ! ✅' : 'حفظ الإعدادات'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}