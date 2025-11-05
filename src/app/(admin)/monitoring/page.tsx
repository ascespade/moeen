/**
 * Monitoring Dashboard
 * لوحة مراقبة الأداء
 */

'use client';

import React, { useEffect, useState } from 'react';
import { MonitoringReport } from '@/lib/monitoring/types';
import { logger } from '@/lib/utils/logger';

export default function MonitoringDashboard() {
  const [report, setReport] = useState<MonitoringReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await fetch('/api/monitoring');
        const data = await res.json();
        setReport(data);
        setIsLoading(false);
      } catch (error) {
        logger.error('Error fetching monitoring data:', error, {})
        setIsLoading(false);
      }
    };

    // Fetch initially
    fetchReport();

    // Update every second
    const interval = setInterval(fetchReport, 1000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--brand-primary)] mx-auto mb-4"></div>
          <p>جاري تحميل بيانات المراقبة...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="container-app py-8">
        <div className="text-center">
          <p className="text-[var(--text-secondary)]">لا توجد بيانات متاحة</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-app py-8">
      <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-8">
        📊 لوحة مراقبة الأداء
      </h1>

      {/* Overall Progress */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
          التقدم العام
        </h2>
        <div className="relative w-full bg-[var(--brand-surface)] rounded-full h-8">
          <div
            className="bg-[var(--brand-primary)] h-8 rounded-full transition-all duration-300 flex items-center justify-center"
            style={{ width: `${report.progress}%` }}
          >
            <span className="text-white text-sm font-semibold">
              {report.progress.toFixed(1)}%
            </span>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-[var(--text-primary)]">
              {report.total}
            </div>
            <div className="text-sm text-[var(--text-secondary)]">إجمالي المهام</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {report.completed}
            </div>
            <div className="text-sm text-[var(--text-secondary)]">مكتملة</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {report.byStatus.running}
            </div>
            <div className="text-sm text-[var(--text-secondary)]">جارية</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {report.byStatus.error}
            </div>
            <div className="text-sm text-[var(--text-secondary)]">أخطاء</div>
          </div>
        </div>
      </div>

      {/* CPU Usage */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
          استخدام المعالجات
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((cpu) => (
            <div
              key={cpu}
              className="card p-4 text-center border-2 border-[var(--brand-border)]"
            >
              <div className="text-3xl font-bold text-[var(--brand-primary)] mb-2">
                CPU {cpu}
              </div>
              <div className="text-2xl font-bold text-[var(--text-primary)]">
                {report.byCpu[cpu] || 0}
              </div>
              <div className="text-sm text-[var(--text-secondary)]">مهام جارية</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tasks List */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
          قائمة المهام
        </h2>
        <div className="space-y-3">
          {report.tasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 rounded-lg border-2 ${
                task.status === 'completed'
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : task.status === 'running'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : task.status === 'error'
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                  : 'border-[var(--brand-border)] bg-[var(--panel)]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-[var(--text-primary)]">
                    {task.name}
                  </h3>
                  <span className="text-xs px-2 py-1 rounded bg-[var(--brand-surface)] text-[var(--text-secondary)]">
                    CPU {task.cpu}
                  </span>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded font-semibold ${
                    task.status === 'completed'
                      ? 'bg-green-500 text-white'
                      : task.status === 'running'
                      ? 'bg-blue-500 text-white'
                      : task.status === 'error'
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-500 text-white'
                  }`}
                >
                  {task.status === 'completed'
                    ? 'مكتملة'
                    : task.status === 'running'
                    ? 'جارية'
                    : task.status === 'error'
                    ? 'خطأ'
                    : 'في الانتظار'}
                </span>
              </div>
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-[var(--text-secondary)]">التقدم</span>
                  <span className="text-sm font-semibold text-[var(--text-primary)]">
                    {task.progress}%
                  </span>
                </div>
                <div className="w-full bg-[var(--brand-surface)] rounded-full h-2">
                  <div
                    className="bg-[var(--brand-primary)] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${task.progress}%` }}
                  />
                </div>
              </div>
              {task.errors.length > 0 && (
                <div className="mt-2 p-2 bg-red-100 dark:bg-red-900/30 rounded">
                  <p className="text-xs font-semibold text-red-700 dark:text-red-300 mb-1">
                    الأخطاء:
                  </p>
                  {task.errors.map((error, index) => (
                    <p key={index} className="text-xs text-red-600 dark:text-red-400">
                      • {error}
                    </p>
                  ))}
                </div>
              )}
              {task.results && (
                <div className="mt-2 p-2 bg-[var(--brand-surface)] rounded">
                  <p className="text-xs font-semibold text-[var(--text-primary)] mb-1">
                    النتائج:
                  </p>
                  <pre className="text-xs text-[var(--text-secondary)] overflow-x-auto">
                    {JSON.stringify(task.results, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

