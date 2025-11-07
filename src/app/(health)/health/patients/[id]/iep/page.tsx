'use client';

import logger from '@/lib/monitoring/logger';
import { createClient } from '@/lib/supabase/client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface IEP {
  id: string;
  title: string;
  start_date: string;
  end_date: string | null;
  status: string;
}

interface Goal {
  id: string;
  goal_text: string;
  domain: string;
  term: string;
  priority: string;
  status: string;
  target_date: string | null;
  progress: number;
}

const DOMAIN_LABELS: Record<string, string> = {
  behavioral: 'سلوكي',
  motor: 'حركي',
  language: 'لغوي',
  social: 'اجتماعي',
  academic: 'أكاديمي',
  self_care: 'رعاية ذاتية',
};

const DOMAIN_COLORS: Record<string, string> = {
  behavioral: 'bg-blue-100 text-blue-700',
  motor: 'bg-green-100 text-green-700',
  language: 'bg-purple-100 text-purple-700',
  social: 'bg-pink-100 text-pink-700',
  academic: 'bg-yellow-100 text-yellow-700',
  self_care: 'bg-indigo-100 text-indigo-700',
};

export default function PatientIEPPage() {
  const params = useParams();
  const patientId = params?.id as string;

  const [patient, setPatient] = useState<any>(null);
  const [iep, setIep] = useState<IEP | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const supabase = createClient();

      // Load patient
      const { data: patientData, error: patientError } = await supabase
        .from('patients')
        .select('*')
        .eq('id', patientId)
        .single();

      if (patientError) throw patientError;
      setPatient(patientData);

      // Load active IEP
      const { data: iepData, error: iepError } = await supabase
        .from('ieps')
        .select('*')
        .eq('patient_id', patientId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (iepError && iepError.code !== 'PGRST116') throw iepError;

      if (iepData) {
        setIep(iepData);

        // Load goals
        const { data: goalsData, error: goalsError } = await supabase
          .from('iep_goals')
          .select('*')
          .eq('iep_id', iepData.id)
          .order('priority DESC, created_at');

        if (goalsError) throw goalsError;

        // Load progress for each goal
        const goalsWithProgress = await Promise.all(
          (goalsData || []).map(async (goal: any) => {
            const { data: progressData } = await supabase.rpc(
              'calculate_goal_progress',
              { p_goal_id: goal.id }
            );

            return {
              ...goal,
              progress: progressData || 0,
            };
          })
        );

        setGoals(goalsWithProgress);
      }
    } catch (error) {
      logger.error('Error loading IEP data', error);
      alert('حدث خطأ في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='container-app py-8'>
        <div aria-live='polite' aria-atomic='true' className='sr-only'>
          <span id='live-region'></span>
        </div>
        <div className='card p-12 text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--default-default)] mx-auto'></div>
          <p className='mt-4 text-gray-600 dark:text-gray-400'>
            جاري التحميل...
          </p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className='container-app py-8'>
        <div className='card p-8 text-center'>
          <div className='text-5xl mb-4'>❌</div>
          <h2 className='text-xl font-bold text-gray-900 dark:text-white'>
            المريض غير موجود
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className='container-app py-8'>
      {/* Patient Header */}
      <div className='card p-6 mb-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
              {patient.first_name} {patient.last_name}
            </h1>
            <p className='text-gray-600 dark:text-gray-400'>
              الخطة التأهيلية الفردية (IEP)
            </p>
          </div>
          {iep && (
            <div className='text-left'>
              <div
                className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                  iep.status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {iep.status === 'active' ? '✅ نشط' : `📋 ${iep.status}`}
              </div>
            </div>
          )}
        </div>
      </div>

      {!iep ? (
        <div className='card p-12 text-center'>
          <div className='text-5xl mb-4'>📋</div>
          <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>
            لا توجد خطة IEP نشطة
          </h2>
          <p className='text-gray-600 dark:text-gray-400 mb-6'>
            يجب على الأخصائي إنشاء خطة IEP للطفل
          </p>
          <button className='btn btn-default' aria-label='إنشاء خطة IEP جديدة'>
            إنشاء خطة IEP جديدة
          </button>
        </div>
      ) : (
        <>
          {/* IEP Info */}
          <div className='card p-6 mb-6'>
            <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>
              {iep.title}
            </h2>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              <div>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  تاريخ البدء
                </p>
                <p className='font-semibold text-gray-900 dark:text-white'>
                  {new Date(iep.start_date).toLocaleDateString('ar-SA')}
                </p>
              </div>
              {iep.end_date && (
                <div>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    تاريخ الانتهاء
                  </p>
                  <p className='font-semibold text-gray-900 dark:text-white'>
                    {new Date(iep.end_date).toLocaleDateString('ar-SA')}
                  </p>
                </div>
              )}
              <div>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  عدد الأهداف
                </p>
                <p className='font-semibold text-gray-900 dark:text-white'>
                  {goals.length}
                </p>
              </div>
              <div>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  التقدم الإجمالي
                </p>
                <p className='font-semibold text-[var(--default-default)]'>
                  {goals.length > 0
                    ? Math.round(
                        goals.reduce((sum, g) => sum + g.progress, 0) /
                          goals.length
                      )
                    : 0}
                  %
                </p>
              </div>
            </div>
          </div>

          {/* Goals */}
          <div className='mb-6'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                الأهداف
              </h2>
              <button className='btn btn-outline' aria-label='+ إضافة هدف جديد'>
                + إضافة هدف جديد
              </button>
            </div>

            {goals.length === 0 ? (
              <div className='card p-8 text-center'>
                <div className='text-5xl mb-4'>🎯</div>
                <p className='text-gray-600 dark:text-gray-400'>
                  لا توجد أهداف بعد
                </p>
              </div>
            ) : (
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                {goals.map(goal => (
                  <div key={goal.id} className='card p-6'>
                    <div className='flex items-start justify-between mb-3'>
                      <div className='flex items-center gap-2'>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${DOMAIN_COLORS[goal.domain] || 'bg-gray-100 text-gray-700'}`}
                        >
                          {DOMAIN_LABELS[goal.domain] || goal.domain}
                        </span>
                        {goal.term === 'short' && (
                          <span className='text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-700'>
                            قصير المدى
                          </span>
                        )}
                        {goal.priority === 'high' && (
                          <span className='text-xs px-2 py-1 rounded-full bg-red-100 text-red-700'>
                            أولوية عالية
                          </span>
                        )}
                      </div>
                    </div>

                    <h3 className='font-semibold text-gray-900 dark:text-white mb-3'>
                      {goal.goal_text}
                    </h3>

                    {/* Progress Bar */}
                    <div className='mb-3'>
                      <div className='flex items-center justify-between mb-1'>
                        <span className='text-sm text-gray-600 dark:text-gray-400'>
                          التقدم
                        </span>
                        <span className='text-sm font-bold text-[var(--default-default)]'>
                          {goal.progress}%
                        </span>
                      </div>
                      <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
                        <div
                          className='bg-[var(--default-default)] h-2 rounded-full transition-all'
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Status */}
                    <div className='flex items-center gap-2'>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          goal.status === 'achieved'
                            ? 'bg-green-100 text-green-700'
                            : goal.status === 'in_progress'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {goal.status === 'achieved'
                          ? '✅ تم تحقيقه'
                          : goal.status === 'in_progress'
                            ? '🔄 قيد التنفيذ'
                            : '⏸️ لم يبدأ'}
                      </span>
                      {goal.target_date && (
                        <span className='text-xs text-gray-500 dark:text-gray-400'>
                          الهدف:{' '}
                          {new Date(goal.target_date).toLocaleDateString(
                            'ar-SA'
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
