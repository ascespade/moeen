'use client';
import { useState } from 'react';
import { ROUTES } from '@/constants/routes';
import Image from 'next/image';
import Link from 'next/link';

interface Deal {
  id: string;
  title: string;
  value: number;
  stage:
    | 'prospecting'
    | 'qualification'
    | 'proposal'
    | 'negotiation'
    | 'closed-won'
    | 'closed-lost';
  probability: number;
  expectedCloseDate: string;
  contactId: string;
  contactName: string;
  assignedTo: string;
  source: string;
  createdAt: string;
  lastActivity: string;
  notes?: string;
  tags: string[];
}

const mockDeals: Deal[] = [
  {
    id: '1',
    title: 'عقد إدارة المواعيد - مستشفى الملك فهد',
    value: 150000,
    stage: 'negotiation',
    probability: 75,
    expectedCloseDate: '2024-02-15',
    contactId: '1',
    contactName: 'أحمد العتيبي',
    assignedTo: 'سارة أحمد',
    source: 'موقع إلكتروني',
    createdAt: '2024-01-01',
    lastActivity: '2024-01-15',
    notes: 'في مرحلة المفاوضات النهائية',
    tags: ['عالي القيمة', 'مستشفى'],
  },
  {
    id: '2',
    title: 'نظام إدارة المرضى - عيادة الأسنان',
    value: 75000,
    stage: 'proposal',
    probability: 60,
    expectedCloseDate: '2024-01-30',
    contactId: '2',
    contactName: 'فاطمة السعيد',
    assignedTo: 'محمد حسن',
    source: 'إحالة',
    createdAt: '2024-01-05',
    lastActivity: '2024-01-12',
    tags: ['عيادة', 'متوسط القيمة'],
  },
];

