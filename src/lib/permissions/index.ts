// Comprehensive Permission System
// Role-based access control with granular permissions

import { logger } from '@/lib/monitoring/logger';

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
  resource: string;
  action: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  level: number; // Higher number = more privileges
}

export interface UserPermissions {
  userId: string;
  role: string;
  permissions: string[];
  customPermissions?: string[];
  restrictions?: string[];
}

// Re-export PERMISSIONS from constants (client-safe)
export { PERMISSIONS } from './constants';

// Define all possible permissions (moved to constants.ts for client safety)
// Keeping this for backward compatibility - now imports from constants
/* OLD PERMISSIONS - moved to constants.ts
export const PERMISSIONS = {
  // Dashboard & Analytics
  'dashboard:view': {
    id: 'dashboard:view',
    name: 'View Dashboard',
    description: 'Access to main dashboard',
    category: 'dashboard',
    resource: 'dashboard',
    action: 'view',
  },
  'analytics:view': {
    id: 'analytics:view',
    name: 'View Analytics',
    description: 'Access to analytics and reports',
    category: 'analytics',
    resource: 'analytics',
    action: 'view',
  },
  'reports:view': {
    id: 'reports:view',
    name: 'View Reports',
    description: 'Access to system reports',
    category: 'reports',
    resource: 'reports',
    action: 'view',
  },
  'reports:export': {
    id: 'reports:export',
    name: 'Export Reports',
    description: 'Export reports to various formats',
    category: 'reports',
    resource: 'reports',
    action: 'export',
  },

  // User Management
  'users:view': {
    id: 'users:view',
    name: 'View Users',
    description: 'View user list and details',
    category: 'users',
    resource: 'users',
    action: 'view',
  },
  'users:create': {
    id: 'users:create',
    name: 'Create Users',
    description: 'Create new users',
    category: 'users',
    resource: 'users',
    action: 'create',
  },
  'users:edit': {
    id: 'users:edit',
    name: 'Edit Users',
    description: 'Edit user information',
    category: 'users',
    resource: 'users',
    action: 'edit',
  },
  'users:delete': {
    id: 'users:delete',
    name: 'Delete Users',
    description: 'Delete users from system',
    category: 'users',
    resource: 'users',
    action: 'delete',
  },
  'users:activate': {
    id: 'users:activate',
    name: 'Activate Users',
    description: 'Activate/deactivate users',
    category: 'users',
    resource: 'users',
    action: 'activate',
  },

  // Role Management
  'roles:view': {
    id: 'roles:view',
    name: 'View Roles',
    description: 'View roles and permissions',
    category: 'roles',
    resource: 'roles',
    action: 'view',
  },
  'roles:create': {
    id: 'roles:create',
    name: 'Create Roles',
    description: 'Create new roles',
    category: 'roles',
    resource: 'roles',
    action: 'create',
  },
  'roles:edit': {
    id: 'roles:edit',
    name: 'Edit Roles',
    description: 'Edit role permissions',
    category: 'roles',
    resource: 'roles',
    action: 'edit',
  },
  'roles:delete': {
    id: 'roles:delete',
    name: 'Delete Roles',
    description: 'Delete roles from system',
    category: 'roles',
    resource: 'roles',
    action: 'delete',
  },

  // Patient Management
  'patients:view': {
    id: 'patients:view',
    name: 'View Patients',
    description: 'View patient list and details',
    category: 'patients',
    resource: 'patients',
    action: 'view',
  },
  'patients:create': {
    id: 'patients:create',
    name: 'Create Patients',
    description: 'Create new patient records',
    category: 'patients',
    resource: 'patients',
    action: 'create',
  },
  'patients:edit': {
    id: 'patients:edit',
    name: 'Edit Patients',
    description: 'Edit patient information',
    category: 'patients',
    resource: 'patients',
    action: 'edit',
  },
  'patients:delete': {
    id: 'patients:delete',
    name: 'Delete Patients',
    description: 'Delete patient records',
    category: 'patients',
    resource: 'patients',
    action: 'delete',
  },
  'patients:medical_records': {
    id: 'patients:medical_records',
    name: 'Access Medical Records',
    description: 'View and edit medical records',
    category: 'patients',
    resource: 'medical_records',
    action: 'view',
  },

  // Doctor Management
  'doctors:view': {
    id: 'doctors:view',
    name: 'View Doctors',
    description: 'View doctor list and details',
    category: 'doctors',
    resource: 'doctors',
    action: 'view',
  },
  'doctors:create': {
    id: 'doctors:create',
    name: 'Create Doctors',
    description: 'Create new doctor profiles',
    category: 'doctors',
    resource: 'doctors',
    action: 'create',
  },
  'doctors:edit': {
    id: 'doctors:edit',
    name: 'Edit Doctors',
    description: 'Edit doctor information',
    category: 'doctors',
    resource: 'doctors',
    action: 'edit',
  },
  'doctors:delete': {
    id: 'doctors:delete',
    name: 'Delete Doctors',
    description: 'Delete doctor profiles',
    category: 'doctors',
    resource: 'doctors',
    action: 'delete',
  },
  'doctors:schedules': {
    id: 'doctors:schedules',
    name: 'Manage Schedules',
    description: 'Manage doctor schedules',
    category: 'doctors',
    resource: 'schedules',
    action: 'manage',
  },

  // Appointments
  'appointments:view': {
    id: 'appointments:view',
    name: 'View Appointments',
    description: 'View appointment list and details',
    category: 'appointments',
    resource: 'appointments',
    action: 'view',
  },
  'appointments:create': {
    id: 'appointments:create',
    name: 'Create Appointments',
    description: 'Create new appointments',
    category: 'appointments',
    resource: 'appointments',
    action: 'create',
  },
  'appointments:edit': {
    id: 'appointments:edit',
    name: 'Edit Appointments',
    description: 'Edit appointment details',
    category: 'appointments',
    resource: 'appointments',
    action: 'edit',
  },
  'appointments:delete': {
    id: 'appointments:delete',
    name: 'Delete Appointments',
    description: 'Cancel or delete appointments',
    category: 'appointments',
    resource: 'appointments',
    action: 'delete',
  },
  'appointments:manage': {
    id: 'appointments:manage',
    name: 'Manage Appointments',
    description: 'Full appointment management',
    category: 'appointments',
    resource: 'appointments',
    action: 'manage',
  },

  // CRM Management
  'crm:view': {
    id: 'crm:view',
    name: 'View CRM',
    description: 'Access CRM dashboard',
    category: 'crm',
    resource: 'crm',
    action: 'view',
  },
  'crm:leads': {
    id: 'crm:leads',
    name: 'Manage Leads',
    description: 'Manage customer leads',
    category: 'crm',
    resource: 'leads',
    action: 'manage',
  },
  'crm:contacts': {
    id: 'crm:contacts',
    name: 'Manage Contacts',
    description: 'Manage customer contacts',
    category: 'crm',
    resource: 'contacts',
    action: 'manage',
  },
  'crm:deals': {
    id: 'crm:deals',
    name: 'Manage Deals',
    description: 'Manage sales deals',
    category: 'crm',
    resource: 'deals',
    action: 'manage',
  },
  'crm:activities': {
    id: 'crm:activities',
    name: 'Manage Activities',
    description: 'Manage CRM activities',
    category: 'crm',
    resource: 'activities',
    action: 'manage',
  },

  // Chatbot & AI
  'chatbot:view': {
    id: 'chatbot:view',
    name: 'View Chatbot',
    description: 'Access chatbot management',
    category: 'chatbot',
    resource: 'chatbot',
    action: 'view',
  },
  'chatbot:flows': {
    id: 'chatbot:flows',
    name: 'Manage Flows',
    description: 'Create and edit chatbot flows',
    category: 'chatbot',
    resource: 'flows',
    action: 'manage',
  },
  'chatbot:templates': {
    id: 'chatbot:templates',
    name: 'Manage Templates',
    description: 'Manage chatbot templates',
    category: 'chatbot',
    resource: 'templates',
    action: 'manage',
  },
  'chatbot:analytics': {
    id: 'chatbot:analytics',
    name: 'View Analytics',
    description: 'View chatbot analytics',
    category: 'chatbot',
    resource: 'analytics',
    action: 'view',
  },
  'chatbot:integrations': {
    id: 'chatbot:integrations',
    name: 'Manage Integrations',
    description: 'Manage chatbot integrations',
    category: 'chatbot',
    resource: 'integrations',
    action: 'manage',
  },

  // Conversations
  'conversations:view': {
    id: 'conversations:view',
    name: 'View Conversations',
    description: 'View conversation history',
    category: 'conversations',
    resource: 'conversations',
    action: 'view',
  },
  'conversations:manage': {
    id: 'conversations:manage',
    name: 'Manage Conversations',
    description: 'Manage conversation flows',
    category: 'conversations',
    resource: 'conversations',
    action: 'manage',
  },

  // Payments & Billing
  'payments:view': {
    id: 'payments:view',
    name: 'View Payments',
    description: 'View payment information',
    category: 'payments',
    resource: 'payments',
    action: 'view',
  },
  'payments:manage': {
    id: 'payments:manage',
    name: 'Manage Payments',
    description: 'Process and manage payments',
    category: 'payments',
    resource: 'payments',
    action: 'manage',
  },
  'payments:invoices': {
    id: 'payments:invoices',
    name: 'Manage Invoices',
    description: 'Create and manage invoices',
    category: 'payments',
    resource: 'invoices',
    action: 'manage',
  },

  // Settings & Configuration
  'settings:view': {
    id: 'settings:view',
    name: 'View Settings',
    description: 'View system settings',
    category: 'settings',
    resource: 'settings',
    action: 'view',
  },
  'settings:edit': {
    id: 'settings:edit',
    name: 'Edit Settings',
    description: 'Edit system settings',
    category: 'settings',
    resource: 'settings',
    action: 'edit',
  },
  'settings:api_keys': {
    id: 'settings:api_keys',
    name: 'Manage API Keys',
    description: 'Manage API keys and integrations',
    category: 'settings',
    resource: 'api_keys',
    action: 'manage',
  },

  // Security & Audit
  'security:view': {
    id: 'security:view',
    name: 'View Security',
    description: 'Access security dashboard',
    category: 'security',
    resource: 'security',
    action: 'view',
  },
  'security:audit_logs': {
    id: 'security:audit_logs',
    name: 'View Audit Logs',
    description: 'View system audit logs',
    category: 'security',
    resource: 'audit_logs',
    action: 'view',
  },
  'security:logs': {
    id: 'security:logs',
    name: 'View System Logs',
    description: 'View system logs',
    category: 'security',
    resource: 'logs',
    action: 'view',
  },

  // Notifications
  'notifications:view': {
    id: 'notifications:view',
    name: 'View Notifications',
    description: 'View system notifications',
    category: 'notifications',
    resource: 'notifications',
    action: 'view',
  },
  'notifications:manage': {
    id: 'notifications:manage',
    name: 'Manage Notifications',
    description: 'Manage notification settings',
    category: 'notifications',
    resource: 'notifications',
    action: 'manage',
  },

  // Messages
  'messages:view': {
    id: 'messages:view',
    name: 'View Messages',
    description: 'View message center',
    category: 'messages',
    resource: 'messages',
    action: 'view',
  },
  'messages:send': {
    id: 'messages:send',
    name: 'Send Messages',
    description: 'Send messages to users',
    category: 'messages',
    resource: 'messages',
    action: 'send',
  },

  // Integrations
  'integrations:view': {
    id: 'integrations:view',
    name: 'View Integrations',
    description: 'View system integrations',
    category: 'integrations',
    resource: 'integrations',
    action: 'view',
  },
  'integrations:manage': {
    id: 'integrations:manage',
    name: 'Manage Integrations',
    description: 'Manage system integrations',
    category: 'integrations',
    resource: 'integrations',
    action: 'manage',
  },

  // Performance & Monitoring
  'performance:view': {
    id: 'performance:view',
    name: 'View Performance',
    description: 'View system performance metrics',
    category: 'performance',
    resource: 'performance',
    action: 'view',
  },

  // Profile Management
  'profile:view': {
    id: 'profile:view',
    name: 'View Profile',
    description: 'View own profile',
    category: 'profile',
    resource: 'profile',
    action: 'view',
  },
  'profile:edit': {
    id: 'profile:edit',
    name: 'Edit Profile',
    description: 'Edit own profile',
    category: 'profile',
    resource: 'profile',
    action: 'edit',
  },

  // Dynamic Data
  'dynamic_data:view': {
    id: 'dynamic_data:view',
    name: 'View Dynamic Data',
    description: 'View dynamic data management',
    category: 'dynamic_data',
    resource: 'dynamic_data',
    action: 'view',
  },
  'dynamic_data:manage': {
    id: 'dynamic_data:manage',
    name: 'Manage Dynamic Data',
    description: 'Manage dynamic data content',
    category: 'dynamic_data',
    resource: 'dynamic_data',
    action: 'manage',
  },

  // Flow Management
  'flow:view': {
    id: 'flow:view',
    name: 'View Flow',
    description: 'View workflow management',
    category: 'flow',
    resource: 'flow',
    action: 'view',
  },
  'flow:manage': {
    id: 'flow:manage',
    name: 'Manage Flow',
    description: 'Manage workflow processes',
    category: 'flow',
    resource: 'flow',
    action: 'manage',
  },

  // Review & Quality
  'review:view': {
    id: 'review:view',
    name: 'View Reviews',
    description: 'View quality reviews',
    category: 'review',
    resource: 'review',
    action: 'view',
  },
  'review:manage': {
    id: 'review:manage',
    name: 'Manage Reviews',
    description: 'Manage quality reviews',
    category: 'review',
    resource: 'review',
    action: 'manage',
  },

  // Sessions
  'sessions:view': {
    id: 'sessions:view',
    name: 'View Sessions',
    description: 'View therapy sessions',
    category: 'sessions',
    resource: 'sessions',
    action: 'view',
  },
  'sessions:manage': {
    id: 'sessions:manage',
    name: 'Manage Sessions',
    description: 'Manage therapy sessions',
    category: 'sessions',
    resource: 'sessions',
    action: 'manage',
  },
  'sessions:notes': {
    id: 'sessions:notes',
    name: 'Manage Session Notes',
    description: 'Create and edit session notes',
    category: 'sessions',
    resource: 'session_notes',
    action: 'manage',
  },
} as const;
*/

