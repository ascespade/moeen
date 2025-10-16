'use client';

import { useState, useEffect } from 'react';
import { useT } from '@/components/providers/I18nProvider';
import { useTheme } from '@/context/ThemeContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { 
  CalendarDays, 
  FileText, 
  CreditCard, 
  Shield, 
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface PatientData {
  id: string;
  fullName: string;
  activated: boolean;
  nextAppointment?: {
    id: string;
    date: string;
    doctor: string;
    status: string;
  };
  recentAppointments: Array<{
    id: string;
    date: string;
    doctor: string;
    status: string;
  }>;
  insuranceStatus: {
    provider: string;
    number: string;
    status: 'active' | 'pending' | 'expired';
  };
  paymentStatus: {
    outstanding: number;
    lastPayment: string;
  };
}

export default function PatientDashboard() {
  const { t } = useT();
  const { theme } = useTheme();
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await fetch('/api/patients/me');
        if (response.ok) {
          const data = await response.json();
          setPatientData(data);
        }
      } catch (error) {
        } finally {
        setIsLoading(false);
      }
    };

    fetchPatientData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['patient']}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('patient.dashboard.welcome')}, {patientData?.fullName}
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {t('patient.dashboard.subtitle')}
            </p>
          </div>

          {/* Activation Status */}
          {!patientData?.activated && (
            <Card className="mb-6 border-orange-200 bg-orange-50 dark:bg-orange-900/20">
              <div className="flex items-center p-4">
                <AlertCircle className="h-6 w-6 text-orange-600 mr-3" />
                <div>
                  <h3 className="font-semibold text-orange-800 dark:text-orange-200">
                    {t('patient.activation.required')}
                  </h3>
                  <p className="text-orange-700 dark:text-orange-300">
                    {t('patient.activation.description')}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center">
                <CalendarDays className="h-8 w-8 text-blue-600 mr-4" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {t('patient.actions.book_appointment')}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('patient.actions.book_description')}
                  </p>
                </div>
              </div>
              <Button className="w-full mt-4">
                {t('patient.actions.book_now')}
              </Button>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-green-600 mr-4" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {t('patient.actions.view_file')}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('patient.actions.file_description')}
                  </p>
                </div>
              </div>
              <Button 
                className="w-full mt-4" 
                disabled={!patientData?.activated}
                variant={patientData?.activated ? 'primary' : 'secondary'}
              >
                {patientData?.activated ? t('patient.actions.open_file') : t('patient.actions.file_locked')}
              </Button>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center">
                <CreditCard className="h-8 w-8 text-purple-600 mr-4" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {t('patient.actions.payments')}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('patient.actions.payments_description')}
                  </p>
                </div>
              </div>
              <Button className="w-full mt-4" variant="outline">
                {t('patient.actions.view_payments')}
              </Button>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-indigo-600 mr-4" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {t('patient.actions.insurance')}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('patient.actions.insurance_description')}
                  </p>
                </div>
              </div>
              <Button className="w-full mt-4" variant="outline">
                {t('patient.actions.view_insurance')}
              </Button>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Next Appointment */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {t('patient.dashboard.next_appointment')}
                </h2>
                {patientData?.nextAppointment ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-blue-600 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {patientData.nextAppointment.date}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {t('patient.dashboard.with_doctor')}: {patientData.nextAppointment.doctor}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">
                        {patientData.nextAppointment.status}
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CalendarDays className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      {t('patient.dashboard.no_appointments')}
                    </p>
                    <Button className="mt-4">
                      {t('patient.actions.book_appointment')}
                    </Button>
                  </div>
                )}
              </Card>
            </div>

            {/* Status Overview */}
            <div className="space-y-6">
              {/* Account Status */}
              <Card className="p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  {t('patient.dashboard.account_status')}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {t('patient.dashboard.activation_status')}
                    </span>
                    <Badge 
                      variant={patientData?.activated ? 'primary' : 'secondary'}
                      className={patientData?.activated ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}
                    >
                      {patientData?.activated ? t('common.activated') : t('common.pending')}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {t('patient.dashboard.insurance_status')}
                    </span>
                    <Badge variant="outline">
                      {patientData?.insuranceStatus?.status || t('common.unknown')}
                    </Badge>
                  </div>
                </div>
              </Card>

              {/* Quick Stats */}
              <Card className="p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  {t('patient.dashboard.quick_stats')}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {t('patient.dashboard.total_appointments')}
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {patientData?.recentAppointments?.length || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {t('patient.dashboard.outstanding_payment')}
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {patientData?.paymentStatus?.outstanding || 0} SAR
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}