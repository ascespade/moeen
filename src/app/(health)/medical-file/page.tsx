'use client';
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { realDB } from '@/lib/supabase-real';
import Image from 'next/image';

interface MedicalRecord {
  id: string;
  patientName: string;
  patientId: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  phone: string;
  email: string;
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
  medicalHistory: string[];
  allergies: string[];
  currentMedications: string[];
  lastVisit: string;
  nextAppointment?: string;
  isBlocked: boolean;
  blockReason?: string;
  hasOutstandingBalance: boolean;
  outstandingAmount?: number;
  insuranceStatus: 'active' | 'expired' | 'pending' | 'rejected';
  insuranceCompany?: string;
  insuranceNumber?: string;
  treatmentPlan: {
    id: string;
    type: string;
    sessions: number;
    completedSessions: number;
    status: 'active' | 'completed' | 'paused' | 'cancelled';
    startDate: string;
    endDate?: string;
    therapist: string;
  }[];
}

// Mock data removed - using real database
const insuranceStatusConfig = {
  active: { label: 'نشط', color: 'success' as const },
  expired: { label: 'منتهي الصلاحية', color: 'error' as const },
  pending: { label: 'قيد المراجعة', color: 'warning' as const },
  rejected: { label: 'مرفوض', color: 'error' as const },
};

const treatmentStatusConfig = {
  active: { label: 'نشط', color: 'success' as const },
  completed: { label: 'مكتمل', color: 'info' as const },
  paused: { label: 'متوقف', color: 'warning' as const },
  cancelled: { label: 'ملغي', color: 'error' as const },
};

