/**
 * Moeen Chatbot Settings Page
 * صفحة إعدادات المساعد معين
 */

'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { logger } from '@/lib/utils/logger';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export default function ChatbotSettingsPage() {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('chatbot_config')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        logger.error('Error loading config:', error, {})
      } else {
        setConfig(data || {
          name: 'معين',
          personality_type: 'professional_friendly',
          tone: 'warm_caring',
          language: 'ar',
          response_style: '',
          temperature: 0.7,
        });
      }
    } catch (error) {
      logger.error('Error:', error, {})
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('chatbot_config')
        .upsert(config, { onConflict: 'id' });

      if (error) {
        logger.error('Error saving config:', error, {})
        alert('حدث خطأ أثناء الحفظ');
      } else {
        alert('تم الحفظ بنجاح');
      }
    } catch (error) {
      logger.error('Error:', error, {})
      alert('حدث خطأ أثناء الحفظ');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" role="status" aria-live="polite">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">إعدادات المساعد معين</h1>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Basic Settings */}
        <section>
          <h2 className="text-xl font-semibold mb-4">الإعدادات الأساسية</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">الاسم</label>
              <input
                type="text"
                value={config?.name || 'معين'}
                onChange={(e) => setConfig({ ...config, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                aria-label="اسم المساعد"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">نوع الشخصية</label>
              <select
                value={config?.personality_type || 'professional_friendly'}
                onChange={(e) => setConfig({ ...config, personality_type: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                aria-label="نوع الشخصية"
              >
                <option value="professional_friendly">مهني ودود</option>
                <option value="warm_caring">دافئ ومهتم</option>
                <option value="professional_formal">مهني رسمي</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">نبرة الصوت</label>
              <select
                value={config?.tone || 'warm_caring'}
                onChange={(e) => setConfig({ ...config, tone: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                aria-label="نبرة الصوت"
              >
                <option value="warm_caring">دافئ ومهتم</option>
                <option value="professional">مهني</option>
                <option value="casual">عادي</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">أسلوب الرد</label>
              <textarea
                value={config?.response_style || ''}
                onChange={(e) => setConfig({ ...config, response_style: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                rows={5}
                placeholder="وصف أسلوب الرد المطلوب..."
                aria-label="أسلوب الرد"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Temperature: {config?.temperature || 0.7}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={config?.temperature || 0.7}
                onChange={(e) => setConfig({ ...config, temperature: parseFloat(e.target.value) })}
                className="w-full"
                aria-label="درجة الحرارة"
              />
              <p className="text-sm text-gray-500 mt-1">
                قيم منخفضة = ردود أكثر تحديداً، قيم عالية = ردود أكثر إبداعاً
              </p>
            </div>
          </div>
        </section>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={saveConfig}
            disabled={saving}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
            aria-label="حفظ الإعدادات"
          >
            {saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
          </button>
        </div>
      </div>
    </div>
  );
}