// ROLES removed - now managed in Database
// Use PermissionManager.getRolePermissions(roleId) to get permissions from Database
// All roles and their permissions are now stored in the database:
// - roles table: role definitions
// - role_permissions table: role-to-permission mappings
// - permissions table: permission definitions

// Permission checking utilities
export class PermissionManager {
  // Cache for role permissions (5 minutes TTL)
  private static rolePermissionsCache = new Map<
    string,
    { permissions: string[]; timestamp: number }
  >();
  private static CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  static hasPermission(userPermissions: string[], permission: string): boolean {
    return (
      userPermissions.includes(permission) || userPermissions.includes('*')
    );
  }

  static hasAnyPermission(
    userPermissions: string[],
    permissions: string[]
  ): boolean {
    return permissions.some(permission =>
      this.hasPermission(userPermissions, permission)
    );
  }

  static hasAllPermissions(
    userPermissions: string[],
    permissions: string[]
  ): boolean {
    return permissions.every(permission =>
      this.hasPermission(userPermissions, permission)
    );
  }

  /**
   * Get role permissions from Database
   * Admin role automatically gets all permissions (wildcard *)
   */
  static async getRolePermissions(roleId: string): Promise<string[]> {
    // Check cache first
    const cached = this.rolePermissionsCache.get(roleId);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.permissions;
    }

