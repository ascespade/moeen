/**
 * Workflows System
 * ???? ?????????
 *
 * Defines and manages business logic workflows for all user roles
 */

import { UserRole } from '@/lib/permissions';

export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  requiredPermissions: string[];
  apiEndpoint?: string;
  databaseOperation?: string;
  businessLogic?: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  role: UserRole;
  steps: WorkflowStep[];
}

/**
 * Patient Workflow: From Chatbot to First Session
 */
export const PATIENT_WORKFLOW: Workflow = {
  id: 'patient-workflow',
  name: 'Patient Workflow',
  description: 'Workflow from chatbot interaction to first session',
  role: 'patient',
  steps: [
    {
      id: 'chatbot-interaction',
      name: 'Chatbot Interaction',
      description: 'Patient interacts with chatbot via WhatsApp/Website',
      requiredPermissions: ['chatbot:create', 'chatbot:read'],
      apiEndpoint: '/api/chatbot/message',
      databaseOperation: 'INSERT INTO chatbot_conversations',
    },
    {
      id: 'patient-registration',
      name: 'Patient Registration',
      description: 'Register new patient or find existing patient',
      requiredPermissions: ['patients:create', 'patients:read'],
      apiEndpoint: '/api/patients',
      databaseOperation: 'INSERT INTO patients, users',
    },
    {
      id: 'appointment-booking',
      name: 'Appointment Booking',
      description: 'Book appointment with doctor',
      requiredPermissions: ['own-appointments:create'],
      apiEndpoint: '/api/appointments/book',
      databaseOperation: 'INSERT INTO appointments',
      businessLogic: 'validateAppointment, checkAvailability, checkConflicts',
    },
    {
      id: 'payment-processing',
      name: 'Payment Processing',
      description: 'Process payment for appointment',
      requiredPermissions: ['own-payments:read'],
      apiEndpoint: '/api/payments/process',
      databaseOperation: 'INSERT INTO payments',
      businessLogic: 'calculatePayment, checkInsurance, processPayment',
    },
    {
      id: 'check-in',
      name: 'Check-in',
      description: 'Patient arrives and checks in',
      requiredPermissions: ['own-appointments:read'],
      apiEndpoint: '/api/appointments/[id]/check-in',
      databaseOperation: 'UPDATE appointments SET status = "checked_in"',
    },
    {
      id: 'first-session',
      name: 'First Session',
      description: 'Patient attends first session',
      requiredPermissions: ['own-appointments:read'],
      apiEndpoint: '/api/sessions',
      databaseOperation: 'INSERT INTO sessions',
      businessLogic: 'createSession, recordMedicalData',
    },
  ],
};

/**
 * Doctor Workflow: From Start of Day to Completion of All Cases
 */
export const DOCTOR_WORKFLOW: Workflow = {
  id: 'doctor-workflow',
  name: 'Doctor Workflow',
  description: 'Workflow from start of day to completion of all cases',
  role: 'doctor',
  steps: [
    {
      id: 'login',
      name: 'Login',
      description: 'Doctor logs in to the system',
      requiredPermissions: ['profile:read'],
      apiEndpoint: '/api/auth/login',
      databaseOperation: 'SELECT FROM users WHERE role = "doctor"',
    },
    {
      id: 'view-schedule',
      name: 'View Schedule',
      description: "View today's appointments",
      requiredPermissions: ['appointments:read'],
      apiEndpoint: '/api/appointments',
      databaseOperation:
        'SELECT FROM appointments WHERE doctor_id = ? AND date = TODAY',
    },
    {
      id: 'patient-arrival',
      name: 'Patient Arrival',
      description: 'Patient arrives and checks in',
      requiredPermissions: ['appointments:read'],
      apiEndpoint: '/api/appointments/[id]/status',
      databaseOperation: 'UPDATE appointments SET status = "checked_in"',
    },
    {
      id: 'session-start',
      name: 'Session Start',
      description: 'Start session with patient',
      requiredPermissions: ['appointments:update', 'sessions:create'],
      apiEndpoint: '/api/sessions',
      databaseOperation:
        'INSERT INTO sessions, UPDATE appointments SET status = "in_session"',
    },
    {
      id: 'medical-records',
      name: 'Medical Records',
      description: 'Create/update medical records during session',
      requiredPermissions: ['medical-records:create', 'medical-records:update'],
      apiEndpoint: '/api/patients/[id]/medical-records',
      databaseOperation: 'INSERT INTO medical_records',
      businessLogic: 'validateMedicalData, recordDiagnosis',
    },
    {
      id: 'prescription',
      name: 'Prescription',
      description: 'Create prescription for patient',
      requiredPermissions: ['prescriptions:create'],
      apiEndpoint: '/api/prescriptions',
      databaseOperation: 'INSERT INTO prescriptions',
      businessLogic: 'validatePrescription, checkDrugInteractions',
    },
    {
      id: 'insurance-claim',
      name: 'Insurance Claim',
      description: 'Create insurance claim for session',
      requiredPermissions: ['insurance-claims:create'],
      apiEndpoint: '/api/insurance-claims',
      databaseOperation: 'INSERT INTO insurance_claims',
      businessLogic: 'calculateInsuranceCoverage, createClaim',
    },
    {
      id: 'session-complete',
      name: 'Session Complete',
      description: 'Complete session and update records',
      requiredPermissions: ['sessions:update', 'appointments:update'],
      apiEndpoint: '/api/sessions/[id]/complete',
      databaseOperation:
        'UPDATE sessions SET status = "completed", UPDATE appointments SET status = "completed"',
      businessLogic: 'finalizeSession, updatePatientProgress',
    },
    {
      id: 'end-of-day',
      name: 'End of Day',
      description: 'Complete all cases and review summary',
      requiredPermissions: ['appointments:read'],
      apiEndpoint: '/api/doctors/[id]/summary',
      databaseOperation:
        'SELECT FROM appointments WHERE doctor_id = ? AND date = TODAY',
      businessLogic: 'generateDailySummary, reviewCompletedCases',
    },
  ],
};

