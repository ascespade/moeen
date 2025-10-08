// Integration System for Hemam Center
export interface PatientRecord {
  id: string;
  name: string;
  age: number;
  contactInfo: {
    phone: string;
    email?: string;
    emergencyContact?: string;
  };
  medicalHistory: string[];
  currentTreatment: {
    doctor: string;
    sessions: Session[];
    goals: string[];
  };
  familyMembers: FamilyMember[];
  lastVisit: Date;
  nextAppointment?: Date;
}

export interface Session {
  id: string;
  date: Date;
  doctor: string;
  type: 'assessment' | 'treatment' | 'follow_up';
  notes: string;
  exercises: Exercise[];
  completed: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  frequency: string;
  duration: string;
  instructions: string;
  completed: boolean;
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  notifications: boolean;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  schedule: ScheduleSlot[];
  patients: string[];
  templates: MessageTemplate[];
}

export interface ScheduleSlot {
  date: Date;
  startTime: string;
  endTime: string;
  available: boolean;
  patientId?: string;
  type: 'assessment' | 'treatment' | 'follow_up' | 'break';
}

export interface MessageTemplate {
  id: string;
  name: string;
  type: 'motivational' | 'reminder' | 'educational' | 'follow_up';
  content: string;
  triggerConditions: string[];
}

export class EHRSystem {
  private patients: Map<string, PatientRecord> = new Map();
  private doctors: Map<string, Doctor> = new Map();

  // Patient Management
  createPatient(patientData: Omit<PatientRecord, 'id'>): string {
    const id = this.generateId();
    const patient: PatientRecord = {
      id,
      ...patientData,
      lastVisit: new Date()
    };
    this.patients.set(id, patient);
    return id;
  }

  getPatient(patientId: string): PatientRecord | undefined {
    return this.patients.get(patientId);
  }

  updatePatient(patientId: string, updates: Partial<PatientRecord>): boolean {
    const patient = this.patients.get(patientId);
    if (!patient) return false;

    const updatedPatient = { ...patient, ...updates };
    this.patients.set(patientId, updatedPatient);
    return true;
  }

  addSession(patientId: string, session: Session): boolean {
    const patient = this.patients.get(patientId);
    if (!patient) return false;

    patient.currentTreatment.sessions.push(session);
    patient.lastVisit = session.date;
    this.patients.set(patientId, patient);
    return true;
  }

  // Doctor Management
  createDoctor(doctorData: Omit<Doctor, 'id'>): string {
    const id = this.generateId();
    const doctor: Doctor = {
      id,
      ...doctorData
    };
    this.doctors.set(id, doctor);
    return id;
  }

  getDoctor(doctorId: string): Doctor | undefined {
    return this.doctors.get(doctorId);
  }

  updateDoctorSchedule(doctorId: string, schedule: ScheduleSlot[]): boolean {
    const doctor = this.doctors.get(doctorId);
    if (!doctor) return false;

    doctor.schedule = schedule;
    this.doctors.set(doctorId, doctor);
    return true;
  }

  // Appointment Management
  bookAppointment(patientId: string, doctorId: string, date: Date, time: string): boolean {
    const doctor = this.doctors.get(doctorId);
    if (!doctor) return false;

    const slot = doctor.schedule.find(s => 
      s.date.toDateString() === date.toDateString() && 
      s.startTime === time && 
      s.available
    );

    if (!slot) return false;

    slot.available = false;
    slot.patientId = patientId;

    // Update patient's next appointment
    const patient = this.patients.get(patientId);
    if (patient) {
      patient.nextAppointment = date;
      this.patients.set(patientId, patient);
    }

    return true;
  }

  getAvailableSlots(doctorId: string, date: Date): ScheduleSlot[] {
    const doctor = this.doctors.get(doctorId);
    if (!doctor) return [];

    return doctor.schedule.filter(slot => 
      slot.date.toDateString() === date.toDateString() && 
      slot.available
    );
  }

  // Family Support
  addFamilyMember(patientId: string, familyMember: FamilyMember): boolean {
    const patient = this.patients.get(patientId);
    if (!patient) return false;

    patient.familyMembers.push(familyMember);
    this.patients.set(patientId, patient);
    return true;
  }

  getFamilyMembers(patientId: string): FamilyMember[] {
    const patient = this.patients.get(patientId);
    return patient?.familyMembers || [];
  }

  // Exercise and Progress Tracking
  addExercise(patientId: string, exercise: Exercise): boolean {
    const patient = this.patients.get(patientId);
    if (!patient) return false;

    const lastSession = patient.currentTreatment.sessions[patient.currentTreatment.sessions.length - 1];
    if (lastSession) {
      lastSession.exercises.push(exercise);
      this.patients.set(patientId, patient);
      return true;
    }
    return false;
  }

  markExerciseComplete(patientId: string, exerciseId: string): boolean {
    const patient = this.patients.get(patientId);
    if (!patient) return false;

    const lastSession = patient.currentTreatment.sessions[patient.currentTreatment.sessions.length - 1];
    if (lastSession) {
      const exercise = lastSession.exercises.find(e => e.id === exerciseId);
      if (exercise) {
        exercise.completed = true;
        this.patients.set(patientId, patient);
        return true;
      }
    }
    return false;
  }

  // Generate unique ID
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

export class CalendarAPI {
  private schedules: Map<string, ScheduleSlot[]> = new Map();

  // Schedule Management
  createSchedule(doctorId: string, schedule: ScheduleSlot[]): void {
    this.schedules.set(doctorId, schedule);
  }