    try {
      const { createClient } = await import('@/lib/supabase/server');
      const supabase = await createClient();

      // Admin role gets all permissions (wildcard)
      if (roleId === 'admin') {
        const permissions = ['*'];
        this.rolePermissionsCache.set(roleId, {
          permissions,
          timestamp: Date.now(),
        });
        return permissions;
      }

      // Get role ID from database
      const { data: roleData } = await supabase
        .from('roles')
        .select('id')
        .eq('name', roleId)
        .maybeSingle();

      if (!roleData) {
        // Role not found - return empty array
        this.rolePermissionsCache.set(roleId, {
          permissions: [],
          timestamp: Date.now(),
        });
        return [];
      }

      // Get permissions for this role
      const { data: permissionsData, error: permError } = await supabase
        .from('role_permissions')
        .select('permission_id, permissions!inner(code)')
        .eq('role_id', roleData.id)
        .eq('is_active', true);

      if (permError) {
        logger.error(
          `[PermissionManager] Error fetching permissions:`,
          permError
        );
        return [];
      }

      const permissions: string[] =
        permissionsData
          ?.map((rp: any) => rp.permissions?.code)
          .filter((code: string) => code) || [];

      // Cache the result
      this.rolePermissionsCache.set(roleId, {
        permissions,
        timestamp: Date.now(),
      });

      return permissions;
    } catch (error) {
      logger.error(
        `[PermissionManager] Error fetching permissions for role ${roleId}:`,
        error
      );
      // Fallback: return empty array on error
      return [];
    }
  }

  /**
   * Synchronous version for backward compatibility
   * Returns empty array - use async version for database queries
   */
  static getRolePermissionsSync(roleId: string): string[] {
    // Admin always has wildcard
    if (roleId === 'admin') {
      return ['*'];
    }
    // For other roles, return empty and let async version handle it
    const cached = this.rolePermissionsCache.get(roleId);
    return cached?.permissions || [];
  }

  static async getUserPermissions(
    userRole: string,
    customPermissions: string[] = []
  ): Promise<string[]> {
    const rolePermissions = await this.getRolePermissions(userRole);
    return [...rolePermissions, ...customPermissions];
  }

  /**
   * Synchronous version for backward compatibility
   */
  static getUserPermissionsSync(
    userRole: string,
    customPermissions: string[] = []
  ): string[] {
    const rolePermissions = this.getRolePermissionsSync(userRole);
    return [...rolePermissions, ...customPermissions];
  }

  static canAccess(
    userPermissions: string[],
    resource: string,
    action: string
  ): boolean {
    const permission = `${resource}:${action}`;
    return this.hasPermission(userPermissions, permission);
  }

  static getAccessibleResources(userPermissions: string[]): string[] {
    const resources = new Set<string>();
    userPermissions.forEach(permission => {
      const [resource] = permission.split(':');
      if (resource) {
        resources.add(resource);
      }
    });
    return Array.from(resources);
  }

  static getPermissionsByCategory(
    userPermissions: string[],
    category: string
  ): string[] {
    return userPermissions.filter(permission => {
      const permissionObj = Object.values(PERMISSIONS as Record<string, any>).find(
        (p: any) => p.id === permission
      );
      return permissionObj?.category === category;
    });
  }
}

// Export types
export type PermissionId = keyof typeof PERMISSIONS;
// RoleId is now a string - roles are managed in Database
export type RoleId = string;