/**
 * Reception Staff Workflow: From Patient Arrival to Departure
 */
export const RECEPTION_STAFF_WORKFLOW: Workflow = {
  id: 'reception-staff-workflow',
  name: 'Reception Staff Workflow',
  description: 'Workflow from patient arrival to departure',
  role: 'staff',
  steps: [
    {
      id: 'patient-arrival',
      name: 'Patient Arrival',
      description: 'Patient arrives at reception',
      requiredPermissions: ['patients:read', 'appointments:read'],
      apiEndpoint: '/api/appointments',
      databaseOperation: 'SELECT FROM appointments WHERE date = TODAY',
    },
    {
      id: 'check-in',
      name: 'Check-in',
      description: 'Check in patient and update appointment status',
      requiredPermissions: ['check-in:create', 'appointments:update'],
      apiEndpoint: '/api/appointments/[id]/check-in',
      databaseOperation:
        'UPDATE appointments SET status = "checked_in", check_in_time = NOW()',
      businessLogic: 'validateAppointment, checkInsurance',
    },
    {
      id: 'payment-processing',
      name: 'Payment Processing',
      description: 'Process payment for appointment',
      requiredPermissions: ['payments:create', 'payments:update'],
      apiEndpoint: '/api/payments/process',
      databaseOperation: 'INSERT INTO payments',
      businessLogic: 'calculatePayment, checkInsuranceCoverage, processPayment',
    },
    {
      id: 'insurance-claim-creation',
      name: 'Insurance Claim Creation',
      description: 'Create or update insurance claim',
      requiredPermissions: [
        'insurance-claims:create',
        'insurance-claims:update',
      ],
      apiEndpoint: '/api/insurance-claims',
      databaseOperation:
        'INSERT INTO insurance_claims, UPDATE insurance_claims',
      businessLogic: 'validateInsurance, createClaim, submitClaim',
    },
    {
      id: 'waiting-room',
      name: 'Waiting Room',
      description: 'Patient waits in waiting room',
      requiredPermissions: ['appointments:read'],
      apiEndpoint: '/api/appointments/[id]/status',
      databaseOperation: 'UPDATE appointments SET status = "waiting"',
    },
    {
      id: 'session-notification',
      name: 'Session Notification',
      description: 'Notify patient when doctor is ready',
      requiredPermissions: ['messages:create', 'appointments:read'],
      apiEndpoint: '/api/notifications/send',
      databaseOperation: 'INSERT INTO notifications',
      businessLogic: 'sendNotification, updateAppointmentStatus',
    },
    {
      id: 'patient-departure',
      name: 'Patient Departure',
      description: 'Patient completes session and departs',
      requiredPermissions: ['appointments:read', 'payments:read'],
      apiEndpoint: '/api/appointments/[id]/complete',
      databaseOperation:
        'UPDATE appointments SET status = "completed", checkout_time = NOW()',
      businessLogic: 'finalizeAppointment, generateReceipt',
    },
  ],
};

/**
 * Insurance Workflow: From Doctor to Reception
 */
