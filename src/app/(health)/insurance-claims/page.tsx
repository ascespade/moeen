'use client';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

interface InsuranceClaim {
  id: string;
  patient_name?: string;
  patient_id: string;
  claim_number: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'under-review';
  submission_date: string;
  review_date?: string;
  insurance_provider?: string;
  treatment_type?: string;
  description?: string;
  attachments?: string[];
  reviewer?: string;
  notes?: string;
}

export default function InsuranceClaimsPage() {
  const [claims, setClaims] = useState<InsuranceClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState<string | null>(null);

  const loadClaims = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const supabase = createClient();

      let query = supabase
        .from('insurance_claims')
        .select('*, patients(first_name, last_name)')
        .order('created_at', { ascending: false });

      if (selectedStatus !== 'all') {
        query = query.eq('status', selectedStatus);
      }

      const { data, error: queryError } = await query;

      if (queryError) throw queryError;

      // Transform data to match interface
      const transformedClaims = (data || []).map((claim: any) => ({
        id: claim.id,
        patient_name:
          claim.patient_name ||
          (claim.patients
            ? `${claim.patients.first_name} ${claim.patients.last_name}`
            : 'Unknown'),
        patient_id: claim.patient_id,
        claim_number: claim.claim_number,
        amount: claim.amount,
        status: claim.status,
        submission_date: claim.created_at || claim.submission_date,
        review_date: claim.review_date,
        insurance_provider: claim.insurance_provider,
        treatment_type: claim.treatment_type,
        description: claim.description,
        attachments: claim.attachments || [],
        reviewer: claim.reviewer,
        notes: claim.notes,
      }));

      setClaims(transformedClaims);
    } catch (err) {
      console.error('Failed to load claims:', err);
      setError('Failed to load insurance claims');
      // Fallback to empty array
      setClaims([]);
    } finally {
      setLoading(false);
    }
  }, [selectedStatus]);

  useEffect(() => {
    loadClaims();
  }, [selectedStatus, loadClaims]);

  const getStatusColor = (status: InsuranceClaim['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'under-review':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-surface text-gray-800';
    }
  };

  const getStatusText = (status: InsuranceClaim['status']) => {
    switch (status) {
      case 'pending':
        return 'قيد الانتظار';
      case 'approved':
        return 'موافق عليها';
      case 'rejected':
        return 'مرفوضة';
      case 'under-review':
        return 'قيد المراجعة';
      default:
        return 'غير محدد';
    }
  };

  const filteredClaims = claims.filter(claim => {
    const matchesSearch =
      claim.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.claim_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.insurance_provider
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === 'all' || claim.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const selectedClaim = showDetailsModal
    ? claims.find(c => c.id === showDetailsModal)
    : null;

  if (loading) {
    return (
      <main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded" aria-label="?????? ??????? ???????">
  ?????? ??????? ???????
</a>

div className='flex min-h-screen items-center justify-center bg-[var(--default-surface)]'>
        <div className='text-center'>
          <div className='mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]' />
          <p className='text-gray-600 dark:text-gray-400'>
            جاري تحميل البيانات...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-[var(--default-surface)]'>
        <div className='text-center'>
          <p className='mb-4 text-lg font-semibold text-red-600'>{error}</p>
          <button onClick={() => { loadClaims() }} aria-label="{ if (e.key === "Enter' || e.k" onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); () = aria-label="{ loadClaims() } }}
          "> { loadClaims() } }}
            className='rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'
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
                alt='مُعين'
                width={50}
                height={50}
                className='rounded-lg'
              />
              <div>
                <h1 className='text-default text-2xl font-bold'>
                  المطالبات التأمينية
                </h1>
                <p className='text-gray-600 dark:text-gray-300'>
                  إدارة وتتبع المطالبات
                </p>
              </div>
            </div>
            <div className='flex items-center gap-3'>
              <button onClick={() => { setShowCreateModal(true) }} aria-label="{ if (e.key === "Enter' || e.k" onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); () = aria-label="{ setShowCreateModal(true) } }"> { setShowCreateModal(true) } }}
                className='btn-default rounded-lg px-6 py-2 text-white transition-colors hover:bg-[var(--default-default-hover)]'
              >
                إضافة مطالبة
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className='container-app py-8' id="main-content">
        {/* Stats Cards */}
        <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-4'>
          <div className='card p-6 text-center'>
            <div className='mb-2 text-3xl font-bold text-default-default'>
              {claims.length}
            </div>
            <div className='text-gray-600 dark:text-gray-300'>
              إجمالي المطالبات
            </div>
          </div>
          <div className='card p-6 text-center'>
            <div className='mb-2 text-3xl font-bold text-yellow-600'>
              {claims.filter(c => c.status === 'pending').length}
            </div>
            <div className='text-gray-600 dark:text-gray-300'>قيد الانتظار</div>
          </div>
          <div className='card p-6 text-center'>
            <div className='mb-2 text-3xl font-bold text-default-success'>
              {claims.filter(c => c.status === 'approved').length}
            </div>
            <div className='text-gray-600 dark:text-gray-300'>موافق عليها</div>
          </div>
          <div className='card p-6 text-center'>
            <div className='mb-2 text-3xl font-bold text-default-error'>
              {claims.filter(c => c.status === 'rejected').length}
            </div>
            <div className='text-gray-600 dark:text-gray-300'>مرفوضة</div>
          </div>
        </div>

        {/* Filters */}
        <div className='card mb-8 p-6'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            <div>
              <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                البحث
              </label>
              <input type='text'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} aria-label="text" aria-invalid="true"
                placeholder='ابحث بالاسم أو رقم المطالبة...'
                className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--default-default)]'
              />
            </div>

            <div>
              <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                الحالة
              </label>
              <select
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value)}
                className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--default-default)]'
              >
                <option value='all'>جميع الحالات</option>
                <option value='pending'>قيد الانتظار</option>
                <option value='under-review'>قيد المراجعة</option>
                <option value='approved'>موافق عليها</option>
                <option value='rejected'>مرفوضة</option>
              </select>
            </div>

            <div className='flex items-end'>
              <button className='btn-default w-full rounded-lg py-2 text-white transition-colors hover:bg-[var(--default-default-hover)]' aria-label="تطبيق الفلاتر">
                تطبيق الفلاتر
              </button>
            </div>
          </div>
        </div>

        {/* Claims List */}
        <div className='card overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-surface dark:bg-gray-800'>
                <tr>
                  <th className='px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300'>
                    رقم المطالبة
                  </th>
                  <th className='px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300'>
                    المريض
                  </th>
                  <th className='px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300'>
                    شركة التأمين
                  </th>
                  <th className='px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300'>
                    المبلغ
                  </th>
                  <th className='px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300'>
                    الحالة
                  </th>
                  <th className='px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300'>
                    تاريخ الإرسال
                  </th>
                  <th className='px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300'>
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900'>
                {filteredClaims.map(claim => (
                  <tr
                    key={claim.id}
                    className='hover:bg-surface dark:hover:bg-gray-800'
                  >
                    <td className='whitespace-nowrap px-6 py-4'>
                      <div className='text-sm font-medium text-gray-900 dark:text-white'>
                        {claim.claim_number}
                      </div>
                    </td>
                    <td className='whitespace-nowrap px-6 py-4'>
                      <div className='text-sm text-gray-900 dark:text-white'>
                        {claim.patient_name}
                      </div>
                      <div className='text-sm text-gray-500'>
                        {claim.treatment_type}
                      </div>
                    </td>
                    <td className='whitespace-nowrap px-6 py-4'>
                      <div className='text-sm text-gray-600 dark:text-gray-300'>
                        {claim.insurance_provider}
                      </div>
                    </td>
                    <td className='whitespace-nowrap px-6 py-4'>
                      <div className='text-sm font-medium text-gray-900 dark:text-white'>
                        {claim.amount.toLocaleString()} ريال
                      </div>
                    </td>
                    <td className='whitespace-nowrap px-6 py-4'>
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${getStatusColor(claim.status)}`}
                      >
                        {getStatusText(claim.status)}
                      </span>
                    </td>
                    <td className='whitespace-nowrap px-6 py-4'>
                      <div className='text-sm text-gray-600 dark:text-gray-300'>
                        {claim.submission_date}
                      </div>
                    </td>
                    <td className='whitespace-nowrap px-6 py-4 text-sm font-medium'>
                      <div className='flex gap-2'>
                        <button onClick={() => { setShowDetailsModal(claim.id) }} aria-label="{ if (e.key === "Enter' || e.k" onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); () = aria-label="{ setShowDetailsModal(claim.id"> { setShowDetailsModal(claim.id) } }}
                          className='text-[var(--default-default)] hover:text-[var(--default-default-hover)]'
                        >
                          عرض
                        </button>
                        <button className='text-gray-600 hover:text-gray-900' aria-label="تعديل">
                          تعديل
                        </button>
                        {claim.status === 'pending' && (
                          <button className='text-default-success hover:text-green-700' aria-label="موافقة">
                            موافقة
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredClaims.length === 0 && (
          <div className='py-12 text-center'>
            <div className='mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-surface'>
              <span className='text-4xl'>📋</span>
            </div>
            <h3 className='mb-2 text-lg font-semibold text-gray-900 dark:text-white'>
              لا توجد مطالبات
            </h3>
            <p className='text-gray-600 dark:text-gray-300'>
              لا توجد مطالبات مطابقة للفلتر المحدد
            </p>
          </div>
        )}
      </main>

      {/* Create Claim Modal */}
      {showCreateModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <div className='w-full max-w-2xl rounded-lg bg-white p-6 dark:bg-gray-900'>
            <div className='mb-6 flex items-center justify-between'>
              <h3 className='text-xl font-semibold'>إضافة مطالبة تأمينية</h3>
              <button onClick={() => { setShowCreateModal(false) }} aria-label="{ if (e.key === "Enter' || e.k" onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); () = aria-label="{ setShowCreateModal(false) } "> { setShowCreateModal(false) } }}
                className='text-gray-400 hover:text-gray-600'
              >
                ✕
              </button>
            </div>

            <form className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                    المريض
                  </label>
                  <select className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--default-default)]'>
                    <option value=''>اختر المريض</option>
                    <option value='1'>أحمد العتيبي</option>
                    <option value='2'>فاطمة السعيد</option>
                    <option value='3'>خالد القحطاني</option>
                    <option value='4'>نورا السعد</option>
                  </select>
                </div>
                <div>
                  <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                    شركة التأمين
                  </label>
                  <select className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--default-default)]'>
                    <option value=''>اختر شركة التأمين</option>
                    <option value='التأمين التعاوني'>التأمين التعاوني</option>
                    <option value='الراجحي للتأمين'>الراجحي للتأمين</option>
                    <option value='التحالف الوطني'>التحالف الوطني</option>
                  </select>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                    نوع العلاج
                  </label>
                  <select className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--default-default)]'>
                    <option value=''>اختر نوع العلاج</option>
                    <option value='علاج طبيعي'>علاج طبيعي</option>
                    <option value='علاج نفسي'>علاج نفسي</option>
                    <option value='علاج وظيفي'>علاج وظيفي</option>
                    <option value='أشعة'>أشعة</option>
                  </select>
                </div>
                <div>
                  <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                    المبلغ
                  </label>
                  <input type='number'
                    className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--default-default)]'
                    placeholder='0'
                  / aria-label="0" aria-invalid="true">
                </div>
              </div>

              <div>
                <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                  وصف العلاج
                </label>
                <textarea
                  rows={3}
                  className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--default-default)]'
                  placeholder='وصف مفصل للعلاج المطلوب...'
                />
              </div>

              <div>
                <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                  المرفقات
                </label>
                <div className='rounded-lg border-2 border-dashed border-gray-300 p-6 text-center'>
                  <span className='text-gray-500'>
                    اسحب الملفات هنا أو انقر للرفع
                  </span>
                </div>
              </div>

              <div className='flex gap-3 pt-4'>
                <button type='button'
                  onClick={() => { setShowCreateModal(false) }} aria-label="{ if (e.key === "Enter' || e.k" onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); () = aria-label="{ setShowCreateModal(false) } "> { setShowCreateModal(false) } }}
                  className='flex-1 rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-surface'
                >
                  إلغاء
                </button>
                <button type='submit'
                  className='btn-default flex-1 rounded-lg py-2 text-white transition-colors hover:bg-[var(--default-default-hover)]' aria-label="إضافة المطالبة">
                  إضافة المطالبة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selectedClaim && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <div className='w-full max-w-4xl rounded-lg bg-white p-6 dark:bg-gray-900'>
            <div className='mb-6 flex items-center justify-between'>
              <h3 className='text-xl font-semibold'>تفاصيل المطالبة</h3>
              <button onClick={() => { setShowDetailsModal(null) }} aria-label="{ if (e.key === "Enter' || e.k" onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); () = aria-label="{ setShowDetailsModal(null) } "> { setShowDetailsModal(null) } }}
                className='text-gray-400 hover:text-gray-600'
              >
                ✕
              </button>
            </div>

            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <div>
                <h4 className='mb-4 font-semibold'>معلومات المطالبة</h4>
                <div className='space-y-3'>
                  <div className='flex justify-between'>
                    <span className='text-gray-600 dark:text-gray-300'>
                      رقم المطالبة:
                    </span>
                    <span className='font-medium'>
                      {selectedClaim.claim_number}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600 dark:text-gray-300'>
                      المريض:
                    </span>
                    <span className='font-medium'>
                      {selectedClaim.patient_name}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600 dark:text-gray-300'>
                      شركة التأمين:
                    </span>
                    <span className='font-medium'>
                      {selectedClaim.insurance_provider}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600 dark:text-gray-300'>
                      نوع العلاج:
                    </span>
                    <span className='font-medium'>
                      {selectedClaim.treatment_type}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600 dark:text-gray-300'>
                      المبلغ:
                    </span>
                    <span className='font-medium'>
                      {selectedClaim.amount.toLocaleString()} ريال
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600 dark:text-gray-300'>
                      الحالة:
                    </span>
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${getStatusColor(selectedClaim.status)}`}
                    >
                      {getStatusText(selectedClaim.status)}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className='mb-4 font-semibold'>التواريخ</h4>
                <div className='space-y-3'>
                  <div className='flex justify-between'>
                    <span className='text-gray-600 dark:text-gray-300'>
                      تاريخ الإرسال:
                    </span>
                    <span className='font-medium'>
                      {selectedClaim.submission_date}
                    </span>
                  </div>
                  {selectedClaim.review_date && (
                    <div className='flex justify-between'>
                      <span className='text-gray-600 dark:text-gray-300'>
                        تاريخ المراجعة:
                      </span>
                      <span className='font-medium'>
                        {selectedClaim.review_date}
                      </span>
                    </div>
                  )}
                  {selectedClaim.reviewer && (
                    <div className='flex justify-between'>
                      <span className='text-gray-600 dark:text-gray-300'>
                        المراجع:
                      </span>
                      <span className='font-medium'>
                        {selectedClaim.reviewer}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className='mt-6'>
              <h4 className='mb-4 font-semibold'>الوصف</h4>
              <p className='text-gray-600 dark:text-gray-300'>
                {selectedClaim.description}
              </p>
            </div>

            {selectedClaim.attachments &&
              selectedClaim.attachments.length > 0 && (
                <div className='mt-6'>
                  <h4 className='mb-4 font-semibold'>المرفقات</h4>
                  <div className='grid grid-cols-2 gap-4 md:grid-cols-3'>
                    {selectedClaim.attachments.map((attachment, index) => (
                      <div
                        key={index}
                        className='rounded-lg border border-gray-200 p-3 text-center dark:border-gray-700'
                      >
                        <span className='text-sm text-gray-600 dark:text-gray-300'>
                          {attachment}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {selectedClaim.notes && (
              <div className='mt-6'>
                <h4 className='mb-4 font-semibold'>ملاحظات</h4>
                <p className='text-gray-600 dark:text-gray-300'>
                  {selectedClaim.notes}
                </p>
              </div>
            )}

            <div className='flex gap-3 pt-6'>
              <button onClick={() => { setShowDetailsModal(null) }} aria-label="{ if (e.key === "Enter' || e.k" onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); () = aria-label="{ setShowDetailsModal(null) } "> { setShowDetailsModal(null) } }}
                className='flex-1 rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-surface'
              >
                إغلاق
              </button>
              {selectedClaim.status === 'pending' && (
                <button className='btn-default flex-1 rounded-lg py-2 text-white transition-colors hover:bg-[var(--default-default-hover)]' aria-label="مراجعة المطالبة">
                  مراجعة المطالبة
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
