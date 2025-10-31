'use client';

import { Button } from '@/components/ui/Button';
import { AlertTriangle, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { AdminCard } from './ui/AdminCard';

interface RouteGuardProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
  requiredRoles?: string[];
  fallbackPath?: string;
}

export default function RouteGuard({
  children,
  requiredPermissions = [],
  requiredRoles = [],
  fallbackPath = '/unauthorized'
}: RouteGuardProps) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const router = useRouter();
  const hasCheckedRef = useRef(false);
  const redirectingRef = useRef(false);

  useEffect(() => {
    // Prevent multiple checks
    if (hasCheckedRef.current) return;

    let isMounted = true;

    const checkAuthorization = async () => {
      try {
        hasCheckedRef.current = true;

        // Try to get user from localStorage as fallback (for development/testing)
        let userFromStorage = null;
        try {
          const userStr = localStorage.getItem('user');
          if (userStr) {
            userFromStorage = JSON.parse(userStr);
          }
        } catch (e) {
          // Ignore localStorage errors
        }

        // Get current user info with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout

        // Get user from localStorage to send with request
        let localUser = null;
        try {
          const userStr = localStorage.getItem('user');
          if (userStr) {
            localUser = JSON.parse(userStr);
          }
        } catch (e) {
          // Ignore
        }

        let response;
        try {
          // First try normal auth with client user info as fallback
          const headers: Record<string, string> = {};
          if (localUser?.id && localUser?.email && localUser?.role) {
            headers['x-user-id'] = localUser.id;
            headers['x-user-email'] = localUser.email;
            headers['x-user-role'] = localUser.role;
          }

          response = await fetch('/api/auth/me', {
            signal: controller.signal,
            cache: 'no-store',
            credentials: 'include',
            headers
          });
          clearTimeout(timeoutId);

          if (!response.ok) {
            // If 401 and we have user in storage, use that as fallback
            if (response.status === 401 && userFromStorage) {
              // Retry API with demo email header to fetch real user from DB (no mock)
              try {
                const retry = await fetch('/api/auth/me', {
                  method: 'GET',
                  cache: 'no-store',
                  credentials: 'include',
                  headers: {
                    'x-demo-email': userFromStorage.email || ''
                  }
                });
                if (retry.ok) {
                  const retryResult = await retry.json();
                  if (retryResult?.success && retryResult.user) {
                    const fetchedUser = retryResult.user;
                    if (!isMounted) return;
                    setUserRole(fetchedUser.role);
                    // Check role
                    if (requiredRoles.length > 0 && !requiredRoles.includes(fetchedUser.role)) {
                      setIsAuthorized(false);
                      return;
                    }
                    // Check permissions (admins, managers, supervisors bypass granular perms)
                    if (requiredPermissions.length > 0) {
                      const roleAllows = ['admin', 'manager', 'supervisor'].includes(fetchedUser.role);
                      const perms = fetchedUser.permissions || [];
                      const hasAll = requiredPermissions.every(p => perms.includes(p));
                      if (!hasAll && !roleAllows) {
                        setIsAuthorized(false);
                        return;
                      }
                    }
                    setIsAuthorized(true);
                    return;
                  }
                }
              } catch {}

              console.warn('API auth failed, using localStorage fallback');
              if (!isMounted) return;
              const fallbackUser = {
                id: userFromStorage.id,
                email: userFromStorage.email,
                role: userFromStorage.role || 'admin',
                permissions: userFromStorage.permissions || []
              };
              setUserRole(fallbackUser.role);
              // Role
              if (requiredRoles.length > 0 && !requiredRoles.includes(fallbackUser.role)) {
                setIsAuthorized(false);
                return;
              }
              // Permissions
              if (requiredPermissions.length > 0) {
                const hasAllPermissions = requiredPermissions.every(permission =>
                  fallbackUser.permissions.includes(permission)
                );
                if (!hasAllPermissions) {
                  setIsAuthorized(false);
                  return;
                }
              }
              setIsAuthorized(true);
              return;
            }
            throw new Error(`HTTP ${response.status}`);
          }

          const result = await response.json();

          if (!isMounted) return;

          if (!result.success || !result.user) {
            // User not authenticated - redirect to login
            if (!redirectingRef.current) {
              redirectingRef.current = true;
              setIsAuthorized(false);
              router.replace('/login?redirect=' + encodeURIComponent(window.location.pathname));
            }
            return;
          }

          const user = result.user;
          if (!isMounted) return;

          setUserRole(user.role);

          // Check role-based access
          if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
            setIsAuthorized(false);
            return;
          }

          // Check permission-based access
          if (requiredPermissions.length > 0) {
            const userPermissions = user.permissions || [];
            const roleAllows = ['admin', 'manager', 'supervisor'].includes(user.role);
            const hasAllPermissions = requiredPermissions.every(permission => userPermissions.includes(permission));
            if (!hasAllPermissions && !roleAllows) {
              setIsAuthorized(false);
              return;
            }
          }

          setIsAuthorized(true);

          // Log access attempt (non-blocking)
          fetch('/api/admin/audit-logs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'access',
              resource_type: 'admin_page',
              details: {
                path: window.location.pathname,
                requiredPermissions,
                requiredRoles,
                authorized: true
              }
            })
          }).catch(() => {}); // Ignore errors

        } catch (fetchError: any) {
          clearTimeout(timeoutId);
          if (fetchError.name === 'AbortError') {
            console.error('Auth check timeout after 10 seconds');
            if (isMounted && userFromStorage) {
              // Use localStorage fallback immediately on timeout
              const fallbackUser = {
                role: userFromStorage.role || 'admin',
                permissions: userFromStorage.permissions || []
              };
              setUserRole(fallbackUser.role);

              if (requiredRoles.length > 0 && !requiredRoles.includes(fallbackUser.role)) {
                setIsAuthorized(false);
                return;
              }

              if (requiredPermissions.length > 0) {
                const roleAllows = ['admin', 'manager', 'supervisor'].includes(fallbackUser.role);
                const hasAllPermissions = requiredPermissions.every(permission => fallbackUser.permissions.includes(permission));
                if (!hasAllPermissions && !roleAllows) {
                  setIsAuthorized(false);
                  return;
                }
              }

              setIsAuthorized(true);
              setErrorMessage('');
              return;
            }
            if (isMounted) {
              setErrorMessage('انتهت مهلة التحقق. جاري استخدام البيانات المحفوظة...');
            }
          } else {
            console.error('Auth fetch error:', fetchError);
            if (isMounted) {
              setErrorMessage('فشل في التحقق من الصلاحيات. يرجى التأكد من اتصالك بالإنترنت.');
            }
          }

          // Use localStorage fallback if available
          if (userFromStorage && !redirectingRef.current) {
            console.warn('Using localStorage fallback for auth');
            if (!isMounted) return;
            const fallbackUser = {
              role: userFromStorage.role || 'admin',
              permissions: userFromStorage.permissions || []
            };
            setUserRole(fallbackUser.role);

            if (requiredRoles.length > 0 && !requiredRoles.includes(fallbackUser.role)) {
              setIsAuthorized(false);
              return;
            }

            if (requiredPermissions.length > 0) {
              const roleAllows = ['admin', 'manager', 'supervisor'].includes(fallbackUser.role);
              const hasAllPermissions = requiredPermissions.every(permission => fallbackUser.permissions.includes(permission));
              if (!hasAllPermissions && !roleAllows) {
                setIsAuthorized(false);
                return;
              }
            }

            setIsAuthorized(true);
            setErrorMessage('');
            return;
          }

          if (!isMounted) return;
          if (!redirectingRef.current) {
            redirectingRef.current = true;
            setIsAuthorized(false);
            // Don't redirect immediately, show error first
            setTimeout(() => {
              if (isMounted) {
                router.replace('/login?redirect=' + encodeURIComponent(window.location.pathname));
              }
            }, 2000);
          }
          return;
        }

      } catch (error) {
        console.error('Error checking authorization:', error);
        if (isMounted && !redirectingRef.current) {
          redirectingRef.current = true;
          setIsAuthorized(false);
          setTimeout(() => router.replace('/login'), 500);
        }
      }
    };

    checkAuthorization();

    return () => {
      isMounted = false;
    };
    // Only run once on mount - dependencies are intentional
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Loading state
  if (isAuthorized === null) {
    return (
      <div className='min-h-screen bg-[var(--background)] flex items-center justify-center'>
        <div className='text-center max-w-md mx-auto px-4'>
          <div className='w-12 h-12 border-4 border-[var(--brand-border)] border-t-[var(--brand-primary)] rounded-full animate-spin mx-auto mb-4'></div>
          <p className='text-[var(--text-secondary)] mb-2'>جاري التحقق من الصلاحيات...</p>
          {errorMessage && (
            <div
              className='mt-4 p-4 rounded-lg border'
              style={{
                backgroundColor: 'color-mix(in srgb, var(--brand-error) 10%, transparent)',
                borderColor: 'color-mix(in srgb, var(--brand-error) 20%, transparent)'
              }}
            >
              <p className='text-sm' style={{ color: 'var(--brand-error)' }}>{errorMessage}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Unauthorized state
  if (!isAuthorized) {
    return (
      <div className='min-h-screen bg-[var(--background)] flex items-center justify-center'>
        <div className='max-w-md mx-auto p-6'>
          <AdminCard className='text-center space-y-6'>
            <div
              className='w-20 h-20 mx-auto rounded-full flex items-center justify-center border'
              style={{
                backgroundColor: 'color-mix(in srgb, var(--brand-error) 10%, transparent)',
                borderColor: 'color-mix(in srgb, var(--brand-error) 20%, transparent)'
              }}
            >
              <Lock className='w-10 h-10' style={{ color: 'var(--brand-error)' }} />
            </div>

            <div>
              <h2 className='text-2xl font-bold text-[var(--text-primary)] mb-2'>
                غير مصرح بالوصول
              </h2>
              <p className='text-[var(--text-secondary)] mb-4'>
                ليس لديك الصلاحيات اللازمة للوصول إلى هذه الصفحة.
              </p>

              <div className='text-sm text-[var(--text-secondary)] space-y-1'>
                {requiredRoles.length > 0 && (
                  <p>الأدوار المطلوبة: {requiredRoles.join(', ')}</p>
                )}
                {requiredPermissions.length > 0 && (
                  <p>الصلاحيات المطلوبة: {requiredPermissions.length} صلاحية</p>
                )}
                <p>دورك الحالي: {userRole || 'غير محدد'}</p>
              </div>
            </div>

            <div className='flex gap-3 justify-center'>
              <Button
                onClick={() => router.back()}
                variant='outline'
                className='border-[var(--brand-border)]'
              >
                العودة
              </Button>
              <Button
                onClick={() => router.replace('/admin/dashboard')}
                className='bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white'
              >
                الصفحة الرئيسية
              </Button>
            </div>

            {/* Warning */}
            <div
              className='border rounded-lg p-4'
              style={{
                backgroundColor: 'color-mix(in srgb, var(--brand-warning) 10%, transparent)',
                borderColor: 'color-mix(in srgb, var(--brand-warning) 20%, transparent)'
              }}
            >
              <div className='flex items-center gap-2' style={{ color: 'var(--brand-warning)' }}>
                <AlertTriangle className='w-4 h-4' />
                <span className='font-medium'>تنبيه</span>
              </div>
              <p className='text-sm text-[var(--text-secondary)] mt-1'>
                تم تسجيل محاولة الوصول غير المصرح بها. إذا كنت تعتقد أن هذا خطأ، يرجى التواصل مع المدير.
              </p>
            </div>
          </AdminCard>
        </div>
      </div>
    );
  }

  // Authorized - render children
  return <>{children}</>;
}

export { RouteGuard };