export default function CRMDealsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('kanban');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const getStageColor = (stage: Deal['stage']) => {
    switch (stage) {
      case 'prospecting':
        return 'bg-surface text-gray-800';
      case 'qualification':
        return 'bg-blue-100 text-blue-800';
      case 'proposal':
        return 'bg-yellow-100 text-yellow-800';
      case 'negotiation':
        return 'bg-orange-100 text-orange-800';
      case 'closed-won':
        return 'bg-green-100 text-green-800';
      case 'closed-lost':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-surface text-gray-800';
    }
  };

  const getStageText = (stage: Deal['stage']) => {
    switch (stage) {
      case 'prospecting':
        return 'استكشاف';
      case 'qualification':
        return 'تأهيل';
      case 'proposal':
        return 'عرض';
      case 'negotiation':
        return 'مفاوضات';
      case 'closed-won':
        return 'مكتمل - فوز';
      case 'closed-lost':
        return 'مكتمل - خسارة';
      default:
        return 'غير محدد';
    }
  };

  const filteredDeals = mockDeals.filter(deal => {
    const matchesSearch =
      deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.contactName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage =
      selectedStage === 'all' || deal.stage === selectedStage;
    return matchesSearch && matchesStage;
  });

  const stages = [
    'prospecting',
    'qualification',
    'proposal',
    'negotiation',
    'closed-won',
    'closed-lost',
  ];

  return (
    <div className='min-h-screen bg-[var(--default-surface)]'>
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
                  إدارة الصفقات
                </h1>
                <p className='text-gray-600 dark:text-gray-300'>
                  تتبع وإدارة صفقات المبيعات
                </p>
              </div>
            </div>
            <div className='flex items-center gap-3'>
              <div className='flex rounded-lg border border-gray-300'>
                <buttononClick={() = aria-label="Button"> { setViewMode('table')} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); () = aria-label="Button"> { setViewMode('table') } }}
                  className={`px-3 py-2 text-sm ${viewMode === 'table' ? 'bg-[var(--default-default)] text-white' : 'text-gray-600'}`}
                >
                  جدول
                </button>
                <buttononClick={() = aria-label="Button"> { setViewMode('kanban')} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); () = aria-label="Button"> { setViewMode('kanban') } }}
                  className={`px-3 py-2 text-sm ${viewMode === 'kanban' ? 'bg-[var(--default-default)] text-white' : 'text-gray-600'}`}
                >
                  كانبان
                </button>
              </div>
              <buttononClick={() = aria-label="Button"> { setShowCreateModal(true)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); () = aria-label="Button"> { setShowCreateModal(true) } }}
                className='btn-default rounded-lg px-6 py-2 text-white transition-colors hover:bg-[var(--default-default-hover)]'
              >
                إضافة صفقة
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className='container-app py-8'>
        <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-4'>
          <div className='card p-6 text-center'>
            <div className='mb-2 text-3xl font-bold text-default-default'>
              {mockDeals.length}
            </div>
            <div className='text-gray-600 dark:text-gray-300'>
              إجمالي الصفقات
            </div>
          </div>
          <div className='card p-6 text-center'>
            <div className='mb-2 text-3xl font-bold text-default-success'>
              {mockDeals.filter(d => d.stage === 'closed-won').length}
            </div>
            <div className='text-gray-600 dark:text-gray-300'>مكتملة</div>
          </div>
          <div className='card p-6 text-center'>
            <div className='mb-2 text-3xl font-bold text-purple-600'>
              {mockDeals.reduce((sum, d) => sum + d.value, 0).toLocaleString()}{' '}
              ريال
            </div>
            <div className='text-gray-600 dark:text-gray-300'>
              إجمالي القيمة
            </div>
          </div>
          <div className='card p-6 text-center'>
            <div className='mb-2 text-3xl font-bold text-default-default'>
              {Math.round(
                mockDeals.reduce((sum, d) => sum + d.probability, 0) /
                  mockDeals.length
              )}
              %
            </div>
            <div className='text-gray-600 dark:text-gray-300'>
              متوسط الاحتمالية
            </div>
          </div>
        </div>

        <div className='card mb-8 p-6'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            <div>
              <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                البحث
              </label>
              <input
                type='text'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder='ابحث في الصفقات...'
                className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--default-default)]'
              />
            </div>
            <div>
              <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                المرحلة
              </label>
              <select
                value={selectedStage}
                onChange={e => setSelectedStage(e.target.value)}
                className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--default-default)]'
              >
                <option value='all'>جميع المراحل</option>
                <option value='prospecting'>استكشاف</option>
                <option value='qualification'>تأهيل</option>
                <option value='proposal'>عرض</option>
                <option value='negotiation'>مفاوضات</option>
                <option value='closed-won'>مكتمل - فوز</option>
                <option value='closed-lost'>مكتمل - خسارة</option>
              </select>
            </div>
            <div className='flex items-end'>
              <buttonclassName='btn-default w-full rounded-lg py-2 text-white transition-colors hover:bg-[var(--default-default-hover)]' aria-label="تطبيق الفلاتر">
                تطبيق الفلاتر
              </button>
            </div>
          </div>
        </div>

        {viewMode === 'kanban' ? (
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'>
            {stages.map(stage => (
              <div key={stage} className='space-y-4'>
                <div className='rounded-lg bg-surface p-4 dark:bg-gray-800'>
                  <h3 className='font-semibold text-gray-900 dark:text-white'>
                    {getStageText(stage as Deal['stage'])}
                  </h3>
                  <p className='text-sm text-gray-600 dark:text-gray-300'>
                    {filteredDeals.filter(d => d.stage === stage).length} صفقة
                  </p>
                </div>
                <div className='space-y-3'>
                  {filteredDeals
                    .filter(deal => deal.stage === stage)
                    .map(deal => (
                      <div
                        key={deal.id}
                        className='card hover:shadow-soft cursor-move p-4 transition-shadow'
                      >
                        <div className='mb-3'>
                          <h4 className='mb-1 text-sm font-medium text-gray-900 dark:text-white'>
                            {deal.title}
                          </h4>
                          <p className='text-xs text-gray-500'>
                            {deal.contactName}
                          </p>
                        </div>
                        <div className='space-y-2 text-xs text-gray-600 dark:text-gray-300'>
                          <div className='flex justify-between'>
                            <span>القيمة:</span>
                            <span className='font-medium'>
                              {deal.value.toLocaleString()} ريال
                            </span>
                          </div>
                          <div className='flex justify-between'>
                            <span>الاحتمالية:</span>
                            <span className='font-medium'>
                              {deal.probability}%
                            </span>
                          </div>
                          <div className='flex justify-between'>
                            <span>التاريخ المتوقع:</span>
                            <span className='font-medium'>
                              {deal.expectedCloseDate}
                            </span>
                          </div>
                        </div>
                        <div className='mt-3 flex gap-1'>
                          <buttonclassName='flex-1 rounded bg-[var(--default-default)] px-2 py-1 text-xs text-white transition-colors hover:bg-[var(--default-default-hover)]' aria-label="عرض">
                            عرض
                          </button>
                          <buttonclassName='rounded border border-gray-300 px-2 py-1 text-xs text-gray-700 transition-colors hover:bg-surface' aria-label="تحريك">
                            تحريك
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='card overflow-hidden'>
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead className='bg-surface dark:bg-gray-800'>
                  <tr>
                    <th className='px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300'>
                      الصفقة
                    </th>
                    <th className='px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300'>
                      جهة الاتصال
                    </th>
                    <th className='px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300'>
                      القيمة
                    </th>
                    <th className='px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300'>
                      الاحتمالية
                    </th>
                    <th className='px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300'>
                      المرحلة
                    </th>
                    <th className='px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300'>
                      المكلف
                    </th>
                    <th className='px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300'>
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900'>
                  {filteredDeals.map(deal => (
                    <tr
                      key={deal.id}
                      className='hover:bg-surface dark:hover:bg-gray-800'
                    >
                      <td className='px-6 py-4'>
                        <div>
                          <div className='text-sm font-medium text-gray-900 dark:text-white'>
                            {deal.title}
                          </div>
                          <div className='text-sm text-gray-500'>
                            تاريخ الإنشاء: {deal.createdAt}
                          </div>
                        </div>
                      </td>
                      <td className='whitespace-nowrap px-6 py-4'>
                        <div className='text-sm text-gray-900 dark:text-white'>
                          {deal.contactName}
                        </div>
                        <div className='text-sm text-gray-500'>
                          {deal.source}
                        </div>
                      </td>
                      <td className='whitespace-nowrap px-6 py-4'>
                        <div className='text-sm font-medium text-gray-900 dark:text-white'>
                          {deal.value.toLocaleString()} ريال
                        </div>
                      </td>
                      <td className='whitespace-nowrap px-6 py-4'>
                        <div className='text-sm text-gray-900 dark:text-white'>
                          {deal.probability}%
                        </div>
                      </td>
                      <td className='whitespace-nowrap px-6 py-4'>
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${getStageColor(deal.stage)}`}
                        >
                          {getStageText(deal.stage)}
                        </span>
                      </td>
                      <td className='whitespace-nowrap px-6 py-4'>
                        <div className='text-sm text-gray-600 dark:text-gray-300'>
                          {deal.assignedTo}
                        </div>
                      </td>
                      <td className='whitespace-nowrap px-6 py-4 text-sm font-medium'>
                        <div className='flex gap-2'>
                          <buttonclassName='text-[var(--default-default)] hover:text-[var(--default-default-hover)]' aria-label="عرض">
                            عرض
                          </button>
                          <buttonclassName='text-gray-600 hover:text-gray-900' aria-label="تعديل">
                            تعديل
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {filteredDeals.length === 0 && (
          <div className='py-12 text-center'>
            <div className='mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-surface'>
              <span className='text-4xl'>💼</span>
            </div>
            <h3 className='mb-2 text-lg font-semibold text-gray-900 dark:text-white'>
              لا توجد صفقات
            </h3>
            <p className='text-gray-600 dark:text-gray-300'>
              لا توجد صفقات مطابقة للفلتر المحدد
            </p>
          </div>
        )}
      </main>

      {showCreateModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <div className='w-full max-w-2xl rounded-lg bg-white p-6 dark:bg-gray-900'>
            <div className='mb-6 flex items-center justify-between'>
              <h3 className='text-xl font-semibold'>إضافة صفقة جديدة</h3>
              <buttononClick={() = aria-label="Button"> { setShowCreateModal(false)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); () = aria-label="Button"> { setShowCreateModal(false) } }}
                className='text-gray-400 hover:text-gray-600'
              >
                ✕
              </button>
            </div>
            <form className='space-y-4'>
              <div>
                <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                  عنوان الصفقة
                </label>
                <input
                  type='text'
                  className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--default-default)]'
                  placeholder='أدخل عنوان الصفقة'
                />
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                    القيمة
                  </label>
                  <input
                    type='number'
                    className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--default-default)]'
                    placeholder='0'
                  />
                </div>
                <div>
                  <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                    الاحتمالية
                  </label>
                  <input
                    type='number'
                    min='0'
                    max='100'
                    className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--default-default)]'
                    placeholder='0-100'
                  />
                </div>
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                    المرحلة
                  </label>
                  <select className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--default-default)]'>
                    <option value='prospecting'>استكشاف</option>
                    <option value='qualification'>تأهيل</option>
                    <option value='proposal'>عرض</option>
                    <option value='negotiation'>مفاوضات</option>
                  </select>
                </div>
                <div>
                  <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                    تاريخ الإغلاق المتوقع
                  </label>
                  <input
                    type='date'
                    className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-[var(--default-default)]'
                  />
                </div>
              </div>
              <div className='flex gap-3 pt-4'>
                <buttontype='button'
                  onClick={() = aria-label="Button"> { setShowCreateModal(false)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); () = aria-label="Button"> { setShowCreateModal(false) } }}
                  className='flex-1 rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-surface'
                >
                  إلغاء
                </button>
                <buttontype='submit'
                  className='btn-default flex-1 rounded-lg py-2 text-white transition-colors hover:bg-[var(--default-default-hover)]' aria-label="إضافة الصفقة">
                  إضافة الصفقة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
