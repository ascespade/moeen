'use client';
import { useState, useEffect } from 'react';

import { Card } from '@/components/ui/Card';

import { Button } from '@/components/ui/Button';

import { Badge } from '@/components/ui/Badge';

import { ROUTES } from '@/constants/routes';
import { realDB } from '@/lib/supabase-real';

import Image from 'next/image';

interface InsuranceClaim {
  id: string;
  patientName: string;
  patientId: string;
  claimNumber: string;
  insuranceCompany: string;
  serviceType: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  submissionDate: string;
  approvalDate?: string;
  rejectionReason?: string;
  isBlocked: boolean;
  hasOutstandingBalance: boolean;
  outstandingAmount?: number;
}

// Mock data removed - using real database
const statusConfig = {
  pending: { label: 'قيد المراجعة', color: 'warning' as const },
  approved: { label: 'موافق عليه', color: 'success' as const },
  rejected: { label: 'مرفوض', color: 'error' as const },
  under_review: { label: 'قيد التدقيق', color: 'info' as const },
};

export default function InsurancePage() {
  const [claims, setClaims] = useState<InsuranceClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedClaim, setSelectedClaim] = useState<InsuranceClaim | null>(
    null
  );
  const [filter, setFilter] = useState<
    'all' | 'pending' | 'approved' | 'rejected'
  >('all');

  // Load insurance claims from database
  useEffect(() => {
    const loadClaims = async () => {
      try {
        setLoading(true);
        // Get all insurance claims
        const claimsData = await realDB.getInsuranceClaims(''); // Get all claims for now

        // Transform data to match our interface
        const transformedClaims: InsuranceClaim[] = claimsData.map(
          (claim: any) => ({
            id: claim.id,
            patientName: claim.patients?.users?.name || 'غير محدد',
            patientId: claim.patient_id,
            claimNumber: claim.claim_number || 'غير محدد',
            insuranceCompany: claim.insurance_provider || 'غير محدد',
            serviceType: claim.service_code || 'خدمة طبية',
            amount: claim.amount || 0,
            status:
              claim.status === 'approved'
                ? 'approved'
                : claim.status === 'rejected'
                  ? 'rejected'
                  : claim.status === 'pending'
                    ? 'pending'
                    : 'under_review',
            submissionDate:
              claim.submitted_at ||
              claim.created_at ||
              new Date().toISOString().split('T')[0],
            approvalDate: claim.approved_at,
            rejectionReason: claim.rejection_reason,
            isBlocked: claim.status === 'rejected',
            hasOutstandingBalance: claim.status === 'rejected',
            outstandingAmount: claim.status === 'rejected' ? claim.amount : 0,
          })
        );

        setClaims(transformedClaims);
      } catch (err) {
        setError('فشل في تحميل بيانات مطالبات التأمين');
        console.error('Error loading insurance claims:', err);
      } finally {
        setLoading(false);
      }
    };

    loadClaims();
  }, []);

  const filteredClaims = claims.filter(
    claim => filter === 'all' || claim.status === filter
  );

  const getStatusBadge = (status: InsuranceClaim['status']) => {
    const config = statusConfig[status];
    return (
      <Badge variant={config.color} className='text-sm'>
        {config.label}
      </Badge>
    );
  };

  const getBlockStatus = (claim: InsuranceClaim) => {
    if (claim.isBlocked) {
      return (
        <div className='flex items-center gap-2 text-default-error'>
          <span className='h-2 w-2 rounded-full bg-default-error'></span>
          <span className='text-sm font-medium'>محظور</span>
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

  const getOutstandingBalance = (claim: InsuranceClaim) => {
    if (claim.hasOutstandingBalance) {
      return (
        <div className='flex items-center gap-2 text-default-default'>
          <span className='h-2 w-2 rounded-full bg-default-default'></span>
          <span className='text-sm font-medium'>
            رصيد مستحق: {claim.outstandingAmount?.toLocaleString()} ريال
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

  if (loading) {
    return (
      <div className='min-h-screen bg-[var(--default-surface)] flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--default-default)] mx-auto mb-4'></div>
          <p className='text-gray-600'>جاري تحميل مطالبات التأمين...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen bg-[var(--default-surface)] flex items-center justify-center'>
        <div className='text-center'>
          <div className='text-red-500 text-6xl mb-4'>⚠️</div>
          <p className='text-red-600 text-lg mb-4'>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className='px-4 py-2 bg-[var(--default-default)] text-white rounded-lg hover:bg-[var(--default-default-dark)]'
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

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
                  إدارة المطالبات التأمينية
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
              <Button variant='default' size='sm'>
                إضافة مطالبة جديدة
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='container-app py-8'>
        {/* Stats Cards */}
        <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-4'>
          <Card className='p-6 text-center'>
            <div className='text-default mb-2 text-3xl font-bold'>
              {claims.length}
            </div>
            <div className='text-gray-600 dark:text-gray-300'>
              إجمالي المطالبات
            </div>
          </Card>
          <Card className='p-6 text-center'>
            <div className='mb-2 text-3xl font-bold text-default-success'>
              {claims.filter(c => c.status === 'approved').length}
            </div>
            <div className='text-gray-600 dark:text-gray-300'>
              مطالبات موافق عليها
            </div>
          </Card>
          <Card className='p-6 text-center'>
            <div className='mb-2 text-3xl font-bold text-yellow-600'>
              {claims.filter(c => c.status === 'pending').length}
            </div>
            <div className='text-gray-600 dark:text-gray-300'>قيد المراجعة</div>
          </Card>
          <Card className='p-6 text-center'>
            <div className='mb-2 text-3xl font-bold text-default-error'>
              {claims.filter(c => c.isBlocked).length}
            </div>
            <div className='text-gray-600 dark:text-gray-300'>
              مطالبات محظورة
            </div>
          </Card>
        </div>

        {/* Filters */}
        <div className='mb-6 flex flex-wrap gap-3'>
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size='sm'
            onClick={() => setFilter('all')}
          >
            جميع المطالبات
          </Button>
          <Button
            variant={filter === 'pending' ? 'default' : 'outline'}
            size='sm'
            onClick={() => setFilter('pending')}
          >
            قيد المراجعة
          </Button>
          <Button
            variant={filter === 'approved' ? 'default' : 'outline'}
            size='sm'
            onClick={() => setFilter('approved')}
          >
            موافق عليها
          </Button>
          <Button
            variant={filter === 'rejected' ? 'default' : 'outline'}
            size='sm'
            onClick={() => setFilter('rejected')}
          >
            مرفوضة
          </Button>
        </div>

        {/* Claims List */}
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3'>
          {filteredClaims.map(claim => (
            <Card
              key={claim.id}
              className='cursor-pointer p-6 transition-all duration-300 hover:shadow-lg'
              onClick={() => setSelectedClaim(claim)}
            >
              <div className='mb-4 flex items-start justify-between'>
                <div>
                  <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                    {claim.patientName}
                  </h3>
                  <p className='text-sm text-gray-600 dark:text-gray-300'>
                    رقم المريض: {claim.patientId}
                  </p>
                </div>
                {getStatusBadge(claim.status)}
              </div>

              <div className='mb-4 space-y-3'>
                <div className='flex justify-between'>
                  <span className='text-sm text-gray-600 dark:text-gray-300'>
                    رقم المطالبة:
                  </span>
                  <span className='text-sm font-medium'>
                    {claim.claimNumber}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-sm text-gray-600 dark:text-gray-300'>
                    شركة التأمين:
                  </span>
                  <span className='text-sm font-medium'>
                    {claim.insuranceCompany}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-sm text-gray-600 dark:text-gray-300'>
                    نوع الخدمة:
                  </span>
                  <span className='text-sm font-medium'>
                    {claim.serviceType}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-sm text-gray-600 dark:text-gray-300'>
                    المبلغ:
                  </span>
                  <span className='text-default text-sm font-bold'>
                    {claim.amount.toLocaleString()} ريال
                  </span>
                </div>
              </div>

              <div className='mb-4 space-y-2'>
                {getBlockStatus(claim)}
                {getOutstandingBalance(claim)}
              </div>

              <div className='flex gap-2'>
                <Button variant='outline' size='sm' className='flex-1'>
                  عرض التفاصيل
                </Button>
                <Button variant='default' size='sm' className='flex-1'>
                  تحديث
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredClaims.length === 0 && (
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
                  d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                />
              </svg>
            </div>
            <h3 className='mb-2 text-lg font-semibold text-gray-900 dark:text-white'>
              لا توجد مطالبات
            </h3>
            <p className='mb-4 text-gray-600 dark:text-gray-300'>
              لا توجد مطالبات تأمينية تطابق الفلتر المحدد
            </p>
            <Button variant='default'>إضافة مطالبة جديدة</Button>
          </Card>
        )}
      </main>

      {/* Claim Details Modal */}
      {selectedClaim && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4'>
          <Card className='max-h-[90vh] w-full max-w-2xl overflow-y-auto'>
            <div className='p-6'>
              <div className='mb-6 flex items-center justify-between'>
                <h2 className='text-xl font-bold'>تفاصيل المطالبة</h2>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setSelectedClaim(null)}
                >
                  إغلاق
                </Button>
              </div>

              <div className='space-y-6'>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='text-sm text-gray-600 dark:text-gray-300'>
                      اسم المريض
                    </label>
                    <p className='font-medium'>{selectedClaim.patientName}</p>
                  </div>
                  <div>
                    <label className='text-sm text-gray-600 dark:text-gray-300'>
                      رقم المريض
                    </label>
                    <p className='font-medium'>{selectedClaim.patientId}</p>
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='text-sm text-gray-600 dark:text-gray-300'>
                      رقم المطالبة
                    </label>
                    <p className='font-medium'>{selectedClaim.claimNumber}</p>
                  </div>
                  <div>
                    <label className='text-sm text-gray-600 dark:text-gray-300'>
                      شركة التأمين
                    </label>
                    <p className='font-medium'>
                      {selectedClaim.insuranceCompany}
                    </p>
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='text-sm text-gray-600 dark:text-gray-300'>
                      نوع الخدمة
                    </label>
                    <p className='font-medium'>{selectedClaim.serviceType}</p>
                  </div>
                  <div>
                    <label className='text-sm text-gray-600 dark:text-gray-300'>
                      المبلغ
                    </label>
                    <p className='text-default text-lg font-bold'>
                      {selectedClaim.amount.toLocaleString()} ريال
                    </p>
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='text-sm text-gray-600 dark:text-gray-300'>
                      تاريخ التقديم
                    </label>
                    <p className='font-medium'>
                      {selectedClaim.submissionDate}
                    </p>
                  </div>
                  <div>
                    <label className='text-sm text-gray-600 dark:text-gray-300'>
                      الحالة
                    </label>
                    <div className='mt-1'>
                      {getStatusBadge(selectedClaim.status)}
                    </div>
                  </div>
                </div>

                {selectedClaim.approvalDate && (
                  <div>
                    <label className='text-sm text-gray-600 dark:text-gray-300'>
                      تاريخ الموافقة
                    </label>
                    <p className='font-medium'>{selectedClaim.approvalDate}</p>
                  </div>
                )}

                {selectedClaim.rejectionReason && (
                  <div>
                    <label className='text-sm text-gray-600 dark:text-gray-300'>
                      سبب الرفض
                    </label>
                    <p className='font-medium text-default-error'>
                      {selectedClaim.rejectionReason}
                    </p>
                  </div>
                )}

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='text-sm text-gray-600 dark:text-gray-300'>
                      حالة الحظر
                    </label>
                    <div className='mt-1'>{getBlockStatus(selectedClaim)}</div>
                  </div>
                  <div>
                    <label className='text-sm text-gray-600 dark:text-gray-300'>
                      الرصيد المستحق
                    </label>
                    <div className='mt-1'>
                      {getOutstandingBalance(selectedClaim)}
                    </div>
                  </div>
                </div>
              </div>

              <div className='mt-8 flex gap-3'>
                <Button variant='outline' className='flex-1'>
                  طباعة
                </Button>
                <Button variant='default' className='flex-1'>
                  تحديث الحالة
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
