// Permission middleware for route protection
import { NextRequest, NextResponse } from 'next/server';
import { PermissionManager, type RoleId } from '@/lib/permissions';

interface RoutePermission {
  path: string;
  permissions: string[];
  roles?: RoleId[];
}

// Define route permissions
const ROUTE_PERMISSIONS: RoutePermission[] = [
  // Admin routes
  { path: '/admin', permissions: ['users:view'], roles: ['admin', 'manager'] },
  { path: '/admin/users', permissions: ['users:view'], roles: ['admin', 'manager'] },
  { path: '/admin/roles', permissions: ['roles:view'], roles: ['admin'] },
  { path: '/admin/audit-logs', permissions: ['security:audit_logs'], roles: ['admin'] },
  { path: '/admin/logs', permissions: ['security:logs'], roles: ['admin'] },
  { path: '/admin/payments', permissions: ['payments:view'], roles: ['admin', 'manager'] },
  { path: '/admin/therapists', permissions: ['doctors:view'], roles: ['admin', 'manager'] },
  
  // Dashboard routes
  { path: '/dashboard', permissions: ['dashboard:view'] },
  { path: '/analytics', permissions: ['analytics:view'] },
  { path: '/reports', permissions: ['reports:view'] },
  
  // Healthcare routes
  { path: '/patients', permissions: ['patients:view'] },
  { path: '/doctors', permissions: ['doctors:view'] },
  { path: '/appointments', permissions: ['appointments:view'] },
  { path: '/sessions', permissions: ['sessions:view'] },
  
  // CRM routes
  { path: '/crm', permissions: ['crm:view'] },
  { path: '/crm/leads', permissions: ['crm:leads'] },
  { path: '/crm/contacts', permissions: ['crm:contacts'] },
  { path: '/crm/deals', permissions: ['crm:deals'] },
  { path: '/crm/activities', permissions: ['crm:activities'] },
  
  // Chatbot routes
  { path: '/chatbot', permissions: ['chatbot:view'] },
  { path: '/chatbot/flows', permissions: ['chatbot:flows'] },
  { path: '/chatbot/templates', permissions: ['chatbot:templates'] },
  { path: '/chatbot/analytics', permissions: ['chatbot:analytics'] },
  { path: '/chatbot/integrations', permissions: ['chatbot:integrations'] },
  
  // Other routes
  { path: '/conversations', permissions: ['conversations:view'] },
  { path: '/payments', permissions: ['payments:view'] },
  { path: '/settings', permissions: ['settings:view'] },
  { path: '/security', permissions: ['security:view'] },
  { path: '/notifications', permissions: ['notifications:view'] },
  { path: '/messages', permissions: ['messages:view'] },
  { path: '/integrations', permissions: ['integrations:view'] },
  { path: '/performance', permissions: ['performance:view'] },
  { path: '/profile', permissions: ['profile:view'] },
  { path: '/dynamic-data', permissions: ['dynamic_data:view'] },
  { path: '/flow', permissions: ['flow:view'] },
  { path: '/review', permissions: ['review:view'] }
];

export function checkRoutePermission(
  pathname: string, 
  userRole: RoleId, 
  userPermissions: string[]
): { allowed: boolean; reason?: string } {
  // Find matching route
  const route = ROUTE_PERMISSIONS.find(route => 
    pathname === route.path || pathname.startsWith(route.path + '/')
  );

  if (!route) {
    return { allowed: true }; // Allow if no specific permission required
  }

  // Check role restrictions
  if (route.roles && !route.roles.includes(userRole)) {
    return { allowed: false, reason: 'Insufficient role' };
  }

  // Check permissions
  const hasRequiredPermissions = PermissionManager.hasAnyPermission(
    userPermissions, 
    route.permissions
  );

  if (!hasRequiredPermissions) {
    return { allowed: false, reason: 'Missing required permissions' };
  }

  return { allowed: true };
}

export function createPermissionMiddleware() {
  return function permissionMiddleware(request: NextRequest) {
    // This would be called from the main middleware
    // Implementation depends on your auth system
    return NextResponse.next();
  };
}