'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Get user role from localStorage or session
    const userStr = localStorage.getItem('user');
    let role = 'agent'; // default for agent role (doctor/patient/staff)

    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        role = user.role || 'agent';
      } catch (e) {
        console.error('Error parsing user:', e);
      }
    }

    // Redirect based on role
    const roleRoutes: Record<string, string> = {
      admin: '/admin/dashboard',
      doctor: '/dashboard/doctor',
      patient: '/dashboard/patient',
      staff: '/dashboard/staff',
      supervisor: '/dashboard/supervisor',
      manager: '/admin/dashboard',
      nurse: '/dashboard/staff',
      agent: '/dashboard', // Agent role stays on main dashboard
    };

    const targetRoute = roleRoutes[role] || '/dashboard';
    
    // Only redirect if not already on target route
    if (window.location.pathname !== targetRoute) {
      router.replace(targetRoute);
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-[var(--brand-primary)] mx-auto"></div>
        <p className="text-[var(--text-secondary)]">جاري التوجيه...</p>
      </div>
    </div>
  );
}

