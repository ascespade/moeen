'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import {
  TrendingUp,
  Calendar,
  Clock,
  User,
  Target,
  BarChart3,
  FileText,
  Video,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Eye,
  CheckCircle,
  AlertCircle,
  Award,
  BookOpen,
  Users,
  Star,
  Activity,
  Brain,
  Heart,
  Zap,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface ProgressGoal {
  id: string;
  patient_id: string;
  goal_title: string;
  description: string;
  category: string;
  target_date: string;
  progress_percentage: number;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  milestones: Milestone[];
  created_at: string;
  updated_at: string;
  patients?: {
    first_name: string;
    last_name: string;
    age: number;
    condition: string;
    avatar?: string;
  };
}

interface Milestone {
  id: string;
  goal_id: string;
  title: string;
  description: string;
  target_date: string;
  completed_date?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  progress_percentage: number;
  notes?: string;
}

interface Assessment {
  id: string;
  patient_id: string;
  assessor_id: string;
  assessment_date: string;
  assessment_type: string;
  category: string;
  score: number;
  max_score: number;
  percentage: number;
  notes: string;
  recommendations: string[];
  next_assessment_date: string;
  created_at: string;
  assessors?: {
    first_name: string;
    last_name: string;
    specialty: string;
    avatar?: string;
  };
}

interface ProgressReport {
  id: string;
  patient_id: string;
  report_date: string;
  period_start: string;
  period_end: string;
  overall_progress: number;
  goals_achieved: number;
  total_goals: number;
  sessions_completed: number;
  total_sessions: number;
  recommendations: string[];
  next_review_date: string;
  created_at: string;
}

const ProgressTrackingPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [goals, setGoals] = useState<ProgressGoal[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [reports, setReports] = useState<ProgressReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<
    'goals' | 'assessments' | 'reports'
  >('goals');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    loadProgressData();
  }, [isAuthenticated, router]);

  const loadProgressData = async () => {
    try {
      setLoading(true);
      // Load real data from database
      const goalsData = (await realDB.getProgressGoals?.()) || [];
      const assessmentsData = (await realDB.getAssessments?.()) || [];
      const reportsData = (await realDB.getProgressReports?.()) || [];

      // Transform real data to match interface
      const transformedGoals: ProgressGoal[] = goalsData.map((goal: any) => ({
        id: goal.id,
        patient_id: goal.patient_id,
        goal_title: goal.title || goal.goal_title,
        description: goal.description,
        category: goal.category || 'عام',
        target_date: goal.target_date,
        progress_percentage: goal.progress_percentage || 0,
        status: goal.status || 'active',
        milestones: goal.milestones || [],
        created_at: goal.created_at,
        updated_at: goal.updated_at,
        patients: goal.patients || {
          first_name: 'غير محدد',
          last_name: '',
          age: 0,
          condition: 'غير محدد',
        },
      }));

      const transformedAssessments: Assessment[] = assessmentsData.map(
        (assessment: any) => ({
          id: assessment.id,
          patient_id: assessment.patient_id,
          assessment_type: assessment.type || assessment.assessment_type,
          assessment_date: assessment.date || assessment.assessment_date,
          score: assessment.score || 0,
          max_score: assessment.max_score || 100,
          notes: assessment.notes || '',
          assessor: assessment.assessor || 'غير محدد',
          status: assessment.status || 'completed',
          created_at: assessment.created_at,
          updated_at: assessment.updated_at,
          patients: assessment.patients || {
            first_name: 'غير محدد',
            last_name: '',
            age: 0,
            condition: 'غير محدد',
          },
        })
      );

      const transformedReports: ProgressReport[] = reportsData.map(
        (report: any) => ({
          id: report.id,
          patient_id: report.patient_id,
          report_date: report.date || report.report_date,
          period_start: report.period_start,
          period_end: report.period_end,
          goals_achieved: report.goals_achieved || 0,
          goals_total: report.goals_total || 0,
          progress_summary: report.summary || report.progress_summary,
          challenges: report.challenges || [],
          recommendations: report.recommendations || [],
          next_goals: report.next_goals || [],
          created_at: report.created_at,
          updated_at: report.updated_at,
          patients: report.patients || {
            first_name: 'غير محدد',
            last_name: '',
            age: 0,
            condition: 'غير محدد',
          },
        })
      );

      setGoals(transformedGoals);
      setAssessments(transformedAssessments);
      setReports(transformedReports);
    } catch (error) {
      setError('فشل في تحميل بيانات تتبع التقدم');
      console.error('Error loading progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      active: { label: 'نشط', variant: 'primary' as const },
      completed: { label: 'مكتمل', variant: 'primary' as const },
      paused: { label: 'متوقف', variant: 'secondary' as const },
      cancelled: { label: 'ملغي', variant: 'destructive' as const },
    };

    const statusInfo = statusMap[status as keyof typeof statusMap] || {
      label: status,
      variant: 'primary' as const,
    };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'الحركة':
        return <Activity className='w-4 h-4 text-brand-primary' />;
      case 'التواصل':
        return <Heart className='w-4 h-4 text-brand-error' />;
      case 'الإدراك':
        return <Brain className='w-4 h-4 text-purple-500' />;
      case 'الاستقلالية':
        return <Zap className='w-4 h-4 text-brand-warning' />;
      default:
        return <Target className='w-4 h-4 text-gray-500' />;
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-brand-success';
    if (percentage >= 60) return 'bg-brand-warning';
    if (percentage >= 40) return 'bg-brand-primary';
    return 'bg-brand-error';
  };

  const filteredGoals = goals.filter(goal => {
    const matchesSearch =
      goal.goal_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      goal.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      filterCategory === 'all' || goal.category === filterCategory;
    const matchesStatus =
      filterStatus === 'all' || goal.status === filterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className='container mx-auto px-4 py-8' dir='rtl'>
      {/* Header */}
      <div className='mb-8'>
        <div className='flex items-center justify-between mb-4'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>
              تتبع التقدم والتقييم
            </h1>
            <p className='text-gray-600 mt-2'>
              مراقبة تقدم المرضى وتقييم أدائهم
            </p>
          </div>
          <Button
            onClick={() => router.push('/progress-tracking/new')}
            className='bg-[var(--brand-primary)] hover:brightness-95'
          >
            <Plus className='w-4 h-4 mr-2' />
            هدف جديد
          </Button>
        </div>

        {/* Search and Filters */}
        <div className='flex flex-col md:flex-row gap-4 mb-6'>
          <div className='flex-1'>
            <Input
              placeholder='البحث في الأهداف والتقييمات...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className='pr-10'
            />
          </div>
          <div className='flex gap-2'>
            <select
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              className='px-3 py-2 border border-gray-300 rounded-md text-sm'
            >
              <option value='all'>جميع الفئات</option>
              <option value='الحركة'>الحركة</option>
              <option value='التواصل'>التواصل</option>
              <option value='الإدراك'>الإدراك</option>
              <option value='الاستقلالية'>الاستقلالية</option>
            </select>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className='px-3 py-2 border border-gray-300 rounded-md text-sm'
            >
              <option value='all'>جميع الحالات</option>
              <option value='active'>نشط</option>
              <option value='completed'>مكتمل</option>
              <option value='paused'>متوقف</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              الأهداف النشطة
            </CardTitle>
            <Target className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {goals.filter(g => g.status === 'active').length}
            </div>
            <p className='text-xs text-muted-foreground'>
              {goals.filter(g => g.status === 'completed').length} مكتملة
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>متوسط التقدم</CardTitle>
            <TrendingUp className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {goals.length > 0
                ? Math.round(
                    goals.reduce(
                      (acc, goal) => acc + goal.progress_percentage,
                      0
                    ) / goals.length
                  )
                : 0}
              %
            </div>
            <p className='text-xs text-muted-foreground'>من الأهداف</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>التقييمات</CardTitle>
            <BarChart3 className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{assessments.length}</div>
            <p className='text-xs text-muted-foreground'>تقييم مكتمل</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>التقارير</CardTitle>
            <FileText className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{reports.length}</div>
            <p className='text-xs text-muted-foreground'>تقرير شهري</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className='mb-6'>
        <div className='flex space-x-1 bg-surface p-1 rounded-lg'>
          <button
            onClick={() => setActiveTab('goals')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'goals'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            الأهداف والمراحل
          </button>
          <button
            onClick={() => setActiveTab('assessments')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'assessments'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            التقييمات
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'reports'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            التقارير
          </button>
        </div>
      </div>

      {/* Content based on active tab */}
      {loading ? (
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--brand-primary)]'></div>
        </div>
      ) : (
        <>
          {/* Goals Tab */}
          {activeTab === 'goals' && (
            <div className='space-y-6'>
              {filteredGoals.length === 0 ? (
                <Card>
                  <CardContent className='p-12 text-center'>
                    <Target className='h-12 w-12 text-gray-400 mx-auto mb-4' />
                    <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                      لا توجد أهداف
                    </h3>
                    <p className='text-gray-600 mb-4'>
                      ابدأ بإنشاء هدف جديد للمريض
                    </p>
                    <Button
                      onClick={() => router.push('/progress-tracking/new')}
                      className='bg-[var(--brand-primary)] hover:brightness-95'
                    >
                      إنشاء هدف جديد
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                filteredGoals.map(goal => (
                  <Card
                    key={goal.id}
                    className='hover:shadow-md transition-shadow'
                  >
                    <CardContent className='p-6'>
                      <div className='flex items-start justify-between mb-4'>
                        <div className='flex items-center gap-4'>
                          <div className='p-3 bg-surface rounded-lg'>
                            {getCategoryIcon(goal.category)}
                          </div>
                          <div>
                            <h3 className='text-lg font-semibold'>
                              {goal.goal_title}
                            </h3>
                            <p className='text-sm text-gray-600'>
                              {goal.description}
                            </p>
                            <p className='text-xs text-gray-500 mt-1'>
                              {goal.patients?.first_name}{' '}
                              {goal.patients?.last_name} -{' '}
                              {goal.patients?.condition}
                            </p>
                          </div>
                        </div>
                        <div className='flex items-center gap-2'>
                          {getStatusBadge(goal.status)}
                          <Button variant='outline' size='sm'>
                            <MoreVertical className='w-4 h-4' />
                          </Button>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className='mb-4'>
                        <div className='flex items-center justify-between mb-2'>
                          <span className='text-sm font-medium'>التقدم</span>
                          <span className='text-sm text-gray-600'>
                            {goal.progress_percentage}%
                          </span>
                        </div>
                        <div className='w-full bg-gray-200 rounded-full h-3'>
                          <div
                            className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(goal.progress_percentage)}`}
                            style={{ width: `${goal.progress_percentage}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Milestones */}
                      <div className='mb-4'>
                        <h4 className='text-sm font-semibold mb-3'>المراحل:</h4>
                        <div className='space-y-2'>
                          {goal.milestones.map(milestone => (
                            <div
                              key={milestone.id}
                              className='flex items-center justify-between p-3 bg-surface rounded-lg'
                            >
                              <div className='flex items-center gap-3'>
                                <div
                                  className={`w-3 h-3 rounded-full ${
                                    milestone.status === 'completed'
                                      ? 'bg-brand-success'
                                      : milestone.status === 'in_progress'
                                        ? 'bg-brand-warning'
                                        : 'bg-gray-300'
                                  }`}
                                ></div>
                                <div>
                                  <p className='text-sm font-medium'>
                                    {milestone.title}
                                  </p>
                                  <p className='text-xs text-gray-600'>
                                    {milestone.description}
                                  </p>
                                </div>
                              </div>
                              <div className='text-right'>
                                <p className='text-xs text-gray-600'>
                                  {milestone.progress_percentage}%
                                </p>
                                <p className='text-xs text-gray-500'>
                                  {milestone.target_date}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className='flex items-center justify-between pt-4 border-t'>
                        <div className='text-sm text-gray-600'>
                          الهدف حتى{' '}
                          {new Date(goal.target_date).toLocaleDateString(
                            'ar-SA'
                          )}
                        </div>
                        <div className='flex gap-2'>
                          <Button variant='outline' size='sm'>
                            <Eye className='w-4 h-4 mr-1' />
                            عرض
                          </Button>
                          <Button variant='outline' size='sm'>
                            <Edit className='w-4 h-4 mr-1' />
                            تعديل
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}

          {/* Assessments Tab */}
          {activeTab === 'assessments' && (
            <div className='space-y-6'>
              {assessments.length === 0 ? (
                <Card>
                  <CardContent className='p-12 text-center'>
                    <BarChart3 className='h-12 w-12 text-gray-400 mx-auto mb-4' />
                    <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                      لا توجد تقييمات
                    </h3>
                    <p className='text-gray-600 mb-4'>ابدأ بإنشاء تقييم جديد</p>
                    <Button
                      onClick={() =>
                        router.push('/progress-tracking/assessments/new')
                      }
                      className='bg-[var(--brand-primary)] hover:brightness-95'
                    >
                      إنشاء تقييم جديد
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                assessments.map(assessment => (
                  <Card
                    key={assessment.id}
                    className='hover:shadow-md transition-shadow'
                  >
                    <CardContent className='p-6'>
                      <div className='flex items-start justify-between mb-4'>
                        <div>
                          <h3 className='text-lg font-semibold'>
                            {assessment.assessment_type}
                          </h3>
                          <p className='text-sm text-gray-600'>
                            {assessment.category}
                          </p>
                          <p className='text-xs text-gray-500 mt-1'>
                            {assessment.assessors?.first_name}{' '}
                            {assessment.assessors?.last_name}
                          </p>
                        </div>
                        <div className='text-right'>
                          <div className='text-2xl font-bold text-brand-primary'>
                            {assessment.percentage}%
                          </div>
                          <p className='text-sm text-gray-600'>
                            {assessment.score}/{assessment.max_score}
                          </p>
                        </div>
                      </div>

                      <div className='mb-4'>
                        <h4 className='text-sm font-semibold mb-2'>
                          الملاحظات:
                        </h4>
                        <p className='text-sm text-gray-700 bg-surface p-3 rounded-lg'>
                          {assessment.notes}
                        </p>
                      </div>

                      <div className='mb-4'>
                        <h4 className='text-sm font-semibold mb-2'>
                          التوصيات:
                        </h4>
                        <div className='flex flex-wrap gap-2'>
                          {assessment.recommendations.map((rec, index) => (
                            <Badge
                              key={index}
                              variant='outline'
                              className='text-xs'
                            >
                              {rec}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className='flex items-center justify-between pt-4 border-t'>
                        <div className='text-sm text-gray-600'>
                          {new Date(
                            assessment.assessment_date
                          ).toLocaleDateString('ar-SA')}
                        </div>
                        <div className='flex gap-2'>
                          <Button variant='outline' size='sm'>
                            <Eye className='w-4 h-4 mr-1' />
                            عرض
                          </Button>
                          <Button variant='outline' size='sm'>
                            <Edit className='w-4 h-4 mr-1' />
                            تعديل
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div className='space-y-6'>
              {reports.length === 0 ? (
                <Card>
                  <CardContent className='p-12 text-center'>
                    <FileText className='h-12 w-12 text-gray-400 mx-auto mb-4' />
                    <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                      لا توجد تقارير
                    </h3>
                    <p className='text-gray-600 mb-4'>
                      سيتم إنشاء التقارير تلقائياً
                    </p>
                  </CardContent>
                </Card>
              ) : (
                reports.map(report => (
                  <Card
                    key={report.id}
                    className='hover:shadow-md transition-shadow'
                  >
                    <CardContent className='p-6'>
                      <div className='flex items-start justify-between mb-4'>
                        <div>
                          <h3 className='text-lg font-semibold'>
                            تقرير التقدم الشهري
                          </h3>
                          <p className='text-sm text-gray-600'>
                            {new Date(report.period_start).toLocaleDateString(
                              'ar-SA'
                            )}{' '}
                            -{' '}
                            {new Date(report.period_end).toLocaleDateString(
                              'ar-SA'
                            )}
                          </p>
                        </div>
                        <div className='text-right'>
                          <div className='text-2xl font-bold text-brand-success'>
                            {report.overall_progress}%
                          </div>
                          <p className='text-sm text-gray-600'>التقدم العام</p>
                        </div>
                      </div>

                      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
                        <div className='text-center p-3 bg-surface rounded-lg'>
                          <div className='text-xl font-bold text-brand-primary'>
                            {report.goals_achieved}
                          </div>
                          <div className='text-sm text-blue-700'>
                            أهداف محققة
                          </div>
                          <div className='text-xs text-gray-600'>
                            من أصل {report.total_goals}
                          </div>
                        </div>
                        <div className='text-center p-3 bg-surface rounded-lg'>
                          <div className='text-xl font-bold text-brand-success'>
                            {report.sessions_completed}
                          </div>
                          <div className='text-sm text-green-700'>
                            جلسات مكتملة
                          </div>
                          <div className='text-xs text-gray-600'>
                            من أصل {report.total_sessions}
                          </div>
                        </div>
                        <div className='text-center p-3 bg-surface rounded-lg'>
                          <div className='text-xl font-bold text-purple-600'>
                            {Math.round(
                              (report.goals_achieved / report.total_goals) * 100
                            )}
                            %
                          </div>
                          <div className='text-sm text-purple-700'>
                            معدل الإنجاز
                          </div>
                        </div>
                      </div>

                      <div className='mb-4'>
                        <h4 className='text-sm font-semibold mb-2'>
                          التوصيات:
                        </h4>
                        <div className='flex flex-wrap gap-2'>
                          {report.recommendations.map((rec, index) => (
                            <Badge
                              key={index}
                              variant='secondary'
                              className='text-xs'
                            >
                              {rec}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className='flex items-center justify-between pt-4 border-t'>
                        <div className='text-sm text-gray-600'>
                          التقرير التالي:{' '}
                          {new Date(report.next_review_date).toLocaleDateString(
                            'ar-SA'
                          )}
                        </div>
                        <div className='flex gap-2'>
                          <Button variant='outline' size='sm'>
                            <Eye className='w-4 h-4 mr-1' />
                            عرض
                          </Button>
                          <Button variant='outline' size='sm'>
                            <FileText className='w-4 h-4 mr-1' />
                            تصدير
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProgressTrackingPage;
