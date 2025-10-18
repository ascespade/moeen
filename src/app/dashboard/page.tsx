import React from "react";

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getDefaultRouteForUser } from '@/lib/router';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function DashboardPage() {
  const router = useRouter();
  const user, isLoading = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // Redirect to login if not authenticated
        router.push('/login');
        return;
      }

      // Redirect to role-specific dashboard
      const defaultRoute = getDefaultRouteForUser(user);
      router.push(defaultRoute);
    }
  }, [user, isLoading, router]);

  // Show loading while determining redirect
  return (
    <div className="min-h-screen bg-surface dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          جاري تحميل لوحة التحكم...
        </p>
      </div>
    </div>
  );
}

