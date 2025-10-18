'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import logger from '@/lib/monitoring/logger';

interface Therapist {
  id: string;
  full_name: string;
  email: string;
}

interface Schedule {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

const DAYS = [
  'الأحد',
  'الإثنين',
  'الثلاثاء',
  'الأربعاء',
  'الخميس',
  'الجمعة',
  'السبت',
];

export default function TherapistSchedulesPage() {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [selectedTherapist, setSelectedTherapist] = useState<string>('');
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadTherapists();
  }, []);

  useEffect(() => {
    if (selectedTherapist) {
      loadSchedules();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTherapist]);

  const loadTherapists = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('users')
        .select('id, full_name, email')
        .eq('role', 'doctor')
        .order('full_name');

      if (error) throw error;
      setTherapists(data || []);

      if (data && data.length > 0) {
        setSelectedTherapist(data[0].id);
      }
    } catch (error) {
      logger.error('Error loading therapists', error);
    }
  };

  const loadSchedules = async () => {
    if (!selectedTherapist) return;

    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('therapist_schedules')
        .select('*')
        .eq('therapist_id', selectedTherapist)
        .order('day_of_week, start_time');

      if (error) throw error;
      setSchedules(data || []);
    } catch (error) {
      logger.error('Error loading schedules', error);
    } finally {
      setLoading(false);
    }
  };

  const addSchedule = async (dayOfWeek: number) => {
    if (!selectedTherapist) return;

    setSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from('therapist_schedules').insert({
        therapist_id: selectedTherapist,
        day_of_week: dayOfWeek,
        start_time: '09:00',
        end_time: '17:00',
        is_available: true,
      });

      if (error) throw error;
      await loadSchedules();
      alert('تم إضافة الجدول بنجاح!');
    } catch (error: any) {
      logger.error('Error adding schedule', error);
      alert('خطأ: ' + (error.message || 'فشل في إضافة الجدول'));
    } finally {
      setSaving(false);
    }
  };

  const updateSchedule = async (
    scheduleId: string,
    field: string,
    value: any
  ) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('therapist_schedules')
        .update({ [field]: value })
        .eq('id', scheduleId);

      if (error) throw error;
      await loadSchedules();
    } catch (error) {
      logger.error('Error updating schedule', error);
      alert('فشل في التحديث');
    }
  };

  const deleteSchedule = async (scheduleId: string) => {
    if (!confirm('هل أنت متأكد من الحذف؟')) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('therapist_schedules')
        .delete()
        .eq('id', scheduleId);

      if (error) throw error;
      await loadSchedules();
      alert('تم الحذف بنجاح');
    } catch (error) {
      logger.error('Error deleting schedule', error);
      alert('فشل في الحذف');
    }
  };

  // Group schedules by day
  const schedulesByDay: Record<number, Schedule[]> = {};
  schedules.forEach(schedule => {
    const dayOfWeek = schedule?.day_of_week;
    if (dayOfWeek !== undefined && dayOfWeek !== null) {
      if (!schedulesByDay[dayOfWeek]) {
        schedulesByDay[dayOfWeek] = [];
      }
      schedulesByDay[dayOfWeek]!.push(schedule);
    }
  });

  return (
    <div className='container-app py-8'>
      <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
        جداول الأخصائيين
      </h1>
      <p className='text-gray-600 dark:text-gray-400 mb-8'>
        إدارة أوقات العمل الأسبوعية للأخصائيين
      </p>

      {/* Therapist Selector */}
      <div className='card p-6 mb-6'>
        <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2'>
          اختر الأخصائي
        </label>
        <select
          value={selectedTherapist}
          onChange={e => setSelectedTherapist(e.target.value)}
          className='w-full md:w-96 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
        >
          {therapists.map(therapist => (
            <option key={therapist.id} value={therapist.id}>
              {therapist.full_name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className='card p-12 text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--brand-primary)] mx-auto'></div>
          <p className='mt-4 text-gray-600 dark:text-gray-400'>
            جاري التحميل...
          </p>
        </div>
      ) : (
        <div className='space-y-4'>
          {DAYS.map((dayName, dayIndex) => (
            <div key={dayIndex} className='card p-6'>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-lg font-bold text-gray-900 dark:text-white'>
                  {dayName}
                </h3>
                <button
                  onClick={() => addSchedule(dayIndex)}
                  disabled={saving}
                  className='btn btn-outline text-sm'
                >
                  + إضافة وقت
                </button>
              </div>

              {schedulesByDay[dayIndex] &&
              schedulesByDay[dayIndex]!.length > 0 ? (
                <div className='space-y-3'>
                  {schedulesByDay[dayIndex]!.map(schedule => (
                    <div
                      key={schedule.id}
                      className='flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800'
                    >
                      <div className='flex items-center gap-2'>
                        <label className='text-sm text-gray-600 dark:text-gray-400'>
                          من
                        </label>
                        <input
                          type='time'
                          value={schedule.start_time}
                          onChange={e =>
                            updateSchedule(
                              schedule.id,
                              'start_time',
                              e.target.value
                            )
                          }
                          className='px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                        />
                      </div>

                      <div className='flex items-center gap-2'>
                        <label className='text-sm text-gray-600 dark:text-gray-400'>
                          إلى
                        </label>
                        <input
                          type='time'
                          value={schedule.end_time}
                          onChange={e =>
                            updateSchedule(
                              schedule.id,
                              'end_time',
                              e.target.value
                            )
                          }
                          className='px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                        />
                      </div>

                      <label className='flex items-center gap-2 cursor-pointer'>
                        <input
                          type='checkbox'
                          checked={schedule.is_available}
                          onChange={e =>
                            updateSchedule(
                              schedule.id,
                              'is_available',
                              e.target.checked
                            )
                          }
                          className='w-5 h-5 rounded border-gray-300 dark:border-gray-600'
                        />
                        <span className='text-sm text-gray-700 dark:text-gray-300'>
                          متاح
                        </span>
                      </label>

                      <button
                        onClick={() => deleteSchedule(schedule.id)}
                        className='mr-auto text-red-600 hover:text-red-700 text-sm'
                      >
                        حذف
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className='text-sm text-gray-500 dark:text-gray-400 text-center py-4'>
                  لا يوجد أوقات عمل في هذا اليوم
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Instructions */}
      <div className='card p-6 mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'>
        <h4 className='font-bold text-blue-900 dark:text-blue-100 mb-2'>
          💡 إرشادات
        </h4>
        <ul className='text-sm text-blue-800 dark:text-blue-200 space-y-1'>
          <li>• حدد أوقات العمل لكل يوم في الأسبوع</li>
          <li>• يمكن إضافة أكثر من فترة في نفس اليوم (صباحي/مسائي)</li>
          <li>• استخدم خيار متاح لتفعيل/تعطيل وقت معين</li>
          <li>• ساعات العمل: الأحد - الخميس (7 ص - 7 م)</li>
        </ul>
      </div>
    </div>
  );
}