export const INSURANCE_WORKFLOW: Workflow = {
  id: 'insurance-workflow',
  name: 'Insurance Workflow',
  description: 'Workflow for insurance claims from doctor to reception',
  role: 'staff',
  steps: [
    {
      id: 'doctor-creates-claim',
      name: 'Doctor Creates Claim',
      description: 'Doctor creates insurance claim after session',
      requiredPermissions: ['insurance-claims:create'],
      apiEndpoint: '/api/insurance-claims',
      databaseOperation: 'INSERT INTO insurance_claims',
      businessLogic: 'calculateInsuranceCoverage, createClaim',
    },
    {
      id: 'reception-reviews-claim',
      name: 'Reception Reviews Claim',
      description: 'Reception staff reviews claim',
      requiredPermissions: ['insurance-claims:read', 'insurance-claims:update'],
      apiEndpoint: '/api/insurance-claims/[id]',
      databaseOperation: 'SELECT FROM insurance_claims WHERE id = ?',
      businessLogic: 'validateClaim, checkInsuranceProvider',
    },
    {
      id: 'submit-to-insurance',
      name: 'Submit to Insurance',
      description: 'Submit claim to insurance provider',
      requiredPermissions: ['insurance-claims:update'],
      apiEndpoint: '/api/insurance-claims/[id]/submit',
      databaseOperation: 'UPDATE insurance_claims SET status = "submitted"',
      businessLogic: 'submitToInsuranceProvider, trackSubmission',
    },
    {
      id: 'insurance-response',
      name: 'Insurance Response',
      description: 'Receive response from insurance provider',
      requiredPermissions: ['insurance-claims:read', 'insurance-claims:update'],
      apiEndpoint: '/api/insurance-claims/[id]/status',
      databaseOperation:
        'UPDATE insurance_claims SET status = "approved"/"rejected"',
      businessLogic: 'processInsuranceResponse, calculatePatientPortion',
    },
    {
      id: 'payment-processing',
      name: 'Payment Processing',
      description: 'Process remaining payment after insurance',
      requiredPermissions: ['payments:create', 'payments:update'],
      apiEndpoint: '/api/payments/process',
      databaseOperation: 'INSERT INTO payments',
      businessLogic: 'calculateRemainingAmount, processPayment',
    },
  ],
};

/**
 * Workflow Manager
 */
export class WorkflowManager {
  /**
   * Get workflow for a role
   */
  static getWorkflow(role: UserRole): Workflow | null {
    const workflows: Record<UserRole, Workflow> = {
      patient: PATIENT_WORKFLOW,
      doctor: DOCTOR_WORKFLOW,
      staff: RECEPTION_STAFF_WORKFLOW,
      supervisor: RECEPTION_STAFF_WORKFLOW, // Can view but not modify
      admin: PATIENT_WORKFLOW, // Can view all workflows
      manager: RECEPTION_STAFF_WORKFLOW,
      therapist: DOCTOR_WORKFLOW,
      nurse: RECEPTION_STAFF_WORKFLOW,
      agent: PATIENT_WORKFLOW,
    };

    return workflows[role] || null;
  }

  /**
   * Get all workflows
   */
  static getAllWorkflows(): Workflow[] {
    return [
      PATIENT_WORKFLOW,
      DOCTOR_WORKFLOW,
      RECEPTION_STAFF_WORKFLOW,
      INSURANCE_WORKFLOW,
    ];
  }

  /**
   * Check if user can perform a workflow step
   */
  static canPerformStep(
    role: UserRole,
    stepId: string,
    workflowId?: string
  ): boolean {
    const workflow = workflowId
      ? this.getAllWorkflows().find(w => w.id === workflowId)
      : this.getWorkflow(role);

    if (!workflow) return false;

    const step = workflow.steps.find(s => s.id === stepId);
    if (!step) return false;

    // Check permissions (simplified - actual implementation would check user's actual permissions)
    return step.requiredPermissions.length > 0;
  }

  /**
   * Get next step in workflow
   */
  static getNextStep(
    role: UserRole,
    currentStepId: string,
    workflowId?: string
  ): WorkflowStep | null {
    const workflow = workflowId
      ? this.getAllWorkflows().find(w => w.id === workflowId)
      : this.getWorkflow(role);

    if (!workflow) return null;

    const currentIndex = workflow.steps.findIndex(s => s.id === currentStepId);
    if (currentIndex === -1 || currentIndex === workflow.steps.length - 1) {
      return null;
    }

    return workflow.steps[currentIndex + 1];
  }
}

// Export workflows
export {
  PATIENT_WORKFLOW,
  DOCTOR_WORKFLOW,
  RECEPTION_STAFF_WORKFLOW,
  INSURANCE_WORKFLOW,
};
