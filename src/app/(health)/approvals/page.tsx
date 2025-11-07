'use client';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { createClient } from '@/lib/supabase/client';
import { useCallback, useEffect, useState } from 'react';

import Image from 'next/image';
import { logger } from '@/lib/utils/logger';

interface Approval {
  id: string;
  patientName: string;
  patientId: string;
  requestType:
    | 'treatment'
    | 'medication'
    | 'procedure'
    | 'referral'
    | 'emergency';
  requestTitle: string;
  description: string;
  requestedBy: string;
  requestedDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  approvedBy?: string;
  approvedDate?: string;
  rejectionReason?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedCost?: number;
  insuranceCoverage?: number;
  patientContribution?: number;
  isBlocked: boolean;
  blockReason?: string;
  hasOutstandingBalance: boolean;
  outstandingAmount?: number;
  attachments: string[];
  notes?: string;
}

// جلب الموافقات من قاعدة البيانات
// Load approvals from database
const loadApprovalsFromDB = async (): Promise<Approval[]> => {
  try {
    const response = await fetch('/api/approvals');
    if (!response.ok) throw new Error('Failed to load approvals');
    return await response.json();
  } catch (error) {
    logger.error('Error loading approvals:', { error })
    return [];
  }
};

// Legacy mock data - replaced with database query
const mockApprovals: Approval[] = [
  {
    id: '1',
    patientName: 'أحمد محمد العتيبي',
    patientId: 'P001',
    requestType: 'treatment',
    requestTitle: 'موافقة على برنامج العلاج الطبيعي',
    description:
      'طلب موافقة على بدء برنامج علاج طبيعي مكثف لمدة 6 أسابيع لعلاج إصابة العمود الفقري',
    requestedBy: 'د. سارة أحمد',
    requestedDate: '2024-01-20',
    status: 'approved',
    approvedBy: 'د. خالد العتيبي',
    approvedDate: '2024-01-22',
    priority: 'high',
    estimatedCost: 3000,
    insuranceCoverage: 2400,
    patientContribution: 600,
    isBlocked: false,
    hasOutstandingBalance: false,
    attachments: ['التقرير الطبي.pdf', 'الأشعة.pdf'],
    notes: 'تمت الموافقة مع تعديل عدد الجلسات من 20 إلى 18 جلسة',
  },
  {
    id: '2',
    patientName: 'فاطمة عبدالله السعيد',
    patientId: 'P002',
    requestType: 'medication',
    requestTitle: 'موافقة على دواء جديد',
    description: 'طلب موافقة على وصف دواء مضاد للاكتئاب جديد للمريضة',
    requestedBy: 'د. محمد حسن',
    requestedDate: '2024-01-21',
    status: 'pending',
    priority: 'medium',
    estimatedCost: 450,
    insuranceCoverage: 360,
    patientContribution: 90,
    isBlocked: false,
    hasOutstandingBalance: false,
    attachments: ['التقرير النفسي.pdf'],
  },
  {
    id: '3',
    patientName: 'محمد سالم القحطاني',
    patientId: 'P003',
    requestType: 'procedure',
    requestTitle: 'موافقة على إجراء جراحي',
    description: 'طلب موافقة على إجراء جراحة لعلاج الشلل النصفي',
    requestedBy: 'د. نورا محمد',
    requestedDate: '2024-01-18',
    status: 'rejected',
    rejectionReason: 'عدم توفر التغطية التأمينية للإجراء المطلوب',
    priority: 'urgent',
    estimatedCost: 15000,
    insuranceCoverage: 0,
    patientContribution: 15000,
    isBlocked: true,
    blockReason: 'عدم سداد الرسوم المستحقة',
    hasOutstandingBalance: true,
    outstandingAmount: 5000,
    attachments: ['التقرير الجراحي.pdf', 'الأشعة المقطعية.pdf'],
  },
  {
    id: '4',
    patientName: 'نورا أحمد الزهراني',
    patientId: 'P004',
    requestType: 'referral',
    requestTitle: 'إحالة إلى طبيب مختص',
    description: 'طلب إحالة المريضة إلى طبيب عظام مختص لمراجعة حالة الركبة',
    requestedBy: 'د. خالد العتيبي',
    requestedDate: '2024-01-22',
    status: 'under_review',
    priority: 'medium',
    estimatedCost: 800,
    insuranceCoverage: 640,
    patientContribution: 160,
    isBlocked: false,
    hasOutstandingBalance: false,
    attachments: ['التقرير الطبي.pdf', 'أشعة الركبة.pdf'],
  },
  {
    id: '5',
    patientName: 'سعد عبدالرحمن الغامدي',
    patientId: 'P005',
    requestType: 'emergency',
    requestTitle: 'موافقة طارئة على العلاج',
    description: 'طلب موافقة طارئة على بدء علاج فوري لحالة طوارئ',
    requestedBy: 'د. فاطمة السعيد',
    requestedDate: '2024-01-23',
    status: 'approved',
    approvedBy: 'د. أحمد محمد',
    approvedDate: '2024-01-23',
    priority: 'urgent',
    estimatedCost: 2000,
    insuranceCoverage: 1800,
    patientContribution: 200,
    isBlocked: false,
    hasOutstandingBalance: false,
    attachments: ['التقرير الطارئ.pdf'],
    notes: 'تمت الموافقة الفورية بسبب طبيعة الحالة الطارئة',
  },
];

