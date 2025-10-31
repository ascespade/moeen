'use client';

import { useState, useEffect, useCallback } from 'react';

interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  scheduled_at: string;
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  type?: 'in_person' | 'video' | 'phone';
  payment_status?: string;
  created_at: string;
  updated_at?: string;
  patients?: {
    id: string;
    full_name: string;
    phone: string;
  };
  doctors?: {
    id: string;
    speciality: string;
  };
  reason?: string;
  notes?: string;
  location?: string;
  room?: string;
}

interface AppointmentFilters {
  search: string;
  status: string;
  type: string;
  dateFilter: string;
}

interface UseAdminAppointmentsReturn {
  appointments: Appointment[];
  filteredAppointments: Appointment[];
  loading: boolean;
  error: string | null;
  filters: AppointmentFilters;
  updateFilters: (newFilters: Partial<AppointmentFilters>) => void;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  setPage: (page: number) => void;
  refetch: () => Promise<void>;
  createAppointment: (appointmentData: Partial<Appointment>) => Promise<boolean>;
  updateAppointment: (id: string, appointmentData: Partial<Appointment>) => Promise<boolean>;
  deleteAppointment: (id: string) => Promise<boolean>;
  cancelAppointment: (id: string) => Promise<boolean>;
  confirmAppointment: (id: string) => Promise<boolean>;
}

export function useAdminAppointments(): UseAdminAppointmentsReturn {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [filters, setFilters] = useState<AppointmentFilters>({
    search: '',
    status: 'all',
    type: 'all',
    dateFilter: 'all'
  });

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters.status !== 'all') {
        params.append('status', filters.status);
      }
      if (filters.type !== 'all') {
        params.append('type', filters.type);
      }
      if (filters.dateFilter !== 'all') {
        const today = new Date();
        if (filters.dateFilter === 'today') {
          params.append('date', today.toISOString().split('T')[0]);
        } else if (filters.dateFilter === 'tomorrow') {
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          params.append('date', tomorrow.toISOString().split('T')[0]);
        }
      }

      const response = await fetch(`/api/appointments?${params.toString()}`);
      const result = await response.json();

      if (response.ok && result.appointments) {
        setAppointments(result.appointments || []);
      } else {
        setError(result.error || 'فشل في تحميل المواعيد');
      }
    } catch (err) {
      setError('حدث خطأ أثناء تحميل المواعيد');
    } finally {
      setLoading(false);
    }
  }, [filters.status, filters.type, filters.dateFilter]);

  const updateFilters = useCallback((newFilters: Partial<AppointmentFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  }, []);

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = filters.search === '' ||
      appointment.patients?.full_name.toLowerCase().includes(filters.search.toLowerCase()) ||
      appointment.doctors?.speciality.toLowerCase().includes(filters.search.toLowerCase()) ||
      appointment.reason?.toLowerCase().includes(filters.search.toLowerCase());

    const matchesStatus = filters.status === 'all' || appointment.status === filters.status;
    const matchesType = filters.type === 'all' || appointment.type === filters.type;

    let matchesDate = true;
    if (filters.dateFilter !== 'all') {
      const appointmentDate = new Date(appointment.scheduled_at);
      const today = new Date();

      switch (filters.dateFilter) {
        case 'today':
          matchesDate = appointmentDate.toDateString() === today.toDateString();
          break;
        case 'tomorrow':
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          matchesDate = appointmentDate.toDateString() === tomorrow.toDateString();
          break;
        case 'this_week':
          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - today.getDay());
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);
          matchesDate = appointmentDate >= weekStart && appointmentDate <= weekEnd;
          break;
        case 'this_month':
          matchesDate = appointmentDate.getMonth() === today.getMonth() &&
                       appointmentDate.getFullYear() === today.getFullYear();
          break;
      }
    }

    return matchesSearch && matchesStatus && matchesType && matchesDate;
  });

  const pagination = {
    currentPage,
    totalPages: Math.ceil(filteredAppointments.length / itemsPerPage),
    totalItems: filteredAppointments.length,
    itemsPerPage
  };

  const paginatedAppointments = filteredAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const setPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const createAppointment = useCallback(async (appointmentData: Partial<Appointment>): Promise<boolean> => {
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: appointmentData.patient_id,
          doctorId: appointmentData.doctor_id,
          scheduledAt: appointmentData.scheduled_at,
          type: appointmentData.type || 'consultation',
        })
      });

      const result = await response.json();

      if (result.success) {
        await fetchAppointments();
        return true;
      } else {
        setError(result.error || 'فشل في إنشاء الموعد');
        return false;
      }
    } catch (err) {
      setError('حدث خطأ أثناء إنشاء الموعد');
      return false;
    }
  }, [fetchAppointments]);

  const updateAppointment = useCallback(async (id: string, appointmentData: Partial<Appointment>): Promise<boolean> => {
    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentData)
      });

      const result = await response.json();

      if (result.success) {
        await fetchAppointments();
        return true;
      } else {
        setError(result.error || 'فشل في تحديث الموعد');
        return false;
      }
    } catch (err) {
      setError('حدث خطأ أثناء تحديث الموعد');
      return false;
    }
  }, [fetchAppointments]);

  const deleteAppointment = useCallback(async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (result.success) {
        await fetchAppointments();
        return true;
      } else {
        setError(result.error || 'فشل في حذف الموعد');
        return false;
      }
    } catch (err) {
      setError('حدث خطأ أثناء حذف الموعد');
      return false;
    }
  }, [fetchAppointments]);

  const cancelAppointment = useCallback(async (id: string): Promise<boolean> => {
    return updateAppointment(id, { status: 'cancelled' });
  }, [updateAppointment]);

  const confirmAppointment = useCallback(async (id: string): Promise<boolean> => {
    return updateAppointment(id, { status: 'confirmed' });
  }, [updateAppointment]);

  // Initial load
  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  return {
    appointments: paginatedAppointments,
    filteredAppointments,
    loading,
    error,
    filters,
    updateFilters,
    pagination,
    setPage,
    refetch: fetchAppointments,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    cancelAppointment,
    confirmAppointment
  };
}

export default useAdminAppointments;

