/**
 * Notifications Settings Page
 * ???? ??????? ?????????
 */

'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export default function NotificationsSettingsPage() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [rules, setRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [templatesRes, rulesRes] = await Promise.all([
        supabase.from('notification_templates').select('*'),
        supabase.from('notification_rules').select('*'),
      ]);

      if (templatesRes.data) setTemplates(templatesRes.data);
      if (rulesRes.data) setRules(rulesRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">???? ???????...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">??????? ?????????</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Templates */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">????? ?????????</h2>
          <p className="text-gray-600 mb-4">
            {templates.length} ???? ????
          </p>
          <button
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
            aria-label="????? ???? ????"
          >
            ????? ???? ????
          </button>
        </div>

        {/* Rules */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">????? ?????????</h2>
          <p className="text-gray-600 mb-4">
            {rules.length} ????? ????
          </p>
          <button
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
            aria-label="????? ????? ?????"
          >
            ????? ????? ?????
          </button>
        </div>
      </div>
    </div>
  );
}
