'use client';

import { useState, useEffect } from 'react';
import { AdminPageWrapper } from '@/lib/admin/page-wrapper';
import { ADMIN_PAGES } from '@/lib/admin/page-config';
import { logger } from '@/lib/utils/logger';

type Item = { id: string; user: string; suggestion: string; createdAt: string };

function ReviewCenterPageContent() {
  const [rows, setRows] = useState<Item[]>([]);
  const [, setLoading] = useState(true);

  useEffect(() => {
    const loadReviewItems = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/review');
        const result = await response.json();

        if (result.success && result.data) {
          setRows(result.data);
        } else {
          setRows([]);
        }
      } catch (error) {
        logger.error('Error loading review items:', { error })
        setRows([]);
      } finally {
        setLoading(false);
      }
    };

    loadReviewItems();
  }, []);
  const [q, setQ] = useState('');

  const filtered = rows.filter(
    r => r.user.includes(q) || r.suggestion.includes(q)
  );

  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded" aria-label="انتقل للمحتوى الرئيسي">
        انتقل للمحتوى الرئيسي
      </a>
      <main className='min-h-screen bg-[var(--default-surface)]' id="main-content">
      <div className='container-app py-6'>
        <div className='grid gap-4'>
          <div className='grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 items-center'>
            <h1 className='text-2xl font-semibold text-[var(--foreground)]'>
              مركز المراجعة
            </h1>
            <input className='form-input w-full md:w-64'
              placeholder='بحث'
              value={q}
              onChange={(e) => setQ(e.target.value)} aria-label="بحث"
            />
          </div>

          <div className='overflow-x-auto card'>
            <table className='w-full text-sm'>
              <thead className='bg-[var(--default-surface)]'>
                <tr>
                  <th className='text-start p-3 text-[var(--foreground)]'>
                    رسالة المستخدم
                  </th>
                  <th className='text-start p-3 text-[var(--foreground)]'>
                    رد مُعين المقترح
                  </th>
                  <th className='text-start p-3 text-[var(--foreground)]'>
                    تاريخ
                  </th>
                  <th className='text-start p-3 text-[var(--foreground)]'>
                    إجراءات
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr
                    key={r.id}
                    className='border-t border-[var(--default-border)]'
                  >
                    <td className='p-3 text-[var(--foreground)]'>{r.user}</td>
                    <td className='p-3 text-[var(--foreground)]'>
                      {r.suggestion}
                    </td>
                    <td className='p-3 text-[var(--foreground)]/60'>
                      {new Date(r.createdAt).toLocaleString()}
                    </td>
                    <td className='p-3'>
                      <div className='flex items-center gap-2'>
                        <button className='btn btn-outline btn-sm' aria-label="أرشفة">
                          أرشفة
                        </button>
                        <button className='btn btn-outline btn-sm' aria-label="تحسين الرد">
                          تحسين الرد
                        </button>
                        <button className='btn btn-outline btn-sm' aria-label="إنشاء قاعدة">
                          إنشاء قاعدة
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      </main>
    </>
  );
}

export default function ReviewCenterPage() {
  const pageConfig = ADMIN_PAGES.review;
  return (
    <AdminPageWrapper
      requiredPermissions={pageConfig?.requiredPermissions}
      pageTitle={pageConfig?.title || 'Untitled'}
    >
      <ReviewCenterPageContent />
    </AdminPageWrapper>
  );
}
