'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { getBrowserSupabase } from '@/lib/supabaseClient';

interface ServiceItem {
  id?: number;
  title: string;
  description?: string;
  image?: string;
  link?: string;
}

export default function AdminHomepageEditor() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/dynamic-data?type=services');
        const data = await res.json();
        const items = (data.services || []).map((s: any, idx: number) => ({
          id: s.id ?? idx + 1,
          title: s.title,
          description: s.description,
          image: s.image,
          link: s.link,
        }));
        if (!cancelled) setServices(items);
      } catch (err) {
        
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const addService = () => {
    setServices(prev => [...prev, { title: '', description: '', image: '' }]);
  };

  const updateService = (index: number, patch: Partial<ServiceItem>) => {
    setServices(prev =>
      prev.map((s, i) => (i === index ? { ...s, ...patch } : s))
    );
  };

  const removeService = (index: number) => {
    setServices(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImage = async (file: File) => {
    const supabase = getBrowserSupabase();
    const path = `homepage/${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from('public')
      .upload(path, file, { upsert: true });
    if (error) throw error;
    const { publicURL } = supabase.storage.from('public').getPublicUrl(path);
    return publicURL;
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      updateService(index, { image: 'uploading' });
      const url = await uploadImage(file);
      updateService(index, { image: url });
    } catch (err) {
      
      updateService(index, { image: '' });
      alert('فشل رفع الصورة');
    }
  };

  const save = async () => {
    setSaving(true);
    try {
      const payload = { services };
      const res = await fetch('/api/admin/homepage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Save failed');
      alert('تم حفظ المحتوى بنجاح');
    } catch (err) {
      
      alert('فشل الحفظ');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className='p-6 container-app'>
      <h2 className='text-2xl font-bold mb-4'>تحرير الصفحة الرئيسية</h2>
      <div className='space-y-4'>
        <div className='flex justify-between items-center'>
          <h3 className='font-semibold'>الخدمات</h3>
          <div className='flex gap-2'>
            <Button variant='outline' size='sm' onClick={addService}>
              إضافة خدمة
            </Button>
            <Button onClick={save} size='sm' disabled={saving}>
              {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </Button>
          </div>
        </div>

        {loading ? (
          <div>جاري تحميل الخدمات...</div>
        ) : (
          services.map((s, idx) => (
            <div
              key={idx}
              className='p-4 border rounded-lg bg-[var(--panel)] shadow-sm'
            >
              <div className='grid grid-cols-1 md:grid-cols-6 gap-4 items-center'>
                <div className='md:col-span-3'>
                  <label className='block text-sm font-medium mb-1'>
                    العنوان
                  </label>
                  <input
                    className='form-input w-full'
                    value={s.title}
                    onChange={e =>
                      updateService(idx, { title: e.target.value })
                    }
                  />
                </div>
                <div className='md:col-span-3'>
                  <label className='block text-sm font-medium mb-1'>
                    الوصف
                  </label>
                  <input
                    className='form-input w-full'
                    value={s.description}
                    onChange={e =>
                      updateService(idx, { description: e.target.value })
                    }
                  />
                </div>

                <div className='md:col-span-2'>
                  <label className='block text-sm font-medium mb-1'>
                    رابط (اختياري)
                  </label>
                  <input
                    className='form-input w-full'
                    value={s.link || ''}
                    onChange={e => updateService(idx, { link: e.target.value })}
                  />
                </div>

                <div className='md:col-span-2'>
                  <label className='block text-sm font-medium mb-1'>صورة</label>
                  <div className='flex items-center gap-2'>
                    <input
                      type='file'
                      accept='image/*'
                      onChange={e => handleFileChange(e, idx)}
                    />
                    {s.image && s.image !== 'uploading' && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={s.image}
                        alt='preview'
                        className='w-20 h-12 object-cover rounded'
                      />
                    )}
                    {s.image === 'uploading' && <span>جاري رفع الصورة...</span>}
                  </div>
                </div>

                <div className='md:col-span-2 text-right'>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => removeService(idx)}
                  >
                    حذف
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
