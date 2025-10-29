'use client';

import { useState, useEffect, useCallback } from 'react';

interface Patient {
  id: string;
  full_name: string;
  email?: string;
  phone: string;
  national_id?: string;
  date_of_birth?: string;
  gender: 'male' | 'female';
  status: 'active' | 'inactive' | 'pending' | 'blocked';
  last_visit?: string;
  created_at: string;
  updated_at: string;
  address?: string;
  emergency_contact?: string;
  medical_history?: string[];
  allergies?: string[];
  current_medications?: string[];
  insurance_provider?: string;
  insurance_number?: string;
  blood_type?: string;
  height?: number;
  weight?: number;
  guardian_name?: string;
  guardian_phone?: string;
}

interface PatientFilters {
  search: string;
  status: string;
  gender: string;
  ageRange: string;
  insuranceProvider: string;
  lastVisit: string;
}

interface UseAdminPatientsReturn {
  patients: Patient[];
  filteredPatients: Patient[];
  loading: boolean;
  error: string | null;
  filters: PatientFilters;
  updateFilters: (newFilters: Partial<PatientFilters>) => void;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  setPage: (page: number) => void;
  refetch: () => Promise<void>;
  createPatient: (patientData: Partial<Patient>) => Promise<boolean>;
  updatePatient: (id: string, patientData: Partial<Patient>) => Promise<boolean>;
  deletePatient: (id: string) => Promise<boolean>;
  activatePatient: (id: string) => Promise<boolean>;
  blockPatient: (id: string) => Promise<boolean>;
  bulkAction: (patientIds: string[], action: 'activate' | 'block' | 'delete') => Promise<boolean>;
  getPatientStats: () => Promise<any>;
}

export function useAdminPatients(): UseAdminPatientsReturn {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  const [filters, setFilters] = useState<PatientFilters>({
    search: '',
    status: 'all',
    gender: 'all',
    ageRange: 'all',
    insuranceProvider: 'all',
    lastVisit: 'all'
  });

  const fetchPatients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        ...filters
      });

      const response = await fetch(`/api/patients?${params}`);
      const result = await response.json();
      
      if (result.success) {
        setPatients(result.data || []);
      } else {
        setError(result.error || 'فشل في تحميل المرضى');
      }
    } catch (err) {
      console.error('Error fetching patients:', err);
      setError('حدث خطأ أثناء تحميل المرضى');
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters]);

  const updateFilters = useCallback((newFilters: Partial<PatientFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  }, []);

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = filters.search === '' || 
      patient.full_name.toLowerCase().includes(filters.search.toLowerCase()) ||
      patient.email?.toLowerCase().includes(filters.search.toLowerCase()) ||
      patient.phone.includes(filters.search) ||
      patient.national_id?.includes(filters.search);
    
    const matchesStatus = filters.status === 'all' || patient.status === filters.status;
    const matchesGender = filters.gender === 'all' || patient.gender === filters.gender;
    
    // Age range filtering
    const matchesAge = filters.ageRange === 'all' || checkAgeRange(patient.date_of_birth, filters.ageRange);
    
    const matchesInsurance = filters.insuranceProvider === 'all' || 
      patient.insurance_provider === filters.insuranceProvider;

    return matchesSearch && matchesStatus && matchesGender && matchesAge && matchesInsurance;
  });

  const pagination = {
    currentPage,
    totalPages: Math.ceil(filteredPatients.length / itemsPerPage),
    totalItems: filteredPatients.length,
    itemsPerPage
  };

  const setPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const createPatient = useCallback(async (patientData: Partial<Patient>): Promise<boolean> => {
    try {
      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patientData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        await fetchPatients();
        return true;
      } else {
        setError(result.error || 'فشل في إنشاء المريض');
        return false;
      }
    } catch (err) {
      console.error('Error creating patient:', err);
      setError('حدث خطأ أثناء إنشاء المريض');
      return false;
    }
  }, [fetchPatients]);

  const updatePatient = useCallback(async (id: string, patientData: Partial<Patient>): Promise<boolean> => {
    try {
      const response = await fetch(`/api/patients/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patientData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        await fetchPatients();
        return true;
      } else {
        setError(result.error || 'فشل في تحديث المريض');
        return false;
      }
    } catch (err) {
      console.error('Error updating patient:', err);
      setError('حدث خطأ أثناء تحديث المريض');
      return false;
    }
  }, [fetchPatients]);

  const deletePatient = useCallback(async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/patients/${id}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      
      if (result.success) {
        await fetchPatients();
        return true;
      } else {
        setError(result.error || 'فشل في حذف المريض');
        return false;
      }
    } catch (err) {
      console.error('Error deleting patient:', err);
      setError('حدث خطأ أثناء حذف المريض');
      return false;
    }
  }, [fetchPatients]);

  const activatePatient = useCallback(async (id: string): Promise<boolean> => {
    return updatePatient(id, { status: 'active' });
  }, [updatePatient]);

  const blockPatient = useCallback(async (id: string): Promise<boolean> => {
    return updatePatient(id, { status: 'blocked' });
  }, [updatePatient]);

  const bulkAction = useCallback(async (patientIds: string[], action: 'activate' | 'block' | 'delete'): Promise<boolean> => {
    try {
      const response = await fetch('/api/patients/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientIds, action })
      });
      
      const result = await response.json();
      
      if (result.success) {
        await fetchPatients();
        return true;
      } else {
        setError(result.error || `فشل في تنفيذ العملية ${action}`);
        return false;
      }
    } catch (err) {
      console.error('Error in bulk action:', err);
      setError('حدث خطأ أثناء تنفيذ العملية');
      return false;
    }
  }, [fetchPatients]);

  const getPatientStats = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/patient-stats');
      const result = await response.json();
      return result.success ? result.data : null;
    } catch (err) {
      console.error('Error fetching patient stats:', err);
      return null;
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  return {
    patients,
    filteredPatients,
    loading,
    error,
    filters,
    updateFilters,
    pagination,
    setPage,
    refetch: fetchPatients,
    createPatient,
    updatePatient,
    deletePatient,
    activatePatient,
    blockPatient,
    bulkAction,
    getPatientStats
  };
}

// Helper function for age range filtering
function checkAgeRange(dateOfBirth: string | undefined, ageRange: string): boolean {
  if (!dateOfBirth || ageRange === 'all') return true;
  
  const age = calculateAge(dateOfBirth);
  
  switch (ageRange) {
    case 'children':
      return age < 18;
    case 'adults':
      return age >= 18 && age < 65;
    case 'seniors':
      return age >= 65;
    default:
      return true;
  }
}

function calculateAge(dateOfBirth: string): number {
  const birth = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

export default useAdminPatients;
