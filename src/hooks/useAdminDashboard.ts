'use client';

import { useState, useEffect, useCallback } from 'react';

interface DashboardStats {
  totalPatients: number;
  activePatients: number;
  blockedPatients: number;
  totalAppointments: number;
  completedAppointments: number;
  pendingAppointments: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalClaims: number;
  approvedClaims: number;
  pendingClaims: number;
  rejectedClaims: number;
  totalStaff: number;
  activeStaff: number;
  onDutyStaff: number;
  totalSessions: number;
  completedSessions: number;
  upcomingSessions: number;
}

interface RecentActivity {
  id: string;
  type: 'appointment' | 'claim' | 'patient' | 'staff' | 'payment';
  title: string;
  description: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error' | 'info';
  user?: string;
}

interface StaffWorkHours {
  id: string;
  name: string;
  email: string;
  position: string;
  department: string;
  totalHours: number;
  todayHours: number;
  thisWeekHours: number;
  thisMonthHours: number;
  isOnDuty: boolean;
  lastCheckIn?: string;
  lastCheckOut?: string;
  attendanceStatus: string;
}

interface UseAdminDashboardReturn {
  stats: DashboardStats;
  activities: RecentActivity[];
  staffWorkHours: StaffWorkHours[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  refetchActivities: () => Promise<void>;
  refetchStaffHours: () => Promise<void>;
}

const defaultStats: DashboardStats = {
  totalPatients: 0,
  activePatients: 0,
  blockedPatients: 0,
  totalAppointments: 0,
  completedAppointments: 0,
  pendingAppointments: 0,
  totalRevenue: 0,
  monthlyRevenue: 0,
  totalClaims: 0,
  approvedClaims: 0,
  pendingClaims: 0,
  rejectedClaims: 0,
  totalStaff: 0,
  activeStaff: 0,
  onDutyStaff: 0,
  totalSessions: 0,
  completedSessions: 0,
  upcomingSessions: 0,
};

export function useAdminDashboard(period: 'today' | 'week' | 'month' | 'year' = 'month'): UseAdminDashboardReturn {
  const [stats, setStats] = useState<DashboardStats>(defaultStats);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [staffWorkHours, setStaffWorkHours] = useState<StaffWorkHours[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch(`/api/dashboard/statistics?period=${period}`);
      const result = await response.json();
      
      if (result.success && result.data) {
        setStats({
          totalPatients: result.data.total_patients || 0,
          activePatients: result.data.active_patients || 0,
          blockedPatients: result.data.blocked_patients || 0,
          totalAppointments: result.data.total_appointments || 0,
          completedAppointments: result.data.completed_appointments || 0,
          pendingAppointments: result.data.pending_appointments || 0,
          totalRevenue: result.data.total_revenue || 0,
          monthlyRevenue: result.data.monthly_revenue || 0,
          totalClaims: result.data.total_claims || 0,
          approvedClaims: result.data.approved_claims || 0,
          pendingClaims: result.data.pending_claims || 0,
          rejectedClaims: result.data.rejected_claims || 0,
          totalStaff: result.data.total_staff || 0,
          activeStaff: result.data.active_staff || 0,
          onDutyStaff: result.data.on_duty_staff || 0,
          totalSessions: result.data.total_sessions || 0,
          completedSessions: result.data.completed_sessions || 0,
          upcomingSessions: result.data.upcoming_sessions || 0,
        });
      } else {
        setError('فشل في تحميل الإحصائيات');
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('حدث خطأ أثناء تحميل الإحصائيات');
    }
  }, [period]);

  const fetchActivities = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/recent-activities?limit=10');
      const result = await response.json();
      
      if (result.success) {
        setActivities(result.data || []);
      } else {
        console.error('Failed to fetch activities:', result.error);
      }
    } catch (err) {
      console.error('Error fetching activities:', err);
    }
  }, []);

  const fetchStaffHours = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/staff-work-hours?limit=10');
      const result = await response.json();
      
      if (result.success) {
        setStaffWorkHours(result.data || []);
      } else {
        console.error('Failed to fetch staff hours:', result.error);
      }
    } catch (err) {
      console.error('Error fetching staff hours:', err);
    }
  }, []);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      await Promise.all([
        fetchStats(),
        fetchActivities(), 
        fetchStaffHours()
      ]);
    } finally {
      setLoading(false);
    }
  }, [fetchStats, fetchActivities, fetchStaffHours]);

  // Initial load
  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    stats,
    activities,
    staffWorkHours,
    loading,
    error,
    refetch,
    refetchActivities: fetchActivities,
    refetchStaffHours: fetchStaffHours
  };
}

export default useAdminDashboard;