export default function MedicalFilePage() {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<
    'all' | 'active' | 'blocked' | 'outstanding'
  >('all');

  // Load medical records from database
  useEffect(() => {
    const loadRecords = async () => {
      try {
        setLoading(true);
        // Get all patients with their medical information
        const patientsData = await realDB.searchUsers('', 'patient');

        // Transform data to match our interface
        const transformedRecords: MedicalRecord[] = patientsData.map(
          (patient: any) => ({
            id: patient.id,
            patientName: patient.name || 'غير محدد',
            patientId: patient.national_id || patient.id,
            dateOfBirth: patient.date_of_birth || 'غير محدد',
            gender: patient.gender || 'male',
            phone: patient.phone || 'غير محدد',
            email: patient.email || 'غير محدد',
            address: patient.address || 'غير محدد',
            emergencyContact: patient.emergency_contact || 'غير محدد',
            emergencyPhone: patient.emergency_contact_phone || 'غير محدد',
            medicalHistory: patient.medical_history || [],
            allergies: patient.allergies || [],
            currentMedications: patient.medications || [],
            lastVisit: patient.last_visit || 'غير محدد',
            nextAppointment: patient.next_appointment,
            isBlocked: patient.is_blocked || false,
            blockReason: patient.block_reason,
            hasOutstandingBalance: patient.has_outstanding_balance || false,
            outstandingAmount: patient.outstanding_amount || 0,
            insuranceStatus: patient.insurance_status || 'pending',
            insuranceCompany: patient.insurance_provider,
            insuranceNumber: patient.insurance_number,
            treatmentPlan: patient.treatment_plans || [],
          })
        );

        setRecords(transformedRecords);
      } catch (err) {
        setError('فشل في تحميل الملفات الطبية');
        console.error('Error loading medical records:', err);
      } finally {
        setLoading(false);
      }
    };

    loadRecords();
  }, []);

  const filteredRecords = records.filter(record => {
    const matchesSearch =
      record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.patientId.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === 'all') return matchesSearch;
    if (filter === 'active')
      return (
        matchesSearch && !record.isBlocked && !record.hasOutstandingBalance
      );
    if (filter === 'blocked') return matchesSearch && record.isBlocked;
    if (filter === 'outstanding')
      return matchesSearch && record.hasOutstandingBalance;

    return matchesSearch;
  });

  const getInsuranceStatusBadge = (
    status: MedicalRecord['insuranceStatus']
  ) => {
    const config = insuranceStatusConfig[status];
    return (
      <Badge variant={config.color} className='text-xs'>
        {config.label}
      </Badge>
    );
  };

  const getTreatmentStatusBadge = (
    status: MedicalRecord['treatmentPlan'][0]['status']
  ) => {
    const config = treatmentStatusConfig[status];
    return (
      <Badge variant={config.color} className='text-xs'>
        {config.label}
      </Badge>
    );
  };

  const getBlockStatus = (record: MedicalRecord) => {
    if (record.isBlocked) {
      return (
        <div className='flex items-center gap-2 text-default-error'>
          <span className='h-2 w-2 rounded-full bg-default-error'></span>
          <span className='text-sm font-medium'>محظور</span>
          {record.blockReason && (
            <span className='text-xs text-gray-500'>
              ({record.blockReason})
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

  const getOutstandingBalance = (record: MedicalRecord) => {
    if (record.hasOutstandingBalance) {
      return (
        <div className='flex items-center gap-2 text-default-default'>
          <span className='h-2 w-2 rounded-full bg-default-default'></span>
          <span className='text-sm font-medium'>
            رصيد مستحق: {record.outstandingAmount?.toLocaleString()} ريال
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

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-[var(--default-surface)] flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--default-default)] mx-auto mb-4'></div>
          <p className='text-gray-600'>جاري تحميل الملفات الطبية...</p>
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
                  الملفات الطبية
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
                إضافة ملف جديد
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
              {records.length}
            </div>
            <div className='text-gray-600 dark:text-gray-300'>
              إجمالي الملفات
            </div>
          </Card>
          <Card className='p-6 text-center'>
            <div className='mb-2 text-3xl font-bold text-default-success'>
              {
                records.filter(r => !r.isBlocked && !r.hasOutstandingBalance)
                  .length
              }
            </div>
            <div className='text-gray-600 dark:text-gray-300'>ملفات نشطة</div>
          </Card>
          <Card className='p-6 text-center'>
            <div className='mb-2 text-3xl font-bold text-default-error'>
              {records.filter(r => r.isBlocked).length}
            </div>
            <div className='text-gray-600 dark:text-gray-300'>ملفات محظورة</div>
          </Card>
          <Card className='p-6 text-center'>
            <div className='mb-2 text-3xl font-bold text-default-default'>
              {records.filter(r => r.hasOutstandingBalance).length}
            </div>
            <div className='text-gray-600 dark:text-gray-300'>رصيد مستحق</div>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className='mb-6 flex flex-col gap-4 md:flex-row'>
          <div className='flex-1'>
            <Input
              type='text'
              placeholder='البحث بالاسم أو رقم المريض...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className='w-full'
            />
          </div>
          <div className='flex gap-3'>
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size='sm'
              onClick={() => setFilter('all')}
            >
              جميع الملفات
            </Button>
            <Button
              variant={filter === 'active' ? 'default' : 'outline'}
              size='sm'
              onClick={() => setFilter('active')}
            >
              نشطة
            </Button>
            <Button
              variant={filter === 'blocked' ? 'default' : 'outline'}
              size='sm'
              onClick={() => setFilter('blocked')}
            >
              محظورة
            </Button>
            <Button
              variant={filter === 'outstanding' ? 'default' : 'outline'}
              size='sm'
              onClick={() => setFilter('outstanding')}
            >
              رصيد مستحق
            </Button>
          </div>
        </div>

        {/* Records List */}
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3'>
          {filteredRecords.map(record => (
            <Card
              key={record.id}
              className='cursor-pointer p-6 transition-all duration-300 hover:shadow-lg'
              onClick={() => setSelectedRecord(record)}
            >
              <div className='mb-4 flex items-start justify-between'>
                <div>
                  <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                    {record.patientName}
                  </h3>
                  <p className='text-sm text-gray-600 dark:text-gray-300'>
                    رقم المريض: {record.patientId} • العمر:{' '}
                    {calculateAge(record.dateOfBirth)} سنة
                  </p>
                </div>
                <div className='text-right'>
                  {getInsuranceStatusBadge(record.insuranceStatus)}
                </div>
              </div>

              <div className='mb-4 space-y-3'>
                <div className='flex justify-between'>
                  <span className='text-sm text-gray-600 dark:text-gray-300'>
                    الجنس:
                  </span>
                  <span className='text-sm font-medium'>
                    {record.gender === 'male' ? 'ذكر' : 'أنثى'}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-sm text-gray-600 dark:text-gray-300'>
                    الهاتف:
                  </span>
                  <span className='text-sm font-medium'>{record.phone}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-sm text-gray-600 dark:text-gray-300'>
                    آخر زيارة:
                  </span>
                  <span className='text-sm font-medium'>
                    {record.lastVisit}
                  </span>
                </div>
                {record.nextAppointment && (
                  <div className='flex justify-between'>
                    <span className='text-sm text-gray-600 dark:text-gray-300'>
                      الموعد القادم:
                    </span>
                    <span className='text-default text-sm font-medium'>
                      {record.nextAppointment}
                    </span>
                  </div>
                )}
              </div>

              <div className='mb-4 space-y-2'>
                {getBlockStatus(record)}
                {getOutstandingBalance(record)}
              </div>

              <div className='mb-4'>
                <div className='mb-2 text-sm text-gray-600 dark:text-gray-300'>
                  خطط العلاج النشطة:
                </div>
                <div className='space-y-1'>
                  {record.treatmentPlan
                    .filter(tp => tp.status === 'active')
                    .map(plan => (
                      <div
                        key={plan.id}
                        className='flex items-center justify-between text-sm'
                      >
                        <span>{plan.type}</span>
                        <div className='flex items-center gap-2'>
                          <span className='text-xs text-gray-500'>
                            {plan.completedSessions}/{plan.sessions}
                          </span>
                          {getTreatmentStatusBadge(plan.status)}
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className='flex gap-2'>
                <Button variant='outline' size='sm' className='flex-1'>
                  عرض الملف
                </Button>
                <Button variant='default' size='sm' className='flex-1'>
                  تحديث
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredRecords.length === 0 && (
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
              لا توجد ملفات
            </h3>
            <p className='mb-4 text-gray-600 dark:text-gray-300'>
              لا توجد ملفات طبية تطابق البحث أو الفلتر المحدد
            </p>
            <Button variant='default'>إضافة ملف جديد</Button>
          </Card>
        )}
      </main>

      {/* Record Details Modal */}
      {selectedRecord && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4'>
          <Card className='max-h-[90vh] w-full max-w-4xl overflow-y-auto'>
            <div className='p-6'>
              <div className='mb-6 flex items-center justify-between'>
                <h2 className='text-xl font-bold'>تفاصيل الملف الطبي</h2>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setSelectedRecord(null)}
                >
                  إغلاق
                </Button>
              </div>

              <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
                {/* Basic Info */}
                <div className='space-y-6'>
                  <div>
                    <h3 className='mb-4 text-lg font-semibold'>
                      المعلومات الأساسية
                    </h3>
                    <div className='space-y-3'>
                      <div className='grid grid-cols-2 gap-4'>
                        <div>
                          <label className='text-sm text-gray-600 dark:text-gray-300'>
                            الاسم الكامل
                          </label>
                          <p className='font-medium'>
                            {selectedRecord.patientName}
                          </p>
                        </div>
                        <div>
                          <label className='text-sm text-gray-600 dark:text-gray-300'>
                            رقم المريض
                          </label>
                          <p className='font-medium'>
                            {selectedRecord.patientId}
                          </p>
                        </div>
                      </div>
                      <div className='grid grid-cols-2 gap-4'>
                        <div>
                          <label className='text-sm text-gray-600 dark:text-gray-300'>
                            تاريخ الميلاد
                          </label>
                          <p className='font-medium'>
                            {selectedRecord.dateOfBirth}
                          </p>
                        </div>
                        <div>
                          <label className='text-sm text-gray-600 dark:text-gray-300'>
                            العمر
                          </label>
                          <p className='font-medium'>
                            {calculateAge(selectedRecord.dateOfBirth)} سنة
                          </p>
                        </div>
                      </div>
                      <div className='grid grid-cols-2 gap-4'>
                        <div>
                          <label className='text-sm text-gray-600 dark:text-gray-300'>
                            الجنس
                          </label>
                          <p className='font-medium'>
                            {selectedRecord.gender === 'male' ? 'ذكر' : 'أنثى'}
                          </p>
                        </div>
                        <div>
                          <label className='text-sm text-gray-600 dark:text-gray-300'>
                            الهاتف
                          </label>
                          <p className='font-medium'>{selectedRecord.phone}</p>
                        </div>
                      </div>
                      <div>
                        <label className='text-sm text-gray-600 dark:text-gray-300'>
                          البريد الإلكتروني
                        </label>
                        <p className='font-medium'>{selectedRecord.email}</p>
                      </div>
                      <div>
                        <label className='text-sm text-gray-600 dark:text-gray-300'>
                          العنوان
                        </label>
                        <p className='font-medium'>{selectedRecord.address}</p>
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div>
                    <h3 className='mb-4 text-lg font-semibold'>
                      جهة الاتصال في الطوارئ
                    </h3>
                    <div className='space-y-3'>
                      <div>
                        <label className='text-sm text-gray-600 dark:text-gray-300'>
                          الاسم
                        </label>
                        <p className='font-medium'>
                          {selectedRecord.emergencyContact}
                        </p>
                      </div>
                      <div>
                        <label className='text-sm text-gray-600 dark:text-gray-300'>
                          الهاتف
                        </label>
                        <p className='font-medium'>
                          {selectedRecord.emergencyPhone}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Medical Info */}
                <div className='space-y-6'>
                  {/* Insurance Info */}
                  <div>
                    <h3 className='mb-4 text-lg font-semibold'>
                      معلومات التأمين
                    </h3>
                    <div className='space-y-3'>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm text-gray-600 dark:text-gray-300'>
                          الحالة
                        </span>
                        {getInsuranceStatusBadge(
                          selectedRecord.insuranceStatus
                        )}
                      </div>
                      {selectedRecord.insuranceCompany && (
                        <div>
                          <label className='text-sm text-gray-600 dark:text-gray-300'>
                            شركة التأمين
                          </label>
                          <p className='font-medium'>
                            {selectedRecord.insuranceCompany}
                          </p>
                        </div>
                      )}
                      {selectedRecord.insuranceNumber && (
                        <div>
                          <label className='text-sm text-gray-600 dark:text-gray-300'>
                            رقم التأمين
                          </label>
                          <p className='font-medium'>
                            {selectedRecord.insuranceNumber}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Medical History */}
                  <div>
                    <h3 className='mb-4 text-lg font-semibold'>
                      التاريخ الطبي
                    </h3>
                    <div className='space-y-3'>
                      <div>
                        <label className='text-sm text-gray-600 dark:text-gray-300'>
                          الأمراض السابقة
                        </label>
                        <div className='mt-1 flex flex-wrap gap-2'>
                          {selectedRecord.medicalHistory.map(
                            (condition, index) => (
                              <Badge
                                key={index}
                                variant='info'
                                className='text-xs'
                              >
                                {condition}
                              </Badge>
                            )
                          )}
                        </div>
                      </div>
                      <div>
                        <label className='text-sm text-gray-600 dark:text-gray-300'>
                          الحساسية
                        </label>
                        <div className='mt-1 flex flex-wrap gap-2'>
                          {selectedRecord.allergies.length > 0 ? (
                            selectedRecord.allergies.map((allergy, index) => (
                              <Badge
                                key={index}
                                variant='error'
                                className='text-xs'
                              >
                                {allergy}
                              </Badge>
                            ))
                          ) : (
                            <span className='text-sm text-gray-500'>
                              لا توجد حساسية
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className='text-sm text-gray-600 dark:text-gray-300'>
                          الأدوية الحالية
                        </label>
                        <div className='mt-1 flex flex-wrap gap-2'>
                          {selectedRecord.currentMedications.map(
                            (medication, index) => (
                              <Badge
                                key={index}
                                variant='info'
                                className='text-xs'
                              >
                                {medication}
                              </Badge>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Treatment Plans */}
                  <div>
                    <h3 className='mb-4 text-lg font-semibold'>خطط العلاج</h3>
                    <div className='space-y-3'>
                      {selectedRecord.treatmentPlan.map(plan => (
                        <div key={plan.id} className='rounded-lg border p-3'>
                          <div className='mb-2 flex items-center justify-between'>
                            <span className='font-medium'>{plan.type}</span>
                            {getTreatmentStatusBadge(plan.status)}
                          </div>
                          <div className='space-y-1 text-sm text-gray-600 dark:text-gray-300'>
                            <div>المعالج: {plan.therapist}</div>
                            <div>
                              الجلسات: {plan.completedSessions}/{plan.sessions}
                            </div>
                            <div>تاريخ البداية: {plan.startDate}</div>
                            {plan.endDate && (
                              <div>تاريخ الانتهاء: {plan.endDate}</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status Info */}
                  <div>
                    <h3 className='mb-4 text-lg font-semibold'>حالة الملف</h3>
                    <div className='space-y-3'>
                      <div>
                        <label className='text-sm text-gray-600 dark:text-gray-300'>
                          حالة الحظر
                        </label>
                        <div className='mt-1'>
                          {getBlockStatus(selectedRecord)}
                        </div>
                      </div>
                      <div>
                        <label className='text-sm text-gray-600 dark:text-gray-300'>
                          الرصيد المستحق
                        </label>
                        <div className='mt-1'>
                          {getOutstandingBalance(selectedRecord)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className='mt-8 flex gap-3'>
                <Button variant='outline' className='flex-1'>
                  طباعة الملف
                </Button>
                <Button variant='default' className='flex-1'>
                  تحديث الملف
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
