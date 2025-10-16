/**
 * Core Hooks - الخطافات الأساسية
 * Centralized custom hooks for common functionality
 */

import { _useState, useEffect, useCallback, useMemo } from "react";

import { _apiClient } from "../api/client";
import { _useAuthStore, useUIStore, useDataStore } from "../store";
import { _ApiResponse } from "../types";
import { _storageUtils, debounce } from "../utils";

// Auth Hooks
export const __useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    setLoading,
    setError,
    updateUser,
  } = useAuthStore();

  const __loginUser = useCallback(
    async (_credentials: { email: string; password: string }) => {
      setLoading(true);
      setError(null);

      try {
        const __response = await apiClient.login(credentials);
        if (response.success && response.data) {
          login(response.data.user, response.data.token);
          storageUtils.set("auth_token", response.data.token);
          return { success: true };
        } else {
          setError(response.error || "فشل في تسجيل الدخول");
          return { success: false, error: response.error };
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "حدث خطأ غير متوقع";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [login, setLoading, setError],
  );

  const __logoutUser = useCallback(() => {
    logout();
    storageUtils.remove("auth_token");
    storageUtils.remove("refresh_token");
  }, [logout]);

  const __refreshUser = useCallback(async () => {
    setLoading(true);
    try {
      const __response = await apiClient.getCurrentUser();
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
export const __useTheme = () => {
  const { theme, setTheme } = useUIStore();

  const __toggleTheme = useCallback(() => {
    setTheme(theme === "light" ? "dark" : "light");
  }, [theme, setTheme]);

  return {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === "dark",
    isLight: theme === "light",
  };
};

export const __useLanguage = () => {
  const { language, setLanguage } = useUIStore();

  const __toggleLanguage = useCallback(() => {
    setLanguage(language === "ar" ? "en" : "ar");
  }, [language, setLanguage]);

  return {
    language,
    setLanguage,
    toggleLanguage,
    isRTL: language === "ar",
    isLTR: language === "en",
  };
};

export const __useSidebar = () => {
  const { sidebarOpen, toggleSidebar, setSidebarOpen } = useUIStore();

  return {
    sidebarOpen,
    toggleSidebar,
    setSidebarOpen,
  };
};

export const __useNotifications = () => {
  const {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
  } = useUIStore();

  const __showNotification = useCallback(
    (_notification: Omit<(typeof notifications)[0], "id" | "createdAt">) => {
      const __newNotification = {
        ...notification,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date(),
      };
      addNotification(newNotification);

      // Auto remove after 5 seconds
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, 5000);
    },
    [addNotification, removeNotification],
  );

  return {
    notifications,
    showNotification,
    removeNotification,
    clearNotifications,
  };
};

export const __useModal = (_modalId: string) => {
  const { modals, openModal, closeModal } = useUIStore();

  const __isOpen = modals[modalId] || false;

  const __open = useCallback(() => openModal(modalId), [modalId, openModal]);
  const __close = useCallback(() => closeModal(modalId), [modalId, closeModal]);
  const __toggle = useCallback(
    () => (isOpen ? close() : open()),
    [isOpen, open, close],
  );

  return {
    isOpen,
    open,
    close,
    toggle,
  };
};

export const __useLoading = (_key: string) => {
  const { loading, setLoading } = useUIStore();

  const __isLoading = loading[key] || false;

  const __startLoading = useCallback(
    () => setLoading(key, true),
    [key, setLoading],
  );
  const __stopLoading = useCallback(
    () => setLoading(key, false),
    [key, setLoading],
  );

  return {
    isLoading,
    startLoading,
    stopLoading,
  };
};

// Data Hooks
export const __usePatients = () => {
  const { patients, setPatients, addPatient, updatePatient, removePatient } =
    useDataStore();

  const __fetchPatients = useCallback(
    async (params?: unknown) => {
      try {
        const __response = await apiClient.getPatients(params);
        if (response.success && response.data) {
          setPatients(response.data);
          return { success: true, data: response.data };
        }
        return { success: false, error: response.error };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "حدث خطأ",
        };
      }
    },
    [setPatients],
  );

  const __createPatient = useCallback(
    async (_patientData: unknown) => {
      try {
        const __response = await apiClient.createPatient(patientData);
        if (response.success && response.data) {
          addPatient(response.data);
          return { success: true, data: response.data };
        }
        return { success: false, error: response.error };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "حدث خطأ",
        };
      }
    },
    [addPatient],
  );

  const __updatePatientData = useCallback(
    async (_id: string, patientData: unknown) => {
      try {
        const __response = await apiClient.updatePatient(id, patientData);
        if (response.success && response.data) {
          updatePatient(id, response.data);
          return { success: true, data: response.data };
        }
        return { success: false, error: response.error };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "حدث خطأ",
        };
      }
    },
    [updatePatient],
  );

  return {
    patients,
    fetchPatients,
    createPatient,
    updatePatient: updatePatientData,
    removePatient,
  };
};

export const __useAppointments = () => {
  const {
    appointments,
    setAppointments,
    addAppointment,
    updateAppointment,
    removeAppointment,
  } = useDataStore();

  const __fetchAppointments = useCallback(
    async (params?: unknown) => {
      try {
        const __response = await apiClient.getAppointments(params);
        if (response.success && response.data) {
          setAppointments(response.data);
          return { success: true, data: response.data };
        }
        return { success: false, error: response.error };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "حدث خطأ",
        };
      }
    },
    [setAppointments],
  );

  const __createAppointment = useCallback(
    async (_appointmentData: unknown) => {
      try {
        const __response = await apiClient.createAppointment(appointmentData);
        if (response.success && response.data) {
          addAppointment(response.data);
          return { success: true, data: response.data };
        }
        return { success: false, error: response.error };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "حدث خطأ",
        };
      }
    },
    [addAppointment],
  );

  const __updateAppointmentData = useCallback(
    async (_id: string, appointmentData: unknown) => {
      try {
        const __response = await apiClient.updateAppointment(
          id,
          appointmentData,
        );
        if (response.success && response.data) {
          updateAppointment(id, response.data);
          return { success: true, data: response.data };
        }
        return { success: false, error: response.error };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "حدث خطأ",
        };
      }
    },
    [updateAppointment],
  );

  return {
    appointments,
    fetchAppointments,
    createAppointment,
    updateAppointment: updateAppointmentData,
    removeAppointment,
  };
};