  getSchedule(doctorId: string, date: Date): ScheduleSlot[] {
    const schedule = this.schedules.get(doctorId);
    if (!schedule) return [];

    return schedule.filter(slot => 
      slot.date.toDateString() === date.toDateString()
    );
  }

  getAvailableTimeSlots(doctorId: string, date: Date): string[] {
    const schedule = this.getSchedule(doctorId, date);
    return schedule
      .filter(slot => slot.available)
      .map(slot => slot.startTime);
  }

  // Recurring Appointments
  createRecurringAppointment(
    doctorId: string, 
    patientId: string, 
    startDate: Date, 
    endDate: Date, 
    frequency: 'daily' | 'weekly' | 'monthly',
    time: string
  ): boolean {
    const schedule = this.schedules.get(doctorId);
    if (!schedule) return false;

    const appointments: ScheduleSlot[] = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      appointments.push({
        date: new Date(currentDate),
        startTime: time,
        endTime: this.calculateEndTime(time, 60), // 60 minutes default
        available: false,
        patientId,
        type: 'treatment'
      });

      // Increment date based on frequency
      switch (frequency) {
        case 'daily':
          currentDate.setDate(currentDate.getDate() + 1);
          break;
        case 'weekly':
          currentDate.setDate(currentDate.getDate() + 7);
          break;
        case 'monthly':
          currentDate.setMonth(currentDate.getMonth() + 1);
          break;
      }
    }

    schedule.push(...appointments);
    this.schedules.set(doctorId, schedule);
    return true;
  }

  private calculateEndTime(startTime: string, durationMinutes: number): string {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + durationMinutes;
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
  }
}

export class CommunicationAutomation {
  private messageQueue: Message[] = [];
  private templates: Map<string, MessageTemplate> = new Map();

  interface Message {
    id: string;
    recipient: string;
    type: 'whatsapp' | 'email' | 'sms';
    content: string;
    scheduledTime: Date;
    sent: boolean;
    patientId?: string;
  }

  // Message Scheduling
  scheduleMessage(
    recipient: string,
    content: string,
    scheduledTime: Date,
    type: 'whatsapp' | 'email' | 'sms' = 'whatsapp',
    patientId?: string
  ): string {
    const message: Message = {
      id: this.generateId(),
      recipient,
      content,
      scheduledTime,
      type,
      sent: false,
      patientId
    };

    this.messageQueue.push(message);
    return message.id;
  }

  // Automated Reminders
  scheduleAppointmentReminder(patientId: string, appointmentDate: Date): void {
    const reminderTime = new Date(appointmentDate.getTime() - 24 * 60 * 60 * 1000); // 24 hours before
    
    this.scheduleMessage(
      patientId,
      `تذكير: لديك موعد غداً في مركز الهمم. ننتظرك!`,
      reminderTime,
      'whatsapp',
      patientId
    );
  }

  // Motivational Messages
  scheduleMotivationalMessage(patientId: string, message: string, scheduledTime: Date): void {
    this.scheduleMessage(
      patientId,
      message,
      scheduledTime,
      'whatsapp',
      patientId
    );
  }

  // Family Notifications
  notifyFamilyMember(familyMemberId: string, message: string, patientId: string): void {
    this.scheduleMessage(
      familyMemberId,
      message,
      new Date(),
      'whatsapp',
      patientId
    );
  }

  // Process scheduled messages
  processScheduledMessages(): Message[] {
    const now = new Date();
    const messagesToSend = this.messageQueue.filter(
      message => !message.sent && message.scheduledTime <= now
    );

    messagesToSend.forEach(message => {
      message.sent = true;
      // Here you would integrate with actual messaging services
      console.log(`Sending ${message.type} to ${message.recipient}: ${message.content}`);
    });

    return messagesToSend;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

export class DoctorsDashboard {
  private doctors: Map<string, Doctor> = new Map();

  // Dashboard Data
  getDoctorDashboard(doctorId: string): {
    todayAppointments: ScheduleSlot[];
    upcomingAppointments: ScheduleSlot[];
    patientUpdates: PatientRecord[];
    messages: string[];
  } {
    const doctor = this.doctors.get(doctorId);
    if (!doctor) return { todayAppointments: [], upcomingAppointments: [], patientUpdates: [], messages: [] };

    const today = new Date();
    const todayAppointments = doctor.schedule.filter(slot => 
      slot.date.toDateString() === today.toDateString()
    );

    const upcomingAppointments = doctor.schedule.filter(slot => 
      slot.date > today && slot.available === false
    );

    const patientUpdates = doctor.patients.map(patientId => {
      // This would fetch from EHR system
      return {} as PatientRecord;
    });

    return {
      todayAppointments,
      upcomingAppointments,
      patientUpdates,
      messages: [] // Would contain conversation summaries
    };
  }

  // Update Doctor Schedule
  updateSchedule(doctorId: string, schedule: ScheduleSlot[]): boolean {
    const doctor = this.doctors.get(doctorId);
    if (!doctor) return false;

    doctor.schedule = schedule;
    this.doctors.set(doctorId, doctor);
    return true;
  }

  // Add Message Template
  addMessageTemplate(doctorId: string, template: MessageTemplate): boolean {
    const doctor = this.doctors.get(doctorId);
    if (!doctor) return false;

    doctor.templates.push(template);
    this.doctors.set(doctorId, doctor);
    return true;
  }
}