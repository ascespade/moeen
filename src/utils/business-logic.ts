/**
 * Healthcare Business Logic Utilities
 */

export interface AppointmentValidation {
  isValid: boolean;
  errors: string[];
}

export function validateAppointment(data: {
  date: string;
  time: string;
  doctorId: string;
  patientId: string;
}): AppointmentValidation {
  const errors: string[] = [];

  // Date validation
  if (!data.date || new Date(data.date) < new Date()) {
    errors.push('Appointment date must be in the future');
  }

  // Time validation
  if (!data.time || !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(data.time)) {
    errors.push('Invalid time format');
  }

  // Required fields
  if (!data.doctorId) errors.push('Doctor ID is required');
  if (!data.patientId) errors.push('Patient ID is required');

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function checkAppointmentConflicts(
  appointments: Array<{ date: string; time: string; doctorId: string }>,
  newAppointment: { date: string; time: string; doctorId: string }
): boolean {
  return appointments.some(
    apt =>
      apt.date === newAppointment.date &&
      apt.time === newAppointment.time &&
      apt.doctorId === newAppointment.doctorId
  );
}

export function calculateInsuranceCoverage(
  totalCost: number,
  coveragePercentage: number
): { covered: number; patientPortion: number } {
  const covered = totalCost * (coveragePercentage / 100);
  const patientPortion = totalCost - covered;

  return { covered, patientPortion };
}
