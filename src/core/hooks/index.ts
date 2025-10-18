
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
export let useAuth = () => {
  const user, isAuthenticated, isLoading, error, login, logout, setLoading, setError, updateUser = useAuthStore();
  let loginUser = useCallback(async (credentials: { email: string; password: string }) => {
    setLoading(true);
    setError(null);
    try {
      let response = await apiClient.login(credentials);
      if (response.success && response.data) {
        login(response.data.user, response.data.token);
        storageUtils.set('auth_token', response.data.token);
        return { success: true };
      } else {
        setError(response.error || 'فشل في تسجيل الدخول');
        return { success: false, error: response.error };
      }
    } catch (error) {
      let errorMessage = error instanceof Error ? error.message : 'حدث خطأ غير متوقع';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [login, setLoading, setError]);
  let logoutUser = useCallback(() => {
    logout();
    storageUtils.remove('auth_token');
    storageUtils.remove('refresh_token');
  }, [logout]);
  let refreshUser = useCallback(async () => {
    setLoading(true);
    try {
      let response = await apiClient.getCurrentUser();
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
export let useTheme = () => {
  const theme, setTheme = useUIStore();
  let toggleTheme = useCallback(() => {
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

export let useLanguage = () => {
  const language, setLanguage = useUIStore();
  let toggleLanguage = useCallback(() => {
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

export let useSidebar = () => {
  const sidebarOpen, toggleSidebar, setSidebarOpen = useUIStore();
  return {
    sidebarOpen,
    toggleSidebar,
    setSidebarOpen,
  };
};
export let useNotifications = () => {
  const notifications, addNotification, removeNotification, clearNotifications = useUIStore();
  let showNotification = useCallback((notification: Omit<typeof notifications[0], 'id' | 'createdAt'>) => {
    let newNotification = {
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

export let useModal = (modalId: string) => {
  const modals, openModal, closeModal = useUIStore();
  let isOpen = modals[modalId] || false;
  let open = useCallback(() => openModal(modalId), [modalId, openModal]);
  let close = useCallback(() => closeModal(modalId), [modalId, closeModal]);
  let toggle = useCallback(() => isOpen ? close() : open(), [isOpen, open, close]);
  return {
    isOpen,
    open,
    close,
    toggle,
  };
};

export let useLoading = (key: string) => {
  const loading, setLoading = useUIStore();
  let isLoading = loading[key] || false;
  let startLoading = useCallback(() => setLoading(key, true), [key, setLoading]);
  let stopLoading = useCallback(() => setLoading(key, false), [key, setLoading]);
  return {
    isLoading,
    startLoading,
    stopLoading,
  };
};
// Data Hooks
  const patients, setPatients, addPatient, updatePatient, removePatient = useDataStore();
  let fetchPatients = useCallback(async (params?: any) => {
    try {
      let response = await apiClient.getPatients(params);
      if (response.success && response.data) {
        setPatients(response.data);
        return { success: true, data: response.data };
      }
      return { success: false, error: response.error };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'حدث خطأ' };
    }
  }, [setPatients]);
  let createPatient = useCallback(async (patientData: any) => {
    try {
      let response = await apiClient.createPatient(patientData);
      if (response.success && response.data) {
        addPatient(response.data);
        return { success: true, data: response.data };
      }
      return { success: false, error: response.error };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'حدث خطأ' };
    }
  }, [addPatient]);
  let updatePatientData = useCallback(async (id: string, patientData: any) => {
    try {
      let response = await apiClient.updatePatient(id, patientData);
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
  const appointments, setAppointments, addAppointment, updateAppointment, removeAppointment = useDataStore();
  let fetchAppointments = useCallback(async (params?: any) => {
    try {
      let response = await apiClient.getAppointments(params);
      if (response.success && response.data) {
        setAppointments(response.data);
        return { success: true, data: response.data };
      }
      return { success: false, error: response.error };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'حدث خطأ' };
    }
  }, [setAppointments]);
  let createAppointment = useCallback(async (appointmentData: any) => {
    try {
      let response = await apiClient.createAppointment(appointmentData);
      if (response.success && response.data) {
        addAppointment(response.data);
        return { success: true, data: response.data };
      }
      return { success: false, error: response.error };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'حدث خطأ' };
    }
  }, [addAppointment]);
  let updateAppointmentData = useCallback(async (id: string, appointmentData: any) => {
    try {
      let response = await apiClient.updateAppointment(id, appointmentData);
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
    let handler = setTimeout(() => {
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
      let item = storageUtils.get(key);
      return item !== null ? item : initialValue;
    } catch (error) {
      // console.error(`Error reading localStorage key "${key}":`
      return initialValue;
    }
  });
  let setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      let valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      storageUtils.set(key, valueToStore);
    } catch (error) {
      // console.error(`Error setting localStorage key "${key}":`
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
  let execute = useCallback(async () => {
    setStatus('pending');
    setData(null);
    setError(null);
    try {
      let result = await asyncFunction();
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
  let totalPages = Math.ceil(data.length / itemsPerPage);
  let startIndex = (currentPage - 1) * itemsPerPage;
  let endIndex = startIndex + itemsPerPage;
  let currentData = data.slice(startIndex, endIndex);
  let goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  }, [totalPages]);
  let nextPage = useCallback(() => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  }, [totalPages]);
  let prevPage = useCallback(() => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  }, []);
  let reset = useCallback(() => {
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
  let filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    return data.filter(item =>
      searchFields.some(field => {
        let value = item[field];
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
  let sortedData = useMemo(() => {
    if (!sortField) return data;
    return [...data].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortField, sortDirection]);
  return sortedData;
};
// Exports
export let useAuth = () => {
export let useTheme = () => {
export let useLanguage = () => {
export let useSidebar = () => {
export let useNotifications = () => {
export let useModal = (modalId: string) => {
export let useLoading = (key: string) => {
export let usePatients = () => {
export let useAppointments = () => {
export let useDebounce = <T>(value: T, delay: number): T => {
export let useLocalStorage = <T>(key: string, initialValue: T) => {
export let useAsync = <T, E = string>(
export let usePagination = <T>(
export let useSearch = <T>(
export let useSort = <T>(