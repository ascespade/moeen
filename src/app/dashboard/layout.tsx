'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from '@/components/shell/Sidebar';
import Header from '@/components/shell/Header';
import { getBrowserSupabase } from '@/lib/supabaseClient';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = getBrowserSupabase();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          setUser(JSON.parse(userStr));
        }
        // Also check Supabase session
        const { data } = await supabase.auth.getSession();
        if (data?.session) {
          const { data: userData } = await supabase
            .from('users')
            .select('id, email, role, name')
            .eq('id', data.session.user.id)
            .maybeSingle();
          if (userData) {
            setUser({
              id: userData.id,
              email: userData.email,
              role: userData.role,
              name: userData.name,
            });
          }
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [supabase]);

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-[var(--background)]'>
        <div className='text-center'>
          <div className='mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[var(--brand-border)] border-t-[var(--brand-primary)] mx-auto'></div>
          <p className='text-[var(--text-secondary)]'>جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='grid min-h-dvh bg-[var(--background)] text-[var(--text-primary)] lg:grid-cols-[16rem_1fr]'>
      <Sidebar />
      <div className='grid grid-rows-[auto_1fr]'>
        <Header />
        <main className='p-4 md:p-6 lg:p-8 overflow-auto'>{children}</main>
      </div>
    </div>
  );
}




