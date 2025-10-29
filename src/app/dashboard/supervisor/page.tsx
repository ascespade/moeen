'use client';

import {
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  BarChart3,
  Settings,
} from 'lucide-react';
import { useState, useEffect } from 'react';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useT } from '@/components/providers/I18nProvider';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
// import { useTheme } from '@/context/ThemeContext';

interface SupervisorData {
  id: string;
  fullName: string;
  role: string;
  staffActivity: Array<{
    id: string;
    name: string;
    role: string;
    todayTasks: number;
    completedTasks: number;
    efficiency: number;
  }>;
  systemMetrics: {
    totalPatients: number;
    totalAppointments: number;
    revenue: number;
    claimsProcessed: number;
  };
  alerts: Array<{
    id: string;
    type: 'warning' | 'error' | 'info';
    message: string;
    timestamp: string;
  }>;
  reports: Array<{
    id: string;
    name: string;
    type: string;
    generatedAt: string;
    status: 'ready' | 'processing' | 'failed';
  }>;
}

export default function SupervisorDashboard() {
  const { t } = useT();
  // const { theme } = useTheme();
  const theme = 'light'; // Default theme
  const [supervisorData, setSupervisorData] = useState<SupervisorData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSupervisorData = async () => {
      try {
        const response = await fetch('/api/supervisor/me');
        if (response.ok) {
          const data = await response.json();
          setSupervisorData(data);
        }
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    fetchSupervisorData();
  }, []);

  const handleGenerateReport = async (reportType: string) => {
    try {
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: reportType }),
      });

      if (response.ok) {
        // Refresh data
        window.location.reload();
      }
    } catch (error) {}
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['supervisor', 'admin']}>
      <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          {/* Header */}
          <div className='mb-8'>
            <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
              {t('supervisor.dashboard.welcome')}, {supervisorData?.fullName}
            </h1>
            <p className='mt-2 text-gray-600 dark:text-gray-400'>
              {t('supervisor.dashboard.subtitle')} - {supervisorData?.role}
            </p>
          </div>

          {/* System Metrics */}
          <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
            <Card className='p-6'>
              <div className='flex items-center'>
                <Users className='h-8 w-8 text-blue-600 mr-4' />
                <div>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    {t('supervisor.dashboard.total_patients')}
                  </p>
                  <p className='text-2xl font-bold text-gray-900 dark:text-white'>
                    {supervisorData?.systemMetrics?.totalPatients || 0}
                  </p>
                </div>
              </div>
            </Card>

            <Card className='p-6'>
              <div className='flex items-center'>
                <Clock className='h-8 w-8 text-green-600 mr-4' />
                <div>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    {t('supervisor.dashboard.total_appointments')}
                  </p>
                  <p className='text-2xl font-bold text-gray-900 dark:text-white'>
                    {supervisorData?.systemMetrics?.totalAppointments || 0}
                  </p>
                </div>
              </div>
            </Card>

            <Card className='p-6'>
              <div className='flex items-center'>
                <TrendingUp className='h-8 w-8 text-purple-600 mr-4' />
                <div>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    {t('supervisor.dashboard.revenue')}
                  </p>
                  <p className='text-2xl font-bold text-gray-900 dark:text-white'>
                    {supervisorData?.systemMetrics?.revenue || 0} SAR
                  </p>
                </div>
              </div>
            </Card>

            <Card className='p-6'>
              <div className='flex items-center'>
                <FileText className='h-8 w-8 text-orange-600 mr-4' />
                <div>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    {t('supervisor.dashboard.claims_processed')}
                  </p>
                  <p className='text-2xl font-bold text-gray-900 dark:text-white'>
                    {supervisorData?.systemMetrics?.claimsProcessed || 0}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            {/* Staff Performance */}
            <div className='lg:col-span-2'>
              <Card className='p-6'>
                <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-4'>
                  {t('supervisor.dashboard.staff_performance')}
                </h2>
                {supervisorData?.staffActivity &&
                supervisorData.staffActivity.length > 0 ? (
                  <div className='space-y-4'>
                    {supervisorData.staffActivity.map(staff => (
                      <div
                        key={staff.id}
                        className='flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg'
                      >
                        <div className='flex items-center'>
                          <div className='flex-shrink-0'>
                            <div className='w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center'>
                              <Users className='h-5 w-5 text-blue-600' />
                            </div>
                          </div>
                          <div className='ml-4'>
                            <p className='font-medium text-gray-900 dark:text-white'>
                              {staff.name}
                            </p>
                            <p className='text-sm text-gray-600 dark:text-gray-400'>
                              {staff.role}
                            </p>
                          </div>
                        </div>
                        <div className='flex items-center space-x-4'>
                          <div className='text-center'>
                            <p className='text-sm text-gray-600 dark:text-gray-400'>
                              {t('supervisor.dashboard.tasks')}
                            </p>
                            <p className='font-medium text-gray-900 dark:text-white'>
                              {staff.completedTasks}/{staff.todayTasks}
                            </p>
                          </div>
                          <div className='text-center'>
                            <p className='text-sm text-gray-600 dark:text-gray-400'>
                              {t('supervisor.dashboard.efficiency')}
                            </p>
                            <p className='font-medium text-gray-900 dark:text-white'>
                              {staff.efficiency}%
                            </p>
                          </div>
                          <Badge
                            variant={
                              staff.efficiency >= 80
                                ? 'primary'
                                : staff.efficiency >= 60
                                  ? 'secondary'
                                  : 'error'
                            }
                          >
                            {staff.efficiency >= 80
                              ? t('common.excellent')
                              : staff.efficiency >= 60
                                ? t('common.good')
                                : t('common.needs_improvement')}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className='text-gray-600 dark:text-gray-400 text-center py-8'>
                    {t('supervisor.dashboard.no_staff_data')}
                  </p>
                )}
              </Card>
            </div>

            {/* Alerts & Reports */}
            <div className='space-y-6'>
              {/* System Alerts */}
              <Card className='p-6'>
                <h3 className='font-semibold text-gray-900 dark:text-white mb-4'>
                  {t('supervisor.dashboard.system_alerts')}
                </h3>
                {supervisorData?.alerts && supervisorData.alerts.length > 0 ? (
                  <div className='space-y-3'>
                    {supervisorData.alerts.slice(0, 5).map(alert => (
                      <div
                        key={alert.id}
                        className={`flex items-start p-3 rounded-lg ${
                          alert.type === 'error'
                            ? 'bg-red-50 dark:bg-red-900/20'
                            : alert.type === 'warning'
                              ? 'bg-yellow-50 dark:bg-yellow-900/20'
                              : 'bg-blue-50 dark:bg-blue-900/20'
                        }`}
                      >
                        <AlertTriangle
                          className={`h-4 w-4 mt-0.5 mr-3 ${
                            alert.type === 'error'
                              ? 'text-red-600'
                              : alert.type === 'warning'
                                ? 'text-yellow-600'
                                : 'text-blue-600'
                          }`}
                        />
                        <div className='flex-1'>
                          <p className='text-sm text-gray-900 dark:text-white'>
                            {alert.message}
                          </p>
                          <p className='text-xs text-gray-600 dark:text-gray-400 mt-1'>
                            {alert.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className='text-gray-600 dark:text-gray-400 text-center py-4'>
                    {t('supervisor.dashboard.no_alerts')}
                  </p>
                )}
              </Card>

              {/* Reports */}
              <Card className='p-6'>
                <h3 className='font-semibold text-gray-900 dark:text-white mb-4'>
                  {t('supervisor.dashboard.reports')}
                </h3>
                <div className='space-y-3'>
                  <Button
                    className='w-full justify-start'
                    onClick={() => handleGenerateReport('daily')}
                  >
                    <BarChart3 className='h-4 w-4 mr-2' />
                    {t('supervisor.actions.daily_report')}
                  </Button>
                  <Button
                    className='w-full justify-start'
                    variant='outline'
                    onClick={() => handleGenerateReport('monthly')}
                  >
                    <FileText className='h-4 w-4 mr-2' />
                    {t('supervisor.actions.monthly_report')}
                  </Button>
                  <Button
                    className='w-full justify-start'
                    variant='outline'
                    onClick={() => handleGenerateReport('staff_performance')}
                  >
                    <Users className='h-4 w-4 mr-2' />
                    {t('supervisor.actions.staff_report')}
                  </Button>
                </div>

                {supervisorData?.reports &&
                  supervisorData.reports.length > 0 && (
                    <div className='mt-4 pt-4 border-t border-gray-200 dark:border-gray-700'>
                      <h4 className='text-sm font-medium text-gray-900 dark:text-white mb-2'>
                        {t('supervisor.dashboard.recent_reports')}
                      </h4>
                      <div className='space-y-2'>
                        {supervisorData.reports.slice(0, 3).map(report => (
                          <div
                            key={report.id}
                            className='flex items-center justify-between text-sm'
                          >
                            <span className='text-gray-600 dark:text-gray-400'>
                              {report.name}
                            </span>
                            <Badge variant='outline'>
                              {t(`report.status.${report.status}`)}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
