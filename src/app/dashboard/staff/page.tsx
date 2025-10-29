'use client';

import {
  UserPlus,
  Users,
  CreditCard,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Upload,
} from 'lucide-react';
import { useState, useEffect } from 'react';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useT } from '@/components/providers/I18nProvider';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
// import { useTheme } from '@/context/ThemeContext';

interface StaffData {
  id: string;
  fullName: string;
  role: string;
  todayRegistrations: Array<{
    id: string;
    patientName: string;
    time: string;
    status: 'pending' | 'completed';
  }>;
  pendingPayments: Array<{
    id: string;
    patientName: string;
    amount: number;
    method: string;
    appointmentId: string;
  }>;
  pendingClaims: Array<{
    id: string;
    patientName: string;
    provider: string;
    amount: number;
    status: 'draft' | 'submitted';
  }>;
  recentActivity: Array<{
    id: string;
    action: string;
    patientName: string;
    timestamp: string;
  }>;
}

export default function StaffDashboard() {
  const { t } = useT();
  // const { theme } = useTheme();
  const theme = 'light'; // Default theme
  const [staffData, setStaffData] = useState<StaffData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        const response = await fetch('/api/staff/me');
        if (response.ok) {
          const data = await response.json();
          setStaffData(data);
        }
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaffData();
  }, []);

  const handleProcessPayment = async (paymentId: string) => {
    try {
      const response = await fetch(`/api/payments/${paymentId}/process`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' }),
      });

      if (response.ok) {
        // Refresh data
        window.location.reload();
      }
    } catch (error) {}
  };

  const handleSubmitClaim = async (claimId: string) => {
    try {
      const response = await fetch(`/api/insurance/claims/${claimId}/submit`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'submitted' }),
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
    <ProtectedRoute allowedRoles={['staff', 'supervisor', 'admin']}>
      <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          {/* Header */}
          <div className='mb-8'>
            <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
              {t('staff.dashboard.welcome')}, {staffData?.fullName}
            </h1>
            <p className='mt-2 text-gray-600 dark:text-gray-400'>
              {t('staff.dashboard.subtitle')} - {staffData?.role}
            </p>
          </div>

          {/* Quick Stats */}
          <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
            <Card className='p-6'>
              <div className='flex items-center'>
                <UserPlus className='h-8 w-8 text-blue-600 mr-4' />
                <div>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    {t('staff.dashboard.today_registrations')}
                  </p>
                  <p className='text-2xl font-bold text-gray-900 dark:text-white'>
                    {staffData?.todayRegistrations?.length || 0}
                  </p>
                </div>
              </div>
            </Card>

            <Card className='p-6'>
              <div className='flex items-center'>
                <CreditCard className='h-8 w-8 text-green-600 mr-4' />
                <div>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    {t('staff.dashboard.pending_payments')}
                  </p>
                  <p className='text-2xl font-bold text-gray-900 dark:text-white'>
                    {staffData?.pendingPayments?.length || 0}
                  </p>
                </div>
              </div>
            </Card>

            <Card className='p-6'>
              <div className='flex items-center'>
                <FileText className='h-8 w-8 text-orange-600 mr-4' />
                <div>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    {t('staff.dashboard.pending_claims')}
                  </p>
                  <p className='text-2xl font-bold text-gray-900 dark:text-white'>
                    {staffData?.pendingClaims?.length || 0}
                  </p>
                </div>
              </div>
            </Card>

            <Card className='p-6'>
              <div className='flex items-center'>
                <Clock className='h-8 w-8 text-purple-600 mr-4' />
                <div>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    {t('staff.dashboard.today_activity')}
                  </p>
                  <p className='text-2xl font-bold text-gray-900 dark:text-white'>
                    {staffData?.recentActivity?.length || 0}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            {/* Pending Tasks */}
            <div className='lg:col-span-2'>
              <Card className='p-6'>
                <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-4'>
                  {t('staff.dashboard.pending_tasks')}
                </h2>

                {/* Pending Payments */}
                <div className='mb-6'>
                  <h3 className='font-medium text-gray-900 dark:text-white mb-3'>
                    {t('staff.dashboard.pending_payments')}
                  </h3>
                  {staffData?.pendingPayments &&
                  staffData.pendingPayments.length > 0 ? (
                    <div className='space-y-3'>
                      {staffData.pendingPayments.map(payment => (
                        <div
                          key={payment.id}
                          className='flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg'
                        >
                          <div className='flex items-center'>
                            <CreditCard className='h-5 w-5 text-green-600 mr-3' />
                            <div>
                              <p className='font-medium text-gray-900 dark:text-white'>
                                {payment.patientName}
                              </p>
                              <p className='text-sm text-gray-600 dark:text-gray-400'>
                                {payment.amount} SAR - {payment.method}
                              </p>
                            </div>
                          </div>
                          <div className='flex items-center space-x-2'>
                            <Badge variant='outline'>
                              {t('payment.status.pending')}
                            </Badge>
                            <Button
                              size='sm'
                              onClick={() => handleProcessPayment(payment.id)}
                            >
                              {t('staff.actions.process_payment')}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className='text-gray-600 dark:text-gray-400 text-center py-4'>
                      {t('staff.dashboard.no_pending_payments')}
                    </p>
                  )}
                </div>

                {/* Pending Claims */}
                <div>
                  <h3 className='font-medium text-gray-900 dark:text-white mb-3'>
                    {t('staff.dashboard.pending_claims')}
                  </h3>
                  {staffData?.pendingClaims &&
                  staffData.pendingClaims.length > 0 ? (
                    <div className='space-y-3'>
                      {staffData.pendingClaims.map(claim => (
                        <div
                          key={claim.id}
                          className='flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg'
                        >
                          <div className='flex items-center'>
                            <FileText className='h-5 w-5 text-orange-600 mr-3' />
                            <div>
                              <p className='font-medium text-gray-900 dark:text-white'>
                                {claim.patientName}
                              </p>
                              <p className='text-sm text-gray-600 dark:text-gray-400'>
                                {claim.provider} - {claim.amount} SAR
                              </p>
                            </div>
                          </div>
                          <div className='flex items-center space-x-2'>
                            <Badge variant='outline'>
                              {t(`claim.status.${claim.status}`)}
                            </Badge>
                            <Button
                              size='sm'
                              onClick={() => handleSubmitClaim(claim.id)}
                            >
                              {t('staff.actions.submit_claim')}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className='text-gray-600 dark:text-gray-400 text-center py-4'>
                      {t('staff.dashboard.no_pending_claims')}
                    </p>
                  )}
                </div>
              </Card>
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className='space-y-6'>
              {/* Quick Actions */}
              <Card className='p-6'>
                <h3 className='font-semibold text-gray-900 dark:text-white mb-4'>
                  {t('staff.dashboard.quick_actions')}
                </h3>
                <div className='space-y-3'>
                  <Button className='w-full justify-start'>
                    <UserPlus className='h-4 w-4 mr-2' />
                    {t('staff.actions.register_patient')}
                  </Button>
                  <Button className='w-full justify-start' variant='outline'>
                    <Users className='h-4 w-4 mr-2' />
                    {t('staff.actions.view_patients')}
                  </Button>
                  <Button className='w-full justify-start' variant='outline'>
                    <Upload className='h-4 w-4 mr-2' />
                    {t('staff.actions.upload_claims')}
                  </Button>
                  <Button className='w-full justify-start' variant='outline'>
                    <FileText className='h-4 w-4 mr-2' />
                    {t('staff.actions.generate_reports')}
                  </Button>
                </div>
              </Card>

              {/* Recent Activity */}
              <Card className='p-6'>
                <h3 className='font-semibold text-gray-900 dark:text-white mb-4'>
                  {t('staff.dashboard.recent_activity')}
                </h3>
                {staffData?.recentActivity &&
                staffData.recentActivity.length > 0 ? (
                  <div className='space-y-3'>
                    {staffData.recentActivity.slice(0, 5).map(activity => (
                      <div
                        key={activity.id}
                        className='flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg'
                      >
                        <div className='flex-shrink-0'>
                          <div className='w-2 h-2 bg-blue-600 rounded-full mt-2'></div>
                        </div>
                        <div className='flex-1 min-w-0'>
                          <p className='text-sm text-gray-900 dark:text-white'>
                            {activity.action} - {activity.patientName}
                          </p>
                          <p className='text-xs text-gray-600 dark:text-gray-400'>
                            {activity.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className='text-gray-600 dark:text-gray-400 text-center py-4'>
                    {t('staff.dashboard.no_recent_activity')}
                  </p>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
