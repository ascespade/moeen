'use client';
import { useState, useEffect, useCallback } from 'react';
import { AdminPageWrapper } from '@/lib/admin/page-wrapper';
import { ADMIN_PAGES } from '@/lib/admin/page-config';

import Image from 'next/image';
import { logger } from '@/lib/utils/logger';

interface AuditLog {
  id: string;
  user: string;
  action: string;
  resource: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  status: 'success' | 'failed' | 'warning';
}

function AuditLogsPageContent() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    success: 0,
    failed: 0,
    warning: 0,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [_dateRange, _setDateRange] = useState<string>('today');

  const getStatusColor = (status: AuditLog['status']) => {
    switch (status) {
      case 'success':
        return 'bg-[color-mix(in_srgb,var(--brand-success)_10%,transparent)] text-[var(--brand-success)] border-[color-mix(in_srgb,var(--brand-success)_20%,transparent)]';
      case 'failed':
        return 'bg-[color-mix(in_srgb,var(--brand-error)_10%,transparent)] text-[var(--brand-error)] border-[color-mix(in_srgb,var(--brand-error)_20%,transparent)]';
      case 'warning':
        return 'bg-[color-mix(in_srgb,var(--brand-warning)_10%,transparent)] text-[var(--brand-warning)] border-[color-mix(in_srgb,var(--brand-warning)_20%,transparent)]';
      default:
        return 'bg-[var(--brand-surface)] text-[var(--text-primary)]';
    }
  };

  const getStatusText = (status: AuditLog['status']) => {
    switch (status) {
      case 'success':
        return 'نجح';
      case 'failed':
        return 'فشل';
      case 'warning':
        return 'تحذير';
      default:
        return 'غير محدد';
    }
  };

  const getActionIcon = (action: string) => {
    if (action.includes('تسجيل دخول')) return '🔐';
    if (action.includes('إنشاء')) return '➕';
    if (action.includes('تحديث')) return '✏️';
    if (action.includes('حذف')) return '🗑️';
    if (action.includes('عرض')) return '👁️';
    return '📋';
  };

  // Fetch audit logs from API
  const fetchAuditLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(actionFilter !== 'all' && { action: actionFilter }),
        limit: '100',
        offset: '0',
      });

      const response = await fetch(`/api/admin/audit-logs/filter?${params}`);
      const result = await response.json();

      if (result.success) {
        setAuditLogs(result.data || []);
        setStats(
          result.stats || { total: 0, success: 0, failed: 0, warning: 0 }
        );
      } else {
        throw new Error(result.error || 'Failed to fetch audit logs');
      }
    } catch (err) {
      logger.error('Error fetching audit logs:', err, {})
      setError(
        err instanceof Error ? err.message : 'Failed to fetch audit logs'
      );
      setAuditLogs([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter, actionFilter]);

  // Fetch logs on mount and when filters change
  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  // Client-side filtering for additional refinement
  const filteredLogs = auditLogs.filter(log => {
    if (actionFilter !== 'all' && !log.action.includes(actionFilter)) {
      return false;
    }
    return true;
  });

  const allActions = Array.from(
    new Set(auditLogs.map(log => log.action.split(' ')[0]))
  );

  return (
    <div className='min-h-screen bg-[var(--background)]' role='application'>
      {/* Skip Link */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded" aria-label="التخطي للمحتوى الرئيسي">
        التخطي للمحتوى الرئيسي
      </a>

      {/* Live Region */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        <span id="live-region"></span>
      </div>
      <header className='sticky top-0 z-10 border-b border-[var(--brand-border)] bg-[var(--panel)]'>
        <div className='container-app py-6'>
          <div className='flex items-center gap-4'>
            <Image
              src='/logo.png'
              alt='مُعين'
              width={50}
              height={50}
              className='rounded-lg'
            />
            <div>
              <h1 className='text-default text-2xl font-bold'>سجل التدقيق</h1>
              <p className='text-[var(--text-secondary)]'>
                تتبع جميع أنشطة النظام
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className='container-app py-8' id="main-content">
        {loading && (
          <div className='mb-8 flex items-center justify-center py-12'>
            <div className='text-center'>
              <div className='mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[var(--brand-border)] border-t-[var(--brand-primary)] mx-auto'></div>
              <p className='text-[var(--text-secondary)]'>
                جاري تحميل سجلات التدقيق...
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className='mb-8 rounded-lg bg-[color-mix(in_srgb,var(--brand-error)_10%,transparent)] border border-[color-mix(in_srgb,var(--brand-error)_20%,transparent)] p-4 text-[var(--brand-error)]'>
            <p>خطأ في تحميل البيانات: {error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-4'>
              <div className='card p-6 text-center'>
                <div
                  className='mb-2 text-3xl font-bold'
                  style={{ color: 'var(--brand-primary)' }}
                >
                  {stats.total}
                </div>
                <div className='text-[var(--text-secondary)]'>
                  إجمالي السجلات
                </div>
              </div>
              <div className='card p-6 text-center'>
                <div
                  className='mb-2 text-3xl font-bold'
                  style={{ color: 'var(--brand-success)' }}
                >
                  {stats.success}
                </div>
                <div className='text-[var(--text-secondary)]'>نجح</div>
              </div>
              <div className='card p-6 text-center'>
                <div
                  className='mb-2 text-3xl font-bold'
                  style={{ color: 'var(--brand-error)' }}
                >
                  {stats.failed}
                </div>
                <div className='text-[var(--text-secondary)]'>فشل</div>
              </div>
              <div className='card p-6 text-center'>
                <div
                  className='mb-2 text-3xl font-bold'
                  style={{ color: 'var(--brand-warning)' }}
                >
                  {stats.warning}
                </div>
                <div className='text-[var(--text-secondary)]'>تحذير</div>
              </div>
            </div>

            <div className='card mb-8 p-6'>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
                <div>
                  <label className='mb-2 block text-sm font-medium text-[var(--text-primary)]'>
                    البحث
                  </label>
                  <input
                    type='text'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder='ابحث في السجلات...'
                    aria-label='ابحث في السجلات'
                    className='w-full rounded-lg border border-[var(--brand-border)] bg-[var(--background)] px-3 py-2 text-[var(--text-primary)] focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]'
                  />
                </div>
                <div>
                  <label className='mb-2 block text-sm font-medium text-[var(--text-primary)]'>
                    الحالة
                  </label>
                  <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className='w-full rounded-lg border border-[var(--brand-border)] bg-[var(--background)] px-3 py-2 text-[var(--text-primary)] focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]'
                  >
                    <option value='all'>جميع الحالات</option>
                    <option value='success'>نجح</option>
                    <option value='failed'>فشل</option>
                    <option value='warning'>تحذير</option>
                  </select>
                </div>
                <div>
                  <label className='mb-2 block text-sm font-medium text-[var(--text-primary)]'>
                    نوع الإجراء
                  </label>
                  <select
                    value={actionFilter}
                    onChange={e => setActionFilter(e.target.value)}
                    className='w-full rounded-lg border border-[var(--brand-border)] bg-[var(--background)] px-3 py-2 text-[var(--text-primary)] focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]'
                  >
                    <option value='all'>جميع الإجراءات</option>
                    {allActions.map(action => (
                      <option key={action} value={action}>
                        {action}
                      </option>
                    ))}
                  </select>
                </div>
                <div className='flex items-end'>
                  <button
                    onClick={fetchAuditLogs}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        fetchAuditLogs();
                      }
                    }}
                    className='w-full rounded-lg bg-[var(--brand-primary)] py-2 text-white transition-colors hover:bg-[var(--brand-primary-hover)]'
                    aria-label="تطبيق الفلاتر"
                  >
                    تطبيق الفلاتر
                  </button>
                </div>
              </div>
            </div>

            <div className='card overflow-hidden'>
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead className='bg-[var(--panel)]'>
                    <tr>
                      <th className='px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]'>
                        المستخدم
                      </th>
                      <th className='px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]'>
                        الإجراء
                      </th>
                      <th className='px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]'>
                        المورد
                      </th>
                      <th className='px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]'>
                        التفاصيل
                      </th>
                      <th className='px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]'>
                        الحالة
                      </th>
                      <th className='px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]'>
                        الوقت
                      </th>
                      <th className='px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]'>
                        IP
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-[var(--brand-border)] bg-[var(--background)]'>
                    {filteredLogs.map(log => (
                      <tr
                        key={log.id}
                        className='hover:bg-[var(--brand-surface)]'
                      >
                        <td className='whitespace-nowrap px-6 py-4'>
                          <div className='flex items-center'>
                            <div className='ml-3 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--default-default)] text-sm font-semibold text-white'>
                              {log.user.charAt(0)}
                            </div>
                            <div className='text-sm font-medium text-[var(--text-primary)]'>
                              {log.user}
                            </div>
                          </div>
                        </td>
                        <td className='whitespace-nowrap px-6 py-4'>
                          <div className='flex items-center gap-2'>
                            <span className='text-lg'>
                              {getActionIcon(log.action)}
                            </span>
                            <span className='text-sm text-[var(--text-primary)]'>
                              {log.action}
                            </span>
                          </div>
                        </td>
                        <td className='whitespace-nowrap px-6 py-4'>
                          <div className='text-sm text-[var(--text-primary)]'>
                            {log.resource}
                          </div>
                        </td>
                        <td className='px-6 py-4'>
                          <div className='max-w-xs truncate text-sm text-[var(--text-secondary)]'>
                            {log.details}
                          </div>
                        </td>
                        <td className='whitespace-nowrap px-6 py-4'>
                          <span
                            className={`rounded-full px-2 py-1 text-xs ${getStatusColor(log.status)}`}
                          >
                            {getStatusText(log.status)}
                          </span>
                        </td>
                        <td className='whitespace-nowrap px-6 py-4'>
                          <div className='text-sm text-[var(--text-secondary)]'>
                            {log.timestamp}
                          </div>
                        </td>
                        <td className='whitespace-nowrap px-6 py-4'>
                          <div className='font-mono text-sm text-[var(--text-muted)]'>
                            {log.ipAddress}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {filteredLogs.length === 0 && (
              <div className='py-12 text-center'>
                <div className='mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-[var(--panel)]'>
                  <span className='text-4xl'>📋</span>
                </div>
                <h3 className='mb-2 text-lg font-semibold text-[var(--text-primary)]'>
                  لا توجد سجلات
                </h3>
                <p className='text-[var(--text-secondary)]'>
                  لا توجد سجلات مطابقة للفلتر المحدد
                </p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default function AuditLogsPage() {
  const pageConfig = ADMIN_PAGES.auditLogs;
  return (
    <AdminPageWrapper
      requiredPermissions={pageConfig?.requiredPermissions}
      pageTitle={pageConfig?.title || 'سجلات التدقيق'}
    >
      <AuditLogsPageContent />
    </AdminPageWrapper>
  );
}
