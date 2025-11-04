'use client';

import { useState } from 'react';
import { useT } from '@/hooks/useT';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { I18N_KEYS } from '@/constants/i18n-keys';

import {
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Shield,
  CreditCard,
} from 'lucide-react';

interface ActivationStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  required: boolean;
  icon: React.ReactNode;
}

interface ActivationFlowProps {
  patientId: string;
  onActivationComplete?: () => void;
}

export default function ActivationFlow({
  patientId,
  onActivationComplete,
}: ActivationFlowProps) {
  const { t } = useT();
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const [steps, setSteps] = useState<ActivationStep[]>([
    {
      id: 'profile_complete',
      title: t(I18N_KEYS.PATIENTS.ACTIVATION.STEPS.PROFILE_COMPLETE),
      description: t(I18N_KEYS.PATIENTS.ACTIVATION.STEPS.PROFILE_COMPLETE_DESC),
      completed: false,
      required: true,
      icon: <FileText className='h-5 w-5' />,
    },
    {
      id: 'insurance_verified',
      title: t(I18N_KEYS.PATIENTS.ACTIVATION.STEPS.INSURANCE_VERIFIED),
      description: t(
        I18N_KEYS.PATIENTS.ACTIVATION.STEPS.INSURANCE_VERIFIED_DESC
      ),
      completed: false,
      required: true,
      icon: <Shield className='h-5 w-5' />,
    },
    {
      id: 'payment_settled',
      title: t(I18N_KEYS.PATIENTS.ACTIVATION.STEPS.PAYMENT_SETTLED),
      description: t(I18N_KEYS.PATIENTS.ACTIVATION.STEPS.PAYMENT_SETTLED_DESC),
      completed: false,
      required: true,
      icon: <CreditCard className='h-5 w-5' />,
    },
    {
      id: 'first_visit_completed',
      title: t(I18N_KEYS.PATIENTS.ACTIVATION.STEPS.FIRST_VISIT),
      description: t(I18N_KEYS.PATIENTS.ACTIVATION.STEPS.FIRST_VISIT_DESC),
      completed: false,
      required: true,
      icon: <CheckCircle className='h-5 w-5' />,
    },
  ]);

  const handleStepComplete = async (stepId: string) => {
    setIsProcessing(true);

    try {
      const response = await fetch(
        `/api/patients/${patientId}/activation/step`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stepId, completed: true }),
        }
      );

      if (response.ok) {
        setSteps(prev =>
          prev.map(step =>
            step.id === stepId ? { ...step, completed: true } : step
          )
        );

        // Move to next step
        const currentIndex = steps.findIndex(step => step.id === stepId);
        if (currentIndex < steps.length - 1) {
          setCurrentStep(currentIndex + 1);
        }
      }
    } catch (error) {
    } finally {
      setIsProcessing(false);
    }
  };

  const handleActivateAccount = async () => {
    setIsProcessing(true);

    try {
      const response = await fetch(`/api/patients/${patientId}/activate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        onActivationComplete?.();
      }
    } catch (error) {
    } finally {
      setIsProcessing(false);
    }
  };

  const allRequiredStepsCompleted = steps
    .filter(step => step.required)
    .every(step => step.completed);

  const progressPercentage =
    (steps.filter(step => step.completed).length / steps.length) * 100;

  return (
    <Card className='p-6'>
      <div className='mb-6'>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
          {t(I18N_KEYS.PATIENTS.ACTIVATION.TITLE)}
        </h2>
        <p className='text-gray-600 dark:text-gray-400'>
          {t(I18N_KEYS.PATIENTS.ACTIVATION.DESCRIPTION)}
        </p>

        {/* Progress Bar */}
        <div className='mt-4'>
          <div className='flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2'>
            <span>{t(I18N_KEYS.PATIENTS.ACTIVATION.PROGRESS)}</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
            <div
              className='bg-default-default h-2 rounded-full transition-all duration-300'
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className='space-y-4'>
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`flex items-start p-4 rounded-lg border ${
              step.completed
                ? 'bg-surface dark:bg-green-900/20 border-green-200 dark:border-green-800'
                : index === currentStep
                  ? 'bg-surface dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                  : 'bg-surface dark:bg-gray-800 border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className='flex-shrink-0 mr-4'>
              {step.completed ? (
                <CheckCircle className='h-6 w-6 text-default-success' />
              ) : index === currentStep ? (
                <Clock className='h-6 w-6 text-default-default' />
              ) : (
                <AlertCircle className='h-6 w-6 text-gray-400' />
              )}
            </div>

            <div className='flex-1'>
              <div className='flex items-center justify-between'>
                <h3 className='font-medium text-gray-900 dark:text-white'>
                  {step.title}
                </h3>
                <div className='flex items-center space-x-2'>
                  {step.required && (
                    <Badge variant='secondary' className='text-xs'>
                      {t(I18N_KEYS.COMMON.REQUIRED)}
                    </Badge>
                  )}
                  {step.completed && (
                    <Badge
                      variant='primary'
                      className='bg-green-100 text-green-800'
                    >
                      {t(I18N_KEYS.COMMON.COMPLETED)}
                    </Badge>
                  )}
                </div>
              </div>

              <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
                {step.description}
              </p>

              {index === currentStep && !step.completed && (
                <div className='mt-3'>
                  <Button
                    size='sm'
                    onClick={() => handleStepComplete(step.id)}
                    disabled={isProcessing}
                  >
                    {isProcessing
                      ? t(I18N_KEYS.COMMON.PROCESSING)
                      : t(I18N_KEYS.PATIENTS.ACTIVATION.COMPLETE_STEP)}
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Activation Button */}
      {allRequiredStepsCompleted && (
        <div className='mt-6 pt-6 border-t border-gray-200 dark:border-gray-700'>
          <div className='text-center'>
            <p className='text-sm text-gray-600 dark:text-gray-400 mb-4'>
              {t(I18N_KEYS.PATIENTS.ACTIVATION.READY_TO_ACTIVATE)}
            </p>
            <Button
              onClick={handleActivateAccount}
              disabled={isProcessing}
              className='px-8'
            >
              {isProcessing
                ? t(I18N_KEYS.COMMON.ACTIVATING)
                : t(I18N_KEYS.PATIENTS.ACTIVATION.ACTIVATE_ACCOUNT)}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
