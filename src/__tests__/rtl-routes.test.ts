/**
 * RTL Routes Test
 * اختبار مسارات RTL
 * 
 * Tests for RTL-aware routing functionality
 * اختبارات لوظائف التوجيه المتوافقة مع RTL
 */

import { 
  getNavigationItems, 
  isProtectedRoute, 
  isAdminRoute, 
  canAccessRoute,
  getRTLRoute,
  isRTLRoute,
  getRouteDirection,
  getRouteLabel,
  getLocalizedRoutes
} from '@/lib/router';
import { ROUTE_TRANSLATIONS } from '@/constants/routes';

describe('RTL Routes', () => {
  const mockUser = {
    id: '1',
    email: 'test@example.com',
    role: 'user' as const,
  };

  const mockAdminUser = {
    id: '2',
    email: 'admin@example.com',
    role: 'admin' as const,
  };

  describe('getNavigationItems', () => {
    it('should return Arabic navigation items by default', () => {
      const items = getNavigationItems(mockUser);
      expect(items[0].label).toBe('لوحة التحكم');
      expect(items[1].label).toBe('المواعيد');
    });

    it('should return English navigation items when language is en', () => {
      const items = getNavigationItems(mockUser, 'en');
      expect(items[0].label).toBe('Dashboard');
      expect(items[1].label).toBe('Appointments');
    });

    it('should return different items for admin users', () => {
      const items = getNavigationItems(mockAdminUser, 'ar');
      expect(items.some(item => item.label === 'الإدارة')).toBe(true);
    });
  });

  describe('isProtectedRoute', () => {
    it('should identify protected routes correctly', () => {
      expect(isProtectedRoute('/dashboard')).toBe(true);
      expect(isProtectedRoute('/admin/users')).toBe(true);
      expect(isProtectedRoute('/')).toBe(false);
      expect(isProtectedRoute('/login')).toBe(false);
    });

    it('should handle localized routes', () => {
      expect(isProtectedRoute('/ar/dashboard')).toBe(true);
      expect(isProtectedRoute('/en/admin/users')).toBe(true);
    });
  });

  describe('isAdminRoute', () => {
    it('should identify admin routes correctly', () => {
      expect(isAdminRoute('/admin/dashboard')).toBe(true);
      expect(isAdminRoute('/admin/users')).toBe(true);
      expect(isAdminRoute('/dashboard')).toBe(false);
    });

    it('should handle localized admin routes', () => {
      expect(isAdminRoute('/ar/admin/dashboard')).toBe(true);
      expect(isAdminRoute('/en/admin/users')).toBe(true);
    });
  });

  describe('canAccessRoute', () => {
    it('should allow access to public routes without user', () => {
      expect(canAccessRoute(null, '/')).toBe(true);
      expect(canAccessRoute(null, '/login')).toBe(true);
    });

    it('should deny access to protected routes without user', () => {
      expect(canAccessRoute(null, '/dashboard')).toBe(false);
    });

    it('should allow admin access to admin routes', () => {
      expect(canAccessRoute(mockAdminUser, '/admin/dashboard')).toBe(true);
    });

    it('should deny non-admin access to admin routes', () => {
      expect(canAccessRoute(mockUser, '/admin/dashboard')).toBe(false);
    });
  });

  describe('RTL utilities', () => {
    it('should return correct route direction', () => {
      expect(getRouteDirection('ar')).toBe('rtl');
      expect(getRouteDirection('en')).toBe('ltr');
    });

    it('should detect RTL routes', () => {
      expect(isRTLRoute('/ar/dashboard')).toBe(true);
      expect(isRTLRoute('/dashboard')).toBe(false);
    });

    it('should get localized route labels', () => {
      expect(getRouteLabel('HOME', 'ar')).toBe('الرئيسية');
      expect(getRouteLabel('HOME', 'en')).toBe('Home');
    });

    it('should get localized routes', () => {
      const arRoutes = getLocalizedRoutes('ar');
      const enRoutes = getLocalizedRoutes('en');
      
      expect(arRoutes.HOME.label).toBe('الرئيسية');
      expect(enRoutes.HOME.label).toBe('Home');
    });
  });

  describe('Route translations', () => {
    it('should have complete Arabic translations', () => {
      const arTranslations = ROUTE_TRANSLATIONS.ar;
      expect(arTranslations.HOME).toBe('الرئيسية');
      expect(arTranslations.LOGIN).toBe('تسجيل الدخول');
      expect(arTranslations.DASHBOARD).toBe('لوحة التحكم');
    });

    it('should have complete English translations', () => {
      const enTranslations = ROUTE_TRANSLATIONS.en;
      expect(enTranslations.HOME).toBe('Home');
      expect(enTranslations.LOGIN).toBe('Login');
      expect(enTranslations.DASHBOARD).toBe('Dashboard');
    });
  });
});