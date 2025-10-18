
/**
 * Core Hooks - الخطافات الأساسية
 * Centralized custom hooks for common functionality
 */
import { log } from '@/lib/monitoring/logger';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuthStore, useUIStore, useDataStore } from '../store';
import { storageUtils, debounce } from '../utils/index';
import { ApiResponse } from '../types';
// Auth Hooks
export const useAuth = () => {
  const { user, isAuthenticated, isLoading, error, login, logout, setLoading, setError, updateUser } = useAuthStore();
  const loginUser = useCallback(async (credentials: { email: string; password: string }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.login(credentials);
      if (response.success && response.data) {
        login(response.data.user, response.data.token);
        storageUtils.set('auth_token', response.data.token);
        return { success: true };
      } else {
        setError(response.error || 'فشل في تسجيل الدخول');
        return { success: false, error: response.error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'حدث خطأ غير متوقع';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [login, setLoading, setError]);
  const logoutUser = useCallback(() => {
    logout();
    storageUtils.remove('auth_token');
    storageUtils.remove('refresh_token');
  }, [logout]);
  const refreshUser = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.getCurrentUser();
      if (response.success && response.data) {
        updateUser(response.data);
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, [updateUser, setLoading]);
  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login: loginUser,
    logout: logoutUser,
    refreshUser,
    updateUser,
  };
};
// UI Hooks
export const useTheme = () => {
  const { theme, setTheme } = useUIStore();
  const toggleTheme = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }, [theme, setTheme]);
  return {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
  };
};

export const useLanguage = () => {
  const { language, setLanguage } = useUIStore();
  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  }, [language, setLanguage]);
  return {
    language,
    setLanguage,
    toggleLanguage,
    isRTL: language === 'ar',
    isLTR: language === 'en',
  };
};

export const useSidebar = () => {
  const { sidebarOpen, toggleSidebar, setSidebarOpen } = useUIStore();
  return {
    sidebarOpen,
    toggleSidebar,
    setSidebarOpen,
  };
};
export const useNotifications = () => {
  const { notifications, addNotification, removeNotification, clearNotifications } = useUIStore();
  const showNotification = useCallback((notification: Omit<typeof notifications[0], 'id' | 'createdAt'>) => {
    const newNotification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
    };
    addNotification(newNotification);
    // Auto remove after 5 seconds
    setTimeout(() => {
      removeNotification(newNotification.id);
    }, 5000);
  }, [addNotification, removeNotification]);
  return {
    notifications,
    showNotification,
    removeNotification,
    clearNotifications,
  };
};

export const useModal = (modalId: string) => {
  const { modals, openModal, closeModal } = useUIStore();
  const isOpen = modals[modalId] || false;
  const open = useCallback(() => openModal(modalId), [modalId, openModal]);
  const close = useCallback(() => closeModal(modalId), [modalId, closeModal]);
  const toggle = useCallback(() => isOpen ? close() : open(), [isOpen, open, close]);
  return {
    isOpen,
    open,
    close,
    toggle,
  };
};

