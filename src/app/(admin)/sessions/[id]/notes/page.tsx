'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import logger from '@/lib/monitoring/logger';

interface Goal {
  id: string;
  goal_text: string;
  domain: string;
  current_progress: number;
}

export default function SessionNotesPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params?.id as string;

  const [session, setSession] = useState<any>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [notes, setNotes] = useState('');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [goalProgress, setGoalProgress] = useState<Record<string, number>>({});
  const [homeRecommendations, setHomeRecommendations] = useState('');
  const [nextSessionFocus, setNextSessionFocus] = useState('');
  const [sessionRating, setSessionRating] = useState(5);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const supabase = createClient();

      // Load session details
      const { data: sessionData, error: sessionError } = await supabase
        .from('appointments')
        .select(
          `
          *,
          patient:patients(*),
          therapist:users!appointments_doctor_id_fkey(*),
          session_type:session_types(*)
        `
        )
        .eq('id', sessionId)
        .single();

      if (sessionError) throw sessionError;
      setSession(sessionData);

      // Load active IEP goals for this patient
      const { data: iepData } = await supabase
        .from('ieps')
        .select('id')
        .eq('patient_id', sessionData.patient_id)
        .eq('status', 'active')
        .single();

      if (iepData) {
        const { data: goalsData, error: goalsError } = await supabase
          .from('iep_goals')
          .select('*')
          .eq('iep_id', iepData.id)
          .in('status', ['not_started', 'in_progress']);

        if (goalsError) throw goalsError;

        // Get current progress for each goal
        const goalsWithProgress = await Promise.all(
          (goalsData || []).map(async goal => {
            const { data: progressData } = await supabase.rpc(
              'calculate_goal_progress',
              { p_goal_id: goal.id }
            );

            return {
              ...goal,
              current_progress: progressData || 0,
            };
          })
        );

        setGoals(goalsWithProgress);
      }
    } catch (error) {
      logger.error('Error loading session data', error);
      alert('خطأ في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!notes.trim()) {
      alert('يرجى كتابة ملاحظات الجلسة');
      return;
    }

    setSaving(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error('يجب تسجيل الدخول');

      // Save session notes
      const { error: notesError } = await supabase
        .from('session_notes')
        .insert({
          session_id: sessionId,
          therapist_id: user.id,
          notes,
          goals_worked_on: selectedGoals,
          home_recommendations: homeRecommendations || null,
          next_session_focus: nextSessionFocus || null,
          session_rating: sessionRating,
        });

      if (notesError) throw notesError;

      // Save progress for each selected goal
      for (const goalId of selectedGoals) {
        const progress = goalProgress[goalId];
        if (progress !== undefined && progress >= 0) {
          await supabase.from('goal_progress').insert({
            goal_id: goalId,
            session_id: sessionId,
            progress_percent: progress,
            notes: `تم العمل على الهدف في جلسة ${session?.appointment_date}`,
            recorded_by: user.id,
          });
        }
      }

      // Update session status to completed
      await supabase
        .from('appointments')
        .update({ status: 'completed' })
        .eq('id', sessionId);

      logger.info('Session notes saved successfully', {
        sessionId,
        goalsCount: selectedGoals.length,
      });

      alert('✅ تم حفظ ملاحظات الجلسة بنجاح!\n\nسيتم إرسال تحديث للأسرة.');
      router.push('/admin/appointments');
    } catch (error: any) {
      logger.error('Error saving session notes', error);
      alert(`خطأ: ${error.message || 'فشل في حفظ الملاحظات'}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className='container-app py-8'>
        <div className='card p-12 text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--default-default)] mx-auto'></div>
          <p className='mt-4 text-gray-600 dark:text-gray-400'>
            جاري التحميل...
          </p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className='container-app py-8'>
        <div className='card p-8 text-center'>
          <div className='text-5xl mb-4'>❌</div>
          <h2 className='text-xl font-bold'>الجلسة غير موجودة</h2>
        </div>
      </div>
    );
  }

  return (
    <div className='container-app py-8'>
      <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
        ملاحظات الجلسة
      </h1>
      <p className='text-gray-600 dark:text-gray-400 mb-8'>
        تسجيل ملاحظات وتقدم الطفل بعد الجلسة
      </p>

      {/* Session Info */}
      <div className='card p-6 mb-6'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
          <div>
            <p className='text-sm text-gray-600 dark:text-gray-400'>الطفل</p>
            <p className='font-bold text-gray-900 dark:text-white'>
              {session.patient?.first_name} {session.patient?.last_name}
            </p>
          </div>
          <div>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              نوع الجلسة
            </p>
            <p className='font-bold text-gray-900 dark:text-white'>
              {session.session_type?.name_ar || 'غير محدد'}
            </p>
          </div>
          <div>
            <p className='text-sm text-gray-600 dark:text-gray-400'>التاريخ</p>
            <p className='font-bold text-gray-900 dark:text-white'>
              {new Date(session.appointment_date).toLocaleDateString('ar-SA')}
            </p>
          </div>
          <div>
            <p className='text-sm text-gray-600 dark:text-gray-400'>الوقت</p>
            <p className='font-bold text-gray-900 dark:text-white'>
              {session.appointment_time}
            </p>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Main Form */}
        <div className='lg:col-span-2 space-y-6'>
          {/* Session Notes */}
          <div className='card p-6'>
            <label className='block text-lg font-bold text-gray-900 dark:text-white mb-4'>
              ملاحظات الجلسة *
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={6}
              className='w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--default-default)]'
              placeholder='ملخص الجلسة، ما تم إنجازه، استجابة الطفل...'
              required
            />
          </div>

          {/* Goals Worked On */}
          {goals.length > 0 && (
            <div className='card p-6'>
              <label className='block text-lg font-bold text-gray-900 dark:text-white mb-4'>
                الأهداف التي تم العمل عليها
              </label>
              <div className='space-y-4'>
                {goals.map(goal => (
                  <div
                    key={goal.id}
                    className='border border-gray-200 dark:border-gray-700 rounded-lg p-4'
                  >
                    <label className='flex items-start gap-3 cursor-pointer'>
                      <input
                        type='checkbox'
                        checked={selectedGoals.includes(goal.id)}
                        onChange={e => {
                          if (e.target.checked) {
                            setSelectedGoals([...selectedGoals, goal.id]);
                            setGoalProgress({
                              ...goalProgress,
                              [goal.id]: goal.current_progress,
                            });
                          } else {
                            setSelectedGoals(
                              selectedGoals.filter(id => id !== goal.id)
                            );
                            const newProgress = { ...goalProgress };
                            delete newProgress[goal.id];
                            setGoalProgress(newProgress);
                          }
                        }}
                        className='mt-1 w-5 h-5'
                      />
                      <div className='flex-1'>
                        <p className='font-semibold text-gray-900 dark:text-white mb-2'>
                          {goal.goal_text}
                        </p>
                        <span className='text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700'>
                          {goal.domain}
                        </span>

                        {selectedGoals.includes(goal.id) && (
                          <div className='mt-4'>
                            <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2'>
                              التقدم في هذه الجلسة (%)
                            </label>
                            <input
                              type='range'
                              min='0'
                              max='100'
                              value={
                                goalProgress[goal.id] || goal.current_progress
                              }
                              onChange={e =>
                                setGoalProgress({
                                  ...goalProgress,
                                  [goal.id]: parseInt(e.target.value),
                                })
                              }
                              className='w-full'
                            />
                            <div className='flex justify-between text-sm text-gray-600 dark:text-gray-400'>
                              <span>0%</span>
                              <span className='font-bold text-[var(--default-default)]'>
                                {goalProgress[goal.id] || goal.current_progress}
                                %
                              </span>
                              <span>100%</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Home Recommendations */}
          <div className='card p-6'>
            <label className='block text-lg font-bold text-gray-900 dark:text-white mb-4'>
              توصيات منزلية للأسرة
            </label>
            <textarea
              value={homeRecommendations}
              onChange={e => setHomeRecommendations(e.target.value)}
              rows={4}
              className='w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--default-default)]'
              placeholder='نصائح وتمارين يمكن للأسرة القيام بها في المنزل...'
            />
          </div>

          {/* Next Session Focus */}
          <div className='card p-6'>
            <label className='block text-lg font-bold text-gray-900 dark:text-white mb-4'>
              تركيز الجلسة القادمة
            </label>
            <textarea
              value={nextSessionFocus}
              onChange={e => setNextSessionFocus(e.target.value)}
              rows={3}
              className='w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--default-default)]'
              placeholder='ما سنركز عليه في الجلسة القادمة...'
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className='space-y-6'>
          {/* Session Rating */}
          <div className='card p-6'>
            <label className='block text-lg font-bold text-gray-900 dark:text-white mb-4'>
              تقييم الجلسة
            </label>
            <div className='flex items-center gap-2 mb-4'>
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => setSessionRating(star)}
                  className={`text-3xl transition-all ${
                    star <= sessionRating
                      ? 'text-yellow-400 hover:scale-110'
                      : 'text-gray-300 dark:text-gray-600 hover:text-yellow-200'
                  }`}
                >
                  ⭐
                </button>
              ))}
            </div>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              {sessionRating === 5
                ? 'ممتازة'
                : sessionRating === 4
                  ? 'جيدة جداً'
                  : sessionRating === 3
                    ? 'جيدة'
                    : sessionRating === 2
                      ? 'مقبولة'
                      : 'تحتاج تحسين'}
            </p>
          </div>

          {/* Summary */}
          <div className='card p-6 bg-blue-50 dark:bg-blue-900/20'>
            <h3 className='font-bold text-blue-900 dark:text-blue-100 mb-3'>
              📋 الملخص
            </h3>
            <div className='space-y-2 text-sm text-blue-800 dark:text-blue-200'>
              <p>• الأهداف المختارة: {selectedGoals.length}</p>
              <p>• التقييم: {sessionRating}/5</p>
              <p>• ملاحظات: {notes ? '✅' : '❌'}</p>
            </div>
          </div>

          {/* Actions */}
          <div className='space-y-3'>
            <button
              onClick={handleSaveNotes}
              disabled={saving || !notes.trim()}
              className='btn btn-default w-full py-4 text-lg disabled:opacity-50'
            >
              {saving ? (
                <span className='flex items-center justify-center gap-2'>
                  <span className='animate-spin'>⏳</span>
                  جاري الحفظ...
                </span>
              ) : (
                '✅ حفظ وإنهاء الجلسة'
              )}
            </button>

            <button
              onClick={() => router.back()}
              className='btn btn-outline w-full'
            >
              إلغاء
            </button>
          </div>

          {/* Info */}
          <div className='card p-4 bg-green-50 dark:bg-green-900/20'>
            <p className='text-xs text-green-800 dark:text-green-200'>
              💡 عند الحفظ، سيتم: • حفظ الملاحظات • تحديث تقدم الأهداف • تحديث
              حالة الجلسة • إرسال تحديث للأسرة
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