// Utility Hooks
export const __useDebounce = <T>(_value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const __handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const __useLocalStorage = <T>(_key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const __item = storageUtils.get<T>(key);
      return item !== null ? item : initialValue;
    } catch (error) {
      // // console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const __setValue = useCallback(
    (_value: T | ((_val: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        storageUtils.set(key, valueToStore);
      } catch (error) {
        // // console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue],
  );

  return [storedValue, setValue] as const;
};

export const __useAsync = <T, E = string>(
  asyncFunction: () => Promise<T>,
  immediate = true,
) => {
  const [status, setStatus] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<E | null>(null);

  const __execute = useCallback(async () => {
    setStatus("pending");
    setData(null);
    setError(null);

    try {
      const __result = await asyncFunction();
      setData(result);
      setStatus("success");
      return result;
    } catch (err) {
      setError(err as E);
      setStatus("error");
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

export const __usePagination = <T>(_data: T[], itemsPerPage: number = 10) => {
  const [currentPage, setCurrentPage] = useState(1);

  const __totalPages = Math.ceil(data.length / itemsPerPage);
  const __startIndex = (currentPage - 1) * itemsPerPage;
  const __endIndex = startIndex + itemsPerPage;
  const __currentData = data.slice(startIndex, endIndex);

  const __goToPage = useCallback(
    (_page: number) => {
      setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    },
    [totalPages],
  );

  const __nextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  const __prevPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }, []);

  const __reset = useCallback(() => {
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

export const __useSearch = <T>(
  data: T[],
  searchFields: (keyof T)[],
  searchTerm: string,
) => {
  const __filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;

    return data.filter((item) =>
      searchFields.some((field) => {
        const __value = item[field];
        if (typeof value === "string") {
          return value.toLowerCase().includes(searchTerm.toLowerCase());
        }
        if (typeof value === "number") {
          return value.toString().includes(searchTerm);
        }
        return false;
      }),
    );
  }, [data, searchFields, searchTerm]);

  return filteredData;
};

export const __useSort = <T>(
  data: T[],
  sortField: keyof T | null,
  sortDirection: "asc" | "desc" = "asc",
) => {
  const __sortedData = useMemo(() => {
    if (!sortField) return data;

    return [...data].sort((a, b) => {
      const __aValue = a[sortField];
      const __bValue = b[sortField];

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortField, sortDirection]);

  return sortedData;
};
