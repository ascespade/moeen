/**
 * Store Management - إدارة الحالة الموحدة
 * Centralized state management using Zustand
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { User, Patient, Doctor, Appointment, Payment, InsuranceClaim, Notification } from '../types';

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
      immer((set) => ({
        // State
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        // Actions
        login: (user, token) =>
          set((state) => {
            state.user = user;
            state.token = token;
            state.isAuthenticated = true;
            state.error = null;
          }),

        logout: () =>
          set((state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;
          }),

        setLoading: (loading) =>
          set((state) => {
            state.isLoading = loading;
          }),

        setError: (error) =>
          set((state) => {
            state.error = error;
          }),

        updateUser: (userData) =>
          set((state) => {
            if (state.user) {
              state.user = { ...state.user, ...userData };
            }
          }),
      })),
      {
        name: 'auth-store',
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    { name: 'auth-store' }
  )
);

// UI Store
interface UIState {
  theme: 'light' | 'dark' | 'system';
  language: 'ar' | 'en';
  sidebarOpen: boolean;
  notifications: Notification[];
  modals: Record<string, boolean>;
  loading: Record<string, boolean>;
}

interface UIActions {
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setLanguage: (language: 'ar' | 'en') => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  openModal: (modalId: string) => void;
  closeModal: (modalId: string) => void;
  setLoading: (key: string, loading: boolean) => void;
}

export const useUIStore = create<UIState & UIActions>()(
  devtools(
    persist(
      immer((set) => ({
        // State
        theme: 'system',
        language: 'ar',
        sidebarOpen: false,
        notifications: [],
        modals: {},
        loading: {},

        // Actions
        setTheme: (theme) =>
          set((state) => {
            state.theme = theme;
          }),

        setLanguage: (language) =>
          set((state) => {
            state.language = language;
          }),

        toggleSidebar: () =>
          set((state) => {
            state.sidebarOpen = !state.sidebarOpen;
          }),

        setSidebarOpen: (open) =>
          set((state) => {
            state.sidebarOpen = open;
          }),

        addNotification: (notification) =>
          set((state) => {
            state.notifications.push(notification);
          }),

        removeNotification: (id) =>
          set((state) => {
            state.notifications = state.notifications.filter(n => n.id !== id);
          }),

        clearNotifications: () =>
          set((state) => {
            state.notifications = [];
          }),

        openModal: (modalId) =>
          set((state) => {
            state.modals[modalId] = true;
          }),

        closeModal: (modalId) =>
          set((state) => {
            state.modals[modalId] = false;
          }),

        setLoading: (key, loading) =>
          set((state) => {
            state.loading[key] = loading;
          }),
      })),
      {
        name: 'ui-store',
        partialize: (state) => ({
          theme: state.theme,
          language: state.language,
        }),
      }
    ),
    { name: 'ui-store' }
  )
);

// Data Store
interface DataState {
  patients: Patient[];
  doctors: Doctor[];
  appointments: Appointment[];
  payments: Payment[];
  insuranceClaims: InsuranceClaim[];
  pagination: Record<string, { page: number; limit: number; total: number }>;
  filters: Record<string, any>;
  search: Record<string, string>;
}

interface DataActions {
  setPatients: (patients: Patient[]) => void;
  addPatient: (patient: Patient) => void;
  updatePatient: (id: string, patient: Partial<Patient>) => void;
  removePatient: (id: string) => void;
  
  setDoctors: (doctors: Doctor[]) => void;
  addDoctor: (doctor: Doctor) => void;
  updateDoctor: (id: string, doctor: Partial<Doctor>) => void;
  removeDoctor: (id: string) => void;
  
  setAppointments: (appointments: Appointment[]) => void;
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (id: string, appointment: Partial<Appointment>) => void;
  removeAppointment: (id: string) => void;
  
  setPayments: (payments: Payment[]) => void;
  addPayment: (payment: Payment) => void;
  updatePayment: (id: string, payment: Partial<Payment>) => void;
  removePayment: (id: string) => void;
  
  setInsuranceClaims: (claims: InsuranceClaim[]) => void;
  addInsuranceClaim: (claim: InsuranceClaim) => void;
  updateInsuranceClaim: (id: string, claim: Partial<InsuranceClaim>) => void;
  removeInsuranceClaim: (id: string) => void;
  
  setPagination: (key: string, pagination: { page: number; limit: number; total: number }) => void;
  setFilter: (key: string, filter: any) => void;
  setSearch: (key: string, search: string) => void;
  clearData: () => void;
}

export const useDataStore = create<DataState & DataActions>()(
  devtools(
    immer((set) => ({
      // State
      patients: [],
      doctors: [],
      appointments: [],
      payments: [],
      insuranceClaims: [],
      pagination: {},
      filters: {},
      search: {},

      // Patient Actions
      setPatients: (patients) =>
        set((state) => {
          state.patients = patients;
        }),

      addPatient: (patient) =>
        set((state) => {
          state.patients.push(patient);
        }),

      updatePatient: (id, patientData) =>
        set((state) => {
          const index = state.patients.findIndex(p => p.id === id);
          if (index !== -1) {
            // Only update fields that are defined and valid, excluding required fields
            const { userId, medicalRecordNumber, emergencyContact, medicalHistory, isActivated, ...updatableFields } = patientData;
            const validUpdates = Object.fromEntries(
              Object.entries(updatableFields).filter(([_, value]) => value !== undefined)
            );
            state.patients[index] = { ...state.patients[index], ...validUpdates };
          }
        }),

      removePatient: (id) =>
        set((state) => {
          state.patients = state.patients.filter(p => p.id !== id);
        }),

      // Doctor Actions
      setDoctors: (doctors) =>
        set((state) => {
          state.doctors = doctors;
        }),

      addDoctor: (doctor) =>
        set((state) => {
          state.doctors.push(doctor);
        }),

      updateDoctor: (id, doctorData) =>
        set((state) => {
          const index = state.doctors.findIndex(d => d.id === id);
          if (index !== -1) {
            state.doctors[index] = { ...state.doctors[index], ...doctorData };
          }
        }),

      removeDoctor: (id) =>
        set((state) => {
          state.doctors = state.doctors.filter(d => d.id !== id);
        }),

      // Appointment Actions
      setAppointments: (appointments) =>
        set((state) => {
          state.appointments = appointments;
        }),

      addAppointment: (appointment) =>
        set((state) => {
          state.appointments.push(appointment);
        }),

      updateAppointment: (id, appointmentData) =>
        set((state) => {
          const index = state.appointments.findIndex(a => a.id === id);
          if (index !== -1) {
            state.appointments[index] = { ...state.appointments[index], ...appointmentData };
          }
        }),

      removeAppointment: (id) =>
        set((state) => {
          state.appointments = state.appointments.filter(a => a.id !== id);
        }),

      // Payment Actions
      setPayments: (payments) =>
        set((state) => {
          state.payments = payments;
        }),

      addPayment: (payment) =>
        set((state) => {
          state.payments.push(payment);
        }),

      updatePayment: (id, paymentData) =>
        set((state) => {
          const index = state.payments.findIndex(p => p.id === id);
          if (index !== -1) {
            state.payments[index] = { ...state.payments[index], ...paymentData };
          }
        }),

      removePayment: (id) =>
        set((state) => {
          state.payments = state.payments.filter(p => p.id !== id);
        }),

      // Insurance Claim Actions
      setInsuranceClaims: (claims) =>
        set((state) => {
          state.insuranceClaims = claims;
        }),

      addInsuranceClaim: (claim) =>
        set((state) => {
          state.insuranceClaims.push(claim);
        }),

      updateInsuranceClaim: (id, claimData) =>
        set((state) => {
          const index = state.insuranceClaims.findIndex(c => c.id === id);
          if (index !== -1) {
            state.insuranceClaims[index] = { ...state.insuranceClaims[index], ...claimData };
          }
        }),

      removeInsuranceClaim: (id) =>
        set((state) => {
          state.insuranceClaims = state.insuranceClaims.filter(c => c.id !== id);
        }),

      // Utility Actions
      setPagination: (key, pagination) =>
        set((state) => {
          state.pagination[key] = pagination;
        }),

      setFilter: (key, filter) =>
        set((state) => {
          state.filters[key] = filter;
        }),

      setSearch: (key, search) =>
        set((state) => {
          state.search[key] = search;
        }),

      clearData: () =>
        set((state) => {
          state.patients = [];
          state.doctors = [];
          state.appointments = [];
          state.payments = [];
          state.insuranceClaims = [];
          state.pagination = {};
          state.filters = {};
          state.search = {};
        }),
    })),
    { name: 'data-store' }
  )
);

// Selectors
export const authSelectors = {
  user: (state: AuthState) => state.user,
  isAuthenticated: (state: AuthState) => state.isAuthenticated,
  isLoading: (state: AuthState) => state.isLoading,
  error: (state: AuthState) => state.error,
};

export const uiSelectors = {
  theme: (state: UIState) => state.theme,
  language: (state: UIState) => state.language,
  sidebarOpen: (state: UIState) => state.sidebarOpen,
  notifications: (state: UIState) => state.notifications,
  isModalOpen: (modalId: string) => (state: UIState) => state.modals[modalId] || false,
  isLoading: (key: string) => (state: UIState) => state.loading[key] || false,
};

export const dataSelectors = {
  patients: (state: DataState) => state.patients,
  doctors: (state: DataState) => state.doctors,
  appointments: (state: DataState) => state.appointments,
  payments: (state: DataState) => state.payments,
  insuranceClaims: (state: DataState) => state.insuranceClaims,
  pagination: (key: string) => (state: DataState) => state.pagination[key],
  filter: (key: string) => (state: DataState) => state.filters[key],
  search: (key: string) => (state: DataState) => state.search[key],
};