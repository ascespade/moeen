/**
 * Store Management - إدارة الحالة الموحدة
 * Centralized state management using Zustand
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import {
  User,
  Patient,
  Doctor,
  Appointment,
  Payment,
  InsuranceClaim,
  Notification,
} from '../types';

// Auth Store
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  devtools(
    persist(
      immer(set => ({
        // State
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        // Actions
        login: (user, token) =>
          set(state => {
            state.user = user;
            state.token = token;
            state.isAuthenticated = true;
            state.error = null;
          }),

        logout: () =>
          set(state => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;
          }),

        setLoading: loading =>
          set(state => {
            state.isLoading = loading;
          }),

        setError: error =>
          set(state => {
            state.error = error;
          }),

        updateUser: userData =>
          set(state => {
            if (state.user) {
              state.user = { ...state.user, ...userData };
            }
          }),
      })),
      {
        name: 'auth-store',
        partialize: state => ({
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    { name: 'AuthStore' }
  )
);

// UI Store
interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  language: 'ar' | 'en';
  notifications: Notification[];
  modals: Record<string, boolean>;
  loading: Record<string, boolean>;
}

interface UIActions {
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setLanguage: (language: 'ar' | 'en') => void;
  addNotification: (
    notification: Omit<Notification, 'id' | 'createdAt'>
  ) => void;
  removeNotification: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  openModal: (modalId: string) => void;
  closeModal: (modalId: string) => void;
  setLoading: (key: string, loading: boolean) => void;
}

export const useUIStore = create<UIState & UIActions>()(
  devtools(
    persist(
      immer(set => ({
        // State
        sidebarOpen: false,
        theme: 'system',
        language: 'ar',
        notifications: [],
        modals: {},
        loading: {},

        // Actions
        toggleSidebar: () =>
          set(state => {
            state.sidebarOpen = !state.sidebarOpen;
          }),

        setSidebarOpen: open =>
          set(state => {
            state.sidebarOpen = open;
          }),

        setTheme: theme =>
          set(state => {
            state.theme = theme;
          }),

        setLanguage: language =>
          set(state => {
            state.language = language;
          }),

        addNotification: notification =>
          set(state => {
            const newNotification: Notification = {
              ...notification,
              id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              createdAt: new Date(),
            };
            state.notifications.unshift(newNotification);
          }),

        removeNotification: id =>
          set(state => {
            state.notifications = state.notifications.filter(n => n.id !== id);
          }),

        markNotificationAsRead: id =>
          set(state => {
            const notification = state.notifications.find(n => n.id === id);
            if (notification) {
              notification.isRead = true;
            }
          }),

        clearNotifications: () =>
          set(state => {
            state.notifications = [];
          }),

        openModal: modalId =>
          set(state => {
            state.modals[modalId] = true;
          }),

        closeModal: modalId =>
          set(state => {
            state.modals[modalId] = false;
          }),

        setLoading: (key, loading) =>
          set(state => {
            state.loading[key] = loading;
          }),
      })),
      {
        name: 'ui-store',
        partialize: state => ({
          theme: state.theme,
          language: state.language,
        }),
      }
    ),
    { name: 'UIStore' }
  )
);

// Data Store
interface DataState {
  patients: Patient[];
  doctors: Doctor[];
  appointments: Appointment[];
  payments: Payment[];
  insuranceClaims: InsuranceClaim[];
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
}

interface DataActions {
  // Patients
  setPatients: (patients: Patient[]) => void;
  addPatient: (patient: Patient) => void;
  updatePatient: (
    id: string,
    patientData: Partial<Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>>
  ) => void;
  removePatient: (id: string) => void;
  getPatient: (id: string) => Patient | undefined;

  // Doctors
  setDoctors: (doctors: Doctor[]) => void;
  addDoctor: (doctor: Doctor) => void;
  updateDoctor: (
    id: string,
    doctorData: Partial<Omit<Doctor, 'id' | 'createdAt' | 'updatedAt'>>
  ) => void;
  removeDoctor: (id: string) => void;
  getDoctor: (id: string) => Doctor | undefined;

  // Appointments
  setAppointments: (appointments: Appointment[]) => void;
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (
    id: string,
    appointmentData: Partial<
      Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>
    >
  ) => void;
  removeAppointment: (id: string) => void;
  getAppointment: (id: string) => Appointment | undefined;

  // Payments
  setPayments: (payments: Payment[]) => void;
  addPayment: (payment: Payment) => void;
  updatePayment: (
    id: string,
    paymentData: Partial<Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>>
  ) => void;
  removePayment: (id: string) => void;
  getPayment: (id: string) => Payment | undefined;

  // Insurance Claims
  setInsuranceClaims: (claims: InsuranceClaim[]) => void;
  addInsuranceClaim: (claim: InsuranceClaim) => void;
  updateInsuranceClaim: (
    id: string,
    claimData: Partial<Omit<InsuranceClaim, 'id' | 'createdAt' | 'updatedAt'>>
  ) => void;
  removeInsuranceClaim: (id: string) => void;
  getInsuranceClaim: (id: string) => InsuranceClaim | undefined;

  // Notifications
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  updateNotification: (
    id: string,
    notificationData: Partial<
      Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>
    >
  ) => void;
  removeNotification: (id: string) => void;
  getNotification: (id: string) => Notification | undefined;

  // General
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useDataStore = create<DataState & DataActions>()(
  devtools(
    persist(
      immer((set, get) => ({
        // State
        patients: [],
        doctors: [],
        appointments: [],
        payments: [],
        insuranceClaims: [],
        notifications: [],
        isLoading: false,
        error: null,

        // Patient Actions
        setPatients: patients =>
          set(state => {
            state.patients = patients;
          }),

        addPatient: patient =>
          set(state => {
            state.patients.push(patient);
          }),

        updatePatient: (id, patientData) =>
          set(state => {
            const index = state.patients.findIndex(p => p.id === id);
            if (index !== -1) {
              const validUpdates = Object.fromEntries(
                Object.entries(patientData).filter(
                  ([_, value]) => value !== undefined
                )
              );
              state.patients[index] = {
                ...state.patients[index],
                ...validUpdates,
              } as Patient;
            }
          }),

        removePatient: id =>
          set(state => {
            state.patients = state.patients.filter(p => p.id !== id);
          }),

        getPatient: id => {
          const state = get();
          return state.patients.find(p => p.id === id);
        },

        // Doctor Actions
        setDoctors: doctors =>
          set(state => {
            state.doctors = doctors;
          }),

        addDoctor: doctor =>
          set(state => {
            state.doctors.push(doctor);
          }),

        updateDoctor: (id, doctorData) =>
          set(state => {
            const index = state.doctors.findIndex(d => d.id === id);
            if (index !== -1) {
              const validUpdates = Object.fromEntries(
                Object.entries(doctorData).filter(
                  ([_, value]) => value !== undefined
                )
              );
              state.doctors[index] = {
                ...state.doctors[index],
                ...validUpdates,
              } as Doctor;
            }
          }),

        removeDoctor: id =>
          set(state => {
            state.doctors = state.doctors.filter(d => d.id !== id);
          }),

        getDoctor: id => {
          const state = get();
          return state.doctors.find(d => d.id === id);
        },

        // Appointment Actions
        setAppointments: appointments =>
          set(state => {
            state.appointments = appointments;
          }),

        addAppointment: appointment =>
          set(state => {
            state.appointments.push(appointment);
          }),

        updateAppointment: (id, appointmentData) =>
          set(state => {
            const index = state.appointments.findIndex(a => a.id === id);
            if (index !== -1) {
              const validUpdates = Object.fromEntries(
                Object.entries(appointmentData).filter(
                  ([_, value]) => value !== undefined
                )
              );
              state.appointments[index] = {
                ...state.appointments[index],
                ...validUpdates,
              } as Appointment;
            }
          }),

        removeAppointment: id =>
          set(state => {
            state.appointments = state.appointments.filter(a => a.id !== id);
          }),

        getAppointment: id => {
          const state = get();
          return state.appointments.find(a => a.id === id);
        },

        // Payment Actions
        setPayments: payments =>
          set(state => {
            state.payments = payments;
          }),

        addPayment: payment =>
          set(state => {
            state.payments.push(payment);
          }),

        updatePayment: (id, paymentData) =>
          set(state => {
            const index = state.payments.findIndex(p => p.id === id);
            if (index !== -1) {
              const validUpdates = Object.fromEntries(
                Object.entries(paymentData).filter(
                  ([_, value]) => value !== undefined
                )
              );
              state.payments[index] = {
                ...state.payments[index],
                ...validUpdates,
              } as Payment;
            }
          }),

        removePayment: id =>
          set(state => {
            state.payments = state.payments.filter(p => p.id !== id);
          }),

        getPayment: id => {
          const state = get();
          return state.payments.find(p => p.id === id);
        },

        // Insurance Claim Actions
        setInsuranceClaims: claims =>
          set(state => {
            state.insuranceClaims = claims;
          }),

        addInsuranceClaim: claim =>
          set(state => {
            state.insuranceClaims.push(claim);
          }),

        updateInsuranceClaim: (id, claimData) =>
          set(state => {
            const index = state.insuranceClaims.findIndex(c => c.id === id);
            if (index !== -1) {
              const validUpdates = Object.fromEntries(
                Object.entries(claimData).filter(
                  ([_, value]) => value !== undefined
                )
              );
              state.insuranceClaims[index] = {
                ...state.insuranceClaims[index],
                ...validUpdates,
              } as InsuranceClaim;
            }
          }),

        removeInsuranceClaim: id =>
          set(state => {
            state.insuranceClaims = state.insuranceClaims.filter(
              c => c.id !== id
            );
          }),

        getInsuranceClaim: id => {
          const state = get();
          return state.insuranceClaims.find(c => c.id === id);
        },

        // Notification Actions
        setNotifications: notifications =>
          set(state => {
            state.notifications = notifications;
          }),

        addNotification: notification =>
          set(state => {
            state.notifications.push(notification);
          }),

        updateNotification: (id, notificationData) =>
          set(state => {
            const index = state.notifications.findIndex(n => n.id === id);
            if (index !== -1) {
              const validUpdates = Object.fromEntries(
                Object.entries(notificationData).filter(
                  ([_, value]) => value !== undefined
                )
              );
              state.notifications[index] = {
                ...state.notifications[index],
                ...validUpdates,
              } as Notification;
            }
          }),

        removeNotification: id =>
          set(state => {
            state.notifications = state.notifications.filter(n => n.id !== id);
          }),

        getNotification: id => {
          const state = get();
          return state.notifications.find(n => n.id === id);
        },

        // General Actions
        setLoading: loading =>
          set(state => {
            state.isLoading = loading;
          }),

        setError: error =>
          set(state => {
            state.error = error;
          }),

        clearError: () =>
          set(state => {
            state.error = null;
          }),
      })),
      {
        name: 'data-store',
        partialize: state => ({
          patients: state.patients,
          doctors: state.doctors,
          appointments: state.appointments,
          payments: state.payments,
          insuranceClaims: state.insuranceClaims,
          notifications: state.notifications,
        }),
      }
    ),
    { name: 'DataStore' }
  )
);
