'use client';

import { useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  full_name: string;
  phone?: string;
  avatar?: string;
  role: string;
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  isVerified: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  department?: string;
  position?: string;
  permissions: string[];
}

interface UserFilters {
  search: string;
  role: string;
  status: string;
  department: string;
}

interface UseAdminUsersReturn {
  users: User[];
  filteredUsers: User[];
  loading: boolean;
  error: string | null;
  filters: UserFilters;
  updateFilters: (newFilters: Partial<UserFilters>) => void;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  setPage: (page: number) => void;
  refetch: () => Promise<void>;
  createUser: (userData: Partial<User>) => Promise<boolean>;
  updateUser: (id: string, userData: Partial<User>) => Promise<boolean>;
  deleteUser: (id: string) => Promise<boolean>;
  activateUser: (id: string) => Promise<boolean>;
  deactivateUser: (id: string) => Promise<boolean>;
  bulkAction: (userIds: string[], action: 'activate' | 'deactivate' | 'delete') => Promise<boolean>;
}

export function useAdminUsers(): UseAdminUsersReturn {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const [filters, setFilters] = useState<UserFilters>({
    search: '',
    role: 'all',
    status: 'all',
    department: 'all'
  });

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        ...filters
      });

      const response = await fetch(`/api/admin/users?${params}`);
      const result = await response.json();
      
      if (result.success) {
        setUsers(result.data || []);
      } else {
        setError(result.error || 'فشل في تحميل المستخدمين');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('حدث خطأ أثناء تحميل المستخدمين');
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters]);

  const updateFilters = useCallback((newFilters: Partial<UserFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset to first page when filtering
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = filters.search === '' || 
      user.full_name.toLowerCase().includes(filters.search.toLowerCase()) ||
      user.email.toLowerCase().includes(filters.search.toLowerCase()) ||
      user.username.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesRole = filters.role === 'all' || user.role === filters.role;
    const matchesStatus = filters.status === 'all' || user.status === filters.status;
    const matchesDepartment = filters.department === 'all' || user.department === filters.department;

    return matchesSearch && matchesRole && matchesStatus && matchesDepartment;
  });

  const pagination = {
    currentPage,
    totalPages: Math.ceil(filteredUsers.length / itemsPerPage),
    totalItems: filteredUsers.length,
    itemsPerPage
  };

  const setPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const createUser = useCallback(async (userData: Partial<User>): Promise<boolean> => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        await fetchUsers(); // Refresh data
        return true;
      } else {
        setError(result.error || 'فشل في إنشاء المستخدم');
        return false;
      }
    } catch (err) {
      console.error('Error creating user:', err);
      setError('حدث خطأ أثناء إنشاء المستخدم');
      return false;
    }
  }, [fetchUsers]);

  const updateUser = useCallback(async (id: string, userData: Partial<User>): Promise<boolean> => {
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        await fetchUsers(); // Refresh data
        return true;
      } else {
        setError(result.error || 'فشل في تحديث المستخدم');
        return false;
      }
    } catch (err) {
      console.error('Error updating user:', err);
      setError('حدث خطأ أثناء تحديث المستخدم');
      return false;
    }
  }, [fetchUsers]);

  const deleteUser = useCallback(async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      
      if (result.success) {
        await fetchUsers(); // Refresh data
        return true;
      } else {
        setError(result.error || 'فشل في حذف المستخدم');
        return false;
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('حدث خطأ أثناء حذف المستخدم');
      return false;
    }
  }, [fetchUsers]);

  const activateUser = useCallback(async (id: string): Promise<boolean> => {
    return updateUser(id, { status: 'active' });
  }, [updateUser]);

  const deactivateUser = useCallback(async (id: string): Promise<boolean> => {
    return updateUser(id, { status: 'inactive' });
  }, [updateUser]);

  const bulkAction = useCallback(async (userIds: string[], action: 'activate' | 'deactivate' | 'delete'): Promise<boolean> => {
    try {
      const response = await fetch('/api/admin/users/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userIds, action })
      });
      
      const result = await response.json();
      
      if (result.success) {
        await fetchUsers(); // Refresh data
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
  }, [fetchUsers]);

  // Initial load and refetch when dependencies change
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    filteredUsers,
    loading,
    error,
    filters,
    updateFilters,
    pagination,
    setPage,
    refetch: fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    activateUser,
    deactivateUser,
    bulkAction
  };
}

export default useAdminUsers;
