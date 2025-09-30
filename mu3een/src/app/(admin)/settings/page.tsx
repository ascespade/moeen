"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Save, ArrowLeft } from "lucide-react";
import siWhatsapp from "simple-icons/icons/whatsapp.js";
import siTelegram from "simple-icons/icons/telegram.js";
import siFacebook from "simple-icons/icons/facebook.js";
import siInstagram from "simple-icons/icons/instagram.js";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState({
    // General Settings
    siteName: "مُعين",
    siteDescription: "منصة دردشة متعددة القنوات مدعومة بالذكاء الاصطناعي",
    language: "ar",
    timezone: "Asia/Riyadh",
    theme: "light",
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    notificationSound: true,
    
    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    
    // Integration Settings
    whatsappEnabled: true,
    telegramEnabled: true,
    facebookEnabled: true,
    instagramEnabled: true,
    webhookUrl: "",
    
    // AI Settings
    aiEnabled: true,
    aiModel: "gpt-4",
    aiTemperature: 0.7,
    autoResponse: true
  });

  const tabs = [
    { id: "general", name: "عام", icon: "⚙️" },
    { id: "notifications", name: "الإشعارات", icon: "🔔" },
    { id: "security", name: "الأمان", icon: "🔒" },
    { id: "integrations", name: "التكاملات", icon: "🔗" },
    { id: "ai", name: "الذكاء الاصطناعي", icon: "🤖" }
  ];

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // Here you would typically save to your backend
    console.log("Saving settings:", settings);
    alert("تم حفظ الإعدادات بنجاح!");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-brand-border">
        <div className="container-app px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 space-x-reverse">
              <Image
                src="/hemam-logo.jpg"
                alt="Hemam Logo"
                width={40}
                height={40}
                className="rounded-lg"
                unoptimized
              />
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">الإعدادات</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">إدارة إعدادات النظام</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 space-x-reverse">
              <Link
                href="/dashboard"
                className="px-4 py-2 text-gray-600 hover:text-[var(--brand-primary)] transition-colors inline-flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" /> العودة للوحة التحكم
              </Link>
              <button 
                onClick={handleSave}
                className="btn btn-primary px-6 py-2 rounded-lg font-medium inline-flex items-center gap-2"
              >
                <Save className="h-4 w-4" /> حفظ التغييرات
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container-app px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card card-pad shadow-soft">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">الإعدادات</h3>
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 space-x-reverse px-3 py-2 rounded-lg text-right transition-colors ${
                      activeTab === tab.id
                        ? "bg-brand-primary text-white"
                        : "text-gray-600 hover:bg-brand-surface dark:text-gray-400 dark:hover:bg-slate-700"
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span className="font-medium">{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            <div className="card card-pad shadow-soft">
              {/* General Settings */}
              {activeTab === "general" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">الإعدادات العامة</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        اسم الموقع
                      </label>
                      <input
                        type="text"
                        value={settings.siteName}
                        onChange={(e) => handleSettingChange("siteName", e.target.value)}
                        className="w-full px-3 py-2 border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        اللغة
                      </label>
                      <select
                        value={settings.language}
                        onChange={(e) => handleSettingChange("language", e.target.value)}
                        className="w-full px-3 py-2 border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                      >
                        <option value="ar">العربية</option>
                        <option value="en">English</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        المنطقة الزمنية
                      </label>
                      <select
                        value={settings.timezone}
                        onChange={(e) => handleSettingChange("timezone", e.target.value)}
                        className="w-full px-3 py-2 border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                      >
                        <option value="Asia/Riyadh">الرياض (GMT+3)</option>
                        <option value="Asia/Dubai">دبي (GMT+4)</option>
                        <option value="Europe/London">لندن (GMT+0)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        المظهر
                      </label>
                      <select
                        value={settings.theme}
                        onChange={(e) => handleSettingChange("theme", e.target.value)}
                        className="w-full px-3 py-2 border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                      >
                        <option value="light">فاتح</option>
                        <option value="dark">داكن</option>
                        <option value="auto">تلقائي</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      وصف الموقع
                    </label>
                    <textarea
                      value={settings.siteDescription}
                      onChange={(e) => handleSettingChange("siteDescription", e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">إعدادات الإشعارات</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-brand-border rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">إشعارات البريد الإلكتروني</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">تلقي إشعارات عبر البريد الإلكتروني</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.emailNotifications}
                          onChange={(e) => handleSettingChange("emailNotifications", e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-brand-border rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">الإشعارات الفورية</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">تلقي إشعارات فورية في المتصفح</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.pushNotifications}
                          onChange={(e) => handleSettingChange("pushNotifications", e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-brand-border rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">إشعارات SMS</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">تلقي إشعارات عبر الرسائل النصية</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.smsNotifications}
                          onChange={(e) => handleSettingChange("smsNotifications", e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === "security" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">إعدادات الأمان</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-brand-border rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">المصادقة الثنائية</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">إضافة طبقة أمان إضافية لحسابك</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.twoFactorAuth}
                          onChange={(e) => handleSettingChange("twoFactorAuth", e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          انتهاء الجلسة (دقيقة)
                        </label>
                        <input
                          type="number"
                          value={settings.sessionTimeout}
                          onChange={(e) => handleSettingChange("sessionTimeout", parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          انتهاء كلمة المرور (يوم)
                        </label>
                        <input
                          type="number"
                          value={settings.passwordExpiry}
                          onChange={(e) => handleSettingChange("passwordExpiry", parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Integration Settings */}
              {activeTab === "integrations" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">إعدادات التكاملات</h2>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-4 border border-brand-border rounded-lg">
                      <div className="flex items-center space-x-3 space-x-reverse">
                          <svg role="img" aria-label="WhatsApp" viewBox="0 0 24 24" width="24" height="24" fill={`#${siWhatsapp.hex}`}>
                            <path d={siWhatsapp.path} />
                          </svg>
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">واتساب</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">تكامل مع واتساب</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.whatsappEnabled}
                            onChange={(e) => handleSettingChange("whatsappEnabled", e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-brand-border rounded-lg">
                      <div className="flex items-center space-x-3 space-x-reverse">
                          <svg role="img" aria-label="Telegram" viewBox="0 0 24 24" width="24" height="24" fill={`#${siTelegram.hex}`}>
                            <path d={siTelegram.path} />
                          </svg>
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">تليجرام</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">تكامل مع تليجرام</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.telegramEnabled}
                            onChange={(e) => handleSettingChange("telegramEnabled", e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-brand-border rounded-lg">
                      <div className="flex items-center space-x-3 space-x-reverse">
                          <svg role="img" aria-label="Facebook" viewBox="0 0 24 24" width="24" height="24" fill={`#${siFacebook.hex}`}>
                            <path d={siFacebook.path} />
                          </svg>
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">فيسبوك</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">تكامل مع فيسبوك</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.facebookEnabled}
                            onChange={(e) => handleSettingChange("facebookEnabled", e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-brand-border rounded-lg">
                      <div className="flex items-center space-x-3 space-x-reverse">
                          <svg role="img" aria-label="Instagram" viewBox="0 0 24 24" width="24" height="24" fill={`#${siInstagram.hex}`}>
                            <path d={siInstagram.path} />
                          </svg>
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">إنستغرام</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">تكامل مع إنستغرام</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.instagramEnabled}
                            onChange={(e) => handleSettingChange("instagramEnabled", e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        رابط Webhook
                      </label>
                      <input
                        type="url"
                        value={settings.webhookUrl}
                        onChange={(e) => handleSettingChange("webhookUrl", e.target.value)}
                        placeholder="https://example.com/webhook"
                        className="w-full px-3 py-2 border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* AI Settings */}
              {activeTab === "ai" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">إعدادات الذكاء الاصطناعي</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-brand-border rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">تفعيل الذكاء الاصطناعي</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">استخدام الذكاء الاصطناعي في الردود</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.aiEnabled}
                          onChange={(e) => handleSettingChange("aiEnabled", e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          نموذج الذكاء الاصطناعي
                        </label>
                        <select
                          value={settings.aiModel}
                          onChange={(e) => handleSettingChange("aiModel", e.target.value)}
                          className="w-full px-3 py-2 border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                        >
                          <option value="gpt-4">GPT-4</option>
                          <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                          <option value="claude-3">Claude 3</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          درجة الإبداع (0-1)
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={settings.aiTemperature}
                          onChange={(e) => handleSettingChange("aiTemperature", parseFloat(e.target.value))}
                          className="w-full"
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{settings.aiTemperature}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-brand-border rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">الرد التلقائي</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">السماح للذكاء الاصطناعي بالرد تلقائياً</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.autoResponse}
                          onChange={(e) => handleSettingChange("autoResponse", e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
