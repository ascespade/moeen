/**
 * Moeen Chatbot Settings Page
 * ???? ??????? ????? ??? ????
 */

'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

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
        console.error('Error loading config:', error);
      } else {
        setConfig(data || {
          name: '????',
          personality_type: 'professional_friendly',
          tone: 'warm_caring',
          language: 'ar',
          response_style: '',
          temperature: 0.7,
        });
      }
    } catch (error) {
      console.error('Error:', error);
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
        console.error('Error saving config:', error);
        alert('??? ??? ????? ?????');
      } else {
        alert('?? ????? ?????');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('??? ??? ????? ?????');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div aria-live="polite" aria-atomic="true" className="sr-only">
  <span id="live-region"></span>
</div>

div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">???? ???????...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">??????? ????? ??? ????</h1>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Basic Settings */}
        <section>
          <h2 className="text-xl font-semibold mb-4">????????? ????????</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">?????</label>
              <input type="text"
                value={config?.name || '????'}
                onChange={(e) = aria-label="text" aria-invalid="true"> setConfig({ ...config, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                aria-label="??? ????? ???"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">??? ???????</label>
              <select
                value={config?.personality_type || 'professional_friendly'}
                onChange={(e) => setConfig({ ...config, personality_type: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                aria-label="??? ???????"
              >
                <option value="professional_friendly">???? ?????</option>
                <option value="warm_caring">???? ?????</option>
                <option value="professional_formal">???? ????</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">???? ??????</label>
              <select
                value={config?.tone || 'warm_caring'}
                onChange={(e) => setConfig({ ...config, tone: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                aria-label="???? ??????"
              >
                <option value="warm_caring">???? ?????</option>
                <option value="professional">????</option>
                <option value="casual">??? ????</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">????? ????</label>
              <textarea
                value={config?.response_style || ''}
                onChange={(e) => setConfig({ ...config, response_style: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                rows={5}
                placeholder="???? ????? ???? ??????..."
                aria-label="????? ????"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Temperature: {config?.temperature || 0.7}
              </label>
              <input type="range"
                min="0"
                max="1"
                step="0.1"
                value={config?.temperature || 0.7}
                onChange={(e) = aria-label="range" aria-invalid="true"> setConfig({ ...config, temperature: parseFloat(e.target.value) })}
                className="w-full"
                aria-label="Temperature"
              />
              <p className="text-sm text-gray-500 mt-1">
                ??? ???? = ?????? ???? ???????? ??? ??? = ?????? ???? ???
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
            aria-label="??? ?????????"
          >
            {saving ? '???? ?????...' : '??? ?????????'}
          </button>
        </div>
      </div>
    </div>
  );
}