export const useLoading = (key: string) => {
  const { loading, setLoading } = useUIStore();
  const isLoading = loading[key] || false;
  const startLoading = useCallback(() => setLoading(key, true), [key, setLoading]);
  const stopLoading = useCallback(() => setLoading(key, false), [key, setLoading]);
  return {
    isLoading,
    startLoading,
    stopLoading,
  };
};
// Data Hooks
  const { patients, setPatients, addPatient, updatePatient, removePatient } = useDataStore();
  const fetchPatients = useCallback(async (params?: any) => {
    try {
      const response = await apiClient.getPatients(params);
      if (response.success && response.data) {
        setPatients(response.data);
        return { success: true, data: response.data };
      }
      return { success: false, error: response.error };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'حدث خطأ' };
    }
  }, [setPatients]);
  const createPatient = useCallback(async (patientData: any) => {
    try {
      const response = await apiClient.createPatient(patientData);
      if (response.success && response.data) {
        addPatient(response.data);
        return { success: true, data: response.data };
      }
      return { success: false, error: response.error };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'حدث خطأ' };
    }
  }, [addPatient]);
  const updatePatientData = useCallback(async (id: string, patientData: any) => {
    try {
      const response = await apiClient.updatePatient(id, patientData);
      if (response.success && response.data) {
        updatePatient(id, response.data);
        return { success: true, data: response.data };
      }
      return { success: false, error: response.error };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'حدث خطأ' };
    }
  }, [updatePatient]);
  return {
    patients,
    fetchPatients,
    createPatient,
    updatePatient: updatePatientData,
    removePatient,
  };
};
  const { appointments, setAppointments, addAppointment, updateAppointment, removeAppointment } = useDataStore();
  const fetchAppointments = useCallback(async (params?: any) => {
    try {
      const response = await apiClient.getAppointments(params);
      if (response.success && response.data) {
        setAppointments(response.data);
        return { success: true, data: response.data };
      }
      return { success: false, error: response.error };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'حدث خطأ' };
    }
  }, [setAppointments]);
  const createAppointment = useCallback(async (appointmentData: any) => {
    try {
      const response = await apiClient.createAppointment(appointmentData);
      if (response.success && response.data) {
        addAppointment(response.data);
        return { success: true, data: response.data };
      }
      return { success: false, error: response.error };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'حدث خطأ' };
    }
  }, [addAppointment]);
  const updateAppointmentData = useCallback(async (id: string, appointmentData: any) => {
    try {
      const response = await apiClient.updateAppointment(id, appointmentData);
      if (response.success && response.data) {
        updateAppointment(id, response.data);
        return { success: true, data: response.data };
      }
      return { success: false, error: response.error };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'حدث خطأ' };
    }
  }, [updateAppointment]);
  return {
    appointments,
    fetchAppointments,
    createAppointment,
    updateAppointment: updateAppointmentData,
    removeAppointment,
  };
};
// Utility Hooks
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = storageUtils.get(key);
      return item !== null ? item : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      storageUtils.set(key, valueToStore);
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);
  return [storedValue, setValue] as const;
};
  asyncFunction: () => Promise<T>,
  immediate = true
) => {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<E | null>(null);
  const execute = useCallback(async () => {
    setStatus('pending');
    setData(null);
    setError(null);
    try {
      const result = await asyncFunction();
      setData(result);
      setStatus('success');
      return result;
    } catch (err) {
      setError(err as E);
      setStatus('error');
      throw err;
    }
  }, [asyncFunction]);
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);
  return { execute, status, data, error };
};
  data: T[],
  itemsPerPage: number = 10
) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);
  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  }, [totalPages]);
  const nextPage = useCallback(() => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  }, [totalPages]);
  const prevPage = useCallback(() => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  }, []);
  const reset = useCallback(() => {
    setCurrentPage(1);
  }, []);
  return {
    currentPage,
    totalPages,
    currentData,
    goToPage,
    nextPage,
    prevPage,
    reset,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
  };
};
  data: T[],
  searchFields: (keyof T)[],
  searchTerm: string
) => {
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    return data.filter(item =>
      searchFields.some(field => {
        const value = item[field];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(searchTerm.toLowerCase());
        }
        if (typeof value === 'number') {
          return value.toString().includes(searchTerm);
        }
        return false;
      })
    );
  }, [data, searchFields, searchTerm]);
  return filteredData;
};
  data: T[],
  sortField: keyof T | null,
  sortDirection: 'asc' | 'desc' = 'asc'
) => {
  const sortedData = useMemo(() => {
    if (!sortField) return data;
    return [...data].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortField, sortDirection]);
  return sortedData;
};
// Exports
export const useAuth = () => {
export const useTheme = () => {
export const useLanguage = () => {
export const useSidebar = () => {
export const useNotifications = () => {
export const useModal = (modalId: string) => {
export const useLoading = (key: string) => {
export const usePatients = () => {
export const useAppointments = () => {
export const useDebounce = <T>(value: T, delay: number): T => {
export const useLocalStorage = <T>(key: string, initialValue: T) => {
export const useAsync = <T, E = string>(
export const usePagination = <T>(
export const useSearch = <T>(
export const useSort = <T>(