const requestTypeConfig = {
  treatment: { label: 'علاج', color: 'secondary' as const, icon: '🏥' },
  medication: { label: 'دواء', color: 'warning' as const, icon: '💊' },
  procedure: { label: 'إجراء', color: 'error' as const, icon: '⚕️' },
  referral: { label: 'إحالة', color: 'success' as const, icon: '👨‍⚕️' },
  emergency: { label: 'طوارئ', color: 'error' as const, icon: '🚨' },
};

const statusConfig = {
  pending: { label: 'قيد المراجعة', color: 'warning' as const },
  approved: { label: 'موافق عليه', color: 'success' as const },
  rejected: { label: 'مرفوض', color: 'error' as const },
  under_review: { label: 'قيد التدقيق', color: 'secondary' as const },
};

const priorityConfig = {
  low: { label: 'منخفض', color: 'secondary' as const },
  medium: { label: 'متوسط', color: 'warning' as const },
  high: { label: 'عالي', color: 'error' as const },
  urgent: { label: 'عاجل', color: 'error' as const },
};

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApproval, setSelectedApproval] = useState<Approval | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<
    'all' | 'pending' | 'approved' | 'rejected'
  >('all');
  const [typeFilter, setTypeFilter] = useState<'all' | Approval['requestType']>(
    'all'
  );
  const [, setShowCreateModal] = useState(false);

  const loadApprovals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const supabase = createClient();

      let query = supabase
        .from('approvals')
        .select('*, patients(first_name, last_name, public_id)')
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error: queryError } = await query;

      if (queryError) throw queryError;

      // Transform data to match interface - using snake_case to camelCase
      const transformedApprovals = (data || []).map((approval: unknown) => {
        const apt = approval as {
          id: string;
          patient_id: string;
          request_type: string;
          request_title: string;
          description: string;
          requested_by: string;
          requested_date?: string;
          created_at: string;
          status: string;
          approved_by?: string;
          approved_date?: string;
          rejection_reason?: string;
          priority: string;
          estimated_cost?: string | number;
          insurance_coverage?: string | number;
          patient_contribution?: string | number;
          is_blocked?: boolean;
          block_reason?: string;
          has_outstanding_balance?: boolean;
          outstanding_amount?: string | number;
          attachments?: unknown[];
          notes?: string;
          patients?: { first_name?: string; last_name?: string };
        };
        return {
          id: apt.id,
          patientName: apt.patients
            ? `${apt.patients.first_name || ''} ${apt.patients.last_name || ''}`.trim() || 'Unknown'
            : 'Unknown',
          patientId: apt.patient_id,
          requestType: apt.request_type,
          requestTitle: apt.request_title,
          description: apt.description,
          requestedBy: apt.requested_by,
          requestedDate: apt.requested_date || apt.created_at,
          status: apt.status,
          approvedBy: apt.approved_by,
          approvedDate: apt.approved_date,
          rejectionReason: apt.rejection_reason,
          priority: apt.priority,
          estimatedCost: parseFloat(String(apt.estimated_cost || 0)),
          insuranceCoverage: parseFloat(String(apt.insurance_coverage || 0)),
          patientContribution: parseFloat(String(apt.patient_contribution || 0)),
          isBlocked: apt.is_blocked || false,
          blockReason: apt.block_reason,
          hasOutstandingBalance: apt.has_outstanding_balance || false,
          outstandingAmount: parseFloat(String(apt.outstanding_amount || 0)),
          attachments: Array.isArray(apt.attachments)
            ? apt.attachments
            : [],
          notes: apt.notes,
        };
      });

      setApprovals(transformedApprovals);
    } catch (err) {
      logger.error('Failed to load approvals:', { error: err })
      setError('Failed to load approvals');
      setApprovals([]);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    loadApprovals();
  }, [filter, loadApprovals]);

  const filteredApprovals = approvals.filter(approval => {
    const matchesSearch =
      approval.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      approval.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      approval.requestTitle.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filter === 'all' || approval.status === filter;
    const matchesType =
      typeFilter === 'all' || approval.requestType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded" aria-label="انتقل للمحتوى الرئيسي">
          انتقل للمحتوى الرئيسي
        </a>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto'></div>
          <p className='mt-4 text-lg text-gray-600'>جاري تحميل الموافقات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <div className='text-red-500 text-6xl mb-4'>⚠️</div>
          <h2 className='text-2xl font-bold text-gray-800 mb-2'>
            خطأ في التحميل
          </h2>
          <p className='text-gray-600 mb-4'>{error}</p>
          <Button onClick={loadApprovals} variant='primary'>
            إعادة المحاولة
          </Button>
        </div>
      </div>
    );
  }

  if (filteredApprovals.length === 0) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <div className='text-gray-400 text-6xl mb-4'>📋</div>
          <h2 className='text-2xl font-bold text-gray-800 mb-2'>
            لا توجد موافقات
          </h2>
          <p className='text-gray-600 mb-4'>
            {searchTerm || filter !== 'all' || typeFilter !== 'all'
              ? 'لم يتم العثور على موافقات تطابق معايير البحث'
              : 'لم يتم إنشاء أي موافقات بعد'}
          </p>
          {searchTerm || filter !== 'all' || typeFilter !== 'all' ? (
            <Button
              onClick={() => {
                setSearchTerm('');
                setFilter('all');
                setTypeFilter('all');
              }}
              variant='secondary'
            >
              مسح الفلاتر
            </Button>
          ) : (
            <Button onClick={() => setShowCreateModal(true)} variant='primary'>
              إنشاء موافقة جديدة
            </Button>
          )}
        </div>
      </div>
    );
  }

  const getRequestTypeBadge = (type: Approval['requestType']) => {
    const config = requestTypeConfig[type];
    return (
      <Badge variant={config.color} className='text-xs'>
        <span className='mr-1'>{config.icon}</span>
        {config.label}
      </Badge>
    );
  };

  const getStatusBadge = (status: Approval['status']) => {
    const config = statusConfig[status];
    return (
      <Badge variant={config.color} className='text-sm'>
        {config.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: Approval['priority']) => {
    const config = priorityConfig[priority];
    return (
      <Badge variant={config.color} className='text-xs'>
        {config.label}
      </Badge>
    );
  };

  const getBlockStatus = (approval: Approval) => {
    if (approval.isBlocked) {
      return (
        <div className='flex items-center gap-2 text-default-error'>
          <span className='h-2 w-2 rounded-full bg-default-error'></span>
          <span className='text-sm font-medium'>محظور</span>
          {approval.blockReason && (
            <span className='text-xs text-gray-500'>
              ({approval.blockReason})
            </span>
          )}
        </div>
      );
    }
    return (
      <div className='flex items-center gap-2 text-default-success'>
        <span className='h-2 w-2 rounded-full bg-default-success'></span>
        <span className='text-sm font-medium'>نشط</span>
      </div>
    );
  };

  const getOutstandingBalance = (approval: Approval) => {
    if (approval.hasOutstandingBalance) {
      return (
        <div className='flex items-center gap-2 text-default-default'>
          <span className='h-2 w-2 rounded-full bg-default-default'></span>
          <span className='text-sm font-medium'>
            رصيد مستحق: {approval.outstandingAmount?.toLocaleString()} ريال
          </span>
        </div>
      );
    }
    return (
      <div className='flex items-center gap-2 text-default-success'>
        <span className='h-2 w-2 rounded-full bg-default-success'></span>
        <span className='text-sm font-medium'>لا يوجد رصيد مستحق</span>
      </div>
    );
  };

  const getCostBreakdown = (approval: Approval) => {
    if (!approval.estimatedCost) return null;

    return (
      <div className='space-y-1 text-sm'>
        <div className='flex justify-between'>
          <span className='text-gray-600 dark:text-gray-300'>
            التكلفة الإجمالية:
          </span>
          <span className='font-medium'>
            {approval.estimatedCost.toLocaleString()} ريال
          </span>
        </div>
        {approval.insuranceCoverage && (
          <div className='flex justify-between text-default-success'>
            <span>التغطية التأمينية:</span>
            <span className='font-medium'>
              -{approval.insuranceCoverage.toLocaleString()} ريال
            </span>
          </div>
        )}
        {approval.patientContribution && (
          <div className='text-default flex justify-between'>
            <span>مساهمة المريض:</span>
            <span className='font-bold'>
              {approval.patientContribution.toLocaleString()} ريال
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className='min-h-screen bg-[var(--default-surface)]'>
      {/* Header */}
      <header className='border-default sticky top-0 z-10 border-b bg-white dark:bg-gray-900'>
        <div className='container-app py-6'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <Image
                src='/logo.png'
                alt='مركز الهمم'
                width={50}
                height={50}
                className='rounded-lg'
              />
              <div>
                <h1 className='text-default text-2xl font-bold'>
                  إدارة الموافقات
                </h1>
                <p className='text-gray-600 dark:text-gray-300'>
                  مركز الهمم للرعاية الصحية المتخصصة
                </p>
              </div>
            </div>
            <div className='flex items-center gap-3'>
              <Button variant='outline' size='sm'>
                تصدير التقرير
              </Button>
              <Button variant='primary' size='sm'>
                إضافة طلب موافقة
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='container-app py-8' id="main-content">
        {/* Stats Cards */}
        <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-4'>
          <Card className='p-6 text-center'>
            <div className='text-default mb-2 text-3xl font-bold'>
              {mockApprovals.length}
            </div>
            <div className='text-gray-600 dark:text-gray-300'>
              إجمالي الطلبات
            </div>
          </Card>
          <Card className='p-6 text-center'>
            <div className='mb-2 text-3xl font-bold text-yellow-600'>
              {mockApprovals.filter(a => a.status === 'pending').length}
            </div>
            <div className='text-gray-600 dark:text-gray-300'>قيد المراجعة</div>
          </Card>
          <Card className='p-6 text-center'>
            <div className='mb-2 text-3xl font-bold text-default-success'>
              {mockApprovals.filter(a => a.status === 'approved').length}
            </div>
            <div className='text-gray-600 dark:text-gray-300'>موافق عليها</div>
          </Card>
          <Card className='p-6 text-center'>
            <div className='mb-2 text-3xl font-bold text-default-error'>
              {mockApprovals.filter(a => a.status === 'rejected').length}
            </div>
            <div className='text-gray-600 dark:text-gray-300'>مرفوضة</div>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className='mb-6 flex flex-col gap-4 lg:flex-row'>
          <div className='flex-1'>
            <Input
              type='text'
              placeholder='البحث بالاسم أو رقم المريض أو عنوان الطلب...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className='w-full'
            />
          </div>
          <div className='flex flex-wrap gap-3'>
            <Button
              variant={filter === 'all' ? 'primary' : 'outline'}
              size='sm'
              onClick={() => setFilter('all')}
            >
              جميع الطلبات
            </Button>
            <Button
              variant={filter === 'pending' ? 'primary' : 'outline'}
              size='sm'
              onClick={() => setFilter('pending')}
            >
              قيد المراجعة
            </Button>
            <Button
              variant={filter === 'approved' ? 'primary' : 'outline'}
              size='sm'
              onClick={() => setFilter('approved')}
            >
              موافق عليها
            </Button>
            <Button
              variant={filter === 'rejected' ? 'primary' : 'outline'}
              size='sm'
              onClick={() => setFilter('rejected')}
            >
              مرفوضة
            </Button>
          </div>
        </div>

        {/* Type Filters */}
        <div className='mb-6 flex flex-wrap gap-3'>
          <Button
            variant={typeFilter === 'all' ? 'primary' : 'outline'}
            size='sm'
            onClick={() => setTypeFilter('all')}
          >
            جميع الأنواع
          </Button>
          {Object.entries(requestTypeConfig).map(([type, config]) => (
            <Button
              key={type}
              variant={typeFilter === type ? 'primary' : 'outline'}
              size='sm'
              onClick={() => setTypeFilter(type as Approval['requestType'])}
            >
              <span className='mr-1'>{config.icon}</span>
              {config.label}
            </Button>
          ))}
        </div>

        {/* Approvals List */}
        <div className='space-y-6'>
          {filteredApprovals.map(approval => (
            <Card
              key={approval.id}
              className='cursor-pointer p-6 transition-all duration-300 hover:shadow-lg'
              onClick={() => setSelectedApproval(approval)}
            >
              <div className='mb-4 flex items-start justify-between'>
                <div className='flex-1'>
                  <div className='mb-2 flex items-center gap-3'>
                    <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                      {approval.requestTitle}
                    </h3>
                    {getRequestTypeBadge(approval.requestType)}
                    {getPriorityBadge(approval.priority)}
                  </div>
                  <p className='mb-2 text-sm text-gray-600 dark:text-gray-300'>
                    المريض: {approval.patientName} (رقم: {approval.patientId})
                  </p>
                  <p className='text-sm text-gray-700 dark:text-gray-300'>
                    {approval.description}
                  </p>
                </div>
                <div className='text-right'>
                  {getStatusBadge(approval.status)}
                </div>
              </div>

              <div className='mb-4 grid grid-cols-1 gap-4 md:grid-cols-3'>
                <div>
                  <span className='text-sm text-gray-600 dark:text-gray-300'>
                    طلب من:
                  </span>
                  <p className='text-sm font-medium'>{approval.requestedBy}</p>
                </div>
                <div>
                  <span className='text-sm text-gray-600 dark:text-gray-300'>
                    تاريخ الطلب:
                  </span>
                  <p className='text-sm font-medium'>
                    {approval.requestedDate}
                  </p>
                </div>
                <div>
                  <span className='text-sm text-gray-600 dark:text-gray-300'>
                    المرفقات:
                  </span>
                  <p className='text-sm font-medium'>
                    {approval.attachments.length} ملف
                  </p>
                </div>
              </div>

              {approval.estimatedCost && (
                <div className='mb-4'>{getCostBreakdown(approval)}</div>
              )}

              <div className='flex items-center justify-between'>
                <div className='space-y-2'>
                  {getBlockStatus(approval)}
                  {getOutstandingBalance(approval)}
                </div>
                <div className='flex gap-2'>
                  <Button variant='outline' size='sm'>
                    عرض التفاصيل
                  </Button>
                  {approval.status === 'pending' && (
                    <Button variant='primary' size='sm'>
                      مراجعة
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredApprovals.length === 0 && (
          <Card className='p-12 text-center'>
            <div className='mb-4 text-gray-400'>
              <svg
                className='mx-auto h-16 w-16'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={1}
                  d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
            </div>
            <h3 className='mb-2 text-lg font-semibold text-gray-900 dark:text-white'>
              لا توجد طلبات موافقة
            </h3>
            <p className='mb-4 text-gray-600 dark:text-gray-300'>
              لا توجد طلبات موافقة تطابق البحث أو الفلتر المحدد
            </p>
            <Button variant='primary'>إضافة طلب موافقة</Button>
          </Card>
        )}
      </main>

      {/* Approval Details Modal */}
      {selectedApproval && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4'>
          <Card className='max-h-[90vh] w-full max-w-4xl overflow-y-auto'>
            <div className='p-6'>
              <div className='mb-6 flex items-center justify-between'>
                <h2 className='text-xl font-bold'>تفاصيل طلب الموافقة</h2>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setSelectedApproval(null)}
                >
                  إغلاق
                </Button>
              </div>

              <div className='space-y-6'>
                {/* Header Info */}
                <div className='flex items-start justify-between'>
                  <div>
                    <h3 className='mb-2 text-lg font-semibold'>
                      {selectedApproval.requestTitle}
                    </h3>
                    <div className='flex items-center gap-3'>
                      {getRequestTypeBadge(selectedApproval.requestType)}
                      {getPriorityBadge(selectedApproval.priority)}
                      {getStatusBadge(selectedApproval.status)}
                    </div>
                  </div>
                </div>

                {/* Patient Info */}
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                  <div>
                    <h4 className='mb-3 font-semibold'>معلومات المريض</h4>
                    <div className='space-y-2'>
                      <div>
                        <span className='text-sm text-gray-600 dark:text-gray-300'>
                          الاسم:
                        </span>
                        <p className='font-medium'>
                          {selectedApproval.patientName}
                        </p>
                      </div>
                      <div>
                        <span className='text-sm text-gray-600 dark:text-gray-300'>
                          رقم المريض:
                        </span>
                        <p className='font-medium'>
                          {selectedApproval.patientId}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className='mb-3 font-semibold'>معلومات الطلب</h4>
                    <div className='space-y-2'>
                      <div>
                        <span className='text-sm text-gray-600 dark:text-gray-300'>
                          طلب من:
                        </span>
                        <p className='font-medium'>
                          {selectedApproval.requestedBy}
                        </p>
                      </div>
                      <div>
                        <span className='text-sm text-gray-600 dark:text-gray-300'>
                          تاريخ الطلب:
                        </span>
                        <p className='font-medium'>
                          {selectedApproval.requestedDate}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className='mb-3 font-semibold'>وصف الطلب</h4>
                  <p className='rounded-lg bg-surface p-4 text-gray-700 dark:bg-gray-800 dark:text-gray-300'>
                    {selectedApproval.description}
                  </p>
                </div>

                {/* Cost Information */}
                {selectedApproval.estimatedCost && (
                  <div>
                    <h4 className='mb-3 font-semibold'>معلومات التكلفة</h4>
                    <div className='rounded-lg bg-surface p-4 dark:bg-gray-800'>
                      {getCostBreakdown(selectedApproval)}
                    </div>
                  </div>
                )}

                {/* Attachments */}
                <div>
                  <h4 className='mb-3 font-semibold'>المرفقات</h4>
                  <div className='flex flex-wrap gap-2'>
                    {selectedApproval.attachments.map((attachment, index) => (
                      <Badge
                        key={index}
                        variant='secondary'
                        className='text-sm'
                      >
                        📎 {attachment}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Approval Info */}
                {selectedApproval.status === 'approved' &&
                  selectedApproval.approvedBy && (
                    <div>
                      <h4 className='mb-3 font-semibold'>معلومات الموافقة</h4>
                      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <div>
                          <span className='text-sm text-gray-600 dark:text-gray-300'>
                            وافق عليه:
                          </span>
                          <p className='font-medium'>
                            {selectedApproval.approvedBy}
                          </p>
                        </div>
                        <div>
                          <span className='text-sm text-gray-600 dark:text-gray-300'>
                            تاريخ الموافقة:
                          </span>
                          <p className='font-medium'>
                            {selectedApproval.approvedDate}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                {/* Rejection Info */}
                {selectedApproval.status === 'rejected' &&
                  selectedApproval.rejectionReason && (
                    <div>
                      <h4 className='mb-3 font-semibold'>سبب الرفض</h4>
                      <p className='rounded-lg bg-surface p-4 text-default-error dark:bg-red-900/20'>
                        {selectedApproval.rejectionReason}
                      </p>
                    </div>
                  )}

                {/* Notes */}
                {selectedApproval.notes && (
                  <div>
                    <h4 className='mb-3 font-semibold'>ملاحظات</h4>
                    <p className='rounded-lg bg-surface p-4 text-gray-700 dark:bg-blue-900/20 dark:text-gray-300'>
                      {selectedApproval.notes}
                    </p>
                  </div>
                )}

                {/* Status Info */}
                <div>
                  <h4 className='mb-3 font-semibold'>حالة الطلب</h4>
                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <div>
                      <span className='text-sm text-gray-600 dark:text-gray-300'>
                        حالة الحظر:
                      </span>
                      <div className='mt-1'>
                        {getBlockStatus(selectedApproval)}
                      </div>
                    </div>
                    <div>
                      <span className='text-sm text-gray-600 dark:text-gray-300'>
                        الرصيد المستحق:
                      </span>
                      <div className='mt-1'>
                        {getOutstandingBalance(selectedApproval)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className='mt-8 flex gap-3'>
                <Button variant='outline' className='flex-1'>
                  طباعة
                </Button>
                {selectedApproval.status === 'pending' && (
                  <>
                    <Button variant='outline' className='flex-1'>
                      رفض
                    </Button>
                    <Button variant='primary' className='flex-1'>
                      موافقة
                    </Button>
                  </>
                )}
                <Button variant='primary' className='flex-1'>
                  تحديث
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
